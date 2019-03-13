import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { EmailTemplateService } from '../services/email-template.service';
import { EmailTemplate} from '../models/email-template';
import { AuthenticationService} from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
declare var $: any;
@Component({
  selector: 'app-select-template',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.css'],
  providers :[EmailTemplate,HttpRequestLoader, CampaignAccess],
})
export class SelectTemplateComponent implements OnInit,OnDestroy {

    public allEmailTemplates : Array<EmailTemplate> = new Array<EmailTemplate>();
    public filteredEmailTemplates  : Array<EmailTemplate> = new Array<EmailTemplate>();
    public templateSearchKey: string = "";
    templateFilter: any = { name: '' };
    selectedTemplateTypeIndex:number = 0;
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();

    constructor( private emailTemplateService: EmailTemplateService,
        private emailTemplate: EmailTemplate, private router: Router, private authenticationService: AuthenticationService,
        private logger: XtremandLogger,public refService:ReferenceService,public campaignAccess:CampaignAccess) {

     }
     getOrgCampaignTypes(){
      this.refService.getOrgCampaignTypes( this.refService.companyId).subscribe(
      data=>{
        this.campaignAccess.videoCampaign = data.video;
        this.campaignAccess.emailCampaign = data.regular;
        this.campaignAccess.socialCampaign = data.social;
        this.campaignAccess.eventCampaign = data.event
      });
     }
     getCompanyIdByUserId(){
      try {
        this.refService.getCompanyIdByUserId(this.authenticationService.user.id).subscribe(
          (result: any) => {
            if (result !== "") {
              console.log(result);
              this.refService.companyId = result;
              this.getOrgCampaignTypes();
            }
          }, (error: any) => { console.log(error); }
        );
      } catch (error) { console.log(error);  }
     }
    ngOnInit(){
        try{
           if(!this.refService.companyId){ this.getCompanyIdByUserId()} else { this.getOrgCampaignTypes();}
            this.listDefaultTemplates();
         }
         catch(error){
             this.logger.error(this.refService.errorPrepender+" ngOnInit():", error);
         }
       }

       listDefaultTemplates(){
          this.refService.loading(this.httpRequestLoader, true);
          this.emailTemplateService.listDefaultTemplates()
           .subscribe(
               (data:any) => {
                   if(!this.campaignAccess.eventCampaign){ data = this.hideEventTemplates(data); }
                   this.allEmailTemplates = data;
                   this.filteredEmailTemplates = data;
                   this.refService.loading(this.httpRequestLoader, false);
               },
               (error:string) => {
                   this.logger.error(this.refService.errorPrepender+" listDefaultTemplates():"+error);
                   this.refService.showServerError(this.httpRequestLoader);
               },
               () =>this.logger.info("Finished listDefaultTemplates()")
           );
       }

    hideEventTemplates(data:any){
      const allData = [];
      for(let i=0;i< data.length;i++){  if(!data[i].name.includes('Event')){ allData.push(data[i]); } }
      return allData;
    }

    ngOnDestroy() {
        //  this.emailTemplateService.emailTemplate = new EmailTemplate();
    }

