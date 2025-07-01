import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HomeComponent } from '../../core/home/home.component';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { User } from '../../core/models/user';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
import { ListLoaderValue } from '../../common/models/list-loader-value';
import { VendorInvitation } from '../../dashboard/models/vendor-invitation';
import { PartnerJourneyRequest } from '../models/partner-journey-request';
import { Properties } from 'app/common/models/properties';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { error } from 'console';
declare var $, swal, Highcharts, CKEDITOR: any;

@Component({
    selector: 'app-partner-reports',
    templateUrl: './partner-reports.component.html',
    styleUrls: ['./partner-reports.component.css'],
    providers: [Pagination, HomeComponent, HttpRequestLoader, SortOption, ListLoaderValue,Properties]
})
export class PartnerReportsComponent implements OnInit, OnDestroy {
    landingPage: any;
    worldMapdataReport: any;
    companyId: number;
    paginationType: string;
    campaignId: number;
    campaignsCount: number;
    throughPartnerCampaignsCount: number = 0;
    regularCampaign: number;
    socialCampaign: number;
    videoCampaign: number;
    noOfCampaignsLaunchedByPartner = [];
    partnerUserInteraction = [];
    selectedPartnerCompanyIds = [];
    campaignInteractionPagination: Pagination = new Pagination();
    activePartnersPagination: Pagination = new Pagination();
    inActivePartnersPagination: Pagination = new Pagination();
    approvePartnersPagination: Pagination = new Pagination();
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    activeParnterHttpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    campaignUserInteractionHttpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    throughPartnerCampaignPagination: Pagination = new Pagination();
    selectedTabIndex: number = 0;
    loggedInUserId: number = 0;
    activePartnersSearchKey: string = "";
    inActivePartnersSearchKey: string = "";
    partnerCampaignUISearchKey: string = "";
    inActivePartnersCount: number = 0;
    activePartnersCount: number = 0;
    approvePartnersCount: number = 0;
    isListView = false;
    isShowCKeditor = false;
    partnerId: number;
    isValidRequest = false;
    requestText: string;
    isError = false;
    customResponse: CustomResponse = new CustomResponse();
    vendoorInvitation: VendorInvitation = new VendorInvitation();
    worldMapLoader = false;
    barChartLoader = false;
    survey: boolean = false;
    throughPartnerCampaignsTabName: string = "Through Partner Campaigns";
    showFilterOption: boolean = false;
    fromDateFilter: any = "";
    toDateFilter: any = "";
    filterResponse: CustomResponse = new CustomResponse();
    filterMode: boolean = false;
    applyFilter = true;
    redistributedCampaignsCount = 0;
    reloadWithFilter = true;
    loadAllCharts = false;
    selectedItem : any;
    //XNFR-316
    showDetailedAnalytics = false;
    detailedAnalyticsPartnerCompany: any;
    selectedTrackType: any = "";
    selectedRegionName : any ="";
    selectedCampaignType: any = "";
    selectedAssetType: any = "";
    //XBI-1975
    isThroughPartnerDiv = false;
    isInactivePartnersDiv = false;
    isActivePartnerDiv = false;
    isRedistributePartnersDiv = false;
    isApprovePartnersDiv = false;
    PendingSignupPartnersCount: number = 0;
    companyProfileIncompletePartnersCount:number = 0;
    PendingSignupAndCompanyProfilePartnersLoader= false;
    isIncompleteCompanyProfileDiv = false;
    isSingUpPendingDiv = false;
    incompleteCompanyProfileAndPendingSingupPagination: Pagination = new Pagination();
    companyProfileIncompletePartnersList :any= [];

