import { Component, OnInit, Input } from '@angular/core';
import { ContactService } from '../../contacts/services/contact.service';
import { ContactsByType } from '../../contacts/models/contacts-by-type';
declare var $: any;


@Component({
  selector: 'app-contacts-campaigns-mails',
  templateUrl: './contacts-campaigns-mails.component.html',
  styleUrls: ['./contacts-campaigns-mails.component.css']
})
export class ContactsCampaignsMailsComponent implements OnInit {
    @Input() associatedCampaignDetails: any;
    @Input() userEmails = []
    contactsByType: ContactsByType = new ContactsByType();
    selectedCampaignIds = [];
    
  constructor(public contactService: ContactService) { }
 
  selectedContactLisAssociatedCampaignIds( campaignId: number, event: any ) {
      let isChecked = $( '#' + campaignId ).is( ':checked' );
      if ( isChecked ) {
          this.selectedCampaignIds.push( campaignId );
      } else {
          this.selectedCampaignIds.splice( $.inArray( campaignId, this.selectedCampaignIds ), 1 );
      }
      event.stopPropagation();
  }
  
  sendEmailToNewlyAddedUsers() {
      let campaignDetails = {
          "campaignIds": this.selectedCampaignIds,
          "emailIds": this.userEmails
      }
      
      this.contactService.sendCampaignEmails( campaignDetails)
          .subscribe(
              data => {
                 console.log(data);
                 $('#sendMailsModal').modal('hide');
                 $('body').removeClass('modal-open');
                 $('.modal-backdrop fade in').remove();
                // this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACT_SAVE_SUCCESS_AND_MAIL_SENT_SUCCESS, true );
                 
                 this.selectedCampaignIds.length = 0;
                 this.userEmails.length = 0;
                 
              },
              error => console.log( error ),
              () => {
              }
          );
  }


  ngOnInit() {
      $('#sendMailsModal').modal('show'); 
  }

}
