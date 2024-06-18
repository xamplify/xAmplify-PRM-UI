import { Component, OnInit, Renderer } from "@angular/core";
import { Router } from "@angular/router";
import { ReferenceService } from "../services/reference.service";
import { UserService } from "../services/user.service";
import { AuthenticationService } from "../services/authentication.service";
import { VideoUtilService } from "../../videos/services/video-util.service";
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { Roles } from '../../core/models/roles';
import { Pagination } from '../../core/models/pagination';
import { DealRegistrationService } from "app/deal-registration/services/deal-registration.service";
import { Title } from '@angular/platform-browser';
import { VanityURLService } from "app/vanity-url/services/vanity.url.service";
//import { ThemePropertiesDto } from "app/dashboard/models/custom-skin";
import { DashboardService } from "app/dashboard/dashboard.service";
import { VanityLoginDto } from "app/util/models/vanity-login-dto";
import { ThemePropertiesDto } from "app/dashboard/models/theme-properties-dto";
import { CompanyThemeActivate } from "app/dashboard/models/company-theme-activate";
import { ThemeDto } from "app/dashboard/models/theme-dto";


declare var $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  public refcategories: any;
  pagination: Pagination
  roleName: Roles = new Roles();
  public currentUser = JSON.parse(localStorage.getItem("currentUser"));
  userId: any;
  token: any;
  loggedInThroughVanityUrl = false;
  loader = false;
  ThemePropertiesDtoDto: ThemePropertiesDto = new ThemePropertiesDto();
  footerSkin: ThemePropertiesDto = new ThemePropertiesDto();
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  loggedInUserId: number;
  constructor(
    private titleService: Title,
    public referenceService: ReferenceService,
    public userService: UserService,
    public dealsService: DealRegistrationService,
    public xtremandLogger: XtremandLogger,
    private router: Router,
    public authenticationService: AuthenticationService,
    public videoUtilService: VideoUtilService,
    private vanityURLService: VanityURLService,
    public dashBoardService: DashboardService,
    private renderer: Renderer
  ) {
    this.loggedInThroughVanityUrl = this.vanityURLService.isVanityURLEnabled();
    this.isAuthorized();
    /**** XNFR-134 ****/
    this.loggedInUserId = this.authenticationService.getUserId();
    this.vanityLoginDto.userId = this.loggedInUserId;
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
    } else {
      this.vanityLoginDto.vanityUrlFilter = false;
    }
    this.authenticationService.vanityLoginDtoForTheme = this.vanityLoginDto;
  }

  isAuthorized(): boolean {
    try {
      if (!localStorage.getItem("currentUser")) {
        $(".page-container,.page-header.navbar.navbar-fixed-top").html("");
        if (this.authenticationService.unauthorized) {
          this.router.navigateByUrl("/401");
        } else {
          this.router.navigateByUrl("/login");
        }
        return false;
      }
    } catch (error) {
      this.xtremandLogger.error(error);
    }
  }
  getCategorisService() {
    try {
      this.referenceService.getCategories().subscribe(
        (result: any) => {
          this.refcategories = result;
          this.referenceService.refcategories = this.refcategories;
        },
        (error: any) => {
          this.xtremandLogger.error("error" + error);
        },
        () => this.xtremandLogger.log("categoriss api called"));
    } catch (error) {
      this.xtremandLogger.error("error" + error);
    }
  }
  getVideoTitles() {
    try {
      this.referenceService.getVideoTitles().subscribe((result: any) => {
        this.referenceService.videoTitles = result.titles;
      });
    } catch (error) {
      this.xtremandLogger.error("error" + error);
    }
  }
  getVideoDefaultSettings() {
    try {
      this.userService.getVideoDefaultSettings().subscribe(
        (response: any) => {
          if (response !== "") {
            this.referenceService.videoBrandLogo = response.brandingLogoUri;
            this.referenceService.defaultPlayerSettings = response;
            this.referenceService.companyId = response.companyProfile.id;
            this.referenceService.companyProfileImage = response.companyProfile.companyLogoPath;
            this.referenceService.website = this.videoUtilService.isStartsWith(response.companyProfile.website);
            if (!response.brandingLogoUri || !response.brandingLogoDescUri) {
              const logoLink = this.videoUtilService.isStartsWith(response.companyProfile.website);
              this.saveVideoBrandLog(response.companyProfile.companyLogoPath, logoLink);
            }
          }
        },
        (error: any) => {
          this.xtremandLogger.errorPage(error);
        }
      );
    } catch (error) {
      this.xtremandLogger.error("error" + error);
    }
  }
  saveVideoBrandLog(companyLogoPath, logoLink) {
  }
  getCompanyId() {
    try {
      this.referenceService.getCompanyIdByUserId(this.authenticationService.user.id).subscribe(
        (result: any) => {
          if (result !== "") {
            this.loader = false;
            this.referenceService.companyId = result;
            if (result != undefined && result > 0) {
              this.getOrgCampaignTypes();
            }

          }
        }, (error: any) => { this.xtremandLogger.log(error); }
      );
    } catch (error) { this.xtremandLogger.log(error); }
  }

  getOrgCampaignTypes() {
    this.referenceService.getOrgCampaignTypes(this.referenceService.companyId).subscribe(
      data => {
        this.referenceService.videoCampaign = data.video;
        this.referenceService.emailCampaign = data.regular;
        this.referenceService.socialCampaign = data.social;
        this.referenceService.eventCampaign = data.event;
      });
  }

  getPartnerCampaignsNotifications() {
    if (!this.referenceService.eventCampaignTabAccess || !this.referenceService.socialCampaignTabAccess) {
      const url = "partner/access/" + this.userId + "?access_token=" + this.token;
      this.userService.getEventAccessTab(url)
        .subscribe(
          data => {
            this.referenceService.eventCampaignTabAccess = data.event;
            this.referenceService.socialCampaignTabAccess = data.social;
          },
          error => { },
          () => this.xtremandLogger.info('Finished home component CampaignNotification()')
        );
    }
  }

  getTeamMembersDetails() {
    const url = "admin/getRolesByUserId/" + this.userId + "?access_token=" + this.token;
    this.userService.getHomeRoles(url)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.authenticationService.loggedInUserRole = response.data.role;
            this.authenticationService.isPartnerTeamMember = response.data.partnerTeamMember;
            this.authenticationService.superiorRole = response.data.superiorRole;
            const roles = this.authenticationService.getRoles();
            this.checkEnableLeads()

            if (roles) {

              if (roles.indexOf(this.roleName.companyPartnerRole) > -1) {
                this.authenticationService.isCompanyPartner = true;
              }

              if (roles.indexOf(this.roleName.campaignRole) > -1 ||
                roles.indexOf(this.roleName.orgAdminRole) > -1 ||
                roles.indexOf(this.roleName.vendorRole) > -1 ||
                roles.indexOf(this.roleName.companyPartnerRole) > -1) {
                this.authenticationService.isShowCampaign = true;
                if ((roles.indexOf(this.roleName.campaignRole) > -1 && (this.authenticationService.superiorRole === 'OrgAdmin & Partner' || this.authenticationService.superiorRole === 'Vendor & Partner' || this.authenticationService.superiorRole === 'Partner'))
                  || this.authenticationService.isCompanyPartner) {
                  this.authenticationService.isShowRedistribution = true;
                } else {
                  this.authenticationService.isShowRedistribution = false;
                }

                if (roles.indexOf(this.roleName.contactsRole) > -1 ||
                  roles.indexOf(this.roleName.orgAdminRole) > -1 ||
                  roles.indexOf(this.roleName.companyPartnerRole) > -1
                  //||(this.authenticationService.superiorRole === 'OrgAdmin & Partner' || (this.authenticationService.superiorRole === 'Vendor & Partner' && !this.loggedInThroughVanityUrl)) 
                ) {
                  // this.authenticationService.isShowContact = true;
                }

              }
            } else {
              this.authenticationService.loggedInUserRole = 'User';
            }
          }
        },
        () => {
          this.xtremandLogger.log('Finished');
        }
      );
  }

  checkEnableLeads() {
    if (this.authenticationService.loggedInUserRole != "Team Member") {
      const url = "admin/get-company-id/" + this.userId + "?access_token=" + this.token;
      this.referenceService.getHomeCompanyIdByUserId(url)
        .subscribe(response => {
          const campaignUrl = "campaign/access/" + response + "?access_token=" + this.token;
          this.referenceService.getHomeOrgCampaignTypes(campaignUrl)
            .subscribe(data => {
              this.authenticationService.enableLeads = data.enableLeads;
              if (!this.authenticationService.enableLeads) {
                this.checkEnableLeadsForPartner();
              }
            });

        })
    } else if (this.authenticationService.superiorRole.includes("Vendor") || this.authenticationService.superiorRole.includes("OrgAdmin")) {

      try {
        this.referenceService.getCompanyIdByUserId(this.authenticationService.user.id).subscribe(
          (result: any) => {
            if (result !== "") {
              this.referenceService.companyId = result;
              this.dealsService.getVendorLeadServices(this.authenticationService.user.id, this.referenceService.companyId).subscribe(response => {
                this.authenticationService.enableLeads = response.data;
                if (!this.authenticationService.enableLeads) {
                  this.checkEnableLeadsForPartner();
                }
              })
            }
          }, (error: any) => { this.xtremandLogger.log(error); }
        );
      } catch (error) { this.xtremandLogger.log(error); }

    } else {
      if (!this.authenticationService.enableLeads) {
        this.checkEnableLeadsForPartner();
      }
    }


  }

  checkEnableLeadsForPartner() {

    if (!this.authenticationService.enableLeads && (this.authenticationService.isCompanyPartner || (this.authenticationService.loggedInUserRole == "Team Member" && this.authenticationService.superiorRole.includes("Partner")))) {

      try {
        this.referenceService.getCompanyIdByUserId(this.authenticationService.user.id).subscribe(
          (result: any) => {
            if (result !== "") {
              this.referenceService.companyId = result;
              this.dealsService.getPartnerLeadServices(this.authenticationService.user.id, this.referenceService.companyId).subscribe(response => {
                this.authenticationService.enableLeads = response.data;
              })
            }
          }, (error: any) => { this.xtremandLogger.log(error); }
        );
      } catch (error) { this.xtremandLogger.log(error); }

    }
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnInit() {
    try {
      this.loader = true;
      if (this.currentUser['logedInCustomerCompanyNeme'] != undefined) {
        if (this.authenticationService.vanityURLEnabled && this.authenticationService.v_companyName) {
          this.setTitle(this.authenticationService.v_companyName);
          localStorage.setItem('companyName', this.authenticationService.v_companyName);
        } else {
          this.setTitle(this.currentUser['logedInCustomerCompanyNeme']);
          localStorage.setItem('companyName', this.currentUser['logedInCustomerCompanyNeme']);

        }
      } else {
        this.setTitle('xAmplify');
      }
      this.userId = this.currentUser['userId'];
      this.token = this.currentUser['accessToken'];
      const roleNames = this.currentUser['roles'];
      if (
        this.referenceService.defaulgVideoMethodCalled === false &&
        (roleNames.length > 1 && this.authenticationService.hasCompany())
      ) {
        this.getVideoDefaultSettings();
        this.referenceService.defaulgVideoMethodCalled = true;
        this.getTeamMembersDetails();
        this.getPartnerCampaignsNotifications();
        this.getCategorisService();
      }
      this.vanityURLService.isVanityURLEnabled();
      this.getCompanyId();
      //this.getDefaultSkin();
      this.getActiveThemeData(this.vanityLoginDto);
      //this.getMainContent(this.userId);  
      this.showLeftSideMenu();
    } catch (error) {
      this.xtremandLogger.error("error" + error);
    }
  }


  /*********** XNFR-238********** */
  activeThemeDetails: CompanyThemeActivate = new CompanyThemeActivate();
  getActiveThemeData(vanityLoginDto) {
    this.loader = true;
    this.dashBoardService.getActiveTheme(this.vanityLoginDto).subscribe(
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


  topCustom: ThemePropertiesDto = new ThemePropertiesDto();

  leftCustom: ThemePropertiesDto = new ThemePropertiesDto();

  footerCustom: ThemePropertiesDto = new ThemePropertiesDto();

  maincontentCustom: ThemePropertiesDto = new ThemePropertiesDto();

  buttonCustomizationForm: ThemePropertiesDto = new ThemePropertiesDto();

  activeThemeDto: ThemeDto = new ThemeDto();
  imageHost:any;
  getThemeDtoByID(id: number) {
    this.loader = true;
    this.dashBoardService.getThemeDTOById(id).subscribe(
      (response) => {
        this.loader = false;
        this.activeThemeDto = response.data;
        this.authenticationService.themeDto = this.activeThemeDto;
        if(this.activeThemeDto.parentThemeName == 'GLASSMORPHISMLIGHT' || this.activeThemeDto.parentThemeName  == 'GLASSMORPHISMDARK') {
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
    //this.ngxloading = true;
    this.loader = true;
    this.dashBoardService.getPropertiesById(activeThemeDto.id)
      .subscribe(
        (response) => {
          //this.ngxloading = false;
          this.loader = false;
          let skinMap = response.data;
        // this.authenticationService.customMap = data.data;
          this.topCustom = skinMap.TOP_NAVIGATION_BAR;
          this.leftCustom = skinMap.LEFT_SIDE_MENU;
          this.footerCustom = skinMap.FOOTER;
          this.footerSkin = skinMap.FOOTER;
          this.maincontentCustom = skinMap.MAIN_CONTENT;
          this.buttonCustomizationForm = skinMap.BUTTON_CUSTOMIZE;
          this.authenticationService.isLeft = !activeThemeDto.defaultTheme;
          this.authenticationService.isTop = !activeThemeDto.defaultTheme;
          this.authenticationService.isFoter = !activeThemeDto.defaultTheme;
          this.authenticationService.isMain = !activeThemeDto.defaultTheme;
          if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Light") {
            require("style-loader!../../../assets/admin/layout2/css/layout.css");
          } else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Dark" && !this.router.url.includes('home/help')) {
            this.authenticationService.isDarkForCharts = true;
            require("style-loader!../../../assets/admin/layout2/css/themes/xamplify-dark-light.css");
          } else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Neumorphism Dark(Beta)" && !this.router.url.includes('home/help')) {
            this.authenticationService.isDarkForCharts = true;
            require("style-loader!../../../assets/admin/layout2/css/themes/neomorphism-dark.css");
            require("style-loader!../../../assets/admin/layout2/css/themes/neumorphism-light-dark-buttons.css")
          }
          else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Neumorphism Light" && !this.router.url.includes('home/help')) {
            this.authenticationService.isDarkForCharts = false;
            require("style-loader!../../../assets/admin/layout2/css/themes/neomorphism-light.css");
            // require("style-loader!../../../assets/admin/layout2/css/themes/neumorphism-light-dark-buttons.css")
          }
          else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Glassomorphism Light" && !this.router.url.includes('home/help')) {
            this.authenticationService.isDarkForCharts = false;
            document.documentElement.style.setProperty('--body-background-image', 'url(' + this.imageHost + activeThemeDto.backgroundImagePath + ')');
            require("style-loader!../../../assets/admin/layout2/css/themes/glassomorphism-light.css");
          }
          else if (activeThemeDto.defaultTheme && activeThemeDto.companyId === 1
            && activeThemeDto.name === "Glassomorphism Dark" && !this.router.url.includes('home/help')) {
            this.authenticationService.isDarkForCharts = true;
            document.documentElement.style.setProperty('--body-background-image', 'url(' + this.imageHost + activeThemeDto.backgroundImagePath + ')');
            require("style-loader!../../../assets/admin/layout2/css/themes/glassomorphism-dark.css");

          } 
          else if (!activeThemeDto.defaultTheme && activeThemeDto.companyId != 1 && !this.router.url.includes('home/help')) {
            if (activeThemeDto.parentThemeName == 'LIGHT' || activeThemeDto.parentThemeName == 'DARK') {
              document.documentElement.style.setProperty('--top-bg-color', this.topCustom.backgroundColor);
              document.documentElement.style.setProperty('--top-buton-color', this.topCustom.buttonColor);
              document.documentElement.style.setProperty('--top-button-border-color', this.topCustom.buttonBorderColor);
              document.documentElement.style.setProperty('--top-button-value-color', this.topCustom.buttonValueColor);
              document.documentElement.style.setProperty('--top-button-icon-color', this.topCustom.iconColor);
              require("style-loader!../../../assets/admin/layout2/css/themes/custom-skin-header.css");
              document.documentElement.style.setProperty('--left-bg-color', this.leftCustom.backgroundColor);
              document.documentElement.style.setProperty('--left-text-color', this.leftCustom.textColor);
              document.documentElement.style.setProperty('--left-border-color', this.leftCustom.buttonBorderColor);
              document.documentElement.style.setProperty('--left-icon-color', this.leftCustom.iconColor);
              require("style-loader!../../../assets/admin/layout2/css/themes/custom-skin-left-side-bar.css");

              document.documentElement.style.setProperty('--footer-bg-color', this.footerSkin.backgroundColor);
              document.documentElement.style.setProperty('--footer-text-color', this.footerSkin.textColor);
              document.documentElement.style.setProperty('--footer-border-color', this.footerSkin.buttonBorderColor);
              require("style-loader!../../../assets/admin/layout2/css/themes/custom-skin-footer.css");
              document.documentElement.style.setProperty('--page-content', this.maincontentCustom.backgroundColor);
              document.documentElement.style.setProperty('--div-bg-color', this.maincontentCustom.divBgColor);
              document.documentElement.style.setProperty('--title-heading--text', this.maincontentCustom.textColor);
              document.documentElement.style.setProperty('--border-color', this.maincontentCustom.buttonBorderColor);
              document.documentElement.style.setProperty('---text-color', this.maincontentCustom.textColor);
              document.documentElement.style.setProperty('--btn-primary-bg-color', this.maincontentCustom.buttonColor);
              document.documentElement.style.setProperty('--btn-primary-border-color', this.maincontentCustom.buttonPrimaryBorderColor);
              document.documentElement.style.setProperty('--btn-primary-text-color', this.maincontentCustom.buttonValueColor);
              document.documentElement.style.setProperty('--btn-secondary-text-color', this.maincontentCustom.buttonSecondaryTextColor);
              document.documentElement.style.setProperty('--btn-secondary-border-color', this.maincontentCustom.buttonSecondaryBorderColor);
              document.documentElement.style.setProperty('--btn-secondary-bg-color', this.maincontentCustom.buttonSecondaryColor);
              document.documentElement.style.setProperty('--button-primary-bg-color', this.maincontentCustom.buttonColor);
              document.documentElement.style.setProperty('--button-primary-border-color', this.maincontentCustom.buttonPrimaryBorderColor);
              document.documentElement.style.setProperty('--button-primary-text-color', this.maincontentCustom.buttonValueColor);
              document.documentElement.style.setProperty('--button-secondary-bg-color', this.maincontentCustom.buttonSecondaryColor);
              document.documentElement.style.setProperty('--button-secondary-border-color', this.maincontentCustom.buttonSecondaryBorderColor);
              document.documentElement.style.setProperty('--button-secondary-text-color', this.maincontentCustom.buttonSecondaryTextColor);
              document.documentElement.style.setProperty('--icon-color', this.maincontentCustom.iconColor);
              document.documentElement.style.setProperty('--icon-border-color', this.maincontentCustom.iconBorderColor);
              document.documentElement.style.setProperty('--icon-hover-color', this.maincontentCustom.iconHoverColor);
              require("style-loader!../../../assets/admin/layout2/css/themes/custom-skin-main-content.css");
            } else {
              if (activeThemeDto.parentThemeName === 'NEUMORPHISMDARK') {
                require("style-loader!../../../assets/admin/layout2/css/themes/neomorphism-dark.css");
              } else if (activeThemeDto.parentThemeName === 'NEUMORPHISMLIGHT') {
                require("style-loader!../../../assets/admin/layout2/css/themes/neomorphism-light.css");
              } else if (activeThemeDto.parentThemeName === 'GLASSMORPHISMDARK') {
                document.documentElement.style.setProperty('--body-background-image', 'url(' + this.imageHost + activeThemeDto.backgroundImagePath + ')');
                require("style-loader!../../../assets/admin/layout2/css/themes/glassomorphism-dark.css");
              } else if (activeThemeDto.parentThemeName === 'GLASSMORPHISMLIGHT') {
                document.documentElement.style.setProperty('--body-background-image', 'url(' + this.imageHost + activeThemeDto.backgroundImagePath + ')');
                require("style-loader!../../../assets/admin/layout2/css/themes/glassomorphism-light.css");
              }
              document.documentElement.style.setProperty('--custom-buttonbg-color', this.buttonCustomizationForm.buttonColor);
              document.documentElement.style.setProperty('--custom-text-color', this.buttonCustomizationForm.buttonValueColor);
              document.documentElement.style.setProperty('--custom-border-color', this.buttonCustomizationForm.buttonBorderColor);
              document.documentElement.style.setProperty('--custom-gradient-one-color', this.buttonCustomizationForm.gradiantColorOne);
              document.documentElement.style.setProperty('--custom-gradient-two-color', this.buttonCustomizationForm.gradiantColorTwo);
              document.documentElement.style.setProperty('--custom-icon-color', this.buttonCustomizationForm.iconColor);
              document.documentElement.style.setProperty('--custom-icon-border-color', this.buttonCustomizationForm.iconBorderColor);
              document.documentElement.style.setProperty('--custom-icon-hover-color', this.buttonCustomizationForm.iconHoverColor);

              require("style-loader!../../../assets/admin/layout2/css/themes/buttons-icons-customization.css");
            }
          }
        }, error => {
          this.loader = false;
        });
  }
  /************* XNFR-238 *********************/

  /******** user guide *******/
  showLeftMenu: boolean;
  showLeftSideMenu() {
    this.showLeftMenu = this.referenceService.hideLeftSideMenu();
  }
  bgImagePath:any;
  getDefaultImagePath(name:any,themeId:any) {
    this.dashBoardService.getDefaultImagePath(name,themeId).subscribe(
      (data: any) => {
        this.bgImagePath = data.data;
        let path = this.bgImagePath;
        if((name == 'GLASSMORPHISMLIGHT' || name == 'GLASSMORPHISMDARK') && (path && path.includes('/assets') || this.bgImagePath == undefined || this.bgImagePath == "" || this.bgImagePath == null ) ) {
          //this.getDefaultImagePath(this.activeThemeDto.parentThemeName,this.activeThemeDto.id);
          this.imageHost = "";
        } else if(this.activeThemeDto.backgroundImagePath != null || this.activeThemeDto.backgroundImagePath != "") {
          this.imageHost = this.authenticationService.MEDIA_URL;
        }
        this.activeThemeDto.backgroundImagePath= this.bgImagePath;
      }, error =>{
        this.bgImagePath = "";
      }, () => {
        this.activeThemeDto.backgroundImagePath = this.bgImagePath;
        // this.authenticationService.themeBackgroundImagePath =this.bgImagePath;
      }
    )
  }
}
