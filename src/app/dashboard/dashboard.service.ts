import { DownloadRequestDto } from 'app/util/models/download-request-dto';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SaveVideoFile } from '../videos/models/save-video-file';
import { Pagination } from '../core/models/pagination';
import { AuthenticationService } from '../core/services/authentication.service';
import { SocialConnection } from '../social/models/social-connection';
import { DashboardAnalyticsDto } from "app/dashboard/models/dashboard-analytics-dto";
import { Pipeline } from './models/pipeline';
import {ModuleCustomName} from "app/dashboard/models/module-custom-name";
import { VanityLoginDto } from "app/util/models/vanity-login-dto";
import { LoginAsPartnerDto } from './models/login-as-partner-dto';

import { CompanyThemeActivate } from './models/company-theme-activate';
import { ThemeDto } from './models/theme-dto';

import { UtilService } from 'app/core/services/util.service';
import { EmailNotificationSettingsDto } from './user-profile/models/email-notification-settings-dto';
import { GodaddyDetailsDto } from './user-profile/models/godaddy-details-dto';
import { ReferenceService } from 'app/core/services/reference.service';
import { DomainRequestDto } from './models/domain-request-dto';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';


@Injectable()
export class DashboardService {
  
    
    url = this.authenticationService.REST_URL + "admin/";
    demoUrl = this.authenticationService.REST_URL + "demo/request/";
    superAdminUrl = this.authenticationService.REST_URL + "superadmin/";
    dashboardAnalytics = this.authenticationService.REST_URL + "dashboard/views/";
    moduleUrl = this.authenticationService.REST_URL + "module/";
    upgradeRoleUrl = this.authenticationService.REST_URL + "upgradeRole/";
    domainUrl = this.authenticationService.REST_URL + "domain";
    dashboardAnalyticsUrl = this.authenticationService.REST_URL + "/dashboard/views/";
    QUERY_PARAMETERS = '?access_token=' + this.authenticationService.access_token;
    
    /****XNFR-326****/
    companyUrl = this.authenticationService.REST_URL + "company/";
    emailNotificationSettingsUrl = this.companyUrl+"/emailNotificationSettings";
    /****XNFR-326****/
    saveVideoFile: SaveVideoFile;
    pagination: Pagination;
    sortDates = [{ 'name': '7 Days', 'value': 7 }, { 'name': '14 Days', 'value': 14 },
    { 'name': '21 Days', 'value': 21 }, { 'name': 'Month', 'value': 30 }];

    constructor(private http: Http, private authenticationService: AuthenticationService,private utilService:UtilService,
        private referenceService:ReferenceService,private vanityUrlService:VanityURLService) { }

