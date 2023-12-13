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
  @Input() selectedPartnerCompanyIds: any = [];
  showFilterDropDown: boolean = false;
  filterActiveBg: string;
  filterApplied: boolean = false;


  constructor(public listLoaderValue: ListLoaderValue, public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    //this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    //this.getActivePartners(this.pagination);
  }

  ngOnChanges(){
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;   
    this.getActivePartners(this.pagination);
    this.findCompanyNames();
    this.setFilterColor();
  }

  getActivePartners(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
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
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedSortedOption, pagination);
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
    this.sortOption.selectedSortedOption = text;
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
    if(!this.filterApplied) {
      this.showFilterOption = !this.showFilterOption;
    } else {      
      if (this.showFilterOption) {
        this.showFilterOption = false;
      } else {
        this.showFilterDropDown = true;
      }     
    }
    
  }

  viewDropDownFilter(){
    this.showFilterOption = true;
    this.showFilterDropDown = false;
  }


  closeFilterOption() {
    this.showFilterOption = false;
  }

  clearFilter() {
    this.selectedCompanyIds = [];
    this.notifySelectedPartnerCompanyIds.emit(this.selectedCompanyIds);
    this.isCollapsed = true;
    this.showFilterDropDown = false;
    this.filterActiveBg = 'defaultFilterACtiveBg';
    this.filterApplied = false;
  }

  applyFilters() {
    this.filterApplied = true;
    this.notifySelectedPartnerCompanyIds.emit(this.selectedCompanyIds);
    this.isCollapsed = false;
    this.showFilterOption = false;
    this.filterActiveBg = 'filterActiveBg';
  }
  setFilterColor(){
    if(this.selectedCompanyIds != null && this.selectedCompanyIds.length >0 && this.selectedCompanyIds != undefined){
      this.filterActiveBg = 'filterActiveBg';
      this.isCollapsed = false;
      this.filterApplied = true;
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

}
