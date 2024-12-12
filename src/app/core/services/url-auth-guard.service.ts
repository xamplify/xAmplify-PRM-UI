import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { Roles } from '../models/roles';


@Injectable()
export class UrlAuthGuardService {
  private DAM_URL = this.authenticationService.REST_URL + RouterUrlConstants.dam;
  private ACCESS_TOKEN_PARAMETER = XAMPLIFY_CONSTANTS.ACCESS_TOKEN_SUFFIX_URL;
  private userId = this.authenticationService.getUserId();
  private checkDamModuleAccessURL = "authorizeDamUrlAccess/";
  roles:Roles = new Roles();
  private AUTH_URL = this.authenticationService.REST_URL + RouterUrlConstants.authorize;
  constructor(private authenticationService:AuthenticationService) {

   }

  authorizeUrlAccess(routerUrl: string) {
    let isDamRouterUrl = routerUrl.includes("/home/dam") || routerUrl.includes("/home/select-modules");
    let isTrackRouterUrl = routerUrl.includes("/home/tracks");
    let isPlaybookRouterUrl = routerUrl.includes("/home/playbook");
    let moduleId = 0;
    let moduleName = "";
    if (isDamRouterUrl) {
      moduleId = this.roles.damId;
      moduleName = "dam";
    } else if (isTrackRouterUrl) {
      moduleId = this.roles.learningTrackId;
      moduleName = "tracks";
    } else if (isPlaybookRouterUrl) {
      moduleId = this.roles.playbookId;
      moduleName = "playbook";
    }
    const contentModuleRouterUrlsForPartner = ["modules", "shared", "editp", "pda", "tb", "pb"];
    let componentUrlName = this.getComponentUrlName(routerUrl, contentModuleRouterUrlsForPartner, moduleName);
    let url = this.AUTH_URL + "url/modules/" + moduleId + "/users/" + this.userId + "/routerUrls/" + componentUrlName + this.ACCESS_TOKEN_PARAMETER + this.authenticationService.access_token;
    let subDomain = this.authenticationService.getSubDomain();
    if (subDomain.length > 0) {
      url += "&subDomain=" + subDomain;
    }
    return this.authenticationService.callGetMethod(url);
  }

  getComponentUrlName(currentUrl:string,routes:any,defaultUrl:string){
    for (const route of routes) {
      if (currentUrl.includes(route)) {
        return route;
      }
    }
    return defaultUrl;
  }

}
