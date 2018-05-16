import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../core/services/authentication.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';

@Component({
  selector: 'app-partner-notification',
  templateUrl: './partner-notification.component.html',
  styleUrls: ['./partner-notification.component.css']
})
export class PartnerNotificationComponent implements OnInit {
  partnerCampaignsCountMap: any;
  loggedInUserId: number;
  constructor( private authenticationService: AuthenticationService, 
               private campaignService: CampaignService,
               private xtremandLogger: XtremandLogger  ) { }
    getPartnerCampaignsCountMapGroupByCampaignType(userId: number){
        this.campaignService.getPartnerCampaignsCountMapGroupByCampaignType(userId)
            .subscribe(
                data => {
                    this.partnerCampaignsCountMap = data;
                },
                error => { },
                () => this.xtremandLogger.info('Finished listCampaign()')
            );
    }
  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
      if (this.authenticationService.isPartner()) {
          this.getPartnerCampaignsCountMapGroupByCampaignType(this.loggedInUserId);
      }
  }

}
