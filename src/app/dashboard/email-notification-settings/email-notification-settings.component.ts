import { Component, OnInit } from '@angular/core';
import {Properties} from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import {DashboardService} from 'app/dashboard/dashboard.service';
import {ReferenceService} from 'app/core/services/reference.service';
import {AuthenticationService} from 'app/core/services/authentication.service';
import {CallActionSwitch } from 'app/videos/models/call-action-switch';
import { EmailNotificationSettingsDto } from '../user-profile/models/email-notification-settings-dto';


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
 constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,public dashboardService:DashboardService,public callActionSwitch: CallActionSwitch) { }
  
 ngOnInit() {
   this.customResponse = new CustomResponse();
   this.findEmailNotificationSettings();
   
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
        this.loading = false;
        this.customResponse = new CustomResponse('SUCCESS',response.message,true);
        this.findEmailNotificationSettings();
      },error=>{
        this.loading = false;
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      }
    );
  }

}
