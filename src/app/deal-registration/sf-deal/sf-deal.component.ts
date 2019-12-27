import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ContactService } from 'app/contacts/services/contact.service';
import { Form } from 'app/forms/models/form';
import { ColumnInfo } from 'app/forms/models/column-info';
import { ReferenceService } from 'app/core/services/reference.service';
import { FormOption } from 'app/forms/models/form-option';

declare var $: any;

@Component({
  selector: 'app-sf-deal',
  templateUrl: './sf-deal.component.html',
  styleUrls: ['./sf-deal.component.css']
})
export class SfDealComponent implements OnInit {

  @Input() dealId: any;
  @Input() campaign: any;
  form: Form = new Form();
  errorMessage: string;
  isDealRegistrationFormValid: boolean = true;
  constructor(private contactService: ContactService, private referenceService: ReferenceService) {
  }

  ngOnInit() {
    this.contactService.displaySfForm(this.dealId).subscribe(result => {
      this.form = result.data;
      if (this.campaign.campaignName !== undefined || this.campaign.campaignName !== '') {
        this.form.formLabelDTOs.find(field => field.labelId === 'Name').value = this.campaign.campaignName;
      }
      let reqFieldsCheck = this.form.formLabelDTOs.filter(column => column.required && (column.value === undefined || column.value === ""));
      if (reqFieldsCheck.length === 0) {
        this.isDealRegistrationFormValid = false;
      }
    }, error => {
      console.log(error);
    });
  }

  validateField(columnInfo: ColumnInfo) {    
    this.validateRequiredFields();
  }

  updateCheckBoxModel(columnInfo: ColumnInfo, formOption: FormOption, event: any) {
    if (columnInfo.value === undefined) {
      columnInfo.value = Array<number>();
    }
    if (event.target.checked) {
      columnInfo.value = "true";
    } else {
      columnInfo.value = "false";
    }
    this.validateRequiredFields();
  }

  selectOnChangeEvent(event: any) {
    this.validateRequiredFields();
  }

  validateRequiredFields() {
    let reqFieldsCheck = this.form.formLabelDTOs.filter(column => column.required && (column.value === undefined || column.value === ""));
    if (reqFieldsCheck.length === 0) {
      this.isDealRegistrationFormValid = false;      
    } else {
      this.isDealRegistrationFormValid = true;
    }
    if(!this.isDealRegistrationFormValid){
      let allEmails = this.form.formLabelDTOs.filter(column => column.labelType === "email");
      for (let emailObj of allEmails) {
        if(!this.isDealRegistrationFormValid){
          this.validateEmailId(emailObj);
        }        
      }
      let allPercentages = this.form.formLabelDTOs.filter(column => column.labelType === "percent");
      for (let percentObj of allPercentages) {
        if(!this.isDealRegistrationFormValid){
          this.validatePercentage(percentObj);
        }        
      }
    }
  }

  validateEmailId(columnInfo: ColumnInfo) {
    if (!this.referenceService.validateEmailId($.trim(columnInfo.value))) {
      columnInfo.errorMessage = "Please enter a valid email address";
      columnInfo.divClass = "error";
      this.isDealRegistrationFormValid = true;
    } else {
      columnInfo.divClass = "success";
    }
  }

  validatePercentage(columnInfo: ColumnInfo) {
    if (columnInfo.value !== null) {
      var x = parseFloat($.trim(columnInfo.value));
      if (isNaN(x) || x < 0 || x > 100) {
        columnInfo.errorMessage = "Please enter a value between 0 and 100";
        columnInfo.divClass = "error";
        this.isDealRegistrationFormValid = true;
      } else {
        columnInfo.divClass = "success";
      }
    }
  }
}
