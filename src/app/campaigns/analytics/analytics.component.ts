import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Campaign } from '../models/campaign';
import { CampaignReport } from '../models/campaign-report';
import { Pagination } from '../../core/models/pagination';
import { SocialStatus } from '../../social/models/social-status';

import { CampaignService } from '../services/campaign.service';
import { UtilService } from '../../core/services/util.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { SocialService } from '../../social/services/social.service';

declare var $, Highcharts: any;
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css', './timeline.css'],
  providers: [Pagination]
})
export class AnalyticsComponent implements OnInit {
  isTimeLineView: boolean;
  campaign: Campaign;
  selectedRow: any = new Object();
  videoLength: number;
  campaignViews: any;
  campaignTotalViewsData: any;
  campaignBarViews: any;
  emailLogs: any;
  totalEmailLogs: any;
  campaignReport: CampaignReport = new CampaignReport;
  userCampaignReport: CampaignReport = new CampaignReport;

  campaignViewsPagination: Pagination = new Pagination();
  emailActionListPagination: Pagination = new Pagination();
  usersWatchListPagination: Pagination = new Pagination();
  emailLogPagination: Pagination = new Pagination();
  campaignTotalViewsPagination: Pagination = new Pagination();

  socialStatus: SocialStatus;
  campaignType: string;
  campaignId: number;
  maxViewsValue: number;
  barChartCliked = false;
  donutCampaignViews: any;
  totalListOfemailLog: any;
  donultModelpopupTitle: string;
  downloadDataList = [];
  downloadCsvList: any;
  downloadTypeName = '';
  totalTimeSpent = 0;
  worldMapUserData: any;
  countryCode: string;

  constructor(private route: ActivatedRoute, private campaignService: CampaignService, private utilService: UtilService, private socialService: SocialService,
    private authenticationService: AuthenticationService, public pagerService: PagerService, public pagination: Pagination,
    private referenceService: ReferenceService) {
    this.isTimeLineView = false;
    this.campaign = new Campaign();
    if (this.referenceService.isFromTopNavBar) {
      this.userTimeline(this.referenceService.topNavBarNotificationDetails.campaignId, this.referenceService.topNavBarNotificationDetails.userId, this.referenceService.topNavBarNotificationDetails.emailId);
    }
  }
  showTimeline() {
    this.isTimeLineView = !this.isTimeLineView;
  }

  listCampaignViews(campaignId: number, pagination: Pagination) {
      this.downloadTypeName === 'campaignViews';
      this.listTotalCampaignViews(campaignId);
      this.campaignService.listCampaignViews(campaignId, pagination)
      .subscribe(
      data => {
        this.campaignViews = data.campaignviews;
        console.log(data);
        const views = [];
        for (let i = 0; i < data.campaignviews.length; i++) {
          views.push(data.campaignviews[i].viewsCount)
        }
        this.maxViewsValue = Math.max.apply(null, views);
        this.campaignViewsPagination.totalRecords = this.campaignReport.emailSentCount;
        console.log(this.campaignReport)
        this.campaignViewsPagination = this.pagerService.getPagedItems(this.campaignViewsPagination, this.campaignViews);
      },
      error => console.log(error),
      () => console.log()
      )
  }

  getCampaignViewsReportDurationWise(campaignId: number) {
    this.campaignService.getCampaignViewsReportDurationWise(campaignId)
      .subscribe(
      data => {
        this.campaignReport.thisMonthViewsCount = data.this_month_count;
        this.campaignReport.lifetimeViewsCount = data.lifetime_count;
        this.campaignReport.todayViewsCount = data.today_count;
      },
      error => console.log(error),
      () => console.log()
      )
  }

  getEmailSentCount(campaignId: number) {
    this.campaignService.getEmailSentCount(campaignId)
      .subscribe(
      data => {
        this.campaignReport.emailSentCount = data.emails_sent_count;
      },
      error => console.log(error),
      () => {
        this.listCampaignViews(campaignId, this.campaignViewsPagination);
      }
      )
  }

