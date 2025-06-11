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
	@Input() applyFilter: boolean;
	@Input() selectedPartnerCompanyIds: any = [];
	@Output() notifyShowDetailedAnalytics = new EventEmitter();
	@Input() fromDateFilter: string = '';
        @Input() toDateFilter: string = '';
        @Input() fromActivePartnersDiv: boolean = false;
        @Input() fromDeactivatedPartnersDiv: boolean = false;
        activePartnersSearchKey: string = "";
	activePartnersPagination: Pagination = new Pagination();
	activeParnterHttpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
        loggedInUserId: number = 0;
        scrollClass: string;
        partnershipStatus: any;
	constructor(public listLoaderValue: ListLoaderValue,public authenticationService: AuthenticationService,public referenseService: ReferenceService, public parterService: ParterService, public pagerService: PagerService,
		public xtremandLogger: XtremandLogger) {
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
                this.activePartnersPagination.partnerTeamMemberGroupFilter = this.applyFilter;
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
                this.activePartnersPagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
                this.activePartnersPagination.fromDateFilterString = this.fromDateFilter;
                this.activePartnersPagination.toDateFilterString = this.toDateFilter;
                this.activePartnersPagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                this.activePartnersPagination.partnershipStatus = this.partnershipStatus;
                this.parterService.getActivePartnersAnalytics(this.activePartnersPagination).subscribe(
			(response: any) => {
				for (var i in response.activePartnesList) {
					response.activePartnesList[i].contactCompany = response.activePartnesList[i].partnerCompanyName;
				}
				this.activePartnersPagination.totalRecords = response.totalRecords;

				if (!(this.activePartnersPagination.totalRecords == 0)) {
					this.scrollClass = 'tableHeightScroll';
				}
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

	downloadCampaignLaunchedByReport() {
		let loggedInUserIdRequestParam = this.loggedInUserId != undefined && this.loggedInUserId > 0 ? this.loggedInUserId : 0;
		let partnerCompanyIdsRequestParam = this.selectedPartnerCompanyIds && this.selectedPartnerCompanyIds.length > 0 ? this.selectedPartnerCompanyIds : [];
		let searchKeyRequestParm = this.activePartnersSearchKey != undefined ? this.activePartnersPagination.searchKey : "";
		let partnerTeamMemberGroupFilterRequestParm = this.applyFilter != undefined ? this.applyFilter : false;
		let fromDateFilterRequestParam = this.fromDateFilter != undefined ? this.fromDateFilter : "";
		let toDateFilterRequestParam = this.toDateFilter != undefined ? this.toDateFilter : "";
		let timeZoneRequestParm = "&timeZone=" + Intl.DateTimeFormat().resolvedOptions().timeZone;
		let url = this.authenticationService.REST_URL + "partner/journey/download/active-partners-launched-campaigns-report?access_token=" + this.authenticationService.access_token
			+ "&loggedInUserId=" + loggedInUserIdRequestParam + "&selectedPartnerCompanyIds=" + partnerCompanyIdsRequestParam + "&searchKey=" + searchKeyRequestParm
			+ "&partnerTeamMemberGroupFilter=" + partnerTeamMemberGroupFilterRequestParm
			+ "&fromDateFilterInString=" + fromDateFilterRequestParam + "&toDateFilterInString=" + toDateFilterRequestParam + timeZoneRequestParm;
		this.referenseService.openWindowInNewTab(url);
	}
	

}
