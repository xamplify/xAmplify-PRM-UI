import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { AuthorizeUrlDto } from '../models/authorize-url-dto';
RouterUrlConstants

@Injectable()
export class UrlAuthGuardService {
  private DAM_URL = this.authenticationService.REST_URL + RouterUrlConstants.dam;
  private ACCESS_TOKEN_PARAMETER = XAMPLIFY_CONSTANTS.ACCESS_TOKEN_SUFFIX_URL;
  private userId = this.authenticationService.getUserId();
  private checkDamModuleAccessURL = "authorizeDamUrlAccess/";

  constructor(private authenticationService:AuthenticationService) {

   }


  authorizeDamUrlAccess(currentUrl:string){
    let params: URLSearchParams = new URLSearchParams();
    params.set('subDomain', this.authenticationService.getSubDomain());
    let angularRouterUrl = this.getAngularRouterUrlForPathVariable(currentUrl);
    let url = this.DAM_URL+this.checkDamModuleAccessURL+"users/"+this.userId+"/routerUrls/"+angularRouterUrl+this.ACCESS_TOKEN_PARAMETER+this.authenticationService.access_token;
    return this.authenticationService.callGetMethodWithQueryParameters(url,params)
    
  }

  getAngularRouterUrlForPathVariable(currentUrl: string): string {
    const routes = ["upload", "design", "modules", "add", "manage", "shared"];
    for (const route of routes) {
      if (currentUrl.includes(route)) {
        return route;
      }
    }
    return "";
  }

}
