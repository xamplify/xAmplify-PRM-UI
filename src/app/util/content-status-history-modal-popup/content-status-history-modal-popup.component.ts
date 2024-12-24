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

  @Input() damId:number = 0;
  @Input() createdByAnyAdmin: boolean = false;
  @Input() assetName: string = "";
  @Input() assetCreatedById: number;
  @Input() assetCreatedByFullName: string;
  @Output() closeModalPopup = new EventEmitter();

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
  loggedInUserId:number = 0;
  isStatusUpdated = false;  
  showStatusBanner: boolean = false;
  highlightLetter: string = "!";
  imageSourcePath: string = "";
  showImageTag: boolean = false;

  constructor( private referenceService: ReferenceService,
      private authenticationService: AuthenticationService,
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
    this.damService.loadUserDetailsWithDamApprovalStatus(this.damId).subscribe( 
      (response: any) =>{
        this.commentModalPopUpLoader = false;
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
      },error=>{
        this.commentModalPopUpLoader = false;
        this.closeModalPopUp();
        this.referenceService.showSweetAlertServerErrorMessage();
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
    this.damService.loadDamStatusHistoyTimeline(this.damId).subscribe( 
      response=>{
        this.statusTimeLineHistory = response.data;
        this.historyPopUpLoader = false;
      },error=>{
        this.historyPopUpLoader = false;
        this.referenceService.showSweetAlertErrorMessage("Unable to find history.Please contact admin.");
      }
    );
  }
  
  closeHistoryModalPopUp() {
    this.referenceService.closeModalPopup(this.historyModalPopUpId);
  }

  closeModalPopUp() {
    this.referenceService.closeModalPopup(this.commentsModalPopUpId);
    this.closeModalPopup.emit();
  }

  ngOnDestroy(): void {
    this.closeModalPopUp();
  }

  findComments() {
    this.commentsCustomResponse = new CustomResponse();
    this.commentModalPopUpLoader = true;
    this.damService.loadDamComents(this.damId).subscribe(
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
    this.commentDto.damId = this.damId;
    this.commentDto.createdBy = this.assetCreatedById;
    this.commentDto.assetName = this.assetName;
    this.commentDto.assetCreatedByFullName = this.assetCreatedByFullName;
    if (this.status != this.commentDto.statusInString) {
      this.commentDto.statusUpdated = true;
    }
    this.damService.saveDamComment(this.commentDto).
    subscribe(
      response=>{
        this.commentDto.comment = "";
        this.commentDto.invalidComment = true;
        this.commentModalPopUpLoader = false;
        this.isStatusUpdated = true;
        this.refreshModalPopUp();
      },error=>{
        this.isStatusUpdated = false;
        this.commentModalPopUpLoader = false;
        this.referenceService.enableButton(event);
        this.commentsCustomResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      });
  }

  refreshModalPopUp() {
    this.findComments();
    this.loadUserDeailsWithCurrentStatus();
  }
  
  fetchLogoFromExternalSource() {
    this.activityService.fetchLogoFromExternalSource(this.assetCreatedById).subscribe(
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
    const name = this.assetCreatedByFullName;
    if (this.referenceService.checkIsValidString(name)) {
      this.highlightLetter = this.referenceService.getFirstLetter(name);
    }
  }
  
}
