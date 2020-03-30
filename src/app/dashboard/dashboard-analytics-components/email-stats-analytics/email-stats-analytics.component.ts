import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { DashboardReport } from 'app/core/models/dashboard-report';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ReferenceService } from 'app/core/services/reference.service';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';

@Component({
  selector: 'app-email-stats-analytics',
  templateUrl: './email-stats-analytics.component.html',
  styleUrls: ['./email-stats-analytics.component.css'],
  providers: [HttpRequestLoader,Pagination]
})
export class EmailStatsAnalyticsComponent implements OnInit {
  loggedInUserId: number;
  dashboardReport: DashboardReport = new DashboardReport();
  emailStatsLoader: HttpRequestLoader = new HttpRequestLoader();
  paginationType: string;
  isLoadingList = true;
  isLoadingDownloadList = false;
  pagination: Pagination = new Pagination();
  downloadDataList = [];
  logListName = "";
  totalOpenListPagination: Pagination = new Pagination();
  totalClickedPagination: Pagination = new Pagination();
  totalWatchedPagination: Pagination = new Pagination();
   isDownloadCsvFile = false;
   emailStats:any;
  constructor(public authenticationService:AuthenticationService,public dashboardService:DashboardService,public xtremandLogger:XtremandLogger,public referenceService:ReferenceService,public pagerService:PagerService) { }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.getCount();
  }

  getCount(){
    this.dashboardService.getEmailStats(this.loggedInUserId)
    .subscribe(
        response => {
            this.emailStats = response.data;
        },
        error => this.xtremandLogger.log(error),
        () => this.xtremandLogger.log('getCount() completed')
    );
  }

 
emailWatchedCount(userId: number) {
    this.dashboardService.loadEmailWatchedCount(userId)
        .subscribe(
            data => {
                this.dashboardReport.totalEmailWatchedCount = data['watched-users-count'];
                this.referenceService.loading(this.emailStatsLoader,false);
               // this.listOfAllWatchedLogs();
            },
            error => this.xtremandLogger.log(error),
            () => this.xtremandLogger.log('emailWatchedCount completed')
        );
}


listOfEmailOpenLogs(actionId: number) {
  this.paginationType = 'open';
  this.isLoadingList = true;
  //if(!this.isCalledPagination){ this.pagination.maxResults = 12; this.isCalledPagination = true;}
  this.dashboardService.listEmailOpenLogs(this.loggedInUserId, actionId, this.pagination)
      .subscribe(
          (result: any) => {
              result.forEach((element) => {
              if(element.time) { element.time = new Date(element.utcTimeString);} });
              this.dashboardReport.emailLogList = result;
              this.pagination.totalRecords = this.dashboardReport.totalEmailOpenedCount;
              this.isLoadingList = false;
              this.pagination = this.pagerService.getPagedItems(this.pagination, this.dashboardReport.emailLogList);

          },
          error => this.xtremandLogger.log(error),
          () => { }
      );
}
cancelEmailStateModalPopUp() {
  this.pagination = new Pagination();
  this.pagination.pageIndex = 1;
  this.pagination.maxResults = 12;
  this.downloadDataList.length = 0;
  if(this.dashboardReport.emailLogList) { this.dashboardReport.emailLogList.length = 0;}
  this.isLoadingList = true;
  this.isDownloadCsvFile = false;
}

downloadFuctionality(){
    this.isDownloadCsvFile = false;
  this.isLoadingDownloadList = true;
  if (this.paginationType === 'open') {
      this.listOfAllEmailOpenLogs();
  }else if (this.paginationType === 'clicked') {
      this.listOfAllEmailClickedLogs();
  }else if (this.paginationType === 'watched') {
      this.listOfAllWatchedLogs();
  } 
}

listOfAllEmailOpenLogs() {
  this.totalOpenListPagination.maxResults = this.dashboardReport.totalEmailOpenedCount;
  this.dashboardService.listEmailOpenLogs(this.loggedInUserId, 13, this.totalOpenListPagination)
      .subscribe(
          (result: any) => {
            result.forEach((element) => {
            if(element.time) { element.time = new Date(element.utcTimeString);} });
            this.dashboardReport.allEmailOpenLogList = result;
            this.downloadEmailLogs();
          },
          error => this.xtremandLogger.log(error),
          () => { }
      );
}

listOfAllEmailClickedLogs() {
  this.totalClickedPagination.maxResults = this.dashboardReport.totalEmailClickedCount;
  this.dashboardService.listEmailClickedLogs(this.loggedInUserId, this.totalClickedPagination)
      .subscribe(
          result => {
             result.forEach((element) => {
              if(element.time) { element.time = new Date(element.utcTimeString);} });
              this.dashboardReport.allEmailClickedLogList = result;
              this.downloadEmailLogs();
          },
          error => this.xtremandLogger.log(error),
          () => { }
      );
}


