import { Injectable } from "@angular/core";
import { Pagination } from "app/core/models/pagination";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ReferenceService } from "app/core/services/reference.service";

@Injectable()
export class ActivityService {

    URL = this.authenticationService.REST_URL + "/activity";
    ACCESS_TOKEN_URL = "?access_token="+this.authenticationService.access_token;

    constructor(private authenticationService: AuthenticationService, private referenceService: ReferenceService) {}

    fetchRecentActivities(activityPagination:Pagination) {
        activityPagination.userId = this.authenticationService.getUserId();
        let pageableUrl = this.referenceService.getPagebleUrl(activityPagination);
        let vendorCompanyProfileName = this.authenticationService.companyProfileName;
        if (vendorCompanyProfileName != undefined && vendorCompanyProfileName != '') {
            pageableUrl = pageableUrl + "&vendorCompanyProfileName="+vendorCompanyProfileName;
        }
        let url = this.URL + "/fetchRecentActivities/" + activityPagination.contactId + "/" + activityPagination.userId + "/" + activityPagination.isCompanyJourney + this.ACCESS_TOKEN_URL + pageableUrl;
        return this.authenticationService.callGetMethod(url);
    }

    fetchLogoFromExternalSource(userId:any, isCompanyJourney:boolean) {
        let prefix = isCompanyJourney ? this.authenticationService.REST_URL + "companies/" : this.URL;
        let url = prefix + "/fetchLogoFromExternalSource/" + userId + this.ACCESS_TOKEN_URL;
        return this.authenticationService.callGetMethod(url);
    }

}