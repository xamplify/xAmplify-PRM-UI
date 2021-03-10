import { Component, OnInit,Input } from '@angular/core';
import { Pagination } from 'app/core/models/pagination';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ParterService } from 'app/partners/services/parter.service';
import { ListLoaderValue } from 'app/common/models/list-loader-value';
import { DashboardService } from 'app/dashboard/dashboard.service';
import {Properties} from 'app/common/models/properties';
@Component({
  selector: 'app-partners-statistics',
  templateUrl: './partners-statistics.component.html',
  styleUrls: ['./partners-statistics.component.css'],
  providers: [Pagination, HttpRequestLoader,ListLoaderValue,Properties]
})
export class PartnersStatisticsComponent implements OnInit {
   loggedInUserId: number = 0;
    activePartnersSearchKey: string = "";
	activePartnersPagination: Pagination = new Pagination();
	activeParnterHttpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	partnerAnalyticsCount:any;
	partnerAnalyticsCountLoader = false;
	partnerAnalyticsCountStatusCode = 200;
	constructor(public dashboardService:DashboardService,public listLoaderValue: ListLoaderValue,public authenticationService: AuthenticationService, public pagination: Pagination,
		public referenseService: ReferenceService, public parterService: ParterService, public pagerService: PagerService,
		public xtremandLogger: XtremandLogger,public properties:Properties) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

  ngOnInit() {
	  	this.getActiveInActiveTotalPartnerCounts();
		this.getActivePartnerReports();
	}

	getActiveInActiveTotalPartnerCounts(){
		this.partnerAnalyticsCountLoader = true;
		this.dashboardService.getActiveInActiveTotalPartnerCounts().
		subscribe(
			data=>{
				this.partnerAnalyticsCount = data;
				this.partnerAnalyticsCountLoader = false;
				this.partnerAnalyticsCountStatusCode = 200; 
			},error=>{
				this.partnerAnalyticsCountLoader = false;
				this.partnerAnalyticsCountStatusCode = 0; 
			}
		);
	}

	activePartnerSearch(keyCode: any) { if (keyCode === 13) { this.searchActivePartnerAnalytics(); } }

	searchActivePartnerAnalytics() {
		this.activePartnersPagination.pageIndex = 1;
		this.activePartnersPagination.searchKey = this.activePartnersSearchKey;
		this.getActivePartnerReports();
	}

	getActivePartnerReports() {
		this.referenseService.loading(this.activeParnterHttpRequestLoader, true);
		this.activePartnersPagination.userId = this.loggedInUserId;
		if (this.authenticationService.isSuperAdmin()) {
			this.activePartnersPagination.userId = this.authenticationService.checkLoggedInUserId(this.activePartnersPagination.userId);
		}
		this.activePartnersPagination.maxResults = 3;
		this.parterService.getActivePartnersAnalytics(this.activePartnersPagination).subscribe(
			(response: any) => {
				for (var i in response.activePartnesList) {
					response.activePartnesList[i].contactCompany = response.activePartnesList[i].partnerCompanyName;
				}
				this.activePartnersPagination.totalRecords = response.totalRecords;
				this.activePartnersPagination = this.pagerService.getPagedItems(this.activePartnersPagination, response.activePartnesList);
				this.referenseService.loading(this.activeParnterHttpRequestLoader, false);
			},
			(_error: any) => {
				console.log("error");
			}
		);
	}

	setPage(event:any) {
		this.activePartnersPagination.pageIndex = event.page;
		this.getActivePartnerReports();
	}


}
