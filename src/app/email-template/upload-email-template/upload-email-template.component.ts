import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';
import { EmailTemplate } from '../models/email-template';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { CustomResponse } from '../../common/models/custom-response';
declare var Metronic, Layout, Demo, TableManaged, $, CKEDITOR, swal: any;

@Component( {
    selector: 'app-upload-email-template',
    templateUrl: './upload-email-template.component.html',
    styleUrls: ['./upload-email-template.component.css'],
    providers: [EmailTemplate, HttpRequestLoader, CallActionSwitch]
} )
export class UploadEmailTemplateComponent implements OnInit, OnDestroy {

    customResponse: CustomResponse = new CustomResponse();
    public isDisable: boolean = false;
    model: any = {};
    public duplicateTemplateName: boolean = false;
    public isPreview: boolean = false;
    public isUploaded: boolean = false;
    public showText: boolean = true;
    public isValidTemplateName: boolean = true;
    public disableButton: boolean = true;
    public htmlText: string;
    public emailTemplateUploader: FileUploader;
    public availableTemplateNames: Array<string>;
    isFileDrop: boolean;
    isFileProgress: boolean;
    loggedInUserId: number = 0;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    isVideoTagError: boolean = false;
    videoTagsError: string = "";
    isUploadFileError: boolean = false;
    uploadFileErrorMessage: string = "";
    maxFileSize: number = 10;
    name = 'ng2-ckeditor';
    ckeConfig: any;
    mycontent: string;
    log: string = '';
    clickedButtonName: string = "";
    saveButtonName: string = "SAVE";
    coBrandingLogo: boolean = false;
    @ViewChild( "myckeditor" ) ckeditor: any;
    categoryNames: any;
    constructor( public emailTemplateService: EmailTemplateService, private userService: UserService, private router: Router,
        private emailTemplate: EmailTemplate, private logger: XtremandLogger, private authenticationService: AuthenticationService, public refService: ReferenceService,
        public callActionSwitch: CallActionSwitch ) {
        logger.debug( "uploadEmailTemplateComponent() Loaded" );

        this.loggedInUserId = this.authenticationService.getUserId();

        if ( this.emailTemplateService.isRegularUpload == undefined ) {
            this.router.navigate( ["/home/emailtemplates/select"] );
        }
        emailTemplateService.getAvailableNames( this.loggedInUserId ).subscribe(
            ( data: any ) => {
                this.availableTemplateNames = data;
            },
            ( error: any ) => console.log( error ),
            () => console.log( "Got List Of Available Email Template Names in regularEmailsComponent constructor" )
        );


        this.emailTemplateUploader = new FileUploader( {
            //  allowedMimeType: ['application/x-zip-compressed'],
            maxFileSize: this.maxFileSize * 1024 * 1024,
            url: this.authenticationService.REST_URL + "admin/upload-zip?userId=" + this.loggedInUserId + "&access_token=" + this.authenticationService.access_token
        } );
        this.emailTemplateUploader.onAfterAddingFile = ( fileItem ) => {
            this.refService.startLoader( this.httpRequestLoader );
            fileItem.withCredentials = false;
            this.emailTemplateUploader.queue[0].upload();
            this.uploadFileErrorMessage = "";
            this.customResponse.isVisible = false;
        };
        this.emailTemplateUploader.onCompleteItem = ( item: any, response: any, status: any, headers: any ) => {
            if ( $.trim( this.model.templateName ).length > 0 ) {
                this.isValidTemplateName = true;
                this.disableButton = false;
            } else {
                this.isValidTemplateName = false;
                this.disableButton = true;
            }
            //this.checkAvailableNames(this.model.templateName);
            if ( JSON.parse( response ).message === null ) {
                this.emailTemplateUploader.queue[0].upload();
            } else {
                // this.emailTemplateUploader.queue.length = 0;
                let path = JSON.parse( response ).path;
                if ( path != "Html not found in the uploaded zip file." && path != "Zip file contains more than one html file" ) {
                    this.isUploaded = true;
                    this.mycontent = path;
                } else {
                    this.emailTemplateUploader.queue.length = 0;
                    this.customResponse = new CustomResponse( 'ERROR', path, true );
                }

            }
            this.refService.stopLoader( this.httpRequestLoader );
        }

    }
    /****************Reading Uploaded File********************/
    fileDropPreview( event: any ) {

    }
    /***************Remove File****************/
    removeFile() {
        //this.disable = false;
        this.isUploaded = false;
        $( ".addfiles" ).attr( "style", "float: left; margin-right: 9px; opacity:1" );
        $( '#upload-file' ).val( '' );
        this.isVideoTagError = false;
        this.isUploadFileError = false;
        this.customResponse.isVisible = false;
    }
    dropClick(){
      $('#file-upload').click();
    }
    checkAvailableNames( value: any ) {
        if ( $.trim( value ).length > 0 ) {
            this.isValidTemplateName = true;
            this.disableButton = false;
            $( "#templateName" ).attr( 'style', 'border-left: 1px solid #42A948' );
            if ( this.availableTemplateNames.length > 0 ) {
                if ( this.availableTemplateNames.indexOf( $.trim( value.toLocaleLowerCase() ) ) > -1 ) {
                    this.duplicateTemplateName = true;
                    $( "#templateName" ).attr( 'style', 'border-left: 1px solid #a94442' );
                } else {
                    $( "#templateName" ).attr( 'style', 'border-left: 1px solid #42A948' );
                    this.duplicateTemplateName = false;
                }
            }
        } else {
            $( "#templateName" ).attr( 'style', 'border-left: 1px solid #a94442' );
            this.isValidTemplateName = false;
            this.disableButton = true;
        }
    }

