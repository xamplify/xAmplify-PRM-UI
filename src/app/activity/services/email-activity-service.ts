import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { AuthenticationService } from "app/core/services/authentication.service";
import { EmailActivity } from "../models/email-activity-dto";
import { Pagination } from "app/core/models/pagination";
import { ReferenceService } from "app/core/services/reference.service";

@Injectable()
export class EmailActivityService {
    URL = this.authenticationService.REST_URL + "/email";
    ACCESS_TOKEN_URL = "?access_token="+this.authenticationService.access_token;

    constructor(private http: Http, private authenticationService: AuthenticationService, private referenceService: ReferenceService) {}

    sendEmailToUser(emailActivity:EmailActivity) {
        emailActivity.loggedInUserId = this.authenticationService.getUserId();
        let url = this.URL + this.ACCESS_TOKEN_URL;
        return this.authenticationService.callPostMethod(url, emailActivity);
    }

    fetchAllEmailActivities(emailActivityPagination:Pagination) {
        emailActivityPagination.userId = this.authenticationService.getUserId();
        let pageableUrl = this.referenceService.getPagebleUrl(emailActivityPagination);
        let url = this.URL + "/fetch-all-email-activities/" + emailActivityPagination.userId + "/" + emailActivityPagination.contactId + this.ACCESS_TOKEN_URL + pageableUrl;
        return this.authenticationService.callGetMethod(url);
    }

    fetchEmailActivityById(emailActivityId:any) {
        let url = this.URL + "/fetch-email-activity/" + emailActivityId + this.ACCESS_TOKEN_URL;
        return this.authenticationService.callGetMethod(url);
    }

    sendTestEmailToUser(emailActivity:EmailActivity) {
        emailActivity.loggedInUserId = this.authenticationService.getUserId();
        let url = this.URL + "/sendTestMail" + this.ACCESS_TOKEN_URL;
        return this.authenticationService.callPostMethod(url, emailActivity);
    }
}