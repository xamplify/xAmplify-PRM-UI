import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';

CustomResponse
@Component({
  selector: 'app-campaign-analytics-settings',
  templateUrl: './campaign-analytics-settings.component.html',
  styleUrls: ['./campaign-analytics-settings.component.css']
})
export class CampaignAnalyticsSettingsComponent implements OnInit {

  loading = false;
  customResponse: CustomResponse = new CustomResponse();
  isCampaignAnalyticsSettingsEnabled = false;
  constructor(public authenticationService:AuthenticationService,private referenceService:ReferenceService) { }

  ngOnInit() {
  }

  customUiSwitchEventReceiver(event:any){
  }
}
