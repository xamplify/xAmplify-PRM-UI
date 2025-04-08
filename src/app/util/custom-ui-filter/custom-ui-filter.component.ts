import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges  } from '@angular/core';
import { Router } from '@angular/router';
import { Criteria } from 'app/contacts/models/criteria';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { WhiteLabeledContentSharedByVendorCompaniesDto } from 'app/dam/models/white-labeled-content-shared-by-vendor-companies-dto';

@Component({
	selector: 'app-custom-ui-filter',
	templateUrl: './custom-ui-filter.component.html',
	styleUrls: ['./custom-ui-filter.component.css']
})
export class CustomUiFilterComponent implements OnInit, OnDestroy, OnChanges  {

	@Input() type: any
	@Input() fileTypes = [];
	@Input() isPartnerView: boolean;
	/*** XBI-2133 ****/
	@Input() isWhiteLabeledAsset: boolean;
	@Input() whiteLableContentSharedByVendorCompanies: WhiteLabeledContentSharedByVendorCompaniesDto[] = [];
	/**** XBI-2133 ***/
	@Output() filterConditionsEmitter = new EventEmitter();
	@Output() closeFilterEmitter = new EventEmitter();
	@Output() cancelSegmentationRowEmitter = new EventEmitter();
	@Input() isFromApprovalHub: boolean = false;
	@Input() selectedFilterType: any;
	filterOptions: any[] = [];
	filterConditions = [
		{ 'name': 'eq', 'value': '=' },
		{ 'name': 'like', 'value': 'Contains' },
	];
	@Input() criterias = new Array<Criteria>();
	isclearFilter: boolean;
	@Input() fromDateFilter: any;
	@Input() toDateFilter: any;
	isValidationErrorMessage: boolean;
	filterConditionErrorMessage: any;
	pagination: Pagination = new Pagination();
	parterViewText: string;
	dropdownDisabled: boolean[] = [];
	allfilterOptions: any[] = [];
	seletedFiterArray: any[] = [];
	selectedConditionArray: any[] = [];
	@Input() criteria: Criteria ;
	isAssetTabSelected: any = false;
	sortOption: SortOption = new SortOption();


