import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { User } from '../models/user';
import { DefaultVideoPlayer } from '../../videos/models/default-video-player';
import { AuthenticationService } from '../services/authentication.service';
import { ReferenceService } from './reference.service';

@Injectable()
export class UserService {
    private token: string;

    loggedInUserData: User;

    URL = this.authenticationService.REST_URL;
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    unreadNotificationsCount: number;

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService, private refService: ReferenceService ) {
    }

    getUsers(): Observable<User[]> {
        // get users from api
        return this.http.get( '/api/users', this.authenticationService.getOptions() )
            .map(( response: Response ) => response.json() );
    }

    getVideoDefaultSettings() {
        console.log(this.authenticationService.user.roles);
        if(this.authenticationService.user.roles.length > 1){
        return this.http.get( this.URL + 'videos/video-default-settings?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
        }
        else {
            console.log("user role ");
        }
    }
    updatePlayerSettings( defaultVideoSettings: DefaultVideoPlayer ) {
        if(this.authenticationService.user.roles.length > 1){
        return this.http.post( this.URL + 'videos/video-default-settings?userId=' + this.authenticationService.user.id + '&access_token=' + this.authenticationService.access_token
            , defaultVideoSettings )
            .map( this.extractData )
            .catch( this.handleError );
        }  
         else {
            console.log("user role ");
        } 
    }

    signUp( data: User ) {
        console.log( data );
        return this.http.post( this.URL + "register/signup/user", data )
            .map( this.extractData )
            .catch( this.handleError );

    }

    sendPassword( emailId: string ) {
        return this.http.get( this.URL + "register/forgotpassword?emailId=" + emailId )
            .map( this.extractData )
            .catch( this.handleError );

    }

    updatePassword( data: any ) {
        console.log( data );
        return this.http.post( this.URL + "admin/updatePassword?access_token=" + this.authenticationService.access_token, data )
            .map( this.extractData )
            .catch( this.handleError );
    }

    comparePassword( data: any ) {
        return this.http.post( this.URL + "admin/comparePassword", data, this.authenticationService.getOptions() )
            .map( this.extractData )
            .catch( this.handleError );
    }

    updateUserProfile( data: any, userId: number ) {

        return this.http.post( this.URL + "admin/updateUser/" + userId + "?access_token=" + this.authenticationService.access_token, data )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getUserByUserName( userName: string ) {
        return this.http.post( this.URL + "admin/getUserByUserName?userName=" + userName + "&access_token=" + this.authenticationService.access_token, "" )
            .map(( res: Response ) => { return res.json() })
            .catch(( error: any ) => { return error });
    }
    activateAccount( alias: string ) {
        return this.http.get( this.URL + "register/verifyemail/user?alias=" + alias )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getUserDefaultPage( userId: number ) {
        return this.http.get( this.URL + "admin/get-user-default-page?userId=" + userId + "&access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    setUserDefaultPage( userId: number, defaultPage: string ) {
        return this.http.get( this.URL + "admin/set-user-default-page?userId=" + userId + "&defaultPage="+ defaultPage + "&access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    isGridView( userId: number ) {
        return this.http.get( this.URL + "admin/get-user-gridview/" + userId + "?access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    setGridView( userId: number, isGridView: boolean ) {
        return this.http.get( this.URL + "admin/set-user-gridview/" + userId + "?isGridView="+ isGridView + "&access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getOrgAdminsCount( userId: number ) {
        return this.http.get( this.URL + "admin/getOrgAdminCount/" + userId + "?access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    disableOrgAdmin( userId: number ) {
        return this.http.get( this.URL + "admin/disableAsOrgAdmin/" + userId + "?access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );
    }

    listNotifications(userId:number) {
        return this.http.get(this.URL + `notifications/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUnreadNotificationsCount(userId:number) {
        return this.http.get(this.URL + `notifications/unread-count/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    markAllAsRead(userId:number) {
        return this.http.get(this.URL + `notifications/mark-all-as-read/${userId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    markAsRead(notification: any){
        return this.http.post(this.URL + `notifications/mark-as-read?access_token=${this.authenticationService.access_token}`, notification)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    saveBrandLogo(logoPath: string,logoDesc: string,userId: number){
     return this.http.get( this.URL + 'videos/save-branding-logo?logoPath='+logoPath+'&LogoDescUri='+logoDesc+'&userId='+userId+'&access_token='+this.authenticationService.access_token )
       .map(this.extractData)
       .catch(this.handleError);
    }
    private extractData( res: Response ) {
        const body = res.json();
        console.log(body);
        // return body || {};
        return body;
    }

    private handleError( error: any ) {
        const body = error['_body'];
        console.log( body );
        if ( body != "" ) {
            var response = JSON.parse( body );
            if ( response.message != undefined ) {
                return Observable.throw( response.message );
            } else {
                return Observable.throw( response.error );
            }

        } else {
            let errMsg = ( error.message ) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
            return Observable.throw( error );
        }

    }

}
