import { Injectable } from '@angular/core';
import { AuthenticationService } from "./authentication.service";
import { Http, Response, RequestOptions } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ActivatedRoute } from "@angular/router";
import { ReferenceService } from "./reference.service";
import { Observable } from "rxjs/Observable";
import { SocialContact } from "app/contacts/models/social-contact";

@Injectable()
export class MicrosoftService {
  microsoftAuthenticationURL = this.authenticationService.REST_URL + 'hubspot/';

  constructor(private authenticationService: AuthenticationService, private _http: Http, private logger: XtremandLogger, private activatedRoute: ActivatedRoute, private refService: ReferenceService) {
    console.log(logger);
}

}
