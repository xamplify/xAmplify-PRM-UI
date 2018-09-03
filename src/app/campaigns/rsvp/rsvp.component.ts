import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Processor } from '../../core/models/processor';
import { CampaignRsvp } from '../models/campaign-rsvp';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';

declare var $: any;

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css'],
  providers: [Processor]
})
export class RsvpComponent implements OnInit {
  @ViewChild('dataContainer') dataContainer: ElementRef;
  alias: string;
  eventcampaign: any;
  campaignRsvp: CampaignRsvp = new CampaignRsvp();
  responseMessage: string;
  isRsvp = false;
  totalGuests = 1;
  type="";
  replyUserName=""

  constructor(private route: ActivatedRoute, public campaignService: CampaignService, public processor:Processor,
  public authenticationService:AuthenticationService) { }

  getEventCampaign (alias: string) {
    this.campaignService.getEventCampaignByAlias(alias)
      .subscribe(
      response => {
        this.eventcampaign = response;
        this.dataContainer.nativeElement.innerHTML = this.addURLs(this.eventcampaign.emailTemplateDTO.body);
        this.isRsvp = this.eventcampaign.campaignEventRsvps.length>0 ? true: false;
        this.campaignRsvp.alias = this.alias;
        this.processor.remove(this.processor);
      },
      error => {
        console.log(error);
        this.processor.remove(this.processor);
      },
      () => console.log("Campaign Names Loaded")
      );
  }
  addURLs(templateBody:any){
    // just to avoid 404 link, added the links here.
    templateBody = templateBody.replace('EVENT_TITLE', this.eventcampaign.campaign);
    templateBody = templateBody.replace('EVENT_START_TIME', this.eventcampaign.campaignEventTimes[0].startTimeString);
    templateBody = templateBody.replace('EVENT_END_TIME', this.eventcampaign.campaignEventTimes[0].endTimeString);
    templateBody = templateBody.replace('EVENT_LOCATION', 'Location: '+this.eventcampaign.campaignLocation.location);
    templateBody = templateBody.replace('EVENT_DESCRIPTION', 'Message:'+this.eventcampaign.message);

    templateBody = templateBody.replace('href="LINK_YES"',"hidden");
    templateBody = templateBody.replace('href="LINK_NO"',"hidden");
    templateBody = templateBody.replace('href="LINK_MAY_BE"',"hidden");

    // templateBody = templateBody.replace('LINK_YES',this.authenticationService.APP_URL+'rsvp/'+this.alias+"?type=YES");
    // templateBody = templateBody.replace('LINK_NO',this.authenticationService.APP_URL+'rsvp/'+this.alias+"?type=NO");
    // templateBody = templateBody.replace('LINK_MAY_BE',this.authenticationService.APP_URL+'rsvp/'+this.alias+"?type=MAYBE");
    return templateBody;
  }

  saveEventCampaignRsvp() {
    this.campaignService.saveEventCampaignRsvp(this.campaignRsvp)
      .subscribe(
      response => {
        this.totalGuests = 1;
        $('#myModal').modal('hide');
        this.responseMessage = 'Thank you for the RSVP';
        this.getEventCampaign(this.alias);
      },
      error => {
        console.log(error);
        this.processor.remove(this.processor);
      },
      () => console.log("Campaign Names Loaded")
      );
  }
  closeRsvpModel(){
    this.campaignRsvp.message = null;
    this.totalGuests = 1;
    this.replyUserName = '';
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