  getCountryWiseCampaignViews(campaignId: number) {
    this.campaignService.getCountryWiseCampaignViews(campaignId)
      .subscribe(
      data => { this.renderMap(data); },
      error => console.log(error),
      () => console.log());
  }
  campaignViewsCountBarchart(names, data) {
    console.log(names);
    console.log(data);
    const maxValue = Math.max.apply(null, data);
    const self = this;
    Highcharts.chart('campaign-views-barchart', {
      chart: {
        type: 'bar'
      },
      title: {
        text: ' '
      },
      xAxis: {
        categories: names,
        title: {
          text: null
        },
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        minorTickLength: 0,
        tickLength: 0
      },
      exporting: { enabled: false },
      credits: { enabled: false },
      yAxis: {
        min: 0,
        // max: maxValue,
        visible: false
      },
      tooltip: {
        valueSuffix: ''
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
          minPointLength: 3,
          allowOverlap: true,
        },
        series: {
          cursor: 'pointer',
          events: {
            click: function (e) {
              //   alert(e.point.category+', views:'+e.point.y);
              self.userWatchedviewsInfo(e.point.category);
            }
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
        shadow: true
      },
      series: [{
        showInLegend: false,
        name: 'views',
        data: data
      }]
    });
  }
  getCampaignUserViewsCountBarCharts(campaignId: number, pagination: Pagination) {
    this.campaignService.listCampaignViews(campaignId, pagination)
      .subscribe(
      data => {
        console.log(data);
        this.campaignBarViews = data.campaignviews;
        const names = [];
        const views = [];
        for (let i = 0; i < data.campaignviews.length; i++) {
          names.push(data.campaignviews[i].userEmail);
          views.push(data.campaignviews[i].viewsCount)
        }
        this.maxViewsValue = Math.max.apply(null, views);
        this.pagination.totalRecords = this.campaignReport.emailSentCount;
        this.pagination = this.pagerService.getPagedItems(this.pagination, data.campaignviews);
        console.log(this.pagination);
        this.campaignViewsCountBarchart(names, views);
        this.referenceService.goToTop();
      },
      error => console.log(error),
      () => console.log()
      )
  }
  renderMap(worldData: any) {
    const countryData = worldData;
    const data = [];
    const self = this;
    if (countryData != null) {
      for (const i of Object.keys(countryData)) {
        const arr = [countryData[i][0].toLowerCase(), countryData[i][1]];
        data.push(arr);
      }
      // Create the chart
      Highcharts.mapChart('world-map', {
        chart: {
          map: 'custom/world'
        },
        title: {
          text: 'The people who have watched the campaign video',
          style: {
            color: '#696666',
            fontWeight: 'normal',
            fontSize: '14px'
          }
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },
        colorAxis: {
          min: 0
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          series: {
            events: {
              click: function (e) {
               // alert(e.point.name + ', views:' + e.point.value);
                self.getCampaignUsersWatchedInfo(e.point['hc-key'])
              }
            }
          }
        },
        exporting: { enabled: false },
        series: [{
          data: data,
          name: 'Views',
          states: {
            hover: {
              color: '#BADA55'
            }
          },
          dataLabels: {
            enabled: false,
            format: '{point.name}'
          }
        }]
      });
    }
  }
  getCampaignUsersWatchedInfo(countryCode) {
    this.countryCode = countryCode.toUpperCase();
    this.campaignService.getCampaignUsersWatchedInfo(this.campaignId, this.countryCode, this.pagination)
      .subscribe(
      (data: any) => {
        console.log(data);
        this.worldMapUserData = data.data;
        this.pagination.totalRecords = data.totalRecords;
        this.pagination = this.pagerService.getPagedItems(this.pagination, data.data);
        $('#worldMapModal').modal('show');
      },
      error => console.log(error),
      () => console.log('finished')
      );
  }
  getEmailLogCountByCampaign(campaignId: number) {
    this.campaignService.getEmailLogCountByCampaign(campaignId)
      .subscribe(
      data => {
        this.campaignReport.emailOpenCount = data["email_opened_count"];
        this.campaignReport.emailClickedCount = data["email_url_clicked_count"] + data['email_gif_clicked_count'];
      },
      error => console.log(error),
      () => console.log()
      )
  }

  getCampaignWatchedUsersCount(campaignId: number) {
    this.campaignService.getCampaignWatchedUsersCount(campaignId)
      .subscribe(
      data => {
        this.campaignReport.usersWatchCount = data.campaign_users_watched;
      },
      error => console.log(error),
      () => console.log()
      )
  }

  campaignWatchedUsersListCount(campaignId: number) {
    this.campaignService.campaignWatchedUsersListCount(campaignId)
      .subscribe(
      data => this.usersWatchListPagination.totalRecords = data,
      error => console.log(error),
      () => console.log()
      )
  }

  usersWatchList(campaignId: number, pagination: Pagination) {
      this.downloadTypeName === 'usersWatchedList';
      this.usersWatchTotalList(campaignId, pagination);
      this.campaignService.usersWatchList(campaignId, pagination)
      .subscribe(
      data => {
        this.campaignReport.usersWatchList = data.data;
        $('#usersWatchListModal').modal();

        this.usersWatchListPagination = this.pagerService.getPagedItems(this.usersWatchListPagination, this.campaignReport.usersWatchList);
      },
      error => console.log(error),
      () => console.log()
      )
  }

  setPage(page: number, type: string) {
    if (type === 'campaignViews') {
      if (page !== this.campaignViewsPagination.pageIndex) {
        this.campaignViewsPagination.pageIndex = page;
        this.listCampaignViews(this.campaign.campaignId, this.campaignViewsPagination);
      }
    } else if (type === 'emailAction') {
      if (page !== this.emailActionListPagination.pageIndex) {
        this.emailActionListPagination.pageIndex = page;
        if (this.campaignReport.emailActionType === 'open' || this.campaignReport.emailActionType === 'click') {
          this.emailActionList(this.campaign.campaignId, this.campaignReport.emailActionType, this.emailActionListPagination);
        }
      }
    } else if (type === 'usersWatch') {
      if (page !== this.usersWatchListPagination.pageIndex) {
        this.usersWatchListPagination.pageIndex = page;
        this.usersWatchList(this.campaign.campaignId, this.usersWatchListPagination);
      }
    }
    else if (type === 'viewsBarChart') {
      if (page !== this.pagination.pageIndex) {
        this.pagination.pageIndex = page;
        this.getCampaignUserViewsCountBarCharts(this.campaign.campaignId, this.pagination);
      }
    }
    else if (type === 'donutCampaign') {
      if (page !== this.pagination.pageIndex) {
        this.pagination.pageIndex = page;
        this.campaignViewsDonut(this.donultModelpopupTitle, this.pagination);
      }
    }
    else if(type === 'coutrywiseUsers'){
      if(page !== this.pagination.pageIndex){
          this.pagination.pageIndex = page;
          this.getCampaignUsersWatchedInfo(this.countryCode);
      }
    }

  }

  emailActionList(campaignId: number, actionType: string, pagination: Pagination) {
    this.emailActionTotalList(campaignId, actionType);
    this.campaignService.emailActionList(campaignId, actionType, pagination)
      .subscribe(
      data => {
        this.campaignReport.emailActionList = data;
        this.campaignReport.emailActionType = actionType;
        $('#emailActionListModal').modal();

        if (actionType === 'open') {
          this.emailActionListPagination.totalRecords = this.campaignReport.emailOpenCount;
        } else if (actionType === 'click') {
          this.emailActionListPagination.totalRecords = this.campaignReport.emailClickedCount;
        }
        this.emailActionListPagination = this.pagerService.getPagedItems(this.emailActionListPagination, this.campaignReport.emailActionList);
      },
      error => console.log(error),
      () => console.log()
      )
  }

  listEmailLogsByCampaignAndUser(campaignId: number, userId: number) {
    this.campaignService.listEmailLogsByCampaignAndUser(campaignId, userId)
      .subscribe(
      data => {
        this.emailLogs = data;
        console.log(data);
      },
      error => console.log(error),
      () => {
        this.count();
      }
      )
  }

  count() {
    if (this.emailLogs !== undefined) {
      for (const i in this.emailLogs) {
        if (this.emailLogs[i].actionId === 13) {
          this.userCampaignReport.emailOpenCount += 1;
        } else if (this.emailLogs[i].actionId === 14 || this.emailLogs[i].actionId === 15) {
          this.userCampaignReport.emailClickedCount += 1;
        } else if (this.emailLogs[i].actionId === 1) {
          this.userCampaignReport.totalUniqueWatchCount += 1;
        }
      }
    }
  }

  userTimeline(campaignId: number, userId: number, emailId: string) {
    this.listEmailLogsByCampaignAndUser(campaignId, userId);
    this.getTotalTimeSpentOfCampaigns(userId);
    this.selectedRow.userEmail = emailId;
    this.isTimeLineView = !this.isTimeLineView;
    if (!this.barChartCliked) {
      this.pagination.pageIndex = 1;
      this.pagination.maxResults = 10;
      if(this.campaignId === null){
         this.campaignId = this.route.snapshot.params['campaignId'];}
         console.log('campaign id : '+this.campaignId);
      this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination);
    }
  }
  getTotalTimeSpentOfCampaigns(userId: number) {
    this.campaignService.getTotalTimeSpentofCamapaigns(userId)
      .subscribe(data => {
        console.log(data);
        this.totalTimeSpent = data;
      },
      error => console.log(error),
      () => { }
      );
  }
  userWatchedviewsInfo(emailId: string) {
    if (emailId !== this.selectedRow.userEmail) {
      this.userCampaignReport.emailOpenCount = 0;
      this.userCampaignReport.emailClickedCount = 0;
      this.userCampaignReport.totalUniqueWatchCount = 0;
      this.barChartCliked = true;
      const obj = this.campaignBarViews.find(function (obj) { return obj.userEmail === emailId; });
      console.log(obj.campaignId + ' user id is ' + obj.userId + 'email id ' + obj.userEmail);
      
      this.userTimeline(obj.campaignId, obj.userId, obj.userEmail);
      this.isTimeLineView = true;
    }
  }

