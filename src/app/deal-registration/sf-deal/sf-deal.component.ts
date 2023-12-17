import { Component, OnInit, Input } from '@angular/core';
import { ContactService } from 'app/contacts/services/contact.service';
import { Form } from 'app/forms/models/form';
import { ColumnInfo } from 'app/forms/models/column-info';
import { ReferenceService } from 'app/core/services/reference.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { IntegrationService } from 'app/core/services/integration.service';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import { FadeAnimation } from 'app/core/animations/fade-animation';

declare var $: any, swal:any;

@Component({
  selector: 'app-sf-deal',
  templateUrl: './sf-deal.component.html',
  styleUrls: ['./sf-deal.component.css'],
  animations:[FadeAnimation]
})
export class SfDealComponent implements OnInit {
  @Input() public createdForCompanyId: any;
  @Input() public dealId: any;
  @Input() campaign: any;
  @Input() public isPreview = false;
  @Input() isVendor = false;
  @Input() activeCRM: string;
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
  isCollapsed: boolean;
  isCollapsed2: boolean;
  isCollapsed3: any;
  /*********XNFR-403*********/
  @Input() forecastItemsJson:string;
  forecastItems:Array<any> = new Array<any>();
  searchableDropDownDto:SearchableDropdownDto = new SearchableDropdownDto();
  isConnectWiseEnabledAsActiveCRM: boolean = false;
  isValidRepValues = true;
  /*******XNFR-403****/
  constructor(private contactService: ContactService, private referenceService: ReferenceService, private integrationService: IntegrationService) {
  }

  addLoader(){
    this.isLoading = true;
    this.referenceService.showSweetAlertProceesor('We are fetching the deal form');
  }

   removeLoader(){
    this.isLoading = false;
    this.referenceService.closeSweetAlert();
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
      this.addLoader();
      if ("SALESFORCE" === this.activeCRM) {
        this.getSalesforceCustomForm();
      } else {
        this.getActiveCRMCustomForm();
      }      
    }

