import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { UtilService } from 'app/core/services/util.service';
import { Router } from '@angular/router';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';

declare var $:any;
@Component({
  selector: 'app-video-statistics-analytics',
  templateUrl: './video-statistics-analytics.component.html',
  styleUrls: ['./video-statistics-analytics.component.css'],
  providers: [HttpRequestLoader]
})
export class VideoStatisticsAnalyticsComponent implements OnInit {
  daySort: any;
  sortDates: any;
  sortHeatMapValues:any;
  heatMapSort: any;
  videoStatesTooltip = 'Current Month';
  videoStatisticsLoader: HttpRequestLoader = new HttpRequestLoader();
  constructor(public referenceService:ReferenceService,public dashboardService:DashboardService,public xtremandLogger:XtremandLogger,public utilService:UtilService,public router: Router) { 
    this.sortDates = this.dashboardService.sortDates;
    this.daySort = this.sortDates[3];
    this.referenceService.daySortValue = this.daySort.value;
    this.sortHeatMapValues = this.sortDates.concat([{ 'name': 'Year', 'value': 'year' }]);
    this.daySort = this.sortDates[3];
    this.referenceService.daySortValue = this.daySort.value;
    this.heatMapSort = this.sortHeatMapValues[4];

  }

  ngOnInit() {
    this.getVideoStatesSparklineChartsInfo(30);
  }

  selectedSortByValue(event: any) {
    this.xtremandLogger.log(event);
    this.referenceService.daySortValue = event;
    this.videoStatesTooltip =  this.utilService.setTooltipMessage(event);
    this.getVideoStatesSparklineChartsInfo(event);
}

getVideoStatesSparklineChartsInfo(daysCount) {
  try {
      this.dashboardService.getVideoStatesInformation(daysCount).
          subscribe(result => {
              this.xtremandLogger.log(result);
              this.referenceService.viewsSparklineValues = result;
              this.viewsSparklineData(result.views, result.dates);
              this.minutesSparklineData(result.minutesWatched, result.dates);
              this.averageSparklineData(result.averageDuration, result.dates);
              this.xtremandLogger.log(this.referenceService.viewsSparklineValues);
          },
              (error: any) => {
                  this.xtremandLogger.error(error);
               //   this.xtremandLogger.errorPage(error);
              });
  } catch (error) {
      this.xtremandLogger.error('error in world map dashboard ' + error);
  }
}

viewsSparklineData(result, dates) {
  const self = this;
  const myvalues = result;
  const offsetValues = dates;
  $('#sparkline_bar').sparkline(myvalues, {
      type: 'bar',
      width: '100',
      barWidth: 2,
      height: '55',
      barColor: '#35aa47',
      negBarColor: '#e02222',
      tooltipFormat: '<span >views:{{value}} <br>{{offset:offset}}</span>',
      tooltipValueLookups: { 'offset': offsetValues }
  });
  $(document).ready(function () {
      $('#sparkline_bar').bind('sparklineClick', function (ev) {
          const sparkline = ev.sparklines[0],
              region = sparkline.getCurrentRegionFields();
          self.sparklineDataWithRouter(region[0].value, offsetValues[region[0].offset], "views");
      });
  });
}

minutesSparklineData(result, dates) {
  const self = this;
  const myvalues = result;
  const offsetValues = dates;
  $('#sparkline_bar2').sparkline(myvalues, {
      type: 'bar',
      width: '100',
      barWidth: 2,
      height: '55',
      barColor: '#35aa47',
      negBarColor: '#e02222',
      tooltipFormat: '<span >minutes:{{value}} <br>{{offset:offset}}</span>',
      tooltipValueLookups: { 'offset': offsetValues }
  });
  $(document).ready(function () {
      $('#sparkline_bar2').bind('sparklineClick', function (ev) {
          const sparkline = ev.sparklines[0],
              region = sparkline.getCurrentRegionFields();
          self.sparklineDataWithRouter(region[0].value, offsetValues[region[0].offset], "minutes watched");
      });
  });
}

averageSparklineData(result, dates) {
  const myvalues = result;
  this.xtremandLogger.log(myvalues);
  const offsetValues = dates;
  $('#sparkline_line').sparkline(myvalues, {
      type: 'line',
      width: '100',
      barWidth: 2,
      height: '55',
      barColor: '#35aa47',
      negBarColor: '#e02222',
      tooltipValueLookups: { 'offset': offsetValues }
  });
}


sparklineDataWithRouter(value: number, date: any, reportName: string) {
  if (date === undefined || date === null) {
      this.xtremandLogger.log("date is " + date);
  } else {
      this.referenceService.viewsDate = date;
      this.referenceService.clickedValue = value;
      this.referenceService.reportName = reportName;
      this.router.navigate(['./home/dashboard/reports']);
  }
}


}
