import { Injectable, OnInit} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { AuthenticationService } from '../../core/services/authentication.service';
import {Observable} from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Category} from '../models/Category';
import {Pagination} from '../../core/models/Pagination';

@Injectable()
export class UploadCloudvideoService {


    public URL: string = this.authenticationService.REST_URL + 'admin/';

    constructor(private http: Http, private authenticationService: AuthenticationService) {
        console.log("cloud service constructor");
    }

    downloadFromDropbox(downloadLink: string, fileName: string): Observable<any> {
        console.log("file path in service " + downloadLink + "file name" + fileName);
        var url = this.URL + 'uploadCloudVideo?access_token=' + this.authenticationService.access_token + '&downloadLink=' + downloadLink + '&fileName=' + fileName;
        return this.http.post(url)
            .map((response: any) => response.json())
    }

    downloadFromBox(downloadLink: string, fileName: string): Observable<any> {
        console.log("file path in service " + downloadLink + "file name" + fileName);
        var url = this.URL + 'uploadCloudVideo?access_token=' + this.authenticationService.access_token + '&downloadLink=' + downloadLink + '&fileName=' + fileName;
        return this.http.post(url)
            .map((response: any) => response.json())
    }

    downloadFromGDrive(downloadLink: string, fileName: string, oauthToken: string): Observable<any> {
        console.log("file path in service " + downloadLink + "file name" + fileName + "oauthToken " + oauthToken);
        var url = this.URL + 'uploadCloudVideo?access_token=' + this.authenticationService.access_token + '&downloadLink=' + downloadLink + '&fileName=' + fileName + '&oauthToken=' + oauthToken;
        return this.http.post(url)
            .map((response: any) => response.json())
    }



}
