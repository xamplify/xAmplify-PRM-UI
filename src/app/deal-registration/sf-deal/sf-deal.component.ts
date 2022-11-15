import { Component, OnInit, Input } from '@angular/core';
import { ContactService } from 'app/contacts/services/contact.service';
import { Form } from 'app/forms/models/form';
import { ColumnInfo } from 'app/forms/models/column-info';
import { ReferenceService } from 'app/core/services/reference.service';
import { FormOption } from 'app/forms/models/form-option';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { IntegrationService } from 'app/core/services/integration.service';

declare var $: any, swal;

@Component({
  selector: 'app-sf-deal',
  templateUrl: './sf-deal.component.html',
  styleUrls: ['./sf-deal.component.css']
})
export class SfDealComponent implements OnInit {
  @Input() public createdForCompanyId: any;
  @Input() public dealId: any;
  @Input() campaign: any;
  @Input() public isPreview = false;
  @Input() isVendor = false;
  form: Form = new Form();
  errorMessage: string;
  isDealRegistrationFormValid: boolean = true;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  multiSelectvalueArray=[];
  optionObj: any;
  showSFFormError: boolean = false;
  sfFormError: string = "";
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  isLoading = false;
  constructor(private contactService: ContactService, private referenceService: ReferenceService, private integrationService: IntegrationService) {
  }

