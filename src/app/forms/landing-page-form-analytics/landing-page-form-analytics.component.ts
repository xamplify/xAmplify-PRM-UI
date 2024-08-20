import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { FormService } from '../services/form.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SubmittedFormData } from '../models/submitted-form-data';
declare var $: any, swal: any;


@Component( {
    selector: 'app-landing-page-form-analytics',
    templateUrl: './landing-page-form-analytics.component.html',
    styleUrls: ['./landing-page-form-analytics.component.css'],
    providers: [Pagination, HttpRequestLoader]
} )
export class LandingPageFormAnalyticsComponent implements OnInit {
    loggedInUserId: number = 0;
    alias: string = "";
    landingPageId: string = "";
    formName = "";
    pagination: Pagination = new Pagination();
    columns: Array<any> = new Array<any>();
    formDataRows: Array<SubmittedFormData> = new Array<SubmittedFormData>();
    statusCode: number = 200;
    selectedSortedOption: any;
    searchKey = "";
    landingPageForms = false;
    formsRouterLink = "/home/forms/manage";
    pagesRouterLink = "/home/pages/manage";
    categoryId:number = 0;
    constructor( public referenceService: ReferenceService, private route: ActivatedRoute,
        public authenticationService: AuthenticationService, public formService: FormService,
        public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService,
        public logger: XtremandLogger
    ) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.pagination.userId = this.loggedInUserId;
        this.categoryId = this.route.snapshot.params['categoryId'];

    }

    ngOnInit() {
        this.alias = this.route.snapshot.params['alias'];
        this.landingPageId = this.route.snapshot.params['landingPageAlias'];
        if ( this.landingPageId != undefined ) {
            this.pagination.landingPageId = parseInt( this.landingPageId );
            this.landingPageForms = true;
            if(this.categoryId>0){
                this.formsRouterLink = "/home/forms/category/" +this.categoryId+"/lf/"+ this.pagination.landingPageId;
            }else{
                this.formsRouterLink = "/home/forms/lf/" + this.pagination.landingPageId;
            }
            this.pagesRouterLink = "/home/pages/manage";
        }
        this.listSubmittedData( this.pagination );
    }

    listSubmittedData( pagination: Pagination ) {
        pagination.searchKey = this.searchKey;
        this.referenceService.loading( this.httpRequestLoader, true );
        this.formService.getFormAnalytics( pagination, this.alias, false ).subscribe(
            ( response: any ) => {
                const data = response.data;
                this.statusCode = response.statusCode;
                if ( response.statusCode == 200 ) {
                    this.formName = data.formName;
                    this.columns = data.columns;
                    this.selectedSortedOption = this.columns[0];
                    this.formDataRows = data.submittedData;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.formDataRows );
                }
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            ( error: any ) => {
                this.httpRequestLoader.isServerError = true;
                this.httpRequestLoader.isLoading = false;
            } );
    }
    search() {
        this.pagination.pageIndex = 1;
        this.listSubmittedData( this.pagination );
    }


    eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.search(); } }

    refreshList() {
        this.listSubmittedData( this.pagination );
    }
    /************Page************** */
    setPage( event: any ) {
        this.pagination.pageIndex = event.page;
        this.listSubmittedData( this.pagination );
    }

    expandColumns( selectedFormDataRow: any, selectedIndex: number ) {
        $.each( this.formDataRows, function( index, row ) {
            if ( selectedIndex != index ) {
                row.expanded = false;
                $( '#form-data-row-' + index ).css( "background-color", "#fff" );
            }
        } );
        selectedFormDataRow.expanded = !selectedFormDataRow.expanded;
        if ( selectedFormDataRow.expanded ) {
            $( '#form-data-row-' + selectedIndex ).css( "background-color", "#d3d3d357" );
        } else {
            $( '#form-data-row-' + selectedIndex ).css( "background-color", "#fff" );
        }

    }

    getSortedResult( text: any ) {
        console.log( text );
    }

    downloadCsv(){
        window.open(this.authenticationService.REST_URL+"form/download/lpfa/"+this.alias+"/"+this.landingPageId+"/"+this.loggedInUserId+"?access_token="+this.authenticationService.access_token);
    }

}
