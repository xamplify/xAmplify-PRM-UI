import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';

declare var $: any;

@Component({
  selector: 'app-multiselect-approval-comments-modal-popup',
  templateUrl: './multiselect-approval-comments-modal-popup.component.html',
  styleUrls: ['./multiselect-approval-comments-modal-popup.component.css']
})
export class MultiselectApprovalCommentsModalPopupComponent implements OnInit {

  @Input() isApproveOrRejectStatus = '';
  @Output() comment = new EventEmitter();
  commentsModalPopUpId = "commentsModalPopUp";
  commentData: any = "";
  isValidComment : boolean = false;
  statusText : any = "";

  
  constructor( private referenceService: ReferenceService) { }

  ngOnInit() {
    this.referenceService.openModalPopup(this.commentsModalPopUpId);
    if (this.isApproveOrRejectStatus.length > 0) {
      this.statusText = this.isApproveOrRejectStatus === 'APPROVED' ? 'Approving' : 'Rejecting';
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
