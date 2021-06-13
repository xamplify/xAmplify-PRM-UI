import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class LogService {

    URL = this.authenticationService.REST_URL;

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    logEmailUrlClicks(emailLog: any) {
        return this.http.post(this.URL + "user/logEmailURLClick", emailLog)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    logSMSUrlOpened(smsLog: any) {
        return this.http.post(this.URL + "user/logSMSURLOpened", smsLog)
            .map(this.extractData)
            .catch(this.handleError);
    }
    logSMSUrlClicks(smsLog: any) {
        return this.http.post(this.URL + "user/logSMSURLClick", smsLog)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    unSubscribeUser(object:any){
        return this.http.post(this.URL + "log/unsubscribe-status",object)
        .map(this.extractData)
        .catch(this.handleError);
    }

    logunsubscribedUser(userAlias: string, companyId: number) {
        return this.http.post(this.URL + "log/unsubscribe-user?userAlias=" + userAlias + "&companyId=" + companyId, +"")
            .map(this.extractData)
            .catch(this.handleError);
    }

    findUnsubscribedReasons(companyId: number) {
        return this.http.get(this.URL + "/findAllUnsubscribeReasons/"+companyId)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        console.log(res);
        let body = res;
        console.log("response.json(): " + body);
        return body || {};
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(errMsg);
    }

}
