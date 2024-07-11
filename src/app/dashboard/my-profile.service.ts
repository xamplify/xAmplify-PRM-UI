import { CampaignAnalyticsSettingsDto } from './models/campaign-analytics-settings-dto';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { Injectable } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable()
export class MyProfileService {
  myProfileUrl =  this.authenticationService.REST_URL+RouterUrlConstants.myProfile;


  constructor(private authenticationService:AuthenticationService) { }

  updateCampaignAnalyticsSettings(campaignAnalyticsSettingsDto:CampaignAnalyticsSettingsDto){
    campaignAnalyticsSettingsDto.loggedInUserId = this.authenticationService.getUserId();
    const url = this.myProfileUrl + 'updateCampaignAnalyticsSettings?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url,campaignAnalyticsSettingsDto);
  }

  findCampaignAnalyticsSettings(){
    const url = this.myProfileUrl + 'findCampaignAnalyticsSettings/'+this.authenticationService.getUserId()+'?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url,);
  }

}
