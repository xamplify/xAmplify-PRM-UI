import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { User } from '../models/user';
import { Role } from '../models/role';
import {Roles} from '../models/roles';
import { Module } from '../models/module';
import { UserToken } from '../models/user-token';
import { UtilService } from '../services/util.service';

import { environment } from '../../../environments/environment';
declare var swal: any;

export let CLIENT_URL = environment.CLIENT_URL;
export let SERVER_URL = environment.SERVER_URL;

@Injectable()
export class AuthenticationService {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    logged_in_time: Date;
    SERVER_URL: string;
    REST_URL: string;
    MEDIA_URL: string;
    APP_URL: string;
    SHARE_URL: string;
    user: User = new User();
    userProfile: User = new User();
    userToken: UserToken = new UserToken();
    redirectUrl: string;
    map: any;
    isCompanyAdded = false;
    module:Module = new Module();
    roleName: Roles= new Roles();
    isAddedByVendor:boolean = false;
    constructor(private http: Http, private router: Router, private utilService: UtilService) {
        this.SERVER_URL = SERVER_URL;
        this.APP_URL = CLIENT_URL;
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
        console.log('authentication service' + body);
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
                    this.user = res.json();
                    this.userProfile = res.json();
                }));
    }
    getUserByUserName(userName: string) {
        return this.http.post(this.REST_URL + 'admin/getUserByUserName?userName=' + userName + '&access_token=' + this.access_token, '')
            .map((res: Response) => { return res.json(); })
            .catch((error: any) => { return error; });
    }
    getUserId(): number {
        let userId;
        if (!this.user.id) {
            const currentUser = localStorage.getItem('currentUser');
            userId = JSON.parse(currentUser)['userId'];
        } else {
            userId = this.user.id;
        }
        return userId;
    }
    hasCompany(): boolean {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser != null) {
            return currentUser.hasCompany;
        }
    }
    getRoles(): any {
        let roleNames: string[] = [];
        const currentUser = localStorage.getItem('currentUser');
        const roles = JSON.parse(currentUser)['roles'];
        roleNames = roles.map(function (a) { return a.roleName; });
        if(!roleNames && this.user.roles) { roleNames = this.user.roles.map(function (a) { return a.roleName; });}
        return roleNames;
    }
    showRoles():string{
        let roleNames = this.getRoles();
        /***********Org Admin**************/
        let isOrgAdmin = roleNames.indexOf(this.roleName.orgAdminRole)>-1;
        let isPartner =  roleNames.indexOf(this.roleName.companyPartnerRole)>-1;
        let isVendor = roleNames.indexOf(this.roleName.vendorRole)>-1;
        if(roleNames.length==1){
            return "User";
        }else{
            if(isOrgAdmin&&isPartner){
                return "Orgadmin & Partner";
            }else if(isVendor&&isPartner){
                return "Vendor & Partner";
            }else if(isOrgAdmin){
                return "Orgadmin";
            }else if(isVendor){
                return "Vendor";
            }else if(isPartner){
                return "Partner";
            }else{
                return "Team Member";
            }
        }
    }

    isOnlyPartner(){
        let roleNames = this.getRoles();
        if(roleNames.length==2 && (roleNames.indexOf('ROLE_USER')>-1 && roleNames.indexOf('ROLE_COMPANY_PARTNER')>-1)){
            return true;
        }else{
            return false;
        }
    }

    isVendor(){
        let roleNames = this.getRoles();
        if(roleNames.length==2 && (roleNames.indexOf(this.roleName.userRole)>-1 && roleNames.indexOf(this.roleName.vendorRole)>-1)){
            return true;
        }else{
            return false;
        }
    }
    hasOnlyVideoRole(){
      const roleNames = this.getRoles();
      if(roleNames.length===2 && (roleNames.indexOf('ROLE_USER')>-1 && roleNames.indexOf(this.roleName.videRole)>-1)){
          return true;
      }else{
          return false;
      }
    }

    isPartner(){
        const roleNames = this.getRoles();
        if(roleNames.indexOf('ROLE_COMPANY_PARTNER')>-1){
            return true;
        }else{
            return false;
        }
    }
    isOrgAdmin(){
        let roleNames = this.getRoles();
        if(( (roleNames.indexOf('ROLE_ORG_ADMIN')>-1))){
            return true;
        }else{
            return false;
        }
    }
    isOrgAdminPartner(){
        let roleNames = this.getRoles();
        if(( (roleNames.indexOf('ROLE_ORG_ADMIN')>-1 || (roleNames.indexOf('ROLE_ALL')>-1)) && roleNames.indexOf('ROLE_COMPANY_PARTNER')>-1)){
            return true;
        }else{
            return false;
        }
    }
    isVendorPartner(){
      let roleNames = this.getRoles();
      if((roleNames.indexOf(this.roleName.vendorRole)>-1) && (roleNames.indexOf('ROLE_COMPANY_PARTNER')>-1)){
        return true;
      }else{
          return false;
      }
  }
    logout(): void {
        console.log('logout()');
        // clear token remove user from local storage to log user out
        this.access_token = null;
        this.refresh_token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem("campaignRouter");
        this.utilService.topnavBareLoading = false;
        this.isCompanyAdded = false;
        let module = this.module;
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
        swal.close();
    }
    
    navigateToDashboardIfUserExists(){
        if(localStorage.getItem('currentUser')){
            this.router.navigate(["/home/dashboard/default"]);
        }
    }
}
