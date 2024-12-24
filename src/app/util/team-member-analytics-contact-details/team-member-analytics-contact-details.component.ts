import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../../partners/services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { SortOption } from 'app/core/models/sort-option';
import { PagerService } from 'app/core/services/pager.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

@Component({
  selector: 'app-team-member-analytics-contact-details',
  templateUrl: './team-member-analytics-contact-details.component.html',
  styleUrls: ['./team-member-analytics-contact-details.component.css'],
  providers: [SortOption]
})
export class TeamMemberAnalyticsContactDetailsComponent implements OnInit {

  @Input() isVendorVersion: boolean = false;
  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() fromDateFilter: string = '';
  @Input() toDateFilter: string = '';

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
  pagination: Pagination = new Pagination();
  scrollClass: any;

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {

  }
  ngOnChanges() {
    this.pagination.pageIndex = 1;
    this.getContactDetails(this.pagination);
  }
  
  getContactDetails(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.setPaginationValuesForTeamMember();
    this.parterService.getContactDetailsForTeamMember(this.pagination, this.isVendorVersion).subscribe(
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

  private setPaginationValuesForTeamMember() {
    this.pagination.userId = this.loggedInUserId;
    this.pagination.selectedTeamMemberIds = this.selectedTeamMemberIds;
    this.pagination.selectedVendorCompanyIds = this.selectedVendorCompanyIds;
    this.pagination.fromDateFilterString = this.fromDateFilter;
    this.pagination.toDateFilterString = this.toDateFilter;
    this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedSortedOption, pagination);
    this.getContactDetails(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getContactDetails(this.pagination);
  }

  setPage(event:any) {
		this.pagination.pageIndex = event.page;
		this.getContactDetails(this.pagination);
	}  

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  downloadContactDetailsReport() {
    this.setPaginationValuesForTeamMember();
    let teamMemberAnalyticsUrl = this.referenseService.getTeamMemberAnalyticsUrl(this.pagination);
    let isVendorVersionRequestParam = this.isVendorVersion ? "&vendorVersion=" + this.isVendorVersion : "";
    let urlSuffix = "teamMemberAnalytics/download/contact-details-report"
    let url = this.authenticationService.REST_URL + urlSuffix + "?access_token=" + this.authenticationService.access_token + teamMemberAnalyticsUrl
      + isVendorVersionRequestParam;
    this.referenseService.openWindowInNewTab(url);
  }



}
