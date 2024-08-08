import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ContactService } from 'app/contacts/services/contact.service';
import { Form } from 'app/forms/models/form';
import { ColumnInfo } from 'app/forms/models/column-info';
import { ReferenceService } from 'app/core/services/reference.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { IntegrationService } from 'app/core/services/integration.service';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import { FadeAnimation } from 'app/core/animations/fade-animation';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';

declare var $: any, swal: any;

@Component({
  selector: 'app-sf-deal',
  templateUrl: './sf-deal.component.html',
  styleUrls: ['./sf-deal.component.css'],
  animations: [FadeAnimation]
})
export class SfDealComponent implements OnInit {
  @Input() public createdForCompanyId: any;
  @Input() public dealId: any;
  @Input() public leadId: any;
  @Input() campaign: any;
  @Input() public isPreview = false;
  @Input() isVendor = false;
  @Input() activeCRM: any;
  @Input() public ticketTypeId: any;
  @Input() public opportunityType: any;
  @Input() public selectedContact: any;
  @Input() public actionType: any;
  @Output() isFormValid = new EventEmitter();
  form: Form = new Form();
  errorMessage: string;
  isDealRegistrationFormInvalid: boolean = true;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  optionObj: any;
  showSFFormError: boolean = false;
  sfFormError: string = "";
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  isLoading = false;
  isCollapsed: boolean;
  isCollapsed2: boolean;
  isCollapsed3: any;
  /*********XNFR-403*********/
  @Input() forecastItemsJson: string;
  forecastItems: Array<any> = new Array<any>();
  searchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  isConnectWiseEnabledAsActiveCRM: boolean = false;
  isValidRepValues = true;
  /*******XNFR-403****/
  showConnectWiseProducts: boolean = false;
  isRequiredNotFilled: boolean;
  isInvalidEmailId: boolean = false;
  isInvalidAmount: boolean = false;
  isInvalidRepValues: boolean = false;
  isInvalidTextFields: boolean = false;
  isInvalidTextAreaFields: boolean = false;
  isInvalidPercentage: boolean = false;
  isInvalidWebsiteURL: boolean = false;
  isInvalidPhoneNumber: boolean = false;
  isInvalidGeoLocation: boolean = false;
  searchableDropDownDtoForLookup: SearchableDropdownDto = new SearchableDropdownDto();
  formDescription: any;
  isOnlyPartner: boolean = false;
  formLayOut = "";
  singleColumnLayout = XAMPLIFY_CONSTANTS.singleColumnLayout;
  twoColumnLayout = XAMPLIFY_CONSTANTS.twoColumnLayout;
  formHeaderClass = "";
  formGroupClass: string;
  formLabelGroupClass: string;
  constructor(private contactService: ContactService, private referenceService: ReferenceService, private integrationService: IntegrationService, public authenticationService: AuthenticationService) {
    this.isOnlyPartner = this.authenticationService.isOnlyPartner();
  }

  addLoader() {
    this.isLoading = true;
    if(this.opportunityType === 'DEAL'){
      this.referenceService.showSweetAlertProceesor('We are fetching the deal form');
    }
    if(this.opportunityType === 'LEAD'){
      this.referenceService.showSweetAlertProceesor('We are fetching the lead form');
    }
  }

  removeLoader() {
    this.isLoading = false;
    this.referenceService.closeSweetAlert();
  }

