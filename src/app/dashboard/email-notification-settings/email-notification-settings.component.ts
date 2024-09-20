import { Component, OnInit } from '@angular/core';
import {Properties} from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import {DashboardService} from 'app/dashboard/dashboard.service';
import {ReferenceService} from 'app/core/services/reference.service';
import {AuthenticationService} from 'app/core/services/authentication.service';
import {CallActionSwitch } from 'app/videos/models/call-action-switch';
import { EmailNotificationSettingsDto } from '../user-profile/models/email-notification-settings-dto';
import { EmailNotificationSettingsTextDto } from '../user-profile/models/email-notification-settings-text-dto';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
VanityURLService

@Component({
  selector: 'app-email-notification-settings',
  templateUrl: './email-notification-settings.component.html',
  styleUrls: ['./email-notification-settings.component.css'],
  providers: [Properties,CallActionSwitch]
})
export class EmailNotificationSettingsComponent implements OnInit {

 loading = false;
 customResponse: CustomResponse = new CustomResponse();
 emailNotificationSettingsDto:EmailNotificationSettingsDto = new EmailNotificationSettingsDto();
 partnerInvitationTextDto:EmailNotificationSettingsTextDto = new EmailNotificationSettingsTextDto();
 assetPublishedTextDto:EmailNotificationSettingsTextDto = new EmailNotificationSettingsTextDto();
 trackPublishedTextDto:EmailNotificationSettingsTextDto = new EmailNotificationSettingsTextDto();
 playbookPublishedTextDto:EmailNotificationSettingsTextDto = new EmailNotificationSettingsTextDto();
 dashboardButtonsPublishedTextDto:EmailNotificationSettingsTextDto = new EmailNotificationSettingsTextDto();

