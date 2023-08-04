import { Component, OnInit } from '@angular/core';
import {Properties} from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import {DashboardService} from 'app/dashboard/dashboard.service';
import {ReferenceService} from 'app/core/services/reference.service';
import {AuthenticationService} from 'app/core/services/authentication.service';
import {CallActionSwitch } from 'app/videos/models/call-action-switch';


@Component({
  selector: 'app-email-notification-settings',
  templateUrl: './email-notification-settings.component.html',
  styleUrls: ['./email-notification-settings.component.css'],
  providers: [Properties,CallActionSwitch]
})
export class EmailNotificationSettingsComponent implements OnInit {

  loading = false;
 customResponse: CustomResponse = new CustomResponse();
 companyId:number = 0;
 notifyPartners = false;
 notifyPartnersOptionFromDb = false;
 constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,public dashboardService:DashboardService,public callActionSwitch: CallActionSwitch) { }
  
 ngOnInit() {
   this.customResponse = new CustomResponse();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    let hasCompany = user.hasCompany;
    let campaignAccessDto = user.campaignAccessDto;
    if(hasCompany && campaignAccessDto!=undefined){
      this.companyId= user.campaignAccessDto.companyId;
    }
    this.findNotifyPartnersOption();
  }

  findNotifyPartnersOption(){
    this.loading  = true;
    this.authenticationService.findNotifyPartnersOption(this.companyId).subscribe(
      response=>{
        this.loading = false;
        this.notifyPartners = response.data;
        this.notifyPartnersOptionFromDb = response.data;
      },error=>{
        this.loading = false;
      }
    );
  }

  changeOption(event:any){
    this.notifyPartners =event;
  }

  save(){
    this.customResponse = new CustomResponse();
    this.loading  = true;
    this.authenticationService.updateNotifyPartnersOption(this.companyId,this.notifyPartners).subscribe(
      response=>{
        this.loading = false;
        let partnerModuleCustomName = this.authenticationService.partnerModule.customName;
        let message = "Success in updating "+partnerModuleCustomName+" Invitation Configuration";
        this.customResponse = new CustomResponse('SUCCESS',message,true);
        this.findNotifyPartnersOption();
      },error=>{
        this.loading = false;
        this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      }
    );
  }

}
