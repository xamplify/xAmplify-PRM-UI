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

@Component({
  selector: 'app-play-book-journey-interaction',
  templateUrl: './play-book-journey-interaction.component.html',
  styleUrls: ['./play-book-journey-interaction.component.css']
})
export class PlayBookJourneyInteractionComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Input() applyFilter: boolean;
  @Input() isTeamMemberAnalytics: boolean = false;
  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() isVendorVersion: boolean = false;
  @Input() vanityUrlFilter: boolean = false;
  @Input() vendorCompanyProfileName: string = '';
  @Input() fromDateFilter: string = '';
  @Input() toDateFilter: string = '';
  @Input() fromActivePartnersDiv: boolean = false;
  @Input() fromDeactivatedPartnersDiv: boolean = false;
  @Output() notifyShowDetailedAnalytics = new EventEmitter();

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
  pagination: Pagination = new Pagination();
  scrollClass: string;
  headerText = "Playbook Interaction Details";

  customResponse: CustomResponse = new CustomResponse();
  filterActiveBg: string;
  filterApplied: boolean = false;
  showFilterOption: boolean = false;
  showFilterDropDown: boolean = false;
  isCollapsed: boolean = true;
  filterCategoryLoader = false;
  public multiSelectPlaceholderForPlaybook: string = "Select Playbook";
  public selectedPlaybookNames: any[] = [];
  public playbookFilters: Array<any>;
  public playbookInfoFields: any;
  dateFilterText = "Select Date Filter";
  isFromApprovalModule: boolean = false;
  partnershipStatus: string;

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
   
  }

  ngOnChanges() {
    if(this.fromActivePartnersDiv){
    this.partnershipStatus = 'approved';
    } else if (this.fromDeactivatedPartnersDiv) {
    this.partnershipStatus = 'deactivated';
    }
    this.pagination.pageIndex = 1;
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.findPlaybookNames();
    this.getPlaybookDetails(this.pagination);
    this.setFilterColor();
  }

  getPlaybookDetailsJourney(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.fromDateFilterString = this.fromDateFilter;
    this.pagination.toDateFilterString = this.toDateFilter;
    this.pagination.selectedPlaybookNames = this.pagination.selectedPlaybookNames;
    this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.pagination.partnershipStatus = this.partnershipStatus;
    this.parterService.getPlaybookInteractionDetails(this.pagination).subscribe(
      (response: any) => {
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.pagination.totalRecords = response.data.totalRecords;
          if(pagination.totalRecords == 0){
            this.scrollClass = 'noData'
          } else {
            this.scrollClass = 'tableHeightScroll'
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
  
  getSortedResults(text: any) {
    this.sortOption.selectedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedOption, this.pagination);
    this.getPlaybookDetails(pagination);
  }

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.search();
    }
  }
  
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getPlaybookDetails(this.pagination);
  }
  
  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
    this.referenseService.goToTop();
  }
    
  showAnalytics(item: any) {
    //let url = RouterUrlConstants['home']+RouterUrlConstants['dam']+RouterUrlConstants['damPartnerCompanyAnalytics']+this.referenseService.encodePathVariable(item.id);
    //this.referenseService.navigateToRouterByViewTypes(url, 0, '', '', false);
    let route = "/home/playbook/analytics/" + item.id;
    this.referenseService.navigateToRouterByViewTypes(route, 0, '', '', false);

  }
  getPlaybookDetails(pagination: Pagination) {
    this.getPlaybookDetailsJourney(this.pagination);
  }

  downloadPlaybookJourneyReport() {
    let loggedInUserIdRequestParam = this.loggedInUserId != undefined && this.loggedInUserId > 0 ? this.loggedInUserId : 0;
    let searchKeyRequestParm = this.searchKey != undefined ? this.searchKey : "";
    let partnerCompanyIdRequestParam = this.partnerCompanyId != undefined && this.partnerCompanyId > 0 ? this.partnerCompanyId : 0;
    let partnerTeamMemberGroupFilterRequestParm = this.applyFilter != undefined ? this.applyFilter : false;
    let teamMemberIdRequestParam = this.teamMemberId != undefined && this.teamMemberId > 0 ? this.teamMemberId : 0;
    let fromDateFilterRequestParam = this.fromDateFilter != undefined ? this.fromDateFilter : "";
    let toDateFilterRequestParam = this.toDateFilter != undefined ? this.toDateFilter : "";
    let timeZoneRequestParm = "&timeZone=" + Intl.DateTimeFormat().resolvedOptions().timeZone;
    let sortcolumn = this.pagination.sortcolumn;
    let sortingOrder = this.pagination.sortingOrder;
    let playbookNames = this.pagination.selectedPlaybookNames.join(',');
    let partnershipStatus = this.partnershipStatus != null ? "&partnershipStatus=" + this.partnershipStatus : "";
    let url = this.authenticationService.REST_URL + "partner/playbook/journey/interaction/details/download?access_token=" + this.authenticationService.access_token
      + "&loggedInUserId=" + loggedInUserIdRequestParam + "&searchKey=" + searchKeyRequestParm +  "&partnerCompanyId=" + partnerCompanyIdRequestParam
      + "&partnerTeamMemberGroupFilter=" + partnerTeamMemberGroupFilterRequestParm + "&teamMemberUserId=" + teamMemberIdRequestParam
      + "&fromDateFilterInString=" + fromDateFilterRequestParam + "&toDateFilterInString=" + toDateFilterRequestParam
      + "&playbookNames=" + playbookNames +"&sortcolumn="+sortcolumn+ "&sortingOrder="+sortingOrder+ timeZoneRequestParm + partnershipStatus;
    this.referenseService.openWindowInNewTab(url);
  }
    sortAssetDetails(text: any) {
      this.sortOption.selectedOption = text;
      this.getPlaybookDetails(this.pagination);
    }
    setFilterColor() {
    let isValidSelectedPlaybookNames = this.pagination.selectedPlaybookNames != undefined && this.pagination.selectedPlaybookNames.length > 0;
    let isValidFromDateFilter = this.fromDateFilter != undefined && this.fromDateFilter.length > 0;
    let isValidToDateFilter = this.toDateFilter != undefined && this.toDateFilter.length > 0;
    if (isValidSelectedPlaybookNames && isValidFromDateFilter && isValidToDateFilter) {
      this.filterActiveBg = 'filterActiveBg';
    }
    if (isValidSelectedPlaybookNames) {
    this.filterActiveBg = 'filterActiveBg';
    this.isCollapsed = false;
  }
  }
  
  clickFilter() {
      this.showFilterOption = !this.showFilterOption;
      this.customResponse.isVisible = false;
    }

  closeFilterOption() {
    this.showFilterOption = false;
    this.clearFilter();
  }
  clearFilter() {
    this.pagination.selectedPlaybookNames = [];
    this.pagination.criterias = [];
    this.pagination.searchKey = "";
    this.pagination.fromDateFilterString = "";
    this.pagination.toDateFilterString = "";
    this.selectedPlaybookNames = [];
    this.fromDateFilter = "";
    this.toDateFilter = "";
    this.isCollapsed = true;
    this.searchKey = "";
    this.filterActiveBg = 'defaultFilterACtiveBg';
    this.getPlaybookDetails(this.pagination);
  }
  setDateFilterOptions() {
    let obj = {
      "fromDate": this.fromDateFilter,
      "toDate": this.toDateFilter
    }
  }
   applyFilters() {
    this.showFilterOption = false;
    this.filterActiveBg = 'filterActiveBg';
    this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedOption, this.pagination);
    this.getPlaybookDetails(this.pagination);
  }
  validateDateFilter() {
    let isValidFromDateFilter = this.fromDateFilter != undefined && this.fromDateFilter != "";
    let isEmptyFromDateFilter = this.fromDateFilter == undefined || this.fromDateFilter == "";
    let isValidToDateFilter = this.toDateFilter != undefined && this.toDateFilter != "";
    let isEmptyToDateFilter = this.toDateFilter == undefined || this.toDateFilter == "";
    let isValidPlaybookNames = this.pagination.selectedPlaybookNames.length > 0;
    let checkIfToDateIsEmpty = isValidFromDateFilter && isEmptyToDateFilter;
    let checkIfFromDateIsEmpty = isValidToDateFilter && isEmptyFromDateFilter;
    let showToDateError = (isValidPlaybookNames && checkIfToDateIsEmpty) || (!isValidPlaybookNames && checkIfToDateIsEmpty)
    let showFromDateError = (isValidPlaybookNames && checkIfFromDateIsEmpty) || (!isValidPlaybookNames && checkIfFromDateIsEmpty)
    if (!(this.pagination.selectedCompanyIds.length > 0) && !(this.pagination.selectedPlaybookNames.length > 0)  && (isEmptyFromDateFilter && isEmptyToDateFilter)) {
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
findPlaybookNames(){
  this.pagination.userId = this.loggedInUserId;
  this.pagination.partnershipStatus = this.partnershipStatus;  
  this.playbookInfoFields = { text: 'playbook', value: 'playbook' };
  this.parterService.getAllPlaybookNamesFilter(this.pagination).
  subscribe(response => {
    this.playbookFilters = response.data;
  }, error => {
    this.playbookFilters = [];
  });
}
}
