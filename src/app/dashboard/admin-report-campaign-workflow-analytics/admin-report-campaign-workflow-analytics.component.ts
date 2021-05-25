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
declare var $:any;
@Component({
  selector: 'app-admin-report-campaign-workflow-analytics',
  templateUrl: './admin-report-campaign-workflow-analytics.component.html',
  styleUrls: ['./admin-report-campaign-workflow-analytics.component.css'],
  providers: [HttpRequestLoader,Properties,SortOption,Pagination]
})
export class AdminReportCampaignWorkflowAnalyticsComponent implements OnInit {

  pagination:Pagination = new Pagination();
  years:Array<any> = new Array<any>();
  selectedYear:any;
  selectedMonth:any;
  ngxLoading = false;
  constructor(public dashboardService: DashboardService, public referenceService: ReferenceService,
		public httpRequestLoader: HttpRequestLoader,
		public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router,
		public logger: XtremandLogger, public sortOption: SortOption, private utilService: UtilService) {
		if (this.authenticationService.getUserId() != 1) {
			this.router.navigate(['/access-denied']);
		}
	}

  ngOnInit() {
    this.getCurrentMonthAndYear();
    this.findWorkflowDetails(this.pagination);
  }

  findWorkflowDetails(pagination: Pagination) {
    this.ngxLoading = true;
    this.referenceService.goToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.categoryId = $('#workFlowId option:selected').val();
    pagination.filterKey = this.selectedMonth+"-"+this.selectedYear;
		this.dashboardService.findWorkflowDetails(pagination).subscribe(
			(response: any) => {
				const data = response.data;
					pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          $.each(data.list, function (_index: number, list: any) {
            list.launchTimeInUTC = new Date(list.launchTime);
            list.replyTimeInUTC = new Date(list.replyTime);
          });
					pagination = this.pagerService.getPagedItems(pagination, data.list);
          this.referenceService.loading(this.httpRequestLoader, false);
          this.ngxLoading = false;
			},
			(error: any) => { 
         this.referenceService.loading(this.httpRequestLoader, false);
         this.ngxLoading = false;
       });
	}

/*********Pagination**********************/
  navigateBetweenPageNumbers(event:any){
    this.pagination.pageIndex = event.page;
		this.findWorkflowDetails(this.pagination);
  }


  getCurrentMonthAndYear(){
    let date = new Date();
    let currentMonth = date.getMonth()+1;
    var currentYear = date.getFullYear();
    $('#month').val(currentMonth);
    for(let i=0;i<3;i++){
      this.years.push(currentYear-i);
    }
    this.selectedYear = currentYear;
    this.selectedMonth = currentMonth;
  }

  filterByYear(event:any){
    this.pagination = new Pagination();
    this.pagination.filterKey = this.selectedMonth+"-"+event;
    this.getAllFilteredResults(this.pagination);
  }

  filterByMonth(event:any){
    this.pagination = new Pagination();
    this.pagination.filterKey = event+"-"+this.selectedYear;
    this.getAllFilteredResults(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
		pagination.searchKey = this.sortOption.searchKey;
		pagination = this.utilService.sortOptionValues(this.sortOption.selectedWorkflowSortDropDownOption, this.pagination);
		this.findWorkflowDetails(pagination);
  }

  refreshList() {
    this.pagination = new Pagination();
    this.sortOption = new SortOption();
		this.sortOption.selectedWorkflowSortDropDownOption = this.sortOption.workflowsSortDropDownOptions[this.sortOption.workflowsSortDropDownOptions.length-1];
		this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedWorkflowSortDropDownOption, this.pagination);
		this.findWorkflowDetails(this.pagination);
	}

  
  search() {
		this.getAllFilteredResults(this.pagination);
  }
  
  eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }

  sortBy(text: any) {
		this.sortOption.selectedWorkflowSortDropDownOption = text;
		this.getAllFilteredResults(this.pagination);
	}

  findAnalyticsByWorkflowId(workflow:any){
    this.ngxLoading = true;
    
  }


}
