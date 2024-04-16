import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-interacted-not-interacted-track-details',
  templateUrl: './interacted-not-interacted-track-details.component.html',
  styleUrls: ['./interacted-not-interacted-track-details.component.css'],
  providers: [SortOption]
})
export class InteractedNotInteractedTrackDetailsComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Input() trackType: any = "";
  @Output() notifyShowDetailedAnalytics = new EventEmitter();
  @Input()  isDetailedAnalytics: boolean;
  @Input() applyFilter: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Input() isTeamMemberAnalytics : boolean = false;



  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
	pagination: Pagination = new Pagination();
  heading:any = "Interacted & Not Interacted Track Details";
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
    this.setHeading();
    this.getInteractedNotInteractedTrackDetails(this.pagination);
  }
  setHeading() {
    if (this.trackType != "") {
      if (this.trackType === 'Interacted') {
        this.heading = "Interacted Track Details";
      } else if (this.trackType === 'Not Interacted') {
        this.heading = "Not Interacted Track Details";
      }
    } else {
      this.heading = "Interacted & Not Interacted Track Details"
    } 

    // if (this.partnerCompanyId != null && this.partnerCompanyId != undefined && this.partnerCompanyId > 0) {
    //   this.isDetailedAnalytics = true;
    // } else {
    //   this.isDetailedAnalytics = false;
    // }
  }

  getInteractedNotInteractedTrackDetailsForPartnerJourney(pagination : Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    this.pagination.detailedAnalytics = this.isDetailedAnalytics;
    this.pagination.trackTypeFilter = this.trackType;
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.pagination.maxResults = 6;
    this.pagination.teamMemberId = this.teamMemberId;
    this.parterService.getPartnerJourneyTrackDetailsByInteraction(this.pagination).subscribe(
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
    this.getInteractedNotInteractedTrackDetails(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getInteractedNotInteractedTrackDetails(this.pagination);
  }

  setPage(event:any) {
		this.pagination.pageIndex = event.page;
		this.getInteractedNotInteractedTrackDetails(this.pagination);
	}  

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  } 
   
  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
    this.referenseService.goToTop();
  }

  getInteractedNotInteractedTrackDetailsForTeamMember(pagination : Pagination){
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.trackTypeFilter = this.trackType;
    this.pagination.maxResults = 6;
    this.parterService.getTeamMemberTrackDetailsByInteraction(this.pagination).subscribe(
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

  getInteractedNotInteractedTrackDetails(pagination : Pagination){
    if(!this.isTeamMemberAnalytics)
      {
        this.getInteractedNotInteractedTrackDetailsForPartnerJourney(this.pagination);
      }else{
        this.getInteractedNotInteractedTrackDetailsForTeamMember(this.pagination);
      }
  }

}
