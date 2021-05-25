import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';

declare var $: any;
@Component({
	selector: 'app-merge-tags',
	templateUrl: './merge-tags.component.html',
	styleUrls: ['./merge-tags.component.css']
})
export class MergeTagsComponent implements OnInit {

	isEvent: boolean;
	isCampaign: boolean;
	hideButton:boolean;
	@Input() input:any;
	@Output() notifyComponent = new EventEmitter();
	@Output() passValueAndNotifyComponent = new EventEmitter();
	successMessagePrefix = "Copied";
	modalPopupId = "merge-tags-popup";
	senderMergeTag: SenderMergeTag = new SenderMergeTag();
	mergeTags = [];
	constructor(public referenceService: ReferenceService) { }

	ngOnInit() {
		this.isEvent = this.input['isEvent'];
		this.isCampaign = this.input['isCampaign'];
		this.hideButton = this.input['hideButton'];
		this.addMergeTags();
		if(this.hideButton==undefined){
			this.hideButton = false;
		}
		if(this.hideButton){
			this.showMergeTagsPopUp();
		}
		if(this.isCampaign){
			this.successMessagePrefix = "Inserted";
		}

	}
	showMergeTagsPopUp() {
		$(".merge-tag-success-message").attr("style", "display:none");
		$('#' + this.modalPopupId).modal('show');
	}

	addMergeTags() {
		this.mergeTags.push({ name: 'First Name', value: '{{firstName}}' });
		this.mergeTags.push({ name: 'Last Name', value: '{{lastName}}' });
		this.mergeTags.push({ name: 'Full Name', value: '{{fullName}}' });
		this.mergeTags.push({ name: 'Email Id', value: '{{emailId}}' });
		this.mergeTags.push({ name: 'Company Name', value: '{{companyName}}' });
		this.mergeTags.push({ name: 'Sender First Name', value: this.senderMergeTag.senderFirstName });
		this.mergeTags.push({ name: 'Sender Last Name', value: this.senderMergeTag.senderLastName });
		this.mergeTags.push({ name: 'Sender Full Name', value: this.senderMergeTag.senderFullName });
		this.mergeTags.push({ name: 'Sender Title', value: this.senderMergeTag.senderTitle });
		this.mergeTags.push({ name: 'Sender Email Id', value: this.senderMergeTag.senderEmailId });
		if (this.isCampaign == undefined || !this.isCampaign) {
			this.mergeTags.push({ name: 'Sender Contact Number', value: this.senderMergeTag.senderContactNumber });
		}
		this.mergeTags.push({ name: 'Sender Company', value: this.senderMergeTag.senderCompany });
		this.mergeTags.push({ name: 'Sender Company Url', value: this.senderMergeTag.senderCompanyUrl });
		if (this.isCampaign == undefined || !this.isCampaign) {
			this.mergeTags.push({ name: 'Sender Company Contact Number', value: this.senderMergeTag.senderCompanyContactNumber });
			this.mergeTags.push({ name: 'Sender About Us (Partner)', value: this.senderMergeTag.aboutUs });
		}
		if (this.isEvent) {
			this.mergeTags.push({ name: 'Event Title', value: '{{event_title}}' });
			this.mergeTags.push({ name: 'Event Start Time', value: '{{event_start_time}}' });
			this.mergeTags.push({ name: 'Event End Time', value: '{{event_end_time}}' });
			this.mergeTags.push({ name: 'Address', value: '{{address}}' });
			this.mergeTags.push({ name: 'Event From Name', value: '{{event_fromName}}' });
			this.mergeTags.push({ name: 'Event EmailId', value: '{{event_emailId}}' });
			this.mergeTags.push({ name: 'Vendor Name   ', value: '{{vendor_name}}' });
			this.mergeTags.push({ name: 'Vendor Email Id', value: '{{vendor_emailId}}' });
		}
	}

	hideModal(){
		this.notifyComponent.emit();
		$('#' + this.modalPopupId).modal('hide');
	}

	passToOtherComponent(i:number){
		let copiedValue = $('#merge-tag-'+i).val();
		let object = {};
		object['type'] = this.input['type'];
		object['copiedValue'] = copiedValue;
		object['autoResponseSubject'] = this.input['autoResponseSubject'];
		this.passValueAndNotifyComponent.emit(object);
	}
}
