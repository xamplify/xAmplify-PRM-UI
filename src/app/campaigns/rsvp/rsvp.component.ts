import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Processor } from '../../core/models/processor';
import { CampaignRsvp } from '../models/campaign-rsvp';
import { CampaignService } from '../../campaigns/services/campaign.service';

declare var $: any;

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css'],
  providers: [Processor]
})
export class RsvpComponent implements OnInit {
  alias: string;
  eventcampaign: any;
  campaignRsvp: CampaignRsvp = new CampaignRsvp();
  responseMessage: string;
  isRsvp = false;

  constructor(private route: ActivatedRoute, public campaignService: CampaignService, public processor:Processor) { }

  getEventCampaign (alias: string) {
    this.campaignService.getEventCampaignByAlias(alias)
      .subscribe(
      response => {
        this.eventcampaign = response;
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

  saveEventCampaignRsvp() {
    this.campaignService.saveEventCampaignRsvp(this.campaignRsvp)
      .subscribe(
      response => {
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

  ngOnInit() {
        $('body').css('cssText', 'background-color: white !important');
        this.processor.set(this.processor);
        this.alias = this.route.snapshot.params['alias'];
        this.getEventCampaign(this.alias);
  }

}
