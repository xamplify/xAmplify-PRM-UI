import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http'
import { Pagination } from '../../core/models/pagination';
import { User } from '../../core/models/user';
@Injectable()
export class ParterService {
    URL = this.authenticationService.REST_URL;

    constructor( public authenticationService: AuthenticationService, public httpClient: HttpClient ) { }
    partnerReports( userId: number,applyFilter:boolean ): Observable<any> {
        userId = this.authenticationService.checkLoggedInUserId(userId);
        const url = this.URL + 'partner/analytics?access_token=' + this.authenticationService.access_token +
            '&userId=' + userId+"&applyFilter="+applyFilter;
        return this.httpClient.get( url )
            .catch( this.handleError );
    }
    
    approveVendorRequest( partnerId: number, vendorInvitation: any ){
        var newUrl = this.URL + "partnership/approve-partner/"+ this.authenticationService.getUserId() +"/"+ partnerId + "?access_token=" + this.authenticationService.access_token;
        return this.httpClient.post( newUrl, vendorInvitation)
        .catch( this.handleError );
    }
    
    declineVendorRequest( partnerId: number, vendorInvitation: any ){
        var newUrl = this.URL + "partnership/decline-partner/"+ this.authenticationService.getUserId() +"/"+ partnerId + "?access_token=" + this.authenticationService.access_token;
        return this.httpClient.post( newUrl, vendorInvitation)
        .catch( this.handleError );
    }
    
