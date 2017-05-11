import { Injectable, OnInit} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { AuthenticationService } from '../../core/services/authentication.service';
import {Observable} from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Category} from '../models/category';
import {Pagination} from '../../core/models/pagination';

@Injectable()
export class UploadCloudvideoService {


    public URL: string = this.authenticationService.REST_URL + 'admin/';

    constructor(private http: Http, private authenticationService: AuthenticationService) {
        console.log("cloud service constructor");
    }

    downloadFromDropbox(downloadLink: string, fileName: string): Observable<any> {
        console.log("file path in service " + downloadLink + "file name" + fileName);
        var url = this.URL + 'uploadCloudVideo?access_token=' + this.authenticationService.access_token + '&downloadLink=' + downloadLink + '&fileName=' + fileName;
        return this.http.post(url,"")
        .map( this.extractData )
        .catch( this.handleError );
    }

    downloadFromBox(downloadLink: string, fileName: string): Observable<any> {
        console.log("file path in service " + downloadLink + "file name" + fileName);
        var url = this.URL + 'uploadCloudVideo?access_token=' + this.authenticationService.access_token + '&downloadLink=' + downloadLink + '&fileName=' + fileName;
        return this.http.post(url,"")
        .map( this.extractData )
        .catch( this.handleError );
    }

    downloadFromGDrive(downloadLink: string, fileName: string, oauthToken: string): Observable<any> {
        console.log("file path in service " + downloadLink + "file name" + fileName + "oauthToken " + oauthToken);
        var url = this.URL + 'uploadCloudVideo?access_token=' + this.authenticationService.access_token + '&downloadLink=' + downloadLink + '&fileName=' + fileName + '&oauthToken=' + oauthToken;
        return this.http.post(url,"")
        .map( this.extractData )
        .catch( this.handleError );
    }

    extractData( res: Response ) {
        let body = res.json();
        console.log(body);
        return body || {};
    }

     handleError( error: any ) {
        let errMsg = ( error.message ) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw( errMsg );
    }



}
