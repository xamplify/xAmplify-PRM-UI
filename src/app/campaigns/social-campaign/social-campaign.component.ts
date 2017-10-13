import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-social-campaign',
  templateUrl: './social-campaign.component.html',
  styleUrls: ['./social-campaign.component.css']
})
export class SocialCampaignComponent implements OnInit {
    socialCampaignId: number;
    constructor( public activatedRoute: ActivatedRoute ) { }

    ngOnInit() {
        this.socialCampaignId = this.activatedRoute.snapshot.params['id'];
    }

}
