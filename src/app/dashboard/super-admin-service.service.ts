import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { Injectable } from '@angular/core';
import { ChangeEmailAddressRequestDto } from './models/change-email-address-request-dto';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable()
export class SuperAdminServiceService {
  superAdminUrl =  this.authenticationService.REST_URL+RouterUrlConstants.superAdmin;
  constructor(private authenticationService:AuthenticationService) { }


  updateEmailAddress(changeEmailAddressRequestDto:ChangeEmailAddressRequestDto){
    const url = this.superAdminUrl + 'updateEmailAddress?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url,changeEmailAddressRequestDto);
}

updateCampaignEmail(changeEmailAddressRequestDto:ChangeEmailAddressRequestDto){
    const url = this.superAdminUrl + 'updateCampaignEmail?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url,changeEmailAddressRequestDto);
}

removeAccessToken(changeEmailAddressRequestDto:ChangeEmailAddressRequestDto){
    const url = this.superAdminUrl + 'removeAccessToken?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url,changeEmailAddressRequestDto);
}


validateEmailAddressChange(changeEmailAddressRequestDto:ChangeEmailAddressRequestDto){
    const url = this.superAdminUrl + 'validateEmailAddressChange?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url,changeEmailAddressRequestDto);
}

}
