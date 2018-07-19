import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date-and-time',
  templateUrl: './date-and-time.component.html',
  styleUrls: ['./date-and-time.component.css']
})
export class DateAndTimeComponent implements OnInit {
 @Input() dateAndTime: any;

 constructor() { }

  ngOnInit() {
  }

}
