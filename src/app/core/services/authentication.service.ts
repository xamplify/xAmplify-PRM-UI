import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'

import {User} from '../models/user';
@Injectable()
export class AuthenticationService {
    public access_token: string;
    public refresh_token: string;
    public expires_in: number;
    public logged_in_time: Date;
    public REST_URL: string;
    public MEDIA_URL = "https://aravindu.com/vod/";
    public user: User;
    map:any;
constructor(private http: Http) {
    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.access_token = currentUser && currentUser.access_token;
    this.refresh_token = currentUser && currentUser.refresh_token;
    this.expires_in = currentUser && currentUser.expires_in;
    // this.REST_URL = "https://aravindu.com/xtremand-rest/";
    this.REST_URL = "http://localhost:8080/xtremand-rest/";
}

getOptions() : RequestOptions{
    let options : RequestOptions;
    //check access_token is expired
    if(!this.logged_in_time)
        this.logged_in_time = new Date();
    
    let loggedInSinceSeconds = Math.abs(new Date().getTime() - this.logged_in_time.getTime()) / 1000;
    if(loggedInSinceSeconds < this.expires_in){
        // add authorization header with access token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.access_token });
        options = new RequestOptions({ headers: headers });
    }else{
        //access token expired, get the new one
    }
    return options;
}

    login(authorization: string, body: string, username: string) {

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
        .flatMap(( map ) => this.http.post( this.REST_URL + "admin/getUserByUserName/?userName=" + username + "&access_token=" + this.map.access_token, "" )
            .map(( res: Response ) => {
                    localStorage.setItem( 'currentUser', JSON.stringify(
                        {
                            username: username,
                            access_token: this.map.access_token,
                            refresh_token: this.map.refresh_token,
                            expires_in: this.map.expires_in
                        }
                    ) );
                    this.user = res.json();
                    this.access_token = this.map.access_token;
                	this.refresh_token = this.map.refresh_token;
        }) );
}

logout(): void {
    console.log("logout()");
    // clear token remove user from local storage to log user out
    this.access_token = null;
    this.refresh_token = null;
    localStorage.removeItem('currentUser');
}
}
