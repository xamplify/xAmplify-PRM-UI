import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { VideoBaseReportService } from '../../../services/video-base-report.service';
import { XtremandLogger } from '../../../../error-pages/xtremand-logger.service';
import { VideoUtilService } from '../../../services/video-util.service';
import { Pagination } from '../../../../core/models/pagination';
import { PagerService } from '../../../../core/services/pager.service';
import { ReferenceService } from '../../../../core/services/reference.service';

declare var Highcharts: any;

@Component({
  selector: 'app-chart-report',
  templateUrl: './chart-report.component.html',
  styleUrls: ['./chart-report.component.css'],
  providers: [Pagination]
})
export class ChartReportComponent implements OnInit, OnDestroy {
  selectedVideoId: number;
  videoViewsData: any;
  daySort: any;
  timePeriod: any;
  checkVideo = false;
  timePeriodValue: any;
  videoViewsLevelOne: any;
  videoViewsLevelTwo: any;
  reportPagination: Pagination = new Pagination();
  videoTitle:string;
  date: any;
  views: number;
  downloadDataList = [];
  downloadCsvList: any;
  viewsBarData: any;
  constructor(public referenceService: ReferenceService, public videoBaseReportService: VideoBaseReportService, public xtremandLogger: XtremandLogger,
    public videoUtilService: VideoUtilService, public router: Router, public pagination: Pagination, public pagerService: PagerService) {
    this.selectedVideoId = this.videoUtilService.selectedVideoId;
    this.videoViewsData = this.videoUtilService.videoViewsData;
    this.timePeriod = this.videoUtilService.timePeriod;
    this.timePeriodValue = this.videoUtilService.timePeriodValue;
    for (let i = 0; i < this.videoUtilService.sortMonthDates.length; i++) {
      if (this.videoUtilService.timePeriod === this.videoUtilService.sortMonthDates[i].value) {
        this.daySort = this.videoUtilService.sortMonthDates[i];
        break;
      }
    }
  }
  videoViewsBarchart(){
    if(this.selectedVideoId && this.timePeriodValue){
    this.videoBaseReportService.getVideoViewsDetails(this.timePeriod,this.selectedVideoId,this.timePeriodValue)
     .subscribe(
       (result:any)=>  {
       console.log(result);
       this.videoViewsLevelOne = result;
       this.videoTitle = this.videoViewsLevelOne.videoTitle;
       this.date = this.videoViewsLevelOne.date;
       this.views = this.videoViewsLevelOne.views;
       this.videoViewsBarChartLevelTwo();
      });
    }
    }
  videoViewsBarChartLevelTwo(){
     this.videoViewsBarChartLevelTwoTotalList();
      if(this.selectedVideoId && this.timePeriodValue){
    this.videoBaseReportService.getVideoViewsInnerDetails(this.timePeriod,this.selectedVideoId,this.timePeriodValue, this.pagination)
     .subscribe(
       (result:any)=>  {
       console.log(result);
       this.videoViewsLevelTwo = result.data;
       this.pagination.totalRecords = result.totalRecords;
       this.pagination = this.pagerService.getPagedItems(this.pagination, this.videoViewsLevelTwo);
      });
    }
  }
  selectedCampaignWatchedUsers(timePeriod, checkValue) {
    this.timePeriod = timePeriod;
    this.viewsBarData = undefined;
    console.log(checkValue);
    try{
    this.videoBaseReportService.getCampaignUserWatchedViews(timePeriod, this.selectedVideoId)
      .subscribe((result: any) => {
        console.log(result);
        this.videoViewsData = result;
        if(!checkValue){
          this.timePeriodValue = this.videoViewsData.dates[0];
          if(this.timePeriodValue && this.timePeriodValue.includes('Q')){
            this.timePeriodValue = this.timePeriodValue.substring(1,this.timePeriodValue.length);}
          console.log(this.timePeriodValue);
        }
        this.viewsBarData = result;
        console.log(this.viewsBarData);
       // this.monthlyViewsBarCharts(result.dates, result.views);
        this.viewsBarData = result;
        if(result.dates.length > 0 && result.views.length > 0){
          this.videoViewsBarchart();
        } else {
          this.videoViewsLevelOne = {};
          this.videoTitle = null;
          this.views = null;
          this.date = null;
          this.videoViewsLevelTwo = [];
        }
      },
      (error: any) => {
        this.xtremandLogger.error(error);
        // this.xtremandLogger.errorPage(error);
      });
    }catch(err){
       console.log(err);
    }
  }
  setPage(event: any){
    this.pagination.pageIndex = event.page;
    this.videoViewsBarChartLevelTwo();
  }

  getCategoryValue(category:any){
       if(category.includes('Q')){
            const timePeriod = category.substring(1,category.length);
            this.timePeriodValue = timePeriod;
          }
        else { this.timePeriodValue = category; }
        this.videoViewsBarchart();
  }

  goToMangeVideos() {
    this.videoUtilService.selectedVideo = null;
    this.checkVideo = false;
    this.router.navigate(['../home/videos/manage']);
  }
  goBackToLastPage() {
    this.checkVideo = true;
    this.router.navigate(['../home/videos/manage']);
  }

  videoViewsBarChartLevelTwoTotalList(){
      this.reportPagination.maxResults = 5000000;
      if(this.selectedVideoId && this.timePeriodValue){
    this.videoBaseReportService.getVideoViewsInnerDetails(this.timePeriod,this.selectedVideoId,this.timePeriodValue, this.reportPagination)
     .subscribe(
       (result:any)=>  {
       console.log(result);
       this.downloadCsvList = result.data;
      });
    }
  }

    downloadLogs() {
        this.downloadDataList.length = 0;
        for ( let i = 0; i < this.downloadCsvList.length; i++ ) {
            let date = new Date( this.downloadCsvList[i].date );

            var object = {
                    'First Name': this.downloadCsvList[i].firstName,
                    'Last Name': this.downloadCsvList[i].lastName,
                    'Email Id': this.downloadCsvList[i].name,
                    'Video Title': this.downloadCsvList[i].videoTitle,
                    'Views': this.downloadCsvList[i].views,
                    'Date': this.downloadCsvList[i].date,
                    'Device': this.downloadCsvList[i].device,
                    'Location': this.downloadCsvList[i].location,
            }
            this.downloadDataList.push( object );
        }
        var csvData = this.referenceService.convertToCSV( this.downloadDataList );
        var a = document.createElement( "a" );
        a.setAttribute( 'style', 'display:none;' );
        document.body.appendChild( a );
        var blob = new Blob( [csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL( blob );
        a.href = url;
        a.download = 'Video_Chart_Statestics.csv';
        a.click();
        return 'success';
    }


  ngOnInit() {
    console.log(this.videoViewsData);
    if (!this.timePeriod) {
      this.router.navigate(['/home/videos/manage']);
    }
    this.selectedCampaignWatchedUsers(this.timePeriod, true);
  }
  ngOnDestroy() {
    if (!this.checkVideo) {
      this.videoUtilService.selectedVideo = null;
    }
  }
}
