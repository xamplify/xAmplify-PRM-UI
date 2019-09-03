import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { Channel } from '../models/channel';
import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable()
export class RssService {
    URL = this.authenticationService.REST_URL;
    collectionsResponse: any;
    refreshTime: Date;

    constructor(private http: Http, private router: Router, private authenticationService: AuthenticationService, private activatedRoute: ActivatedRoute) {
    }

    getCollections(userId: number) {
        return this.http.get(this.URL + `rss/${userId}/collections?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getHomeFeeds(userId: number) {
        return this.http.get(this.URL + `rss/${userId}/feeds?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getFeedsByCollectionAlias(alias: string) {
        return this.http.get(this.URL + `rss/collection/${alias}/feeds?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getFeedsBySourceAlias(userId: number, alias: string) {
        return this.http.get(this.URL + `rss/${userId}/source/${alias}/feeds?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    searchByCategory(userId: number, value: string) {
        return this.http.get(this.URL + `rss/${userId}/search/category/${value}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    searchBySource(userId: number, value: string) {
        return this.http.get(this.URL + `rss/${userId}/search/source/${value}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    renameCollection(requestBody: any){
        return this.http.post(this.URL + `rss/collection/rename?access_token=${this.authenticationService.access_token}`, requestBody)
            .map(this.extractData)
            .catch(this.handleError);        
    }

    deleteCollection(requestBody: any){
        return this.http.post(this.URL + `rss/collection/delete?access_token=${this.authenticationService.access_token}`, requestBody)
            .map(this.extractData)
            .catch(this.handleError);        
    }

    renameSource(requestBody: any){
        return this.http.post(this.URL + `rss/source/rename?access_token=${this.authenticationService.access_token}`, requestBody)
            .map(this.extractData)
            .catch(this.handleError);        
    }

    deleteSource(requestBody: any){
        return this.http.post(this.URL + `rss/collection/source/delete?access_token=${this.authenticationService.access_token}`, requestBody)
            .map(this.extractData)
            .catch(this.handleError);        
    }

    createCollection(requestBody: any){
        return this.http.post(this.URL + `rss/collection/add?access_token=${this.authenticationService.access_token}`, requestBody)
            .map(this.extractData)
            .catch(this.handleError);        
    }

    addSourceToCollection(requestBody: any){
        return this.http.post(this.URL + `rss/collection/source/add?access_token=${this.authenticationService.access_token}`, requestBody)
            .map(this.extractData)
            .catch(this.handleError);        
    }

    removeSourceFromCollection(requestBody: any){
        return this.http.post(this.URL + `rss/collection/source/delete?access_token=${this.authenticationService.access_token}`, requestBody)
            .map(this.extractData)
            .catch(this.handleError);  
    }

    errorHandlerImage(event) {
        console.debug(event);
        event.target.src = "https://cdn2.iconfinder.com/data/icons/social-icon-3/512/social_style_3_rss-24.png";
    }
    private extractData(res: Response) {
        const body = res.json();
        console.log(body);
        return body || {};
    }

    private handleError(error: any) {
        const body = error['_body'];
        if (body !== "") {
            var response = JSON.parse(body);
            if (response.message != undefined) {
                return Observable.throw(response.message);
            } else {
                return Observable.throw(response.error);
            }

        } else {
            let errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
            return Observable.throw(error);
        }
    }
}
