import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
    @Input() userEmails = [];
    @Output() notifyParent: EventEmitter<any>; 
    contactsByType: ContactsByType = new ContactsByType();
    selectedCampaignIds = [];
    
  constructor(public contactService: ContactService) {
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
  
  closeModal(){
      this.notifyParent.emit("closed");
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
                 this.selectedCampaignIds.length = 0;
                 this.userEmails.length = 0;
                 this.notifyParent.emit("Emails Send Successfully");
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
