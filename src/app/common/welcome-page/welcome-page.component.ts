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
 /*** Glassmorphism Default *****/
 bgImagePath: any;
 isBgImagePath = false;
 serverImageHostUrl = "";
 imageHost: any = "";
 /*** Glassmorphism Default *****/
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
    if(this.router.url.includes('/welcome-page')){
        this.referenceService.clearHeadScriptFiles();
    }
    $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/welcome-page.css' type='text/css'>");
    $("#xamplify-index-head").append( "<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>");
    $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-font-family.css' type='text/css'>");

    
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
          this.getDefaultImagePath(this.activeThemeDto.parentThemeName,this.activeThemeDto.id);
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
    this.loader = true;
    this.dashBoardService.getPropertiesById(activeThemeDto.id)
      .subscribe(
        (response) => {
          this.loader = false;
          let skinMap = response.data;
          let topCustom = skinMap.TOP_NAVIGATION_BAR;
          // let leftCustom = skinMap.LEFT_SIDE_MENU;
          // let footerCustom = skinMap.FOOTER;
          // let footerSkin = skinMap.FOOTER;
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
            $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-neumorphism-dark.css' type='text/css'>");
          }
          else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Neumorphism Light" && !this.router.url.includes('home/help')) {
            $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-neumorphism-light.css' type='text/css'>");
          } else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Glassomorphism Light" && !this.router.url.includes('home/help')) {
            document.documentElement.style.setProperty('--body-background-image', 'url(' + activeThemeDto.backgroundImagePath + ')');
            document.documentElement.style.setProperty('--color-glassmorphims', '#000');
            document.documentElement.style.setProperty('--background-glassmorphims', '#fff');
            document.documentElement.style.setProperty('--background-hover-glassmorphims', '#b1a2a22e');
            $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-glassmorphism-light.css' type='text/css'>");
          }
          else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Glassomorphism Dark" && !this.router.url.includes('home/help')) {
            document.documentElement.style.setProperty('--body-background-image', 'url(' + activeThemeDto.backgroundImagePath + ')');
            document.documentElement.style.setProperty('--color-glassmorphims', '#fff');
            document.documentElement.style.setProperty('--background-glassmorphims', '#000');
            document.documentElement.style.setProperty('--background-hover-glassmorphims', '#2e2f32');
            $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-glassmorphism-dark.css' type='text/css'>");
          }
          else if (!activeThemeDto.defaultTheme && activeThemeDto.companyId != 1 && !this.router.url.includes('home/help')) {
            if (activeThemeDto.parentThemeName == 'LIGHT' || activeThemeDto.parentThemeName == 'DARK') {
              document.documentElement.style.setProperty('--top-bg-color', topCustom.backgroundColor);
              document.documentElement.style.setProperty('--top-buton-color', topCustom.buttonColor);
              document.documentElement.style.setProperty('--top-button-border-color', topCustom.buttonBorderColor);
              document.documentElement.style.setProperty('--top-button-value-color', topCustom.buttonValueColor);
              document.documentElement.style.setProperty('--top-button-icon-color', topCustom.iconColor);
              // document.documentElement.style.setProperty('--top-background-hover', this.getVariantColor(topCustom.backgroundColor, 40))
              document.documentElement.style.setProperty('--page-content', maincontentCustom.backgroundColor);
              document.documentElement.style.setProperty('--div-bg-color', maincontentCustom.divBgColor);
              document.documentElement.style.setProperty('--border-color', maincontentCustom.buttonBorderColor);
              document.documentElement.style.setProperty('--text-color', maincontentCustom.textColor);
              document.documentElement.style.setProperty('--menu-text', topCustom.buttonSecondaryTextColor);
              document.documentElement.style.setProperty('--module-select-color', topCustom.divBgColor);
              document.documentElement.style.setProperty('--menu-text-hover', topCustom.iconHoverColor);
              //this.getVariantColor(topCustom.buttonColor, 0.68))
              $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-dark-customization.css' type='text/css'>");
            } else {
              if (activeThemeDto.parentThemeName === 'NEUMORPHISMDARK') {
                document.documentElement.style.setProperty('--menu-text', topCustom.buttonSecondaryTextColor);
                document.documentElement.style.setProperty('--module-select-color', topCustom.divBgColor);
                document.documentElement.style.setProperty('--menu-text-hover', topCustom.iconHoverColor);
                document.documentElement.style.setProperty('--custom-buttonbg-color', buttonCustomizationForm.buttonColor);
                document.documentElement.style.setProperty('--custom-text-color', buttonCustomizationForm.buttonValueColor);
                document.documentElement.style.setProperty('--custom-border-color', buttonCustomizationForm.buttonBorderColor);
                document.documentElement.style.setProperty('--custom-gradient-one-color', buttonCustomizationForm.gradiantColorOne);
                document.documentElement.style.setProperty('--custom-gradient-two-color', buttonCustomizationForm.gradiantColorTwo);
                // $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-button-customization.css' type='text/css'>");
                $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-neumorphism-dark.css' type='text/css'>");
                $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-neumorphism-custom.css' type='text/css'>");


              } else if (activeThemeDto.parentThemeName === 'NEUMORPHISMLIGHT') {
                document.documentElement.style.setProperty('--menu-text', topCustom.buttonSecondaryTextColor);
                document.documentElement.style.setProperty('--module-select-color', topCustom.divBgColor);
                document.documentElement.style.setProperty('--menu-text-hover', topCustom.iconHoverColor);
                document.documentElement.style.setProperty('--custom-buttonbg-color', buttonCustomizationForm.buttonColor);
                document.documentElement.style.setProperty('--custom-text-color', buttonCustomizationForm.buttonValueColor);
                document.documentElement.style.setProperty('--custom-border-color', buttonCustomizationForm.buttonBorderColor);
                document.documentElement.style.setProperty('--custom-gradient-one-color', buttonCustomizationForm.gradiantColorOne);
                document.documentElement.style.setProperty('--custom-gradient-two-color', buttonCustomizationForm.gradiantColorTwo);
                // $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-button-customization.css' type='text/css'>");
                $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-neumorphism-light.css' type='text/css'>");
                $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-neumorphism-custom.css' type='text/css'>");
              }
              else if (activeThemeDto.parentThemeName === 'GLASSMORPHISMDARK') {
                document.documentElement.style.setProperty('--body-background-image', 'url(' + activeThemeDto.backgroundImagePath + ')');
                document.documentElement.style.setProperty('--color-glassmorphims', '#fff');
                document.documentElement.style.setProperty('--background-glassmorphims', '#000');
                document.documentElement.style.setProperty('--background-hover-glassmorphims', '#2e2f32');
                $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-glassmorphism-dark.css' type='text/css'>");
              } else if (activeThemeDto.parentThemeName === 'GLASSMORPHISMLIGHT') {
                document.documentElement.style.setProperty('--body-background-image', 'url(' + activeThemeDto.backgroundImagePath + ')');
                document.documentElement.style.setProperty('--color-glassmorphims', '#000');
                document.documentElement.style.setProperty('--background-glassmorphims', '#fff');
                document.documentElement.style.setProperty('--background-hover-glassmorphims', '#b1a2a22e');
                $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-glassmorphism-light.css' type='text/css'>");

              }
              document.documentElement.style.setProperty('--menu-text', topCustom.buttonSecondaryTextColor);
              document.documentElement.style.setProperty('--module-select-color', topCustom.divBgColor);
              document.documentElement.style.setProperty('--menu-text-hover', topCustom.iconHoverColor);

              document.documentElement.style.setProperty('--custom-buttonbg-color', buttonCustomizationForm.buttonColor);
              document.documentElement.style.setProperty('--custom-text-color', buttonCustomizationForm.buttonValueColor);
              document.documentElement.style.setProperty('--custom-border-color', buttonCustomizationForm.buttonBorderColor);
              document.documentElement.style.setProperty('--custom-gradient-one-color', buttonCustomizationForm.gradiantColorOne);
              document.documentElement.style.setProperty('--custom-gradient-two-color', buttonCustomizationForm.gradiantColorTwo);
              // document.documentElement.style.setProperty('--custom-icon-color', buttonCustomizationForm.iconColor);
              // document.documentElement.style.setProperty('--custom-icon-border-color', buttonCustomizationForm.iconBorderColor);
              // document.documentElement.style.setProperty('--custom-icon-hover-color', buttonCustomizationForm.iconHoverColor);

              $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/xAmplify-welcome-page-button-customization.css' type='text/css'>");
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

 getDefaultImagePath(name: any, themeId: any) {
  this.dashBoardService.getDefaultImagePath(name, themeId).subscribe(
    (data: any) => {
      this.bgImagePath = data.data;
      this.isBgImagePath = data.statusCode == 200;
      //this.activeThemeDto.backgroundImagePath= this.bgImagePath;
    }, error => {
      this.loader = false;
    }, () => {
      if (this.isBgImagePath) {
        if ((name == 'GLASSMORPHISMLIGHT' || name == 'GLASSMORPHISMDARK') && (this.bgImagePath && this.bgImagePath.includes('/theme-background-image/'))) {
          this.imageHost = this.serverImageHostUrl;
        } else {
          this.imageHost = "";
        }
        this.activeThemeDto.backgroundImagePath = this.imageHost + this.bgImagePath;
      }
    });
}

}
