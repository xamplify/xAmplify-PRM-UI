import { Component, OnInit } from '@angular/core';
import { MdfService } from '../services/mdf.service';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { MdfFunds } from '../models/mdf.funds';
import { MdfCreditTransaction } from '../models/mdf.credit.history';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';

declare var $: any;
@Component({
  selector: 'app-manage-mdf-funds',
  templateUrl: './manage-mdf-funds.component.html',
  styleUrls: ['./manage-mdf-funds.component.css','../html-sample/html-sample.component.css'],
  providers: [HttpRequestLoader, SortOption,Properties],
})
export class ManageMdfFundsComponent implements OnInit {

  pagination: Pagination = new Pagination();
  mdfCreditTransaction: MdfCreditTransaction = new MdfCreditTransaction();
  mdfFundsPartnersInfoList: Array<MdfFunds> = new Array<MdfFunds>();
  vendorCompanyId: number;
  loggedInUserId: number=0;
  loading = false;
  tilesLoader = false;
  tileData:any;
  selectedPartnerMdfFund:MdfFunds = new MdfFunds();
  modalPopupLoader: boolean;
  showCreditAmountError = false;
  customResponse: CustomResponse = new CustomResponse();

  constructor(private utilService: UtilService,public sortOption: SortOption,public partnerListLoader: HttpRequestLoader,private mdfService: MdfService, private pagerService: PagerService, public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router,public properties:Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

   ngOnInit() {
     this.loading  = true;
     this.getCompanyId();
    
  }

   getCompanyId() {
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        if (result !== "") { 
          this.vendorCompanyId = result;
        }else{
          this.loading = false;
          this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
          this.router.navigate(["/home/dashboard"]);
        }
      }, (error: any) => { this.xtremandLogger.log(error); },
      () => {
        if(this.vendorCompanyId!=undefined && this.vendorCompanyId>0){
          this.getTilesInfo();
          this.pagination.vendorCompanyId = this.vendorCompanyId;
          this.listPartners(this.pagination);
        }
      }
    );
  }

 

  getTilesInfo() {
    this.tilesLoader = true;
    this.mdfService.getMdfFundsAnalyticsForTiles(this.vendorCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
         this.tilesLoader = false;
         this.tileData = result.data;
       
      }
    }, error => {
      this.xtremandLogger.log(error);
    });
  }

  listPartners(pagination: Pagination) {
    this.loading = true;
    this.referenceService.loading(this.partnerListLoader, true);
    this.mdfService.getMdfFundsAnalyticsForPagination(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let data = result.data;
        pagination.totalRecords = data.totalRecords;
        this.mdfFundsPartnersInfoList = data.partnerList;
        pagination = this.pagerService.getPagedItems(pagination, this.mdfFundsPartnersInfoList);
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
      this.listPartners(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
      this.pagination.pageIndex = 1;
      this.pagination.searchKey = this.sortOption.searchKey;
      this.pagination = this.utilService.sortOptionValues(this.sortOption.mdfPartnersSortOption, this.pagination);
      this.listPartners(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }
  /********************Pagaination&Search Code*****************/

  /**********Add Balance************ */
  addBalance(partner:any){
    this.selectedPartnerMdfFund = partner;
    this.modalPopupLoader = true;
    $('#addBalance').modal('show');
    this.mdfService.getMdfCreditDetailsById(partner.id).subscribe((result: any) => {
      if(result.statusCode==200){
        let data = result.data;
        this.selectedPartnerMdfFund.dateInString = data.dateInString;
        this.selectedPartnerMdfFund.expirationDateInString = data.expirationDateInString;
        this.selectedPartnerMdfFund.creditAmount = data.creditAmount;
      }
      this.modalPopupLoader = false;
     
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }

  closeAddBalancePopup(){
    $('#addBalance').modal('hide');
    this.customResponse = new CustomResponse();
    this.showCreditAmountError = false;
  }

  addCreditBalance(){
    this.showCreditAmountError = false;
    this.modalPopupLoader = true;
    this.mdfService.addCreditBalance(this.selectedPartnerMdfFund).subscribe((result: any) => {
      if(result.statusCode==200){
        this.pagination.pageIndex = 1;
        this.listPartners(this.pagination);
        this.referenceService.showSweetAlertSuccessMessage("Credit Added Successfully");
        this.closeAddBalancePopup();
      }else{
        this.modalPopupLoader = false;
        this.showCreditAmountError = true;
      }
    }, error => {
      this.modalPopupLoader = false;
      this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
    });
  }
}
