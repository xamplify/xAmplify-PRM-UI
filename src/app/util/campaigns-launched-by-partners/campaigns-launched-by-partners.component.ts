import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { ParterService } from 'app/partners/services/parter.service';
import { ListLoaderValue } from '../../common/models/list-loader-value';

@Component({
	selector: 'app-campaigns-launched-by-partners',
	templateUrl: './campaigns-launched-by-partners.component.html',
	styleUrls: ['./campaigns-launched-by-partners.component.css'],
	providers: [Pagination, HttpRequestLoader,ListLoaderValue]
})
export class CampaignsLaunchedByPartnersComponent implements OnInit {
	@Input() applyFilter:boolean;
	@Input() selectedPartnerCompanyIds: any = [];
	@Output() notifyShowDetailedAnalytics = new EventEmitter();
	activePartnersSearchKey: string = "";
	activePartnersPagination: Pagination = new Pagination();
	activeParnterHttpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	loggedInUserId: number = 0;
	constructor(public listLoaderValue: ListLoaderValue,public authenticationService: AuthenticationService,public referenseService: ReferenceService, public parterService: ParterService, public pagerService: PagerService,
		public xtremandLogger: XtremandLogger) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}
	ngOnInit() {
		this.activePartnersPagination.partnerTeamMemberGroupFilter = this.applyFilter;
		this.getActivePartnerReports();
	}

	ngOnChanges(){
		this.getActivePartnerReports();
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
		this.activePartnersPagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
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
			}
		);
	}

	setPage(event:any) {
		this.activePartnersPagination.pageIndex = event.page;
		this.getActivePartnerReports();
	}
	viewAnalytics(partnerCompanyId: any) {
		this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
		this.referenseService.goToTop(); 
	  }
	

}
