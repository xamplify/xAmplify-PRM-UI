import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UploadCloudvideoService {

    public URL: string = this.authenticationService.REST_URL + 'videos/upload-cloud-video';
    public CLOUDURL: string = this.authenticationService.REST_URL + 'videos/upload-cloud-content';
    constructor(private http: Http, private authenticationService: AuthenticationService, public httpClient:HttpClient) {
        console.log('cloud service constructor');
    }
    downloadFromDropbox(downloadLink: string, fileName: string): Observable<any> {
        fileName= fileName.replace(/[^a-zA-Z0-9.]/g, '');
        var suffix = fileName.substring(fileName.lastIndexOf("."));
        var prefix = fileName.substring(0, fileName.lastIndexOf("."));
        fileName = prefix+suffix;
        console.log('file path in service ' + downloadLink + 'file name' + fileName);
        const url = this.URL + '?access_token=' + this.authenticationService.access_token +
            '&downloadLink=' + downloadLink + '&fileName=' + fileName + '&userId=' + this.authenticationService.user.id;
         return this.http.post(url, "")
            .map(this.extractData)
            .catch(this.handleError);
    }
    downloadFromDropboxContent(files: any){
        const url = this.CLOUDURL + '?access_token=' + this.authenticationService.access_token +
            '&userId=' + this.authenticationService.user.id;
        return this.http.post(url, files)
            .map(this.extractData)
            .catch(this.handleError);
    }

    downloadFromBox(downloadLink: string, fileName: string): Observable<any> {
    	  fileName= fileName.replace(/[^a-zA-Z0-9.]/g, '');
          var suffix = fileName.substring(fileName.lastIndexOf("."));
          var prefix = fileName.substring(0, fileName.lastIndexOf("."));
          fileName = prefix+suffix;
      console.log('file path in service' + downloadLink + 'file name' + fileName);
        const url = this.URL + '?access_token=' + this.authenticationService.access_token +
            '&downloadLink=' + downloadLink + '&fileName=' + fileName + '&userId=' + this.authenticationService.user.id;
        return this.http.post(url, "")
            .map(this.extractData)
            .catch(this.handleError);
    }

    downloadContentFromBox(files:any): Observable<any> {
    	 const url = this.CLOUDURL + '?access_token=' + this.authenticationService.access_token +
         '&userId=' + this.authenticationService.user.id;
     return this.http.post(url, files)
         .map(this.extractData)
         .catch(this.handleError);
    }

    downloadFromGDrive(downloadLink: string, fileName: string, oauthToken: string): Observable<any> {
    	  fileName= fileName.replace(/[^a-zA-Z0-9.]/g, '');
          var suffix = fileName.substring(fileName.lastIndexOf("."));
          var prefix = fileName.substring(0, fileName.lastIndexOf("."));
          fileName = prefix+suffix;
      console.log('file path in service' + downloadLink + 'file name' + fileName + 'oauthToken' + oauthToken);
        const url = this.URL + '?access_token=' + this.authenticationService.access_token +
            '&downloadLink=' + downloadLink + '&fileName=' + fileName + '&oauthToken=' + oauthToken +
            '&userId=' + this.authenticationService.user.id;
         return this.httpClient.post(url, "")
            .catch(this.handleError);
    }

    downloadContentFromGDrive(files:any): Observable<any> {
        const url = this.CLOUDURL + '?access_token=' + this.authenticationService.access_token +
        '&userId=' + this.authenticationService.user.id;
        return this.httpClient.post(url, files)
            .catch(this.handleError);
    }

    extractData(res: Response) {
        const body = res.json();
        console.log(body);
        return body || {};
    }

    handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }
}
