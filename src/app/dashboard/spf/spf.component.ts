import { Component, OnInit } from '@angular/core';
import {Properties} from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import {DashboardService} from 'app/dashboard/dashboard.service';
import {ReferenceService} from 'app/core/services/reference.service';
import {AuthenticationService} from 'app/core/services/authentication.service';
@Component({
  selector: 'app-spf',
  templateUrl: './spf.component.html',
  styleUrls: ['./spf.component.css'],
  providers: [Properties]
})
export class SpfComponent implements OnInit {
 isChecked:boolean;
 loading = false;
 customResponse: CustomResponse = new CustomResponse();
 companyId:number = 0;
 spfConfigured = false;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,public dashboardService:DashboardService) { }

  ngOnInit() {
     const user = JSON.parse(localStorage.getItem('currentUser'));
      let hasCompany = user.hasCompany;
      let campaignAccessDto = user.campaignAccessDto;
      if(hasCompany && campaignAccessDto!=undefined){
        this.companyId= user.campaignAccessDto.companyId;
      }
      this.isSpfConfigured();
  }

  isSpfConfigured(){
    this.loading  = true;
    this.authenticationService.isSpfConfigured(this.companyId).subscribe(
      response=>{
        this.loading = false;
        if(response.data){
          this.spfConfigured = true;
          this.customResponse = new CustomResponse('INFO', 'SPF Configuration Done', true);
        }
      },error=>{
        this.loading = false;
      }
    );
  }

  saveSpf(){
    this.referenceService.goToTop();
    this.customResponse = new CustomResponse();
    this.loading = true;
    try{
      this.updateSpfConfiguration(this.companyId);
    }catch(error){
      this.loading = false;
      this.customResponse = new CustomResponse('ERROR', 'Client Error', true);
    }
  }
  updateSpfConfiguration(companyId:number){
    this.dashboardService.updateSpfConfiguration(companyId).subscribe(
      response=>{
        this.loading = false;
        this.customResponse = new CustomResponse('SUCCESS', 'SPF Configuration Updated Successfully', true);
      },error=>{
        this.loading = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      }
    );
  }
  

}
