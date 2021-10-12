import { Component, OnInit, OnDestroy,Input } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { ReferenceService } from '../../core/services/reference.service';
import { LandingPageService } from '../services/landing-page.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';

declare var  $: any;

@Component({
  selector: 'app-landing-page-analytics-util',
  templateUrl: './landing-page-analytics-util.component.html',
  styleUrls: ['./landing-page-analytics-util.component.css'],
  providers: [Pagination,HttpRequestLoader,SortOption]
})
export class LandingPageAnalyticsUtilComponent implements OnInit,OnDestroy {
   

    landingPageId: number = 0;
    pagination: Pagination;
    ngxloading = false;
    statusCode:number = 200;
    viewsStatusCode:number = 200;
    landingPageViewsData:any;
    data:any;
    @Input() map;
    constructor( public route: ActivatedRoute, public landingPageService: LandingPageService, public referenceService: ReferenceService,
        public httpRequestLoader: HttpRequestLoader, 
        public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router,public logger: XtremandLogger,public sortOption:SortOption ) {
    }

    ngOnInit() {
        this.pagination = this.map.get("pagination");
        this.listAnalytics( this.pagination,"");
        this.getViews();
    }

    ngOnDestroy(): void {
        $('#country-views-modal').modal('hide');
    }
    
    getViews(){
       /* this.landingPageService.getCountryViewershipMapData(this.landingPageId,this.pagination.userId).subscribe(
            ( response: any ) => {
                this.viewsStatusCode = response.statusCode;
                if(this.viewsStatusCode==200){
                    this.landingPageViewsData = response.data;
                }
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            ( error: any ) => { this.logger.errorPage( error ); } );*/
    }
    
    listAnalytics(pagination:Pagination,countryCode:string){
        $( window ).scrollTop( 0 );
        this.referenceService.loading( this.httpRequestLoader, true );
        this.landingPageService.listAnalytics( pagination,countryCode ).subscribe(
            ( response: any ) => {
                this.statusCode = response.statusCode;
                if(this.statusCode==200){
                    const data = response.data;
                    console.log(data);
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
                
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            ( error: any ) => { this.logger.errorPage( error ); } );
    
    }
    
    /********************Pagaination&Search Code*****************/

    /*************************Sort********************** */
    sortBy( text: any ) {
        this.sortOption.formsSortOption = text;
        this.getAllFilteredResults( this.pagination );
    }


    /*************************Search********************** */
    search() {
        this.getAllFilteredResults( this.pagination );
    }
    
    paginationDropdown(items:any){
        this.sortOption.itemsSize = items;
        this.getAllFilteredResults(this.pagination);
    }

    /************Page************** */
    setPage( event: any ) {
        this.pagination.pageIndex = event.page;
        this.listAnalytics( this.pagination,"" );
    }

    getAllFilteredResults( pagination: Pagination ) {
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.sortOption.searchKey;
       // this.pagination = this.utilService.sortOptionValues(this.sortOption.formsSortOption, this.pagination);
        this.listAnalytics( this.pagination,"" );
    }
    eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.search(); } }
    refreshList(){
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = "";
        this.sortOption.searchKey = "";
        this.listAnalytics(this.pagination,"");
    }
    
    
    getViewsByCountryCode(countryCode:any){
        this.listAnalytics( this.pagination,countryCode);
    }

}
