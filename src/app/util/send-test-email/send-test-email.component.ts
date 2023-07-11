import { Component, OnInit,Input,Output,EventEmitter, ViewChild } from '@angular/core';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import "rxjs/add/observable/of";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { SendTestEmailDto } from 'app/common/models/send-test-email-dto';
declare var swal:any, $: any;
@Component({
  selector: 'app-send-test-email',
  templateUrl: './send-test-email.component.html',
  styleUrls: ['./send-test-email.component.css'],
  providers: [Properties]
})
export class SendTestEmailComponent implements OnInit {

  @Input() id:number = 0;
  @Input() subject:string = "";
  @Input() isPreviewEmailTemplate = false;
  @Input() templateName:string = "";
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
  sendTestEmailDto:SendTestEmailDto = new SendTestEmailDto();
  clicked = false;
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public properties:Properties) { }

  ngOnInit() {
    this.processing = true;
    this.headerTitle =  this.isPreviewEmailTemplate ? this.templateName:"Send Test Email";
    this.referenceService.openModalPopup(this.modalPopupId);
    $('#sendTestEmailHtmlBody').val('');
    this.getTemplateHtmlBodyAndMergeTagsInfo();
  }


validateForm(){
  let email = $.trim(this.sendTestEmailDto.toEmail);
  let subject = $.trim(this.sendTestEmailDto.subject);
  this.isValidSubject = subject.length>0;
  this.isValidEmailLength = email.length>0;
  this.isValidEmailFormat = this.isValidEmailLength && this.referenceService.validateEmailId(email);
  let isValidEmail = this.isValidEmailLength && this.isValidEmailFormat;
  this.isValidForm = isValidEmail && this.isValidSubject;
}

getTemplateHtmlBodyAndMergeTagsInfo(){
  this.processing = true;
  this.authenticationService.getTemplateHtmlBodyAndMergeTagsInfo(this.id).subscribe(
    response=>{
      let map = response.data;
      let htmlBody = map['emailTemplateDTO']['body'];
      let mergeTagsInfo = map['mergeTagsInfo'];
      htmlBody = this.referenceService.replaceMyMergeTags(mergeTagsInfo, htmlBody);
      this.sendTestEmailDto.body = htmlBody;
      $('#sendTestEmailHtmlBody').append(htmlBody);
      this.processing = false;
    },error=>{
      this.processing = false;
      this.callEventEmitter();
      this.referenceService.showSweetAlertServerErrorMessage();
    }
  );
}


send(){
this.referenceService.showSweetAlertProcessingLoader("We are sending the email");
 this.validateForm();
 if(this.isValidForm){
  this.authenticationService.sendTestEmail(this.sendTestEmailDto).subscribe(
    response=>{
      this.referenceService.showSweetAlertSuccessMessage(response.message);
      this.callEventEmitter();
    },error=>{
      this.showErrorMessage("Unable to send test email.Please try after some time.");
    });
 }else{
  this.showErrorMessage("Please provide valid inputs.");
  
 }
 
}

showErrorMessage(errorMessage:string){
  this.processing = false;
  this.customResponse = new CustomResponse();
  this.referenceService.showSweetAlertErrorMessage("Please provide valid inputs.");
  this.clicked = false;
}


  callEventEmitter(){
    this.sendTestEmailDto = new SendTestEmailDto();
    this.referenceService.closeModalPopup(this.modalPopupId);
    this.sendTestEmailComponentEventEmitter.emit();
  }

}
