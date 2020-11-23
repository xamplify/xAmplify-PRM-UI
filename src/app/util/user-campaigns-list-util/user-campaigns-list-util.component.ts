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

declare var $,swal:any;
@Component({
	selector: 'app-user-campaigns-list-util',
	templateUrl: './user-campaigns-list-util.component.html',
	styleUrls: ['./user-campaigns-list-util.component.css'],
	providers: [HttpRequestLoader, SortOption, Properties]
})
export class UserCampaignsListUtilComponent implements OnInit {

	pagination: Pagination = new Pagination();
	autoResponseAnalyticsPagination: Pagination = new Pagination();
	loggedInUserCompanyId: number = 0;
	loggedInUserId: number = 0;
	loading = false;
	tilesLoader = false;
	selectedContactDetails:any;
	tileClass = "col-sm-4 col-xs-8 col-lg-4 col-md-4";
	totalCampaignsCount:number;
	activeCampaignsCount:number;
	userType:string = "";
	userDetails:any;
	circleAlphabet = "";
	campaignAnalytics:Array<any> = new Array<any>();
	autoResponeAnalyticsLoader: HttpRequestLoader = new HttpRequestLoader();
	colspanValue: number = 7;
	selectedCampaignTypeIndex = 0;
	previousRouterAlias = "";
	navigatedFrom = "";
	analyticsCampaignId: number;
	constructor(private utilService: UtilService,private route: ActivatedRoute,private campaignService:CampaignService,public sortOption: SortOption, public listLoader: HttpRequestLoader, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
		this.tilesLoader = true;
		this.startLoaders();
		this.pagination.userId = parseInt(this.route.snapshot.params['userId']);
		let analyticsCampaignIdParam = this.route.snapshot.params['analyticsCampaignId'];
		if(analyticsCampaignIdParam!=undefined){
			this.analyticsCampaignId = parseInt(analyticsCampaignIdParam);
		}
		this.userType = this.route.snapshot.params['type'];
		this.navigatedFrom = this.route.snapshot.params['navigatedFrom'];
		this.previousRouterAlias = this.userType;
		if(this.userType=="pa" || this.userType=="pm"){
			this.userType = "p";
		}
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
						this.getUserDetailsFromUserList();
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
		this.tilesLoader = false;
		this.referenceService.loading(this.listLoader, false);
	}

	filterCampaigns(type: string, index: number) {
        this.selectedCampaignTypeIndex = index;//This is to highlight the tab
        this.pagination.pageIndex = 1;
		this.pagination.campaignType = type;
        this.listCampaignAnalytics(this.pagination);
	}
	
	listCampaignAnalytics(pagination: Pagination) {
		this.referenceService.goToTop();
		this.startLoaders();
		this.campaignService.analyticsByUserId(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
				this.totalCampaignsCount = data.totalCampaignsCount;
				this.activeCampaignsCount = data.activeCampaignsCount;
				pagination.totalRecords = data.totalRecords;
				this.campaignAnalytics = data.campaignAnalytics;
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

	getUserDetailsFromUserList() {
		this.tilesLoader = true;
		this.campaignService.getUserDetailsFromUserList(this.loggedInUserCompanyId,this.pagination.userId,this.userType).subscribe((result: any) => {
		  this.tilesLoader = false;
		  this.userDetails = result.data;
		  let fullName = this.userDetails.fullName;
		  let emailId = this.userDetails.emailId;
		  if(fullName!=undefined && fullName!="" && fullName!=null){
			this.circleAlphabet = fullName.slice(0,1);
		  }else{
			this.circleAlphabet = emailId.slice(0,1);
		  }
		}, error => {
		  this.stopLoaders();
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

  showAutoResponseAnalytics(campaign: any, selectedIndex: number) {
    this.autoResponseAnalyticsPagination = new Pagination();
    $.each(this.campaignAnalytics, function (index, row) {
      if (selectedIndex != index) {
        row.expanded = false;
      }
    });
    campaign.expanded = !campaign.expanded;
    if (campaign.expanded) {
      this.listAutoResponseAnalytics(this.autoResponseAnalyticsPagination, campaign);
    }
  }


setAutoResponsesPage(event: any,campaign:any) {
    this.autoResponseAnalyticsPagination.pageIndex = event.page;
    this.listAutoResponseAnalytics(this.autoResponseAnalyticsPagination,campaign);
  }


  listAutoResponseAnalytics(pagination: Pagination, campaign: any) {
    this.referenceService.loading(this.autoResponeAnalyticsLoader, true);
    this.autoResponseAnalyticsPagination.campaignId = campaign.campaignId;
	this.autoResponseAnalyticsPagination.userId = this.pagination.userId;
    this.campaignService.listAutoResponseAnalytics(pagination)
      .subscribe(
        response => {
          let data = response.data;
          pagination.totalRecords = data.totalRecords;
          let analyticsList = data.data;
          $.each(analyticsList, function (index, autoResponse) {
            autoResponse.displayTime = new Date(autoResponse.sentTimeUtcString);
            if (autoResponse.openedTimeUtcString != "-") {
              autoResponse.openedTime = new Date(autoResponse.openedTimeUtcString);
            }
          });
          pagination = this.pagerService.getPagedItems(pagination, analyticsList);
          this.referenceService.loading(this.autoResponeAnalyticsLoader, false);
        },
        error => {
          swal("Oops! Something went wrong", "Please try after sometime", "error");
          this.referenceService.loading(this.autoResponeAnalyticsLoader, false);
        },
        () => this.xtremandLogger.info("Finished showAutoResponseAnalytics()")
      );
  }


	goToCampaignAnalytics(campaignId:number){
		this.loading = true;
		this.referenceService.goToRouter("home/campaigns/"+campaignId+"/details");
	}
	
	viewTimeLine(campaignAnalytics:any){
		this.loading = true;
		let url  = "/home/campaigns/timeline/"+this.previousRouterAlias+"/"+campaignAnalytics.campaignId+"/"+this.pagination.userId;
		if(this.navigatedFrom!=undefined&& this.analyticsCampaignId==undefined){
			this.referenceService.goToRouter(url+"/"+this.navigatedFrom);
		}else if(this.analyticsCampaignId!=undefined && this.navigatedFrom!=undefined){
			this.referenceService.goToRouter(url+"/"+this.navigatedFrom+"/"+this.analyticsCampaignId);
		}else{
			this.referenceService.goToRouter(url);
		}
		
		
	}
	goBack(){
		this.loading = true;
		let url = "/home/";
		let manageCampaignsUrl = url+"campaigns/manage";
		let campaignAnalyticsUrl = url+"/campaigns/"+this.analyticsCampaignId+"/details";
		if(this.previousRouterAlias=="pa"){
			url = url+"partners/add";
			this.referenceService.goToRouter(url);
		}else if(this.previousRouterAlias=="pm"){
			url = url+"partners/";
			this.referenceService.goToRouter(url+"manage");
		}else if(this.previousRouterAlias=="p"){
			if(this.navigatedFrom=="a"){
				this.referenceService.goToRouter(manageCampaignsUrl);
			}else if(this.navigatedFrom=="b"){
				this.referenceService.goToRouter(campaignAnalyticsUrl);
			}
		}else if(this.previousRouterAlias=="c"){
			if(this.navigatedFrom=="a"){
				this.referenceService.goToRouter(manageCampaignsUrl);
			}else if(this.navigatedFrom=="b"){
				this.referenceService.goToRouter(campaignAnalyticsUrl);
			}else{
				url = url+"contacts/";
				this.referenceService.goToRouter(url+"manage");
			}
			
	   }
	}
	
}

