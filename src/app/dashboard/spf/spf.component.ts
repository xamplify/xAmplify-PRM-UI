import { Component, OnInit } from '@angular/core';
import {Properties} from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import {DashboardService} from 'app/dashboard/dashboard.service';
import {ReferenceService} from 'app/core/services/reference.service';
import {AuthenticationService} from 'app/core/services/authentication.service';
import { GodaddyDetailsDto } from '../user-profile/models/godaddy-details-dto';

 declare var $,swal;
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
 /** XNFR-335 ***/
 domainName:any = "";
 message:any;
 statusCode:any;
 apiKey: string = ''; // Initialize apiKey and apiSecret
 apiSecret: string = '';
 godaddyRecordDto:GodaddyDetailsDto = new GodaddyDetailsDto();
 isDomainName:boolean = false;
 isGodaddyConnected:boolean = false;
 godaddyValue:any = "v=spf1 include:u10208008.wl009.sendgrid.net ~all";
 hasSpace:boolean = false;
 updateButton: boolean = false;
 /** XNFR-335*******/
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties,public dashboardService:DashboardService) { }

  ngOnInit() {
     const user = JSON.parse(localStorage.getItem('currentUser'));
      let hasCompany = user.hasCompany;
      let campaignAccessDto = user.campaignAccessDto;
      if(hasCompany && campaignAccessDto!=undefined){
        this.companyId= user.campaignAccessDto.companyId;
      }
      this.isSpfConfigured();
      this.isGodaddyConfigured();
      this.getDomainName();
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
        } else {
          this.spfConfigured = false;
          this.isChecked = false;
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
  addADomain() {
    this.loading = true;
    $('#addADomain').hide();
    $('#step-2').show();
    $('#step-3').hide();
    this.loading = false;
  }
  goToVerification() {
    this.loading = true;
    $('#step-2').hide();
    $('#step-3').show();
    this.loading = false;
  }
  goToStepFour() {
    this.loading = true;
    $('#step-3').hide();
    $('#step-4').show();
    $('#step-5').hide();
    this.loading = false;
  }
  goToStepFive() {
    this.loading = true;
    $('#step-4').hide();
    $('#step-5').show();
    $('#step-6').hide();
    this.loading = false;
  }
  goToAddDomainDiv() {
    this.loading = true;
    $('#step-5').hide();
    $('#step-2').show();
    this.statusCode = 200;
    this.loading = false;
  }
  goToConnectdStep() {
    $('#step-6').hide();
    $('#step-7').show();
    this.isChecked = true;
    this.spfConfigured = true;
    this.saveSpf()
  }
  goToStep3(){
    $('#step-3').show();
    $('#step-4').hide();
  }
  changeDomainName(evn: any) {
    this.godaddyRecordDto.domainName = evn;
    this.domainName = this.godaddyRecordDto.domainName;
    this.hasSpace = this.godaddyRecordDto.domainName.includes(' ');
    if (this.domainName != "") {
      this.isDomainName = true;
    } else {
      this.isDomainName = false;
    }
  }
  changeValue(event: any) {
    this.godaddyRecordDto.data = event;
    //this.statusCode = 200;
  }

  isAuthorized(): boolean {
    // Check if both apiKey and apiSecret are provided
    return this.apiKey.length > 0 && this.apiSecret.length > 0;
  }
  authenticationOfGodaddy() {
    this.loading = true;
    this.godaddyRecordDto.apiKey = this.apiKey;
    this.godaddyRecordDto.apiSecret = this.apiSecret;
    this.godaddyRecordDto.data = this.godaddyValue;
    this.checkDomainName(this.godaddyRecordDto)
  }
  getDomainName(){
    this.dashboardService.getDomainName(this.companyId) .subscribe(
      response => {
        this.domainName = response.data;
        if(this.domainName === ""){
          this.domainName = "Please Unlink Domain"
        }
      }
    );

  }
  checkDomainName(godaddyDetailsDto: GodaddyDetailsDto) {
    this.loading = true;
    this.dashboardService.checkDomainName(godaddyDetailsDto).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.loading = false;
          this.statusCode = 200;
          $('#step-5').hide();
          $('#step-6').show();
        }else if(response.statusCode == 401) {
          this.statusCode = 401;
          this.message = response.message;
          this.loading = false;
        }  else if(response.statusCode == 404){
          this.statusCode = 404;
          this.message = "Invalid Domain :"+this.domainName;
          this.loading = false;
        }else {
          this.statusCode = 500;
          this.message = response.message;
          this.loading = false;
        }
      }, error => {
        this.loading = false;
      }
    );
  }

  addDNsRecord(isConnected:boolean) {
    this.godaddyRecordDto.type = "TXT";
    this.godaddyRecordDto.name = "@";
    this.loading = true;
    this.dashboardService.addDnsRecordOfGodaddy(this.godaddyRecordDto).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.loading = false;
          this.statusCode = 200;
          $('#step-6').hide();
          $('#step-7').show();
          this.updateGodaddyConfiguration(this.companyId,isConnected);
          this.isChecked = true;
          this.spfConfigured = true;
          this.saveSpf()
          this.updateButton = false;
        } else if (response.statusCode == 422) {
          this.statusCode = 422;
          this.message = "DNS Record was Dulicated.";
          this.loading = false;
        } else {
          this.statusCode = 400;
          this.message = "Domain Name Invalid";
          this.loading = false;
        }
      }, error => {
        this.loading = false;
      }
    );
  }
  isGodaddyConfigured() {
    this.loading = true;
    this.dashboardService.isGodaddyConfigured(this.companyId).subscribe(
      response => {
        this.loading = false;
        if (response.data) {
          this.isGodaddyConnected = true;
        }
        if (!this.isGodaddyConnected) {
          $('#addADomain').show();
          $('#step-2').hide();
          $('#step-3').hide();
          $('#step-4').hide();
          $('#step-5').hide();
          $('#step-6').hide();
          $('#step-7').hide();
        } else {
          $('#addADomain').hide();
          $('#step-2').hide();
          $('#step-3').hide();
          $('#step-4').hide();
          $('#step-5').hide();
          $('#step-6').hide();
          $('#step-7').hide();
          $('#step-7').show();
        }
      }, error => {
        this.loading = false;
      }
    );
  }
  updateGodaddyConfiguration(companyId: number,isConnected:boolean) {
    this.dashboardService.updateGodaddyConfiguration(companyId,isConnected).subscribe(
      response => {
        this.loading = false;
      }, error => {
        this.loading = false;
      }
    );
  }
  foundDuplicateDnsRecord(isConnected:boolean) {
    this.dashboardService.foundDuplicateDnsRecord(this.godaddyRecordDto.data).subscribe(
      response => {
        this.loading = false;
        this.updateButton = true;
        this.updateGodaddyConfiguration(this.companyId, isConnected);
        this.statusCode = 409;
      }, error => {
        this.loading = false;
      }
    );
  }
  unlinkConfiguration(isConnected:boolean){
    let self = this;
		swal({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Yes, Unlink it!'

		}).then(function () {
      self.updateGodaddyConfiguration(self.companyId, isConnected);
     self.showStep1();
		},function (dismiss: any) {
			console.log("you clicked showAlert cancel" + dismiss);
		});
   
  }
  showStep1(){
    $('#addADomain').show();
    $('#step-2').hide();
    $('#step-3').hide();
    $('#step-4').hide();
    $('#step-5').hide();
    $('#step-6').hide();
    $('#step-7').hide();
    this.spfConfigured = false;
    this.isChecked = false;
    this.godaddyRecordDto = new GodaddyDetailsDto();
    this.apiKey ="";
    this.apiSecret= "";
    this.updateButton = false;
  }

}
