import { Component, OnInit,Input,Output,EventEmitter, ViewChild } from '@angular/core';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import "rxjs/add/observable/of";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';


declare var swal:any, $: any;


@Component({
  selector: 'app-send-test-email',
  templateUrl: './send-test-email.component.html',
  styleUrls: ['./send-test-email.component.css'],
  providers: [Properties]
})
export class SendTestEmailComponent implements OnInit {

  @Input() id:number = 0;
  @Output() sendTestEmailComponentEventEmitter = new EventEmitter();
  subject = "";
  emailIds = [];
  modalPopupId = "send-test-email-modal-popup";
  sent = false;
  processing = false;
  customResponse: CustomResponse = new CustomResponse();
  success = true;
  @ViewChild( 'tagInput' )
  tagInput: SourceTagInput;
  public validators = [this.must_be_email.bind( this )];
  public errorMessages = { 'must_be_email': 'Please be sure to use a valid email format' };
  public onAddedFunc = this.beforeAdd.bind( this );
  private addFirstAttemptFailed = false;
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public properties:Properties) { }

  ngOnInit() {
    this.processing = true;
    this.referenceService.openModalPopup(this.modalPopupId);
    $('#sendTestEmailHtmlBody').val('');
    this.getTemplateHtmlBodyAndMergeTagsInfo();
  }
  
  private must_be_email( control: FormControl ) {
    if ( this.addFirstAttemptFailed && !this.referenceService.validateEmailId( control.value ) ) {
        return { "must_be_email": true };
    }
    return null;
}
private beforeAdd( tag: any ) {
    let isPaste = false;
    if ( tag['value'] ) { isPaste = true; tag = tag.value; }
    if ( !this.referenceService.validateEmailId( tag ) ) {
        if ( !this.addFirstAttemptFailed ) {
            this.addFirstAttemptFailed = true;
            if ( !isPaste ) { this.tagInput.setInputValue( tag ); }
        }
        if ( isPaste ) { return Observable.throw( this.errorMessages['must_be_email'] ); }
        else { return Observable.of( '' ).pipe( tap(() => setTimeout(() => this.tagInput.setInputValue( tag ) ) ) ); }
    }
    this.addFirstAttemptFailed = false;
    return Observable.of( tag );
}


getTemplateHtmlBodyAndMergeTagsInfo(){
  this.processing = true;
  this.authenticationService.getTemplateHtmlBodyAndMergeTagsInfo(this.id).subscribe(
    response=>{
      let map = response.data;
      let htmlBody = map['emailTemplateDTO']['body'];
      let mergeTagsInfo = map['mergeTagsInfo'];
      htmlBody = this.referenceService.replaceMyMergeTags(mergeTagsInfo, htmlBody);
      $('#sendTestEmailHtmlBody').append(htmlBody);
      this.processing = false;
    },error=>{
      this.processing = false;
      this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
    }
  );
}


send(){
 
}


  callEventEmitter(){
    this.referenceService.closeModalPopup(this.modalPopupId);
    this.sendTestEmailComponentEventEmitter.emit();
  }

}
