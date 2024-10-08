import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { AuthenticationService } from "app/core/services/authentication.service";
import { EmailActivity } from "../models/email-activity-dto";

@Injectable()
export class EmailActivitySevice {
    URL = this.authenticationService.REST_URL + "/email";
    ACCESS_TOKEN_SUFFIX_URL = "?access_token="+this.authenticationService.access_token;

    constructor(private http: Http, private authenticationService: AuthenticationService) {}

    sendEmailToUser(emailActivity:EmailActivity) {
        let url = this.URL + this.ACCESS_TOKEN_SUFFIX_URL;
        return this.authenticationService.callPostMethod(url, emailActivity);
    }
}