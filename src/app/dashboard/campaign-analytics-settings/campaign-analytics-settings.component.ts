import { Properties } from './../../common/models/properties';
import { CampaignAnalyticsSettingsDto } from './../models/campaign-analytics-settings-dto';
import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { MyProfileService } from '../my-profile.service';


CustomResponse
@Component({
  selector: 'app-campaign-analytics-settings',
  templateUrl: './campaign-analytics-settings.component.html',
  styleUrls: ['./campaign-analytics-settings.component.css'],
  providers:[Properties]
})
export class CampaignAnalyticsSettingsComponent implements OnInit {

  loading = true;
  customResponse: CustomResponse = new CustomResponse();
  campaignAnalyticsSettingsDto:CampaignAnalyticsSettingsDto = new CampaignAnalyticsSettingsDto();
  constructor(public authenticationService:AuthenticationService,private referenceService:ReferenceService,
    private myProfileService:MyProfileService,public properties:Properties) { }

  ngOnInit() {
    this.findCampaignAnalyticsSettingsOption();
  }

  findCampaignAnalyticsSettingsOption(){
    this.myProfileService.findCampaignAnalyticsSettings().subscribe(
      response=>{
        this.campaignAnalyticsSettingsDto.campaignAnalyticsSettingsEnabled = response.data;
      },error=>{
        this.campaignAnalyticsSettingsDto = new CampaignAnalyticsSettingsDto();
        this.loading = false;
      }
    );
  }

  customUiSwitchEventReceiver(event:any){
    this.campaignAnalyticsSettingsDto.campaignAnalyticsSettingsEnabled = event;
  }

  updateCampaignAnalyticsSettingsOption(){
    this.customResponse = new CustomResponse();
    this.loading = true;
    this.myProfileService.updateCampaignAnalyticsSettings(this.campaignAnalyticsSettingsDto).subscribe(
        response=>{
          this.customResponse = new CustomResponse('SUCCESS',response.message,true);
          this.loading = false;
        },error=>{
          this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
          this.loading = false;
        }
    );
  }


}
