import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ReferenceService } from '../../../core/services/reference.service';
import { DashboardService } from '../../dashboard.service';
import { PagerService } from '../../../core/services/pager.service';
import { Pagination } from '../../../core/models/pagination';
import { UtilService } from '../../../core/services/util.service';
import { DashboardAnalyticsDto } from 'app/dashboard/models/dashboard-analytics-dto';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

declare var $: any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [Pagination]

})
export class ReportsComponent implements OnInit {

  resultSparkline: any;
  viewsDate: string;
  viewsValue: number;
  daysCount: number;
  reportName: string;
  videoViewsLevelFirst = [];
  videoViewsLevelSecond = [];
  videoMinutsWatchedTotalRecordsLevelSecond = [];
  videoViewsLevelSecondAllRecords = [];
  gettingAllUsersPagination: Pagination = new Pagination();
  allMinutesWatchedPagination: Pagination = new Pagination();
  isReport: boolean;
  selectedRowValue = false;
  anotherViewDate: string;
  downloadDataList = [];
  downloadCsvList: any;
  daysInterval: any;
  dateValue: any;
  videoId: number;
  sortDates: any;
  daySort: any;
  heatMapTooltip = 'Last 7 Days';
  logListName = "";
  loading = false;
  dashboardAnalyticsDto: DashboardAnalyticsDto = new DashboardAnalyticsDto();
  constructor(public referenceService: ReferenceService, public router: Router, public dashboardService: DashboardService,
    public pagerService: PagerService, public pagination: Pagination, public utilService:UtilService, private vanityURLService:VanityURLService) {
    this.sortDates = this.dashboardService.sortDates;
    this.resultSparkline = this.referenceService.viewsSparklineValues;
    if (this.resultSparkline === undefined || this.resultSparkline === null) {
      this.router.navigate(['/home/dashboard/default']);
    }

  }
  selectedSortByValue(event: any) {
    console.log(event);
    this.referenceService.daySortValue = this.daysCount = event;
    this.heatMapTooltip = this.utilService.setTooltipMessage(event);
    this.getVideoSparklineGraph(this.daysCount);
  }
  getVideoSparklineGraph(daysCount) {
    this.dashboardService.getVideoStatesInformation(daysCount).
      subscribe(result => {
        console.log(result);
        this.referenceService.viewsSparklineValues = result;
        this.resultSparkline = result;
        this.viewsDate = result.dates[0];
        this.referenceService.viewsDate = this.viewsDate;
        console.log("views date is " + this.viewsDate);
        this.viewsOrMinutesWatchedSparklineData(result);
        if (this.reportName === 'views') {
          this.getVideoViewsLevelOne(this.viewsDate, true);
        } else {
          this.getVideoMinutesWatchedLevelOne(this.viewsDate, true);
        }
      });
  }
  viewsOrMinutesWatchedSparklineData(resultSparkline) {
    const self = this;
    const customTooltipFormat = this.reportName;
    let myvalues: any;
    if (this.reportName !== 'views') { myvalues = this.resultSparkline.minutesWatched; }
    else { myvalues = resultSparkline.views; }
    const offsetValues = resultSparkline.dates;
    $('#sparkline_bar_chart1').sparkline(myvalues, {
      type: 'bar',
      width: '200',
      barWidth: 8,
      height: '90',
      barColor: '#35aa47',
      negBarColor: '#e02222',
      tooltipFormat: '<span >' + customTooltipFormat + ':{{value}} <br>{{offset:offset}}</span>',
      tooltipValueLookups: { 'offset': offsetValues }
    });
  }
  selectedChartValue() {
    const self = this;
    const offsetValues = this.resultSparkline.dates;
    $('#sparkline_bar_chart1').bind('sparklineClick', function (ev) {
      const sparkline = ev.sparklines[0],
        region = sparkline.getCurrentRegionFields();
      console.log(self.viewsDate + 'and bar chart date is ' + offsetValues[region[0].offset]);
      const date = offsetValues[region[0].offset];
      if (self.viewsDate === date) {
        console.log("views data is " + self.viewsDate);
        self.referenceService.viewsDate = self.viewsDate;
      } else {
        self.referenceService.viewsDate = self.viewsDate = offsetValues[region[0].offset];
        if (self.reportName === 'views') {
          self.getVideoViewsLevelOne(offsetValues[region[0].offset], true);
        } else { self.getVideoMinutesWatchedLevelOne(offsetValues[region[0].offset], true); }
      }
    });
  }

