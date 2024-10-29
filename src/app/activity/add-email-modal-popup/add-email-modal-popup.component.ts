import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { EmailActivityService } from '../services/email-activity-service';
import { ReferenceService } from 'app/core/services/reference.service';
import { EmailActivity } from '../models/email-activity-dto';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Properties } from 'app/common/models/properties';
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
  @Input() isReloadEmailActivityTab:boolean;
  @Output() notifySubmitSuccess = new EventEmitter();
  @Output() notifyClose = new EventEmitter();

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

  constructor(public emailActivityService: EmailActivityService, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public properties:Properties) {}

  ngOnInit() {
    this.emailActivity.userId = this.userId;
    this.ckeConfig = this.properties.ckEditorConfig;
    if (this.actionType == 'add') {
      this.isPreview = false;
      this.emailActivity.toEmailId = this.userEmailId;
      this.emailActivity.senderEmailId = this.authenticationService.getUserName();
      // $('#addEmailModalPopup').modal('show');
      this.referenceService.openModalPopup('addEmailModalPopup');
    } else if (this.actionType == 'view') {
      this.isPreview = true;
      this.fetchEmailActivityById();
      // $('#addEmailModalPopup').modal('show');
      this.referenceService.openModalPopup('addEmailModalPopup');
    }
  }

  sendEmailToUser() {
    this.ngxLoading = true;
    this.emailActivityService.sendEmailToUser(this.emailActivity).subscribe(
      data => {
        this.ngxLoading = false;
        $('#addEmailModalPopup').modal('hide');
        this.notifySubmitSuccess.emit(!this.isReloadEmailActivityTab);
      }, error => {
        this.ngxLoading = false;
        this.closeEmailModal();
      }
    )
  }

  closeEmailModal() {
    this.isPreview = false;
    this.actionType = '';
    // $('#addEmailModalPopup').modal('hide');
    this.referenceService.closeModalPopup('addEmailModalPopup');
    this.notifyClose.emit();
  }

  validateEmail() {
    if (this.referenceService.validateCkEditorDescription(this.emailActivity.body) &&
      this.emailActivity.subject != undefined && this.emailActivity.subject.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ")) {
      this.isValidEmail = true;
    } else {
      this.isValidEmail = false;
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

  closeTestMailPopup() {
    this.isTestMail = false;
  }

  sendTestEmail() {
    this.testEmailLoading = true;
    this.emailActivity.toEmailId = this.testToEmailId;
    this.emailActivityService.sendTestEmailToUser(this.emailActivity).subscribe(
      data => {
        this.emailActivity.toEmailId = this.userEmailId;
        this.showTestMailSubmittedStatus();
        this.testEmailLoading = false;
      }, error => {
        this.testEmailLoading = false;
      }
    )
  }

  validateTestEmailId() {
    if (this.referenceService.validateEmailId(this.testToEmailId)) {
      this.isValidTestEmailId = true;
    } else {
      this.isValidTestEmailId = false;
    }
  }
  
}
