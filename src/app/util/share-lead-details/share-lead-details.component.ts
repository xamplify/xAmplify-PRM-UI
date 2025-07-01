import { Component, OnInit , Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../../partners/services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';

@Component({
  selector: 'app-share-lead-details',
  templateUrl: './share-lead-details.component.html',
  styleUrls: ['./share-lead-details.component.css'],
  providers: [SortOption]
})
export class ShareLeadDetailsComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Input() applyFilter: boolean;
  @Input() isDetailedAnalytics: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Output() notifyShowDetailedAnalytics = new EventEmitter();
  @Input() isTeamMemberAnalytics : boolean = false;
  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() isVendorVersion: boolean = false;
  @Input() vanityUrlFilter: boolean = false;
  @Input() vendorCompanyProfileName: string = '';
  @Input() fromDateFilter: string = '';
  @Input() toDateFilter: string = '';
  @Input() fromActivePartnersDiv: boolean = false;
  @Input() fromDeactivatedPartnersDiv: boolean = false;
  headerText:string = 'Share Leads Details';
  

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
	pagination: Pagination = new Pagination();
  scrollClass: string;
  partnershipStatus: any;

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
    } else if(this.fromDeactivatedPartnersDiv){
      this.partnershipStatus = 'deactivated';
    }
    this.pagination.pageIndex = 1;
    // if (this.partnerCompanyId != null && this.partnerCompanyId != undefined && this.partnerCompanyId > 0) {
    //   this.isDetailedAnalytics = true;
    // } else {
    //   this.isDetailedAnalytics = false;
    // }
    this.getShareLeadDetails(this.pagination);
    if(this.isTeamMemberAnalytics && !this.isVendorVersion){
      this.headerText = 'Shared Leads Details';
    }else{
      this.headerText = 'Share Leads Details';
    }
  }

  getShareLeadDetailsForPartnerJourney(pagination : Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    this.pagination.detailedAnalytics = this.isDetailedAnalytics;
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.pagination.teamMemberId = this.teamMemberId;  
    this.pagination.fromDateFilterString = this.fromDateFilter;
    this.pagination.toDateFilterString = this.toDateFilter;
    this.pagination.partnershipStatus = this.partnershipStatus;
    this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.parterService.getShareLeadDetails(this.pagination).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {          
          this.sortOption.totalRecords = response.data.totalRecords;
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

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) { 
      this.search(); 
    } 
  } 

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedSortedOption, pagination);
    this.getShareLeadDetails(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getShareLeadDetails(this.pagination);
  }

  setPage(event:any) {
		this.pagination.pageIndex = event.page;
		this.getShareLeadDetails(this.pagination);
	}  

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }
  
  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
    this.referenseService.goToTop(); 
  }

  getShareLeadDetails(pagination : Pagination){
    if(!this.isTeamMemberAnalytics){
      this.getShareLeadDetailsForPartnerJourney(this.pagination);
    }else{
      this.getShareLeadDetailsForTeamMember(this.pagination);
    }
  }
  
  getShareLeadDetailsForTeamMember(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.setPaginationValuesForTeamMember();
    this.parterService.getShareLeadDetailsForTeamMember(this.pagination,this.isVendorVersion).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {          
          this.sortOption.totalRecords = response.data.totalRecords;
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

  downloadShareLeadsDetailsReport() {
    if (!this.isTeamMemberAnalytics) {
      this.downloadShareLeadsDetailsReportForPartnerJourney();
    } else {
      this.downloadShareLeadsDetailsReportForTeamMember();
    }
  }

  downloadShareLeadsDetailsReportForPartnerJourney() {
    let loggedInUserIdRequestParam = this.loggedInUserId != undefined && this.loggedInUserId > 0 ? this.loggedInUserId : 0;
    let partnerCompanyIdsRequestParam = this.selectedPartnerCompanyIds && this.selectedPartnerCompanyIds.length > 0 ? this.selectedPartnerCompanyIds : [];
    let searchKeyRequestParm = this.searchKey != undefined ? this.sortOption.searchKey : "";
    let partnerCompanyIdRequestParam = this.partnerCompanyId != undefined && this.partnerCompanyId > 0 ? this.partnerCompanyId : 0;
    let partnerTeamMemberGroupFilterRequestParm = this.applyFilter != undefined ? this.applyFilter : false;
    let teamMemberIdRequestParam = this.teamMemberId != undefined && this.teamMemberId > 0 ? this.teamMemberId : 0;
    let fromDateFilterRequestParam = this.fromDateFilter != undefined ? this.fromDateFilter : "";
    let toDateFilterRequestParam = this.toDateFilter != undefined ? this.toDateFilter : "";
    let timeZoneRequestParm = "&timeZone=" + Intl.DateTimeFormat().resolvedOptions().timeZone;
    let partnershipStatus = this.partnershipStatus != null ? "&partnershipStatus=" + this.partnershipStatus : "";
    let url = this.authenticationService.REST_URL + "partner/journey/download/share-leads-details-report?access_token=" + this.authenticationService.access_token
      + "&loggedInUserId=" + loggedInUserIdRequestParam + "&selectedPartnerCompanyIds=" + partnerCompanyIdsRequestParam + "&searchKey=" + searchKeyRequestParm
      + "&detailedAnalytics=" + this.isDetailedAnalytics + "&partnerCompanyId=" + partnerCompanyIdRequestParam
      + "&partnerTeamMemberGroupFilter=" + partnerTeamMemberGroupFilterRequestParm + "&teamMemberUserId=" + teamMemberIdRequestParam
      + "&fromDateFilterInString=" + fromDateFilterRequestParam + "&toDateFilterInString=" + toDateFilterRequestParam + timeZoneRequestParm + partnershipStatus;
    this.referenseService.openWindowInNewTab(url);
  }

  setPaginationValuesForTeamMember() {
    this.pagination.userId = this.loggedInUserId;
    this.pagination.selectedTeamMemberIds = this.selectedTeamMemberIds;
    this.pagination.selectedVendorCompanyIds = this.selectedVendorCompanyIds;
    this.pagination.fromDateFilterString = this.fromDateFilter;
    this.pagination.toDateFilterString = this.toDateFilter;
    this.pagination.partnershipStatus = this.partnershipStatus;
    this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(!this.isVendorVersion){
      this.pagination.vanityUrlFilter = this.vanityUrlFilter;
      this.pagination.vendorCompanyProfileName = this.vendorCompanyProfileName;
    } 
  }

  downloadShareLeadsDetailsReportForTeamMember() {
    this.setPaginationValuesForTeamMember();
    let teamMemberAnalyticsUrl = this.referenseService.getTeamMemberAnalyticsUrl(this.pagination);
    let isVendorVersionRequestParam = this.isVendorVersion ? "&vendorVersion=" + this.isVendorVersion : "";
    let urlSuffix = "teamMemberAnalytics/download/share-leads-details-report"
    let url = this.authenticationService.REST_URL + urlSuffix + "?access_token=" + this.authenticationService.access_token + teamMemberAnalyticsUrl
      + isVendorVersionRequestParam;
    this.referenseService.openWindowInNewTab(url);
  }

}
