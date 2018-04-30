import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }   from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
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
    public disableButton: boolean = true;
    public htmlText: string;
    public companyLogoUploader: FileUploader;
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
        
        
        this.companyLogoUploader = new FileUploader({
            allowedMimeType: ['application/x-zip-compressed'],
            maxFileSize: 10 * 1024 * 1024, // 100 MB
            url: this.authenticationService.REST_URL + "admin/upload-zip?userId=" + this.loggedInUserId+"&access_token=" + this.authenticationService.access_token
        });
        this.companyLogoUploader.onAfterAddingFile = (fileItem) => {
            console.log(fileItem);
            this.loading = true;
            fileItem.withCredentials = false;
           this.companyLogoUploader.queue[0].upload();
           this.uploadFileErrorMessage = "";
           this.isUploadFileError = false;
        };
        this.companyLogoUploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log(this.companyLogoUploader.queue[0]);
            if($.trim(this.model.templateName).length>0){
                this.isValidTemplateName = true;
                this.disableButton = false;
            }else{
                this.isValidTemplateName = false;
                this.disableButton = true;
            }
            //this.checkAvailableNames(this.model.templateName);
            if (JSON.parse(response).message === null) {
                   this.companyLogoUploader.queue[0].upload(); 
            } else {
               // this.companyLogoUploader.queue.length = 0;
                let path = JSON.parse(response).path;
                if(path!="htmlNotFound"){
                    this.model.content = path;
                    this.isUploaded = true;
                }else{
                    this.companyLogoUploader.queue.length = 0;
                    this.uploadFileErrorMessage = "Html not found in the uploaded zip file.";
                    this.isUploadFileError = true;
                    
                }
               
            }
            this.loading = false;
        }
        
        
        
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
           this.disableButton = true;
        }else{
            this.isValidTemplateName = true;
            this.disableButton = false;
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
            let  extentionsArray = ["html","zip"];
            let maxSize = 1*1024*1024;//10 Mb
            let name = file.name;
            let size = file.size;
            let type = file.type;
            let ext = name.split('.').pop().toLowerCase();
            if ($.inArray(ext, extentionsArray) == -1) {
                this.isUploadFileError = true;
                this.uploadFileErrorMessage = "Please Upload .html and .zip files only";
            }
            if(!this.isUploadFileError){
                let fileSize = (size/ 1024 / 1024); //size in MB
                if (size > maxSize) {
                    this.isUploadFileError = true;
                    this.uploadFileErrorMessage = "Maximum File Size is 10 MB";
                }
            }
            if (ext == "html" && !this.isUploadFileError ) {
                let reader: FileReader = new FileReader();
                reader.onload = ( e ) => {
                    console.log( "Loading The File" )
                    let htmlText: string = reader.result;
                    this.model.content = htmlText;
                    console.log( this.model.content );
                    console.log( "Done with reading file" );
                }
                reader.readAsText( file );
                this.isUploaded = true;
                //this.disable = true;
                $( ".addfiles" ).attr( "style", "float: left; margin-right: 9px;cursor:not-allowed; opacity:0.3" );
            } else if ( ext == "zip" && !this.isUploadFileError ) {
                var formData: FormData = new FormData();
                formData.append( 'file', file, file.name );
               $.each(formData,function(key,pair){
                   console.log(key);
               });
                ;
               
               // let options = new RequestOptions( { headers: headers });
            }
          
        }
        
    }

    /***************Remove File****************/
    removeFile() {
        //this.disable = false;
        this.isUploaded = false;
        $(".addfiles").attr("style", "float: left; margin-right: 9px; opacity:1");
        $('#fileId').val('');
        this.isVideoTagError = false;
        this.isUploadFileError = false;
    }

    checkAvailableNames(value: any) {
        if ($.trim(value).length > 0 ) {
            this.isValidTemplateName = true;
            this.disableButton = false;
            $("#templateName").attr('style','border-left: 5px solid #42A948');
            if(this.availableTemplateNames.length>0){
                if (this.availableTemplateNames.indexOf($.trim(value.toLocaleLowerCase())) > -1) {
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
            this.disableButton = true;
        }
    }
    
    checkName(value:string,isAdd:boolean){
        if(isAdd){
            return this.availableTemplateNames.indexOf($.trim(value.toLocaleLowerCase())) > -1;
        }else{
            return this.availableTemplateNames.indexOf($.trim(value.toLocaleLowerCase())) > -1 && this.emailTemplateService.emailTemplate.name.toLowerCase() != $.trim(value.toLowerCase());
        }
    }

    checkUpdatedAvailableNames(value: any) {
        if (this.availableTemplateNames.indexOf($.trim(value.toLocaleLowerCase())) > -1 && this.emailTemplateService.emailTemplate.name.toLowerCase() != $.trim(value.toLowerCase())) {
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
