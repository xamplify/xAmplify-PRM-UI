import { Component, Input, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-date-range-display',
  templateUrl: './date-range-display.component.html',
  styleUrls: ['./date-range-display.component.css']
})
export class DateRangeDisplayComponent implements OnInit {

  @Input() startDate: any;
  @Input() endDate: any;

  output: string = '';
  invalidInput: boolean = false;

  constructor(public referenceService: ReferenceService) { }

  ngOnInit() {
    this.formatDates();
  }

  formatDates(): void {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      this.invalidInput = true;
      return;
    }

    this.invalidInput = false;

    const sameDayFormat: Intl.DateTimeFormatOptions = this.referenceService.isSafariBrowser()
      ? { month: 'long', day: 'numeric', year: 'numeric' }
      : { weekday: 'long', month: 'long', day: 'numeric' };

    const multiDayFormat: Intl.DateTimeFormatOptions = this.referenceService.isSafariBrowser()
      ? { month: 'long', day: 'numeric', year: 'numeric' }
      : { month: 'long', day: 'numeric', year: 'numeric' };

    if (this.isSameDay(start, end)) {
      this.output = `${start.toLocaleDateString(undefined, sameDayFormat)} ⋅ ${start.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true })} – ${end.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true })}`;
    } else {
      this.output = `${start.toLocaleDateString(undefined, multiDayFormat)}, ${start.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true })} – ${end.toLocaleDateString(undefined, multiDayFormat)}, ${end.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true })}`;
    }
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

}