    getGenderDemographics(socialConnection: SocialConnection): Observable<Object> {
        return this.http.get(this.authenticationService.REST_URL + "twitter/gender-demographics" + this.QUERY_PARAMETERS
            + '&oAuthTokenValue=' + socialConnection.oAuthTokenValue + '&oAuthTokenSecret=' + socialConnection.oAuthTokenSecret)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTwitterSparklinecharts(): Observable<Object> {
        return this.http.get(this.authenticationService.REST_URL + "twitter/dashboard" + this.QUERY_PARAMETERS)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEmailActionCount(userId: number) {
        return this.http.get(this.authenticationService.REST_URL + "dashboard/emaillog-count-by-user/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadEmailWatchedCount(userId: number) {
        return this.http.get(this.authenticationService.REST_URL + "dashboard/watched-users-count/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listEmailOpenLogs(userId: number, actionId: number, pagination: Pagination) {
        return this.http.get(this.authenticationService.REST_URL + "dashboard/email-logs-by-user-and-action/" + userId + "?access_token=" + this.authenticationService.access_token + "&actionId=" + actionId + "&pageSize=" + pagination.maxResults + "&pageNumber=" + pagination.pageIndex)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listEmailClickedLogs(userId: number, pagination: Pagination) {
        return this.http.get(this.authenticationService.REST_URL + "dashboard/email-click-logs-by-user/" + userId + "?access_token=" + this.authenticationService.access_token + "&pageSize=" + pagination.maxResults + "&pageNumber=" + pagination.pageIndex)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listOfWatchedLogs(userId: number, pagination: Pagination) {
        return this.http.get(this.authenticationService.REST_URL + "dashboard/watched-users/" + userId + "?access_token=" + this.authenticationService.access_token + "&pageSize=" + pagination.maxResults + "&pageNumber=" + pagination.pageIndex)
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadRequestedVendorsCount(userId: any) {
        return this.http.get(this.authenticationService.REST_URL + "partnership/vendor-invitations/count/" + userId + "?&access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listOfVendorRequestLogs(pagination: Pagination) {
        const url = this.authenticationService.REST_URL + "partnership/vendor-invitation/analytics?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadDashboardReportsCount(userId: number) {
        return this.http.get(this.authenticationService.REST_URL + "dashboard/analytics_count?userId=" + userId + "&access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadVendorDetails(userId: number, pagination: Pagination) {
        /****XNFR-252*****/
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        /****XNFR-252*****/
        const url = this.authenticationService.REST_URL + 'vendor/details?partnerId=' + userId + '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);

    }

    sendVendorInvitation(userId: number, vendorInvitation: any) {
        const url = this.authenticationService.REST_URL + 'partnership/vendor-invitation/' + userId + '?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, vendorInvitation)
            .map(this.extractData)
            .catch(this.handleError);
    }

    sendWelcomeEmail(vendorInvitation: any, alias: string) {
        vendorInvitation['alias'] = alias;
        const url = this.authenticationService.REST_URL + 'superadmin/account/mail/welcome?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, vendorInvitation)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCountryViewsDetails() {
        const url = this.authenticationService.REST_URL + 'dashboard/countrywise_users_count?userId=' + this.authenticationService.user.id +
            '&access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCampaignsHeatMapDetails(limit: any) {
        const url = this.authenticationService.REST_URL + 'dashboard/heatmap-data?userId=' + this.authenticationService.user.id +
            '&access_token=' + this.authenticationService.access_token + '&limit=' + limit;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getCampaignsEmailReports(campaignIdsList: any) {
        const url = this.authenticationService.REST_URL + 'dashboard/barChart-data?userId=' + this.authenticationService.user.id +
            '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, campaignIdsList)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoStatesInformation(daysCount) {
        const url = this.authenticationService.REST_URL + 'dashboard/videostats-data?userId=' + this.authenticationService.user.id +
            '&access_token=' + this.authenticationService.access_token + '&&daysInterval=' + daysCount;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoViewsLevelOneReports(daysInterval: number, dateValue: any) {
        const url = this.authenticationService.REST_URL + 'dashboard/videostats/views/level1?userId=' +
            this.authenticationService.user.id + '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue +
            '&access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoViewsLevelTwoReports(daysInterval: number, dateValue: any, videoId: number, pagination: Pagination) {
        const url = this.authenticationService.REST_URL + 'dashboard/videostats/views/level2?videoId=' + videoId + '&userId=' +
            this.authenticationService.user.id + '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue +
            '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoMinutesWatchedLevelOneReports(daysInterval: any, dateValue: number) {
        const url = this.authenticationService.REST_URL + 'dashboard/videostats/minuteswatched/level1?userId=' +
            this.authenticationService.user.id + '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue +
            '&access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoMinutesWatchedLevelTwoReports(daysInterval: any, dateValue: number, videoId: number, pagination: Pagination) {
        const url = this.authenticationService.REST_URL + 'dashboard/videostats/minuteswatched/level2?videoId=' + videoId + '&userId=' +
            this.authenticationService.user.id + '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue +
            '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    worldMapCampaignDetails(userId: number, countryCode: string, pagination: any) {
        const url = this.authenticationService.REST_URL + 'dashboard/world-map-detail-report?access_token=' + this.authenticationService.access_token +
            '&userId=' + userId + '&countryCode=' + countryCode;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getVendorsList(pagination: Pagination) {
        const url = this.authenticationService.REST_URL + 'superadmin/analytics?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listTop10RecentUsers() {
        const url = `${this.authenticationService.REST_URL}superadmin/top10?access_token=${this.authenticationService.access_token}`;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVendorsCompanyProfile(vendorId: any) {
        const url = this.authenticationService.REST_URL + 'admin/company-profile/get/' + vendorId + '?access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVendorsMyProfile(vendorEmail: any) {
        const url = this.authenticationService.REST_URL + 'admin/getUserByUserName?access_token=' + this.authenticationService.access_token + '&userName=' + vendorEmail + '&isSuperAdmin=true';
        return this.http.post(url, "")
            .map(this.extractData)
            .catch(this.handleError);
    }
    /**
     *    
     * MArketo Authentication
     */
    checkMarketoCredentials(userId: number) {
        return this.http.get(this.authenticationService.REST_URL + `/marketo/${userId}/checkCredentials?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    checkCustomObjects(userId: number) {
        return this.http.get(this.authenticationService.REST_URL + `/marketo/${userId}/checkCustomObjects?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveMarketoCredentials(formData: any) {
        return this.http.post(this.authenticationService.REST_URL + `/marketo/credentials?access_token=${this.authenticationService.access_token}`, formData)
            .map(this.extractData)
            .catch(this.handleError);
    }

    changeRole(userId: number) {
        return this.http.get(this.authenticationService.REST_URL + `admin/changeRole/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAccess(companyId: number) {
        return this.http.get(this.authenticationService.REST_URL + `admin/getAccess/${companyId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getModulesAccessByUserId() {
        return this.http.get(this.authenticationService.REST_URL + `admin/getModulesAccessByLoggedInUserId/${this.authenticationService.getUserId()}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCompanyDetailsAndUserId(companyId: number, userAlias: string) {
        return this.http.get(this.authenticationService.REST_URL + `superadmin/getUserAndCompanyDetails/${companyId}/${userAlias}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDnsConfigurationDetails(companyId:number){
        return this.http.get(this.authenticationService.REST_URL + `superadmin/getDnsConfigurationDetails/${companyId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getSpfConfigurationDetails(companyId:number){
        return this.http.get(this.authenticationService.REST_URL + `superadmin/getSpfConfigurationDetails/${companyId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateSpfConfigurationDetails(companyId:number,isSpfConfigured:boolean){
        return this.http.get(this.authenticationService.REST_URL + `superadmin/updateSpfConfiguration/${companyId}/${isSpfConfigured}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }


    updateDnsConfigurationDetails(companyId:number,isDnsConfigured:boolean){
        return this.http.get(this.authenticationService.REST_URL + `superadmin/updateDnsConfiguration/${companyId}/${isDnsConfigured}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateCompanyProfileName(companyId:number,companyProfileName:string){
        return this.http.get(this.authenticationService.REST_URL + `superadmin/updateCompanyProfileName/${companyId}/${companyProfileName}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }


    changeAccess(campaignAccess: any) {
        return this.http.post(this.authenticationService.REST_URL + `module/updateAccess?access_token=${this.authenticationService.access_token}`, campaignAccess)
            .map(this.extractData)
            .catch(this.handleError);
    }


    activateOrDeactiveStatus(report: any) {
        let url = "";
        if (report.userStatus == "APPROVED") {
            url = this.authenticationService.REST_URL + "superadmin/account/deactivate?access_token=" + this.authenticationService.access_token;
        } else if (report.userStatus == "UNAPPROVED" || report.userStatus == "DECLINE") {
            url = this.authenticationService.REST_URL + "superadmin/account/activate?access_token=" + this.authenticationService.access_token;
        }
        return this.http.post(url, report)
            .map(this.extractData)
            .catch(this.handleError);
    }


    listDemoRequests(pagination: Pagination) {
        const url = this.demoUrl + 'list?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listAllApprovedUsers(pagination: Pagination) {
        const url = this.superAdminUrl + 'listAllAccounts?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listAllPartners(pagination: Pagination) {
        const url = this.superAdminUrl + 'findPartnerCompaniesAndModulesAccess?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updatePartnerModuleAccess(campaignAccess: any){
        const url = this.superAdminUrl + 'updatePartnerModules?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, campaignAccess)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /******27/03/2020. To get all modules count in dashboard */
    getModuleAnalytics(dto: DashboardAnalyticsDto) {
        /****XNFR-252*****/
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();

        }
        /****XNFR-252*****/
        const url = this.dashboardAnalytics + 'modulesAnalytics?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVendorActivityAnalytics(dto: DashboardAnalyticsDto) {
         /****XNFR-252*****/
         let companyProfileName = this.authenticationService.companyProfileName;
         let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
         if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
            dto.vanityUrlFilter = dto.loginAsUserId!=null && dto.loginAsUserId>0;
 
         }
        /***XNFR-252****/
        const url = this.dashboardAnalytics + 'vendorActivityAnalytics?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listVendorsByLoggedInUserId(userId: number) {
        const url = this.dashboardAnalytics + 'getVendorCompanyDetails/' + userId + '?access_token=' + this.authenticationService.access_token;
        return this.http.get(url, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEmailStats(dto: DashboardAnalyticsDto) {
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.dashboardAnalytics + 'emailStats/?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getRegionalStatistics(dto: DashboardAnalyticsDto) {
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.dashboardAnalytics + 'regionalStatistics/?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listEmailOpenLogsForVanityURL(actionId: number, pagination: Pagination, dto: DashboardAnalyticsDto) {
      let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.authenticationService.REST_URL + "dashboard/views/email-logs-by-user-and-action" + "?access_token=" + this.authenticationService.access_token + "&actionId=" + actionId + "&pageSize=" + pagination.maxResults + "&pageNumber=" + pagination.pageIndex;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listOfWatchedLogsForVanityURL(pagination: Pagination, dto: DashboardAnalyticsDto) {
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.authenticationService.REST_URL + "dashboard/views/watched-users" + "?access_token=" + this.authenticationService.access_token + "&pageSize=" + pagination.maxResults + "&pageNumber=" + pagination.pageIndex;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listEmailClickedLogsForVanityURL(pagination: Pagination, dto: DashboardAnalyticsDto) {
      let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.authenticationService.REST_URL + "dashboard/views/email-click-logs-by-user" + "?access_token=" + this.authenticationService.access_token + "&pageSize=" + pagination.maxResults + "&pageNumber=" + pagination.pageIndex;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    worldMapCampaignDetailsForVanityURL(countryCode: string, pagination: Pagination, dto: DashboardAnalyticsDto) {
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.authenticationService.REST_URL + "dashboard/views/world-map-detail-report?access_token=" + this.authenticationService.access_token +
            "&pageSize=" + pagination.maxResults + "&pageNumber=" + pagination.pageIndex + "&countryCode=" + countryCode;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }


    //Video Stats analytics for VanityURL
    getVideoStatsInformationForVanityURL(daysCount, dto: DashboardAnalyticsDto) {
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.authenticationService.REST_URL + 'dashboard/views/videostats-data?access_token=' + this.authenticationService.access_token + '&daysInterval=' + daysCount;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVideoViewsLevelOneReportsForVanityURL(daysInterval: number, dateValue: any, dto: DashboardAnalyticsDto) {
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.authenticationService.REST_URL + 'dashboard/views/videostats/views/level1?access_token=' + this.authenticationService.access_token +
            '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVideoViewsLevelTwoReportsForVanityURL(daysInterval: number, dateValue: any, videoId: number, pagination: Pagination) {
        const url = this.authenticationService.REST_URL + 'dashboard/views/videostats/views/level2?access_token=' + this.authenticationService.access_token + '&videoId=' + videoId + '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVideoMinutesWatchedLevelOneReportsForVanityURL(daysInterval: any, dateValue: number, dto: DashboardAnalyticsDto) {
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.authenticationService.REST_URL + 'dashboard/views/videostats/minuteswatched/level1?access_token=' + this.authenticationService.access_token + '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoMinutesWatchedLevelTwoReportsForVanityURL(daysInterval: any, dateValue: number, videoId: number, pagination: Pagination) {
        const url = this.authenticationService.REST_URL + 'dashboard/views/videostats/minuteswatched/level2?access_token=' + this.authenticationService.access_token + '&videoId=' + videoId + '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getCampaignsHeatMapDetailsForVanityURL(limit: any, dto: DashboardAnalyticsDto) {
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            dto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.authenticationService.REST_URL + 'dashboard/views/heatmap-data?access_token=' + this.authenticationService.access_token + '&limit=' + limit;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }



    listLeftSideNavBarItems(vanityUrlPostDto: any) {
        const url = this.moduleUrl + 'findLeftMenuItems?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, vanityUrlPostDto)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getLeftSideNavBarItems(vanityUrlPostDto: any){
        const url = this.moduleUrl + 'getCustomizedLeftMenuItems?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, vanityUrlPostDto)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    updateLeftSideNavBarItems(customleftmenu: any){
        const url = this.moduleUrl + 'updateLeftMenuItems?access_token=' +this.authenticationService.access_token;
        return this.http.post(url, customleftmenu)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getWelcomePageItems(vanityUrlPostDto: any) {
        const url = this.authenticationService.REST_URL + 'dashboard/views/getWelcomePageItems?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, vanityUrlPostDto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getContactsStatistics(applyFilter:boolean) {
        const url = this.authenticationService.REST_URL + 'dashboard/views/getContactsAnalyticsTreeMapData' + '/' + this.authenticationService.getUserId() +'/'+applyFilter+ '?access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getActiveInActiveTotalPartnerCounts(applyFilter:boolean) {
        const url = this.authenticationService.REST_URL + 'dashboard/views/getActiveInActiveTotalPartnerCounts' + '/' + this.authenticationService.getUserId() + '/'+applyFilter+'?access_token=' + this.authenticationService.access_token;
        return this.getUrl(url);
    }

    getPartnerContactsCount(applyFilter:boolean) {
        const url = this.authenticationService.REST_URL + 'dashboard/views/getPartnerContactsCount' + '/' + this.authenticationService.getUserId() + '/'+applyFilter+ '?access_token=' + this.authenticationService.access_token;
        return this.getUrl(url);
    }

    getLeadsCount(applyFilter:boolean) {
        return this.http.get(this.authenticationService.REST_URL + "lead/getVendorLeadsCount/"+this.authenticationService.getUserId()+"/"+applyFilter+"?access_token="+this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDealsCount(applyFilter:boolean) {
        let url = this.authenticationService.REST_URL + "deal/getVendorDealsCount/"+this.authenticationService.getUserId()+"/"+applyFilter+"?access_token="+this.authenticationService.access_token;
        return this.getUrl(url);
    }

    getWordCloudDataForRedistributedCampaigns(applyFilter:boolean) {
        const url = this.authenticationService.REST_URL + 'dashboard/views/getWordCloudDataForRedistributedCampaigns' + '/' + this.authenticationService.getUserId() + '/'+applyFilter+ '?access_token=' + this.authenticationService.access_token;
        return this.getUrl(url);
    }

    getUrl(url:string){
        return this.http.get(url)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getBubbleChartDataByType(type: string,applyFilter:boolean) {
        let dealOrLeadUrl = type == "Deals" ? 'getDealBubbleChartData' : 'getLeadBubbleChartData';
        const url = this.authenticationService.REST_URL + 'dashboard/views/' + dealOrLeadUrl + '/' + this.authenticationService.getUserId() +'/'+applyFilter+ '?access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }


    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }

    savePipeline(request: any) {
        return this.http.post(this.authenticationService.REST_URL + `pipeline?access_token=${this.authenticationService.access_token}`, request)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveOrUpdatePipeline(pipeline: Pipeline) {
        let url = this.authenticationService.REST_URL + `pipeline`;
        if (pipeline.id > 0) {
            url = url + `/edit`;
        }
        return this.http.post(url + `?access_token=${this.authenticationService.access_token}`, pipeline)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listAllPipelines(pagination: Pagination) {
        return this.http.post(this.authenticationService.REST_URL + `v/pipeline/list?access_token=${this.authenticationService.access_token}`, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPipeline(pipelineId: number, userId: number) {
        return this.http.get(this.authenticationService.REST_URL + `pipeline/${pipelineId}/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deletePipeline(pipeline: Pipeline) {
        return this.http.post(this.authenticationService.REST_URL + `pipeline/delete?access_token=${this.authenticationService.access_token}`, pipeline)
            .map(this.extractData)
            .catch(this.handleError);
    }

    syncPipeline(pipelineId: number, userId: number) {
        return this.http.get(this.authenticationService.REST_URL + `pipeline/${pipelineId}/sync/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    revokeAccessTokenByUserId(userId: number) {
        return this.http.get(this.authenticationService.REST_URL + `url/revokeAccessTokenByUserId/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    revokeAccessTokensForAll() {
        return this.http.get(this.authenticationService.REST_URL + `url/revokeAccessTokensForAll?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateSpfConfiguration(companyId:number){
        return this.http.get(this.url + `updateSpfConfiguration/${companyId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    findUsersByType(pagination: Pagination,type:string) {
        let mappingUrl = "registered"==type ? 'findRecentRegisteredUsers':'findRecentLoggedInUsers';
        const url = this.superAdminUrl + mappingUrl+ '?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    findWorkflowDetails(pagination: Pagination) {
        const url = this.superAdminUrl + "findWorkflowDetails"+ '?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }


    /****XNFR-2********/
    findVendorInvitationReports(pagination:Pagination){
        const url = this.superAdminUrl + "findVendorInvitationReports"+ '?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    /****XNFR-2********/
    upgradeAsVendor(partnerId:number){
        const url = this.superAdminUrl + "upgradeAsVendor"+"/"+partnerId+'?access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    /****XNFR-84********/
    findModulesByCompanyId(companyId:number) {
        const url = this.moduleUrl + 'findModulesByCompanyId/'+companyId+'?access_token=' + this.authenticationService.access_token;
        return this.utilGetMethodForModuleNames(url);
    }
    /****XNFR-84********/
    findCustomModuleNames(companyId:number) {
        const url = this.moduleUrl + 'findModuleCustomNamesByCompanyId/'+companyId+'?access_token=' + this.authenticationService.access_token;
        return this.utilGetMethodForModuleNames(url);
    }
    /****XNFR-84********/
    findPartnerModuleByCompanyId(companyId:number) {
        const url = this.moduleUrl + 'findPartnerModuleByCompanyId/'+companyId+'?access_token=' + this.authenticationService.access_token;
        return this.utilGetMethodForModuleNames(url);
    }
    /****XNFR-84********/
    updateModuleName(moduleCustomName:ModuleCustomName){
        const url = this.moduleUrl + 'updateModuleName?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,moduleCustomName)
        .map(this.extractData)
        .catch(this.handleError);
    }

    utilGetMethodForModuleNames(url:string){
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    /*********funnel chart****** */
    getFunnelChartsAnalyticsData(vanityLoginDto:VanityLoginDto) {
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.authenticationService.REST_URL + 'dashboard/views/getFunnelChartsAnalyticsData?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,vanityLoginDto)
        .map(this.extractData)
        .catch(this.handleError);
    }


    getPreIntegrationSettingsForMicrosoft(userId: any) {
        return this.http.get(this.authenticationService.REST_URL + `microsoft/preIntegrationSettings/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    savePreIntegrationSettingsForMicrosoft(request: any) {
        return this.http.post(this.authenticationService.REST_URL + `microsoft/preIntegrationSettings?access_token=${this.authenticationService.access_token}`, request)
            .map(this.extractData)
            .catch(this.handleError);
    }



   /************Pie chart ********* */
   getPieChartLeadsAnalyticsData(vanityLoginDto:VanityLoginDto){
    let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
    const url = this.authenticationService.REST_URL + 'dashboard/views/getPieChartsLeadsAnalyticsData?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
   }

   getPieChartDealsAnalyticsData(vanityLoginDto:VanityLoginDto){
    let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
    const url = this.authenticationService.REST_URL + 'dashboard/views/getPieChartsDealsAnalyticsData?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
   }

   getPieChartStatisticsLeadAnalyticsData(vanityLoginDto:VanityLoginDto){
    let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
    const url = this.authenticationService.REST_URL + 'dashboard/views/getPieChartStatisticsLeadAnalyticsData?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
   }

   getPieChartStatisticsDealData(vanityLoginDto:VanityLoginDto){
    let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
    const url = this.authenticationService.REST_URL + 'dashboard/views/getPieChartDealStatisticsData?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
   }

   getPieChartDealStatisticsWithStageNames(vanityLoginDto:VanityLoginDto){
    let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
    const url = this.authenticationService.REST_URL + 'dashboard/views/getPieChartDealStatisticsWithStageNames?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
   }

   getPieChartLeadsStatisticsWithStageNames(vanityLoginDto:VanityLoginDto){
    let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
            vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
    const url = this.authenticationService.REST_URL + 'dashboard/views/getPieChartLeadsStatisticsWithStageNames?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
   }

   saveUpgradeRequest(){
    const url = this.upgradeRoleUrl+"saveRequest/" +this.authenticationService.getUserId()+'?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
   }

   isRequestExists(){
    const url = this.upgradeRoleUrl+"isRequestExists/" +this.authenticationService.getUserId()+'?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
   }

   findRequests(pagination:Pagination){
    const url = this.superAdminUrl + 'findAllMarketingRequests?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,pagination)
    .map(this.extractData)
    .catch(this.handleError);
   }

   upgradeToMarketing(requestId:number){
    const url = this.superAdminUrl + 'upgradeToMarketing/'+requestId+'?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
   }
  /***XNFR-125*****/
   findOneClickLaunchScheduledCampaigns(companyId:number){
    const url = this.superAdminUrl + 'findOneClickLaunchScheduledCampaingsByVendorCompanyId/'+companyId+'?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
        .map(this.extractData)
        .catch(this.handleError);
}
    /********* XNFR-127 *************/
   /********High Level analytics******* */
   findActivePartnersAndInActivePartnersForDonutChart(vanityLoginDto:VanityLoginDto){
    const url = this.authenticationService.REST_URL + 'highlevel/analytics/getActiveAndInActivePartnersForDonut?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
   }

   findLaunchedAndRedistributedCampiagnsForBarChart(vanityLoginDto:VanityLoginDto){
    const url = this.authenticationService.REST_URL + 'highlevel/analytics/getLaunchedAndRedistributedCampaignsForBarChart?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
   }

    findHighLevelAnalyticsOfDetailReportsForTotalUsersTile(vanityLoginDto:VanityLoginDto){
         const url = this.authenticationService.REST_URL + 'highlevel/analytics/detailReports?access_token=' + this.authenticationService.access_token;
         return this.http.post(url,vanityLoginDto)
         .map(this.extractData)
         .catch(this.handleError);
    }

    saveHighLevelAnalyticsDownloadRequest(downloadRequestDto:DownloadRequestDto){
    const url =
    this.authenticationService.REST_URL +
    "highlevel/analytics/saveDownloadRequest?access_token=" +
    this.authenticationService.access_token;
    return this.http
    .post(url, downloadRequestDto)
    .map(this.extractData)
    .catch(this.handleError);
    }
    /*********** XNFR-134 ****************/
        getTopNavigationBarCustomSkin(vanityLoginDto:VanityLoginDto){
        const url = this.authenticationService.REST_URL + 'custom/skin/find/?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,vanityLoginDto)
        .map(this.extractData)
        .catch(this.handleError);
        }
        saveCustomSkin(custom:any){
        const url = this.authenticationService.REST_URL+ 'custom/skin/save?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,custom)
        .map(this.extractData)
        .catch(this.handleError);
    }
    getDefaulSkinBYType(userId:number,type:string){
        const url = this.authenticationService.REST_URL + 'custom/skin/get/'+ userId +'/'+type+'?access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
        .map(this.extractData)
        .catch(this.handleError);
        }
/************XNFR-134*****************/
/*************XNFR-238****************/
 /********* Dark Theme********** */
 setDarkorLightTheme(custom:any) {
    const url = this.authenticationService.REST_URL + 'custom/skin/dark?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,custom)
    .map(this.extractData)
    .catch(this.handleError);
}
/**** Chnage Custom Colors*****/
changeCustomSettingTheme(custom:any) {
    const url = this.authenticationService.REST_URL + 'custom/skin/light?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,custom)
    .map(this.extractData)
    .catch(this.handleError);
}
updateCustomDefaultSettings(custom:any) {
    const url = this.authenticationService.REST_URL + 'custom/skin/default?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,custom)
    .map(this.extractData)
    .catch(this.handleError);
}

/*************** New Changes *****************/
saveMultipleTheme(wrapper:any){
    const url = this.authenticationService.REST_URL + 'custom/skin/savetheme/?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,wrapper)
    .map(this.extractData)
    .catch(this.handleError);
}
findAllThemes(){
    let userId = this.authenticationService.getUserId();
    const url = this.authenticationService.REST_URL + 'custom/skin/theme/'+ userId +'/'+'?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
}
getPropertiesById(id:number){
    const url = this.authenticationService.REST_URL + 'custom/skin/getProperties/themeId/'+ id +'/'+'?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
}

getPropertiesByThemeName(name:string){
    const url = this.authenticationService.REST_URL + 'custom/skin/getProperties/'+ name +'/'+'?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
}
activateThemeForCompany(wrapper:CompanyThemeActivate){
    const url = this.authenticationService.REST_URL + 'custom/skin/activateTheme?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,wrapper)
    .map(this.extractData)
    .catch(this.handleError);
}
deleteThemeProperties(id:number){
    const url = this.authenticationService.REST_URL + 'custom/skin/delete/'+ id +'/'+'?access_token=' + this.authenticationService.access_token;
    return this.http.delete(url)
    .map(this.extractData)
    .catch(this.handleError);
}
getActiveTheme(vanityLoginDto:VanityLoginDto){
    let companyProfileName = this.authenticationService.companyProfileName;
    let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
    if(xamplifyLogin){
        vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
    }
    const url = this.authenticationService.REST_URL + 'custom/skin/getactiveTheme/?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
}
getThemeDTOById(id:number){
    const url = this.authenticationService.REST_URL + 'custom/skin/getThemeDto/'+ id +'/'+'?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
}
getAllThemeNames(){
    const url = this.authenticationService.REST_URL + 'custom/skin/getNames/'+ this.authenticationService.getUserId() +'?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
}
updateThemeDto(themeDto:ThemeDto){
    const url = this.authenticationService.REST_URL + 'custom/skin/updatThemDto/'+themeDto.id+'?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,themeDto)
    .map(this.extractData)
    .catch(this.handleError);
}
getDefaultThemes(){
    const url = this.authenticationService.REST_URL + 'custom/skin/defaultThemes/'+'?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
}
/**** XNFR-554 ****/
uploadBgImageFile(file: any) {
    let formData: FormData = new FormData();
    formData.append('bgImageFile', file, file.name);
    let headers = new Headers();
    let options = new RequestOptions({ headers: headers });
    const url = this.authenticationService.REST_URL  + "custom/skin/backgroundImage/saveBgImage/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;
    return this.http.post(url, formData, options)
        .map(this.extractData)
        .catch(this.handleError);
}
getDefaultImagePath(parentThemeName:any,themeId:any) {
    let url = this.authenticationService.REST_URL +"custom/skin/getDefaultImagePath/"+parentThemeName+"/"+themeId+"?access_token=" + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
}
saveOrUpdateDefaultImages(themeDto:ThemeDto) {
    const url = this.authenticationService.REST_URL + 'custom/skin/updateBgImagePath/?access_token=' + this.authenticationService.access_token;
    return this.http.post(url,themeDto)
    .map(this.extractData)
    .catch(this.handleError);
}
/*** XNFR-554 ****/
/*************XNFR-238****************/
    getVendors(pagination: Pagination) {
         /****XNFR-252*****/
         let companyProfileName = this.authenticationService.companyProfileName;
         let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
         if(xamplifyLogin){
             pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
         }
         /****XNFR-252*****/
        const url = this.authenticationService.REST_URL + 'vendor/info?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);

    }

    getVendorCount(vanityLoginDto: VanityLoginDto) {
         /****XNFR-252*****/
         let companyProfileName = this.authenticationService.companyProfileName;
         let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
         if(xamplifyLogin){
            vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
         }
       /***XNFR-252****/
        return this.http.post(this.authenticationService.REST_URL + "vendor/count?access_token=" + this.authenticationService.access_token, vanityLoginDto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /****XNFR-139****/
    findMaximumAdminsLimitDetailsByCompanyId(companyId:number){
        let url = this.authenticationService.REST_URL +"teamMember/findMaximumAdminsLimitDetailsByCompanyId/"+companyId+"?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
        .map(this.extractData)
        .catch(this.handleError);
    }

    /****XNFR-209*****/
    findProcessingCampaigns(pagination:Pagination){
        const url = this.superAdminUrl + 'findProcessingCampaigns?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,pagination)
        .map(this.extractData)
        .catch(this.handleError);
    }

    findActiveQueries(){
        const url = this.superAdminUrl + 'findActiveQueries?access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
        .map(this.extractData)
        .catch(this.handleError);
    }

    // xnfr-215
    saveApiTokenForPipedrive(request: any) {
        return this.http.post(this.authenticationService.REST_URL + `pipedrive/saveApiKey?access_token=${this.authenticationService.access_token}`, request)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getApiTokenForPipedrive(userId: any) {
        return this.http.get(this.authenticationService.REST_URL + `pipedrive/apiKey/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    // xnfr-215

    
    /****XNFR-224*****/
    findLoginAsPartnerSettingsOptions(companyProfileName:string) {
        let userId = this.authenticationService.getUserId();
        return this.http.get(this.authenticationService.REST_URL + "/module/findLoginAsPartnerSettingsOptions/" + companyProfileName + "/"+userId+"?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
        
    }

    /****XNFR-224*****/
    updateLoginAsPartnerSettingsOptions(loginAsPartnerDto:LoginAsPartnerDto) {
        loginAsPartnerDto.loggedInUserId = this.authenticationService.getUserId();
		return this.http.post(this.authenticationService.REST_URL + "/module/updateLoginAsPartnerSettingsOptions/?access_token=" + this.authenticationService.access_token,loginAsPartnerDto)
        .map(this.extractData)
        .catch(this.handleError);
	}

    findCompanyInfo(emailId:string) {
        let input = {};
        input['emailId'] = emailId;
        const url = this.superAdminUrl + 'findCompanyInfo?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, input)
            .map(this.extractData)
            .catch(this.handleError);
    }

    upgradeAccount(companyId:number,roleId:number){
        return this.http.get(this.superAdminUrl + "/upgradeAccount/" + companyId + "/"+roleId+"?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }

    /***  user-guides ***/
    getUserGuideLeftMenu(vanityLoginDto:VanityLoginDto){
        const url = this.moduleUrl + 'getCustomizedLeftMenuItems?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,vanityLoginDto)
        .map(this.extractData)
        .catch(this.handleError);
    }
    getSearchResultsOfUserGuides(pagination:Pagination){
        const url = this.authenticationService.REST_URL + 'user/guide/search/?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,pagination)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getUserGuidesByModuleName(pagination:Pagination){
        const url =this.authenticationService.REST_URL + 'user/guide/moduleName/?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,pagination)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getGuideLinkByTitle(pagination:Pagination){
        const url = this.authenticationService.REST_URL + 'user/guide/title/?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,pagination)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getGuideGuideBySlug(pagination:Pagination){
        const url = this.authenticationService.REST_URL + 'user/guide/slug/?access_token=' + this.authenticationService.access_token;
        return this.http.post( url ,pagination)
        .map(this.extractData)
        .catch(this.handleError);
    }
    getUserGuidesForDashBoard(vanityLoginDto:VanityLoginDto){
        let companyProfileName = this.authenticationService.companyProfileName;
        let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
        if(xamplifyLogin){
           vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
        }
        const url = this.authenticationService.REST_URL + 'user/guide/getGuidesForDashboard/?access_token=' + this.authenticationService.access_token;
        return this.http.post( url ,vanityLoginDto)
        .map(this.extractData)
        .catch(this.handleError);
    }
    getModuleNameByModuleId(moduleId:number){
        const url = this.authenticationService.REST_URL + 'user/guide/moduleId/'+ moduleId +'/?access_token=' + this.authenticationService.access_token;
        return this.callGetMethod(url);
    }
    /** User Guides */

    /***XNFR-326****/

    findEmailNotificationSettings(){
        const url = this.emailNotificationSettingsUrl + '/'+this.authenticationService.getUserId()+'?access_token=' + this.authenticationService.access_token;
        return this.callGetMethod(url);
    }

    updateEmailNotificationSettings(emailNotificationSettingsDto: EmailNotificationSettingsDto) {
        const url = this.emailNotificationSettingsUrl + '/'+this.authenticationService.getUserId()+'?access_token=' + this.authenticationService.access_token;
        return this.callPutMethod(url,emailNotificationSettingsDto);
    }

    private callGetMethod(url: string) {
        return this.http.get(url)
          .map(this.extractData)
          .catch(this.handleError);
    }
      
    private callPostMethod(url: string,requestDto:any) {
    return this.http.post(url,requestDto)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    private callPutMethod(url: string,requestDto:any) {
    return this.http.put(url,requestDto)
        .map(this.extractData)
        .catch(this.handleError);
    }

    /***XNFR-326****/

    findActiveThreads(){
    const url = this.superAdminUrl + 'findActiveThreads?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
    }

    /*** XNFR-335 ****/
    addDnsRecordOfGodaddy(godaddyDetailsDto:GodaddyDetailsDto){
        const url = this.authenticationService.REST_URL + 'godaddy/dns/add/?access_token=' + this.authenticationService.access_token;
        return this.http.post( url ,godaddyDetailsDto)
        .map(this.extractData)
        .catch(this.handleError);
    }
    checkDomainName(godaddyDetailsDto:GodaddyDetailsDto){
        const url = this.authenticationService.REST_URL + 'godaddy/domainName/valid/?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,godaddyDetailsDto)
         .map(this.extractData)
         .catch(this.handleError);
    }
    updateGodaddyConfiguration(companyId:number,isConnected:boolean){
        return this.http.get(this.authenticationService.REST_URL + "godaddy/updateGodaddyConfiguration/" + companyId + "/"+isConnected+"/?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }
    isGodaddyConfigured(companyId:number){
        return this.http.get(this.authenticationService.REST_URL + `godaddy/isGodaddyConfigured/${companyId}?access_token=${this.authenticationService.access_token}`)
        .map(this.extractData)
        .catch(this.handleError);
    }
    foundDuplicateDnsRecord(value:string){
        return this.http.get(this.authenticationService.REST_URL + `godaddy/fetchDnsRecordByValue/${value}?access_token=${this.authenticationService.access_token}`)
        .map(this.extractData)
        .catch(this.handleError);
    }
    getDomainName(companyId:number){
        return this.http.get(this.authenticationService.REST_URL + "godaddy/getDomainName/" + companyId + "/?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getDnsRecordsOfGodaddy(){
        return this.http.get(this.authenticationService.REST_URL + "godaddy/records/?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }
    deleteDnsRecrds(){
        const url = this.authenticationService.REST_URL + 'godaddy/deleteAll/?access_token=' + this.authenticationService.access_token;
        return this.http.delete(url)
        .map(this.extractData)
        .catch(this.handleError);
    }
    /*** XNFR-335 ****/

    /*** ConnectWise - XNFR-403 ****/
    saveAuthCredentialsForConnectWise(request: any) {
        return this.http.post(this.authenticationService.REST_URL + `connectwise/saveAuth?access_token=${this.authenticationService.access_token}`, request)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAuthCredentialsForConnectWise(userId: any) {
        return this.http.get(this.authenticationService.REST_URL + `connectwise/getAuth/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    /*** ConnectWise - XNFR-403 ****/

    /* -- XNFR-415 -- */
    updateDefaultDashboardForPartner( companyId: number,type:string ) {
        return this.http.get( this.url + "updateDefaultDashboardForPartner/" + companyId + "/"+type+"?access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }
    getDefaultDashboardForPartner( companyId: number ) {
        return this.http.get( this.url + "getDefaultDashboardForPartner/" + companyId + "?access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }
    getDefaultDashboardPageForPartner(vanityLoginDto: VanityLoginDto) {
        return this.http.post(this.url + `getDefaultDashboardPageForPartner?access_token=${this.authenticationService.access_token}`, vanityLoginDto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    testAuthCredentialsForConnectWise(request: any) {
        return this.http.post(this.authenticationService.REST_URL + `connectwise/testAuth?access_token=${this.authenticationService.access_token}`, request)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /***XNFR-454*****/
    findDomains(pagination:Pagination,selectedTab:number){
        let userId = this.authenticationService.getUserId();
        let pageableUrl = this.referenceService.getPagebleUrl(pagination);
        let teamMemberOrPartnerDomain = selectedTab==1 ? '/' :'/partners/';
        let findAllUrl = this.domainUrl+teamMemberOrPartnerDomain+userId+this.QUERY_PARAMETERS+pageableUrl;
        return this.authenticationService.callGetMethod(findAllUrl);
      }

    /***XNFR-454*****/
    saveDomains(domainRequestDto:DomainRequestDto,selectedTab:number){
        let teamMemberOrPartnerDomain = selectedTab==1 ? '' :'/partners';
        const url = this.domainUrl +teamMemberOrPartnerDomain+ this.QUERY_PARAMETERS;
        domainRequestDto.createdUserId = this.authenticationService.getUserId();
        return this.authenticationService.callPostMethod(url,domainRequestDto);
    }

    /***XNFR-454*****/
    deleteDomain(id:number){
        let userId = this.authenticationService.getUserId();
        let deleteDomainUrl = this.domainUrl+'/id/'+id+'/loggedInUserId/'+userId+this.QUERY_PARAMETERS;
        return this.authenticationService.callDeleteMethod(deleteDomainUrl);
    }
    /***XNFR-454*****/
    findCompanySignUpUrl(selectedTab:number){
        let vanityUrlFilter = this.vanityUrlService.isVanityURLEnabled();
        let domainName = this.authenticationService.companyProfileName;
        let userId = this.authenticationService.getUserId();
        let domainNameQueryParameter = "";
        let vanityUrlFilterQueryParameter = "";
        if(domainName!=undefined && domainName.length>0 && domainName!=""){
            domainNameQueryParameter = "&domainName="+domainName;
        }
        if(vanityUrlFilter!=undefined){
            vanityUrlFilterQueryParameter = "&isVanityLogin="+vanityUrlFilter;
        }else{
            vanityUrlFilterQueryParameter = "&isVanityLogin=false";
        }
        let teamMemberOrPartnerDomain = selectedTab==1 ? '/' :'/partners/';
        let signUpUrl = this.domainUrl+teamMemberOrPartnerDomain+'signUpUrl'+"?loggedInUserId="+userId+vanityUrlFilterQueryParameter+domainNameQueryParameter+'&access_token=' + this.authenticationService.access_token;;
        return this.authenticationService.callGetMethod(signUpUrl);
    }

    findInstantNavigationLinks(vanityLoginDto: VanityLoginDto) {
        return this.http.post(this.dashboardAnalytics + `getInstantNavigationLinks?access_token=${this.authenticationService.access_token}`, vanityLoginDto)
            .map(this.extractData)
            .catch(this.handleError);
    }


    /*****XNFR-502*****/
    saveHalopsaCredentials(formData: any) {
        return this.http.post(this.authenticationService.REST_URL + `/halopsa/saveCredentials?access_token=${this.authenticationService.access_token}`, formData)
            .map(this.extractData)
            .catch(this.handleError);
    }


    findProcessingUserLists(pagination: Pagination) {
        let pageableUrl = this.referenceService.getPagebleUrl(pagination);
        let url = this.superAdminUrl+"/processingUserLists?access_token=" + this.authenticationService.access_token+pageableUrl;
        return this.authenticationService.callGetMethod(url);
    }

    findAllCompanyNames() {
        const url = this.superAdminUrl + 'findAllCompanyNames?access_token=' + this.authenticationService.access_token;
        return this.authenticationService.callGetMethod(url);
    }

    findAllPartnerCompanyNames(vendorCompanyProfileName:string) {
        const url = this.superAdminUrl + 'findAllPartnerCompanyNames/'+vendorCompanyProfileName+'?access_token=' + this.authenticationService.access_token;
        return this.authenticationService.callGetMethod(url);
    }

    getAuthCredentialsForHalopsa(userId: any) {
        return this.http.get(this.authenticationService.REST_URL + `halopsa/getAuth/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    
}
