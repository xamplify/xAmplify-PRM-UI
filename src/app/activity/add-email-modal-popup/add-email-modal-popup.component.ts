import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { EmailActivityService } from '../services/email-activity-service';
import { ReferenceService } from 'app/core/services/reference.service';
import { EmailActivity } from '../models/email-activity-dto';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Properties } from 'app/common/models/properties';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import { combineAll, tap } from 'rxjs/operators';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { ContactService } from 'app/contacts/services/contact.service';
import { SendTestEmailDto } from 'app/common/models/send-test-email-dto';
import { SortOption } from 'app/core/models/sort-option';
import { Pagination } from 'app/core/models/pagination';
import { EmailTemplateType } from 'app/email-template/models/email-template-type';
import { PagerService } from 'app/core/services/pager.service';
import { EmailRequestDto } from 'app/outlook-email/models/email-request-dto';
import { OutlookEmailService } from 'app/outlook-email/outlook-email.service';
declare var $:any, CKEDITOR:any;

@Component({
  selector: 'app-add-email-modal-popup',
  templateUrl: './add-email-modal-popup.component.html',
  styleUrls: ['./add-email-modal-popup.component.css'],
  providers: [EmailActivityService, Properties]
})
export class AddEmailModalPopupComponent implements OnInit {

  @Input() userId:any;
  @Input() actionType:string;
  @Input() userEmailId:string;
  @Input() emailActivityId:number;
  @Input() isCompanyJourney:boolean = false;
  @Input() selectedUserListId:any;
  @Input() isReloadEmailActivityTab:boolean;
  @Output() notifySubmitSuccess = new EventEmitter();
  @Output() notifyClose = new EventEmitter();
  @Output() notifySubmitFailed = new EventEmitter();
  @Input() emailBody :string;
  @Input() subjectText : string;
  /*****XNFR-1105  ****/
  @Input() accessToken: string;
  @Input() authenticateEmailId: string;
  @Input() type: string;
  @Input() messages:any
  composeMail:boolean;
  composeMailDto: EmailRequestDto = new EmailRequestDto();
  replyMail:boolean;
  /*** XNFR-1105 */
  emailActivity:EmailActivity = new EmailActivity();
  customResponse:CustomResponse = new CustomResponse();
  isPreview:boolean = false;
  ngxLoading:boolean = false;
  isValidEmail: boolean = false;
  testToEmailId: string;
  testEmailLoading: boolean = false;
  isValidTestEmailId: boolean = false;
  isTestMail: boolean = false;
  ckeConfig = {};
  public validators = [this.must_be_email.bind(this)];
  addFirstAttemptFailed: boolean = false;
  public errorMessages = { 'must_be_email': 'Please be sure to use a valid email format' };
  public onAddedFunc = this.beforeAdd.bind(this);
  tagInput: SourceTagInput;
  ccEmailIds = [];
  bccEmailIds = [];
  files: File[] = [];
  formData: any = new FormData();
  showAttachmentErrorMessage: boolean = false;
  showFilePathError: boolean = false;
  restrictedFileTypes = ["exe"];
  showFileTypeError: boolean = false;
  showCCEmailInputField:boolean = false;
  showBCCEmailInputField:boolean = false;
  showCkEditorLimitErrorMessage:boolean = false;
  userListUsersLoader: HttpRequestLoader = new HttpRequestLoader();
  dropdownSettings = {};
  userListUsersData = [];
  userIds = [];
  users = [];
  testMailFormData: any = new FormData();
  OliveAi: boolean;
  sendTestEmailDto: SendTestEmailDto = new SendTestEmailDto();
  toEmailIds = [];
  isValidToEmailId: boolean = true;
  isEmailTemplateActivated: boolean = false;
  emailTemplatesSortOption:SortOption = new SortOption();
  emailTemplatesPagination = new Pagination();
  emailTemplateLoader: boolean;
  selectedEmailTemplateRow = 0;
  activationLoaderEnabled: boolean = false;
  isValidToShowChooseTemplate: boolean = false;
  