    checkName( value: string, isAdd: boolean ) {
        if ( isAdd ) {
            return this.availableTemplateNames.indexOf( $.trim( value.toLocaleLowerCase() ) ) > -1;
        } else {
            return this.availableTemplateNames.indexOf( $.trim( value.toLocaleLowerCase() ) ) > -1 && this.emailTemplateService.emailTemplate.name.toLowerCase() != $.trim( value.toLowerCase() );
        }
    }

    checkUpdatedAvailableNames( value: any ) {
        if ( this.availableTemplateNames.indexOf( $.trim( value.toLocaleLowerCase() ) ) > -1 && this.emailTemplateService.emailTemplate.name.toLowerCase() != $.trim( value.toLowerCase() ) ) {
            this.duplicateTemplateName = true;
        } else {
            this.duplicateTemplateName = false;
        }
    }

    save() {
        this.clickedButtonName = this.saveButtonName;
        this.saveHtmlTemplate( false,null);
    }

    /************Save Html Template****************/
    saveHtmlTemplate( isOnDestroy: boolean,ckEditorBody:any) {
        this.customResponse.isVisible = false;
        this.refService.startLoader( this.httpRequestLoader );
        this.emailTemplate.user = new User();
        this.emailTemplate.user.userId = this.loggedInUserId;
        this.emailTemplate.name = this.model.templateName;
        this.emailTemplate.userDefined = true;
        this.emailTemplate.type = EmailTemplateType.UPLOADED;
        this.emailTemplate.onDestroy = isOnDestroy;
        this.emailTemplate.draft = isOnDestroy;
        if ( this.emailTemplateService.isRegularUpload ) {
            this.emailTemplate.regularTemplate = true;
            this.emailTemplate.desc = "Regular Template";
            this.emailTemplate.subject = "assets/images/normal-email-template.png";
            this.emailTemplate.regularCoBrandingTemplate = this.coBrandingLogo;
        } else {
            this.emailTemplate.videoTemplate = true;
            this.emailTemplate.desc = "Video Template";
            this.emailTemplate.subject = "assets/images/video-email-template.png";
            this.emailTemplate.videoCoBrandingTemplate = this.coBrandingLogo;
        }
        if(isOnDestroy){
            this.emailTemplate.body = ckEditorBody;
        }else{
            for ( var instanceName in CKEDITOR.instances ) {
                CKEDITOR.instances[instanceName].updateElement();
                this.emailTemplate.body = CKEDITOR.instances[instanceName].getData();
            }
        }
        if ( $.trim( this.emailTemplate.body ).length > 0 ) {
            this.emailTemplateService.save( this.emailTemplate )
                .subscribe(
                data => {
                    if(data.access){
                        this.refService.stopLoader( this.httpRequestLoader );
                        if ( !isOnDestroy ) {
                            if ( data.statusCode == 702 ) {
                                this.refService.isCreated = true;
                                this.router.navigate( ["/home/emailtemplates/manage"] );
                            } else {
                                this.customResponse = new CustomResponse( "ERROR", data.message, true );
                            }
                        }else{
                            this.emailTemplateService.goToManage();
                        }
                    }else{
                        this.authenticationService.forceToLogout();
                    }

                    
                },
                error => {
                    this.refService.stopLoader( this.httpRequestLoader );
                    this.logger.errorPage( error );
                },
                () => console.log( " Completed saveHtmlTemplate()" )
                );
        }

    }


    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase( e: any ): void {
        if ( this.isFileDrop == false )
            this.hasBaseDropZoneOver = e;
        else {
            this.hasBaseDropZoneOver = false;
        }
    }

