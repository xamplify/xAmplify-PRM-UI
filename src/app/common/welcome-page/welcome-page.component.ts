import { AfterViewInit, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { CompanyThemeActivate } from 'app/dashboard/models/company-theme-activate';
import { ThemeDto } from 'app/dashboard/models/theme-dto';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
declare var $:any;
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css'],
  //encapsulation:ViewEncapsulation.Emulated,
})
export class WelcomePageComponent implements OnInit, AfterViewInit {

  @Input() model = { 'displayName': '', 'profilePicutrePath': 'assets/images/icon-user-default.png' };
  loader: boolean = false;
  activeThemeDetails: CompanyThemeActivate = new CompanyThemeActivate();
  activeThemeDto: ThemeDto = new ThemeDto();
  loggedInUserId: number;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  displayPage:boolean =false;
  htmlContent:any;
  htmlString:any;
 
  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService, private router: Router, public dashBoardService: DashboardService, public xtremandLogger: XtremandLogger,
    public landingPageService:LandingPageService,private vanityURLService: VanityURLService, public sanitizer: DomSanitizer,
  ) {
    if (this.vanityURLService.isVanityURLEnabled()) {
      this.vanityURLService.checkVanityURLDetails();
    }
    this.loggedInUserId = this.authenticationService.getUserId();
    this.vanityLoginDto.userId = this.loggedInUserId;
    
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
    } else {
      this.vanityLoginDto.vanityUrlFilter = false;
    }
  }
 
  ngOnInit() {
    console.log("asjkdkkd1")
    console.log(this.referenceService.isWelcomePageLoading)
    if(this.router.url.includes('/welcome-page')){
      console.log("asjkdkkd2")
      console.log(this.referenceService.isWelcomePageLoading)
        this.referenceService.clearHeadScriptFiles();
    }
    $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/welcome-page.css' type='text/css'>");
    $("#xamplify-index-head").append( "<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>");
    //this.getHtmlBodyAlias('z2yl1Spk')
    this.getActiveThemeData(this.vanityLoginDto);
  }
   
  ngAfterViewInit(){
    if(this.router.url.includes('/welcome-page')){
      this.referenceService.isWelcomePageLoading = false;
      this.getHtmlBodyAlias();
      this.displayPage = true;
      }  
  }

  getActiveThemeData(vanityLoginDto: VanityLoginDto) {
    this.loader = true;
    this.dashBoardService.getActiveTheme(vanityLoginDto).subscribe(
      (response) => {
        this.loader = false;
        this.activeThemeDetails = response.data;
        this.getThemeDtoByID(this.activeThemeDetails.themeId);
      },
      error => {
        this.loader = false;
        //this.statusCode = 500;
      }
    )
  }
  getThemeDtoByID(id: number) {
    this.loader = true;
    this.dashBoardService.getThemeDTOById(id).subscribe(
      (response) => {
        this.loader = false;
        this.activeThemeDto = response.data;
        this.authenticationService.themeDto = this.activeThemeDto;
        if (this.activeThemeDto.parentThemeName == 'GLASSMORPHISMLIGHT' || this.activeThemeDto.parentThemeName == 'GLASSMORPHISMDARK') {
          //this.getDefaultImagePath(this.activeThemeDto.parentThemeName,this.activeThemeDto.id);
        }
        this.getDefaultSkin(this.activeThemeDto);
        /******** For Charts *******/
        if (id == 2) {
          this.authenticationService.isDarkForCharts = true;
        }
        if (id == 4) {
          this.authenticationService.isDarkForCharts = true;
        }
      }, error => {
        this.loader = false;
        this.xtremandLogger.log(error);
      });
  }

  getDefaultSkin(activeThemeDto: ThemeDto) {
    //this.ngxloading = true;
    this.loader = true;
    this.dashBoardService.getPropertiesById(activeThemeDto.id)
      .subscribe(
        (response) => {
          this.loader = false;
          let skinMap = response.data;
          let topCustom = skinMap.TOP_NAVIGATION_BAR;
          let leftCustom = skinMap.LEFT_SIDE_MENU;
          let footerCustom = skinMap.FOOTER;
          let footerSkin = skinMap.FOOTER;
          let maincontentCustom = skinMap.MAIN_CONTENT;
          let buttonCustomizationForm = skinMap.BUTTON_CUSTOMIZE;
          if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Light") {
              $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/welcome-page.css' type='text/css'>");
          } else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Dark" && !this.router.url.includes('home/help')) {
            $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-dark.css' type='text/css'>");
          } else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Neumorphism Dark(Beta)" && !this.router.url.includes('home/help')) {
              $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-dark-customization.css' type='text/css'>");
          }
          else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Neumorphism Light" && !this.router.url.includes('home/help')) {
            this.authenticationService.isDarkForCharts = false;
            require("style-loader!../../../assets/admin/layout2/css/themes/neomorphism-light.css");
          }
          else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Glassomorphism Light" && !this.router.url.includes('home/help')) {
            this.authenticationService.isDarkForCharts = false;
            document.documentElement.style.setProperty('--body-background-image', 'url(' + activeThemeDto.backgroundImagePath + ')');
            require("style-loader!../../../assets/admin/layout2/css/themes/glassomorphism-light.css");
          }
          else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Glassomorphism Dark" && !this.router.url.includes('home/help')) {
            this.authenticationService.isDarkForCharts = true;
            document.documentElement.style.setProperty('--body-background-image', 'url(' + activeThemeDto.backgroundImagePath + ')');
            require("style-loader!../../../assets/admin/layout2/css/themes/glassomorphism-dark.css");

          }
          else if (!activeThemeDto.defaultTheme && activeThemeDto.companyId != 1 && !this.router.url.includes('home/help')) {
            if (activeThemeDto.parentThemeName == 'LIGHT' || activeThemeDto.parentThemeName == 'DARK') {
              document.documentElement.style.setProperty('--top-bg-color', topCustom.backgroundColor);
              document.documentElement.style.setProperty('--top-buton-color', topCustom.buttonColor);
              document.documentElement.style.setProperty('--top-button-border-color', topCustom.buttonBorderColor);
              document.documentElement.style.setProperty('--top-button-value-color', topCustom.buttonValueColor);
              document.documentElement.style.setProperty('--top-button-icon-color', topCustom.iconColor);
              $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-dark-customization.css' type='text/css'>");
              // document.documentElement.style.setProperty('--left-bg-color', leftCustom.backgroundColor);
              // document.documentElement.style.setProperty('--left-text-color', leftCustom.textColor);
              // document.documentElement.style.setProperty('--left-border-color', leftCustom.buttonBorderColor);
              // document.documentElement.style.setProperty('--left-icon-color', leftCustom.iconColor);
              // require("style-loader!../../../assets/admin/layout2/css/themes/custom-skin-left-side-bar.css");

              // document.documentElement.style.setProperty('--footer-bg-color', footerSkin.backgroundColor);
              // document.documentElement.style.setProperty('--footer-text-color', footerSkin.textColor);
              // document.documentElement.style.setProperty('--footer-border-color', footerSkin.buttonBorderColor);
              // require("style-loader!../../../assets/admin/layout2/css/themes/custom-skin-footer.css");
              document.documentElement.style.setProperty('--page-content', maincontentCustom.backgroundColor);
              document.documentElement.style.setProperty('--div-bg-color', maincontentCustom.divBgColor);
              document.documentElement.style.setProperty('--title-heading--text', maincontentCustom.textColor);
              document.documentElement.style.setProperty('--border-color', maincontentCustom.buttonBorderColor);
              document.documentElement.style.setProperty('--text-color', maincontentCustom.textColor);
              document.documentElement.style.setProperty('--btn-primary-bg-color', maincontentCustom.buttonColor);
              document.documentElement.style.setProperty('--btn-primary-border-color', maincontentCustom.buttonPrimaryBorderColor);
              document.documentElement.style.setProperty('--btn-primary-text-color', maincontentCustom.buttonValueColor);
              document.documentElement.style.setProperty('--btn-secondary-text-color', maincontentCustom.buttonSecondaryTextColor);
              document.documentElement.style.setProperty('--btn-secondary-border-color', maincontentCustom.buttonSecondaryBorderColor);
              document.documentElement.style.setProperty('--btn-secondary-bg-color', maincontentCustom.buttonSecondaryColor);
              document.documentElement.style.setProperty('--button-primary-bg-color', maincontentCustom.buttonColor);
              document.documentElement.style.setProperty('--button-primary-border-color', maincontentCustom.buttonPrimaryBorderColor);
              document.documentElement.style.setProperty('--button-primary-text-color', maincontentCustom.buttonValueColor);
              document.documentElement.style.setProperty('--button-secondary-bg-color', maincontentCustom.buttonSecondaryColor);
              document.documentElement.style.setProperty('--button-secondary-border-color', maincontentCustom.buttonSecondaryBorderColor);
              document.documentElement.style.setProperty('--button-secondary-text-color', maincontentCustom.buttonSecondaryTextColor);
              document.documentElement.style.setProperty('--icon-color', maincontentCustom.iconColor);
              document.documentElement.style.setProperty('--icon-border-color', maincontentCustom.iconBorderColor);
              document.documentElement.style.setProperty('--icon-hover-color', maincontentCustom.iconHoverColor);
              // require("style-loader!../../../assets/admin/layout2/css/themes/custom-skin-main-content.css");
            } else {
              if (activeThemeDto.parentThemeName === 'NEUMORPHISMDARK') {
                require("style-loader!../../../assets/admin/layout2/css/themes/neomorphism-dark.css");
              } else if (activeThemeDto.parentThemeName === 'NEUMORPHISMLIGHT') {
                require("style-loader!../../../assets/admin/layout2/css/themes/neomorphism-light.css");
              } else if (activeThemeDto.parentThemeName === 'GLASSMORPHISMDARK') {
                document.documentElement.style.setProperty('--body-background-image', 'url(' + activeThemeDto.backgroundImagePath + ')');
                require("style-loader!../../../assets/admin/layout2/css/themes/glassomorphism-dark.css");
              } else if (activeThemeDto.parentThemeName === 'GLASSMORPHISMLIGHT') {
                document.documentElement.style.setProperty('--body-background-image', 'url(' + activeThemeDto.backgroundImagePath + ')');
                require("style-loader!../../../assets/admin/layout2/css/themes/glassomorphism-light.css");
              }
              document.documentElement.style.setProperty('--custom-buttonbg-color', buttonCustomizationForm.buttonColor);
              document.documentElement.style.setProperty('--custom-text-color', buttonCustomizationForm.buttonValueColor);
              document.documentElement.style.setProperty('--custom-border-color', buttonCustomizationForm.buttonBorderColor);
              document.documentElement.style.setProperty('--custom-gradient-one-color', buttonCustomizationForm.gradiantColorOne);
              document.documentElement.style.setProperty('--custom-gradient-two-color', buttonCustomizationForm.gradiantColorTwo);
              document.documentElement.style.setProperty('--custom-icon-color', buttonCustomizationForm.iconColor);
              document.documentElement.style.setProperty('--custom-icon-border-color', buttonCustomizationForm.iconBorderColor);
              document.documentElement.style.setProperty('--custom-icon-hover-color', buttonCustomizationForm.iconHoverColor);

              require("style-loader!../../../assets/admin/layout2/css/themes/buttons-icons-customization.css");
            }
          }
        }, error => {
          this.loader = false;
        });
  }


getHtmlBodyAlias(){
     let landingPageHtmlDto = {
       "vendorJourney":false,
       "masterLandingPage":false,
       "fromMasterLandingPage":false,
     }
     this.landingPageService.getActiveWelcomePageByVanity(landingPageHtmlDto)
     .subscribe(
       (response: any) => {
              if (response.statusCode == 200) {
                this.htmlString = this.vanityURLService.sanitizeHtmlWithImportant(response.message)
                this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.htmlString);
              }
       },
       (error: string) => {
       }
     );
 } 

}
