import { Component, OnInit } from '@angular/core';
import { CustomResponse } from '../models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { EnvService } from 'app/env.service';

declare const $: any;
@Component({
  selector: 'app-preview-login',
  templateUrl: './preview-login.component.html',
  styleUrls: ['./preview-login.component.css']
})
export class PreviewLoginComponent implements OnInit {
  mainLoader: boolean;
  //customResponse: CustomResponse = new CustomResponse();
  loading = false;
  isStyleOne:boolean = false;
  isBgColor:boolean;
  vanityURLEnabled: boolean;
  isNotVanityURL: boolean;
  isLoggedInVanityUrl = false;  
  signInText = "Sign In";
  htmlContent:any;
  loginStyleId:number;
  bgIMage2:any;
  isStyleTwoBgColor:boolean;
  vanitySocialProviders = [];
  model: any = {};
  socialProviders = [{ "name": "Salesforce", "iconName": "salesforce", "value": "salesforce" },
  { "name": "Facebook", "iconName": "facebook", "value": "facebook" },
  { "name": "twitter", "iconName": "twitter", "value": "twitter" },
  { "name": "google", "iconName": "googleplus", "value": "googleplus" },
  { "name": "Linkedin", "iconName": "linkedin", "value": "linkedin" }];
  createdUserId:any;
  SERVER_URL: any;
  APP_URL: any;
  constructor(public authenticationService: AuthenticationService, private vanityURLService: VanityURLService,
    private router: Router, public sanitizer: DomSanitizer,public referenceService: ReferenceService,
    private xtremandLogger: XtremandLogger, public envService:EnvService) {
    // this.SERVER_URL = this.envService.SERVER_URL;
    // this.APP_URL = this.envService.CLIENT_URL;
     this.isLoggedInVanityUrl = this.vanityURLService.isVanityURLEnabled();
   }
  isVanityURLEnabled() {
    let url = window.location.hostname;
     let isLocalHost = this.envService.SERVER_URL.indexOf('localhost')>-1 && 
     this.envService.CLIENT_URL.indexOf('localhost')>-1;
     if(isLocalHost){
       let domainName = this.envService.domainName;
       this.authenticationService.companyProfileName = domainName;
       if(domainName!="" && domainName!=window.location.hostname){
         url = this.envService.domainName+".xamplify.com";
       }
     }
     if (!url.includes("192.168") && !url.includes("172.16")) {
       let domainName = url.split('.');
       if (domainName.length > 2) {
         this.authenticationService.vanityURLEnabled = true;
         this.authenticationService.companyProfileName = domainName[0];
         this.authenticationService.setDomainUrl();
         if (!this.authenticationService.vanityURLUserRoles) {
           let currentUser = localStorage.getItem('currentUser');
           if (currentUser) {
             const parsedObject = JSON.parse(currentUser);
             this.authenticationService.vanityURLUserRoles = parsedObject.roles;
           }
         }
         return true;
       }
     }
   }
  ngOnInit() {
    this.isVanityURLEnabled();
    this.getActiveLoginTemplate(this.authenticationService.companyProfileName);
    this.vanityUrlDetails(this.authenticationService.companyProfileName);
  }
  vanityUrlDetails(companyProfile:any){
  this.vanityURLService.getVanityURLDetails(this.authenticationService.companyProfileName).subscribe(result => {         
    this.vanityURLEnabled = result.enableVanityURL;  
    this.authenticationService.loginType = result.loginType;
    this.isStyleTwoBgColor = result.styleTwoBgColor;
    this.authenticationService.isstyleTWoBgColor = result.styleTwoBgColor;
    this.authenticationService.v_companyLogoImagePath = result.companyLogoImagePath;
    this.authenticationService.companyUrl = result.companyUrl;
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
    //this.authenticationService.loginScreenDirection = result.loginScreenDirection;
    this.vanityURLService.setVanityURLTitleAndFavIcon();
    if (result.showMicrosoftSSO) {
      this.vanitySocialProviders.push({ "name": "Microsoft", "iconName": "microsoft", "value": "microsoft" });
    }
  }, error => {
    console.log(error);
  });
}
  getActiveLoginTemplate(companyProfileName:any){
      this.vanityURLService.getActiveLoginTemplate(companyProfileName)
      .subscribe(
        data => {
         this.loginStyleId = data.data.templateId
         this.authenticationService.lognTemplateId = this.loginStyleId;
         this.createdUserId = data.data.createdBy;
         this.previewTemplate(this.loginStyleId,this.createdUserId)
        })  
        //this.previewTemplate(this.loginStyleId,this.createdUserId)
  }
 htmlString:any;
  previewTemplate(id: number,createdBy:number) {
    $(this.htmlContent).empty();
    this.vanityURLService.getLogInTemplateById(id, createdBy).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.htmlString = this.vanityURLService.sanitizeHtmlWithImportant(response.data.htmlBody)
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.htmlString);
        } else {
          //this.customResponse = new CustomResponse('ERROR', response.message, true)
        }
      }
    )
  }

}
