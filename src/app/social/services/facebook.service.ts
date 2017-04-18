import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { Observable }     from 'rxjs/Rx';

import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable()
export class FacebookService {
    URL = this.authenticationService.REST_URL+"facebook/";
    QUERY_PARAMETERS = '?access_token='+this.authenticationService.access_token;

    constructor(private http: Http, private authenticationService: AuthenticationService) {}
    
    getPosts(facebookAccessToken: string, ownerId:string){
        return this.http.get(this.URL+"posts"+this.QUERY_PARAMETERS+"&facebookAccessToken="+facebookAccessToken+"&ownerId="+ownerId)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    getAccounts(facebookAccessToken: string){
        return this.http.get(this.URL+"accounts"+this.QUERY_PARAMETERS+"&facebookAccessToken="+facebookAccessToken)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        let body = res.json();
        console.log(body);
        return body || {};
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(errMsg);
    }
}
