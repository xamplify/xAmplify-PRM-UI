import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { SocialStatus } from '../models/social-status';
import { SocialConnection } from '../models/social-connection';

import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable()
export class SocialService {
    URL = this.authenticationService.REST_URL;
    public REST_URL: string;
    public socialConnections: SocialConnection[];
    constructor( private http: Http, private router: Router,
        private authenticationService: AuthenticationService, private activatedRoute: ActivatedRoute ) {
        this.socialConnections = new Array<SocialConnection>();
    }

    login( socialProvider: string ): Observable<String> {
        return this.http.get( this.URL + socialProvider + '/login' )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    listActiveSocialConnections( userId: number ) {
        if ( !userId ) {
            let currentUser = localStorage.getItem( 'currentUser' );
            userId = JSON.parse( currentUser )['userId'];
        }
        return this.listAccounts( userId, 'all', 'ACTIVE' );
    }

    getSocialConnection( profileId: string, userId: number ) {
        if ( this.socialConnections.length === 0 ) {
            this.listActiveSocialConnections( userId );
        }
        for ( const i in this.socialConnections ) {
            if ( ( profileId === this.socialConnections[i].profileId ) && ( userId === this.socialConnections[i].userId ) ) {
                return this.socialConnections[i];
            }
        }
    }
    
	getSocialConnectionByUserIdAndProfileId( profileId: string, userId: number ) {
        return this.http.get( this.URL + 'social/account?access_token=' + this.authenticationService.access_token + '&userId=' + userId + '&profileId=' + profileId)
        .map( this.extractData )
        .catch( this.handleError );
    }

    callback( socialProvider: string ): Observable<SocialConnection> {
        let queryParam: string;
        let isDenied: boolean = false;

        this.activatedRoute.queryParams.subscribe(
            ( param: any ) => {
                const oauth_token = param['oauth_token'];
                const oauth_verifier = param['oauth_verifier'];
                const denied = param['denied'];
                const code = param['code'];
                const error_code = param['error_code'];
                const error_message = param['error_message'];
                const error_description = param['error_description'];
                
                if ( oauth_token != null && oauth_verifier != null ) {
                    queryParam = '?oauth_token=' + oauth_token + '&oauth_verifier=' + oauth_verifier;
                } else if ( denied != null || ( error_code != null && ( error_message != null || error_description != null ) ) ) {
                    isDenied = true;
                } else {
                    queryParam = '?code=' + code;
                }
            });
        let currentUser = localStorage.getItem( 'currentUser' );
        if ( currentUser ) {
            const userId = JSON.parse( currentUser )['userId'];
            queryParam += '&userId='+userId;
        }
        
        if(isDenied){
            // User has denied the permission to login through social account.
            this.router.navigate( ['/'] );
        }else{
            return this.http.get( this.URL + socialProvider + '/callback' + queryParam )
            .map( this.extractData )
            .catch( this.handleError );
        }
    }

    listAccounts( userId: number, source: string , type: string) {
        return this.http.get( this.URL + 'social/accounts?access_token=' +
            this.authenticationService.access_token + '&userId=' + userId + '&source=' + source + '&type='+type)
            .map( this.extractData )
            .catch( this.handleError );
    }

    saveAccounts( socialConnections: SocialConnection[] ) {
        return this.http.post( this.URL + 'social/accounts?access_token=' + this.authenticationService.access_token, socialConnections )
            .map( this.extractData )
            .catch( this.handleError );
    }

    listEvents( userId: number ) {
        return this.http.get( this.URL + 'social/update-status?access_token=' + this.authenticationService.access_token + '&userId=' + userId )
            .map( this.extractData )
            .catch( this.handleError );
    }

    updateStatus( userId: number, socialStatus: SocialStatus ) {
        return this.http.post( this.URL + 'social/update-status?access_token=' + this.authenticationService.access_token + '&userId=' + userId, socialStatus )
            .map( this.extractData )
            .catch( this.handleError );
    }

    deleteStatus( socialStatus: SocialStatus ) {
        return this.http.post( this.URL + 'social/delete-status?access_token=' + this.authenticationService.access_token, socialStatus )
            .map( this.extractData )
            .catch( this.handleError );
    }

    uploadMedia( formData: FormData ) {
        const headers = new Headers();
        headers.set( 'Accept', 'application/json' );
        const options = new RequestOptions( { headers: headers });
        return this.http.post( this.URL + 'social/upload-media?access_token=' + this.authenticationService.access_token, formData, options )
            .map( this.extractData )
            .catch( this.handleError );
    }

    removeMedia( fileName: String ) {
        return this.http.get( this.URL + 'social/remove-media?access_token='
            + this.authenticationService.access_token + '&fileName=' + fileName )
            .map( this.extractData )
            .catch( this.handleError );
    }

    listVideos() {
        return this.http.get( this.URL + 'admin/listVideosNew?access_token=' + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    setDefaultAvatar(socialConnections: SocialConnection[]){
        for(var i in socialConnections){
            if(socialConnections[i].profileImage == null)
                socialConnections[i].profileImage = 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png';
        }
        return socialConnections;
    }
    
    genderDemographics( userId: number ) {
        return this.http.get( this.URL + 'social/gender-demographics?access_token='+ this.authenticationService.access_token + '&userId=' + userId )
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