	constructor(private router: Router,public authenticationService: AuthenticationService) {
	}
	ngOnDestroy(): void {
	}
	ngOnInit() {
	}
	ngOnChanges(changes: SimpleChanges){
		
		if(this.allfilterOptions.length==0){
		   this.addFilterOptionsValues(this.type);
		}

		if (this.isFromApprovalHub) {
			this.isValidationErrorMessage = false;
			this.filterConditionErrorMessage = "";
			if (this.selectedFilterType == 'ASSETS') {
				this.isAssetTabSelected = true;
			} else {
				this.isAssetTabSelected = false;
			}
		}

		if(this.criteria.property != "Field Name*" && this.criteria.operation != "Condition*"
		         && this.criterias !=undefined &&  this.criterias.length > 0
		         && this.criterias[this.criterias.length-1].property ==  "Field Name*" 
                 &&  this.criterias[this.criterias.length-1].operation ==  "Condition*"){
	
	        this.criterias[this.criterias.length-1].property = this.criteria.property;
	        this.criterias[this.criterias.length-1].operation = this.criteria.operation;
	        this.criterias[this.criterias.length-1].value1 = this.criteria.value1;
	
	        this.selectedConditionArray[this.criterias.length-1] = this.criteria.operation;
			this.onSelection(this.criteria, this.criterias.length-1);
			this.isclearFilter = true;
			this.submittFilterData();
			
		}else if(this.criteria.property != "Field Name*" && this.criteria.operation != "Condition*") {
			let keyExists = this.criterias.some(criteria => criteria.property === 'tags');  
			if(!keyExists){
			this.selectedConditionArray[this.criterias.length] = this.criteria.operation;
			this.onSelection(this.criteria, this.criterias.length);
			this.criterias.push(this.criteria);
			this.isclearFilter = true;
			this.submittFilterData();
			}
			
		}
	}
	addFilterOptionsValues(type: string) {
		if (type === "Assets") {
			this.filterOptions.push(
				{ 'name': 'assetsname', 'value': 'Asset Name' },
				{ 'name': 'folder', 'value': 'Folder' },
				{ 'name': 'type', 'value': 'Type' }
			);

			if (!this.isFromApprovalHub) {
				this.filterOptions.push({ 'name': 'tags', 'value': 'Tags' });
			}

			if (this.router.url.indexOf('/fl') > -1 || this.router.url.indexOf('/fg') > -1) {
				this.filterOptions = this.filterOptions.filter(item => item.name !== 'folder'); //XNFR-409
			}
			if (this.isPartnerView) {
				//XBI-3660 add if condition
				if (!this.authenticationService.module.loggedInThroughVendorVanityUrl) {
					this.filterOptions.push({ 'name': 'publishedby', 'value': 'Published By' },
						{ 'name': 'from', 'value': 'From' });
				}
				this.parterViewText = "Published On";
			} else {
				this.filterOptions.push({ 'name': 'createdby', 'value': 'Created By' });
				this.parterViewText = "Created On";
				/*** XBI-2133 ***/
				if (this.isWhiteLabeledAsset) {
					this.filterOptions.push({ 'name': 'from', 'value': 'From' });
				}
			}
			this.allfilterOptions = this.filterOptions;
		} else if (type == "Partners") {
			this.filterOptions = [...this.sortOption.commonFilterOptions, ...this.sortOption.partnerFilterOptions];
			this.allfilterOptions = this.filterOptions;
			this.parterViewText = "Onboarded On";
		}
		
		if( this.criteria.property == "Field Name*" && this.criteria.operation == "Condition*" && this.criterias.length==0) {
		   this.addNewRow();
		} else if (this.criterias != undefined && this.criterias.length > 0) {
			this.criterias.forEach((criteria, index) => {
				this.onSelection(criteria, index);
				this.dropdownDisabled[index] = true;
			});
			this.isclearFilter = true;
		}
		
	}
	addNewRow() {
		let criteria = new Criteria();
		this.criterias.push(criteria);
		this.dropdownDisabled.push(false);
	}
	eventEnterKeyHandler(keyCode: any) {
		if (keyCode === 13) {
			this.submittFilterData();
			this.validateDateFilters();
		}
	}
	cancelSegmentationRow(index: number) {
		let removedOption = this.criterias[index].property;
		if (removedOption) {
			this.seletedFiterArray.splice(index, 1);
			this.compareArrays();
		}
	    let removedCondition = this.criterias[index].operation;
		if (removedCondition) {
			this.selectedConditionArray.splice(index, 1);
		}
		this.criterias.splice(index, 1);
		this.dropdownDisabled.splice(index, 1);
		
		let input = {};
        input['property'] = removedOption;
		this.cancelSegmentationRowEmitter.emit(input);
	}
	validateDateFilters() {
		if (this.fromDateFilter != undefined && this.fromDateFilter != "") {
			var fromDate = Date.parse(this.fromDateFilter);
			if (this.toDateFilter != undefined && this.toDateFilter != "") {
				var toDate = Date.parse(this.toDateFilter);
				this.isValidationErrorMessage = this.validateDateLessThanOrGreaterThan(fromDate, toDate);
			} else {
				this.isValidationErrorMessage = true;
				this.filterConditionErrorMessage = "Please pick To Date";
			}
		} else if (this.toDateFilter != undefined && this.toDateFilter != "") {
			this.isValidationErrorMessage = true;
			var toDate = Date.parse(this.toDateFilter);
			if (this.fromDateFilter != undefined && this.fromDateFilter != "") {
				var fromDate = Date.parse(this.fromDateFilter);
				this.isValidationErrorMessage = this.validateDateLessThanOrGreaterThan(fromDate, toDate);
			} else {
				this.isValidationErrorMessage = true;
				this.filterConditionErrorMessage = "Please pick From Date";
			}
		} else {
			this.isValidationErrorMessage = false;
			this.pagination.fromDateFilterString = this.fromDateFilter;
			this.pagination.toDateFilterString   = this.toDateFilter;
			if(this.pagination.fromDateFilterString == "" && this.pagination.toDateFilterString == ""){
				this.pagination.dateFilterOpionEnable = false;
			}
		}
		if (!this.isValidationErrorMessage) {
			this.criteriaValidation();
		}
	}
	criteriaValidation() {
		for (let i = 0; i < this.criterias.length; i++) {
			if (this.criterias[i].property == "Field Name*" || this.criterias[i].operation == "Condition*" || (this.criterias[i].value1 == undefined || this.criterias[i].value1.trim() == "" || this.criterias[i].value1 == "undefined")) {
				if (this.pagination.dateFilterOpionEnable && this.criterias.length == 1) {
					this.isValidationErrorMessage = false
				} else {
					this.isValidationErrorMessage = true;
				}
				if (this.criterias[i].property == "Field Name*" && this.criterias[i].operation == "Condition*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1.trim() == "" || this.criterias[i].value1 == "undefined")) {
					this.filterConditionErrorMessage = "Please fill the required data at position " + (i + 1);
					if (this.criterias[i].value1 != undefined) {
						this.criterias[i].value1 = this.criterias[i].value1.trim();
					}
				} else if (this.criterias[i].property == "Field Name*" && this.criterias[i].operation == "Condition*") {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Field Name and Condition at position " + (i + 1);
				} else if (this.criterias[i].property == "Field Name*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1.trim() == "" || this.criterias[i].value1 == "undefined")) {
					this.isValidationErrorMessage = true;
					if (this.criterias[i].value1 != undefined) {
						this.criterias[i].value1 = this.criterias[i].value1.trim();
					}
					this.filterConditionErrorMessage = "Please select the Field Name and Value at position " + (i + 1);
				} else if (this.criterias[i].operation == "Condition*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1.trim() == "" || this.criterias[i].value1 == "undefined")) {
					this.isValidationErrorMessage = true;
					if (this.criterias[i].value1 != undefined) {
						this.criterias[i].value1 = this.criterias[i].value1.trim();
					}
					this.filterConditionErrorMessage = "Please select the Condition and Value at position " + (i + 1);
				} else if (this.criterias[i].operation == "Condition*") {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Condition at position " + (i + 1);
				} else if (this.criterias[i].property == "Field Name*") {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Field Name at position " + (i + 1);
				} else if (this.criterias[i].value1 == undefined || this.criterias[i].value1.trim() == "" || this.criterias[i].value1 == "undefined") {
					this.isValidationErrorMessage = true;
					if (this.criterias[i].value1 != undefined) {
						this.criterias[i].value1 = this.criterias[i].value1.trim();
					}
					this.filterConditionErrorMessage = "Please fill the value at position " + (i + 1);
				}
				break;
			} else {
				this.isValidationErrorMessage = false;
				this.pagination.filterOptionEnable = true;
				this.dropdownDisabled[i] = true;
			}
		}
		if (!this.isValidationErrorMessage) {
			this.addCriteriasCondtions();
		}
	}
	private addCriteriasCondtions() {
		if (!this.isValidationErrorMessage) {
			let criteriaConditionsArray = new Array<Criteria>();
			for (let i = 0; i < this.criterias.length; i++) {
				let criteriaObject = new Criteria();
				if (this.criterias[i].operation == "=") {
					criteriaObject.operation = "eq";
				}
				if (this.criterias[i].operation == "Contains") {
					criteriaObject.operation = "like";
				}
				if (this.criterias[i].property == "Asset Name") {
					criteriaObject.property = "assetsname";
				} else if (this.criterias[i].property == "Folder") {
					criteriaObject.property = "folder";
				} else if (this.criterias[i].property == "Type") {
					criteriaObject.property = "type";
				} else if (this.criterias[i].property == "Tags") {
					criteriaObject.property = "tags";
				} else if (this.criterias[i].property == "Created By") {
					criteriaObject.property = "createdby";
				} else if (this.criterias[i].property == "Published By") {
					criteriaObject.property = "publishedby";
				} else if (this.criterias[i].property == "From") {
					criteriaObject.property = "from";
				} else if (this.criterias[i].property == "First Name") {
					criteriaObject.property = "firstName";
				} else if (this.criterias[i].property == "Last Name") {
					criteriaObject.property = "lastName";
				} else if (this.criterias[i].property == "Company") {
					criteriaObject.property = "contactCompany";
				} else if (this.criterias[i].property == "Job Title") {
					criteriaObject.property = "jobTitle";
				} else if (this.criterias[i].property == "Email Id") {
					criteriaObject.property = "emailId";
				} else if (this.criterias[i].property == "Country") {
					criteriaObject.property = "country";
				} else if (this.criterias[i].property == "City") {
					criteriaObject.property = "city";
				} else if (this.criterias[i].property == "Mobile Number") {
					criteriaObject.property = "mobileNumber";
				} else if (this.criterias[i].property == "Notes") {
					criteriaObject.property = "description";
				} else {
					criteriaObject.property = this.criterias[i].property;
				}
				criteriaObject.value1 = this.criterias[i].value1;
				criteriaConditionsArray.push(criteriaObject);
			}
			this.pagination.criterias = criteriaConditionsArray;
			this.pagination.pageIndex = 1;
		}
	}
	validateDateLessThanOrGreaterThan(fromDate: any, toDate: any): boolean {
		if (fromDate <= toDate) {
			this.pagination.fromDateFilterString = this.fromDateFilter;
			this.pagination.toDateFilterString = this.toDateFilter;
			this.pagination.dateFilterOpionEnable = true;
			this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			this.isValidationErrorMessage = false;
		} else {
			this.isValidationErrorMessage = true;
			this.filterConditionErrorMessage = "From date should be less than To date";
		}
		return this.isValidationErrorMessage;
	}

