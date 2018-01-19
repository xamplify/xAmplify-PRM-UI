import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
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
    getCampaignUserWatchedViews(timePeriod: string,videoId: number){
        try {
            const url = this.authenticationService.REST_URL + 'videos/'+timePeriod+'/views?access_token='
                + this.authenticationService.access_token+'&videoId='+videoId;
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
            } catch (error) { console.log(error); }
    }
    timePeriodSelctedDropdown(timePeriod){
      try {
            const url = this.authenticationService.REST_URL+'videos/timePeriod/'+timePeriod+'?access_token='+this.authenticationService.access_token;    
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
            } catch (error) { console.log(error); }
    }    
    getViewsMinutesWatchedChart(dateValue:string,videoId:number,timePeriod:string){
        try {
            const url = this.authenticationService.REST_URL + 'videos/'+dateValue+'/views-minuteswatched?access_token='
                + this.authenticationService.access_token+'&videoId='+videoId+'&timePeriodValue='+timePeriod;
            return this.http.get(url)
                .map(this.extractData)
                .catch(this.handleError);
            } catch (error) { console.log(error); }
    }   
    getUsersMinutesWatchedInfo(timePeriod:string,videoId:number,timePeriodValue:any,userId:number,pagination:Pagination){
         try {
            const url =this.authenticationService.REST_URL+'videos/'+timePeriod+'/views-minuteswatched-detail-report?userId='+userId+'&videoId='
            +videoId+'&timePeriodValue='+timePeriodValue+'&access_token='+this.authenticationService.access_token;    
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
