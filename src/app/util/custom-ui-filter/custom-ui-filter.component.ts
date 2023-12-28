import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Criteria } from 'app/contacts/models/criteria';
import { Pagination } from 'app/core/models/pagination';

@Component({
  selector: 'app-custom-ui-filter',
  templateUrl: './custom-ui-filter.component.html',
  styleUrls: ['./custom-ui-filter.component.css']
})
export class CustomUiFilterComponent implements OnInit {

   @Input() type:any
   @Input() filterOptions =[];
   @Input() filterConditions = [];
   @Input() fileTypes=[];
   @Input() showFilterOption:boolean;
   @Output() filterConditionsEmitter =  new EventEmitter();
   @Output() closeFilterEmitter = new EventEmitter();
	 @Input() criterias = new Array<Criteria>();
   isclearFilter:boolean;
   fromDateFilter:any;
   toDateFilter:any;
   isValidationErrorMessage:boolean;
   filterConditionErrorMessage:any;
   pagination: Pagination = new Pagination();
  constructor() {
   }

  ngOnInit() {

  }
  
  addNewRow() {
		let criteria = new Criteria();
		this.criterias.push(criteria);
	}
  closeFilterOption() {
    this.showFilterOption = false;
    this.fromDateFilter = "";
    this.toDateFilter = "";
	this.criterias.splice(0, this.criterias.length);
    this.pagination.fromDateFilterString = "";
    this.pagination.toDateFilterString = "";
    this.closeFilterEmitter.emit(this.showFilterOption);
  }
  eventEnterKeyHandler(keyCode: any) {
		if (keyCode === 13) {
			this.submittFilterData();
			this.validateDateFilters();
		}
	}
  cancelSegmentationRow(rowId: number) {
		if (rowId !== -1) {
			this.criterias.splice(rowId, 1);
		}
	}
  validateDateFilters() {
		if (this.fromDateFilter != undefined && this.fromDateFilter != "") {
			var fromDate = Date.parse(this.fromDateFilter);
			if (this.toDateFilter != undefined && this.toDateFilter != "") {
				var toDate = Date.parse(this.toDateFilter);
				this.validateDateLessThanOrGreaterThan(fromDate,toDate);
			} else {
				this.isValidationErrorMessage = true;
				this.filterConditionErrorMessage = "Please pick To Date";
			}
		} else if(this.toDateFilter != undefined && this.toDateFilter != "") {
			this.isValidationErrorMessage = true;
			var toDate = Date.parse(this.toDateFilter);
			if(this.fromDateFilter != undefined && this.fromDateFilter != "") {
				var fromDate = Date.parse(this.fromDateFilter);
				this.validateDateLessThanOrGreaterThan(fromDate,toDate);
			} else {
				this.isValidationErrorMessage = true;
				this.filterConditionErrorMessage = "Please pick From Date";
			}
		}
		this.criteriaValidation();
	}
	criteriaValidation() {
		if (((this.fromDateFilter == undefined || this.fromDateFilter == "") && (this.toDateFilter == undefined || this.toDateFilter == "")) || (this.fromDateFilter != undefined && this.fromDateFilter != "" && this.toDateFilter != undefined && this.toDateFilter != "")) {
			for (let i = 0; i < this.criterias.length; i++) {
				if (this.criterias[i].property == "Field Name*" && this.criterias[i].operation == "Condition*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "")) {
					if (((this.fromDateFilter == undefined || this.fromDateFilter == "") && (this.toDateFilter == undefined || this.toDateFilter == ""))) {
						this.isValidationErrorMessage = true;
						this.filterConditionErrorMessage = "Please fill the required data at position " + i;
					} else {
						if((this.fromDateFilter != undefined && this.fromDateFilter != "" && this.toDateFilter != undefined && this.toDateFilter != "")) {
						this.validateDateLessThanOrGreaterThan(Date.parse(this.fromDateFilter),Date.parse(this.toDateFilter))
					} else {
						this.isValidationErrorMessage = false;
					}
						this.pagination.filterOptionEnable = false;
					}
				} else if(this.isFromDateless){
					this.isValidationErrorMessage = true;
				} else if (this.criterias[i].property == "Field Name*" && this.criterias[i].operation == "Condition*") {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Field Name and Condition at position " + i;
				} else if (this.criterias[i].property == "Field Name*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "")) {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Field Name and Value at position " + i;
				} else if (this.criterias[i].operation == "Condition*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "")) {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Condition and Value at position " + i;
				} else if (this.criterias[i].operation == "Condition*") {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Condition at position " + i;
				} else if (this.criterias[i].property == "Field Name*") {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please select the Field Name at position " + i;
				} else if (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "") {
					this.isValidationErrorMessage = true;
					this.filterConditionErrorMessage = "Please fill the value at position " + i;
				} else {
					this.isValidationErrorMessage = false;
					this.pagination.filterOptionEnable = true;
				}
			} 
			this.addCriteriasCondtions();
		}
	}
	private addCriteriasCondtions() {
		if (!this.isValidationErrorMessage) {
			for (let i = 0; i < this.criterias.length; i++) {
				if (this.criterias[i].operation == "=") {
					this.criterias[i].operation = "eq";
				}

				if (this.criterias[i].operation == "Contains") {
					this.criterias[i].operation = "like";
				}

				if (this.criterias[i].property == "Assets Name") {
					this.criterias[i].property = "assetsname";
				}
				else if (this.criterias[i].property == "Folder") {
					this.criterias[i].property = "folder";
				}
				else if (this.criterias[i].property == "Type") {
					this.criterias[i].property = "type";
				}
				else if (this.criterias[i].property == "Tags") {
					this.criterias[i].property = "tags";
				}
				else if (this.criterias[i].property == "Created By") {
					this.criterias[i].property = "createdby";
				}
				else if (this.criterias[i].property == "Published By") {
					this.criterias[i].property = "publishedby";
				}	
                else if (this.criterias[i].property == "From") {
					this.criterias[i].property = "from";
				} 
			}
			this.pagination.criterias = this.criterias;
			this.showFilterOption = false;
			this.pagination.pageIndex = 1;
			this.showFilterOption = false;
			this.isclearFilter = true;
		}
	}
   isFromDateless:boolean;
	validateDateLessThanOrGreaterThan(fromDate: any, toDate: any) {
		if (fromDate <= toDate) {
			this.pagination.fromDateFilterString = this.fromDateFilter;
			this.pagination.toDateFilterString = this.toDateFilter;
			this.pagination.dateFilterOpionEnable = true;
			this.pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			this.isValidationErrorMessage = false;
			this.isFromDateless = false;
		} else {
			this.isValidationErrorMessage = true;
			this.isFromDateless = true;
			this.filterConditionErrorMessage = "From date should be less than To date";
		}
	}

	checkCriteriaCoditions(){
		//this.criteriaValidation();
	}
  submittFilterData(){
	//alert(this.isValidationErrorMessage)
	this.validateDateFilters();
    let input = {};
    input['showFilterOption'] = this.showFilterOption;
    input['isClearFilter'] = this.isclearFilter;
    input['fromDate'] = this.pagination.fromDateFilterString;
    input['toDate'] = this.pagination.toDateFilterString;
    input['zone'] = this.pagination.timeZone;
    input['criterias'] = this.pagination.criterias;
    input['isDateFilter'] = this.pagination.dateFilterOpionEnable;
    input['isCriteriasFilter'] = this.pagination.filterOptionEnable;
    if(!this.isValidationErrorMessage) {
    this.filterConditionsEmitter.emit(input);
    }
  }

}