  getCurrentDayFromDate(date) {
    if (date !== undefined) {  this.viewsDate = date; const res = date.split("-");
      return res[2];
    }
  }
  getVideoViewsLevelOne(dateValue, isReport) {
    this.isReport = isReport;
    this.anotherViewDate = dateValue;
    if (dateValue === undefined) { this.viewsDate = this.referenceService.viewsDate; }
    const dateCountValue = this.getCurrentDayFromDate(dateValue);
    if (dateCountValue !== undefined) {
      this.videoViewsLevelFirst = null;
      //this.dashboardService.getVideoViewsLevelOneReports(this.daysCount, dateCountValue).subscribe(
      this.dashboardService.getVideoViewsLevelOneReportsForVanityURL(this.daysCount, dateCountValue,this.dashboardAnalyticsDto).subscribe(
        (result: any) => {
          this.videoViewsLevelFirst = result;
          if (this.videoViewsLevelFirst.length === 0) { this.videoViewsLevelSecond.length = 0; }
          if (this.isReport && this.videoViewsLevelFirst.length > 0) {
            this.pagination.pageIndex = 1;
            this.getVideoViewsLevelTwo(this.daysCount, result[0].selectedDate, result[0].videoId, this.pagination);
            this.isReport = false;
          }
        },
        (error: any) => {  console.error(error);  });
    }
  }
  getVideoViewsLevelOneTest(dateValue, isReport) {
    this.isReport = isReport;
    this.anotherViewDate = dateValue;
    if (dateValue === undefined) { this.viewsDate = this.referenceService.viewsDate; }
    const dateCountValue = this.getCurrentDayFromDate(dateValue);
    if (dateCountValue !== undefined) {
      //this.dashboardService.getVideoViewsLevelOneReports(this.daysCount, dateCountValue).subscribe(
        this.dashboardService.getVideoViewsLevelOneReportsForVanityURL(this.daysCount, dateCountValue,this.dashboardAnalyticsDto).subscribe(
        (result: any) => {
          this.videoViewsLevelFirst = result;
        },
        (error: any) => {  console.error(error);  });
    }
  }

  getVideoViewsLevelTwo(daysInterval, dateValue, videoId, pagination) {
    //  this.pagination.maxResults = 5;
    this.daysInterval = daysInterval;
    this.dateValue = dateValue;
    this.videoId = videoId;
    //this.dashboardService.getVideoViewsLevelTwoReports(daysInterval, dateValue, videoId, pagination).subscribe(
    this.dashboardService.getVideoViewsLevelTwoReportsForVanityURL(daysInterval, dateValue, videoId, pagination).subscribe(
      (result: any) => {
        this.videoViewsLevelSecond = result.data;
        this.pagination.totalRecords = result.totalRecords;
        this.pagination = this.pagerService.getPagedItems(this.pagination, this.videoViewsLevelSecond);
        this.getVideoViewsLevelTwoAllUsers(daysInterval, dateValue, videoId, result.totalRecords);
      },
      (error: any) => {  console.error(error); } );
  }

