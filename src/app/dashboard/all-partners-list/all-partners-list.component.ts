import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../../partners/services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { PartnerJourneyRequest } from 'app/partners/models/partner-journey-request';

declare var $:any, swal: any;
@Component({
  selector: 'app-all-partners-list',
  templateUrl: './all-partners-list.component.html',
  styleUrls: ['./all-partners-list.component.css'],
  providers: [SortOption]
})
export class AllPartnersListComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Input() regionName: any = "";
  @Output() notifyShowDetailedAnalytics = new EventEmitter();
  @Input() isDetailedAnalytics: boolean;
  @Input() applyFilter: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Input() isTeamMemberAnalytics: boolean = false;
  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() isVendorVersion: boolean = false;
  @Input() vanityUrlFilter: boolean = false;
  @Input() vendorCompanyProfileName: string = '';
  // @Input() fromDateFilter: string = '';
  // @Input() toDateFilter: string = '';

  @Output() triggerSendEmailPopup = new EventEmitter<any>();
  dateFilterText = "Recent Login Date Filter";
  //filterApplied: boolean = false;
 // public selectedRegionIds = [];
 // public selectedStatusIds = [];
  filterActiveBg: string;
  showFilterDropDown: boolean = false;
  isCollapsed: boolean = true;
  public regionNameFilters: Array<any>;
  public regionInfoFields: any;
  partnerModuleName: string;
  infoName: string;

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
  pagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();
  loading: boolean;
  heading: any = "All Partners Details";
  scrollClass: any;
  showFilterOption: boolean = false;
  public multiSelectPlaceholderForRegion: string = "Select Region";
  public multiSelectPlaceholderForStatus: string = "Select Status";
  /*** XNFR-1015 */
  @Output() partnersSelected = new EventEmitter<any[]>();
  @Input() isSentEmailNotification:boolean = false;
   selectedIds = new Set<string>();
   selectedPartnersMap = new Map<string, any>();
  /**** XNFR-1015 */
  statusOptions = [
    { text: 'IncompleteCompanyProfile', value: 'IncompleteCompanyProfile' },
    { text: 'Active', value: 'Active' },
    { text: 'Pending Signup', value: 'Pending Signup' },
    { text: 'Dormant', value: 'Dormant' },
    { text: 'Deactivated', value: 'Deactivated'}
  ];

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.getInfoname();
  }
  private getInfoname() {
    const customName = this.authenticationService.partnerModule.customName;
    const isCustomNameDefined = customName != null && customName.length > 0;

    this.partnerModuleName = isCustomNameDefined ? customName : " Partner";

    if (!this.isDetailedAnalytics) {
      this.infoName = `${this.applyFilter && (this.authenticationService.isTeamMember() || this.authenticationService.module.isTeamMember)? " My " : " All "}${this.partnerModuleName}s`;
    } else {
      this.infoName = ` the ${this.partnerModuleName}`;
    }
  }

  ngOnChanges() {
    if (this.isSentEmailNotification) {
      this.selectedIds.clear();
      this.selectedPartnersMap.clear();
    }
    this.pagination.pageIndex = 1;
    this.getAllPartnersDetails(this.pagination);
    this.findRegionNames();
    this.setFilterColor();
  }
  setHeading() {
      this.heading = "All Partners Details"
    }

    callParentMethod(item: any) {
      this.triggerSendEmailPopup.emit(item); 
    }
    sortPartnerTeamMembers(text: any) {
      this.sortOption.teamMember = text;
      this.getAllFilteredResults(this.pagination);
    }
    clickFilter() {
      this.showFilterOption = !this.showFilterOption;
      this.customResponse.isVisible = false;
    }
    viewDropDownFilter(){
      this.showFilterOption = true;
      this.showFilterDropDown = false;
    }
  
    closeFilterOption() {
      this.showFilterOption = false;
      this.clearFilter();
  }
  clearFilter() {
    this.pagination.fromDateFilterString = '';
    this.pagination.toDateFilterString = '';
    this.pagination.selectedStatusIds = [];
    this.pagination.selectedRegionIds = [];
    this.regionName =''
    this.pagination.regionFilter = this.regionName;
    this.isCollapsed = true;
    this.filterActiveBg = 'defaultFilterACtiveBg';
    this.getAllPartnersDetails(this.pagination);
}
setFilterColor() {
  let isValidSelectedRegionAndStatus = this.pagination.selectedRegionIds != undefined && this.pagination.selectedRegionIds.length > 0 
  && this.pagination.selectedStatusIds != undefined && this.pagination.selectedStatusIds.length > 0;
  let isValidFromDateFilter = this.pagination.fromDateFilterString != undefined && this.pagination.fromDateFilterString.length > 0;
  let isValidToDateFilter = this.pagination.toDateFilterString != undefined && this.pagination.toDateFilterString.length > 0;
  if (isValidSelectedRegionAndStatus && isValidFromDateFilter && isValidToDateFilter) {
    this.filterActiveBg = 'filterActiveBg';
  }
  if (isValidSelectedRegionAndStatus) {
    this.filterActiveBg = 'filterActiveBg';
    this.isCollapsed = false;
  }
}
findRegionNames(){
  this.pagination.userId = this.loggedInUserId;  
  this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
  this.regionInfoFields = { text: 'region', value: 'region' };
  this.parterService.getAllPartnerRegionNamesFilter(this.pagination).
  subscribe(response => {
    this.regionNameFilters = response.data;
  }, error => {
    this.regionNameFilters = [];
  });
}
validateDateFilter() {
  let isValidFromDateFilter = this.pagination.fromDateFilterString != undefined && this.pagination.fromDateFilterString != "";
  let isEmptyFromDateFilter = this.pagination.fromDateFilterString == undefined || this.pagination.fromDateFilterString == "";
  let isValidToDateFilter = this.pagination.toDateFilterString != undefined && this.pagination.toDateFilterString != "";
  let isEmptyToDateFilter = this.pagination.toDateFilterString == undefined || this.pagination.toDateFilterString == "";
  let isValidRegionAndStatus = this.pagination.selectedRegionIds.length > 0 && this.pagination.selectedStatusIds.length>0;
  let checkIfToDateIsEmpty = isValidFromDateFilter && isEmptyToDateFilter;
  let checkIfFromDateIsEmpty = isValidToDateFilter && isEmptyFromDateFilter;
  let showToDateError = (isValidRegionAndStatus && checkIfToDateIsEmpty) || (!isValidRegionAndStatus && checkIfToDateIsEmpty)
  let showFromDateError = (isValidRegionAndStatus && checkIfFromDateIsEmpty) || (!isValidRegionAndStatus && checkIfFromDateIsEmpty)
  if (!(this.pagination.selectedRegionIds.length > 0) && !(this.pagination.selectedStatusIds.length>0) && (isEmptyFromDateFilter && isEmptyToDateFilter)) {
    this.customResponse = new CustomResponse('ERROR', "Please provide valid input to filter", true);
  } else if (showToDateError) {
    this.customResponse = new CustomResponse('ERROR', "Please pick To Date", true);
  } else if (showFromDateError) {
    this.customResponse = new CustomResponse('ERROR', "Please pick From Date", true);
  } else if (isValidToDateFilter && isValidFromDateFilter) {
    var toDate = Date.parse(this.pagination.toDateFilterString);
    var fromDate = Date.parse(this.pagination.fromDateFilterString);
    if (fromDate <= toDate) {
      this.applyFilters(this.pagination);
    } else {
      this.customResponse = new CustomResponse('ERROR', "From Date should be less than To Date", true);
    }
  } else {
    this.applyFilters(this.pagination);
  }
}
applyFilters(pagination: Pagination) {
  this.filterActiveBg = 'filterActiveBg';
  this.clickFilter();
  this.referenseService.loading(this.httpRequestLoader, true);
  pagination.pageIndex = 1;
  pagination.searchKey = this.searchKey;
  pagination = this.utilService.sortOptionValues(this.sortOption.teamMember, pagination); 
  this.pagination = pagination
  this.pagination.userId = this.loggedInUserId;
  this.pagination.regionFilter = this.regionName;  
  this.pagination.selectedRegionIds = this.pagination.selectedRegionIds;
  if (this.pagination.selectedRegionIds && this.pagination.selectedRegionIds.includes(this.regionName)) {
    this.pagination.regionFilter = '';
  }
  this.getAllPartnersDetailsList(this.pagination);
 }

  search() {
    this.getAllFilteredResults(this.pagination);
  }

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.search();
    }
  }

  getAllFilteredResults(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    let regionFilter = this.regionName;
    pagination.pageIndex = 1;
    pagination.searchKey = this.searchKey;
    pagination.selectedRegionIds=this.pagination.selectedRegionIds;
    pagination.selectedStatusIds=this.pagination.selectedStatusIds;
    pagination = this.utilService.sortOptionValues(this.sortOption.teamMember, pagination);
    if (this.pagination.selectedRegionIds && this.pagination.selectedRegionIds.includes(this.regionName)) {
      regionFilter = '';
    }
    this.pagination = pagination;
    //this.getAllPartnersDetails(this.pagination);
    this.pagination.regionFilter = regionFilter;
    this.pagination.toDateFilterString = this.pagination.toDateFilterString;
    this.pagination.fromDateFilterString = this.pagination.fromDateFilterString;
    this.getAllPartnersDetailsList(this.pagination);
  }

   setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getAllPartnersDetails(this.pagination);
  }

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
    this.referenseService.goToTop();
  }

  getAllPartnersDetails(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.regionFilter = this.regionName;
    if (this.pagination.regionFilter) {
      this.pagination.selectedRegionIds = [];
      this.pagination.selectedRegionIds.push(this.pagination.regionFilter);
     
    }else{
      this.pagination.selectedRegionIds = [];
    }
    this.getAllPartnersDetailsList(this.pagination);
  }
  getAllPartnersDetailsList(pagination: Pagination){
   pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.parterService.getAllPartners(this.pagination).subscribe(
      (response: any) => {
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
        this.sortOption.totalRecords = response.data.totalRecords;
          this.pagination.totalRecords = response.data.totalRecords;
          if (pagination.totalRecords == 0) {
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
  downloadAllPartnerDetailsReport() {
    let loggedInUserId = this.authenticationService.getUserId();
    this.pagination = this.utilService.sortOptionValues(this.sortOption.teamMember, this.pagination);
    let maxResults = this.pagination.maxResults;
    this.pagination.searchKey = this.searchKey;
    let regionFilter = this.regionName;
    this.pagination.maxResults = this.pagination.totalRecords;
    let pageableUrl = this.referenseService.getPagebleUrl(this.pagination);
    let sortColumn = this.pagination.sortcolumn;
    let selectedRegionIds = this.pagination.selectedRegionIds.join(',');
    if (this.pagination.selectedRegionIds && this.pagination.selectedRegionIds.includes(this.regionName)) {
      regionFilter = '';
    }
    let selectedStatusIds = this.pagination.selectedStatusIds.join(',');
    this.pagination.maxResults = maxResults
    window.location.href = this.authenticationService.REST_URL + '/partner/allPartners/downloadCsv?userId='
      + loggedInUserId +"&regionFilter="+regionFilter+"&sortColumn="+sortColumn+"&selectedRegionIds="+selectedRegionIds+"&selectedStatusIds="+selectedStatusIds+"&access_token=" + this.authenticationService.access_token + pageableUrl;
   }
  /****** XNFR-1015 *****/
  getUniqueId(item: any): string {
    return item.partnerId;
  }

  isItemSelected(item: any): boolean {
    return this.selectedIds.has(this.getUniqueId(item));
  }

  toggleItemSelection(item: any, event:any): void {
    const isChecked = event.target.checked;
    const id = this.getUniqueId(item);
    item.isSelected = isChecked;
    if (isChecked) {
      this.selectedIds.add(id);
      this.selectedPartnersMap.set(id, item);
    } else {
      this.selectedIds.delete(id);
      this.selectedPartnersMap.delete(id);
    }
  }

  isItemSelectable(item: any): boolean {
    return item.status !== 'Active' && item.status !== 'Deactivated';
  }

  hasSelectableItems(): boolean {
    return this.pagination.pagedItems.some(item => this.isItemSelectable(item));
  }

  isCurrentPageFullySelected(): boolean {
    return this.pagination.pagedItems
      .filter(this.isItemSelectable)
      .every(item => this.isItemSelected(item));
  }

  toggleSelectionForPage(event:any): void {
    this.pagination.pagedItems.forEach(item => {
      if (this.isItemSelectable(item)) {
        this.toggleItemSelection(item, event);
      }
    });
  }

  emitSelectedPartners(): void {
    const selectedPartners = Array.from(this.selectedPartnersMap.values()).filter(item => this.isItemSelected(item));
    console.log(selectedPartners,"selectedPartners");
    this.partnersSelected.emit(selectedPartners);
  }
  /***** XNFR-1015 *****/
}
