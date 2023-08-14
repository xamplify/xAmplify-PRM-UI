import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { EmailTemplateService } from 'app/email-template/services/email-template.service';
import { EmailTemplate } from '../../email-template/models/email-template';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';

declare var BeePlugin, swal, $: any;

@Component({
  selector: 'app-create-bee-template',
  templateUrl: './create-bee-template.component.html',
  styleUrls: ['./create-bee-template.component.css'],
  providers: [EmailTemplate, HttpRequestLoader]

})
export class CreateBeeTemplateComponent implements OnInit {
  partnerTemplateLoader: boolean;
  loggedInUserId: number = 0;
  @Input() partnerEmailTemplate: EmailTemplate;
  /****XNFR-330*****/
  @Input() isAutoResponseEmailTemplate = false;
  @Input() autoResponseId = 0;
  @Input() selectedAutoResponseCustomEmailTemplateId = 0;
  @Output() eventEmitter = new EventEmitter();
  /****XNFR-330*****/
  customResponse: CustomResponse = new CustomResponse();
  loading = false;
  senderMergeTag: SenderMergeTag = new SenderMergeTag();
  mergeTagsInput: any = {};
  ngOnInit() {
    this.referenceService.scrollSmoothToTop();
    if(this.isAutoResponseEmailTemplate==undefined){
      this.isAutoResponseEmailTemplate = false;
    }
    if(this.selectedAutoResponseCustomEmailTemplateId==undefined){
      this.selectedAutoResponseCustomEmailTemplateId = 0;
    }
    if(this.autoResponseId==undefined){
      this.autoResponseId = 0;
    }
    this.editPartnerTemplate();

  }
  constructor(private authenticationService: AuthenticationService, private referenceService: ReferenceService, private emailTemplateService: EmailTemplateService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  editPartnerTemplate() {
    let self = this;
   
    let emailTemplate = this.partnerEmailTemplate;
    let isPartnerTemplate = !this.isAutoResponseEmailTemplate && emailTemplate.vendorCompanyId != undefined && emailTemplate.vendorCompanyId > 0;
    if (isPartnerTemplate || this.isAutoResponseEmailTemplate) {
      if (emailTemplate.jsonBody != undefined) {
        var request = function (method, url, data, type, callback) {
          var req = new XMLHttpRequest();
          req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
              var response = JSON.parse(req.responseText);
              callback(response);
            } else if (req.readyState === 4 && req.status !== 200) {
               self.referenceService.showSweetAlertErrorMessage("Unable to load Bee container.Please try reloading the page/check your internet connection.");
            }
          };

          req.open(method, url, true);
          if (data && type) {
            if (type === 'multipart/form-data') {
              var formData = new FormData();
              for (var key in data) {
                formData.append(key, data[key]);
              }
              data = formData;
            }
            else {
              req.setRequestHeader('Content-type', type);
            }
          }

          req.send(data);
        };

        var save = function (jsonContent: string, htmlContent: string) {
          self.partnerTemplateLoader = true;
          emailTemplate.jsonBody = jsonContent;
          emailTemplate.body = htmlContent;
          emailTemplate.userId = self.loggedInUserId;
          self.updatePartnerTemplate(emailTemplate);
        };

        let mergeTags = [];
        mergeTags = this.referenceService.addMergeTags(mergeTags,false,emailTemplate.beeEventTemplate || emailTemplate.beeEventCoBrandingTemplate);
        var beeUserId = "bee-p-" + emailTemplate.vendorCompanyId;
        var roleHash = self.authenticationService.partnerRoleHash;
        var beeConfig = {
          uid: beeUserId,
          container: 'partner-template-bee-container',
          autosave: 15,
          //language: 'en-US',
          language: this.authenticationService.beeLanguageCode,
          mergeTags: mergeTags,
          preventClose: true,
          roleHash: roleHash,
          onSave: function (jsonFile, htmlFile) {
            save(jsonFile, htmlFile);
          },
          onSaveAsTemplate: function (jsonFile) { // + thumbnail?
            //save('newsletter-template.json', jsonFile);
          },
          onAutoSave: function (jsonFile) { // + thumbnail?
            console.log(new Date().toISOString() + ' autosaving...');
            window.localStorage.setItem('newsletter.autosave', jsonFile);

          },
          onSend: function (htmlFile) {
            //write your send test function here
            console.log(htmlFile);
          },
          onError: function (errorMessage) {
          }
        };

        var bee = null;
        request(
          'POST',
          'https://auth.getbee.io/apiauth',
          'grant_type=password&client_id=' + this.authenticationService.clientId + '&client_secret=' + this.authenticationService.clientSecret + '',
          'application/x-www-form-urlencoded',
          function (token: any) {
            BeePlugin.create(token, beeConfig, function (beePluginInstance: any) {
              bee = beePluginInstance;
              request(
                self.authenticationService.beeRequestType,
                self.authenticationService.beeHostApi,
                null,
                null,
                function (template: any) {
                  if (emailTemplate != undefined) {
                    var body = emailTemplate.jsonBody;
                    body = body.replace("https://xamp.io/vod/replace-company-logo.png", emailTemplate.vendorCompanyLogoPath);
                    body = body.replace("https://xamp.io/vod/images/co-branding.png", emailTemplate.partnerCompanyLogoPath);
                    emailTemplate.jsonBody = body;
                    var jsonBody = JSON.parse(body);
                    bee.load(jsonBody);
                    bee.start(jsonBody);
                  } else {
                    this.referenceService.showSweetAlert("", "Unable to load the template", "error");
                    this.loading = false;
                  }
                });
            });
          });
      } else {
        this.referenceService.showSweetAlert("", "This template cannot be edited.", "error");
      }
    } else {
      this.referenceService.showSweetAlert("", "This template can't be edited because the vendor has deleted the campaign.", "error")
    }



  }


  updatePartnerTemplate(emailTemplate: EmailTemplate) {
    this.customResponse = new CustomResponse();
    this.replaceToDefaultLogos(emailTemplate);
    this.loading = true;
    /*****XNFR-330******/
    emailTemplate.autoResponseEmailTemplate = this.isAutoResponseEmailTemplate;
    emailTemplate.selectedAutoResponseCustomEmailTemplateId = this.selectedAutoResponseCustomEmailTemplateId;
    emailTemplate.autoResponseId = this.autoResponseId;
    /*****XNFR-330******/
    this.emailTemplateService.updatePartnerTemplate(emailTemplate).
      subscribe(
        data => {
          this.loading = false;          
          if (data.access) {
            if (data.statusCode === 200) {
              this.customResponse = new CustomResponse('SUCCESS', 'Template updated successfully', true);
              /********XNFR-330*******/
              let emitterData = {};
              emitterData['htmlBody'] = emailTemplate.body;
              emitterData['jsonBody'] = emailTemplate.jsonBody;
              emitterData['autoResponseId'] = this.autoResponseId;
              emitterData['autoResponseType']=emailTemplate.autoResponseType;
              this.eventEmitter.emit(emitterData);
              /********XNFR-330*******/
            } else if (data.statusCode === 500) {
              this.customResponse = new CustomResponse('ERROR', data.message, true);
            }            
          } else {
            this.authenticationService.forceToLogout();
          }
        },
        error => {
          this.loading = false;
          this.referenceService.showSweetAlertErrorMessage(error);
        },
        () => console.log("Email Template Updated")
      );
  }

  replaceToDefaultLogos(emailTemplate: EmailTemplate) {
    if (emailTemplate.jsonBody != undefined) {
      emailTemplate.jsonBody = emailTemplate.jsonBody.replace(emailTemplate.vendorCompanyLogoPath, "https://xamp.io/vod/replace-company-logo.png");
      emailTemplate.jsonBody = emailTemplate.jsonBody.replace(emailTemplate.partnerCompanyLogoPath, "https://xamp.io/vod/images/co-branding.png");
    }
    if (emailTemplate.body != undefined) {
      emailTemplate.body = emailTemplate.body.replace(emailTemplate.vendorCompanyLogoPath, "https://xamp.io/vod/replace-company-logo.png");
      emailTemplate.body = emailTemplate.body.replace(emailTemplate.partnerCompanyLogoPath, "https://xamp.io/vod/images/co-branding.png");
    }

  }

}
