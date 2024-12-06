import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { PartnerJourneyRequest } from '../models/partner-journey-request';

@Component({
  selector: 'app-partner-journey-team-members-table',
  templateUrl: './partner-journey-team-members-table.component.html',
  styleUrls: ['./partner-journey-team-members-table.component.css'],
  providers: [SortOption]
})
export class PartnerJourneyTeamMembersTableComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() fromDateFilter: string = '';
  @Input() toDateFilter: string = '';
  @Output() notifyTeamMemberSelection = new EventEmitter();

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
	pagination: Pagination = new Pagination();
  teamEmails: any = [];
  teamMemberId: any = 0;
  showModulesPopup: boolean;
  teamMemberGroupId: number;
 
  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
      this.loggedInUserId = this.authenticationService.getUserId(); 
  }

  ngOnInit() {    
    // this.getTeamInfo(this.pagination);
    // this.getTeamEmails();
  } 

  ngOnChanges(){
    this.getTeamInfo(this.pagination);
    this.getTeamEmails();
  }

  getTeamInfo(pagination : Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.partnerJourneyFilter = true;
    this.pagination.fromDateFilterString = this.fromDateFilter;
    this.pagination.toDateFilterString = this.toDateFilter;
    this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (this.teamMemberId !== undefined && this.teamMemberId != null && this.teamMemberId > 0) {
      this.pagination.teamMemberId = this.teamMemberId;
      this.pagination.filterKey = "teamMemberFilter";
    } else {
      this.pagination.filterKey = "";
      this.pagination.teamMemberId = undefined;
    }
    this.authenticationService.findAllTeamMembers(this.pagination).subscribe(
			(response: any) => {	
        if (response.statusCode == 200) {          
          this.sortOption.totalRecords = response.data.totalRecords;
				  this.pagination.totalRecords = response.data.totalRecords;
				  this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
        }     
        this.referenseService.loading(this.httpRequestLoader, false);
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
    this.getTeamInfo(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getTeamInfo(this.pagination);
  }

  setPage(event:any) {
		this.pagination.pageIndex = event.page;
		this.getTeamInfo(this.pagination);
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

  onChangeTeamMember() {
    this.notifyTeamMemberSelection.emit(this.teamMemberId);
    this.getTeamInfo(this.pagination);
  }

  getTeamEmails() {
    this.referenseService.loading(this.httpRequestLoader, true);
    let partnerJourneyRequest = new PartnerJourneyRequest();
    partnerJourneyRequest.loggedInUserId = this.loggedInUserId;
    partnerJourneyRequest.partnerCompanyId = this.partnerCompanyId;
    partnerJourneyRequest.fromDateFilterInString = this.fromDateFilter
    partnerJourneyRequest.toDateFilterInString = this.toDateFilter;
    partnerJourneyRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.parterService.getPartnerJourneyTeamEmails(partnerJourneyRequest).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.teamEmails = response.data;	
        }        	
			},
			(_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
			}
		);
  }

  previewModules(teamMemberGroupId: number) {
    this.showModulesPopup = true;
    this.teamMemberGroupId = teamMemberGroupId;
  }

  hideModulesPreviewPopUp(){
    this.showModulesPopup = false;
  }

  downloadTeamMembersReport() {
    let loggedInUserIdRequestParam = this.loggedInUserId != undefined && this.loggedInUserId > 0 ? this.loggedInUserId : 0;
    let searchKeyRequestParm = this.sortOption.searchKey != undefined ? this.sortOption.searchKey : "";
    let partnerTeamMemberGroupFilterRequestParm = true;
    let fromDateFilterRequestParam = this.fromDateFilter != undefined ? this.fromDateFilter : "";
    let toDateFilterRequestParam = this.toDateFilter != undefined ? this.toDateFilter : "";
    let partnerCompanyIdRequestParam = this.partnerCompanyId != undefined ? this.partnerCompanyId : 0;
    let teamMemberIdRequestParam = this.teamMemberId != undefined ? this.teamMemberId : 0;
    let timeZoneRequestParm = "&timeZone=" + Intl.DateTimeFormat().resolvedOptions().timeZone;
    let filterTypeRequestParam = this.teamMemberId != undefined && this.teamMemberId > 0 ? "&filterType=teamMemberFilter" : "";
    let url = this.authenticationService.REST_URL + "partner/journey/download/team-members-report?access_token=" + this.authenticationService.access_token
      + "&loggedInUserId=" + loggedInUserIdRequestParam + "&partnerCompanyId=" + partnerCompanyIdRequestParam + "&searchKey=" + searchKeyRequestParm
      + "&partnerTeamMemberGroupFilter=" + partnerTeamMemberGroupFilterRequestParm + "&teamMemberUserId=" + teamMemberIdRequestParam
      + "&fromDateFilterInString=" + fromDateFilterRequestParam + "&toDateFilterInString=" + toDateFilterRequestParam + timeZoneRequestParm + filterTypeRequestParam;
    this.referenseService.openWindowInNewTab(url);
  }

}
