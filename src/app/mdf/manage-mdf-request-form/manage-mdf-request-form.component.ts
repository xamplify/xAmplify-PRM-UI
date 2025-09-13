import { Component, OnInit,Input, OnDestroy,EventEmitter,Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Router } from '@angular/router';
import { Properties } from '../../common/models/properties';
import { SubmittedFormData } from '../../forms/models/submitted-form-data';
import { MdfService } from '../services/mdf.service';
import { CustomResponse } from 'app/common/models/custom-response';
import {MdfRequestCommentDto} from '../models/mdf-request-comment-dto';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';

declare var $: any, swal: any;


@Component({
  selector: 'app-manage-mdf-request-form',
  templateUrl: './manage-mdf-request-form.component.html',
  styleUrls: ['./manage-mdf-request-form.component.css','../mdf-html/mdf-html.component.css'],
  providers: [Pagination, HttpRequestLoader,Properties]
})
export class ManageMdfRequestFormComponent implements OnInit,OnDestroy {
   
  loggedInUserId: number = 0;
  pagination:Pagination = new Pagination();
  columns: Array<any> = new Array<any>();
  formDataRows: Array<SubmittedFormData> = new Array<SubmittedFormData>();
  searchKey:string = "";
  @Input() vendorCompanyId:number;
  @Input() partnerView:boolean;
  @Input() partnershipId:number;
  @Input() mdfRequest:boolean = false;
  @Output() mdfRequestFormEventEmitter = new EventEmitter();
  formName: string="";
  statusCode:number = 0; 
  customResponse:CustomResponse = new CustomResponse();
  commentsCustomResponse:CustomResponse = new CustomResponse();
  requestId: number = 0;
  goToChangeRequestPage = false;
  loading =false;
  requestCommentModalPopupLoader = false;
  selectedRequestDetails:Array<any> = new Array<any>();
  mdfRequestCommentDto:MdfRequestCommentDto = new MdfRequestCommentDto();
  comments:Array<any> = new Array<any>();
  invalidComment: boolean;
  loggedInUserCompanyId: any;
  showPartners: boolean;
  selectedFilterIndex = 1;
  constructor(public referenceService: ReferenceService, private route: ActivatedRoute,
    public authenticationService: AuthenticationService,private mdfService:MdfService,
    public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService, public router: Router,
    public logger: XtremandLogger,public properties:Properties) { }

  ngOnInit() {
    this.loading = true;
    this.referenceService.loading( this.httpRequestLoader, true );
    this.customResponse = new CustomResponse();
    this.loggedInUserId = this.authenticationService.getUserId();
    this.getCompanyId();
  }
    ngOnDestroy(): void {
        this.hideRequestCommentModalPopup();
    }

  getCompanyId() {
    if (this.loggedInUserId != undefined && this.loggedInUserId > 0) {
      this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
        (result: any) => {
          if (result !== "") {
            this.loggedInUserCompanyId = result;
          } else {
            this.stopLoaders();
            this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
            this.router.navigate(["/home/dashboard"]);
          }
        }, (error: any) => {
          this.stopLoaders();
          this.logger.log(error);
          this.logger.errorPage(error);
        },
        () => {
          if (this.loggedInUserCompanyId != undefined && this.loggedInUserCompanyId > 0) {
            this.pagination.userId = this.loggedInUserId;
            this.pagination.vendorCompanyId = this.vendorCompanyId;
            this.pagination.partnerView = this.partnerView;
            if(this.partnershipId!=undefined && this.partnershipId>0){
                this.pagination.partnershipId = this.partnershipId;
            }
            let partnerFilter = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.filterPartners);
            if(this.mdfRequest != undefined && this.mdfRequest)  {
            if (partnerFilter != null && (partnerFilter === false || partnerFilter === 'false')) {
                  this.pagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex == 0;
              } else {
                  this.pagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex == 1;
              }
            }
            this.listSubmittedData(this.pagination);
          }
        }
      );
    } else {
      this.stopLoaders();
      this.referenceService.showSweetAlertErrorMessage('UserId Not Found.Please try aftersometime');
      this.router.navigate(["/home/dashboard"]);
    }

  }

  listSubmittedData( pagination: Pagination ) {
	this.referenceService.goToTop();
    pagination.searchKey = this.searchKey;
    this.loading = true;
    this.referenceService.loading( this.httpRequestLoader, true );
    this.mdfService.getMdfFormAnalytics( pagination).subscribe(
        ( response: any ) => {
            this.statusCode = response.statusCode;
            if(response.statusCode==200){
                const data = response.data;
                this.columns = data.columns;
                this.formDataRows = data.submittedData;
                this.formName = data.formName;
                pagination.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.formDataRows );
            }else{
                this.customResponse = new CustomResponse('ERROR','Default MDF Form Not Found',true);
            }
            this.referenceService.loading( this.httpRequestLoader, false );
            this.loading = false;
        },
        ( error: any ) => { this.logger.errorPage( error ); } );
}
search() {
    this.pagination.pageIndex = 1;
    this.listSubmittedData( this.pagination );
}


eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.search(); } }

refreshList() {
    this.pagination.searchKey = "";
    this.listSubmittedData( this.pagination );
}
/************Page************** */
setPage( event: any ) {
    this.pagination.pageIndex = event.page;
    this.listSubmittedData( this.pagination );
}

expandColumns( selectedFormDataRow: any, selectedIndex: number ) {
    $.each( this.formDataRows, function( index, row ) {
        if ( selectedIndex != index ) {
            row.expanded = false;
            $( '#form-data-row-' + index ).css( "background-color", "#fff" );
        }
    } );
    selectedFormDataRow.expanded = !selectedFormDataRow.expanded;
    if ( selectedFormDataRow.expanded ) {
        $( '#form-data-row-' + selectedIndex ).css( "background-color", "#d3d3d357" );
    } else {
        $( '#form-data-row-' + selectedIndex ).css( "background-color", "#fff" );
    }

}

changeRequest(formData:any){
    let values = formData['values'];
    let requestId = parseInt(values[5]);
    if(requestId>0){
        this.referenceService.goToRouter("/home/mdf/change-request/"+requestId);
    }else{
        this.referenceService.showSweetAlertErrorMessage("Request Id Not Found");
    }
}


goToTimeLine(formData:any){
    this.loading = true;
    let values = formData['values'];
    let requestId = parseInt(values[5]);
    if(requestId>0){
        if(this.partnerView){
            this.referenceService.goToRouter("/home/mdf/timeline/p/"+requestId);
        }else{
            this.referenceService.goToRouter("/home/mdf/timeline/v/"+requestId);
        }
    }else{
        this.referenceService.showSweetAlertErrorMessage("Request Id Not Found");
    }
}

showRequestCommentPopup(formData:any){
    $('#requestCommentModalPopup').modal('show');
    this.startLoaders();
    let values = formData['values'];
    this.selectedRequestDetails = values;
    this.invalidComment  =true;
    this.listComments();
    
    
}
listComments(){
    let requestId = parseInt(this.selectedRequestDetails[5]);
    this.startLoaders();
    this.mdfService.listComments(requestId).subscribe((result: any) => {
        this.comments = result.data;
        $.each(this.comments,function(_index:number,comment:any){
            comment.displayTime = new Date(comment.commentedOnInUTCString);
        });
        this.stopLoaders();
        this.referenceService.scrollToModalPopUpBottomByDivId("comments-div");
     }, error => {
         this.logger.error(error);
         this.stopLoaders();
         this.referenceService.goToTop();
         this.commentsCustomResponse = new CustomResponse('ERROR',"Unable to show comments.Please try after sometime.",true);
     });
    
}
hideRequestCommentModalPopup(){
    $('#requestCommentModalPopup').modal('hide');
    this.stopLoaders();
    this.selectedRequestDetails = new Array<any>();
}

saveComment(){
    this.startLoaders();
    this.mdfRequestCommentDto.commentedBy = this.loggedInUserId;
    this.mdfRequestCommentDto.requestId = parseInt(this.selectedRequestDetails[5]);
    this.mdfService.saveComment(this.mdfRequestCommentDto).subscribe((result: any) => {
       this.stopLoaders();
       this.invalidComment = true;
       this.mdfRequestCommentDto = new MdfRequestCommentDto();
       this.listComments();
    }, error => {
        this.logger.error(error);
        this.stopLoaders();
        this.referenceService.goToTop();
        this.commentsCustomResponse = new CustomResponse('ERROR',"Unable to save comment.Please try after sometime.",true);
    });
}

validateComment(mdfRequestCommentDto:MdfRequestCommentDto){
    let comment = $.trim(mdfRequestCommentDto['comment']);
    if(comment!=undefined && comment!="" && comment.length>0){
        this.invalidComment = false;
    }else{
        this.invalidComment = true;
    }
}

startLoaders(){
    this.requestCommentModalPopupLoader = true;
    
}

stopLoaders(){
    this.requestCommentModalPopupLoader = false;
    this.mdfRequestCommentDto = new MdfRequestCommentDto();
    this.commentsCustomResponse = new CustomResponse();
}

gotoBottom(){
    $("#comments-div").animate({ scrollTop: $('#comments-div').prop("scrollHeight")}, 1000);
    
}

getSelectedIndex(index:number){
  this.selectedFilterIndex = index;
  this.referenceService.setTeamMemberFilterForPagination(this.pagination,index);
  this.listSubmittedData(this.pagination);
  this.mdfRequestFormEventEmitter.emit(index);
}

}
