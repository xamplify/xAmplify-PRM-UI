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
  @Input() customField = new CustomFieldsDto;
  customFields = new CustomFieldsDto;
  defaultFields = ['Name']
  isDefaultField: boolean = false;
  options: any;
  deleteOptionVisible: boolean = false;
  isValid: boolean = true;
  errorMessage = "";
  constructor() { }

  ngOnInit() {
    $("#integrationSettingsForm").modal('show');
    if (this.defaultFields.includes(this.customField.label)) {
      this.isDefaultField = true;
    }
    this.customFields.required = this.customField.required;
    this.customFields.displayName = this.customField.displayName;
    this.customFields.placeHolder = this.customField.placeHolder;
    this.customFields.originalCRMType = this.customField.originalCRMType;
    this.customFields.defaultField = this.customField.defaultField;
    this.customFields.formDefaultFieldType = this.customField.formDefaultFieldType;
    this.customFields.label = this.customField.label;
    this.customFields.name = this.customField.name;
    this.customFields.type = this.customField.type;
    this.customFields.canUnselect = this.customField.canUnselect;
    this.customFields.required = this.customField.required;
    this.customFields.canEditRequired = this.customField.canEditRequired;
    this.customFields.selected = this.customField.selected;
    this.customFields.options = this.customField.options;
  }
  hideIntegrationSettingForm() {
    $("#integrationSettingsForm").modal('hide');
    this.closeEvent.emit("0");
  }
  addOption(){
    this.options = {};
    this.customFields.options.push(this.options);
  }
  delete(divIndex: number){
    this.customFields.options.splice(divIndex, 1);
  }
  validateAndSubmit() {
    this.isValid = true;
    if(this.customFields.options.length == 0 && this.customFields.originalCRMType === 'select'){
      this.isValid = false;
      this.errorMessage = "please add options"
    }
    if (this.customFields.originalCRMType === 'select') {
      for (let i = 0; i < this.customFields.options.length; i++) {
        const option = this.customFields.options[i]; 
        if (!option || !option.label || option.label.trim().length === 0) {
          this.isValid = false;
          this.errorMessage = "Please fill options.";
          return;
        }
      }
    }
    if (this.customFields.originalCRMType === 'select') {
      const label = new Set<string>();
      const duplicates = this.customFields.options.some(option => {
        const lowerCaseLabel = option.label.trim().toLowerCase();
        if (label.has(lowerCaseLabel)) {
          this.isValid = false;
          this.errorMessage = 'Please remove duplicate options.';
          return true;
        } else {
          label.add(lowerCaseLabel);
          return false;
        }
      });
    }
    if (this.isValid) {
      this.customField.required = this.customFields.required;
      this.customField.displayName = this.customFields.displayName;
      this.customField.placeHolder = this.customFields.placeHolder;
      this.customField.originalCRMType = this.customFields.originalCRMType;
      this.customField.defaultField = this.customFields.defaultField;
      this.customField.formDefaultFieldType = this.customFields.formDefaultFieldType;
      this.customField.label = this.customFields.label;
      this.customField.name = this.customFields.name;
      this.customField.type = this.customFields.type;
      this.customField.canUnselect = this.customFields.canUnselect;
      this.customField.required = this.customFields.required;
      this.customField.canEditRequired = this.customFields.canEditRequired;
      this.customField.selected = this.customFields.selected;
      this.customField.options = this.customFields.options;
      this.customField.options = this.customFields.options;
      this.hideIntegrationSettingForm();
    }
  }

}