  constructor(public emailActivityService: EmailActivityService, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public properties:Properties, public contactService: ContactService, private pagerService: PagerService,private outlookEmailService: OutlookEmailService) {}

  ngOnInit() {
    this.emailActivity.userId = this.userId;
    this.ckeConfig = this.properties.ckEditorConfig;
    this.isValidToShowChooseTemplate = this.authenticationService.isOrgAdmin() || this.authenticationService.isOrgAdminTeamMember || this.authenticationService.module.isMarketingCompany || this.authenticationService.module.isVendor || this.authenticationService.module.isVendorTierTeamMember;
    if (this.actionType == 'add') {
      this.isPreview = false;
      this.emailActivity.toEmailId = this.userEmailId;
      this.emailActivity.senderEmailId = this.authenticationService.getUserName();
      this.referenceService.openModalPopup('addEmailModalPopup');
      this.emailTemplatesPagination.maxResults = 4;
      this.emailTemplatesPagination.pageIndex = 1;
      this.findEmailTemplates(this.emailTemplatesPagination);
    } else if (this.actionType == 'view') {
      this.isPreview = true;
      this.fetchEmailActivityById();
      this.referenceService.openModalPopup('addEmailModalPopup');
    } else if (this.actionType == 'oliveAi') {
      this.isPreview = false;
      this.composeMail = false;//XNFR-1105
      this.replyMail = false;
      this.referenceService.openModalPopup('addEmailModalPopup');
      this.emailActivity.senderEmailId = this.authenticationService.getUserName();
      this.emailActivity.userId = this.authenticationService.getUserId();
      this.emailActivity.contactId = this.authenticationService.getUserId();
      this.emailActivity.body = this.emailBody;
      if (this.subjectText != undefined && this.subjectText != "") {
        this.emailActivity.subject = this.subjectText;
        this.isValidEmail = true;
        this.isValidToEmailId = false;
      }
      this.OliveAi = true;
    } 
    /*** XNFR-1105 */
    else if (this.actionType === 'NewMail') { //XNFR-1105
      this.isPreview = false;
      this.OliveAi = false;
      this.referenceService.openModalPopup('addEmailModalPopup');
      this.emailActivity.senderEmailId = this.authenticateEmailId;
      this.composeMail = true;
      this.replyMail = false;
    } else if (this.actionType === 'replytoall' || this.actionType === 'reply') {
      this.isPreview = false;
      this.OliveAi = false;
      this.referenceService.openModalPopup('addEmailModalPopup');
      if (this.messages && Array.isArray(this.messages.labelIds) &&
        this.messages.labelIds.some((label: string) => label.toLowerCase() === 'inbox')) {
        this.toEmailIds = this.extractEmailIds(this.messages.to);
      } else {
        this.toEmailIds = this.extractEmailIds(this.messages.toEmailIds);
      }
      if (this.actionType === 'replytoall') {
        if (this.messages && this.messages.ccEmailIds.length > 0) {
          this.showCCEmailInputField = true;
          this.ccEmailIds = this.extractEmailIds(this.messages.ccEmailIds);
        }
        if (this.messages && this.messages.bccEmailIds.length > 0) {
          this.showBCCEmailInputField = true;
          this.bccEmailIds = this.extractEmailIds(this.messages.bccEmailIds);
        }
      }
      this.emailActivity.subject = this.messages.subject;
      this.emailActivity.senderEmailId = this.messages.from;
      this.composeMail = false;
      this.replyMail = true;
    } else if (this.actionType === 'forward') {
      this.isPreview = false;
      this.OliveAi = false;
      this.composeMail = false;
      this.referenceService.openModalPopup('addEmailModalPopup');
      this.emailActivity.subject = this.messages.subject;
      this.emailActivity.senderEmailId = this.messages.from;
      this.replyMail = true;
    }
    /*** XNFR-1105 */
    if (this.isCompanyJourney) {
      this.fetchUsersForCompanyJourney();
      this.dropdownSettings = {
        singleSelection: false,
        text: "Please select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: "myclass custom-class"
      };
    }
  }

  ngAfterViewInit() {
    $('#chatIconImage').hide();
  }


