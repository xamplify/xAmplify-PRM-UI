import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
declare var $: any;

@Component({
  selector: 'app-add-default-companies-or-map-logo',
  templateUrl: './add-default-companies-or-map-logo.component.html',
  styleUrls: ['./add-default-companies-or-map-logo.component.css']
})
export class AddDefaultCompaniesOrMapLogoComponent implements OnInit {

  @Output() notifyComponent = new EventEmitter();
  @Output() passValueAndNotifyComponent = new EventEmitter();
  @Input() isVendorLandscape: boolean = false;
  successMessagePrefix = "Copied";
  modalPopupId = "default-logos-popup";
  defaultLogos = [];
  constructor(public referenceService: ReferenceService) { }

  ngOnInit() {
    this.defaultLogos = this.referenceService.addDefaultLogos( this.isVendorLandscape)
  }

  ngOnDestroy() {
    $('#' + this.modalPopupId).modal('hide');
    }

  showMergeTagsPopUp() {
    $(".default-logo-success-message").attr("style", "display:none");
    $('#' + this.modalPopupId).modal('show');
  }
  hideModal() {
    this.notifyComponent.emit();
    $('#' + this.modalPopupId).modal('hide');
  }

  passToOtherComponent(i: number) {
      let copiedValue = $('#default-logo-' + i).val();
      let object = {};
      object['copiedValue'] = copiedValue;
      this.passValueAndNotifyComponent.emit(object);
      $('#' + this.modalPopupId).modal('hide');

  }
}
