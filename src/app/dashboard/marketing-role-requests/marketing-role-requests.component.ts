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
import { CustomResponse } from '../../common/models/custom-response';
import { SweetAlertParameterDto } from 'app/common/models/sweet-alert-parameter-dto';

declare var $:any, swal: any;
@Component({
  selector: 'app-marketing-role-requests',
  templateUrl: './marketing-role-requests.component.html',
  styleUrls: ['./marketing-role-requests.component.css','../admin-report/admin-report.component.css'],
  providers: [Pagination, HttpRequestLoader, Properties, SortOption]
})
export class MarketingRoleRequestsComponent implements OnInit {

  pagination: Pagination = new Pagination();
  loading = false;
  apiError: boolean;
  selectedFilterIndex = 0;
  customResponse:CustomResponse = new CustomResponse();
  sweetAlertParameterDto:SweetAlertParameterDto = new SweetAlertParameterDto();
  upgradeButtonClicked = false;
  selectedRequestId = 0;
  constructor(public dashboardService: DashboardService, public referenceService: ReferenceService,
		public httpRequestLoader: HttpRequestLoader,
		public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router,
		public logger: XtremandLogger, public sortOption: SortOption) {
		if (this.authenticationService.getUserId() != 1) {
			this.router.navigate(['/access-denied']);
		}
	}


  ngOnInit() {
    this.findRequests(this.pagination);
  }



  findRequests(pagination:Pagination){
	this.upgradeButtonClicked = false;
	this.customResponse = new CustomResponse();
    this.apiError = false;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dashboardService.findRequests(pagination).
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
		this.findRequests(this.pagination);
	}

	getAllFilteredResults() {
		this.pagination.pageIndex = 1;
		this.findRequests(this.pagination);
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
	refreshList() {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = "";
		this.findRequests(this.pagination);
	}

	filterRequests(index: number, type: string) {
		this.selectedFilterIndex = index;
		this.pagination.filterKey = type;
		this.pagination.pageIndex = 1;
		this.findRequests(this.pagination);
	}

	upgrade(requestId:number){
		this.selectedRequestId = requestId;
		this.upgradeButtonClicked = true;
		this.sweetAlertParameterDto.text="This account will be upgraded to Marketing";
		this.sweetAlertParameterDto.confirmButtonText = "Yes";
	}
	receiveEvent(event:any){
		if(event){
			this.loading = true;
			this.customResponse = new CustomResponse();
			this.dashboardService.upgradeToMarketing(this.selectedRequestId).
			subscribe(
				response=>{
					this.loading = false;
					this.customResponse = new CustomResponse('SUCCESS',response.message,true);
					this.filterRequests(1,'approved');
				},error=>{
					this.loading = false;
					let errorMessage = this.referenceService.getApiErrorMessage(error);
					this.customResponse = new CustomResponse('ERROR',errorMessage,true);
					this.upgradeButtonClicked = false;
				}
			);
		}else{
			this.upgradeButtonClicked = false;
		}
	}

}
