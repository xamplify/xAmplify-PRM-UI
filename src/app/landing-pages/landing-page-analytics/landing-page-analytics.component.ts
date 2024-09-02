import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { ReferenceService } from '../../core/services/reference.service';
import { LandingPageService } from '../services/landing-page.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { VideoUtilService } from '../../videos/services/video-util.service';
import {LandingPageAnalyticsPostDto} from '../../landing-pages/models/landing-page-analytics-post-dto';
import {CampaignService} from 'app/campaigns/services/campaign.service';
declare var  $,swal: any;

@Component({
  selector: 'app-landing-page-analytics',
  templateUrl: './landing-page-analytics.component.html',
  styleUrls: ['./landing-page-analytics.component.css'],
  providers: [Pagination,HttpRequestLoader,SortOption]
})
export class LandingPageAnalyticsComponent implements OnInit,OnDestroy {
    
    daySort: { 'name': string; 'value': string; };
    landingPageId: number = 0;
    landingPageAlias:string = "";
    campaignId:number = 0;
    partnerId:number = 0;
    pagination: Pagination = new Pagination();
    countryPagination:Pagination = new Pagination();
    barChartPagination:Pagination = new Pagination();
    statusCode:number = 200;
    viewsStatusCode:number = 200;
    barChartStatusCode:number = 200;
    landingPageViewsData:any;
    data:any;
    landingPageAnalyticsContext:any;
    countryViewsAnalyticsContext:any;
    barChartViewsAnalyticsContext:any;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    countryViewsLoader:HttpRequestLoader = new HttpRequestLoader();
    barChartViewsLoader:HttpRequestLoader = new HttpRequestLoader();
    countryCode:string = "";
    barChartData:any;
    barChartErrorMessage:string="";
    barChartPopUp:boolean =false;
    barChartFilterErrorMessage:string="";
    landingPageAnalyticsPostDto:LandingPageAnalyticsPostDto = new LandingPageAnalyticsPostDto();
    partnerEmailId:string = "";
    managePagesRouterLink = "/home/pages/manage";
    routerLink = "";
    pageLoader = false;
    @Input() vendorJourney = false;
    @Input() vendorPages = false;
    @Input() vendorLandingPageId;
    @Input() vendorPageAlias;
    @Input() masterLandingPages= false;
    campaignTitle = "";
    constructor(public route: ActivatedRoute, public landingPageService: LandingPageService, public referenceService: ReferenceService,
        public pagerService: PagerService, public authenticationService: AuthenticationService, 
        public router: Router,public logger: XtremandLogger,public sortOption:SortOption,public videoUtilService: VideoUtilService,private campaignService:CampaignService) {
        this.daySort = this.videoUtilService.sortMonthDates[3];
        this.pagination.userId = this.authenticationService.getUserId();
    }

    ngOnInit() {
        this.pageLoader = true;
        this.landingPageId = this.route.snapshot.params['landingPageId'];
        this.campaignTitle = this.route.snapshot.params['campaignTitle'];
        this.campaignId = this.referenceService.decodePathVariable(this.route.snapshot.params['campaignId']);
        this.landingPageAlias = this.route.snapshot.params['alias'];
        this.partnerId = this.referenceService.decodePathVariable(this.route.snapshot.params['partnerId']);
        let categoryId = this.route.snapshot.params['categoryId'];
        if(this.vendorJourney || this.masterLandingPages){
            this.landingPageId = this.vendorLandingPageId;
        }
        if(this.vendorPages){
            this.landingPageAlias = this.vendorPageAlias;
            this.landingPageAnalyticsPostDto.vendorPages = true;
        }
        if(categoryId>0){
            this.routerLink = this.managePagesRouterLink+"/"+categoryId;
        }else{
            this.routerLink = this.managePagesRouterLink;
        }
        if(this.campaignId!=undefined){
            this.pagination.campaignId = this.campaignId;
            this.landingPageId = 0;
            this.pagination.landingPageId = 0;
            this.landingPageAnalyticsPostDto.analyticsTypeString = "Campaign";
            this.landingPageAnalyticsPostDto.campaignId = this.campaignId;
            this.landingPageAnalyticsPostDto.userId = this.pagination.userId;
            this.landingPageAnalyticsPostDto.partnerId = this.partnerId;
            this.pagination.partnerId = this.partnerId;
            if(this.partnerId!=undefined){
                this.validateCampaignIdAndUserId();
            }else{
                this.validateCampaignId();
            }
        }else if(this.landingPageId!=undefined){
            this.pagination.landingPageId = this.landingPageId;
            this.pagination.campaignId = 0;
            this.landingPageAnalyticsPostDto.analyticsTypeString = "Campaign&LandingPage";
            this.landingPageAnalyticsPostDto.userId = this.pagination.userId;
            this.landingPageAnalyticsPostDto.landingPageId = this.landingPageId;
            this.loadAnalytics();
        }else{
            this.pagination.landingPageAlias = this.landingPageAlias;
            this.pagination.campaignId = 0;
            this.landingPageId = 0;
            this.pagination.landingPageId = 0;
            this.campaignId = 0;
            this.landingPageAnalyticsPostDto.analyticsTypeString = "PartnerLandingPage";
            this.landingPageAnalyticsPostDto.userId = this.pagination.userId;
            this.landingPageAnalyticsPostDto.landingPageAlias = this.landingPageAlias;
            this.loadAnalytics();
        }
        
    }

