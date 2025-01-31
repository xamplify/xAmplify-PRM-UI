import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { ReferenceService } from 'app/core/services/reference.service';

declare var $: any;

@Component({
  selector: 'app-multiselect-approval-comments-modal-popup',
  templateUrl: './multiselect-approval-comments-modal-popup.component.html',
  styleUrls: ['./multiselect-approval-comments-modal-popup.component.css'],
  providers: [Properties]
})
export class MultiselectApprovalCommentsModalPopupComponent implements OnInit {

  @Input() isApproveOrRejectStatus = '';
  @Output() comment = new EventEmitter();
  @Input() rejectedRecordNames = '';
  @Input() selectedFilterStatus = '';
  @Input() isSelectedAutoApprovalRecords = false;
  commentsModalPopUpId = "commentsModalPopUp";
  commentData: any = "";
  isValidComment: boolean = false;
  statusText: any = "";
  approveText: string;
  recordNames: any = "";
  showRecords: boolean = false;
  approveTextForAlert: string;
  approveCustomResponse: string;


  constructor(private referenceService: ReferenceService, public properties: Properties) { }

  ngOnInit() {
    this.referenceService.openModalPopup(this.commentsModalPopUpId);
    if (this.isApproveOrRejectStatus.length > 0) {
      this.statusText = this.isApproveOrRejectStatus === 'APPROVED' ? 'Approving' : 'Rejecting';
    }

    if (this.isSelectedAutoApprovalRecords) {
      this.showRecords = true;
      this.approveCustomResponse = this.properties.AUTHORIZATION_RESPONSE_FOR_SELF_REJECT;
    }

    if (this.rejectedRecordNames != undefined && this.rejectedRecordNames.length > 0) {
      this.showRecords = true;
      if (this.selectedFilterStatus === 'APPROVED' && this.isSelectedAutoApprovalRecords) {
        this.approveCustomResponse = this.properties.AUTHORIZATION_RESPONSE_FOR_TEAM_MEMBER;
      } else if (this.selectedFilterStatus === 'APPROVED') {
        this.approveCustomResponse = this.properties.AUTHORIZATION_RESPONSE_REJECT;
      } else {
        this.approveCustomResponse = this.properties.AUTHORIZATION_RESPONSE_APPROVAL;
      }
      let self = this;
      self.showRecords = true;
      self.recordNames = "";
      $.each(this.rejectedRecordNames, function (index: number, value: any) {
        self.recordNames += value;
        if (index < self.rejectedRecordNames.length - 1) {
          self.recordNames += " , ";
        }
      });
    }
  }

  closeModelPopup() {
    this.referenceService.closeModalPopup(this.commentsModalPopUpId);
    this.commentData = "";
    this.comment.emit(this.commentData);
  }

  submitComment() {
    this.referenceService.closeModalPopup(this.commentsModalPopUpId);
    this.comment.emit(this.commentData);
  }

  validateComment() {
    let comment = $.trim(this.commentData);
    if (comment != undefined && comment != "" && comment.length > 0) {
      this.isValidComment = true;
    } else {
      this.isValidComment = false;
    }
  }


}
