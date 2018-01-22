import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { VideoBaseReportService } from '../../../services/video-base-report.service';
import { XtremandLogger } from '../../../../error-pages/xtremand-logger.service';
import { VideoUtilService } from '../../../services/video-util.service';
declare var Highcharts:any; 

@Component({
  selector: 'app-chart-report',
  templateUrl: './chart-report.component.html',
  styleUrls: ['./chart-report.component.css']
})
export class ChartReportComponent implements OnInit, OnDestroy {
  selectedVideoId: number;
  videoViewsData: any;
  daySort: any;
  timePeriod: any;
  constructor(public videoBaseReportService: VideoBaseReportService, public xtremandLogger: XtremandLogger,
     public videoUtilService: VideoUtilService, public router: Router) {
       this.daySort = this.videoUtilService.sortMonthDates[3];
       this.selectedVideoId = this.videoUtilService.selectedVideoId;
       this.videoViewsData = this.videoUtilService.videoViewsData;
       this.timePeriod = this.videoUtilService.timePeriod;
      }

  selectedCampaignWatchedUsers(timePeriod) {
      this.videoBaseReportService.getCampaignUserWatchedViews(timePeriod, this.selectedVideoId)
          .subscribe((result: any) => {
              console.log(result);
              this.videoViewsData = result;
              this.monthlyViewsBarCharts(result.dates, result.views);
          },
          (error: any) => {
              this.xtremandLogger.error(error);
             // this.xtremandLogger.errorPage(error);
          });
     }
      monthlyViewsBarCharts(dates, views) {
        Highcharts.chart('monthly-views-bar-chart', {
            chart: {
                type: 'column'
            },
            title: {
                text: ' '
            },
            credits: false,
            exporting: { enabled: false },
            xAxis: {
                categories: dates
            },

            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: ' '
                },
                visible: false
            },
            legend: {
                enabled: false
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y;
                }
            },

            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },

            series: [{
                name: 'views',
                data: views
                // stack: 'male'
            }]
        });
    }
  goToMangeVideos(){
    this.videoUtilService.selectedVideo = null;
    this.videoUtilService.checkVideo = false;
    this.router.navigate(['../home/videos/manage']);
  }    
  goBackToLastPage(){
    this.videoUtilService.checkVideo = true;
    this.router.navigate(['../home/videos/manage']);
  }    
  ngOnInit() {
    console.log(this.videoViewsData);
    if(!this.timePeriod){
      this.router.navigate(['/home/videos/manage']);
    }
    this.selectedCampaignWatchedUsers(this.timePeriod);
  }
  ngOnDestroy(){
    if(!this.videoUtilService.checkVideo){
      this.videoUtilService.selectedVideo = null;
    }

  }

}
