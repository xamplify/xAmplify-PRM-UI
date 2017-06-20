import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';
import {EmailTemplate} from '../models/email-template';
import {AuthenticationService} from '../../core/services/authentication.service';
import { Logger } from 'angular2-logger/core';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
declare var Metronic , Layout , Demo, swal , Portfolio: any;

@Component({
  selector: 'app-select-template',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.css'],
  providers :[EmailTemplate,HttpRequestLoader],
})
export class SelectTemplateComponent implements OnInit,OnDestroy {

    public allEmailTemplates : Array<EmailTemplate> = new Array<EmailTemplate>();
    public filteredEmailTemplates  : Array<EmailTemplate> = new Array<EmailTemplate>();
    public templateSearchKey: string = "";
    templateFilter: any = { name: '' };
    errorPrepender:string  = "Error In";
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    
    constructor( private emailTemplateService: EmailTemplateService, private userService: UserService,
        private emailTemplate: EmailTemplate, private router: Router, private authenticationService: AuthenticationService,
        private logger: Logger,private refService:ReferenceService) {

     }
     
    ngOnInit(){
        try{
            Metronic.init();
            Layout.init();
            Demo.init();
            this.listDefaultTemplates();
         }
         catch(error){
             this.logger.error(this.errorPrepender+" ngOnInit():", error);
         }
       }       
    
       listDefaultTemplates(){
          this.refService.loading(this.httpRequestLoader, true);
          this.emailTemplateService.listDefaultTemplates()
           .subscribe(
               (data:any) => {
                   this.allEmailTemplates = data;
                   this.filteredEmailTemplates = data;
                   this.refService.loading(this.httpRequestLoader, false);
               },
               (error:string) => {
                   this.logger.error(this.errorPrepender+" listDefaultTemplates():"+error);
                   this.refService.showServerError(this.httpRequestLoader);
               },
               () =>this.logger.info("Finished listDefaultTemplates()")
           );
       }
       
    
    
    ngOnDestroy() {
        //  this.emailTemplateService.emailTemplate = new EmailTemplate();
    }
    
    showAllTemplates(){
        this.filteredEmailTemplates = new Array<EmailTemplate>();
        this.filteredEmailTemplates=this.allEmailTemplates;
    }
    
    
    showRegularTemplates(){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var isBeeRegularTemplate = this.allEmailTemplates[i].beeRegularTemplate;
                if(isBeeRegularTemplate){
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing Regular Templates size of"+this.filteredEmailTemplates.length);
        }catch(error){
            var cause = "Error in showRegularTemplates() in selectTemplatesComponent";
            this.logger.error(cause+":"+error);
        }
    }
    
    
    showVideoTemplates(){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var isBeeVideoTemplate = this.allEmailTemplates[i].beeVideoTemplate;
                if(isBeeVideoTemplate){
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing Video Templates size of"+this.filteredEmailTemplates.length);
        }catch(error){
            var cause = "Error in showVideoTemplates() in selectTemplatesComponent";
            this.logger.error(cause+":"+error);
        }
    }
    
    showUploadTemplates(){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var name = this.allEmailTemplates[i].name;
                if(name.indexOf("Upload")>-1){
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing Upload Templates size of: "+this.filteredEmailTemplates.length);
            this.logger.debug(this.filteredEmailTemplates);
        }catch(error){
            var cause = "Error in showUploadTemplates() in selectTemplatesComponent";
            this.logger.error(cause+":"+error);
        }
    }
    
    showBasicTemplates(){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var isBeeRegularTemplate = this.allEmailTemplates[i].beeRegularTemplate;
                if(isBeeRegularTemplate){
                    if(this.allEmailTemplates[i].name.indexOf('Basic')>-1){
                        this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                    }
                }
            }
            this.logger.debug("Showing Basic Templates size of"+this.filteredEmailTemplates.length);
        }catch(error){
            var cause = "Error in showBasicTemplates() in selectTemplatesComponent";
            this.logger.error(cause+":"+error);
        }
    }
    
    showRichTemplates(){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var isBeeRegularTemplate = this.allEmailTemplates[i].beeRegularTemplate;
                if(isBeeRegularTemplate){
                    if(this.allEmailTemplates[i].name.indexOf('Rich')>-1){
                        this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                    }
                }
            }
            this.logger.debug("Showing Rich Templates size of"+this.filteredEmailTemplates.length);
        }catch(error){
            var cause = "Error in showRichTemplates() in selectTemplatesComponent";
            this.logger.error(cause+":"+error);
        }
    
    }
    
    showBasicVideoTemplates(){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var isBeeVideoTemplate = this.allEmailTemplates[i].beeVideoTemplate;
                if(isBeeVideoTemplate){
                    if(this.allEmailTemplates[i].name.indexOf('Basic')>-1){
                        this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                    }
                }
            }
            this.logger.debug("Showing Basic Video Templates size of"+this.filteredEmailTemplates.length);
        }catch(error){
            var cause = "Error in showBasicVideoTemplates() in selectTemplatesComponent";
            this.logger.error(cause+":"+error);
        }
    
    }
    
    showRichVideoTemplates(){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var isBeeVideoTemplate = this.allEmailTemplates[i].beeVideoTemplate;
                if(isBeeVideoTemplate){
                    if(this.allEmailTemplates[i].name.indexOf('Rich')>-1){
                        this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                    }
                }
            }
            this.logger.debug("Showing Rich Video Templates size of"+this.filteredEmailTemplates.length);
        }catch(error){
            var cause = "Error in showRichVideoTemplates() in selectTemplatesComponent";
            this.logger.error(cause+":"+error);
        }
    
    
    }
   
    
    showTemplateById(id:number,index:number){
       if(id!=undefined){
           this.emailTemplateService.getById(id)
           .subscribe(
               (data:any) => {
                this.emailTemplateService.emailTemplate = data;
                   this.router.navigate(["/home/emailtemplate/createTemplate"]);
               },
               (error:string) => {
                   this.logger.error(this.errorPrepender+" showTemplateById():"+error);
                   this.refService.showServerError(this.httpRequestLoader);
               },
               () => this.logger.info("Got Email Template")
           );
       }else if(index==17 || index==1){
           //This is normal template
           this.emailTemplateService.isRegularUpload = true;
           this.router.navigate(["/home/emailtemplate/uploadTemplate"]);
       }else if(index==16 || index==0){
           //This is video template
           this.emailTemplateService.isRegularUpload = false;
           this.router.navigate(["/home/emailtemplate/uploadTemplate"]);
       }
    }
    

}
