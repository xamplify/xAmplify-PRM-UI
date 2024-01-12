import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute,Router} from '@angular/router';
import { CallActionSwitch } from '../videos/models/call-action-switch';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { EmailTemplateService } from '../email-template/services/email-template.service';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user';
import { EmailTemplate } from '../email-template/models/email-template';
import { XtremandLogger } from '../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../core/services/authentication.service';
import { ReferenceService } from '../core/services/reference.service';
import { HttpRequestLoader } from '../core/models/http-request-loader';
import { EmailTemplateType } from '../email-template/models/email-template-type';
import { CustomResponse } from '../common/models/custom-response';
import { EmailTemplateSource } from '../email-template/models/email-template-source';
import { HubSpotService } from 'app/core/services/hubspot.service';
import { ComponentCanDeactivate } from 'app/component-can-deactivate';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';

declare var $:any, CKEDITOR:any, swal: any;

@Component({
  selector: 'app-ck-editor-upload-component',
  templateUrl: './ck-editor-upload-component.component.html',
  styleUrls: ['./ck-editor-upload-component.component.css'],
  providers: [EmailTemplate, HttpRequestLoader, CallActionSwitch]
})
export class CkEditorUploadComponent implements OnInit,ComponentCanDeactivate,OnDestroy {


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
    type:string = "";
    categoryNames: any;
    isSaveButtonClicked = false;
    viewType = "";
    folderViewType = "";
    modulesDisplayType = new ModulesDisplayType();
    categoryId: number = 0;
  constructor( public emailTemplateService: EmailTemplateService, private userService: UserService, private router: Router,
          private emailTemplate: EmailTemplate, private logger: XtremandLogger, public authenticationService: AuthenticationService, public refService: ReferenceService,
          public callActionSwitch: CallActionSwitch,private route: ActivatedRoute,private hubSpotService: HubSpotService) {
      this.loggedInUserId = this.authenticationService.getUserId();
      this.type = this.route.snapshot.params['type'];
      this.getAvailableNames();
      this.getCategories();
      if(this.type=="custom" ||this.type=="customv"){
          this.ngFileUploadForCustomTemplates();
      }else if(this.type=="marketo" || this.type=="hubspot"){
          this.model.uploadType = "REGULAR";
          this.disableButton = false;
          this.duplicateTemplateName = false;
          this.isUploaded = true;
          if (emailTemplateService.emailTemplate != undefined) {
              this.mycontent = emailTemplateService.emailTemplate.body;
              this.model.name = emailTemplateService.emailTemplate.name;
            }else{
                this.goBackToSelectPage();
            }
      }

  }
  
  goBackToSelectPage(){
      this.router.navigate( ["/home/emailtemplates/select"] );
  }
  
  getAvailableNames(){
      this.emailTemplateService.getAvailableNames( this.loggedInUserId ).subscribe(
              ( data: any ) => {
                  this.availableTemplateNames = data;
              },
              ( error: any ) => console.log( error ),
              () => console.log( "Got List Of Available Email Template Names in regularEmailsComponent constructor" )
          );
  }
  
