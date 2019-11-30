import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { FormService } from '../../forms/services/form.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SubmittedFormRow } from '../../forms/models/submitted-form-row';
import { SubmittedFormData } from '../../forms/models/submitted-form-data';
import { Router } from '@angular/router';

declare var $: any, swal: any;


@Component( {
    selector: 'app-form-analytics-util',
    templateUrl: './form-analytics-util.component.html',
    styleUrls: ['./form-analytics-util.component.css'],
    providers: [Pagination, HttpRequestLoader,FormService]
} )
export class FormAnalyticsUtilComponent implements OnInit {
    formId: any;
    partnerLandingPageAlias: any;
    loggedInUserId: number = 0;
    alias: string = "";
    campaignAlias: string = "";
    formName = "";
    pagination: Pagination = new Pagination();
    columns: Array<any> = new Array<any>();
    formDataRows: Array<SubmittedFormData> = new Array<SubmittedFormData>();
    statusCode: number = 200;
    selectedSortedOption: any;
    searchKey = "";
    campaignForms = false;
    routerLink = "/home/forms/manage";
    @Input() importedObject:any;
    constructor( public referenceService: ReferenceService, private route: ActivatedRoute,
        public authenticationService: AuthenticationService, public formService: FormService,
        public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService, public router: Router,
        public logger: XtremandLogger
    ) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.pagination.userId = this.loggedInUserId;
    }

    ngOnInit() {
        let objectLength = Object.keys(this.importedObject).length;
        if(objectLength>0){
            this.alias = this.importedObject['formAlias'];
            this.campaignAlias = this.importedObject['campaignAlias'];
            this.partnerLandingPageAlias = this.importedObject['partnerLandingPageAlias'];
            this.formId = this.importedObject['formId'];
            this.pagination.publicEventLeads = this.importedObject['isPublicEventLeads'];
            if(this.campaignAlias!=undefined){
                this.pagination.campaignId = parseInt(this.campaignAlias);
            }else if(this.partnerLandingPageAlias!=undefined){
                this.pagination.landingPageAlias = this.partnerLandingPageAlias;
                this.pagination.formId = this.formId;
                this.alias = "";
                this.pagination.partnerLandingPageForm = true;
            }
            this.listSubmittedData( this.pagination );
        }
        
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
                } else {
                    console.log( response.statusCode );
                }
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            ( error: any ) => { this.logger.errorPage( error ); } );
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

    goToCampaignAnalytics() {
        this.router.navigate( ['home/campaigns/' + parseInt( this.campaignAlias ) + '/details'] );
    }

}
