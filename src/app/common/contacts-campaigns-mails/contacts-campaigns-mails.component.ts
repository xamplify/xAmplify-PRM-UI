import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactService } from '../../contacts/services/contact.service';
import { ContactsByType } from '../../contacts/models/contacts-by-type';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
declare var $: any;


@Component( {
    selector: 'app-contacts-campaigns-mails',
    templateUrl: './contacts-campaigns-mails.component.html',
    styleUrls: ['./contacts-campaigns-mails.component.css'],
    providers: [Pagination]
})
export class ContactsCampaignsMailsComponent implements OnInit {
    @Input() associatedCampaignDetails: any;
    @Input() isPartner: boolean;
    @Input() contactListId: number;
    @Input() users = [];
    @Input() userEmails = [];
    @Output() notifyParent: EventEmitter<any>;
    contactsByType: ContactsByType = new ContactsByType();
    selectedCampaignIds = [];
    paginationCampaignIds = []
    checkengListType = "";
    loading = false;
    isHeaderCheckBoxChecked: boolean = false;

    constructor(public referenceService: ReferenceService, public pagerService: PagerService, public pagination: Pagination, public contactService: ContactService,
    		public authenticationService: AuthenticationService) {
        this.notifyParent = new EventEmitter();
    }
    
    checkAll( ev: any ) {
        try {
            if ( ev.target.checked ) {
                console.log( "checked" );
                $( '[name="associatedContactList[]"]' ).prop( 'checked', true );
                let self = this;
                $( '[name="associatedContactList[]"]:checked' ).each( function() {
                    var id = $( this ).val();
                    self.selectedCampaignIds.push( parseInt( id ) );
                    self.paginationCampaignIds.push( parseInt( id ) );
                    console.log( self.selectedCampaignIds );
                    /*$( '#campaignContactListTable_' + id ).addClass( 'contact-list-selected' );*/
                });
                self.selectedCampaignIds = self.referenceService.removeDuplicates( self.selectedCampaignIds );
            } else {
                $( '[name="associatedContactList[]"]' ).prop( 'checked', false );
               /* $( '#user_list_tb tr' ).removeClass( "contact-list-selected" );*/
                let self = this;
                self.paginationCampaignIds = [];
                if ( self.pagination.maxResults == self.pagination.totalRecords ) {
                    self.selectedCampaignIds = [];
                } else {
                    let currentPageContactIds = this.pagination.pagedItems.map( function( a ) { return a.campaignId; });
                    self.selectedCampaignIds = this.referenceService.removeDuplicatesFromTwoArrays( self.selectedCampaignIds, currentPageContactIds );
                }
            }
            ev.stopPropagation();
        } catch ( error ) {
            console.error( error, "editContactComponent", "checkingAllContacts()" );
        }
    }

    selectedContactLisAssociatedCampaignIds( campaignId: number, event: any ) {
        let isChecked = $( '#' + campaignId ).is( ':checked' );
        if ( isChecked ) {
            this.selectedCampaignIds.push( campaignId );
            this.paginationCampaignIds.push( campaignId );
        } else {
            this.selectedCampaignIds.splice( $.inArray( campaignId, this.selectedCampaignIds ), 1 );
            this.paginationCampaignIds.splice( $.inArray( campaignId, this.paginationCampaignIds ), 1 );
        }
        
        if ( this.paginationCampaignIds.length == this.pagination.pagedItems.length ) {
            this.isHeaderCheckBoxChecked = true;
        } else {
            this.isHeaderCheckBoxChecked = false;
        }
        
        event.stopPropagation();
    }

    closeModal() {
        this.notifyParent.emit( "closed" );
    }

    sendEmailToNewlyAddedUsers() {
        try {
            this.loading = true;
            let campaignDetails = {
                "campaignIds": this.selectedCampaignIds,
                "users": this.users,
                "contactListId": this.contactListId
            }

            this.contactService.sendCampaignEmails( campaignDetails )
                .subscribe(
                data => {
                    if (data.access) {
                        console.log(data);
                        $('#sendMailsModal').modal('hide');
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop fade in').remove();
                        this.selectedCampaignIds.length = 0;
                        this.userEmails.length = 0;
                        if (data.statusCode === 2001) {
                            this.notifyParent.emit("users are unSubscribed for emails");
                        } else if (data.statusCode === 2002) {
                            this.notifyParent.emit("user has unSubscribed for emails");
                        } else {
                            this.notifyParent.emit("Emails Send Successfully");
                        }
                        this.loading = false;
                    } else {
                        this.authenticationService.forceToLogout();
                    }
                },
                error => {
                    console.log( error )
                    this.notifyParent.emit( "Emails Sending failed" );
                }, () => {
                }
                );
        } catch ( error ) {
            console.error( error, "ContactsCampaignsEmailComponent", "sendingEmailsToNewlyAddedUsers()" );
        }
    }
    
    setPage( event: any ) {
        this.pagination.pageIndex = event.page;
        this.getContactsAssocialteCampaigns( this.pagination );
        this.paginationCampaignIds = [];
    }
    
    onChangePaginationDropDown( event: Pagination ) {
        this.pagination = event;
        this.getContactsAssocialteCampaigns( this.pagination );
    }
    
    getContactsAssocialteCampaigns(pagination) {
        try {
            this.contactService.contactListAssociatedCampaigns( this.contactListId, this.pagination)
                .subscribe(
                data => {
                    this.contactsByType.contactListAssociatedCampaigns = data.data;
                    this.pagination.totalRecords = data.totalRecords;
                    this.pagination = this.pagerService.getPagedItems( this.pagination, this.contactsByType.contactListAssociatedCampaigns );
                    
                    var contactIds = this.pagination.pagedItems.map( function( a ) { return a.campaignId; });
                    var items = $.grep( this.selectedCampaignIds, function( element ) {
                        return $.inArray( element, contactIds ) !== -1;
                    });
                    
                    
                    console.log( "Contact Ids" + contactIds );
                    console.log( "Selected Contact Ids" + this.selectedCampaignIds );
                    if ( items.length == this.pagination.totalRecords || items.length == this.pagination.pagedItems.length ) {
                        this.isHeaderCheckBoxChecked = true;
                    } else {
                        this.isHeaderCheckBoxChecked = false;
                    }
                    
                    for(let i=0; i< items.length; i++){
                        if(items){
                            this.paginationCampaignIds.push(items[i]);  
                        }
                    }
                      
                    
                },
                error => console.log( error ),
                () => {
                    this.contactsByType.isLoading = false;
                }
                );
        } catch ( error ) {
           console.error( error, "editContactComponent", "gettingAssociatedCampaignList()" );
        }
    }



    ngOnInit() {
        try {
            this.getContactsAssocialteCampaigns(this.pagination);
            if ( this.isPartner ) {
                this.checkengListType = "Partner";
            } else {
                this.checkengListType = "Contact";
            }
            $( '#sendMailsModal' ).modal( 'show' );
        } catch ( error ) {
            console.error( error, "ContactsCampaignsEmailComponent", "OnInit()" );
        }
    }

    ngOnDestroy() {
        try {
            $( '#sendMailsModal' ).modal( 'hide' );
            $( 'body' ).removeClass( 'modal-open' );
            $( '.modal-backdrop fade in' ).remove();
        } catch ( error ) {
            console.error( error, "ContactsCampaignsEmailComponent", "OnDestroy()" );
        }
    }

}