listOfAllWatchedLogs() {
  this.totalWatchedPagination.maxResults = this.dashboardReport.totalEmailWatchedCount;
  this.dashboardService.listOfWatchedLogs(this.loggedInUserId, this.totalWatchedPagination)
      .subscribe(
          (data: any) => {
              data.forEach((element) => {
              if(element.time) { element.time = new Date(element.utcTimeString);} });
              this.dashboardReport.allEmailWatchedLogList = data;
              this.downloadEmailLogs();
          },
          error => this.xtremandLogger.log(error),
          () => this.xtremandLogger.log('finished')
      );
}

listOfEmailClickedLogs() {
    this.paginationType = 'clicked';
    this.isLoadingList = true;
   //if(!this.isCalledPagination){ this.pagination.maxResults = 12; this.isCalledPagination = true;}
    this.dashboardService.listEmailClickedLogs(this.loggedInUserId, this.pagination)
        .subscribe(
            result => {
                result.forEach((element) => {
                if(element.time) { element.time = new Date(element.utcTimeString);} });
                this.dashboardReport.emailLogList = result;
                this.isLoadingList = false;
                this.pagination.totalRecords = this.dashboardReport.totalEmailClickedCount;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.dashboardReport.emailLogList);

            },
            error => this.xtremandLogger.log(error),
            () => { }
        );
}

listOfWatchedLogs() {
    this.xtremandLogger.log(this.pagination);
    this.paginationType = 'watched';
    this.isLoadingList = true;
   // if(!this.isCalledPagination){ this.pagination.maxResults = 12; this.isCalledPagination = true;}
    this.dashboardService.listOfWatchedLogs(this.loggedInUserId, this.pagination)
        .subscribe(
            (data: any) => {
              data.forEach((element) => {
                if(element.time) { element.time = new Date(element.utcTimeString);} });
                this.dashboardReport.emailLogList = data;
                this.isLoadingList = false;
                this.pagination.totalRecords = this.dashboardReport.totalEmailWatchedCount;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.dashboardReport.emailLogList);
            },
            error => this.xtremandLogger.log(error),
            () => this.xtremandLogger.log('finished')
        );
}



 downloadEmailLogs() {
     if (this.paginationType === 'open') {
         this.logListName = 'Email_Open_Logs.csv';
         this.dashboardReport.downloadEmailLogList = this.dashboardReport.allEmailOpenLogList;
     } else if (this.paginationType === 'clicked') {
         this.logListName = 'Email_Clicked_Logs.csv';
         this.dashboardReport.downloadEmailLogList = this.dashboardReport.allEmailClickedLogList;
     } else if (this.paginationType === 'watched') {
         this.logListName = 'Email_Watched_Logs.csv';
         this.dashboardReport.downloadEmailLogList = this.dashboardReport.allEmailWatchedLogList;
     }

     this.downloadDataList.length = 0;
     for (let i = 0; i < this.dashboardReport.downloadEmailLogList.length; i++) {
         let date = new Date(this.dashboardReport.downloadEmailLogList[i].time);
         var object = {
             "Email Id": this.dashboardReport.downloadEmailLogList[i].emailId,
             "First Name": this.dashboardReport.downloadEmailLogList[i].firstName,
             "Last Name": this.dashboardReport.downloadEmailLogList[i].lastName,
            /* "Date and Time": date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),*/
            /* "Campaign Name": this.dashboardReport.downloadEmailLogList[i].campaignName*/
         }

         let hours = this.referenceService.formatAMPM(date);
         object["Date and Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;

         if (this.paginationType == 'open') {
             object["Company Name"] = this.dashboardReport.downloadEmailLogList[i].companyName;
             object["Campaign Name"] = this.dashboardReport.downloadEmailLogList[i].campaignName;
             object["Subject"] = this.dashboardReport.downloadEmailLogList[i].subject;
         }
         if (this.paginationType == 'clicked') {
             if(this.dashboardReport.downloadEmailLogList[i].url){
                 object["URL"] = this.dashboardReport.downloadEmailLogList[i].url;
             }else{
                 object["URL"] = 'Clicked on the video thumbnail';
             }
         }


         if (this.paginationType == 'clicked' || this.paginationType == 'watched' || this.paginationType == 'countryWiseUsers') {
             if(this.paginationType != 'countryWiseUsers'){
             object["Campaign Name"] = this.dashboardReport.downloadEmailLogList[i].campaignName;
             }
             object["City"] = this.dashboardReport.downloadEmailLogList[i].city;
             object["State"] = this.dashboardReport.downloadEmailLogList[i].state;
             object["Country"] = this.dashboardReport.downloadEmailLogList[i].country;
             object["Platform"] = this.dashboardReport.downloadEmailLogList[i].os;

         }
         this.downloadDataList.push(object);
     }
     this.isDownloadCsvFile = true;
     this.isLoadingDownloadList = false;
 }



}
