import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { EnvService } from 'app/env.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { User } from '../models/user';
import { Roles } from '../models/roles';
import { Module } from '../models/module';
import { UserToken } from '../models/user-token';
import { UtilService } from '../services/util.service';
declare var swal, $, require: any;
var SockJs = require("sockjs-client");
var Stomp = require("stompjs");
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { DashboardAnalyticsDto } from 'app/dashboard/models/dashboard-analytics-dto';
import { Pagination } from '../../core/models/pagination';
import { TranslateService } from '@ngx-translate/core';
import { VanityLoginDto } from '../../util/models/vanity-login-dto';
import { UnsubscribeReason } from 'app/dashboard/models/unsubscribe-reason';
import { UnsubscribePageDetails } from 'app/dashboard/models/unsubscribe-page-details';
import { ModuleCustomName } from "app/dashboard/models/module-custom-name";
import { CommentDto } from 'app/common/models/comment-dto';
import { LoginAsEmailNotificationDto } from 'app/dashboard/models/login-as-email-notification-dto';
import { CustomSkin } from 'app/dashboard/models/custom-skin';
import { ThemeDto } from 'app/dashboard/models/theme-dto';
import { CopyGroupUsersDto } from 'app/common/models/copy-group-users-dto';
import { SendTestEmailDto } from 'app/common/models/send-test-email-dto';
import { TracksPlayBookType } from 'app/tracks-play-book-util/models/tracks-play-book-type.enum';

@Injectable()
export class AuthenticationService {


  access_token: string;
  refresh_token: string;
  expires_in: number;
  logged_in_time: Date;
  APP_URL: any;
  DOMAIN_URL = "";
  SERVER_URL: any;
  REST_URL: string;
  MEDIA_URL: string;
  SHARE_URL: string;
  MARKETO_URL: string;
  isSharePartnerModal = false;
  user: User = new User();
  userProfile: User = new User();
  userToken: UserToken = new UserToken();
  redirectUrl: string;
  map: any;
  isCompanyAdded = false;
  module: Module = new Module();
  roleName: Roles = new Roles();
  isAddedByVendor = false;
  isPartnerTeamMember = false;
  isVendorAndPartnerTeamMember = false;
  isVendorTeamMember = false;
  isVendorSuperVisor = false;
  isOrgAdminSuperVisor = false;
  isOrgAdminAndPartnerTeamMember = false;
  isOrgAdminTeamMember = false;
  superiorRole = '';
  selectedVendorId: number;
  venorMyProfileReport: any;
  loggedInUserRole: string;
  hasOnlyPartnerRole = false;
  isShowCampaign = false;
  isShowRedistribution = false;
  enableLeads = false;
  isCompanyPartner = false;
  isShowContact = false;

  isShowForms = false;

  clientId: any;
  clientSecret: any;
  imagesHost: any;
  superiorId: number = 0;
  formAlias: any;
  isFromRsvpPage = false;
  formValues = [];
  isPartnerRsvp = false;
  logedInCustomerCompanyNeme: string;
  v_companyName: string;
  v_companyLogoImagePath: string;
  v_companyBgImagePath: string;
  v_companyFavIconPath: string;
  v_showCompanyLogo: boolean = false;
  vanityURLUserRoles: any;
  companyProfileName: string = "";
  vanityURLEnabled: boolean = false;
  vanityURLink: string = "";
  dashboardAnalyticsDto: DashboardAnalyticsDto = new DashboardAnalyticsDto();
  vendorRoleHash = "";
  partnerRoleHash = "";
  sessinExpriedMessage = "";
  serviceStoppedMessage = "";
  private userLoggedIn = new Subject<boolean>();
  pagination: Pagination = new Pagination();
  userPreferredLanguage: string;
  beeLanguageCode: string;
  allLanguagesList: any = [];
  loginScreenDirection: string = 'Center';
  vendorTierTeamMember: boolean = false;
  contactsCount = false;
  leftSideMenuLoader = false;
  partnershipEstablishedOnlyWithPrmAndLoggedInAsPartner = false;
  partnershipEstablishedOnlyWithPrm = false;
  folders = false;
  reloadLoginPage = false;
  lmsAccess = false;
  mdf = false;
  leadsAndDeals = false;
  dashboardTypes = [];
  mdfAccessAsPartner = false;
  opportunitiesAccessAsPartner = false;
  unauthorized = false;
  customSkinSettings = false;
  moduleNames: Array<ModuleCustomName> = new Array<ModuleCustomName>();
  partnerModule: ModuleCustomName = new ModuleCustomName();
  beeHostApi = "";
  beeRequestType = "";
  beePageClientId = "";
  beePageClientSecret = "";
  vendorCompanyId = 0;
  /***** XNFR-238 *********** */
  isDarkForCharts: boolean = false;
  isDefaultTheme: boolean = true;
  isCustomFooter: boolean = false;
  isCustomTheme: boolean = false;
  isLightTheme: boolean = false;
  isDarkTheme: boolean = false;
  isDarkForNeoWhite: boolean = false;

