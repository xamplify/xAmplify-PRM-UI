import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
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
  hasRedistributeAccess:boolean;
  constructor( public authenticationService: AuthenticationService,public referenceService:ReferenceService,
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
    
    getPartnerCampaignsNotifications(){
        this.campaignService.getPartnerCampaignsNotifications(this.loggedInUserId)
            .subscribe(
                data => {
                    console.log(data);
                    this.referenceService.eventCampaignTabAccess = data.event;
                },
                error => { },
                () => this.xtremandLogger.info('Finished listCampaign()')
            );
    }
    
  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    if(this.authenticationService.showRoles()=="Team Member" && this.authenticationService.module.isCampaign){
        this.campaignService.hasRedistributeAccess(this.loggedInUserId)
        .subscribe(
            data => {
                let response = data.data;
                if(response.hasAccess){
                    localStorage.setItem('superiorId',response.superiorId);
                    this.callRedistributedCampaignsDiv(response.superiorId);
                }
            },
            error => { },
            () => this.xtremandLogger.info('Finished listCampaign()')
        );
    }else if(this.authenticationService.isPartner()){
        this.callRedistributedCampaignsDiv(this.loggedInUserId);
    }
    
    if(this.hasRedistributeAccess){
        this.getPartnerCampaignsNotifications();   
    }
  }
  
  callRedistributedCampaignsDiv(superiorId:number){
      this.hasRedistributeAccess = true;
      this.getPartnerCampaignsCountMapGroupByCampaignType(superiorId);
  }

}
