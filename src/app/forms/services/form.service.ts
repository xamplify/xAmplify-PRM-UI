import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
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

    constructor( private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger ) { }


    saveForm( form: Form ) {
        return this.http.post( this.URL + "save?access_token=" + this.authenticationService.access_token, form )
            .map( this.extractData )
            .catch( this.handleError );
    }

    updateForm( form: Form ) {
        return this.http.post( this.URL + "update?access_token=" + this.authenticationService.access_token, form )
            .map( this.extractData )
            .catch( this.handleError );
    }


    list( pagination: Pagination ): Observable<any> {
        return this.http.post( this.URL + "list?access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }

    listFormNames( userId: number ) {
        return this.http.get( this.URL + "listFormNames/" + userId + "?access_token=" + this.authenticationService.access_token )
            .map( this.extractData )
            .catch( this.handleError );

    }


    delete( id: number ) {
        return this.http.get( this.URL + "delete/" + id + "?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getById( id: number ) {
        return this.http.get( this.URL + "getById/" + id + "?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }

    getByAlias( alias: string ) {
        return this.http.get( this.authenticationService.REST_URL + "/getByFormAlias/" + alias, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }


    submitForm( formSubmit: FormSubmit ) {
        return this.http.post( this.URL + "submit/save", formSubmit )
            .map( this.extractData )
            .catch( this.handleError );
    }
    

    getFormAnalytics( pagination: Pagination,alias:string,campaignFormAnalytics:boolean): Observable<any> {
        let url = "";
        if(alias.length>0){
            url = this.URL + "analytics/"+alias;
        }else{
            url = this.URL + "partner-landingPage/analytics";
        }
        return this.http.post(url+"?access_token=" + this.authenticationService.access_token, pagination )
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
}
