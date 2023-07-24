import { Component, OnInit, Input } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { ParterService } from 'app/partners/services/parter.service';
import { ListLoaderValue } from '../../common/models/list-loader-value';

@Component({
  selector: 'app-active-partners-table',
  templateUrl: './active-partners-table.component.html',
  styleUrls: ['./active-partners-table.component.css']
})
export class ActivePartnersTableComponent implements OnInit {
  @Input() applyFilter:boolean;
  loggedInUserId: number = 0;
  searchKey: string = "";
	pagination: Pagination = new Pagination();
	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

  constructor(public listLoaderValue: ListLoaderValue, public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService,
    public xtremandLogger: XtremandLogger) {
      this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
		this.getActivePartners();
  }

  getActivePartners() {
		this.referenseService.loading(this.httpRequestLoader, true);
		this.pagination.userId = this.loggedInUserId;
    this.parterService.getActivePartners(this.pagination).subscribe(
			(response: any) => {				
				this.pagination.totalRecords = response.totalRecords;
				this.pagination = this.pagerService.getPagedItems(this.pagination, response.activePartnesList);
				this.referenseService.loading(this.httpRequestLoader, false);
			},
			(_error: any) => {
			}
		);
  }

  activePartnerSearch(keyCode: any) { if (keyCode === 13) { this.searchActivePartnerAnalytics(); } }

	searchActivePartnerAnalytics() {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.searchKey;
		this.getActivePartners();
	}

  setPage(event:any) {
		this.pagination.pageIndex = event.page;
		this.getActivePartners();
	}

}