  ngOnInit() {
    this.showSFFormError = false;
    if(this.opportunityType === 'DEAL'){
      this.formLayOut = this.activeCRM['dealFormColumnLayout'];
    }else if(this.opportunityType === 'LEAD'){
      this.formLayOut = this.activeCRM['leadFormColumnLayout'];
    }
    if(this.formLayOut==undefined){
      this.formLayOut = this.twoColumnLayout;
    }
    /***Added By Sravan On 08/08/2024 */
    this.updateFormAlignments();
    if (("HALOPSA" === this.activeCRM.createdByActiveCRMType || "HALOPSA" === this.activeCRM.createdForActiveCRMType)) {
      this.dropdownSettings = {
        singleSelection: false,
        text: "Please select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: "myclass custom-class",
        limitSelection: 2
      };
    } else {
      this.dropdownSettings = {
        singleSelection: false,
        text: "Please select",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: "myclass custom-class"
      };
    }
    let isValidCreatedForComapnyId = this.createdForCompanyId != undefined && this.createdForCompanyId > 0;
    if (isValidCreatedForComapnyId) {
      this.setDealIdAsZero();
      let isCreatedByActiveTypeNotHALOPSA = "HALOPSA" !== this.activeCRM.createdByActiveCRMType;
      let isCreatedForActiveCRMTypeNotHALOPSA = "HALOPSA" !== this.activeCRM.createdForActiveCRMType;
      let isCreatedForActiveCRMTypeNotZOHO = "ZOHO" !== this.activeCRM.createdForActiveCRMType;
      if (isCreatedByActiveTypeNotHALOPSA && isCreatedForActiveCRMTypeNotHALOPSA && isCreatedForActiveCRMTypeNotZOHO) {
        this.setTicketTypeIdAsZero();
        this.addLoader();
        this.getActiveCRMCustomForm();
      }
    }
    if (("CONNECTWISE" === this.activeCRM.createdByActiveCRMType || "CONNECTWISE" === this.activeCRM.createdForActiveCRMType)) {
      this.isConnectWiseEnabledAsActiveCRM = true;
    }
  }
  /***Added By Sravan 08/08/2024****/
  private updateFormAlignments() {
    if (this.isPreview) {
      this.formHeaderClass = "col-sm-12 col-xs-12 pl0 mb_pr0 px-0";
      this.formGroupClass = "form-group";
      this.formLabelGroupClass = "control-label";
    } else {
      this.formHeaderClass = "col-sm-12 col-xs-12 pl0 mb_pr0 px-0-19";
      this.formGroupClass = "form-group col-xs-12 col-sm-6 col-md-6 col-lg-6 pl0";
      this.formLabelGroupClass = "control-label col-xs-12 col-sm-12 col-md-12 col-lg-12 pl0";
      if (this.formLayOut == XAMPLIFY_CONSTANTS.singleColumnLayout) {
        this.formHeaderClass = "col-md-6 col-lg-6 col-md-6 col-xs-6 col-md-offset-3";
        this.formGroupClass = "form-group col-md-6 col-lg-6 col-md-6 col-xs-6 col-md-offset-3 text-center";
        this.formLabelGroupClass = "control-label float-left";
        this.updateDivClassesByIntegrationSettings();
      }
    }
  }

  private updateDivClassesByIntegrationSettings() {
    let isLeadForOrDealForDivCenterAligned = false;
    if (this.opportunityType === 'LEAD') {
      let showLeadPipeline = this.activeCRM['showLeadPipeline'];
      let showLeadPipelineStage = this.activeCRM['showLeadPipelineStage'];
      isLeadForOrDealForDivCenterAligned = !showLeadPipeline && !showLeadPipelineStage;
    } else {
      let showDealPipeLine = this.activeCRM['showDealPipeline'];
      let showDealPipelineStage = this.activeCRM['showDealPipelineStage'];
      isLeadForOrDealForDivCenterAligned = !showDealPipeLine && !showDealPipelineStage;
    }
    if (isLeadForOrDealForDivCenterAligned) {
      this.formGroupClass = "form-group col-xs-12 col-sm-12 col-md-6 col-lg-12 pl0";
    } else {
      this.formHeaderClass = "col-sm-12 col-xs-12 pl0 mb_pr0 px-0-19";
    }
  }

  private setTicketTypeIdAsZero() {
    if (this.ticketTypeId == undefined || this.ticketTypeId <= 0) {
      this.ticketTypeId = 0;
    }
  }

  private setDealIdAsZero() {
    if (this.dealId == undefined || this.dealId <= 0) {
      this.dealId = 0;
    }
  }

  ngOnChanges(){
    if (this.createdForCompanyId != undefined && this.createdForCompanyId > 0) {
      if (this.dealId == undefined || this.dealId <= 0) {
        this.dealId = 0;
      }
      if (this.ticketTypeId != undefined && this.ticketTypeId > 0) {
        this.isDealRegistrationFormInvalid = true;
        this.isFormValid.emit(this.isDealRegistrationFormInvalid);
        this.addLoader();
        this.getActiveCRMCustomForm();
      }
    }
  }

