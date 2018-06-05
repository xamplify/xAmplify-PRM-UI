import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../../core/services/authentication.service';
import { Campaign } from '../models/campaign';
import {Pagination} from '../../core/models/pagination';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
declare var swal, $, videojs , Metronic, Layout , Demo,TableManaged ,Promise,jQuery:any;
@Injectable()
export class CampaignService {

    campaign: Campaign;
    reDistributeCampaign:Campaign;
    componentName:string = "campaign.service.ts";
    URL = this.authenticationService.REST_URL;

    constructor(private http: Http, private authenticationService: AuthenticationService,private logger:XtremandLogger) { }

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
        return this.http.post(this.URL + "admin/createCampaign?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaign(pagination: Pagination, userId: number) {
        var url = this.URL + "admin/listCampaign/" + userId + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);


    }

    getCampaignById(data: any) {
        return this.http.post(this.URL + "admin/getCampaignById?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
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
        return this.http.get(this.URL + "admin/deleteCampaign/" + id + "?access_token=" + this.authenticationService.access_token)
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

    listCampaignViews(campaignId: number, pagination: Pagination) {
        return this.http.post(this.URL + 'campaign/views/' + campaignId + '?access_token=' + this.authenticationService.access_token, pagination)
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

    getCampaignWatchedUsersCount(campaignId: number) {
        return this.http.get(this.URL + 'campaign/watched-users-count/' + campaignId + '?access_token=' + this.authenticationService.access_token + '&actionId=1')
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

    listEmailLogsByCampaignAndUser(campaignId: number, userId: number) {
        return this.http.get(this.URL + 'campaign/user-timeline-log?access_token=' + this.authenticationService.access_token + '&userId=' + userId + '&campaignId=' + campaignId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createSocialCampaign(campaign: Campaign) {
        return this.http.post(this.URL + 'social/campaign?access_token=' + this.authenticationService.access_token, campaign)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveAsCampaign(campaign: Campaign) {
        return this.http.post(this.URL + `campaign/saveas?access_token=${this.authenticationService.access_token}`, campaign)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getCampaignUserWatchedMinutes(campaignId: number, type:string){
        const url = this.URL+ 'campaign/'+campaignId+'/bubble-chart-data?type='+type+'&access_token='+this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    donutCampaignInnerViews(campaignId: number, timePeriod: string, pagination: Pagination){
         const url  = this.URL+'campaign/'+campaignId+'/'+timePeriod+'/views-detail-report?access_token='+this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }    
    getTotalTimeSpentofCamapaigns(userId: number){
      const url = this.URL+'campaign/total-time-spent-by-user?access_token='+this.authenticationService.access_token+'&userId='+userId;
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

    getPartnerCampaignsCountMapGroupByCampaignType(userId: number){
        return this.http.get(this.URL+`campaign/partner-campaigns-count-map/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

  /*  listPartnerCampaigns(userId: number, campaignType: string){
        return this.http.get(this.URL+`campaign/partner-campaigns/${userId}?campaignType=${campaignType}&access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);        
    }*/
    
    
    listPartnerCampaigns(pagination: Pagination, userId: number) {
        var url = this.URL + "campaign/partner-campaigns/" + userId + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);


    }

    getCampaignPartnerByCampaignIdAndUserId(campaignId: number, userId: number){
        return this.http.get(this.URL+`campaign/partner-campaign/${campaignId}/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);        
    }

    private extractData(res: Response) {
        let body = res.json();
        console.log(body);
        return body || {};
    }


    private handleError(error: any) {
        return Observable.throw(error);
    }
    
    /*********Common Methods***********/
    setLaunchTime(){
        let date    = new Date();
        let year      = date.getFullYear();
        let currentMonth = date.getMonth()+1;
        let month   = currentMonth < 10 ? '0' + currentMonth : currentMonth;
        let day     = date.getDate()  < 10 ? '0' + date.getDate()  : date.getDate();
        let hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
        let minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
        return month+"/"+day+"/"+year+" "+hours+":"+minutes;

    }
    setHoursAndMinutesToAutoReponseReplyTimes(timeAndHoursString:string){
        let date = new Date();
        let hoursString = timeAndHoursString.split(":")[0];
        let minutesString = timeAndHoursString.split(":")[1];
        date.setHours(parseInt(hoursString));
        date.setMinutes(parseInt(minutesString));
        return date;
    }
    
    extractTimeFromDate(replyTime){
        let dt = replyTime;
        let hours = dt.getHours() > 9 ? dt.getHours() : '0' + dt.getHours();
        let minutes = dt.getMinutes() > 9 ? dt.getMinutes() : '0' + dt.getMinutes();
        return hours+":"+minutes;
    }
    
    
    
    addEmailId(campaign:Campaign,selectedEmailTemplateId:number,nurtureCampaign:boolean) {
       try{
           var self = this;
           swal( {
               title: 'Please Enter Email Id',
               input: 'email',
               showCancelButton: true,
               confirmButtonText: 'Submit',
               showLoaderOnConfirm: true,
               preConfirm: function( email: string ) {
                   return new Promise( function( resolve, reject ) {
                       setTimeout( function() {
                           resolve();
                       }, 2000 )
                   } )
               },
               allowOutsideClick: false,

           }).then( function( email: string) {
               self.setData( email,campaign,selectedEmailTemplateId,nurtureCampaign);
           }, function( dismiss: any ) {
               console.log( 'you clicked on option' + dismiss );
           });
       }catch(error){
           this.logger.showClientErrors(this.componentName, "addEmailId(campaign:"+campaign+",selectedEmailTemplateId:"+selectedEmailTemplateId+")", error);
       }
    
       }
    
    
    setData(emailId:string,campaign:Campaign,selectedEmailTemplateId:number,nutrureCampaign:boolean){
        try{
            let data: Object = {};
            data['campaignName'] = campaign.campaignName;
            data['fromName'] = campaign.fromName;
            data['email'] = campaign.email;
            data['subjectLine'] = campaign.subjectLine;
            data['nurtureCampaign'] = nutrureCampaign;
            data['preHeader'] = campaign.preHeader;
            data['selectedEmailTemplateId'] = selectedEmailTemplateId;
            data['testEmailId'] = emailId;
            data['userId'] = campaign.userId;
            data['selectedVideoId'] = campaign.selectedVideoId;
            this.sendTestEmail(data)
            .subscribe(
            data => {
               if(data.statusCode===2017){
                   swal("Mail Sent Successfully", "", "success");
                }
            },
            error => {
                this.logger.error("error in setData()", error);
                swal("Unable to send email", "", "error");
            },
            () => this.logger.info("Finished setData()")
        );
        }catch(error){
            this.logger.showClientErrors(this.componentName, "addEmailId(emailId:"+emailId+":campaign:"+campaign+",selectedEmailTemplateId:"+selectedEmailTemplateId+")", error);
        }
   
    }
    
    
}
