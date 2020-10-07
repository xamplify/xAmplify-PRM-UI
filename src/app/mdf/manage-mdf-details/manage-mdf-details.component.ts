import { Component, OnInit } from '@angular/core';
import { MdfService } from '../services/mdf.service';
/*****Common Imports**********************/
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { ErrorResponse } from 'app/util/models/error-response';
declare var $: any;
/********************************************************* */
import { MdfPartnerDto } from '../models/mdf-partner-dto';
import { MdfDetails } from '../models/mdf-details';
import {MdfAmountType} from '../models/mdf-amount-type.enum';
@Component({
  selector: 'app-manage-mdf-details',
  templateUrl: './manage-mdf-details.component.html',
  styleUrls: ['./manage-mdf-details.component.css', '../mdf-html/mdf-html.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties]

})
export class ManageMdfDetailsComponent implements OnInit {

  pagination: Pagination = new Pagination();
  modalPopupLoader: boolean;
  loggedInUserCompanyId: number = 0;
  loggedInUserId: number = 0;
  loading = false;
  tilesLoader = false;
  tileData: any;
  customResponse: CustomResponse = new CustomResponse();
  mdfPartnerDto: MdfPartnerDto = new MdfPartnerDto();
  mdfDetails: MdfDetails = new MdfDetails();
  selectedPartnerDetails: any;
  errorResponses: Array<ErrorResponse> = new Array<ErrorResponse>();
  expirationDateError = false;
  mdfAmountError = false;
  MdfAmountType = MdfAmountType;
  errorFieldNames:Array<string> = new Array<string>();
  showMdfAmountPopup = false;
  partnershipId:number = 0;
  constructor(private utilService: UtilService, public sortOption: SortOption, public partnerListLoader: HttpRequestLoader, private mdfService: MdfService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.loading = true;
    this.tilesLoader = true;
    this.referenceService.loading(this.partnerListLoader, true);
    this.getCompanyId();
  }
  stopLoaders() {
    this.loading = false;
    this.tilesLoader = false;
    this.referenceService.loading(this.partnerListLoader, false);
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
          this.xtremandLogger.log(error);
          this.xtremandLogger.errorPage(error);
        },
        () => {
          if (this.loggedInUserCompanyId != undefined && this.loggedInUserCompanyId > 0) {
            this.getTilesInfo();
            this.pagination.vendorCompanyId = this.loggedInUserCompanyId;
            this.listPartners(this.pagination);
          }
        }
      );
    } else {
      this.stopLoaders();
      this.referenceService.showSweetAlertErrorMessage('UserId Not Found.Please try aftersometime');
      this.router.navigate(["/home/dashboard"]);
    }

  }
  getTilesInfo() {
    this.tilesLoader = true;
    this.mdfService.getVendorMdfAmountTilesInfo(this.loggedInUserCompanyId).subscribe((result: any) => {
      this.tilesLoader = false;
      this.tileData = result.data;
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }

  listPartners(pagination: Pagination) {
    this.referenceService.goToTop();
    this.loading = true;
    this.referenceService.loading(this.partnerListLoader, true);
    this.mdfService.listPartners(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let data = result.data;
        pagination.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.partners);
      }
      this.loading = false;
      this.referenceService.loading(this.partnerListLoader, false);
    }, error => {
      this.loading = false;
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }

  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy(text: any) {
    this.sortOption.mdfPartnersSortOption = text;
    this.getAllFilteredResults();
  }


  /*************************Search********************** */
  searchPartners() {
    this.getAllFilteredResults();
  }


  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listPartners(this.pagination);
  }

  getAllFilteredResults() {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.mdfPartnersSortOption, this.pagination);
    this.listPartners(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }
  /********************Pagaination&Search Code*****************/

  openMdfAmountPopup(partner: MdfPartnerDto) {
    this.showMdfAmountPopup = true;
    this.partnershipId = partner.partnershipId;
  }

  viewMdfAmountHistory(partner: MdfPartnerDto) {
    if(partner.mdfDetailsId>0){
      this.loading = true;
      this.referenceService.goToRouter("/home/mdf/timeline/"+partner.mdfDetailsId);
    }else{
      this.referenceService.showSweetAlertErrorMessage("No History Found");
    }
   
  }
 

  editMdfForm(){
    this.loading = true;
    this.referenceService.goToRouter("/home/mdf/form");
  }

  resetValues(){
    this.showMdfAmountPopup = false;
    this.partnershipId = 0;
  }

  updateListAfterAddingAmount(){
    this.resetValues();
    this.pagination.pageIndex = 1;
    this.getTilesInfo();
    this.listPartners(this.pagination);
  }

}
