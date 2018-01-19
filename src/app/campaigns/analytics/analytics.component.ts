import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Campaign} from '../models/campaign';
import {CampaignReport} from '../models/campaign-report';
import {Pagination} from '../../core/models/pagination';
import {SocialStatus} from '../../social/models/social-status';

import {CampaignService} from '../services/campaign.service';
import {UtilService} from '../../core/services/util.service';
import {AuthenticationService} from '../../core/services/authentication.service';
import {PagerService} from '../../core/services/pager.service';
import {ReferenceService} from '../../core/services/reference.service';
import {SocialService} from '../../social/services/social.service';

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
  campaignBarViews: any;
  countryWiseCampaignViews: any;
  emailLogs: any;
  campaignReport: CampaignReport = new CampaignReport;
  userCampaignReport: CampaignReport = new CampaignReport;

  campaignViewsPagination: Pagination = new Pagination();
  emailActionListPagination: Pagination = new Pagination();
  usersWatchListPagination: Pagination = new Pagination();

  socialStatus: SocialStatus;
  campaignType: string;
  campaignId: number;
  maxViewsValue: number;
  barChartCliked = false;
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
    this.campaignService.listCampaignViews(campaignId, pagination)
      .subscribe(
      data => {
        this.campaignViews = data.campaignviews;
        console.log(data);
        const views = [];
        for(let i=0; i<data.campaignviews.length; i++){
          views.push(data.campaignviews[i].viewsCount)
        }
        this.maxViewsValue =  Math.max.apply(null, views);
        this.campaignViewsPagination.totalRecords = this.campaignReport.emailSentCount;
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
      data => {
        this.countryWiseCampaignViews = data;
        this.renderMap();
      },
      error => console.log(error),
      () => console.log()
      )
  }
 campaignViewsCountBarchart( names, data){
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
            series: [ {
                showInLegend: false,
                name: 'views',
                data: data
            }]
        });
 }   
 getCampaignUserViewsCountBarCharts(campaignId: number, pagination: Pagination){
    this.campaignService.listCampaignViews(campaignId,pagination)
      .subscribe(
      data => {
       console.log(data);
       this.campaignBarViews = data.campaignviews;
       const names = [];
       const views = [];
       for(let i=0; i<data.campaignviews.length; i++){
        names.push(data.campaignviews[i].userEmail);
        views.push(data.campaignviews[i].viewsCount)
       }
       this.maxViewsValue =  Math.max.apply(null, views);
       this.pagination.totalRecords = this.campaignReport.emailSentCount;
       this.pagination = this.pagerService.getPagedItems(this.pagination, data.campaignviews);
       console.log(this.pagination);
      this.campaignViewsCountBarchart(names, views);
      },
      error => console.log(error),
      () => console.log()
      )
 }   
  renderMap() {
    const countryData = this.countryWiseCampaignViews;
    const data = [];
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
                        alert(e.point.name+', views:'+e.point.value);
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
    
  }

  emailActionList(campaignId: number, actionType: string, pagination: Pagination) {
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
    this.selectedRow.userEmail = emailId;
    this.isTimeLineView = !this.isTimeLineView;
    if(!this.barChartCliked){
    this.pagination.pageIndex = 1;
    this.pagination.maxResults =10;
    this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination);
    }
  }
  userWatchedviewsInfo(emailId: string){
    this.barChartCliked = true;
    const obj = this.campaignBarViews.find(function (obj) { return obj.userEmail === emailId; });
    console.log(obj.campaignId +' user id is '+obj.userId+'email id '+ obj.userEmail);
    this.userTimeline(obj.campaignId, obj.userId,obj.userEmail);
    this.isTimeLineView = true;
  }
   
  getCampaignById(campaignId: number) {
    const obj = {'campaignId': campaignId}
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
          this.renderMap();

          this.getCampaignViewsReportDurationWise(campaignId);

          this.getCampaignWatchedUsersCount(campaignId);
          this.campaignWatchedUsersListCount(campaignId);
        } else if (campaignType.includes('SOCIAL')) {
          this.campaignType = 'SOCIAL';
          this.getSocialCampaignByCampaignId(campaignId);
        } else{
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
      () => {}
      )
  }

  resetTopNavBarValue() {
    this.referenceService.isFromTopNavBar = false;
    this.isTimeLineView = !this.isTimeLineView;
    this.emailLogs = [];
    this.userCampaignReport.emailOpenCount = 0;
    this.userCampaignReport.emailClickedCount = 0;
    this.userCampaignReport.totalUniqueWatchCount = 0;
    this.clearPaginationValues();
  }
  clearPaginationValues(){
    this.pagination = new Pagination();
    this.pagination.pageIndex = 1;
    this.barChartCliked = false;
  }
  campaignViewsDonut(timePeriod: string){
   this.campaignService.donutCampaignInnerViews(this.campaignId, timePeriod).
   subscribe(
     (data:any) => {
      console.log(data);
      this.pagination.pageIndex = 1;
      this.pagination.maxResults =10;
      $('#donutModelPopup').modal('show'); 
   },
      error => console.log(error),
      () => {});
  }
  ngOnInit() {
    const userId = this.authenticationService.getUserId();
    this.campaignId = this.route.snapshot.params['campaignId'];
    this.getCampaignById(this.campaignId);
    this.getEmailSentCount(this.campaignId);
    this.getEmailLogCountByCampaign(this.campaignId);
    this.pagination.pageIndex = 1;
    this.pagination.maxResults = 10;
    // this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination);
  }

}
