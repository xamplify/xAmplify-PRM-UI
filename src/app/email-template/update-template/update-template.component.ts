import { Component, OnInit, OnDestroy } from '@angular/core';
import {  Router }   from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileDropDirective, FileItem } from 'ng2-file-upload';
import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { User } from '../../core/models/user';
import {EmailTemplate} from '../models/email-template';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
declare var Metronic ,Layout ,Demo,swal ,TableManaged,$,CKEDITOR:any;

@Component({
    selector: 'app-update-template',
    templateUrl: './update-template.component.html',
    styleUrls: ['./update-template.component.css'],
    providers: [EmailTemplate,HttpRequestLoader]
})
export class UpdateTemplateComponent implements OnInit, OnDestroy {

    public duplicateTemplateName: boolean = false;
    public invalidTemplateName: boolean = false;
    public isTemplateName: boolean = false;
    public disable: boolean;
    model: any = {};
    public availableTemplateNames: Array<string>;
    videoTag:string = "";
    isVideoTagError:boolean = false;
    videoTagsError:string = "";
    emailOpenTrackingUrl:string = "<div id=\"bottomDiv\"><img src=\"<emailOpenImgURL>\" class='backup_picture' style='display:none'></div>";
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    constructor(private emailTemplateService: EmailTemplateService, private userService: UserService,
            private router: Router, private emailTemplate: EmailTemplate, private logger: XtremandLogger,
            private authenticationService:AuthenticationService,public refService:ReferenceService) {
        logger.debug("updateTemplateComponent() Loaded");
        if(this.emailTemplateService.emailTemplate==undefined){
            this.router.navigate(["/home/emailtemplates/select"]);
        }
        emailTemplateService.getAvailableNames(this.authenticationService.getUserId()).subscribe(
            (data: any) => {
                this.availableTemplateNames = data;
            },
            (error: any) => logger.error(error),
            () => logger.debug("Got List Of Available Email Template Names in uploadEmailTemplateComponent constructor")
        );
        this.videoTag = "<a href='<SocialUbuntuURL>'>\n   <img src='<SocialUbuntuImgURL>'/> \n </a> \n";
        if (emailTemplateService.emailTemplate != undefined) {
            let body  = emailTemplateService.emailTemplate.body.replace(this.emailOpenTrackingUrl,"");
            this.model.content = body;
            this.model.templateName = emailTemplateService.emailTemplate.name;
        }

    }

    ngOnInit() {
        try {
            Metronic.init();
            Layout.init();
            Demo.init();
            TableManaged.init();
        } catch (errr) { }
    }


    ngOnDestroy() {
        this.emailTemplateService.emailTemplate = new EmailTemplate();
    }

    checkUpdatedAvailableNames(value: any) {
        if (value.trim().length > 0 ) {
            this.invalidTemplateName = false;
             $("#templateName").attr('style','border-left: 5px solid #42A948');
                if(this.availableTemplateNames.indexOf(value.toLocaleLowerCase().trim()) > -1 && this.emailTemplateService.emailTemplate.name.toLowerCase() != value.toLowerCase().trim()){
                    this.duplicateTemplateName = true;
                    $("#templateName").attr('style','border-left: 5px solid #a94442');
                }else{
                    $("#templateName").attr('style','border-left: 5px solid #42A948');
                    this.duplicateTemplateName = false;
                }
        } else {
            $("#templateName").attr('style','border-left: 5px solid #a94442');
            this.invalidTemplateName = true;
        }
    }
    updateHtmlTemplate() {
       this.refService.startLoader(this.httpRequestLoader);
        this.emailTemplate.id = this.emailTemplateService.emailTemplate.id;
        this.emailTemplate.name = this.model.templateName;
        for(var instanceName in CKEDITOR.instances){
            CKEDITOR.instances[instanceName].updateElement();
            this.emailTemplate.body =  CKEDITOR.instances[instanceName].getData();
        }
        this.emailTemplateService.update(this.emailTemplate)
            .subscribe(
            (data: string) => {
                this.refService.stopLoader(this.httpRequestLoader);
                if (data == "success") {
                    this.refService.isUpdated = true;
                    this.router.navigate(["/home/emailtemplates/manage"]);
                    } else{
                        this.isVideoTagError = true;
                        this.videoTagsError = data;
                    }
            },
            (error: string) => {
                this.refService.stopLoader(this.httpRequestLoader);
                this.logger.errorPage(error);
            },
            () => this.logger.info("Finished updateHtmlTemplate()")
            );

    }
}
