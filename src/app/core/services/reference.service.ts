import { Injectable ,OnInit} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {SaveVideoFile} from '../../videos/models/save-video-file';
import { AuthenticationService } from './authentication.service';
import {Observable} from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Category} from '../../videos/models/category';
import { Logger } from "angular2-logger/core";
import {User} from '../models/user';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
@Injectable()
export class ReferenceService{

    public refcategories: Category[];
    public userName: any;
    public selectedCampaignType:string = "";
    campaignSuccessMessage:string = "";
    public URL: string = this.authenticationService.REST_URL + 'admin/';

    constructor(private http: Http, private authenticationService: AuthenticationService, private logger:Logger) {
        console.log("reference service constructor");
        console.log("categories called :");
    }

    getCategories(): Observable<Category[]> {
        var url = this.URL + 'categories?access_token=' + this.authenticationService.access_token;
        return this.http.get(url, "")
        .map( this.extractData )
        .catch( this.handleError );
    }
    
    
    showError(cause:string,methodName:string,componentName:string){
       let message = "Error In "+methodName+"() "+componentName;
       this.logger.error(message+":",cause);
    }
    
    showServerError(httpRequestLoader:HttpRequestLoader){
        httpRequestLoader.isLoading = false;
        httpRequestLoader.isServerError = true;
        httpRequestLoader.statusCode = 500;
        return httpRequestLoader;
    }
    
    loading(httpRequestLoader:HttpRequestLoader,isLoading:boolean){
        httpRequestLoader.isLoading = isLoading;
    }
    
    showInfo(info:string,data:any){
        this.logger.debug(info, data);
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