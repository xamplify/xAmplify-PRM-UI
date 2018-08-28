import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Campaign } from '../models/campaign';
import { CampaignReport } from '../models/campaign-report';
import { EmailLog } from '../models/email-log';
import { Pagination } from '../../core/models/pagination';
import { SocialStatus } from '../../social/models/social-status';
import { CustomResponse } from '../../common/models/custom-response';
import { HttpRequestLoader } from '../../core/models/http-request-loader';

import { CampaignService } from '../services/campaign.service';
import { UtilService } from '../../core/services/util.service';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { SocialService } from '../../social/services/social.service';
import { ContactService } from '../../contacts/services/contact.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';

declare var $, Highcharts: any;

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css', './timeline.css'],
  providers: [Pagination,HttpRequestLoader]
})
export class AnalyticsComponent implements OnInit , OnDestroy{
  isTimeLineView: boolean;
  campaign: Campaign;
  selectedRow: any = new Object();
  videoLength: number;
  campaignViews: any;
  campaignTotalViewsData: any;
  campaignBarViews: any;
  emailLogs: any;
  emailLogDetails: any;
  totalEmailLogs: any;
  campaignReport: CampaignReport = new CampaignReport;
  userCampaignReport: CampaignReport = new CampaignReport;
  customResponse: CustomResponse = new CustomResponse();

