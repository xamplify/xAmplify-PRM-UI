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
import { RouterUrlConstants } from 'app/constants/router-url.contstants';

declare var $:any,swal:any;
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
	campaignTitle = "";
	statusCode = 0;
	userIdParameter = "";
	/**XNFR-735**/
	isFromContactDetails:boolean = false;
	userListId:any;
	isFromCompanyModule: boolean = false;
	isFromEditContacts: boolean;
	constructor(private utilService: UtilService,private route: ActivatedRoute,private campaignService:CampaignService,public sortOption: SortOption, public listLoader: HttpRequestLoader, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
		this.tilesLoader = true;
		this.startLoaders();
		this.userIdParameter = this.referenceService.decodePathVariable(this.route.snapshot.params['userId']);
		if(this.userIdParameter!=undefined){
			this.pagination.userId = parseInt(this.userIdParameter);
		}
		let analyticsCampaignIdParam = this.referenceService.decodePathVariable(this.route.snapshot.params['analyticsCampaignId']);
		this.campaignTitle = this.route.snapshot.params['campaignTitle'];
		if(analyticsCampaignIdParam!=undefined){
			this.analyticsCampaignId = parseInt(analyticsCampaignIdParam);
		}
		this.userType = this.route.snapshot.params['type'];
		this.navigatedFrom = this.route.snapshot.params['navigatedFrom'];
		this.previousRouterAlias = this.userType;
		if(this.userType=="pa" || this.userType=="pm"){
			this.userType = "p";
		}
		if(this.analyticsCampaignId!=undefined){
			this.validateCampaignIdAndUserId(this.analyticsCampaignId,this.pagination.userId);
		}else{
			this.validatePartnerOrContactIdForCampaignAnalytics();
		}
		if (this.navigatedFrom == "cd" || this.navigatedFrom == "ccd" || this.navigatedFrom == "mcd" || this.navigatedFrom == "mccd") {
			this.userListId = this.referenceService.decodePathVariable(this.route.snapshot.params['userListId']);
			this.isFromContactDetails = true;
			if (this.navigatedFrom == "ccd") {
				this.isFromCompanyModule = true;
			}
			if (this.navigatedFrom == "cd" || this.navigatedFrom == "ccd") {
				this.isFromEditContacts = true;
			}
		}
	}

	validatePartnerOrContactIdForCampaignAnalytics(){
		this.campaignService.validatePartnerOrContactIdForCampaignAnalytics(this.pagination.userId,this.userType).
		subscribe(
			response=>{
				if(response.statusCode==200){
					this.getCompanyId();
				}else{
					this.referenceService.goToPageNotFound();
				}
			},error=>{
				this.xtremandLogger.errorPage(error);
			}
		)
	}

	validateCampaignIdAndUserId(campaignId:number,userId:number){
		this.campaignService.validateCampaignIdAndUserId(campaignId,userId).subscribe(
			response=>{
				if(response.statusCode==200){
					this.getCompanyId();
				}else{
					this.referenceService.goToPageNotFound();
				}
			},error=>{
				this.xtremandLogger.errorPage(error);
			}
		);
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
					this.showErrorPage(error);
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
		  if(this.userDetails!=undefined){
			let fullName = this.userDetails.fullName;
			let emailId = this.userDetails.emailId;
			if(fullName!=undefined && fullName!="" && fullName!=null){
			  this.circleAlphabet = fullName.slice(0,1);
			}else{
			  this.circleAlphabet = emailId.slice(0,1);
			}
		  }
		}, error => {
			this.showErrorPage(error);
		},
		() => {
			this.getActiveAndTotalCampaignsCount();
		}
		);
	  }

	getActiveAndTotalCampaignsCount(){
		this.tilesLoader = true;
		this.campaignService.getActiveAndTotalCampaignsCount(this.loggedInUserCompanyId,this.pagination.userId).subscribe((result: any) => {
		  let data = result.data;
		  this.totalCampaignsCount = data.totalCampaignsCount;
		  this.activeCampaignsCount = data.activeCampaignsCount;
		  this.tilesLoader = false;
		}, error => {
		  this.showErrorPage(error);
		});
	}

