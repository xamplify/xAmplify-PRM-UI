import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Criteria } from 'app/contacts/models/criteria';
import { Pagination } from 'app/core/models/pagination';
import { WhiteLabeledContentSharedByVendorCompaniesDto } from 'app/dam/models/white-labeled-content-shared-by-vendor-companies-dto';

@Component({
	selector: 'app-custom-ui-filter',
	templateUrl: './custom-ui-filter.component.html',
	styleUrls: ['./custom-ui-filter.component.css']
})
export class CustomUiFilterComponent implements OnInit, OnDestroy {

	@Input() type: any
	@Input() fileTypes = [];
	@Input() isPartnerView: boolean;
	/*** XBI-2133 ****/
	@Input() isWhiteLabeledAsset: boolean;
	@Input() whiteLableContentSharedByVendorCompanies: WhiteLabeledContentSharedByVendorCompaniesDto[] = [];
	/**** XBI-2133 ***/
	@Output() filterConditionsEmitter = new EventEmitter();
	@Output() closeFilterEmitter = new EventEmitter();
	filterOptions: any[] = [];
	filterConditions = [
		{ 'name': '', 'value': 'Condition*' },
		{ 'name': 'eq', 'value': '=' },
		{ 'name': 'like', 'value': 'Contains' },
	];
	criterias = new Array<Criteria>();
	isclearFilter: boolean;
	fromDateFilter: any;
	toDateFilter: any;
	isValidationErrorMessage: boolean;
	filterConditionErrorMessage: any;
	pagination: Pagination = new Pagination();
	parterViewText: string;
	dropdownDisabled: boolean[] = [];
	allfilterOptions: any[] = [];
	seletedFiterArray: any[] = [];
	constructor(private router: Router) {
	}
	ngOnDestroy(): void {
	}
	ngOnInit() {
		this.addFilterOptionsValues(this.type)
	}
	addFilterOptionsValues(type: string) {
		if (type === "Assets") {
			this.filterOptions.push(
				// { 'name': '', 'value': 'Field Name*' },
				{ 'name': 'assetsname', 'value': 'Assets Name' },
				{ 'name': 'folder', 'value': 'Folder' },
				{ 'name': 'type', 'value': 'Type' },
				{ 'name': 'tags', 'value': 'Tags' }
			);
			if (this.router.url.indexOf('/fl') > -1 || this.router.url.indexOf('/fg') > -1) {
				this.filterOptions = this.filterOptions.filter(item => item.name !== 'folder'); //XNFR-409
			}
			if (this.isPartnerView) {
				this.filterOptions.push({ 'name': 'publishedby', 'value': 'Published By' },
					{ 'name': 'from', 'value': 'From' });
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
		}
		this.addNewRow();
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
		this.criterias.splice(index, 1);
		this.dropdownDisabled.splice(index, 1);
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
		}
		if (!this.isValidationErrorMessage) {
			this.criteriaValidation();
		}
	}
	criteriaValidation() {
		for (let i = 0; i < this.criterias.length; i++) {
			if (this.criterias[i].property == "Field Name*" || this.criterias[i].operation == "Condition*" || (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "" || this.criterias[i].value1 == "undefined")) {
				if (this.pagination.dateFilterOpionEnable && this.criterias.length == 1) {
					this.isValidationErrorMessage = false
				} else {
					this.isValidationErrorMessage = true;
				}
				if (this.criterias[i].property == "Field Name*" && this.criterias[i].operation == "Condition*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "" || this.criterias[i].value1 == "undefined")) {
					this.filterConditionErrorMessage = "Please fill the required data at position " + (i + 1);
				} else if (this.criterias[i].property == "Field Name*" && this.criterias[i].operation == "Condition*") {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Field Name and Condition at position " + (i + 1);
				} else if (this.criterias[i].property == "Field Name*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "" || this.criterias[i].value1 == "undefined")) {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Field Name and Value at position " + (i + 1);
				} else if (this.criterias[i].operation == "Condition*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "" || this.criterias[i].value1 == "undefined")) {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Condition and Value at position " + (i + 1);
				} else if (this.criterias[i].operation == "Condition*") {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Condition at position " + (i + 1);
				} else if (this.criterias[i].property == "Field Name*") {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Field Name at position " + (i + 1);
				} else if (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "" || this.criterias[i].value1 == "undefined") {
					this.isValidationErrorMessage = true;
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
				if (this.criterias[i].property == "Assets Name") {
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
		this.validateDateFilters();
		let input = {};
		input['fromDate'] = this.pagination.fromDateFilterString;
		input['toDate'] = this.pagination.toDateFilterString;
		input['zone'] = this.pagination.timeZone;
		input['criterias'] = this.pagination.criterias;
		input['isDateFilter'] = this.pagination.dateFilterOpionEnable;
		input['isCriteriasFilter'] = this.pagination.filterOptionEnable;
		if (!this.isValidationErrorMessage) {
			this.isclearFilter = true;
			this.filterConditionsEmitter.emit(input);
		}
	}
	closeFilterOption(event: any) {
		if (event == "clear") {
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
			this.filterOptions = this.allfilterOptions;
			this.addNewRow();
		}
		this.closeFilterEmitter.emit(event);
	}
	getOptionsForCriteria(criteria: any, index: number) {
		if (criteria.property === 'From' || criteria.property === 'Type') {
			this.criterias[index].operation = "=";
			this.criterias[index].value1 = "undefined";
		} else {
			this.criterias[index].operation = "Condition*";
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
}
