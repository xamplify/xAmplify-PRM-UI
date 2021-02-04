import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
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
import { HubSpotService } from 'app/core/services/hubspot.service';
import { CreateTemplateComponent } from '../create-template/create-template.component';
import { EmailTemplateSource } from '../../email-template/models/email-template-source';

declare var Metronic, Layout, Demo, TableManaged, $, CKEDITOR: any;

@Component({
  selector: 'app-upload-marketo-email-template',
  templateUrl: './upload-marketo-email-template.component.html',
  styleUrls: ['./upload-marketo-email-template.component.css'],
  providers: [EmailTemplate, HttpRequestLoader, CallActionSwitch]
})
export class UploadMarketoEmailTemplateComponent implements OnInit {


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
  @ViewChild("myckeditor") ckeditor: any;
  videoTag: string;
  emailOpenTrackingUrl: any;
  emailTemplateTypes = ["VIDEO", "REGULAR"];
  isValidType: boolean;
  emailTemplateTypeClass: string;
  thirdPartyEmailTemplate: string;
  @Input() createTemplateObj: CreateTemplateComponent;

  constructor(public emailTemplateService: EmailTemplateService, private userService: UserService, private router: Router,
    private emailTemplate: EmailTemplate, private logger: XtremandLogger, private authenticationService: AuthenticationService, public refService: ReferenceService,
    public callActionSwitch: CallActionSwitch, private hubSpotService: HubSpotService) {  
    logger.debug("uploadMarketoEmailTemplateComponent() Loaded");

    this.loggedInUserId = this.authenticationService.getUserId();

    emailTemplateService.getAvailableNames(this.loggedInUserId).subscribe(
      (data: any) => {
        this.availableTemplateNames = data;
      },
      (error: any) => console.log(error),
      () => console.log("Got List Of Available Email Template Names in regularEmailsComponent constructor")
    );
    this.videoTag = "<a href='<SocialUbuntuURL>'>\n   <img src='<SocialUbuntuImgURL>'/> \n </a> \n";
    if (emailTemplateService.emailTemplate != undefined) {
      console.log(emailTemplateService.emailTemplate)
      let body = emailTemplateService.emailTemplate.body.replace(this.emailOpenTrackingUrl, "");
      this.model.content = body;
      this.model.templateName = emailTemplateService.emailTemplate.name;
      //  this.model.isDraft =

    }


    if ($.trim(this.model.templateName).length > 0) {
      this.isValidTemplateName = true;
      this.disableButton = false;
    } else {
      this.isValidTemplateName = false;
      this.disableButton = true;
    }
    this.model.isRegularUpload = "REGULAR";
    //this.validateType();
    this.mycontent = this.model.content;



    this.refService.stopLoader(this.httpRequestLoader);

  }
  /****************Reading Uploaded File********************/
  fileDropPreview(event: any) {

  }
  /***************Remove File****************/
  removeFile() {
    //this.disable = false;
    this.isUploaded = false;
    $(".addfiles").attr("style", "float: left; margin-right: 9px; opacity:1");
    $('#upload-file').val('');
    this.isVideoTagError = false;
    this.isUploadFileError = false;
    this.customResponse.isVisible = false;
  }

  checkAvailableNames(value: any) {
    if ($.trim(value).length > 0) {
      this.isValidTemplateName = true;
      this.disableButton = false;
      $("#templateName").attr('style', 'border-left: 1px solid #42A948');
      if (this.availableTemplateNames.length > 0) {
        if (this.availableTemplateNames.indexOf($.trim(value.toLocaleLowerCase())) > -1) {
          this.duplicateTemplateName = true;
          $("#templateName").attr('style', 'border-left: 1px solid #a94442');
        } else {
          $("#templateName").attr('style', 'border-left: 1px solid #42A948');
          this.duplicateTemplateName = false;
        }
      }
    } else {
      $("#templateName").attr('style', 'border-left: 1px solid #a94442');
      this.isValidTemplateName = false;
      this.disableButton = true;
    }
  }

