import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';
import {EmailTemplate} from '../models/email-template';
import {AuthenticationService} from '../../core/services/authentication.service';
import { Logger } from 'angular2-logger/core';
declare var Metronic , Layout , Demo, swal , Portfolio: any;

@Component({
  selector: 'app-select-template',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.css'],
  providers :[EmailTemplate],
})
export class SelectTemplateComponent implements OnInit,OnDestroy {

    public allEmailTemplates : Array<EmailTemplate> = new Array<EmailTemplate>();
    public filteredEmailTemplates  : Array<EmailTemplate> = new Array<EmailTemplate>();
    public templateSearchKey: string = "";
    templateFilter: any = { name: '' };
    constructor(private emailTemplateService:EmailTemplateService, private userService: UserService,
    		private emailTemplate:EmailTemplate,private router:Router,private authenticationService:AuthenticationService,
    		private logger:Logger) {
  
     }
     
    ngOnInit(){
        try{
            Metronic.init();
            Layout.init();
            Demo.init();
            //Portfolio.init();
            this.listDefaultTemplates();
         }
         catch(error){
             let errorMessage = "Error In ngOnInit() In  selectTemplatesComponent";
             this.logger.error(errorMessage, error);
             swal(error.toString(),errorMessage,"error");
         
         }
       }       
    
       listDefaultTemplates(){
           swal( { title: 'Loading Templates', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif",allowOutsideClick: false  });
           this.emailTemplateService.listDefaultTemplates()
           .subscribe(
               (data:any) => {
                   this.allEmailTemplates = data;
                   this.filteredEmailTemplates = data;
                   swal.close();
               },
               (error:string) => {
                   var cause = "Error In listDefaultTemplates() in selectTemplatesComponent";
                   swal(error.toString(),cause,"error");
                   this.logger.error(cause+":"+error);
               },
               () =>this.logger.debug("Got List Of Default Templates From listDefaultTemplates() in selectTemplatesComponent",this.allEmailTemplates)
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
            swal(error.toString(),cause,"error");
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
            swal(error.toString(),cause,"error");
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
        }catch(error){
            var cause = "Error in showUploadTemplates() in selectTemplatesComponent";
            swal(error.toString(),cause,"error");
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
            swal(error.toString(),cause,"error");
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
            swal(error.toString(),cause,"error");
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
            swal(error.toString(),cause,"error");
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
            swal(error.toString(),cause,"error");
            this.logger.error(cause+":"+error);
        }
    
    
    }
   
    
    showTemplateById(id:number,index:number){
        if(index==17){
            this.emailTemplateService.isRegularUpload = true;
            this.router.navigate(["/home/emailtemplate/uploadTemplate"]);
        }else if(index==16){
            this.emailTemplateService.isRegularUpload = false;
            this.router.navigate(["/home/emailtemplate/uploadTemplate"]);
        }else{
            this.emailTemplateService.getById(id)
            .subscribe(
                (data:any) => {
                 this.emailTemplateService.emailTemplate = data;
                    this.router.navigate(["/home/emailtemplate/createTemplate"]);
                },
                (error:any) => {
                    swal(error,"","error");
                },
                () => console.log("Got Email Template")
            );
        }
    }
    

}
