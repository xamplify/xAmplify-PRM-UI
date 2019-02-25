import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactService } from '../../contacts/services/contact.service';
import { ContactsByType } from '../../contacts/models/contacts-by-type';
declare var $: any;


@Component( {
    selector: 'app-contacts-campaigns-mails',
    templateUrl: './contacts-campaigns-mails.component.html',
    styleUrls: ['./contacts-campaigns-mails.component.css']
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
    checkengListType = "";
    loading = false;

    constructor( public contactService: ContactService ) {
        this.notifyParent = new EventEmitter();
    }

    selectedContactLisAssociatedCampaignIds( campaignId: number, event: any ) {
        let isChecked = $( '#' + campaignId ).is( ':checked' );
        if ( isChecked ) {
            this.selectedCampaignIds.push( campaignId );
        } else {
            this.selectedCampaignIds.splice( $.inArray( campaignId, this.selectedCampaignIds ), 1 );
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
                    console.log( data );
                    $( '#sendMailsModal' ).modal( 'hide' );
                    $( 'body' ).removeClass( 'modal-open' );
                    $( '.modal-backdrop fade in' ).remove();
                    this.selectedCampaignIds.length = 0;
                    this.userEmails.length = 0;
                    if(data.message === "The partners are unsubscribed for receiving the campaign emails."){
                        this.notifyParent.emit( "users are unSubscribed for emails" );
                    }else if(data.message === "The partner has unsubscribed for receiving the campaign emails."){
                        this.notifyParent.emit( "user has unSubscribed for emails" );
                    }else{
                        this.notifyParent.emit( "Emails Send Successfully" );
                    }
                    this.loading = false;
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


    ngOnInit() {
        try {
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