    showAllTemplates(index:number){
        this.filteredEmailTemplates = new Array<EmailTemplate>();
        this.filteredEmailTemplates=this.allEmailTemplates;
        this.selectedTemplateTypeIndex = index;
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

    showEventTemplates(index:number){
        try{
        	 this.selectedTemplateTypeIndex = index;
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var isBeeEventTemplate = this.allEmailTemplates[i].beeEventTemplate;
                if(isBeeEventTemplate){
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing EventTemplates Templates size of"+this.filteredEmailTemplates.length);
        }catch(error){
            var cause = "Error in showEventTemplates() in selectTemplatesComponent";
            this.logger.error(cause+":"+error);
        }
    }

    showEventCoBrandingTemplates(index:number){
        try{
             this.selectedTemplateTypeIndex = index;
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var beeEventCoBrandingTemplate = this.allEmailTemplates[i].beeEventCoBrandingTemplate;
                if(beeEventCoBrandingTemplate){
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing EventTemplates Templates size of"+this.filteredEmailTemplates.length);
        }catch(error){
            var cause = "Error in showEventTemplates() in selectTemplatesComponent";
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

    showUploadTemplates(index:number){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
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

    showBasicTemplates(index:number){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
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

    showRichTemplates(index:number){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            for(var i=0;i< this.allEmailTemplates.length;i++){
                var isBeeRegularTemplate = this.allEmailTemplates[i].beeRegularTemplate;
                if(isBeeRegularTemplate){
                    /*if(this.allEmailTemplates[i].name.indexOf('Rich')>-1){
                        this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                    }*/
                    if(this.allEmailTemplates[i].id === 325 || this.allEmailTemplates[i].id === 307 || this.allEmailTemplates[i].id === 359 || this.allEmailTemplates[i].id === 360){
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

    showBasicVideoTemplates(index:number){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
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

    showRichVideoTemplates(index:number){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            for(var i=0;i< this.allEmailTemplates.length;i++){
                var isBeeVideoTemplate = this.allEmailTemplates[i].beeVideoTemplate;
                if(isBeeVideoTemplate){
                    /*if(this.allEmailTemplates[i].name.indexOf('Rich')>-1){
                        this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                    }*/
                    if(this.allEmailTemplates[i].id === 362 || this.allEmailTemplates[i].id === 369 || this.allEmailTemplates[i].id === 356 || this.allEmailTemplates[i].id === 365){
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

    showRegularCoBrandingTemplates(index:number){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            console.log(this.allEmailTemplates);
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var isRegularCoBrandingTemplate = this.allEmailTemplates[i].regularCoBrandingTemplate;
                if(isRegularCoBrandingTemplate){
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing showRegularCoBrandingTemplates size of"+this.filteredEmailTemplates.length);
        }catch(error){
            var cause = "Error in showRegularCoBrandingTemplates() in selectTemplatesComponent";
            this.logger.error(cause+":"+error);
        }
    }

    showVideoCoBrandingTemplates(index:number){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var isVideoCoBrandingTemplate = this.allEmailTemplates[i].videoCoBrandingTemplate;
                if(isVideoCoBrandingTemplate){
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing showVideoCoBrandingTemplates size of"+this.filteredEmailTemplates.length);
        }catch(error){
            var cause = "Error in showVideoCoBrandingTemplates() in selectTemplatesComponent";
            this.logger.error(cause+":"+error);
        }
    }

    showCampaignDefaultTemplates(index:number){
        try{
            this.filteredEmailTemplates = new Array<EmailTemplate>();
            this.selectedTemplateTypeIndex = index;
            for(var i=0;i<this.allEmailTemplates.length;i++){
                var isCampaignDefault = this.allEmailTemplates[i].campaignDefault;
                if(isCampaignDefault){
                    this.filteredEmailTemplates.push(this.allEmailTemplates[i]);
                }
            }
            this.logger.debug("Showing showCampaignDefaultTemplates size of"+this.filteredEmailTemplates.length);
        }catch(error){
            var cause = "Error in showCampaignDefaultTemplates() in selectTemplatesComponent";
            this.logger.error(cause+":"+error);
        }
    }


    showTemplateById(id:number,index:number){
        if(id!=undefined){
           this.emailTemplateService.getById(id)
           .subscribe(
               (data:any) => {
                if(this.refService.companyProfileImage!=undefined){
                    data.jsonBody = data.jsonBody.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.refService.companyProfileImage);
                }
                this.emailTemplateService.emailTemplate = data;
                   this.router.navigate(["/home/emailtemplates/create"]);
               },
               (error:string) => {
                   this.logger.error(this.refService.errorPrepender+" showTemplateById():"+error);
                   this.refService.showServerError(this.httpRequestLoader);
               },
               () => this.logger.info("Got Email Template")
           );
       }else if(index==14 || index==1){
           //This is normal template
           this.emailTemplateService.isRegularUpload = true;
           this.router.navigate(["/home/emailtemplates/upload"]);
       }else if(index==13 || index==0){
           //This is video template
           this.emailTemplateService.isRegularUpload = false;
           this.router.navigate(["/home/emailtemplates/upload"]);
       }
    }

    showPreview(emailTemplate:EmailTemplate){
         let body = emailTemplate.body;
         let emailTemplateName = emailTemplate.name;
         if(emailTemplateName.length>50){
             emailTemplateName = emailTemplateName.substring(0, 50)+"...";
         }
         $("#htmlContent").empty();
         $("#email-template-title").empty();
         $("#email-template-title").append(emailTemplateName);
         $('#email-template-title').prop('title',emailTemplate.name);
         $("#htmlContent").append(body);
         $('.modal .modal-body').css('overflow-y', 'auto');
        // $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
         $("#show_email_template_preivew").modal('show');
     }


}
