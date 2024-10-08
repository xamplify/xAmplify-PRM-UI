import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { EmailActivitySevice } from '../services/email-activity-service';
import { ReferenceService } from 'app/core/services/reference.service';
import { EmailActivity } from '../models/email-activity-dto';
import { AuthenticationService } from 'app/core/services/authentication.service';
declare var $:any;

@Component({
  selector: 'app-add-email-modal-popup',
  templateUrl: './add-email-modal-popup.component.html',
  styleUrls: ['./add-email-modal-popup.component.css'],
  providers: [EmailActivitySevice]
})
export class AddEmailModalPopupComponent implements OnInit {

  @Input() userId:any;
  @Input() actionType:string;
  @Input() userEmailId:string;
  @Output() notifySubmitSuccess = new EventEmitter();
  @Output() notifyClose = new EventEmitter();

  emailActivity:EmailActivity = new EmailActivity();
  customResponse:CustomResponse = new CustomResponse();
  isValidationMessage:boolean = false;
  isError:boolean = false;
  isPreview:boolean = false;
  ngxLoading:boolean = false;
  loggedInUserId: number;
  isValidEmail: boolean;

  constructor(public emailActivityService: EmailActivitySevice, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService) {
      this.loggedInUserId = this.authenticationService.getUserId();
     }

  ngOnInit() {
    this.emailActivity.loggedInUserId = this.loggedInUserId;
    this.emailActivity.userId = this.userId;
    if (this.actionType == 'add') {
      this.emailActivity.toEmailId = this.userEmailId;
      $('#addEmailModalPopup').modal('show');
    } else {
      this.isPreview = true;
    }
  }

  sendEmailToUser() {
    this.ngxLoading = true;
    this.emailActivityService.sendEmailToUser(this.emailActivity).subscribe(
      data => {
        this.ngxLoading = false;
        $('#addEmailModalPopup').modal('hide');
        this.notifySubmitSuccess.emit(data.message);
      }, error => {
        this.ngxLoading = false;
        this.closeEmailModal();
      }
    )
  }

  closeEmailModal() {
    $('#addEmailModalPopup').modal('hide');
    this.notifyClose.emit();
  }

  validateEmail() {
    if (this.emailActivity.body.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") && this.emailActivity.subject.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ")) {
      this.isValidEmail = true;
    } else {
      this.isValidEmail = false;
    }
  }
  
}
