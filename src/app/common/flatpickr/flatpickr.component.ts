import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var flatpickr: any;

@Component({
  selector: 'app-flatpickr',
  templateUrl: './flatpickr.component.html',
  styleUrls: ['./flatpickr.component.css']
})
export class FlatpickrComponent implements OnInit {

  @Input() dataField: any;
  @Output() dataFieldChange: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    flatpickr('.flatpickr', {
      enableTime: false,
      dateFormat: 'Y-m-d',
      minDate: new Date()
    });
  }
  change() {
    this.dataFieldChange.emit(this.dataField);
  }

}
