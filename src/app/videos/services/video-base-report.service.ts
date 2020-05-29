import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { Pagination } from '../../core/models/pagination';
import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable()
export class VideoBaseReportService {
    public URL: string = this.authenticationService.REST_URL + 'admin/';
    constructor(public http: Http, public authenticationService: AuthenticationService) { }

    getCampaignVideoCountriesAndViews(alias: any) {
        try {
            const url = this.URL + 'videos/monthwise_countrywise_views/' + alias + '?access_token='
                + this.authenticationService.access_token;
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    getWatchedFullyData(alias: any) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/watchedfully-minuteswatched-views/' + alias + '?access_token='
                + this.authenticationService.access_token;
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    getCampaignUserWatchedViews(timePeriod: string, videoId: number) {
        if (timePeriod === undefined || videoId === undefined) {
            console.log("undefined values ");
        } else {
            try {
                const url = this.authenticationService.REST_URL + 'videos/' + timePeriod + '/views?access_token='
                    + this.authenticationService.access_token + '&videoId=' + videoId;
                return this.http.get(url)
                    .map(this.extractData)
                    .catch(this.handleError);
            } catch (error) { console.log(error); }
        }
    }
    timePeriodSelctedDropdown(timePeriod) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/timePeriod/' + timePeriod + '?access_token=' + this.authenticationService.access_token;
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    getViewsMinutesWatchedChart(dateValue: string, videoId: number, timePeriod: string) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/' + dateValue + '/views-minuteswatched?access_token='
                + this.authenticationService.access_token + '&videoId=' + videoId + '&timePeriodValue=' + timePeriod;
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    getUsersMinutesWatchedDetailReports(timePeriod: string, videoId: number, timePeriodValue: any, userId: number, pagination: Pagination) {
        if (timePeriodValue.includes('Q')) { timePeriodValue = timePeriodValue.substring(1, timePeriodValue.length); }
        try {
            const url = this.authenticationService.REST_URL + 'videos/' + this.authenticationService.user.id+"/"+ timePeriod + '/views-minuteswatched-detail-report?userId=' + userId + '&videoId='
                + videoId + '&timePeriodValue=' + timePeriodValue + '&access_token=' + this.authenticationService.access_token;
            return this.http.post(url, pagination)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    
    videoLeadsList(videoId: number, pagination: Pagination) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/' + videoId + "/"+ this.authenticationService.user.id + '/leads-info?access_token=' + this.authenticationService.access_token;
            return this.http.post(url, pagination)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    
    getVideoViewsDetails(timePeriod: string, videoId: number, timePeriodValue: string) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/views/' + timePeriod + '/detail-report?access_token=' + this.authenticationService.access_token +
                '&videoId=' + videoId + '&timePeriodValue=' + timePeriodValue;
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    getVideoViewsInnerDetails(timePeriod: string, videoId: number, timePeriodValue: string, pagination: Pagination) {
        console.log(timePeriod + 'video' + videoId + '2nd' + timePeriodValue);
        console.log(pagination);
        try {
            const url = this.authenticationService.REST_URL + 'videos/views/' + this.authenticationService.user.id+ "/" +  timePeriod + '/detail-report?access_token=' + this.authenticationService.access_token +
                '&videoId=' + videoId + '&timePeriodValue=' + timePeriodValue;
            return this.http.post(url, pagination)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    getVideoPlayedSkippedInfo(videoId: number) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/' + videoId + '/skipped-duration?access_token=' + this.authenticationService.access_token;
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    watchedFullyReport(videoId: number, pagination: Pagination) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/' + videoId + "/" + this.authenticationService.user.id+  '/watched-fully-report?access_token=' + this.authenticationService.access_token;
            return this.http.post(url, pagination)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    totlaMinutesWatchedByMostUsers(videoId: number) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/' + videoId +"/" + this.authenticationService.user.id+  '/total-minutes-watched-by-top-10-users-detailreport?access_token=' + this.authenticationService.access_token;
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    videoSkippedDurationInfo(videoId: number, pagination: Pagination) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/' + videoId +"/" + this.authenticationService.user.id + '/video-duration-skipped-users?access_token=' + this.authenticationService.access_token;
            return this.http.post(url, pagination)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    videoPlayedDurationInfo(videoId: number, pagination: Pagination) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/' + videoId +"/" + this.authenticationService.user.id + '/video-duration-played-users?access_token=' + this.authenticationService.access_token;
            return this.http.post(url, pagination)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    nonApplicableUsersMinutes(videoId: number) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/' + videoId + '/N/A-users-views-minuteswatched?access_token=' + this.authenticationService.access_token;
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    getCampaignCoutryViewsDetailsReport(videoId: number, countryCode: string, pagination: Pagination) {
        try {
            const url = this.authenticationService.REST_URL + 'videos/' + videoId +"/" + this.authenticationService.user.id + '/countrywise-users-report?access_token=' + this.authenticationService.access_token + '&countryCode=' + countryCode;
            return this.http.post(url, pagination)
                .map(this.extractData)
                .catch(this.handleError);
        } catch (error) { console.log(error); }
    }
    
    extractData(res: Response) {
        const body = res.json();
        console.log(body);
        return body || {};
    }
    handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }
}