  ngOnInit() {
    this.showSFFormError = false;
    this.dropdownSettings = {
      singleSelection: false,
      text: "Please select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };

    if (this.createdForCompanyId != undefined && this.createdForCompanyId > 0) {
      if (this.dealId == undefined || this.dealId <= 0) {
        this.dealId = 0;
      }
      
      this.isLoading = true;
      this.getActiveCRMCustomForm();
      //this.getSalesforceCustomForm();
      
    }
  }
  
  getActiveCRMCustomForm() {
    this.integrationService.getactiveCRMCustomForm(this.createdForCompanyId, this.dealId).subscribe(result => {
      this.showSFFormError = false; 
      this.isLoading = false;
      if (result.statusCode == 200) {
        this.form = result.data;
        let allMultiSelects = this.form.formLabelDTOs.filter(column => column.labelType === "multiselect");
        for (let multiSelectObj of allMultiSelects) {
          let selectedOptions = multiSelectObj.value.split(';');        
          for(let option of selectedOptions){
            this.optionObj =  multiSelectObj.dropDownChoices.find(optionData => optionData.name === option);
            this.multiSelectvalueArray.push(this.optionObj);
          }
          multiSelectObj.value = this.multiSelectvalueArray; 
        }      
  
        let reqFieldsCheck = this.form.formLabelDTOs.filter(column => column.required && (column.value === undefined || column.value === ""));
        if (reqFieldsCheck.length === 0) {
          this.isDealRegistrationFormValid = false;
        }
      } else if (result.statusCode === 401 && result.message === "Expired Refresh Token") { 
        this.showSFFormError = true;    
        this.sfFormError = "We found something wrong about your Vendor's configuration. Please contact your Vendor.";
      }
      
    }, error => {
      console.log(error);
    });
  }

  getSalesforceCustomForm() {
    this.contactService.getSfForm(this.createdForCompanyId, this.dealId).subscribe(result => {
      this.showSFFormError = false; 
      this.isLoading = false;
      if (result.statusCode == 200) {
        this.form = result.data;
        let allMultiSelects = this.form.formLabelDTOs.filter(column => column.labelType === "multiselect");
        for (let multiSelectObj of allMultiSelects) {
          let selectedOptions = multiSelectObj.value.split(';');        
          for(let option of selectedOptions){
            this.optionObj =  multiSelectObj.dropDownChoices.find(optionData => optionData.name === option);
            this.multiSelectvalueArray.push(this.optionObj);
          }
          multiSelectObj.value = this.multiSelectvalueArray; 
        }      
  
        let reqFieldsCheck = this.form.formLabelDTOs.filter(column => column.required && (column.value === undefined || column.value === ""));
        if (reqFieldsCheck.length === 0) {
          this.isDealRegistrationFormValid = false;
        }
      } else if (result.statusCode === 401 && result.message === "Expired Refresh Token") { 
        this.showSFFormError = true;    
        this.sfFormError = "We found something wrong about your Vendor's configuration. Please contact your Vendor.";
      }
      
    }, error => {
      console.log(error);
    });
  }

  validateField() {
    this.validateAllFields();
  }

  updateCheckBoxModel(columnInfo: ColumnInfo, event: any) {
    if (columnInfo.value === undefined) {
      columnInfo.value = Array<number>();
    }
    if (event.target.checked) {
      columnInfo.value = "true";
    } else {
      columnInfo.value = "false";
    }
    this.validateAllFields();
  }

  selectOnChangeEvent() {
    this.validateAllFields();
  }

  validateAllFields() {
    let reqFieldsCheck = this.form.formLabelDTOs.filter(column => column.required && (column.value === undefined || column.value === "" || column.value === null || (column.value !== null && column.value.length === 0)));
    if (reqFieldsCheck.length === 0) {
      this.isDealRegistrationFormValid = false;
    } else {
      this.isDealRegistrationFormValid = true;
    }
    if (!this.isDealRegistrationFormValid) {
      let allEmails = this.form.formLabelDTOs.filter(column => column.labelType === "email");
      for (let emailObj of allEmails) {
        this.validateEmailId(emailObj);
      }

      let allURLs = this.form.formLabelDTOs.filter(column => column.labelType === "url");
      for (let urlObj of allURLs) {
        this.validateWebsiteURL(urlObj);
      }

      let allPhoneNumbers = this.form.formLabelDTOs.filter(column => column.labelType === "phone");
      for (let phoneObj of allPhoneNumbers) {
        this.validatePhoneNumber(phoneObj);
      }

      let allPercentages = this.form.formLabelDTOs.filter(column => column.labelType === "percent");
      for (let percentObj of allPercentages) {
        this.validatePercentageValue(percentObj);
      }

      let allGeoLocations = this.form.formLabelDTOs.filter(column => column.labelType === "geolocation");
      for (let geoObj of allGeoLocations) {
        this.validateGeoLocation(geoObj);
      }      
    }
  }

  validateEmailId(columnInfo: ColumnInfo) {
    columnInfo.divClass = "success";
    if (columnInfo.value !== null && columnInfo.value !== "" && columnInfo.value !== undefined) {
      if (!this.referenceService.validateEmailId($.trim(columnInfo.value))) {
        columnInfo.errorMessage = "Please enter a valid email address";
        columnInfo.divClass = "error";
        this.isDealRegistrationFormValid = true;
      }
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    //charCode == 46 || 
    return ((charCode >= 48 && charCode <= 57));
  }

  validatePercentageValue(columnInfo: ColumnInfo) {
    if (columnInfo.value !== null && columnInfo.value !== "" && columnInfo.value !== undefined) {
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

  validateWebsiteURL(columnInfo: ColumnInfo) {
    columnInfo.divClass = "success";
    if (columnInfo.value !== null && columnInfo.value !== "" && columnInfo.value !== undefined) {
      if (!this.referenceService.validateWebsiteURL($.trim(columnInfo.value))) {
        columnInfo.errorMessage = "Please enter a valid URL";
        columnInfo.divClass = "error";
        this.isDealRegistrationFormValid = true;
      }
    }    
  }

  validatePhoneNumber(columnInfo: ColumnInfo) {
    let phoneNumber = columnInfo.value.toString();
    if (phoneNumber.length < 8 || !this.referenceService.validatePhoneNumber($.trim(phoneNumber))) {
      columnInfo.errorMessage = "Please enter valid phone number";
      columnInfo.divClass = "error";
      this.isDealRegistrationFormValid = true;
    } else {
      columnInfo.divClass = "success";
    }
  }

  onItemSelect(item: any) {
    this.validateAllFields();
  }

  OnItemDeSelect(item: any) {
    this.validateAllFields();
  }

  onSelectAll(items: any) {
    this.validateAllFields();
  }

  onDeSelectAll(items: any) {
    this.validateAllFields();
  }

  validateGeoLocation(columnInfo: ColumnInfo){    
    if (columnInfo.value !== null && columnInfo.value !== "" && columnInfo.value !== undefined) {
      var x = parseFloat($.trim(columnInfo.value));      
      if ((columnInfo.labelName.includes('Latitude')) && (isNaN(x) || x < -90 || x > 90)) {
        columnInfo.errorMessage = "Please enter a value from -90 to 90";
        columnInfo.divClass = "error";
        this.isDealRegistrationFormValid = true;
      }else if ((columnInfo.labelName.includes('Longitude')) && (isNaN(x) || x < -180 || x > 180)) {
        columnInfo.errorMessage = "Please enter a value from -180 to 180";
        columnInfo.divClass = "error";
        this.isDealRegistrationFormValid = true;
      } else {
        columnInfo.divClass = "success";
      }
    }
  }
}
