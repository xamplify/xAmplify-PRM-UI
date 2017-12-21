import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../../core/models/user';
import { Pagination } from '../../core/models/pagination';

import { ContactService } from '../../contacts/services/contact.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { PagerService } from '../../core/services/pager.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';

declare var $: any;

@Component( {
    selector: 'app-manage-partners',
    templateUrl: './manage-partners.component.html',
    styleUrls: ['./manage-partners.component.css'],
    providers: [Pagination]
} )
export class ManagePartnersComponent implements OnInit {
    loggedInUserId: number;
    validEmailPatternSuccess: boolean = true;
    user: User;
    checkingForEmail:boolean;
    addPartnerUser: User = new User();
    newPartnerUser=[];
    partners: User[];
    partnerListId: number;
    totalRecords: number;

public httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    constructor( private authenticationService: AuthenticationService,
        private referenceService: ReferenceService,
        private contactService: ContactService,
        private pagination: Pagination, private pagerService: PagerService, public xtremandLogger:XtremandLogger ) {
        
        this.user = new User();
        this.addPartnerUser.country = (this.referenceService.countries[0]);
    }

    listPartners( userId: number ) {
        this.contactService.listContactsOfDefaultPartnerList( userId, this.pagination )
            .subscribe(
            ( data: any ) => {
                this.pagination.totalRecords = data.totalRecords;
            },
            error =>
                () => console.log( 'loadPartner() finished' )
            );
    }
    
    defaultPartnerList( userId: number ){
        this.contactService.defaultPartnerList( userId )
        .subscribe(
        ( data: any ) => {
            console.log(data);
            this.partnerListId = data.id;
        },
        error => this.xtremandLogger.error( error ),
            () => {
                console.log( 'loadContacts() finished' );
                this.loadPartnerList(this.pagination);
            }
        );
    }
    
    checkingEmailPattern( emailId: string ) {
        this.validEmailPatternSuccess = false;
        if ( this.validateEmailAddress( emailId ) ) {
            this.validEmailPatternSuccess = true;
        } else {
            this.validEmailPatternSuccess = false;
        }
    }

    validateEmailAddress( emailId: string ) {
        var EMAIL_ID_PATTERN = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return EMAIL_ID_PATTERN.test( emailId );
    }
    
    validateEmail(emailId: string){
        if(this.validateEmailAddress( emailId )){
            this.checkingForEmail = true;
            this.validEmailPatternSuccess = true;
        }
        else{
            this.checkingForEmail = false;
        }
    }
    
    addPartnerModalOpen(){
        $( "#addPartnerModal" ).show();
        this.addPartnerUser.country = (this.referenceService.countries[0]);
    }
    
    addPartnerModalClose(){
        $('#addPartnerModal').modal('toggle');
        $( "#addPartnerModal .close" ).click()
    }
    
    downloadEmptyCsv(){
        window.location.href = this.authenticationService.MEDIA_URL+"UPLOAD_USER_LIST _EMPTY.csv";
    }
    
    setPage( page: number, ) {
        this.pagination.pageIndex = page;
            this.loadPartnerList( this.pagination );
    }

    addRow() {
            $( "#addPartnerModal .close" ).click()
            this.newPartnerUser.push( this.addPartnerUser );
            this.addPartnerUser = new User();
    }

    cancelRow( rowId: number ) {
        if ( rowId !== -1 ) {
            this.newPartnerUser.splice( rowId, 1 );
        }
    }
    
    saveValidEmails() {
        this.xtremandLogger.info( "saving #partnerListId " + this.partnerListId + " data => " + JSON.stringify( this.newPartnerUser ) );
        this.contactService.updateContactList( this.partnerListId, this.newPartnerUser )
            .subscribe(
            ( data: any ) => {
                data = data;
                this.xtremandLogger.info( "update partner ListUsers:" + data );
                //this.manageContact.editContactList( this.contactListId, this.contactListName,this.uploadedUserId);
                $( "tr.new_row" ).each( function() {
                    $( this ).remove();
                });
                
                //this.setResponseDetails('SUCCESS', 'your contacts has been saved successfully');
                    
                //this.checkingLoadContactsCount = true;
                this.newPartnerUser.length = 0;
                this.loadPartnerList( this.pagination );
                //this.cancelContacts();
            },
            ( error: any ) => {
                let body: string = error['_body'];
                body = body.substring(1, body.length-1);
                if ( body.includes( 'Please Launch or Delete those campaigns first' )) {
                    //this.setResponseDetails('ERROR', body);
                    console.log("done")
                }else{
                    this.xtremandLogger.errorPage(error);
                }
                console.log( error );
            },
            () => this.xtremandLogger.info( "MangePartnerComponent loadPartners() finished" )
            )
        //this.dublicateEmailId = false;
    }
    
    loadPartnerList( pagination: Pagination ) {
        this.referenceService.loading(this.httpRequestLoader, true); 
        this.httpRequestLoader.isHorizontalCss = true;
        //pagination.criterias = this.criterias;
        //alert(this.partnerListId);
        //alert(this.partnerListId);
        //contactListId 1593
         this.contactService.loadUsersOfContactList( this.partnerListId, pagination ).subscribe(
            ( data: any ) => {
                this.partners = data.listOfUsers;
                this.totalRecords = data.totalRecords;
                /*if ( this.contacts.length !== 0 ) {
                    this.noContactsFound = false;
                    this.noOfContactsDropdown = true;
                }
                else {
                    this.noContactsFound = true;
                    this.noOfContactsDropdown = false;
                    this.pagedItems = null;
                }*/
                this.referenceService.loading(this.httpRequestLoader, false); 
                pagination.totalRecords = this.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, this.partners );
                
               /* var contactIds = this.pagination.pagedItems.map(function(a) {return a.id;});
                var items = $.grep(this.selectedContactListIds, function(element) {
                    return $.inArray(element, contactIds ) !== -1;
                });
                if(items.length==pagination.totalRecords || items.length == this.pagination.pagedItems.length){
                    this.isHeaderCheckBoxChecked = true;
                }else{
                    this.isHeaderCheckBoxChecked = false;
                }
                */
            },
            error => this.xtremandLogger.error( error ),
            () => this.xtremandLogger.info( "MangePartnerComponent loadPartnerList() finished" )
        )
    }
    
    ngOnInit() {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.defaultPartnerList( this.loggedInUserId );

    }

}
