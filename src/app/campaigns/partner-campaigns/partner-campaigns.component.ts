import { CampaignType } from '../models/campaign-type';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { CampaignService } from '../services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-partner-campaigns',
  templateUrl: './partner-campaigns.component.html',
  styleUrls: ['./partner-campaigns.component.css'],
  providers: [DatePipe]
})
export class PartnerCampaignsComponent implements OnInit {
  campaigns: any;
  constructor( private router: Router,
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private authenticationService: AuthenticationService) { }

  listPartnerCampaigns(userId: number, campaignType: string) {
    this.campaignService.listPartnerCampaigns(userId, campaignType)
      .subscribe(
      result => {this.campaigns = result;},
      error => console.log(error),
      () => { });
  }
  
  filterCampaigns(type: string){
    this.router.navigate(['/home/campaigns/partner/'+type]);
  }

  ngOnInit() {
    const campaignType = this.route.snapshot.params['type'];
    const userId = this.authenticationService.getUserId();

    this.listPartnerCampaigns(userId, campaignType);
  }

}
