import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';

@Component({
  selector: 'app-partner-notification',
  templateUrl: './partner-notification.component.html',
  styleUrls: ['./partner-notification.component.css'],
  providers:[HttpRequestLoader],
})
export class PartnerNotificationComponent implements OnInit {
  partnerCampaignsCountMap: any;
  loggedInUserId: number;
  hasRedistributeAccess:boolean;
  isPageCampaignSharedByVendor=false;
  isEventCampaignSharedByVendor = false;
  isSocialCampaignSharedByVendor =false;
  modulesCount:number = 3;
  divClass = "col-xs-12 col-sm-4";
  width = "";
  customResponse:CustomResponse = new CustomResponse();
    
  constructor( public authenticationService: AuthenticationService,public referenceService:ReferenceService,
               private campaignService: CampaignService,
               private xtremandLogger: XtremandLogger, public router: Router,public httpRequestLoader: HttpRequestLoader) { }
  
  
    getPartnerCampaignsCountMapGroupByCampaignType(userId: number){
        this.campaignService.getPartnerCampaignsCountMapGroupByCampaignType(userId)
            .subscribe(
                data => {
                    this.partnerCampaignsCountMap = data;
                },
                error => {this.showServerErrorMessage() },
                () => this.xtremandLogger.info('Finished getPartnerCampaignsCountMapGroupByCampaignType()')
            );
    }
    
    getPartnerCampaignsNotifications(){
        this.campaignService.getPartnerCampaignsNotifications(this.loggedInUserId)
            .subscribe(
                data => {
                    this.referenceService.eventCampaignTabAccess = data.event;
                    this.referenceService.socialCampaignTabAccess = data.social;
                    this.isEventCampaignSharedByVendor = data.event;
                    this.isPageCampaignSharedByVendor = data.landingPageCampaign;
                    this.isSocialCampaignSharedByVendor = data.social;
                    this.modulesCount = data.campaignTypesCount;
                    if(this.modulesCount==4){
                        this.divClass = "col-lg-3 col-md-3 col-sm-3 col-xs-6";
                        //this.width = "25%";
                    }else if(this.modulesCount==5){
                       this.divClass = "col-lg-2 col-md-2 col-sm-2 col-xs-6";
                      // this.width = "20%";
                    }else if(this.modulesCount==6){
                        this.divClass = "col-lg-2 col-md-2 col-sm-2 col-xs-6";
                        //this.width = "16.66666667%";
                    }
                    this.referenceService.loading( this.httpRequestLoader, false );
                },
                error => {this.showServerErrorMessage()},
                () => this.xtremandLogger.info('Finished getPartnerCampaignsNotifications()')
            );
    }
    
    
   showServerErrorMessage(){
       this.customResponse =  this.referenceService.showServerErrorResponse(this.httpRequestLoader);
   }
    
  ngOnInit() {
    this.referenceService.loading( this.httpRequestLoader, true );
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
            error => {this.showServerErrorMessage() },
            () => this.xtremandLogger.info('Finished ngOnInit()')
        );
    }else if(this.authenticationService.isPartner()){
        this.callRedistributedCampaignsDiv(this.loggedInUserId);
    }
  }
  
  callRedistributedCampaignsDiv(superiorId:number){
      this.hasRedistributeAccess = true;
      this.getPartnerCampaignsCountMapGroupByCampaignType(superiorId);
      this.getPartnerCampaignsNotifications();   

  }
  
  goToRedistributeDiv(campaignType:string){
      let url = 'home/campaigns/partner/'+campaignType;
      if("page"==campaignType){
          this.router.navigate(['home/pages/partner']);
      }else{
          this.router.navigate([url]);
      }
      
  }
  
}