    public fileOverAnother( e: any ): void {
        this.hasAnotherDropZoneOver = e;
    }

    hideDiv( divId: string ) {
        $( '#' + divId ).hide( 600 );
    }

    changeLogo( event: any ) {
        this.customResponse.isVisible = false;
        let fileList: any;
        if ( event.target != undefined ) {
            fileList = event.target.files[0];
        } else {
            fileList = event[0];
        }
        if ( fileList != undefined ) {
            let maxSize = this.maxFileSize * 1024 * 1024;
            let size = fileList.size;
            let ext = fileList.name.split( '.' ).pop().toLowerCase();
            let extentionsArray = ['zip'];
            if ( $.inArray( ext, extentionsArray ) == -1 ) {
                this.refService.goToTop();
                this.customResponse = new CustomResponse( 'ERROR', "Please upload .zip files only", true );
                $( '#upload-file' ).val( '' );
            } else {
                let fileSize = ( size / 1024 / 1024 ); //size in MB
                if ( size > maxSize ) {
                    this.refService.goToTop();
                    this.customResponse = new CustomResponse( 'ERROR', "Max size is 10 MB", true );
                    $( '#upload-file' ).val( '' );
                }
            }
        }

    }


    ngOnInit() {
        try {
            Metronic.init();
            Layout.init();
            Demo.init();
            TableManaged.init();
            this.ckeConfig = {
                allowedContent: true,
            };
            this.getCategories();
        } catch ( errr ) { }
    }




    setCoBrandingLogo( event ) {
        this.coBrandingLogo = event;
        let body = this.getCkEditorData();
        if ( event ) {
            if ( body.indexOf( this.refService.coBrandingImageTag ) < 0 ) {
                this.mycontent = this.refService.coBrandingTag.concat( this.mycontent );
            }
        } else {
            this.mycontent = this.mycontent.replace( this.refService.coBrandingImageTag, "" ).
                replace( "<p>< /></p>", "" ).
                replace( "< />", "" ).replace( "<p>&lt;&gt;</p>", "" ).replace( "<>", "" );
        }

    }

    getCkEditorData() {
        let body = "";
        for ( var instanceName in CKEDITOR.instances ) {
            CKEDITOR.instances[instanceName].updateElement();
            body = CKEDITOR.instances[instanceName].getData();
        }
        return body;
    }


    showSweetAlert(body:any) {
        let self = this;
        swal( {
            title: 'Are you sure?',
            text: "You have unchanged data",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#54a7e9',
            cancelButtonColor: '#999',
            confirmButtonText: 'Yes, Save it!',
            cancelButtonText: "No",
            allowOutsideClick: false
        } ).then(function() {
            self.saveHtmlTemplate( true,body );
        }, function( dismiss ) {

        } );
    }


  ngOnDestroy() {
        let body = this.getCkEditorData();
        let isDraftMode = this.clickedButtonName != this.saveButtonName;
        if (isDraftMode && $.trim(body).length>0) {
           this.showSweetAlert(body);
        }
    }

    getCategories(){
        this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId ).subscribe(
            ( data: any ) => {
                this.categoryNames = data.data;
            },
            error => { this.logger.error( "error in getCategoryNamesByUserId(" + this.loggedInUserId + ")", error ); },
            () => this.logger.info( "Finished getCategoryNamesByUserId()" ) );
    }


}
