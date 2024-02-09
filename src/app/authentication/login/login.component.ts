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
import { EnvService } from 'app/env.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  vanitySocialProviders = [];
  isStyleOne:boolean = false;
  loginStyleId:number;
  /*** XNFR-416 ***/
  isBgColor:boolean;
  constructor(public envService:EnvService,private router: Router, public authenticationService: AuthenticationService, public userService: UserService,
    public referenceService: ReferenceService, private xtremandLogger: XtremandLogger, public properties: Properties, private vanityURLService: VanityURLService, public sanitizer: DomSanitizer) {
      this.SERVER_URL = this.envService.SERVER_URL;
      this.APP_URL = this.envService.CLIENT_URL;
      this.isLoggedInVanityUrl = this.vanityURLService.isVanityURLEnabled();
      this.loginStyleId = 53;
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
    "https://xamplify.co/"==envService.CLIENT_URL && !this.authenticationService.vanityURLEnabled ? this.signInText = "Sign In to Sandbox" :this.signInText = "Sign In";
  }

  public login() {
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
    this.resendActiveMail = false;
    this.resendAccountSignUpMail = false;
    if(userName!=undefined && userName!="undefined"){
      const authorization = 'Basic ' + btoa('my-trusted-client:');
      const body = new URLSearchParams();
        body.set('username', userName);
        body.set('password',  this.model.password);
        body.set('grant_type', 'password');
      this.authenticationService.login(authorization, body.toString(), userName).subscribe(result => {
        if (localStorage.getItem('currentUser')) {
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          localStorage.removeItem('isLogout');
          this.redirectTo(currentUser);
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
                this.setCustomeResponse("ERROR", errorDescription);
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
    }else{
      this.loading = false;
    }
    return false;
  }


  redirectTo(user: User) {
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
          this.getActiveLoginTemplate(this.authenticationService.companyProfileName);
          this.vanityURLService.getVanityURLDetails(this.authenticationService.companyProfileName).subscribe(result => {         
            this.vanityURLEnabled = result.enableVanityURL;  
            this.authenticationService.vendorCompanyId = result.companyId;     
            this.authenticationService.v_companyName = result.companyName;
            this.authenticationService.vanityURLink = result.vanityURLink;
            this.authenticationService.loginType = result.loginType;
            this.authenticationService.isstyleTWoBgColor = result.styleTwoBgColor;
            this.isBgColor = result.styleOneBgColor;
            let path = "https://xamplify.io/assets/images/stratapps.jpeg";
            if(result.loginType === "STYLE_ONE"){
              this.isStyleOne = true;
              this.authenticationService.loginScreenDirection = result.loginFormDirectionStyleOne;
              if(result.styleOneBgColor) {
              document.documentElement.style.setProperty('--login-bg-color-style1', result.backgroundColorStyle1);
              } else {
                //document.documentElement.style.setProperty('--login-bg-color-style1', 'none');
                if(result.companyBgImagePath != null && result.companyBgImagePath != "") {
                document.documentElement.style.setProperty('--login-bg-image-style1', 'url('+this.authenticationService.MEDIA_URL+ result.companyBgImagePath+')');
                } else {
                  document.documentElement.style.setProperty('--login-bg-image-style1', 'url('+path+')');
                }
              }
            } else {
              this.isStyleOne = false;
              this.authenticationService.loginScreenDirection = result.loginScreenDirection;
              if(result.styleTwoBgColor) {
              document.documentElement.style.setProperty('--login-bg-color', result.backgroundColorStyle2);
              } else {
                //document.documentElement.style.setProperty('--login-bg-color', 'none');
                if(result.backgroundLogoStyle2 != null && result.backgroundLogoStyle2 != "") {
                  document.documentElement.style.setProperty('--login-bg-image', 'url('+this.authenticationService.MEDIA_URL+ result.backgroundLogoStyle2+')');
                } else {
                document.documentElement.style.setProperty('--login-bg-image', 'url('+path+')');
                }
              }
            }
            if(result.companyBgImagePath) {
              this.bgIMage2 = this.authenticationService.MEDIA_URL+ result.companyBgImagePath;
            } else {
              this.bgIMage2 = 'https://xamplify.io/assets/images/stratapps.jpeg';
            }
            if(!this.vanityURLEnabled){
              this.router.navigate( ['/vanity-domain-error'] );
              return;
            }
            this.authenticationService.v_showCompanyLogo = result.showVendorCompanyLogo;
            this.authenticationService.v_companyLogoImagePath = this.authenticationService.MEDIA_URL + result.companyLogoImagePath;
            if (result.companyBgImagePath && result.backgroundLogoStyle2) {
              this.authenticationService.v_companyBgImagePath2 = this.authenticationService.MEDIA_URL + result.backgroundLogoStyle2;
              this.authenticationService.v_companyBgImagePath = this.authenticationService.MEDIA_URL + result.companyBgImagePath;
            } else if(result.companyBgImagePath){
              this.authenticationService.v_companyBgImagePath = this.authenticationService.MEDIA_URL + result.companyBgImagePath;
            } else if(result.backgroundLogoStyle2) {
              this.authenticationService.v_companyBgImagePath2 = this.authenticationService.MEDIA_URL + result.backgroundLogoStyle2;
            }else {
              this.authenticationService.v_companyBgImagePath = "assets/images/stratapps.jpeg";
            }
            this.authenticationService.v_companyFavIconPath = result.companyFavIconPath;
            this.vanityURLService.setVanityURLTitleAndFavIcon();
            if (result.showMicrosoftSSO) {
              this.vanitySocialProviders.push({ "name": "Microsoft", "iconName": "microsoft", "value": "microsoft" });
            }
          }, error => {
            console.log(error);
          });
          let self = this;
          window.addEventListener('message', function (e) {
            console.log('received message:  ' + e.data, e);
            self.loginAfterSSOCallbackInVanity(e.data);
          }, false);
        } else {
          this.isNotVanityURL = true;        
        }
        this.cleaningLeftSidebar();
        this.authenticationService.navigateToDashboardIfUserExists();
        setTimeout(() => { this.mainLoader = false; }, 900);
      }
      
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
      let socialProviderName = socialProvider.name.toLowerCase()
      if (socialProviderName === "microsoft") {
        socialProviderName = "microsoftsso"
      }
      let loginUrl = "/" + socialProviderName + "/login";
      if (this.isLoggedInVanityUrl) {
        let loginUrl = this.authenticationService.APP_URL+"v/"+socialProviderName+"/"+window.location.hostname;
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

  loginAfterSSOCallbackInVanity(data: any) {
    this.loading = true;
    this.referenceService.userName = data.emailId;
    let providerName = data.providerName;
    let client_id: string;
    let client_secret: string;
    if (providerName === "salesforce") {
      client_id = "3MVG9ZL0ppGP5UrD8Ne7RAUL7u6QpApHOZv3EY_qRFttg9c1L2GtSyEqiM8yU8tT3kolxyXZ7FOZfp1V_xQ4l";
      client_secret = "8542957351694434668";
    } else if (providerName === "google") {
      client_id = "1026586663522-tv2c457u9h9bj4ikc47u29g321dkjg6m.apps.googleusercontent.com";
      client_secret = "yKAddi6F_xkiERVCnWna3bXT";
    } else if (providerName === "facebook") {
      client_id = "1348853938538956";
      client_secret = "69202865ccc82e3cf43a5aa097c4e7bf";
    } else if (providerName === "twitter") {
      client_id = "J60F2OG6jZOEK33xK3MtiU4zI";
      client_secret = "d3xQ5hPlPZtQdeMkNAjlejXFvwRrPSalwbpyApncxi49Pf4lFi";
    } else if (providerName === "linkedin") {
      client_id = "81ujzv3pcekn3t";
      client_secret = "bfdJ4u0j6izlWSyd";
    } else if (providerName === "microsoftsso") {
      if(this.SERVER_URL=="https://xamp.io/" && this.APP_URL=="https://xamplify.io/"){
        console.log("production keys are used");        
        client_id = this.envService.microsoftProdClientId;
        client_secret = this.envService.microsoftProdClientSecret;
      }else if(this.SERVER_URL=="https://aravindu.com/" && this.APP_URL=="https://xamplify.co/"){
        console.log("QA keys are used");
        client_id = this.envService.microsoftQAClientId;
        client_secret = this.envService.microsoftQAClientSecret;
      }else{
        console.log("dev keys are used");
        client_id = this.envService.microsoftDevClientId;
        client_secret = this.envService.microsoftDevClientSecret;
      }
    }

    if (this.authenticationService.vanityURLEnabled && this.authenticationService.companyProfileName != undefined) {
      this.vanityURLService.checkUserWithCompanyProfile(this.authenticationService.companyProfileName, this.referenceService.userName).subscribe(result => {
        if (result.message === "success") {
          this.loginSSOUser(this.referenceService.userName, client_id, client_secret);
        } else {
          this.loading = false;
          this.setCustomeResponse("ERROR", this.properties.VANITY_URL_ERROR1);
        }
      });
    }
    else {
      this.loginSSOUser(this.referenceService.userName, client_id, client_secret);
    }    
  }

  loginSSOUser(userName: string, client_id: string, client_secret: string) {
   if(userName!=undefined && userName!="undefined"){
    const authorization = 'Basic' + btoa(client_id + ':');
    const body = 'client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=client_credentials';
    
    this.authenticationService.login(authorization, body, userName)
      .subscribe(result => {
        if (this.authenticationService.user) {
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          if (currentUser.hasCompany) {
            this.router.navigate(['/home/dashboard/default']);
          } else {
            this.router.navigate(['/home/dashboard/add-company-profile']);
          }
        } else {
          this.router.navigate(['/logout']);
        }
      },
        error => {
          console.log(error);
          this.loading = false;
        },
        () => console.log('login() Complete'));
   }else{
    this.loading = false;
   }
        return false;
  }

  clearErrorMessage(){
   this.customResponse = new CustomResponse();
    this.resendAccountSignUpMail = false;
    this.resendActiveMail = false;
  }


  
  createdUserId:any;
  getActiveLoginTemplate(companyProfileName:any){
      this.vanityURLService.getActiveLoginTemplate(companyProfileName)
      .subscribe(
        data => {
         this.loginStyleId = data.data.templateId
         this.authenticationService.lognTemplateId = this.loginStyleId;
         this.createdUserId = data.data.createdBy;
         this.previewTemplate(this.loginStyleId,this.createdUserId)
        })  
  }
  htmlContent:any;
  previewTemplate(id: number,createdBy:number) {
    $(this.htmlContent).empty();
    this.vanityURLService.getLogInTemplateById(id, createdBy).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(response.data.htmlBody);
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true)
        }
      }
    )
  }
  /****** XNFR-233 ************/
}
