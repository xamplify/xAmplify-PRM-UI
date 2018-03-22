import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SaveVideoFile } from '../videos/models/save-video-file';
import { Pagination } from '../core/models/pagination';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../core/services/authentication.service';
import { SocialConnection } from '../social/models/social-connection';

@Injectable()
export class DashboardService {
    url = this.authenticationService.REST_URL + "admin/";
    QUERY_PARAMETERS = '?access_token=' + this.authenticationService.access_token;
    saveVideoFile: SaveVideoFile;
    pagination: Pagination;
    sortDates =  [{ 'name': '7 Days', 'value': 7 }, { 'name': '14 Days', 'value': 14 },
      { 'name': '21 Days', 'value': 21 }, { 'name': 'month', 'value': 30 }];

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

    loadDashboardReportsCount(userId: number) {
        return this.http.get(this.authenticationService.REST_URL + "dashboard/analytics_count?userId=" + userId + "&access_token=" + this.authenticationService.access_token)
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
            '&access_token=' + this.authenticationService.access_token+'&limit='+limit;
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
    worldMapCampaignDetails(userId: number, countryCode: string, pagination: any){
        const url = this.authenticationService.REST_URL+ 'dashboard/world-map-detail-report?access_token='+this.authenticationService.access_token+
        '&userId='+userId+'&countryCode='+countryCode;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        let body = res.json();
        // console.log("response.json(): "+body);
        return body || {};
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }
}
