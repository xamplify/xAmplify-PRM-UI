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
  constructor(private authenticationService:AuthenticationService) {}

  authorizeUrlAccess(routerUrl: string) {
    const moduleInfo = this.getContentModuleInfo(routerUrl);
    const moduleId = moduleInfo.moduleId;
    const moduleName = moduleInfo.moduleName;
    const contentModuleRouterUrlsForPartner = ["modules", "shared", "editp", "pda", "tb", "pb"];
    let componentUrlName = this.getComponentUrlName(routerUrl, contentModuleRouterUrlsForPartner, moduleName);
    let url = this.AUTH_URL + "url/modules/" + moduleId + "/users/" + this.userId + "/routerUrls/" + componentUrlName + this.ACCESS_TOKEN_PARAMETER + this.authenticationService.access_token;
    let subDomain = this.authenticationService.getSubDomain();
    if (subDomain.length > 0) {
      url += "&subDomain=" + subDomain;
    }
    return this.authenticationService.callGetMethod(url);
  }

  getContentModuleInfo(routerUrl: string) {
    if (routerUrl.includes("/home/dam") || routerUrl.includes("/home/select-modules")) {
      return { moduleId: this.roles.damId, moduleName: "dam" };
    } else if (routerUrl.includes("/home/tracks")) {
      return { moduleId: this.roles.learningTrackId, moduleName: "tracks" };
    } else if (routerUrl.includes("/home/playbook")) {
      return { moduleId: this.roles.playbookId, moduleName: "playbook" };
    } else if (routerUrl.includes("/home/approval-hub")) {
      return { moduleId: this.roles.approveId, moduleName: "approval-hub" };
    }
    return { moduleId: 0, moduleName: "" };
  }

  getComponentUrlName(currentUrl: string, routes: any, defaultUrl: string) {
    for (const route of routes) {
      if (currentUrl.includes(route)) {
        return route;
      }
    }
    return defaultUrl;
  }

}
