import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { LmsService } from '../services/lms.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { LearningTrack } from '../models/learningTrack'
import { CustomResponse } from '../../common/models/custom-response';
import { ActivityType } from '../models/activity-type';
import { PreviewPopupComponent } from '../../forms/preview-popup/preview-popup.component'
import { DamService } from '../../dam/services/dam.service';
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";


declare var $, swal: any;

@Component({
  selector: 'app-preview-lms',
  templateUrl: './preview-lms.component.html',
  styleUrls: ['./preview-lms.component.css'],
  providers: [HttpRequestLoader, LmsService, DamService]
})
export class PreviewLmsComponent implements OnInit {

  createdUserCompanyId: number = 0;
  slug: string = "";
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  learningTrack: LearningTrack = new LearningTrack();
  customResponse: CustomResponse = new CustomResponse();
  showLearningTrack: boolean = true;
  showAsset: boolean = false;
  loggedInUserId: number = 0;
  assetDetails: any;
  assetViewLoader: boolean = false;
  loggedInUserCompanyId: number = 0;
  isCreatedUser: boolean = false;
  @ViewChild('previewPopupComponent') previewPopupComponent: PreviewPopupComponent;
  showFilePreview: boolean = false;
  isImage: boolean = false;
  isAudio: boolean = false;
  isVideo: boolean = false;
  isFile: boolean = false;
  filePath: string = "";
  viewer: string = "google";
  fileType: string = "";
  modalPopupLoader = false;
  imageTypes: Array<string> = ['jpg', 'jpeg', 'png'];
  fileTypes: Array<string> = ['txt', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx'];
  url: SafeResourceUrl;

  constructor(private route: ActivatedRoute, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public lmsService: LmsService,
    private router: Router, public logger: XtremandLogger,
    private damService: DamService, public sanitizer: DomSanitizer) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.getCompanyId();
  }

  ngOnInit() {
    this.createdUserCompanyId = parseInt(this.route.snapshot.params['companyId']);
    this.slug = this.route.snapshot.params['slug'];
    this.getBySlug();
  }

