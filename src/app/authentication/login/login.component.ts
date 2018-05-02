import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';

import { User } from '../../core/models/user';
import { Role } from '../../core/models/role';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';

declare const $: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css'],
    providers: [User, Properties]
})

export class LoginComponent implements OnInit, OnDestroy {
    model: any = {};
    customResponse: CustomResponse = new CustomResponse();
    loading = false;
    socialProviders = [{ "name": "salesforce", "iconName": "salesforce" },
    { "name": "facebook", "iconName": "facebook" },
    { "name": "twitter", "iconName": "twitter" },
    { "name": "google", "iconName": "googleplus" },
    { "name": "linkedin", "iconName": "linkedin" }];

    roles: Array<Role>;
    constructor(private router: Router, private authenticationService: AuthenticationService,
        public referenceService: ReferenceService, private xtremandLogger: XtremandLogger, public properties: Properties) {
        if (this.referenceService.userProviderMessage !== "") {
            this.setCustomeResponse("SUCCESS", this.referenceService.userProviderMessage);
        }
    }

    public login() {
        this.loading = true;
        if (!this.model.username || !this.model.password) {
            this.loading = false;
            this.setCustomeResponse("ERROR", this.properties.EMPTY_CREDENTIAL_ERROR);
        } else {
          const userName = this.model.username.toLowerCase();
          this.referenceService.userName = userName;
          const authorization = 'Basic ' + btoa('my-trusted-client:');
          const body = 'username=' + userName + '&password=' + this.model.password + '&grant_type=password';
          this.authenticationService.login(authorization, body, userName).subscribe(result => {
              if (localStorage.getItem('currentUser')) {
                  // if user is coming from login
                  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                  this.xtremandLogger.log(currentUser);
                  this.xtremandLogger.log(currentUser.hasCompany);
                  this.redirectTo(currentUser);
                  // if user is coming from any link
                  if (this.authenticationService.redirectUrl) {
                      this.router.navigate([this.authenticationService.redirectUrl]);
                      this.authenticationService.redirectUrl = null;
                  }
              } else {
                  this.loading = false;
                  this.setCustomeResponse("ERROR", this.properties.BAD_CREDENTIAL_ERROR);
               }
             },
              (error: any) => {
                  this.loading = false;
                  const body = error['_body'];
                  if (body !== "") {
                      const response = JSON.parse(body);
                      if (response.error_description === "Bad credentials") {
                          this.setCustomeResponse("ERROR", this.properties.BAD_CREDENTIAL_ERROR);
                      } else if (response.error_description === "User is disabled") {
                          this.setCustomeResponse("ERROR", this.properties.USER_ACCOUNT_ACTIVATION_ERROR);
                      }
                  }
                  else {
                      this.setCustomeResponse("ERROR", error);
                      this.xtremandLogger.error("error:" + error)
                  }
              });
          return false;
        }
    }

    redirectTo(user: User) {
        this.loading = false;
        const roles = user.roles;
        if (user.hasCompany || roles.length === 1) {
            this.router.navigate(['/home/dashboard/default']);
        } else {
            this.router.navigate(['/home/dashboard/add-company-profile']);
        }
    }
    eventHandler(keyCode: any) {  if (keyCode === 13) {  this.login();  }  }
    setCustomeResponse(responseType: string, responseMessage: string) {
        this.customResponse = new CustomResponse(responseType, responseMessage, true);
        this.xtremandLogger.error(responseMessage);
    }
    ngOnInit() {
        localStorage.removeItem('currentUser');
    }
    ngOnDestroy() {
        this.referenceService.userProviderMessage = '';
        $('#org-admin-deactivated').hide();
    }
}