    ngOnDestroy(): void {
        $('#country-views-modal').modal('hide');
    }

    validateCampaignIdAndUserId(){
        this.campaignService.validateCampaignIdAndUserId(this.campaignId,this.partnerId).
        subscribe(
            response=>{
                this.loadAnalyticsOrNavigateToPageNotFound(response);
            },error=>{
                this.logger.errorPage(error);
            }
        );
    }

    validateCampaignId(){
        this.campaignService.checkCampaignIdAccess(this.campaignId).
        subscribe(
            response=>{
                this.loadAnalyticsOrNavigateToPageNotFound(response);
            },error=>{
                this.logger.errorPage(error);
            }
        );
    }

    loadAnalyticsOrNavigateToPageNotFound(response){
        if(response.statusCode==200){
            this.loadAnalytics();
        }else{
            this.referenceService.goToPageNotFound();
        }
    }

    loadAnalytics(){
        this.pagination.loader = this.httpRequestLoader;
        this.listAnalytics(this.pagination);
        this.landingPageAnalyticsContext = {'analyticsData':this.pagination};
        this.getCountryViews();
        this.getBarChartAnalytics(this.videoUtilService.sortMonthDates[3].value);
    }
    
    getBarChartAnalytics(timePeriod:string){
        this.barChartErrorMessage = "";
        this.barChartData  = undefined;
        if (timePeriod !== undefined) {
            this.videoUtilService.timePeriod = timePeriod;
            this.landingPageAnalyticsPostDto.timePeriod = timePeriod;
            this.landingPageAnalyticsPostDto.landingPageId = this.landingPageId;
            this.landingPageAnalyticsPostDto.userId = this.pagination.userId;
            this.landingPageAnalyticsPostDto.campaignId = this.campaignId;
            this.landingPageAnalyticsPostDto.landingPageAlias = this.landingPageAlias;
            this.landingPageAnalyticsPostDto.partnerId = this.partnerId;
            this.landingPageService.getBarCharViews(this.landingPageAnalyticsPostDto).subscribe(
                    ( response: any ) => {
                        this.barChartStatusCode = response.statusCode;
                        if(this.barChartStatusCode==200){
                            this.barChartData = response.data;
                        }
                    },
                    ( error: any ) => {  this.barChartErrorMessage="OOps! Unable to load bar chart." } );
        }
       
    }
    
    getCountryViews(){
        this.landingPageService.getCountryViewershipMapData(this.landingPageAnalyticsPostDto).subscribe(
            ( response: any ) => {
                this.viewsStatusCode = response.statusCode;
                if(this.viewsStatusCode==200){
                    this.landingPageViewsData = response.data;
                }
            },
            ( error: any ) => { this.logger.errorPage( error ); } );
    }
    
    listAnalytics(pagination:Pagination){
        this.referenceService.loading( pagination.loader, true );
        pagination.partnerId = this.partnerId;
        if(this.vendorPages){
            pagination.vendorPages = true;
        }
        this.landingPageService.listAnalytics( pagination,this.countryCode ).subscribe(
            ( response: any ) => {
                this.statusCode = response.statusCode;
                if(this.statusCode==200){
                    const data = response.data;
                    pagination.totalRecords = data.totalRecords;
                    this.partnerEmailId = data.partnerEmailId;
                    this.sortOption.totalRecords = data.totalRecords;
                    $.each(data.landingPageAnalytics,function(index,analytics){
                        if($.trim(analytics.openedTimeInString).length>0){
                            analytics.displayTime = new Date(analytics.openedTimeInString);
                        }else{
                            analytics.displayTime = new Date();
                        }
                   });
                    pagination = this.pagerService.getPagedItems(pagination, data.landingPageAnalytics);
                }
                this.referenceService.loading(pagination.loader, false );
                this.pageLoader = false;
            },
            ( error: any ) => {this.closeModal();this.logger.errorPage( error ); } );
    
    }
    
