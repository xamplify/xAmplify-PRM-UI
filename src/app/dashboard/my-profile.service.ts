import { CampaignAnalyticsSettingsDto } from './models/campaign-analytics-settings-dto';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { Injectable } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Pagination } from 'app/core/models/pagination';
import { ReferenceService } from 'app/core/services/reference.service';

@Injectable()
export class MyProfileService {
  myProfileUrl =  this.authenticationService.REST_URL+RouterUrlConstants.myProfile;


  constructor(private authenticationService:AuthenticationService, public referenceService:ReferenceService) { }

  updateCampaignAnalyticsSettings(campaignAnalyticsSettingsDto:CampaignAnalyticsSettingsDto){
    campaignAnalyticsSettingsDto.loggedInUserId = this.authenticationService.getUserId();
    const url = this.myProfileUrl + 'updateCampaignAnalyticsSettings?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url,campaignAnalyticsSettingsDto);
  }

  findCampaignAnalyticsSettings() {
    const url = this.myProfileUrl + 'findCampaignAnalyticsSettings/' + this.authenticationService.getUserId() + '?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url,);
  }

  /***** XNFR-860 *****/
  findDefaultDashboardSettingsOption() {
    const url = this.authenticationService.REST_URL + 'dashboard/layout/default-dashboard-settings?companyProfileName='
      + this.authenticationService.companyProfileName + '&access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

  /***** XNFR-860 *****/
  updateDefaultDashboardSettingsOption(isDashboardLayoutUpdated: boolean) {
    const url = this.authenticationService.REST_URL + 'dashboard/layout/default-dashboard-settings?companyProfileName='
      + this.authenticationService.companyProfileName + '&isLayoutUpdated=' + isDashboardLayoutUpdated + '&access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url, '');
  }

  /***** XNFR-859 *****/
  findPaginatedCustomHtmlBlocks(pagination: Pagination) {
    let userId = this.authenticationService.getUserId();
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let findAllUrl = this.authenticationService.REST_URL + 'custom/html/paginated/userId/' + userId + '?access_token=' + this.authenticationService.access_token + pageableUrl;
    return this.authenticationService.callGetMethod(findAllUrl);
  }

  /***** XNFR-859 *****/
  saveCustomHtmlBlock(customHtmlBlock: any) {
    customHtmlBlock.loggedInUserId = this.authenticationService.getUserId();
    let url = this.authenticationService.REST_URL + 'custom/html?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPostMethod(url, customHtmlBlock);
  }

  /***** XNFR-859 *****/
  findById(id: number) {
    let userId = this.authenticationService.getUserId();
    let url = this.authenticationService.REST_URL + 'custom/html?id=' + id + '&loggedInUserId=' + userId + '&access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

  /***** XNFR-859 *****/
  updateCustomHtmlBlock(customHtmlBlock: any) {
    customHtmlBlock.loggedInUserId = this.authenticationService.getUserId();
    let url = this.authenticationService.REST_URL + 'custom/html?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url, customHtmlBlock);
  }

  /***** XNFR-859 *****/
  deleteCustomHtmlBlock(id: number) {
    let userId = this.authenticationService.getUserId();
    let url = this.authenticationService.REST_URL + 'custom/html?id=' + id + '&loggedInUserId=' + userId + '&access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callDeleteMethod(url);
  }

  updateSelectedHtmlBlock(customHtmlBlock: any) {
    customHtmlBlock.loggedInUserId = this.authenticationService.getUserId();
    let url = this.authenticationService.REST_URL + 'custom/html/update/selection?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url, customHtmlBlock);
  }

}
