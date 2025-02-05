import { Component, OnInit, Input } from '@angular/core';
import { RequestDemo } from 'app/authentication/request-demo/request-demo';
import { Country } from 'app/core/models/country';
import { Timezone } from 'app/core/models/timezone';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
declare var $:any;
@Component({
  selector: 'app-public-top-navigation-bar',
  templateUrl: './public-top-navigation-bar.component.html',
  styleUrls: ['./public-top-navigation-bar.component.css']
})

export class PublicTopNavigationBarComponent implements OnInit {

  requestAccountButtonClicked = false;
  requestAccountButtonText = "Request An Account";
  alias = "";
  @Input() companyLogoPath: string;
  isCompanyLogoLoadedFromAnotherComponent = false;
  @Input() emailAddress: string;
  isCampaignMDF = false;
  processing = false;
  isValidForm = false;

  countries: Country[];
  timezones: Timezone[];
  requestDemo: RequestDemo = new RequestDemo();
  isValidEmail = false;
  isValidCompany = false;
  isValidMobileNumber = false;
  errorClass = "success";
  submitted = false;
  isContacted = false;
  ngxLoading = false;
  isVanityUrlEnabled = false;
  constructor(public vanityUrlService: VanityURLService, public authenticationService: AuthenticationService, public referenceService: ReferenceService) {
    this.countries = this.referenceService.getCountries();
    this.setCountry();
  }

  ngOnInit() {
    if(this.companyLogoPath!=undefined){
      this.isCompanyLogoLoadedFromAnotherComponent = true;
    }else{
      this.isCompanyLogoLoadedFromAnotherComponent = false;
      this.isVanityUrlEnabled = this.vanityUrlService.isVanityURLEnabled();
      if(this.isVanityUrlEnabled){
        this.vanityUrlService.checkVanityURLDetails();
      }
    }
   
  }

  setCountry() {
    this.requestDemo.countryId = this.countries[0].id;
    this.onSelect(this.requestDemo.countryId);
  }

  onSelect(countryId) {
    this.timezones = this.referenceService.getTimeZonesByCountryId(countryId);
  }


  validateEmailId() {
    if (!this.referenceService.validateEmailId($.trim(this.requestDemo.emailId))) {
      this.isValidEmail = false;
      this.isValidForm = false;
      this.errorClass = "error";
    } else {
      this.isValidEmail = true;
      this.errorClass = "success";
      if (this.isValidCompany && this.validateMobileNumber) {
        this.isValidForm = true;
      } else {
        this.isValidForm = false;
      }
    }
  }

  validateCompany() {
    let company = $.trim(this.requestDemo.company);
    if (company.length > 0) {
      this.isValidCompany = true;
      if (this.isValidEmail && this.validateMobileNumber) {
        this.isValidForm = true;
      } else {
        this.isValidForm = false;
      }
    } else {
      this.isValidCompany = false;
      this.isValidForm = false;
    }
  }

  validateMobileNumber() {
    let mobileNumber = $.trim(this.requestDemo.mobileNumber);
    if (mobileNumber.length > 0) {
      this.isValidMobileNumber = true;
      if (this.isValidEmail && this.isValidCompany) {
        this.isValidForm = true;
      } else {
        this.isValidForm = false;
      }
    } else {
      this.isValidMobileNumber = false;
      this.isValidForm = false;
    }
  }


  sendRequest() {
    this.ngxLoading = true;
    let timezoneId = $('#demo-timezoneId option:selected').val();
    let country = $.trim($('#demo-countryName option:selected').text());
    this.requestDemo.timezone = timezoneId;
    this.requestDemo.country = country;
    this.authenticationService.requestAccount(this.requestDemo).subscribe(
      response => {
        this.referenceService.showSweetAlertSuccessMessage("Your account request has been submitted successfully");
        this.requestAccountButtonClicked = false;
        this.ngxLoading = false;
        this.referenceService.closeModalPopup("request-account-modal-popup");
      }, error => {
        this.ngxLoading = false;
        this.requestAccountButtonClicked = false;
        this.referenceService.showSweetAlertServerErrorMessage();
      });
  }

  openRequestAccountModal() {
    this.requestDemo = new RequestDemo();
    if(this.emailAddress!=undefined){
      this.isCampaignMDF = true;
      this.requestDemo.emailId = this.emailAddress;
      this.validateEmailId();
    }
    this.referenceService.openModalPopup("request-account-modal-popup");
  }



}
