import { Component, OnInit } from '@angular/core';
import { OauthSso } from '../models/oauth-sso';
import { OauthSsoService } from './oauth-sso.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Properties } from 'app/common/models/properties';
import { ReferenceService } from 'app/core/services/reference.service';
import { RegularExpressions } from "app/common/models/regular-expressions";
declare var flatpickr: any, $: any, swal: any;


@Component({
  selector: 'app-oauth-sso-configuration',
  templateUrl: './oauth-sso-configuration.component.html',
  styleUrls: ['./oauth-sso-configuration.component.css'],
  providers: [Properties, OauthSsoService, OauthSso]

})
export class OauthSsoConfigurationComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private oauthSsoService: OauthSsoService, public oauthSso: OauthSso,
    public referenceService: ReferenceService, public properties: Properties
  ) { }

  customResponse: CustomResponse = new CustomResponse();
  loggedInUserId: number;
  companyId: number;
  grantTypes = [
    { value: 'authorization_code', label: 'Authorization Code' }
  ];
  errorClass = "form-group has-error has-feedback";
  successClass = "form-group has-success has-feedback";
  formGroupClass = "form-group";
  fromNameDivClass: string = this.formGroupClass;
  responseMessage: CustomResponse = new CustomResponse();
  ngxLoading: boolean = false;
  saveOrUpdateButtonText: String = "Submit";


  clientIdDivClass: string;
  clientSecretIdDivClass: string;
  authorizationEndpointDivClass: string;
  scopeDivClass: string;
  tokenEndpointDivClass: string;
  userInfoEndpointDivClass: string;
  grantTypeDivClass: string;
  authenticationServiceNameDivClass: string;
  clientIdError: boolean = true;
  clientSecretIdError: boolean = true;
  authorizationEndpointError: boolean = true;
  scopeError: boolean = true;
  tokenEndpointError: boolean = true;
  userInfoEndpointError: boolean = true;
  grantTypeError: boolean = true;
  disableSubmitButton: boolean = true;
  authenticationServiceNameError: boolean = true;
  authorizationEndpointErrorMessage: string = '';
  tokenEndpointErrorMessage: string = '';
  userInfoEndpointErrorMessage: string = '';
  isCopiedToClipboard: boolean = false;
  regularExpressions = new RegularExpressions();


  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.getOauthSsoConfigurationDetails();
  }

  getOauthSsoConfigurationDetails() {
    this.ngxLoading = true;
    this.oauthSsoService.getOauthSsoConfigurationDetails(this.loggedInUserId).subscribe(result => {
      this.ngxLoading = false;
      if(result.statusCode == 200) {
        this.oauthSso = result.data;
        if (this.oauthSso.id !== undefined &&  this.oauthSso.id > 0) {
          this.saveOrUpdateButtonText = 'Update';
        }
        this.validateSubmitButton();
      }
    }, error => {
      this.ngxLoading = false;
      console.log(error);
    });
  }

  saveOrUpdateOauthSsoConfiguration() {
    let self = this;
    self.oauthSso.companyId = self.authenticationService.user.campaignAccessDto.companyId;
    self.oauthSso.createdBy = self.loggedInUserId;
    self.ngxLoading = true;
    self.oauthSsoService.saveOrUpdateOauthSsoConfiguration(self.oauthSso).subscribe(data => {
      this.referenceService.goToTop();
      self.ngxLoading = false;
      if (data.statusCode == 200) {
        self.responseMessage = new CustomResponse('SUCCESS', "Details Submitted Succesfully!", true);
        self.saveOrUpdateButtonText = 'Update';
        self.getOauthSsoConfigurationDetails();
      } else if (data.statusCode == 400) {
        self.responseMessage = new CustomResponse('ERROR', "Something went wrong, Please try agian after sometime!", true);
      } else if (data.statusCode == 500) {
        self.responseMessage = new CustomResponse('ERROR', "Something went wrong, Please check the Url's entered!", true);
      }
    },
    error => {
      self.ngxLoading = false;
          console.log(error);
    },
    () => { });
  }

  copyToClipboard(inputElement: any) {
    inputElement.select();
    $('#copy-reference-id').hide();
    document.execCommand('copy');
    $('#copy-reference-id').show(500);
    this.isCopiedToClipboard = true;
  }


  selectGrantType(grantType: any, fieldValue : string) {
    this.oauthSso.grantType = grantType;
    this.validateField(fieldValue);
  }

  validateField(fieldName: string) {
    var errorClass = "form-group has-error";
    var successClass = "form-group has-success";
    if ("clientId" == fieldName) {
      this.oauthSso.clientId = $.trim(this.oauthSso.clientId);
      if (this.oauthSso.clientId.length > 0) {
        this.clientIdError = false;
        this.clientIdDivClass = successClass;
      } else {
        this.clientIdError = true;
        this.clientIdDivClass = errorClass;
      }
    } else if ("clientSecretId" == fieldName) {
      this.oauthSso.clientSecretId = $.trim(this.oauthSso.clientSecretId);
      if (this.oauthSso.clientSecretId.length > 0) {
        this.clientSecretIdError = false;
        this.clientSecretIdDivClass = successClass;
      } else {
        this.clientSecretIdError = true;
        this.clientSecretIdDivClass = errorClass;
      }
    } else if ("authorizationEndpoint" == fieldName) {
      this.oauthSso.authorizationEndpoint = $.trim(this.oauthSso.authorizationEndpoint);
      this.authorizationEndpointErrorMessage = this.referenceService.validateOauthUrlPattern(this.oauthSso.authorizationEndpoint) ? '' : 'Please enter a valid Authorization endpoint url';
      if (this.oauthSso.authorizationEndpoint.length > 0 && this.authorizationEndpointErrorMessage == '') {
        this.authorizationEndpointError = false;
        this.authorizationEndpointDivClass = successClass;
      } else {
        this.authorizationEndpointError = true;
        this.authorizationEndpointDivClass = errorClass;
      }
    } else if ("scope" == fieldName) {
      this.oauthSso.scope = $.trim(this.oauthSso.scope);
      if (this.oauthSso.scope.length > 0) {
        this.scopeError = false;
        this.scopeDivClass = successClass;
      } else {
        this.scopeError = true;
        this.scopeDivClass = errorClass;
      }
    } else if ("tokenEndpoint" == fieldName) {
      this.oauthSso.tokenEndpoint = $.trim(this.oauthSso.tokenEndpoint);
      this.tokenEndpointErrorMessage = this.referenceService.validateOauthUrlPattern(this.oauthSso.tokenEndpoint) ? '' : 'Please enter a valid Token endpoint url';
      if (this.oauthSso.tokenEndpoint.length > 0 && this.tokenEndpointErrorMessage == '') {
        this.tokenEndpointError = false;
        this.tokenEndpointDivClass = successClass;
      } else {
        this.tokenEndpointError = true;
        this.tokenEndpointDivClass = errorClass;
      }
    } else if ("userInfoEndpoint" == fieldName) {
      this.oauthSso.userInfoEndpoint = $.trim(this.oauthSso.userInfoEndpoint);
      this.userInfoEndpointErrorMessage = this.referenceService.validateOauthUrlPattern(this.oauthSso.userInfoEndpoint) ? '' : 'Please enter a valid User info endpoint url';
      if (this.oauthSso.userInfoEndpoint.length > 0 && this.userInfoEndpointErrorMessage == '') {
        this.userInfoEndpointError = false;
        this.userInfoEndpointDivClass = successClass;
      } else {
        this.userInfoEndpointError = true;
        this.userInfoEndpointDivClass = errorClass;
      }
    } else if ("grantType" == fieldName) {
      this.oauthSso.grantType = $.trim(this.oauthSso.grantType);
      if (this.oauthSso.grantType !== undefined && this.oauthSso.grantType !== null && this.oauthSso.grantType !== '' && this.oauthSso.grantType !== 'null') {
        this.grantTypeError = false;
        this.grantTypeDivClass = successClass;
      } else {
        this.grantTypeError = true;
        this.grantTypeDivClass = errorClass;
      } 
    } else if ("authenticationServiceName" == fieldName) {
      this.oauthSso.authenticationServiceName = $.trim(this.oauthSso.authenticationServiceName);
      if (this.oauthSso.authenticationServiceName.length > 0) {
        this.authenticationServiceNameError = false;
        this.authenticationServiceNameDivClass = successClass;
      } else {
        this.authenticationServiceNameError = true;
        this.authenticationServiceNameDivClass = errorClass;
      }
    } 
    this.validateSubmitButton();
  }

  validateSubmitButton() {
    if (!this.clientIdError && !this.clientSecretIdError && !this.authorizationEndpointError && !this.scopeError
      && !this.userInfoEndpointError && !this.tokenEndpointError && !this.grantTypeError && !this.authenticationServiceNameError) {
      this.disableSubmitButton = false;
    } else if (this.oauthSso.clientId !== undefined && this.oauthSso.clientId !== null && this.oauthSso.clientId !== '' && 
      this.oauthSso.clientSecretId !== undefined && this.oauthSso.clientSecretId !== null && this.oauthSso.clientSecretId !== '' &&
      this.oauthSso.grantType !== undefined && this.oauthSso.grantType !== null &&  this.oauthSso.grantType !== '' && this.oauthSso.grantType !== 'null' &&
      this.oauthSso.authorizationEndpoint !== undefined && this.oauthSso.authorizationEndpoint !== null && this.oauthSso.authorizationEndpoint !== '' &&
      this.oauthSso.tokenEndpoint !== undefined && this.oauthSso.tokenEndpoint !== null && this.oauthSso.tokenEndpoint !== '' &&
      this.oauthSso.userInfoEndpoint !== undefined && this.oauthSso.userInfoEndpoint !== null && this.oauthSso.userInfoEndpoint !== '' &&
      this.oauthSso.scope !== undefined && this.oauthSso.scope !== null && this.oauthSso.scope !== '' &&
      this.oauthSso.authenticationServiceName !== undefined &&  this.oauthSso.authenticationServiceName !== null && this.oauthSso.authenticationServiceName !== '' &&
      this.authorizationEndpointErrorMessage == '' && this.tokenEndpointErrorMessage == '' && this.userInfoEndpointErrorMessage == '') {
      this.disableSubmitButton = false;
    } else {
      this.disableSubmitButton = true;
    }
  }

}
