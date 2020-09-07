import { Component, OnInit,Input } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { MdfService } from '../services/mdf.service';
import { ActivatedRoute } from '@angular/router';
import {MdfRequestDto} from '../models/mdf-request-dto';
import {MdfAmountTiles} from '../models/mdf-amount-tiles';
import { ErrorResponse } from 'app/util/models/error-response';

declare var $: any;
@Component({
  selector: 'app-change-mdf-request',
  templateUrl: './change-mdf-request.component.html',
  styleUrls: ['./change-mdf-request.component.css','../mdf-html/mdf-html.component.css'],
  providers: [HttpRequestLoader,Properties]

})
export class ChangeMdfRequestComponent implements OnInit {

  loggedInUserId: number=0;
  loading = false;
  customResponse: CustomResponse = new CustomResponse();
  vendorCompanyId:number = 0;
  pageLoader = false;
  modalPopupLoader = false;
  requestId: number=0;
  loggedInUserCompanyId: number=0;
  mdfRequest:MdfRequestDto = new MdfRequestDto();
  selectedMdfRequest:MdfRequestDto = new MdfRequestDto();
  mdfAmountTiles:MdfAmountTiles = new MdfAmountTiles();
  vendorContact:any;
  mdfRequestOwner: any;
  partnerManager: any;
  errorResponses: Array<ErrorResponse> = new Array<ErrorResponse>();
  errorFieldNames:Array<string> = new Array<string>();
  constructor(private mdfService: MdfService,private route: ActivatedRoute,private utilService: UtilService,public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router,public properties:Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();

   }

  ngOnInit() {
    this.loading = true;
    this.pageLoader = true;
    this.requestId = parseInt(this.route.snapshot.params['requestId']);
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
          this.loadData();
        }
      }
    );
  }    

  loadData(){
    if(this.requestId>0){
      this.loading = true;
      this.pageLoader = true;
      this.mdfService.getMdfRequestDetailsById(this.requestId,this.loggedInUserCompanyId).
      subscribe((result: any) => {
        if(result.statusCode==200){
          this.mdfRequest = result.map.requestDetails;
          this.selectedMdfRequest = result.map.requestDetails;
          this.mdfAmountTiles = result.map.partnerMdfBalances;
          this.vendorContact = result.map.vendorContact;
          this.mdfRequestOwner = result.map.mdfRequestOwner;
          this.partnerManager = result.map.partnerManager;
        }else if(result.statusCode==404){
          this.goToManageMdfRequests();
          this.referenceService.showSweetAlertErrorMessage("Invalid Request");
        }
        this.loading = false;
        this.pageLoader = false;
      }, error => {
        this.xtremandLogger.log(error);
        this.xtremandLogger.errorPage(error);
      });
    }else{
      this.referenceService.showSweetAlertErrorMessage("Request Id Not Found");
    }
  }


  goToManageMdfRequests(){
    this.loading = true;
    this.referenceService.goToRouter("/home/mdf/requests");
  }

  openForm(){
    this.selectedMdfRequest = this.mdfRequest;
    this.errorResponses = new Array<ErrorResponse>();
    this.errorFieldNames = [];
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
    this.errorResponses = new Array<ErrorResponse>();
    this.errorFieldNames = [];
    this.modalPopupLoader = true;
    this.selectedMdfRequest.loggedInUserId = this.loggedInUserId;
    this.mdfService.updateMdfRequest(this.selectedMdfRequest).subscribe((result: any) => {
      if(result.statusCode==200){
        this.referenceService.showSweetAlertSuccessMessage("Status Changed Successfully");
        this.closeChangeRequestPopup();
        this.loadData();
      }else if(result.statusCode==400){
        this.referenceService.goToTop();
        this.modalPopupLoader = false;
        this.errorResponses = result.errorResponses;
        this.errorFieldNames = this.referenceService.filterSelectedColumnsFromArrayList(this.errorResponses,'field');
      } else{
        this.modalPopupLoader = false;
      }
    }, error => {
      this.modalPopupLoader = false;
      this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
    });
  }

  viewTimeLine(){
    this.loading = true;
    this.referenceService.goToRouter('/home/mdf/timeline/v/'+this.mdfRequest.id);
  }

}
