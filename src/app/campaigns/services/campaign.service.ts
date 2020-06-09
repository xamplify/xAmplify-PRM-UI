import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../../core/services/authentication.service';
import { Campaign } from '../models/campaign';
import { Pagination } from '../../core/models/pagination';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CampaignWorkflowPostDto } from '../models/campaign-workflow-post-dto';
import { DashboardAnalyticsDto } from 'app/dashboard/models/dashboard-analytics-dto';

declare var swal, $, Promise: any;
@Injectable()
export class CampaignService {
   
    campaign: Campaign;
    eventCampaign:any;
    reDistributeCampaign: Campaign;
    isExistingRedistributedCampaignName: boolean = false;
    componentName: string = "campaign.service.ts";
    URL = this.authenticationService.REST_URL;
    reDistributeEvent = false;
    loading = false;
    constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger) { }

    saveCampaignDetails(data: any) {
        return this.http.post(this.URL + "admin/saveCampaignDetails?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveCampaignVideo(data: any) {
        return this.http.post(this.URL + "admin/saveCampaignVideo?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveCampaignContactList(data: any) {
        return this.http.post(this.URL + "admin/saveCampaignContactList?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    lauchCampaign(data: any) {
        return this.http.post(this.URL + "admin/launchCampaign?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveCampaign(data: any) {
        if(this.authenticationService.vanityURLEnabled && this.authenticationService.companyProfileName){
            data['companyProfileName'] = this.authenticationService.companyProfileName;
        }
        return this.http.post(this.URL + "admin/createCampaign?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaign(pagination: Pagination, userId: number) {
        userId = this.authenticationService.checkLoggedInUserId(userId);
        let url = this.URL + "admin/listCampaign/" + userId + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCampaignById(data: any) {
        return this.http.post(this.URL + "admin/getCampaignById?access_token=" + this.authenticationService.access_token,data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEventCampaignById(campaignId:any){
      let eventUrl = this.URL + "campaign/get-event-campaign/"+campaignId+"?access_token=" + this.authenticationService.access_token;
      if(this.reDistributeEvent){ this.reDistributeEvent = false; eventUrl = this.URL + "campaign/get-partner-campaign/"+campaignId+"/"+this.authenticationService.user.id+"?access_token=" + this.authenticationService.access_token }
      return this.http.get(eventUrl)
      .map(this.extractData)
      .catch(this.handleError);
    }
    getPreviewCampaignById(data:any, type:string){
      if(type === "EVENT") {
        let eventUrl = this.URL + "campaign/get-event-campaign/"+data.campaignId+"?access_token=" + this.authenticationService.access_token;
        if(this.reDistributeEvent){ this.reDistributeEvent = false; eventUrl = this.URL + "campaign/get-partner-campaign/"+data.campaignId+"/"+this.authenticationService.user.id+"?access_token=" + this.authenticationService.access_token }
        return this.http.get(eventUrl)
        .map(this.extractData)
        .catch(this.handleError);
      } else {
        return this.http.post(this.URL + "admin/getCampaignById?access_token=" + this.authenticationService.access_token, data)
        .map(this.extractData)
        .catch(this.handleError);
      }
    }

    getParnterCampaignById(data: any) {
        return this.http.post(this.URL + "admin/getPartnerCampaignById?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCampaignNames(userId: number) {
        return this.http.get(this.URL + "admin/listCampaignNames/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    delete(id: number) {
        return this.http.get(this.URL + "admin/deleteCampaign/" + id + "/"+this.authenticationService.getUserId()+"?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }


    sendTestEmail(data: any) {
        return this.http.post(this.URL + "admin/sendTestEmail?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getHeatMap(userId: number, campaignId: number) {
        return this.http.get(this.URL + 'user-video-heat-map?access_token=' + this.authenticationService.access_token + '&userId=' + userId + '&campaignId=' + campaignId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getHeatMapByUniqueSession(sessionId: string) {
        return this.http.get(this.URL + 'user-video-heat-map-by-unique-session?access_token=' + this.authenticationService.access_token + '&sessionId=' + sessionId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    campaignWatchedUsersListCount(campaignId: number) {
        return this.http.get(this.URL + 'campaign/watched-users-list-count/' + campaignId + '?access_token=' + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    usersWatchList(campaignId: number, pagination: Pagination) {
        return this.http.post(this.URL + 'campaign/watched-users-list/' + campaignId + '?access_token=' + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    emailActionList(campaignId: number, actionType: string, pagination: Pagination) {
        return this.http.post(this.URL + 'campaign/list-emaillogs-by-action/' + campaignId + '/' + actionType + '?access_token=' + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    smsActionList(campaignId: number, actionType: string, pagination: Pagination) {
        return this.http.post(this.URL + 'campaign/list-smslogs-by-action/' + campaignId + '/' + actionType + '?access_token=' + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaignViews(campaignId: number, pagination: Pagination, isChannelCampaign: boolean,smsAnalytics:boolean) {
        return this.http.post(this.URL + 'campaign/views/' + campaignId + '/'+ isChannelCampaign + '/'+smsAnalytics+'?access_token=' + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaignInteractiveViews(pagination: Pagination,smsAnalytics:boolean) {
        return this.http.post(this.URL + 'campaign/interactive-views/'+smsAnalytics+'?access_token=' + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCampaignViewsReportDurationWise(campaignId: number) {
        return this.http.get(this.URL + 'campaign/total-views/' + campaignId + '?access_token=' + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEmailLogCountByCampaign(campaignId: number) {
        return this.http.get(this.URL + 'campaign/emaillog-count/' + campaignId + '?access_token=' + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEmailSentCount(campaignId: number) {
        return this.http.get(this.URL + 'emails_sent_count/' + campaignId + '?access_token=' + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getSmsLogCountByCampaign(campaignId: number) {
        return this.http.get(this.URL + 'campaign/smslog-count/' + campaignId + '?access_token=' + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getSmsSentCount(campaignId: number) {
        return this.http.get(this.URL + 'sms_sent_count/' + campaignId + '?access_token=' + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getSmsSentSuccessCount(campaignId: number) {
        return this.http.get(this.URL + 'sms_sent_success_count/' + campaignId + '?access_token=' + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getSmsSentFailureCount(campaignId: number) {
        return this.http.get(this.URL + 'sms_sent_failure_count/' + campaignId + '?access_token=' + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCampaignWatchedUsersCount(campaignId: number) {
        return this.http.get(this.URL + 'campaign/watched-users-count/' + campaignId + '?access_token=' + this.authenticationService.access_token + '&actionId=1')
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCampaignTotalViewsCount(campaignId: number) {
        return this.http.get(this.URL + 'campaign/total-views-count/' + campaignId + '?access_token=' + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCountryWiseCampaignViews(campaignId: number) {
        return this.http.get(this.URL + 'campaign/world-map/' + campaignId + '?access_token=' + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaignInteractionsData(customerId: number, reportType: string) {
        return this.http.get(this.URL + 'admin/list-campaign-interactions?access_token=' + this.authenticationService.access_token + '&customerId=' + customerId + '&reportType=' + reportType)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listLaunchedCampaign(userId: number) {
        return this.http.get(this.URL + 'admin/listLaunchedCampaign?access_token=' + this.authenticationService.access_token + '&userId=' + userId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserCampaignReport(userId: number) {
        return this.http.get(this.URL + 'admin/get-user-campaign-report?access_token=' + this.authenticationService.access_token + '&userId=' + userId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveUserCampaignReport(data: any) {
        return this.http.post(this.URL + "admin/save-user-campaign-report?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listautoResponseAnalyticsByCampaignAndUser(json: any){
 return this.http.post(this.URL + 'autoResponse/analytics?access_token=' + this.authenticationService.access_token, json)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listEmailLogsByCampaignAndUser(campaignId: number, userId: number) {
        return this.http.get(this.URL + 'campaign/user-timeline-log?access_token=' + this.authenticationService.access_token + '&userId=' + userId + '&campaignId=' + campaignId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listSMSLogsByCampaignAndUser(campaignId: number, userId: number) {
        return this.http.get(this.URL + 'campaign/user-timeline-log-sms/'+campaignId+'/'+userId+'?access_token=' + this.authenticationService.access_token )
            .map(this.extractData)
            .catch(this.handleError);
    }

    createSocialCampaign(campaign: Campaign) {
        return this.http.post(this.URL + 'social/campaign?access_token=' + this.authenticationService.access_token, campaign)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveAsCampaign(campaign:any) {
      let campaignURL:any;
      if(campaign.campaignType==='EVENT') { campaignURL = this.URL + `campaign/save-as-event-campaign?access_token=${this.authenticationService.access_token}`;
      } else { campaignURL = this.URL + `campaign/saveas?access_token=${this.authenticationService.access_token}`; }
      return this.http.post(campaignURL, campaign)
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveAsEventCampaign(campaign:any) {
      return this.http.post(this.URL + `campaign/save-as-event-campaign?access_token=${this.authenticationService.access_token}`, campaign)
          .map(this.extractData)
          .catch(this.handleError);
   }
    getCampaignUserWatchedMinutes(campaignId: number, type: string) {
        const url = this.URL + 'campaign/' + campaignId + '/bubble-chart-data?type=' + type + '&access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    donutCampaignInnerViews(campaignId: number, timePeriod: string, pagination: Pagination) {
        const url = this.URL + 'campaign/' + campaignId + '/' + timePeriod + '/views-detail-report?access_token=' + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getTotalTimeSpentofCamapaigns(userId: number, campaignId: number) {
        const url = this.URL + 'campaign/total-time-spent-by-user?access_token=' + this.authenticationService.access_token + '&userId=' + userId + '&campaignId=' + campaignId;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getCampaignUsersWatchedInfo(campaignId:number, countryCode: string, pagination: Pagination){
        const url = this.URL+'campaign/'+campaignId+'/countrywise-users-report?access_token='+this.authenticationService.access_token+'&countryCode='+countryCode;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getAllTeamMemberEmailIds(userId: number) {
        return this.http.get(this.URL + "admin/listAllTeamMemberEmailIds/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPartnerCampaignsCountMapGroupByCampaignType(userId: number) {
        return this.http.get(this.URL + `campaign/partner-campaigns-count-map/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getPartnerCampaignsNotifications(userId: number) {
        return this.http.get(this.URL + `partner/access/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    hasRedistributeAccess(userId: number) {
        return this.http.get(this.URL + `campaign/checkRedistibuteAccess/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /*  listPartnerCampaigns(userId: number, campaignType: string){
          return this.http.get(this.URL+`campaign/partner-campaigns/${userId}?campaignType=${campaignType}&access_token=${this.authenticationService.access_token}`)
              .map(this.extractData)
              .catch(this.handleError);
      }*/

    listPartnerCampaigns(pagination: Pagination, userId: number) {
        let url = this.URL + "campaign/partner-campaigns/" + userId + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    cancelEvent(cancelEventData: any, userId: number) {
        let url = this.URL + "campaign/cancel-event-campaign/" + userId + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, cancelEventData)
            .map(this.extractData)
            .catch(this.handleError);
    }
    sendEmailNotOpenReminder(data: any) {
        return this.http.post(this.URL + "campaign/send-event-reminder?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getPartnerRedistributedCampaignsRSVP(campaignId: number) {
        const url = this.URL + 'campaign/' + campaignId + '/redistributed-campaigns-rsvp-count?access_token=' + this.authenticationService.access_token ;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getEventCampaignDetailsByCampaignId(campaignId: number, isChannelCampaign: boolean) {
        const url = this.URL + 'campaign/' + campaignId + '/rsvp-details?access_token=' + this.authenticationService.access_token + '&channelCampaign=' + isChannelCampaign;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEventCampaignDetailAnalytics(campaignId: number, resposeType: any, isChannelCampaign: boolean, pagination: Pagination) {
        const url = this.URL + 'campaign/' + campaignId + '/rsvp-user-details/'+ resposeType +'?access_token=' + this.authenticationService.access_token + '&channelCampaign=' + isChannelCampaign;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    //
    getAllPartnerRestributionEventCampaignAnalytics(campaignId: number, resposeType: any, isChannelCampaign: boolean, pagination: Pagination) {
        const url = this.URL + 'campaign/' + campaignId + '/redistributed-campaigns-rsvp-details/'+ resposeType +'?access_token=' + this.authenticationService.access_token + '&channelCampaign=' + isChannelCampaign;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
     
    
    //

    getRedistributionEventCampaignDetailAnalytics(campaignId: number, resposeType: any, userId: number, isChannelCampaign: boolean, pagination: Pagination) {
        const url = this.URL + 'campaign/' + campaignId + '/' + userId + '/rsvp-user-details/'+ resposeType +'?access_token=' + this.authenticationService.access_token + '&channelCampaign=' + isChannelCampaign;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getRestributionEventCampaignAnalytics(campaignId: number, userId: number) {
        const url = this.URL + 'campaign/' + campaignId + "/" + userId + '/rsvp-details?access_token=' + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEventCampaignEmailOpenDetails(campaignId: number, isChannelCampaign: boolean, pagination: Pagination) {
        const url = this.URL + 'campaign/' + campaignId + "/rsvp-email-open-details?access_token=" + this.authenticationService.access_token + "&channelCampaign=" + isChannelCampaign+"&type=OPEN";
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEventCampaignEmailNotOpenDetails(campaignId: number, isChannelCampaign: boolean, pagination: Pagination) {
        const url = this.URL + 'campaign/' + campaignId + "/rsvp-email-open-details?access_token=" + this.authenticationService.access_token + "&channelCampaign=" + isChannelCampaign+"&type=NOTOPEN";
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEventCampaignRedistributionEmailOpenDetails(campaignId: number, userId: any, pagination: Pagination) {
        const url = this.URL + 'campaign/' + campaignId +'/'+ userId + "/rsvp-email-open-details?access_token=" + this.authenticationService.access_token+"&type=OPEN";
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEventCampaignRedistributionEmailNotOpenDetails(campaignId: number, userId: any, pagination: Pagination) {
        const url = this.URL + 'campaign/' + campaignId +'/'+ userId + "/rsvp-email-open-details?access_token=" + this.authenticationService.access_token+"&type=NOTOPEN";
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEventCampaignRedistributionInvitiesDetails(campaignId: number, userId: any, pagination: Pagination) {
        const url = this.URL + 'campaign/users-details/' + campaignId +'/'+ userId + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEventCampaignPartnerInvitiesDetails(campaignId: number, pagination: Pagination) {
        const url = this.URL + 'campaign/partners-info/' + campaignId + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEventCampaignTotalInvitiesDetails(campaignId: number, pagination: Pagination) {
        const url = this.URL + 'campaign/partners-users-info/' + campaignId + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCampaignPartnerByCampaignIdAndUserId(campaignId: number, userId: number) {
        return this.http.get(this.URL + `campaign/partner-campaign/${campaignId}/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    loadUsersOfContactList( contactListId: number, campaignId:number, pagination: Pagination ) {
        return this.http.post( this.URL+'campaign/users-info/'+campaignId+"/" + contactListId+'?access_token=' + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }
    listCampaignPartners(pagination: Pagination, campaignId: number) {
        let url = this.URL + "campaign/list-partners-by-campaign-id/" + campaignId + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);


    }

    deletePartner(partner:any) {
        const url = this.URL + "campaign/delete-campaign-partner?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, partner)
            .map(this.extractData)
            .catch(this.handleError);


    }
    
    getLeadsCount(campaignId: number) {
        return this.http.get(this.URL + `campaign/${campaignId}/leads-count?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getPartnerLeadsCount(campaignId: number, partnerId: number) {
        return this.http.get(this.URL + `campaign/${campaignId}/${partnerId}/leads-count?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getEventLeadsDetails(pagination: Pagination,campaignId: number,detailType: string) {
        const url = this.URL + "campaign/"+ campaignId +"/leads-details?access_token=" + this.authenticationService.access_token + "&type="+ detailType;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getEventTotalLeadsDetails(pagination: Pagination,campaignId: number,detailType: string) {
        const url = this.URL + "campaign/"+ campaignId +"/total-leads-details?access_token=" + this.authenticationService.access_token + "&type="+ detailType;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    downloadLeadList( campaignId: number, leadType: any): Observable<Response> {
        this.logger.info( campaignId );
        return this.http.get( this.URL + "campaign/" + campaignId + "/download-leads-details?access_token=" + this.authenticationService.access_token + "&type=" + leadType)
            .map(( response: any ) => response );
    }
    
    downRegularVideoCampaignViews( campaignId: number, campaignType: string): Observable<Response> {
        this.logger.info( campaignId );
        return this.http.get( this.URL + "campaign/" + campaignId + "/" +campaignType + "/download-campaign-views-details?access_token=" + this.authenticationService.access_token )
            .map(( response: any ) => response );
    }
    
    
    downloadPartnerLeadList( campaignId: number, partnerId, leadType: any): Observable<Response> {
        this.logger.info( campaignId );
        return this.http.get( this.URL + "campaign/" + campaignId + "/"+ partnerId +"/download-leads-details?access_token=" + this.authenticationService.access_token + "&type=" + leadType)
            .map(( response: any ) => response );
    }


    
    getPartnerEventLeadsDetails(pagination: Pagination,campaignId: number, partnerId: number, detailType: string) {
        const url = this.URL + "campaign/"+ campaignId + "/" + partnerId +"/partner-leads-details?access_token=" + this.authenticationService.access_token + "&type="+ detailType;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }


    private handleError(error: any) {
        return Observable.throw(error);
    }

    /*********Common Methods***********/
    setLaunchTime() {
       /* let date = new Date();
        let year = date.getFullYear();
        let currentMonth = date.getMonth() + 1;
        let month = currentMonth < 10 ? '0' + currentMonth : currentMonth;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
        let minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
        let am_pm = date.getHours() > 11 ? 'PM' : 'AM';
        return month + "/" + day + "/" + year + " " + hours + ":" + minutes + " "+am_pm;*/


        let date = new Date();
        let today = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();;
        let currentMonth =  date.getMonth()+1;
        let month = currentMonth < 10 ? '0' + currentMonth : currentMonth;
        let year = date.getFullYear();
        let hours = date.getHours();
        let mintues = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        let mintuesInString = mintues < 10 ? '0'+mintues : mintues;
        let currentDateTime = month + '/' + today + '/' + year + ' ' + hours + ':' + mintuesInString + ' ' + ampm;
        return currentDateTime;
    }
    setHoursAndMinutesToAutoReponseReplyTimes(timeAndHoursString: string) {
        let date = new Date();
        let hoursString = timeAndHoursString.split(":")[0];
        let minutesString = timeAndHoursString.split(":")[1];
        date.setHours(parseInt(hoursString));
        date.setMinutes(parseInt(minutesString));
        return date;
    }
    extractTimeFromDate(replyTime) {
        let dt = replyTime;
        let hours = dt.getHours() > 9 ? dt.getHours() : '0' + dt.getHours();
        let minutes = dt.getMinutes() > 9 ? dt.getMinutes() : '0' + dt.getMinutes();
        return hours + ":" + minutes;
    }
    extractTodayDateAsString() {
        let currentTime = new Date();
        let year = currentTime.getFullYear();
        let currentMonth = currentTime.getMonth() + 1;
        let month = currentMonth < 10 ? '0' + currentMonth : currentMonth;
        let day = currentTime.getDate() < 10 ? '0' + currentTime.getDate() : currentTime.getDate();
        return $.trim(month + "/" + day + "/" + year);
    }
    
    

    addEmailId(campaign: Campaign, selectedEmailTemplateId: number, selectedLandingPageId :number, nurtureCampaign: boolean) {
        try {
            let self = this;
            swal({
                title: 'Please Enter Email Id',
                input: 'email',
                showCancelButton: true,
                confirmButtonText: 'Submit',
                showLoaderOnConfirm: true,
                preConfirm: function (email: string) {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve();
                        }, 2000)
                    })
                },
                allowOutsideClick: false,

            }).then(function (email: string) {
                self.loading = true;
               self.setData(email, campaign, selectedEmailTemplateId,selectedLandingPageId, nurtureCampaign);
            }, function (dismiss: any) {
                console.log('you clicked on option' + dismiss);
            });
        } catch (error) {
            this.logger.showClientErrors(this.componentName, "addEmailId(campaign:" + campaign + ",selectedEmailTemplateId:" + selectedEmailTemplateId + ")", error);
        }

    }


    setData(emailId: string, campaign: Campaign, selectedEmailTemplateId: number,selectedLandingPageId:number, nutrureCampaign: boolean) {
        try {
            let data: Object = {};
            data['campaignName'] = campaign.campaignName;
            data['fromName'] = campaign.fromName;
            data['email'] = campaign.email;
            data['subjectLine'] = campaign.subjectLine;
            data['nurtureCampaign'] = nutrureCampaign;
            data['channelCampaign'] = campaign.channelCampaign;
            data['preHeader'] = campaign.preHeader;
            if(campaign.campaignTypeInString=='LANDINGPAGE'){
                data['landingPageId'] = selectedLandingPageId;
            }else{
                data['selectedEmailTemplateId'] = selectedEmailTemplateId;
            }
            data['campaignTypeInString'] = campaign.campaignTypeInString;
            data['testEmailId'] = emailId;
            if(nutrureCampaign){
                data['userId'] = campaign.userId;
                data['enableCoBrandingLogo'] = campaign.enableCoBrandingLogo;
                data['parentCampaignUserId'] =this.authenticationService.getUserId();
            }else{
                data['userId'] = campaign.userId;
            }
            data['selectedVideoId'] = campaign.selectedVideoId;
            data['parentCampaignId'] = campaign.parentCampaignId;
          console.log(data);
            this.sendTestEmail(data)
                .subscribe(
                data => {
                    if (data.statusCode === 2017) {
                        swal("Mail Sent Successfully", "", "success");
                        this.loading = false;
                    }
                },
                error => {
                    this.logger.error("error in setData()", error);
                    swal("Unable to send email", "", "error");
                    this.loading = false;
                },
                () => this.logger.info("Finished setData()")
                );
        } catch (error) {
            this.logger.showClientErrors(this.componentName, "addEmailId(emailId:" + emailId + ":campaign:" + campaign + ",selectedEmailTemplateId:" + selectedEmailTemplateId + ")", error);
        }

    }
    addErrorClassToDiv(list: any) {
        let self = this;
        $.each(list, function (index, divId) {
            $('#' + divId).removeClass('portlet light dashboard-stat2 border-error');
            self.removeStyleAttrByDivId('send-time-' + divId);
            $('#' + divId).addClass('portlet light dashboard-stat2 border-error');
            $('#send-time-' + divId).css('color', 'red');
        });

    }
    removeStyleAttrByDivId(divId: string) {
        $('#' + divId).removeAttr("style");
    }

    removeUrls(url: string, links: any) {
        let index = $.inArray(url, links);
        if (index >= 0) {
            links.splice(index, 1);
        }
        return links;
    }

    setAutoReplyDefaultTime(campaignType:string,replyInDays:number,replyTime:Date,scheduleTime:any){
        let currentTime = new Date();
        let isValid = (replyInDays==0 && replyTime.getTime()< currentTime.getTime());
        if("NOW"===campaignType && isValid){
            return currentTime;
        }else if("SCHEDULE"===campaignType && isValid){
            let date = $.trim(scheduleTime.split(' ')[0]);
            if(this.extractTodayDateAsString()==date){
                return currentTime;
            }else{
                return replyTime;
            }
        }else{
            return replyTime;
        }
    }

    listEmailLogsByCampaignIdUserIdActionType(campaignId: number, userId: number, actionType: string) {
        return this.http.get(this.URL + `campaign/list-emaillogs-history/${campaignId}/${userId}/${actionType}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createEventCampaign(eventCampaign: any, eventUpdate: boolean) {
        let eventUrl;
        if(eventUpdate){
            eventUrl = this.URL + "campaign/update-event-campaign?access_token=" + this.authenticationService.access_token;
        }else{
            eventUrl = this.URL + `campaign/save-event-campaign?access_token=${this.authenticationService.access_token}`
        }
        return this.http.post(eventUrl, eventCampaign)
            .map(this.extractData)
            .catch(this.handleError);
    }

    uploadEventCampaignMedia(userId: number, formData: FormData) {
        return this.http.post(this.URL + `campaign/upload-campaign-event-media/?userId=${userId}&access_token=${this.authenticationService.access_token}`, formData)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getEventCampaignByAlias(alias: string) {
        return this.http.get(this.URL + `get-event-campaign-rsvp-alias/${alias}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getEventCampaignByAliasSms(alias: string) {
        return this.http.get(this.URL + `get-event-campaign-rsvp-alias-sms/${alias}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveEventCampaignRsvp(campaignRsvp: any) {
        return this.http.post(this.URL + `save-rsvp`, campaignRsvp)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    saveEventCampaignRsvpSms(campaignRsvp: any) {
        return this.http.post(this.URL + `save-rsvp-sms`, campaignRsvp)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    
    getOrgCampaignTypes(companyId: any) {
      return this.http.get(this.URL + `campaign/access/${companyId}?access_token=${this.authenticationService.access_token}` )
          .map(this.extractData)
          .catch(this.handleError);
  }

  getCampaignCalendarView(request: any){
    if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
        request.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        request.vanityUrlFilter = true;
    }
      return this.http.post(this.URL + `campaign/calendar?access_token=${this.authenticationService.access_token}`, request )
          .map(this.extractData)
          .catch(this.handleError);
  }
  
  
  listAutoResponseAnalytics(pagination:Pagination) {
      let url =this.URL+"autoResponse/analytics?access_token="+this.authenticationService.access_token;
      return this.http.post(url, pagination)
      .map(this.extractData)
      .catch(this.handleError);   
  }

    getPartnerTemplatePreview(campaignId: any, userId: number) {
        let url = this.URL + "admin/getPartnerTemplate/"+campaignId+"/"+userId+"?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getRedistributedCampaignIds(partnerId: number,campaignId:number) {
        return this.http.get(this.URL + "getRedistributedCampaignIdsByCampaignId/" + campaignId + "/"+partnerId+"?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getContactListToInvite(userId:number,pagination:Pagination) {
        return this.http.post(this.URL + "campaign/getMoreContactLists/"+userId+"?access_token=" + this.authenticationService.access_token,pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    sendEventToContactList(data:any) {
        return this.http.post(this.URL + "campaign/sendEventToContactList?access_token=" + this.authenticationService.access_token,data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    sendPublicEventEmail(data: any) {
        return this.http.post(this.URL + "campaign/sendPublicEventEmail?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getEmailTemplateByCampaignId(data:any){
        return this.http.post(this.URL + "campaign/getCampaignEmailTemplate?access_token=" + this.authenticationService.access_token,data)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    checkCampaignAccess(campaignId: number,userId:number) {
        return this.http.get(this.URL + "campaign/checkAccess/"+campaignId+"/"+userId+"?access_token=" + this.authenticationService.access_token,"")
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaignEmailTemplateUrls(campaignId: number) {
        return this.http.get(this.URL + "campaign/listCampaignEmailTemplateUrls/" + campaignId+"?access_token=" + this.authenticationService.access_token,"")
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaignWorkflowsOptions() {
        return this.http.get(this.URL + "campaign/listCampaignWorkflowOptions?access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    listClickedUrlAnalyticsForVendor(pagination:Pagination) {
        return this.http.post(this.URL + "campaign/listClickedUrlAnalyticsForVendor?access_token=" + this.authenticationService.access_token,pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveWorkflows(campaignWorkflowPostDto: CampaignWorkflowPostDto) {
        return this.http.post(this.URL + "campaign/addWorkflows?access_token=" + this.authenticationService.access_token, campaignWorkflowPostDto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaignsByUserListIdAndUserId(pagination: Pagination) {
        let url = this.URL + "campaign/listLaunchedCampaignsByUserListId?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }


    listEmailTemplateOrLandingPageFolders(userId:number,campaignType:string){
        let url = "listEmailTemplateCategories";
        if("landingPage"==campaignType){
            url = "listLandingPageCategories"
        }
        return this.http.get(this.URL + "category/"+url+"/"+userId+"?access_token=" + this.authenticationService.access_token, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateFolder(campaignId: number,categoryId:number,updatedUserId:number) {
        return this.http.get(this.URL + "campaign/changeFolder/" + campaignId +"/"+categoryId+"/"+updatedUserId+ "?access_token=" + this.authenticationService.access_token,"")
            .map(this.extractData)
            .catch(this.handleError);
    }

    changeWorkflowStatus(workflowId:number,workflowStatus:string,workflowType:number){
        let url = this.URL+"campaign/";
        if(workflowType==1 && workflowStatus=='INACTIVE'){
            url+= 'pauseAutoReplyWorkflow';
        }else if(workflowType==1 && workflowStatus=='ACTIVE'){
            url+= 'resumeAutoReplyWorkflow';
        }else if(workflowType==2 && workflowStatus=='INACTIVE'){
            url+= 'pauseUrlWorkflow';
        }else if(workflowType==2 && workflowStatus=='ACTIVE'){
            url+= 'resumeUrlWorkflow';
        }
        return this.http.get(url+"/"+workflowId+"?access_token=" + this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }

    getCampaignContactsOrPartners(pagination:Pagination){
        return this.http.post(this.URL + "campaign/getCampaignContactsOrPartners?access_token=" + this.authenticationService.access_token, pagination)
        .map(this.extractData)
            .catch(this.handleError);
	}


    changeUserWorkFlowStatus(campaignUser:any){
        let url = this.URL+"campaign/";
        if(campaignUser.status=="Resume"){
            url+='resumeWorkFlowForCampaignUser';
        }else if(campaignUser.status=="Pause"){
            url+='pauseWorkFlowForCampaignUser';
        }
        return this.http.post(url+"?access_token=" + this.authenticationService.access_token, campaignUser)
        .map(this.extractData)
            .catch(this.handleError);

    }

    hasCampaignCreateAccess(){
        return this.http.get(this.URL + "campaign/hasCreateCampaignAccess/"+this.authenticationService.getUserId()+"?access_token=" + this.authenticationService.access_token,"")
        .map(this.extractData)
            .catch(this.handleError);
	}


  

    // Added by Vivek for Vanity URL

    getUserCampaignReportForVanityURL(dashboardAnalyticsDto:DashboardAnalyticsDto) {
        var url = this.URL + "dashboard/views/get-user-campaign-report?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, dashboardAnalyticsDto)
            .map(this.extractData)
            .catch(this.handleError);
    }


    changeCampaignUserWorkflowStatus(campaignUserWorkflowStatusPostDTO:any){
        let status = campaignUserWorkflowStatusPostDTO.status;
        let url = this.URL + "campaign/";
        if(status=="ACTIVE"){
            url+='resumeWorkFlowForCampaignUser';
        }else{
            url+='pauseWorkFlowForCampaignUser';
        }
        return this.http.post(url+"?access_token=" + this.authenticationService.access_token, campaignUserWorkflowStatusPostDTO)
            .map(this.extractData)
            .catch(this.handleError);
    }


    listCampaignInteractionsDataForVanityURL(dashboardAnalyticsDto:DashboardAnalyticsDto, reportType: string) {        
        var url = this.URL + "dashboard/views/list-campaign-interactions?access_token=" + this.authenticationService.access_token + '&limit=4'  + '&reportType=' + reportType;
        return this.http.post(url, dashboardAnalyticsDto)
            .map(this.extractData)
            .catch(this.handleError);
    }


}
