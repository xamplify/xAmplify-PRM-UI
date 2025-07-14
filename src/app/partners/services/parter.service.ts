import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Http } from "@angular/http";
import { Pagination } from '../../core/models/pagination';
import { User } from '../../core/models/user';
import { PartnerJourneyRequest } from '../models/partner-journey-request';
import { WorkflowDto } from 'app/contacts/models/workflow-dto';
import { ReferenceService } from 'app/core/services/reference.service';
import { TeamMemberAnalyticsRequest } from 'app/team/models/team-member-analytics-request';
import { PartnerCompanyMetricsDto } from 'app/dashboard/models/partner-company-metrics-dto';
import { Partnership } from '../models/partnership.model';

@Injectable()
export class ParterService {

    URL = this.authenticationService.REST_URL;
    ACCESS_TOKEN_SUFFIX_URL = "?access_token=";
    WORK_FLOW_PREFIX_URL = this.authenticationService.REST_URL + "workflow";
    WORK_FLOW_URL = this.WORK_FLOW_PREFIX_URL + this.ACCESS_TOKEN_SUFFIX_URL;
    
    PARTNER_URL = this.authenticationService.REST_URL + "partner";
    ACCESS_TOKEN_PARAMETERS = '?access_token=' + this.authenticationService.access_token;

    constructor(private http: Http, public authenticationService: AuthenticationService, public httpClient: HttpClient, private referenceService: ReferenceService) { }
    partnerReports(userId: number, applyFilter: boolean): Observable<any> {
        userId = this.authenticationService.checkLoggedInUserId(userId);
        const url = this.URL + 'partner/analytics?access_token=' + this.authenticationService.access_token +
            '&userId=' + userId + "&applyFilter=" + applyFilter;
        return this.httpClient.get(url)
            .catch(this.handleError);
    }

    approveVendorRequest(partnerId: number, vendorInvitation: any) {
        var newUrl = this.URL + "partnership/approve-partner/" + this.authenticationService.getUserId() + "/" + partnerId + "?access_token=" + this.authenticationService.access_token;
        return this.httpClient.post(newUrl, vendorInvitation)
            .catch(this.handleError);
    }

    declineVendorRequest(partnerId: number, vendorInvitation: any) {
        var newUrl = this.URL + "partnership/decline-partner/" + this.authenticationService.getUserId() + "/" + partnerId + "?access_token=" + this.authenticationService.access_token;
        return this.httpClient.post(newUrl, vendorInvitation)
            .catch(this.handleError);
    }

