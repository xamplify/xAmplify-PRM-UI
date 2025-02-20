import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { Injectable } from '@angular/core';
import { ChangeEmailAddressRequestDto } from './models/change-email-address-request-dto';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CustomDomainDto } from './models/custom-domain-dto';
import { AccountDetailsDto } from './models/account-details-dto';

@Injectable()
export class SuperAdminService {
  
    
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

getCustomDomain(companyId:string){
    const url = this.authenticationService.REST_URL + 'superadmin/getCustomDomain'+'/'+companyId+'?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
}

updateCustomDomain(customDomainDto:CustomDomainDto){
    const url = this.authenticationService.REST_URL + 'superadmin/updateCustomDomain?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url,customDomainDto);
}

findRoleIdsAndNames(selectedTeamMemberUserId: any) {
    const url = this.authenticationService.REST_URL + 'superadmin/findRoleIdsAndNames'+'/'+selectedTeamMemberUserId+'?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
}

deleteCampaign(id: number) {
    const url = this.authenticationService.REST_URL + 'superadmin/deleteCampaign/'+id+'?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callDeleteMethod(url);
}

findVendorCompanies(accountDetailsDto:AccountDetailsDto) {
    const url = this.authenticationService.REST_URL + 'superadmin/findVendorCompanies?emailId='+accountDetailsDto.emailId+'&access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
}

findPartnerCompaniesExcluding(vendorCompanyId:number,partnerCompanyId:number){
    const url = this.authenticationService.REST_URL + 'superadmin/partnerCompanies/'+vendorCompanyId+'/exclude/'+partnerCompanyId+'?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
}

findPartnerCompanyMetrics(vendorCompanyId:number,partnerCompanyId:number){
    const url = this.authenticationService.REST_URL + 'superadmin/vendors/'+vendorCompanyId+'/partners/'+partnerCompanyId+'/metrics?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
}

}
