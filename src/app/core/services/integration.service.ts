import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { Http, Response, RequestOptions } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import { ReferenceService } from "./reference.service";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs/Observable";
import { VanityURLService } from "app/vanity-url/services/vanity.url.service";
import { SocialContact } from "app/contacts/models/social-contact";
import { CustomFieldsDto } from "app/dashboard/models/custom-fields-dto";

@Injectable()
export class IntegrationService {
 
    constructor(private authenticationService: AuthenticationService, private _http: Http, private logger: XtremandLogger, private activatedRoute: ActivatedRoute, private refService: ReferenceService) {
    }

    checkConfigurationByType(type: string) {
        this.logger.info(this.authenticationService.REST_URL + type + "/" + this.authenticationService.getUserId() + "/authorize?access_token=" + this.authenticationService.access_token);
        return null;
    }
    
    checkConfigurationByTypeAndUserId(type: string, userId: number) {
        this.logger.info(this.authenticationService.REST_URL + type + "/" + userId + "/authorize?access_token=" + this.authenticationService.access_token);
        return null
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
        return null;
    }
    
    syncSalesforceCustomForm(userId: number, request: any) {
        return null
        
    }
    
    checkSfCustomFields(userId: number) {
        return null
    }

    getContacts(type: string): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/contacts?access_token=" + this.authenticationService.access_token + "&type="+type);
        return;
    }

    getContactLists(type: string): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/contacts/lists?access_token=" + this.authenticationService.access_token + "&type="+type);
        return null;
    }

    getContactListsById(listId: any, type: string): Observable<any> {
        this.logger.info(this.authenticationService.REST_URL + "external/" + this.authenticationService.getUserId() + "/lists/" + listId + "/contacts?access_token=" + this.authenticationService.access_token + "&type="+type);
        return null;
    }

    saveContacts(contacts: SocialContact): Observable<any> {
        return null;
    }

    listExternalCustomFields(type:string, userId: number) {
        return null;
    }

    getIntegrationDetails(type: string, loggedInUserId: any) {
        return null;
    }

    syncPipeline(pipelineId: number, userId: number) {
        return null;
    }

    getActiveCRMDetails(createdForCompanyId: number, loggedInUserId: number) {
        return null;
    }

    getActiveCRMDetailsByUserId(loggedInUserId: number) {
        return null;
    }

    getactiveCRMCustomForm(companyId: any, dealId: any, ticketTypeId: any, opportunityType: any) {
        return null;
    }  

    syncCustomForm(userId: number, request: any, type: any, opportunityType: any) {
        return null;
    }

    setActiveCRM(request: any) {
        return null;
    }

    unlinkCRM(userId: number, type: any) {
        return null;
    }

    getCRMPipelines(loggedInUserId: number, type: any) {
        return null;
      }

      syncActiveCRMPipelines(loggedInUserId: number, type: any) {
        return null;
    }

    getHaloPSATicketTypes(companyId: number, integrationType: any, moduleType: string) {
        return null;
    }

    getLeadConvertMappingLayoutId(companyId:number , layoutId:string) {
        return null;
    }

    updateCRMSettings(integrationType:string, loggedInUserId:any, integrationDetails:any) {
        return null;
    }
    
    getCRMPipelinesForCRMSettings(createdForCompanyId: number, loggedInUserId: number, type: any, halopsaTicketTypeId: any, pipelineType:any) {
        return null;
      }

    getVendorRegisterDealValue(partnerUserId:number, vendorCompanyProfileName:string) {
        return null;
    }

    findPipelinesForCRMSettings(loggedInUserId:number, integrationType:any, pipelineType:any, ticketId:any) {
        return null;
      
      }

    getCrmCustomDropdowns(parentLabelId: string, selectedValue: string) {
        return null;
    }

    /**XNFR-677**/
    getSalesforceRedirectUrl(instanceType:any) {
        return null;
    }

    //XNFR-710
    getFormLabelsValues(dealId: any, opportunityType: any, createdForCompanyId: any) {
        return null;
    }

    getFormLabelChoices(formLabelId: number) {
        return null;
    }

    saveCustomFields(request: any) {
        return null;
    }

    syncCustomFieldsForm(request: any) {
        return null;
    }

    getCustomFields(opportunityType: any) {
        return null;
    }

    deleteCustomField(customFieldId: number, loggedInUserId: any) {
        return null;
    }

    getLeadCountForCustomField(customFieldId: number) {
        return null;
    }
    /**** XNFR-887  ****/
    getActiveIntegrationTypeByCompanyName(companyProfileName:string) {
        return null;
    }
    /**** XNFR-887  ****/

        checkSfCustomFieldsByCompanyProfileName(companyProfileName: string) {
        return null;
    }

}