showErrorPage(error:any){
	this.stopLoaders();
	this.xtremandLogger.log(error);
	this.xtremandLogger.errorPage(error);
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


	goToCampaignAnalytics(campaignId: any, campaignTitle: any) {
		if (this.isFromContactDetails) {
			let encodedCampaignId = this.referenceService.encodePathVariableInNewTab(campaignId);
			let encodedTitle = this.referenceService.getEncodedUri(campaignTitle);
			this.referenceService.openWindowInNewTab("/home/campaigns/" + encodedCampaignId + "/" + encodedTitle + "/details");
		} else {
			this.loading = true;
			let campaign = {};
			campaign['campaignId'] = campaignId;
			campaign['campaignTitle'] = campaignTitle;
			this.referenceService.goToCampaignAnalytics(campaign);
		}
	}
	
	viewTimeLine(campaignAnalytics:any){
		this.loading = true;
		let url  = "/home/campaigns/timeline/"+this.previousRouterAlias+"/"+this.referenceService.encodePathVariable(campaignAnalytics.campaignId)+"/"+this.referenceService.encodePathVariable(this.pagination.userId);
		if (this.isFromContactDetails) {
			let userListId = this.referenceService.encodePathVariable(this.userListId);
			this.referenceService.goToRouter(url+"/c/l"+"/"+userListId+"/"+this.navigatedFrom);
		}else if(this.navigatedFrom!=undefined&& this.analyticsCampaignId==undefined){
			this.referenceService.goToRouter(url+"/"+this.navigatedFrom);
		}else if(this.analyticsCampaignId!=undefined && this.navigatedFrom!=undefined){
			this.referenceService.goToRouter(url+"/"+this.navigatedFrom+"/"+this.referenceService.encodePathVariable(this.analyticsCampaignId)+"/"+this.referenceService.getEncodedUri(campaignAnalytics.campaignTitle));
		}else{
			this.referenceService.goToRouter(url+"/"+this.referenceService.getEncodedUri(campaignAnalytics.campaignTitle));
		}
		
	}
	goBack(){
		this.loading = true;
		let url = "/home/";
		let manageCampaignsUrl = url+"campaigns/manage";
		let encodedCampaignId = this.referenceService.encodePathVariable(this.analyticsCampaignId);
		let campaignAnalyticsUrl = "";
		if(this.campaignTitle!=undefined && this.campaignTitle.length>0){
			console.log("329");
			campaignAnalyticsUrl = url+"/campaigns/"+ encodedCampaignId + "/"+this.campaignTitle+ "/details";
		}else{
			console.log("322");
			campaignAnalyticsUrl = url+"/campaigns/"+ encodedCampaignId + "/details";
		}
		console.log(this.previousRouterAlias);
		if(this.previousRouterAlias=="pa"){
			url = url+"partners/add";
			this.referenceService.goToRouter(url);
		}else if(this.previousRouterAlias=="pm"){
			url = url+"partners/";
			this.referenceService.goToRouter(url+"manage");
		}else if(this.previousRouterAlias=="p"){
			this.referenceService.goToRouter(manageCampaignsUrl);
		}else if(this.previousRouterAlias=="c"){
			if(this.navigatedFrom=="a"){
				this.referenceService.goToRouter(manageCampaignsUrl);
			}else if(this.navigatedFrom=="b"){
				this.referenceService.goToRouter(manageCampaignsUrl);
				//this.referenceService.goToRouter(campaignAnalyticsUrl);
			} else if (this.isFromContactDetails) {
				let encodedUserListId = this.referenceService.encodePathVariable(this.userListId);
				let encodeUserId = this.referenceService.encodePathVariable(this.userIdParameter);
				if (this.isFromCompanyModule) {
					let url = RouterUrlConstants.home + RouterUrlConstants.contacts + RouterUrlConstants.company + RouterUrlConstants.editContacts + RouterUrlConstants.details + encodedUserListId + "/" + encodeUserId;
					this.referenceService.goToRouter(url);
				} else {
					let url = RouterUrlConstants.home + RouterUrlConstants.contacts;
					url += this.isFromEditContacts ? RouterUrlConstants.editContacts + RouterUrlConstants.details + encodedUserListId + "/" + encodeUserId : RouterUrlConstants.manage + '/' + RouterUrlConstants.details + encodedUserListId + "/" + encodeUserId;
					this.referenceService.goToRouter(url);
				}
			} else{
				url = url+"contacts/";
				this.referenceService.goToRouter(url+"manage");
			}
	   }else if (this.previousRouterAlias == "sl") {
		if (this.navigatedFrom == "a") {
			this.referenceService.goToRouter(manageCampaignsUrl);
		} else if (this.navigatedFrom == "b") {
			this.referenceService.goToRouter(manageCampaignsUrl);
			//this.referenceService.goToRouter(campaignAnalyticsUrl); Campaign Title Should Be Get From Campaign Id
		} else {
			url = url + "sharedleads/";
			this.referenceService.goToRouter(url + "manage");
		}
   }
	}
	
}

