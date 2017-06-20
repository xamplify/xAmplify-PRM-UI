import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }   from '@angular/router';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileDropDirective, FileItem } from 'ng2-file-upload';
import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';
import {EmailTemplate} from '../models/email-template';
import { Logger } from "angular2-logger/core";
import { AuthenticationService } from '../../core/services/authentication.service';
declare var Metronic ,Layout ,Demo,swal ,TableManaged,$:any;

@Component({
    selector: 'app-upload-email-template',
    templateUrl: './upload-email-template.component.html',
    styleUrls: ['./upload-email-template.component.css','../update-template/CodeHighlighter.css'],
    providers: [EmailTemplate]
})
export class UploadEmailTemplateComponent implements OnInit {


    public isDisable: boolean = false;
    loading: boolean = false;

    public duplicateTemplateName: boolean = false;
    public isPreview: boolean = false;
    public isUploaded: boolean = false;
    public showText: boolean = true;
    public isTemplateName: boolean = false;
    public disable: boolean;
    public htmlText: string;
    public uploader: FileUploader;
    model: any = {};
    public availableTemplateNames: Array<string>;
    isFileDrop: boolean;
    isFileProgress: boolean;

    constructor(private emailTemplateService: EmailTemplateService, private userService: UserService, private router: Router, 
            private emailTemplate: EmailTemplate, private logger: Logger,private authenticationService:AuthenticationService) {
        logger.debug("uploadEmailTemplateComponent() Loaded");
        emailTemplateService.getAvailableNames(this.authenticationService.user.id).subscribe(
            (data: any) => {
                this.availableTemplateNames = data;
            },
            (error: any) => console.log(error),
            () => console.log("Got List Of Available Email Template Names in regularEmailsComponent constructor")
        );
        this.uploader = new FileUploader({
            allowedMimeType: ['text/html'],
            maxFileSize: 10 * 1024 * 1024,// 10 MB
        });
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;

        };
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
        //this.emailTemplateService.emailTemplate = new EmailTemplate();
    }



    /****************Reading Uploaded File********************/
    readFile(event: any) {
        console.log(event);
        swal({ title: 'Uploading File', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif", allowOutsideClick: false });
        this.htmlText = "";
        let file: any;
        if (event.srcElement != undefined) {
            file = event.srcElement.files[0];
        } else {
            console.log(event[0]);
            file = event[0];
        }

        let reader: FileReader = new FileReader();
        reader.onload = (e) => {
            let htmlText: string = reader.result;
            this.htmlText = htmlText;
           // $('.html').highlightCode('html', htmlText);
            swal.close();
        }
        reader.readAsText(file);
        this.isUploaded = true;
        this.showText = false;
        this.isPreview = false;
        this.disable = true;
        $(".addfiles").attr("style", "float: left; margin-right: 9px;cursor:not-allowed; opacity:0.3");

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

    }
    /***************Remove File****************/
    removeFile() {
        this.disable = false;
        this.isUploaded = false;
        $(".addfiles").attr("style", "float: left; margin-right: 9px; opacity:1");
    }

    checkAvailableNames(value: any) {
        if (this.availableTemplateNames.indexOf(value.toLocaleLowerCase()) > -1) {
            this.duplicateTemplateName = true;
        } else {
            this.duplicateTemplateName = false;
        }
        if (value.length >= 1) {
            this.isTemplateName = true;
        } else {
            this.isTemplateName = false;
        }
    }

    checkUpdatedAvailableNames(value: any) {
        if (this.availableTemplateNames.indexOf(value.toLocaleLowerCase()) > -1 && this.emailTemplateService.emailTemplate.name.toLowerCase() != value.toLowerCase()) {
            this.duplicateTemplateName = true;
        } else {
            this.duplicateTemplateName = false;
        }
    }


    /************Save Html Template****************/
    saveHtmlTemplate() {
        swal({ title: 'Saving Template', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif", allowOutsideClick: false });
        this.emailTemplate.user = new User();
        this.emailTemplate.user.userId = this.userService.loggedInUserData.id;
        this.emailTemplate.name = this.model.templateName;
        this.emailTemplate.body = $('#textarea').text();
        this.emailTemplate.userDefined = true;
        this.emailTemplate.subject = "assets/images/file_upload_icon.png";
        console.log(this.emailTemplate);
        if (this.emailTemplateService.isRegularUpload) {
            this.emailTemplate.regularTemplate = true;
            this.emailTemplate.desc = "Regular Template";
        } else {
            this.emailTemplate.videoTemplate = true;
            this.emailTemplate.desc = "Video Template";
        }
        this.emailTemplateService.save(this.emailTemplate)
            .subscribe(
            data => {
                console.log(data);
                if (data == "success") {
                    let self = this;
                    swal({
                        title: 'Template Added Successfully',
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        allowOutsideClick: false,
                    }).then(function() {
                        self.router.navigate(["/home/emailtemplate/manageTemplates"]);
                    })
                } else {
                    swal(data, "", "error");
                }
            },
            error => {
                swal(error, "", "error");
            },
            () => console.log("Video Html Template Saved Successfully")
            );
    }


    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        if (this.isFileDrop == false)
            this.hasBaseDropZoneOver = e;
        else {
            this.hasBaseDropZoneOver = false;
        }
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }
}
