import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdfRequest } from '../models/mdf.request';
import { MdfRequestAnalytics } from '../models/mdf.request.analytics';
import { MdfRequestStatusAndBalanceInfo } from '../models/mdf.request.status.balance.info';
import { MdfRequestOwnerAndPartnerInfo } from '../models/mdf.request.owner.partner';

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
declare var $: any;

@Component({
  selector: 'app-manage-mdf-requests',
  templateUrl: './manage-mdf-requests.component.html',
  styleUrls: ['./manage-mdf-requests.component.css','../html-sample/html-sample.component.css'],
  providers: [HttpRequestLoader, SortOption,Properties]
})
export class ManageMdfRequestsComponent implements OnInit {

  pagination: Pagination = new Pagination();
  mdfRequest:MdfRequest;
  mdfRequestsPartnersInfoList: Array<MdfRequest> = new Array<MdfRequest>();
  mdfRequestAnalytics: MdfRequestAnalytics = new MdfRequestAnalytics();
  mdfRequestStatusAndBalance: MdfRequestStatusAndBalanceInfo = new MdfRequestStatusAndBalanceInfo();
  mdfRequestOwnerAndPartner: MdfRequestOwnerAndPartnerInfo = new MdfRequestOwnerAndPartnerInfo();
  loggedInUserCompanyId: number=0;
  workflowStepsFilePath: string;
  partnerCompanyId: number;
  wfStepsList:any = [];
  role:string = "";

  loggedInUserId: number=0;
  loading = false;
  tilesLoader = false;
  tileData:any;
  customResponse: CustomResponse = new CustomResponse();
  isPartnerView = false;
  partnerListLoader: HttpRequestLoader = new HttpRequestLoader();
  vendorTilesClass = "col-sm-3 col-xs-6 col-lg-3 col-md-3";
  partnerTilesClass = "col-sm-4 col-xs-6 col-lg-4 col-md-4";
  tileClass: string = "";
  constructor(private mdfService: MdfService, private pagerService: PagerService,private route: ActivatedRoute,private utilService: UtilService,public sortOption: SortOption,public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router,public properties:Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if(this.referenceService.isCreated){
      this.customResponse = new CustomResponse('SUCCESS','Request Saved Successfully',true);
    }
    this.workflowStepsFilePath = 'assets/config-files/mdf.workflow.steps.json';
    this.mdfService.getMdfWorkflowSteps(this.workflowStepsFilePath).subscribe(result => {
      this.wfStepsList = result.workflow_steps;
    }, error => {
      console.log(error);
    });
   }

  ngOnInit() {
    this.loading  = true;
    this.tilesLoader = true;
    this.role = this.route.snapshot.params['role'];
    if(this.role!=undefined && this.role=="p"){
      this.isPartnerView = true;
      this.tileClass = this.partnerTilesClass;
    }else{
      this.isPartnerView = false;
      this.tileClass = this.vendorTilesClass;
    }
    this.getCompanyId();
  }
  ngOnDestroy() {
    this.referenceService.isCreated = false;
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
          this.pagination.vendorCompanyId = this.loggedInUserCompanyId;
          if(this.isPartnerView){
            this.getTilesInfoForPartner();
          }else{
            this.getTilesInfoForVendor();
          }
          this.listMdfRequests(this.pagination);
        }
      }
    );
  }

  getTilesInfoForPartner() {
    this.mdfService.getMdfRequestsAnalyticsTilesForPartner(this.loggedInUserCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
         this.tilesLoader = false;
         this.loading = false;
         this.tileData = result.data;
      }
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }

  getTilesInfoForVendor() {
    this.mdfService.getMdfRequestsAnalyticsForTiles(this.loggedInUserCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.tilesLoader = false;
        this.loading = false;
        this.tileData = result.data;
     }
    }, error => {
      console.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }

  listMdfRequests(pagination: Pagination) {
    this.referenceService.loading(this.partnerListLoader, true);
    if(this.isPartnerView){
      pagination.partnerCompanyId = this.loggedInUserCompanyId;
      this.listMdfRequestsForPartners(pagination);
    }else{
      pagination.vendorCompanyId = this.loggedInUserCompanyId;
      this.listMdfRequestsForVendors(pagination);
    }
   
  }

  listMdfRequestsForPartners(pagination:Pagination){
    this.mdfService.listMdfRequestsForPartners(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let data = result.data;
        pagination.totalRecords = data.totalRecords;
        this.mdfRequestsPartnersInfoList = data.partnerList;
        pagination = this.pagerService.getPagedItems(pagination, this.mdfRequestsPartnersInfoList);
      }
      this.loading = false;
      this.referenceService.loading(this.partnerListLoader, false);
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }

  listMdfRequestsForVendors(pagination:Pagination){
    this.mdfService.getMdfRequestsAnalyticsForPagination(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let data = result.data;
        pagination.totalRecords = data.totalRecords;
        this.mdfRequestsPartnersInfoList = data.partnerList;
        pagination = this.pagerService.getPagedItems(pagination, this.mdfRequestsPartnersInfoList);
      }
      this.loading = false;
      this.referenceService.loading(this.partnerListLoader, false);
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }

   /********************Pagaination&Search Code*****************/

    /*************************Sort********************** */
    sortBy(text: any) {
      this.sortOption.mdfPartnersSortOption = text;
      this.getAllFilteredResults(this.pagination);
  }


  /*************************Search********************** */
  searchPartners() {
      this.getAllFilteredResults(this.pagination);
  }

  paginationDropdown(items: any) {
      this.sortOption.itemsSize = items;
      this.getAllFilteredResults(this.pagination);
  }

  /************Page************** */
  setPage(event: any) {
      this.pagination.pageIndex = event.page;
      this.listMdfRequests(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
      this.pagination.pageIndex = 1;
      this.pagination.searchKey = this.sortOption.searchKey;
      this.pagination = this.utilService.sortOptionValues(this.sortOption.mdfPartnersSortOption, this.pagination);
      this.listMdfRequests(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }
  /********************Pagaination&Search Code*****************/

  listMdfAccessVendors(){
    this.loading = true;
    this.router.navigate(["/home/mdf/vendors"]);
  }


  

  getMdfRequestStatusAndBalanceDetails() {
    this.mdfService.getMdfRequestStatusAndBalanceDetails(this.loggedInUserCompanyId, this.partnerCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.mdfRequestStatusAndBalance = result.data;
      }
    }, error => {
      console.log(error);
    });
  }

  getMdfRequestOwnerAndPartnerManagerDetails() {
    this.mdfService.getMdfRequestOwnerAndPartnerManagerDetails(this.partnerCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.mdfRequestOwnerAndPartner = result.data;
      }
    }, error => {
      console.log(error);
    });
  }

  saveMdfRequest(){
    this.mdfService.saveMdfRequest(this.mdfRequest).subscribe((result:any) => {
      if (result.statusCode === 200) {
        this.mdfRequest = result;
      }
    }, error => {
      console.log(error);
    });
  }

  updateMdfRequest(){
    this.mdfService.updateMdfRequest(this.mdfRequest).subscribe((result:any) => {
      if (result.statusCode === 200) {
        this.mdfRequest = result;
      }
    }, error => {
      console.log(error);
    });
  }

}
