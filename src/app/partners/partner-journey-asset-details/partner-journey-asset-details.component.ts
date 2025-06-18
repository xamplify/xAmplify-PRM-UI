import { Component, Input, OnInit, Output,EventEmitter} from '@angular/core';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { PagerService } from 'app/core/services/pager.service';
import { SortOption } from 'app/core/models/sort-option';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { CustomResponse } from 'app/common/models/custom-response';

var $: any;
@Component({
  selector: 'app-partner-journey-asset-details',
  templateUrl: './partner-journey-asset-details.component.html',
  styleUrls: ['./partner-journey-asset-details.component.css'],
  providers: [SortOption]
})
export class PartnerJourneyAssetDetailsComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Output() notifyShowDetailedAnalytics = new EventEmitter();
  @Input() isDetailedAnalytics: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Input() applyFilter: boolean;
  @Input() isTeamMemberAnalytics: boolean = false;
  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() isVendorVersion: boolean = false;
  @Input() vanityUrlFilter: boolean = false;
  @Input() vendorCompanyProfileName: string = '';
  @Input() fromDateFilter: string = '';
  @Input() toDateFilter: string = '';

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
  pagination: Pagination = new Pagination();
  scrollClass: string;
  headerText = "Asset Details";

  customResponse: CustomResponse = new CustomResponse();
  filterActiveBg: string;
  filterApplied: boolean = false;
  showFilterOption: boolean = false;
  showFilterDropDown: boolean = false;
  isCollapsed: boolean = true;
  filterCategoryLoader = false;
  public companyInfoFilterPlaceHolder: string = 'Select Companies';
  public companyNameFilters: Array<any>;
  public emailInfoFilters: Array<any>;
  public selectedCompanyIds = [];
  public selectedEmailIds = [];
  public selectedAssetIds = [];
  public companyInfoFields: any;
  public multiSelectPlaceholderForAsset: string = "Select Asset";
  public selectedAssetNames: any[] = [];
  public assetNameFilters: Array<any>;
  public assetInfoFields: any;
  public emailInfoFields: any;
  dateFilterText = "Select Date Filter";
  isFromApprovalModule: boolean = false;
  public EmailInfoFilterPlaceHolder: string = 'Select Emailids'

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
     this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.findCompanyNames();
  }

  ngOnChanges() {
     this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.pagination.pageIndex = 1;
    this.findAssetNames();
    this.findEmailIds();
    this.getAssetDetails(this.pagination);
    this.setFilterColor();
  }

  getAssetDetailsForPartnerJourney(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    this.pagination.detailedAnalytics = this.isDetailedAnalytics;
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.pagination.teamMemberId = this.teamMemberId;
    this.pagination.fromDateFilterString = this.fromDateFilter;
    this.pagination.toDateFilterString = this.toDateFilter;
    this.pagination.selectedCompanyIds = this.pagination.selectedCompanyIds;
    this.pagination.assetIds = this.pagination.assetIds;
    this.pagination.selectedEmailIds = this.pagination.selectedEmailIds;
    this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.parterService.getAssetDetails(this.pagination).subscribe(
      (response: any) => {
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.sortOption.totalRecords = response.data.totalRecords;
          this.pagination.totalRecords = response.data.totalRecords;
          if(pagination.totalRecords == 0){
            this.scrollClass = 'noData';
          } else {
            this.scrollClass = 'tableHeightScroll';
          }
          this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
        }
      },
      (_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
      }
    );
  }

  search() {
    this.getAllFilteredResults(this.pagination);
  }

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.search();
    }
  }
  
  getSortedResults(text: any) {
    this.sortOption.selectedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedOption, pagination);
    this.getAssetDetails(pagination);
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getAssetDetails(this.pagination);
  }
  
  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
    this.referenseService.goToTop();
  }
  
  showAnalytics(item: any) {
    let damPartnerId = item.partnerId;
    let prefixUrl = "";
    let url = ""
    prefixUrl = RouterUrlConstants['home'] + RouterUrlConstants['dam'] + RouterUrlConstants['damPartnerAnalytics'];
    url = prefixUrl + '/' + this.referenseService.encodePathVariable(item.id) + '/' + this.referenseService.encodePathVariable(damPartnerId);
    this.referenseService.navigateToRouterByViewTypes(url, 0, '', '', false);
  }

  getAssetDetails(pagination: Pagination) {
    this.getAssetDetailsForPartnerJourney(pagination);
  }

  downloadAssetDetailsReport() {
    let loggedInUserIdRequestParam = this.loggedInUserId != undefined && this.loggedInUserId > 0 ? this.loggedInUserId : 0;
    let partnerCompanyIdsRequestParam = this.selectedPartnerCompanyIds && this.selectedPartnerCompanyIds.length > 0 ? this.selectedPartnerCompanyIds : [];
    let searchKeyRequestParm = this.searchKey != undefined ? this.searchKey : "";
    let partnerCompanyIdRequestParam = this.partnerCompanyId != undefined && this.partnerCompanyId > 0 ? this.partnerCompanyId : 0;
    let partnerTeamMemberGroupFilterRequestParm = this.applyFilter != undefined ? this.applyFilter : false;
    let teamMemberIdRequestParam = this.teamMemberId != undefined && this.teamMemberId > 0 ? this.teamMemberId : 0;
    let fromDateFilterRequestParam = this.fromDateFilter != undefined ? this.fromDateFilter : "";
    let toDateFilterRequestParam = this.toDateFilter != undefined ? this.toDateFilter : "";
    let timeZoneRequestParm = "&timeZone=" + Intl.DateTimeFormat().resolvedOptions().timeZone;
    let sortcolumn = this.pagination.sortcolumn;
    let sortingOrder = this.pagination.sortingOrder;
    let assetIds =this.pagination.assetIds.join(',');
    let emailIds = this.pagination.selectedEmailIds.join(',');    
    let companyIds = this.pagination.selectedCompanyIds.join(',');
    let url = this.authenticationService.REST_URL + "partner/journey/download/asset-details-report?access_token=" + this.authenticationService.access_token
      + "&loggedInUserId=" + loggedInUserIdRequestParam + "&selectedPartnerCompanyIds=" + partnerCompanyIdsRequestParam + "&searchKey=" + searchKeyRequestParm + "&detailedAnalytics=" + this.isDetailedAnalytics + "&partnerCompanyId=" + partnerCompanyIdRequestParam
      + "&partnerTeamMemberGroupFilter=" + partnerTeamMemberGroupFilterRequestParm + "&teamMemberUserId=" + teamMemberIdRequestParam
      + "&fromDateFilterInString=" + fromDateFilterRequestParam + "&toDateFilterInString=" + toDateFilterRequestParam
      + "&assetIds=" + assetIds + "&companyIds=" + companyIds + "&emailIds=" + emailIds + "&sortcolumn="+sortcolumn+ "&sortingOrder="+sortingOrder+ timeZoneRequestParm;
    this.referenseService.openWindowInNewTab(url);
  }
  sortAssetDetails(text: any) {
      this.sortOption.selectedOption = text;
      this.getAssetDetails(this.pagination);
    }
 setFilterColor() {
  const hasSelectedAssets = this.pagination.assetIds && this.pagination.assetIds.length > 0;
  const hasSelectedCompanies = this.pagination.selectedCompanyIds && this.pagination.selectedCompanyIds.length > 0;
  const hasSelectedEmails = this.pagination.selectedEmailIds && this.pagination.selectedEmailIds.length > 0;

  const isValidFromDateFilter = this.pagination.fromDateFilterString && this.pagination.fromDateFilterString.length > 0;
  const isValidToDateFilter = this.pagination.toDateFilterString && this.pagination.toDateFilterString.length > 0;

  const isAnyFilterActive = hasSelectedAssets || hasSelectedCompanies || hasSelectedEmails || isValidFromDateFilter || isValidToDateFilter;

  if (isAnyFilterActive) {
    this.filterActiveBg = 'filterActiveBg';
    this.isCollapsed = false;  
  } else {
    this.filterActiveBg = 'defaultFilterACtiveBg';  
  }
}

  clickFilter() {
    this.showFilterOption = !this.showFilterOption;  
    this.customResponse.isVisible = false;
    setTimeout(() => {
      ($('[data-toggle="tooltip"]') as any).tooltip();  
    }, 0);
  }

  closeFilterOption() {
    this.showFilterOption = false;
    this.clearFilter();
  }
  clearFilter() {
    this.pagination.selectedCompanyIds = [];
    this.pagination.assetIds = [];
    this.pagination.selectedEmailIds = [];
    this.pagination.criterias = [];
    this.pagination.searchKey = "";
    this.pagination.fromDateFilterString = "";
    this.pagination.toDateFilterString = "";
    this.selectedCompanyIds = [];
    this.selectedAssetIds = [];
    this.selectedEmailIds = [];
    this.fromDateFilter = "";
    this.toDateFilter = "";
    this.showFilterDropDown = false;
    this.filterActiveBg = 'defaultFilterACtiveBg';
    this.isCollapsed = true;
    this.getAssetDetails(this.pagination);
  }
  setDateFilterOptions() {
    let obj = {
      "fromDate": this.fromDateFilter,
      "toDate": this.toDateFilter
    }
  }
   applyFilters() {
    this.filterActiveBg = 'filterActiveBg';
    this.showFilterOption = false;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedOption, this.pagination);
    this.getAssetDetails(this.pagination);
  }
  validateDateFilter() {
    let isValidFromDateFilter = this.fromDateFilter != undefined && this.fromDateFilter != "";
    let isEmptyFromDateFilter = this.fromDateFilter == undefined || this.fromDateFilter == "";
    let isValidToDateFilter = this.toDateFilter != undefined && this.toDateFilter != "";
    let isEmptyToDateFilter = this.toDateFilter == undefined || this.toDateFilter == "";
    let isValidSelectedFilter = false;
    if (this.isDetailedAnalytics) {
      isValidSelectedFilter = this.pagination.selectedEmailIds.length > 0 && this.pagination.assetIds.length > 0;
    } else {
      isValidSelectedFilter = this.pagination.selectedCompanyIds.length > 0 && this.pagination.assetIds.length > 0;
    }
    let checkIfToDateIsEmpty = isValidFromDateFilter && isEmptyToDateFilter;
    let checkIfFromDateIsEmpty = isValidToDateFilter && isEmptyFromDateFilter;
    let showToDateError = (isValidSelectedFilter && checkIfToDateIsEmpty) || (!isValidSelectedFilter && checkIfToDateIsEmpty)
    let showFromDateError = (isValidSelectedFilter && checkIfFromDateIsEmpty) || (!isValidSelectedFilter && checkIfFromDateIsEmpty)
    if (!(this.pagination.selectedEmailIds.length > 0) && !(this.pagination.selectedCompanyIds.length > 0) && !(this.pagination.assetIds.length > 0)  && (isEmptyFromDateFilter && isEmptyToDateFilter)) {
      this.customResponse = new CustomResponse('ERROR', "Please provide valid input to filter", true);
    } else if (showToDateError) {
      this.customResponse = new CustomResponse('ERROR', "Please pick To Date", true);
    } else if (showFromDateError) {
      this.customResponse = new CustomResponse('ERROR', "Please pick From Date", true);
    } else if (isValidToDateFilter && isValidFromDateFilter) {
      var toDate = Date.parse(this.toDateFilter);
      var fromDate = Date.parse(this.fromDateFilter);
      if (fromDate <= toDate) {
        this.applyFilters();
      } else {
        this.customResponse = new CustomResponse('ERROR', "From Date should be less than To Date", true);
      }
    } else {
      this.applyFilters();
    }
  }
