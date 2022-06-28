import { Component, OnInit,Input } from '@angular/core';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

@Component({
  selector: 'app-one-click-launch-redistributed',
  templateUrl: './one-click-launch-redistributed.component.html',
  styleUrls: ['./one-click-launch-redistributed.component.css']
})
export class OneClickLaunchRedistributedComponent implements OnInit {

  @Input() campaignId = 0;
  redistributedCount = 0;
  redistributedCampaignId = 0;
  loader = false;
  constructor(public authenticationService:AuthenticationService,public campaignService:CampaignService,public xtremandLogger:XtremandLogger) { }

  ngOnInit() {
    this.loader = true;
    this.getRedistributedCount();
  }

  getRedistributedCount(){
    this.campaignService.getRedistributedCount(this.campaignId).subscribe(
      (response) => {
        let map = response.data;
        this.redistributedCount = map['redistributedCount'];
        this.redistributedCampaignId = map['redistributedCampaignId'];
        this.loader = false;
      },
      (error) => {
        this.xtremandLogger.errorPage(error);
      }
    );
  }

}
