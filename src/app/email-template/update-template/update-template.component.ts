import { Component, OnInit, OnDestroy } from '@angular/core';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { EmailTemplate} from '../models/email-template';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { User } from '../../core/models/user';
import { ComponentCanDeactivate } from 'app/component-can-deactivate';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';

declare var $:any,CKEDITOR:any,swal:any;

@Component({
    selector: 'app-update-template',
    templateUrl: './update-template.component.html',
    styleUrls: ['./update-template.component.css'],
    providers: [EmailTemplate,HttpRequestLoader,CallActionSwitch]
})
export class UpdateTemplateComponent implements OnInit,ComponentCanDeactivate, OnDestroy {

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
    categoryNames: any;
    routerLink = "/home/emailtemplates/manage";
    isReload = false;
    categoryId = 0;
    isUpdateButtonClicked = false;
    modulesDisplayType:ModulesDisplayType = new ModulesDisplayType();
    constructor(public emailTemplateService: EmailTemplateService, private userService: UserService,
            private router: Router, private emailTemplate: EmailTemplate, private logger: XtremandLogger,
            public authenticationService:AuthenticationService,public refService:ReferenceService,
            public callActionSwitch: CallActionSwitch,private route:ActivatedRoute) {
        CKEDITOR.config.allowedContent = true;
        this.categoryId = this.route.snapshot.params['categoryId'];
        if(this.categoryId>0){
            this.routerLink+= "/"+this.categoryId;
        }
        this.loggedInUserId = this.authenticationService.getUserId();
        if(this.emailTemplateService.emailTemplate == undefined){
            this.isReload = true;
            this.navigateToManageSection();
        }else{
            this.listAvailableNames();
            this.getCategories();
             this.model.isRegularUpload =0;
             if (emailTemplateService.emailTemplate != undefined) {
                 let emailTemplate = emailTemplateService.emailTemplate;
                 let body  = emailTemplate.body.replace(this.emailOpenTrackingUrl,"");
                 this.model.content = body;
                 this.model.categoryId = emailTemplate.categoryId;
                 this.isValidType = true;
                 this.model.draft = emailTemplate.draft;
                 this.mycontent = this.model.content;
                 this.model.templateName = emailTemplate.name;
                 this.coBrandingLogo = emailTemplate.regularCoBrandingTemplate || emailTemplate.videoCoBrandingTemplate;
                 if(emailTemplate.source.toString()!="MANUAL"){
                     if(this.model.draft){
                         this.showDropDown = true;
                         this.model.uploadType = "REGULAR";
                     }
                 }
             }
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
        this.isUpdateButtonClicked = true;
       this.refService.startLoader(this.httpRequestLoader);
        this.emailTemplate.id = this.emailTemplateService.emailTemplate.id;
        this.emailTemplate.name = this.model.templateName;
        this.emailTemplate.createdBy = this.emailTemplateService.emailTemplate.createdBy;
        this.emailTemplate.onDestroy = isOnDestroy;
        this.emailTemplate.draft = isOnDestroy;
        this.emailTemplate.categoryId = this.model.categoryId;
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
            if(data.access){
                this.refService.stopLoader(this.httpRequestLoader);
                if(!isOnDestroy){
                    if(data.statusCode==703){
                        this.refService.isUpdated = true;
                        this.emailTemplateService.emailTemplate = new EmailTemplate();
                        this.navigateToManageSection();
                    }else{
                        this.clickedButtonName = "";
                        this.isVideoTagError = true;
                        this.videoTagsError = data.message;
                    }
                }else{
                    this.emailTemplateService.goToManage();
                }
            }else{
                this.authenticationService.forceToLogout();
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
                if(data.access){
                    this.refService.stopLoader( this.httpRequestLoader );
                    if ( !isOnDestroy ) {
                        if ( data.statusCode == 8013 ) {
                            this.refService.isUpdated = true;
                            this.emailTemplateService.emailTemplate = new EmailTemplate();
                           this.navigateToManageSection();
                        } else {
                            this.clickedButtonName = "";
                            this.isVideoTagError = true;
                            this.videoTagsError = data.message;
                        }
                    }
                }else{
                    this.authenticationService.forceToLogout();
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
       
    }


    ngOnDestroy() {
                
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

    selectCategory(event:any){
        this.model.categoryId = event;
    }

    navigateToManageSection(){
        let viewType = this.route.snapshot.params['viewType'];
        let folderViewType = this.route.snapshot.params['folderViewType'];
        this.modulesDisplayType = this.refService.setDefaultDisplayType(this.modulesDisplayType);
        if(viewType==undefined){
            viewType = this.modulesDisplayType.isListView ? 'l' : this.modulesDisplayType.isGridView ?'g':'';
        }
        this.refService.navigateToManageEmailTemplatesByViewType(folderViewType,viewType,this.categoryId);
      }

      @HostListener('window:beforeunload')
      canDeactivate(): Observable<boolean> | boolean {
          this.authenticationService.stopLoaders();
          let isInvalidEditPage = this.emailTemplateService.emailTemplate==undefined;
          return this.isUpdateButtonClicked || isInvalidEditPage || this.authenticationService.module.logoutButtonClicked;
      }
}
