import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { MdfService } from '../services/mdf.service';
import {MdfRequestDto} from '../models/mdf-request-dto';
import { ReferenceService } from "app/core/services/reference.service";
import { AuthenticationService } from '../../core/services/authentication.service';
import {MdfRequestTimeLine} from '../models/mdf-request-time-line';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
declare var $:any;
@Component({
  selector: 'app-mdf-request-timeline',
  templateUrl: './mdf-request-timeline.component.html',
  styleUrls: ['./mdf-request-timeline.component.css','../mdf-html/mdf-html.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties]
})
export class MdfRequestTimelineComponent implements OnInit {
  requestId:number = 0;
  role:string = "";
  loading = false;
  loggedInUserId: number=0;
  loggedInUserCompanyId: number=0;
  mdfRequest:MdfRequestDto = new MdfRequestDto();
  documentsTitle:string = "";
  partnerView = false;
  timeLineLoader = false;
  headerLoader = false;
  mdfRequestTimeLineHistory:Array<MdfRequestTimeLine> = new Array<MdfRequestTimeLine>();
  formData: any = new FormData();
  description:string = "";
  modalPopupLoader: boolean;
  customResponse:CustomResponse = new CustomResponse();
  pagination:Pagination = new Pagination();
  changeRequest:string = "";
  initLoader = false;
  constructor(public documentListLoader: HttpRequestLoader,private pagerService:PagerService,private mdfService: MdfService,private route: ActivatedRoute,public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router,public properties:Properties) { 
	    this.loggedInUserId = this.authenticationService.getUserId();
}

  ngOnInit() {
    this.initLoader = true;
    this.startLoaders();
    this.requestId = parseInt(this.route.snapshot.params['requestId']);
    this.role = this.route.snapshot.params['role'];
    this.changeRequest = this.route.snapshot.params['changeRequest'];
    this.partnerView = "p"==this.role;
    if("v"==this.role || "p"==this.role){
      if(this.partnerView){
        this.documentsTitle = "Upload Documents";
      }else{
        this.documentsTitle = "Download Documents";
      }
      this.pagination.categoryId = this.requestId;
      this.getCompanyId();
    }else{
      this.router.navigate(["/home/dashboard"]);
    }
  }

  getCompanyId() {
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        if (result !== "") { 
          this.loggedInUserCompanyId = result;
        }else{
         this.stopLoaders();
          this.referenceService.showSweetAlertErrorMessage('Company Id Not Found');
          this.router.navigate(["/home/dashboard"]);
        }
      }, (error: any) => {
         this.xtremandLogger.log(error);
         this.xtremandLogger.errorPage(error);
         },
      () => {
        if(this.loggedInUserCompanyId!=undefined && this.loggedInUserCompanyId>0){
          this.getMdfRequestDetails();
          this.listDocuments(this.pagination);
        }
      }
    );
  }    

  getMdfRequestDetails(){
    if(this.requestId>0){
      this.mdfService.getRequestDetailsAndTimeLineHistory(this.requestId,this.loggedInUserCompanyId).
      subscribe((result: any) => {
        if(result.statusCode==200){
          this.mdfRequest = result.map.requestDetails;
          this.mdfRequestTimeLineHistory = result.map.requestHistory;
          $.each(this.mdfRequestTimeLineHistory,function(_index,mdfRequestTimeLine:MdfRequestTimeLine){
            mdfRequestTimeLine.displayTime = new Date(mdfRequestTimeLine.createdTimeInUTCString);
          });
          this.stopLoaders();
        }else if(result.statusCode==404){
          this.referenceService.goToPageNotFound();
        }
      }, error => {
        this.xtremandLogger.log(error);
        this.xtremandLogger.errorPage(error);
      });
    }else{
      this.referenceService.showSweetAlertErrorMessage("Request Id Not Found");
    }
  }

  goBack(){
    this.startLoaders();
    if("v"==this.role){
      if(this.changeRequest=="c"){
        this.referenceService.goToRouter("/home/mdf/change-request/"+this.requestId);
      }else{
        this.referenceService.goToRouter("/home/mdf/requests");
      }
    }else if("p"==this.role){
      this.referenceService.goToRouter("/home/mdf/requests/p");
    }

  }
  refreshHistory(){
    this.startLoaders();
    this.getMdfRequestDetails();
    this.pagination.pageIndex = 1;
    this.listDocuments(this.pagination);
  }

  startLoaders(){
    this.loading = true;
    this.timeLineLoader = true;
    this.headerLoader = true;
  }

  stopLoaders(){
    this.loading = false;
    this.timeLineLoader = false;
    this.headerLoader = false;
    this.initLoader = false;
  }

  listDocuments(pagination: Pagination) {
    this.loading = true;
    this.referenceService.loading(this.documentListLoader, true);
    this.mdfService.listMdfRequestDocuments(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let data = result.data;
        pagination.totalRecords = data.totalRecords;
        $.each(data.documents, function (_index:number, document:any) {
          document.displayTime = new Date(document.uploadedTimeInUTCString);
      });
        pagination = this.pagerService.getPagedItems(pagination, data.documents);
      }
      this.loading = false;
      this.referenceService.loading(this.documentListLoader, false);
    }, error => {
      this.loading = false;
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }
  openMdfDocumentsPopup(){
    $('#uploadMdfDocumentsPopup').modal('show');
  }

  closeMdfDocumentsPopup(){
    $('#uploadMdfDocumentsPopup').modal('hide');
    this.customResponse = new CustomResponse();
    this.formData = new FormData();
    this.description = "";
    this.clearFile();
  }

  onFileChangeEvent(event){
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.formData.append("uploadedFile", file, file['name']);
    } else {
      this.referenceService.showSweetAlertErrorMessage("No File Found")
    }
  }

  uploadMdfDocument(){
    this.customResponse = new CustomResponse();
    let  fileLength = $("#requestDocument")[0].files.length;
    if(fileLength==0){
      this.customResponse = new CustomResponse('ERROR','Please upload file',true);
    }else{
      this.modalPopupLoader = true;
      let mdfRequestUploadDto  = {};
      mdfRequestUploadDto['requestId'] = this.requestId;
      mdfRequestUploadDto['loggedInUserId'] = this.loggedInUserId;
      mdfRequestUploadDto['description'] = this.description;
      this.mdfService.uploadFile(this.formData,mdfRequestUploadDto).subscribe(
        (result: any) => {
          this.clearFile();
          if(result.statusCode==200){
            this.closeMdfDocumentsPopup();
            this.referenceService.showSweetAlertSuccessMessage("Uploaded Successfully");
            this.pagination.pageIndex = 1;
            this.listDocuments(this.pagination);
          }else if(result.statusCode==400){
            this.customResponse = new CustomResponse('ERROR',result.message,true);
          }else if(result.statusCode==404){
            this.referenceService.showSweetAlertErrorMessage("Invalid Request");
          }
        this.modalPopupLoader = false;
        }, error => {
        this.clearFile();
        this.modalPopupLoader = false;
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        this.xtremandLogger.log(error);
        });
    }
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listDocuments(this.pagination);
  }


  clearFile(){
    $('#requestDocument').val('');
	this.formData = new FormData();
  }

  downloadFile(document:any){
    let alias = document.filePathAlias;
    window.open(this.authenticationService.REST_URL+"mdf/download/"+alias+"?access_token="+this.authenticationService.access_token);
  }

}
