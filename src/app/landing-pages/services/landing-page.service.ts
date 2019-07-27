import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { LandingPage } from '../models/landing-page';
import { Router } from '@angular/router';

@Injectable()
export class LandingPageService {

    jsonBody: any = "";
    id:number = 0;
    URL = this.authenticationService.REST_URL + "landing-page/";
    constructor( private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger,private router:Router ) { }

    listDefault( pagination: Pagination ): Observable<any> {
        return this.http.post( this.URL + "default?access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    list( pagination: Pagination ): Observable<any> {
        return this.http.post( this.URL + "list?access_token=" + this.authenticationService.access_token, pagination )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getAvailableNames(userId:number){
        return this.http.get(this.URL+"/listAvailableNames/"+userId+"?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }

    getById( id: number ): Observable<any> {
        return this.http.get( this.URL + "getById/" + id + "?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    getHtmlContent( id: number ): Observable<any> {
        return this.http.get( this.URL + "getHtmlBodyById/" + id + "?access_token=" + this.authenticationService.access_token, "" )
            .map( this.extractData )
            .catch( this.handleError );
    }
    
    save( landingPage:LandingPage): Observable<any> {
        return this.http.post( this.URL + "save?access_token=" + this.authenticationService.access_token,landingPage)
            .map( this.extractData )
            .catch( this.handleError );
    }

    
    goToManage(){
        if("/home/landing-pages/manage"==this.router.url){
            this.router.navigate([this.router.url]);
         }
    }
    

    private extractData( res: Response ) {
        const body = res.json();
        return body || {};
    }


    private handleError( error: any ) {
        return Observable.throw( error );
    }

}
