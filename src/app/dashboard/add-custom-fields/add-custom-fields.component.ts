import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { CustomFields } from '../models/custom-fields';
import { IntegrationService } from 'app/core/services/integration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CustomFieldsDto } from '../models/custom-fields-dto';

@Component({
  selector: 'app-add-custom-fields',
  templateUrl: './add-custom-fields.component.html',
  styleUrls: ['./add-custom-fields.component.css']
})
export class AddCustomFieldsComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>();
  @Output() notifySubmitSuccess = new EventEmitter<any>();
  @Input() opportunityType: any;
  customField = new CustomFields;
  customFieldsDto = new CustomFieldsDto;
  ngxloading: boolean = false;
  loggedInUserId: number;
  options: any;
  isValid: boolean = true;
  errorMessage = '';


  constructor(private integrationService: IntegrationService, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    if(this.customField.objectType === undefined){
      this.customField.objectType = this.opportunityType;
      this.customFieldsDto.type = null;
    }
  }

  addOption() {
    this.options = {};
    this.customFieldsDto.options.push(this.options);
  }
  delete(divIndex: number) {
    this.customFieldsDto.options.splice(divIndex, 1);
  }
  validateAndSubmit() {
    this.isValid = true;  
    if (this.customFieldsDto.type === null) {
      this.isValid = false;
      this.errorMessage = 'Please select the Label Type.';
    }
    if (this.customFieldsDto.label.trim().length == 0) {
      this.isValid = false;
      this.errorMessage = 'Please enter a label name.';
    }
    if (this.customField.objectType === null) {
      this.isValid = false;
      this.errorMessage = 'Please select Object Type.';
    }
    if (this.customFieldsDto.options.length == 0 && this.customFieldsDto.type === 'select') {
      this.isValid = false;
      this.errorMessage = "Please provide options for the Drop Down"
    }
    if (this.customFieldsDto.type === 'select') {
      for (let i = 0; i < this.customFieldsDto.options.length; i++) {
        const option = this.customFieldsDto.options[i];
        if (!option || !option.label || option.label.trim().length === 0) {
          this.isValid = false;
          this.errorMessage = "Please provide options for the Drop Down.";
          return;
        }
      }
    }
    if (this.customFieldsDto.type === 'select') {
      const label = new Set<string>();
      const duplicates = this.customFieldsDto.options.some(option => {
        const lowerCaseLabel = option.label.trim().toLowerCase();
        if (label.has(lowerCaseLabel)) {
          this.isValid = false;
          this.errorMessage = 'Please remove duplicate options from Drop Down.';
          return true;
        } else {
          label.add(lowerCaseLabel);
          return false;
        }
      });
    }

    if (this.isValid) {
     this.saveCustomField();
    }
  }

  saveCustomField(){
      this.ngxloading = true;
      this.customField.loggedInUserId = this.loggedInUserId;
      this.customField.selectedFields = [this.customFieldsDto];
      this.integrationService.saveCustomFields(this.customField).subscribe(
          response=>{
            if(response.statusCode == 200){
              this.notifySubmitSuccess.emit();
            } else if (response.statusCode == 500 && response.message === 'Duplicate Name'){
              this.isValid = false;
              this.errorMessage = 'A custom field with this Label Name already exists.';
            }
            this.ngxloading = false;
          },error=>{
            this.ngxloading = false;
          });  
  }

  notifyCloseCustomField(){
  this.closeEvent.emit("0");
  }

}
