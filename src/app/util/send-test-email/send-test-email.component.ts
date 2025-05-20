import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SendTestEmailDto } from 'app/common/models/send-test-email-dto';
import { ActivatedRoute } from '@angular/router';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { CampaignMdfRequestsEmailsSentHistoryComponent } from '../campaign-mdf-requests-emails-sent-history/campaign-mdf-requests-emails-sent-history.component';
import { DuplicateMdfRequest } from 'app/campaigns/models/duplicate-mdf-request';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import { tap} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
declare var $: any, swal:any;
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
  @Input() sendSignatureRemainder: boolean; 
  
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
  selectedEmailTemplateId: any;

  /**XNFR-832***/
  @Input() moduleName = "";
  @Input() campaignName="";
  @Input() campaignId = 0;
  isSendMdfRequestOptionClicked = false;
  @Input() teamMemberReminder: boolean; 
  @Input() selectedItemTeamMember : any;
  @Output() sendmailTeamMemberNotify =new EventEmitter
  @Output() sendTestEmailComponentTeamMemberEventEmitter = new EventEmitter();
  @Input() selectedPartners : any;
  @ViewChild('campaignMdfRequestsEmailsSentHistoryComponent') campaignMdfRequestsEmailsSentHistoryComponent: CampaignMdfRequestsEmailsSentHistoryComponent;
  @ViewChild('tagInput') tagInput: SourceTagInput;
  duplicateMdfRequestDto:DuplicateMdfRequest = new DuplicateMdfRequest();
  ngxloading = false;
  activateNowItems: any[]= [];
  registerNowItems: any[]= [];
  tabsEnabled: boolean = false;

  /***** XNFR-970 *****/
  @Input() isLeadOptionClicked: boolean = false;
  leadStatusModalId: string = 'LEAD-STATUS-REMINDER-MODAL-POPUP';
  emailBodyHtml: any;
