import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var flatpickr: any;

@Component({
  selector: 'app-flatpickr',
  templateUrl: './flatpickr.component.html',
  styleUrls: ['./flatpickr.component.css']
})
export class FlatpickrComponent implements OnInit {

  customPlaceHolder:any;

  @Input() dataField: any;
  @Input() isFromForm: boolean;
  @Input() isFromMdfCredit: boolean;
  @Output() dataFieldChange: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    if (this.isFromForm != undefined && this.isFromForm) {
      flatpickr('.flatpickr', {
        enableTime: false,
        dateFormat: 'm-d-Y',
        //minDate: new Date()
      });
     this.customPlaceHolder="MM-DD-YYYY";
    }else if(this.isFromMdfCredit!=undefined && this.isFromMdfCredit){
      flatpickr('.flatpickr', {
        enableTime: false,
        dateFormat: 'm/d/Y',
        minDate: new Date()
      });
      this.customPlaceHolder="MM/DD/YYYY";
    }
     else {
      flatpickr('.flatpickr', {
        enableTime: false,
        dateFormat: 'Y-m-d',
        minDate: new Date()
      });
      this.customPlaceHolder="";
    }
  }
  change() {
    this.dataFieldChange.emit(this.dataField);
  }

}
