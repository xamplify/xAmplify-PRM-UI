import { Injectable ,OnInit} from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {SaveVideoFile} from '../../videos/models/save-video-file';
import { AuthenticationService } from './authentication.service';
import {Observable} from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Category} from '../../videos/models/category';
import { Logger } from "angular2-logger/core";
declare var swal :any;
@Injectable()
export class ReferenceService{

    public refcategories: Category[];
    public URL: string = this.authenticationService.REST_URL + 'admin/';

    constructor(private http: Http, private authenticationService: AuthenticationService, private logger:Logger) {
        console.log("reference service constructor");
        console.log("categories called :");
    }

    getCategories(): Observable<Category[]> {
        var url = this.URL + 'categories?access_token=' + this.authenticationService.access_token;
        return this.http.get(url, "","")
            .map((response: any) => response.json());
    }
    
    
    showError(cause:string,methodName:string,componentName:string){
       let message = "Error In "+methodName+"() "+componentName;
       swal(cause.toString(),message,"error");
       this.logger.error(message+":",cause);
    }
    
    showInfo(info:string,data:any){
        this.logger.debug(info, data);
    }
    
}