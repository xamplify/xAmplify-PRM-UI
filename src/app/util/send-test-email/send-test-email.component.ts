import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SendTestEmailDto } from 'app/common/models/send-test-email-dto';
import { ActivatedRoute } from '@angular/router';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
declare var $: any;
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
  @Input() fromEmailUserId = 0;
  @Input() campaignSendTestEmail = false;
  @Input() campaign: any;
  @Input() vanityTemplatesPartnerAnalytics: boolean; 
  @Input() toEmailId :any;
  @Input() selectedItem : any;
  @Output() sendmailNotify =new EventEmitter
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
  /**XNFR-832***/
  @Input() moduleName = "";
  @Input() campaignName="";
  @Input() campaignId = 0;
  isSendMdfRequestOptionClicked = false;
  constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService, public properties: Properties, private activatedRoute: ActivatedRoute, private vanityURLService: VanityURLService) { }

  ngOnInit() {
    this.processing = true;
    this.headerTitle = this.templateName;
    this.sendTestEmailDto.subject = this.subject;
    this.sendTestEmailDto.fromEmail = this.fromEmail;
    this.sendTestEmailDto.fromName = this.fromName;
    this.isSendMdfRequestOptionClicked = XAMPLIFY_CONSTANTS.unlockMdfFunding==this.moduleName;
    this.referenceService.openModalPopup(this.modalPopupId);
    $('#sendTestEmailHtmlBody').val('');
    if(this.vanityTemplatesPartnerAnalytics){
      this.getVanityEmailTemplatesPartnerAnalytics();
    }else if(this.isSendMdfRequestOptionClicked){
      this.headerTitle = "Unlock MDF Funds for Your Campaign";
      this.getFundingTemplateHtmlBody();
    }else{
      this.getTemplateHtmlBodyAndMergeTagsInfo();
    }
  }

  /***XNFR-832****/
  getFundingTemplateHtmlBody() {
    this.processing = true;
    this.sendTestEmailDto = new SendTestEmailDto();
    this.authenticationService.getFundingTemplateHtmlBody().subscribe(
      response => {
        let statusCode = response.statusCode;
        if(statusCode==200){
          let data = response.data;
          let body = data.body;
          body = this.referenceService.replaceCampaignMDFFundingTemplateMergeTags(this.campaignName,this.sendTestEmailDto.recipientName,body);
          this.sendTestEmailDto.body = body;
          this.sendTestEmailDto.subject = data.subject;
          this.sendTestEmailDto.campaignId = this.campaignId;
          $('#sendTestEmailHtmlBody').append(body);
          $('tbody').addClass('preview-shown');
          this.processing = false;
        }else{
          this.processing = false;
          this.callEventEmitter();
          this.referenceService.showSweetAlertErrorMessage("The requested default template for MDF funding is unavailable. Please verify the template ID or ensure it has been configured correctly.")
        }
      }, error => {
        this.processing = false;
        this.callEventEmitter();
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
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
        $('tbody').addClass('preview-shown');
        this.processing = false;
      }, error => {
        this.processing = false;
        this.callEventEmitter();
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
  }

  getVanityEmailTemplatesPartnerAnalytics() {
    this.processing = true;
    this.vanityURLService.getHtmlBody(this.id).subscribe(
      response => {
        let map = response.data;
        let htmlBody = map.body;
        let subject = map.subject;
        let mergeTagsInfo = map['mergeTagsInfo'];
        htmlBody = this.referenceService.replaceMyMergeTags(mergeTagsInfo, htmlBody);
        this.sendTestEmailDto.body = htmlBody;
        this.sendTestEmailDto.subject = subject;
        this.sendTestEmailDto.toEmail = this.toEmailId;
        if (this.sendTestEmailDto.subject.length > 0 && this.sendTestEmailDto.toEmail.length > 0 && this.referenceService.validateEmailId(this.sendTestEmailDto.toEmail)) {
          this.isValidForm = true;
        } else {
          this.isValidForm = false;
        }
        $('#sendTestEmailHtmlBody').append(htmlBody);
        $('div.selector, div.selector span, div.checker span, div.radio span, div.uploader, div.uploader span.action, div.button, div.button span')
          .css('background-image', 'url("path/to/your/new-image.png")');
        $('div.button span span a').each(function () {
          this.style.setProperty('opacity', 'unset', 'important');
        });
        $('div.button span').css({
          'padding': '1px 15px 0px 2px',
          'cursor': 'not-allowed'
        });
        $('div.plspx').css({
          'cursor': 'not-allowed',
        });
        $('table.social-table').css({
          'padding': '0 5px 0 0',
          'cursor': 'not-allowed',
        });
        $('table.social-table a').css('pointer-events', 'none');

        $('table.social-table a').removeAttr('href');

        $('div.button').css({
          'padding': '1px 15px 0px 2px',
          'cursor': 'not-allowed'
        }).prop('disabled', true);

        $('div.button').on('click', function (e) {
          e.preventDefault();
          return false;
        });
        $('div.button a').css({
          'padding': '1px 15px 0px 2px',
          'cursor': 'not-allowed'
        }).prop('disabled', true);
        $('div.alignment a').css({
          'cursor': 'not-allowed',
          'pointer-events': 'none'
        });
        $('div.button-container a').css({
          'cursor': 'not-allowed',
          'pointer-events': 'none'
        });
        $('td.pad a').css({
          'cursor': 'not-allowed',
          'pointer-events': 'none'
        });
    
        $('tbody').addClass('preview-shown')

        $('td a').css({
          'cursor': 'not-allowed',
          'pointer-events': 'none'
        });
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
    if (!this.isValidForm) {
      this.showErrorMessage("Please provide valid inputs.");
      this.referenceService.closeSweetAlert();
      return;
    }
    if (this.vanityTemplatesPartnerAnalytics) {
      this.sendmailNotify.emit({ 'item': this.selectedItem });
      this.callEventEmitter();
    }else if(this.isSendMdfRequestOptionClicked){
      this.sendMdfFundRequestEmail();
    }else if(this.campaignSendTestEmail){
      this.sendCampaignTestEmail();
    }else{
      this.sendTestEmail();
    }
    
  
  }


  /***XNFR-832****/
  sendMdfFundRequestEmail() {
    this.authenticationService.sendMdfFundRequestEmail(this.sendTestEmailDto).subscribe(
      response => {
        this.referenceService.showSweetAlertSuccessMessage(response.message);
        this.callEventEmitter();
      }, error => {
        this.showErrorMessage("Unable to send MDF request email.Please try after some time.");
      });
  }

  /***XNFR-832****/

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
    if (this.fromEmailUserId!=undefined && this.fromEmailUserId>0) {
      this.referenceService.previewUnLaunchedCampaignEmailTemplateUsingFromEmailUserIdInNewTab(this.id,this.fromEmailUserId);
    } else {
      this.referenceService.previewEmailTemplateInNewTab(this.id);
    }
  }

}