findCompanyNames(){
    this.filterCategoryLoader = true;
    this.selectedCompanyIds = this.selectedPartnerCompanyIds;
    this.companyInfoFields = { text: 'companyName', value: 'companyId' };
    this.parterService.getPartnerJourneyCompanyDetailsForFilter(this.pagination).
      subscribe(response => {
        this.companyNameFilters = response.data;
      }, error => {
        this.companyNameFilters = [];
        this.filterCategoryLoader = false;
      });
}
// this.selectedCompanyIds = this.selectedPartnerCompanyIds;
//     this.companyInfoFields = { text: 'companyName', value: 'companyId' };
findAssetNames(){
  this.pagination.userId = this.loggedInUserId;  
  this.pagination.partnerCompanyId = this.partnerCompanyId;
  this.pagination.detailedAnalytics = this.isDetailedAnalytics;
  this.selectedAssetIds = this.selectedAssetIds;
  this.assetInfoFields = { text: 'assetName', value: 'assetId' };
  this.parterService.getAllPartnerAssetNamesFilter(this.pagination).
  subscribe(response => {
    this.assetNameFilters = response.data;
  }, error => {
    this.assetNameFilters = [];
  });
}
findEmailIds(){
  this.pagination.userId = this.loggedInUserId;
  this.pagination.partnerCompanyId = this.partnerCompanyId;
  this.emailInfoFields = { text: 'emailId', value: 'emailId' };
  this.parterService.getAllPartnerEmailIdsFilter(this.pagination).
    subscribe(response => {
      this.emailInfoFilters = response.data;
    }, error => {
      this.emailInfoFilters = [];
    });
}
}
