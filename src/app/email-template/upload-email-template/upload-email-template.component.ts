import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }   from '@angular/router';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileDropDirective, FileItem } from 'ng2-file-upload';
import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';
import {EmailTemplate} from '../models/email-template';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { noWhiteSpaceValidator} from '../../form-validator';
declare var Metronic ,Layout ,Demo,swal ,TableManaged,$,CKEDITOR:any;

@Component({
    selector: 'app-upload-email-template',
    templateUrl: './upload-email-template.component.html',
    styleUrls: ['./upload-email-template.component.css'],
    providers: [EmailTemplate,HttpRequestLoader]
})
export class UploadEmailTemplateComponent implements OnInit {


    public isDisable: boolean = false;
    loading: boolean = false;
    model: any = {};
    public duplicateTemplateName: boolean = false;
    public isPreview: boolean = false;
    public isUploaded: boolean = false;
    public showText: boolean = true;
    public isValidTemplateName: boolean = true;
    public disable: boolean;
    public htmlText: string;
    public uploader: FileUploader;
    public availableTemplateNames: Array<string>;
    isFileDrop: boolean;
    isFileProgress: boolean;
    loggedInUserId:number = 0;
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    isVideoTagError:boolean = false;
    videoTagsError:string = "";
    isUploadFileError:boolean = false;
    uploadFileErrorMessage:string = "";
    videoTag:string = "";
    emailMergeTags:string = "";
    coBrandingTag:string = "";
    constructor(public emailTemplateService: EmailTemplateService, private userService: UserService, private router: Router, 
            private emailTemplate: EmailTemplate, private logger: XtremandLogger,private authenticationService:AuthenticationService,private refService:ReferenceService) {
        logger.debug("uploadEmailTemplateComponent() Loaded");
        this.videoTag = "<a href='<SocialUbuntuURL>'>\n   <img src='<SocialUbuntuImgURL>'/> \n </a> \n";
        this.emailMergeTags = "  For First Name : {{firstName}} \n  For Last Name : {{lastName}} \n  For Full Name : {{fullName}} |n For Email Id : {{emailId}}";
       this.coBrandingTag = "<img src='<Co-BrandingImgURL>'/> \n";
        this.loggedInUserId = this.authenticationService.getUserId();
       
        if(this.emailTemplateService.isRegularUpload==undefined){
            this.router.navigate(["/home/emailtemplates/select"]);
        }
        emailTemplateService.getAvailableNames(this.loggedInUserId).subscribe(
            (data: any) => {
                this.availableTemplateNames = data;
            },
            (error: any) => console.log(error),
            () => console.log("Got List Of Available Email Template Names in regularEmailsComponent constructor")
        );
        this.uploader = new FileUploader({
            allowedMimeType: ['text/html'],
            maxFileSize:  1*1024*1024,// 10 MB
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
            console.log(CKEDITOR.instances);
        } catch (errr) { }
    }


    ngOnDestroy() {
        //this.emailTemplateService.emailTemplate = new EmailTemplate();
    }


    /****************Reading Uploaded File********************/
    readFile(event: any ) {
        var self = this;
        if(this.model.templateName=="undefined" || this.model.templateName==undefined){
           this.isValidTemplateName = false;
        }else{
            this.isValidTemplateName = true;
        }
        this.htmlText = "";
        let file: any;
        if (event.target != undefined) {
            file = event.target.files[0];
        } else {
            file = event[0];
        }
        console.log(event);
        if(file!=undefined){
            this.isUploadFileError = false;
            let  extentionsArray = ["html"];
            console.log(file);
            let maxSize = 1*1024*1024;//1 Mb
            let name = file.name;
            let size = file.size;
            let type = file.type;
            console.log(name+"::::::::::"+size+":::::::::::"+type);
            let ext = name.split('.').pop().toLowerCase();
            if ($.inArray(ext, extentionsArray) == -1) {
                this.isUploadFileError = true;
                this.uploadFileErrorMessage = "Please Upload .html files only";
            }
            let fileSize = (size/ 1024 / 1024); //size in MB
            if (size > maxSize) {
                this.isUploadFileError = true;
                this.uploadFileErrorMessage = "Maximum File Size is 10 MB";
            }
            if(!this.isUploadFileError){
                let reader: FileReader = new FileReader();
                reader.onload = (e) => {
                    console.log("Loading The File")    
                    let htmlText: string = reader.result;
                        this.model.content = htmlText;
                        console.log(this.model.content);
                        console.log("Done with reading file");
                    }
            reader.readAsText(file);
            this.isUploaded = true;
            this.disable = true;
            $(".addfiles").attr("style", "float: left; margin-right: 9px;cursor:not-allowed; opacity:0.3");
            }
        }
        
    }

    /***************Remove File****************/
    removeFile() {
        this.disable = false;
        this.isUploaded = false;
        $(".addfiles").attr("style", "float: left; margin-right: 9px; opacity:1");
        $('#fileId').val('');
    }

    checkAvailableNames(value: any) {
        if (value.trim().length > 0 ) {
            this.isValidTemplateName = true;
            $("#templateName").attr('style','border-left: 5px solid #42A948');
            if(this.availableTemplateNames.length>0){
                if (this.availableTemplateNames.indexOf(value.toLocaleLowerCase().trim()) > -1) {
                    this.duplicateTemplateName = true;
                    $("#templateName").attr('style','border-left: 5px solid #a94442');
                } else {
                    $("#templateName").attr('style','border-left: 5px solid #42A948');
                    this.duplicateTemplateName = false;
                }
            }
        } else {
            $("#templateName").attr('style','border-left: 5px solid #a94442');
            this.isValidTemplateName = false;
        }
    }
    
    checkName(value:string,isAdd:boolean){
        if(isAdd){
            return this.availableTemplateNames.indexOf(value.toLocaleLowerCase().trim()) > -1;
        }else{
            return this.availableTemplateNames.indexOf(value.toLocaleLowerCase().trim()) > -1 && this.emailTemplateService.emailTemplate.name.toLowerCase() != value.toLowerCase().trim();
        }
    }

    checkUpdatedAvailableNames(value: any) {
        if (this.availableTemplateNames.indexOf(value.toLocaleLowerCase().trim()) > -1 && this.emailTemplateService.emailTemplate.name.toLowerCase() != value.toLowerCase().trim()) {
            this.duplicateTemplateName = true;
        } else {
            this.duplicateTemplateName = false;
        }
    }
    

    /************Save Html Template****************/
    saveHtmlTemplate() {
        this.loading = true;
        this.emailTemplate.user = new User();
        this.emailTemplate.user.userId = this.loggedInUserId;
        this.emailTemplate.name = this.model.templateName;
        this.emailTemplate.userDefined = true;
        this.emailTemplate.type = EmailTemplateType.UPLOADED;
        if (this.emailTemplateService.isRegularUpload) {
            this.emailTemplate.regularTemplate = true;
            this.emailTemplate.desc = "Regular Template";
            this.emailTemplate.subject = "assets/images/normal-email-template.png";
        } else {
            this.emailTemplate.videoTemplate = true;
            this.emailTemplate.desc = "Video Template";
            this.emailTemplate.subject = "assets/images/video-email-template.png";
        }
        for(var instanceName in CKEDITOR.instances){
            CKEDITOR.instances[instanceName].updateElement();
            this.emailTemplate.body =  CKEDITOR.instances[instanceName].getData();
        }
        this.emailTemplateService.save(this.emailTemplate)
            .subscribe(
            data => {
                this.loading = false;
                if (data == "success") {
                this.refService.isCreated = true;
                if(CKEDITOR){
                    if(CKEDITOR.instances.editor1){
                        CKEDITOR.instances.editor1.destroy();
                    }
                }
                this.router.navigate(["/home/emailtemplates/manage"]);
                } else{
                    this.isVideoTagError = true;
                    this.videoTagsError = data;
                }
            },
            error => {
               this.loading = false;
               this.logger.errorPage(error);
            },
            () => console.log(" Completed saveHtmlTemplate()")
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
    
    hideDiv(divId:string){
        $('#'+divId).hide(600);
    }
}
