import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UserService } from '../../core/services/user.service';

import { User } from '../../core/models/user';
import { Role } from '../../core/models/role';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { EnvService } from 'app/env.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ThrowStmt } from '@angular/compiler';

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
  resendAccountSignUpMail = false;
  mainLoader: boolean;
  socialProviders = [{ "name": "Salesforce", "iconName": "salesforce", "value": "salesforce" },
  { "name": "Facebook", "iconName": "facebook", "value": "facebook" },
  { "name": "twitter", "iconName": "twitter", "value": "twitter" },
  { "name": "google", "iconName": "googleplus", "value": "googleplus" },
  { "name": "Linkedin", "iconName": "linkedin", "value": "linkedin" }];

  roles: Array<Role>;
  vanityURLEnabled: boolean;
  isNotVanityURL: boolean;
  isLoggedInVanityUrl = false;
  signInText = "Sign In";

  //xnfr-256
  SERVER_URL: any;
  APP_URL: any;
  vanitySSOProviderList = [];
  isStyleOne:boolean = false;
  loginStyleId:number;
  /*** XNFR-416 ***/
  isBgColor:boolean;
  teamMemberSignedUpResponse:CustomResponse = new CustomResponse();
  isPleaseWaitButtonDisplayed = false;
  orLoginWithText: boolean = false;
  vendorSSOProvider: { name: string; iconName: string; value: string; };
  showVendorSSO: boolean;
  showLoginWithCredentials: boolean = false;
  hideCloseButton: boolean = false;
  /** XNFR-721 **/
  vanityMicrosoftSSOProvider: any;
  returnUrl: string = '/';

  messageKeys = {
    ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  };
  messageMap: { [key: string]: string } = {
    [this.messageKeys.ACCOUNT_SUSPENDED]: 'This account has been suspended.',
  };
  
  constructor(public envService:EnvService,private router: Router, public authenticationService: AuthenticationService, public userService: UserService,
    public referenceService: ReferenceService, private xtremandLogger: XtremandLogger, public properties: Properties, private vanityURLService: VanityURLService, public sanitizer: DomSanitizer,
    private route: ActivatedRoute) {
      this.SERVER_URL = this.envService.SERVER_URL;
      this.APP_URL = this.envService.CLIENT_URL;
      this.isLoggedInVanityUrl = this.vanityURLService.isVanityURLEnabled();
      this.loginStyleId = 53;
      this.isPleaseWaitButtonDisplayed = false;
    if(this.referenceService.teamMemberSignedUpSuccessfullyMessage!=""){
      this.teamMemberSignedUpResponse = new CustomResponse('SUCCESS',this.referenceService.teamMemberSignedUpSuccessfullyMessage,true);
    }
    if (this.referenceService.userProviderMessage !== "") {
      this.setCustomeResponse("SUCCESS", this.referenceService.userProviderMessage);
    }
    let sessionExpiredMessage = this.authenticationService.sessinExpriedMessage;
    if (sessionExpiredMessage != "" && this.referenceService.userProviderMessage !== "") {
      this.setCustomeResponse("ERROR", sessionExpiredMessage);
    }
    let serverStoppedMessage = this.authenticationService.serviceStoppedMessage;
    if (serverStoppedMessage != "") {
      this.setCustomeResponse("ERROR", serverStoppedMessage);
    }
    
    if (this.authenticationService.showVanityURLError1) {
      this.authenticationService.showVanityURLError1 = false;
    }
    this.signInText = "Sign In";
    this.route.queryParams.subscribe(params => {
  if (params['returnUrl']) {
    this.returnUrl = decodeURIComponent(params['returnUrl']);
    localStorage.setItem('returnUrl', this.returnUrl); // persist in storage too
  } else {
    this.returnUrl = localStorage.getItem('returnUrl') || '/';
  }
});

  }

  public login() {
    this.teamMemberSignedUpResponse = new CustomResponse();
    this.authenticationService.reloadLoginPage = false;
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser != undefined) {
        this.setCustomeResponse("ERROR", "Another user is already logged in on this browser.");
      } else {
        this.authenticationService.sessinExpriedMessage = "";
        this.authenticationService.serviceStoppedMessage = "";
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
            this.isPleaseWaitButtonDisplayed = true;
            this.loginWithUser(userName);
          }
          else {
            this.loginWithUser(userName);
          }
        }
      }



    } catch (error) { console.log('error' + error); }
  }


  loginWithUser(userName: string) {
    this.resendActiveMail = false;
    this.resendAccountSignUpMail = false;
    if(userName!=undefined && userName!="undefined"){
      const authorization = 'Basic ' + btoa('xAmplify-prm-client:');
      const body = new URLSearchParams();
      body.set('username', userName);
      body.set('password',  this.model.password);
      body.set('grant_type', 'password');
      if(this.isLoggedInVanityUrl){
        this.isPleaseWaitButtonDisplayed = true;
      }
      this.authenticationService.login(authorization, body.toString(), userName).subscribe(result => {
        if (localStorage.getItem('currentUser')) {
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          localStorage.removeItem('isLogout');
          if (currentUser.userStatusCode === 400 && !this.authenticationService.vanityURLEnabled) {
            localStorage.removeItem('currentUser');
            this.loading = false;
            this.isPleaseWaitButtonDisplayed = false;
            this.customResponse = new CustomResponse('ERROR', `You are not authorized to log in. Please contact <a href="mailto:${'support@xampliy.com'}">${'support@xampliy.com'}</a>.`, true);
          } else {
            this.redirectTo(currentUser);
          }
        } else {
          this.loading = false;
          this.isPleaseWaitButtonDisplayed = false;
          this.setCustomeResponse("ERROR", this.properties.BAD_CREDENTIAL_ERROR);
        }
      },
        (error: any) => {
          try {
            this.loading = false;
            this.isPleaseWaitButtonDisplayed = false;
            const body = error['_body'];
            if (body !== "") {
              const response = JSON.parse(body);
              let errorDescription = response.error_description;
              if (errorDescription === "Bad credentials" || errorDescription === "Username/password are wrong") {
                this.setCustomeResponse("ERROR", this.properties.BAD_CREDENTIAL_ERROR);
              } else if (errorDescription === "User is disabled") {
                this.setCustomeResponse("ERROR", this.properties.USER_ACCOUNT_ACTIVATION_ERROR);
              } else if (errorDescription === this.properties.OTHER_EMAIL_ISSUE) {
                this.setCustomeResponse("ERROR", this.properties.BAD_CREDENTIAL_ERROR);
              } else if (errorDescription === this.properties.ERROR_EMAIL_ADDRESS) {
                this.setCustomeResponse("ERROR", this.properties.WRONG_EMAIL_ADDRESS);
              }else if(errorDescription===this.properties.ACCOUNT_NOT_CREATED){
                this.resendAccountSignUpMail = true;
                this.setCustomeResponse("ERROR", errorDescription);
              }else if(errorDescription==this.properties.USER_ACCOUNT_ACTIVATION_ERROR){
                this.resendActiveMail = true;
                this.setCustomeResponse("ERROR", errorDescription);
              }else if(errorDescription==this.properties.ACCOUNT_SUSPENDED){
                this.showCustomResponseWithSupportEmailId("ERROR", errorDescription, this.messageKeys.ACCOUNT_SUSPENDED);
              }
            }
            else {
              this.resendActiveMail = false;
              this.setCustomeResponse("ERROR", error);
              this.xtremandLogger.error("error:" + error)
            }
          } catch (err) {
            if (error.status === 0) {
               this.isPleaseWaitButtonDisplayed = false;
               this.setCustomeResponse("ERROR", 'Error Disconnected! Service unavailable, Please check you internet connection');
             }
          }
        });
    }else{
      this.isPleaseWaitButtonDisplayed = false;
      this.loading = false;
    }
    return false;
  }


  redirectTo(user: User) {
    this.authenticationService.module.isPaymentOverDueModalPopUpDisplayed = true;
    if (this.returnUrl && this.returnUrl !== '/') {
      localStorage.removeItem('returnUrl'); // clean up
      this.router.navigateByUrl(this.returnUrl);
      return;
    }
    const roles = user.roles;
    if (this.authenticationService.isSuperAdmin()) {
      this.router.navigate(['/home/dashboard/admin-report']);
    } else if (user.hasCompany || roles.length === 1) {
      if(this.vanityURLService.isVanityURLEnabled() && user.isWelcomePageEnabled){
        this.referenceService.isWelcomePageLoading = true;
        this.referenceService.isFromLogin = true;
        $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/welcome-page.css' type='text/css'>");
        $("#xamplify-index-head").append( "<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>");
        $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-font-family.css' type='text/css'>");
        this.router.navigate(['/welcome-page']);
      }else{
        this.router.navigate([this.referenceService.homeRouter]);
      }
    } else {
      this.router.navigate(['/home/dashboard/add-company-profile']);
    }
  }


  eventHandler(keyCode: any) { if (keyCode === 13) { this.login(); } }
  setCustomeResponse(responseType: string, responseMessage: string) {
    this.customResponse = new CustomResponse(responseType, responseMessage, true);
  }
  resendActivation() {
    this.customResponse = new CustomResponse();
    this.loading = true;
    this.userService.resendActivationMail(this.model.username).subscribe(result => {
      this.loading = false;
      this.resendActiveMail = false;
      if (result.statusCode==200) {
        this.setCustomeResponse('SUCCESS', this.properties.RESEND_ACTIVATION_MAIL);
      }else{
        this.setCustomeResponse('ERROR', result.message);
      }
    },
      (error: any) => {
        this.xtremandLogger.error(error);
      }
    );
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
  	module.isVendorTier = false;
    module.isMarketing = false;
    module.isPrm = false;
    module.isPrmTeamMember = false;
    module.isPrmAndPartner = false;
    module.isPrmAndPartnerTeamMember = false;
    module.isVendorTierTeamMember = false;
    module.isVendorTierAndPartner = false;
    module.isVendorTierAndPartnerTeamMember = false;
    module.isAddingPartnersAccess = false;
	  module.damAccessAsPartner = false;
    module.damAccess = false;
    module.lmsAccess = false;
    module.lmsAccessAsPartner = false;
    module.playbookAccess = false;
    module.playbookAccessAsPartner = false;
    module.hasPartnerLandingPageAccess = false;
    module.showContent = false;
    module.contentLoader = false;
    module.isAnyAdminOrSupervisor = false;
    this.authenticationService.isAddedByVendor = false;
    this.authenticationService.isPartnerTeamMember = false;
    this.authenticationService.loggedInUserRole = "";
    this.authenticationService.hasOnlyPartnerRole = false;
    module.isOnlyPartner = false;
    module.isReDistribution = false;
    module.contentDivsCount = 0;
    this.authenticationService.isShowRedistribution = false;
    this.authenticationService.partnershipEstablishedOnlyWithPrmAndLoggedInAsPartner = false;
    this.authenticationService.partnershipEstablishedOnlyWithPrm = false;
    this.authenticationService.lmsAccess = false;
    this.authenticationService.mdf = false;
    this.authenticationService.leadsAndDeals = false;
	  this.authenticationService.isVendorAndPartnerTeamMember = false;
    this.authenticationService.isOrgAdminAndPartnerTeamMember = false;
    module.allBoundSamlSettings = false;
  }