  getCampaignById(campaignId: number) {
    const obj = { 'campaignId': campaignId }
    this.campaignService.getCampaignById(obj)
      .subscribe(
      data => {
        this.campaign = data;
        console.log(this.campaign);
      },
      error => console.log(error),
      () => {
        const campaignType = this.campaign.campaignType.toLocaleString();
        if (campaignType.includes('VIDEO')) {
          this.campaignType = 'VIDEO';
          this.getCountryWiseCampaignViews(campaignId);
          this.getCampaignViewsReportDurationWise(campaignId);
          this.getCampaignWatchedUsersCount(campaignId);
          this.campaignWatchedUsersListCount(campaignId);
        } else if (campaignType.includes('SOCIAL')) {
          this.campaignType = 'SOCIAL';
          this.getSocialCampaignByCampaignId(campaignId);
        } else {
          this.campaignType = 'REGULAR';
        }
      }
      )
  }

  getSocialCampaignByCampaignId(campaignId: number) {
    this.socialService.getSocialCampaignByCampaignId(campaignId)
      .subscribe(
      data => {
        this.socialStatus = data;
      },
      error => console.log(error),
      () => { }
      )
  }

  resetTopNavBarValue() {
    this.referenceService.isFromTopNavBar = false;
    this.isTimeLineView = !this.isTimeLineView;
    this.emailLogs = [];
    this.totalEmailLogs = [];
    this.userCampaignReport.emailOpenCount = 0;
    this.userCampaignReport.emailClickedCount = 0;
    this.userCampaignReport.totalUniqueWatchCount = 0;
    this.clearPaginationValues();
  }

