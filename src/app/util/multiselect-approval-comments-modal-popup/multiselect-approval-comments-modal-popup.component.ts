import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-multiselect-approval-comments-modal-popup',
  templateUrl: './multiselect-approval-comments-modal-popup.component.html',
  styleUrls: ['./multiselect-approval-comments-modal-popup.component.css']
})
export class MultiselectApprovalCommentsModalPopupComponent implements OnInit {

  @Output() comment = new EventEmitter();
  commentsModalPopUpId = "commentsModalPopUp";
  commentData : any = "";

  
  constructor( private referenceService: ReferenceService) { }

  ngOnInit() {
    this.referenceService.openModalPopup(this.commentsModalPopUpId);
  }

  closeModelPopup() {
    this.referenceService.closeModalPopup(this.commentsModalPopUpId);
    this.comment.emit(this.commentData);
  }

  submitComment() {
    this.referenceService.closeModalPopup(this.commentsModalPopUpId);
    this.comment.emit(this.commentData);
  }



}