 isVanityLogin = false;
 customModulePartnerName = "";
 constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,
  public dashboardService:DashboardService,public callActionSwitch: CallActionSwitch,public vanityUrlService:VanityURLService) {
   this.isVanityLogin =  this.vanityUrlService.isVanityURLEnabled();
   }
  
 ngOnInit() {
   this.loading  = true;
   this.customResponse = new CustomResponse();
   this.customModulePartnerName = this.authenticationService.getPartnerModuleCustomName();

   /******Partner Invitation***/
   this.setPartnerInvitationText();

   /****Asset Notification***/
   this.setAssetNotificationText();

   /********Track Notification****/
   this.setTrackNotificationText();

   /********Play Book Notification****/
   this.setPlaybookNotificationText();

   /********Dashboard Buttons Notification****/
   /****XNFR-571****/
   this.setDashboardButtonsNotificationText();

   this.findEmailNotificationSettings();
  }

  private setPartnerInvitationText() {
    this.partnerInvitationTextDto.headerText = this.customModulePartnerName + " Invitation";
    this.partnerInvitationTextDto.notificationToggle = "Turn Email notifications on or off";
    this.partnerInvitationTextDto.notificationControlInfo = "You have the ability to control email notifications to newly onboarded " + this.customModulePartnerName + ".";
    this.partnerInvitationTextDto.notificationPreference = "Send signup email notifications to your newly onboarded " + this.customModulePartnerName + ":";
  }

  private setPlaybookNotificationText() {
    let playBookHeaderText = "Play Book";
    let playBooksSuffixText = "play books";
    let playBookSuffixText = "a play book";
    this.playbookPublishedTextDto.headerText = this.getHeaderText(playBookHeaderText);
    this.playbookPublishedTextDto.notificationToggle = this.getNotificationToggleText(playBookHeaderText);
    this.playbookPublishedTextDto.notificationControlInfo = this.getNotificationControlInfoText(playBooksSuffixText);
    this.playbookPublishedTextDto.notificationPreference = this.getNotificationPreferenceText(playBookSuffixText);
  }

  private setTrackNotificationText() {
    let trackHeaderText = "Track";
    let tracksSuffixText = "tracks";
    let trackSuffixText = "a track";
    this.trackPublishedTextDto.headerText = this.getHeaderText(trackHeaderText);
    this.trackPublishedTextDto.notificationToggle = this.getNotificationToggleText(trackHeaderText);
    this.trackPublishedTextDto.notificationControlInfo = this.getNotificationControlInfoText(tracksSuffixText);
    this.trackPublishedTextDto.notificationPreference = this.getNotificationPreferenceText(trackSuffixText);
  }

  private setAssetNotificationText() {
    let assetHeaderText = "Asset";
    let assetsSuffixText = "assets";
    let assetSuffixText = "an asset";
    this.assetPublishedTextDto.headerText = this.getHeaderText(assetHeaderText);
    this.assetPublishedTextDto.notificationToggle = this.getNotificationToggleText(assetHeaderText);
    this.assetPublishedTextDto.notificationControlInfo = this.getNotificationControlInfoText(assetsSuffixText);
    this.assetPublishedTextDto.notificationPreference = this.getNotificationPreferenceText(assetSuffixText);
    this.assetPublishedTextDto.controlEmailNotificationTextForVendorCompany = 
  }

  /****XNFR-571****/
  private setDashboardButtonsNotificationText() {
    let headerText = this.properties.dashboardButton;
    let dashboardButtonsSuffixText = "dashboard buttons";
    let dashboardButtonSuffixText = "a dashboard button";
    this.dashboardButtonsPublishedTextDto.headerText = this.getHeaderText(headerText);
    this.dashboardButtonsPublishedTextDto.notificationToggle = this.getNotificationToggleText(headerText);
    this.dashboardButtonsPublishedTextDto.notificationControlInfo = this.getNotificationControlInfoText(dashboardButtonsSuffixText);
    this.dashboardButtonsPublishedTextDto.notificationPreference = this.getNotificationPreferenceText(dashboardButtonSuffixText);
  }

  getHeaderText(headerTextPrefix:string){
    return headerTextPrefix+" Notifications";
  }

  getNotificationToggleText(turnOnOrOffTextSuffix:string){
    return  "Turn Published "+turnOnOrOffTextSuffix+" Email notifications on or off";
  }

  getNotificationControlInfoText(controlEmailNotificationTextSuffix:string){
    return "You have the ability to control email notifications to your "+this.customModulePartnerName+" about published "+controlEmailNotificationTextSuffix+".";
  }

  getNotificationPreferenceText(sendEmailNotificationTextSuffix:string){
    return "Send email notifications to your "+this.customModulePartnerName+" when "+sendEmailNotificationTextSuffix+" is published:";
  }

  findEmailNotificationSettings(){
    this.loading  = true;
    this.dashboardService.findEmailNotificationSettings().
    subscribe(response=>{
        this.emailNotificationSettingsDto = response.data;
        this.loading = false;
      },error=>{
        this.loading = false;
      }
    );
  }

  
  updateSettings(){
    this.customResponse = new CustomResponse();
    this.loading  = true;
    this.dashboardService.updateEmailNotificationSettings(this.emailNotificationSettingsDto).subscribe(
      response=>{
        this.customResponse = new CustomResponse('SUCCESS',response.message,true);
        this.referenceService.scrollSmoothToTop();
        this.loading = false;
      },error=>{
        this.loading = false;
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      }
    );
  }

  changeOption(moduleType:number,event:any){
    if(moduleType==1){
      this.emailNotificationSettingsDto.notifyPartners = event;
    }else if(moduleType==2){
      this.emailNotificationSettingsDto.assetPublishedEmailNotification = event;
    }else if(moduleType==3){
      this.emailNotificationSettingsDto.trackPublishedEmailNotification = event;
    }else if(moduleType==4){
      this.emailNotificationSettingsDto.playbookPublishedEmailNotification = event;
    }else if(moduleType==5){
      this.emailNotificationSettingsDto.dashboardButtonsEmailNotification = event;
    }
  }

}
