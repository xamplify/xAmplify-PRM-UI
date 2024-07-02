import { Component, OnInit,Input } from '@angular/core';
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
import { CustomResponse } from '../../common/models/custom-response';

@Component({
  selector: 'app-processing-campaigns',
  templateUrl: './processing-campaigns.component.html',
  styleUrls: ['./processing-campaigns.component.css','../admin-report/admin-report.component.css'],
  providers: [Pagination, HttpRequestLoader, Properties, SortOption]
})
export class ProcessingCampaignsComponent implements OnInit {
  @Input() scheduledCampaigns = false;
  pagination: Pagination = new Pagination();
  loading = false;
  apiError: boolean;
  customResponse:CustomResponse = new CustomResponse();
  header = "";
  collapsableDivId = "";
  constructor(public dashboardService: DashboardService, public referenceService: ReferenceService,
		public httpRequestLoader: HttpRequestLoader,
		public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router,
		public logger: XtremandLogger, public sortOption: SortOption) {
		if (this.authenticationService.getUserId() != 1) {
			this.router.navigate(['/access-denied']);
		}
	}


  ngOnInit() {
    if(this.scheduledCampaigns){
      this.pagination.archived = false;
      this.collapsableDivId = "collapsible-schedule-campaigns";
      this.header = "Scheduled Campaigns";
    }else{
      this.collapsableDivId = "collapsible-processing-campaigns";
      this.pagination.archived = true;
      this.header = "Processing Campaigns";
    }
    this.findProcessingCampaigns(this.pagination);
  }



  findProcessingCampaigns(pagination:Pagination){
	  this.customResponse = new CustomResponse();
    this.apiError = false;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dashboardService.findProcessingCampaigns(pagination).
    subscribe(
      response=>{
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
		    pagination = this.pagerService.getPagedItems(pagination, data.list);
        this.stopLoaders();
      },error=>{
        this.stopLoaders();
      }
    )
  }

  stopLoaders(){
    this.apiError = false;
    this.referenceService.loading(this.httpRequestLoader, false);
    this.loading = false;
  }

  /*************************Search********************** */
	search() {
		this.getAllFilteredResults();
	}

	/************Page************** */
	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.findProcessingCampaigns(this.pagination);
	}

	getAllFilteredResults() {
		this.pagination.pageIndex = 1;
		this.findProcessingCampaigns(this.pagination);
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
	refreshList() {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = "";
		this.findProcessingCampaigns(this.pagination);
	}

	

	


}