  getActiveCRMCustomForm() {
    let ticketTypeId = 0;
    if (this.ticketTypeId != undefined && this.ticketTypeId > 0) {
      ticketTypeId = this.ticketTypeId;
    }
    this.integrationService.getactiveCRMCustomForm(this.createdForCompanyId, this.dealId, ticketTypeId, this.opportunityType).subscribe(result => {
      this.showSFFormError = false;
      this.removeLoader();
      if (result.statusCode == 200) {
        this.form = result.data;
        if(this.form.formLabelDTOs.length==0){
          this.showSFFormError = true;
          this.sfFormError = "Your Salesforce integration is not valid. Re-configure with valid credentials";
        }
        this.formDescription = result.data.description;
        this.form.formLabelDTOs.forEach((columnInfo: ColumnInfo) => {
          if (columnInfo.nonInteractive && (this.isOnlyPartner || !this.activeCRM.createdForSelfCompany)) {
            columnInfo.value = columnInfo.defaultChoiceLabel;
            if (columnInfo.private) {
              columnInfo.hideFieldInfo = true;
            }
          }
        });
        let allMultiSelects = this.form.formLabelDTOs.filter(column => column.labelType === "multiselect");
        let allDropdowns = this.form.formLabelDTOs.filter(column => column.labelType === "select");
        for (let multiSelectObj of allMultiSelects) {
          if (multiSelectObj !== undefined && multiSelectObj.value !== undefined) {
            let selectedOptions = multiSelectObj.value.split(';');
            let multiSelectvalueArray = [];
            for (let option of selectedOptions) {

              this.optionObj = multiSelectObj.dropDownChoices.find(optionData => optionData.name === option);
              multiSelectvalueArray.push(this.optionObj);
            }
            multiSelectObj.value = multiSelectvalueArray;
          }
        }

        for (let dropDownObj of allDropdowns) {
          if (dropDownObj !== undefined && dropDownObj.value !== undefined) {
            let haveChildrenDropDown = this.checkIfHaveChildrenDropdown(dropDownObj.id);
            if (haveChildrenDropDown) {
              let selectedParentValue = dropDownObj.value;
              this.populateDependentChildValuesByParentValue(dropDownObj.id, selectedParentValue);
            }
          }
        }


        let reqFieldsCheck = this.form.formLabelDTOs.filter(column => column.required && (column.value === undefined || column.value === ""));
        if (reqFieldsCheck.length === 0) {
          this.isDealRegistrationFormInvalid = false;
        }
        if (this.opportunityType === 'LEAD' && this.selectedContact !== undefined) {
          for (let column of this.form.formLabelDTOs) {
            let addActionType = this.actionType === 'add';
            if (column.labelId === 'Company' && addActionType) {
              column.value = this.selectedContact.companyName;
            } else if (column.labelId === 'Email') {
              if (addActionType) {
                column.value = this.selectedContact.emailId;
              }
              column.columnDisable = true;
            } else if (column.labelId === 'FirstName' && addActionType) {
              column.value = this.selectedContact.firstName;
            } else if (column.labelId === 'LastName' && addActionType) {
              column.value = this.selectedContact.lastName;
            }
          }
          this.validateAllFields();
        }
        /*********XNFR-403*********/
        if (this.dealId > 0) {
          this.forecastItems = this.referenceService.convertJsonStringToJsonObject(this.forecastItemsJson);
          if (this.forecastItems != undefined && this.forecastItems.length > 0) {
            $.each(this.forecastItems, function (index: number,
              forecastItemDto: any) {
              forecastItemDto['price'] = forecastItemDto['revenue'];
            });
          }
        }

        this.searchableDropDownDto.data = result.data.connectWiseProducts;
        this.searchableDropDownDto.placeHolder = "Please Select Product";
        this.showConnectWiseProducts = result.data.showConnectWiseProducts;
        let allLookupFields = this.form.formLabelDTOs.filter(column => column.labelType === 'lookup');
        for (let field of allLookupFields) {
          this.searchableDropDownDtoForLookup.data = field.lookupDropDownChoices;
        }
        this.searchableDropDownDtoForLookup.placeHolder = "Please Select Account";
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
            let multiSelectvalueArray = [];
            for (let option of selectedOptions) {
              this.optionObj = multiSelectObj.dropDownChoices.find(optionData => optionData.name === option);
              multiSelectvalueArray.push(this.optionObj);
            }
            multiSelectObj.value = multiSelectvalueArray;
          }
        }

        let reqFieldsCheck = this.form.formLabelDTOs.filter(column => column.required && (column.value === undefined || column.value === ""));
        if (reqFieldsCheck.length === 0) {
          this.isDealRegistrationFormInvalid = false;
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

  selectOnChangeEvent(columnInfo: any) {
    let haveChildrenDropDown = this.checkIfHaveChildrenDropdown(columnInfo.id);
    if (haveChildrenDropDown) {
      let selectedValue = columnInfo.value;
      this.populateDependentChildValues(columnInfo.id, selectedValue);
    }
    this.validateAllFields();
  }

  populateDependentChildValuesByParentValue(parentId: any, selectedValue: string) {
    this.form.formLabelDTOs.forEach(column => {
      if (column.parentLabelId === parentId) {
        column.dropDownChoices = column.dependentDropDownChoices.filter(choice =>
          Array.isArray(choice.parentChoices) && choice.parentChoices.some(parentChoice => parentChoice.name === selectedValue)
        );
      }
    });
  }

  checkIfHaveChildrenDropdown(id: any): boolean {
    let dependentChildPickList = this.form.formLabelDTOs.filter(column => column.parentLabelId == id);
    if (dependentChildPickList != undefined && dependentChildPickList.length != 0) {
      return true;
    }
    return false;
  }

  populateDependentChildValues(parentId: any, selectedValue: string) {
    this.form.formLabelDTOs.forEach(column => {
      if (column.parentLabelId === parentId) {
        column.value = "";
        column.dropDownChoices = column.dependentDropDownChoices.filter(choice =>
          Array.isArray(choice.parentChoices) && choice.parentChoices.some(parentChoice => parentChoice.name === selectedValue)
        );
        let haveChildrenDropDown = this.checkIfHaveChildrenDropdown(column.id);
        if (haveChildrenDropDown) {
          let selectedValue = column.value;
          this.populateDependentChildValues(column.id, selectedValue);
        }
      }
    });
  }

  validateAllFields() {
    let reqFieldsCheck = this.form.formLabelDTOs.filter(column => column.required && (column.value === undefined || column.value === "" || column.value === null || (column.value !== null && column.value.length === 0) || column.value === "false"));
    if (reqFieldsCheck.length === 0) {
      this.isRequiredNotFilled = false;
    } else {
      this.isRequiredNotFilled = true;
    }
    let allEmails = this.form.formLabelDTOs.filter(column => column.labelType === "email");
    for (let emailObj of allEmails) {
      this.validateEmailId(emailObj);
    }

    let allTexts = this.form.formLabelDTOs.filter(column => column.labelType === "text");
    for (let textObj of allTexts) {
      this.validateRequiredTextFields(textObj);
    }

    let allTextAreas = this.form.formLabelDTOs.filter(column => column.labelType === "textarea");
    for (let textAreaObj of allTextAreas) {
      this.validateRequiredTextAreaFields(textAreaObj);
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

    let allAmount = this.form.formLabelDTOs.filter(column => column.labelType === "number");
    for (let amoObj of allAmount) {
      this.validateAmount(amoObj);
    }
    /*******XNFR-403*******/
    this.validateRepValues();
    /*******XNFR-403*******/

    this.isDealRegistrationFormInvalid = this.isRequiredNotFilled || this.isInvalidEmailId || this.isInvalidAmount || this.isInvalidGeoLocation ||
      this.isInvalidPercentage || this.isInvalidPhoneNumber || this.isInvalidRepValues || this.isInvalidTextAreaFields ||
      this.isInvalidTextFields || this.isInvalidWebsiteURL;
    this.isFormValid.emit(this.isDealRegistrationFormInvalid);
  }
  validateAmount(columnInfo: ColumnInfo) {
    let amount = columnInfo.value;
    if (amount < 0) {
      columnInfo.errorMessage = "Please enter valid amount ";
      columnInfo.divClass = "error";
      this.isInvalidAmount = true;
    } else {
      columnInfo.divClass = "success";
      this.isInvalidAmount = false;
    }
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

      if (isValidSalesRepValue && isValidInsideRepValue) {
        let isBothRepValuesSame = false;
        if (salesRepValue == insideRepValue) {
          isBothRepValuesSame = true;
        }
        this.isInvalidRepValues = isBothRepValuesSame;
        this.isValidRepValues = !isBothRepValuesSame;
        if (!this.isValidRepValues) {
          this.referenceService.goToDiv("dealStageDiv");
        }
      }
    }
  }

  validateEmailId(columnInfo: ColumnInfo) {
    columnInfo.divClass = "success";
    if (columnInfo.value !== null && columnInfo.value !== "" && columnInfo.value !== undefined) {
      if (!this.referenceService.validateEmailId($.trim(columnInfo.value))) {
        columnInfo.errorMessage = "Please enter a valid email address";
        columnInfo.divClass = "error";
        this.isInvalidEmailId = true;
      } else {
        this.isInvalidEmailId = false;
      }
    }
  }

  validateRequiredTextFields(columnInfo: ColumnInfo) {
    columnInfo.divClass = "success";
    if (columnInfo.value !== null && columnInfo.value !== "" && columnInfo.value !== undefined) {
      if (!($.trim(columnInfo.value).length > 0) && columnInfo.required) {
        columnInfo.errorMessage = "Required";
        columnInfo.divClass = "error";
        this.isInvalidTextFields = true;
      } else {
        this.isInvalidTextFields = false;
      }
    }
  }

  validateRequiredTextAreaFields(columnInfo: ColumnInfo) {
    columnInfo.divClass = "success";
    if (columnInfo.value !== null && columnInfo.value !== "" && columnInfo.value !== undefined) {
      if (!($.trim(columnInfo.value).length > 0) && columnInfo.required) {
        columnInfo.errorMessage = "Required";
        columnInfo.divClass = "error";
        this.isInvalidTextAreaFields = true;
      } else {
        this.isInvalidTextAreaFields = false;
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
        this.isInvalidPercentage = true;
      } else {
        columnInfo.divClass = "success";
        this.isInvalidPercentage = false;
      }
    }
  }

  validateWebsiteURL(columnInfo: ColumnInfo) {
    columnInfo.divClass = "success";
    if (columnInfo.value !== null && columnInfo.value !== "" && columnInfo.value !== undefined) {
      if (!this.referenceService.validateWebsiteURL($.trim(columnInfo.value))) {
        columnInfo.errorMessage = "Please enter a valid URL";
        columnInfo.divClass = "error";
        this.isInvalidWebsiteURL = true;
      } else {
        this.isInvalidWebsiteURL = false;
      }
    }
  }

  validatePhoneNumber(columnInfo: ColumnInfo) {
    if (columnInfo.value !== null && columnInfo.value !== "" && columnInfo.value !== undefined) {
      let phoneNumber = columnInfo.value.toString();
      if (phoneNumber.length < 8 || !this.referenceService.validatePhoneNumber($.trim(phoneNumber))) {
        columnInfo.errorMessage = "Please enter valid phone number";
        columnInfo.divClass = "error";
        this.isInvalidPhoneNumber = true;
      } else {
        columnInfo.divClass = "success";
        this.isInvalidPhoneNumber = false;
      }
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

  validateGeoLocation(columnInfo: ColumnInfo) {
    if (columnInfo.value !== null && columnInfo.value !== "" && columnInfo.value !== undefined) {
      var x = parseFloat($.trim(columnInfo.value));
      if ((columnInfo.labelName.includes('Latitude')) && (isNaN(x) || x < -90 || x > 90)) {
        columnInfo.errorMessage = "Please enter a value from -90 to 90";
        columnInfo.divClass = "error";
        this.isInvalidGeoLocation = true;
      } else if ((columnInfo.labelName.includes('Longitude')) && (isNaN(x) || x < -180 || x > 180)) {
        columnInfo.errorMessage = "Please enter a value from -180 to 180";
        columnInfo.divClass = "error";
        this.isInvalidGeoLocation = true;
      } else {
        columnInfo.divClass = "success";
        this.isInvalidGeoLocation = false;
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
  addProduct() {
    let forecastItem = {};
    forecastItem['forecastType'] = "Product";
    let catalogItem = {};
    catalogItem['id'] = 0;
    forecastItem['catalogItem'] = catalogItem;
    forecastItem['cost'] = 0;
    forecastItem['price'] = 0;
    forecastItem['quantity'] = 1;
    let opportunity = {};
    opportunity['id'] = 0;
    forecastItem['opportunity'] = opportunity;
    let status = {};
    status['id'] = 1;
    forecastItem['status'] = status;
    forecastItem['revenue'] = forecastItem['price'];
    this.forecastItems.push(forecastItem);
  }

  /*****XNFR-403*****/
  searchableDropdownEventReceiver(event: any, index: number) {
    let forecastItem = this.forecastItems[index];
    forecastItem['catalogItem']['id'] = event['id'];
    forecastItem['price'] = event['price'];
    forecastItem['cost'] = event['cost'];
    forecastItem['revenue'] = event['price'];
  }

  /****XNFR-403****/
  removeProduct(index: number) {
    this.forecastItems = this.referenceService.spliceArrayByIndex(this.forecastItems, index);
    this.referenceService.removeRowWithAnimation(index);

  }

  searchableDropDownDtoForLookupField(columnInfo: any) {
    let searchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
    searchableDropDownDto.data = columnInfo.lookupDropDownChoices;
    searchableDropDownDto.placeHolder = `Please Select ${columnInfo.labelName}`;
    return searchableDropDownDto;
  }

}
