import { Component, OnInit, OnDestroy } from '@angular/core';
import {  Router }   from '@angular/router';
import { Logger } from "angular2-logger/core";

import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileDropDirective, FileItem } from 'ng2-file-upload';
import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { User } from '../../core/models/user';
import {EmailTemplate} from '../models/email-template';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
declare var Metronic ,Layout ,Demo,swal ,TableManaged,$:any;

@Component({
    selector: 'app-update-template',
    templateUrl: './update-template.component.html',
    styleUrls: ['./update-template.component.css', './CodeHighlighter.css'],
    providers: [EmailTemplate,HttpRequestLoader]
})
export class UpdateTemplateComponent implements OnInit, OnDestroy {

    public duplicateTemplateName: boolean = false;
    public invalidTemplateName: boolean = false;
    public isPreview: boolean = false;
    public showText: boolean = true;
    public isTemplateName: boolean = false;
    public disable: boolean;
    public htmlText: string;
    model: any = {};
    public availableTemplateNames: Array<string>;
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    
    constructor(private emailTemplateService: EmailTemplateService, private userService: UserService, 
            private router: Router, private emailTemplate: EmailTemplate, private logger: Logger,
            private authenticationService:AuthenticationService,private refService:ReferenceService) {
        logger.debug("updateTemplateComponent() Loaded");
        emailTemplateService.getAvailableNames(this.authenticationService.user.id).subscribe(
            (data: any) => {
                this.availableTemplateNames = data;
            },
            (error: any) => logger.error(error),
            () => logger.debug("Got List Of Available Email Template Names in uploadEmailTemplateComponent constructor")
        );
        if (emailTemplateService.emailTemplate != undefined) {
            this.isPreview = true;
            this.htmlText = emailTemplateService.emailTemplate.body;
            this.model.templateName = emailTemplateService.emailTemplate.name;
           // $('.html').highlightCode('html', this.htmlText);
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


    /******************Show Preview****************/
    showPreview() {
        this.isPreview = true;
        this.htmlText = $('#textarea').text();
        this.showText = true;

    }
    /******************Show HtmlContent****************/
    showHtmlCode() {
        this.isPreview = false;
        this.showText = false;
        $('.html').highlightCode('html', $('#textarea').text());
    }

    checkUpdatedAvailableNames(value: any) {
        if (this.availableTemplateNames.indexOf(value.toLocaleLowerCase()) > -1 && this.emailTemplateService.emailTemplate.name.toLowerCase() != value.toLowerCase()) {
            this.duplicateTemplateName = true;
        } else {
            this.duplicateTemplateName = false;
        }
        if (value.length == 0) {
            this.invalidTemplateName = true;
        } else {
            this.invalidTemplateName = false;
        }
    }
    updateHtmlTemplate() {
        this.emailTemplate.id = this.emailTemplateService.emailTemplate.id;
        this.emailTemplate.name = this.model.templateName;
        this.emailTemplate.body = $('#textarea').text();
        this.emailTemplateService.update(this.emailTemplate)
            .subscribe(
            (data: string) => {
                console.log(data);
                if (data == "success") {
                    this.refService.isUpdated = true;
                    this.router.navigate(["/home/emailtemplate/manageTemplates"]);
                }
            },
            (error: string) => {
                this.logger.error(this.refService.errorPrepender+" listDefaultTemplates():"+error);
                this.refService.showServerError(this.httpRequestLoader);
            },
            () => this.logger.info("Finished updateHtmlTemplate()")
            );

    }
}
