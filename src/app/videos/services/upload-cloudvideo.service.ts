import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploadCloudvideoService {

    public URL: string = this.authenticationService.REST_URL + 'admin/';
    constructor(private http: Http, private authenticationService: AuthenticationService) {
        console.log('cloud service constructor');
    }
    downloadFromDropbox(downloadLink: string, fileName: string): Observable<any> {
        console.log('file path in service ' + downloadLink + 'file name' + fileName);
        const url = this.URL + 'uploadCloudVideo?access_token=' + this.authenticationService.access_token +
            '&downloadLink=' + downloadLink + '&fileName=' + fileName + '&userId=' + this.authenticationService.user.id;
        return this.http.post(url, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    downloadFromBox(downloadLink: string, fileName: string): Observable<any> {
        console.log('file path in service' + downloadLink + 'file name' + fileName);
        const url = this.URL + 'uploadCloudVideo?access_token=' + this.authenticationService.access_token +
            '&downloadLink=' + downloadLink + '&fileName=' + fileName + '&userId=' + this.authenticationService.user.id;
        return this.http.post(url, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    downloadFromGDrive(downloadLink: string, fileName: string, oauthToken: string): Observable<any> {
        console.log('file path in service' + downloadLink + 'file name' + fileName + 'oauthToken' + oauthToken);
        const url = this.URL + 'uploadCloudVideo?access_token=' + this.authenticationService.access_token +
            '&downloadLink=' + downloadLink + '&fileName=' + fileName + '&oauthToken=' + oauthToken +
            '&userId=' + this.authenticationService.user.id;
        return this.http.post(url, "")
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
