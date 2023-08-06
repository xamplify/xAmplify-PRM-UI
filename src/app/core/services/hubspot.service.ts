import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { Http, Response, RequestOptions } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ActivatedRoute } from "@angular/router";
import { ReferenceService } from "./reference.service";
import { Observable } from "rxjs/Observable";
import { SocialContact } from "app/contacts/models/social-contact";
import { EmailTemplate } from "app/email-template/models/email-template";

@Injectable()
export class HubSpotService {
    hubspotAuthenticationURL = this.authenticationService.REST_URL + 'hubspot/';

    constructor(private authenticationService: AuthenticationService, private _http: Http, private logger: XtremandLogger, private activatedRoute: ActivatedRoute, private refService: ReferenceService) {
    }

    configHubSpot() {
        this.logger.info(this.hubspotAuthenticationURL + this.authenticationService.getUserId() + "/authorize?access_token=" + this.authenticationService.access_token);
        return this._http.get(this.hubspotAuthenticationURL + this.authenticationService.getUserId() + "/authorize?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    hubSpotCallback(code: string): Observable<String> {
        this.logger.info(this.authenticationService.REST_URL + "hubspot/" + this.authenticationService.getUserId() + "/oauth/callback?access_token=" + this.authenticationService.access_token + "&code=" + code);
        if (code !== undefined) {
            return this._http.get(this.authenticationService.REST_URL + "hubspot/" + this.authenticationService.getUserId() + "/oauth/callback?access_token=" + this.authenticationService.access_token + "&code=" + code)
                .map(this.extractData)
                .catch(this.handleError);
        }
    }

    getHubSpotContacts(): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/contacts?access_token=" + this.authenticationService.access_token + "&type=hubspot");
        return this._http.get(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/contacts?access_token=" + this.authenticationService.access_token + "&type=hubspot")
            .map(this.extractData)
            .catch(this.handleError);
    }

    getHubSpotContactsLists(): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/contacts/lists?access_token=" + this.authenticationService.access_token + "&type=hubspot");
        return this._http.get(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/contacts/lists?access_token=" + this.authenticationService.access_token + "&type=hubspot")
            .map(this.extractData)
            .catch(this.handleError);
    }

    getHubSpotContactsListsById(listId: any): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/lists/" + listId + "/contacts?access_token=" + this.authenticationService.access_token + "&type=hubspot");
        return this._http.get(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/lists/" + listId + "/contacts?access_token=" + this.authenticationService.access_token + "&type=hubspot")
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveHubSpotContacts(hubSpotContacts: SocialContact): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/saveContacts?access_token=" + this.authenticationService.access_token);
        var requestoptions = new RequestOptions({
            body: hubSpotContacts,
        })
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = {
            headers: headers
        };
        return this._http.post(this.authenticationService.REST_URL + "external/saveContacts?access_token=" + this.authenticationService.access_token, options, requestoptions)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getHubSpotTemplates(): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/templates?access_token=" + this.authenticationService.access_token + "&type=hubspot");
        return this._http.get(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/templates?access_token=" + this.authenticationService.access_token + "&type=hubspot")
            .map(this.extractData)
            .catch(this.handleError);
    }

    getHubSpotTemplateById(templateId: any): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/templates/" + templateId + "?access_token=" + this.authenticationService.access_token + "&type=hubspot");
        return this._http.get(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/templates/" + templateId + "?access_token=" + this.authenticationService.access_token + "&type=hubspot")
            .map(this.extractData)
            .catch(this.handleError);
    }

    // hubSpotSyncContacts(userListId:any){
    //     this.logger.info(this.authenticationService.REST_URL + "synchronizeContacts/"+userListId +"?access_token=" + this.authenticationService.access_token);
    //     var requestoptions = new RequestOptions({
    //         body: hubSpotContacts,
    //     })
    //     var headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     var options = {
    //         headers: headers
    //     };
    //     return this._http.post(this.authenticationService.REST_URL + "synchronizeContacts/"+ userListId+"?access_token=" + this.authenticationService.access_token, options, requestoptions)
    //         .map(this.extractData)
    //         .catch(this.handleError);
    // }

    importHubSpotTemplates(body: any): Observable<any>{
        return this._http.post(this.authenticationService.REST_URL + "external/templates/import?access_token=" + this.authenticationService.access_token,body)
        .map(this.extractData)
        .catch(this.handleError);
    }

    saveHubSpotEmailSaveTemplate(emailTemplate:EmailTemplate){
        this.logger.info(this.authenticationService.REST_URL + "external/templates/import?access_token=" + this.authenticationService.access_token);
        return this._http.post(this.authenticationService.REST_URL + "/marketo/saveEmailTemplate?access_token="+this.authenticationService.access_token,emailTemplate)
        .map(this.extractData)
        .catch(this.handleError);
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
}