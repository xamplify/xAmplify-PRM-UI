import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { Http, Response, RequestOptions } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import { ReferenceService } from "./reference.service";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class IntegrationService {

    constructor(private authenticationService: AuthenticationService, private _http: Http, private logger: XtremandLogger, private activatedRoute: ActivatedRoute, private refService: ReferenceService) {
        console.log(logger);
    }

    checkConfigurationByType(type: string) {
        this.logger.info(this.authenticationService.REST_URL + type + "/" + this.authenticationService.getUserId() + "/authorize?access_token=" + this.authenticationService.access_token);
        return this._http.get(this.authenticationService.REST_URL + type + "/" + this.authenticationService.getUserId() + "/authorize?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    handleCallbackByType(code: string, type: string): Observable<String> {
        this.logger.info(this.authenticationService.REST_URL + type + "/" + this.authenticationService.getUserId() + "/oauth/callback?access_token=" + this.authenticationService.access_token + "&code=" + code);
        if (code !== undefined) {
            return this._http.get(this.authenticationService.REST_URL + type + "/" + this.authenticationService.getUserId() + "/oauth/callback?access_token=" + this.authenticationService.access_token + "&code=" + code)
                .map(this.extractData)
                .catch(this.handleError);
        }
    }

    extractData(res: Response) {
        let body = res.json();
        console.log(body);
        return body || {};
    }

    handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }
    
    listSalesforceCustomFields(userId: number) {
        return this._http.get(this.authenticationService.REST_URL + "/salesforce/formfields/" + userId + "/all?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    syncSalesforceCustomForm(userId: number, request: any) {
        return this._http.post(this.authenticationService.REST_URL + "/salesforce/form/" + userId + "/sync?access_token=" + this.authenticationService.access_token, request)
            .map(this.extractData)
            .catch(this.handleError);
        
    }
    
    checkSfCustomFields(userId: number) {
        return this._http.get(this.authenticationService.REST_URL + "/salesforce/" + userId + "/checkCustomFields?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
}