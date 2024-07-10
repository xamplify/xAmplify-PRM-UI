import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';

/*********Form*************/
import { Form } from '../models/form';
import { FormSubmit } from '../models/form-submit';

@Injectable()
export class FormService {

    URL = this.authenticationService.REST_URL + "form/";
    form: Form;
    formId: number;
    /***XNFR-433***/
    isCopyForm: boolean = false;

    constructor( private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger ) { }

    saveForm(form: Form, formData: FormData) {
        formData.append('formDto', new Blob([JSON.stringify(form)],
          {
            type: "application/json"
          }));
        return this.http.post(this.URL + "save?access_token=" + this.authenticationService.access_token, formData)
            .map( this.extractData )
            .catch( this.handleError );
    }

    updateForm(form: Form, formData: FormData) {
        formData.append('formDto', new Blob([JSON.stringify(form)],
          {
            type: "application/json"
          }));
        return this.http.post(this.URL + "update?access_token=" + this.authenticationService.access_token, formData)
            .map( this.extractData )
            .catch( this.handleError );
    }


   

    listFormNames( userId: number ) {
        return this.http.get( this.URL + "listFormNames/" + userId + "?access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );

    }


    delete( id: number ) {
        return this.http.get( this.URL + "delete/" + id + "/"+this.authenticationService.getUserId()+"?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getById( form: Form) {
        return this.http.post( this.URL + "getById?access_token=" + this.authenticationService.access_token, form )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getByAlias( alias: string, vendorJourney:boolean ) {
        return this.http.get( this.authenticationService.REST_URL + "/getByFormAlias/" + alias+"/"+vendorJourney, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

	uploadFile( formData: FormData,formSubmit:FormSubmit ) {
        formData.append('formSubmitDTO', new Blob([JSON.stringify(formSubmit)],
            {
                type: "application/json"
            }));
        return this.http.post(this.URL + "submit/uploadFile", formData)
            .map(this.extractData)
            .catch(this.handleError);
    }


    submitForm( formSubmit: FormSubmit, type:string) {
        let url = this.URL + "submit/";
        if(type != undefined && type != null && type == "lms-form"){
            url = url + "save-lms-form";
        } else {
            url = url + "save";
        }
        return this.http.post(url , formSubmit )
            .map( this.extractData )
            .catch( this.handleError );
    }
    

    getFormAnalytics( pagination: Pagination,alias:string,campaignFormAnalytics:boolean): Observable<any> {
        let url = "";
        if(alias!=undefined){
            if(alias.length>0){
                url = this.URL + "analytics/"+alias;
            }else{
                url = this.URL + "partner-landingPage/analytics";
            }
        }else{
            url = this.URL + "checkIn/analytics";
        }
        return this.http.post(url+"?access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getVendorJourneyFormAnalytics( pagination: Pagination,alias:string,campaignFormAnalytics:boolean): Observable<any> {
        let url = "";
                url = this.URL + "vendorJourneyAnalytics/"+alias;
        return this.http.post(url+"?access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    checkInAttendees( campaignId:number,formSubmitId:number,checkInStatus:boolean ) {
        return this.http.get( this.authenticationService.REST_URL  + "campaign/check-in/"+campaignId+"/"+formSubmitId+"/"+checkInStatus+"?access_token=" + this.authenticationService.access_token,"" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getCompanyLogo( userId: number ) {
        return this.http.get( this.URL + "getCompanyLogoPath/" + userId + "?access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );

    }
    
    getPriceTypes() {
        return this.http.get( this.URL + "price-types/"  + "?access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );

    }

    validateCaptcha(response : any) {
        return this.http.get( this.authenticationService.REST_URL + "validate-captcha/" + response  )
            .map( this.extractData )
            .catch( this.handleError );

    }
    
    quizList( pagination: Pagination ): Observable<any> {
        return this.http.post( this.URL + "quiz-list?access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    list( pagination: Pagination ): Observable<any> {
        return this.http.post( this.URL + "list?access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    listDefaultForms( pagination: Pagination ){
        return this.http.post( this.URL + "default/list?access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    findDefaultFormsOrUserDefinedForms(pagination:Pagination,defaultForm:boolean){
        let url = defaultForm ? 'default/list' : 'list';
        return this.http.post( this.URL + url+ "?access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    deleteDefaultForm(id:number){
        return this.http.get( this.URL + "deleteDefaultForm/" + id+"?access_token=" + this.authenticationService.access_token)
            .map( this.extractData )
            .catch( this.handleError );
    }

    getSurveyAnalytics(alias:string, campaignId:number, partnerId:number){  
        let url =  this.URL+"survey/analytics/"+alias;
        if (campaignId != undefined && campaignId != null && campaignId > 0) {
            url = url +"/"+ campaignId;
            if (partnerId != undefined && partnerId != null && partnerId > 0) {
                url = url +"/"+ partnerId;
            }
        }
        return this.http.get(url+"?access_token=" + this.authenticationService.access_token)
            .map( this.extractData )
            .catch( this.handleError );
    }

    getFormGeoAnalytics( pagination: Pagination,alias:string): Observable<any> {
        return this.http.post( this.URL + "analytics/list/"+alias+"?access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getDetailedResponse(formSubmitId: number){        
        return this.http.get(this.URL+"analytics/response/details/"+formSubmitId+"?access_token=" + this.authenticationService.access_token)
            .map( this.extractData )
            .catch( this.handleError );
    }

    private extractData( res: Response ) {
        const body = res.json();
        return body || {};
    }


    private handleError( error: any ) {
        return Observable.throw( error );
    }

    /***** XNFR-467 *****/
    downloadCsv(formSubmitId: number){
        let url = this.URL+"survey/download/" + formSubmitId +"?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
        .map(( response: any ) => response )
        .catch( this.handleError );
    }
    
    /***** XNFR-467 *****/
    downloadCsvFile(alias:string,campaignId:any){
        let url = this.URL+"survey/analytics/download/" + alias;    
        if (campaignId != undefined && campaignId != null && campaignId > 0) {
            url = url +"/"+ campaignId;
        }else{
            url = url +"/"+ 0;
        }
        return this.http.get(url+"?access_token=" + this.authenticationService.access_token)
        .map(( response: any ) => response )
       .catch( this.handleError );
     }

}
