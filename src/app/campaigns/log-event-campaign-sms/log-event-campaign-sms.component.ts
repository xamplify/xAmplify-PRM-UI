import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';

import { Processor } from '../../core/models/processor';
import { CampaignRsvp } from '../models/campaign-rsvp';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';

declare var $: any;

@Component({
  selector: 'app-log-event-campaign-sms',
  templateUrl: './log-event-campaign-sms.component.html',
  styleUrls: ['./log-event-campaign-sms.component.css', '../../../assets/css/loader.css'],
  providers:[Processor]
})
export class LogEventCampaignComponentSMS implements OnInit {
  @ViewChild('dataContainer') dataContainer: ElementRef;
  alias: string;
  eventcampaign: any;
  campaignRsvp: CampaignRsvp = new CampaignRsvp();
  responseMessage: string;
  isRsvp = false;
  totalGuests = 0;
  type="";
  replyUserName=""
  characterleft = 140;
  rsvpSavingProcessing = false;
  eventExpiredError = false;
  isCancelledEvent = false;

  constructor(public referenceService: ReferenceService, private route: ActivatedRoute, public campaignService: CampaignService, public processor:Processor,
  public authenticationService:AuthenticationService) { }

  getEventCampaign (alias: string) {
    this.campaignService.getEventCampaignByAliasSms(alias)
      .subscribe(
      (response:any) => {
        console.log(response)
        this.eventcampaign = response;
        this.dataContainer.nativeElement.innerHTML = this.addURLs(this.eventcampaign.emailTemplateDTO.body);
        this.isRsvp = this.eventcampaign.campaignEventRsvps.length>0 ? true: false;
        this.campaignRsvp.alias = this.alias;
        this.replyUserName = response.targetUserDTO.firstName;
        this.processor.remove(this.processor);
        this.eventStartTimeError();
        
        if(response.eventCancellation.cancelled){
            this.isCancelledEvent = true;
        }
        
      },
      error => {
        console.log(error);
        this.processor.remove(this.processor);
      },
      () => console.log("Campaign Names Loaded")
      );
  }

  eventStartTimeError(){
      const currentDate = new Date().getTime();
      const startDate = Date.parse(this.eventcampaign.campaignEventTimes[0].startTimeString);

          if(startDate < currentDate){
            this.eventExpiredError = true;
            }
   }

