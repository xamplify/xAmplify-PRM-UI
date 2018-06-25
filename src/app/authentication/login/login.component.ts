import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UserService } from '../../core/services/user.service';

import { User } from '../../core/models/user';
import { Role } from '../../core/models/role';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';

declare const $: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../../../assets/css/default.css', '../../../assets/css/authentication-page.css',
     '../../../assets/css/loader.css'],
    providers: [User, Properties]
})

export class LoginComponent implements OnInit, OnDestroy {
    model: any = {};
    customResponse: CustomResponse = new CustomResponse();
    loading = false;
    resendActiveMail = false;
    mainLoader:boolean;
    socialProviders = [{ "name": "salesforce", "iconName": "salesforce" },
    { "name": "facebook", "iconName": "facebook" },
    { "name": "twitter", "iconName": "twitter" },
    { "name": "google", "iconName": "googleplus" },
    { "name": "linkedin", "iconName": "linkedin" }];

    roles: Array<Role>;
    constructor(private router: Router, private authenticationService: AuthenticationService,public userService: UserService,
        public referenceService: ReferenceService, private xtremandLogger: XtremandLogger, public properties: Properties) {
        if (this.referenceService.userProviderMessage !== "") {
            this.setCustomeResponse("SUCCESS", this.referenceService.userProviderMessage);
        }
    }

    public login() {
        try{
        this.loading = true;
        this.resendActiveMail = false;
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
                      if (response.error_description === "Bad credentials" || response.error_description.includes('Username/password are wrong')) {
                          this.setCustomeResponse("ERROR", this.properties.BAD_CREDENTIAL_ERROR);
                      } else if (response.error_description === "User is disabled") {
                        this.resendActiveMail = true;
                        this.customResponse =  new CustomResponse();
                     //   this.setCustomeResponse("ERROR", this.properties.USER_ACCOUNT_ACTIVATION_ERROR);
                      }else if(response.error_description ==="UserDetailsService returned null, which is an interface contract violation"){
                        this.setCustomeResponse("ERROR", this.properties.BAD_CREDENTIAL_ERROR);
                      }
                  }
                  else {
                      this.resendActiveMail = false;
                      this.setCustomeResponse("ERROR", error);
                      this.xtremandLogger.error("error:" + error)
                  }
              });
          return false;
        }
      }catch(error){ console.log('error'+error);}
    }

    redirectTo(user: User) {
        this.loading = false;
        const roles = user.roles;
        if (user.hasCompany || roles.length === 1) {
            this.router.navigate([this.referenceService.homeRouter]);
        } else {
            this.router.navigate(['/home/dashboard/add-company-profile']);
        }
    }
    eventHandler(keyCode: any) {  if (keyCode === 13) {  this.login();  }  }
    setCustomeResponse(responseType: string, responseMessage: string) {
        this.customResponse = new CustomResponse(responseType, responseMessage, true);
        this.xtremandLogger.error(responseMessage);
    }
    resendActivation(){
      try{
      this.userService.resendActivationMail(this.model.username).subscribe(result=>{
        if(result ==='resend Activation email success'){
          this.resendActiveMail = false;
          this.setCustomeResponse('SUCCESS', this.properties.RESEND_ACTIVATION_MAIL);
        }
       },
       (error:any)=>{
        this.xtremandLogger.error(error);
       }
      )
    } catch(error){ console.log('error'+error);}
    }
    ngOnInit() {
     try{
     this.mainLoader = true;
     this.authenticationService.navigateToDashboardIfUserExists();
     setTimeout(()=>{  this.mainLoader = false;},900);
     }catch(error){this.xtremandLogger.error('error'+error)}
    }
    ngOnDestroy() {
        this.referenceService.userProviderMessage = '';
        this.resendActiveMail = false;
        $('#org-admin-deactivated').hide();
    }
}