  ngOnDestroy() {
    this.isValidEmail = false;
    $('#chatIconImage').show();
    $('#addEmailModalPopup').modal('hide');
  }
  
  sendEmailToUser() {
    if (this.OliveAi) {
      if(this.toEmailIds != undefined && this.toEmailIds.length > 0) {
        this.isValidToEmailId = true;
      this.ngxLoading = true;
      this.sendTestEmailDto.body = this.emailActivity.body;
      this.sendTestEmailDto.toEmail = this.emailActivity.toEmailId;
      this.sendTestEmailDto.subject = this.emailActivity.subject;
      this.sendTestEmailDto.showAlert = false;
      this.sendTestEmailDto.toEmailIds = this.extractEmailIds(this.toEmailIds);
      this.sendTestEmailDto.ccEmailIds = this.extractEmailIds(this.ccEmailIds);
      this.sendTestEmailDto.bccEmailIds = this.extractEmailIds(this.bccEmailIds);
      this.prepareFormData();
      this.authenticationService.sendEmailToUser(this.sendTestEmailDto,this.formData).subscribe(
        response => {
          this.ngxLoading = false;
          this.notifyClose.emit("Email sent sucessfully");
          this.customResponse = new CustomResponse('SUCCESS', "Email sent sucessfully", true);
        }, error => {
          this.ngxLoading = false;
        });
      }else{
        this.isValidToEmailId = false;
        this.referenceService.showSweetAlertErrorMessage("Please enter valid email id");
      }
    } 
    /*** XNFR-1105 */
    else if (this.composeMail) { //XNFR-1105
      if (this.toEmailIds != undefined && this.toEmailIds.length > 0) {
        this.isValidToEmailId = true;
        this.ngxLoading = true;
        this.composeMailDto.bodyHtml = this.emailActivity.body;
        this.composeMailDto.toEmailIds = this.extractEmailIds(this.toEmailIds);
        this.composeMailDto.subject = this.emailActivity.subject;
        this.composeMailDto.cc = this.extractEmailIds(this.ccEmailIds);
        this.composeMailDto.bcc = this.extractEmailIds(this.bccEmailIds);
        this.composeMailDto.type = this.type.toLowerCase();
        this.composeMailDto.accessToken = this.accessToken;
        this.prepareFormData();
        this.outlookEmailService.sendOrReply(this.composeMailDto, this.formData).subscribe(
          response => {
            this.ngxLoading = false;
            if (response.statusCode === 202 || response.statusCode === 200) {
              this.notifyClose.emit("Email sent sucessfully");
              this.customResponse = new CustomResponse('SUCCESS', "Email sent sucessfully", true);
            } else {
              this.notifyClose.emit("The email delivery failed. Please try again later.");
              this.customResponse = new CustomResponse('ERROR', "The email delivery failed. Please try again later.", true);
            }
          }, error => {
            this.ngxLoading = false;
          });
      } else {
        this.isValidToEmailId = false;
        this.referenceService.showSweetAlertErrorMessage("Please enter valid email id");
      }
    } else if (this.replyMail) {
      if (this.toEmailIds != undefined && this.toEmailIds.length > 0) {
        this.isValidToEmailId = true;
        this.ngxLoading = true;
        const isForward = this.actionType === 'forward' ? true : false;
        if (isForward) {
          this.composeMailDto.toEmailIds = this.extractEmailIds(this.toEmailIds);
          this.composeMailDto.cc = this.extractEmailIds(this.ccEmailIds);
          this.composeMailDto.bcc = this.extractEmailIds(this.bccEmailIds);
        } else {
          this.composeMailDto.toEmailIds = this.toEmailIds;
          this.composeMailDto.cc = this.ccEmailIds;
          this.composeMailDto.bcc = this.bccEmailIds;
        }
        this.composeMailDto.bodyHtml = this.emailActivity.body;
        this.composeMailDto.subject = this.emailActivity.subject;
        this.composeMailDto.threadId = this.messages.threadId;
        this.composeMailDto.messageId = this.type === "OUTLOOK" ? this.messages.id : this.messages.messageId;
        this.composeMailDto.from = this.messages.from;
        this.composeMailDto.type = this.type.toLowerCase();
        this.composeMailDto.accessToken = this.accessToken;
        this.prepareFormData();
        this.outlookEmailService.replyMail(this.composeMailDto, this.formData, isForward).subscribe(
          response => {
            this.ngxLoading = false;
            if (response.statusCode === 202 || response.statusCode === 200) {
              this.notifyClose.emit("Email sent sucessfully");
              this.customResponse = new CustomResponse('SUCCESS', "Email sent sucessfully", true);
            } else {
              this.notifyClose.emit("The email delivery failed. Please try again later.");
              this.customResponse = new CustomResponse('ERROR', "The email delivery failed. Please try again later.", true);
            }
          }, error => {
            this.ngxLoading = false;
          });
      } else {
        this.isValidToEmailId = false;
        this.referenceService.showSweetAlertErrorMessage("Please enter valid email id");
      }
    } 
    /*** XNFR-1105 */
    else {
      this.ngxLoading = true;
      this.prepareFormData();
      this.emailActivity.ccEmailIds = this.extractEmailIds(this.ccEmailIds);
      this.emailActivity.bccEmailIds = this.extractEmailIds(this.bccEmailIds);
      if (this.isCompanyJourney) {
        this.emailActivity.userIds = this.userIds.map(user => user.id);
        this.emailActivity.isCompanyJourney = this.isCompanyJourney;
      } else {
        this.emailActivity.userIds.push(this.userId);
      }
      this.emailActivityService.sendEmailToUser(this.emailActivity, this.formData).subscribe(
        data => {
          this.ngxLoading = false;
          $('#addEmailModalPopup').modal('hide');
          this.notifySubmitSuccess.emit(!this.isReloadEmailActivityTab);
        }, error => {
          this.ngxLoading = false;
          this.notifySubmitFailed.emit(!this.isReloadEmailActivityTab);
          this.closeEmailModal();
        }
      )
    }
  }

