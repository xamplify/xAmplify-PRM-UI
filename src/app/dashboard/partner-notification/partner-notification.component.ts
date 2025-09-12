import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
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
              
               private xtremandLogger: XtremandLogger, public router: Router,public httpRequestLoader: HttpRequestLoader) { }
  
  
    getPartnerCampaignsCountMapGroupByCampaignType(userId: number){
        
    }
    
    getPartnerCampaignsNotifications(){

    }
    
    
   showServerErrorMessage(){
       this.customResponse =  this.referenceService.showServerErrorResponse(this.httpRequestLoader);
   }
    
  ngOnInit() {
    this.referenceService.loading( this.httpRequestLoader, true );
    this.loggedInUserId = this.authenticationService.getUserId();
    if(this.authenticationService.showRoles()=="Team Member" && this.authenticationService.module.isCampaign){
       
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

      
  }
  
}