	submittFilterData() {
		if (this.isFromApprovalHub && !this.isAssetTabSelected) {
			this.validateDateFiltersForApprovalHub();
			if (this.isValidationErrorMessage) {
				console.log(this.isValidationErrorMessage);
			} else if (!this.isValidationErrorMessage && this.pagination.fromDateFilterString.length == 0 &&
				this.pagination.toDateFilterString.length == 0) {
				this.closeFilterOption('close');
			} else {
				this.frameInputValuesForEmit();
			}
		} else {
			this.validateDateFilters();
			this.validateAndEmitValues();
		}
	}

	validateAndEmitValues() {
		if(this.isValidationErrorMessage){
			console.log(this.isValidationErrorMessage);
		}else if(!this.isValidationErrorMessage && (this.pagination.criterias==undefined ||this.pagination.criterias==null ||
		 this.pagination.criterias.length == 0) && (this.pagination.fromDateFilterString == undefined  ||this.pagination.fromDateFilterString.length == 0)
	  && (this.pagination.toDateFilterString == undefined || this.pagination.toDateFilterString.length==0) ){
				this.closeFilterOption('close');
		}else{
		// this.validateDateFilters();
		this.frameInputValuesForEmit();
	  }
	}

	frameInputValuesForEmit() {
		let input = {};
		input['fromDate'] = this.pagination.fromDateFilterString;
		input['toDate'] = this.pagination.toDateFilterString;
		input['zone'] = this.pagination.timeZone;
		input['criterias'] = this.pagination.criterias;
		input['isDateFilter'] = this.pagination.dateFilterOpionEnable;
		input['isCriteriasFilter'] = this.pagination.filterOptionEnable;
		input['existingCriterias'] = this.criterias;
		input['fromDateFilter'] = this.fromDateFilter;
		input['toDateFilter'] = this.toDateFilter;
		if (!this.isValidationErrorMessage) {
			this.isclearFilter = true;
			this.filterConditionsEmitter.emit(input);
		}
	}
	
