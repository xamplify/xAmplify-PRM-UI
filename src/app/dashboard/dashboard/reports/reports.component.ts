import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceService } from '../../../core/services/reference.service';
import { DashboardService } from '../../dashboard.service';
declare var $: any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {

  resultSparkline: any;
  viewsDate: string;
  viewsValue: number;
  daysCount: number;
  reportName: string;
  videoViewsLevelFirst = [];
  videoViewsLevelSecond = [];
  isReport: boolean;
  sortDates = [{ 'name': '7 Days', 'value': 7 }, { 'name': '14 Days)', 'value': 14 },
  { 'name': '21 Days)', 'value': 21 }, { 'name': '30 Days)', 'value': 30 }];
  daySort: any;
  constructor(public referenceService: ReferenceService, public router: Router, public dashboardService: DashboardService) {
    this.resultSparkline = this.referenceService.viewsSparklineValues;
    if (this.resultSparkline === undefined || this.resultSparkline === null) {
      this.router.navigate(['/']);
    }
    console.log(this.resultSparkline);
    this.viewsDate = this.referenceService.viewsDate;
    this.viewsValue = this.referenceService.clickedValue;
    this.daysCount = this.referenceService.daySortValue;
    this.reportName = this.referenceService.reportName;
    for (let i = 0; i < this.sortDates.length; i++) {
      if (this.referenceService.daySortValue === this.sortDates[i].value) {
        this.daySort = this.sortDates[i];
        break;
      }
    }
    console.log("day sort value " + this.daySort + 'views date is ' + this.viewsDate + 'value is ' + this.viewsValue + 'dayscount is' + this.daysCount);
  }
  selectedSortByValue(event: any) {
    console.log(event);
    this.referenceService.daySortValue= this.daysCount = event;
    this.getVideoSparklineGraph(this.daysCount);
    this.viewsOrMinutesWatchedSparklineData();
    if (this.reportName === 'views') {
      this.getVideoViewsLevelOne(this.viewsDate, true);
    } else {
      this.getVideoMinutesWatchedLevelOne(this.viewsDate, true);
    }
  }
  getVideoSparklineGraph(daysCount) {
    this.dashboardService.getVideoStatesInformation(daysCount).
      subscribe(result => {
        console.log(result);
        this.referenceService.viewsSparklineValues = result;
        this.resultSparkline = this.referenceService.viewsSparklineValues;
        this.viewsDate = result.dates[0];
      });
  }
  viewsOrMinutesWatchedSparklineData() {
    const self = this;
    const customTooltipFormat = this.reportName;
    let myvalues: any;
    if (this.reportName !== 'views') { myvalues = this.resultSparkline.minutesWatched; }
    else { myvalues = this.resultSparkline.views; }
    const offsetValues = this.resultSparkline.dates;
    $('#sparkline_bar_chart1').sparkline(myvalues, {
      type: 'bar',
      width: '200',
      barWidth: 5,
      height: '85',
      barColor: '#35aa47',
      negBarColor: '#e02222',
      tooltipFormat: '<span >' + customTooltipFormat + ':{{value}} <br>{{offset:offset}}</span>',
      tooltipValueLookups: { 'offset': offsetValues }
    });
    $(document).ready(function () {
      $('#sparkline_bar_chart1').bind('sparklineClick', function (ev) {
        const sparkline = ev.sparklines[0],
          region = sparkline.getCurrentRegionFields();
        // alert("Clicked on offset=" + offsetValues[region[0].offset] + " having value=" + region[0].value);
        if (self.reportName === 'views') {
          self.getVideoViewsLevelOne(offsetValues[region[0].offset], true);
        } else { self.getVideoMinutesWatchedLevelOne(offsetValues[region[0].offset], true); }
      });
    });
  }

  getCurrentDayFromDate(date) {
    const res = date.split("-");
    return res[2];
  }
  getVideoViewsLevelOne(dateValue, isReport) {
    this.isReport = isReport;
    if (dateValue === undefined) {
      this.viewsDate = this.referenceService.viewsDate;
      console.log("date value is " + this.viewsDate);
    }
    const dateCountValue = this.getCurrentDayFromDate(dateValue);
    console.log("date count value is " + dateCountValue);
    if (dateCountValue !== undefined) {
      this.dashboardService.getVideoViewsLevelOneReports(this.daysCount, dateCountValue).subscribe(
        (result: any) => {
          this.videoViewsLevelFirst = result;
          console.log(this.videoViewsLevelFirst);
          if (this.videoViewsLevelFirst.length === 0) { this.videoViewsLevelSecond.length = 0; }
          if (this.isReport && this.videoViewsLevelFirst.length > 0) {
            this.getVideoViewsLevelTwo(this.daysCount, result[0].selectedDate, result[0].videoId);
            this.isReport = false;
          }
        },
        (error: any) => {
          console.error(error);
        });
    }
  }
  getVideoViewsLevelTwo(daysInterval, dateValue, videoId) {
    this.dashboardService.getVideoViewsLevelTwoReports(daysInterval, dateValue, videoId).subscribe(
      (result: any) => {
        console.log(result);
        this.videoViewsLevelSecond = result;
      },
      (error: any) => {
        console.error(error);
      });
  }
  getVideoMinutesWatchedLevelOne(dateValue, isReport) {
    this.isReport = isReport;
    if (dateValue === undefined) {
      this.viewsDate = this.referenceService.viewsDate;
      console.log("date value is " + this.viewsDate);
    }
    const dateCountValue = this.getCurrentDayFromDate(dateValue);
    console.log("date count value is " + dateCountValue);
    if (dateCountValue !== undefined) {
      this.dashboardService.getVideoMinutesWatchedLevelOneReports(this.daysCount, dateCountValue).subscribe(
        (result: any) => {
          this.videoViewsLevelFirst = result;
          console.log(this.videoViewsLevelFirst);
          if (this.videoViewsLevelFirst.length === 0) { this.videoViewsLevelSecond.length = 0; }
          if (this.isReport && this.videoViewsLevelFirst.length > 0) {
            this.getVideoMinutesWatchedLevelTwo(this.daysCount, result[0].selectedDate, result[0].videoId);
            this.isReport = false;
          }
        },
        (error: any) => {
          console.error(error);
        });
    }
  }
  getVideoMinutesWatchedLevelTwo(daysInterval, dateValue, videoId) {
    this.dashboardService.getVideoMinutesWatchedLevelTwoReports(daysInterval, dateValue, videoId).subscribe(
      (result: any) => {
        console.log(result);
        this.videoViewsLevelSecond = result;
      },
      (error: any) => {
        console.error(error);
      });
  }
  selectedRow(ViewData: any) {
    console.log(ViewData);
    this.videoViewsLevelSecond.length = 0;
    this.getVideoMinutesWatchedLevelTwo(this.daysCount, ViewData.selectedDate, ViewData.videoId);
  }
  ngOnInit() {
    this.isReport = true;
    console.log(this.referenceService.viewsSparklineValues);
    this.viewsOrMinutesWatchedSparklineData();
    if (this.reportName.includes('views')) {
      this.getVideoViewsLevelOne(this.viewsDate, true);
    } else {
      this.getVideoMinutesWatchedLevelOne(this.viewsDate, true);
    }

  }
  ngAfterViewInit() {
  }
}