  private extractEmailIds(emailList: any[]): string[] {
    return emailList.map(email => email.value);
  }

  closeEmailModal() {
    this.isPreview = false;
    this.actionType = '';
    this.OliveAi = false;
    // $('#addEmailModalPopup').modal('hide');
    this.referenceService.closeModalPopup('addEmailModalPopup');
    this.notifyClose.emit();
  }

  validateEmail() {
    let trimmedDescription = this.referenceService.getTrimmedCkEditorDescription(this.emailActivity.body);
    let isValidContactId = this.isCompanyJourney ? (this.userIds != undefined && this.userIds.length > 0) : true;
    let isValidDescription = (this.referenceService.validateCkEditorDescription(trimmedDescription) && trimmedDescription != "<p></p>") || this.isEmailTemplateActivated;
    let isValidSubject = this.emailActivity.subject != undefined && this.emailActivity.subject.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ");
    if (isValidDescription && isValidContactId && isValidSubject) {
      this.isValidEmail = true;
    } else {
      this.isValidEmail = false;
    }
		let isInValidDescription = $.trim(trimmedDescription) != undefined && $.trim(trimmedDescription).length > 4999;
    if (isInValidDescription && !this.isEmailTemplateActivated) {
      this.showCkEditorLimitErrorMessage = true;
    } else {
      this.showCkEditorLimitErrorMessage = false;
    }
    if (this.isEmailTemplateActivated) {
      this.isValidEmail = this.isValidEmail && this.emailActivity.templateId != undefined && this.emailActivity.templateId > 0;
    }
    if(this.OliveAi){
      if(this.toEmailIds != undefined && this.toEmailIds.length > 0) {
        this.isValidToEmailId = true;
      }else{
        this.isValidToEmailId = false;
      }
    }
  }

