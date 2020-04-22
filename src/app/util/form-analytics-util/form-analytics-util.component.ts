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
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { Properties } from '../../common/models/properties';
import { CustomResponse } from '../../common/models/custom-response';

declare var $: any, swal: any;


@Component( {
    selector: 'app-form-analytics-util',
    templateUrl: './form-analytics-util.component.html',
    styleUrls: ['./form-analytics-util.component.css'],
    providers: [Pagination, HttpRequestLoader,FormService,CallActionSwitch,Properties]
} )
export class FormAnalyticsUtilComponent implements OnInit {
    copiedLinkCustomResponse: CustomResponse = new CustomResponse();
    formId: any;
    partnerLandingPageAlias: any;
    loggedInUserId: number = 0;
    partnerId:number = 0;
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
    isTotalLeadsData = false;
    isTotalAttendees: boolean;
    @Input() importedObject:any;
    status = true;
    title:string = "";
    isEventCheckIn = false;
    customResponse: CustomResponse = new CustomResponse();
    publicEventAlias = "";
    constructor( public referenceService: ReferenceService, private route: ActivatedRoute,
        public authenticationService: AuthenticationService, public formService: FormService,
        public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService, public router: Router,
        public logger: XtremandLogger,public callActionSwitch: CallActionSwitch,public properties:Properties
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
            this.partnerId = this.importedObject['partnerId'];
            this.title = this.importedObject['title'];
            if(this.campaignAlias!=undefined){
                this.pagination.campaignId = parseInt(this.campaignAlias);
                this.pagination.partnerId = this.partnerId;
                this.pagination.publicEventLeads = this.importedObject['isPublicEventLeads'];
                this.pagination.eventCampaign = this.importedObject['eventCampaign'];
                this.pagination.totalLeads = this.importedObject['totalLeads'];
                this.pagination.totalAttendees = this.importedObject['totalAttendees'];
                this.pagination.totalPartnerLeads = this.importedObject['totalPartnerLeads'];
                this.pagination.checkInLeads = this.importedObject['checkInLeads'];
                this.isEventCheckIn = this.pagination.checkInLeads;
                this.publicEventAlias = this.importedObject['publicEventAlias'];
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
                this.isTotalLeadsData = this.pagination.totalLeads;
                this.isTotalAttendees = this.pagination.totalAttendees;
                this.statusCode = response.statusCode;
                if ( response.statusCode == 200 ) {
                    //this.formName = data.formName;
                    if(this.title==undefined){
                        this.title = data.formName;
                    }
                    if(this.isTotalLeadsData){
                        this.title = "Total Leads";
                    }
                    if(this.isTotalAttendees || this.pagination.checkInLeads){
                        this.title = "Total Attendees";
                    }
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
        this.pagination.searchKey = "";
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
    
    downloadCsv(){
        if(this.pagination.totalPartnerLeads){
            window.open(this.authenticationService.REST_URL+"pl/"+this.pagination.campaignId+"/"+false);
        }else if(this.pagination.checkInLeads){
            window.open(this.authenticationService.REST_URL+"eccl/"+this.pagination.campaignId);
        }else{
            window.open(this.authenticationService.REST_URL+"ectl/"+this.pagination.campaignId+"/"+this.isTotalAttendees);
        }
    }
    checkIn(event:any,formDataRow:any){
        let formSubmitId = formDataRow['formSubmittedId'];
        formDataRow['checkedInForEvent'] = event;
        this.referenceService.loading( this.httpRequestLoader, true );
        this.formService.checkInAttendees( this.pagination.campaignId, formSubmitId, event ).subscribe(
            ( response: any ) => {
                const data = response.data;
                this.statusCode = response.statusCode;
                $( window ).scrollTop( 0 );
                this.customResponse = new CustomResponse( 'SUCCESS', response.message, true );
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            ( error: any ) => { this.referenceService.showSweetAlert( this.properties.serverErrorMessage, "", "error" ); this.referenceService.loading( this.httpRequestLoader, false ); } );
    }
    
    openLinkInBrowser(){
        if(this.authenticationService.vanityURLEnabled && this.authenticationService.vanityURLink){
            window.open(this.authenticationService.vanityURLink+"rsvp/"+this.publicEventAlias+"?type=YES&utm_source=public","_blank");
        }else{
            window.open(this.authenticationService.APP_URL+"rsvp/"+this.publicEventAlias+"?type=YES&utm_source=public","_blank");
        }        
    }
    

}
