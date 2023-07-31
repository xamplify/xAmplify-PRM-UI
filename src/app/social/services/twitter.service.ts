import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { Tweet } from '../models/tweet';
import { TwitterProfile } from '../models/twitter-profile';
import { DirectMessage } from '../models/direct-message';
import {SocialConnection} from '../models/social-connection';

import { AuthenticationService } from '../../core/services/authentication.service';
import { UtilService } from '../../core/services/util.service';

@Injectable()
export class TwitterService {
    URL = this.authService.REST_URL + 'twitter/';
    QUERY_PARAMETERS = '?access_token=' + this.authService.access_token;
    queryParams: any;
    currentUser: string;

    constructor(private http: Http, private router: Router, private authService: AuthenticationService,
        private activatedRoute: ActivatedRoute, private utilService: UtilService) {
    }
    
    appendQueryParameters( socialConnection: SocialConnection ) {
        return `?access_token=${this.authService.access_token}&oAuthTokenValue=${socialConnection.oAuthTokenValue}&oAuthTokenSecret=${socialConnection.oAuthTokenSecret}`;
    }
    
    updateStatus(status: string) {
        return this.http.get(this.URL + 'update-status?access_token=' + this.authService.access_token + '&status=' + status)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTwitterProfile(socialConnection: SocialConnection, id: number) {
        return this.http.get(this.URL + 'user/' + id + this.appendQueryParameters(socialConnection))
            .map(this.extractData)
            .catch(this.handleError);
    }
    getUserTimeline(socialConnection: SocialConnection, userId: number, pageSize: number): Observable<Object> {
        return this.http.get(this.URL + 'user_timeline' + this.appendQueryParameters(socialConnection)
        + '&userId=' + userId + '&pageSize=' + pageSize)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getHomeTimeline(socialConnection: SocialConnection, userId: number, pageSize: number): Observable<Object> {
        return this.http.get(this.URL + 'home_timeline' + this.appendQueryParameters(socialConnection)
        + '&userId=' + userId + '&pageSize=' + pageSize)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTrends(socialConnection: SocialConnection) {
        return this.http.get(this.URL + 'trends' + this.appendQueryParameters(socialConnection))
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTweet(socialConnection: SocialConnection, tweetId: string): Observable<Tweet> {
        return this.http.get(this.URL + `tweets/${tweetId}` + this.appendQueryParameters(socialConnection))
            .map(this.extractData)
            .catch(this.handleError);
    }

    listTwitterProfiles(socialConnection: SocialConnection, type: string): Observable<Object> {
        return this.http.get(this.URL + 'list' + this.appendQueryParameters(socialConnection) + '&type=' + type)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAnalytics(socialConnection: SocialConnection): Observable<Object> {
        return this.http.get(this.URL + 'analytics' + this.appendQueryParameters(socialConnection))
            .map(this.extractData)
            .catch(this.handleError);
    }

    getKloutData(socialConnection: SocialConnection): Observable<Object> {
        return this.http.get(this.URL + 'klout' + this.appendQueryParameters(socialConnection))
            .map(this.extractData)
            .catch(this.handleError);
    }

    getWeeklyReport(socialConnection: SocialConnection, userId: number): Observable<Object> {
        return this.http.get(this.URL + 'weekly-report' + this.appendQueryParameters(socialConnection)+'&userId='+userId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getfollowersHistory(socialConnection: SocialConnection, userId: number) {
        return this.http.get(this.URL + 'followers-history' + this.appendQueryParameters(socialConnection)+'&userId='+userId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    reply(socialConnection: SocialConnection, id: number, text: string): Observable<Object> {
        return this.http.get(this.URL + 'reply' + this.appendQueryParameters(socialConnection) + '&statusId=' + id + '&status=' + text)
            .map(this.extractData)
            .catch(this.handleError);
    }

    sendDirectMessage(toUserId: number, text: string) {
        return this.http.get(this.URL + 'send-direct-message' + '?access_token=' + this.authService.access_token 
        + '&toUserId=' + toUserId + '&text=' + text)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteDirectMessage(messageId: number) {
        return this.http.get(this.URL + 'delete-direct-message' + '?access_token=' + this.authService.access_token + '&messageId=' + messageId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getConversation(socialConnection: SocialConnection, toUserId: number) {
        return this.http.get(this.URL + 'conversation' + this.appendQueryParameters(socialConnection) + '&toUserId=' + toUserId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getKloutScore(socialConnection: SocialConnection, twitterId: number) {
        return this.http.get(this.URL + 'klout-score' + this.appendQueryParameters(socialConnection) + '&twitterId=' + twitterId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTotalCountOfTFFF(socialConnection: SocialConnection): Observable<Object> {
        return this.http.get(this.URL + 'total-count' + this.appendQueryParameters(socialConnection))
            .map(this.extractData)
            .catch(this.handleError);
    }

    getWeeklyTweets(socialConnection: SocialConnection): Observable<Array<number>> {
        return this.http.get(this.URL + 'weekly-tweets' + this.appendQueryParameters(socialConnection))
            .map(this.extractData)
            .catch(this.handleError);
    }

    getGenderDemographics(socialConnection: SocialConnection) {
        return this.http.get(this.URL + 'gender-demographics' + this.appendQueryParameters(socialConnection))
            .map(this.extractData)
            .catch(this.handleError);
    }

    login(): Observable<String> {
        return this.http.get(this.URL + 'login')
            .map(this.extractData)
            .catch(this.handleError);
    }

    callback(): Observable<String> {
        let queryParam: string;
        this.activatedRoute.queryParams.subscribe(
            (param: any) => {
                const oauth_token = param['oauth_token'];
                const oauth_verifier = param['oauth_verifier'];
                const denied = param['denied'];
                queryParam = '?oauth_token=' + oauth_token + '&oauth_verifier=' + oauth_verifier + '&denied=' + denied;
            });
        return this.http.get(this.URL + 'callback' + queryParam)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listNotifications(userId:number) {
        return this.http.get(this.authService.REST_URL + 'notifications/'+userId+'?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    markAllAsRead(userId:number) {
        return this.http.get(this.URL + 'mark-all-as-read?access_token=' + this.authService.access_token+'&userId='+userId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        const body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(errMsg);
    }
}