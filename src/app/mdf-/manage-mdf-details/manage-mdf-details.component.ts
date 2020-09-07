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

  openMdfAmountPopup(partner: MdfPartnerDto) {
    this.mdfPartnerDto = partner;
    this.mdfDetails = new MdfDetails();
    this.mdfDetails.partnershipId = this.mdfPartnerDto.partnershipId;
    this.mdfDetails.mdfAmountTypeInString = MdfAmountType[MdfAmountType.FUND_ADDED];
    this.mdfDetails.calculatedAvailableBalance = this.mdfPartnerDto.availableBalance;
    $('#mdfAmountPopup').modal('show');
  }

  updateFieldsStatus() {
    this.expirationDateError = false;
    this.calculateTotalAvailableBalance();
  }

  calculateTotalAvailableBalance() {
    let mdfAmount = 0;
    if (this.mdfDetails.mdfAmount != undefined) {
      mdfAmount = this.mdfDetails.mdfAmount;
    }
    if ((this.mdfDetails.mdfAmountTypeInString==MdfAmountType[MdfAmountType.FUND_ADDED])) {
      this.mdfDetails.calculatedAvailableBalance = this.mdfPartnerDto.availableBalance + mdfAmount;
    } else {
      this.mdfDetails.calculatedAvailableBalance = this.mdfPartnerDto.availableBalance - mdfAmount;
      this.mdfDetails.allocationDateInString = "";
      this.mdfDetails.expirationDateInString = "";
    }
  }

  updateMdfAmount() {
    this.modalPopupLoader = true;
    this.resetErrors();
    this.mdfDetails.createdBy = this.loggedInUserId;
    this.mdfService.updateMdfAmount(this.mdfDetails).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.pagination.pageIndex = 1;
          this.getTilesInfo();
          this.listPartners(this.pagination);
          if(this.mdfDetails.mdfAmountTypeInString==MdfAmountType[MdfAmountType.FUND_ADDED]){
            this.referenceService.showSweetAlertSuccessMessage("Fund Added Successfully");
          }else{
            this.referenceService.showSweetAlertSuccessMessage("Fund Removed Successfully");
          }
        this.closeMdfAmountPopup();
        } else {
          this.errorResponses = result.errorResponses;
          let self = this;
          $.each(this.errorResponses, function (_index: number, errorResponse: ErrorResponse) {
            if (errorResponse['field'] == "expirationDate") {
              self.expirationDateError = true;
            } else if (errorResponse['field'] == "mdfAmount") {
              self.mdfAmountError = true;
            }
          });
        }
        this.modalPopupLoader = false;
      }, error => {
        this.modalPopupLoader = false;
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
        this.xtremandLogger.log(error);
      });
  }

  closeMdfAmountPopup() {
    $('#mdfAmountPopup').modal('hide');
    this.mdfDetails = new MdfDetails();
    this.mdfPartnerDto = new MdfPartnerDto();
    this.resetErrors();
  }

  resetErrors() {
    this.mdfAmountError = false;
    this.expirationDateError = false;
    this.errorResponses = new Array<ErrorResponse>();
    this.customResponse = new CustomResponse();
  }


  viewMdfAmountHistory(partner: MdfPartnerDto) {

  }

}