    if ("CONNECTWISE" === this.activeCRM) {
      this.isConnectWiseEnabledAsActiveCRM = true;
    }
  }
  
  getActiveCRMCustomForm() {
    this.integrationService.getactiveCRMCustomForm(this.createdForCompanyId, this.dealId).subscribe(result => {
      this.showSFFormError = false; 
      this.removeLoader();
      if (result.statusCode == 200) {
        this.form = result.data;
        let allMultiSelects = this.form.formLabelDTOs.filter(column => column.labelType === "multiselect");
        for (let multiSelectObj of allMultiSelects) {
          if (multiSelectObj !== undefined && multiSelectObj.value !== undefined) {
            let selectedOptions = multiSelectObj.value.split(';');
            for (let option of selectedOptions) {
              this.optionObj = multiSelectObj.dropDownChoices.find(optionData => optionData.name === option);
              this.multiSelectvalueArray.push(this.optionObj);
            }
            multiSelectObj.value = this.multiSelectvalueArray;
          }
        }      
  
        let reqFieldsCheck = this.form.formLabelDTOs.filter(column => column.required && (column.value === undefined || column.value === ""));
        if (reqFieldsCheck.length === 0) {
          this.isDealRegistrationFormValid = false;
        }
        /*********XNFR-403*********/
        if(this.dealId>0){
          this.forecastItems = this.referenceService.convertJsonStringToJsonObject(this.forecastItemsJson);
          console.log(this.forecastItems);
          if(this.forecastItems!=undefined && this.forecastItems.length>0){
            $.each(this.forecastItems,function(index:number, 
                forecastItemDto:any){
                  forecastItemDto['price'] = forecastItemDto['revenue'];
            });
          }
        } else{
          this.addProduct();
        }
        this.searchableDropDownDto.data = result.data.connectWiseProducts;
        this.searchableDropDownDto.placeHolder = "Please Select Product";
        /*********XNFR-403*********/
      } else if (result.statusCode === 401 && result.message === "Expired Refresh Token") { 
        this.showSFFormError = true;    
        this.sfFormError = "We found something wrong about your Vendor's configuration. Please contact your Vendor.";
      } 
      
    }, error => {
      this.removeLoader();
      this.showSFFormError = true; 
      this.sfFormError = this.referenceService.getApiErrorMessage(error);       
    });
  }

  getSalesforceCustomForm() {
    this.contactService.getSfForm(this.createdForCompanyId, this.dealId).subscribe(result => {
      this.showSFFormError = false; 
      this.removeLoader();
      this.referenceService.closeSweetAlert();
      if (result.statusCode == 200) {
        this.form = result.data;
        let allMultiSelects = this.form.formLabelDTOs.filter(column => column.labelType === "multiselect");
        for (let multiSelectObj of allMultiSelects) {
          if (multiSelectObj !== undefined && multiSelectObj.value !== undefined) {
            let selectedOptions = multiSelectObj.value.split(';');
            for (let option of selectedOptions) {
              this.optionObj = multiSelectObj.dropDownChoices.find(optionData => optionData.name === option);
              this.multiSelectvalueArray.push(this.optionObj);
            }
            multiSelectObj.value = this.multiSelectvalueArray;
          }
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
    /*******XNFR-403*******/
    this.validateRepValues(); 
    /*******XNFR-403*******/

  }

  private validateRepValues() {
    if (this.isConnectWiseEnabledAsActiveCRM) {
      let salesRepFormInfo = this.form.formLabelDTOs.filter(column => $.trim(column.labelName) === "Sales Rep");
      let isValidSalesRepFormInfo = salesRepFormInfo != undefined && salesRepFormInfo.length > 0;
      let salesRepValue = isValidSalesRepFormInfo ? salesRepFormInfo[0]['value'] : "";
      let isValidSalesRepValue = salesRepValue != undefined && salesRepValue != "";

      let insideRepFormInfo = this.form.formLabelDTOs.filter(column => $.trim(column.labelName) === "Inside Rep");
      let isValidInsideRepFormInfo = insideRepFormInfo != undefined && insideRepFormInfo.length > 0;
      let insideRepValue = isValidInsideRepFormInfo ? insideRepFormInfo[0]['value'] : "";
      let isValidInsideRepValue = insideRepValue != undefined && insideRepValue != "";

      let isBothRepValuesSame = isValidSalesRepValue && isValidInsideRepValue && salesRepValue == insideRepValue;
      this.isDealRegistrationFormValid = isBothRepValuesSame;
      this.isValidRepValues = !isBothRepValuesSame;
      if (!this.isValidRepValues) {
        this.referenceService.goToDiv("dealStageDiv");
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

  numericOnly(event): boolean { // restrict e,+,-,E characters in  input type number    
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }
  //
  toggleCollapseDeal(event: Event) {
    event.preventDefault();
    this.isCollapsed2 = !this.isCollapsed2;
  }
  toggleCollapseProduct(event: Event) {
    event.preventDefault();
    this.isCollapsed3 = !this.isCollapsed3;
  }

  /*****XNFR-403*****/
  searchableDropdownEventReceiver(event:any,index:number){
    console.log(event);
    let forecastItem = this.forecastItems[index];
    forecastItem['revenue'] = event['price'];
    forecastItem['catalogItem']['id'] = forecastItem['id'];
    forecastItem['price'] = forecastItem['price'];
    forecastItem['cost'] = forecastItem['cost'];
    console.log(forecastItem);
    console.log(this.forecastItems);

  }

  addProduct(){
    let forecastItem = {};
    let catalogItem = {};
    catalogItem['id'] = 0;
    forecastItem['catalogItem'] = catalogItem;
    forecastItem['cost'] = 0;
    forecastItem['price'] = 0;
    forecastItem['quantity'] = 1;
    forecastItem['opportunityId'] = 0;
    forecastItem['statusId'] = 1;
    forecastItem['revenue'] = forecastItem['price'];
    this.forecastItems.push(forecastItem);
  }

  /****XNFR-403****/
  removeProduct(index:number){
   this.forecastItems = this.referenceService.spliceArrayByIndex(this.forecastItems,index);
   console.log(this.forecastItems);
   this.referenceService.removeRowWithAnimation(index);
    
  }
}
