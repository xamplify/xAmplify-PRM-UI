import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { Observable }     from 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../core/services/authentication.service';
import {SocialConnection} from '../social/models/social-connection';

@Injectable()
export class DashboardService {
    url = this.authenticationService.REST_URL + "admin/";
    URL = 'demo/values.json';
    QUERY_PARAMETERS = '?access_token='+this.authenticationService.access_token;
    constructor(private http: Http, private authenticationService: AuthenticationService) { }

    getDashboardStats():Observable<any>{
        return this.http.get(this.URL)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getVideoStats() {
        return this.http.get(this.URL)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getSparklineData() {
        return this.http.get(this.URL)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getLineChartdetails(){
        return this.http.get(this.URL)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    getSocialMediaValues():Observable<any>{
        return this.http.get(this.URL)
        .map(this.extractData)
        .catch(this.handleError);

    }
    getGenderDemographics(socialConnection: SocialConnection):Observable<Object>{
        return this.http.get(this.authenticationService.REST_URL+"twitter/gender-demographics"+this.QUERY_PARAMETERS
                + '&oAuthTokenValue=' + socialConnection.oAuthTokenValue + '&oAuthTokenSecret=' + socialConnection.oAuthTokenSecret)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    getTwitterSparklinecharts():Observable<Object>{
        return this.http.get(this.authenticationService.REST_URL+"twitter/dashboard"+this.QUERY_PARAMETERS)
        .map(this.extractData)
        .catch(this.handleError);
    }
    getGoolgPlusSparklinecharts():Observable<any>{
        return this.http.get(this.URL)
        .map(this.extractData)
        .catch(this.handleError);
    }
    getFacebookSparklinecharts():Observable<any>{
        return this.http.get(this.URL)
        .map(this.extractData)
        .catch(this.handleError);
    }
    getLinkdinSparklinecharts():Observable<any>{
        return this.http.get(this.URL)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    loadEmailClickedCount(){
        return this.http.get( this.authenticationService.REST_URL + "email_gif_clicked_count?" + 'userId='+this.authenticationService.user.id+ "&access_token=" + this.authenticationService.access_token )
        .map( this.extractData )
        .catch( this.handleError );  
    }
    
    loadEmailOpenedCount(){
        return this.http.get( this.authenticationService.REST_URL + "email_open_count?" + 'userId='+this.authenticationService.user.id+ "&access_token=" + this.authenticationService.access_token )
        .map( this.extractData )
        .catch( this.handleError );
    }
    
    loadEmailWatchedCount(){
        return this.http.get( this.authenticationService.REST_URL + "email_watched_count?" + 'userId='+this.authenticationService.user.id+ "&access_token=" + this.authenticationService.access_token )
        .map( this.extractData )
        .catch( this.handleError );
    }
    
    loadTotalViewsCount(){
        return this.http.get( this.authenticationService.REST_URL + "email_watched_count?" + 'userId='+this.authenticationService.user.id+ "&access_token=" + this.authenticationService.access_token )
        .map( this.extractData )
        .catch( this.handleError );
    }
    
    loadTotalFollowersCount(){
        return this.http.get( this.authenticationService.REST_URL + "email_watched_count?" + 'userId='+this.authenticationService.user.id+ "&access_token=" + this.authenticationService.access_token )
        .map( this.extractData )
        .catch( this.handleError );
    }
    
    private extractData(res: Response) {
        let body = res.json();
        //console.log("response.json(): "+body);
        return body || {};
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(errMsg);
    }
}
