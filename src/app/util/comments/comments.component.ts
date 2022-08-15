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
  companyAndUserAndModuleDetailsDto:any;
  commentDto:CommentDto = new CommentDto();
  constructor(
    public referenceService: ReferenceService,
    private route: ActivatedRoute,
    public authenticationService: AuthenticationService,
    public httpRequestLoader: HttpRequestLoader,
    public pagerService: PagerService,
    public router: Router,
    public logger: XtremandLogger,
    public properties: Properties
  ) {}
  ngOnDestroy(): void {
    this.closeModalPopUp();
  }

  ngOnInit() {
    this.referenceService.showModalPopup(this.commentsModalPopUpId);
    this.commentModalPopUpLoader = true;
    this.authenticationService.getCompanyAndUserAndModuleDetails(this.moduleType,this.id)
    .subscribe( 
      response=>{
        this.companyAndUserAndModuleDetailsDto = response.data;
        this.commentModalPopUpLoader = false;
      },error=>{
        this.commentModalPopUpLoader = false;
        this.closeModalPopUp();
        this.referenceService.showSweetAlertServerErrorMessage();
      },()=>{
        
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

}
