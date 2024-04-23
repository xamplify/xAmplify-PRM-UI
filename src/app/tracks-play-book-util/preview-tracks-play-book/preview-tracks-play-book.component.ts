import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TracksPlayBookUtilService } from '../services/tracks-play-book-util.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { TracksPlayBook } from '../models/tracks-play-book'
import { CustomResponse } from '../../common/models/custom-response';
import { ActivityType } from '../models/activity-type.enum';
import { PreviewPopupComponent } from '../../forms/preview-popup/preview-popup.component'
import { DamService } from '../../dam/services/dam.service';
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { TracksPlayBookType } from '../models/tracks-play-book-type.enum';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';

declare var $, swal: any;

@Component({
  selector: 'app-preview-tracks-play-book',
  templateUrl: './preview-tracks-play-book.component.html',
  styleUrls: ['./preview-tracks-play-book.component.css'],
  providers: [HttpRequestLoader, TracksPlayBookUtilService, DamService]
})
export class PreviewTracksPlayBookComponent implements OnInit, OnDestroy {
  createdUserCompanyId: number = 0;
  slug: string = "";
  tracksPlayBook: TracksPlayBook = new TracksPlayBook();
  customResponse: CustomResponse = new CustomResponse();
  loggedInUserId: number = 0;
  assetDetails: any;
  assetViewLoader: boolean = false;
  loggedInUserCompanyId: number = 0;
  @ViewChild('previewPopupComponent') previewPopupComponent: PreviewPopupComponent;
  showFilePreview: boolean = false;
  isImage: boolean = false;
  isAudio: boolean = false;
  isVideo: boolean = false;
  isFile: boolean = false;
  filePath: string = "";
  fileType: string = "";
  modalPopupLoader = false;
  imageTypes: Array<string> = ['jpg', 'jpeg', 'png'];
  fileTypes: Array<string> = ['doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx'];
  url: SafeResourceUrl;
  trackViewLoader: boolean = false;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  modulesDisplayType = new ModulesDisplayType();
  @Input() showTracksPlayBook: boolean;
  @Input() showAsset: boolean;
  @Input() isCreatedUser: boolean;
  @Input() type: string;
  @Output() notifyShowTracksPlayBook: EventEmitter<any>;
  @Output() notifyShowAsset: EventEmitter<any>;
  @Output() notifyCreatedUser: EventEmitter<any>;
  videoFormats: Array<string> = ['webm', 'mkv', 'flv', 'flv', 'vob', 'ogv', 'ogg', 'drc', 'gif', 'gifv', 'mng', 'avi', 'mts', 'm2ts',
    'ts', 'mov', 'qt', 'wmv', 'yuv', 'rm', 'rmvb', 'viv', 'asf', 'amv', 'mp4', 'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'mpg',
    'mpeg', 'm2v', 'm4v', 'svi', '3gp', '3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b'];
  contentIndexInView: number;
  isCurrentQuizSubmitted: boolean = false;
  selectedVideoId = 0;
  videoLoader: boolean;

  constructor(private route: ActivatedRoute, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public tracksPlayBookUtilService: TracksPlayBookUtilService,
    private router: Router, public logger: XtremandLogger,
    private damService: DamService, public sanitizer: DomSanitizer) {
    this.notifyShowTracksPlayBook = new EventEmitter<any>();
    this.notifyShowAsset = new EventEmitter<any>();
    this.notifyCreatedUser = new EventEmitter<any>();
    this.loggedInUserId = this.authenticationService.getUserId();
    this.getCompanyId();
  }

  ngOnInit() {
    this.createdUserCompanyId = parseInt(this.route.snapshot.params['companyId']);
    this.slug = this.route.snapshot.params['slug'];
    this.getBySlug();
    this.setViewType("List");
  }

