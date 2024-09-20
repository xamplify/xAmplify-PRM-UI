import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  customField = new CustomFields;
  customFieldsDtos = new CustomFieldsDto;
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
      this.customField.objectType = null;
      this.customFieldsDtos.type = null;
    }
  }

  addOption() {
    this.options = {};
    this.customFieldsDtos.options.push(this.options);
  }
  delete(divIndex: number) {
    this.customFieldsDtos.options.splice(divIndex, 1);
  }
  validateAndSubmit() {
    this.isValid = true;  
    if (this.customFieldsDtos.type === null) {
      this.isValid = false;
      this.errorMessage = 'Please select the type.';
    }
    if (this.customFieldsDtos.label.trim().length == 0) {
      this.isValid = false;
      this.errorMessage = 'Please fill label.';
    }
    if (this.customField.objectType === null) {
      this.isValid = false;
      this.errorMessage = 'Please select object type.';
    }

    if (this.isValid) {
     this.saveCustomField();
    }
  }

  saveCustomField(){
      this.ngxloading = true;
      this.customField.loggedInUserId = this.loggedInUserId;
      this.customField.selectedFields.push(this.customFieldsDtos);
      this.integrationService.saveCustomFields(this.customField).subscribe(
          response=>{
            if(response.statusCode == 200){
              this.notifySubmitSuccess.emit();
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