bgIMage2:any;
  ngOnInit() {
    try {
      this.mainLoader = true;
      if(this.authenticationService.reloadLoginPage){
        this.authenticationService.reloadLoginPage = false;
        location.reload();
      }else{
        if (this.vanityURLService.isVanityURLEnabled()) {
           this.vanityURLEnabled = true;
           this.authenticationService.companyProfileName = this.envService.domainName;
           this.authenticationService.v_companyName = "xAmplify";
           this.vanityURLService.setVanityURLTitleAndFavIcon();   
           this.authenticationService.v_companyBgImagePath = "assets/images/xAmplify-sandbox.png";
           this.authenticationService.v_companyBgImagePath2 = "assets/images/xAmplify-sandbox.png";
        } 
        this.cleaningLeftSidebar();
        this.authenticationService.navigateToDashboardIfUserExists();
        setTimeout(() => { this.mainLoader = false; }, 900);
      }

    } catch (error) { this.xtremandLogger.error('error' + error) }
  }
  ngOnDestroy() {
    this.referenceService.userProviderMessage = '';
    this.referenceService.teamMemberSignedUpSuccessfullyMessage = "";
    this.resendActiveMail = false;
    $('#org-admin-deactivated').hide();
  }


  redirectToXamplify(){
   
  }


  clearErrorMessage(){
   this.customResponse = new CustomResponse();
    this.resendAccountSignUpMail = false;
    this.resendActiveMail = false;
  }



  createdUserId:any;

  htmlContent:any;
  htmlString:any;

  /****** XNFR-233 ************/


  /** XNFR-658 **/
  showLoginWithCredentialsForm() {
    this.showLoginWithCredentials = true;
    this.hideCloseButton = true;
  }

  closeLoginWithCredentialsForm() {
    this.hideCloseButton = false;
    this.customResponse.isVisible = false;
    this.showLoginWithCredentials = false;
  }

  /** XNFR-618  **/
  showCustomResponseWithSupportEmailId(responseType: string, defaultMessage: string, type: string) {
    let companyProfileName = this.authenticationService.companyProfileName;
    if (this.referenceService.checkIsValidString(companyProfileName)) {
      this.loading = true;
      this.vanityURLService.getSupportEmailIdByCompanyProfileName(companyProfileName).subscribe(
        response => {
          if (response.statusCode === 200) {
            const supportEmailId = response.data;
            const prefixMessage = this.messageMap[type];
            const errorMessage = this.constructErrorMessage(supportEmailId, prefixMessage, defaultMessage);
            this.setCustomeResponse(responseType, errorMessage);
          } else {
            this.setCustomeResponse(responseType, defaultMessage);
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.setCustomeResponse(responseType, defaultMessage);
        });
    } else {
      this.setCustomeResponse(responseType, defaultMessage);
    }
  }

  private constructErrorMessage(supportEmailId: string, prefixMessage: string, defaultMessage: string) {
    if (this.referenceService.checkIsValidString(supportEmailId) && this.referenceService.checkIsValidString(prefixMessage)) {
      return `${prefixMessage} Please contact <a href="mailto:${supportEmailId}">${supportEmailId}</a>`;
    }
    return defaultMessage;
  }
  
}
