import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../../core/services/authentication.service';
import { UtilService } from '../../core/services/util.service';
import {SocialConnection} from '../models/social-connection';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class FacebookService {
    URL = this.authenticationService.REST_URL + 'facebook/';

    constructor(private http: Http, private authenticationService: AuthenticationService, private utilService: UtilService) {}

    getPosts(socialConnection: SocialConnection) {
        return this.http.post(this.URL + 'posts' + '?access_token=' + this.authenticationService.access_token,socialConnection)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getFriends(socialConnection: SocialConnection) {
        return this.http.post(this.URL + 'friends' + '?access_token=' + this.authenticationService.access_token,socialConnection)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    getWeeklyPosts(socialConnection: SocialConnection){
        return this.http.post(this.URL + 'weekly-posts' + '?access_token=' + this.authenticationService.access_token,socialConnection)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getReactions(postId: string, facebookAccessToken: string) {
        return this.http.get(this.URL + 'reactions' + '?access_token=' + this.authenticationService.access_token + '&facebookAccessToken='
            + facebookAccessToken + '&postId=' + postId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getComments(postId: string, facebookAccessToken: string) {
        return this.http.get(this.URL + 'comments' + '?access_token=' + this.authenticationService.access_token + '&facebookAccessToken='
            + facebookAccessToken + '&postId=' + postId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listPages(userId: number) {
        return this.http.get(this.URL + 'pages' + '?access_token=' + this.authenticationService.access_token + '&userId=' + userId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPage(socialConnection: SocialConnection, pageId: string) {
        return this.http.get(this.URL + 'page' + '?access_token=' + this.authenticationService.access_token + '&pageId=' + pageId + '&facebookAccessToken='+socialConnection.accessToken)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listAccounts(facebookAccessToken: string) {
        return this.http.get(this.URL + 'accounts' + '?access_token=' + this.authenticationService.access_token + '&accessToken=' + facebookAccessToken)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserProfileImage(profileId: string) {
        return this.http.get(this.URL + 'profile-image' + '?access_token=' + this.authenticationService.access_token + '&profileId=' + profileId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getInsight(socialConnection: SocialConnection, ownerId: string, metrics: string, period: string) {
        return this.http.get(this.URL + 'insights' + '?access_token=' + this.authenticationService.access_token
                + '&ownerId=' + ownerId + '&metrics=' + metrics + '&period=' + period + '&facebookAccessToken='+socialConnection.accessToken)
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
