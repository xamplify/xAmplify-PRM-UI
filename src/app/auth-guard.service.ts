import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { ReferenceService } from './core/services/reference.service';
import { UtilService } from './core/services/util.service';
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router, private referenceService: ReferenceService, public utilService: UtilService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.authenticationService.access_token = JSON.parse(currentUser)['accessToken'];
      this.authenticationService.refresh_token = JSON.parse(currentUser)['refreshToken'];
      const userName = JSON.parse(currentUser)['userName'];
      this.authenticationService.user.id = JSON.parse(currentUser)['userId'];
      this.authenticationService.user.username = userName;
      this.authenticationService.user.emailId = userName;
      this.authenticationService.user.roles = JSON.parse(currentUser)['roles'];
      this.authenticationService.user.hasCompany = JSON.parse(currentUser)['hasCompany'];
      this.authenticationService.user.campaignAccessDto = JSON.parse(currentUser)['campaignAccessDto'];
      this.getUserByUserName(userName);
      return true;
    } else {
      this.authenticationService.redirectUrl = url;
      this.router.navigate(['/login']);
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
    error => {console.log( error ); this.router.navigate(['/login'])},
    () => { }
    );
  }
}
