import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { ReferenceService } from './reference.service';
import { Router } from '@angular/router';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
RouterUrlConstants

@Injectable()
export class UrlAuthGuardService {
  private DAM_URL = this.authenticationService.REST_URL + RouterUrlConstants.dam;
  private ACCESS_TOKEN_PARAMETER = XAMPLIFY_CONSTANTS.ACCESS_TOKEN_SUFFIX_URL;
  private userId = this.authenticationService.getUserId();
  private checkDamModuleAccessURL = "/authorizeDamUrlAccess/loggedInUserId/";

  constructor(private authenticationService:AuthenticationService) {

   }

  authorizeDamUrlAccess(currentUrl:string){
    let domainName = this.authenticationService.getSubDomain();
    let url = "";
    if(domainName.length>0){
      url = this.DAM_URL+"subDomain/"+domainName+this.checkDamModuleAccessURL+this.userId+this.ACCESS_TOKEN_PARAMETER+this.authenticationService.access_token;;
    }else{
      url = this.DAM_URL+this.checkDamModuleAccessURL+this.userId+this.ACCESS_TOKEN_PARAMETER+this.authenticationService.access_token;;
    }
    return this.authenticationService.callGetMethod(url);

  }

}
