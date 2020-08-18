import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { MdfService } from '../services/mdf.service';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { MdfRequest } from '../models/mdf.request';

declare var $: any;
@Component({
  selector: 'app-edit-mdit-request',
  templateUrl: './edit-mdit-request.component.html',
  styleUrls: ['./edit-mdit-request.component.css','../html-sample/html-sample.component.css'],
  providers: [HttpRequestLoader, SortOption,Properties]
})
export class EditMditRequestComponent implements OnInit {
  loading = false;
  pageLoader = false;
  loggedInUserId: number=0;
  loggedInUserCompanyId: number = 0;
  mdfId: number=0;
  rightCornerData : any;
  mdfOwnerDisplayName = "";
  modalPopupLoader = false;
  changeRequestLoader = false;
  customResponse:CustomResponse = new CustomResponse();
  mdfRequest: MdfRequest = new MdfRequest();
  showStausError: boolean;
  availableBalance:any;
  usedBalance:any;
  constructor(private mdfService: MdfService, private pagerService: PagerService,private route: ActivatedRoute,private utilService: UtilService,public sortOption: SortOption,public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router,public properties:Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.loading = true;
    this.pageLoader = true;
    this.mdfId = parseInt(this.route.snapshot.params['mdfId']);
    this.getCompanyId();
  }

  getCompanyId() {
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        if (result !== "") { 
          this.loggedInUserCompanyId = result;
        }else{
          this.loading = false;
          this.referenceService.showSweetAlertErrorMessage('Company Id Not Found');
          this.router.navigate(["/home/dashboard"]);
        }
      }, (error: any) => {
         this.xtremandLogger.log(error);
         this.xtremandLogger.errorPage(error);
         },
      () => {
        if(this.loggedInUserCompanyId!=undefined && this.loggedInUserCompanyId>0){
          this.loadRightSideCornerData();
        }
      }
    );
  }

  loadRightSideCornerData(){
    this.mdfService.getMdfRequestsOwnerAndOtherDetails(this.loggedInUserCompanyId,this.mdfId).
    subscribe((result: any) => {
        this.rightCornerData = result.data;
        if(this.rightCornerData!=undefined){
          let mdfRequestOwner = this.rightCornerData['mdfRequestOwner'];
          let fullName = mdfRequestOwner['fullName'];
          let emailId = mdfRequestOwner['emailId'];
          if(fullName!=null){
            this.mdfOwnerDisplayName = fullName;
          }else{
            this.mdfOwnerDisplayName = emailId;
          }
        }
        let mdfDetails = this.rightCornerData['mdfDetails'];
        this.mdfRequest.id = this.mdfId;
        this.mdfRequest.statusInString = mdfDetails.statusInString;
        this.mdfRequest.mdfRequestAmountInDouble = mdfDetails.mdfRequestAmountInDouble;
        this.mdfRequest.allocationAmount = mdfDetails.allocationAmount;
        this.mdfRequest.currentMdfBalance = this.rightCornerData.partnerMdfBalance.totalMdfAccountBalance;
        if(this.mdfRequest.allocationAmount!=null && this.mdfRequest.allocationAmount>0){
          this.availableBalance =  this.mdfRequest.currentMdfBalance - this.mdfRequest.allocationAmount;
        }else{
          this.availableBalance = this.rightCornerData.partnerMdfBalance.totalAvailableBalance;
        }
        this.mdfRequest.statusCode = mdfDetails.statusCode;
        this.mdfRequest.allocationDateInString = mdfDetails['allocationDateInString'];
        this.mdfRequest.allocationExpirationDateInString = mdfDetails['allocationExpirationDateInString'];
        this.mdfRequest.assignedTo = this.mdfOwnerDisplayName;
        this.mdfRequest.userId = this.loggedInUserId;
        this.mdfRequest.reimburseAmount = mdfDetails['reimburseAmount'];
        this.mdfRequest.description = mdfDetails['description'];
        if(this.mdfRequest.reimburseAmount!=null && this.mdfRequest.reimburseAmount>0){
          this.usedBalance = this.mdfRequest.reimburseAmount;
        }else{
          this.usedBalance = this.rightCornerData.partnerMdfBalance.totalUsedBalance;
        }
        this.loading = false;
        this.pageLoader  = false;
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    },
    () => {
    }
    );
  }

  openForm(){
    $('#changeRequestModal').modal('show');
  }
  closeChangeRequestPopup(){
    $('#changeRequestModal').modal('hide');
    this.customResponse = new CustomResponse();
    this.modalPopupLoader=false;
  }

  updateMdfRequest(){
    this.referenceService.goToTop();
    this.customResponse = new CustomResponse();
    this.modalPopupLoader = true;
    this.mdfService.updateMdfRequestByVendor(this.mdfRequest).subscribe((result: any) => {
      if(result.statusCode==200){
        this.referenceService.showSweetAlertSuccessMessage("Status Changed Successfully");
        this.closeChangeRequestPopup();
        this.loadRightSideCornerData();
      }else if(result.statusCode==400){
        this.modalPopupLoader = false;
        this.customResponse = new CustomResponse('ERROR',result.message,true);
      } else{
        this.modalPopupLoader = false;
      }
    }, error => {
      this.modalPopupLoader = false;
      this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
    });
  }


  goToManageMdfRequests(){
    this.loading = true;
    this.router.navigate(["/home/mdf/requests"]);
  }

}
