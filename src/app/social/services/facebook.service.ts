import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable()
export class FacebookService {
    URL = this.authenticationService.REST_URL + 'facebook/';
    QUERY_PARAMETERS = '?access_token=' + this.authenticationService.access_token;

    constructor( private http: Http, private authenticationService: AuthenticationService ) { }

    getPosts( facebookAccessToken: string, ownerId: string ) {
        return this.http.get( this.URL + 'posts' + this.QUERY_PARAMETERS + '&facebookAccessToken='
            + facebookAccessToken + '&ownerId=' + ownerId )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getReactions( facebookAccessToken: string, postId: string ) {
        return this.http.get( this.URL + 'reactions' + this.QUERY_PARAMETERS + '&facebookAccessToken='
            + facebookAccessToken + '&postId=' + postId )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getComments( facebookAccessToken: string, postId: string ) {
        return this.http.get( this.URL + 'comments' + this.QUERY_PARAMETERS + '&facebookAccessToken='
            + facebookAccessToken + '&postId=' + postId )
            .map( this.extractData )
            .catch( this.handleError );
    }

    listPages( facebookAccessToken: string ) {
        return this.http.get( this.URL + 'pages' + this.QUERY_PARAMETERS + '&facebookAccessToken=' + facebookAccessToken )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getPage( facebookAccessToken: string,  pageId: string  ) {
        return this.http.get( this.URL + 'page' + this.QUERY_PARAMETERS + '&facebookAccessToken=' + facebookAccessToken
                + '&pageId=' + pageId )
            .map( this.extractData )
            .catch( this.handleError );
    }

    listAccounts( facebookAccessToken: string ) {
        return this.http.get( this.URL + 'accounts' + this.QUERY_PARAMETERS + '&accessToken=' + facebookAccessToken )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getUserProfileImage( facebookAccessToken: string, userId: string ) {
        return this.http.get( this.URL + 'profile-image' + this.QUERY_PARAMETERS + '&facebookAccessToken='
            + facebookAccessToken + '&userId=' + userId )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getInsight( facebookAccessToken: string, ownerId: string, metrics: string, period: string ) {
        return this.http.get( this.URL + 'insights' + this.QUERY_PARAMETERS + '&facebookAccessToken='
                + facebookAccessToken + '&ownerId=' + ownerId + '&metrics=' + metrics + '&period=' + period)
                .map( this.extractData )
                .catch( this.handleError );
    }

    private extractData( res: Response ) {
        const body = res.json();
        console.log( body );
        return body || {};
    }

    private handleError( error: any ) {
        const errMsg = ( error.message ) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw( errMsg );
    }
}
