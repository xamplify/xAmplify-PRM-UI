import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { Http, Response, RequestOptions } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import { ReferenceService } from "./reference.service";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs/Observable";
import { VanityURLService } from "app/vanity-url/services/vanity.url.service";
import { SocialContact } from "app/contacts/models/social-contact";

@Injectable()
export class IntegrationService {
       

    constructor(private authenticationService: AuthenticationService, private _http: Http, private logger: XtremandLogger, private activatedRoute: ActivatedRoute, private refService: ReferenceService) {
    }

    checkConfigurationByType(type: string) {
        this.logger.info(this.authenticationService.REST_URL + type + "/" + this.authenticationService.getUserId() + "/authorize?access_token=" + this.authenticationService.access_token);
        return this._http.get(this.authenticationService.REST_URL + type + "/" + this.authenticationService.getUserId() + "/authorize?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    checkConfigurationByTypeAndUserId(type: string, userId: number) {
        this.logger.info(this.authenticationService.REST_URL + type + "/" + userId + "/authorize?access_token=" + this.authenticationService.access_token);
        return this._http.get(this.authenticationService.REST_URL + type + "/" + userId + "/authorize?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    handleCallbackByType(code: string, type: string): Observable<String> {
        this.logger.info(this.authenticationService.REST_URL + type + "/" + this.authenticationService.getUserId() + "/oauth/callback?access_token=" + this.authenticationService.access_token + "&code=" + code);
        if (code !== undefined) {
				let vanityUrlFilter = localStorage.getItem('vanityUrlFilter');
				let vanityUserId = localStorage.getItem('vanityUserId');
				if(vanityUrlFilter){
					return this._http.get(this.authenticationService.REST_URL + type + "/" + vanityUserId + "/oauth/callback?code=" + code)
                .map(this.extractData)
                .catch(this.handleError);
				}else{
					return this._http.get(this.authenticationService.REST_URL + type + "/" + this.authenticationService.getUserId() + "/oauth/callback?code=" + code)
                .map(this.extractData)
                .catch(this.handleError);
				}
            
        }
    }

    extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }
    
    listSalesforceCustomFields(userId: number, type: any) {
        return this._http.get(this.authenticationService.REST_URL + "/salesforce/" + type + "/formfields/" + userId + "/all?access_token=" + this.authenticationService.access_token)
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

    getContacts(type: string): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/contacts?access_token=" + this.authenticationService.access_token + "&type="+type);
        return this._http.get(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/contacts?access_token=" + this.authenticationService.access_token + "&type="+type)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getContactLists(type: string): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/contacts/lists?access_token=" + this.authenticationService.access_token + "&type="+type);
        return this._http.get(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/contacts/lists?access_token=" + this.authenticationService.access_token + "&type="+type)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getContactListsById(listId: any, type: string): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/lists/" + listId + "/contacts?access_token=" + this.authenticationService.access_token + "&type="+type);
        return this._http.get(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/lists/" + listId + "/contacts?access_token=" + this.authenticationService.access_token + "&type="+type)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveContacts(contacts: SocialContact): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/saveContacts?access_token=" + this.authenticationService.access_token);
        var requestoptions = new RequestOptions({
            body: contacts,
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

    listExternalCustomFields(type:string, userId: number) {
        return this._http.get(this.authenticationService.REST_URL + "/external/" + userId + "/custom-fields?access_token=" + this.authenticationService.access_token+ "&type="+type)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getIntegrationDetails(type: string, loggedInUserId: any) {
        return this._http.get(this.authenticationService.REST_URL + `/${type}/user/info/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    syncPipeline(pipelineId: number, userId: number) {
        return this._http.get(this.authenticationService.REST_URL + `external/pipeline/sync/${userId}/${pipelineId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getActiveCRMDetails(createdForCompanyId: number, loggedInUserId: number) {
        return this._http.get(this.authenticationService.REST_URL + `crm/active/${createdForCompanyId}/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getActiveCRMDetailsByUserId(loggedInUserId: number) {
        return this._http.get(this.authenticationService.REST_URL + `crm/active/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getactiveCRMCustomForm(companyId: any, dealId: any, ticketTypeId: any, opportunityType: any) {
        return this._http.get(this.authenticationService.REST_URL + "crm/active/" + opportunityType + "/custom/form/" + companyId + "/" + dealId + "/" + this.authenticationService.getUserId() + "/" + ticketTypeId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }  

    syncCustomForm(userId: number, request: any, type: any, opportunityType: any) {
        return this._http.post(this.authenticationService.REST_URL + `external/${opportunityType}/form/sync/${userId}/${type}/v2?access_token=${this.authenticationService.access_token}`, request)
            .map(this.extractData)
            .catch(this.handleError);
    }

    setActiveCRM(request: any) {
        return this._http.post(this.authenticationService.REST_URL + `crm/active?access_token=${this.authenticationService.access_token}`, request)
            .map(this.extractData)
            .catch(this.handleError);
    }

    unlinkCRM(userId: number, type: any) {
        return this._http.get(this.authenticationService.REST_URL + type+"/unlink/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCRMPipelines(loggedInUserId: number, type: any) {
        return this._http.get(this.authenticationService.REST_URL + `/pipeline/DEAL/${type}/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
        .map(this.extractData)
        .catch(this.handleError);
      }

      syncActiveCRMPipelines(loggedInUserId: number, type: any) {
        return this._http.get(this.authenticationService.REST_URL + `${type}/sync/pipelines/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getHaloPSATicketTypes(companyId: number, integrationType: any, moduleType: string) {
        return this._http.get(this.authenticationService.REST_URL + `/${integrationType}/opportunity/types/${companyId}/${moduleType}?access_token=${this.authenticationService.access_token}`)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getLeadConvertMappingLayoutId(companyId:number , layoutId:string) {
        return this._http.get(this.authenticationService.REST_URL + `/zoho/layout/${companyId}/${layoutId}?access_token=${this.authenticationService.access_token}`)
        .map(this.extractData)
        .catch(this.handleError);
    }

    updateCRMSettings(integrationType:string, loggedInUserId:any, integrationDetails:any) {
        return this._http.post(this.authenticationService.REST_URL + `update/${integrationType}/crm/settings/${loggedInUserId}?access_token=${this.authenticationService.access_token}`,integrationDetails)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getCRMPipelinesForCRMSettings(createdForCompanyId: number, loggedInUserId: number, type: any, halopsaTicketTypeId: any, pipelineType:any) {
        return this._http.get(this.authenticationService.REST_URL + `/pipeline/${pipelineType}/${type}/${createdForCompanyId}/${loggedInUserId}/${halopsaTicketTypeId}?access_token=${this.authenticationService.access_token}`)
          .map(this.extractData)
          .catch(this.handleError);
      }

    getVendorRegisterDealValue(partnerUserId:number, vendorCompanyProfileName:string) {
        return this._http.get(this.authenticationService.REST_URL + `/vendor/register/deal/${partnerUserId}/${vendorCompanyProfileName}?access_token=${this.authenticationService.access_token}`)
          .map(this.extractData)
          .catch(this.handleError);
    }

    findPipelinesForCRMSettings(loggedInUserId:number, integrationType:any, pipelineType:any, ticketId:any) {
        let ACCESS_TOKEN_SUFFIX_URL = "?access_token="+this.authenticationService.access_token;
        let ticketIdParameter = ticketId!=undefined && ticketId>0 ? "&ticketTypeId="+ticketId:"&ticketTypeId=0";
        let loggedInUserIdRequestParam = loggedInUserId!=undefined && loggedInUserId>0 ? "&loggedInUserId="+loggedInUserId:"&loggedInUserId=0";
        let integrationTypeRequestParam = integrationType!=undefined ? "&integrationType="+integrationType:"&integrationType="+'';
        let pipelineTypeRequestParam = pipelineType!=undefined ? "&pipelineType="+pipelineType:"&pipelineType="+'';
        let url = this.authenticationService.REST_URL+"pipeline/findPipelinesForCRMSettings"+ACCESS_TOKEN_SUFFIX_URL+loggedInUserIdRequestParam+ticketIdParameter+integrationTypeRequestParam+pipelineTypeRequestParam;
        return this.authenticationService.callGetMethod(url);
      
      }

      saveCustomFields(request: any) {
        return this._http.post(this.authenticationService.REST_URL + "/customFields/save?access_token=" + this.authenticationService.access_token, request)
            .map(this.extractData)
            .catch(this.handleError);
        
    }
    syncCustomFieldsForm(request: any) {
        return this._http.post(this.authenticationService.REST_URL + "/customFields/sync?access_token=" + this.authenticationService.access_token, request)
            .map(this.extractData)
            .catch(this.handleError);
        
    }

    getLeadCustomFields() {
        let loggedInUserId = this.authenticationService.getUserId();
        return this._http.get(this.authenticationService.REST_URL + `/customFields/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
          .map(this.extractData)
          .catch(this.handleError);
      }
}