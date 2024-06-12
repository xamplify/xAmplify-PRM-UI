import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { VideoBaseReportService } from '../../../services/video-base-report.service';
import { XtremandLogger } from '../../../../error-pages/xtremand-logger.service';
import { VideoUtilService } from '../../../services/video-util.service';
import { Pagination } from '../../../../core/models/pagination';
import { PagerService } from '../../../../core/services/pager.service';
import { ReferenceService } from '../../../../core/services/reference.service';
import { AuthenticationService } from '../../../../core/services/authentication.service';

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
  loading = false;
  damId: number = 0;
  constructor(public referenceService: ReferenceService, public videoBaseReportService: VideoBaseReportService, public xtremandLogger: XtremandLogger,
    public videoUtilService: VideoUtilService, public router: Router, public pagination: Pagination, public pagerService: PagerService,
    public authenticationService: AuthenticationService) {
    try{
      this.selectedVideoId = this.videoUtilService.selectedVideoId;
    this.videoViewsData = this.videoUtilService.videoViewsData;
    this.timePeriod = this.videoUtilService.timePeriod;
    this.timePeriodValue = this.videoUtilService.timePeriodValue;
    this.damId = this.videoUtilService.damId;
    for (let i = 0; i < this.videoUtilService.sortMonthDates.length; i++) {
      if (this.videoUtilService.timePeriod === this.videoUtilService.sortMonthDates[i].value) {
        this.daySort = this.videoUtilService.sortMonthDates[i];
        break;
      }
    }
    }catch(error){
    this.xtremandLogger.error('Error in chart report component constructor'+error); }
  }
  videoViewsBarchart(){
   try{
    this.loading = true;
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
       this.loading = false;
      },
     (error:any) =>{
       this.loading = false;
       this.xtremandLogger.error('Error in chart report component viewsbarchart method'+error); }
    );
    }
     } catch(error){
    this.xtremandLogger.error('Error in chart report component viewsbarchart method'+error); }
    }
  videoViewsBarChartLevelTwo(){
    try{
    this.videoViewsBarChartLevelTwoTotalList();
    if(this.selectedVideoId && this.timePeriodValue){
    this.videoBaseReportService.getVideoViewsInnerDetails(this.timePeriod,this.selectedVideoId,this.timePeriodValue, this.pagination)
     .subscribe(
        (result: any) => {
            if (result.access) {
                console.log(result);
                this.videoViewsLevelTwo = result.data;
                this.pagination.totalRecords = result.totalRecords;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.videoViewsLevelTwo);
            } else {
                this.authenticationService.forceToLogout();
            }
        },
    (error:any)=>{this.xtremandLogger.error('Error in chartreport page, videoviewsbarchartlevelTwo'+error);}
      );}
    }catch(error){
    this.xtremandLogger.error('Error in chart report component viewsbarchart method'+error); }
  }
  selectedCampaignWatchedUsers(timePeriod, checkValue) {
    try{
    this.loading = true;
    this.timePeriod = timePeriod;
    this.viewsBarData = undefined;
    this.xtremandLogger.log(checkValue);
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
        this.loading = false;
      },
      (error: any) => {
        this.xtremandLogger.error(error);
        this.loading = false;
        // this.xtremandLogger.errorPage(error);
      });
    }catch(err){
       console.log(err);
       this.loading = false;
    }
  }
  setPage(event: any){
    this.pagination.pageIndex = event.page;
    this.videoViewsBarChartLevelTwo();
  }

  getCategoryValue(category:any){
    try{
       if(category.includes('Q')){
            const timePeriod = category.substring(1,category.length);
            this.timePeriodValue = timePeriod;
          }
        else { this.timePeriodValue = category; }
        this.videoViewsBarchart();
    }catch(error) {this.xtremandLogger.log('Error in getCategory value, chart report page'+error); }
  }

  goToMangeVideos() {
    this.videoUtilService.selectedVideo = null;
    this.checkVideo = false;
    this.router.navigate(['../home/content/videos']);
  }
  goBackToLastPage() {
    this.checkVideo = true;
    this.router.navigate(['../home/content/videos']);
  }

  videoViewsBarChartLevelTwoTotalList(){
    this.reportPagination.maxResults = 5000000;
    if(this.selectedVideoId && this.timePeriodValue){
    this.videoBaseReportService.getVideoViewsInnerDetails(this.timePeriod,this.selectedVideoId,this.timePeriodValue, this.reportPagination)
        .subscribe(
        (result: any) => {
            if (result.access) {
                console.log(result);
                this.downloadCsvList = result.data;
            } else {
                this.authenticationService.forceToLogout();
            }
        }
        );
    }
  }
  
  downloadLogs() {
      this.videoViewsBarChartLevelTwoTotalList();
      this.downloadDataList.length = 0;
      for (let i = 0; i < this.downloadCsvList.length; i++) {
          let date = new Date(this.downloadCsvList[i].date);

          var object = {
              'First Name': this.downloadCsvList[i].firstName,
              'Last Name': this.downloadCsvList[i].lastName,
              'Email Id': this.downloadCsvList[i].emailId,
              'Views': this.downloadCsvList[i].views,
              'Year': this.downloadCsvList[i].date,
              'Device': this.downloadCsvList[i].device,
              'City': this.downloadCsvList[i].city,
              'State': this.downloadCsvList[i].state,
              'Country': this.downloadCsvList[i].country,
          }
          this.downloadDataList.push(object);
      }
      this.referenceService.isDownloadCsvFile = true;
  }

  ngOnInit() {
    try{
    console.log(this.videoViewsData);
    if (!this.timePeriod) {
      this.router.navigate(['/home/content/videos']);
    }
    this.selectedCampaignWatchedUsers(this.timePeriod, true);
  } catch(error){this.xtremandLogger.log('error in ngonit'+error); }
  }
  ngOnDestroy() {
      try {
          if (!this.checkVideo) {
              this.videoUtilService.selectedVideo = null;
          }
      } catch (error) { this.xtremandLogger.log('error in ngOnDestroy' + error); }
  }
  
  goToDam() {
      this.loading = true;
      this.referenceService.goToRouter("/home/dam/manage");
  }

  goBack() {
      this.loading = true;
      this.referenceService.navigateToDamPartnerCompaniesAnalytics(this.damId,0,undefined,false,false);
	}
  
}