  validateNames( value: any ) {
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
  
  ngFileUploadForCustomTemplates(){
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
          if ( $.trim( this.model.name).length > 0 ) {
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
  
  copyLink(inputElement,id){
      $('#'+id).hide();
      inputElement.select();
      document.execCommand('copy');
      inputElement.setSelectionRange(0, 0);
      $('#'+id).show(500);
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
          // .replace("&lt; style=&quot;background-color:black&quot; /&gt;","");
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
  
  selectUploadType(event:any){
      let body = this.getCkEditorData();
      if (event == 'VIDEO') {
        if (body.indexOf(this.refService.videoSrcTag) < 0) {
            this.mycontent = this.refService.videoTag.concat(this.mycontent);
        }
      } else {
          this.mycontent = this.mycontent.replace(this.refService.videoSrcTag,"").
          replace( "<p>< /></p>", "" ).
          replace( "< />", "" ).replace( "<p>&lt;&gt;</p>", "" ).replace( "<>", "" );
      }
  }

  /*********************Save The Content*****************************/
  save() {
      this.clickedButtonName = this.saveButtonName;
      this.isSaveButtonClicked = true;
      this.saveHtmlTemplate( false,null);
  }

  /************Save Html Template****************/
  saveHtmlTemplate( isOnDestroy: boolean,ckEditorBody:any) {
      this.customResponse.isVisible = false;
      this.refService.startLoader( this.httpRequestLoader );
      this.emailTemplate.user = new User();
      this.emailTemplate.user.userId = this.loggedInUserId;
      this.emailTemplate.name = this.model.name;
      this.emailTemplate.userDefined = true;
      this.emailTemplate.type = EmailTemplateType.UPLOADED;
      this.emailTemplate.onDestroy = isOnDestroy;
      this.emailTemplate.draft = isOnDestroy;
      this.emailTemplate.categoryId = $('#upload-custom-categoryId option:selected').val();
      if (this.type=="custom" || this.model.uploadType=="REGULAR") {
          this.emailTemplate.regularTemplate = true;
          this.emailTemplate.desc = "Regular Template";
          this.emailTemplate.subject = "assets/images/normal-email-template.png";
          this.emailTemplate.regularCoBrandingTemplate = this.coBrandingLogo;
      } else if(this.type=="customv" || this.model.uploadType=="VIDEO") {
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
          if(this.type=="marketo"){
              this.saveMarketoTemplate(isOnDestroy);
          }else{
              this.saveCustomEmailTemplate(isOnDestroy);
          }
      }
  }
  
  saveCustomEmailTemplate(isOnDestroy:boolean){
    this.isSaveButtonClicked = true;
      if(this.type=="custom"){
          this.emailTemplate.source= EmailTemplateSource.manual;
      }else if(this.type=="hubspot"){
          this.emailTemplate.source= EmailTemplateSource.hubspot;
      }
      this.emailTemplateService.save( this.emailTemplate )
          .subscribe(
          data => {
             if(data.access){
                this.refService.stopLoader( this.httpRequestLoader );
                if ( !isOnDestroy ) {
                    if ( data.statusCode == 702 ) {
                        this.refService.addCreateOrUpdateSuccessMessage("Template created successfully");
                        this.navigateToManageSection();
                    } else {
                        this.customResponse = new CustomResponse( "ERROR", data.message, true );
                    }
                }else{
                    this.navigateToManageSection();
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
  
  saveMarketoTemplate(isOnDestroy:boolean){
    this.isSaveButtonClicked = true;
      this.emailTemplate.marketoEmailTemplate = {
              marketo_id: this.emailTemplateService.emailTemplate.id
            }
            this.emailTemplate.source= EmailTemplateSource.marketo;
            this.emailTemplateService.saveMarketoEmailTemplate(this.emailTemplate)
              .subscribe(
                data => {
                    if(data.access){
                        this.refService.stopLoader(this.httpRequestLoader);
                        if (!isOnDestroy) {
                          if (data.statusCode == 8012) {
                            this.refService.addCreateOrUpdateSuccessMessage("Template created successfully");
                            this.navigateToManageSection();
                          } else {
                            this.customResponse = new CustomResponse("ERROR", data.message, true);
                          }
                        }else{
                            this.navigateToManageSection();
                        }
                    }else{
                        this.authenticationService.forceToLogout();
                    }
                  
                },
                error => {
                  this.refService.stopLoader(this.httpRequestLoader);
                  this.logger.errorPage(error);
                },
                () => console.log(" Completed saveHtmlTemplate()")
              );
  }

  navigateToManageSection() {
    this.refService.navigateToManageEmailTemplatesByViewType(this.folderViewType,this.viewType,this.categoryId);
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
  
  ngOnInit() {
    this.categoryId = this.route.snapshot.params['categoryId'];
    this.viewType = this.route.snapshot.params['viewType'];
    this.folderViewType = this.route.snapshot.params['folderViewType'];
      try {
          this.ckeConfig = {
              allowedContent: true,
          };
      } catch ( errr ) { }
  
  }

  getCategories(){
    this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId ).subscribe(
        ( data: any ) => {
            this.categoryNames = data.data;
            let categoryIds = this.categoryNames.map(function (a) { return a.id; });
            this.model.categoryId = categoryIds[0];
        },
        error => { this.logger.error( "error in getCategoryNamesByUserId(" + this.loggedInUserId + ")", error ); },
        () => this.logger.info( "Finished getCategoryNamesByUserId()" ) );
}

@HostListener('window:beforeunload')
      canDeactivate(): Observable<boolean> | boolean {
          this.authenticationService.stopLoaders();
          let isInvalidEmailTemplateData = this.emailTemplateService.emailTemplate==undefined;
          return this.isSaveButtonClicked || isInvalidEmailTemplateData || this.authenticationService.module.logoutButtonClicked;
      }

}
