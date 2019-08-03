import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { ReferenceService } from '../../core/services/reference.service';
import { LandingPageService } from '../services/landing-page.service';
import { LandingPageAnalytics } from '../models/landing-page-analytics';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { VideoUtilService } from '../../videos/services/video-util.service';

declare var  $,swal: any;

@Component({
  selector: 'app-landing-page-analytics',
  templateUrl: './landing-page-analytics.component.html',
  styleUrls: ['./landing-page-analytics.component.css'],
  providers: [Pagination,HttpRequestLoader,SortOption]
})
export class LandingPageAnalyticsComponent implements OnInit {
    daySort: { 'name': string; 'value': string; };
    landingPageId: number = 0;
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
    barChartErrorMessage:string;
    barChartPopUp:boolean =false;
    constructor( public route: ActivatedRoute, public landingPageService: LandingPageService, public referenceService: ReferenceService,
        public pagerService: PagerService, public authenticationService: AuthenticationService, 
        public router: Router,public logger: XtremandLogger,public sortOption:SortOption,public videoUtilService: VideoUtilService ) {
        this.daySort = this.videoUtilService.sortMonthDates[3];
        this.pagination.userId = this.authenticationService.getUserId();
    }

    ngOnInit() {
        this.landingPageId = this.route.snapshot.params['landingPageId'];
        this.pagination.landingPageId = this.landingPageId;
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
            this.landingPageService.getBarCharViews(timePeriod,this.landingPageId,this.pagination.userId).subscribe(
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
        this.landingPageService.getViews(this.landingPageId,this.pagination.userId).subscribe(
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
        this.landingPageService.listAnalytics( pagination,this.countryCode ).subscribe(
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
            ( error: any ) => { this.logger.errorPage( error ); } );
    
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
        this.countryPagination.userId = this.authenticationService.getUserId();
        this.countryPagination.loader = this.countryViewsLoader;
        this.countryCode = countryCode;
        this.listAnalytics(this.countryPagination);
        this.countryViewsAnalyticsContext = {'analyticsData':this.countryPagination};
    }
    closeModal(){
        this.countryPagination = new Pagination();
        this.barChartPagination = new Pagination();
        this.countryCode = "";
        this.barChartPopUp = false;
        $('#country-views-modal').modal('hide');
    }
    
    viewInDetail(value:any){
        this.barChartPopUp = true;
        $('#country-views-modal').modal('show');
        this.barChartPagination.landingPageId = this.landingPageId;
        this.barChartPagination.userId = this.authenticationService.getUserId();
        this.barChartPagination.loader = this.barChartViewsLoader;
        this.listBarChartAnalytics(this.barChartPagination, this.videoUtilService.timePeriod, value);
        this.barChartViewsAnalyticsContext = {'analyticsData':this.barChartPagination};
    }
    
    listBarChartAnalytics(pagination:Pagination,timePeriod:string,filterValue:any){
        this.referenceService.loading( pagination.loader, true );
        this.landingPageService.listBarChartAnalytics( pagination,timePeriod,filterValue).subscribe(
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
            ( error: any ) => { this.logger.errorPage( error ); } );
    
    
    }

}