  ngOnDestroy() {
    $('#asset-preview-modal').modal('hide');
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
            this.notifyCreatedUser.emit(this.isCreatedUser);
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
    //this.referenceService.startLoader(this.httpRequestLoader);
    this.trackViewLoader = true;
    this.tracksPlayBookUtilService.getBySlug(this.createdUserCompanyId, this.slug, this.type).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          let tracksPlayBook: TracksPlayBook = result.data;
          if (tracksPlayBook != undefined) {
            this.tracksPlayBook = tracksPlayBook;
            this.tracksPlayBook.featuredImage = this.tracksPlayBook.featuredImage + "?" + Date.now();
            this.setTrackContentFinishedValue();
          }
          //this.referenceService.stopLoader(this.httpRequestLoader);
          this.trackViewLoader = false;
        } else {
          this.router.navigate(['/home/error/', 403]);
          this.trackViewLoader = false;
        }
      },
      (error: string) => {
        this.referenceService.showServerError(this.httpRequestLoader);
        //this.referenceService.stopLoader(this.httpRequestLoader);
        this.trackViewLoader = false;
      });
  }

  updatePartnerProgress(progress: TracksPlayBook) {
    progress.userId = this.loggedInUserId;
    progress.id = this.tracksPlayBook.id;
    progress.type = this.type;
    if (!this.isCreatedUser) {
      this.assetViewLoader = true;
      this.tracksPlayBookUtilService.updatePartnerProgress(progress).subscribe(
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
    let object: TracksPlayBook = new TracksPlayBook();
    object.userId = this.loggedInUserId;
    object.contentId = assetDetails.id;
    object.id = this.tracksPlayBook.id;
    let url = this.authenticationService.REST_URL + "lms" + "/download/pdf?access_token=" + this.authenticationService.access_token;
    this.referenceService.post(object, url);
  }

  viewContent(asset: any, index: number) {
   this.assetViewLoader = true; 
   this.isVideo = false;
   this.selectedVideoId = 0;
   setTimeout(() => {
    this.isVideo = asset.dam!=undefined && asset.dam.assetType == 'mp4';
    if (!asset.typeQuizId) {
      this.contentIndexInView = index;
      this.showTracksPlayBook = false;
      this.notifyShowTracksPlayBook.emit(this.showTracksPlayBook);
      this.assetDetails = asset.dam;
      this.showAsset = true;
      this.notifyShowAsset.emit(this.showAsset);
      this.referenceService.goToTop();
      this.setProgressAndUpdate(asset.id, ActivityType.OPENED, false);
    } else if (asset.typeQuizId) {
      this.viewQuiz(asset);
    }
    if(this.isVideo){
      this.selectedVideoId = this.assetDetails.videoId;
      this.assetPreview(this.assetDetails);
      this.videoLoader = false;
    }
    this.assetViewLoader = false; 

   }, 300);
  }

  viewQuiz(asset: any) {
    let quiz = asset.quiz;
    if (!this.isCreatedUser) {
      this.isCurrentQuizSubmitted = asset.finished;
      this.showTracksPlayBook = false;
      this.notifyShowTracksPlayBook.emit(this.showTracksPlayBook);
      this.showAsset = false;
      this.notifyShowAsset.emit(this.showAsset);
      this.authenticationService.formAlias = quiz.alias;
      this.referenceService.goToTop();
      this.customResponse = new CustomResponse();
    } else {
      this.previewPopupComponent.previewForm(quiz.id)
    }
  }

  closeView(customResponse: CustomResponse) {
    this.contentIndexInView = null;
    this.showTracksPlayBook = true;
    this.notifyShowTracksPlayBook.emit(this.showTracksPlayBook);
    this.showAsset = false;
    this.notifyShowAsset.emit(this.showAsset);
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
      if(this.authenticationService.isLocalHost()){
        this.referenceService.previewAssetPdfInNewTab(assetDetails.id);
      }else{
        this.previewBeeTemplate(assetDetails);
      }
    }else if(assetDetails.assetType != 'mp4') {
      let assetType = assetDetails.assetType;
      this.filePath = assetDetails.assetPath;
      if (assetType == 'mp3') {
        this.showFilePreview = true;
        this.fileType = "audio/mpeg";
        this.isAudio = true;
      }  else if (this.imageTypes.includes(assetType)) {
        this.showFilePreview = true;
        this.isImage = true;
      } else if (this.fileTypes.includes(assetType)) {
        this.showFilePreview = true;
        this.isFile = true;
        this.filePath = "https://view.officeapps.live.com/op/embed.aspx?src=" + assetDetails.assetPath + "&embedded=true";
        this.transformUrl();
      } else {
        window.open(assetDetails.assetPath, '_blank');
      }
    }
    this.setProgressAndUpdate(assetDetails.id, ActivityType.VIEWED, false);
  }

  closeAssetPreview() {
    this.showFilePreview = false;
    this.isImage = false;
    this.isAudio = false;
    this.isVideo = false;
    this.isFile = false;
    this.filePath = "";
  }

  downloadAsset(assetDetails: any) {
      if (!assetDetails.beeTemplate && assetDetails.assetType == 'mp4') {
          let videoUrl = assetDetails.assetPath + '?access_token=' + this.authenticationService.access_token;
          window.open(assetDetails.assetPath, '_blank');
          this.setProgressAndUpdate(assetDetails.id, ActivityType.DOWNLOADED, false)
      } else if (!assetDetails.beeTemplate) {
          window.open(assetDetails.assetPath, '_blank');
          this.setProgressAndUpdate(assetDetails.id, ActivityType.DOWNLOADED, false)
      } else {
          this.downloadBeeTemplate(assetDetails);
    }
  }

  setProgressAndUpdate(id: number, status: ActivityType, typeQuizId: boolean) {
    let progress: TracksPlayBook = new TracksPlayBook();
    progress.contentId = id;
    progress.status = status;
    progress.typeQuizId = typeQuizId;
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

  saveAsPlayBook(playBookAccess:boolean){
    if(playBookAccess){
      this.referenceService.startLoader(this.httpRequestLoader);
      let self = this;
      let tracksPlayBook: TracksPlayBook = new TracksPlayBook();
      tracksPlayBook.id = this.tracksPlayBook.id;
      tracksPlayBook.userId = this.loggedInUserId;
      tracksPlayBook.type = this.type;
      this.tracksPlayBookUtilService.saveAsPlayBook(tracksPlayBook).subscribe(
        (response: any) => {
          if (response.statusCode == 200) {
            self.customResponse = new CustomResponse('SUCCESS', "Saved to play books successfully.", true);
            this.referenceService.stopLoader(this.httpRequestLoader);
          } else {
            swal("Please Contact Admin!", response.message, "error");
            this.referenceService.stopLoader(this.httpRequestLoader);
          }
        },
        (error: string) => {
          this.logger.errorPage(error);
          this.referenceService.showServerError(this.httpRequestLoader);
          this.referenceService.stopLoader(this.httpRequestLoader);
        });
    }
  }

  setViewType(viewType: string) {
    if ("List" == viewType) {
      this.modulesDisplayType.isListView = true;
      this.modulesDisplayType.isGridView = false;
    } else if ("Grid" == viewType) {
      this.modulesDisplayType.isListView = false;
      this.modulesDisplayType.isGridView = true;
    }
  }

  setTrackContentFinishedValue() {
    let self = this;
    if (this.tracksPlayBook.followAssetSequence) {
      $.each(this.tracksPlayBook.contents, function (index: number, content: any) {
        console.log(index);
        let contentSubList = self.tracksPlayBook.contents.slice(0, index);
        if (contentSubList !== undefined && contentSubList.length > 0) {
          content.previousContentFinished = !(contentSubList.filter(x => !x.finished).findIndex(x => x) > -1);
        } else {
          content.previousContentFinished = true;
        }
      });
    }
  }

  xamplifyVideoPlayerReceiver(event:any){
    this.closeVideoPlayer();
  }

  closeVideoPlayer(){
    this.isVideo = false;
    if(this.selectedVideoId>0){
      $('#asset-preview-'+this.selectedVideoId).show(600);
    }
    this.selectedVideoId = 0;
  }

}