    /********************Pagaination&Search Code*****************/

    /*************************Sort********************** */
    sortBy( text: any,pagination:Pagination ) {
        this.sortOption.formsSortOption = text;
        this.getAllFilteredResults(pagination);
    }


    /*************************Search********************** */
    search(pagination:Pagination) {
        this.getAllFilteredResults(pagination);
    }
    
    paginationDropdown(items:any,pagination:Pagination){
        this.sortOption.itemsSize = items;
        this.getAllFilteredResults(pagination);
    }

    /************Page************** */
    setPage( event: any,pagination:Pagination) {
        $( window ).scrollTop( 0 );
        pagination.pageIndex = event.page;
        this.listAnalytics(pagination);
    }

    getAllFilteredResults( pagination: Pagination) {
        pagination.pageIndex = 1;
        pagination.searchKey = this.sortOption.searchKey;
       // this.pagination = this.utilService.sortOptionValues(this.sortOption.formsSortOption, this.pagination);
        this.listAnalytics(pagination);
    }
    
  //  eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.search(loader:HttpRequestLoader); } }
    refreshList(pagination:Pagination){
        pagination.pageIndex = 1;
        pagination.searchKey = "";
        this.listAnalytics(pagination);
    }
    
    
    getViewsByCountryCode(countryCode:any,loader:HttpRequestLoader){
        this.barChartPopUp = false;
        $('#country-views-modal').modal('show');
        this.countryPagination.landingPageId = this.landingPageId;
        this.countryPagination.campaignId = this.campaignId;
        this.countryPagination.userId = this.authenticationService.getUserId();
        this.countryPagination.loader = this.countryViewsLoader;
        this.countryPagination.landingPageAlias  = this.landingPageAlias;
        this.countryCode = countryCode;
        this.listAnalytics(this.countryPagination);
        this.countryViewsAnalyticsContext = {'analyticsData':this.countryPagination};
    }
    closeModal(){
        this.countryPagination = new Pagination();
        this.barChartPagination = new Pagination();
        this.countryCode = "";
        this.barChartPopUp = false;
        this.barChartFilterErrorMessage = "";
        this.barChartErrorMessage ="";
        $('#country-views-modal').modal('hide');
    }
    
    viewInDetail(value:any){
        this.barChartPopUp = true;
        $('#country-views-modal').modal('show');
        this.barChartPagination.landingPageId = this.landingPageId;
        this.barChartPagination.userId = this.authenticationService.getUserId();
        this.barChartPagination.loader = this.barChartViewsLoader;
        this.barChartPagination.campaignId = this.campaignId;
        this.barChartPagination.landingPageAlias = this.landingPageAlias;
        this.listBarChartAnalytics(this.barChartPagination, this.videoUtilService.timePeriod, value);
        this.barChartViewsAnalyticsContext = {'analyticsData':this.barChartPagination};
    }
    
    listBarChartAnalytics(pagination:Pagination,timePeriod:string,filterValue:any){
        this.referenceService.loading( pagination.loader, true );
        pagination.partnerId = this.partnerId;
        this.landingPageService.listBarChartAnalytics(pagination,timePeriod,filterValue,this.landingPageAnalyticsPostDto.analyticsTypeString).subscribe(
            ( response: any ) => {
                this.statusCode = response.statusCode;
                if(this.statusCode==200){
                    const data = response.data;
                    pagination.totalRecords = data.totalRecords;
                    this.sortOption.totalRecords = data.totalRecords;
                    $.each(data.landingPageAnalytics,function(index,analytics){
                        if($.trim(analytics.openedTimeInString).length>0){
                            analytics.displayTime = new Date(analytics.openedTimeInString);
                        }else{
                            analytics.displayTime = new Date();
                        }
                   });
                    pagination = this.pagerService.getPagedItems(pagination, data.landingPageAnalytics);
                }
                this.referenceService.loading(pagination.loader, false );
            },
            ( error: any ) => {  this.barChartFilterErrorMessage="OOps! Unable to load bar chart for "+this.videoUtilService.timePeriod } );
    }

    goToCampaignAnalytics(){
        let campaign = {};
        campaign['campaignId'] = this.campaignId;
        campaign['campaignTitle'] = this.campaignTitle;
        this.referenceService.navigateBackToCampaignAnalytics(campaign);
    }
}
