import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { SortOption } from 'app/core/models/sort-option';
import { PagerService } from 'app/core/services/pager.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

@Component({
  selector: 'app-mdf-detail-analytics',
  templateUrl: './mdf-detail-analytics.component.html',
  styleUrls: ['./mdf-detail-analytics.component.css'],
  providers: [SortOption]
})
export class MdfDetailAnalyticsComponent implements OnInit {

  @Output() notifyShowDetailedAnalytics = new EventEmitter();
  @Input()  isDetailedAnalytics: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  
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
   ngOnChanges(){
    this.pagination.pageIndex = 1;
    this.getMdfDetails(this.pagination);
   }

  getMdfDetails(pagination : Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.maxResults = 4;
    this.pagination.detailedAnalytics = this.isDetailedAnalytics;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    this.parterService.getMdfDetails(this.pagination).subscribe(
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
    this.getMdfDetails(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getMdfDetails(this.pagination);
  }

  setPage(event:any) {
		this.pagination.pageIndex = event.page;
		this.getMdfDetails(this.pagination);
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