  fetchEmailActivityById() {
    this.ngxLoading = true;
    this.emailActivityService.fetchEmailActivityById(this.emailActivityId).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.emailActivity = data.data;
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
      }
    )
  }

  sendTestEmailToUser() {
    this.isTestMail = true;
  }

  showTestMailSubmittedStatus() {
    this.isTestMail = false;
    this.referenceService.showSweetAlertSuccessMessage(this.properties.emailSendSuccessResponseMessage);
  }

  showTestMailErrorStatus() {
    this.isTestMail = false;
    this.referenceService.showSweetAlertErrorMessage(this.properties.serverErrorMessage);
  }

  closeTestMailPopup() {
    this.isTestMail = false;
  }

  sendTestEmail() {
    if (this.OliveAi) {
      this.testEmailLoading = true;
      this.sendTestEmailDto.body = this.emailActivity.body;
      this.sendTestEmailDto.toEmail = this.testToEmailId;
      this.sendTestEmailDto.subject = this.emailActivity.subject;
      this.sendTestEmailDto.showAlert = false;
      this.prepareFormData();
      this.sendTestEmailDto.toEmailIds = this.extractEmailIds(this.toEmailIds);
      this.sendTestEmailDto.ccEmailIds = this.extractEmailIds(this.ccEmailIds);
      this.sendTestEmailDto.bccEmailIds = this.extractEmailIds(this.bccEmailIds);
      this.authenticationService.sendEmailToUser(this.sendTestEmailDto,this.formData).subscribe(
        response => {
          this.testEmailLoading = false;
          this.formData.delete("uploadedFile");
          this.notifyClose.emit("Email sent sucessfully");
          this.customResponse = new CustomResponse('SUCCESS', "Email sent sucessfully", true);
        }, error => {
          this.ngxLoading = false;
        });
    } else {
      this.testEmailLoading = true;
      this.prepareTestMailFormData();
      this.emailActivity.toEmailId = this.testToEmailId;
      this.emailActivity.ccEmailIds = this.extractEmailIds(this.ccEmailIds);
      this.emailActivity.bccEmailIds = this.extractEmailIds(this.bccEmailIds);
      if (this.isCompanyJourney) {
        this.emailActivity.userIds = this.userIds.map(user => user.id);
      } else {
        this.emailActivity.userIds.push(this.userId);
      }
      this.emailActivityService.sendTestEmailToUser(this.emailActivity, this.testMailFormData).subscribe(
        data => {
          this.emailActivity.toEmailId = this.userEmailId;
          this.emailActivity.userIds = [];
          this.showTestMailSubmittedStatus();
          this.testToEmailId = '';
          this.validateTestEmailId();
          this.testEmailLoading = false;
          this.testMailFormData.delete("uploadedFiles");
        }, error => {
          this.emailActivity.userIds = [];
          this.showTestMailErrorStatus();
          this.testToEmailId = '';
          this.validateTestEmailId();
          this.testEmailLoading = false;
          this.formData.delete("uploadedFile");
          this.testMailFormData.delete("uploadedFiles");
        }
      )
    }
  }

  validateTestEmailId() {
    if (this.testToEmailId != undefined && this.testToEmailId.length > 0 && this.referenceService.validateEmailId(this.testToEmailId)) {
      this.isValidTestEmailId = true;
    } else {
      this.isValidTestEmailId = false;
    }
  }

  private must_be_email(control: FormControl) {
    if (this.addFirstAttemptFailed && !this.validateCCorBCCEmail(control.value)) {
      return { "must_be_email": true };
    }
    return null;
  }

  private validateCCorBCCEmail(text: string) {
    var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    return (text && EMAIL_REGEXP.test(text));
  }

  private beforeAdd(tag: any) {
    let isPaste = false;
    if (tag['value']) { isPaste = true; tag = tag.value; }
    if (!this.validateCCorBCCEmail(tag)) {
      if (!this.addFirstAttemptFailed) {
        this.addFirstAttemptFailed = true;
        if (!isPaste) { this.tagInput.setInputValue(tag); }
      }
      if (isPaste) { this.checkToEmailId(tag);
        return Observable.throw(this.errorMessages['must_be_email']);  }
      else { this.checkToEmailId(tag);
        return Observable.of('').pipe(tap(() => setTimeout(() => this.tagInput.setInputValue(tag)))); }
    }
    this.addFirstAttemptFailed = false;
    this.checkToEmailId(tag);
    return Observable.of(tag);
  }

  private checkToEmailId(tag: any) {
    if (this.OliveAi) {
      if (this.toEmailIds != undefined && this.toEmailIds.length > 0) {
        this.isValidToEmailId = true;
      } else if (this.validateCCorBCCEmail(tag)) {
        this.isValidToEmailId = true;
      } else {
        this.isValidToEmailId = false;
      }
    }
  }

  onFileChange(event: any): void {
    const selectedFiles: FileList = event.target.files;    
    if (selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        this.files.push(selectedFiles[i]);
      }
      event.target.value = '';
      this.validateAttachments();
    }
  }

  validateAttachments() {
    let sizeInKb = 0;
    let maxFileSizeInKb = 1024 * 20;
    this.showFileTypeError = false;
    for ( let file of this.files) {
      sizeInKb = sizeInKb + (file.size / 1024);
      let fileType = this.getFileExtension(file.name);
      if (this.restrictedFileTypes.includes(fileType)) {
        this.isValidEmail = false;
        this.showFileTypeError = true;
        break;
      }
    }
    if (sizeInKb>maxFileSizeInKb) {
      this.showAttachmentErrorMessage = true;
      this.isValidEmail = false;
    } else {
      this.showAttachmentErrorMessage = false;
      this.isValidEmail = true;
    }
    this.validateEmail();
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.validateAttachments();
  }

  setUploadedFileProperties(file: File) {
    this.formData.delete("uploadedFile");
    this.formData.append("uploadedFile", file, file['name']);
  }

  prepareFormData(): void {
    this.files.forEach(file => {
      this.formData.append("uploadedFiles", file, file['name']);
    });
  }

  getFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1) : '';
  }

  fetchUsersForCompanyJourney() {
    this.referenceService.loading(this.userListUsersLoader, true);
    this.contactService.fetchUsersForCompanyJourney(this.userId, false).subscribe(
      response => {
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          this.userListUsersData = response.data;
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
        this.referenceService.loading(this.userListUsersLoader, false);
      }, error => {
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        this.referenceService.loading(this.userListUsersLoader, false);
      }
    )
  }

  getSelectedUserUserId(event) {
    this.emailActivity.userId = event != undefined ? event['id'] : 0;
    this.validateEmail();
  }

  onItemSelect(item: any) {
    this.validateEmail();
  }

  OnItemDeSelect(item: any) {
    this.validateEmail();
  }

  onSelectAll(items: any) {
    this.validateEmail();
  }

  onDeSelectAll(items: any) {
    this.validateEmail();
  }

  prepareTestMailFormData(): void {
    this.files.forEach(file => {
      this.testMailFormData.append("uploadedFiles", file, file['name']);
    });
  }

  findEmailTemplates(emailTemplatesPagination: Pagination) {
   
  }

  changeStatus(event) {
    this.activationLoaderEnabled = true;
    this.isEmailTemplateActivated = !this.isEmailTemplateActivated;
    this.validateEmail();
    this.activationLoaderEnabled = false;
  }

  searchEmailTemplates() {
    this.setSearchForEmailTemplates(this.emailTemplatesPagination, this.emailTemplatesSortOption);
  }

  setSearchForEmailTemplates(pagination: Pagination, emailTemplatesSortOption: SortOption) {
    pagination.pageIndex = 1;
    pagination.searchKey = emailTemplatesSortOption.searchKey;
    this.findEmailTemplates(pagination);
  }

  clearSearch() {

  }

  emailActivityEventHandler(eventKeyCode: number) {
    if (eventKeyCode == 13) {
      this.searchEmailTemplates();
    }
  }

  paginateEmailTempaltes(event: any) {
    this.emailTemplatesPagination.pageIndex = event.page;
    this.findEmailTemplates(this.emailTemplatesPagination);
  }

  selectEmailTemplate(emailTemplate:any) {
    this.emailActivity.templateId = emailTemplate.id;
    this.validateEmail();
  }

  previewEmailTemplate(emailTemplate: any) {
    this.referenceService.previewWorkflowEmailTemplateInNewTab(emailTemplate.id, this.authenticationService.getUserId());
  }
  
}
