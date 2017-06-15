import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { Tweet } from '../models/tweet';
import { TwitterProfile } from '../models/twitter-profile';
import { DirectMessage } from '../models/direct-message';

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
        console.log(this.authService.user);
    }
    updateStatus(status: string) {
        return this.http.get(this.URL + 'update-status?access_token=' + this.authService.access_token + '&status=' + status)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTwitterProfile(id: number) {
        return this.http.get(this.URL + 'user/' + id + '?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getTweets(userId: number, pageSize: number): Observable<Object> {
        return this.http.get(this.URL + 'tweets' + '?access_token=' + this.authService.access_token 
        + '&userId=' + userId + '&pageSize=' + pageSize)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTrends() {
        return this.http.get(this.URL + 'trends' + '?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTweet(tweetId: number): Observable<Tweet> {
        return this.http.get(this.URL + 'tweet' + '?access_token=' + this.authService.access_token + '&tweetId=' + tweetId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listTwitterProfiles(type: string): Observable<Object> {
        return this.http.get(this.URL + 'list' + '?access_token=' + this.authService.access_token + '&type=' + type)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAnalytics(): Observable<Object> {
        return this.http.get(this.URL + 'analytics' + '?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getKloutData(): Observable<Object> {
        return this.http.get(this.URL + 'klout' + '?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getWeeklyReport(): Observable<Object> {
        return this.http.get(this.URL + 'weekly-report' + '?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getfollowersHistory() {
        return this.http.get(this.URL + 'followers-history' + '?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    reply(id: number, text: string): Observable<Object> {
        return this.http.get(this.URL + 'reply' + '?access_token=' + this.authService.access_token + '&statusId=' + id + '&status=' + text)
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

    getConversation(toUserId: number) {
        return this.http.get(this.URL + 'conversation' + '?access_token=' + this.authService.access_token + '&toUserId=' + toUserId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getKloutScore(twitterId: number) {
        return this.http.get(this.URL + 'klout-score' + '?access_token=' + this.authService.access_token + '&twitterId=' + twitterId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTotalCountOfTFFF(): Observable<Object> {
        return this.http.get(this.URL + 'total-count' + '?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getWeeklyTweets(): Observable<Array<number>> {
        return this.http.get(this.URL + 'weekly-tweets' + '?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getGenderDemographics() {
        return this.http.get(this.URL + 'gender-demographics' + '?access_token=' + this.authService.access_token)
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

    initializeNotification() {
        return this.http.get(this.URL + 'initialize-notification?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listNotifications() {
        return this.http.get(this.URL + 'list-notifications?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    markAllAsRead() {
        return this.http.get(this.URL + 'mark-all-as-read?access_token=' + this.authService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        const body = res.json();
        console.log(body);
        return body || {};
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(errMsg);
    }
}