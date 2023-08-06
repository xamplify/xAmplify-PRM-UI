import { Component, OnInit } from '@angular/core';
import {Properties} from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import {DashboardService} from 'app/dashboard/dashboard.service';
import {ReferenceService} from 'app/core/services/reference.service';
import {AuthenticationService} from 'app/core/services/authentication.service';
import {CallActionSwitch } from 'app/videos/models/call-action-switch';
import { EmailNotificationSettingsDto } from '../user-profile/models/email-notification-settings-dto';
import { EmailNotificationSettingsTextDto } from '../user-profile/models/email-notification-settings-text-dto';
import { ModuleCustomName } from '../models/module-custom-name';


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

 customModulePartnerName = "";
 constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,
  public dashboardService:DashboardService,public callActionSwitch: CallActionSwitch) { }
  
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

   this.findEmailNotificationSettings();
  }

  private setPartnerInvitationText() {
    this.partnerInvitationTextDto.headerText = this.customModulePartnerName + " Invitation";
    this.partnerInvitationTextDto.text1 = "Turn Email notifications on or off";
    this.partnerInvitationTextDto.text2 = "You have the ability to control email notifications to newly onboarded " + this.customModulePartnerName + ".";
    this.partnerInvitationTextDto.text3 = "Send signup email notifications to your newly onboarded " + this.customModulePartnerName + ":";
  }

  private setPlaybookNotificationText() {
    let playBookHeaderText = "Play Book";
    let playBookText2Suffix = "play books";
    let playBookText3Suffix = "a play book";
    this.playbookPublishedTextDto.headerText = this.getHeaderText(playBookHeaderText);
    this.playbookPublishedTextDto.text1 = this.getText1(playBookHeaderText);
    this.playbookPublishedTextDto.text2 = this.getText2(playBookText2Suffix);
    this.playbookPublishedTextDto.text3 = this.getText3(playBookText3Suffix);
  }

  private setTrackNotificationText() {
    let trackHeaderText = "Track";
    let trackText2Suffix = "tracks";
    let trackText3Suffix = "a track";
    this.trackPublishedTextDto.headerText = this.getHeaderText(trackHeaderText);
    this.trackPublishedTextDto.text1 = this.getText1(trackHeaderText);
    this.trackPublishedTextDto.text2 = this.getText2(trackText2Suffix);
    this.trackPublishedTextDto.text3 = this.getText3(trackText3Suffix);
  }

  private setAssetNotificationText() {
    let assetHeaderText = "Asset";
    let assetText2Suffix = "assets";
    let assetText3Suffix = "an asset";

    this.assetPublishedTextDto.headerText = this.getHeaderText(assetHeaderText);
    this.assetPublishedTextDto.text1 = this.getText1(assetHeaderText);
    this.assetPublishedTextDto.text2 = this.getText2(assetText2Suffix);
    this.assetPublishedTextDto.text3 = this.getText3(assetText3Suffix);
  }

  getHeaderText(headerTextPrefix:string){
    return headerTextPrefix+" Notifications";
  }

  getText1(text1Suffix:string){
    return  "Turn Published "+text1Suffix+" Email notifications on or off";
  }

  getText2(text2Suffix:string){
    return "You have the ability to control email notifications to your "+this.customModulePartnerName+" about published "+text2Suffix+".";
  }

  getText3(text3Suffix:string){
    return "Send email notifications to your "+this.customModulePartnerName+" when "+text3Suffix+" is published:";
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
    }
  }

}
