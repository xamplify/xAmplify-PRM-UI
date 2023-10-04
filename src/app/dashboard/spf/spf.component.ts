import { Component, OnInit,OnDestroy } from '@angular/core';
import {Properties} from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import {DashboardService} from 'app/dashboard/dashboard.service';
import {ReferenceService} from 'app/core/services/reference.service';
import {AuthenticationService} from 'app/core/services/authentication.service';
import {GodaddyDetailsDto} from '../user-profile/models/godaddy-details-dto';

 declare var $:any,swal:any;
@Component({
  selector: 'app-spf',
  templateUrl: './spf.component.html',
  styleUrls: ['./spf.component.css'],
  providers: [Properties]
})
export class SpfComponent implements OnInit,OnDestroy {
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
 godaddyDtos:GodaddyDetailsDto[];
 suggestValue:string;
currentValue:string;
showConnectButton:boolean;
disabledCreateButton:boolean;
finalButtonValue:string;
errorMessage:string;
isSpfDoneManually:boolean;
isSpfDoneGodaddy:boolean;
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
      this.getDnsRecordsOfGodaddy();
  }

  ngOnDestroy(): void {
    this.authenticationService.module.navigateToSPFConfigurationSection = false;
  }

  isSpfConfigured(){
    this.loading  = true;
    this.authenticationService.isSpfConfigured(this.companyId).subscribe(
      response=>{
        if(response.data){
          this.spfConfigured = response.data;
          this.bootstrapAlertClass = "alert alert-success";
          this.successOrErrorMessage = "SPF Configuration manually Done"; 
        } else {
          this.spfConfigured = false;
          this.isChecked = false;
        }
        this.loading = false;
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
    this.isGodaddyConnected = false;
    this.godaddyRecordDto = new GodaddyDetailsDto();
    this.apiKey ="";
    this.apiSecret= "";
    this.loading = false;
  }
  goToFirstPage(){
    $('#addADomain').show();
    $('#step-2').hide();
    this.domainName = "";
    if (this.domainName != "") {
      this.isDomainName = true;
    } else {
      this.isDomainName = false;
    }
  }
  goToVerification() {
    this.loading = true;
    $('#step-2').hide();
    $('#step-4').show();
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
    this.updateGodaddyConfiguration(this.companyId,true);
    this.isGodaddyConnected = true;
  }
  goToEnterDomainName(){
    $('#step-2').show();
    $('#step-4').hide();
  }
  validateDomainName() {
    this.domainName = this.godaddyRecordDto.domainName;
    this.hasSpace = this.domainName.includes(' ');
    if (this.domainName != "") {
      this.isDomainName = true;
    } else {
      this.isDomainName = false;
    }
  }
  changeValue(event: any) {
    this.godaddyValue = event;
    this.godaddyRecordDto.data = event;
  }

  isAuthorized(): boolean {
    return this.apiKey.length > 0 && this.apiSecret.length > 0;
  }
  createTooltip:string;
  authenticationOfGodaddy() {
    this.loading = true;
    this.godaddyRecordDto.apiKey = this.apiKey;
    this.godaddyRecordDto.apiSecret = this.apiSecret;
    this.godaddyRecordDto.data = this.godaddyValue;
    this.checkDomainName(this.godaddyRecordDto);
    this.updateButton = false;
    this.createTooltip = "Already SPF record is there in your DNS."
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
  showStep_5(){
    $('#step-5').hide();
    $('#step-6').show();
    this.getDnsRecordsOfGodaddy();
  }
  checkDomainName(godaddyDetailsDto: GodaddyDetailsDto) {
    this.loading = true;
    this.dashboardService.checkDomainName(godaddyDetailsDto).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.loading = false;
          this.statusCode = 200;
          this.showStep_5();
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
    this.updateButton = false;
    this.dashboardService.addDnsRecordOfGodaddy(this.godaddyRecordDto).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.statusCode = 200;
          this.showConnectButton = true;
          this.finalButtonValue = "Verified";
          $('#step-6').hide();
          $('#step-7').show();
          this.updateGodaddyConfiguration(this.companyId,isConnected);
          this.getDnsRecordsOfGodaddy();
          this.isGodaddyConnected = true;
        } else if (response.statusCode === 422) {
          this.statusCode = 422;
          this.updateButton = true;
          this.message = "DNS Record was Dulicated.";
        } else {
          this.statusCode = 400;
          this.message = "Domain Name Invalid";
        }
        this.loading = false;
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
          this.isGodaddyConnected = response.data;
          this.isSpfConfigured();
        if (!this.isGodaddyConnected) {
          $('#addADomain').show();
          $('#step-2').hide();
          $('#step-4').hide();
          $('#step-5').hide();
          $('#step-6').hide();
          $('#step-7').hide();
          this.isGodaddyConnected = false;
        } else {
          $('#addADomain').hide();
          $('#step-2').hide();
          $('#step-4').hide();
          $('#step-5').hide();
          $('#step-6').hide();
          $('#step-7').hide();
          $('#step-7').show();
          this.isGodaddyConnected = true;
        }
      }, error => {
        this.loading = false;
      }
    );
  }
  updateGodaddyConfiguration(companyId: number,isConnected:boolean) {
    this.loading = true;
    this.dashboardService.updateGodaddyConfiguration(companyId,isConnected).subscribe(
      response => {
        this.loading = false;
      }, error => {
        this.loading = false;
      }
    );
  }
  foundDuplicateDnsRecord(isConnected:boolean) {
    this.loading = true;
    this.dashboardService.foundDuplicateDnsRecord(this.godaddyRecordDto.data).subscribe(
      response => {
        this.loading = false;
        //this.updateButton = true;
        this.updateGodaddyConfiguration(this.companyId, isConnected);
        this.statusCode = 409;
      }, error => {
        this.loading = false;
      }
    );
  }
  unlinkConfiguration(isConnected: boolean) {
    let self = this;
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      swalConfirmButtonColor: '#54a7e9',
      swalCancelButtonColor: '#999',
      confirmButtonText: 'Yes, Reconfigure it!'
    }).then(function () {
      self.showStep1(isConnected);
    }, function (dismiss: any) {
      console.log("you clicked showAlert cancel" + dismiss);
    });

  }
  showStep1(connect:boolean){
    this.updateGodaddyConfiguration(this.companyId, connect);
    $('#addADomain').show();
    $('#step-2').hide();
    //$('#step-3').hide();
    $('#step-4').hide();
    $('#step-5').hide();
    $('#step-6').hide();
    $('#step-7').hide();
    //this.isGodaddyConfigured();
    this.isGodaddyConnected = false;
    this.godaddyRecordDto = new GodaddyDetailsDto();
    this.apiKey ="";
    this.apiSecret= "";
    this.updateButton = false;
  }

  //Show Dns Details
  getDnsRecordsOfGodaddy() {
    //this.loading = true;
    this.dashboardService.getDnsRecordsOfGodaddy().subscribe(
      response => {
        if (response.statusCode === 200) {
          //this.statusCode = 200;
          let goDaddyMap = response.data;
          this.suggestValue = goDaddyMap.suggest;
          this.godaddyDtos = goDaddyMap.data;
          if(this.godaddyDtos.length  != 0){
          this.currentValue = this.godaddyDtos[this.godaddyDtos.length - 1].data;
          }
          console.log(this.currentValue, this.suggestValue)
          if (this.currentValue === this.suggestValue && this.godaddyDtos.length === 1) {
            this.showConnectButton = true;
            this.finalButtonValue = "Verified";
            //this.isGodaddyConnected = true;
          } else if (this.currentValue != this.suggestValue && this.godaddyDtos.length === 1) {
            this.showConnectButton = false;
            this.finalButtonValue = "Mismatch";
            this.errorMessage = "The recommended record indicates a mismatch, please reconfigure from the settings.";
            this.isGodaddyConnected = false;
          } else {
            this.showConnectButton = false;
            this.finalButtonValue = "Invalid";
            this.errorMessage = "It is showing multiple SPF records for your domain, please reconfigure from the settings.It's important to point out that each domain may have only one SPF entry.";
            this.isGodaddyConnected = false;
          }
          console.log(this.godaddyDtos)
          this.loading = false;
        } else {
          this.statusCode = 409;
          this.message = "No Records Found";
          this.loading = false;
        }
      }, error => {
          this.loading = false;
      }
    );
  }
  //delete All records
  deleteDnsRecordsOfGodaddy(isReplace: boolean) {
    this.dashboardService.deleteDnsRecrds().subscribe(
      response => {
        if (response.statusCode === 204) {
          this.statusCode = 204;
          this.message = response.message;
          if (isReplace) {
            this.loading = true;
          } else {
            this.showStep_5();
            this.loading = false;
          }
          this.updateButton = false;
        } else {
          this.statusCode = 404;
          this.message = response.message
          this.loading = false;
        }
      }
    );
  }
  openDomainCheck(){
    window.open('https://dmarcian.com/domain-checker/', '_blank');
  }
  deleteDnsAllRecordsByTypeAndName(){
    let self = this;
    swal({
			title: 'Are you sure?',
			text: "All showed records will be deleted.",
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Yes, Delete it!'
		}).then(function () {
      self.loading = true;
      self.deleteDnsRecordsOfGodaddy(false);
		},function (dismiss: any) {
			console.log("you clicked showAlert cancel" + dismiss);
		});
  }
 
  copyToClipboard(inputElement: any, type: string) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    if (type === "suggested") {
      $("#copyTextDiv").select();
    } else {
      $("#copyText").select();
    }
  }
  replaceDnsRecord(){
    $('#replaceRecord').show();
  }

  replaceConfirm(){
    $('#replaceRecord').hide();
    this.loading = true;
    this.deleteDnsRecordsOfGodaddy(true); // Execute method1 immediately
    this.godaddyRecordDto.data = this.suggestValue;
    setTimeout(() => {
    this.addDNsRecord(true); // Execute method2 after a 2-second delay
    }, 2000);
  }
  replaceCancel(){
    $('#replaceRecord').hide();
  }
  manuallyProcess(){
    $('#unpublished-modal').show();
  }
  checkRecord() {
    this.showStep_5();
    $('#unpublished-modal').hide();
  }
  cancelManualProcess() {
    $('#unpublished-modal').hide();
  }
  updateRecord() {
    const fullURL = 'https://dcc.godaddy.com/control/dnsmanagement?domainName=' + this.domainName;
    window.open(fullURL, '_blank');
  }

}
