import { Component, OnInit, OnDestroy,ViewChild,AfterViewInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ActionsDescription } from '../../common/models/actions-description';
import { LandingPage } from '../models/landing-page';
import { UtilService } from '../../core/services/util.service';
import {Inject} from "@angular/core";
import {DOCUMENT} from "@angular/platform-browser";
import { environment } from '../../../environments/environment';
import { SortOption } from '../../core/models/sort-option';
import { LandingPageService } from '../services/landing-page.service';
declare var swal, $: any;
@Component({
  selector: 'app-manage-landing-page',
  templateUrl: './manage-landing-page.component.html',
  styleUrls: ['./manage-landing-page.component.css'],
  providers: [Pagination, HttpRequestLoader,ActionsDescription,SortOption],
})
export class ManageLandingPageComponent implements OnInit, OnDestroy {

    landingPage: LandingPage = new LandingPage();
    ngxloading = false;
    pagination: Pagination = new Pagination();
    loggedInUserId = 0;
    customResponse: CustomResponse = new CustomResponse();
    copiedLinkCustomResponse: CustomResponse = new CustomResponse();
    isListView = false;
    private dom: Document;
    clientUrl = environment.CLIENT_URL;
    message = "";
    campaignId = 0;
    statusCode = 200;
    constructor( public referenceService: ReferenceService,
            public httpRequestLoader: HttpRequestLoader, public pagerService:
                PagerService, public authenticationService: AuthenticationService,
            public router: Router, public landingPageService: LandingPageService, public logger: XtremandLogger,
            public actionsDescription: ActionsDescription,public sortOption:SortOption,private utilService:UtilService,private route: ActivatedRoute) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.pagination.userId = this.loggedInUserId;
        if ( this.referenceService.isCreated ) {
            this.message = "Landing page created successfully";
            this.showMessageOnTop( this.message );
        } else if ( this.referenceService.isUpdated ) {
            this.message = "Landing page updated successfully";
            this.showMessageOnTop( this.message );
        }
        
    }
    
    ngOnInit() {
        this.listLandingPages(this.pagination);
    }
    
    
    listLandingPages( pagination: Pagination ) {
        this.referenceService.loading( this.httpRequestLoader, true );
        this.landingPageService.list( pagination ).subscribe(
            ( response: any ) => {
                const data = response.data;
                this.statusCode = response.statusCode;
                if(this.statusCode==200){
                    pagination.totalRecords = data.totalRecords;
                    this.sortOption.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination, data.landingPages);
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
    searchLandingPages() {
        this.getAllFilteredResults( this.pagination );
    }
    
    paginationDropdown(items:any){
        this.sortOption.itemsSize = items;
        this.getAllFilteredResults(this.pagination);
    }

    /************Page************** */
    setPage( event: any ) {
        this.pagination.pageIndex = event.page;
        this.listLandingPages( this.pagination );
    }

    getAllFilteredResults( pagination: Pagination ) {
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.sortOption.searchKey;
        this.pagination = this.utilService.sortOptionValues(this.sortOption.formsSortOption, this.pagination);
        this.listLandingPages( this.pagination );
    }
    eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.searchLandingPages(); } }
    /********************Pagaination&Search Code*****************/
    showMessageOnTop( message ) {
        $( window ).scrollTop( 0 );
        this.customResponse = new CustomResponse( 'SUCCESS', message, true );
    }
    
    /***********Preview Email Template*********************/
    showPreview(landingPage:LandingPage){
        this.ngxloading = true;
       // this.referenceService.loading( this.httpRequestLoader, true );
        this.landingPageService.getHtmlContent(landingPage.id).subscribe(
                ( response: any ) => {
                    if(response.statusCode==200){
                        let title = "#landing-page-title";
                        let htmlContent = "#htmlContent";
                        $(htmlContent).empty();
                        $(title).empty();
                        $(title).append(landingPage.name);
                        $(title).prop('title',landingPage.name);
                        $(htmlContent).append(response.message);
                        $('.modal .modal-body').css('overflow-y', 'auto');
                        $("#landing-page-preview").modal('show');
                        this.ngxloading = false;
                    }else{
                        swal("Please Contact Admin!", "No Landing Page Found", "error");
                    }
                    //this.referenceService.loading( this.httpRequestLoader, false );
                },
                ( error: any ) => { this.logger.errorPage( error ); } );
    }
    
    
    ngOnDestroy() {
        this.referenceService.isCreated = false;
        this.referenceService.isUpdated = false;
        this.message = "";
        this.landingPage = new LandingPage();
        swal.close();
    }

}
