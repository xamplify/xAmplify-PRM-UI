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
    this.partnerInvitationTextDto.notificationControlInfoForVendorCompany = this.getNotificationControlInfoText(this.customModulePartnerName,false,false);
    this.partnerInvitationTextDto.notificationPreferenceForVendorCompany = this.getNotificationPreferenceText(this.customModulePartnerName,false,false);
  }

  private setPlaybookNotificationText() {
    let playBookHeaderText = "Play Book";
    let playBooksSuffixText = "play books";
    let playBookSuffixText = "a play book";
    this.playbookPublishedTextDto.headerText = this.getHeaderText(playBookHeaderText);
    this.playbookPublishedTextDto.notificationToggle = this.getNotificationToggleText(playBookHeaderText);
    this.playbookPublishedTextDto.notificationControlInfo = this.getNotificationControlInfoText(playBooksSuffixText,true,true);
    this.playbookPublishedTextDto.notificationPreference = this.getNotificationPreferenceText(playBookSuffixText,true,true);
    this.playbookPublishedTextDto.notificationControlInfoForVendorCompany = this.getNotificationControlInfoText(playBookSuffixText,false,true);
    this.playbookPublishedTextDto.notificationPreferenceForVendorCompany = this.getNotificationPreferenceText(playBookSuffixText,false,true);
  }

  private setTrackNotificationText() {
    let trackHeaderText = "Track";
    let tracksSuffixText = "tracks";
    let trackSuffixText = "a track";
    this.trackPublishedTextDto.headerText = this.getHeaderText(trackHeaderText);
    this.trackPublishedTextDto.notificationToggle = this.getNotificationToggleText(trackHeaderText);
    this.trackPublishedTextDto.notificationControlInfo = this.getNotificationControlInfoText(tracksSuffixText,true,true);
    this.trackPublishedTextDto.notificationPreference = this.getNotificationPreferenceText(trackSuffixText,true,true);
    this.trackPublishedTextDto.notificationControlInfoForVendorCompany = this.getNotificationControlInfoText(trackSuffixText,false,true);
    this.trackPublishedTextDto.notificationPreferenceForVendorCompany = this.getNotificationPreferenceText(trackSuffixText,false,true);
  }

  private setAssetNotificationText() {
    let assetHeaderText = "Asset";
    let assetsSuffixText = "assets";
    let assetSuffixText = "an asset";
    this.assetPublishedTextDto.headerText = this.getHeaderText(assetHeaderText);
    this.assetPublishedTextDto.notificationToggle = this.getNotificationToggleText(assetHeaderText);
    this.assetPublishedTextDto.notificationControlInfo = this.getNotificationControlInfoText(assetsSuffixText,true,true);
    this.assetPublishedTextDto.notificationPreference = this.getNotificationPreferenceText(assetSuffixText,true,true);
    this.assetPublishedTextDto.notificationControlInfoForVendorCompany = this.getNotificationControlInfoText(assetSuffixText,false,true);
    this.assetPublishedTextDto.notificationPreferenceForVendorCompany = this.getNotificationPreferenceText(assetSuffixText,false,true);

  }

  /****XNFR-571****/
  private setDashboardButtonsNotificationText() {
    let headerText = this.properties.dashboardButton;
    let dashboardButtonsSuffixText = "dashboard buttons";
    let dashboardButtonSuffixText = "a dashboard button";
    this.dashboardButtonsPublishedTextDto.headerText = this.getHeaderText(headerText);
    this.dashboardButtonsPublishedTextDto.notificationToggle = this.getNotificationToggleText(headerText);
    this.dashboardButtonsPublishedTextDto.notificationControlInfo = this.getNotificationControlInfoText(dashboardButtonsSuffixText,true,true);
    this.dashboardButtonsPublishedTextDto.notificationPreference = this.getNotificationPreferenceText(dashboardButtonSuffixText,true,true);
    this.dashboardButtonsPublishedTextDto.notificationPreference = this.getNotificationPreferenceText(dashboardButtonSuffixText,true,true);
    this.dashboardButtonsPublishedTextDto.notificationControlInfoForVendorCompany = this.getNotificationControlInfoText(dashboardButtonSuffixText,false,true);
    this.dashboardButtonsPublishedTextDto.notificationPreferenceForVendorCompany = this.getNotificationPreferenceText(dashboardButtonSuffixText,false,true);
  }

  getHeaderText(headerTextPrefix:string){
    return headerTextPrefix+" Notifications";
  }

  getNotificationToggleText(turnOnOrOffTextSuffix:string){
    return  "Turn Published "+turnOnOrOffTextSuffix+" Email notifications on or off";
  }

  getNotificationControlInfoText(controlEmailNotificationTextSuffix:string,textForPartnerFlag:boolean,isTextAboutPublishing:boolean){
    let suffixText = textForPartnerFlag ? this.customModulePartnerName : "team members and yourself ";
    let endText = isTextAboutPublishing ? " published":"onboarded";
    return "You have the ability to control email notifications to your "+suffixText+" about "+endText+" "+controlEmailNotificationTextSuffix+".";
  }

  getNotificationPreferenceText(sendEmailNotificationTextSuffix:string,textForPartnerFlag:boolean,isTextAboutPublishing:boolean){
    let suffixText = this.getSuffixText(textForPartnerFlag);
    let endText = isTextAboutPublishing ? " is published:":" onboarded:";
    return "Send email notifications to your "+suffixText+" when "+sendEmailNotificationTextSuffix+endText;
  }

  private getSuffixText(textForPartnerFlag: boolean) {
    return textForPartnerFlag ? this.customModulePartnerName : "team members and yourself";
  }

  findEmailNotificationSettings(){
    this.loading  = true;
    this.dashboardService.findEmailNotificationSettings().
    subscribe(response=>{
        this.emailNotificationSettingsDto = response.data;
        this.loading = false;
      },error=>{
        this.loading = false;
        this.emailNotificationSettingsDto = new EmailNotificationSettingsDto();
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

  private notificationMappings = {
    partner: {
      1: 'notifyPartners',
      2: 'assetPublishedEmailNotification',
      3: 'trackPublishedEmailNotification',
      4: 'playbookPublishedEmailNotification',
      5: 'dashboardButtonsEmailNotification',
    },
    vendor: {
      1:'partnerOnBoardVendorEmailNotification',
      2: 'assetPublishVendorEmailNotification',
      3: 'trackPublishVendorEmailNotification',
      4: 'playbookPublishVendorEmailNotification',
      5: 'dashboardButtonPublishVendorEmailNotification',
    },
  };

  updateEmailNotificationSettingForPartner(moduleType: number, event: any) {
    this.updateEmailNotificationSetting('partner', moduleType, event);
  }
  
  updateEmailNotificationSettingForVendor(moduleType: number, event: any) {
    this.updateEmailNotificationSetting('vendor', moduleType, event);
  }

  private updateEmailNotificationSetting(role: 'partner' | 'vendor', moduleType: number, event: any) {
    const mapping = this.notificationMappings[role];
    if (mapping) {
      this.emailNotificationSettingsDto[mapping[moduleType]] = event || false;
    } else {
      console.error(`Invalid role: ${role}`);
    }
  }

}
