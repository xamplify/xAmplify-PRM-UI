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
declare var  $: any;

@Component({
  selector: 'app-landing-page-analytics',
  templateUrl: './landing-page-analytics.component.html',
  styleUrls: ['./landing-page-analytics.component.css'],
  providers: [Pagination,HttpRequestLoader,SortOption]
})
export class LandingPageAnalyticsComponent implements OnInit {

    landingPageId: number = 0;
    pagination: Pagination = new Pagination();
    ngxloading = false;
    loggedInUserId = 0;
    constructor( public route: ActivatedRoute, public landingPageService: LandingPageService, public referenceService: ReferenceService,
        public httpRequestLoader: HttpRequestLoader, 
        public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router,public logger: XtremandLogger,public sortOption:SortOption ) { }

    ngOnInit() {
        this.landingPageId = this.route.snapshot.params['landingPageId'];
        this.pagination.campaignId = this.landingPageId;
        this.listAnalytics( this.pagination );
    }
    
    listAnalytics(pagination:Pagination){
        this.referenceService.loading( this.httpRequestLoader, true );
        this.landingPageService.listAnalytics( pagination ).subscribe(
            ( response: any ) => {
                console.log(response);
                const data = response.data;
                pagination.totalRecords = data.totalRecords;
                this.sortOption.totalRecords = data.totalRecords;
                $.each(data.landingPageAnalytics,function(index,analytics){
                    console.log(analytics.openedTimeInString);
                    analytics.displayTime = new Date(analytics.openedTimeInString);
               });
                pagination = this.pagerService.getPagedItems(pagination, data.landingPageAnalytics);
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            ( error: any ) => { this.logger.errorPage( error ); } );
    
    }

}
