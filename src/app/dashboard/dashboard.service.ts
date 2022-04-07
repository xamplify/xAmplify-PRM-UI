import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SaveVideoFile } from '../videos/models/save-video-file';
import { Pagination } from '../core/models/pagination';
import { AuthenticationService } from '../core/services/authentication.service';
import { SocialConnection } from '../social/models/social-connection';
import { DashboardAnalyticsDto } from "app/dashboard/models/dashboard-analytics-dto";
import { Pipeline } from './models/pipeline';
import {ModuleCustomName} from "app/dashboard/models/module-custom-name";
import { VanityLoginDto } from "app/util/models/vanity-login-dto";

@Injectable()
export class DashboardService {
    url = this.authenticationService.REST_URL + "admin/";
    demoUrl = this.authenticationService.REST_URL + "demo/request/";
    superAdminUrl = this.authenticationService.REST_URL + "superadmin/";
    dashboardAnalytics = this.authenticationService.REST_URL + "dashboard/views/";
    moduleUrl = this.authenticationService.REST_URL + "module/";
    QUERY_PARAMETERS = '?access_token=' + this.authenticationService.access_token;
    saveVideoFile: SaveVideoFile;
    pagination: Pagination;
    sortDates = [{ 'name': '7 Days', 'value': 7 }, { 'name': '14 Days', 'value': 14 },
    { 'name': '21 Days', 'value': 21 }, { 'name': 'Month', 'value': 30 }];

    constructor(private http: Http, private authenticationService: AuthenticationService) { }

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
        console.log(vendorInvitation);
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
        console.log(campaignIdsList);
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
        console.log("data value is " + dateValue);
        const url = this.authenticationService.REST_URL + 'dashboard/videostats/views/level1?userId=' +
            this.authenticationService.user.id + '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue +
            '&access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoViewsLevelTwoReports(daysInterval: number, dateValue: any, videoId: number, pagination: Pagination) {
        console.log("data value is " + dateValue);
        const url = this.authenticationService.REST_URL + 'dashboard/videostats/views/level2?videoId=' + videoId + '&userId=' +
            this.authenticationService.user.id + '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue +
            '&access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoMinutesWatchedLevelOneReports(daysInterval: any, dateValue: number) {
        console.log("data value is " + dateValue);
        const url = this.authenticationService.REST_URL + 'dashboard/videostats/minuteswatched/level1?userId=' +
            this.authenticationService.user.id + '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue +
            '&access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getVideoMinutesWatchedLevelTwoReports(daysInterval: any, dateValue: number, videoId: number, pagination: Pagination) {
        console.log("data value is " + dateValue);
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

    updateDnsConfigurationDetails(companyId:number,isDnsConfigured:boolean){
        return this.http.get(this.authenticationService.REST_URL + `superadmin/updateDnsConfiguration/${companyId}/${isDnsConfigured}?access_token=${this.authenticationService.access_token}`)
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
        } else if (report.userStatus == "UNAPPROVED" || report.userStatus == "SUSPEND") {
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
        const url = this.dashboardAnalytics + 'modulesAnalytics?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVendorActivityAnalytics(dto: DashboardAnalyticsDto) {
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
        const url = this.dashboardAnalytics + 'emailStats/?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getRegionalStatistics(dto: DashboardAnalyticsDto) {
        const url = this.dashboardAnalytics + 'regionalStatistics/?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listEmailOpenLogsForVanityURL(actionId: number, pagination: Pagination, dto: DashboardAnalyticsDto) {
        const url = this.authenticationService.REST_URL + "dashboard/views/email-logs-by-user-and-action" + "?access_token=" + this.authenticationService.access_token + "&actionId=" + actionId + "&pageSize=" + pagination.maxResults + "&pageNumber=" + pagination.pageIndex;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listOfWatchedLogsForVanityURL(pagination: Pagination, dto: DashboardAnalyticsDto) {
        const url = this.authenticationService.REST_URL + "dashboard/views/watched-users" + "?access_token=" + this.authenticationService.access_token + "&pageSize=" + pagination.maxResults + "&pageNumber=" + pagination.pageIndex;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listEmailClickedLogsForVanityURL(pagination: Pagination, dto: DashboardAnalyticsDto) {
        const url = this.authenticationService.REST_URL + "dashboard/views/email-click-logs-by-user" + "?access_token=" + this.authenticationService.access_token + "&pageSize=" + pagination.maxResults + "&pageNumber=" + pagination.pageIndex;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    worldMapCampaignDetailsForVanityURL(countryCode: string, pagination: Pagination, dto: DashboardAnalyticsDto) {
        const url = this.authenticationService.REST_URL + "dashboard/views/world-map-detail-report?access_token=" + this.authenticationService.access_token +
            "&pageSize=" + pagination.maxResults + "&pageNumber=" + pagination.pageIndex + "&countryCode=" + countryCode;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }


    //Video Stats analytics for VanityURL
    getVideoStatsInformationForVanityURL(daysCount, dto: DashboardAnalyticsDto) {
        const url = this.authenticationService.REST_URL + 'dashboard/views/videostats-data?access_token=' + this.authenticationService.access_token + '&daysInterval=' + daysCount;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVideoViewsLevelOneReportsForVanityURL(daysInterval: number, dateValue: any, dto: DashboardAnalyticsDto) {
        const url = this.authenticationService.REST_URL + 'dashboard/views/videostats/views/level1?access_token=' + this.authenticationService.access_token +
            '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue;
        return this.http.post(url, dto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVideoViewsLevelTwoReportsForVanityURL(daysInterval: number, dateValue: any, videoId: number, pagination: Pagination) {
        console.log("data value is " + dateValue);
        const url = this.authenticationService.REST_URL + 'dashboard/views/videostats/views/level2?access_token=' + this.authenticationService.access_token + '&videoId=' + videoId + '&daysInterval=' + daysInterval + '&selectedDate=' + dateValue;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVideoMinutesWatchedLevelOneReportsForVanityURL(daysInterval: any, dateValue: number, dto: DashboardAnalyticsDto) {
        console.log("date value is " + dateValue);
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
        const url = this.authenticationService.REST_URL + 'dashboard/views/getFunnelChartsAnalyticsData?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,vanityLoginDto)
        .map(this.extractData)
        .catch(this.handleError);
    }
   /************Pie chart ********* */

   getPieChartLeadsAnalyticsData(applyFilter:boolean){
    const url = this.authenticationService.REST_URL + 'dashboard/views/getPieChartsLeadsAnalyticsData' + '/' + this.authenticationService.getUserId() + '/'+applyFilter+ '?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
   }

   getPieChartDealsAnalyticsData(applyFilter:boolean){
    const url = this.authenticationService.REST_URL + 'dashboard/views/getPieChartsDealsAnalyticsData' + '/' + this.authenticationService.getUserId() + '/'+applyFilter+ '?access_token=' + this.authenticationService.access_token;
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
   }

}
