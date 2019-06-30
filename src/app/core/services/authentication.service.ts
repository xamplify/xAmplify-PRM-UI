import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { User } from '../models/user';
import { Roles} from '../models/roles';
import { Module } from '../models/module';
import { UserToken } from '../models/user-token';
import { UtilService } from '../services/util.service';
import { environment } from '../../../environments/environment';
var SockJs = require("sockjs-client");
var Stomp = require("stompjs");
declare var swal,require: any;
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

@Injectable()
export class AuthenticationService {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    logged_in_time: Date;
    APP_URL = environment.CLIENT_URL;
    SERVER_URL = environment.SERVER_URL;
    REST_URL: string;
    MEDIA_URL: string;
    SHARE_URL: string;
    MARKETO_URL:string;
    user: User = new User();
    userProfile: User = new User();
    userToken: UserToken = new UserToken();
    redirectUrl: string;
    map: any;
    isCompanyAdded = false;
    module:Module = new Module();
    roleName: Roles= new Roles();
    isAddedByVendor = false;
    isPartnerTeamMember = false;
    selectedVendorId: number;
    venorMyProfileReport: any;
    constructor(private http: Http, private router: Router, private utilService: UtilService, public xtremandLogger:XtremandLogger) {
        this.REST_URL = this.SERVER_URL + 'xtremand-rest/';
        
        this.MEDIA_URL = this.SERVER_URL + 'vod/';
        this.SHARE_URL = this.SERVER_URL + 'embed/';
    }

    getOptions(): RequestOptions {
        let options: RequestOptions;
        // check access_token is expired
        if (!this.logged_in_time) { this.logged_in_time = new Date(); }
        const loggedInSinceSeconds = Math.abs(new Date().getTime() - this.logged_in_time.getTime()) / 1000;
        if (loggedInSinceSeconds < this.expires_in) {
            // add authorization header with access token
            const headers = new Headers({ 'Authorization': 'Bearer ' + this.access_token });
            options = new RequestOptions({ headers: headers });
        } else {
            // access token expired, get the new one
        }
        return options;
    }

