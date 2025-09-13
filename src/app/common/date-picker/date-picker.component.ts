import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var flatpickr: any;
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

 customPlaceHolder: any;
	@Input() dataField: any;
	@Output() dataFieldChange: EventEmitter<any> = new EventEmitter();
	@Input() isFromForm: boolean;
	@Input() isFromMdfCredit: boolean;
	@Input() isFromFilter: any = false;
	@Input() isEndDate: any = false;

	@Input() value: any = '';
	defaultDate: Date;
	displayValue:any;

	constructor() { }

	ngOnInit() {
		if (this.value != undefined && this.value != null) {
			this.displayValue = this.value;
		}

		if (this.isFromForm != undefined && this.isFromForm) {
			flatpickr('.flatpickr', {
				enableTime: false,
				dateFormat: 'm-d-Y',
			});
			this.customPlaceHolder = "MM-DD-YYYY";
		} else if (this.isFromMdfCredit != undefined && this.isFromMdfCredit) {
			flatpickr('.flatpickr', {
				enableTime: false,
				dateFormat: 'm/d/Y',
				minDate: new Date()
			});
			this.customPlaceHolder = "MM/DD/YYYY";
		} else if (this.isFromFilter != undefined && this.isFromFilter) {	
			let self = this;
			flatpickr('.flatpickr', {
				enableTime: false,
				dateFormat: 'Y-m-d',
				maxDate: new Date()
			});
			this.customPlaceHolder = "YYYY-MM-DD";
		} else if (this.isEndDate != undefined && this.isEndDate) {	
			let self = this;
			let now:Date = new Date();
			self.defaultDate = now;
        	if (self.value != undefined && self.value != null) {
            	self.defaultDate = new Date(self.value);
        	}
            flatpickr('.flatpickr', {
                enableTime: true,
                dateFormat: 'Y-m-d H:i',
                time_24hr: true,
                minDate: now,
				defaultDate: self.defaultDate
            });
			this.customPlaceHolder = "YYYY-MM-DD";
		}  else {
			flatpickr('.flatpickr', {
				enableTime: false,
				dateFormat: 'm-d-Y',
			});
			this.customPlaceHolder = "MM-DD-YYYY";
		}
	}

	change() {
		this.dataFieldChange.emit(this.dataField);
	}

}
