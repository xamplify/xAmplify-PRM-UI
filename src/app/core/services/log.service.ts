import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class LogService {
	
	URL = this.authenticationService.REST_URL;
	
    constructor(
            private http: Http,
            private authenticationService: AuthenticationService ) {
        }
	
	logEmailUrlClicks(campaignAlias: string, userAlias: string, url: string){
		  return this.http.post( this.URL + "user/logEmailURLClick?campaignAlias=" + campaignAlias+"&userAlias=" +userAlias +"&url="+url, "")
          .map( this.extractData )
          .catch( this.handleError );
		
	}
	
    private extractData( res: Response ) {
        console.log( res );
        let body = res;
        console.log( "response.json(): " + body );
        return body || {};
    }

    private handleError( error: any ) {
        var body = error['_body'];
        console.log( body );
        if ( body != "" ) {
            var response = JSON.parse( body );
            if ( response.message != undefined ) {
                return Observable.throw( response.message );
            } else {
                return Observable.throw( response.error );
            }

        } else {
            let errMsg = ( error.message ) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
            return Observable.throw( error );
        }

    }
	
}