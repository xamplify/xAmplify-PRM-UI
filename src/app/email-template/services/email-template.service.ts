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
    
    highLightHtml(htmlText:string){
        var code = htmlText;
        var HtmlRegex = /(\&lt;[a-zA-Z1-6]+(\s*[a-zA-Z1-6\-_\.]+(?:=\".*\")?)*\s*\/?\s*\&gt;)/g;
        var HtmlRegex2 = /\&lt;[a-zA-Z1-6]+(\s*[a-zA-Z1-6\-_\.]+(?:=\".*\")?)*\s*\/?\s*\&gt;/g;
        var HtmlEndRegex = /(\&lt;\/[a-zA-Z1-6]*\&gt;)/g;
        var attributeRegex = /([a-zA-Z0-9\-\_]*)=(\"[a-zA-Z0-9\-\_\s\{\}\(\)\[\]\.\/\,\=\+\#]*\")/g;
        var commentRegex1 = /(&lt;!--[\s\S]*?--&gt;)/g;
        var commentRegex2 = /(\/\/.*)/g;
        var result = code;
        if(result!=undefined){
            result = result.replace(/</g, '&lt;');
            result = result.replace(/>/g, '&gt;');
            result = result.replace(HtmlRegex, '<span class="htmlTag">$1</span>');
            var htmlAttrMatches = result.match(HtmlRegex2);
            for(var i = 0; i < htmlAttrMatches.length; i++) {
                var attrs = htmlAttrMatches[i];
                attrs = attrs.replace(attributeRegex, '<span class="htmlAttr">$1</span>=<span class="htmlValue">$2</span>');
                result = result.replace(htmlAttrMatches[i], attrs);
            }
            result = result.replace(HtmlEndRegex, '<span class="htmlTag" >$1</span>');
            result = result.replace(commentRegex1, '<span class="comment" >$1</span>');
            result = result.replace(commentRegex2, '<span class="comment">$1</span>');
            
            result = result.replace(/\n/g, '<br />');
            result = result.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
            return result;
        }
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