  getVideoViewsLevelTwoAllUsers(daysInterval, dateValue, videoId, totalRecords) {
      this.gettingAllUsersPagination.maxResults = totalRecords;
      //this.dashboardService.getVideoViewsLevelTwoReports(daysInterval, dateValue, videoId, this.gettingAllUsersPagination).subscribe(
      this.dashboardService.getVideoViewsLevelTwoReportsForVanityURL(daysInterval, dateValue, videoId, this.gettingAllUsersPagination).subscribe(
        (result: any) => { this.videoViewsLevelSecondAllRecords = result.data; },
        (error: any) => { console.error(error); });
    }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getVideoStatesLevels();
  }
  paginationDropdown(pagination: Pagination) {
    this.pagination = pagination;
    this.getVideoStatesLevels();
  }
  getVideoStatesLevels() {
    if (this.reportName === 'views') { this.getVideoViewsLevelTwo(this.daysInterval, this.dateValue, this.videoId, this.pagination); }
    else { this.getVideoMinutesWatchedLevelTwo(this.daysInterval, this.dateValue, this.videoId, this.pagination) }
  }
  getVideoMinutesWatchedLevelOne(dateValue, isReport) {
    this.isReport = isReport;
    if (dateValue === undefined) {  this.viewsDate = this.referenceService.viewsDate; }
    const dateCountValue = this.getCurrentDayFromDate(dateValue);
    console.log("date count value is " + dateCountValue);
    if (dateCountValue !== undefined) {
      //this.dashboardService.getVideoMinutesWatchedLevelOneReports(this.daysCount, dateCountValue).subscribe(
       this.dashboardService.getVideoMinutesWatchedLevelOneReportsForVanityURL(this.daysCount, dateCountValue,this.dashboardAnalyticsDto).subscribe(
        (result: any) => {
          this.videoViewsLevelFirst = result;
          console.log(this.videoViewsLevelFirst);
          if (this.videoViewsLevelFirst.length === 0) { this.videoViewsLevelSecond.length = 0; }
          if (this.isReport && this.videoViewsLevelFirst.length > 0) {
            this.getVideoMinutesWatchedLevelTwo(this.daysCount, result[0].selectedDate, result[0].videoId, this.pagination);
            this.isReport = false;
          }
        },
        (error: any) => { console.error(error); });
    }
  }
  getVideoMinutesWatchedLevelTwo(daysInterval, dateValue, videoId, pagination) {
    this.daysInterval = daysInterval;
    this.dateValue = dateValue;
    this.videoId = videoId;
    // this.pagination.maxResults = 5;
    this.dashboardService.getVideoMinutesWatchedLevelTwoReports(daysInterval, dateValue, videoId, pagination).subscribe(
      (result: any) => {
        console.log(result);
        this.videoViewsLevelSecond = result.data;
        this.pagination.totalRecords = result.totalRecords;
        this.pagination = this.pagerService.getPagedItems(this.pagination, this.videoViewsLevelSecond);
        this.getVideoMinutesWatchedAllUsersLevelTwo(result.totalRecords);
      },
      (error: any) => {  console.error(error); });
  }
  
  getVideoMinutesWatchedAllUsersLevelTwo(totalRecords) {
      this.allMinutesWatchedPagination.maxResults = totalRecords;
      //this.dashboardService.getVideoMinutesWatchedLevelTwoReports(this.daysInterval, this.dateValue, this.videoId, this.allMinutesWatchedPagination).subscribe(
      this.dashboardService.getVideoMinutesWatchedLevelTwoReportsForVanityURL(this.daysInterval, this.dateValue, this.videoId, this.allMinutesWatchedPagination).subscribe(
        (result: any) => {
          console.log(result);
          this.videoMinutsWatchedTotalRecordsLevelSecond = result.data;
        },
        (error: any) => {  console.error(error); });
    }
  
  
  selectedRow(viewData: any) {
    this.videoViewsLevelSecond.length = 0;
    this.pagination.pageIndex = 1;
    if (this.reportName === 'views') {
      this.getVideoViewsLevelTwo(this.daysCount, viewData.selectedDate, viewData.videoId, this.pagination);
    } else {
      this.getVideoMinutesWatchedLevelTwo(this.daysCount, viewData.selectedDate, viewData.videoId, this.pagination);
    }
  }
  
  downloadLogs() {
     this.logListName = 'Video_Statistics.csv';
     
     if (this.reportName === 'views') {
         this.downloadCsvList = this.videoViewsLevelSecondAllRecords;
     }else{
         this.downloadCsvList = this.videoMinutsWatchedTotalRecordsLevelSecond;
     }
  
    this.downloadDataList.length = 0;
    for (let i = 0; i < this.downloadCsvList.length; i++) {
      const date = new Date(this.downloadCsvList[i].date);
      let hours = this.referenceService.formatAMPM(date);
      const object = {
        'First Name': this.downloadCsvList[i].firstName,
        'Last Name': this.downloadCsvList[i].lastName,
        'Email Id': this.downloadCsvList[i].emailId,
        'Video Title': this.downloadCsvList[i].videoTitle,
        'Date and Time': date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours
      }
      
      this.downloadDataList.push(object);
    }
    this.referenceService.isDownloadCsvFile = true;
  }

  ngOnInit() {
    //  this.pagination.maxResults = 5;
    console.log(this.resultSparkline);
    this.dashboardAnalyticsDto = this.vanityURLService.addVanityUrlFilterDTO(this.dashboardAnalyticsDto);
    this.viewsDate = this.referenceService.viewsDate;
    this.viewsValue = this.referenceService.clickedValue;
    this.daysCount = this.referenceService.daySortValue;
    this.reportName = this.referenceService.reportName;
    for (let i = 0; i < this.sortDates.length; i++) {if (this.referenceService.daySortValue === this.sortDates[i].value) {
        this.daySort = this.sortDates[i]; break; }
    }
 //   this.selectedSortByValue(this.daysCount);
    console.log("day sort value " + this.daySort + 'views date is ' + this.viewsDate + 'value is ' + this.viewsValue + 'dayscount is' + this.daysCount);
    this.isReport = true;
    console.log(this.referenceService.viewsSparklineValues);
    if (this.viewsDate === undefined || this.viewsDate === null) { this.viewsDate = this.resultSparkline.dates[0]; }
    this.viewsOrMinutesWatchedSparklineData(this.resultSparkline);
    if (this.reportName.includes('views')) {
     this.getVideoViewsLevelOne(this.viewsDate, true);
    } else {
      this.getVideoMinutesWatchedLevelOne(this.viewsDate, true);
    }
  }
}
