import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../../core/services/authentication.service';
import { Campaign } from '../models/campaign';
import { Pagination } from '../../core/models/pagination';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
declare var swal, $, videojs, Metronic, Layout, Demo, TableManaged, Promise, jQuery: any;
@Injectable()
export class CampaignService {

    campaign: Campaign;
    eventCampaign:any;
    reDistributeCampaign: Campaign;
    isExistingRedistributedCampaignName: boolean = false;
    componentName: string = "campaign.service.ts";
    URL = this.authenticationService.REST_URL;
    reDistributeEvent = false;
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
        return this.http.post(this.URL + "admin/createCampaign?access_token=" + this.authenticationService.access_token, data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaign(pagination: Pagination, userId: number) {
        userId = this.authenticationService.checkLoggedInUserId(userId);
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

    getEventCampaignById(campaignId:any){
      let eventUrl = this.URL + "campaign/get-event-campaign/"+campaignId+"?access_token=" + this.authenticationService.access_token;
      if(this.reDistributeEvent){ this.reDistributeEvent = false; eventUrl = this.URL + "campaign/get-partner-campaign/"+campaignId+"/"+this.authenticationService.user.id+"?access_token=" + this.authenticationService.access_token }
      return this.http.get(eventUrl)
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

    listCampaignViews(campaignId: number, pagination: Pagination, isChannelCampaign: boolean) {
        return this.http.post(this.URL + 'campaign/views/' + campaignId + '/'+ isChannelCampaign + '?access_token=' + this.authenticationService.access_token, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaignInteractiveViews(pagination: Pagination) {
        return this.http.post(this.URL + 'campaign/interactive-views?access_token=' + this.authenticationService.access_token, pagination)
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

    cancelEvent(cancelEventData: any, userId: number) {
        var url = this.URL + "campaign/cancel-event-campaign/" + userId + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, cancelEventData)
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
        var url = this.URL + "campaign/list-partners-by-campaign-id/" + campaignId + "?access_token=" + this.authenticationService.access_token;
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

    private extractData(res: Response) {
        let body = res.json();
        console.log(body);
        return body || {};
    }


    private handleError(error: any) {
        return Observable.throw(error);
    }

    /*********Common Methods***********/
    setLaunchTime() {
        let date = new Date();
        let year = date.getFullYear();
        let currentMonth = date.getMonth() + 1;
        let month = currentMonth < 10 ? '0' + currentMonth : currentMonth;
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
        let minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
        let am_pm = date.getHours() > 11 ? 'PM' : 'AM';
        return month + "/" + day + "/" + year + " " + hours + ":" + minutes + " "+am_pm;

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



    addEmailId(campaign: Campaign, selectedEmailTemplateId: number, nurtureCampaign: boolean) {
        try {
            var self = this;
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
                self.setData(email, campaign, selectedEmailTemplateId, nurtureCampaign);
            }, function (dismiss: any) {
                console.log('you clicked on option' + dismiss);
            });
        } catch (error) {
            this.logger.showClientErrors(this.componentName, "addEmailId(campaign:" + campaign + ",selectedEmailTemplateId:" + selectedEmailTemplateId + ")", error);
        }

    }


    setData(emailId: string, campaign: Campaign, selectedEmailTemplateId: number, nutrureCampaign: boolean) {
        try {
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
                    if (data.statusCode === 2017) {
                        swal("Mail Sent Successfully", "", "success");
                    }
                },
                error => {
                    this.logger.error("error in setData()", error);
                    swal("Unable to send email", "", "error");
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
        var index = $.inArray(url, links);
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

    createEventCampaign(eventCampaign: any) {
        return this.http.post(this.URL + `campaign/save-event-campaign?access_token=${this.authenticationService.access_token}`, eventCampaign)
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
    saveEventCampaignRsvp(campaignRsvp: any) {
        return this.http.post(this.URL + `save-rsvp`, campaignRsvp)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getOrgCampaignTypes(companyId: any) {
      return this.http.get(this.URL + `campaign/access/${companyId}?access_token=${this.authenticationService.access_token}` )
          .map(this.extractData)
          .catch(this.handleError);
  }

  getCampaignCalendarView(request: any){
      return this.http.post(this.URL + `campaign/calendar?access_token=${this.authenticationService.access_token}`, request )
          .map(this.extractData)
          .catch(this.handleError);
  }
}