  isTop: boolean = false;
  isLeft: boolean = false;
  isFoter: boolean = false;
  isMain: boolean = false;
  customMap = new Map<string, CustomSkin>();
  themeMap = new Map<string, ThemeDto>();
  themeDto: ThemeDto = new ThemeDto();
  activateThemeId: number;
  vanityLoginDtoForTheme: VanityLoginDto = new VanityLoginDto();
  /***** XNFR-238*********** */
  /********  XNFR-233*****/
  lognTemplateId: number;
  loginType: string;
  v_companyBgImagePath2;
  /**** XNFR-233 */
  formBackground = "";
  /*** XNFR-416 ****/
  isstyleTWoBgColor: boolean;
  /*** XNFR-416 ****/
  constructor(public envService: EnvService, private http: Http, private router: Router, private utilService: UtilService, public xtremandLogger: XtremandLogger, public translateService: TranslateService) {
    this.SERVER_URL = this.envService.SERVER_URL;
    this.APP_URL = this.envService.CLIENT_URL;
    this.DOMAIN_URL = this.APP_URL;
    this.REST_URL = this.SERVER_URL + 'xtremand-rest/';
    if (this.SERVER_URL.indexOf('localhost') > -1) {
      this.MEDIA_URL = 'http://localhost:8000/';
    } else {
      this.MEDIA_URL = this.SERVER_URL + 'vod/';
    }

    this.SHARE_URL = this.SERVER_URL + 'embed/';
    if (this.SERVER_URL == "https://xamp.io/" && this.APP_URL == "https://xamplify.io/") {
      console.log("production keys are used");
      this.clientId = this.envService.clientId;
      this.clientSecret = this.envService.clientSecret;
      this.beePageClientId = this.envService.beePageProdClientId;
      this.beePageClientSecret = this.envService.beePageProdClientSecret;
    } else if (this.SERVER_URL == "https://aravindu.com/" && this.APP_URL == "https://xamplify.co/") {
      console.log("QA keys are used");
      this.clientId = this.envService.beeTemplateQAClientId;
      this.clientSecret = this.envService.beeTemplateQAClientSecret;
      this.beePageClientId = this.envService.beePageQAClientId;
      this.beePageClientSecret = this.envService.beePageQAClientSecret;
    } else if (this.SERVER_URL == "https://release.xamp.io/" && this.APP_URL == "https://xtremand.com/") {
      console.log("Release keys are used");
      this.clientId = this.envService.beeTemplateReleaseClientId;
      this.clientSecret = this.envService.beeTemplateReleaseClientSecret;
      this.beePageClientId = this.envService.beePageReleaseClientId;
      this.beePageClientSecret = this.envService.beePageReleaseClientSecret;
    } else {
      console.log("dev keys are used");
      this.clientId = this.envService.beeTemplateDevClientId;
      this.clientSecret = this.envService.beeTemplateDevClientSecret;
      this.beePageClientId = this.envService.beePageDevClientId;
      this.beePageClientSecret = this.envService.beePageDevClientSecret;
    }

    this.beeHostApi = this.envService.beeHostApi;
    this.beeRequestType = this.envService.beeRequestType;
    this.imagesHost = this.envService.imagesHost;
    this.vendorRoleHash = this.envService.vendorRoleHash;
    this.partnerRoleHash = this.envService.partnerRoleHash;
    this.userLoggedIn.next(false);
  }



  setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

  getOptions(): RequestOptions {
    let options: RequestOptions;
    // check access_token is expired
    if (!this.logged_in_time) { this.logged_in_time = new Date(); }
    const loggedInSinceSeconds = Math.abs(new Date().getTime() - this.logged_in_time.getTime()) / 1000;
    if (loggedInSinceSeconds < this.expires_in) {
      // add authorization header with access token
      const headers = new Headers({ 'Authorization': 'Bearer ' + this.access_token });
      options = new RequestOptions({ headers: headers });
    } else {
      // access token expired, get the new one
    }
    return options;
  }

  login(authorization: string, body: string, userName: string) {
    const url = this.REST_URL + 'oauth/token';
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', authorization);
    const options = { headers: headers };
    return this.http.post(url, body, options).map((res: Response) => {
      this.map = res.json();
      return this.map;
    }).flatMap((map) => this.getVanityURLUserRoles(userName, this.map.access_token).map((response: any) => {
      this.vanityURLUserRoles = response.data;
    }))
      .flatMap((map) => this.http.post(this.REST_URL + 'admin/getUserByUserName?userName=' + userName
        + '&access_token=' + this.map.access_token, '')
        .map((res: Response) => {
          const userToken = {
            'userName': userName,
            'userId': res.json().id,
            'accessToken': this.map.access_token,
            'refreshToken': this.map.refresh_token,
            'expiresIn': this.map.expires_in,
            'hasCompany': res.json().hasCompany,
            'roles': res.json().roles,
            'campaignAccessDto': res.json().campaignAccessDto,
            'logedInCustomerCompanyNeme': res.json().companyName,
            'source': res.json().source
          };

          if (this.vanityURLEnabled && this.companyProfileName && this.vanityURLUserRoles) {
            userToken['roles'] = this.vanityURLUserRoles;
          }

          this.translateService.use(res.json().preferredLanguage);

          localStorage.setItem('currentUser', JSON.stringify(userToken));
          localStorage.setItem('defaultDisplayType', res.json().modulesDisplayType);
          this.access_token = this.map.access_token;
          this.refresh_token = this.map.refresh_token;
          this.expires_in = this.map.expires_in;
          this.user = res.json();
          this.userProfile = res.json();
          this.logedInCustomerCompanyNeme = res.json().companyName;
          this.setUserLoggedIn(true);
        }));
  }
  getUserByUserName(userName: string) {
    return this.http.post(this.REST_URL + 'admin/getUserByUserName?userName=' + userName + '&access_token=' + this.access_token, '')
      .map((res: Response) => { return res.json(); })
      .catch((error: any) => { return error; });
  }
  getUserOpportunityModule(userId: number) {
    return this.http.get(this.REST_URL + 'admin/getUserOppertunityModule/' + userId + '?access_token=' + this.access_token)
      .map((res: Response) => { return res.json(); })
      .catch((error: any) => { return error; });
  }

  getCategoryNamesByUserId(userId: number) {
    let url = this.REST_URL + "category/listAllCategoryNamesByLoggedInUserId/" + userId;
    return this.http.get(url + '?access_token=' + this.access_token)
      .map((res: Response) => { return res.json(); })
      .catch((error: any) => { return error; });
  }


