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
    partnerReports( userId: number ): Observable<any> {
        userId = this.authenticationService.checkLoggedInUserId(userId);
        const url = this.URL + 'partner/analytics?access_token=' + this.authenticationService.access_token +
            '&userId=' + userId;
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
    
    listRedistributedCampaigns( campaignId: number, pagination: Pagination ): Observable<any> {
        const url = this.URL + 'partner/list-re-distributed-campaigns/'+campaignId+'?access_token=' + this.authenticationService.access_token;
        return this.httpClient.post( url, pagination )
            .catch( this.handleError );
    }

    getRedistributedCampaignsAndLeadsCount(chartId:string,filterType:string) {
        let urlSuffix = chartId=="redistributeCampaignsAndLeadsCountBarChart" ? 'getRedistributedCampaignsAndLeadsCountForBarChartDualAxes':'getRedistributedCampaignsAndLeadsCountPreviousQuarterForBarChartDualAxes';
        const url = this.URL + 'partner/'+urlSuffix+'/'+this.authenticationService.getUserId()+'/'+filterType+'?access_token=' + this.authenticationService.access_token
        return this.httpClient.get( url )
            .catch( this.handleError );
    }

    getLeadsAndDealsCount(filterType:string) {
        const url = this.URL + 'partner/getLeadsAndDealsCount/'+this.authenticationService.getUserId()+'/'+filterType+'?access_token=' + this.authenticationService.access_token
        return this.httpClient.get( url )
            .catch( this.handleError );
    }

    findLeadsToDealsConversionPercentage(companyId:number) {
        return this.kpiApi(companyId,'findLeadsToDealsConversionPercentage');
    }

    findLeadsOpportunityAmount(companyId:number) {
        return this.kpiApi(companyId,'findLeadsOpportunityAmount');
    }

    kpiApi(companyId:number,url:string){
        const apiUrl = this.URL + 'partner/'+url+'/'+companyId+'?access_token=' + this.authenticationService.access_token
        return this.httpClient.get( apiUrl )
            .catch( this.handleError );
    }


    
    
    handleError( error: any ) {
        return Observable.throw( error );
    }
}