/***** XNFR-972 *****/
  @Input() allPartnerDomains: string[] = [];
  @Input() isFromDomainWhiteListing: false;
  @Input() pagedItems: any[];
  onAddedFunc = this.beforeAdd.bind(this);
  addFirstAttemptFailed = false;
  errorMessages = { 'must_be_email': 'Please be sure to use a valid email format',
    'invalid_domain': 'Email domain is not allowed'
   };
  validators = [this.mustBeEmail.bind(this)];

  constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService, public properties: Properties, 
    private activatedRoute: ActivatedRoute, private vanityURLService: VanityURLService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.processing = true;
    this.headerTitle = this.templateName;
    this.sendTestEmailDto.subject = this.subject;
    this.sendTestEmailDto.fromEmail = this.fromEmail;
    this.sendTestEmailDto.fromName = this.fromName;
    this.isSendMdfRequestOptionClicked = XAMPLIFY_CONSTANTS.unlockMdfFunding==this.moduleName;
    if (!this.isLeadOptionClicked) {
      this.referenceService.openModalPopup(this.modalPopupId);
    }
    $('#sendTestEmailHtmlBody').val('');
    this.tabsEnabled = false;
    if(this.sendSignatureRemainder){
      this.getVanityEmailTemplateForParterSignatureRemainder()
    }else if(this.vanityTemplatesPartnerAnalytics && this.id !== undefined && this.id!=0 ){
      this.getVanityEmailTemplatesPartnerAnalytics();
    }else if(this.isSendMdfRequestOptionClicked){
      this.headerTitle = "Unlock MDF Funds for Your Campaign";
      this.getFundingTemplateHtmlBody();
    }else if(this.teamMemberReminder){
      this.getVanityEmailTemplatesPartnerAnalytics();
    }else if(this.vanityTemplatesPartnerAnalytics &&(this.id==undefined || this.id==0)){
      this.activeTab('registerNow'); 
      this.tabsEnabled = true;
    }else if (this.isLeadOptionClicked) {
      this.findSendReminderLeadEmailTemplate();
    }else if(this.isFromDomainWhiteListing){
      this.findWelcomeMailTemplate();
    } else {
      this.getTemplateHtmlBodyAndMergeTagsInfo();
    }
  }
  ngOnDestroy(){
    $('td a').css({
      'cursor': '',
      'pointer-events': ''
    });
    this.referenceService.closeModalPopup(this.modalPopupId);
    this.closeModalPopup();
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
        this.processEmailTemplate(response);
        
      }, error => {
        this.processing = false;
        this.callEventEmitter();
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
  }

  private processEmailTemplate(response: any) {
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
    $('#sendTestEmailHtmlBody').html('');
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

    $('tbody').addClass('preview-shown');

    $('td a').css({
      'cursor': 'not-allowed',
      'pointer-events': 'none'
    });
    $('tbody td').css({
      'background-color': 'inherit'
    });
    $('table tbody').css({
      'background-color': 'inherit'
    });
    this.processing = false;
  }

  send() {
    if (!this.isValidForm) {
      this.showErrorMessage("Please provide valid inputs.");
      this.referenceService.closeSweetAlert();
      return;
    }
    if (this.vanityTemplatesPartnerAnalytics || this.sendSignatureRemainder) {
      if(this.vanityTemplatesPartnerAnalytics){
        this.referenceService.showSweetAlertProcessingLoader("We are sending the email");
      }
      this.sendmailNotify.emit({ 'item': this.selectedItem });
      this.callEventEmitter();
    }else if(this.isSendMdfRequestOptionClicked){
      this.sendMdfFundRequestEmail();
    }else if(this.teamMemberReminder){
      this.sendmailTeamMemberNotify.emit({'item': this.selectedItemTeamMember });
      this.callEventEmitter();
    }else if(this.campaignSendTestEmail){
      this.referenceService.showSweetAlertProcessingLoader("We are sending the email");
      this.sendCampaignTestEmail();
    }else if(this.isFromDomainWhiteListing){
      this.referenceService.showSweetAlertProcessingLoader("We are sending the email");
      this.sendWelcomeMailRemainder();
    }else{
      this.referenceService.showSweetAlertProcessingLoader("We are sending the email");
      this.sendTestEmail();
    }
    
  
  }

   validateCampaignMdfRequest(){
    this.duplicateMdfRequestDto.campaignId = this.campaignId;
    this.duplicateMdfRequestDto.emailAddress = this.sendTestEmailDto.toEmail;
    this.authenticationService.validateDuplicateMdfRequest(this.duplicateMdfRequestDto).subscribe(
      response=>{
        this.ngxloading = false;
        let isDuplicateMdfRequest = response.data;
        if(isDuplicateMdfRequest){
          this.showSweetAlertConfirmation();
        }else{
          this.sendMdfFundRequestEmail();
        }
      },error=>{
        this.ngxloading = false;
        this.sendMdfFundRequestEmail();
      }
    );
   }

   showSweetAlertConfirmation(){
    let self = this;
			swal({
				title: 'Are you sure?',
				text: "An email has already been sent. Do you want to resend it?",
				type: 'info',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: "Yes, Send it",
        allowOutsideClick: false,
        allowEscapeKey: false
			}).then(function () {
        self.sendMdfFundRequestEmail();
			}, function (_dismiss: any) {
        self.clicked = false;
			});
  }


  /***XNFR-832****/
  sendMdfFundRequestEmail() {
    this.referenceService.showSweetAlertProcessingLoader("We are sending the email");
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
    this.sendTestEmailComponentTeamMemberEventEmitter.emit();
  }

  previewEmailTemplate() {
    if (this.fromEmailUserId!=undefined && this.fromEmailUserId>0) {
      this.referenceService.previewUnLaunchedCampaignEmailTemplateUsingFromEmailUserIdInNewTab(this.id,this.fromEmailUserId);
    } else {
      this.referenceService.previewEmailTemplateInNewTab(this.id);
    }
  }

  openCampaignMdfRequestHistoryModalPopup(){
    this.campaignMdfRequestsEmailsSentHistoryComponent.openModalPopup(this.campaignId);
  }

  activeTab(tabName: string) {
    if (this.selectedItem) {
      let selectedItemsArray = Array.isArray(this.selectedItem)
        ? this.selectedItem
        : [this.selectedItem];

      this.registerNowItems = [];
      this.activateNowItems = [];

      selectedItemsArray.forEach((item: any) => {
        if (item.password == null || item.password == undefined) {
          this.registerNowItems.push(item);
        } else {
          this.activateNowItems.push(item);
        }
      });
    }
    let isPrm = this.authenticationService.module.isPrm;
    let isTeamMember = this.authenticationService.module.isTeamMember;

    let vanityCheck = Array.isArray(this.selectedItem)
      ? this.selectedItem.some((item: any) => item.vanityUrlDomain)
      : this.selectedItem.vanityUrlDomain;

    const hasRegisterItems = tabName === 'registerNow' && this.registerNowItems.length > 0;
    const hasActivateItems = tabName === 'activateNow' || (tabName === 'registerNow' && this.registerNowItems.length === 0 && this.activateNowItems.length > 0);

    if (hasRegisterItems) {
      this.toEmailId = this.registerNowItems.map(item => item.emailId).join(', ');
      if (isPrm || isTeamMember) {
        this.id = vanityCheck ? 14 : 1178;
      } else {
        this.id = vanityCheck ? 4 : 638;
      }
    } else if (hasActivateItems) {
      this.toEmailId = this.activateNowItems.map(item => item.emailId).join(', ');
      if (isPrm) {
        this.id = vanityCheck ? 2 : 405;
      } else {
        this.id = vanityCheck ? 2 : 405;
      }

    } else {
      this.toEmailId = this.registerNowItems.map(item => item.emailId).join(', ');
      if (isPrm || isTeamMember) {
        this.id = vanityCheck ? 14 : 1178;
      } else {
        this.id = vanityCheck ? 4 : 638;
      }
    }
    this.getVanityEmailTemplatesPartnerAnalytics();
  }

  getVanityEmailTemplateForParterSignatureRemainder() {
    this.processing = true;
    this.vanityURLService.getPartnerRemainderTemplate().subscribe(
      response => {
        this.processEmailTemplate(response);
        
      }, error => {
        this.processing = false;
        this.callEventEmitter();
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
  }

  /***** XNFR-970 *****/
  findSendReminderLeadEmailTemplate() {
    this.processing = true;
    this.headerTitle = "Send Reminder";
    this.sendTestEmailDto = new SendTestEmailDto();
    this.referenceService.openModalPopup(this.leadStatusModalId);
    this.vanityURLService.findSendReminderLeadEmailTemplate(this.toEmailId).subscribe(
      response => {
        if (response.statusCode === 200) {
          let data = response.data;
          this.sendTestEmailDto.id = this.id;
          this.sendTestEmailDto.body = data.body;
          this.sendTestEmailDto.subject = data.subject;
          this.sendTestEmailDto.toEmailIds = data.toEmailIds;
          this.sendTestEmailDto.ccEmailIds = data.ccEmailIds;
          this.emailBodyHtml = this.sanitizer.bypassSecurityTrustHtml(data.body);
          this.processing = false;
        } else if (response.statusCode === 401) {
          this.processing = false;
          this.closeModalPopup();
          this.referenceService.showSweetAlertServerErrorMessage();
        }
      }, error => {
        this.processing = false;
        this.closeModalPopup();
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
  }

  findWelcomeMailTemplate() {
    this.processing = true;
    this.vanityURLService.getWelcomeTemplateForPartnerDomainWhitelisting().subscribe(
      response => {
        this.processEmailTemplate(response);
      }, error => {
        this.processing = false;
        this.callEventEmitter();
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
  }
  /***** XNFR-970 *****/
  closeModalPopup() {
    this.id = 0;
    this.processing = false;
    this.sendTestEmailDto = new SendTestEmailDto();
    this.referenceService.closeModalPopup(this.leadStatusModalId);
    this.referenceService.closeModalPopup(this.modalPopupId);
    this.sendTestEmailComponentEventEmitter.emit();
  }

  /***** XNFR-970 *****/
  sendReminderLeadEmail() {
    this.processing = true;
    this.sendTestEmailDto.loggedInUserId = this.authenticationService.getUserId();
    this.sendTestEmailDto.companyProfileName = this.authenticationService.companyProfileName;
    this.vanityURLService.sendReminderLeadEmail(this.sendTestEmailDto).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.processing = false;
          this.closeModalPopup();
          this.referenceService.showSweetAlertSuccessMessage('Email sent successfully.');
        } else if (response.statusCode === 401) {
          this.processing = false;
          this.referenceService.showSweetAlertServerErrorMessage();
        }
      }, error => {
        this.processing = false;
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
  }

  /***** XNFR-970 *****/
  onEmailSelected(event: any): void {
    if (!this.sendTestEmailDto.toEmailIds.includes(event.itemData)) {
      this.sendTestEmailDto.toEmailIds.push(event.itemData);
    }
  }

  /***** XNFR-970 *****/
  onEmailRemoved(event: any): void {
    this.sendTestEmailDto.toEmailIds = this.sendTestEmailDto.toEmailIds.filter(
      (item: any) => item !== event.itemData
    );
  }

  sendWelcomeMailRemainder(){
    this.processing = true;
    this.sendTestEmailDto.toEmailIds = (this.sendTestEmailDto.toEmailIds || []).map(tag => tag.value);
    this.sendTestEmailDto.loggedInUserId = this.authenticationService.getUserId();
    this.sendTestEmailDto.companyProfileName = this.authenticationService.companyProfileName;
    this.vanityURLService.sendWelcomeEmail(this.sendTestEmailDto).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.processing = false;
          this.callEventEmitter();
          this.referenceService.showSweetAlertSuccessMessage('Email sent successfully.');
        } else if (response.statusCode === 401) {
          this.processing = false;
          this.referenceService.showSweetAlertServerErrorMessage();
        }
      }, error => {
        this.processing = false;
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
  }
   private isValidEmail(text: string): boolean {
    const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
    return text ? EMAIL_REGEXP.test(text) : false;
  }

 beforeAdd(tag: any): Observable<any> {
    const isPaste = !!tag['value'];
    const emailTag = isPaste ? tag.value : tag;
    if (!this.isValidEmail(emailTag)) {
      return this.handleInvalidEmail(emailTag, isPaste, this.errorMessages['must_be_email']);
    }
    if (!this.isAllowedDomain(emailTag)) {
    return this.handleInvalidEmail(emailTag, isPaste, this.errorMessages['invalid_domain']);
  }
    this.addFirstAttemptFailed = false;
    return Observable.of(emailTag);
  }

  private handleInvalidEmail(tag: string, isPaste: boolean, message: string): Observable<any> {
    if (!this.addFirstAttemptFailed) {
      this.addFirstAttemptFailed = true;
      if (!isPaste) {
        this.tagInput.setInputValue(tag);
      }
    }
    return isPaste ? Observable.throw(message)
      : Observable.of('').pipe(tap(() => setTimeout(() => this.tagInput.setInputValue(tag))));
  }

  mustBeEmail(control: FormControl): { [key: string]: boolean } | null {
    const email = control.value;

    if (this.addFirstAttemptFailed && !this.isValidEmail(email)) {
      return { "must_be_email": true };
    }

    if (this.isValidEmail(email)) {
      const domain = email.substring(email.lastIndexOf('@') + 1).toLowerCase().trim();
      const allowedDomains = (this.allPartnerDomains || [])
        .map(function (d) { return d ? d.toLowerCase().trim() : ''; });

      if (allowedDomains.indexOf(domain) === -1) {
        return { "invalid_domain": true };
      }
    }

    return null;
  }

  private isAllowedDomain(email: string): boolean {
    if (!email || email.indexOf('@') === -1 || !this.allPartnerDomains) {
      return false;
    }

    const emailDomain = email.split('@')[1].toLowerCase().trim();

    for (var i = 0; i < this.allPartnerDomains.length; i++) {
      var domain = this.allPartnerDomains[i];
      if (domain && domain.toLowerCase().trim() === emailDomain) {
        return true;
      }
    }

    return false;
  }

}
