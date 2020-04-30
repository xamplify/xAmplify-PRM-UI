import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { DashboardStatesReport } from 'app/dashboard/models/dashboard-states-report';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { Pagination } from 'app/core/models/pagination';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardReport } from 'app/core/models/dashboard-report';
import {DashboardAnalyticsDto} from "app/dashboard/models/dashboard-analytics-dto";
import { ActivatedRoute } from '@angular/router';
import {VanityURLService} from "app/vanity-url/services/vanity.url.service";
declare var $: any;

@Component({
  selector: 'app-regional-statistics-analytics',
  templateUrl: './regional-statistics-analytics.component.html',
  styleUrls: ['./regional-statistics-analytics.component.css'],
  providers: [ Pagination,HttpRequestLoader]
})
export class RegionalStatisticsAnalyticsComponent implements OnInit {
  countryViewsData: any;
  loading = false;
  isLoadingList = true;
  isLoadingDownloadList = false;
  worldMapUserData: DashboardStatesReport[];
  worldMapTotalUsersData: DashboardStatesReport[];
  countryCode: any;
  paginationType: string;
  loggedInUserId:number = 0;
  regionalStatisticsLoader: HttpRequestLoader = new HttpRequestLoader();
  downloadDataList = [];
  totalCountryWiseUsersWatchedPagination: Pagination = new Pagination();
  dashboardReport: DashboardReport = new DashboardReport();
  logListName = "";
  isDownloadCsvFile = false;
  dashboardAnalyticsDto:DashboardAnalyticsDto = new DashboardAnalyticsDto();

  constructor(public dashboardService:DashboardService,public xtremandLogger:XtremandLogger,public authenticationService:AuthenticationService, public pagination: Pagination, public pagerService: PagerService,public referenceService:ReferenceService,public route:ActivatedRoute,public vanityUrlService:VanityURLService) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.dashboardAnalyticsDto = this.vanityUrlService.addVanityUrlFilterDTO(this.dashboardAnalyticsDto);
    this.getRegionalStatistics();
  }

  getRegionalStatistics(){
    this.referenceService.loading(this.regionalStatisticsLoader,true);
    this.dashboardService.getRegionalStatistics(this.dashboardAnalyticsDto).
    subscribe(result => {
        this.countryViewsData = result.data;
        this.xtremandLogger.log(this.countryViewsData);
        this.referenceService.loading(this.regionalStatisticsLoader,false);
    },
    (error: any) => {
        this.xtremandLogger.error(error);
        this.referenceService.loading(this.regionalStatisticsLoader,false);
    });
  }


clickWorldMapReports(event: any) {
    this.getCampaignUsersWatchedInfo(event);
}


getCampaignUsersWatchedInfo(countryCode) {
  this.loading = true;
  this.isLoadingList = true;
  try {
        this.countryCode = countryCode.toUpperCase();
        this.paginationType = "countryWiseUsers";
        //if(!this.isCalledPagination){ this.pagination.maxResults = 12; this.isCalledPagination = true;}
        this.dashboardService.worldMapCampaignDetailsForVanityURL(this.countryCode, this.pagination,this.dashboardAnalyticsDto)
            .subscribe(
                (result: any) => {
                    this.loading = false;
                    result.data.forEach((element) => {
                      if(element.time) { element.time = new Date(element.utcTimeString);} });
                    this.xtremandLogger.log(result);
                    this.worldMapUserData = result.data;
                    this.pagination.totalRecords = result.totalRecords;
                    this.pagination = this.pagerService.getPagedItems(this.pagination, this.worldMapUserData);
                    $('#worldMapModal').modal('show');
                    this.isLoadingList = false;
                },
                (error: any) => {
                    this.loading = false;
                    this.isLoadingList = false;
                    this.xtremandLogger.log(error)
                    this.xtremandLogger.error('error in world map dashboard ' + error);
                    this.xtremandLogger.errorPage(error);
                },
                () => this.xtremandLogger.log('finished')
            );
    } catch (error) {
        this.loading = false;
        this.isLoadingList = false;
        this.xtremandLogger.error('error in world map dashboard ' + error);
    }
}

setPage(event: any) {
  this.pagination.pageIndex = event.page;
  this.getCampaignUsersWatchedInfo(this.countryCode);

}
paginationDropdown(pagination:Pagination){
  this.pagination =  pagination;
  this.getCampaignUsersWatchedInfo(this.countryCode);
}

cancelEmailStateModalPopUp() {
  this.pagination = new Pagination();
  this.pagination.pageIndex = 1;
  this.pagination.maxResults = 12;
  this.downloadDataList.length = 0;
  if(this.dashboardReport.emailLogList) { this.dashboardReport.emailLogList.length = 0;}
  this.isLoadingList = true;
 // this.isCalledPagination = false;
}

downloadFuctionality(){
this.isDownloadCsvFile = false;
  this.getCampaignTotalUsersWatchedInfo();
}

getCampaignTotalUsersWatchedInfo( ) {
  try {
      this.isLoadingDownloadList = true;
      this.totalCountryWiseUsersWatchedPagination.maxResults = this.pagination.totalRecords;
      this.dashboardService.worldMapCampaignDetails(this.loggedInUserId, this.countryCode, this.totalCountryWiseUsersWatchedPagination)
            .subscribe(
                (result: any) => {
                    result.data.forEach((element) => {
                      if(element.time) { element.time = new Date(element.utcTimeString);} });
                    this.xtremandLogger.log(result);
                    this.worldMapTotalUsersData = result.data;
                    this.downloadEmailLogs();
                },
                (error: any) => {
                    this.xtremandLogger.log(error)
                    this.xtremandLogger.error('error in world map dashboard ' + error);
                    this.xtremandLogger.errorPage(error);
                },
                () => this.xtremandLogger.log('finished')
            );
    } catch (error) {
        this.xtremandLogger.error('error in world map dashboard ' + error);
    }
}
downloadEmailLogs() {
  this.logListName = 'Country_Wise_Views_Logs.csv';
  this.dashboardReport.downloadEmailLogList = this.worldMapTotalUsersData;
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

      if (this.paginationType == 'countryWiseUsers') {
          object["Device"] = this.dashboardReport.downloadEmailLogList[i].deviceType;

      }

      this.downloadDataList.push(object);
  }
  this.isDownloadCsvFile = true;
  this.isLoadingDownloadList = false;
}


}
