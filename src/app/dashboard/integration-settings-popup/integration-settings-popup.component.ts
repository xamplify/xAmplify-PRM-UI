import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomFieldsDto } from '../models/custom-fields-dto';
declare var $;
@Component({
  selector: 'app-integration-settings-popup',
  templateUrl: './integration-settings-popup.component.html',
  styleUrls: ['./integration-settings-popup.component.css']
})
export class IntegrationSettingsPopupComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>();
  // @Output() customField = new EventEmitter<any>();
  @Input() customFields = new CustomFieldsDto;
  customField = new CustomFieldsDto;
  options: any;
  constructor() { }

  ngOnInit() {
    $("#pipedrivePreSettingsForm").modal('show');
  }
  hidePipedrivePresettingForm() {
    $("#pipedrivePreSettingsForm").hide();
    this.closeEvent.emit("0");
  }
  addOption(){
    this.options = {};
    this.customFields.options.push(this.options);
  }
  delete(divIndex: number){
    this.customFields.options.splice(divIndex, 1)[0];
  }
  addDefaultPipelineStages() {
		for (var i = 0; i < 1; i++) {
			this.addOption();
		}
	}
  saveOptions(){
    $( "#pipedrivePreSettingsForm" ).modal( 'hide' );
    console.log(this.customFields.options);
    // this.customField.emit(this.customField.options);
  }
}