  getUserId(): number {
    try {
      let userId;
      if (!this.user.id) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          userId = JSON.parse(currentUser)['userId'];
        }

      } else {
        userId = this.user.id;
      }
      return userId;
    } catch (error) {
      this.xtremandLogger.error('error' + error);
    }
  }

  getSource() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser != null) {
      return currentUser.source;
    }
  }
  hasCompany(): boolean {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser != null) {
        return currentUser.hasCompany;
      }
    } catch (error) { this.xtremandLogger.log('error' + error); }
  }
  getRoles(): any {
    try {

      let roleNames: string[] = [];
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser != null) {
        const roles = JSON.parse(currentUser)['roles'];
        roleNames = roles.map(function (a) { return a.roleName; });
        if (!roleNames && this.user.roles) { roleNames = this.user.roles.map(function (a) { return a.roleName; }); }
        return roleNames;
      }
    } catch (error) {
      this.xtremandLogger.log('error' + error);
    }

  }
  showRoles(): string {
    try {
      const roleNames = this.getRoles();
      /***********Org Admin**************/
      if (roleNames) {
        const isOrgAdmin = roleNames.indexOf(this.roleName.orgAdminRole) > -1;
        const isPartner = roleNames.indexOf(this.roleName.companyPartnerRole) > -1;
        const isVendor = roleNames.indexOf(this.roleName.vendorRole) > -1;
        const isMarketingRole = roleNames.indexOf(this.roleName.marketingRole) > -1;
        const isVendorTierRole = roleNames.indexOf(this.roleName.vendorTierRole) > -1;
        const isPrmRole = roleNames.indexOf(this.roleName.prmRole) > -1;
        /* const isPartnerAndTeamMember = roleNames.indexOf(this.roleName.companyPartnerRole)>-1 &&
         (roleNames.indexOf(this.roleName.contactsRole)>-1 || roleNames.indexOf(this.roleName.campaignRole)>-1);*/
        if (roleNames.length === 1) {
          return "User";
        } else {
          if (isOrgAdmin && isPartner) {
            return "Orgadmin & Partner";
          } else if (isVendor && isPartner) {
            return "Vendor & Partner";
          } else if (isOrgAdmin) {
            return "Orgadmin";
          } else if (isVendor) {
            return "Vendor";
          } else if (isMarketingRole && !isPartner) {
            return "Marketing";
          } else if (isMarketingRole && isPartner) {
            return "Marketing & Partner";
          } else if (isPrmRole && !isPartner) {
            return "Prm";
          } else if (isPrmRole && isPartner) {
            return "Prm & Partner";
          } else if (isVendorTierRole) {
            return "Vendor Tier";
          } else if (this.isOnlyPartner()) {
            return "Partner";
          } else {
            return "Team Member";
          } /*else if ( isPartnerAndTeamMember ) {
                return "Partner & Team Member";
            }  else if(roleNames.length>2 && isPartner) {
                return "Team Member & Partner";
            }*/
        }
      }
    } catch (error) {
      this.xtremandLogger.log('error' + error);
    }
  }

  isOnlyPartner() {
    try {
      const roleNames = this.getRoles();
      return roleNames && roleNames.indexOf('ROLE_USER') > -1 && roleNames.indexOf('ROLE_COMPANY_PARTNER') > -1
        && roleNames.indexOf('ROLE_VENDOR') < 0 && roleNames.indexOf('ROLE_ORG_ADMIN') < 0 &&
        roleNames.indexOf('ROLE_MARKETING') < 0;
    } catch (error) {
      this.xtremandLogger.log('error' + error);
    }
  }

  isOnlyUser() {
    try {
      const roleNames = this.getRoles();
      if (roleNames && roleNames.length === 1 && (roleNames.indexOf('ROLE_USER') > -1)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.xtremandLogger.log('error' + error);
    }
  }


  isSuperAdmin() {
    try {
      const roleNames = this.getRoles();
      if (roleNames && roleNames.length === 1 && (roleNames.indexOf('ROLE_SUPER_ADMIN') > -1)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.xtremandLogger.log('error' + error);
    }
  }

  isVendor() {
    try {
      const roleNames = this.getRoles();
      if (roleNames && roleNames.length === 2 && (roleNames.indexOf(this.roleName.userRole) > -1 && (roleNames.indexOf(this.roleName.vendorRole) > -1) || roleNames.indexOf(this.roleName.vendorTierRole) > -1 || roleNames.indexOf(this.roleName.prmRole) > -1)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.xtremandLogger.log('error' + error);
    }
  }

  isMarketingRole() {
    try {
      const roleNames = this.getRoles();
      return roleNames && roleNames.length === 2 && (roleNames.indexOf(this.roleName.userRole) > -1 && roleNames.indexOf(this.roleName.marketingRole) > -1);

    } catch (error) {
      this.xtremandLogger.log('error' + error);
    }
  }
  hasOnlyVideoRole() {
    try {
      const roleNames = this.getRoles();
      if (roleNames && roleNames.length === 2 && (roleNames.indexOf('ROLE_USER') > -1 && roleNames.indexOf(this.roleName.videRole) > -1)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.xtremandLogger.log('error' + error);
    }
  }
  hasVideoRole() {
    try {
      const roleNames = this.getRoles();
      if (roleNames && (roleNames.indexOf('ROLE_USER') > -1 && roleNames.indexOf(this.roleName.videRole) > -1)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.xtremandLogger.log('error' + error);
    }
  }
  isPartner() {
    try {
      const roleNames = this.getRoles();
      if (roleNames && roleNames.indexOf('ROLE_COMPANY_PARTNER') > -1) {
        return true;
      } else {
        return false;
      }
    } catch (error) { this.xtremandLogger.log('error' + error); }
  }
  isOrgAdmin() {
    try {
      const roleNames = this.getRoles();
      if (roleNames && roleNames.indexOf('ROLE_ORG_ADMIN') > -1) {
        return true;
      } else { return false; }
    } catch (error) { this.xtremandLogger.log('error' + error); }
  }
  isOrgAdminPartner() {
    try {
      const roleNames = this.getRoles();
      if (roleNames && ((roleNames.indexOf('ROLE_ORG_ADMIN') > -1 || (roleNames.indexOf('ROLE_ALL') > -1)) && roleNames.indexOf('ROLE_COMPANY_PARTNER') > -1) && !this.hasOnlyPartnerRole && !this.isPartnerTeamMember) {
        return true;
      } else {
        return false;
      }
    } catch (error) { this.xtremandLogger.log('error' + error); }
  }
  isVendorPartner() {
    try {
      const roleNames = this.getRoles();
      if (roleNames && ((roleNames.indexOf(this.roleName.vendorRole) > -1 || roleNames.indexOf(this.roleName.vendorTierRole) > -1 || roleNames.indexOf(this.roleName.prmRole) > -1 || (roleNames.indexOf('ROLE_ALL') > -1)) && roleNames.indexOf('ROLE_COMPANY_PARTNER') > -1) && !this.hasOnlyPartnerRole && !this.isPartnerTeamMember) {
        return true;
      } else {
        return false;
      }
    } catch (error) { this.xtremandLogger.log('error' + error); }
  }
  isMarketingPartner() {
    try {
      const roleNames = this.getRoles();
      if (roleNames && ((roleNames.indexOf(this.roleName.marketingRole) > -1) && roleNames.indexOf('ROLE_COMPANY_PARTNER') > -1) && !this.hasOnlyPartnerRole && !this.isPartnerTeamMember) {
        return true;
      } else {
        return false;
      }
    } catch (error) { this.xtremandLogger.log('error' + error); }
  }
  isTeamMember() {
    try {
      const roleNames = this.getRoles();
      if ((roleNames && !this.isSuperAdmin() && !this.isOrgAdmin() && !this.isOrgAdminPartner() && !this.isPartner() && !this.isVendor() && !this.isVendorPartner() && ((roleNames.indexOf('ROLE_VIDEO_UPLOAD') > -1) || (roleNames.indexOf('ROLE_CAMPAIGN') > -1) || (roleNames.indexOf('ROLE_CONTACT') > -1) || (roleNames.indexOf('ROLE_EMAIL_TEMPLATE') > -1)
        || (roleNames.indexOf('ROLE_STATS') > -1) || (roleNames.indexOf('ROLE_SOCIAL_SHARE') > -1)))) {
        return true;
      } else {
        return false;
      }
    } catch (error) { this.xtremandLogger.log('error' + error); }
  }

  hasAllAccess() {
    try {
      const roles = this.getRoles();
      if (roles) {
        if (roles && roles.indexOf('ROLE_ALL') > -1 || roles.indexOf('ROLE_ORG_ADMIN') > -1) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) { console.log('error' + error); }
  }

  removeZenDeskScript() {
    var element = document.getElementById('ze-snippet');
    if (element != null) {
      element.parentNode.removeChild(element);
    }
    $('#launcher').contents().find('#Embed').hide();
  }

  navigateToUnauthorizedPage() {
    this.resetData();
    this.closeSwal();
  }

  resetData() {
    this.removeZenDeskScript();
    localStorage.removeItem('currentUser');
    localStorage.removeItem("campaignRouter");
    localStorage.removeItem("superiorId");
    localStorage.removeItem("logedInCustomerCompanyNeme");
    localStorage.clear();
    this.utilService.topnavBareLoading = false;
    this.isCompanyAdded = false;
    let module = this.module;
    module.isOrgAdmin = false;
    this.isShowContact = false;
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

    module.hasFormAccess = false;
    module.hasLandingPageAccess = false;
    module.hasPartnerLandingPageAccess = false;
    module.hasLandingPageCampaignAccess = false;

    module.isAddingPartnersAccess = false;

    this.isAddedByVendor = false;
    this.vendorTierTeamMember = false;
    this.isPartnerTeamMember = false;
    this.loggedInUserRole = "";
    this.hasOnlyPartnerRole = false;
    module.isOnlyPartner = false;
    module.isReDistribution = false;
    module.isPartnershipEstablishedOnlyWithVendorTier = false;
    module.damAccessAsPartner = false;
    module.damAccess = false;
    module.lmsAccess = false;
    module.lmsAccessAsPartner = false;
    module.playbookAccess = false;
    module.playbookAccessAsPartner = false;
    module.hasPartnerLandingPageAccess = false;
    module.isMarketing = false;
    module.isPrm = false;
    module.isPrmTeamMember = false;
    module.isPrmAndPartner = false;
    module.isPrmAndPartnerTeamMember = false;
    module.isVendorTier = false;
    module.isVendorTierTeamMember = false;
    module.isVendorTierAndPartner = false;
    module.isVendorTierAndPartnerTeamMember = false;
    module.showCampaignsAnalyticsDivInDashboard = false;
    module.showContent = false;
    module.contentDivsCount = 0;
    module.contentLoader = false;
    module.showPartnerEmailTemplatesFilter = false;
    module.isAnyAdminOrSupervisor = false;
    module.allBoundSamlSettings = false;
    module.notifyPartners = false;
    module.opportunitiesAccessAsPartner = false;
    module.isOnlyPartnerCompany = false;
    module.showAddLeadsAndDealsOptionInTheDashboard = false;
    module.showCampaignOptionInManageVideos = false;
    module.createCampaign = false;
    module.loggedInThroughXamplifyUrl = false;
    module.loggedInThroughVendorVanityUrl = false;
    module.loggedInThroughOwnVanityUrl = false;
    module.adminOrSuperVisor = false;
    this.isShowRedistribution = false;
    this.enableLeads = false;
    this.contactsCount = false;
    this.partnershipEstablishedOnlyWithPrmAndLoggedInAsPartner = false;
    this.partnershipEstablishedOnlyWithPrm = false;
    this.folders = false;
    this.lmsAccess = false;
    this.isVendorAndPartnerTeamMember = false;
    this.isOrgAdminAndPartnerTeamMember = false;
    this.opportunitiesAccessAsPartner = false;
    module.isMarketing = false;
    module.isMarketingTeamMember = false;
    module.isMarektingAndPartner = false;
    module.isMarketingAndPartnerTeamMember = false;
    module.isMarketingCompany = false;
    module.isPrmCompany = false;
    module = new Module();
    this.vendorCompanyId = 0;
    this.setUserLoggedIn(false);
  }

  logout(): void {
    this.module.logoutButtonClicked = true;
    $("body").addClass("logout-loader");
    this.resetData();
    this.access_token = null;
    this.refresh_token = null;
    if (!this.router.url.includes('/userlock')) {
      if (this.vanityURLEnabled && this.envService.CLIENT_URL.indexOf("localhost") < 0) {
        this.closeSwal();
        window.location.href = "https://" + window.location.hostname + "/login";
      } else {
        if (this.envService.CLIENT_URL === 'https://xamplify.io/') {
          window.location.href = 'https://www.xamplify.com/';
        } else {
          this.closeSwal();
          let self = this;
          if (this.envService.CLIENT_URL == "http://localhost:4200/") {
            // window.location.href = 'http://localhost:4200/login';
            setTimeout(() => {
              self.router.navigate(['/']);
              $("body").removeClass("logout-loader");
            }, 1500);
          } else {
            window.location.href = this.envService.CLIENT_URL + "login";
          }
        }
      }
    }
  }

  closeSwal() {
    try {
      swal.close();
    } catch (error) {
      console.log(error);
    }
  }

  navigateToDashboardIfUserExists() {
    try {
      if (localStorage.getItem('currentUser')) { this.router.navigate(["/home/dashboard/default"]); }
    } catch (error) { this.xtremandLogger.log('error' + error); }
  }

  checkIsPartnerToo() {
    let roles = this.showRoles();
    if (roles == "Vendor & Partner" || roles == "Orgadmin & Partner") {
      return true;
    } else { return false; }
  }

  checkLoggedInUserId(userId) {
    if (this.isSuperAdmin()) { userId = this.selectedVendorId; }
    return userId;
  }

  getModulesByUserId() {
    let userId = this.getUserId();
    /*****XNFR-83***********/
    // let domainName = this.getSubDomain();
    // let url = "";
    // if(domainName.length>0){
    //   url = this.REST_URL + 'module/getAvailableModules/' + userId +'/'+domainName+ '?access_token=' + this.access_token;
    // }else{
    //   url = this.REST_URL + 'module/getAvailableModules/' + userId + '?access_token=' + this.access_token;
    // }
    return this.http.get(this.REST_URL + 'module/getAvailableModules/' + userId + '?access_token=' + this.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }


  connect() {
    let url = this.REST_URL + "socket";//`http://release.xamp.io/websocket-backend-example/socket`
    let socket = new SockJs(url);
    let stompClient = Stomp.over(socket);
    return stompClient;
  }
  getSMSServiceModule(userId: number) {
    return this.http.get(this.REST_URL + 'admin/getSMSServiceModule/' + userId + '?access_token=' + this.access_token)
      .map((res: Response) => { return res.json(); })
      .catch((error: any) => { return error; });
  }
  getSamlSecurityAlias(alias) {
    return this.http.get(this.REST_URL + 'saml/sso/getUserName/' + alias)
      .map((res: Response) => { return res.json(); })
      .catch((error: any) => { return error; });
  }
  getSamlsecurityAccessToken(userEmail: any) {
    return this.http.get(this.REST_URL + 'saml/sso/at?userName=' + userEmail)
      .map((res: Response) => { return res.json(); })
      .catch((error: any) => { return error; });
  }

  checkSamlSettingsUserRoles() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser !== undefined && currentUser != null) {
      let roles = JSON.parse(currentUser)['roles'];
      let rolesExists = roles.filter(role => role.roleId === 13 || role.roleId === 2 || role.roleId === 18 || role.roleId === 19 || role.roleId == 20);
      if (rolesExists.length > 0) {
        return true;
      }
    }
  }

  forceToLogout() {
    this.sessinExpriedMessage = "Your role has been changed. Please login again.";
    this.logout();
  }

  revokeAccessToken() {
    this.navigateToUnauthorizedPage();
  }


  checkPartnerAccess(userId: number) {
    return this.http.get(this.REST_URL + "admin/hasPartnerAccess/" + userId + "?access_token=" + this.access_token, "")
      .map(this.extractData)
      .catch(this.handleError);
  }

  addVanityUrlFilterDTO(dto: DashboardAnalyticsDto) {
    if (this.getUserId()) {
      dto.userId = this.getUserId();
    }
    let companyProfileName = this.companyProfileName;
    if (companyProfileName != undefined && companyProfileName != "") {
      dto.vanityUrlFilter = true;
      dto.vendorCompanyProfileName = companyProfileName;
    } else {
      dto.vanityUrlFilter = false;
    }
    return dto;
  }


  getVanityURLUserRoles(userName: string, at: string) {
    this.dashboardAnalyticsDto = this.addVanityUrlFilterDTO(this.dashboardAnalyticsDto);
    return this.http.post(this.REST_URL + 'v_url/userRoles?userName=' + userName + '&access_token=' + at, this.dashboardAnalyticsDto)
      .map((res: Response) => { return res.json(); })
      .catch((error: any) => { return error; });
  }

  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  handleError(error: any) {
    return Observable.throw(error);
  }
  setVanityUrlFilter(pagination: Pagination) {
    if (this.companyProfileName !== undefined && this.companyProfileName !== '') {
      pagination.vendorCompanyProfileName = this.companyProfileName;
      pagination.vanityUrlFilter = true;
    }
  }

  getRoleDetails(userId: number) {
    return this.http.get(this.REST_URL + "module/getRoleDetails/" + userId + "?access_token=" + this.access_token, "")
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUrls() {
    let vanityLoginDto = new VanityLoginDto();
    if (this.companyProfileName !== undefined && this.companyProfileName !== '') {
      vanityLoginDto.vendorCompanyProfileName = this.companyProfileName;
      vanityLoginDto.vanityUrlFilter = true;
    }
    vanityLoginDto.userId = this.getUserId();
    return this.http.post(this.REST_URL + "admin/getUrls?access_token=" + this.access_token, vanityLoginDto)
      .map(this.extractData)
      .catch(this.handleError);
  }

  authorizeUrl(url: string) {
    let angularUrlInput = {};
    let browserUrl = window.location.hostname;
    if (!browserUrl.includes("release") && !browserUrl.includes("192.168")) {
      let domainName = browserUrl.split('.');
      if (domainName.length > 2) {
        angularUrlInput['vendorCompanyProfileName'] = domainName[0];
        angularUrlInput['vanityUrlFilter'] = true;
      }
    }
    angularUrlInput['userId'] = this.getUserId();
    angularUrlInput['url'] = url;
    return this.http.post(this.REST_URL + "admin/authorizeUrl?access_token=" + this.access_token, angularUrlInput)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getModuleAccessByLoggedInUserId() {
    return this.http.get(this.REST_URL + "module/getModuleDetails/" + this.getUserId() + "?access_token=" + this.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  isSpfConfigured(companyId: number) {
    return this.http.get(this.REST_URL + `admin/isSpfConfigured/${companyId}?access_token=${this.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveAsDefaultTemplate(input: any) {
    return this.http.post(this.REST_URL + "superadmin/saveAsDefaultTemplate?access_token=" + this.access_token, input)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteDefaultTemplate(id: number) {
    return this.http.get(this.REST_URL + "superadmin/deleteDefaultTemplate/" + id + "/" + "?access_token=" + this.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /*************Unsubscribe Reasons************* */
  findAll(pagination: Pagination) {
    pagination.userId = this.getUserId();
    return this.http.post(this.REST_URL + "unsubscribe/findAll?access_token=" + this.access_token, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveOrUpdateUnsubscribeReason(unsubscribeReason: UnsubscribeReason, isAdd: boolean) {
    unsubscribeReason.createdUserId = this.getUserId();
    let url = isAdd ? 'save' : 'update';
    return this.http.post(this.REST_URL + "unsubscribe/" + url + "?access_token=" + this.access_token, unsubscribeReason)
      .map(this.extractData)
      .catch(this.handleError);
  }

  findUnsubscribeReasonById(id: number) {
    return this.http.get(this.REST_URL + "unsubscribe/findById/" + id + "?access_token=" + this.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteUnsubscribeReasonById(id: number) {
    return this.http.get(this.REST_URL + "unsubscribe/delete/" + id + "?access_token=" + this.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  findHeaderAndFooterText() {
    return this.http.get(this.REST_URL + "unsubscribe/findHeaderAndFooterText/" + this.getUserId() + "?access_token=" + this.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateHeaderAndFooterText(unsubscribePageDetails: UnsubscribePageDetails) {
    unsubscribePageDetails.userId = this.getUserId();
    return this.http.post(this.REST_URL + "unsubscribe/updateHeaderAndFooterText?access_token=" + this.access_token, unsubscribePageDetails)
      .map(this.extractData)
      .catch(this.handleError);
  }


  findUnsusbcribePageContent() {
    return this.http.get(this.REST_URL + "unsubscribe/findUnsubscribePageContent/" + this.getUserId() + "?access_token=" + this.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  findNotifyPartnersOption(companyId: number) {
    return this.http.get(this.REST_URL + `admin/findNotifyPartnersOption/${companyId}?access_token=${this.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateNotifyPartnersOption(companyId: number, status: boolean) {
    return this.http.get(this.REST_URL + "admin/updateNotifyPartnersOption/" + companyId + "/" + status + "?access_token=" + this.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**********Team Member Groups***************/
  findAllTeamMemberGroupIdsAndNames(addDefaultOption: boolean) {
    let userId = this.getUserId();
    var url = this.REST_URL + "teamMemberGroup/findAllGroupIdsAndNames/" + userId + "/" + addDefaultOption + "?access_token=" + this.access_token;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  findAllTeamMembersByGroupId(pagination: Pagination) {
    var url = this.REST_URL + "teamMember/findAllTeamMembersByGroupId?access_token=" + this.access_token;
    return this.http.post(url, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  findSelectedTeamMemberIds(partnershipId: number) {
    var url = this.REST_URL + "teamMemberGroup/findSelectedTeamMemberIds/" + partnershipId + "?access_token=" + this.access_token;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  showPartnersFilter() {
    var url = this.REST_URL + "admin/showPartnersFilter/" + this.getUserId() + "?access_token=" + this.access_token;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  isMarketingCompany() {
    var url = this.REST_URL + "admin/isMarketingCompany/" + this.getUserId() + "?access_token=" + this.access_token;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  isPartnershipOnlyWithPrm() {
    var url = this.REST_URL + "admin/partnershipOnlyWithPrm/" + this.getUserId() + "?access_token=" + this.access_token;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }


  previewTeamMemberGroup(id: number) {
    const url = this.REST_URL + "teamMemberGroup/previewById/" + id + "?access_token=" + this.access_token;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }
  /*********XNFR-83************/
  getAssigedAgencyModules(id: number) {
    const url = this.REST_URL + "agencies/" + id + "/assignedModules?access_token=" + this.access_token;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /*********XNFR-83************/
  getSubDomain() {
    return this.companyProfileName !== undefined && this.companyProfileName !== '' ? this.companyProfileName : "";
  }

  /*********XNFR-83************/
  getCompanyAndUserAndModuleDetails(moduleType: string, id: number) {
    let url = this.REST_URL + "comments/companyAndUserDetails/" + moduleType + "/" + id + "?access_token=" + this.access_token;
    return this.callGetMethod(url);
  }

  /*********XNFR-83************/
  saveComment(commentDto: CommentDto) {
    commentDto.commentedBy = this.getUserId();
    let url = this.REST_URL + "comments?access_token=" + this.access_token;
    return this.http.post(url, commentDto)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /*********XNFR-83************/
  findComments(moduleName: string, id: number) {
    let url = this.REST_URL + "comments/moduleName/" + moduleName + "/" + id + "?access_token=" + this.access_token;
    return this.callGetMethod(url);
  }

  /*********XNFR-83************/
  findHistory(id: number, moduleId: number) {
    let url = this.REST_URL + "comments/agencyContentStatusHistory/id/" + id + "/moduleId/" + moduleId + "?access_token=" + this.access_token;
    return this.callGetMethod(url);
  }

  /****XNFR-83****/
  findCampaignAccessDataByDomainName(domainName: string) {
    let url = this.REST_URL + "admin/campaignAccess/domainName/" + domainName + "?access_token=" + this.access_token;
    return this.callGetMethod(url);
  }

  /****XNFR-224****/
  sendLoginAsPartnerEmailNotification(loginAsEmailNotificationDto: LoginAsEmailNotificationDto) {
    let url = this.REST_URL + "admin/sendLoginAsPartnerEmailNotification" + "?access_token=" + this.access_token;
    return this.callPostMethod(url, loginAsEmailNotificationDto);
  }

  /******XNFR-255******/
  findShareWhiteLabelContentAccess() {
    let companyProfileName = this.getSubDomain();
    let url = this.REST_URL + "admin/shareWhiteLabelContentAccess/";
    if (companyProfileName != "") {
      url += "companyProfileName/" + companyProfileName;
    } else {
      url += "loggedInUserId/" + this.getUserId();
    }
    let apiUrl = url + "?access_token=" + this.access_token;
    return this.callGetMethod(apiUrl);

  }

  /*****XNFR-278****/
  findGroupsForMerging(pagination: Pagination) {
    let url = this.REST_URL + "userlists/findGroupsForMerging?access_token=" + this.access_token;
    pagination.userId = this.getUserId();
    return this.callPostMethod(url, pagination);
  }

  copyUsersToUserGroups(copyGroupUsersDto: CopyGroupUsersDto) {
    let url = this.REST_URL + "userlists/copyGroupUsers?access_token=" + this.access_token;
    copyGroupUsersDto.loggedInUserId = this.getUserId();
    return this.callPostMethod(url, copyGroupUsersDto);
  }
  /*****XNFR-278****/

  /****XNFR-317****/
  getTemplateHtmlBodyAndMergeTagsInfo(id: number) {
    let url = this.REST_URL + "email-template/getHtmlBodyAndMergeTags?access_token=" + this.access_token;
    let map = {};
    map['id'] = id;
    map['emailId'] = this.user.emailId;
    return this.callPostMethod(url, map);
  }

  sendTestEmail(sendTestEmailDto: SendTestEmailDto) {
    sendTestEmailDto.fromEmail = this.user.emailId;
    let url = this.REST_URL + "email-template/sendTestEmail?access_token=" + this.access_token;
    return this.callPostMethod(url, sendTestEmailDto);
  }

  sendCampaignTestEmail(data: any) {
    let url = this.REST_URL + "admin/sendTestEmail?access_token=" + this.access_token;
    return this.callPostMethod(url, data);
  }

  /******XNFR-326******/
  findAssetPublishEmailNotificationOption() {
    let companyProfileName = this.getSubDomain();
    let url = this.REST_URL + "admin/assetPublishedEmailNotification/";
    if (companyProfileName != "") {
      url += "companyProfileName/" + companyProfileName;
    } else {
      url += "loggedInUserId/" + this.getUserId();
    }
    let apiUrl = url + "?access_token=" + this.access_token;
    return this.callGetMethod(apiUrl);
  }

  findTrackOrPlaybookPublishEmailNotificationOption(type: any) {
    let isTrack = type == TracksPlayBookType[TracksPlayBookType.TRACK];
    let suffixUrl = isTrack ? "trackPublishedEmailNotification" : "playbookPublishedEmailNotification";
    let companyProfileName = this.getSubDomain();
    let url = this.REST_URL + "admin/" + suffixUrl + "/";
    if (companyProfileName != "") {
      url += "companyProfileName/" + companyProfileName;
    } else {
      url += "loggedInUserId/" + this.getUserId();
    }
    let apiUrl = url + "?access_token=" + this.access_token;
    return this.callGetMethod(apiUrl);
  }
  /****XNFR-317****/
  findAllTeamMembers(pagination: Pagination) {
    pagination.userId = this.getUserId();
    let url = this.REST_URL + "teamMember/findAll?access_token=" + this.access_token;
    return this.callPostMethod(url, pagination);
  }

  findAllUsers() {
    let url = this.REST_URL + "company/users/" + this.getUserId() + "?access_token=" + this.access_token;
    return this.callGetMethod(url);
  }



  public callGetMethod(url: string) {
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public callPostMethod(url: string, requestDto: any) {
    return this.http.post(url, requestDto)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public callPutMethod(url: string, requestDto: any) {
    return this.http.put(url, requestDto)
      .map(this.extractData)
      .catch(this.handleError);
  }


  public callDeleteMethod(url: string) {
    return this.http.delete(url)
      .map(this.extractData)
      .catch(this.handleError);
  }


  public isLocalHost() {
    return this.envService.CLIENT_URL == "http://localhost:4200/";
  }

  public isQADomain() {
    return this.envService.CLIENT_URL == "https://xamplify.co/";
  }

  public isProductionDomain() {
    return this.envService.CLIENT_URL == "https://xamplify.io/";
  }

  setDomainUrl() {
    if (this.vanityURLEnabled) {
      if (this.isQADomain() || this.isLocalHost()) {
        this.DOMAIN_URL = "https://" + this.getSubDomain() + ".xamplify.co/";
      } else {
        this.DOMAIN_URL = "https://" + this.getSubDomain() + ".xamplify.io/";
      }
    } else {
      this.DOMAIN_URL = this.APP_URL;
    }
  }

  stopLoaders() {
    this.module.contentLoader = false;
    this.leftSideMenuLoader = false;
    this.module.topNavBarLoader = false;
  }


  /***XNFR-326***/
  getPartnerModuleCustomName() {
    return localStorage.getItem("partnerModuleCustomName");
  }

  getDefaultM3U8FileForLocal(videoUrl: string) {
    if (this.envService.CLIENT_URL.indexOf("localhost") > -1) {
      videoUrl = "https://aravindu.com/vod/videos/54888/11082023/Dhoni1691751422924_mobinar.m3u8?access_token=" + this.access_token;
    } else {
      videoUrl = videoUrl + '_mobinar.m3u8?access_token=' + this.access_token;
    }
    return videoUrl;
  }

  getDefault360M3U8FileForLocal(videoUrl: string) {
    if (this.envService.CLIENT_URL.indexOf("localhost") > -1) {
      videoUrl = "https://aravindu.com/vod/videos/54888/27062023/360VideoSCIENCELAB1EscapeTsunamiWave6kDisasterSurvival1687809605028_mobinar.m3u8?access_token=" + this.access_token;
    } else {
      videoUrl = videoUrl + '_mobinar.m3u8?access_token=' + this.access_token;
    }
    return videoUrl;
  }

  navigateToMyProfileSection() {
    this.router.navigate(["/home/dashboard/myprofile"])
  }

  /*** XBI-1968 ***/
  isSpfConfiguredOrDomainConnected(companyId: number) {
    return this.http.get(this.REST_URL + `admin/isSpfConfiguredOrDomainConnected/${companyId}?access_token=${this.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /********XNFR-342****/
  shareSelectedAssets(requestDto: any) {
    let url = this.REST_URL + "dam/shareSelectedAssets?access_token=" + this.access_token;
    return this.callPutMethod(url, requestDto);
  }

  /********XNFR-342****/
  shareSelectedTracksOrPlayBooks(requestDto: any, module: string) {
    let urlPrefix = module == "Tracks" ? 'shareSelectedTracks' : 'shareSelectedPlayBooks';
    let url = this.REST_URL + "lms/" + urlPrefix + "?access_token=" + this.access_token;
    return this.callPutMethod(url, requestDto);
  }

  findPublishedPartnerIdsByUserListIdAndDamId(userListId: number, id: number, moduleName: string) {
    let url = this.REST_URL + moduleName + "/findPublishedPartnerIds/" + userListId + "/" + id + "?access_token=" + this.access_token;
    return this.callGetMethod(url);
  }

  /*******XNFR-423****/
  getCountryNames() {
    let url = this.REST_URL + "/admin/countryNames?access_token=" + this.access_token;
    return this.callGetMethod(url);
  }

  addCountryNamesToList(coutryNames: any, countryNamesArray: any) {
    countryNamesArray.push('Please Select Country');
    for (let i = 0; i < coutryNames.length; i++) {
      countryNamesArray.push(coutryNames[i]);
    }
    return countryNamesArray;
  }


/************XNFR-426 **********/
updateLeadApprovalOrRejectionStatus( companyId: number,leadApprovalStatus:boolean ) {
  return this.http.get( this.REST_URL + "admin/" + "updateLeadApprovalOrRejectionStatus/" + companyId + "/"+leadApprovalStatus+"?access_token=" + this.access_token )
      .map( this.extractData )
      .catch( this.handleError );
}

getLeadApprovalStatus( companyId: number ) {
  return this.http.get( this.REST_URL + "admin/" + "getLeadApprovalStatus/" + companyId + "?access_token=" + this.access_token )
      .map( this.extractData )
      .catch( this.handleError );
}

/***XNFR-454****/
findCompanyDetails(companyProfileName:string) {
  let url = this.REST_URL + "findCompanyDetails/" + companyProfileName;
  return this.callGetMethod(url);
}

signUpAsTeamMember(data: any) {
  let url = this.REST_URL + "signUpAsTeamMember";
  return this.callPostMethod(url,data)
}
unpublishLearingTracks(learningTrackIds:any){
  let url = this.REST_URL + "lms/unpublishLearingTracks?access_token="+this.access_token;
  let data = {};
  data['ids'] = learningTrackIds;
  return this.callPostMethod(url,data)
}

getEmailTemplateHtmlBodyAndMergeTagsInfo(emailTemplateId:number,campaignId:number,isSharedCampaignTemplatePreview:boolean,isWorkflowTemplate:boolean){
  let URL = "";
  if(campaignId!=undefined){
    let vendorCampaignIdOrCampaignIdParameter = isSharedCampaignTemplatePreview ? "vendorCampaignId":"campaignId";
    URL = this.REST_URL+"email-template/preview/"+vendorCampaignIdOrCampaignIdParameter+"/"+campaignId+"/userId/"+this.getUserId()+"?access_token="+this.access_token;
  }else{
    let workflowTemplateOrTemplateIdParameter = isWorkflowTemplate ? "workflowTemplateId":"id";
    URL = this.REST_URL+"email-template/preview/"+workflowTemplateOrTemplateIdParameter+"/"+emailTemplateId+"/userId/"+this.getUserId()+"?access_token="+this.access_token;
  }
  return this.callGetMethod(URL);
}



}
