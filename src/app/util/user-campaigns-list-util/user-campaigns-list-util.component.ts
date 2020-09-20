import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/*****Common Imports**********************/
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Properties } from '../../common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { UtilService } from '../../core/services/util.service';

declare var $:any;
@Component({
	selector: 'app-user-campaigns-list-util',
	templateUrl: './user-campaigns-list-util.component.html',
	styleUrls: ['./user-campaigns-list-util.component.css'],
	providers: [HttpRequestLoader, SortOption, Properties]
})
export class UserCampaignsListUtilComponent implements OnInit {

	pagination: Pagination = new Pagination();
	loggedInUserCompanyId: number = 0;
	loggedInUserId: number = 0;
	loading = false;

	constructor(private utilService: UtilService,private route: ActivatedRoute,private campaignService:CampaignService,public sortOption: SortOption, public listLoader: HttpRequestLoader, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
		this.startLoaders();
		this.pagination.userId = parseInt(this.route.snapshot.params['userId']);
		this.getCompanyId();
	}
	getCompanyId() {
		if (this.loggedInUserId != undefined && this.loggedInUserId > 0) {
			this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
				(result: any) => {
					if (result !== "") {
						this.loggedInUserCompanyId = result;
					} else {
						this.stopLoaders();
						this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
						this.router.navigate(["/home/dashboard"]);
					}
				}, (error: any) => {
					this.stopLoaders();
					this.xtremandLogger.log(error);
					this.xtremandLogger.errorPage(error);
				},
				() => {
					if (this.loggedInUserCompanyId != undefined && this.loggedInUserCompanyId > 0) {
						this.pagination.companyId = this.loggedInUserCompanyId;
						this.listCampaignAnalytics(this.pagination);
					}
				}
			);
		} else {
			this.stopLoaders();
			this.referenceService.showSweetAlertErrorMessage('UserId Not Found.Please try aftersometime');
			this.router.navigate(["/home/dashboard"]);
		}

	}
	startLoaders() {
		this.loading = true;
		this.referenceService.loading(this.listLoader, true);
	}
	stopLoaders() {
		this.loading = false;
		this.referenceService.loading(this.listLoader, false);
	}

	listCampaignAnalytics(pagination: Pagination) {
		this.startLoaders();
		this.campaignService.analyticsByUserId(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
				pagination.totalRecords = data.totalRecords;
				$.each(data.campaignAnalytics,function(index:number,campaign:any){
					campaign.launchedDisplayTime = new Date(campaign.launchTimeInUTCString);
					if(campaign.latestViewInUTCString!=""){
						campaign.latestViewDisplayTime = new Date(campaign.latestViewInUTCString);
					}else{
						campaign.latestViewDisplayTime  = "-";
					}
				});
				pagination = this.pagerService.getPagedItems(pagination, data.campaignAnalytics);
			}
			this.stopLoaders();
		}, error => {
			this.xtremandLogger.log(error);
			this.xtremandLogger.errorPage(error);
		});
	}


	 /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy(text: any) {
    this.sortOption.userLevelCampaignAnalyticsSortOption = text;
    this.getAllFilteredResults();
  }


  /*************************Search********************** */
  searchCampaigns() {
    this.getAllFilteredResults();
  }

  paginationDropdown(items: any) {
    this.sortOption.itemsSize = items;
    this.getAllFilteredResults();
  }

  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listCampaignAnalytics(this.pagination);
  }

  getAllFilteredResults() {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.userLevelCampaignAnalyticsSortOption, this.pagination);
    this.listCampaignAnalytics(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchCampaigns(); } }
  /********************Pagaination&Search Code*****************/

	showAutoResponseAnalytics(campaignAnalytics:any,index:number){

	}
}