  clearPaginationValues() {
    this.pagination.pageIndex = 1;
    this.pagination = new Pagination();
    this.barChartCliked = false;
    this.donultModelpopupTitle = '';
    this.emailLogPagination = new Pagination();
  }

  campaignViewsDonut(timePeriod: string, pagination) {
    this.donultModelpopupTitle = timePeriod;
    this.campaignService.donutCampaignInnerViews(this.campaignId, timePeriod, this.pagination).
      subscribe(
      (data: any) => {
        console.log(data);
        this.donutCampaignViews = data;
        if (timePeriod === 'today') {
          this.pagination.totalRecords = this.campaignReport.todayViewsCount;
        } else if (timePeriod === 'current-month') {
          this.pagination.totalRecords = this.campaignReport.thisMonthViewsCount;
        }
        else {
          this.pagination.totalRecords = this.campaignReport.lifetimeViewsCount;
        }
        this.pagination = this.pagerService.getPagedItems(this.pagination, this.donutCampaignViews);
        $('#donutModelPopup').modal('show');
        this.totalCampaignViewsDonut(timePeriod);
      },
      error => console.log(error),
      () => { });
  }

  totalCampaignViewsDonut(timePeriod: string) {
    this.emailLogPagination.maxResults = 5000;
    this.downloadTypeName = 'donut';
    this.campaignService.donutCampaignInnerViews(this.campaignId, timePeriod, this.emailLogPagination).
      subscribe(
      (data: any) => {
        this.totalListOfemailLog = data;
      },
      error => console.log(error),
      () => { });
  }

  emailActionTotalList(campaignId: number, actionType: string) {
    this.emailLogPagination.maxResults = 5000;
    this.downloadTypeName = 'emailAction';
    this.campaignService.emailActionList(campaignId, actionType, this.emailLogPagination)
      .subscribe(
      data => {
        this.campaignReport.totalEmailActionList = data;
        this.campaignReport.emailActionType = actionType;
      },
      error => console.log(error),
      () => console.log()
      )
  }
  
  usersWatchTotalList(campaignId: number, pagination: Pagination) {
      pagination.maxResults = 500000;
      this.downloadTypeName = 'usersWatchedList';
      this.campaignService.usersWatchList(campaignId, pagination)
        .subscribe(
        data => {
          this.campaignReport.totalWatchedList = data.data;
        },
        error => console.log(error),
        () => console.log()
        )
    }

