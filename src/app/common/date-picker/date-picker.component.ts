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
	constructor() { }

	ngOnInit() {
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
		}
	}

	change() {
		this.dataFieldChange.emit(this.dataField);
	}

}
