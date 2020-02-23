import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { EmailTemplate} from '../models/email-template';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { User } from '../../core/models/user';
import { EmailTemplateSource } from '../../email-template/models/email-template-source';

declare var Metronic ,Layout ,Demo ,TableManaged,$,CKEDITOR,swal:any;

@Component({
    selector: 'app-update-template',
    templateUrl: './update-template.component.html',
    styleUrls: ['./update-template.component.css'],
    providers: [EmailTemplate,HttpRequestLoader,CallActionSwitch]
})
export class UpdateTemplateComponent implements OnInit, OnDestroy {

    public duplicateTemplateName: boolean = false;
    public invalidTemplateName: boolean = false;
    public isTemplateName: boolean = false;
    public disable: boolean;
    model: any = {};
    public availableTemplateNames: Array<string>;
    isVideoTagError:boolean = false;
    videoTagsError:string = "";
    emailOpenTrackingUrl:string = "<div id=\"bottomDiv\"><img src=\"<emailOpenImgURL>\" class='backup_picture' style='display:none'></div>";
    clickedButtonName:string = "";
    updateButton:string = "UPDATE";
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    isValidType: boolean;
    coBrandingLogo: boolean = false;
    mycontent: string;
    emailTemplateTypes = ["VIDEO","REGULAR"];
    loggedInUserId = 0;
    showDropDown = false;
    constructor(public emailTemplateService: EmailTemplateService, private userService: UserService,
            private router: Router, private emailTemplate: EmailTemplate, private logger: XtremandLogger,
            private authenticationService:AuthenticationService,public refService:ReferenceService,
            public callActionSwitch: CallActionSwitch) {
        logger.debug("updateTemplateComponent() Loaded");
        CKEDITOR.config.allowedContent = true;
        this.loggedInUserId = this.authenticationService.getUserId();
        if(this.emailTemplateService.emailTemplate == undefined){
            this.router.navigate(["/home/emailtemplates/manage"]);
        }
       this.listAvailableNames();
        this.model.isRegularUpload =0;
        if (emailTemplateService.emailTemplate != undefined) {
            let body  = emailTemplateService.emailTemplate.body.replace(this.emailOpenTrackingUrl,"");
            this.model.content = body;
            this.isValidType = true;
            this.model.draft = emailTemplateService.emailTemplate.draft;
            this.mycontent = this.model.content;
            this.model.templateName = emailTemplateService.emailTemplate.name;
            if(emailTemplateService.emailTemplate.source.toString()!="MANUAL"){
                if(this.model.draft){
                    this.showDropDown = true;
                    this.model.uploadType = "REGULAR";
                }
            }
        }

    }
    
    listAvailableNames(){
       this.emailTemplateService.getAvailableNames(this.authenticationService.getUserId()).subscribe(
                (data: any) => {
                    this.availableTemplateNames = data;
                },
                (error: any) => this.logger.error(error),
                () => this.logger.debug("Got List Of Available Email Template Names in uploadEmailTemplateComponent constructor")
            );
    }


    checkUpdatedAvailableNames(value: any) {
        if (value.trim().length > 0 ) {
            this.invalidTemplateName = false;
             $("#templateName").attr('style','border-left: 1px solid #42A948');
                if(this.availableTemplateNames.indexOf(value.toLocaleLowerCase().trim()) > -1 && this.emailTemplateService.emailTemplate.name.toLowerCase() != value.toLowerCase().trim()){
                    this.duplicateTemplateName = true;
                    $("#templateName").attr('style','border-left: 1px solid #a94442');
                }else{
                    $("#templateName").attr('style','border-left: 1px solid #42A948');
                    this.duplicateTemplateName = false;
                }
        } else {
            $("#templateName").attr('style','border-left: 1px solid #a94442');
            this.invalidTemplateName = true;
        }
    }
    validateType(){
        let fieldValue= $("#isRegularUpload").val();

        if (fieldValue !=null && fieldValue != undefined &&  fieldValue.length > 0 && fieldValue!= "Select Type")
        {

          this.isValidType = true;

          $("#isRegularUpload").attr('style', 'border-left: 1px solid #42A948');
        } else
        {

          this.isValidType = false;

          $("#isRegularUpload").attr('style', 'border-left: 1px solid #a94442');

        }

      }


    update(){
        this.clickedButtonName = this.updateButton;
        this.updateHtmlTemplate(false,null);
    }

