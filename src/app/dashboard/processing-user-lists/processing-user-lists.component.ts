import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Properties } from '../../common/models/properties';
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
declare var $:any, swal: any;


@Component({
  selector: 'app-processing-user-lists',
  templateUrl: './processing-user-lists.component.html',
  styleUrls: ['./processing-user-lists.component.css','../admin-report/admin-report.component.css'],
  providers: [Pagination, HttpRequestLoader, Properties, SortOption]
})
export class ProcessingUserListsComponent implements OnInit {

  loading = false;
	hasError: boolean;
	statusCode: any;
	pagination: Pagination = new Pagination();
  processingUserLists:Array<any> = new Array<any>();

  constructor(public dashboardService: DashboardService, public referenceService: ReferenceService,
		public httpRequestLoader: HttpRequestLoader,
		public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router,
		public logger: XtremandLogger, public sortOption: SortOption, private utilService: UtilService) {
		if (this.authenticationService.getUserId() != 1) {
			this.router.navigate(['/access-denied']);
		}
	}

  ngOnInit() {
    this.findProcessingUserLists(this.pagination);
  }

  findProcessingUserLists(pagination:Pagination){
    this.hasError = false;
    this.referenceService.loading(this.httpRequestLoader, true);
		this.dashboardService.findProcessingUserLists(pagination).subscribe(
			(response: any) => {
				this.statusCode = response.statusCode;
				if (this.statusCode == 200) {
					const data = response.data;
					pagination.totalRecords = data.totalRecords;
					this.sortOption.totalRecords = data.totalRecords;
          this.processingUserLists = data.list;
				}
				this.referenceService.loading(this.httpRequestLoader, false);
			},
			(error: any) => { this.hasError = true; this.referenceService.loading(this.httpRequestLoader, false); });
		
  }

  /*************************Sort********************** */
	sortBy(text: any) {
		this.sortOption.selectedProcessingUserListsDropDownOption = text;
		this.getAllFilteredResults();
	}


	/*************************Search********************** */
	search() {
		this.getAllFilteredResults();
	}

  getAllFilteredResults() {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.sortOption.searchKey;
		this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedProcessingUserListsDropDownOption, this.pagination);
		this.findProcessingUserLists(this.pagination);
	}

}