    login(authorization: string, body: string, userName: string) {
        const url = this.REST_URL + 'oauth/token';
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', authorization);
        const options = { headers: headers };
        return this.http.post(url, body, options).map((res: Response) => {
            this.map = res.json();
            return this.map;
        })
            .flatMap((map) => this.http.post(this.REST_URL + 'admin/getUserByUserName?userName=' + userName
                + '&access_token=' + this.map.access_token, '')
                .map((res: Response) => {
                    const userToken = {
                        'userName': userName,
                        'userId': res.json().id,
                        'accessToken': this.map.access_token,
                        'refreshToken': this.map.refresh_token,
                        'expiresIn': this.map.expires_in,
                        'hasCompany': res.json().hasCompany,
                        'roles': res.json().roles
                    };
                    localStorage.setItem('currentUser', JSON.stringify(userToken));
                    this.access_token = this.map.access_token;
                    this.refresh_token = this.map.refresh_token;
                    this.expires_in = this.map.expires_in;
                    this.user = res.json();
                    this.userProfile = res.json();
                }));
    }
    getUserByUserName(userName: string) {
        return this.http.post(this.REST_URL + 'admin/getUserByUserName?userName=' + userName + '&access_token=' + this.access_token, '')
            .map((res: Response) => { return res.json(); })
            .catch((error: any) => { return error; });
    }
    getUserOpportunityModule(userId: number) {
        return this.http.get(this.REST_URL + 'admin/getUserOppertunityModule/' + userId + '?access_token=' + this.access_token)
            .map((res: Response) => { return res.json(); })
            .catch((error: any) => { return error; });
    }

 
    getUserId(): number {
        try{
        let userId;
        if (!this.user.id) {
            const currentUser = localStorage.getItem('currentUser');
            userId = JSON.parse(currentUser)['userId'];
        } else {
            userId = this.user.id;
        }
        return userId;
      }catch(error){
        this.xtremandLogger.error('error'+error);
      }
    }
    hasCompany(): boolean {
      try{
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser != null) {
            return currentUser.hasCompany;
        }
      }catch(error){  this.xtremandLogger.log('error'+error);}
    }
    getRoles(): any {
      try{

          let roleNames: string[] = [];
          const currentUser = localStorage.getItem('currentUser');
          if(currentUser != null){
            const roles = JSON.parse(currentUser)['roles'];
            roleNames = roles.map(function (a) { return a.roleName; });
            if(!roleNames && this.user.roles) { roleNames = this.user.roles.map(function (a) { return a.roleName; });}
            return roleNames;
          }
        } catch(error){ this.xtremandLogger.log('error'+error);  this.router.navigate(['/']); }

    }
    showRoles():string{
      try{
        const roleNames = this.getRoles();
        /***********Org Admin**************/
        if(roleNames){
        const isOrgAdmin = roleNames.indexOf(this.roleName.orgAdminRole)>-1;
        const isPartner =  roleNames.indexOf(this.roleName.companyPartnerRole)>-1;
        const isVendor = roleNames.indexOf(this.roleName.vendorRole)>-1;
        const isPartnerAndTeamMember = roleNames.indexOf(this.roleName.companyPartnerRole)>-1 && 
        (roleNames.indexOf(this.roleName.contactsRole)>-1 || roleNames.indexOf(this.roleName.campaignRole)>-1);
        if(roleNames.length===1){   return "User";
        } else {
            if ( isOrgAdmin && isPartner ) {
                return "Orgadmin & Partner";
            } else if ( isVendor && isPartner ) {
                return "Vendor & Partner";
            } else if ( isOrgAdmin ) {
                return "Orgadmin";
            } else if ( isVendor ) {
                return "Vendor";
            } else if ( isPartnerAndTeamMember ) {
                return "Partner & Team Member";
            } else if (this.isOnlyPartner() ) {
                return "Partner";
            } else if(roleNames.length>2 && isPartner) {
                return "Team Member & Partner";
            }else{
                return "Team Member";
            }
        }
      }
      }catch(error){
        this.xtremandLogger.log('error'+error);
      }
    }

    isOnlyPartner(){
      try{
        const roleNames = this.getRoles();
            if(roleNames && roleNames.length===2 && (roleNames.indexOf('ROLE_USER')>-1 && roleNames.indexOf('ROLE_COMPANY_PARTNER')>-1)){
                return true;
            }else{
                return false;
            }
        
      }catch(error){
        this.xtremandLogger.log('error'+error);
      }
    }

    isSuperAdmin(){
        try{
          const roleNames = this.getRoles();
          if(roleNames && roleNames.length===1 && (roleNames.indexOf('ROLE_SUPER_ADMIN')>-1)){
              return true;
          }else{
              return false;
          }
        }catch(error){
          this.xtremandLogger.log('error'+error);
        }
      }

    isVendor(){
       try{
        const roleNames = this.getRoles();
        if(roleNames && roleNames.length===2 && (roleNames.indexOf(this.roleName.userRole)>-1 && roleNames.indexOf(this.roleName.vendorRole)>-1)){
            return true;
        }else{
            return false;
        }
      }catch(error){
        this.xtremandLogger.log('error'+error);
      }
    }
    hasOnlyVideoRole(){
      try{
      const roleNames = this.getRoles();
      if(roleNames && roleNames.length===2 && (roleNames.indexOf('ROLE_USER')>-1 && roleNames.indexOf(this.roleName.videRole)>-1)){
          return true;
      }else{
          return false;
      }
      }catch(error){
        this.xtremandLogger.log('error'+error);
      }
    }
    hasVideoRole(){
      try{
      const roleNames = this.getRoles();
      if(roleNames && (roleNames.indexOf('ROLE_USER')>-1 && roleNames.indexOf(this.roleName.videRole)>-1)){
          return true;
      }else{
          return false;
      }
      }catch(error){
        this.xtremandLogger.log('error'+error);
      }
    }
    isPartner(){
        try{
        const roleNames = this.getRoles();
        if(roleNames && roleNames.indexOf('ROLE_COMPANY_PARTNER')>-1){
            return true;
        }else{
            return false;
        }
      }catch(error){  this.xtremandLogger.log('error'+error); }
    }
    isOrgAdmin(){
       try{
        const roleNames = this.getRoles();
        if(roleNames && roleNames.indexOf('ROLE_ORG_ADMIN')>-1){ return true;
        }else{ return false;  }
      } catch(error){  this.xtremandLogger.log('error'+error);}
    }
    isOrgAdminPartner(){
      try{
        const roleNames = this.getRoles();
        if( roleNames && ( (roleNames.indexOf('ROLE_ORG_ADMIN')>-1 || (roleNames.indexOf('ROLE_ALL')>-1)) && roleNames.indexOf('ROLE_COMPANY_PARTNER')>-1)){
            return true;
        }else{
            return false;
        }
      }catch(error){ this.xtremandLogger.log('error'+error); }
    }
    isVendorPartner(){
      try{
      const roleNames = this.getRoles();
      if(roleNames && (roleNames.indexOf(this.roleName.vendorRole)>-1) && (roleNames.indexOf('ROLE_COMPANY_PARTNER')>-1)){
        return true;
      }else{
          return false;
      }
    } catch(error) {  this.xtremandLogger.log('error'+error);}
  }
    isTeamMember(){
        try{
         const roleNames = this.getRoles();
         if((roleNames && !this.isSuperAdmin() && !this.isOrgAdmin() && !this.isOrgAdminPartner() && !this.isPartner() && !this.isVendor() && !this.isVendorPartner() && ((roleNames.indexOf('ROLE_VIDEO_UPLOAD')>-1) || (roleNames.indexOf('ROLE_CAMPAIGN')>-1) || (roleNames.indexOf('ROLE_CONTACT')>-1) || (roleNames.indexOf('ROLE_EMAIL_TEMPLATE')>-1)
                || (roleNames.indexOf('ROLE_STATS')>-1) || (roleNames.indexOf('ROLE_SOCIAL_SHARE')>-1)) )){
             return true;
         }else{
             return false;
         }
       } catch(error){  this.xtremandLogger.log('error'+error);}
     }
    logout(): void {
        this.xtremandLogger.log('Logout');
        // clear token remove user from local storage to log user out
        this.access_token = null;
        this.refresh_token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem("campaignRouter");
        localStorage.removeItem("superiorId");
        this.utilService.topnavBareLoading = false;
        this.isCompanyAdded = false;
        const module = this.module;
        module.isOrgAdmin = false;
        module.isContact = false;
        module.isPartner = false;
        module.isEmailTemplate = false;
        module.isCampaign = false;
        module.isStats = false;
        module.isVideo = false;
        module.hasVideoRole = false;
        module.isCompanyPartner = false;
        module.hasSocialStatusRole = false;
        module.isVendor = false;
        this.isAddedByVendor = false;
        this.isPartnerTeamMember = false;
        swal.close();
        if ( !this.router.url.includes( '/userlock' ) ) {
            if ( environment.CLIENT_URL ==='https://xamplify.io/' ) {
                window.location.href = 'https://www.xamplify.com/';
            } else {
                this.router.navigate( ['/'] )
            }
        };
    }

    navigateToDashboardIfUserExists(){
      try{
         if(localStorage.getItem('currentUser')){ this.router.navigate(["/home/dashboard/default"]); }
      }catch(error){  this.xtremandLogger.log('error'+error);}
    }

    checkIsPartnerToo(){
        let roles = this.showRoles();
        if(roles=="Vendor & Partner" || roles=="Orgadmin & Partner"){  return true;
        }else{ return false;  }
    }

    checkLoggedInUserId( userId ) {
        if ( this.isSuperAdmin() ) { userId = this.selectedVendorId; }
        return userId;
    }

   
    
    connect() {
        let url = this.REST_URL + "socket";
        let socket = new SockJs( url );
        let stompClient = Stomp.over( socket );
        return stompClient;
    }
    
    extractData( res: Response ) {
        let body = res.json();
        console.log( body );
        return body || {};
    }

    handleError( error: any ) {
        return Observable.throw( error );
    } 
}