  addURLs(templateBody:any){
    // just to avoid 404 link, added the links here.

      /*if ( this.eventcampaign.campaign ) {
          templateBody.body = templateBody.body.replace( "EVENT_TITLE", this.eventcampaign.campaign );
      }
      if ( this.eventcampaign.campaignEventTimes[0].startTimeString ) {
          let startTime = new Date(this.eventcampaign.campaignEventTimes[0].startTimeString);
          let srtTime = this.referenceService.formatAMPM(startTime);
          let date1 = startTime.toDateString()
          templateBody.body = templateBody.body.replace( "EVENT_START_TIME", date1 + " " + srtTime );
      }

      if ( this.eventcampaign.campaignEventTimes[0].endTimeString ) {
          let endDate = new Date(this.eventcampaign.campaignEventTimes[0].endTimeString);
          let endTime = this.referenceService.formatAMPM(endDate);
          let date2 = endDate.toDateString()
          templateBody.body = templateBody.body.replace( "EVENT_END_TIME", date2 + " " + endTime );
      }else if(this.eventcampaign.campaignEventTimes[0].allDay){

          let startTime = new Date(this.eventcampaign.campaignEventTimes[0].startTimeString);
          let date1 = startTime.toDateString()
          templateBody.body = templateBody.body.replace( "EVENT_END_TIME", date1 + " " + '11:59 PM' );
      }

      if ( this.eventcampaign.message ) {
          templateBody.body = templateBody.body.replace( "EVENT_DESCRIPTION", this.eventcampaign.message );
      }
      if ( !this.eventcampaign.onlineMeeting ) {
          if ( this.eventcampaign.campaignLocation.location && this.eventcampaign.campaignLocation.street ) {
              templateBody.body = templateBody.body.replace( /ADDRESS_LANE1/g, this.eventcampaign.campaignLocation.location + "," + this.eventcampaign.campaignLocation.street + "," );
              templateBody.body = templateBody.body.replace( /ADDRESS_LANE2/g, this.eventcampaign.campaignLocation.city + "," + this.eventcampaign.campaignLocation.state + "," + this.eventcampaign.campaignLocation.zip );
          }
      } else {
          templateBody.body = templateBody.body.replace( /EVENT_LOCATION/g, "Online Meeting" )
      }
      if ( this.eventcampaign.email ) {
          templateBody.body = templateBody.body.replace( "EVENT_EMAILID", this.eventcampaign.email );
      }
      if ( this.eventcampaign.email ) {
          templateBody.body = templateBody.body.replace( "VENDOR_NAME", this.authenticationService.user.firstName );
      }
      if ( this.eventcampaign.email ) {
          templateBody.body = templateBody.body.replace( "VENDOR_TITLE", this.authenticationService.user.jobTitle );
      }
      if ( this.eventcampaign.email ) {
          templateBody.body = templateBody.body.replace( "VENDOR_EMAILID", this.authenticationService.user.emailId );
      }
      if ( this.eventcampaign.campaignEventMedias[0].filePath ) {
          templateBody.body = templateBody.body.replace( "IMAGE_URL", this.eventcampaign.campaignEventMedias[0].filePath );
      }else{
          templateBody.body = templateBody.body.replace( "IMAGE_URL", "https://aravindu.com/vod/images/conference2.jpg" );
      }*/


 /*   templateBody = templateBody.replace('EVENT_TITLE', this.eventcampaign.campaign);
    templateBody = templateBody.replace('EVENT_START_TIME', this.eventcampaign.campaignEventTimes[0].startTimeString);
    templateBody = templateBody.replace('EVENT_END_TIME', this.eventcampaign.campaignEventTimes[0].endTimeString);
    if(this.eventcampaign.campaignLocation.location){
      templateBody = templateBody.replace('EVENT_LOCATION', 'Location: '+this.eventcampaign.campaignLocation.location);
    }else {
      templateBody = templateBody.replace('EVENT_LOCATION', '');
    }
    templateBody = templateBody.replace('EVENT_DESCRIPTION', 'Message:'+this.eventcampaign.message);*/
    templateBody = templateBody.replace("https://aravindu.com/vod/images/us_location.png", " ");
    templateBody = templateBody.replace('href="LINK_YES"',"hidden");
    templateBody = templateBody.replace('href="LINK_NO"',"hidden");
    templateBody = templateBody.replace('href="LINK_MAY_BE"',"hidden");

    // templateBody = templateBody.replace('LINK_YES',this.authenticationService.APP_URL+'rsvp/'+this.alias+"?type=YES");
    // templateBody = templateBody.replace('LINK_NO',this.authenticationService.APP_URL+'rsvp/'+this.alias+"?type=NO");
    // templateBody = templateBody.replace('LINK_MAY_BE',this.authenticationService.APP_URL+'rsvp/'+this.alias+"?type=MAYBE");
    return templateBody;
  }

  saveEventCampaignRsvp() {
    this.rsvpSavingProcessing = true;
    this.campaignRsvp.additionalCount = this.totalGuests;
    this.campaignService.saveEventCampaignRsvpSms(this.campaignRsvp)
      .subscribe(
      response => {
        this.totalGuests = 1;
        $('#myModal').modal('hide');
        this.campaignRsvp.message = '';
        this.responseMessage = 'Thank you for the RSVP';
        this.getEventCampaign(this.alias);
        this.rsvpSavingProcessing = false;
      },
      error => {
        console.log(error);
        this.processor.remove(this.processor);
        this.rsvpSavingProcessing = false;
      },
      () => console.log("Campaign Names Loaded")
      );
  }
  closeRsvpModel(){
    this.campaignRsvp.message = null;
    this.totalGuests = 0;
    this.replyUserName = '';
  }
  characterSize(){
    this.characterleft = 140 - this.campaignRsvp.message.length;
  }

  ngOnInit() {
    try{
        $('body').css('cssText', 'background-color: white !important');
        this.processor.set(this.processor);
        this.alias = this.route.snapshot.params['alias'];
        this.type = this.route.snapshot.queryParams['type'];
        this.getEventCampaign(this.alias);
       }catch(error){
        console.error(error);
       }
  }
}
