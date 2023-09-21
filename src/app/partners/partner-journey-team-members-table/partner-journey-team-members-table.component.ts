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
  @Output() notifyTeamMemberSelection = new EventEmitter();

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
	pagination: Pagination = new Pagination();
  teamEmails: any = [];
  teamMemberId: any = 0;
 
  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
      this.loggedInUserId = this.authenticationService.getUserId(); 
  }

  ngOnInit() {    
    this.getTeamInfo(this.pagination);
    this.getTeamEmails();
  }

  getTeamInfo(pagination : Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.partnerJourneyFilter = true;
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

}