  listTotalCampaignViews(campaignId: number) {
      this.downloadTypeName === 'campaignViews';
      this.campaignTotalViewsPagination.maxResults = this.campaignReport.emailSentCount;
      this.campaignService.listCampaignViews(campaignId, this.campaignTotalViewsPagination)
        .subscribe(
        data => {
          this.campaignTotalViewsData = data.campaignviews;
        },
        error => console.log(error),
        () => console.log()
        )
    }
  
  convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";
    for (var index in objArray[0]) {
      row += index + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  downloadEmailLogs() {
      let logListName: string;
      if ( this.downloadTypeName === 'donut' ) {
          logListName = 'Campaign_Views_Logs.csv';
          this.downloadCsvList = this.totalListOfemailLog;
      } else if ( this.downloadTypeName === 'emailAction' ) {
          logListName = 'Email_Action_Logs.csv';
          this.downloadCsvList = this.campaignReport.totalEmailActionList;
      } else if ( this.downloadTypeName === 'usersWatchedList' ) {
          logListName = 'Users_watched_Logs.csv';
          this.downloadCsvList = this.campaignReport.totalWatchedList;
      } else if ( this.downloadTypeName === 'campaignViews' ) {
          logListName = 'Campaign_report_logs.csv';
          this.downloadCsvList = this.campaignTotalViewsData;
      }
      
      this.downloadDataList.length = 0;
      for ( let i = 0; i < this.downloadCsvList.length; i++ ) {
          let date = new Date( this.downloadCsvList[i].time );
          let startTime = new Date( this.downloadCsvList[i].startTime );
          let endTime = new Date( this.downloadCsvList[i].endTime );
          let sentTime = new Date( this.campaign.launchTime );
          let latestView = new Date( this.downloadCsvList[i].latestView );
          
          var object = {
                  "First Name": this.downloadCsvList[i].firstName,
                  "Last Name": this.downloadCsvList[i].lastName,
          }

          if ( this.downloadTypeName === 'donut' ) {
              object["Email Id"] = this.downloadCsvList[i].userEmail;
              object["Campaign Name"] = this.downloadCsvList[i].campaignName;
              object["Date and Time"] = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
              object["Platform"] = this.downloadCsvList[i].os;
              object["Location"] = this.downloadCsvList[i].location;
          }
          
          if ( this.downloadTypeName === 'campaignViews' ) {
              object["Email Id"] = this.downloadCsvList[i].userEmail;
              object["Campaign Name"] = this.downloadCsvList[i].campaignName;
              object["Sent Time"] = sentTime.toDateString() + ' ' + sentTime.getHours() + ':' + sentTime.getMinutes() + ':' + sentTime.getSeconds();
              object["Latest View"] = latestView.toDateString() + ' ' + latestView.getHours() + ':' + latestView.getMinutes() + ':' + latestView.getSeconds();
          }
          
          if ( this.downloadTypeName === 'usersWatchedList' ) {
              object["Email Id"] = this.downloadCsvList[i].emailId;
              object["START DURATION"] = startTime.toDateString() + ' ' + startTime.getHours() + ':' + startTime.getMinutes() + ':' + startTime.getSeconds();
              object["STOP DURATION"] = endTime.toDateString() + ' ' + endTime.getHours() + ':' + endTime.getMinutes() + ':' + endTime.getSeconds();
              object["IP ADDRESS"] = this.downloadCsvList[i].ipAddress;
              object["PLATFORM"] = this.downloadCsvList[i].os;
              object["STATE"] = this.downloadCsvList[i].state;
              object["COUNTRY"] = this.downloadCsvList[i].country;
          }
          
          if ( this.downloadTypeName === 'emailAction' ) {
              object["Email Id"] = this.downloadCsvList[i].emailId;
              object["Date and Time"] = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
          }

          this.downloadDataList.push( object );
      }
      var csvData = this.convertToCSV( this.downloadDataList );
      var a = document.createElement( "a" );
      a.setAttribute( 'style', 'display:none;' );
      document.body.appendChild( a );
      var blob = new Blob( [csvData], { type: 'text/csv' });
      var url = window.URL.createObjectURL( blob );
      a.href = url;
      a.download = logListName;
      a.click();
      return 'success';
  }

  ngOnInit() {
    const userId = this.authenticationService.getUserId();
    this.campaignId = this.route.snapshot.params['campaignId'];
    this.getCampaignById(this.campaignId);
    this.getEmailSentCount(this.campaignId);
    this.getEmailLogCountByCampaign(this.campaignId);
    this.pagination.pageIndex = 1;
    if(this.isTimeLineView ===true){
    this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination);
    }
  }

}
