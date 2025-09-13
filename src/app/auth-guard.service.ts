import { Observable } from 'rxjs';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { ReferenceService } from './core/services/reference.service';
import { UtilService } from './core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { VanityURLService } from './vanity-url/services/vanity.url.service';
import { UrlAuthGuardService } from './core/services/url-auth-guard.service';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthGuardService implements CanActivate {
  addCompanyProfileUrl = "/home/dashboard/add-company-profile";
  constructor(
    private xtremandLogger: XtremandLogger,
    private authenticationService: AuthenticationService,
    private router: Router,
    private referenceService: ReferenceService,
    private utilService: UtilService,
    private vanityUrlService:VanityURLService,
    private urlAuthGuardService:UrlAuthGuardService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.referenceService.isUserProfileLoading = true;
      this.setAuthGuardLoading(true);
      this.setUserAuthentication(currentUser);
      return this.getUserByUserName(currentUser.userName, state);
    } else {
      this.authenticationService.logout();
      return false;
    }
  }

  private getCurrentUser(): any {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  }

  private setUserAuthentication(user: any): void {
    this.authenticationService.access_token = user.accessToken;
    this.authenticationService.refresh_token = user.refreshToken;
    this.authenticationService.user.id = user.userId;
    this.authenticationService.user.username = user.userName;
    this.authenticationService.user.emailId = user.userName;
    this.authenticationService.user.roles = user.roles;
    this.authenticationService.user.hasCompany = user.hasCompany;
    this.authenticationService.user.campaignAccessDto = user.campaignAcessDto;
    this.authenticationService.user.secondAdmin = user.secondAdmin;
  }

  private getUserByUserName(userName: string, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      if(!this.authenticationService.hasCompany){
        this.setAuthGuardLoading(false);
        resolve(state.url.includes(this.addCompanyProfileUrl));
      }else{
        this.authenticationService.getUserByUserName(userName).subscribe({
          next: (data) => {
            this.authenticationService.user = data;
            this.authenticationService.userProfile = data;
            this.referenceService.isUserProfileLoading = false;
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
            this.referenceService.isUserProfileLoading = false;
          },
          complete: () => {
            const url = state.url;
            this.vanityUrlService.isVanityURLEnabled();
            resolve(this.handleUrlAuthorization(url));
          }
        });
      }
      
    });
  }

  

  private handleUrlAuthorization(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.urlAuthGuardService.authorizeUrlAccess(url).subscribe({
        next: (_response) => {
          resolve(true);
        },
        error: (error:any) => {
          const statusCode = error['status'] ? JSON.parse(error.status) : 500;
          this.handleAuthorizationError(statusCode);
          resolve(false);
        }
      });
    });
  }

  /***XNFR-694****/
  setAuthGuardLoading(loading: boolean): void {
    this.authenticationService.module.authGuardLoading = loading;
}

  private handleAuthorizationError(statusCode: number): void {
    switch (statusCode) {
      case 0:
        this.referenceService.goToRouter('logout');
        break;
      case 401:
        this.referenceService.goToRouter('expired');
        break;
        case 403:
          this.referenceService.goToAccessDeniedPage();
          break;
      default:
        this.xtremandLogger.errorPage(statusCode);
        break;
    }
  }
}
