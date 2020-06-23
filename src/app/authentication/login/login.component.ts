import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UserService } from '../../core/services/user.service';

import { User } from '../../core/models/user';
import { Role } from '../../core/models/role';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

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
  mainLoader: boolean;
  socialProviders = [{ "name": "salesforce", "iconName": "salesforce" },
  { "name": "facebook", "iconName": "facebook" },
  { "name": "twitter", "iconName": "twitter" },
  { "name": "google", "iconName": "googleplus" },
  { "name": "linkedin", "iconName": "linkedin" }];


  roles: Array<Role>;
  vanityURLEnabled: boolean;
  isNotVanityURL: boolean;
  isLoggedInVanityUrl = false;
  checkedVanityURLDomain = false;
  constructor(private router: Router, public authenticationService: AuthenticationService, public userService: UserService,
    public referenceService: ReferenceService, private xtremandLogger: XtremandLogger, public properties: Properties, private vanityURLService: VanityURLService) {
    this.isLoggedInVanityUrl = this.vanityURLService.isVanityURLEnabled();
    if (this.referenceService.userProviderMessage !== "") {
      this.setCustomeResponse("SUCCESS", this.referenceService.userProviderMessage);
    }
    let sessionExpiredMessage = this.authenticationService.sessinExpriedMessage;
    if (sessionExpiredMessage != "") {
      this.setCustomeResponse("ERROR", sessionExpiredMessage);
    }
  }

  public login() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser != undefined) {
        this.setCustomeResponse("ERROR", "Another user is already logged in on this browser.");
      } else {
        this.authenticationService.sessinExpriedMessage = "";
        this.loading = true;
        this.resendActiveMail = false;
        if (!this.model.username || !this.model.password) {
          this.loading = false;
          this.setCustomeResponse("ERROR", this.properties.EMPTY_CREDENTIAL_ERROR);
        } else {
          this.model.username = this.model.username.replace(/\s/g, '');
          this.model.password = this.model.password.replace(/\s/g, '');
          const userName = this.model.username.toLowerCase();
          this.referenceService.userName = userName;
          if (this.authenticationService.vanityURLEnabled && this.authenticationService.companyProfileName != undefined) {
            this.vanityURLService.checkUserWithCompanyProfile(this.authenticationService.companyProfileName, userName).subscribe(result => {
              if (result.message === "success") {
                this.loginWithUser(userName);
              } else {
                this.loading = false;
                this.setCustomeResponse("ERROR", this.properties.VANITY_URL_ERROR1);
              }
            });
          }
          else {
            this.loginWithUser(userName);
          }
        }
      }



    } catch (error) { console.log('error' + error); }
  }


  loginWithUser(userName: string) {
    const authorization = 'Basic ' + btoa('my-trusted-client:');
    const body = 'username=' + userName + '&password=' + this.model.password + '&grant_type=password';
    this.authenticationService.login(authorization, body, userName).subscribe(result => {
      if (localStorage.getItem('currentUser')) {
        // if user is coming from login
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.xtremandLogger.log(currentUser);
        this.xtremandLogger.log(currentUser.hasCompany);
        localStorage.removeItem('isLogout');
        this.redirectTo(currentUser);
        // if user is coming from any link
        // if (this.authenticationService.redirectUrl) {
        //     this.router.navigate([this.authenticationService.redirectUrl]);
        //     this.authenticationService.redirectUrl = null;
        // }          

      } else {
        this.loading = false;
        this.setCustomeResponse("ERROR", this.properties.BAD_CREDENTIAL_ERROR);
      }
    },
      (error: any) => {
        try {
          this.loading = false;
          const body = error['_body'];
          if (body !== "") {
            const response = JSON.parse(body);
            if (response.error_description === "Bad credentials" || response.error_description === "Username/password are wrong") {
              this.setCustomeResponse("ERROR", this.properties.BAD_CREDENTIAL_ERROR);
            } else if (response.error_description === "User is disabled") {
              //this.resendActiveMail = true;
              // this.customResponse =  new CustomResponse();
              this.setCustomeResponse("ERROR", this.properties.USER_ACCOUNT_ACTIVATION_ERROR_NEW);
            } else if (response.error_description === this.properties.OTHER_EMAIL_ISSUE) {
              this.setCustomeResponse("ERROR", this.properties.BAD_CREDENTIAL_ERROR);
            } else if (response.error_description === this.properties.ERROR_EMAIL_ADDRESS) {
              this.setCustomeResponse("ERROR", this.properties.WRONG_EMAIL_ADDRESS);
            }
          }
          else {
            this.resendActiveMail = false;
            this.setCustomeResponse("ERROR", error);
            this.xtremandLogger.error("error:" + error)
          }
        } catch (err) {
          if (error.status === 0) { this.setCustomeResponse("ERROR", 'Error Disconnected! Service unavailable, Please check you internet connection'); }
        }
      });
    return false;
  }


  redirectTo(user: User) {
    this.loading = false;
    const roles = user.roles;

    if (this.authenticationService.isSuperAdmin()) {
      this.router.navigate(['/home/dashboard/admin-report']);
    } else if (user.hasCompany || roles.length === 1) {
      this.router.navigate([this.referenceService.homeRouter]);
    } else {
      this.router.navigate(['/home/dashboard/add-company-profile']);
    }
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.login(); } }
  setCustomeResponse(responseType: string, responseMessage: string) {
    this.customResponse = new CustomResponse(responseType, responseMessage, true);
    this.xtremandLogger.error(responseMessage);
  }
  resendActivation() {
    try {
      this.userService.resendActivationMail(this.model.username).subscribe(result => {
        if (result === 'resend Activation email success') {
          this.resendActiveMail = false;
          this.setCustomeResponse('SUCCESS', this.properties.RESEND_ACTIVATION_MAIL);
        }
      },
        (error: any) => {
          this.xtremandLogger.error(error);
        }
      )
    } catch (error) { console.log('error' + error); }
  }

  cleaningLeftSidebar() {
    const module = this.authenticationService.module;
    module.isOrgAdmin = false;
    this.authenticationService.isShowContact = false;
    module.isContact = false;
    module.isPartner = false;
    module.isEmailTemplate = false;
    module.isCampaign = false;
    module.isStats = false;
    module.isVideo = false;
    module.hasVideoRole = false;
    module.isCompanyPartner = false;
    module.hasSocialStatusRole = false;
    module.isVendor = false;
    module.isAddingPartnersAccess = false;
    this.authenticationService.isAddedByVendor = false;
    this.authenticationService.isPartnerTeamMember = false;
    this.authenticationService.loggedInUserRole = "";
    this.authenticationService.hasOnlyPartnerRole = false;
    module.isOnlyPartner = false;
    module.isReDistribution = false;
    this.authenticationService.isShowRedistribution = false;
  }

  ngOnInit() {
    try {
      this.mainLoader = true;
      if (this.vanityURLService.isVanityURLEnabled()) {
        this.vanityURLService.getVanityURLDetails(this.authenticationService.companyProfileName).subscribe(result => {         
          this.vanityURLEnabled = result.enableVanityURL;
          if(!this.vanityURLEnabled){
            this.checkedVanityURLDomain = true;
          }
          this.authenticationService.v_companyName = result.companyName;
          this.authenticationService.vanityURLink = result.vanityURLink;
          this.authenticationService.v_showCompanyLogo = result.showVendorCompanyLogo;
          this.authenticationService.v_companyLogoImagePath = this.authenticationService.MEDIA_URL + result.companyLogoImagePath;
          if (result.companyBgImagePath) {
            this.authenticationService.v_companyBgImagePath = this.authenticationService.MEDIA_URL + result.companyBgImagePath;
          } else {
            this.authenticationService.v_companyBgImagePath = "assets/images/stratapps.jpeg";
          }
          this.authenticationService.v_companyFavIconPath = result.companyFavIconPath;
          this.authenticationService.loginScreenDirection = result.loginScreenDirection;
          this.vanityURLService.setVanityURLTitleAndFavIcon();
        }, error => {
          console.log(error);
        });
      } else {
        this.isNotVanityURL = true;        
      }
      this.cleaningLeftSidebar();
      this.authenticationService.navigateToDashboardIfUserExists();
      setTimeout(() => { this.mainLoader = false; }, 900);
    } catch (error) { this.xtremandLogger.error('error' + error) }
  }
  ngOnDestroy() {
    this.referenceService.userProviderMessage = '';
    this.resendActiveMail = false;
    $('#org-admin-deactivated').hide();
  }

  loginUsingSocialAccounts(socialProvider: any) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser != undefined) {
      this.setCustomeResponse("ERROR", "Another user is already logged in on this browser.");
    } else {
      let loginUrl = "/" + socialProvider.name + "/login";
      if (this.isLoggedInVanityUrl) {
        let x = screen.width / 2 - 700 / 2;
        let y = screen.height / 2 - 450 / 2;
        window.open(loginUrl, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes,top=" + y + ",left=" + x + ",width=700,height=485");
      } else {
        this.router.navigate([loginUrl]);
      }


    }
  }

  redirectToXamplify(){    
    window.open("https://xamplify.co/login");
  }
}