    getActivePartnersAnalytics(pagination:Pagination){
        const url = this.URL + 'partner/active-partner-analytics?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }
    
    getInActivePartnersAnalytics(pagination:Pagination){
        const url = this.URL + 'partner/inactive-partner-analytics?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }
    
    getApprovePartnersAnalytics(pagination:Pagination){
        const url = this.URL + 'partnership/approve-partners?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }
    
    partnerUserInteractionReports( userId: number, pagination: Pagination ): Observable<any> {
        userId = this.authenticationService.checkLoggedInUserId(userId);
        const url = this.URL + 'partner/campaigns?access_token=' + this.authenticationService.access_token +
            '&userId=' + userId
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }
    partnerCampaignInteraction( campaignId: number, pagination: Pagination ) {
        const url = this.URL + 'partner/campaign-interaction?access_token=' + this.authenticationService.access_token +
            '&CampaignId=' + campaignId;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }
    
    launchedCampaignsCountGroupByCampaignType( partnerCompanyId: number, customerId:number ) {
        const url = this.URL + 'partner/campaigns-count-by-campaigntype/'+customerId+'/'+partnerCompanyId+'?access_token=' + this.authenticationService.access_token
        return this.httpClient.get( url )
            .catch( this.handleError );
    }

    sendPartnerReminderEmail(user:User, vendorId:number) {
        const url = this.URL + 'partner/send-in-active-reminder-email/'+vendorId+'?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, user )
        .catch( this.handleError );
    }
    
    listRedistributedThroughPartnerCampaign( userId: number, pagination: Pagination ): Observable<any> {
        userId = this.authenticationService.checkLoggedInUserId(userId);
        const url = this.URL + 'partner/list-re-distributed-partner-campaigns/'+userId+'?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }

	findChannelCampaigns(pagination: Pagination ): Observable<any> {
		pagination.userId = this.authenticationService.getUserId();
        const url = this.URL + 'partner/findChannelCampaigns?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }

    findRedistributedCampaigns(pagination: Pagination ): Observable<any> {
        const url = this.URL + 'partner/findRedistributedCampaigns?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }
    
    listRedistributedCampaigns( campaignId: number, pagination: Pagination ): Observable<any> {
        pagination.userId = this.authenticationService.getUserId();
        const url = this.URL + 'partner/list-re-distributed-campaigns/'+campaignId+'?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }

    getRedistributedCampaignsAndLeadsCountOrLeadsAndDeals(chartId:string,filterType:string,applyTeamMemberFilter:boolean) {
        let urlSuffix = "";
        if(chartId=="redistributeCampaignsAndLeadsCountBarChart"){
            urlSuffix = 'getRedistributedCampaignsAndLeadsCountForBarChartDualAxes';
        }else if(chartId=="redistributeCampaignsAndLeadsCountBarChartQuarterly"){
            urlSuffix = 'getRedistributedCampaignsAndLeadsCountPreviousQuarterForBarChartDualAxes';
        }else if(chartId=="top10LeadsAndDealsBarChart"){
            urlSuffix = 'getLeadsAndDealsCount';
        }
        const url = this.URL + 'partner/'+urlSuffix+'/'+this.authenticationService.getUserId()+'/'+filterType+'/'+applyTeamMemberFilter+'?access_token=' + this.authenticationService.access_token
        return this.httpClient.get( url )
            .catch( this.handleError );
    }

    getLeadsAndDealsCount(filterType:string) {
        const url = this.URL + 'partner/getLeadsAndDealsCount/'+this.authenticationService.getUserId()+'/'+filterType+'?access_token=' + this.authenticationService.access_token
        return this.httpClient.get( url )
            .catch( this.handleError );
    }

    findLeadsToDealsConversionPercentage(companyId:number,applyTeamMemberFilter:boolean) {
        return this.kpiApi(companyId,'findLeadsToDealsConversionPercentage',applyTeamMemberFilter);
    }

    findLeadsOpportunityAmount(companyId:number,applyTeamMemberFilter:boolean) {
        return this.kpiApi(companyId,'findLeadsOpportunityAmount',applyTeamMemberFilter);
    }

    kpiApi(companyId:number,url:string,applyTeamMemberFilter:boolean){
        const apiUrl = this.URL + 'partner/'+url+'/'+companyId+'/'+this.authenticationService.getUserId()+'/'+applyTeamMemberFilter+'?access_token=' + this.authenticationService.access_token
        return this.httpClient.get( apiUrl )
            .catch( this.handleError );
    }

    findPartnerCompanies(pagination:Pagination){
        const apiUrl = this.URL + 'partnership/findPartnerCompanies?access_token=' + this.authenticationService.access_token
        return this.findPartnerCompainesOrGroups(apiUrl,pagination);
    }
    
    loadPartnerCompanies(pagination:Pagination, userId:number){
        const apiUrl = this.URL + 'partnership/loadPartnerCompanies/'+userId+'?access_token=' + this.authenticationService.access_token
        return this.findPartnerCompainesOrGroups(apiUrl,pagination);
    }

    findPartnerGroups(pagination:Pagination){
        const apiUrl = this.URL + 'partnership/findPartnerGroups?access_token=' + this.authenticationService.access_token
        return this.findPartnerCompainesOrGroups(apiUrl,pagination);
    }

    findPartnerCompainesOrGroups(apiUrl:string,pagination:Pagination){
        return this.httpClient.post( apiUrl,pagination )
            .catch( this.handleError );
    }

   
    loadCountryData(userId:number,applyFilter:boolean){
        return this.callApiForDashBoard("countrywisePartnersCount",userId,applyFilter);
    }

    findRedistributedCampaignsCount(userId:number,applyFilter:boolean){
        return this.callApiForDashBoard("findRedistributedCampaignsCount",userId,applyFilter);
    }

    findThroughPartnerCampaignsCount(userId:number,applyFilter:boolean){
        return this.callApiForDashBoard("findThroughPartnerCampaignsCount",userId,applyFilter);
    }

    findActivePartnersCount(userId:number,applyFilter:boolean){
        return this.callApiForDashBoard("findActivePartnersCount",userId,applyFilter);
    }

    findInActivePartnersCount(userId:number,applyFilter:boolean){
        return this.callApiForDashBoard("findInActivePartnersCount",userId,applyFilter);
    }

    findApprovePartnersCount(userId:number,applyFilter:boolean){
        return this.callApiForDashBoard("findApprovePartnersCount",userId,applyFilter);
    }


    callApiForDashBoard(urlPrefix:string,userId:number,applyFilter:boolean){
        const url = this.URL + 'partner/'+urlPrefix+'?access_token=' + this.authenticationService.access_token +
        '&userId=' + userId+"&applyFilter="+applyFilter;
        return this.httpClient.get( url )
        .catch( this.handleError );
    }

    /*********XNFR-220****/
    findAllPartnerCompanies(pagination:Pagination){
        pagination.userId = this.authenticationService.getUserId();
        const url = this.URL + 'partner/allPartners?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }

    /*********XNFR-220****/
    findPartnerCompanyJourney(partnershipId:number){
        const url = this.URL + 'partner/findJourney/'+partnershipId+'?access_token=' + this.authenticationService.access_token;
        return this.httpClient.get( url )
            .catch( this.handleError );
    }

    /*********Start : XNFR-316************/
    getActivePartners(pagination:Pagination){
        const url = this.URL + 'partner/active-partners?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }
    
    getPartnerJourneyAnalytics(partnerCompanyId: any, loggedInUserId: number) {
        const url = this.URL + 'partner/journey/analytics/'+partnerCompanyId+'/'+loggedInUserId+'?access_token=' + this.authenticationService.access_token;
        return this.httpClient.get( url )
            .catch( this.handleError );
    }

    getPartnerJourneyTeamInfo(pagination:Pagination){
        const url = this.URL + 'partner/journey/team/info?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }

    /*********End : XNFR-316************/
    
    handleError( error: any ) {
        return Observable.throw( error );
    }
}
