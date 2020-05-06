import { Component, OnInit,Input } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';

declare var $:any;
@Component({
  selector: 'app-merge-tags',
  templateUrl: './merge-tags.component.html',
  styleUrls: ['./merge-tags.component.css']
})
export class MergeTagsComponent implements OnInit {

    @Input() isEvent;
    modalPopupId = "merge-tags-popup";
    senderMergeTag:SenderMergeTag = new SenderMergeTag();
    mergeTags = [];
  constructor(public referenceService:ReferenceService) { }

  ngOnInit() {
      this.addMergeTags();
      
  }
  showMergeTagsPopUp(){
      $(".merge-tag-success-message").attr("style", "display:none");
      $('#'+this.modalPopupId).modal('show');
  }
  
  addMergeTags() {
      this.mergeTags.push( { name: 'First Name', value: '{{firstName}}' } );
      this.mergeTags.push( { name: 'Last Name', value: '{{lastName}}' } );
      this.mergeTags.push( { name: 'Full Name', value: '{{fullName}}' } );
      this.mergeTags.push( { name: 'Email Id', value: '{{emailId}}' } );
      this.mergeTags.push( { name: 'Company Name', value: '{{companyName}}' } );
      this.mergeTags.push( { name: 'Sender First Name', value: this.senderMergeTag.senderFirstName } );
      this.mergeTags.push( { name: 'Sender Last Name', value: this.senderMergeTag.senderLastName } );
      this.mergeTags.push( { name: 'Sender Full Name', value: this.senderMergeTag.senderFullName } );
      this.mergeTags.push( { name: 'Sender Title', value: this.senderMergeTag.senderTitle } );
      this.mergeTags.push( { name: 'Sender Email Id', value: this.senderMergeTag.senderEmailId } );
      this.mergeTags.push( { name: 'Sender Contact Number', value: this.senderMergeTag.senderContactNumber } );
      this.mergeTags.push( { name: 'Sender Company', value: this.senderMergeTag.senderCompany } );
      this.mergeTags.push( { name: 'Sender Company Url', value: this.senderMergeTag.senderCompanyUrl } );
      this.mergeTags.push( { name: 'Sender Company Contact Number', value: this.senderMergeTag.senderCompanyContactNumber } );
      this.mergeTags.push( { name: 'Sender About Us (Partner)', value: this.senderMergeTag.aboutUs } );
      if ( this.isEvent ) {
          this.mergeTags.push( { name: 'Event Title', value: '{{event_title}}' } );
          this.mergeTags.push( { name: 'Event Start Time', value: '{{event_start_time}}' } );
          this.mergeTags.push( { name: 'Event End Time', value: '{{event_end_time}}' } );
          this.mergeTags.push( { name: 'Address', value: '{{address}}' } );
          this.mergeTags.push( { name: 'Event From Name', value: '{{event_fromName}}' } );
          this.mergeTags.push( { name: 'Event EmailId', value: '{{event_emailId}}' } );
          this.mergeTags.push( { name: 'Vendor Name   ', value: '{{vendor_name}}' } );
          this.mergeTags.push( { name: 'Vendor EmailId', value: '{{vendor_emailId}}' } );
      }
  }
  
}