    selectedEmailTemplateId: any;
    sendTestEmailIconClicked: boolean;
    vanityTemplates : boolean = false;
    selectedEmailId: String;
  partnerfromDateFilter: any = "";
    partnertoDateFilter: any = "";
    totalPartnersCountLoader: boolean;
    totalPartnersCount: any;
	isHeaderCheckBoxChecked: boolean = false;
    isSendReminderEnabled: boolean = false;
    selectedPartnerIds: number[] = [];
    allItems: any[] = []; 
    selectedPartners : any;
    isTotalPartnerDiv = false;
    totalPartnersDiv: boolean = false;
    isPendingStatus = false;
    isDormantStatus = false;
    isIncompleteCompanyProfile = false;
    //XNFR-1006
    isdeactivatePartnersDiv: boolean = false;
    totalDeactivatePartnersCountLoader: boolean = false;
    totalDeactivatePartnersCount: any;
  constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService, public pagination: Pagination,
        public referenseService: ReferenceService, public parterService: ParterService, public pagerService: PagerService,
        public homeComponent: HomeComponent, public xtremandLogger: XtremandLogger, public campaignService: CampaignService, public sortOption: SortOption,
        public utilService: UtilService,private route: ActivatedRoute,public properties: Properties, private vanityURLService: VanityURLService) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.utilService.setRouterLocalStorage('partnerAnalytics');
        this.isListView = !this.referenseService.isGridView;
        this.getModuleAccess();
    }    
    gotoMange() {
        this.router.navigateByUrl('/home/partners/manage');
    }
    clickWorldMapReports(event) {
    }
    campaignTypeChart(data: any) {
        Highcharts.chart('campaign-type-chart', {
            chart: { type: 'bar',backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff" },
            xAxis: {
                categories: ['VIDEO CAMPAIGN','SOCIAL CAMPAIGN', 'EMAIL CAMPAIGN', 'EVENT CAMPAIGN','SURVEY CAMPAIGN'],
                lineWidth: 0,
                minorTickLength: 0,
                tickLength: 0,
                labels:{
                    style:{
                        color: this.authenticationService.isDarkForCharts ? "#fff" : "#666666"
                    }
                }
            },
            title: { text: '' },
            yAxis: {
                min: 0,
                visible: false,
                gridLineWidth: 0,
            },
            colors: ['#ffb600', '#be72d3', '#ff3879', '#357ebd','#00ffc8'],
            tooltip: {
                formatter: function () {
                    return 'Campaign Type: <b>' + this.point.category + '</b><br>Campaigns Count: <b>' + this.point.y;
                },
                backgroundColor: 'black', 
                style: {
                  color: '#fff' 
                }
            },
            plotOptions: { bar: { minPointLength: 3, dataLabels: { enabled: true }, colorByPoint: true } },
            exporting: { enabled: false },
            credits: { enabled: false },
            series: [{ showInLegend: false, data: data,
                dataLabels:{
                    style:{
                        color: this.authenticationService.isDarkForCharts ? "#fff" : "#000000",
                    }
            } }]
        });
        this.barChartLoader = false;
    }
    
    getPartnersRedistributedCampaignsData() {
        this.barChartLoader = true;
        let partnerJourneyRequest = new PartnerJourneyRequest();
        let partnershipStatus: any;
        partnerJourneyRequest.loggedInUserId = this.authenticationService.getUserId();
        partnerJourneyRequest.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
        partnerJourneyRequest.partnerTeamMemberGroupFilter = this.applyFilter;
         if(this.isActivePartnerDiv){
         partnershipStatus = 'approved';
         } else if (this.isdeactivatePartnersDiv) {
          partnershipStatus = 'deactivated';
         }
         partnerJourneyRequest.partnershipStatus = partnershipStatus;
        this.parterService.partnersRedistributedCampaignsData(partnerJourneyRequest).subscribe(
            (data: any) => {
                const campaignData = [];
                campaignData.push(data.partnersLaunchedCampaignsByCampaignType.VIDEO);
                campaignData.push(data.partnersLaunchedCampaignsByCampaignType.SOCIAL);
                campaignData.push(data.partnersLaunchedCampaignsByCampaignType.REGULAR);
                campaignData.push(data.partnersLaunchedCampaignsByCampaignType.EVENT);
                campaignData.push(data.partnersLaunchedCampaignsByCampaignType.SURVEY);
                this.campaignTypeChart(campaignData);
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.barChartLoader = false;
            });
    }
    /*********Active Partner  Analytics***********/
    getActivePartnerReports() {
        this.referenseService.loading(this.activeParnterHttpRequestLoader, true);
        this.activePartnersPagination.userId = this.loggedInUserId;
        if (this.authenticationService.isSuperAdmin()) {
            this.activePartnersPagination.userId = this.authenticationService.checkLoggedInUserId(this.activePartnersPagination.userId);
        }
        this.paginationType = 'ActivePartnerPagination';
        this.activePartnersPagination.maxResults = 3;
        this.parterService.getActivePartnersAnalytics(this.activePartnersPagination).subscribe(
            (response: any) => {
                for (var i in response.activePartnesList) {
                    response.activePartnesList[i].contactCompany = response.activePartnesList[i].partnerCompanyName;
                }
                this.activePartnersPagination.totalRecords = response.totalRecords;
                this.activePartnersPagination = this.pagerService.getPagedItems(this.activePartnersPagination, response.activePartnesList);
                this.referenseService.loading(this.activeParnterHttpRequestLoader, false);
            },
            (error: any) => {  });
    }

    searchActivePartnerAnalytics() {
        this.activePartnersPagination.pageIndex = 1;
        this.activePartnersPagination.searchKey = this.activePartnersSearchKey;
        this.getActivePartnerReports();
    }


    partnerUserInteractionReports() {
        this.referenseService.loading(this.campaignUserInteractionHttpRequestLoader, true);
        this.paginationType = 'userInteraction';
        this.parterService.partnerUserInteractionReports(this.loggedInUserId, this.pagination).subscribe(
            (data: any) => {
                this.pagination.totalRecords = data.totalRecords;
                this.partnerUserInteraction = data.data;
                for (var i in this.partnerUserInteraction) {
                    this.partnerUserInteraction[i].contactCompany = this.partnerUserInteraction[i].companyName;
                }
              
                this.pagination = this.pagerService.getPagedItems(this.pagination, data.data);
                this.referenseService.loading(this.campaignUserInteractionHttpRequestLoader, false);
            },
            (error: any) => {  });
    }
    searchInPartnerCampaignsUI() {
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.partnerCampaignUISearchKey;
        this.partnerUserInteractionReports();


    }

    partnerCampaignInteraction(campaignId: number) {
        this.campaignId = campaignId;
        this.paginationType = 'partnerInteraction';
        this.parterService.partnerCampaignInteraction(this.campaignId, this.campaignInteractionPagination).subscribe(
            (data: any) => {
                this.campaignInteractionPagination.totalRecords = data.message.totalRecords;
                this.campaignInteractionPagination = this.pagerService.getPagedItems(this.campaignInteractionPagination, data.message.data);
                $('#campaignInteractionModal').modal('show');
            },
            (error: any) => {  });
    }

    setPage(event) {
        if (event.type === 'userInteraction') {
            this.pagination.pageIndex = event.page;
            this.listRedistributedThroughPartnerCampaigns(this.pagination);
        } else if (event.type === 'partnerInteraction') {
            this.campaignInteractionPagination.pageIndex = event.page;
            this.partnerCampaignInteraction(this.campaignId);
        }
        else if (event.type === 'ActivePartnerPagination') {
            this.activePartnersPagination.pageIndex = event.page;
            this.getActivePartnerReports();
        }
    }
    closeModalPopUp() {
        this.paginationType = 'userInteraction';
        this.campaignInteractionPagination = new Pagination();
    }
    totalActivePartners(event) {
        this.activePartnersPagination = event;
        this.getActivePartnerReports();
    }
    paginationDropdown(event) {
        if (this.paginationType == 'userInteraction') {
            this.pagination = event;
            this.listRedistributedThroughPartnerCampaigns(this.pagination);
        } else if (this.paginationType === 'partnerInteraction') {
            this.campaignInteractionPagination = event;
            this.partnerCampaignInteraction(this.campaignId);
        }
    }
    activePartnerSearch(keyCode: any) { if (keyCode === 13) { this.searchActivePartnerAnalytics(); } }
    inActivePartnersSearch(keyCode: any) { if (keyCode === 13) { this.searchInActivePartnerAnalytics(); } }
    searchPartnerCampaignKeyPress(keyCode: any, value: string) { if (keyCode === 13) { this.searchPartnerCampaigns(value); } }
    inCompleteCompanyProfileSignupPendingPartnersSearch(keyCode: any) { if (keyCode === 13) { this.searchCompanyProfileIncompleteAndSignupPendingPartnerAnalytics(); } }



    goToActivePartnersDiv() {
        this.reloadWithFilter = false;
        this.loadAllCharts = true;
        this.sortOption = new SortOption();
        this.selectedTabIndex = 0;
        this.campaignUserInteractionHttpRequestLoader = new HttpRequestLoader();
        this.pagination = new Pagination();
        //XBI-1975
        this.isThroughPartnerDiv = false;
        this.isInactivePartnersDiv = false;
        this.isActivePartnerDiv = true;
        this.isRedistributePartnersDiv = false;
        this.isApprovePartnersDiv = false;
        this.isIncompleteCompanyProfileDiv = false;
        this.isSingUpPendingDiv = false;
        this.totalPartnersDiv = false;
        this.isAllPartners = false; //XNFR-1015
        this.isdeactivatePartnersDiv = false;
        this.getActivePartnerReports();
        this.loadCountryData();
        setTimeout(() => {
             this.getPartnersRedistributedCampaignsData();
             this.reloadWithFilter = true;
             this.loadAllCharts = false;
        }, 500);
        this.totalPartnersDiv = false;
        this.isAllPartners = false; //XNFR-1015
        this.allPartnersStatusForMail();

    }
    goToAllPartnersDiv(){
        this.totalPartnersDiv = true;
        this.isAllPartners = false; //XNFR-1015
         this.loadAllCharts = false;
        this.selectedTabIndex = 8;
         this.isThroughPartnerDiv = false;
         this.isInactivePartnersDiv = false;
         this.isActivePartnerDiv = false;
         this.isRedistributePartnersDiv = false;
         this.isApprovePartnersDiv = false;
         this.isIncompleteCompanyProfileDiv = false;
         this.isSingUpPendingDiv = false;
         this.isdeactivatePartnersDiv = false;
         this.allPartnersStatusForMail();
    }
    
    
    /****************************Through Partner Analytics**************************/
    goToThroughPartnersDiv() {
        this.throughPartnerCampaignPagination = new Pagination();
        this.getModuleAccess();
        this.sortOption = new SortOption();
        this.selectedTabIndex = 3;
        //XBI-1975
        this.isThroughPartnerDiv = true;
        this.isInactivePartnersDiv = false;
        this.isActivePartnerDiv = false;
        this.isRedistributePartnersDiv = false;
        this.isApprovePartnersDiv = false;
        this.isIncompleteCompanyProfileDiv = false;
        this.isSingUpPendingDiv = false;
        this.totalPartnersDiv = false;
        this.isAllPartners = false; //XNFR-1015
        this.isdeactivatePartnersDiv = false;

        this.throughPartnerCampaignPagination.throughPartnerAnalytics = true;
        this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);
        this.allPartnersStatusForMail();
    }

    /***************************Re Distributed**************************/
    goToReDistributedPartnersDiv() {
        this.sortOption = new SortOption();
        this.selectedTabIndex = 2;
        this.pagination.maxResults = 12;
        //XBI-1975
        this.isThroughPartnerDiv = false;
        this.isInactivePartnersDiv = false;
        this.isActivePartnerDiv = false;
        this.isRedistributePartnersDiv = true;
        this.isApprovePartnersDiv = false;
        this.isIncompleteCompanyProfileDiv = false;
        this.isSingUpPendingDiv = false;
        this.totalPartnersDiv = false;
        this.isAllPartners = false; //XNFR-1015
        this.isdeactivatePartnersDiv = false;
        this.allPartnersStatusForMail();
    }


    listThroughPartnerCampaigns(pagination: Pagination) {
        if(this.isListView){
        pagination.campaignViewType = "list";
        }else{
        pagination.campaignViewType = "grid";
        }
    
        this.referenseService.loading(this.httpRequestLoader, true);
        this.campaignService.listCampaign(pagination, this.loggedInUserId)
            .subscribe(
                data => {
                    $.each(data.campaigns, function (index, campaign) {
                        campaign.displayTime = new Date(campaign.utcTimeInString);
                        campaign.createdDate = new Date(campaign.createdDate);
                    });
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                    this.referenseService.loading(this.httpRequestLoader, false);
                },
                error => {
                    this.xtremandLogger.errorPage(error);
                },
                () => this.xtremandLogger.info("Finished listThroughPartnerCampaigns()")
            );
    }


    filterCampaigns(type: string, index: number) {
        this.sortOption.selectedCampaignTypeIndex = index;//This is to highlight the tab
        this.throughPartnerCampaignPagination.pageIndex = 1;
        this.throughPartnerCampaignPagination.campaignType = type;
        this.throughPartnerCampaignPagination.maxResults = 12;
        this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);

    }

    setPartnerCampaignsPageByType(event: any, type: string) {
        if ("through-partner" == type) {
            this.throughPartnerCampaignPagination.pageIndex = event.page;
            this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);
        } else if ("partner-campaign-details" == type) {
            this.pagination.pageIndex = event.page;
            this.listRedistributedThroughPartnerCampaigns(this.pagination);
        }

    }

    searchPartnerCampaigns(type: string) {
        if ("through-partner" == type) {
            this.getAllFilteredResults(this.throughPartnerCampaignPagination, type);
        } else if ("partner-campaign-details" == type) {
            this.getAllFilteredResults(this.pagination, type);
        }

    }

    getSortedResultForPartnerCampaigns(text: any, type: string) {
        this.sortOption.selectedSortedOption = text;
        if ("through-partner" == type) {
            this.getAllFilteredResults(this.throughPartnerCampaignPagination, type);
        } else if ("partner-campaign-details" == type) {
            this.getAllFilteredResults(this.pagination, type);
        }

    }

    getNumberOfItemsPerPageByType(items: any, type: any) {
        this.sortOption.itemsSize = items;
        if ("through-partner" == type) {
            this.getAllFilteredResults(this.throughPartnerCampaignPagination, type);
        } else if ("partner-campaign-details" == type) {
            this.getAllFilteredResults(this.pagination, type);
        }

    }

    getAllFilteredResults(pagination: Pagination, type: string) {
        pagination.pageIndex = 1;
        pagination.searchKey = this.sortOption.searchKey;
        if (this.sortOption.itemsSize.value == 0) {
            pagination.maxResults = pagination.totalRecords;
        } else {
            pagination.maxResults = this.sortOption.itemsSize.value;
        }
        if ("through-partner" == type) {
            let sortedValue = this.sortOption.selectedSortedOption.value;
            this.setSortColumns(pagination, sortedValue);
            this.listThroughPartnerCampaigns(pagination);
        } else if ("partner-campaign-details" == type) {
            let sortedValue = this.sortOption.defaultSortOption.value;
            this.setSortColumns(pagination, sortedValue);
            this.listRedistributedThroughPartnerCampaigns(pagination);
        }
    }

    setSortColumns(pagination: Pagination, sortedValue: any) {
        if (sortedValue != "") {
            let options: string[] = sortedValue.split("-");
            pagination.sortcolumn = options[0];
            pagination.sortingOrder = options[1];
        }
    }

    /************************InActive Partners Tab********************/
    goToInActivePartnersDiv() {
        this.isHeaderCheckBoxChecked = false;
        this.isSendReminderEnabled = false;
        this.sortOption = new SortOption();
        this.customResponse = new CustomResponse();
        this.selectedTabIndex = 1;
        this.httpRequestLoader = new HttpRequestLoader();
        //XBI-1975
        this.isThroughPartnerDiv = false;
        this.isInactivePartnersDiv = true;
        this.isActivePartnerDiv = false;
        this.isRedistributePartnersDiv = false;
        this.isApprovePartnersDiv = false;
        this.isIncompleteCompanyProfileDiv = false;
        this.isSingUpPendingDiv = false;
        this.totalPartnersDiv = false;
        this.isAllPartners = false; //XNFR-1015
        this.isdeactivatePartnersDiv = false;
        this.inActivePartnersSearchKey = "";

        this.inActivePartnersPagination.pageIndex = 1;
        this.inActivePartnersPagination.maxResults = 12;
        this.inActivePartnersPagination.partnerTeamMemberGroupFilter = this.applyFilter;
        this.inActivePartnersPagination.searchKey = "";
        this.getInActivePartnerReports(this.inActivePartnersPagination);
        this.selectedPartnerIds = [];
        this.allPartnersStatusForMail();
    }

    goToApprovePartnersDiv() {
        this.sortOption = new SortOption();
        this.selectedTabIndex = 5;
        this.httpRequestLoader = new HttpRequestLoader();
        //XBI-1975
        this.isThroughPartnerDiv = false;
        this.isInactivePartnersDiv = false;
        this.isActivePartnerDiv = false;
        this.isRedistributePartnersDiv = false;
        this.isApprovePartnersDiv = true;
        this.isIncompleteCompanyProfileDiv = false;
        this.isSingUpPendingDiv = false;
        this.totalPartnersDiv = false;
        this.isAllPartners = false; //XNFR-1015
        this.isdeactivatePartnersDiv = false;
        this.approvePartnersPagination.maxResults = 12;
        this.getApprovePartnerReports(this.approvePartnersPagination);
        this.allPartnersStatusForMail();
    }

    getApprovePartnerReports(pagination: Pagination) {
        this.referenseService.loading(this.httpRequestLoader, true);
        pagination.userId = this.loggedInUserId;
        pagination.partnerTeamMemberGroupFilter = this.applyFilter;
        if (this.authenticationService.isSuperAdmin()) {
            pagination.userId = this.authenticationService.checkLoggedInUserId(pagination.userId);
        }
        this.parterService.getApprovePartnersAnalytics(pagination).subscribe(
            (response: any) => {
                pagination.totalRecords = response.totalRecords;
                if (response.approvePartnerList.length === 0) {
                    this.customResponse = new CustomResponse('INFO', 'No records found', true);
                }
                for (var i in response.approvePartnerList) {
                    response.approvePartnerList[i].contactCompany = response.approvePartnerList[i].partnerCompanyName;
                }
                pagination = this.pagerService.getPagedItems(pagination, response.approvePartnerList);
                this.referenseService.loading(this.httpRequestLoader, false);
            },
            (error: any) => {
                this.xtremandLogger.errorPage(error)
            });
    }

    getInActivePartnerReports(pagination: Pagination) {
        this.referenseService.loading(this.httpRequestLoader, true);
        pagination.userId = this.loggedInUserId;
        if (this.authenticationService.isSuperAdmin()) {
            pagination.userId = this.authenticationService.checkLoggedInUserId(pagination.userId);
        }
        this.parterService.getInActivePartnersAnalytics(pagination).subscribe(
            (response: any) => {
                pagination.totalRecords = response.totalRecords;
                if (response.inactivePartnerList.length === 0) {
                    this.customResponse = new CustomResponse('INFO', 'No records found', true);
                } else {
                    this.customResponse = new CustomResponse();
                }
                for (var i in response.inactivePartnerList) {
                    response.inactivePartnerList[i].contactCompany = response.inactivePartnerList[i].partnerCompanyName;
                }
                response.inactivePartnerList.forEach((partner: any) => {
                    const existingIndex = this.allItems.findIndex(item => item.partnerId === partner.partnerId);
                    if (existingIndex === -1) {
                        this.allItems.push(partner);
                    } else {
                        this.allItems[existingIndex] = partner;
                    }
                    partner.isSelected = this.selectedPartnerIds.includes(partner.partnerId);
                });

                this.isHeaderCheckBoxChecked = response.inactivePartnerList.every((partner: any) => partner.isSelected);


                pagination = this.pagerService.getPagedItems(pagination, response.inactivePartnerList);
                this.referenseService.loading(this.httpRequestLoader, false);
            },
            (error: any) => {
                this.xtremandLogger.errorPage(error);
            });
    }

    setInActivePartnesPage(event: any) {
        try {
            this.inActivePartnersPagination.pageIndex = event.page;
            this.getInActivePartnerReports(this.inActivePartnersPagination);
        } catch (error) {
            this.referenseService.showError(error, "setInActivePartnesPage", "partner-reports.component.ts")
        }
    }

    setApprovePartnesPage(event: any) {
        try {
            this.approvePartnersPagination.pageIndex = event.page;
            this.getApprovePartnerReports(this.approvePartnersPagination);
        } catch (error) {
            this.referenseService.showError(error, "setApprovePartnesPage", "partner-reports.component.ts")
        }
    }


    searchInActivePartnerAnalytics() {
        this.inActivePartnersPagination.pageIndex = 1;
        this.inActivePartnersPagination.searchKey = this.inActivePartnersSearchKey;
        this.getInActivePartnerReports(this.inActivePartnersPagination);
    }
    inActivePartnerDropDownList(event) {
        this.inActivePartnersPagination = event;
        this.getInActivePartnerReports(this.inActivePartnersPagination);
    }

    approvePartnerDropDownList(event) {
        this.approvePartnersPagination = event;
        this.getApprovePartnerReports(this.approvePartnersPagination);
    }

    sendRemindersForAllSelectedPartners(): void {
        const selectedPartners = this.selectedPartnerIds
            .map(partnerId => this.allItems.find(item => item.partnerId === partnerId))
            .filter(partner => partner && !partner.isActive && partner.emailId);

        selectedPartners.forEach(partner => {
            this.sendPartnerReminder(partner);
        });
    }

    sendRemindersForAllSelectedPartnersOne(): void {
        const selectedPartners = this.pagination.selectedPartnerIds
            .map(partnerId => this.allItems.find(item => item.partnerId === partnerId))
            .filter(partner => partner && !partner.isActive && partner.emailId);

        this.sendmail(selectedPartners);
        selectedPartners.forEach(partner => {
            partner.isSelected = false;
        });

        this.pagination.selectedPartnerIds = [];
        this.isSendReminderEnabled = false;
        this.isHeaderCheckBoxChecked = false;
    }
    
    sendPartnerReminder(item: any) {
        let user = new User();
        user.emailId = item.emailId;
        user.firstName = item.firstName;
        user.lastName = item.lastName;
        user.id = item.partnerId;
        this.referenseService.loading(this.httpRequestLoader, true);
        this.parterService.sendPartnerReminderEmail(user, this.loggedInUserId).subscribe(
            (response: any) => {
                if (response.statusCode == 2017) {
                    const partnerIndex = this.allItems.findIndex(p => p.partnerId === item.partnerId);
                    if (partnerIndex !== -1) {
                        this.allItems[partnerIndex].isSelected = false;
                        this.selectedPartnerIds = this.selectedPartnerIds.filter(id => id !== item.partnerId);
                    }
                    if(this.selectedPartnerIds.length >0){
                        this.isSendReminderEnabled = true;
                        this.updateSelectionState();
                    }
                    else{
                        this.isSendReminderEnabled = false;
                    }
                    this.isHeaderCheckBoxChecked = false;
                    this.getInActivePartnerReports(this.inActivePartnersPagination);
                }
                this.sendTestEmailIconClicked = false;
                this.referenseService.loading(this.httpRequestLoader, false);
            },
            (error: any) => {
                this.sendTestEmailIconClicked = false;
                this.referenseService.loading(this.httpRequestLoader, false);
                this.xtremandLogger.showClientErrors("partner-reports", "sendPartnerReminder()", error.error.message);
                this.customResponse = new CustomResponse('ERROR', 'Something went wrong in sending an email.', true);
            });

    }


    goToCampaignAnalytics(campaign) {
        this.referenseService.campaignType = campaign.campaignType;
        this.router.navigate(["/home/campaigns/" + campaign.campaignId + "/details"]);
    }



    /*************List Redistributed Through Partner Campaigns************/
    listRedistributedThroughPartnerCampaigns(pagination: Pagination) {
        this.paginationType = 'userInteraction';
        this.referenseService.loading(this.campaignUserInteractionHttpRequestLoader, true);
        this.parterService.listRedistributedThroughPartnerCampaign(this.loggedInUserId, pagination).subscribe(
            (response: any) => {
                let data = response.data;
                $.each(data.redistributedCampaigns, function (index, campaign) {
                    campaign.redistributedOn = new Date(campaign.redistributedUtcString);
                });
                this.sortOption.totalRecords = data.totalRecords;
                pagination.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems(pagination, data.redistributedCampaigns);
                this.referenseService.loading(this.campaignUserInteractionHttpRequestLoader, false);
            },
            (error: any) => { });
    }
    showRedistributedCampaings(item: any) {
        this.pagination.pagedItems.forEach((element) => {
            let campaignId = element.campaignId;
            let clickedCampaignId = item.campaignId;
            if (clickedCampaignId != campaignId) {
                element.expand = false;
            }
            let redistributedCampaigns = item.redistributedCampaigns;
            $.each(redistributedCampaigns, function (index, campaign) {
                campaign.displayTime = new Date(campaign.redistributedUtcString);
            });
        });
        item.expand = !item.expand;
    }


    approvePartnerRequest() {
        try {
            this.isError = false;
            this.xtremandLogger.info(this.partnerId);
            if (this.vendoorInvitation.message.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") && this.vendoorInvitation.subject.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ")) {
                this.referenseService.loading(this.httpRequestLoader, true);
                this.parterService.approveVendorRequest(this.partnerId, this.vendoorInvitation)
                    .subscribe(
                        (data: any) => {
                            this.closeRequestModal();
                            if (data.statusCode == 200) {
                                this.customResponse = new CustomResponse('SUCCESS', data.message, true);
                            } else if (data.statusCode == 401) {
                                this.customResponse = new CustomResponse('ERROR', data.message, true);
                            } else {
                                this.customResponse = new CustomResponse('ERROR', "Something went wrong, Please try after some time.", true);
                            }
                            this.getApprovePartnerReports(this.approvePartnersPagination);
                            this.referenseService.loading(this.httpRequestLoader, false);
                        },
                        (error: any) => {
                            this.referenseService.loading(this.httpRequestLoader, false);
                        },
                        () => this.xtremandLogger.info("Approved successfully.")
                    );
            } else {
                this.isError = true;
            }
        } catch (error) {
            this.xtremandLogger.error(error, "partner-report-component.", "approve parter()");
        }
    }


    declinePartnerRequest() {
        try {
            this.isError = false;
            this.xtremandLogger.info(this.partnerId);
            if (this.vendoorInvitation.message.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") && this.vendoorInvitation.subject.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ")) {
                this.referenseService.loading(this.httpRequestLoader, true);
                this.parterService.declineVendorRequest(this.partnerId, this.vendoorInvitation)
                    .subscribe(
                        (data: any) => {
                            this.closeRequestModal();
                            if (data.statusCode == 200) {
                                this.customResponse = new CustomResponse('SUCCESS', data.message, true);
                            } else {
                                this.customResponse = new CustomResponse('ERROR', "Something went wrong, Please try after some time.", true);
                            }
                            this.getApprovePartnerReports(this.approvePartnersPagination);
                            this.referenseService.loading(this.httpRequestLoader, false);
                        },
                        (error: any) => {
                            this.referenseService.loading(this.httpRequestLoader, false);
                        },
                        () => this.xtremandLogger.info("Declined successfully.")
                    );
            } else {
                this.isError = true;
            }
        } catch (error) {
            this.xtremandLogger.error(error, "partner-report-component.", "Decline Parter()");
        }
    }

    approveAndDeclineRequest(partnerId: number, partnerFirstName: any, partnerModuleName: string) {
        this.partnerId = partnerId;
        this.isShowCKeditor = true;
        CKEDITOR.config.height = '300px';
        CKEDITOR.config.baseFloatZIndex = 1E5;
        if (this.requestText == 'Approve') {
            this.vendoorInvitation.subject = "Welcome to my xAmplify Network";
            this.vendoorInvitation.message = "Hi " + partnerFirstName + ",<br><br>" + "You are approved as one of  " + partnerModuleName + " Now you can add contacts and redistribute the campaigns."

                + "<br><br>" + "Be sure to keep an eye out for future campaigns. And if you have any questions or would like to discuss this partnership in more detail, please feel free to contact me."
                + "<br><br>"
                + "Looking forward to working with you," + "<br><br>"

                + this.authenticationService.user.firstName

                + "<br>" + this.authenticationService.user.firstName + " " + this.authenticationService.user.lastName

                + "<br>" + this.authenticationService.user.companyName
        } else {
            this.vendoorInvitation.subject = "Your xAmplify request has been declined"

            this.vendoorInvitation.message = "Hi " + partnerFirstName + ",<br><br>" + "While I appreciate your request to join our xAmplify network, I regret to inform you that we have opted to decline your request at this time"
                + "I apologize for the inconvenience, but perhaps we will have the opportunity to work together in the near future."

                + "<br><br>" + "Best regards," + "<br><br>"

                + this.authenticationService.user.firstName

                + "<br>" + this.authenticationService.user.firstName + " " + this.authenticationService.user.lastName

                + "<br>" + this.authenticationService.user.companyName
        }
        $('#approve-decline-modal').modal('show');
    }

    validateRequest() {
        if (this.vendoorInvitation.message.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") && this.vendoorInvitation.subject.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ")) {
            this.isValidRequest = true;
        } else {
            this.isValidRequest = false;
        }
    }

    closeRequestModal() {
        this.isShowCKeditor = false;
        $('#approve-decline-modal').modal('hide');
    }


    ngOnInit() {
        let filterPartner = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.filterPartners);
        if (filterPartner!=null && filterPartner != undefined &&  (!filterPartner || filterPartner === 'false')) {
            this.applyFilter = false;
        }
        this.allPartnersStatusForMail();
        this.getCountOfTiles();

    }

    private getCountOfTiles() {
        if (this.loggedInUserId > 0) {
            let tabIndex = this.route.snapshot.params['id'];
            this.findActivePartnersCount();
            this.findRedistributedCampaignsCount();
            this.findThroughCampaignsCount();
            this.findInActivePartnersCount();
            this.findApprovePartnersCount();
            this.findPendingSignupAndCompanyProfileIncompletePartnersCount();
            this.findTotalPartnersCount();
            this.findTotalDeactivatePartnersCount();
            if (tabIndex != undefined) {
                if (tabIndex == 1) {
                    this.goToInActivePartnersDiv();
                }
                else {
                    this.goToReDistributedPartnersDiv();
                }
            } else {
                this.loadCountryData();
                this.getPartnersRedistributedCampaignsData();
                this.goToActivePartnersDiv();
            }
            if (localStorage != undefined) {
                this.throughPartnerCampaignsTabName = "Through " + localStorage.getItem('partnerModuleCustomName') + " Campaigns";
            }
        } else {
            this.router.navigate(['home/dashboard']);
        }
    }

    ngOnDestroy() {
        this.isShowCKeditor = false;
        $('#approve-decline-modal').modal('hide');
    }

    ngOnChanges(){
        this.goToActivePartnersDiv();
        // this.goToDeactivatePartnersDiv();
    }

    getModuleAccess() {
        this.authenticationService.getModulesByUserId()
            .subscribe(
                data => {
                    let response = data.data;
                    let statusCode = data.statusCode;
                    if (statusCode == 200) {
                        this.landingPage = response.landingPage;
                        this.survey = response.survey;
                    }
                },
                error => {
                   
                },
                () => this.xtremandLogger.info("Finished getModuleAccess()")
            );
    }

    toggleFilterOption() {
        this.showFilterOption = !this.showFilterOption;
        this.fromDateFilter = "";
        this.toDateFilter = "";
        if (!this.showFilterOption) {
            this.throughPartnerCampaignPagination.fromDateFilterString = "";
            this.throughPartnerCampaignPagination.toDateFilterString = "";
            this.filterResponse.isVisible = false;
            if (this.filterMode) {
                this.throughPartnerCampaignPagination.pageIndex = 1;
                this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);
                this.filterMode = false;
            }
        } else {
            this.filterMode = false;
        }
    }

    closeFilterOption() {
        this.showFilterOption = false;
        this.fromDateFilter = "";
        this.toDateFilter = "";
        this.throughPartnerCampaignPagination.fromDateFilterString = "";
        this.throughPartnerCampaignPagination.toDateFilterString = "";
        this.filterResponse.isVisible = false;
        if (this.filterMode) {
            this.throughPartnerCampaignPagination.pageIndex = 1;
            this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);
            this.filterMode = false;
        }
    }

    validateDateFilters() {
        if (this.fromDateFilter != undefined && this.fromDateFilter != "") {
            var fromDate = Date.parse(this.fromDateFilter);
            if (this.toDateFilter != undefined && this.toDateFilter != "") {
                var toDate = Date.parse(this.toDateFilter);
                if (fromDate <= toDate) {
                    this.throughPartnerCampaignPagination.pageIndex = 1;
                    this.throughPartnerCampaignPagination.fromDateFilterString = this.fromDateFilter;
                    this.throughPartnerCampaignPagination.toDateFilterString = this.toDateFilter;
                    this.filterMode = true;
                    this.filterResponse.isVisible = false;
                    this.throughPartnerCampaignPagination.maxResults = 12;
                    this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);
                } else {
                    this.filterResponse = new CustomResponse('ERROR', "From date should be less than To date", true);
                }
            } else {
                this.filterResponse = new CustomResponse('ERROR', "Please pick To Date", true);
            }
        } else {
            this.filterResponse = new CustomResponse('ERROR', "Please pick From Date", true);
        }
    }
    reloadRedistributeCampaigns = true;
    getSelectedIndexFromPopup(event: any) {
        let self = this;
        this.activePartnersLoader = true;
        this.redistributedCampaignsCountLoader = true;
        this.inActivePartnersCountLoader = true;
        this.approvePartnersCountLoader = true;
        this.throughPartnerCampaignsCountLoader = true;
        this.PendingSignupAndCompanyProfilePartnersLoader = true;
        this.totalPartnersCountLoader = true;
        this.selectedPartnerCompanyIds = [];
        if(this.selectedTabIndex==0){
            this.loadAllCharts = true;
            this.reloadWithFilter = false;
        }else if(this.selectedTabIndex==2){
            this.reloadRedistributeCampaigns = false;
        }
        setTimeout(function() {
        self.applyFilter = event['selectedOptionIndex'] == 1;
        self.findActivePartnersCount();
        self.findRedistributedCampaignsCount();
        self.findThroughCampaignsCount();
        self.findInActivePartnersCount();
        self.findApprovePartnersCount();
        self.findPendingSignupAndCompanyProfileIncompletePartnersCount();
        self.findTotalPartnersCount();
        self.findTotalDeactivatePartnersCount();
        if(self.selectedTabIndex==0){
            self.reloadWithFilter = true;
            self.getPartnersRedistributedCampaignsData();
            self.loadAllCharts = false;
        }else if(self.selectedTabIndex==2){
            self.reloadRedistributeCampaigns = true;
        }else if(self.selectedTabIndex == 1){
        	self.goToInActivePartnersDiv();
        } else{
            self.goToActivePartnersDiv();
        }
        self.throughPartnerCampaignsCountLoader = false;
        }, 500);
    }

    loadCountryData() {
        this.worldMapLoader = true;
        this.parterService.loadCountryData(this.loggedInUserId, this.applyFilter).subscribe(
            (data: any) => {
                this.worldMapdataReport = data.countrywisepartners;
                this.worldMapLoader = false;
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.worldMapLoader = false;
            });
    }

    activePartnersLoader = false;
    findActivePartnersCount() {
        this.activePartnersLoader = true;
        this.parterService.findActivePartnersCount(this.loggedInUserId, this.applyFilter).subscribe(
            (data: any) => {
                this.activePartnersCount = data.activePartnersCount;
                this.activePartnersLoader = false;
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.activePartnersLoader = false;
            });
    }

    redistributedCampaignsCountLoader = false;
    findRedistributedCampaignsCount() {
        this.redistributedCampaignsCountLoader = true;
        this.parterService.findRedistributedCampaignsCount(this.loggedInUserId, this.applyFilter).subscribe(
            (data: any) => {
                this.redistributedCampaignsCount = data.redistributedCampaignsCount;
                this.redistributedCampaignsCountLoader = false;
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.redistributedCampaignsCountLoader = false;
            });
    }

    throughPartnerCampaignsCountLoader = false;
    findThroughCampaignsCount() {
        this.throughPartnerCampaignsCountLoader = true;
        this.parterService.findThroughPartnerCampaignsCount(this.loggedInUserId, this.applyFilter).subscribe(
            (data: any) => {
                this.throughPartnerCampaignsCount = data.throughPartnerCampaignsCount;
                this.throughPartnerCampaignsCountLoader = false;
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.throughPartnerCampaignsCountLoader = false;
            });
    }

    inActivePartnersCountLoader = false;
    findInActivePartnersCount() {

        this.inActivePartnersCountLoader = true;
        this.parterService.findInActivePartnersCount(this.loggedInUserId, this.applyFilter).subscribe(
            (data: any) => {
                this.inActivePartnersCount = data.inActivePartnersCount;
                this.inActivePartnersCountLoader = false;
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.inActivePartnersCountLoader = false;
            });
    }

    approvePartnersCountLoader = false;
    findApprovePartnersCount() {
        this.approvePartnersCountLoader = true;
        this.parterService.findApprovePartnersCount(this.loggedInUserId, this.applyFilter).subscribe(
            (data: any) => {
                this.approvePartnersCount = data.approvePartnersCount;
                this.approvePartnersCountLoader = false;
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.approvePartnersCountLoader = false;
            });
    }

    findPendingSignupAndCompanyProfileIncompletePartnersCount() {
        this.PendingSignupAndCompanyProfilePartnersLoader = true;
        this.parterService.findPendingSignupAndCompanyProfilePartnersCount(this.loggedInUserId, this.applyFilter).subscribe(
            (data: any) => {
                this.PendingSignupPartnersCount = data.PendingSignupPartnersCount;
                this.companyProfileIncompletePartnersCount = data.CompanyProfileIncompletePartnersCount;
                this.PendingSignupAndCompanyProfilePartnersLoader = false;
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.PendingSignupAndCompanyProfilePartnersLoader = false;
            });
    }

    //***************XNFR-316****************
    goToDetailedAnalytics(partnerCompanyId: any){
        this.detailedAnalyticsPartnerCompany = partnerCompanyId;
        this.showDetailedAnalytics = true;        
    }

    closeDetailedAnalytics() {
        this.showDetailedAnalytics = false;
        this.goToActivePartnersDiv();
    }

    interactionTracksDonutSliceSelected(type: any) {
        this.selectedTrackType = type;
        this.selectedAssetType = "";
      }
    
      interactionTracksDonutSliceUnSelected(type: any) {
        if (this.selectedTrackType == type) {
          this.selectedTrackType = "";
          this.selectedAssetType = "";
        } 
      }
    
      typeWiseTrackAssetsDonutSliceSelected(type: any) {
        this.selectedAssetType = type;
      }
      
      typeWiseTrackAssetsDonutSliceUnSelected(type: any) {
        if (this.selectedAssetType == type) {
          this.selectedAssetType = "";
        } 
      }
    
      interactionRegionDonutSliceSelected(type: any) {
          this.selectedRegionName = type;
        }
      
        interactionRegionDonutSliceUnSelected(type: any) {
          if (this.selectedRegionName == type) {
            this.selectedRegionName = "";
          } 
        }
      
      getSelectedPartnerCompanyIds(partnerCompanyIds: any){
        this.selectedPartnerCompanyIds = partnerCompanyIds;
        this.getPartnersRedistributedCampaignsData();
      }
      redistributedCampaignDetailsPieChartSelected(type: any){
        this.selectedCampaignType = type;
      }
      redistributedCampaignDetailsPieChartUnSelected(type: any){
        if (this.selectedCampaignType == type) {
            this.selectedCampaignType = "";
          } 
      }

      goToIncompleteCompanyProfilePartnersDiv() {
        this.selectedTabIndex = 6;
        this.sortOption = new SortOption();
        this.httpRequestLoader = new HttpRequestLoader();
        this.customResponse = new CustomResponse();
        this.isThroughPartnerDiv = false;
        this.isInactivePartnersDiv = false;
        this.isActivePartnerDiv = false;
        this.isRedistributePartnersDiv = false;
        this.isApprovePartnersDiv = false;
        this.isIncompleteCompanyProfileDiv = true;
        this.isSingUpPendingDiv = false;
        this.totalPartnersDiv = false;
        this.isAllPartners = false; //XNFR-1015
        this.isdeactivatePartnersDiv = false;
        this.inActivePartnersSearchKey = "";
        this.incompleteCompanyProfileAndPendingSingupPagination.pagedItems = [];

        this.incompleteCompanyProfileAndPendingSingupPagination.pageIndex = 1;
        this.incompleteCompanyProfileAndPendingSingupPagination.maxResults = 12;
        this.incompleteCompanyProfileAndPendingSingupPagination.moduleName = 'PendingCompanyProfile';
        this.incompleteCompanyProfileAndPendingSingupPagination.partnerTeamMemberGroupFilter = this.applyFilter;
        this.incompleteCompanyProfileAndPendingSingupPagination.searchKey ="";
        this.pagination.selectedPartnerIds = [];
        this.isSendReminderEnabled = false;
        this.isHeaderCheckBoxChecked = false;
        this.getCompanyProfileIncompleteAndSignupPendingReports(this.incompleteCompanyProfileAndPendingSingupPagination);
    }
    
    goToSignupPendingPartnersDiv() {
        this.selectedTabIndex = 7;
        this.sortOption = new SortOption();
        this.httpRequestLoader = new HttpRequestLoader();
        this.customResponse = new CustomResponse();
        this.isThroughPartnerDiv = false;
        this.isInactivePartnersDiv = false;
        this.isActivePartnerDiv = false;
        this.isRedistributePartnersDiv = false;
        this.isApprovePartnersDiv = false;
        this.isIncompleteCompanyProfileDiv = false;
        this.isSingUpPendingDiv = true;
        this.totalPartnersDiv = false;
        this.isAllPartners = false; //XNFR-1015
        this.isdeactivatePartnersDiv = false;
        this.inActivePartnersSearchKey = "";
        this.incompleteCompanyProfileAndPendingSingupPagination.pagedItems = [];
        this.incompleteCompanyProfileAndPendingSingupPagination.pageIndex = 1;
        this.incompleteCompanyProfileAndPendingSingupPagination.maxResults = 12;
        this.incompleteCompanyProfileAndPendingSingupPagination.moduleName = 'pSignUp';
        this.incompleteCompanyProfileAndPendingSingupPagination.partnerTeamMemberGroupFilter = this.applyFilter;
        this.incompleteCompanyProfileAndPendingSingupPagination.searchKey ="";
        this.pagination.selectedPartnerIds = [];
        this.isSendReminderEnabled = false;
        this.isHeaderCheckBoxChecked = false;
        this.getCompanyProfileIncompleteAndSignupPendingReports(this.incompleteCompanyProfileAndPendingSingupPagination);
    }
    CompanyProfileIncompleteAndSignupPendingList(event) {
        this.incompleteCompanyProfileAndPendingSingupPagination = event;
        this.getCompanyProfileIncompleteAndSignupPendingReports(this.incompleteCompanyProfileAndPendingSingupPagination);
    }
    setCompanyProfileIncompleteAndSignupPendingPartnesPage(event: any) {
        try {
            this.incompleteCompanyProfileAndPendingSingupPagination.pageIndex = event.page;
            this.getCompanyProfileIncompleteAndSignupPendingReports(this.incompleteCompanyProfileAndPendingSingupPagination);
        } catch (error) {
            this.referenseService.showError(error, "setincompleteCompanyProfileAndPendingSingupPaginationPartnesPage", "partner-reports.component.ts")
        }
    }
    searchCompanyProfileIncompleteAndSignupPendingPartnerAnalytics() {
        this.incompleteCompanyProfileAndPendingSingupPagination.pageIndex = 1;
        this.incompleteCompanyProfileAndPendingSingupPagination.searchKey = this.inActivePartnersSearchKey;
        this.getCompanyProfileIncompleteAndSignupPendingReports(this.incompleteCompanyProfileAndPendingSingupPagination);
    }
    getCompanyProfileIncompleteAndSignupPendingReports(pagination: Pagination) {
        this.referenseService.loading(this.httpRequestLoader, true);
        pagination.userId = this.loggedInUserId;
        if (this.authenticationService.isSuperAdmin()) {
            pagination.userId = this.authenticationService.checkLoggedInUserId(pagination.userId);
        }
        this.parterService.getCompanyProfileIncomplete(pagination).subscribe(
            (response: any) => {
                pagination.totalRecords = response.totalRecords;
                if (response.list.length === 0) {
                    this.customResponse = new CustomResponse('INFO', 'No records found', true);
                }else {
                    this.customResponse = new CustomResponse();
                }
                for (var i in response.approvePartnerList) {
                    response.list[i].contactCompany = response.list[i].partnerCompanyName;
                }
                response.list.forEach((partner: any) => {
                    const existingIndex = this.allItems.findIndex(item => item.partnerId === partner.partnerId);
                    if (existingIndex === -1) {
                        this.allItems.push(partner);
                    } else {
                        this.allItems[existingIndex] = partner;
                    }
                    partner.isSelected = this.pagination.selectedPartnerIds.includes(partner.partnerId);
                });

                this.isHeaderCheckBoxChecked = response.list.every((partner: any) => partner.isSelected);


                pagination = this.pagerService.getPagedItems(pagination, response.list);
                this.referenseService.loading(this.httpRequestLoader, false);
            },
            (error: any) => {
                this.xtremandLogger.errorPage(error)
            });
    }

    sendmail(item: any) {
        this.pagination.partnerId = item.partnerId;
        this.pagination.userId = this.authenticationService.getUserId();
        this.pagination.vanityUrlFilter = this.authenticationService.vanityURLEnabled;
        this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        this.referenseService.loading(this.httpRequestLoader, true);
        this.pagination.fromPartnerAnalytics = true;
        this.parterService.mailSend(this.pagination).subscribe(
            data => {
                if (data.access) {
                    this.referenseService.loading(this.httpRequestLoader, false);
                    if (data.statusCode == 200) {
                         const partnerIndex = this.allItems.findIndex(p => p.partnerId === item.partnerId);
                        if (partnerIndex !== -1) {
                            this.allItems[partnerIndex].isSelected = false;
                            this.pagination.singleMail = false;
                            this.pagination.selectedPartnerIds = this.pagination.selectedPartnerIds.filter(id => id !== item.partnerId);
                        }
                        if(this.pagination.selectedPartnerIds.length >0){
                            this.isSendReminderEnabled = true;
                            this.updateSelectionStateForIncompleteProfiles();
                        }
                        else{
                            this.isSendReminderEnabled = false;
                        }
                        this.isHeaderCheckBoxChecked = false;                   
                        //this.referenseService.showSweetAlertSuccessMessage(data.message);
                        this.openSweetAlertSuccessMessage(data.message);

                    } else if (data.statusCode == 400) {
                        const partnerIndex = this.allItems.findIndex(p => p.partnerId === item.partnerId);
                        if (partnerIndex !== -1) {
                            this.allItems[partnerIndex].isSelected = false;
                            this.pagination.singleMail = false;
                            this.pagination.selectedPartnerIds = this.pagination.selectedPartnerIds.filter(id => id !== item.partnerId);
                        }
                        if(this.pagination.selectedPartnerIds.length >0){
                            this.isSendReminderEnabled = true;
                            this.updateSelectionStateForIncompleteProfiles();
                        }
                        else{
                            this.isSendReminderEnabled = false;
                        }
                        //this.referenseService.showSweetAlertSuccessMessage(data.message);
                        this.openSweetAlertSuccessMessage(data.message);
                    }
                    this.sendTestEmailIconClicked = false;
                    this.referenseService.goToTop();
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            (error: any) => {
                this.sendTestEmailIconClicked = false;
                this.customResponse = new CustomResponse('ERROR', 'Some thing went wrong please try after some time.', true);
                this.xtremandLogger.error(error);
                this.referenseService.loading(this.httpRequestLoader, false);
            },
            () => { this.isSentEmailNotification = true; //XNFR-1015;
                   this.xtremandLogger.log(" Partner-reports component Mail send method successfull")
            }
        );
    } catch(error) {
        this.xtremandLogger.error(error, "Partner-reports", "resending Partner email");
    }
    checkAllPartnersStatus(item:any){
        if(this.totalPartnersDiv){
            this.allPartnersStatusForMail();
            let status = item.status;
            if(status == "Pending Signup"){
                this.isPendingStatus = true;
            }else if(status == "Dormant"){
                this.isDormantStatus = true;
            }else if(status == "IncompleteCompanyProfile"){
                this.isIncompleteCompanyProfile = true;
            }
        }
    }
    private allPartnersStatusForMail() {
        this.isPendingStatus = false;
        this.isDormantStatus = false;
        this.isIncompleteCompanyProfile = false;
    }

    openSendTestEmailModalPopup(item: any) {
        this.checkAllPartnersStatus(item);
        this.selectedItem = item;
        this.selectedEmailId = item.emailId;
        if (this.isInactivePartnersDiv || this.isDormantStatus) {
            this.vanityURLService.getTemplateId(this.selectedEmailId, "isInactivePartnersDiv").subscribe(
                response => {
                    if (response.statusCode === 200) {
                        this.selectedEmailTemplateId = response.data;
                        this.sendTestEmailIconClicked = true;
                        this.vanityTemplates = true;
                    } else if (response.statusCode === 400) {
                        console.error("Error: Invalid email ID or other bad request.");
                    } else {
                        console.error("Unexpected status code:", response.statusCode);
                    }
                },
                (error) => {
                    console.error("Error fetching template ID:", error);
                }
            );
        }

        else if (this.isIncompleteCompanyProfileDiv || this.isIncompleteCompanyProfile) {
            this.vanityURLService.getTemplateId(this.selectedEmailId, "isIncompleteCompanyProfileDiv").subscribe(
                response => {
                    if (response.statusCode === 200) {
                        this.selectedEmailTemplateId = response.data;
                        this.sendTestEmailIconClicked = true;
                        this.vanityTemplates = true;
                    } else if (response.statusCode === 400) {
                        console.error("Error: Invalid email ID or other bad request.");
                    } else {
                        console.error("Unexpected status code:", response.statusCode);
                    }
                },
                (error) => {
                    console.error("Error fetching template ID:", error);
                }
            );
        }
        else if (this.isSingUpPendingDiv || this.isPendingStatus) {
            this.vanityURLService.getTemplateId(this.selectedEmailId, "isSingUpPendingDiv").subscribe(
                response => {
                    if (response.statusCode === 200) {
                        this.selectedEmailTemplateId = response.data;
                        this.sendTestEmailIconClicked = true;
                        this.vanityTemplates = true;
                    } else if (response.statusCode === 400) {
                        console.error("Error: Invalid email ID or other bad request.");
                    } else {
                        console.error("Unexpected status code:", response.statusCode);
                    }
                },
                (error) => {
                    console.error("Error fetching template ID:", error);
                }
            );
         }
        // else if(this.goToAllPartnersDiv){
            
        // }
    }
    
         
  
    sendReminder(): void {
        if (this.isIncompleteCompanyProfileDiv || this.isSingUpPendingDiv) {
            this.sendReminderForIncompleteProfiles();
        }
        else{
            this.sendReminderForInactivePartners();
        }
    }

    sendReminderForIncompleteProfiles(): void {
        const selectedPartners = this.pagination.selectedPartnerIds
        .map(partnerId => this.allItems.find(item => item.partnerId === partnerId))
        .filter(partner => partner && !partner.isActive && partner.emailId);

        const emailIds = selectedPartners.map(partner => partner.emailId);
        const emailIdsString = emailIds.join(', ');
        this.selectedItem = this.allItems.filter(item => item.isSelected);
        this.modelPopUpMultipleSelectedEmails(emailIdsString);

    }
    sendReminderForInactivePartners(): void {

        const selectedPartners = this.selectedPartnerIds
            .map(partnerId => this.allItems.find(item => item.partnerId === partnerId))
            .filter(partner => partner && !partner.isActive && partner.emailId);

        const emailIds = selectedPartners.map(partner => partner.emailId);
        const emailIdsString = emailIds.join(', ');
        if (this.isAllPartners) {
            this.selectedItem = this.allItems.filter(item => item.isSelected);
        }
        this.modelPopUpMultipleSelectedEmails(emailIdsString);
    }
    updateSelectionState(): void {
        const currentPageItems = this.inActivePartnersPagination.pagedItems;

        currentPageItems
            .filter(item => item.isSelected)
            .forEach(item => {
                if (!this.selectedPartnerIds.includes(item.partnerId)) {
                    this.selectedPartnerIds.push(item.partnerId);
                }
            });

        currentPageItems
            .filter(item => !item.isSelected)
            .forEach(item => {
                const index = this.selectedPartnerIds.indexOf(item.partnerId);
                if (index !== -1) {
                    this.selectedPartnerIds.splice(index, 1);
                }
            });

        this.isSendReminderEnabled = this.selectedPartnerIds.length > 0;
        this.isHeaderCheckBoxChecked = currentPageItems.every(item => item.isSelected);
        this.selectedItem = currentPageItems;
    }

    toggleSelectAll(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;
        const currentPageItems = this.inActivePartnersPagination.pagedItems;

        currentPageItems.forEach(item => {
            item.isSelected = checked;

            if (checked) {
                if (!this.selectedPartnerIds.includes(item.partnerId)) {
                    this.selectedPartnerIds.push(item.partnerId);
                }
            } else {
                const index = this.selectedPartnerIds.indexOf(item.partnerId);
                if (index !== -1) {
                    this.selectedPartnerIds.splice(index, 1);
                }
            }
        });
        this.updateSelectionState();
    }         

    modelPopUpMultipleSelectedEmails(emailIds: any) {
        this.selectedEmailId = emailIds;
        if (this.isInactivePartnersDiv || this.isDormantStatus) {
            this.vanityURLService.getTemplateId(this.selectedEmailId, "isInactivePartnersDiv").subscribe(
                response => {
                    if (response.statusCode === 200) {
                        this.selectedEmailTemplateId = response.data;
                        if(this.isAllPartners) {
                            this.selectedDormantEmailTemplateId = response.data;
                        }
                        this.sendTestEmailIconClicked = true;
                        this.vanityTemplates = true;
                    } else if (response.statusCode === 400) {
                        console.error("Error: Invalid email ID or other bad request.");
                    } else {
                        console.error("Unexpected status code:", response.statusCode);
                    }
                },
                (error) => {
                    console.error("Error fetching template ID:", error);
                }
            );
        }
        else if (this.isIncompleteCompanyProfileDiv || this.isIncompleteCompanyProfile) {
            this.vanityURLService.getTemplateId(this.selectedEmailId, "isIncompleteCompanyProfileDiv").subscribe(
                response => {
                    if (response.statusCode === 200) {
                        this.selectedEmailTemplateId = response.data;
                        if(this.isAllPartners) {
                            this.selectedIncompleteEmailTemplateId = response.data;
                        }
                        this.sendTestEmailIconClicked = true;
                        this.vanityTemplates = true;
                    } else if (response.statusCode === 400) {
                        console.error("Error: Invalid email ID or other bad request.");
                    } else {
                        console.error("Unexpected status code:", response.statusCode);
                    }
                },
                (error) => {
                    console.error("Error fetching template ID:", error);
                }
            );
        }
        else if (this.isSingUpPendingDiv || this.isPendingStatus) {
            this.sendTestEmailIconClicked = true;
            this.vanityTemplates = true;
        }
    }
    sendTestEmailModalPopupEventReceiver(){
        this.selectedEmailTemplateId = 0;
        this.sendTestEmailIconClicked = false;
        this.vanityTemplates = false;
        this.isAllPartners = false;
      }
    emittedMethod(event: any) {
        if (this.isInactivePartnersDiv || this.isDormantStatus) {
            if (Array.isArray(event)) {
                this.sendRemindersForAllSelectedPartners();
            } else {
                this.sendPartnerReminder(event);
            }
            //this.referenseService.showSweetAlertSuccessMessage('Email sent successfully.');
            this.openSweetAlertSuccessMessage('Email sent successfully.');
            this.isSentEmailNotification = true; //XNFR-1015
        }
         else if (this.isIncompleteCompanyProfileDiv  || this.isSingUpPendingDiv || this.isIncompleteCompanyProfile || this.isPendingStatus) {
            if (Array.isArray(event)) {
                this.sendRemindersForAllSelectedPartnersOne();
            } else {
                this.pagination.singleMail = true;
                this.sendmail(event);
            }
        } 
        else {
            this.sendmail(event);
        }

    }

    getDateFilterOptions(event: any) {
        this.partnerfromDateFilter = event.fromDate;
        this.partnertoDateFilter = event.toDate;
    }


    findTotalPartnersCount() {
        this.totalPartnersCountLoader = true;
        this.parterService.findTotalPartnersCount(this.loggedInUserId, this.applyFilter).subscribe(
            (result: any) => {
                this.totalPartnersCount = result.data.totalPartnersCount;
                this.totalPartnersCountLoader = false;
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.totalPartnersCountLoader = false;
            });
    }
    /**  XNFR-835 **/
    downloadInActivePartnersReport() {
        this.referenseService.downloadPartnesReports(this.loggedInUserId, this.selectedPartnerCompanyIds, this.inActivePartnersPagination, this.applyFilter, this.fromDateFilter, this.toDateFilter, "inactive-partners-report")
    }
    downloadIncompleteCompanyProfilePartnersReport() {
        this.referenseService.downloadPartnesReports(this.loggedInUserId, this.selectedPartnerCompanyIds, this.incompleteCompanyProfileAndPendingSingupPagination, this.applyFilter, this.fromDateFilter, this.toDateFilter, "company-profile-incomplete-partners-report")
    }
    /**  XNFR-835 **/


    updateSelectionStateForIncompleteProfiles(): void {
        this.updateSelectionIncomplete(this.incompleteCompanyProfileAndPendingSingupPagination.pagedItems);
    }

    toggleSelectAllForIncompleteProfiles(event: Event): void {
        this.toggleSelectAllIncomplete(event, this.incompleteCompanyProfileAndPendingSingupPagination.pagedItems);
    }
    
    updateSelectionIncomplete(pagedItems: any[]): void {
        pagedItems
            .filter(item => item.isSelected)
            .forEach(item => {
                if (!this.pagination.selectedPartnerIds.includes(item.partnerId)) {
                    this.pagination.selectedPartnerIds.push(item.partnerId);
                }
            });
    
        pagedItems
            .filter(item => !item.isSelected)
            .forEach(item => {
                const index = this.pagination.selectedPartnerIds.indexOf(item.partnerId);
                if (index !== -1) {
                    this.pagination.selectedPartnerIds.splice(index, 1);
                }
            });
    
        this.allItems.forEach(item => {
            item.isSelected = this.pagination.selectedPartnerIds.includes(item.partnerId);
        });
    
        this.isSendReminderEnabled = this.pagination.selectedPartnerIds.length > 0;
        this.isHeaderCheckBoxChecked = pagedItems.every(item => item.isSelected);
        this.selectedItem = this.allItems.filter(item => item.isSelected);
    }
    
    toggleSelectAllIncomplete(event: Event, pagedItems: any[]): void {
        const checked = (event.target as HTMLInputElement).checked;

        pagedItems.forEach(item => {
            item.isSelected = checked;

            if (checked) {
                if (!this.pagination.selectedPartnerIds.includes(item.partnerId)) {
                    this.pagination.selectedPartnerIds.push(item.partnerId);
                }
            } else {
                const index = this.pagination.selectedPartnerIds.indexOf(item.partnerId);
                if (index !== -1) {
                    this.pagination.selectedPartnerIds.splice(index, 1);
                }
            }
        });

        this.updateSelectionIncomplete(pagedItems);
    }

    /*** XNFR-1015 */
    isAllPartners: boolean = false;
    selectedDormantEmailTemplateId: any;
    selectedIncompleteEmailTemplateId: any;
    isSentEmailNotification:boolean = false;
    openSendTestPopupFromAllPartner(items: any[]): void {
        this.isAllPartners = true;
        this.allItems = items;
        const partnerIds = Array.from(new Set(items.map(item => item.partnerId)));
        const hasIncompleteProfile = items.some(item => item.status === 'IncompleteCompanyProfile');
        const hasPendingSignup = items.some(item => item.status === 'Pending Signup');
        const hasDormantPartner = items.some(item => item.status === 'Dormant');
        this.allPartnersStatusForMail();
        if (hasIncompleteProfile) {
            this.isDormantStatus = false;
            this.isPendingStatus = false;
            this.isIncompleteCompanyProfile = hasIncompleteProfile;
            this.pagination.selectedPartnerIds = Array.from(new Set([...this.pagination.selectedPartnerIds, ...partnerIds]));
            this.sendReminderForIncompleteProfiles();
        }
        if (hasDormantPartner) {
            this.isIncompleteCompanyProfile = false;
            this.isPendingStatus = false;
            this.isDormantStatus = hasDormantPartner;
            this.selectedPartnerIds = partnerIds;
            this.sendReminderForInactivePartners();
        }
        if (hasPendingSignup) {
            this.pagination.selectedPartnerIds = Array.from(new Set([...this.pagination.selectedPartnerIds, ...partnerIds]));
            this.isIncompleteCompanyProfile = false;
            this.isDormantStatus = false;
            this.isPendingStatus = hasPendingSignup;
            this.sendReminderForIncompleteProfiles();
        }
        this.isSentEmailNotification = false;
    }
    /*** XNFR-1015 */
    
    //XNFR-1006
    findTotalDeactivatePartnersCount() {
        this.totalDeactivatePartnersCountLoader = true;
        this.parterService.findTotalDeactivatePartnersCount(this.loggedInUserId, this.applyFilter).subscribe(
            (result: any) => {
                this.totalDeactivatePartnersCount = result.data.totalDeactivatePartnersCount;
                this.totalDeactivatePartnersCountLoader = false;
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.totalDeactivatePartnersCountLoader = false;
            });
    }

 goToDeactivatePartnersDiv(){
        this.isdeactivatePartnersDiv = true;
         this.loadAllCharts = false;
         this.selectedTabIndex = 9;
         this.isThroughPartnerDiv = false;
         this.isInactivePartnersDiv = false;
         this.isActivePartnerDiv = false;
         this.isRedistributePartnersDiv = false;
         this.isApprovePartnersDiv = false;
         this.isIncompleteCompanyProfileDiv = false;
         this.isSingUpPendingDiv = false;
         this.totalPartnersDiv = false;
         this.getActivePartnerReports();
         this.loadCountryData();
         this.getPartnersRedistributedCampaignsData();
    }


    //XNFR-1026
    openSweetAlertSuccessMessage(message: string) {
        let self = this;
        swal({
            title: message,
            type: "success",
            allowOutsideClick: false,
        }).then(function () {
            if(self.isSingUpPendingDiv){
                self.goToSignupPendingPartnersDiv();
            }else if(self.isIncompleteCompanyProfileDiv){
                self.goToIncompleteCompanyProfilePartnersDiv();
            }
        })
    }
  
}
