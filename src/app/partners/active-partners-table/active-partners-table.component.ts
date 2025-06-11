import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { ParterService } from 'app/partners/services/parter.service';
import { ListLoaderValue } from '../../common/models/list-loader-value';
import { SortOption } from 'app/core/models/sort-option';
import { CustomResponse } from 'app/common/models/custom-response';
import { UtilService } from 'app/core/services/util.service';
import { Properties } from 'app/common/models/properties';

@Component({
  selector: 'app-active-partners-table',
  templateUrl: './active-partners-table.component.html',
  styleUrls: ['./active-partners-table.component.css']
})
export class ActivePartnersTableComponent implements OnInit {
  @Input() applyFilter: boolean;
  loggedInUserId: number = 0;
  searchKey: string = "";
  showFilterOption: boolean = false;
  statusFilter: any;
  public selectedCompanyIds = [];
  public companyNameFilters: Array<any>;
  public companyInfoFields: any;
  public companyInfoFilterPlaceHolder: string = 'Select Companies';
  filterCategoryLoader = false;
  isCollapsed: boolean = true;
  pagination: Pagination = new Pagination();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  customResponse: CustomResponse = new CustomResponse();
  @Output() notifyShowDetailedAnalytics = new EventEmitter();
  @Output() notifySelectedPartnerCompanyIds = new EventEmitter();
  @Output() notifySelectedDateFilters = new EventEmitter();
  @Input() selectedPartnerCompanyIds: any = [];
  showFilterDropDown: boolean = false;
  filterActiveBg: string;
  filterApplied: boolean = false;
  dateFilterText = "Select Date Filter";
  @Input() fromDateFilter: any = "";
  @Input() toDateFilter: any = "";
  @Input() fromActivePartnersDiv: boolean = false;
  @Input() fromDeactivatedPartnersDiv: boolean = false;
  partnershipStatus: any;



  constructor(public listLoaderValue: ListLoaderValue, public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption,public properties: Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    //this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    //this.getActivePartners(this.pagination);
  }

  ngOnChanges(){
    if(this.fromActivePartnersDiv){
    this.partnershipStatus = 'approved';
    } else if (this.fromDeactivatedPartnersDiv) {
    this.partnershipStatus = 'deactivated';
    }
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;  
    this.sortOption.searchKey = "";/*** XNFR-835 ***/
    this.getActivePartners(this.pagination);
    this.findCompanyNames();
    this.setFilterColor();
  }

  getActivePartners(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    this.pagination.partnershipStatus = this.partnershipStatus;
    this.parterService.getActivePartners(this.pagination).subscribe(
      (response: any) => {
        this.referenseService.loading(this.httpRequestLoader, false);
        this.sortOption.totalRecords = response.data.totalRecords;
        this.pagination.totalRecords = response.data.totalRecords;
        this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
      },
      (_error: any) => {
      }
    );
  }

  search() {
    // this.pagination.pageIndex = 1;
    // this.pagination.searchKey = this.searchKey;
    // this.getActivePartners(this.pagination);
    this.getAllFilteredResults(this.pagination);
  }

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.search();
    }
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedSortedOptionForPartnerJourney, pagination);
    this.getActivePartners(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getActivePartners(this.pagination);
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getActivePartners(this.pagination);
  }

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOptionForPartnerJourney = text;
    this.getAllFilteredResults(this.pagination);
  }

  setSortColumns(pagination: Pagination, sortedValue: any) {
    if (sortedValue != "") {
      let options: string[] = sortedValue.split("-");
      pagination.sortcolumn = options[0];
      pagination.sortingOrder = options[1];
    }
  }

  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
  }

  toggleCollapse(event: Event) {
    event.preventDefault();
    this.isCollapsed = !this.isCollapsed;
  }

  clickFilter() {
    if (!this.filterApplied) {
      this.showFilterOption = !this.showFilterOption;
    } else {
      if (this.showFilterOption) {
        this.showFilterOption = false;
      } else {
        this.showFilterDropDown = true;
      }
    }
    this.customResponse.isVisible = false;
  }

  viewDropDownFilter(){
    this.showFilterOption = true;
    this.showFilterDropDown = false;
  }


  closeFilterOption() {
    this.showFilterOption = false;
  }

  clearFilter() {
    this.fromDateFilter = "";
    this.toDateFilter = "";
    this.setDateFilterOptions();
    this.selectedCompanyIds = [];
    this.notifySelectedPartnerCompanyIds.emit(this.selectedCompanyIds);
    this.isCollapsed = true;
    this.showFilterDropDown = false;
    this.filterActiveBg = 'defaultFilterACtiveBg';
    this.filterApplied = false;
  }

  applyFilters() {
    this.filterApplied = true;
    this.setDateFilterOptions();
    this.notifySelectedPartnerCompanyIds.emit(this.selectedCompanyIds);
    this.showActivePartnersTable();
    this.showFilterOption = false;
    this.filterActiveBg = 'filterActiveBg';
  }

  setFilterColor() {
    let isValidSelectedCompanies = this.selectedCompanyIds != undefined && this.selectedCompanyIds.length > 0;
    let isValidFromDateFilter = this.fromDateFilter != undefined && this.fromDateFilter.length > 0;
    let isValidToDateFilter = this.toDateFilter != undefined && this.toDateFilter.length > 0;
    if (isValidSelectedCompanies && isValidFromDateFilter && isValidToDateFilter) {
      this.filterActiveBg = 'filterActiveBg';
      this.filterApplied = true;
    }
    if (isValidSelectedCompanies) {
      this.filterActiveBg = 'filterActiveBg';
      this.isCollapsed = false;
    }
  }

  findCompanyNames() {
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

  setDateFilterOptions() {
    let obj = {
      "fromDate": this.fromDateFilter,
      "toDate": this.toDateFilter
    }
    this.notifySelectedDateFilters.emit(obj);
  }

  validateDateFilter() {
    let isValidFromDateFilter = this.fromDateFilter != undefined && this.fromDateFilter != "";
    let isEmptyFromDateFilter = this.fromDateFilter == undefined || this.fromDateFilter == "";
    let isValidToDateFilter = this.toDateFilter != undefined && this.toDateFilter != "";
    let isEmptyToDateFilter = this.toDateFilter == undefined || this.toDateFilter == "";
    let isValidSelectedCompanies = this.selectedCompanyIds.length > 0;
    let checkIfToDateIsEmpty = isValidFromDateFilter && isEmptyToDateFilter;
    let checkIfFromDateIsEmpty = isValidToDateFilter && isEmptyFromDateFilter;
    let showToDateError = (isValidSelectedCompanies && checkIfToDateIsEmpty) || (!isValidSelectedCompanies && checkIfToDateIsEmpty)
    let showFromDateError = (isValidSelectedCompanies && checkIfFromDateIsEmpty) || (!isValidSelectedCompanies && checkIfFromDateIsEmpty)
    if (!(this.selectedCompanyIds.length > 0) && (isEmptyFromDateFilter && isEmptyToDateFilter)) {
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

  showActivePartnersTable() {
    if(this.selectedCompanyIds.length > 0){
      this.isCollapsed = false;
    }
  }
/*** XNFR-835 ***/
  downloadActivePatnerReport() {
    this.referenseService.downloadPartnesReports(this.loggedInUserId,this.selectedPartnerCompanyIds,this.pagination,this.applyFilter,this.fromDateFilter,this.toDateFilter,"active-partners-report")
  }
/*** XNFR-835 ***/
}