  checkName(value: string, isAdd: boolean) {
    if (isAdd) {
      return this.availableTemplateNames.indexOf($.trim(value.toLocaleLowerCase())) > -1;
    } else {
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
  validateType() {
    let fieldValue = $("#isRegularUpload").val();
    if (fieldValue != null && fieldValue != undefined && fieldValue.length > 0 && fieldValue != "Select Type") {

      this.isValidType = true;
      this.emailTemplateTypeClass = "form-group has-success has-feedback";
      $("#isRegularUpload").attr('style', 'border-left: 1px solid #42A948');
    } else {

      this.isValidType = false;
      this.emailTemplateTypeClass = "form-group has-error has-feedback";
      $("#isRegularUpload").attr('style', 'border-left: 1px solid #a94442');

    }

  }

  save() {
    this.clickedButtonName = this.saveButtonName;
    this.saveHtmlTemplate(false);
  }

  /************Save Html Template****************/
  saveHtmlTemplate(isOnDestroy: boolean) {
    this.customResponse.isVisible = false;
    this.refService.startLoader(this.httpRequestLoader);
    this.emailTemplate.user = new User();
    this.emailTemplate.user.userId = this.loggedInUserId;
    this.emailTemplate.name = this.model.templateName;
    this.emailTemplate.userDefined = true;
    this.emailTemplate.type = EmailTemplateType.UPLOADED;
    this.emailTemplate.onDestroy = isOnDestroy;
    this.emailTemplate.draft = isOnDestroy;
    if (this.model.isRegularUpload == "REGULAR") {
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
    for (var instanceName in CKEDITOR.instances) {
      CKEDITOR.instances[instanceName].updateElement();
      this.emailTemplate.body = CKEDITOR.instances[instanceName].getData();
    }
    if ($.trim(this.emailTemplate.body).length > 0) {
      console.log(this.emailTemplate);
      if (this.thirdPartyEmailTemplate === "HubSpot") {
        this.emailTemplate.hubSpotEmailTemplate = {
          hubspot_id: this.emailTemplateService.emailTemplate.id
        }
        this.saveEmailTemplate(isOnDestroy, this.emailTemplate);
      }
      else if (this.thirdPartyEmailTemplate === "Marketo") {
        this.emailTemplate.marketoEmailTemplate = {
          marketo_id: this.emailTemplateService.emailTemplate.id
        }
        this.emailTemplate.source= EmailTemplateSource.marketo;
        this.emailTemplateService.saveMarketoEmailTemplate(this.emailTemplate)
          .subscribe(
            data => {
              this.refService.stopLoader(this.httpRequestLoader);
              if (!isOnDestroy) {
                if (data.statusCode == 8012) {
                  this.refService.isCreated = true;
                  this.router.navigate(["/home/emailtemplates/manage"]);
                } else {
                  this.customResponse = new CustomResponse("ERROR", data.message, true);
                }
              }
            },
            error => {
              this.refService.stopLoader(this.httpRequestLoader);
              this.logger.errorPage(error);
            },
            () => console.log(" Completed saveHtmlTemplate()")
          );
      }
    }

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

  hideDiv(divId: string) {
    $('#' + divId).hide(600);
  }

  changeLogo(event: any) {
    this.customResponse.isVisible = false;
    let fileList: any;
    if (event.target != undefined) {
      fileList = event.target.files[0];
    } else {
      fileList = event[0];
    }
    if (fileList != undefined) {
      let maxSize = this.maxFileSize * 1024 * 1024;
      let size = fileList.size;
      let ext = fileList.name.split('.').pop().toLowerCase();
      let extentionsArray = ['zip'];
      if ($.inArray(ext, extentionsArray) == -1) {
        this.refService.goToTop();
        this.customResponse = new CustomResponse('ERROR', "Please upload .zip files only", true);
        $('#upload-file').val('');
      } else {
        let fileSize = (size / 1024 / 1024); //size in MB
        if (size > maxSize) {
          this.refService.goToTop();
          this.customResponse = new CustomResponse('ERROR', "Max size is 10 MB", true);
          $('#upload-file').val('');
        }
      }
    }

  }


  ngOnInit() {
    try {
      if (this.router.url.includes("hubspot")) {
        this.thirdPartyEmailTemplate = "HubSpot";
      }
      else if (this.router.url.includes("marketo")) {
        this.thirdPartyEmailTemplate = "Marketo";
      }
      this.ckeConfig = {
        allowedContent: true,
      };
      this.checkAvailableNames(this.model.templateName);
    } catch (errr) { }

  }


  ngOnDestroy() {
    if (this.clickedButtonName != this.saveButtonName) {
      this.saveHtmlTemplate(true);
    }
  }

  setCoBrandingLogo(event) {
    this.coBrandingLogo = event;
    let body = this.getCkEditorData();
    if (event) {
      if (body.indexOf(this.refService.coBrandingImageTag) < 0) {
        this.mycontent = this.refService.coBrandingTag.concat(this.mycontent);
      }
    } else {
      this.mycontent = this.mycontent.replace(this.refService.coBrandingImageTag, "").
        replace("<p>< /></p>", "").
        replace("< />", "").replace("<p>&lt;&gt;</p>", "").replace("<>", "");

      // .replace("&lt; style=&quot;background-color:black&quot; /&gt;","");
    }

  }
  setVideoGif(event) {

    let body = this.getCkEditorData();
    if (event == 'VIDEO') {

      if (body.indexOf(this.videoTag) < 0) {
        this.mycontent = "<img src=\"https://aravindu.com/vod/images/xtremand-video.gif\" />".concat(body);
      }

    } else {

      this.mycontent = body.replace("<img src=\"https://aravindu.com/vod/images/xtremand-video.gif\" />", "").
        replace("<p>< /></p>", "").
        replace("< />", "").replace("<p>&lt;&gt;</p>", "").replace("<>", "");


    }

  }

  getCkEditorData() {
    let body = "";
    for (var instanceName in CKEDITOR.instances) {
      CKEDITOR.instances[instanceName].updateElement();
      body = CKEDITOR.instances[instanceName].getData();
    }
    return body;
  }

  saveEmailTemplate(isOnDestroy: boolean, emailTemplate: EmailTemplate) {
    if (this.thirdPartyEmailTemplate === "HubSpot") {
      this.emailTemplate.source= EmailTemplateSource.hubspot;
      this.emailTemplateService.save(this.emailTemplate).subscribe(data => {
        this.refService.stopLoader(this.httpRequestLoader);
        if (!isOnDestroy) {
          if (data.statusCode == 702) {
            this.refService.isCreated = true;
            this.router.navigate(["/home/emailtemplates/manage"]);
          } else {
            this.customResponse = new CustomResponse("ERROR", data.message, true);
          }
        } else {
          this.emailTemplateService.goToManage();
        }
      },
        error => {
          this.refService.stopLoader(this.httpRequestLoader);
          this.logger.errorPage(error);
        },
        () => console.log(" Completed saveHtmlTemplate()")
      );
    }
  }
}
