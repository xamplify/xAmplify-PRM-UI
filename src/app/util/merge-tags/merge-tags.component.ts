import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
	hideButton: boolean;
	@Input() input: any;
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
		let page = this.input['page'];
		if(page!=undefined && page){
			this.mergeTags = this.referenceService.addPageMergeTags();
		}else{
			this.addMergeTags();
		}
		
		if (this.hideButton == undefined) {
			this.hideButton = false;
		}
		if (this.hideButton) {
			this.showMergeTagsPopUp();
		}
		if (this.isCampaign) {
			this.successMessagePrefix = "Inserted";
		}

	}
	showMergeTagsPopUp() {
		$(".merge-tag-success-message").attr("style", "display:none");
		$('#' + this.modalPopupId).modal('show');
	}

	addMergeTags() {
		this.mergeTags = this.referenceService.addMergeTags(this.mergeTags,this.isCampaign,this.isEvent);
	}

	hideModal() {
		this.notifyComponent.emit();
		$('#' + this.modalPopupId).modal('hide');
	}

	passToOtherComponent(i: number) {
		if (this.hideButton) {
			let copiedValue = $('#merge-tag-' + i).val();
			let object = {};
			object['type'] = this.input['type'];
			object['copiedValue'] = copiedValue;
			object['autoResponseSubject'] = this.input['autoResponseSubject'];
			this.passValueAndNotifyComponent.emit(object);
			$('#' + this.modalPopupId).modal('hide');
		}

	}
}
