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

@Injectable()
export class ParterService {

    URL = this.authenticationService.REST_URL;
    ACCESS_TOKEN_SUFFIX_URL = "?access_token=";
    WORK_FLOW_PREFIX_URL = this.authenticationService.REST_URL + "workflow";
    WORK_FLOW_URL = this.WORK_FLOW_PREFIX_URL + this.ACCESS_TOKEN_SUFFIX_URL;

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

    launchedCampaignsCountGroupByCampaignType(partnerCompanyId: number, customerId: number) {
        const url = this.URL + 'partner/campaigns-count-by-campaigntype/' + customerId + '/' + partnerCompanyId + '?access_token=' + this.authenticationService.access_token
        return this.httpClient.get(url)
            .catch(this.handleError);
    }

    sendPartnerReminderEmail(user: User, vendorId: number) {
        const url = this.URL + 'partner/send-in-active-reminder-email/' + vendorId + '?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, user)
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

    getRedistributedCampaignsAndLeadsCountOrLeadsAndDeals(chartId: string, filterType: string, applyTeamMemberFilter: boolean) {
        let urlSuffix = "";
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
        const url = this.URL + 'partner/' + urlSuffix + '/' + this.authenticationService.getUserId() + '/' + filterType + '/' + applyTeamMemberFilter + '?access_token=' + this.authenticationService.access_token
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

    getPartnerJourneyLeadDealCounts(partnerJourneyRequest: PartnerJourneyRequest) {
        const url = this.URL + 'partner/journey/lead-to-deal/counts?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post(url, partnerJourneyRequest)
            .catch(this.handleError);
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

    getMdfDetailsForTeamMember(pagination: Pagination, isVendorVersion: boolean) {
        let urlSuffix = "";
        if (isVendorVersion) {
            urlSuffix = "/v";
        }
        const url = this.URL + 'teamMemberAnalytics' + urlSuffix + '/mdf/details?access_token=' + this.authenticationService.access_token;
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

    /*********End : XNFR-316************/

    handleError(error: any) {
        return Observable.throw(error);
    }


}
