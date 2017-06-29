import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { User } from '../models/user';
import { UserToken } from '../models/user-token';
import { UtilService } from '../services/util.service';

@Injectable()
export class AuthenticationService {
    public access_token: string;
    public refresh_token: string;
    public expires_in: number;
    public logged_in_time: Date;
    public REST_URL: string;
    public MEDIA_URL: string;
    public user: User = new User();
    public userProfile:User = new User();
    public userToken: UserToken = new UserToken();
    public redirectUrl: string;
    map: any;
    constructor( private http: Http, private router: Router ) {
        this.REST_URL = "https://aravindu.com/xtremand-rest/";
        // this.REST_URL = "http://localhost:8080/xtremand-rest/";
        this.MEDIA_URL = "https://aravindu.com/vod/";
    }

    getOptions(): RequestOptions {
        let options: RequestOptions;
        //check access_token is expired
        if ( !this.logged_in_time )
            this.logged_in_time = new Date();

        let loggedInSinceSeconds = Math.abs( new Date().getTime() - this.logged_in_time.getTime() ) / 1000;
        if ( loggedInSinceSeconds < this.expires_in ) {
            // add authorization header with access token
            let headers = new Headers( { 'Authorization': 'Bearer ' + this.access_token });
            options = new RequestOptions( { headers: headers });
        } else {
            //access token expired, get the new one
        }
        return options;
    }

    login( authorization: string, body: string, userName: string ) {

        var url = this.REST_URL + 'oauth/token';

        var headers = new Headers();
        headers.append( 'Content-Type', 'application/x-www-form-urlencoded' );
        headers.append( 'Authorization', authorization );

        var options = {
            headers: headers
        };
        console.log( "authentication service " + body );

        return this.http.post( url, body, options ).map(( res: Response ) => {
            this.map = res.json();
            return this.map;
        })
            .flatMap(( map ) => this.http.post( this.REST_URL + "admin/getUserByUserName?userName=" + userName + "&access_token=" + this.map.access_token, "" )
                .map(( res: Response ) => {

                    var userToken = {
                        'userName': userName,
                        'userId': res.json().id,
                        'accessToken': this.map.access_token,
                        'refreshToken': this.map.refresh_token,
                        'expiresIn': this.map.expires_in
                    };
                    localStorage.setItem( 'currentUser', JSON.stringify( userToken ) );
                    this.access_token = this.map.access_token;
                    this.refresh_token = this.map.refresh_token;
                    this.user = res.json();
                    this.userProfile  = res.json();
                }) );
    }

    getUserByUserName( userName: string ) {
        return this.http.post( this.REST_URL + "admin/getUserByUserName?userName=" + userName + "&access_token=" + this.access_token, "" )
            .map(( res: Response ) => { return res.json() })
            .catch(( error: any ) => { return error });
    }

    getUserId(): number {
        let userId;
        if ( !this.user.id ) {
            let currentUser = localStorage.getItem( 'currentUser' );
            userId = JSON.parse( currentUser )['userId'];
        } else {
            userId = this.user.id;
        }
        return userId;
    }

    logout(): void {
        console.log( 'logout()' );
        // clear token remove user from local storage to log user out
        this.access_token = null;
        this.refresh_token = null;
        localStorage.removeItem( 'currentUser' );
    }
}
