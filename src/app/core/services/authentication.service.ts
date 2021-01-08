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
import { environment } from '../../../environments/environment';
declare var swal, require: any;
var SockJs = require("sockjs-client");
var Stomp = require("stompjs");
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { DashboardAnalyticsDto } from 'app/dashboard/models/dashboard-analytics-dto';
import { Pagination } from '../../core/models/pagination';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AuthenticationService {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  logged_in_time: Date;
  APP_URL: any;
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
  constructor(public envService: EnvService, private http: Http, private router: Router, private utilService: UtilService, public xtremandLogger: XtremandLogger, public translateService: TranslateService) {
    this.SERVER_URL = this.envService.SERVER_URL;
    this.APP_URL = this.envService.CLIENT_URL;
    this.REST_URL = this.SERVER_URL + 'xtremand-rest/';
    if(this.SERVER_URL.indexOf('localhost')>-1){
      this.MEDIA_URL = 'https://aravindu.com/vod/';
    }else{
      this.MEDIA_URL = this.SERVER_URL + 'vod/';
    }
    
    this.SHARE_URL = this.SERVER_URL + 'embed/';

    this.clientId = this.envService.clientId;
    this.clientSecret = this.envService.clientSecret;
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
    return this.http.get(this.REST_URL + 'category/listAllCategoryNamesByLoggedInUserId/' + userId + '?access_token=' + this.access_token)
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
    } catch (error) { this.xtremandLogger.log('error' + error); this.router.navigate(['/']); }

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
          }else if(isMarketingRole){
            return "Marketing";
          }else if(isMarketingRole && isPartner){
            return "Marketing & Partner";
          }else if(isPrmRole){
            return "Prm";
          }else if(isPrmRole && isPartner){
            return "Prm & Partner";
          }else if(isVendorTierRole){
            return "Vendor Tier";
          }  else if (this.isOnlyPartner()) {
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
  try{
    const roleNames = this.getRoles();
    return roleNames && roleNames.length===2 && (roleNames.indexOf('ROLE_USER')>-1 && roleNames.indexOf('ROLE_COMPANY_PARTNER')>-1);
  }catch(error){
    this.xtremandLogger.log('error'+error);
  }

    //return this.loggedInUserRole == "Partner" && this.isPartnerTeamMember == false; commented on 30/07/2020.
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
      if (roleNames && roleNames.length === 2 && (roleNames.indexOf(this.roleName.userRole) > -1 && ( roleNames.indexOf(this.roleName.vendorRole) > -1) ||  roleNames.indexOf(this.roleName.vendorTierRole) > -1 ||  roleNames.indexOf(this.roleName.prmRole) > -1)) {
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
      if (roleNames && ((roleNames.indexOf(this.roleName.vendorRole) > -1  || roleNames.indexOf(this.roleName.vendorTierRole) > -1 || roleNames.indexOf(this.roleName.prmRole) > -1 || (roleNames.indexOf('ROLE_ALL') > -1)) && roleNames.indexOf('ROLE_COMPANY_PARTNER') > -1) && !this.hasOnlyPartnerRole && !this.isPartnerTeamMember) {
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

  logout(): void {
    this.xtremandLogger.log('Logout');
    // clear token remove user from local storage to log user out
    this.access_token = null;
    this.refresh_token = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem("campaignRouter");
    localStorage.removeItem("superiorId");
    localStorage.removeItem("logedInCustomerCompanyNeme");
    localStorage.clear();
    this.utilService.topnavBareLoading = false;
    this.isCompanyAdded = false;
    const module = this.module;
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
    module.isMarketing = false;
    module.isPrm = false;
    module.isPrmTeamMember = false;
    module.isPrmAndPartner = false;
    module.isPrmAndPartnerTeamMember = false;
    module.showCampaignsAnalyticsDivInDashboard = false;
    this.isShowRedistribution = false;
    this.enableLeads = false;
	  this.contactsCount = false;
    this.partnershipEstablishedOnlyWithPrmAndLoggedInAsPartner = false;
    this.partnershipEstablishedOnlyWithPrm = false;
    this.setUserLoggedIn(false);
    if (!this.router.url.includes('/userlock')) {
      if(this.vanityURLEnabled && this.envService.CLIENT_URL.indexOf("localhost")<0){
        this.closeSwal();
        window.location.href = "https://"+window.location.hostname+"/login";
      }else{
        if (this.envService.CLIENT_URL === 'https://xamplify.io/') {
          window.location.href = 'https://www.xamplify.com/';
        } else {
          this.closeSwal();
          this.router.navigate(['/'])
        }
      }
    }
  }

  closeSwal(){
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
    console.log(userId);
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
      let rolesExists = roles.filter(role => role.roleId === 13 || role.roleId === 2 || role.roleId===18 || role.roleId===19 || role.roleId==20);
      if (rolesExists.length > 0) {
        return true;
      }
    }
  }

  forceToLogout() {
    this.sessinExpriedMessage = "Your role has been changed. Please login again.";
    this.logout();
  }

  revokeAccessToken(){
    let self = this;
    swal(
			{
				title: 'Your token is expried.We are redirecting you to login page.',
				text: "Please Wait...",
				showConfirmButton: false,
				imageUrl: "assets/images/loader.gif",
				allowOutsideClick:false
			}
		);
    setTimeout(function () {
      location.reload();
      self.logout();
    }, 5000);
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
    console.log(body);
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

  getRoleDetails(userId:number) {
    return this.http.get(this.REST_URL + "module/getRoleDetails/" + userId + "?access_token=" + this.access_token, "")
      .map(this.extractData)
      .catch(this.handleError);
  }
}
