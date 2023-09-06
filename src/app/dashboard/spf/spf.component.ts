import { Component, OnInit } from '@angular/core';
import {Properties} from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import {DashboardService} from 'app/dashboard/dashboard.service';
import {ReferenceService} from 'app/core/services/reference.service';
import {AuthenticationService} from 'app/core/services/authentication.service';

 declare var $;
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
 bootstrapAlertClass = "";
 successOrErrorMessage = "";
 spfErrorOrSuccessClass = "";
 domainName:any = "";
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,public dashboardService:DashboardService) { }

  ngOnInit() {
     const user = JSON.parse(localStorage.getItem('currentUser'));
      let hasCompany = user.hasCompany;
      let campaignAccessDto = user.campaignAccessDto;
      if(hasCompany && campaignAccessDto!=undefined){
        this.companyId= user.campaignAccessDto.companyId;
      }
      this.isSpfConfigured();
      $('#addADomain').show();
      $('#step-2').hide();
      $('#step-3').hide();
      $('#step-4').hide();
      $('#step-5').hide();
      $('#step-6').hide();
      $('#step-7').hide();
      this.domainName = "example.com";
  }

  isSpfConfigured(){
    this.loading  = true;
    this.authenticationService.isSpfConfigured(this.companyId).subscribe(
      response=>{
        this.loading = false;
        if(response.data){
          this.spfConfigured = true;
          this.bootstrapAlertClass = "alert alert-success";
          this.successOrErrorMessage = "SPF Configuration Done"; 
        }
      },error=>{
        this.loading = false;
      }
    );
  }

  saveSpf(){
  this.spfErrorOrSuccessClass = "";
  this.bootstrapAlertClass = "";
  this.successOrErrorMessage = ""; 
	this.referenceService.goToTop();
	if(this.isChecked){
    	this.customResponse = new CustomResponse();
    	this.loading = true;
	    try{
	      this.updateSpfConfiguration(this.companyId);
	    }catch(error){
        this.loading = false;
        this.bootstrapAlertClass = "alert alert-danger";
        this.successOrErrorMessage = "Client Error"; 
	    }
	}else{
		this.bootstrapAlertClass = "alert alert-danger";
    this.successOrErrorMessage = "You must confirm";
    this.spfErrorOrSuccessClass = "required";
	}
    
  }
  updateSpfConfiguration(companyId:number){
    this.dashboardService.updateSpfConfiguration(companyId).subscribe(
      response=>{
        this.loading = false;
        this.bootstrapAlertClass = "alert alert-success";
        this.successOrErrorMessage = "SPF Configuration Updated Successfully";
        this.isSpfConfigured();
      },error=>{
        this.loading = false;
        this.bootstrapAlertClass = "alert alert-success";
        this.successOrErrorMessage = this.properties.serverErrorMessage;
      }
    );
  }

  /******* XNFR-335 **********/
  addADomain(){
    $('#addADomain').hide();
    $('#step-2').show();
    $('#step-3').hide();
  }
  goToVerification(){
    $('#step-2').hide();
    $('#step-3').show();
  }
  goToStepFour(){
    $('#step-3').hide();
    $('#step-4').show();
    $('#step-5').hide();
  }
  goToStepFive(){
    $('#step-4').hide();
    $('#step-5').show();
  }

  authenticateGodaddy(){
    $('#step-5').hide();
    $('#step-6').show();
  }
  goToConnectDomain(){
    $('#step-6').hide();
    $('#step-7').show();
  }
  

}