    getActivePartnersAnalytics(pagination: Pagination) {
        const url = this.URL + 'partner/active-partner-analytics?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getInActivePartnersAnalytics(pagination: Pagination) {
        const url = this.URL + 'partner/inactive-partner-analytics?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getApprovePartnersAnalytics(pagination: Pagination) {
        const url = this.URL + 'partnership/approve-partners?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getCompanyProfileIncomplete(pagination: Pagination) {
        const url = this.URL + 'partner/companyProfileIncomplete-partners?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    partnerUserInteractionReports(userId: number, pagination: Pagination): Observable<any> {
        userId = this.authenticationService.checkLoggedInUserId(userId);
        const url = this.URL + 'partner/campaigns?access_token=' + this.authenticationService.access_token +
            '&userId=' + userId
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }
    partnerCampaignInteraction(campaignId: number, pagination: Pagination) {
        const url = this.URL + 'partner/campaign-interaction?access_token=' + this.authenticationService.access_token +
            '&CampaignId=' + campaignId;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    launchedCampaignsCountGroupByCampaignType(partnerJourneyRequest: PartnerJourneyRequest) {
        let loggedInUserIdRequestParam = partnerJourneyRequest.loggedInUserId != undefined && partnerJourneyRequest.loggedInUserId > 0 ? "&loggedInUserId=" + partnerJourneyRequest.loggedInUserId : "&loggedInUserId=0";
        let partnerCompanyIdRequestParam = partnerJourneyRequest.partnerCompanyId != undefined && partnerJourneyRequest.partnerCompanyId > 0 ? "&partnerCompanyId=" + partnerJourneyRequest.partnerCompanyId : "&partnerCompanyId=0";
        let fromDateRequestParam = partnerJourneyRequest.fromDateFilterInString != undefined ? "&fromDateFilterInString=" + partnerJourneyRequest.fromDateFilterInString : "&fromDateFilterInString =''"
        let toDateRequestParam = partnerJourneyRequest.toDateFilterInString != undefined ? "&toDateFilterInString=" + partnerJourneyRequest.toDateFilterInString : "&toDateFilterInString =''"
        let timeZoneRequestParam = partnerJourneyRequest.timeZone != undefined ? "&timeZone=" + partnerJourneyRequest.timeZone : "&timeZone =''"
        let partnerJourneyRequestDto = loggedInUserIdRequestParam + partnerCompanyIdRequestParam + fromDateRequestParam + toDateRequestParam + timeZoneRequestParam;
        const url = this.URL + 'partner/campaigns-count-by-campaigntype?access_token=' + this.authenticationService.access_token + partnerJourneyRequestDto;
        return this.httpClient.get(url)
            .catch(this.handleError);
    }

    sendPartnerReminderEmail(user: User, vendorId: number) {
        const url = this.URL + 'partner/send-in-active-reminder-email/' + vendorId + '?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, user)
            .catch(this.handleError);
    }

    mailSend(pagination: Pagination) {
        const url = this.URL + 'partner/sendsingup-incompletecompanyprofile-mail?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }
    listRedistributedThroughPartnerCampaign(userId: number, pagination: Pagination): Observable<any> {
        userId = this.authenticationService.checkLoggedInUserId(userId);
        const url = this.URL + 'partner/list-re-distributed-partner-campaigns/' + userId + '?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    findChannelCampaigns(pagination: Pagination): Observable<any> {
        pagination.userId = this.authenticationService.getUserId();
        const url = this.URL + 'partner/findChannelCampaigns?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    findRedistributedCampaigns(pagination: Pagination): Observable<any> {
        const url = this.URL + 'partner/findRedistributedCampaigns?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    listRedistributedCampaigns(campaignId: number, pagination: Pagination): Observable<any> {
        pagination.userId = this.authenticationService.getUserId();
        const url = this.URL + 'partner/list-re-distributed-campaigns/' + campaignId + '?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getRedistributedCampaignsAndLeadsCountOrLeadsAndDeals(partnerJourneyRequest: PartnerJourneyRequest, chartId: string) {
        let urlSuffix = "";
        let loggedInUserIdRequestParam = partnerJourneyRequest.loggedInUserId != undefined && partnerJourneyRequest.loggedInUserId > 0 ? "&loggedInUserId=" + partnerJourneyRequest.loggedInUserId : "&loggedInUserId=0";
        let partnerCompanyIdRequestParam = partnerJourneyRequest.partnerCompanyId != undefined && partnerJourneyRequest.partnerCompanyId > 0 ? "&partnerCompanyId=" + partnerJourneyRequest.partnerCompanyId : "&partnerCompanyId=0";
        let fromDateRequestParam = partnerJourneyRequest.fromDateFilterInString != undefined ? "&fromDateFilterInString=" + partnerJourneyRequest.fromDateFilterInString : "&fromDateFilterInString =''"
        let toDateRequestParam = partnerJourneyRequest.toDateFilterInString != undefined ? "&toDateFilterInString=" + partnerJourneyRequest.toDateFilterInString : "&toDateFilterInString =''"
        let timeZoneRequestParam = partnerJourneyRequest.timeZone != undefined ? "&timeZone=" + partnerJourneyRequest.timeZone : "&timeZone =''"
        let filterTypeRequestParam = partnerJourneyRequest.filterType != undefined ? "&filterType=" + partnerJourneyRequest.filterType : "&filterType= =''"
        let partnerTeamMemberGroupFilterRequestParm = "&partnerTeamMemberGroupFilter=" + partnerJourneyRequest.partnerTeamMemberGroupFilter
        let teamMemberIdRequestParam = partnerJourneyRequest.teamMemberUserId != undefined ? "&teamMemberUserId=" + partnerJourneyRequest.teamMemberUserId : "&teamMemberUserId=0"
        let partnershipStatus = "&partnershipStatus=" + partnerJourneyRequest.partnershipStatus ;
        let partnerJourneyRequestDto = loggedInUserIdRequestParam + partnerCompanyIdRequestParam + fromDateRequestParam + toDateRequestParam + timeZoneRequestParam + partnershipStatus
        + filterTypeRequestParam + partnerTeamMemberGroupFilterRequestParm + teamMemberIdRequestParam;
        if (chartId == "redistributeCampaignsAndLeadsCountBarChart") {
            urlSuffix = 'getRedistributedCampaignsAndLeadsCountForBarChartDualAxes';
        } else if (chartId == "redistributeCampaignsAndLeadsCountBarChartQuarterly") {
            urlSuffix = 'getRedistributedCampaignsAndLeadsCountPreviousQuarterForBarChartDualAxes';
        } else if (chartId == "top10LeadsAndDealsBarChart") {
            urlSuffix = 'getLeadsAndDealsCount';
        } else if (chartId == "allRedistributeCampaignsAndLeadsCountBarChart") {
            urlSuffix = 'getAllRedistributedCampaignsAndLeadsCountForBarChartDualAxes';
        } else if (chartId == "allLeadsAndDealsBarChart") {
            urlSuffix = 'getAllLeadsAndDealsCount';
        }
        const url = this.URL + 'partner/' + urlSuffix + '?access_token=' + this.authenticationService.access_token + partnerJourneyRequestDto
        return this.httpClient.get(url)
            .catch(this.handleError);
    }

    getLeadsAndDealsCount(filterType: string) {
        const url = this.URL + 'partner/getLeadsAndDealsCount/' + this.authenticationService.getUserId() + '/' + filterType + '?access_token=' + this.authenticationService.access_token
        return this.httpClient.get(url)
            .catch(this.handleError);
    }

    findLeadsToDealsConversionPercentage(companyId: number, applyTeamMemberFilter: boolean) {
        return this.kpiApi(companyId, 'findLeadsToDealsConversionPercentage', applyTeamMemberFilter);
    }

    findLeadsOpportunityAmount(companyId: number, applyTeamMemberFilter: boolean) {
        return this.kpiApi(companyId, 'findLeadsOpportunityAmount', applyTeamMemberFilter);
    }

    kpiApi(companyId: number, url: string, applyTeamMemberFilter: boolean) {
        const apiUrl = this.URL + 'partner/' + url + '/' + companyId + '/' + this.authenticationService.getUserId() + '/' + applyTeamMemberFilter + '?access_token=' + this.authenticationService.access_token
        return this.httpClient.get(apiUrl)
            .catch(this.handleError);
    }

    findPartnerCompanies(pagination: Pagination) {
        const apiUrl = this.URL + 'partnership/findPartnerCompanies?access_token=' + this.authenticationService.access_token
        return this.findPartnerCompainesOrGroups(apiUrl, pagination);
    }

    loadPartnerCompanies(pagination: Pagination, userId: number) {
        const apiUrl = this.URL + 'partnership/loadPartnerCompanies/' + userId + '?access_token=' + this.authenticationService.access_token
        return this.findPartnerCompainesOrGroups(apiUrl, pagination);
    }

    findPartnerGroups(pagination: Pagination) {
        pagination.userId = this.authenticationService.getUserId();
        const apiUrl = this.URL + 'partnership/findPartnerGroups?access_token=' + this.authenticationService.access_token
        return this.findPartnerCompainesOrGroups(apiUrl, pagination);
    }

    findPartnerCompainesOrGroups(apiUrl: string, pagination: Pagination) {
        return this.httpClient.post(apiUrl, pagination)
            .catch(this.handleError);
    }


    loadCountryData(userId: number, applyFilter: boolean) {
        return this.callApiForDashBoard("countrywisePartnersCount", userId, applyFilter);
    }

    findRedistributedCampaignsCount(userId: number, applyFilter: boolean) {
        return this.callApiForDashBoard("findRedistributedCampaignsCount", userId, applyFilter);
    }

    findThroughPartnerCampaignsCount(userId: number, applyFilter: boolean) {
        return this.callApiForDashBoard("findThroughPartnerCampaignsCount", userId, applyFilter);
    }

    findActivePartnersCount(userId: number, applyFilter: boolean) {
        return this.callApiForDashBoard("findActivePartnersCount", userId, applyFilter);
    }

    findInActivePartnersCount(userId: number, applyFilter: boolean) {
        return this.callApiForDashBoard("findInActivePartnersCount", userId, applyFilter);
    }

    findApprovePartnersCount(userId: number, applyFilter: boolean) {
        return this.callApiForDashBoard("findApprovePartnersCount", userId, applyFilter);
    }

    findPendingSignupAndCompanyProfilePartnersCount(userId: number, applyFilter: boolean) {
        return this.callApiForDashBoard("findPendingSignupAndCompanyProfilePartnersCount", userId, applyFilter);
    }
    callApiForDashBoard(urlPrefix: string, userId: number, applyFilter: boolean) {
        const url = this.URL + 'partner/' + urlPrefix + '?access_token=' + this.authenticationService.access_token +
            '&userId=' + userId + "&applyFilter=" + applyFilter;
        return this.httpClient.get(url)
            .catch(this.handleError);
    }

    /*********XNFR-220****/
    findAllPartnerCompanies(pagination: Pagination) {
        pagination.userId = this.authenticationService.getUserId();
        const url = this.URL + 'partner/allPartners?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    /*********XNFR-220****/
    findPartnerCompanyJourney(partnershipId: number) {
        const url = this.URL + 'partner/findJourney/' + partnershipId + '?access_token=' + this.authenticationService.access_token;
        return this.httpClient.get(url)
            .catch(this.handleError);
    }

    /*********Start : XNFR-316************/
    getActivePartners(pagination: Pagination) {
        const url = this.URL + 'partner/active-partners?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getDeactivatedPartners(pagination: Pagination) {
        const url = this.URL + 'partner/deactivated-partners?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getPartnerJourneyCompanyInfo(partnerCompanyId: any, loggedInUserId: number) {
        const url = this.URL + 'partner/journey/company/info/' + partnerCompanyId + '/' + loggedInUserId + '?access_token=' + this.authenticationService.access_token;
        return this.httpClient.get(url)
            .catch(this.handleError);
    }

    getPartnerJourneyCampaignCounts(partnerCompanyId: any, loggedInUserId: number) {
        const url = this.URL + 'partner/journey/campaign/counts/' + partnerCompanyId + '/' + loggedInUserId + '?access_token=' + this.authenticationService.access_token;
        return this.httpClient.get(url)
            .catch(this.handleError);
    }

    getPartnerJourneyTeamInfo(pagination: Pagination) {
        const url = this.URL + 'partner/journey/team/info?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getPartnerJourneyTeamEmails(partnerJourneyRequest: PartnerJourneyRequest) {
        const url = this.URL + 'partner/journey/team/emails?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, partnerJourneyRequest)
            .catch(this.handleError);
    }

    getPartnerJourneyCounts(partnerJourneyRequest: PartnerJourneyRequest) {
        const url = this.URL + 'partner/journey/counts?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, partnerJourneyRequest)
            .catch(this.handleError);
    }

    partnersRedistributedCampaignsData(partnerJourneyRequest: PartnerJourneyRequest) {
        const url = this.URL + 'partner/journey/redistributed/campaign/bar/graph?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, partnerJourneyRequest)
            .catch(this.handleError);
    }

    getPartnerJourneyTrackDetailsByInteraction(pagination: Pagination) {
        const url = this.URL + 'partner/journey/track/interaction?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getTypeWiseTrackContentDetails(pagination: Pagination) {
        const url = this.URL + 'partner/journey/track/content/typewise?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getUserWiseTrackCounts(pagination: Pagination) {
        let url = this.URL + 'partner/journey/track/userwise/count?access_token=' + this.authenticationService.access_token;
        if (pagination.lmsType === 'PLAYBOOK') {
            url = this.URL + 'partner/journey/playbook/userwise/count?access_token=' + this.authenticationService.access_token;
        }
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getUserWiseTrackDetails(pagination: Pagination) {
        const url = this.URL + 'partner/journey/track/userwise/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getTrackAssetDetails(pagination: Pagination) {
        let url = this.URL + 'partner/journey/track/asset/details?access_token=' + this.authenticationService.access_token;
        if (pagination.lmsType === 'PLAYBOOK') {
            url = this.URL + 'partner/journey/playbook/asset/details?access_token=' + this.authenticationService.access_token;
        }
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getShareLeadDetails(pagination: Pagination) {
        const url = this.URL + 'partner/journey/share/lead/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getRedistributedCampaignDetails(pagination: Pagination) {
        const url = this.URL + 'partner/journey/redistributed/campaign/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getLeadDetails(pagination: Pagination) {
        const url = this.URL + 'partner/journey/lead/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getDealDetails(pagination: Pagination) {
        const url = this.URL + 'partner/journey/deal/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getContactDetails(pagination: Pagination) {
        const url = this.URL + 'partner/journey/contact/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getMdfDetails(pagination: Pagination) {
        const url = this.URL + 'partner/journey/mdf/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getPartnerJourneyCompanyDetailsForFilter(pagination: Pagination) {
        const url = this.URL + 'partner/journey/company/details/filter?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }
    getAllPartnerRegionNamesFilter(pagination: Pagination) {
        const url = this.URL + 'partner/region/names/filter?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getPartnerJourneyLeadDealCounts(chartId: string, partnerJourneyRequest: PartnerJourneyRequest) {
        let urlSuffix = "";
        let loggedInUserIdRequestParam = partnerJourneyRequest.loggedInUserId != undefined && partnerJourneyRequest.loggedInUserId > 0 ? "&loggedInUserId=" + partnerJourneyRequest.loggedInUserId : "&loggedInUserId=0";
        let partnerCompanyIdRequestParam = partnerJourneyRequest.partnerCompanyId != undefined && partnerJourneyRequest.partnerCompanyId > 0 ? "&partnerCompanyId=" + partnerJourneyRequest.partnerCompanyId : "&partnerCompanyId=0";
        let fromDateRequestParam = partnerJourneyRequest.fromDateFilterInString != undefined ? "&fromDateFilterInString=" + partnerJourneyRequest.fromDateFilterInString : "&fromDateFilterInString =''"
        let toDateRequestParam = partnerJourneyRequest.toDateFilterInString != undefined ? "&toDateFilterInString=" + partnerJourneyRequest.toDateFilterInString : "&toDateFilterInString =''"
        let timeZoneRequestParam = partnerJourneyRequest.timeZone != undefined ? "&timeZone=" + partnerJourneyRequest.timeZone : "&timeZone =''"
        let teamMemberIdRequestParam = partnerJourneyRequest.teamMemberUserId != undefined ? "&teamMemberUserId=" + partnerJourneyRequest.teamMemberUserId : "&teamMemberUserId=0"
        let partnerJourneyRequestDto = loggedInUserIdRequestParam + partnerCompanyIdRequestParam + fromDateRequestParam + toDateRequestParam + timeZoneRequestParam
            + teamMemberIdRequestParam;
        if (chartId == "partnerJourneyLeadsAndDealsBarChart") {
            urlSuffix = "/lead-to-deal";
        } else {
            urlSuffix = "/campaigns-to-lead";
        }
        const url = this.URL + 'partner/journey' + urlSuffix + '/counts?access_token=' + this.authenticationService.access_token + partnerJourneyRequestDto;
        return this.authenticationService.callGetMethod(url);
    }

    getPartnerJourneyInteractedAndNotInteractedCounts(partnerJourneyRequest: PartnerJourneyRequest) {
        const url = this.URL + 'partner/journey/track/interaction/counts?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, partnerJourneyRequest)
            .catch(this.handleError);
    }

    getPartnerJourneyTypewiseTrackCounts(partnerJourneyRequest: PartnerJourneyRequest) {
        const url = this.URL + 'partner/journey/track/typewise/counts?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, partnerJourneyRequest)
            .catch(this.handleError);
    }
    redistributedCampaignDetailsPieChart(partnerJourneyRequest: PartnerJourneyRequest) {
        const url = this.URL + 'partner/journey/redistributed/campaign/details/count/pie/chart?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, partnerJourneyRequest)
            .catch(this.handleError);
    }

    findDefaultTriggerOptions() {
        let userId = this.authenticationService.getUserId();
        const url = this.URL + 'workflow/findDefaultTriggerOptions/' + userId + '?access_token=' + this.authenticationService.access_token;
        return this.authenticationService.callGetMethod(url);
    }


    saveOrUpdateWorkflow(workflowDto: WorkflowDto) {
        let userId = this.authenticationService.getUserId();
        workflowDto.loggedInUserId = userId;
        if (workflowDto.isAdd) {
            const url = this.URL + 'workflow?access_token=' + this.authenticationService.access_token;
            return this.authenticationService.callPostMethod(url, workflowDto);
        } else {
            const url = this.URL + 'workflow/' + workflowDto.id + '?access_token=' + this.authenticationService.access_token;
            return this.authenticationService.callPutMethod(url, workflowDto);
        }
    }

    findTriggerTitles() {
        let userId = this.authenticationService.getUserId();
        const url = this.URL + 'workflow/findTriggerTitles/' + userId + '?access_token=' + this.authenticationService.access_token;
        return this.authenticationService.callGetMethod(url);
    }

    findAllWorkflows(pagination: Pagination) {
        let userId = this.authenticationService.getUserId();
        let pageableUrl = this.referenceService.getPagebleUrl(pagination);
        let findAllUrl = this.WORK_FLOW_PREFIX_URL + '/' + userId + this.ACCESS_TOKEN_SUFFIX_URL + this.authenticationService.access_token + pageableUrl;
        return this.authenticationService.callGetMethod(findAllUrl);
    }


    deleteWorkflow(id: number) {
        let userId = this.authenticationService.getUserId();
        let deleteWorkflowUrl = this.WORK_FLOW_PREFIX_URL + '/id/' + id + '/loggedInUserId/' + userId + this.ACCESS_TOKEN_SUFFIX_URL + this.authenticationService.access_token;
        return this.authenticationService.callDeleteMethod(deleteWorkflowUrl);
    }

    findWorkflowById(id: number) {
        let userId = this.authenticationService.getUserId();
        let findByWorkFlowUrl = this.WORK_FLOW_PREFIX_URL + '/id/' + id + '/loggedInUserId/' + userId + this.ACCESS_TOKEN_SUFFIX_URL + this.authenticationService.access_token;
        return this.authenticationService.callGetMethod(findByWorkFlowUrl);
    }

    getTeamMemberAnalyticsCounts(teamMemberAnalyticsRequest: TeamMemberAnalyticsRequest, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/counts?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, teamMemberAnalyticsRequest)
            .catch(this.handleError);
    }

    getTeamMemberAnalyticsInteractedAndNotInteractedCounts(teamMemberAnalyticsRequest: TeamMemberAnalyticsRequest, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/track/interaction/counts?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, teamMemberAnalyticsRequest)
            .catch(this.handleError);
    }

    getTeamMemberTrackDetailsByInteraction(pagination: Pagination, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/track/interaction?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }
    getTeamMemberTypewiseTrackCounts(teamMemberAnalyticsRequest: TeamMemberAnalyticsRequest, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/track/typewise/counts?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, teamMemberAnalyticsRequest)
            .catch(this.handleError);
    }

    getTypeWiseTrackContentDetailsForTeamMember(pagination: Pagination, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/track/content/typewise?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);;
    }

    getUserWiseTrackCountsForTeamMember(pagination: Pagination, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        let url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/track/userwise/count?access_token=' + this.authenticationService.access_token;
        if (pagination.lmsType === 'PLAYBOOK') {
            url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/playbook/userwise/count?access_token=' + this.authenticationService.access_token;
        }
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getUserWiseTrackDetailsForTeamMember(pagination: Pagination, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/track/userwise/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getTrackAssetDetailsForTeamMember(pagination: Pagination, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        let url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/track/asset/details?access_token=' + this.authenticationService.access_token;
        if (pagination.lmsType === 'PLAYBOOK') {
            url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/playbook/asset/details?access_token=' + this.authenticationService.access_token;
        }
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getShareLeadDetailsForTeamMember(pagination: Pagination, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/share/lead/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    redistributedCampaignDetailsPieChartForTeamMember(teamMemberAnalyticsRequest: TeamMemberAnalyticsRequest, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v/launched";
        } else {
            urlSuffix = "/redistributed";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/campaign/details/count/pie/chart?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, teamMemberAnalyticsRequest)
            .catch(this.handleError);
    }

    getRedistributedCampaignDetailsForTeamMember(pagination: Pagination, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v/launched";
        } else {
            urlSuffix = "/redistributed";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/campaign/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getLeadDetailsForTeamMember(pagination: Pagination, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/lead/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getDealDetailsForTeamMember(pagination: Pagination, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/deal/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getMdfDetailsForTeamMember(pagination: Pagination) {
        const url = this.URL + 'teamMemberAnalytics/mdf/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getVendorInfoForFilter(pagination: Pagination) {
        const url = this.URL + 'teamMemberAnalytics/vendor/details/filter?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getTeamMemberInfoForFilter(pagination: Pagination) {
        const url = this.URL + 'teamMemberAnalytics/teamMember/details/filter?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getRedistributedCampaignsAndLeadsCountOrLeadsAndDealsForTeamMember(teamMemberAnalyticsRequest: TeamMemberAnalyticsRequest, chartId: string, filterType: string) {
        let urlSuffix = "";
        if (chartId == "redistributeCampaignsAndLeadsCountBarChart") {
            urlSuffix = 'getRedistributedCampaignsAndLeadsCountForBarChartDualAxes';
        } else if (chartId == "top10LeadsAndDealsBarChart") {
            urlSuffix = 'getLeadsAndDealsCount';
        } else if (chartId == "allRedistributeCampaignsAndLeadsCountBarChart") {
            urlSuffix = 'getAllRedistributedCampaignsAndLeadsCountForBarChartDualAxes';
        } else if (chartId == "allLeadsAndDealsBarChart") {
            urlSuffix = 'getAllLeadsAndDealsCount';
        }
        const url = this.URL + 'teamMemberAnalytics/' + urlSuffix + '/' + filterType + '?access_token=' + this.authenticationService.access_token
        return this.httpClient.post(url, teamMemberAnalyticsRequest)
            .catch(this.handleError);
    }

    getContactDetailsForTeamMember(pagination: Pagination, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/contacts/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getAllPartnersDetailsForTeamMember(pagination: Pagination) {
        const url = this.URL + 'teamMemberAnalytics/all/onboard/partner/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getTeamMemberWiseAssetsCount(pagination: Pagination) {
        const url = this.URL + 'teamMemberAnalytics/v/assets/count?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getTeamMemberWiseTrackAssetDetails(pagination: Pagination) {
        const url = this.URL + 'teamMemberAnalytics/v/assets/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    getCompanyDetailsForTeamMember(pagination: Pagination) {
        const url = this.URL + 'teamMemberAnalytics/company/details?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }

    /*********End : XNFR-316************/

    handleError(error: any) {
        return Observable.throw(error);
    }

    findVendorCompanies(pagination: Pagination) {
        const apiUrl = this.URL + 'partnership/findVendorCompanies?access_token=' + this.authenticationService.access_token
        return this.httpClient.post(apiUrl, pagination)
        .catch(this.handleError);    
    }

    findTotalPartnersCount(loggedInUserId: number, applyFilter: boolean) {
        return this.callApiForDashBoard("findTotalPartnersCount", loggedInUserId, applyFilter);
    }

    getAssetDetails(pagination: Pagination) {
        let page = pagination.pageIndex;
        let size = pagination.maxResults;
        let searchKey = pagination.searchKey != null ? pagination.searchKey : "";
        let loggedInUserIdRequestParam = pagination.userId != undefined && pagination.userId > 0 ? "&loggedInUserId=" + pagination.userId : "&loggedInUserId=0";
        let partnerCompanyId = pagination.partnerCompanyId != undefined && pagination.partnerCompanyId > 0 ? pagination.partnerCompanyId : "";
        let searchParam = searchKey.length > 0 ? "&searchKey=" + searchKey : "";
        let fromDateFilterStringParam = pagination.fromDateFilterString != null ? "&fromDateFilterInString=" + pagination.fromDateFilterString : "";
        let toDateFilterStringParam = pagination.toDateFilterString != null ? "&toDateFilterInString=" + pagination.toDateFilterString : "";
        let filterFromDatestringParam = pagination.filterFromDateString != null ? "&filterFromDateString=" + pagination.filterFromDateString : "";
        let filterToDatestringParam = pagination.filterToDateString != null ? "&filterToDateString=" + pagination.filterToDateString : "";
        let sortcolumn = pagination.sortcolumn ? "&sortcolumn=" + pagination.sortcolumn : "";
        let sortingOrder = pagination.sortingOrder ? "&sortingOrder=" + pagination.sortingOrder : "";   
        let assetIds = pagination.assetIds != undefined ? "&assetIds=" + pagination.assetIds : "";
        let companyIds = pagination.selectedCompanyIds != undefined ? "&companyIds=" + pagination.selectedCompanyIds : ""
        let emailIds = pagination.selectedEmailIds != undefined ? "&emailIds=" + pagination.selectedEmailIds : "";
        let teamMemberPartnerFilter = pagination.partnerTeamMemberGroupFilter ? "&partnerTeamMemberGroupFilter=true" : "";
        let timeZoneParam = pagination.timeZone != null ? "&timeZone=" + pagination.timeZone : "";
        let partnershipStatus = "&partnershipStatus=" + pagination.partnershipStatus ;
        let partnerCompanyIdRequestParam = partnerCompanyId != null ? "&partnerCompanyId=" + partnerCompanyId : "";
        let selectedPartnerCompanyIdsRequestParam = pagination.selectedPartnerCompanyIds != undefined ? "&selectedPartnerCompanyIds=" + pagination.selectedPartnerCompanyIds : "";
        let detailedAnalyticsRequestParam = pagination.detailedAnalytics ? "&detailedAnalytics=true" : "";
        let teamMemberUserIdRequestParam = pagination.teamMemberId != undefined && pagination.teamMemberId > 0 ? "&teamMemberUserId=" + pagination.teamMemberId : "";
        let partnerjourneyRequestParam = "&page=" + page + "&size=" + size + searchParam + partnerCompanyIdRequestParam + detailedAnalyticsRequestParam + loggedInUserIdRequestParam
        + fromDateFilterStringParam + toDateFilterStringParam + filterFromDatestringParam + filterToDatestringParam + sortcolumn + sortingOrder + assetIds + companyIds + emailIds + teamMemberPartnerFilter + timeZoneParam   + partnershipStatus + selectedPartnerCompanyIdsRequestParam + teamMemberUserIdRequestParam;
        const url = this.URL + 'partner/journey/assets/details?access_token=' + this.authenticationService.access_token + partnerjourneyRequestParam;
        return this.httpClient.get(url)
            .catch(this.handleError);
    }

    getAssetDetailsForTeamMember(pagination: Pagination) {
        let teamMemberAnalyticsUrl = this.referenceService.getTeamMemberAnalyticsUrl(pagination);
        const url = this.URL + 'teamMemberAnalytics/assets/details?access_token=' + this.authenticationService.access_token + teamMemberAnalyticsUrl;
        return this.httpClient.get(url)
            .catch(this.handleError);
    }
    /*** XNFR-914 */
    getModulesAccessGivenByVendorForPartners(companyProfileName: string, partnerCompanyId: number, teamMemberId: number) {
        partnerCompanyId = partnerCompanyId != undefined && partnerCompanyId > 0 ? partnerCompanyId : 0;
        const url = this.URL + '/module/module-access/' + companyProfileName + '/' + partnerCompanyId + '/' + teamMemberId + '?access_token=' + this.authenticationService.access_token;
        return this.httpClient.get(url)
            .catch(this.handleError);
    }

    /*** XNFR-944 */
    findAllPartnerRegionDetaiils(partnerJourneyRequestDTO: any) {
        const url = this.URL + '/partner/allPartners/details/regionwise/count?access_token=' + this.authenticationService.access_token;
        return this.authenticationService.callPostMethod(url, partnerJourneyRequestDTO);
    }

    /** XNFR-952 start **/
    listAllPartnersForContactUploadManagementSettings(pagination: Pagination) {
        let loggedInUserId = this.authenticationService.getUserId();
        let pageableUrl = this.referenceService.getPagebleUrl(pagination);
        let filterKeyRequestParam = pagination.filterKey != undefined && pagination.filterKey != null ?
            "&filterKey=" + pagination.filterKey : "";
        let findAllUrl = this.PARTNER_URL + "/listAllPartnersForContactUploadManagementSettings/" + loggedInUserId + this.ACCESS_TOKEN_PARAMETERS + pageableUrl + filterKeyRequestParam;
        return this.authenticationService.callGetMethod(findAllUrl);
    }

    saveOrUpdateContactUploadSettings(partnerCompanyMetricsDTOs: Array<PartnerCompanyMetricsDto>) {
        let userId = this.authenticationService.getUserId();
        let url = this.PARTNER_URL + `/saveOrUpdateContactUploadSettings` + `/` + userId + `?access_token=${this.authenticationService.access_token}`;
        return this.authenticationService.callPostMethod(url, partnerCompanyMetricsDTOs);
    }

    fetchTotalNumberOfContactsAddedForCompany(loggedInUserId: number) {
        let url = this.PARTNER_URL + "/fetchTotalNumberOfContactsAddedForCompany/" + loggedInUserId + this.ACCESS_TOKEN_PARAMETERS;
        return this.authenticationService.callGetMethod(url);
    }

    loadContactsUploadedCountByAllPartners(loggedInUserId: number) {
        let url = this.PARTNER_URL + "/loadContactsUploadedCountByAllPartners/" + loggedInUserId + this.ACCESS_TOKEN_PARAMETERS;
        return this.authenticationService.callGetMethod(url);
    }

    loadContactUploadSubscriptionLimitForCompany(loggedInUserId: number) {
        let url = this.PARTNER_URL + "/loadContactUploadSubscriptionLimitForCompany/" + loggedInUserId + this.ACCESS_TOKEN_PARAMETERS;
        return this.authenticationService.callGetMethod(url);
    }

    getTotalContactSubscriptionLimitUsedByCompany(loggedInUserId: number) {
        let url = this.PARTNER_URL + "/getTotalContactSubscriptionLimitUsedByCompany/" + loggedInUserId + this.ACCESS_TOKEN_PARAMETERS;
        return this.authenticationService.callGetMethod(url);
    }
    /** XNFR-952 end **/

    getAllPartners(pagination: Pagination) {
        const url = this.URL + '/partner/allPartners/details/list?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
        .catch(this.handleError);
    }
    // findAllPartnerListByFilters(pagination: Pagination) {
    //     const url = this.URL + 'partner/region/and/status/filter?access_token=' + this.authenticationService.access_token;
    //     return this.httpClient.post(url, pagination)
    //         .catch(this.handleError);
    // }

    //XNFR-921
    getWorkflowsByPlaybookId(playbookId:number) {
        let findAllUrl = this.WORK_FLOW_PREFIX_URL + '/getWorkflowsByPlaybookId/' + playbookId + this.ACCESS_TOKEN_SUFFIX_URL + this.authenticationService.access_token;
        return this.authenticationService.callGetMethod(findAllUrl);
    }

    getAllPartnerAssetNamesFilter(pagination: Pagination) {
        const url = this.URL + 'partner/journey/asset/names/filter?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }
    getAllPartnerEmailIdsFilter(pagination: Pagination) {
        const url = this.URL + 'partner/journey/email/ids/filter?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }
    getAssetInteractionDetails(pagination: Pagination) {
        const url = this.URL + 'partner/asset/journey/asset/details/list?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
        .catch(this.handleError);
    }

    /***** XNFR-988 *****/
    updatePartnerShipStatusForPartner(partnershipids:any, partnerStatus:string) {
        let url = this.URL + 'partnership/updatePartnerShipStatusForPartner?partnerStatus=' + partnerStatus + '&access_token=' + this.authenticationService.access_token;
        return this.authenticationService.callPutMethod(url, partnershipids);
    }

    findPartnerCompaniesByDomain(partnership: Partnership) {
        let loggedInUserId = this.authenticationService.getUserId();
        let url = this.URL + 'partnership/findPartnerCompaniesByDomain/' + loggedInUserId + this.ACCESS_TOKEN_SUFFIX_URL + this.authenticationService.access_token;
        return this.authenticationService.callPostMethod(url, partnership);
    }

    updatePartnerCompaniesByDomain(partnership: Partnership) {
        let loggedInUserId = this.authenticationService.getUserId();
        let url = this.URL + 'partnership/updatePartnerCompaniesByDomain/' + loggedInUserId + this.ACCESS_TOKEN_SUFFIX_URL + this.authenticationService.access_token;
        return this.authenticationService.callPostMethod(url, partnership);
    }

      deactivatePartners(deactivateUserIds: Array<number>) {
        let loggedInUserId = this.authenticationService.getUserId();
        var url = this.URL + "partnership/deactivatePartnerCompanies/" + loggedInUserId + this.ACCESS_TOKEN_SUFFIX_URL + this.authenticationService.access_token;
        return this.authenticationService.callPostMethod(url, deactivateUserIds);
    }
    getPlaybookInteractionDetails(pagination: Pagination) {
        const url = this.URL + 'partner/playbook/journey/interaction/details/list?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
        .catch(this.handleError);
    }

    getAllPlaybookNamesFilter(pagination: Pagination) {
        const url = this.URL + 'partner/playbook/names/filter?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, pagination)
            .catch(this.handleError);
    }
  
    //XNFR-1006
      findTotalDeactivatePartnersCount(loggedInUserId: number, applyFilter: boolean) {
        return this.callApiForDashBoard("findTotalDeactivatePartnersCount", loggedInUserId, applyFilter);
    }

    findTeamMemberPartnerCompany(pagination: Pagination, teamMemberGroupId: number) {
        const apiUrl = this.URL + 'partnership/findTeamMemberPartnerCompany/' + teamMemberGroupId + '?access_token=' + this.authenticationService.access_token
        return this.findPartnerCompainesOrGroups(apiUrl, pagination);
    }
}

