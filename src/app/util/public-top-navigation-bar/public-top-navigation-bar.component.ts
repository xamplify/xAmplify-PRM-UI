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
  @Input() emailAddress: string;
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
  constructor(public vanityUrlService: VanityURLService, public authenticationService: AuthenticationService, public referenceService: ReferenceService) {
    this.countries = this.referenceService.getCountries();
    this.setCountry();
  }

  ngOnInit() {
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


  requestAccount() {
    this.requestAccountButtonClicked = true;
    this.requestAccountButtonText = "Please Wait...";
    let campaignMdfRequestAccountDto = {};
    campaignMdfRequestAccountDto['mdfAlias'] = this.alias;
    this.authenticationService.requestAccount(campaignMdfRequestAccountDto).subscribe(
      response => {
        this.referenceService.showSweetAlertSuccessMessage("Your account request has been submitted successfully");
        this.requestAccountButtonClicked = false;
      }, error => {
        this.requestAccountButtonClicked = false;
        this.referenceService.showSweetAlertServerErrorMessage();
      });
  }

  openRequestAccountModal() {
    this.referenceService.openModalPopup("request-account-modal-popup");
  }



}