  campaignViewsPagination: Pagination = new Pagination();
  emailActionListPagination: Pagination = new Pagination();
  usersWatchListPagination: Pagination = new Pagination();
  emailLogPagination: Pagination = new Pagination();
  campaignTotalViewsPagination: Pagination = new Pagination();
  campaignsWorldMapPagination: Pagination = new Pagination();
  userWatchedReportPagination: Pagination = new Pagination();

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
  totalTimeSpent: string = "00:00:00";
  worldMapUserData: any;
  worldMapUserTotalData: any;
  countryCode: string;
  campaignTypeValue: string;
  isPartnerCampaign: string;
  renderMapData: any;
  campaingContactLists:any;
  campaingContactListValues:any;
  contactListId:number;
  paginationType:string;
  videoFile: any;
  userWatchtotalRecords: number;
  isPartnerEnabledAnalyticsAccess = false;
  isNavigatedThroughAnalytics = false;
  campaignRouter:any;
  loggedInUserId = 0;
  loading =false;
  mainLoader = false;
  logListName = "";
  selectedRsvpPartnerId: number = 0;
  rsvpDetailsList: any;
  reDistributionRsvpDetails: any;
  rsvpResposeType = '';
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  sortByDropDown = [
                    { 'name': 'Sort By', 'value': '' },
                    { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
                    { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
                    { 'name': 'Subject(ASC)', 'value': 'subject-ASC' },
                    { 'name': 'Subject(DESC)', 'value': 'subject-DESC' },
                    { 'name': 'Time(ASC)', 'value': 'time-ASC' },
                    { 'name': 'Time(DESC)', 'value': 'time-DESC' }
                ];
  public selectedSortedOption: any = this.sortByDropDown[this.sortByDropDown.length-1];
  constructor(private route: ActivatedRoute, private campaignService: CampaignService, private utilService: UtilService, private socialService: SocialService,
    public authenticationService: AuthenticationService, public pagerService: PagerService, public pagination: Pagination,
    public referenceService: ReferenceService, public contactService: ContactService, public videoUtilService: VideoUtilService, public xtremandLogger:XtremandLogger) {
      this.campaignRouter = this.utilService.getRouterLocalStorage();
      this.isTimeLineView = false;
      this.loggedInUserId = this.authenticationService.getUserId();
      this.campaign = new Campaign();
      this.selectedRow.emailId = "";
      if (this.referenceService.isFromTopNavBar) {
        const object = {
          "campaignId": this.referenceService.topNavBarNotificationDetails.campaignId,
          "userId": this.referenceService.topNavBarNotificationDetails.userId,
          "emailId": this.referenceService.topNavBarNotificationDetails.emailId
        }
       this.isTimeLineView = false;
       this.userTimeline(object);
      }
  }
  showTimeline() {
    this.isTimeLineView = !this.isTimeLineView;
  }

  listCampaignViews(campaignId: number, pagination: Pagination) {
    try{
    this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.downloadTypeName = this.paginationType = 'campaignViews';
    this.listTotalCampaignViews(campaignId);
    this.campaignService.listCampaignViews(campaignId, pagination)
      .subscribe(
      data => {
        this.campaignViews = data.campaignviews;
        const views = [];
        for (let i = 0; i < data.campaignviews.length; i++) {
          views.push(data.campaignviews[i].viewsCount)
        }
        this.maxViewsValue = Math.max.apply(null, views);
        this.campaignViewsPagination.totalRecords = this.campaignReport.emailSentCount;
        console.log(this.campaignReport)
        this.campaignViewsPagination = this.pagerService.getPagedItems(this.campaignViewsPagination, this.campaignViews);
        this.loading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      error => console.log(error),
      () => console.log()
      )
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }

  getCampaignViewsReportDurationWise(campaignId: number) {
    try{
    this.loading = true;
      this.campaignService.getCampaignViewsReportDurationWise(campaignId)
      .subscribe(
      data => {
        this.campaignReport.thisMonthViewsCount = data.this_month_count;
        this.campaignReport.lifetimeViewsCount = data.lifetime_count;
        this.campaignReport.todayViewsCount = data.today_count;
        this.loading = false;
      },
      error => console.log(error),
      () => console.log()
      )
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }

  getEmailSentCount(campaignId: number) {
    try{
    this.loading = true;
      this.campaignService.getEmailSentCount(campaignId)
      .subscribe(
      data => {
        this.campaignReport.emailSentCount = data.emails_sent_count;
        this.loading = false;
      },
      error => console.log(error),
      () => {
        this.listCampaignViews(campaignId, this.campaignViewsPagination);
      }
      )
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }

  getCountryWiseCampaignViews(campaignId: number) {
    try{
    this.loading = true;
      this.campaignService.getCountryWiseCampaignViews(campaignId)
      .subscribe(
      (result: any) => {
        const countryData = result;
        const data = [];
        const self = this;
        if (countryData != null) {
          for (const i of Object.keys(countryData)) {
            const arr = [countryData[i][0].toLowerCase(), countryData[i][1]];
            data.push(arr);
          }
          this.renderMapData = data;
        }
        this.loading = false;
        // this.renderMap(data);
      },
      error => console.log(error),
      () => console.log());
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }
  clickWorldMapReports(event: any) {
    this.getCampaignUsersWatchedInfo(event);
  }

  campaignViewsCountBarchart(names, data) {
    this.loading = true;
    const nameValue = this.campaignType === 'VIDEO' ? 'Views' : 'Email Opened';
    const self = this;
    Highcharts.chart('campaign-views-barchart', {
      chart: {
        type: 'bar'
      },
      title: {
        text: ' '
      },
      useHTML: true,
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
        name: nameValue,
        data: data
      }]
    });
    this.loading = false;
  }
  getCampaignUserViewsCountBarCharts(campaignId: number, pagination: Pagination) {
    try{
    this.loading = true;
    this.paginationType = 'viewsBarChart';
    this.campaignService.listCampaignViews(campaignId, pagination)
      .subscribe(
      data => {
        console.log(data);
        this.campaignBarViews = data.campaignviews;
        const names = [];
        const views = [];
        for (let i = 0; i < data.campaignviews.length; i++) {
          const firstName = data.campaignviews[i].firstName ? data.campaignviews[i].firstName : "";
          const lastName =  data.campaignviews[i].lastName ? data.campaignviews[i].lastName : "";
          names.push( "<b>"+firstName + " "+ lastName + '</b><br/>' + data.campaignviews[i].emailId);
          views.push(data.campaignviews[i].viewsCount)
        }
        this.maxViewsValue = Math.max.apply(null, views);
        this.pagination.totalRecords = this.campaignReport.emailSentCount;
        this.pagination = this.pagerService.getPagedItems(this.pagination, data.campaignviews);
        console.log(this.pagination);
        this.campaignViewsCountBarchart(names, views);
        this.referenceService.goToTop();
        this.loading = false;
      },
      error => console.log(error),
      () => console.log()
      )
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }

  getCampaignUsersWatchedInfo(countryCode) {
    try{
    this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.paginationType = 'coutrywiseUsers';
    this.countryCode = countryCode.toUpperCase();
    this.campaignService.getCampaignUsersWatchedInfo(this.campaignId, this.countryCode, this.pagination)
      .subscribe(
      (data: any) => {
        console.log(data);
        this.worldMapUserData = data.data;
        this.pagination.totalRecords = data.totalRecords;
        this.pagination = this.pagerService.getPagedItems(this.pagination, data.data);
        this.getCampaignUsersWatchedTotalInfo(countryCode, this.pagination.totalRecords);
        this.loading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
        $('#worldMapModal').modal('show');
      },
      error => console.log(error),
      () => console.log('finished')
      );
     }catch(error){ this.xtremandLogger.error('error'+error);}
  }
  getEmailLogCountByCampaign(campaignId: number) {
    try{
    this.loading = true;
      this.campaignService.getEmailLogCountByCampaign(campaignId)
      .subscribe(
      data => {
        this.campaignReport.emailOpenCount = data["email_opened_count"];
        this.campaignReport.emailClickedCount = data["email_url_clicked_count"];
        this.loading = false;
      },
      error => console.log(error),
      () => console.log()
      )
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }

  getCampaignWatchedUsersCount(campaignId: number) {
    try{
    this.loading = true;
      this.campaignService.getCampaignTotalViewsCount(campaignId)
      .subscribe(
      data => {
        this.campaignReport.usersWatchCount = data.total_views_count;
        this.loading = false;
      },
      error => console.log(error),
      () => console.log()
      )
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }

  campaignWatchedUsersListCount(campaignId: number) {
    try{
      this.loading = true;
      this.campaignService.campaignWatchedUsersListCount(campaignId)
      .subscribe(
      data => {
          this.userWatchtotalRecords = data;
          this.loading = false;
      },
      error => console.log(error),
      () => console.log()
      )
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }

  usersWatchList(campaignId: number, pagination: Pagination) {
    try{
    this.loading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
      this.paginationType = 'usersWatch';
    this.downloadTypeName = 'usersWatchedList';
    this.campaignService.usersWatchList(campaignId, pagination)
      .subscribe(
      data => {
        this.usersWatchListPagination.totalRecords = this.campaignReport.usersWatchCount;
        this.campaignReport.usersWatchList = data.data;
        $('#usersWatchListModal').modal();
        this.usersWatchListPagination = this.pagerService.getPagedItems(this.usersWatchListPagination, this.campaignReport.usersWatchList);
        this.usersWatchTotalList(campaignId, this.usersWatchListPagination.totalRecords);
        this.loading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      error => console.log(error),
      () => console.log()
      )
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }

  setPage(event: any) {
    try{
    if (event.type === 'campaignViews') {
        this.campaignViewsPagination.pageIndex = event.page;
        this.listCampaignViews(this.campaign.campaignId, this.campaignViewsPagination);
    } else if (event.type === 'emailAction') {
        this.emailActionListPagination.pageIndex = event.page;
        if (this.campaignReport.emailActionType === 'open' || this.campaignReport.emailActionType === 'click') {
          this.emailActionList(this.campaign.campaignId, this.campaignReport.emailActionType, this.emailActionListPagination);
      }
    } else if (event.type === 'usersWatch') {
        this.usersWatchListPagination.pageIndex = event.page;
        this.usersWatchList(this.campaign.campaignId, this.usersWatchListPagination);
    } else {
      this.pagination.pageIndex = event.page;
       this.callPaginationValues(event.type);
     }
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }
  paginationDropdown(pagination:Pagination){
    try{
    if (this.paginationType === 'campaignViews') {
      this.campaignViewsPagination = pagination;
      this.listCampaignViews(this.campaign.campaignId, pagination);
    } else if (this.paginationType === 'emailAction') {
      this.emailActionListPagination = pagination;
      if (this.campaignReport.emailActionType === 'open' || this.campaignReport.emailActionType === 'click') {
        this.emailActionList(this.campaign.campaignId, this.campaignReport.emailActionType, this.emailActionListPagination);
    }
    } else if (this.paginationType === 'usersWatch') {
      this.usersWatchListPagination = pagination;
      this.usersWatchList(this.campaign.campaignId, this.usersWatchListPagination);
    }
    else {
    this.pagination = pagination;
    this.callPaginationValues(this.paginationType);
    }
    }catch(error){ this.xtremandLogger.error('error'+error);}
   }
  callPaginationValues(type:string){
    if (type === 'viewsBarChart') { this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination); }
    else if (type === 'donutCampaign') { this.campaignViewsDonut(this.donultModelpopupTitle); }
    else if (type === 'coutrywiseUsers') { this.getCampaignUsersWatchedInfo(this.countryCode); }
  }
  emailActionList(campaignId: number, actionType: string, pagination: Pagination) {
      try{
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.paginationType = 'emailAction';
     this.campaignService.emailActionList(campaignId, actionType, pagination)
      .subscribe(
      data => {
        this.campaignReport.emailLogs = data;
        this.campaignReport.emailActionType = actionType;
        $('#emailActionListModal').modal();

        if (actionType === 'open') {
          this.emailActionListPagination.totalRecords = this.campaignReport.emailOpenCount;
        } else if (actionType === 'click') {
          this.emailActionListPagination.totalRecords = this.campaignReport.emailClickedCount;
        }
        this.emailActionListPagination = this.pagerService.getPagedItems(this.emailActionListPagination, this.campaignReport.emailLogs);
        this.emailActionTotalList(campaignId, actionType, this.emailActionListPagination.totalRecords);
        this.loading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      error => console.log(error),
      () => console.log()
      )
    }catch(error) {this.xtremandLogger.error('Error in analytics page emails sent'+error); }
  }

  listEmailLogsByCampaignAndUser(campaignId: number, userId: number) {
    try{
      this.loading = true;
      this.campaignService.listEmailLogsByCampaignAndUser(campaignId, userId)
      .subscribe(
      data => {
        this.emailLogs = data;
        this.loading =false;
        console.log(data);
      },
      error => console.log(error),
      () => {
        this.count();
      }
      )
    }catch(error) {this.xtremandLogger.error('Error in analytics page listEmailLogsByCampaignAndUser'+error); }
  }

  count() {
    try{
      this.loading = true;
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
      this.loading = false;
  } catch(error){this.xtremandLogger.error('Error in count'+error); }
  }

  userTimeline(campaignViews: any) {
    try{
    this.loading = true;
     this.listEmailLogsByCampaignAndUser(campaignViews.campaignId, campaignViews.userId);
    this.getTotalTimeSpentOfCampaigns(campaignViews.userId, campaignViews.campaignId);
    if(this.campaignType==='EVENT'){
        this.redistributionCampaignsDetails(campaignViews);
    }
    this.selectedRow = campaignViews;
    this.isTimeLineView = !this.isTimeLineView;
    if (!this.barChartCliked) {
      this.pagination.pageIndex = 1;
      this.pagination.maxResults = 10;
      if (this.campaignId === null) {
        this.campaignId = this.route.snapshot.params['campaignId'];
      }
      console.log('campaign id : ' + this.campaignId);
      this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination);
      this.loading = false;
    }
  }catch(error){ this.xtremandLogger.error(error);}
  }
  getTotalTimeSpentOfCampaigns(userId: number, campaignId:number) {
    try{
      this.loading = true;
      this.campaignService.getTotalTimeSpentofCamapaigns(userId, campaignId)
      .subscribe(data => {
        console.log(data);
        this.totalTimeSpent = data;   // data is coming as empty object ,, need to handle it
        this.loading = false;
      },
      error => console.log(error),
      () => { }
      );
    } catch (err) {  this.xtremandLogger.error(err); }
  }
  userWatchedviewsInfo(emailId: string) {
    try {
      emailId = emailId.substring(emailId.indexOf('<br/>'), emailId.length);
      emailId = emailId.substring(5);
    this.loading = true;
      if (emailId !== this.selectedRow.emailId) {
      this.userCampaignReport.emailOpenCount = 0;
      this.userCampaignReport.emailClickedCount = 0;
      this.userCampaignReport.totalUniqueWatchCount = 0;
      this.barChartCliked = true;

        this.selectedRow = this.campaignBarViews.find(function (obj) { return obj.emailId === emailId; });
        this.userTimeline(this.selectedRow);
        this.isTimeLineView = true;
    }
      this.loading = false;
    } catch (err) {
      this.xtremandLogger.error(err);
    }
  }

  getCampaignById(campaignId: number) {
   try{
    this.loading = true;
    const obj = { 'campaignId': campaignId }
    this.campaignService.getCampaignById(obj)
      .subscribe(
      data => {
        this.campaign = data;
        if(this.campaign.nurtureCampaign && this.campaign.userId!=this.loggedInUserId){
            this.isPartnerEnabledAnalyticsAccess = this.campaign.detailedAnalyticsShared;
            this.isNavigatedThroughAnalytics = true;
        }else{
            this.isNavigatedThroughAnalytics = false;
            this.isPartnerEnabledAnalyticsAccess = true;
        }
        this.campaingContactLists = data.userLists;
        console.log(this.campaingContactLists);
        this.isPartnerCampaign = this.campaign.channelCampaign? '(PARTNER)' : '';
        this.loading = false;
      },
      error => {
        console.log(error);
        error = error.json();
        this.customResponse = new CustomResponse('ERROR', error.message, true);
        this.loading = false;
      },
      () => {
        if (this.customResponse.responseType !== 'ERROR') {
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
          } else if (campaignType.includes('EVENT')) {
              this.campaignType = 'EVENT';
              this.campaign.selectedEmailTemplateId = this.campaign.emailTemplate.id;
              this.getEventCampaignByCampaignId(campaignId);
            } else {
            this.campaignType = 'EMAIL';
          }
        }
        this.loading = false;
      }
      )
    } catch(error){this.xtremandLogger.error(error); }
  }

  getSocialCampaignByCampaignId(campaignId: number) {
    try{
    this.loading = true;
      this.socialService.getSocialCampaignByCampaignId(campaignId)
      .subscribe(
      data => {
        this.socialStatus = data;
        this.loading = false;
      },
      error => this.xtremandLogger.error(error),
      () => { }
      )
    }catch(error){
      this.xtremandLogger.error('error'+error)
    }
  }
  
  getEventCampaignByCampaignId(campaignId: number) {
      try{
          this.loading = true;
            this.campaignService.getEventCampaignDetailsByCampaignId(campaignId)
            .subscribe(
            data => {
              console.log(data);
              this.campaignReport.totalYesCount = data.YES;
              this.campaignReport.totalMayBeCount = data.MAYBE;
              this.campaignReport.totalNoCount = data.NO;
              this.campaignReport.totalNotYetRespondedCount = data.notYetResponded;
              this.loading = false;
            },
            error => this.xtremandLogger.error(error),
            () => { }
            )
          }catch(error){
            this.xtremandLogger.error('error'+error)
          }
        }
        
  getRsvpDetails(responseType: any, detailType:any){
      try{
          this.loading = true;
          this.downloadTypeName = 'rsvp';
          this.rsvpResposeType = responseType;
            
          if(detailType === 'reDistribution'){
              this.campaignService.getRedistributionEventCampaignDetailAnalytics( this.campaign.campaignId, responseType, this.selectedRsvpPartnerId )
              .subscribe(
              data => {
                console.log(data);
                this.loading = false;
                this.rsvpDetailsList = data;
              },
              error => this.xtremandLogger.error(error),
              () => { }
              ) 
          }else{
          this.campaignService.getEventCampaignDetailAnalytics( this.campaign.campaignId, responseType )
            .subscribe(
            data => {
              console.log(data);
              this.loading = false;
              this.rsvpDetailsList = data;
            },
            error => this.xtremandLogger.error(error),
            () => { }
            )
          }
          }catch(error){
            this.xtremandLogger.error('error'+error)
          }
  }
  
  redistributionCampaignsDetails(campaignViews:any){
      try{
          this.loading = true;
          this.selectedRsvpPartnerId = campaignViews.userId;
         // this.downloadTypeName = 'rsvp';
            this.campaignService.getRestributionEventCampaignAnalytics( this.campaign.campaignId, campaignViews.userId )
            .subscribe(
            data => {
              console.log(data);
              this.campaignReport.redistributionTotalYesCount = data.YES;
              this.campaignReport.redistributionTotalMayBeCount = data.MAYBE;
              this.campaignReport.redistributionTotalNoCount = data.NO;
              this.campaignReport.redistributionTotalNotYetRespondedCount = data.notYetResponded;
              this.loading = false;
            },
            error => this.xtremandLogger.error(error),
            () => { }
            )
          }catch(error){
            this.xtremandLogger.error('error'+error)
          }
  }
  

  resetTopNavBarValue() {
    try{
    this.referenceService.isFromTopNavBar = false;
    this.isTimeLineView = !this.isTimeLineView;
    this.emailLogs = [];
    this.totalEmailLogs = [];
    this.userCampaignReport.emailOpenCount = 0;
    this.userCampaignReport.emailClickedCount = 0;
    this.userCampaignReport.totalUniqueWatchCount = 0;
    this.clearPaginationValues();
    }catch(error){
      this.xtremandLogger.error('error'+error)
    }
  }

  clearPaginationValues() {
    try{
    this.pagination.pageIndex = 1;
    this.pagination = new Pagination();
    this.barChartCliked = false;
    this.donultModelpopupTitle = '';
    this.emailLogPagination = new Pagination();
    this.emailActionListPagination = new Pagination();
    this.usersWatchListPagination = new Pagination();
    this.emailLogPagination.maxResults = 12;
    this.campaignViewsPagination.maxResults = 12;
    this.campaignViewsPagination.pageIndex = 1;
    this.emailActionListPagination.pageIndex = 1;
    this.emailActionListPagination.maxResults = 12;
    this.paginationType = 'campaignViews';
    }catch(error){
      this.xtremandLogger.error('error'+error)
    }
  }

  campaignViewsDonut(timePeriod: string) {
    try{
    this.loading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.paginationType = 'donutCampaign';
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
        this.totalCampaignViewsDonut(timePeriod,this.pagination.totalRecords);
        this.loading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
        $('#donutModelPopup').modal('show');
      },
      error => console.log(error),
      () => { });
    } catch(error){
        this.xtremandLogger.error('error'+error)
    }
  }

  totalCampaignViewsDonut(timePeriod: string, totalRecords: number) {
    try{
    this.loading = true;
    this.emailLogPagination.maxResults = totalRecords;
    this.downloadTypeName = 'donut';
    this.campaignService.donutCampaignInnerViews(this.campaignId, timePeriod, this.emailLogPagination).
      subscribe(
      (data: any) => {
        this.totalListOfemailLog = data;
        this.loading = false;
      },
      error => this.xtremandLogger.error(error),
      () => {this.xtremandLogger.log('total campaigns views donut method finished'); });
    } catch(error){ this.xtremandLogger.error('error'+error);}
  }

  emailActionTotalList(campaignId: number, actionType: string, totalRecords: number) {
    try{
    this.loading = true;
     this.emailLogPagination.maxResults = totalRecords;
    this.downloadTypeName = 'emailAction';
    this.campaignService.emailActionList(campaignId, actionType, this.emailLogPagination)
      .subscribe(
      data => {
        this.campaignReport.totalEmailActionList = data;
        this.campaignReport.emailActionType = actionType;
        this.loading =false;
      },
      error => console.log(error),
      () => console.log()
      )
    } catch(error){ this.xtremandLogger.error('error'+error);}
  }

  usersWatchTotalList(campaignId: number, totalRecords: number) {
    try{
     this.loading = true;
     this.userWatchedReportPagination.maxResults = totalRecords;
     this.downloadTypeName = 'usersWatchedList';
     this.campaignService.usersWatchList(campaignId, this.userWatchedReportPagination)
      .subscribe(
      data => {
        this.campaignReport.totalWatchedList = data.data;
        this.loading = false;
      },
      error => this.xtremandLogger.error(error),
      () => this.xtremandLogger.log('usersWatchTotalList method finished')
      )
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }

  listTotalCampaignViews(campaignId: number) {
    try{
      this.loading = true;
      this.downloadTypeName ='campaignViews';
      this.campaignTotalViewsPagination.maxResults = this.campaignReport.emailSentCount;
      this.campaignService.listCampaignViews(campaignId, this.campaignTotalViewsPagination)
      .subscribe(
      data => {
        this.campaignTotalViewsData = data.campaignviews;
        try {
          const self = this;
          this.selectedRow = this.campaignTotalViewsData.find(function (obj) { return obj.emailId === self.selectedRow.emailId; });
          this.loading = false;
        } catch (err) { console.log(err); }
      },
      error => console.log(error),
      () => console.log()
      );
    }catch(error){this.xtremandLogger.error('error'+error); }
  }

  getCampaignUsersWatchedTotalInfo(countryCode, totalRecord: number) {
    try{
    this.loading = true;
    this.downloadTypeName = 'worldMap';
    this.countryCode = countryCode.toUpperCase();
    this.campaignsWorldMapPagination.maxResults = totalRecord;
    this.campaignService.getCampaignUsersWatchedInfo(this.campaignId, this.countryCode, this.campaignsWorldMapPagination)
      .subscribe(
      (data: any) => {
        console.log(data);
        this.worldMapUserTotalData = data.data;
        this.loading = false;
      },
      error => this.xtremandLogger.error('error'+error),
      () => console.log('finished')
      );
    }catch(error){this.xtremandLogger.error('error'+error); }
  }

  downloadEmailLogs() {
    try{
    this.loading = true;
    if (this.downloadTypeName === 'donut') {
      this.logListName = 'Campaign_Views_Logs.csv';
      this.downloadCsvList = this.totalListOfemailLog;
    } else if (this.downloadTypeName === 'emailAction') {
        this.logListName = 'Email_Action_Logs.csv';
      this.downloadCsvList = this.campaignReport.totalEmailActionList;
    } else if (this.downloadTypeName === 'usersWatchedList') {
        this.logListName = 'Users_watched_Logs.csv';
      this.downloadCsvList = this.campaignReport.totalWatchedList;
    } else if (this.downloadTypeName === 'campaignViews') {
        this.logListName = 'Campaign_report_logs.csv';
      this.downloadCsvList = this.campaignTotalViewsData;
    } else if (this.downloadTypeName === 'worldMap') {
        this.logListName = 'World_Map_logs.csv';
      this.downloadCsvList = this.worldMapUserTotalData;
    } else if(this.downloadTypeName === 'rsvp'){
        this.logListName = 'People who says '+ this.rsvpResposeType +' log.csv';
        this.downloadCsvList = this.rsvpDetailsList;
    }
        

    this.downloadDataList.length = 0;
    for (let i = 0; i < this.downloadCsvList.length; i++) {
      let date = new Date(this.downloadCsvList[i].time);
      let startTime = new Date(this.downloadCsvList[i].startTime);
      let endTime = new Date(this.downloadCsvList[i].endTime);
      let sentTime = new Date(this.campaign.launchTime);
      let latestView = new Date(this.downloadCsvList[i].latestView);

      var object = {
        "First Name": this.downloadCsvList[i].firstName,
        "Last Name": this.downloadCsvList[i].lastName,
      }

      if (this.downloadTypeName === 'donut') {
        object["Email Id"] = this.downloadCsvList[i].emailId;
        object["Campaign Name"] = this.downloadCsvList[i].campaignName;
        object["Date and Time"] = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        object["Platform"] = this.downloadCsvList[i].os;
        object["Location"] = this.downloadCsvList[i].location;
      }

      if (this.downloadTypeName === 'campaignViews') {
        object["Email Id"] = this.downloadCsvList[i].emailId;
        object["Campaign Name"] = this.downloadCsvList[i].campaignName;
        object["Sent Time"] = sentTime.toDateString() + ' ' + sentTime.getHours() + ':' + sentTime.getMinutes() + ':' + sentTime.getSeconds();
        object["Latest View"] = latestView.toDateString() + ' ' + latestView.getHours() + ':' + latestView.getMinutes() + ':' + latestView.getSeconds();
      }

      if (this.downloadTypeName === 'usersWatchedList') {
        object["Email Id"] = this.downloadCsvList[i].emailId;
        object["START DURATION"] = startTime.toDateString() + ' ' + startTime.getHours() + ':' + startTime.getMinutes() + ':' + startTime.getSeconds();
        object["STOP DURATION"] = endTime.toDateString() + ' ' + endTime.getHours() + ':' + endTime.getMinutes() + ':' + endTime.getSeconds();
        object["IP ADDRESS"] = this.downloadCsvList[i].ipAddress;
        object["PLATFORM"] = this.downloadCsvList[i].os;
        object["STATE"] = this.downloadCsvList[i].state;
        object["COUNTRY"] = this.downloadCsvList[i].country;
      }

      if (this.downloadTypeName === 'emailAction') {
        object["Email Id"] = this.downloadCsvList[i].emailId;
        object["Date and Time"] = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      }

      if (this.downloadTypeName === 'worldMap') {
        object["Email Id"] = this.downloadCsvList[i].emailId;
        object["Date and Time"] = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        object["Device"] = this.downloadCsvList[i].deviceType;
        object["Location"] = this.downloadCsvList[i].location;
      }
      
      if (this.downloadTypeName === 'rsvp') {
          object["Email Id"] = this.downloadCsvList[i].emailId;
          object["Message"] = this.downloadCsvList[i].message;
      }
      
      this.downloadDataList.push(object);
    }

    this.referenceService.isDownloadCsvFile = true;
    this.loading = false;
    }catch(error){this.xtremandLogger.error('error'+error); }
  }

    showEmailTemplatePreview(emailTemplate:any){
        try{
        console.log(this.campaign);
        this.referenceService.previewEmailTemplate(emailTemplate, this.campaign);
        }catch(error){this.xtremandLogger.error(error);}
    }

    previewVideo(videoFile: any){
        try{
        this.loading = true;
        setTimeout(()=>{ this.loading = false; this.videoFile = videoFile; },600);
        }catch(error){ this.xtremandLogger.error(error);}
    }

    closeModal(event: any){
      console.log('closed modal'+event);
      this.videoFile = undefined;
    }
    showContactListModal(){
        this.loading = true;
        this.getListOfContacts(this.campaingContactLists[0].id);
    }
    getListOfContacts(id:number){
    try{
      this.contactListId = id;
     this.contactService.loadUsersOfContactList(id, this.pagination).subscribe(
       data => {
        this.campaingContactListValues = data.listOfUsers;
        this.loading = false;
        $("#show_contact-list-info").modal('show');
      },
      (error:any)=>{this.xtremandLogger.error('error'+error); })
    }catch(error) { this.xtremandLogger.error('error'+error);}
  }

  getSortedResult(campaignId: number,event:any){
    this.emailActionListPagination = this.utilService.sortOptionValues(event,this.emailActionListPagination);
    this.emailActionList(campaignId, this.campaignReport.emailActionType, this.emailActionListPagination);
  }

  listEmailLogsByCampaignIdUserIdActionType(emailLog: EmailLog, actionType: string) {
    debugger;
    this.campaignReport.emailLogs.forEach((element) => {
      if(element.userId !== emailLog.userId) {
          element.isExpand = false;
      }
    });
    emailLog.isExpand = !emailLog.isExpand;
    if (emailLog.emailLogHistory === undefined) {
      try {
        this.loading = true;
        this.campaignService.listEmailLogsByCampaignIdUserIdActionType(emailLog.campaignId, emailLog.userId, actionType)
          .subscribe(
          data => {
            emailLog.emailLogHistory = data;
            this.loading = false;
          },
          error => console.log(error),
          () => { }
          )
      } catch (error) {
        this.xtremandLogger.error('Error in listEmailLogsByCampaignIdUserIdActionType: ' + error);
      }
    }
  }

  ngOnInit() {
    try{
    this.mainLoader = true;
    this.paginationType = 'campaignViews';
    this.emailActionListPagination.pageIndex = 1;
    this.campaignId = this.route.snapshot.params['campaignId'];
    this.getCampaignById(this.campaignId);
    this.getEmailSentCount(this.campaignId);
    this.getEmailLogCountByCampaign(this.campaignId);
    this.pagination.pageIndex = 1;
    if (this.isTimeLineView === true) {
      this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination);
    }
    setTimeout(() => { this.mainLoader = false;}, 3000);
  }catch(error) { this.mainLoader = false; this.xtremandLogger.error('error'+error); }
  }
  ngOnDestroy(){
    this.paginationType = '';
    $('#worldMapModal').modal('hide');
    $('#email_template_preivew').modal('hide');
    $('#show_contact-list-info').modal('hide');
    $('#usersWatchListModal').modal('hide');
    $('#emailActionListModal').modal('hide');
    $('#emailSentListModal').modal('hide');
    $('#donutModelPopup').modal('hide');

  }
}
