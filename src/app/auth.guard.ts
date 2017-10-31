import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { Roles } from './core/models/roles';
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    roles: Roles = new Roles();
    emailTemplateBaseUrl:string = "emailtemplates";
    videoBaseUrl:string = "videos";
    socialBaseUrl:string = 'social';
    contactBaseUrl:string ='contacts';
    partnerBaseUrl:string = 'partners';
    campaignBaseUrl:string = 'campaigns';
    upgradeBaseUrl:string = 'upgrade';
    teamBaseUrl:string = 'team';
    
    constructor( private authenticationService: AuthenticationService, private router: Router ) {  }
    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        const url: string = state.url;
        return this.checkLogin( url );
    }
    canActivateChild( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        return this.canActivate( route, state );
    }
    checkLogin( url: string ): boolean {
        const currentUser = localStorage.getItem( 'currentUser' );
        if ( currentUser ) {
            this.authenticationService.access_token = JSON.parse( currentUser )['accessToken'];
            this.authenticationService.refresh_token = JSON.parse( currentUser )['refreshToken'];
            const userName = JSON.parse( currentUser )['userName'];
            this.authenticationService.user.id = JSON.parse(currentUser)['userId'];
            this.authenticationService.user.username = userName;
            this.authenticationService.user.emailId = userName;
            this.authenticationService.user.roles =  JSON.parse( currentUser )['roles'];
            this.authenticationService.user.hasCompany =  JSON.parse( currentUser )['hasCompany'];
            this.getUserByUserName(userName);
            if(url.indexOf("/dashboard")<0){
               return this.secureUrlByRole(url);
            }else{
                return true;
            }
            
        }else{
            this.authenticationService.redirectUrl = url;
            // Navigate to the login page
            this.router.navigate( ['/login'] );
            return false;
        }
    }

    getUserByUserName( userName: string ) {
        this.authenticationService.getUserByUserName( userName )
            .subscribe(
            data => {
                this.authenticationService.user = data;
                this.authenticationService.userProfile = data;
            },
            error => {console.log( error ); this.router.navigate( ['/login'] );},
            () => { }
            );
    }
    
    secureUrlByRole(url:string):boolean{
        let roles = this.authenticationService.user.roles.map(function(a) {return a.roleName;});
        if(url.indexOf(this.emailTemplateBaseUrl)>-1){
            return this.authorizeUrl(roles, url, this.emailTemplateBaseUrl);
        }
        if(url.indexOf(this.contactBaseUrl)>-1){
            return this.authorizeUrl(roles, url, this.contactBaseUrl);
        }
        if(url.indexOf(this.partnerBaseUrl)>-1){
            return this.authorizeUrl(roles, url, this.partnerBaseUrl);
        }
        if(url.indexOf(this.videoBaseUrl)>-1){
            return this.authorizeUrl(roles, url, this.videoBaseUrl);
        }
        if(url.indexOf(this.campaignBaseUrl)>-1){
            return this.authorizeUrl(roles, url, this.campaignBaseUrl);
        }
        if(url.indexOf(this.teamBaseUrl)>-1){
            return this.authorizeUrl(roles, url, this.teamBaseUrl);
        }
        if(url.indexOf(this.socialBaseUrl)>-1){
            return this.authorizeUrl(roles, url, this.socialBaseUrl);
        }
        if(url.indexOf(this.upgradeBaseUrl)>-1){
            return this.authorizeUrl(roles, url, this.upgradeBaseUrl);
        }
    }
    
    authorizeUrl(roles:any,url:string,urlType:string):boolean{
        let role = "";
        if(urlType==this.emailTemplateBaseUrl){
            role = this.roles.emailTemplateRole;
        }
        if(urlType==this.contactBaseUrl){
            role = this.roles.contactsRole;
        }
        if(urlType==this.videoBaseUrl){
            role = this.roles.videRole;
        }
        if(urlType==this.campaignBaseUrl){
            role = this.roles.campaignRole;
        }
        if(urlType==this.teamBaseUrl){
            role = this.roles.orgAdminRole;
        }
        if(urlType==this.socialBaseUrl){
            role = this.roles.socialShare;
        }
        if(urlType==this.upgradeBaseUrl){
            role = this.roles.orgAdminRole;
        }
        if(url.indexOf("/"+urlType+"/")>-1 && (roles.indexOf(this.roles.orgAdminRole)>-1 || roles.indexOf(this.roles.allRole)>-1  || roles.indexOf(role)>-1)){
            return true;
        }else{
            return this.goToAccessDenied();
        }
    }
    
    goToAccessDenied():boolean{
        this.router.navigate( ['/access-denied'] );
        return false;
    }
 }