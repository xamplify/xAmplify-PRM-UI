import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { Roles } from './core/models/roles';
import { ReferenceService } from './core/services/reference.service';
import {UtilService} from './core/services/util.service';
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    roles: Roles = new Roles();
    emailTemplateBaseUrl = "emailtemplates";
    videoBaseUrl = "content";
    socialBaseUrl = 'social';
    twitterBaseUrl = 'twitter';
    rssBaseUrl = 'rss';
    contactBaseUrl ='contacts';
    partnerBaseUrl = 'partners';
    campaignBaseUrl = 'campaigns';
    upgradeBaseUrl = 'upgrade';
    teamBaseUrl = 'team';
    opportunityBaseUrl = 'deals';
    formBaseUrl = 'forms';
    landingPagesUrl = 'pages';
    constructor( private authenticationService: AuthenticationService, private router: Router,private referenceService:ReferenceService,public utilService:UtilService) {  }
    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        const url: string = state.url;
        return this.checkLogin( url );
    }
    canActivateChild( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        return this.canActivate( route, state );
    }
    checkLogin( url: string ): boolean {
      try{
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
            this.authenticationService.user.campaignAccessDto = JSON.parse( currentUser )['campaignAccessDto'];
            this.getUserByUserName(userName);
            if(url.includes('home/error')){ 
                this.router.navigateByUrl('/home/dashboard') 
              }
            else if(!this.authenticationService.user.hasCompany) {
              if(url.includes("/home/dashboard") || url.includes("/home/dashboard/default") || url.includes("/home/dashboard/myprofile")){
                return true;
              } else { this.goToAccessDenied(url);  }
            }else if(url.includes("/home/design/add")){
                return true;
            }
            else if(url.indexOf("/dashboard")< 0 ){
               return this.secureUrlByRole(url);
            }else{
                if(url.indexOf("/myprofile")>-1){
                    if(this.authenticationService.user.hasCompany){
                        return true;
                    }else{
                        this.goToAccessDenied(url);
                    }
                }else{
                    return true;
                }
            }

        }else{
            this.authenticationService.redirectUrl = url;
            // Navigate to the login page
            this.router.navigate( ['/login'] );
            return false;
        }
      }catch(error){console.log('error'+error); this.router.navigate( ['/login'] ); }
    }

     getUserByUserName( userName: string ) {
      try{
         this.authenticationService.getUserByUserName( userName )
            .subscribe(
            data => {
              console.log('logged in user profile info:');
              console.log(data);
              this.authenticationService.user = data;
              this.authenticationService.userProfile = data;
            },
            error => {console.log( error ); this.router.navigate(['/su'])},
            () => { }
            );
        }catch(error){ console.log('error'+error); }
    }

    secureUrlByRole(url:string):boolean{
        try{
        const roles = this.authenticationService.user.roles.map(function(a) {return a.roleName;});
        if(url.indexOf(this.emailTemplateBaseUrl)>-1){
            return this.authorizeUrl(roles, url, this.emailTemplateBaseUrl);
        }
        if(url.indexOf("/home/contacts/")>-1){
            return this.authorizeUrl(roles, url, this.contactBaseUrl);
        }
        if(url.indexOf("/home/partners/")>-1){
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
        if(url.indexOf(this.twitterBaseUrl)>-1){
          return this.authorizeUrl(roles, url, this.twitterBaseUrl);
        }
        if(url.indexOf(this.rssBaseUrl)>-1){
          return this.authorizeUrl(roles, url, this.rssBaseUrl);
        }
        if(url.indexOf(this.upgradeBaseUrl)>-1){
            return this.authorizeUrl(roles, url, this.upgradeBaseUrl);
        }
        if(url.indexOf(this.opportunityBaseUrl)>-1){
          return this.authorizeUrl(roles, url, this.opportunityBaseUrl);
        }
        if(url.indexOf(this.formBaseUrl)>-1){
            return this.authorizeUrl(roles, url, this.formBaseUrl);
         }
        if(url.indexOf(this.landingPagesUrl)>-1){
            return this.authorizeUrl(roles, url, this.landingPagesUrl);
         }
      }catch(error){ console.log('error'+error);}
    }

    authorizeUrl(roles:any,url:string,urlType:string):boolean{
      try{
        let role = "";
        if(urlType===this.emailTemplateBaseUrl){
            role = this.roles.emailTemplateRole;
        }
        if(urlType===this.contactBaseUrl){
            role = this.roles.contactsRole;
        }
        if(urlType === this.partnerBaseUrl){
            role = this.roles.partnersRole;
        }
        if(urlType===this.videoBaseUrl){
            role = this.roles.videRole;
        }
        if(urlType===this.campaignBaseUrl){
            role = this.roles.campaignRole;
        }
        if(urlType===this.teamBaseUrl){
            role = this.roles.orgAdminRole;
        }
        if(urlType===this.socialBaseUrl){
            role = this.roles.socialShare;
        }
        if(urlType===this.twitterBaseUrl){
          role = this.roles.socialShare;
        }
        if(urlType===this.rssBaseUrl){
          role = this.roles.socialShare;
        }
        if(urlType===this.upgradeBaseUrl){
            role = this.roles.orgAdminRole;
        }
        if(urlType===this.opportunityBaseUrl){
          role = this.roles.opportunityRole;
        }
        if(urlType===this.formBaseUrl){
            role = this.roles.formRole;
         }
        if ( urlType === this.landingPagesUrl ) {
            role = this.roles.landingPageRole;
        }
        if(url.indexOf("partners")>-1 || url.indexOf("upgrade")>-1 ){
            url = url+"/";
        }

        const isVendor =  roles.indexOf(this.roles.vendorRole)>-1;
        const isPartner = roles.indexOf(this.roles.companyPartnerRole)>-1;
        const orgAdmin =  roles.indexOf(this.roles.orgAdminRole)>-1;
        const isSuperAdmin =  roles.indexOf(this.roles.superAdminRole)>-1;
        const userAccount =  roles.indexOf(this.roles.userRole)>-1;
        if(isSuperAdmin){
            this.router.navigate( ['/home/dashboard/admin-report'] );
            return true;
        }
        if(urlType==this.formBaseUrl){
            let hasFormAccess = false;
            let campaignAccessDto = this.authenticationService.user.campaignAccessDto;
            if(campaignAccessDto!=undefined){
                hasFormAccess = campaignAccessDto.formBuilder;
            }
            let hasRole = roles.indexOf(this.roles.orgAdminRole)>-1  || roles.indexOf(this.roles.vendorRole)>-1
                            || roles.indexOf(this.roles.allRole)>-1 || roles.indexOf(this.roles.formRole)>-1; 
            let hasPartnerFormAccess = isPartner && (url.indexOf("/partner/")>-1);
            if((hasFormAccess && hasRole) ||(isPartner && (url.indexOf("/cf/")>-1|| url.indexOf("/analytics")>-1)) || hasPartnerFormAccess){
                return true;
            }else{
                console.log(campaignAccessDto);
                console.log("hasFormAcess:-"+hasFormAccess);
                console.log("hasRole:-"+hasFormAccess);
                return this.goToAccessDenied(url);
            }
        }
        else if(urlType==this.landingPagesUrl){
            let hasLandingPageAccess = false;
            let partnerLandingPageAccess = false;
            let campaignAccessDto = this.authenticationService.user.campaignAccessDto;
            if(campaignAccessDto!=undefined){
                hasLandingPageAccess = campaignAccessDto.landingPage;
                partnerLandingPageAccess = campaignAccessDto.partnerLandingPage;
                
            }
            let hasRole = roles.indexOf(this.roles.orgAdminRole)>-1  || roles.indexOf(this.roles.vendorRole)>-1
                            || roles.indexOf(this.roles.allRole)>-1 || roles.indexOf(this.roles.landingPageRole)>-1;  
            let hasPartnerLandingPageAccess = isPartner && (url.indexOf("/partner")>-1);
            if((hasLandingPageAccess && hasRole) || hasPartnerLandingPageAccess || partnerLandingPageAccess){
                return true;
            }else{
                return this.goToAccessDenied(url);
            }
        
        }
        else if(isVendor && !isPartner){
            return this.checkVendorAccessUrls(url, urlType);
        }
        else if(isPartner && !isVendor && !orgAdmin){
            return this.checkPartnerAccessUrls(url, urlType)
        }
        else{
            const hasRole = (roles.indexOf(this.roles.orgAdminRole)>-1 || roles.indexOf(this.roles.companyPartnerRole)>-1
                    || roles.indexOf(this.roles.allRole)>-1  || roles.indexOf(role)>-1);
            
            if(url.indexOf("/"+urlType+"/")>-1 && this.authenticationService.user.hasCompany&&hasRole){
                return true;
            }else{
                return this.goToAccessDenied(url);
            }
        }
      }catch(error){console.log('error'+error); }
    }

    checkVendorAccessUrls(url:string,urlType:string):boolean{
      try{
      if(url.indexOf("/"+urlType+"/")>-1 && this.authenticationService.user.hasCompany
                && url.indexOf("/"+this.contactBaseUrl+"/")< 0){
            return true;
        }else{
            return this.goToAccessDenied(url);
        }
      }catch(error){ console.log('error'+error);}
    }
    checkPartnerAccessUrls(url:string,urlType:string):boolean{
      try{
           if(this.authenticationService.user.hasCompany && (url.includes('/home/deals') || url.includes('/home/campaigns/re-distribute-campaign')
              || !(url.includes('/home/content') || url.includes('/home/campaigns/create') || url.includes('/home/campaigns/select')
                      || url.includes('/home/emailtemplates') || url.includes('/home/partners/add')
                      || url.includes('/home/partners/manage')))){
                return true;
      }else{
                return this.goToAccessDenied(url);
      }
    }catch(error){ console.log('error'+error);}
    }

    goToAccessDenied(url):boolean{
        if(!(url.includes('/home/team/add-team') && this.utilService.isLoggedAsTeamMember())){
            this.router.navigate( ['/access-denied'] );
            return false;
        }else{
            return true;
        }
    }
 }
