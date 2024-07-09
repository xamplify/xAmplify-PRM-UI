import { Component, OnInit } from '@angular/core';
import { OauthSso } from '../models/oauth-sso';
import { OauthSsoService } from './oauth-sso.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Properties } from 'app/common/models/properties';
import { ReferenceService } from 'app/core/services/reference.service';
import { BaseOptions } from 'flatpickr/dist/types/options';
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
  clientIdError: boolean = true;
  clientSecretIdError: boolean = true;
  authorizationEndpointError: boolean = true;
  scopeError: boolean = true;
  tokenEndpointError: boolean = true;
  userInfoEndpointError: boolean = true;
  grantTypeError: boolean = true;
  disableSubmitButton: boolean = true;

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
        this.responseMessage = new CustomResponse('SUCCESS', "Details Submitted Succesfully", true);
        this.saveOrUpdateButtonText = 'Update';
      } else if (data.statusCode == 400) {
        this.responseMessage = new CustomResponse('ERROR', data.message, true);
      }
    },
    error => {
      this.ngxLoading = false;
          console.log(error);
    },
    () => { });
  }

  copyToClipboard(element) {
    element.select();
    document.execCommand('copy');
  }

  selectGrantType(grantType: any, fieldValue : string) {
    this.oauthSso.grantType = grantType;
    this.validateField(fieldValue);
  }

  validateField(fieldName: string) {
    var errorClass = "form-group has-error has-feedback";
    var successClass = "form-group has-success has-feedback";
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
      if (this.oauthSso.authorizationEndpoint.length > 0) {
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
      if (this.oauthSso.tokenEndpoint.length > 0) {
        this.tokenEndpointError = false;
        this.tokenEndpointDivClass = successClass;
      } else {
        this.tokenEndpointError = true;
        this.tokenEndpointDivClass = errorClass;
      }
    } else if ("userInfoEndpoint" == fieldName) {
      this.oauthSso.userInfoEndpoint = $.trim(this.oauthSso.userInfoEndpoint);
      if (this.oauthSso.userInfoEndpoint.length > 0) {
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
    }
    this.validateSubmitButton();
  }

  validateSubmitButton() {
    if (!this.clientIdError && !this.clientSecretIdError && !this.authorizationEndpointError && !this.scopeError
      && !this.userInfoEndpointError && !this.tokenEndpointError && !this.grantTypeError) {
      this.disableSubmitButton = false;
    } else if (this.oauthSso.clientId !== undefined && this.oauthSso.clientId !== null && this.oauthSso.clientId !== '' && 
      this.oauthSso.clientSecretId !== undefined && this.oauthSso.clientSecretId !== null && this.oauthSso.clientSecretId !== '' &&
      this.oauthSso.grantType !== undefined && this.oauthSso.grantType !== null &&  this.oauthSso.grantType !== '' && this.oauthSso.grantType !== 'null' &&
      this.oauthSso.authorizationEndpoint !== undefined && this.oauthSso.authorizationEndpoint !== null && this.oauthSso.authorizationEndpoint !== '' &&
      this.oauthSso.tokenEndpoint !== undefined && this.oauthSso.tokenEndpoint !== null && this.oauthSso.tokenEndpoint !== '' &&
      this.oauthSso.userInfoEndpoint !== undefined && this.oauthSso.userInfoEndpoint !== null && this.oauthSso.userInfoEndpoint !== '' &&
      this.oauthSso.scope !== undefined && this.oauthSso.scope !== null && this.oauthSso.scope !== '') {
      this.disableSubmitButton = false;
    } else {
      this.disableSubmitButton = true;
    }
  }

}