    updateHtmlTemplate(isOnDestroy:boolean,ckEditorBody:any) {
       this.refService.startLoader(this.httpRequestLoader);
        this.emailTemplate.id = this.emailTemplateService.emailTemplate.id;
        this.emailTemplate.name = this.model.templateName;
        this.emailTemplate.createdBy = this.emailTemplateService.emailTemplate.createdBy;
        this.emailTemplate.onDestroy = isOnDestroy;
        this.emailTemplate.draft = isOnDestroy;
        if(this.showDropDown){
            if(this.model.uploadType=="REGULAR"){
                this.emailTemplate.regularTemplate = true;
                this.emailTemplate.desc = "Regular Template";
                this.emailTemplate.subject = "assets/images/normal-email-template.png";
                this.emailTemplate.regularCoBrandingTemplate = this.coBrandingLogo;
            }else if(this.model.uploadType=="VIDEO"){
                this.emailTemplate.videoTemplate = true;
                this.emailTemplate.desc = "Video Template";
                this.emailTemplate.subject = "assets/images/video-email-template.png";
                this.emailTemplate.videoCoBrandingTemplate = this.coBrandingLogo;
            }
        }
        if(isOnDestroy){
            this.emailTemplate.body = ckEditorBody;
        }else{
            for(var instanceName in CKEDITOR.instances){
                CKEDITOR.instances[instanceName].updateElement();
                this.emailTemplate.body =  CKEDITOR.instances[instanceName].getData();
            }
        }
        if($.trim(this.emailTemplate.body).length>0){
            this.emailTemplate.user = new User();
            this.emailTemplate.user.userId = this.loggedInUserId;
            if(this.emailTemplateService.emailTemplate.source.toString()=="MARKETO"){
                if(!this.showDropDown){
                 
                 this.emailTemplate.regularTemplate = this.emailTemplateService.emailTemplate.regularTemplate;
                 this.emailTemplate.regularCoBrandingTemplate = this.coBrandingLogo;
                 this.emailTemplate.videoTemplate = this.emailTemplateService.emailTemplate.videoTemplate;
                 this.emailTemplate.videoCoBrandingTemplate = this.coBrandingLogo;
                }
                this.emailTemplate.subject= this.emailTemplateService.emailTemplate.subject;
                this.updateMarketoTemplate(isOnDestroy);
            }else{
                this.updateCustomTemplate(isOnDestroy);
            }
            
        }
    }
    
    updateCustomTemplate(isOnDestroy){
        this.emailTemplateService.update(this.emailTemplate)
        .subscribe(
        (data: any) => {
            this.refService.stopLoader(this.httpRequestLoader);
            if(!isOnDestroy){
                if(data.statusCode==703){
                    this.refService.isUpdated = true;
                    this.emailTemplateService.emailTemplate = new EmailTemplate();
                    this.router.navigate(["/home/emailtemplates/manage"]);
                }else{
                    this.clickedButtonName = "";
                    this.isVideoTagError = true;
                    this.videoTagsError = data.message;
                }
            }else{
                this.emailTemplateService.goToManage();
            }

        },
        (error: string) => {
            this.refService.stopLoader(this.httpRequestLoader);
            this.logger.errorPage(error);
        },
        () => this.logger.info("Finished updateHtmlTemplate()")
        );
    }
    
    
    updateMarketoTemplate( isOnDestroy ) {
        this.emailTemplateService.updateMarketoEmailTemplate( this.emailTemplate )
            .subscribe(
            ( data: any ) => {
                this.refService.stopLoader( this.httpRequestLoader );
                if ( !isOnDestroy ) {
                    if ( data.statusCode == 8013 ) {
                        this.refService.isUpdated = true;
                        this.emailTemplateService.emailTemplate = new EmailTemplate();
                        this.router.navigate( ["/home/emailtemplates/manage"] );
                    } else {
                        this.clickedButtonName = "";
                        this.isVideoTagError = true;
                        this.videoTagsError = data.message;
                    }
                }
            },
            ( error: string ) => {
                this.refService.stopLoader( this.httpRequestLoader );
                this.logger.errorPage( error );
            },
            () => this.logger.info( "Finished updateHtmlTemplate()" )
            );

    }
    
    setCoBrandingLogo(event){
      this.coBrandingLogo = event;
      let body = this.getCkEditorData();
      if (event){
        if (body.indexOf(this.refService.coBrandingImageTag) < 0){
            this.model.content = this.refService.coBrandingTag.concat(this.model.content);
        }
      } else{
        this.model.content = this.model.content.replace(this.refService.coBrandingImageTag, "").
          replace("<p>< /></p>", "").
          replace("< />", "").replace("<p>&lt;&gt;</p>", "").replace("<>", "");
      }
    }
    getCkEditorData()
    {
      let body = "";
      for (var instanceName in CKEDITOR.instances)
      {
        CKEDITOR.instances[instanceName].updateElement();
        body = CKEDITOR.instances[instanceName].getData();
      }
      return body;
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
        let body = this.getCkEditorData();
        if(this.emailTemplateService.emailTemplate != undefined && this.clickedButtonName!=this.updateButton && $.trim(body).length>0){
            this.showSweetAlert(body);
        }
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
            self.updateHtmlTemplate( true,body);
        }, function( dismiss ) {

        } );
    }
    
    copyLink(inputElement,id){
        $('#'+id).hide();
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        $('#'+id).show(500);
    }
    
    selectUploadType(event:any){
        let body = this.getCkEditorData();
        if (event == 'VIDEO') {
          if (body.indexOf(this.refService.videoSrcTag) < 0) {
              this.model.content = this.refService.videoTag.concat(this.model.content);
          }
        } else {
            this.model.content = this.model.content.replace(this.refService.videoSrcTag,"").
            replace( "<p>< /></p>", "" ).
            replace( "< />", "" ).replace( "<p>&lt;&gt;</p>", "" ).replace( "<>", "" );
        }
    }




}
