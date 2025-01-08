import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivityService } from 'app/activity/services/activity-service';
import { CommentDto } from 'app/common/models/comment-dto';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DamService } from 'app/dam/services/dam.service';

declare var $: any;

@Component({
  selector: 'app-content-status-history-modal-popup',
  templateUrl: './content-status-history-modal-popup.component.html',
  styleUrls: ['./content-status-history-modal-popup.component.css'],
  providers: [DamService, HttpRequestLoader, Properties, ActivityService]
})
export class ContentStatusHistoryModalPopupComponent implements OnInit {

  @Input() moduleType: string;
  @Input() entityId:number = 0;
  @Input() createdByAnyAdmin: boolean = false;
  @Input() title: string = "";
  @Input() createdById: number;
  @Input() createdByName: string;
  @Input() videoId: number;
  @Output() closeModalPopup = new EventEmitter();
  @Output() closeModalPopupAndRefresh = new EventEmitter();

  commentModalPopUpLoader:boolean = false;
  commentDto:CommentDto = new CommentDto();
  commentsModalPopUpId = "commentsModalPopUp";
  historyModalPopUpId = "historyModalPopUp";
  userDetailsDto:any;
  status:string="";
  canUpdateStatus = false
  templateStatusArray = ['CREATED','APPROVED','REJECTED'];
  historyPopUpLoader:boolean = false;
  statusTimeLineHistory: any;
  comments: any;
  commentsCustomResponse: CustomResponse = new CustomResponse();
  timelineCustomResponse: CustomResponse = new CustomResponse();
  loggedInUserId:number = 0;
  isStatusUpdated = false;  
  showStatusBanner: boolean = false;
  highlightLetter: string = "!";
  imageSourcePath: string = "";
  showImageTag: boolean = false;
  timelineHistoryNotAvailable: boolean = false;
  reloadAfterClose: boolean =  false;
  approvalStatus = {
		APPROVED: 'APPROVED',
		REJECTED: 'REJECTED',
		CREATED: 'CREATED',
    COMMENTED: 'COMMENTED',
		UPDATED: 'UPDATED'
	};

  constructor( private referenceService: ReferenceService,
      public authenticationService: AuthenticationService,
      private damService: DamService,
      public httpRequestLoader: HttpRequestLoader,
      public properties: Properties,
      public activityService:ActivityService
    ) {
      this.loggedInUserId = this.authenticationService.getUserId();
     }

  ngOnInit() {
    this.showStatusBanner = true;
    this. loadUserDeailsWithCurrentStatus();
    this.referenceService.showModalPopup(this.commentsModalPopUpId);
    this.fetchLogoFromExternalSource();
    this.setHighlightLetter();
  }

  loadUserDeailsWithCurrentStatus() {
    this.commentModalPopUpLoader = true;
    this.damService.loadUserDetailsWithApprovalStatus(this.entityId, this.moduleType).subscribe( 
      (response: any) =>{
        this.commentModalPopUpLoader = false;
        if(response && response.data) {
          this.userDetailsDto = response.data;
          this.commentDto.statusInString  = this.userDetailsDto.status;
          this.status = this.commentDto.statusInString;
          if(this.commentDto.statusInString != this.templateStatusArray[0] && this.templateStatusArray.length == 3){
            this.templateStatusArray.shift();
          }
          if(this.commentDto.createdBy != this.loggedInUserId && this.authenticationService.module.isAdmin &&
            this.commentDto.statusInString != 'OWN') {
            this.canUpdateStatus = true;
          }
        }
      },error=>{
        this.commentModalPopUpLoader = false;
        this.closeModalPopUp();
        this.commentsCustomResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      },()=>{
        this.findComments();
      });
  }

  openTemplateStatusHistoryPopUp(){
    this.referenceService.showModalPopup(this.historyModalPopUpId);
    this.refreshTimeLineHistory();
  }

  refreshTimeLineHistory(){
    this.historyPopUpLoader = true;
    this.damService.loadCommentsAndTimelineHistory(this.entityId, this.moduleType).subscribe( 
      response=>{
        if (response.data && response.data.length > 0) {
          this.statusTimeLineHistory = response.data;
          this.timelineHistoryNotAvailable = false;
        } else {
          this.timelineHistoryNotAvailable = true;
          let message = "Timeline history is not available for this asset."
          if (this.moduleType == 'TRACK') {
            message = "Timeline history is not available for this track."
          } else if (this.moduleType == 'PLAYBOOK') {
            message = "Timeline history is not available for this playbook."
          }
          this.timelineCustomResponse = new CustomResponse('INFO', message, true);
        }        
        this.historyPopUpLoader = false;
      },error=>{
        this.historyPopUpLoader = false;
        this.commentsCustomResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      }
    );
  }
  
