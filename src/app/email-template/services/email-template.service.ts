import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }     from 'rxjs/Rx';

import { AuthenticationService } from '../../core/services/authentication.service';
import { EmailTemplate } from '../models/email-template';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {Pagination} from '../../core/models/pagination';
import {ReferenceService} from "../../core/services/reference.service";

@Injectable()
export class EmailTemplateService {


    emailTemplate:EmailTemplate;
    public pagination: Pagination;
    isRegularUpload:boolean;
    URL = this.authenticationService.REST_URL;
    
    constructor( private http: Http,  private authenticationService: AuthenticationService,
    		 private refService:ReferenceService ) {
       }
    
    save(emailTemplate:EmailTemplate){
        return this.http.post(this.URL+"admin/saveEmailTemplate?access_token="+this.authenticationService.access_token,emailTemplate)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    update(emailTemplate:EmailTemplate){
        return this.http.post(this.URL+"admin/updateEmailTemplate?access_token="+this.authenticationService.access_token,emailTemplate)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    
    listTemplates(pagination:Pagination,userId:number){
        console.log(pagination);
        try{
            var url =this.URL+"admin/listEmailTemplates/"+userId+"?access_token="+this.authenticationService.access_token;
            return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError); 
        }catch(error){
           this.refService.showError(error, "Error in sdfs() in emailTemplate.service.ts","");
        }
        
    }
    
    listCampaignDefaultTemplates(){
        return this.http.get(this.URL+"admin/listCampaignDefaultTemplates?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
        
    }
    
     listDefaultTemplates(){
        return this.http.get(this.URL+"admin/listDefaultTemplates?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    getById(id:number){
        return this.http.post(this.URL+"admin/getEmailTemplateById/"+id+"?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    get(id:number){
        return this.http.get(this.URL+"/emailTemplate/"+id)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    delete(id:number){
        return this.http.get(this.URL+"admin/deleteEmailTemplate/"+id+"?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    getAvailableNames(userId:number){
        return this.http.get(this.URL+"admin/listEmailTemplateNames/"+userId+"?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        if (error.status === 500) {
            var response =  JSON.parse(error['_body']);
            return Observable.throw(new Error(response.message));
        }
        else if (error.status === 400) {
            return Observable.throw(new Error(error.status));
        }
        else if (error.status === 409) {
            return Observable.throw(new Error(error.status));
        }
        else if (error.status === 406) {
            return Observable.throw(new Error(error.status));
        }
       /* var body = error['_body'];
        if(body!=""){
            var response = JSON.parse(body);
            if(response.message!=undefined){
                return Observable.throw(response.message);
            }else{
                return Observable.throw(response.error);
            }
            
        }else{
            let errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
            return Observable.throw(error);
        }
       */
    }  
}
