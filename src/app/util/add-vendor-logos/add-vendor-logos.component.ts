import { Component, OnInit, Input, Output, EventEmitter,OnDestroy } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
declare var $: any;
@Component({
  selector: 'app-add-vendor-logos',
  templateUrl: './add-vendor-logos.component.html',
  styleUrls: ['./add-vendor-logos.component.css']
})
export class AddVendorLogosComponent implements OnInit {

	hideButton: boolean;
	@Input() input: any;
	@Output() notifyComponent = new EventEmitter();
	@Output() passValueAndNotifyComponent = new EventEmitter();
	successMessagePrefix = "Copied";
	modalPopupId = "add-vendor-logo-popup";
	@Input()  vendorLogoDetails = [];
	constructor() { }

	ngOnInit() {
		this.hideButton = this.input['hideButton'];
		let page = this.input['page'];

		if (this.hideButton == undefined) {
			this.hideButton = false;
		}
		if (this.hideButton) {
			this.showMergeTagsPopUp();
		}
	}

	ngOnDestroy() {
		$('#' + this.modalPopupId).modal('hide');
	  }  
    
    showMergeTagsPopUp() {
		$('#add-vendor-logo-popup').modal('show');
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