  closeHistoryModalPopUp() {
    this.referenceService.closeModalPopup(this.historyModalPopUpId);
  }

  closeModalPopUp() {
    this.referenceService.closeModalPopup(this.commentsModalPopUpId);
    if(this.reloadAfterClose) {
      this.closeModalPopupAndRefresh.emit();
    } else {
      this.closeModalPopup.emit();
    }
    this.reloadAfterClose = false;
  }

  ngOnDestroy(): void {
    this.closeModalPopUp();
  }

  findComments() {
    this.commentModalPopUpLoader = true;
    this.damService.loadCommentsAndTimelineHistory(this.entityId, this.moduleType).subscribe(
        response => {
          this.comments = response.data;
          this.commentModalPopUpLoader = false;
          this.referenceService.scrollToModalPopUpBottomByDivId('comments-modal-body');
          this.referenceService.scrollToModalPopUpBottomByDivId('comments-modal-content');
        }, error => {
          this.commentModalPopUpLoader = false;
          this.commentsCustomResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        }
      );
  }

  validateComment(commentDto:CommentDto) {
    let comment = $.trim(commentDto.comment);
    if(comment!=undefined && comment!="" && comment.length>0){
        this.commentDto.invalidComment = false;
    }else{
        this.commentDto.invalidComment = true;
    }
  }

  save(event:any) {
    this.isStatusUpdated = false;
    this.referenceService.disableButton(event);
    this.commentModalPopUpLoader = true;
    this.commentDto.loggedInUserId = this.loggedInUserId;
    this.commentDto.entityId = this.entityId;
    this.commentDto.createdBy = this.createdById;
    this.commentDto.name = this.title;
    this.commentDto.createdByName = this.createdByName;
    this.commentDto.moduleType = this.moduleType;
    this.commentDto.videoId = this.videoId;
    if (this.status != this.commentDto.statusInString) {
      this.commentDto.statusUpdated = true;
      this.status = this.commentDto.statusInString;
      this.reloadAfterClose = true;
    }
    this.damService.updateApprovalStatusAndSaveComment(this.commentDto).
    subscribe(
      response=>{
        this.commentModalPopUpLoader = false;
        if (response.statusCode === 200 && response.data != undefined) {
          this.isStatusUpdated = response.data;
        } else if (response.statusCode === 401 && response.data != undefined) {
          let message = this.referenceService.iterateNamesAndGetErrorMessage(response);
          this.commentsCustomResponse = new CustomResponse('ERROR', message, true);
        } else if (response.statusCode === 403 && response.message != undefined){
          this.commentsCustomResponse = new CustomResponse('ERROR', response.message, true);
        }
        this.commentDto.comment = "";
        this.commentDto.invalidComment = true;
        this.commentDto.statusUpdated = false;
        this.refreshModalPopUp();
        this.showStatusUpdatedMessage();
      },error=>{
        this.isStatusUpdated = false;
        this.commentModalPopUpLoader = false;
        this.commentDto.statusUpdated = false;
        this.referenceService.enableButton(event);
        this.commentsCustomResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      });
  }

  refreshModalPopUp() {
    this.loadUserDeailsWithCurrentStatus();
  }
  
  fetchLogoFromExternalSource() {
    this.activityService.fetchLogoFromExternalSource(this.createdById).subscribe(
      response => {
        const data = response.data;
        if (response.statusCode == 200 && data != '') {
          this.imageSourcePath = data;
          this.showImageTag = true;
        } else {
          this.showImageTag = false;
        }
      }, error => {
        this.showImageTag = false;
      }
    )
  }

  setHighlightLetter() {
    const name = this.createdByName;
    if (this.referenceService.checkIsValidString(name)) {
      this.highlightLetter = this.referenceService.getFirstLetter(name);
    }
  }

  getApprovalStatusText(status: string): string {
    switch (status) {
      case this.approvalStatus.APPROVED:
        return 'Approved';
      case this.approvalStatus.REJECTED:
        return 'Rejected';
      case this.approvalStatus.CREATED:
        return 'Pending Approval';
      case this.approvalStatus.UPDATED:
        return 'Updated';
      case this.approvalStatus.COMMENTED:
        return 'Commented';
      default:
        return status;
    }
  }

  showStatusUpdatedMessage() {
    setTimeout(() => {
      this.isStatusUpdated = false;
    }, 3000)
  }
  
}
