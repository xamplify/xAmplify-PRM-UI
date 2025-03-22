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
import { tap } from 'rxjs/operators';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { ContactService } from 'app/contacts/services/contact.service';
import { SendTestEmailDto } from 'app/common/models/send-test-email-dto';
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

  constructor(public emailActivityService: EmailActivityService, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public properties:Properties, public contactService: ContactService) {}

  ngOnInit() {
    this.emailActivity.userId = this.userId;
    this.ckeConfig = this.properties.ckEditorConfig;
    if (this.actionType == 'add') {
      this.isPreview = false;
      this.emailActivity.toEmailId = this.userEmailId;
      this.emailActivity.senderEmailId = this.authenticationService.getUserName();
      this.referenceService.openModalPopup('addEmailModalPopup');
    } else if (this.actionType == 'view') {
      this.isPreview = true;
      this.fetchEmailActivityById();
      this.referenceService.openModalPopup('addEmailModalPopup');
    } else if (this.actionType == 'oliveAi') {
      this.isPreview = false;
      this.referenceService.openModalPopup('addEmailModalPopup');
      this.emailActivity.senderEmailId = this.authenticationService.getUserName();
      this.emailActivity.userId = this.authenticationService.getUserId();
      this.emailActivity.contactId = this.authenticationService.getUserId();
      this.emailActivity.body = this.emailBody;
      if (this.subjectText != undefined) {
        this.emailActivity.subject = this.subjectText;
        this.isValidEmail = true;
      }
      this.OliveAi = true;
    }
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
  ngOnDestroy(){
    $('#addEmailModalPopup').modal('hide');
  }
  
  sendEmailToUser() {
    if (this.OliveAi) {
      this.ngxLoading = true;
      this.sendTestEmailDto.body = this.emailBody;
      this.sendTestEmailDto.toEmail = this.emailActivity.toEmailId;
      this.sendTestEmailDto.subject = this.emailActivity.subject;
      this.sendTestEmailDto.showAlert = false;
      this.authenticationService.sendTestEmail(this.sendTestEmailDto).subscribe(
        response => {
          this.ngxLoading = false;
          this.notifyClose.emit("Email sent sucessfully");
          this.customResponse = new CustomResponse('SUCCESS', "Email sent sucessfully", true);
        }, error => {
          this.ngxLoading = false;
        });
    } else {
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
    if (this.referenceService.validateCkEditorDescription(trimmedDescription) && isValidContactId &&
      this.emailActivity.subject != undefined && this.emailActivity.subject.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ")) {
      this.isValidEmail = true;
    } else {
      this.isValidEmail = false;
    }
		let isInValidDescription = $.trim(trimmedDescription) != undefined && $.trim(trimmedDescription).length > 4999;
    if (isInValidDescription) {
      this.showCkEditorLimitErrorMessage = true;
    } else {
      this.showCkEditorLimitErrorMessage = false;
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
        this.testMailFormData.delete("uploadedFiles");
      }
    )
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
    var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
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
      if (isPaste) { return Observable.throw(this.errorMessages['must_be_email']); }
      else { return Observable.of('').pipe(tap(() => setTimeout(() => this.tagInput.setInputValue(tag)))); }
    }
    this.addFirstAttemptFailed = false;
    return Observable.of(tag);
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
    this.contactService.fetchUsersForCompanyJourney(this.userId).subscribe(
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
  
}