  getCompanyId() {
    this.referenceService.startLoader(this.httpRequestLoader);
    if (this.loggedInUserId != undefined && this.loggedInUserId > 0) {
      this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
        (result: any) => {
          if (result !== "") {
            this.loggedInUserCompanyId = result;
            if (this.createdUserCompanyId == this.loggedInUserCompanyId) {
              this.isCreatedUser = true;
            } else {
              this.isCreatedUser = false;
            }
            this.referenceService.stopLoader(this.httpRequestLoader);
          } else {
            this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
            this.router.navigate(["/home/dashboard"]);
            this.referenceService.stopLoader(this.httpRequestLoader);
          }
        }, (error: any) => {
          this.referenceService.stopLoader(this.httpRequestLoader);
        },
      );
    } else {
      this.referenceService.stopLoader(this.httpRequestLoader);
      this.referenceService.showSweetAlertErrorMessage('UserId Not Found.Please try aftersometime');
      this.router.navigate(["/home/dashboard"]);
    }
  }


  getBySlug() {
    this.referenceService.startLoader(this.httpRequestLoader);
    this.lmsService.getBySlug(this.createdUserCompanyId, this.slug).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          let learningTrack: LearningTrack = result.data;
          if (learningTrack != undefined) {
            this.learningTrack = learningTrack;
          }
          this.referenceService.stopLoader(this.httpRequestLoader);
        }
      },
      (error: string) => {
        this.referenceService.showServerError(this.httpRequestLoader);
        this.referenceService.stopLoader(this.httpRequestLoader);
      });
  }

  updatePartnerProgress(progress: LearningTrack) {
    progress.userId = this.loggedInUserId;
    progress.id = this.learningTrack.id;
    if (!this.isCreatedUser) {
      this.assetViewLoader = true;
      this.lmsService.updatePartnerProgress(progress).subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            this.getBySlug();
            this.logger.info('Finished updatePartnerProgress()');
            this.assetViewLoader = false;
          } else {
            this.assetViewLoader = false;
          }
        },
        (error: string) => {
          this.logger.error(this.referenceService.errorPrepender + " updatePartnerProgress():" + error);
          this.assetViewLoader = false;
        });
    }
  }

  downloadBeeTemplate(assetDetails: any) {
    this.referenceService.startLoader(this.httpRequestLoader);
    let object: LearningTrack = new LearningTrack();
    object.userId = this.loggedInUserId;
    object.contentId = assetDetails.id;
    object.id = this.learningTrack.id;
    this.lmsService.downloadBeeTemplate(object).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.setProgressAndUpdate(assetDetails.id, ActivityType.DOWNLOADED);
          this.logger.info('Finished downloadBeeTemplate()');
        }
        this.referenceService.stopLoader(this.httpRequestLoader);
      },
      (error: string) => {
        this.logger.error(this.referenceService.errorPrepender + " downloadBeeTemplate():" + error);
        this.referenceService.stopLoader(this.httpRequestLoader);
      });
  }


  viewContent(asset: any) {
    this.showLearningTrack = false;
    this.assetDetails = asset;
    this.showAsset = true;
    this.referenceService.goToTop();
    this.setProgressAndUpdate(asset.id, ActivityType.OPENED);
  }

  viewQuiz() {
    if (!this.isCreatedUser) {
      this.showLearningTrack = false;
      this.showAsset = false;
      this.authenticationService.formAlias = this.learningTrack.quiz.alias;
      this.referenceService.goToTop();
      this.customResponse = new CustomResponse();
    } else {
      this.previewPopupComponent.previewForm(this.learningTrack.quiz.id)
    }
  }

  closeView(customResponse: CustomResponse) {
    this.showLearningTrack = true;
    this.showAsset = false;
    this.assetDetails = "";
    this.getBySlug();
    this.addMessage(customResponse);
  }

  addMessage(customResponse: CustomResponse) {
    if (customResponse != undefined) {
      this.customResponse = customResponse;
    } else {
      this.customResponse = new CustomResponse();
    }
  }

  assetPreview(assetDetails: any) {
    if (assetDetails.beeTemplate) {
      this.previewBeeTemplate(assetDetails);
    } else {
      let assetType = assetDetails.assetType;
      this.filePath = assetDetails.assetPath;
      if (assetType == 'mp3') {
        this.showFilePreview = true;
        this.fileType = "audio/mpeg";
        this.isAudio = true;
      } else if (assetType == 'mp4') {
        this.showFilePreview = true;
        this.fileType = "video/mp4";
        this.isVideo = true;
      } else if (this.imageTypes.includes(assetType)) {
        this.showFilePreview = true;
        this.isImage = true;
      } else if (this.fileTypes.includes(assetType)) {
        this.showFilePreview = true;
        this.isFile = true;
        this.filePath = "https://docs.google.com/viewer?src=" + assetDetails.assetPath + "&embedded=true";
        if (assetType == 'xlsx' || assetType == 'xls' || assetType == 'doc' || assetType == 'docx') {
          this.viewer = "office";
          this.filePath = "https://view.officeapps.live.com/op/embed.aspx?src=" + assetDetails.assetPath + "&embedded=true";
        }
        this.transformUrl();
      } else {
        this.referenceService.showSweetAlertErrorMessage('Unsupported file type, Please download the file to view.');
      }
    }
    if (this.showFilePreview || assetDetails.beeTemplate) {
      this.setProgressAndUpdate(assetDetails.id, ActivityType.VIEWED);
    }
  }

  closeAssetPreview() {
    this.showFilePreview = false;
    this.isImage = false;
    this.isAudio = false;
    this.isVideo = false;
    this.isFile = false;
    this.filePath = "";
    this.viewer = "google";
  }

  downloadAsset(assetDetails: any) {
    if (!assetDetails.beeTemplate) {
      window.open(assetDetails.assetPath, '_blank');
      this.setProgressAndUpdate(assetDetails.id, ActivityType.DOWNLOADED)
    } else {
      this.downloadBeeTemplate(assetDetails);
    }
  }

  setProgressAndUpdate(id: number, status: ActivityType) {
    let progress: LearningTrack = new LearningTrack();
    progress.contentId = id;
    progress.status = status;
    this.updatePartnerProgress(progress);
    this.customResponse = new CustomResponse();
  }

  previewBeeTemplate(asset: any) {
    let htmlContent = "#asset-preview-content";
    $(htmlContent).empty();
    $('#assetTitle').val('');
    this.referenceService.setModalPopupProperties();
    $("#asset-preview-modal").modal('show');
    this.modalPopupLoader = true;
    this.damService.previewAssetById(asset.id).subscribe(
      (response: any) => {
        let assetDetails = response.data;
        $(htmlContent).append(assetDetails.htmlBody);
        $('#assetTitle').text(assetDetails.name);
        this.modalPopupLoader = false;
      }, (error: any) => {
        swal("Please Contact Admin!", "Unable to show  preview", "error");
        this.modalPopupLoader = false;
        $("#asset-preview-modal").modal('hide');
      }
    );
  }

  transformUrl() {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.filePath);
  }

}
