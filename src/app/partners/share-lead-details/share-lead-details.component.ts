import { Component, OnInit , Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
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
  

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
	pagination: Pagination = new Pagination();

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
    // if (this.partnerCompanyId != null && this.partnerCompanyId != undefined && this.partnerCompanyId > 0) {
    //   this.isDetailedAnalytics = true;
    // } else {
    //   this.isDetailedAnalytics = false;
    // }
    this.getShareLeadDetails(this.pagination);
  }

  getShareLeadDetails(pagination : Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    this.pagination.maxResults = 6;
    this.pagination.detailedAnalytics = this.isDetailedAnalytics;
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.pagination.teamMemberId = this.teamMemberId;  
    this.parterService.getShareLeadDetails(this.pagination).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {          
          this.sortOption.totalRecords = response.data.totalRecords;
				  this.pagination.totalRecords = response.data.totalRecords;
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

}
