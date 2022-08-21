import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  EventEmitter,
  Output,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ReferenceService } from "../../core/services/reference.service";
import { AuthenticationService } from "../../core/services/authentication.service";
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { Pagination } from "../../core/models/pagination";
import { PagerService } from "../../core/services/pager.service";
import { HttpRequestLoader } from "../../core/models/http-request-loader";
import { Router } from "@angular/router";
import { Properties } from "../../common/models/properties";
import { CustomResponse } from "app/common/models/custom-response";
import { CommentDto } from "app/common/models/comment-dto";
import { Roles } from './../../core/models/roles';

declare var $: any, swal: any;
@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.css"],
  providers: [Pagination, HttpRequestLoader, Properties],
})
export class CommentsComponent implements OnInit, OnDestroy {
  comments: Array<any> = new Array<any>();
  commentsCustomResponse: CustomResponse = new CustomResponse();
  commentModalPopUpLoader:boolean;
  commentsModalPopUpId = "commentsModalPopUp";
  @Input() moduleType:string = "";
  @Input() id:number = 0;
  @Output() commentsEventEmitter = new EventEmitter();
  @Output()statusUpdatedEventEmitter = new EventEmitter();
  companyAndUserAndModuleDetailsDto:any;
  commentDto:CommentDto = new CommentDto();
  loggedInUserId = 0;
  templateStatusArray = ['CREATED','APPROVED','REJECTED'];
  isStatusUpdated = false;
  showStatusDropDown = false;
  roles:Roles = new Roles();
  constructor(
    public referenceService: ReferenceService,
    private route: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public httpRequestLoader: HttpRequestLoader,
    public pagerService: PagerService,
    public router: Router,
    public logger: XtremandLogger,
    public properties: Properties
  ) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }
  ngOnDestroy(): void {
    this.closeModalPopUp();
  }

  ngOnInit() {
    this.loadComments();
  }

  loadComments(){
    this.commentModalPopUpLoader = true;
    this.commentDto.id = this.id;
    this.commentDto.moduleType = this.moduleType;
    this.referenceService.showModalPopup(this.commentsModalPopUpId);
    this.authenticationService.getCompanyAndUserAndModuleDetails(this.moduleType,this.id)
    .subscribe( 
      response=>{
        this.companyAndUserAndModuleDetailsDto = response.data;
        this.commentDto.statusInString  = this.companyAndUserAndModuleDetailsDto.status;
        if(this.commentDto.statusInString!=this.templateStatusArray[0] && this.templateStatusArray.length==3){
          this.templateStatusArray.shift();
        }
        this.commentModalPopUpLoader = false;
      },error=>{
        this.commentModalPopUpLoader = false;
        this.closeModalPopUp();
        this.referenceService.showSweetAlertServerErrorMessage();
      },()=>{
        this.findComments();
      });
  }

  closeModalPopUp(){
    this.referenceService.closeModalPopup(this.commentsModalPopUpId);
    this.commentsEventEmitter.emit();
  }

  validateComment(commentDto:CommentDto){
    let comment = $.trim(commentDto.comment);
    if(comment!=undefined && comment!="" && comment.length>0){
        this.commentDto.invalidComment = false;
    }else{
        this.commentDto.invalidComment = true;
    }
}

save(event:any){
  this.isStatusUpdated = false;
  this.referenceService.disableButton(event);
  this.commentModalPopUpLoader = true;
  this.authenticationService.saveComment(this.commentDto).
  subscribe(
    response=>{
      this.commentDto.comment = "";
      this.commentDto.invalidComment = true;
      if(response.statusCode==201){
        this.referenceService.scrollSmoothToTop();
        this.isStatusUpdated = true;
        this.commentsCustomResponse = new CustomResponse('SUCCESS',"Status updated successfully",true);
        this.statusUpdatedEventEmitter.emit();
      }
      this.loadComments();
    },error=>{
      this.isStatusUpdated = false;
      this.commentModalPopUpLoader = false;
      this.referenceService.enableButton(event);
      this.commentsCustomResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
    });
}

findComments(){
  this.commentsCustomResponse = new CustomResponse();
  this.commentModalPopUpLoader = true;
  this.authenticationService.findComments(this.commentDto.moduleType,this.commentDto.id).
  subscribe(
    response=>{
      this.comments = response.data;
      this.commentModalPopUpLoader = false;
      this.referenceService.scrollToModalPopUpBottomByDivId('comments-modal-body');
      this.referenceService.scrollToModalPopUpBottomByDivId('comments-modal-content');
    },error=>{
      this.commentModalPopUpLoader = false;
      this.commentsCustomResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
    }
  );
}

openTemplateStatusHistoryPopUp(agencyEmailTemplateId:number){
  this.authenticationService.findHistory(agencyEmailTemplateId,this.roles.emailTemplateId).subscribe(
    response=>{
      alert(response.statusCode);
    },error=>{
        this.referenceService.showSweetAlertErrorMessage("Unable to find history.Please contact admin.");
    }
  );
}

}
