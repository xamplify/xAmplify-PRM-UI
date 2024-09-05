import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SendTestEmailDto } from 'app/common/models/send-test-email-dto';
import { ActivatedRoute } from '@angular/router';
declare var swal: any, $: any;
@Component({
  selector: 'app-send-test-email',
  templateUrl: './send-test-email.component.html',
  styleUrls: ['./send-test-email.component.css'],
  providers: [Properties]
})
export class SendTestEmailComponent implements OnInit {

  @Input() id: number = 0;
  @Input() subject: string = "";
  @Input() isPreviewEmailTemplate = false;
  @Input() templateName: string = "";
  @Input() fromEmail = "";
  @Input() fromName = "";
  @Input() campaignSendTestEmail = false;
  @Input() campaign: any;
  email = "";
  headerTitle = "";
  @Output() sendTestEmailComponentEventEmitter = new EventEmitter();
  emailIds = [];
  modalPopupId = "send-test-email-modal-popup";
  sending = false;
  processing = false;
  customResponse: CustomResponse = new CustomResponse();
  success = true;
  isValidForm = false;
  isValidEmailFormat = true;
  isValidEmailLength = false;
  isValidSubject = false;
  sendTestEmailDto: SendTestEmailDto = new SendTestEmailDto();
  clicked = false;
  constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService, public properties: Properties, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.processing = true;
    this.headerTitle = this.templateName;
    this.sendTestEmailDto.subject = this.subject;
    this.sendTestEmailDto.fromEmail = this.fromEmail;
    this.sendTestEmailDto.fromName = this.fromName;
    this.referenceService.openModalPopup(this.modalPopupId);
    $('#sendTestEmailHtmlBody').val('');
    this.getTemplateHtmlBodyAndMergeTagsInfo();
  }


  validateForm() {
    let email = $.trim(this.sendTestEmailDto.toEmail);
    let subject = $.trim(this.sendTestEmailDto.subject);
    this.isValidSubject = subject.length > 0;
    this.isValidEmailLength = email.length > 0;
    this.isValidEmailFormat = this.isValidEmailLength && this.referenceService.validateEmailId(email);
    let isValidEmail = this.isValidEmailLength && this.isValidEmailFormat;
    this.isValidForm = isValidEmail && this.isValidSubject;
  }

  getTemplateHtmlBodyAndMergeTagsInfo() {
    this.processing = true;
    this.authenticationService.getTemplateHtmlBodyAndMergeTagsInfo(this.id,this.fromEmail).subscribe(
      response => {
        let map = response.data;
        let htmlBody = map['emailTemplateDTO']['body'];
        let mergeTagsInfo = map['mergeTagsInfo'];
        htmlBody = this.referenceService.replaceMyMergeTags(mergeTagsInfo, htmlBody);
        this.sendTestEmailDto.body = htmlBody;
        $('#sendTestEmailHtmlBody').append(htmlBody);
        $('tbody').addClass('preview-shown')
        this.processing = false;
      }, error => {
        this.processing = false;
        this.callEventEmitter();
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
  }


  send() {
    this.referenceService.showSweetAlertProcessingLoader("We are sending the email");
    this.validateForm();
    if (this.isValidForm) {
      if (this.campaignSendTestEmail) {
        this.sendCampaignTestEmail();
      } else {
        this.sendTestEmail();
      }

    } else {
      this.showErrorMessage("Please provide valid inputs.");
    }

  }

  private sendCampaignTestEmail() {
    let data: Object = {};
    let campaign = this.campaign;
    data['campaignName'] = campaign.campaignName;
    data['fromName'] = campaign.fromName;
    data['email'] = campaign.email;
    data['subjectLine'] = this.sendTestEmailDto.subject;
    data['nurtureCampaign'] = false;
    data['channelCampaign'] = campaign.channelCampaign;
    data['preHeader'] = campaign.preHeader;
    let campaignType = this.activatedRoute.snapshot.params['campaignType'];
    if (campaignType == "page") {
      data['landingPageId'] = this.id;
    } else {
      data['selectedEmailTemplateId'] = this.id;
    }
    if (campaignType == "page") {
      data['campaignTypeInString'] = "LANDINGPAGE";
    } else if (campaignType == "email") {
      data['campaignTypeInString'] = "REGULAR";
    } else if (campaignType == "video") {
      data['campaignTypeInString'] = "VIDEO";
    } else if (campaignType == "survey") {
      data['campaignTypeInString'] = "SURVEY";
    }
    data['testEmailId'] = this.sendTestEmailDto.toEmail;
    data['userId'] = this.authenticationService.getUserId();
    data['selectedVideoId'] = campaign.selectedVideoId;
    data['parentCampaignId'] = campaign.parentCampaignId;
    this.authenticationService.sendCampaignTestEmail(data).subscribe(
      response => {
        this.referenceService.showSweetAlertSuccessMessage("Email Sent Successfully");
        this.callEventEmitter();
      }, error => {
        this.showErrorMessage("Unable to send test email.Please try after some time.");
      });
  }

  private sendTestEmail() {
    this.authenticationService.sendTestEmail(this.sendTestEmailDto).subscribe(
      response => {
        this.referenceService.showSweetAlertSuccessMessage(response.message);
        this.callEventEmitter();
      }, error => {
        this.showErrorMessage("Unable to send test email.Please try after some time.");
      });
  }

  showErrorMessage(errorMessage: string) {
    this.processing = false;
    this.customResponse = new CustomResponse();
    this.referenceService.showSweetAlertErrorMessage(errorMessage);
    this.clicked = false;
  }


  callEventEmitter() {
    this.sendTestEmailDto = new SendTestEmailDto();
    this.referenceService.closeModalPopup(this.modalPopupId);
    this.sendTestEmailComponentEventEmitter.emit();
  }

  previewEmailTemplate() {
    this.referenceService.previewEmailTemplateInNewTab(this.id);
  }

}