	closeFilterOption(event: any) {
		if (event == "clear") {
			this.selectedConditionArray = [];
			this.seletedFiterArray = [];
			this.criterias = new Array<Criteria>();
			this.isclearFilter = false;
			this.fromDateFilter = "";
			this.toDateFilter = "";
			this.pagination.fromDateFilterString = "";
			this.pagination.toDateFilterString = "";
			this.pagination.dateFilterOpionEnable = false;
			this.pagination.filterOptionEnable = false;
			this.isValidationErrorMessage = false;
			this.dropdownDisabled = [];
			this.filterOptions = [];
			this.allfilterOptions = [];
		}
		this.closeFilterEmitter.emit(event);
	}
	getOptionsForCriteria(criteria: any, index: number) {
		if ((criteria.property === 'From' || criteria.property === 'Type') && this.type != 'Partners') {
			this.criterias[index].operation = "=";
			this.criterias[index].value1 = "undefined";
		} else {
			this.criterias[index].value1 = "";
		}
		this.onSelection(criteria, index);
	}

	onSelection(criteria: any, index: number) {
		this.seletedFiterArray[index] = criteria.property;
		this.compareArrays();
	}
	compareArrays() {
		const resultArray = [];
		resultArray.push(...this.allfilterOptions);
		this.seletedFiterArray.forEach((selectedItem) => {
			const index = resultArray.findIndex((element) => element.value === selectedItem);
			if (index !== -1) {
				resultArray.splice(index, 1);
			}
		});
		this.filterOptions = resultArray;
	}


	setConditionsForCriteria(criteria: any, index: number) {
		this.selectedConditionArray[index] = criteria.operation;
	}

	// XNFR-837
	validateDateFiltersForApprovalHub() {
		let isValidFromDateFilter = this.fromDateFilter != undefined && this.fromDateFilter != "";
		let isEmptyFromDateFilter = this.fromDateFilter == undefined || this.fromDateFilter == "";
		let isValidToDateFilter = this.toDateFilter != undefined && this.toDateFilter != "";
		let isEmptyToDateFilter = this.toDateFilter == undefined || this.toDateFilter == "";
		if (isEmptyFromDateFilter && isEmptyToDateFilter) {
			this.isValidationErrorMessage = true;
			this.filterConditionErrorMessage = "Please provide valid input to filter";
		} else {
			let validDates = false;
			if (isValidFromDateFilter && isEmptyToDateFilter) {
				this.isValidationErrorMessage = true;
				this.filterConditionErrorMessage = "Please pick To Date";
			} else if (isValidToDateFilter && isEmptyFromDateFilter) {
				this.isValidationErrorMessage = true;
				this.filterConditionErrorMessage = "Please pick From Date";
			} else {
				var toDate = Date.parse(this.toDateFilter);
				var fromDate = Date.parse(this.fromDateFilter);
				if (fromDate <= toDate) {
					validDates = true;
				} else {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "From Date should be less than To Date";
				}
			}

			if (validDates) {
				this.isValidationErrorMessage = false;
				this.pagination.fromDateFilterString = this.fromDateFilter;
				this.pagination.toDateFilterString = this.toDateFilter;
			}
		}
	}

	handleCriteriaValue(value:any, index:any) {
		this.criterias[index].value1 = value.trim();
	}
}
