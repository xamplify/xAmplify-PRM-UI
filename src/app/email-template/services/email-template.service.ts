import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../../core/services/authentication.service';
import { EmailTemplate } from '../models/email-template';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {Pagination} from '../../core/models/pagination';
import {ReferenceService} from "../../core/services/reference.service";
import {ContentManagement} from '../../content-management/model/content-management';
@Injectable()
export class EmailTemplateService {
    

    emailTemplate:EmailTemplate;
    public pagination: Pagination;
    isRegularUpload:boolean;
    URL = this.authenticationService.REST_URL;
    MARKETO_URL = this.authenticationService.MARKETO_URL;
    
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
            
            userId = this.authenticationService.checkLoggedInUserId(userId);
            
            var url =this.URL+"admin/listEmailTemplates/"+userId+"?access_token="+this.authenticationService.access_token;
            return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError); 
        }catch(error){
           this.refService.showError(error, "Error in listTemplates() in emailTemplate.service.ts","");
        }
        
    }
    
    listTemplatesForVideo(pagination:Pagination,userId:number,videoId:number){
        console.log(pagination);
        try{
            var url =this.URL+"admin/listEmailTemplates/"+userId+"/"+videoId+"?access_token="+this.authenticationService.access_token;
            return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError); 
        }catch(error){
           this.refService.showError(error, "Error in listTemplatesForVideo() in emailTemplate.service.ts","");
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
    
    getByIdImageUri(id:number,imageUri:String){
        return this.http.post(this.URL+"admin/getEmailTemplateByIdAndImageUri/"+id+"?access_token="+this.authenticationService.access_token+"&imageUri="+imageUri,"")
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
    
    deleteFile(file:ContentManagement){
        return this.http.post(this.URL+"email-template/aws/delete?access_token="+this.authenticationService.access_token,file)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    getAvailableNames(userId:number){
        return this.http.get(this.URL+"admin/listEmailTemplateNames/"+userId+"?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    countPartnerEmailtemplate(userId:number){
        return this.http.get(this.URL+"admin/count-partner-emailtemplate/"+userId+"?access_token="+this.authenticationService.access_token,"")
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    listAwsFiles(pagination:Pagination,userId:number){
        try{
            var url =this.URL+"email-template/aws/list-items/"+userId+"?access_token="+this.authenticationService.access_token;
            return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError); 
        }catch(error){
           this.refService.showError(error, "Error in listAwsFiles() in emailTemplate.service.ts","");
        }
        
    }
 
    
    uploadFile(userId: number, formData: FormData) {
        return this.http.post(this.URL + `email-template/aws/upload/?userId=${userId}&access_token=${this.authenticationService.access_token}`, formData)
            .map(this.extractData)
            .catch(this.handleError);
    }

    checkMarketoCredentials(userId: number) {
        return this.http.get(this.MARKETO_URL + `/marketo/${userId}/checkCredentials?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    checkCustomObjects(userId: number) {
        return this.http.get(this.MARKETO_URL + `/marketo/${userId}/checkCustomObjects?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveMarketoCredentials( formData: any) {
        return this.http.post(this.MARKETO_URL + `/marketo/credentials?access_token=${this.authenticationService.access_token}`, formData)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getMarketoEmailTemplatePreview(userId: number,emailTemplateId:number) {
        return this.http.get(this.MARKETO_URL + `marketo/${userId}/emailtemplate/${emailTemplateId}/content?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getMarketoEmailTemplates(userId: number) {
        return this.http.get(this.MARKETO_URL + `/marketo/${userId}/emailtemplates?access_token=${this.authenticationService.access_token}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    saveMarketoEmailTemplate(emailTemplate:EmailTemplate){
        return this.http.post(this.MARKETO_URL + "/marketo/saveEmailTemplate?access_token="+this.authenticationService.access_token,emailTemplate)
        .map(this.extractData)
        .catch(this.handleError);
    }
    updateMarketoEmailTemplate(emailTemplate:EmailTemplate){
        return this.http.post(this.MARKETO_URL + "/marketo/updateEmailTemplate?access_token="+this.authenticationService.access_token,emailTemplate)
        .map(this.extractData)
        .catch(this.handleError);
    }

    importMarketoEmailTemplates(userId: number,body: any[]): any
    {
        return this.http.post(this.MARKETO_URL + "/marketo/"+userId+"/importEmailTemplates?access_token="+this.authenticationService.access_token,body)
        .map(this.extractData)
        .catch(this.handleError);
    }

    
    
    
    private extractData( res: Response ) {
        let body = res.json();
        console.log( body );
        return body || {};
    }

    private handleError( error: any ) {
        return Observable.throw( error );
    } 
}
