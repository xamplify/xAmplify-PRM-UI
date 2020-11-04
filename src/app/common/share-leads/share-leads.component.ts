import { Component, OnInit, Input, Output, EventEmitter,AfterViewInit,OnDestroy,ViewChild } from '@angular/core';
import { User } from '../../core/models/user';
import { Router } from '@angular/router';
import { CountryNames } from '../../common/models/country-names';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { ContactService } from '../../contacts/services/contact.service';
import { VideoFileService } from '../../videos/services/video-file.service'
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { LegalBasisOption } from '../../dashboard/models/legal-basis-option';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';

declare var $: any;

@Component( {
    selector: 'app-share-leads',
    templateUrl: './share-leads.component.html',
    styleUrls: ['./share-leads.component.css', '../../../assets/css/phone-number-plugin.css'],
    providers: [Pagination, PagerService]
})
export class ShareLeadsComponent implements OnInit, AfterViewInit,OnDestroy {
	@Output() notifyParent: EventEmitter<any>;

	partners = [];
	selectedPartner: any;
	totalRecords: number;
	 sortOptions = [
	                { 'name': 'Sort By', 'value': '' },
	                { 'name': 'Email(A-Z)', 'value': 'emailId-ASC' },
	                { 'name': 'Email(Z-A)', 'value': 'emailId-DESC' },
	                { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
	                { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
	                { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
	                { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
	                { 'name': 'Company Name(ASC)', 'value': 'contactCompany-ASC' },
	                { 'name': 'Company Name(DESC)', 'value': 'contactCompany-DESC' },
	            ];
	            public sortOption: any = this.sortOptions[0];
	            public searchKey: string;
	            sortcolumn: string = null;
	            sortingOrder: string = null;
	
    constructor(public countryNames: CountryNames, public regularExpressions: RegularExpressions, public router: Router,
        public contactService: ContactService, public videoFileService: VideoFileService, public referenceService: ReferenceService,
        public xtremandLogger: XtremandLogger, public authenticationService: AuthenticationService, public pagination: Pagination,
        public pagerService: PagerService) {
        this.notifyParent = new EventEmitter();
}

	 shareLeadsModalClose() {
	        $( '#shareleads' ).modal( 'toggle' );
	        $( "#shareleads .close" ).click()
	        $( '#shareleads' ).modal( 'hide' );
	        $( 'body' ).removeClass( 'modal-open' );
	        $( '.modal-backdrop fade in' ).remove();
	        $( ".modal-backdrop in" ).css( "display", "none" );
	        this.authenticationService.isSharePartnerModal=false;
	    }
	 
     getPartners(pagination: Pagination) {
    	
         this.contactService.getPartners(this.pagination)
             .subscribe(
             data => {
            	    console.log(data);
            	    this.partners =  data.partners;
            	    this.totalRecords = data.totalRecords;
            	    this.pagination.totalRecords = this.totalRecords;
                    this.pagination = this.pagerService.getPagedItems( pagination, this.partners );
            	  

             }, (error: any) => {
                 this.xtremandLogger.error(error);
             },
             () => this.xtremandLogger.info("getPartners completed")

             );
	 }
     
     onChangeAllPartnerUsers( event: Pagination ) {
         this.pagination = event;
         this.getPartners( this.pagination );

     }
     
     sortByOption( event: any, selectedType: string ) {
         this.sortOption = event;
         const sortedValue = this.sortOption.value;
         if ( sortedValue !== '' ) {
             const options: string[] = sortedValue.split( '-' );
             this.sortcolumn = options[0];
             this.sortingOrder = options[1];
         } else {
             this.sortcolumn = null;
             this.sortingOrder = null;
         }

         this.pagination.pageIndex = 1;
         this.pagination.sortcolumn = this.sortcolumn;
         this.pagination.sortingOrder = this.sortingOrder;
         this.getPartners( this.pagination );

     }
     
     search() {
         this.pagination.searchKey = this.searchKey;
         this.pagination.pageIndex = 1;
         this.getPartners( this.pagination );
     }
     
     selectedPartnerObject() {
     
          this.notifyParent.emit( this.selectedPartner );
          this.shareLeadsModalClose();
             
           
     }
     selectPartner(partner: any){
    	 this.selectedPartner = partner;
     }
     
     setPage( event: any ) {
         this.pagination.pageIndex = event.page;
         this.getPartners( this.pagination );
     }
	 
	
    ngOnInit() {
    	 $( '#shareleads' ).modal( 'show' );
    	  this.getPartners(this.pagination);
    }
	
	 ngAfterViewInit(){
	    }
	    ngOnDestroy(){
	        //this.addContactModalClose();
	    }	
}
