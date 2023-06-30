import { Component, OnInit,Input,Output,EventEmitter, ViewChild } from '@angular/core';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';

declare var $:any;

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
  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {
    this.referenceService.openModalPopup(this.modalPopupId);
  }

  callEventEmitter(){
    this.referenceService.closeModalPopup(this.modalPopupId);
    this.sendTestEmailComponentEventEmitter.emit();
  }

}
