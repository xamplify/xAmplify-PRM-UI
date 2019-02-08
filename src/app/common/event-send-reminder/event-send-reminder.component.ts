import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { EventCampaign } from '../../campaigns/models/event-campaign';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { AuthenticationService } from '../../core/services/authentication.service';
declare var $: any;

@Component({
  selector: 'app-event-send-reminder',
  templateUrl: './event-send-reminder.component.html',
  styleUrls: ['./event-send-reminder.component.css'],
  providers: [CallActionSwitch]
})
export class EventSendReminderComponent implements OnInit {
    @Input() selectedEventCampaignId: any;
    @Input() selectedUserId: any;
    @Output() notifyParent: EventEmitter<any>;
    
    eventCampaign: EventCampaign = new EventCampaign();
    reminderEventMessage = "";
    reminderEventSubject = "";
    
  constructor(public authenticationService: AuthenticationService, public campaignService: CampaignService, public callActionSwitch: CallActionSwitch ) {
      this.notifyParent = new EventEmitter();
  }
  
  getEventCampaignDetails(){
      this.campaignService.getEventCampaignById(this.selectedEventCampaignId).subscribe(
              (result)=>{
              this.eventCampaign = result.data;
              }
          );
     
  }
  
  closeReminder(){
      $( '#updateEventModal' ).modal( 'hide' );
      $( 'body' ).removeClass( 'modal-open' );
      $( '.modal-backdrop fade in' ).remove();
      this.notifyParent.emit( "closed" );
  }
  
  sendEmailNotOpenReminder(){
      var object = {
              "id": this.selectedEventCampaignId,
              "subject": this.reminderEventSubject,
              "message": this.reminderEventMessage,
              "userId": this.selectedUserId,
              "customerId": this.authenticationService.getUserId(),
          }
      
      this.campaignService.sendEmailNotOpenReminder(object).subscribe(
              (result)=>{
             console.log(result);
             $( '#updateEventModal' ).modal( 'hide' );
             $( 'body' ).removeClass( 'modal-open' );
             $( '.modal-backdrop fade in' ).remove();
             this.notifyParent.emit( "Success" );
              },
              error => console.log(error),
              () => {
                  console.log('updateEventModal(); called');
                  $( '#updateEventModal' ).modal( 'hide' );
                  $( 'body' ).removeClass( 'modal-open' );
                  $( '.modal-backdrop fade in' ).remove();
                  this.notifyParent.emit( "Error" );
              }
          );
      
  }
  
  ngOnInit() {
      this.getEventCampaignDetails();
      $( '#updateEventModal' ).modal( 'show' );
  }
  ngOnDestroy() {
      try {
          $( '#updateEventModal' ).modal( 'hide' );
          $( 'body' ).removeClass( 'modal-open' );
          $( '.modal-backdrop fade in' ).remove();
      } catch ( error ) {
          console.error( error, "EventSendReminderComponent", "OnDestroy()" );
      }
  }

}
