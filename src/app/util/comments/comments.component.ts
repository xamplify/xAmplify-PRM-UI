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
  commentModalPopUpLoader: HttpRequestLoader = new HttpRequestLoader();
  commentsModalPopUpId = "commentsModalPopUp";
  @Input() moduleType:string = "";
  @Input() id:number = 0;
  @Output() commentsEventEmitter:any;
  companyAndUserAndModuleDetailsDto:any;
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
    alert("Comments Compoennt");
    this.referenceService.showModalPopup(this.commentsModalPopUpId);
    this.referenceService.loading(this.commentModalPopUpLoader,true);
    this.authenticationService.getCompanyAndUserAndModuleDetails(this.moduleType,this.id)
    .subscribe( 
      response=>{
        this.referenceService.loading(this.commentModalPopUpLoader,false);
        this.companyAndUserAndModuleDetailsDto = response.data;
      },error=>{
        this.referenceService.loading(this.commentModalPopUpLoader,false);
      },()=>{

      });
  }

  closeModalPopUp(){
    this.commentsEventEmitter.emit();
    this.referenceService.closeModalPopup(this.commentsModalPopUpId);
  }
}
