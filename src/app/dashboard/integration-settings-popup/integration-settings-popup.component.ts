import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomFieldsDto } from '../models/custom-fields-dto';
import { PicklistValues } from 'app/forms/models/picklist-values';
declare var $;
@Component({
  selector: 'app-integration-settings-popup',
  templateUrl: './integration-settings-popup.component.html',
  styleUrls: ['./integration-settings-popup.component.css']
})
export class IntegrationSettingsPopupComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>();
  @Input() customField = new CustomFieldsDto;
  @Input() customFieldsList: any;
  @Input() opportunityType :any;
  customFields = new CustomFieldsDto;
  defaultFields = ['Name','Last Name']
  isDefaultField: boolean = false;
  options: any;
  deleteOptionVisible: boolean = false;
  isValid: boolean = true;
  errorMessage = "";
  canDisableSelect: boolean = false;
  canDisableType: boolean = false;
  selectedPicklistValue: any;
  constructor() { }

  ngOnInit() {
    $("#integrationSettingsForm").modal('show');
    if (this.defaultFields.includes(this.customField.label)) {
      this.isDefaultField = true;
    }
    if(this.customField.originalCRMType === 'select'){
      this.canDisableSelect = true;
    }
    if(this.customField.formDefaultFieldType === 'DEAL_ID' || this.customField.formDefaultFieldType === 'LEAD_ID' || this.customField.formDefaultFieldType === 'CREATED_BY'){
      this.canDisableType = true;
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
    this.customFields.nonInteractive = this.customField.nonInteractive;
    this.customFields.options = this.customField.options.map(option => new PicklistValues(option.label, option.value));
    this.customFields.picklistValues = this.customField.picklistValues;
    this.customFields.defaultChoiceLabel = this.customField.defaultChoiceLabel;
    if (this.customField.nonInteractive) {
      this.customFields.private = this.customField.private;
    }
    this.customFields.controllerName = this.customField.controllerName;
  }
  hideIntegrationSettingForm() {
    $("#integrationSettingsForm").modal('hide');
    this.closeEvent.emit("0");
  }
  addOption() {
    this.options = {};
    this.customFields.options.push(this.options);
  }
  delete(divIndex: number) {
    this.customFields.options.splice(divIndex, 1);
  }
  validateAndSubmit() {
    this.isValid = true;
    if (this.customFields.options.length == 0 && this.customFields.originalCRMType === 'select') {
      this.isValid = false;
      this.errorMessage = "please add options for Picklist."
    }
    if (this.customFields.originalCRMType === 'select') {
      for (let i = 0; i < this.customFields.options.length; i++) {
        const option = this.customFields.options[i];
        if (!option || !option.label || option.label.trim().length === 0) {
          this.isValid = false;
          this.errorMessage = "Please fill options for Picklist.";
          return;
        }
      }
    }

    if (this.customField.controllerName != null && this.customField.controllerName != undefined && this.customFields.required) {
      this.setParentFieldRequired(this.customField);
    }

    if (this.customFields.originalCRMType === 'select') {
      const label = new Set<string>();
      const duplicates = this.customFields.options.some(option => {
        const lowerCaseLabel = option.label.trim().toLowerCase();
        if (label.has(lowerCaseLabel)) {
          this.isValid = false;
          this.errorMessage = 'Please remove duplicate options from Picklist.';
          return true;
        } else {
          label.add(lowerCaseLabel);
          return false;
        }
      });
    }
    if (this.customFields.type === 'picklist' && this.customFields.nonInteractive && (this.customFields.defaultChoiceLabel === null || this.customFields.defaultChoiceLabel === 'null')) {
      this.isValid = false;
      this.errorMessage = 'Please select the default value for the picklist.';
      return;
    }
    if (!this.customFields.nonInteractive) {
      this.customFields.private = false;
    }
    if ($.trim(this.customFields.displayName).length <= 0) {
      this.isValid = false;
      this.errorMessage = 'Please add display name.';
      return;
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
      this.customField.nonInteractive = this.customFields.nonInteractive;
      this.customField.options = this.customFields.options.map(option => new PicklistValues(option.label, option.value));
      this.customField.defaultChoiceLabel = this.customFields.defaultChoiceLabel;
      if (this.customFields.nonInteractive) {
        this.customField.private = this.customFields.private;
      }
      this.hideIntegrationSettingForm();
    }
  }

  setParentFieldRequired(customField: any) {
    this.customFieldsList.forEach(field => {
      if (field.name === customField.controllerName) {
        field.required = true;
        if (field.controllerName != null && field.controllerName != undefined) {
          this.setParentFieldRequired(field);
        }
      }
    });
  }

  onFieldTypeChange(selectedField: any) {
    let countSelectedType = 1;
    const selectedFieldType = selectedField.formDefaultFieldType;

    this.customFieldsList.forEach(field => {
      if (
        field.label === selectedField.label &&
        (selectedFieldType === 'DEAL_ID' ||
          selectedFieldType === 'LEAD_ID' || selectedFieldType === 'CREATED_BY')) {
        countSelectedType++;
        field.formDefaultFieldType = selectedFieldType;
        this.canDisableType = true;
      }
    });

    if (countSelectedType > 1) {
      this.customFieldsList.forEach(field => {
        if (
          field.formDefaultFieldType === selectedFieldType && (selectedFieldType === 'DEAL_ID' ||
            selectedFieldType === 'LEAD_ID' || selectedFieldType === 'CREATED_BY') &&
          field !== selectedField
        ) {
          field.formDefaultFieldType = null;
          if (field.name === 'xAmplify_Deal_ID__c' || field.name === 'xAmplify_Lead_ID__c') {
            field.canUnselect = true;
          }
        }
      });
    }
    if (selectedFieldType === null) {
      this.canDisableType = false;
    }
  }

  onLabelTypeChange(selectedField: any) {
    if(selectedField.originalCRMType === 'select'){
     this.canDisableSelect = true;
    } else {
      this.canDisableSelect = false;
    }
   }

}



