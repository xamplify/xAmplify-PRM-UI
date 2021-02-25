import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { LmsService } from '../services/lms.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { LearningTrack } from '../models/learningTrack'
import { DomSanitizer } from "@angular/platform-browser";
import { CustomResponse } from '../../common/models/custom-response';
import { ActivityType } from '../models/activity-type';


declare var $, swal: any;

@Component({
  selector: 'app-preview-lms',
  templateUrl: './preview-lms.component.html',
  styleUrls: ['./preview-lms.component.css'],
  providers: [HttpRequestLoader, LmsService]
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
  takeQuiz: boolean = true;
  loggedInUserCompanyId: number = 0;
  isCreatedUser: boolean = false;

  constructor(private route: ActivatedRoute, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public lmsService: LmsService,
    private router: Router, public sanitizer: DomSanitizer, public logger: XtremandLogger) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.getCompanyId();
    console.log(this.loggedInUserCompanyId)
    console.log(this.createdUserCompanyId)
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
          } else {
            this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
            this.router.navigate(["/home/dashboard"]);
          }
          this.referenceService.stopLoader(this.httpRequestLoader);
        }, (error: any) => {
          this.referenceService.startLoader(this.httpRequestLoader);
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
    this.takeQuiz = true;
    let self = this;
    this.lmsService.getBySlug(this.createdUserCompanyId, this.slug).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          let learningTrack: LearningTrack = result.data;
          if (learningTrack != undefined) {
            this.learningTrack = learningTrack;
            $.each(this.learningTrack.contents, function (index: number, content: any) {
              if (!content.finished) {
                self.takeQuiz = false;
              }
            });
          }
          this.referenceService.stopLoader(this.httpRequestLoader);
        } else {
          swal("Please Contact Admin!", result.message, "error");
          this.referenceService.stopLoader(this.httpRequestLoader);
        }
      },
      (error: string) => {
        this.referenceService.showServerError(this.httpRequestLoader);
        this.referenceService.stopLoader(this.httpRequestLoader);
      });
  }

  updatePartnerProgress(progress: LearningTrack) {
    if (!this.isCreatedUser) {
      this.assetViewLoader = true;
      this.lmsService.updatePartnerProgress(progress).subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            this.logger.info('Finished updatePartnerProgress()');
            this.assetViewLoader = false;
          }
        },
        (error: string) => {
          this.logger.error(this.referenceService.errorPrepender + " updatePartnerProgress():" + error);
          this.assetViewLoader = false;
        });
    }
  }

  viewContent(asset: any) {
    this.showLearningTrack = false;
    this.assetDetails = asset;
    this.showAsset = true;
    this.referenceService.goToTop();
    let progress: LearningTrack = new LearningTrack();
    progress.contentId = asset.id;
    progress.userId = this.loggedInUserId;
    progress.id = this.learningTrack.id;
    progress.status = ActivityType.OPENED;
    this.updatePartnerProgress(progress);
    this.customResponse = new CustomResponse();
  }

  viewQuiz() {
    this.showLearningTrack = false;
    this.showAsset = false;
    this.authenticationService.formAlias = this.learningTrack.quiz.alias;
    this.referenceService.goToTop();
    this.customResponse = new CustomResponse();
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
}
