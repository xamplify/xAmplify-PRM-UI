import { Component, OnInit } from '@angular/core';
import { OauthSso } from '../models/oauth-sso';
import { OauthSsoService } from './oauth-sso.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Properties } from 'app/common/models/properties';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-oauth-sso-configuration',
  templateUrl: './oauth-sso-configuration.component.html',
  styleUrls: ['./oauth-sso-configuration.component.css'],
  providers: [Properties, OauthSsoService, OauthSso]

})
export class OauthSsoConfigurationComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private oauthSsoService: OauthSsoService, private oauthSso: OauthSso,
    public referenceService: ReferenceService
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
  disableSubmitButton = true;
  responseMessage: CustomResponse = new CustomResponse();
  ngxLoading: boolean = false;


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
      }
    }, error => {
      this.ngxLoading = false;
      console.log(error);
    });
  }

  saveOauthSsoConfiguration() {
    let self = this;
    self.oauthSso.companyId = self.authenticationService.user.campaignAccessDto.companyId;
    self.oauthSso.createdBy = self.loggedInUserId;
    self.ngxLoading = true;
    self.oauthSsoService.saveOauthSsoConfiguration(self.oauthSso).subscribe(data => {
      // this.referenceService.loading(this.httpRequestLoader, false);
      this.referenceService.goToTop();
      self.ngxLoading = false;
      if (data.statusCode == 200) {
        this.responseMessage = new CustomResponse('SUCCESS', "Details Submitted Succesfully", true);
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

}
