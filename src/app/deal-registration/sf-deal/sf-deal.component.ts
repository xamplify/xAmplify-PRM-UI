import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ContactService } from 'app/contacts/services/contact.service';
import { Form } from 'app/forms/models/form';
import { ColumnInfo } from 'app/forms/models/column-info';
import { ReferenceService } from 'app/core/services/reference.service';
import { FormOption } from 'app/forms/models/form-option';
import { Campaign } from 'app/campaigns/models/campaign';

declare var flatpickr: any, $: any;

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
  isRequiredColumns: any;

  constructor(private contactService: ContactService, private referenceService: ReferenceService) { }

  ngOnInit() {
    this.contactService.displaySfForm(this.dealId).subscribe(result => {
      this.form = result.data;
      if(this.campaign.campaignName !== undefined || this.campaign.campaignName !== ''){
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

    if (columnInfo.labelType === 'email') {
      if (!this.referenceService.validateEmailId($.trim(columnInfo.value))) {
        columnInfo.errorMessage = "Please enter a valid email address";
        columnInfo.divClass = "error";
      } else {
        columnInfo.divClass = "success";
      }
    }
    this.validateRequiredFields();
  }

  updateCheckBoxModel(columnInfo: ColumnInfo, formOption: FormOption, event: any) {
    if (columnInfo.value === undefined) {
      columnInfo.value = Array<number>();
    }
    if (event.target.checked) {
      columnInfo.value = "true";
    } else {
      //columnInfo.value.splice($.inArray(formOption.id, columnInfo.value), 1);
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
  }
}
