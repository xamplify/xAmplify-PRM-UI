import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public access_token: string;
    public refresh_token: string;
    public expires_in: number;
    public logged_in_time: Date;
    public REST_URL: string;

constructor(private http: Http) {
    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.access_token = currentUser && currentUser.access_token;
    this.refresh_token = currentUser && currentUser.refresh_token;
    this.expires_in = currentUser && currentUser.expires_in;
    this.REST_URL = "http://139.59.1.205:9090/xtremand-rest/";
   // this.REST_URL = "http://localhost:8080/xtremand-rest/";
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

login(username:string, password:string){
    
     var url = this.REST_URL+'oauth/token';
     // var url = 'http://localhost:8080/xtremand-rest/oauth/token';
    
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic ' + btoa('my-trusted-client:'));
    
    var body = 'username='+username+'&password='+password+'&grant_type=password';
    var options = {
        headers: headers
    };
    console.log("authentication service "+body);
   return this.http.post(url, body, options)
        .map(response => {
            // login successful if there's a jwt token in the response
            let access_token = response.json() && response.json().access_token;
            let refresh_token = response.json() && response.json().refresh_token;
            let expires_in = response.json() && response.json().expires_in;
            console.log("Authenticated : "+access_token+", "+refresh_token);
            this.logged_in_time = new Date();
            if (access_token) {
                // set token property
                this.access_token = access_token;
                this.refresh_token = refresh_token;

                // store username and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(
                        {   username: username, 
                            access_token: access_token, 
                            refresh_token: refresh_token,
                            expires_in: expires_in
                        }
                    ));

                // return true to indicate successful login
                return true;
            } else {
                // return false to indicate failed login
                console.log("Error : "+response);
                return false;
            }
        });
}

logout(): void {
    console.log("logout()");
    // clear token remove user from local storage to log user out
    this.access_token = null;
    this.refresh_token = null;
    localStorage.removeItem('currentUser');
}
}
