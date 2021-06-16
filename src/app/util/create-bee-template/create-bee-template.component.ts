import { Component, OnInit, Input, Output } from '@angular/core';
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
  customResponse: CustomResponse = new CustomResponse();
  loading = false;
  senderMergeTag: SenderMergeTag = new SenderMergeTag();
  mergeTagsInput: any = {};
  ngOnInit() {
    this.editPartnerTemplate();

  }
  constructor(private authenticationService: AuthenticationService, private referenceService: ReferenceService, private emailTemplateService: EmailTemplateService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  editPartnerTemplate() {
    let emailTemplate = this.partnerEmailTemplate;
    if (emailTemplate.vendorCompanyId != undefined && emailTemplate.vendorCompanyId > 0) {
      if (emailTemplate.jsonBody != undefined) {
        var request = function (method, url, data, type, callback) {
          var req = new XMLHttpRequest();
          req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
              var response = JSON.parse(req.responseText);
              callback(response);
            } else if (req.readyState === 4 && req.status !== 200) {
              console.error('Access denied, invalid credentials. Please check you entered a valid client_id and client_secret.');
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

        let self = this;
        var save = function (jsonContent: string, htmlContent: string) {
          self.partnerTemplateLoader = true;
          emailTemplate.jsonBody = jsonContent;
          emailTemplate.body = htmlContent;
          emailTemplate.userId = self.loggedInUserId;
          self.updatePartnerTemplate(emailTemplate);
        };


        var mergeTags = [{ name: 'First Name', value: '{{firstName}}' },
        { name: 'Last Name', value: '{{lastName}}' },
        { name: 'Full Name', value: '{{fullName}}' },
        { name: 'Email Id', value: '{{emailId}}' },
        { name: 'Company Name', value: '{{companyName}}' }
        ];

        mergeTags.push({ name: 'Sender First Name', value: this.senderMergeTag.senderFirstName });
        mergeTags.push({ name: 'Sender Last Name', value: this.senderMergeTag.senderLastName });
        mergeTags.push({ name: 'Sender Full Name', value: this.senderMergeTag.senderFullName });
        mergeTags.push({ name: 'Sender Title', value: this.senderMergeTag.senderTitle });
        mergeTags.push({ name: 'Sender Email Id', value: this.senderMergeTag.senderEmailId });
        mergeTags.push({ name: 'Sender Contact Number', value: this.senderMergeTag.senderContactNumber });
        mergeTags.push({ name: 'Sender Company', value: this.senderMergeTag.senderCompany });
        mergeTags.push({ name: 'Sender Company Url', value: this.senderMergeTag.senderCompanyUrl });
        mergeTags.push({ name: 'Sender Company Contact Number', value: this.senderMergeTag.senderCompanyContactNumber });
        mergeTags.push({ name: 'Sender About Us (Partner)', value: this.senderMergeTag.aboutUs });
        mergeTags.push({ name: 'Sender Privacy Policy', value: this.senderMergeTag.privacyPolicy });
 		mergeTags.push({ name: 'Unsubscribe Link', value: this.senderMergeTag.unsubscribeLink });
        if (emailTemplate.beeEventTemplate || emailTemplate.beeEventCoBrandingTemplate) {
          mergeTags.push({ name: 'Event Title', value: '{{event_title}}' });
          mergeTags.push({ name: 'Event Start Time', value: '{{event_start_time}}' });
          mergeTags.push({ name: 'Event End Time', value: '{{event_end_time}}' });
          mergeTags.push({ name: 'Address', value: '{{address}}' });
          mergeTags.push({ name: 'Event From Name', value: '{{event_fromName}}' });
          mergeTags.push({ name: 'Event EmailId', value: '{{event_emailId}}' });
          mergeTags.push({ name: 'Vendor Name   ', value: '{{vendor_name}}' });
          mergeTags.push({ name: 'Vendor EmailId', value: '{{vendor_emailId}}' });
        }

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
                'GET',
                'https://rsrc.getbee.io/api/templates/m-bee',
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
    this.emailTemplateService.updatePartnerTemplate(emailTemplate).
      subscribe(
        data => {
          this.loading = false;
          if (data.access) {
            this.customResponse = new CustomResponse('SUCCESS', 'Template updated successfully', true);
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
