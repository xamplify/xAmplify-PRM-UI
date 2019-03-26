import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Campaign } from '../models/campaign';
import { CampaignReport } from '../models/campaign-report';
import { EmailLog } from '../models/email-log';
import { Pagination } from '../../core/models/pagination';
import { SocialCampaign } from '../../social/models/social-campaign';
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
import { TwitterService } from '../../social/services/twitter.service';
import { ContactService } from '../../contacts/services/contact.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Tweet } from '../../social/models/tweet';
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
  isChannelCampaign: boolean;
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
  contactListInfoPagination: Pagination = new Pagination();
  emailActionListPagination: Pagination = new Pagination();
  usersWatchListPagination: Pagination = new Pagination();
  emailLogPagination: Pagination = new Pagination();
  campaignTotalViewsPagination: Pagination = new Pagination();
  campaignsWorldMapPagination: Pagination = new Pagination();
  userWatchedReportPagination: Pagination = new Pagination();
  rsvpDetailAnalyticsPagination: Pagination = new Pagination();
  sentEmailOpenPagination: Pagination = new Pagination();

  socialCampaign: SocialCampaign = new SocialCampaign();
  redistributedAccounts = new Set<number>();
  redistributedAccountsBySelectedUserId: Array<SocialStatus> = [];
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
  totalTimeSpent = "00:00:00";
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
  isDataShare = false;
  isPartnerEnabledAnalyticsAccess = false;
  isNavigatedThroughAnalytics = false;
  campaignRouter:any;
  loggedInUserId = 0;
  loading =false;
  mainLoader = false;
  logListName = "";
  selectedRsvpPartnerId = 0;
  showRsvpDetails = false;
  rsvpDetailsList: any;
  reDistributionRsvpDetails: any;
  rsvpResposeType = '';
  rsvpDetailType = '';
  isOpenNotificationModal = false;
  selectedEmailNotOpenUserId: any;
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  hasClientError = false;
  contactListDeleteError = false;
  sortByDropDown = [
                    { 'name': 'Sort By', 'value': '' },
                    { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
                    { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
                    { 'name': 'Time(ASC)', 'value': 'time-ASC' },
                    { 'name': 'Time(DESC)', 'value': 'time-DESC' }
                ];
  selectedSortedOption: any = this.sortByDropDown[this.sortByDropDown.length-1];
  tweets: Array<Tweet> = new Array<Tweet>();
  constructor(private route: ActivatedRoute, private campaignService: CampaignService, private utilService: UtilService, private socialService: SocialService,
    public authenticationService: AuthenticationService, public pagerService: PagerService, public pagination: Pagination,
    public referenceService: ReferenceService, public contactService: ContactService, public videoUtilService: VideoUtilService, public xtremandLogger:XtremandLogger, private twitterService: TwitterService) {
      try{
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
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }
  showTimeline() {
    this.isTimeLineView = !this.isTimeLineView;
  }

  listCampaignViews(campaignId: number, pagination: Pagination) {
    try{
    this.loading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.listTotalCampaignViews(campaignId);
    if(!this.campaign.detailedAnalyticsShared && this.campaign.dataShare && !this.campaign.parentCampaignId){
        pagination.campaignId = campaignId;
        pagination.campaignType = "VIDEO";
        this.campaignService.listCampaignInteractiveViews(pagination)
         .subscribe(data => {
           this.listCampaignViewsDataInsert(data);
         },
         error => console.log(error),
         () => console.log('listCampaignInteractiveViews(): called') )
    } else{
       this.campaignService.listCampaignViews(campaignId, pagination, this.isChannelCampaign)
         .subscribe(data => {
            this.listCampaignViewsDataInsert(data.campaignviews);
           },
          error => console.log(error),
          () => console.log('listCampaignViews(); called') )
       }
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }

  listCampaignViewsDataInsert(campaignviews: any){
      this.campaignViews= campaignviews;
      this.campaignViews.forEach((element, index) => {
        if(element.latestView){ element.latestView = new Date(element.latestView); }
      });
      const views = [];
      for (let i = 0; i < this.campaignViews.length; i++) {
        views.push(this.campaignViews[i].viewsCount)
      }
      this.maxViewsValue = Math.max.apply(null, views);
      if(this.paginationType === 'campaignViews') {
        this.campaignViewsPagination.totalRecords = this.campaignReport.emailSentCount;
        this.campaignViewsPagination = this.pagerService.getPagedItems(this.campaignViewsPagination, this.campaignViews);
      } else if(this.paginationType === 'sentEmailData'){
        this.sentEmailOpenPagination.totalRecords = this.campaignReport.emailSentCount;
        this.sentEmailOpenPagination = this.pagerService.getPagedItems(this.sentEmailOpenPagination, this.campaignViews);
      }
      this.loading = false;
      this.referenceService.loading(this.httpRequestLoader, false);
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
    let newChart = Highcharts.chart('campaign-views-barchart', {
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
    newChart.xAxis[0].labelGroup.element.childNodes.forEach(function(label)
    {
      label.style.cursor = "pointer";
      label.onclick = function(){
        console.log(label);
        const text = this.textContent;
        for(let i=0; i<self.campaignBarViews.length; i++){
          let email = text;
          if(email.indexOf(self.campaignBarViews[i].emailId)){
            email = email.replace(self.campaignBarViews[i].firstName, '');
            email = email.replace(self.campaignBarViews[i].lastName, '');
            email = email.replace(/\s+/, "");
            if(self.campaignBarViews[i].emailId === email){ self.userWatchedviewsInfo(email); break; }
          }
        }
       }
    });
    this.loading = false;
  }
  getCampaignUserViewsCountBarCharts(campaignId: number, pagination: Pagination) {
    try{
    this.loading = true;
    this.paginationType = 'viewsBarChart';
    this.campaignService.listCampaignViews(campaignId, pagination, this.isChannelCampaign)
      .subscribe(
      data => {
        console.log(data);
        this.campaignBarViews = data.campaignviews;
        const names = [];
        const views = [];
        for (let i = 0; i < this.campaignBarViews.length; i++) {
          const firstName = this.campaignBarViews[i].firstName ? this.campaignBarViews[i].firstName : "";
          const lastName =  this.campaignBarViews[i].lastName ? this.campaignBarViews[i].lastName : "";
          names.push( "<b>"+firstName + " "+ lastName + '</b><br/>' + this.campaignBarViews[i].emailId);
          views.push(this.campaignBarViews[i].viewsCount)
        }
        this.maxViewsValue = Math.max.apply(null, views);
        this.pagination.totalRecords = this.campaignReport.emailSentCount;
        this.pagination = this.pagerService.getPagedItems(this.pagination, this.campaignBarViews);
        console.log(this.pagination);
        this.campaignViewsCountBarchart(names, views);
        this.referenceService.goToTop();
        this.loading = false;
      },
      error => console.log(error),
      () => console.log()
      )
    }catch(error){ this.hasClientError = true;this.xtremandLogger.error('error'+error);}
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
    }catch(error){ this.hasClientError = true;this.xtremandLogger.error('error'+error);}
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
        data.data.forEach((element, index) => {
          element.startTime = new Date(element.startTimeUtcString);
          element.endTime = new Date(element.endTimeUtcString);
        });
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
  sentEmailModal(){
    this.downloadTypeName = 'campaignViews';
    this.paginationType = 'sentEmailData';
    this.sentEmailOpenPagination = new Pagination();
    this.listCampaignViews(this.campaign.campaignId, this.sentEmailOpenPagination);
    $('#emailSentListModal').modal();
  }
  
  resetRsvpPagination(){
      this.rsvpDetailAnalyticsPagination = new Pagination();
  }

  setPage(event: any) {
    try{
    this.paginationType = event.type;
    if (event.type === 'campaignViews') {
        this.campaignViewsPagination.pageIndex = event.page;
        this.listCampaignViews(this.campaign.campaignId, this.campaignViewsPagination);
    } else if (event.type === 'sentEmailData') {
        this.sentEmailOpenPagination.pageIndex = event.page;
        this.listCampaignViews(this.campaign.campaignId, this.sentEmailOpenPagination);
    } else if (event.type === 'emailAction') {
        this.emailActionListPagination.pageIndex = event.page;
        if (this.campaignReport.emailActionType === 'open' || this.campaignReport.emailActionType === 'click') {
            this.emailActionList(this.campaign.campaignId, this.campaignReport.emailActionType, this.emailActionListPagination);
        }
    } else if (event.type === 'usersWatch') {
        this.usersWatchListPagination.pageIndex = event.page;
        this.usersWatchList(this.campaign.campaignId, this.usersWatchListPagination);
    } else if (event.type === 'email open') {
        this.rsvpDetailAnalyticsPagination.pageIndex = event.page;
        this.getRsvpEmailOpenDetails();
    }else if (event.type === 'email not open') {
        this.rsvpDetailAnalyticsPagination.pageIndex = event.page;
        this.getRsvpEmailNotOpenDetails();
    }else if (event.type === 'invities') {
        this.rsvpDetailAnalyticsPagination.pageIndex = event.page;
        this.getRsvpInvitiesDetails();
    } else if (event.type === 'YES' || event.type === 'NO' || event.type === 'MAYBE' || event.type === 'NOTYET') {
        this.rsvpDetailAnalyticsPagination.pageIndex = event.page;
        this.getRsvpDetails(this.rsvpResposeType);
    } else if (event.type === 'contactListInfo') {
        this.contactListInfoPagination.pageIndex = event.page;
        this.getListOfContacts(this.contactListId);
    } else {
        this.pagination.pageIndex = event.page;
        this.callPaginationValues(event.type);
    }
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }
  
  
  paginationDropdown(event: Pagination){
    try{
    if (this.paginationType === 'campaignViews') {
      this.campaignViewsPagination = event;
      this.listCampaignViews(this.campaign.campaignId, event);
    } else if (this.paginationType === 'sentEmailData') {
      this.sentEmailOpenPagination = event;
      this.listCampaignViews(this.campaign.campaignId, event);
    } else if (this.paginationType === 'emailAction') {
      this.emailActionListPagination = event;
       if (this.campaignReport.emailActionType === 'open' || this.campaignReport.emailActionType === 'click') {
        this.emailActionList(this.campaign.campaignId, this.campaignReport.emailActionType, this.emailActionListPagination);
       }
    } else if (this.paginationType === 'usersWatch') {
      this.usersWatchListPagination = event;
      this.usersWatchList(this.campaign.campaignId, this.usersWatchListPagination);
    }else if (this.paginationType === 'email open') {
        this.rsvpDetailAnalyticsPagination = event;
        this.getRsvpEmailOpenDetails();
    }else if (this.paginationType === 'email not open') {
        this.rsvpDetailAnalyticsPagination = event;
        this.getRsvpEmailNotOpenDetails();
    }else if (this.paginationType === 'invities') {
        this.rsvpDetailAnalyticsPagination = event;
        this.getRsvpInvitiesDetails();
    } else if (this.paginationType === 'YES' || this.paginationType === 'NO' || this.paginationType === 'MAYBE' || this.paginationType === 'NOTYET') {
        this.rsvpDetailAnalyticsPagination = event;
        this.getRsvpDetails(this.rsvpResposeType);
    } else if (this.paginationType === 'rsvpDetailPagination') {
        this.rsvpDetailAnalyticsPagination = event;
        this.getRsvpDetails(this.rsvpResposeType);
    } else {
        this.pagination = event;
        this.callPaginationValues(this.paginationType);
    }
    }catch(error){ this.xtremandLogger.error('error'+error);}
   }
  paginationContacts(pagination:Pagination){
    this.contactListInfoPagination = pagination;
    this.getListOfContacts(this.contactListId);
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
       .subscribe(data => {
         data.forEach((element, index) => { element.time = new Date(element.utcTimeString);});
        this.campaignReport.emailLogs = data;
        this.campaignReport.emailActionType = actionType;
        $('#emailActionListModal').modal();
        if (actionType === 'open') {
            if ( this.sortByDropDown.length === 5 ) {
                this.sortByDropDown.push( { 'name': 'Subject(ASC)', 'value': 'subject-ASC' });
                this.sortByDropDown.push( { 'name': 'Subject(DESC)', 'value': 'subject-DESC' });
            }
              this.emailActionListPagination.totalRecords = this.campaignReport.emailOpenCount;
        } else if (actionType === 'click') {
            this.sortByDropDown = this.sortByDropDown.filter(function(el) { return el.name != "Subject(ASC)"; });
            this.sortByDropDown = this.sortByDropDown.filter(function(el) { return el.name != "Subject(DESC)"; });
            this.emailActionListPagination.totalRecords = this.campaignReport.emailClickedCount;
        }
        this.emailActionListPagination = this.pagerService.getPagedItems(this.emailActionListPagination, this.campaignReport.emailLogs);
        this.emailActionTotalList(campaignId, actionType, this.emailActionListPagination.totalRecords);
        this.loading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      error => console.log(error),
      () => console.log('emailActionList() completed')  )
    }catch(error) {this.xtremandLogger.error('Error in analytics page emails sent'+error); }
  }

  listEmailLogsByCampaignAndUser(campaignId: number, userId: number) {
    try{
      this.loading = true;
      this.campaignService.listEmailLogsByCampaignAndUser(campaignId, userId)
       .subscribe( data => {
        data.forEach((element, index) => {
         if(element.time) { element.time = new Date(element.utcTimeString); }});
        this.emailLogs = data;
        this.loading =false;
        console.log(data);
       },
      error => console.log(error),
      () => { this.count(); } )
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
        }
      }
    }
      this.loading = false;
  } catch(error){this.xtremandLogger.error('Error in count'+error); }
  }

  userTimeline(campaignViews: any) {
    try{
    this.loading = true;
    this.redistributedAccountsBySelectedUserId = [];
     this.listEmailLogsByCampaignAndUser(campaignViews.campaignId, campaignViews.userId);
    this.getTotalTimeSpentOfCampaigns(campaignViews.userId, campaignViews.campaignId);
    if(this.campaignType==='EVENT' && this.isChannelCampaign){
        this.redistributionCampaignsDetails(campaignViews);
    }
    if(this.campaignType==='SOCIAL'){
      this.socialCampaign.socialStatusList.forEach(
        data => data.socialStatusList.forEach(data => {
          if(data.userId === campaignViews.userId) { this.redistributedAccountsBySelectedUserId.push(data); }})
      )
    }
    this.selectedRow = campaignViews;
    this.isTimeLineView = !this.isTimeLineView;
    this.userCampaignReport.totalUniqueWatchCount = campaignViews.viewsCount;
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
      if(emailId.includes('<br/>')){
      emailId = emailId.substring(emailId.indexOf('<br/>'), emailId.length);
      emailId = emailId.substring(5); }
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
        this.isChannelCampaign = data.channelCampaign;
        if(this.campaign.nurtureCampaign && this.campaign.userId!=this.loggedInUserId){
            this.isPartnerEnabledAnalyticsAccess = this.campaign.detailedAnalyticsShared;
            this.isDataShare = this.campaign.dataShare;
            this.isNavigatedThroughAnalytics = true;
            if(data.campaignType === 'EVENT'){
                this.isDataShare = true;
                this.isPartnerEnabledAnalyticsAccess = true;
            }
        }else{
            this.isNavigatedThroughAnalytics = false;
            this.isPartnerEnabledAnalyticsAccess = true;
            this.isDataShare = true;
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
        this.getEmailSentCount(this.campaignId);
        this.loading = false;
        this.getEmailSentCount(this.campaignId);
      }
      )
    } catch(error){this.hasClientError = true;this.xtremandLogger.error(error); }
  }

  getSocialCampaignByCampaignId(campaignId: number) {
    try{
    this.loading = true;
      this.socialService.getSocialCampaignByCampaignId(campaignId)
      .subscribe(
      data => {
        this.socialCampaign = data;
        this.loading = false;
        this.socialCampaign.socialStatusList.forEach(data => {
          data.socialStatusList.forEach( data => this.redistributedAccounts.add(data.userId))
        })
      },
      error => this.xtremandLogger.error(error),
      () => {}
      )
    }catch(error){
      this.xtremandLogger.error('error'+error)
    }
  }

  getEventCampaignByCampaignId(campaignId: number) {
      try{
          this.loading = true;
            this.campaignService.getEventCampaignDetailsByCampaignId(campaignId, this.isChannelCampaign)
            .subscribe(
            data => {
              console.log(data);
              this.campaignReport.totalYesCount = data.YES;
              this.campaignReport.totalMayBeCount = data.MAYBE;
              this.campaignReport.totalNoCount = data.NO;
              this.campaignReport.totalNotYetRespondedCount = data.notYetResponded;
              this.campaignReport.totalEmailOpenCount = data.emailOpenedCount;
              this.campaignReport.totalAdditionalCount = data.additionalCount;
              this.campaignReport.totalInvitiesCount = data.totalInvities;
              this.getPartnersResponeCount(campaignId);
              this.loading = false;
            },
            error => this.xtremandLogger.error(error),
            () => { }
            )
          }catch(error){
            this.xtremandLogger.error('error'+error)
          }
        }

  getPartnersResponeCount(campaignId: number) {
      try{
            this.campaignService.getEventCampaignDetailsByCampaignId(campaignId, false)
            .subscribe(
            data => {
              console.log(data);
              this.campaignReport.partnersYesCount = data.YES;
              this.campaignReport.partnersMayBeCount = data.MAYBE;
              this.campaignReport.partnersNoCount = data.NO;
              this.campaignReport.partnersTotalInvitiesCount = data.totalInvities;
              this.campaignReport.partnersEmailOpenedCount = data.emailOpenedCount;
              this.campaignReport.partnersNotYetRespondedCount = data.notYetResponded;
              this.campaignReport.additionalCount = data.additionalCount;
              this.loading = false;
            },
            error => this.xtremandLogger.error(error),
            () => { }
            )
          }catch(error){
            this.xtremandLogger.error('error'+error)
          }
        }



  getRsvpInvitiesDetails(){
      try{
      this.loading = true;
      this.referenceService.detailViewIsLoading = true;
      this.downloadTypeName = 'rsvp';
      this.rsvpResposeType = "invities";
      this.paginationType = "invities";
      //this.rsvpDetailAnalyticsPagination = new Pagination();
      if(this.rsvpDetailType === 'reDistribution'){
          this.campaignService.getEventCampaignRedistributionInvitiesDetails( this.campaign.campaignId, this.campaignReport.selectedPartnerUserId, this.rsvpDetailAnalyticsPagination )
          .subscribe(
          data => {
            console.log(data);
            this.loading = false;
            this.referenceService.detailViewIsLoading = false;
            this.rsvpDetailsList = data.listOfUsers;
            this.rsvpDetailAnalyticsPagination.totalRecords = data.totalRecords;
            this.rsvpDetailAnalyticsPagination = this.pagerService.getPagedItems(this.rsvpDetailAnalyticsPagination, data.listOfUsers);
          },
          error => this.xtremandLogger.error(error),
          () => { }
          )
      }else if(this.rsvpDetailType === 'partnerRsvp'){
          this.campaignService.getEventCampaignPartnerInvitiesDetails( this.campaign.campaignId,this.rsvpDetailAnalyticsPagination )
          .subscribe(
          data => {
            console.log(data);
            this.loading = false;
            this.referenceService.detailViewIsLoading = false;
            this.rsvpDetailsList = data.listOfUsers;
            this.rsvpDetailAnalyticsPagination.totalRecords = data.totalRecords;
            this.rsvpDetailAnalyticsPagination = this.pagerService.getPagedItems(this.rsvpDetailAnalyticsPagination, data.listOfUsers);
          },
          error => this.xtremandLogger.error(error),
          () => { }
          )
      }
      else{
          this.showRsvpDetails = true;
          this.campaignService.getEventCampaignTotalInvitiesDetails( this.campaign.campaignId, this.rsvpDetailAnalyticsPagination )
          .subscribe(
          data => {
            console.log(data);
            this.loading = false;
            this.referenceService.detailViewIsLoading = false;
            this.rsvpDetailsList = data.listOfUsers;
            this.rsvpDetailAnalyticsPagination.totalRecords = data.totalRecords;
            this.rsvpDetailAnalyticsPagination = this.pagerService.getPagedItems(this.rsvpDetailAnalyticsPagination, data.listOfUsers);
          },
          error => this.xtremandLogger.error(error),
          () => { }
          )
      }
      }catch(error){
        this.xtremandLogger.error('error'+error)
   }
  }



  getRsvpEmailOpenDetails(){
      try{
      this.loading = true;
      this.referenceService.detailViewIsLoading = true;
      this.downloadTypeName = 'rsvp';
      //this.rsvpDetailAnalyticsPagination = new Pagination();
      this.rsvpResposeType = "email open";
      this.paginationType = "email open";
     // this.emailOpenSelected = 'email open';
      if(this.rsvpDetailType === 'reDistribution'){
          this.campaignService.getEventCampaignRedistributionEmailOpenDetails( this.campaign.campaignId, this.campaignReport.selectedPartnerUserId, this.rsvpDetailAnalyticsPagination )
          .subscribe(
          data => {
            console.log(data);
            this.emailOpenDataStore(data);
          },
          error => this.xtremandLogger.error(error),
          () => { } );
      }else if(this.rsvpDetailType === 'partnerRsvp'){
          this.campaignService.getEventCampaignEmailOpenDetails( this.campaign.campaignId, false, this.rsvpDetailAnalyticsPagination )
          .subscribe(
           data => {
              console.log(data);
              this.emailOpenDataStore(data);
           },
          error => this.xtremandLogger.error(error),
          () => { } );
      }
      else{
          this.showRsvpDetails = true;
          this.campaignService.getEventCampaignEmailOpenDetails( this.campaign.campaignId, this.isChannelCampaign, this.rsvpDetailAnalyticsPagination )
          .subscribe(
          data => {
            console.log(data);
            this.emailOpenDataStore(data);
          },
          error => this.xtremandLogger.error(error),
          () => { } );
      }
      }catch(error){
        this.xtremandLogger.error('error'+error)
   }
  }

  emailOpenDataStore(data:any){
    this.loading = false;
    data.data.forEach((element, index) => { element.time = new Date(element.utcTimeString);});
    this.referenceService.detailViewIsLoading = false;
    this.rsvpDetailsList = data.data;
    this.rsvpDetailAnalyticsPagination.totalRecords = data.totalRecords;
    this.rsvpDetailAnalyticsPagination = this.pagerService.getPagedItems(this.rsvpDetailAnalyticsPagination, data.data);
  }

  getRsvpEmailNotOpenDetails(){
      try{
      this.loading = true;
      this.referenceService.detailViewIsLoading = true;
      this.downloadTypeName = 'rsvp';
      //this.rsvpDetailAnalyticsPagination = new Pagination();
      this.rsvpResposeType = "email not open";
      this.paginationType = "email not open";
      if(this.rsvpDetailType === 'reDistribution'){
          this.campaignService.getEventCampaignRedistributionEmailNotOpenDetails( this.campaign.campaignId, this.campaignReport.selectedPartnerUserId, this.rsvpDetailAnalyticsPagination )
          .subscribe(
          data => {
            console.log(data);
            this.loading = false;
            this.referenceService.detailViewIsLoading = false;
            this.rsvpDetailsList = data.data;
            this.rsvpDetailAnalyticsPagination.totalRecords = data.totalRecords;
            this.rsvpDetailAnalyticsPagination = this.pagerService.getPagedItems(this.rsvpDetailAnalyticsPagination, data.data);
          },
          error => this.xtremandLogger.error(error),
          () => { }
          )
      }else if(this.rsvpDetailType === 'partnerRsvp'){
          this.campaignService.getEventCampaignEmailNotOpenDetails( this.campaign.campaignId, false, this.rsvpDetailAnalyticsPagination )
          .subscribe(
          data => {
            console.log(data);
            this.loading = false;
            this.referenceService.detailViewIsLoading = false;
            this.rsvpDetailsList = data.data;
            this.rsvpDetailAnalyticsPagination.totalRecords = data.totalRecords;
            this.rsvpDetailAnalyticsPagination = this.pagerService.getPagedItems(this.rsvpDetailAnalyticsPagination, data.data);
          },
          error => this.xtremandLogger.error(error),
          () => { }
          )
      }
      else{
          this.showRsvpDetails = true;
          this.campaignService.getEventCampaignEmailNotOpenDetails( this.campaign.campaignId, this.isChannelCampaign, this.rsvpDetailAnalyticsPagination )
          .subscribe(
          data => {
            console.log(data);
            this.loading = false;
            this.referenceService.detailViewIsLoading = false;
            this.rsvpDetailsList = data.data;
            this.rsvpDetailAnalyticsPagination.totalRecords = data.totalRecords;
            this.rsvpDetailAnalyticsPagination = this.pagerService.getPagedItems(this.rsvpDetailAnalyticsPagination, data.data);
          },
          error => this.xtremandLogger.error(error),
          () => { }
          )
      }
      }catch(error){
        this.xtremandLogger.error('error'+error)
   }
  }



  getPartnerCampaingRsvpDetails(){
      this.campaignReport.redistributionTotalYesCount = this.campaignReport.partnersYesCount;
      this.campaignReport.redistributionTotalMayBeCount = this.campaignReport.partnersMayBeCount;
      this.campaignReport.redistributionTotalNoCount = this.campaignReport.partnersNoCount;
      this.campaignReport.redistributionTotalNotYetRespondedCount = this.campaignReport.partnersNotYetRespondedCount;
      this.campaignReport.redistributionTotalEmailOpenCount = this.campaignReport.partnersEmailOpenedCount;
      this.campaignReport.redistributionTotalInvitiesCount = this.campaignReport.partnersTotalInvitiesCount;
      this.campaignReport.redistributionTotalAdditionalCount = this.campaignReport.additionalCount;
      this.isTimeLineView = true;
      this.rsvpDetailType = 'partnerRsvp';
      this.getRsvpDetails("YES");
  }

  getRsvpDetails(responseType: any){
      try{
          this.loading = true;
          this.referenceService.detailViewIsLoading = true;
          this.downloadTypeName = 'rsvp';
          this.paginationType = responseType;
          this.rsvpResposeType = responseType;
          if(this.rsvpDetailType === 'reDistribution'){
              this.campaignService.getRedistributionEventCampaignDetailAnalytics( this.campaign.campaignId, responseType, this.selectedRsvpPartnerId, this.isChannelCampaign, this.rsvpDetailAnalyticsPagination )
              .subscribe(
              data => {
                console.log(data);
                this.loading = false;
                this.referenceService.detailViewIsLoading = false;
                this.rsvpDetailsList = data.data;
                this.rsvpDetailAnalyticsPagination.totalRecords = data.totalRecords;
                this.rsvpDetailAnalyticsPagination = this.pagerService.getPagedItems(this.rsvpDetailAnalyticsPagination, data.data);
              },
              error => this.xtremandLogger.error(error),
              () => { }
              )
          }else if(this.rsvpDetailType === 'partnerRsvp'){
              this.campaignService.getEventCampaignDetailAnalytics( this.campaign.campaignId, responseType, false, this.rsvpDetailAnalyticsPagination )
              .subscribe(
              data => {
                console.log(data);
                this.loading = false;
                this.referenceService.detailViewIsLoading = false;
                this.rsvpDetailsList = data.data;
                this.rsvpDetailAnalyticsPagination.totalRecords = data.totalRecords;
                this.rsvpDetailAnalyticsPagination = this.pagerService.getPagedItems(this.rsvpDetailAnalyticsPagination, data.data);
              },
              error => this.xtremandLogger.error(error),
              () => { }
              )
          }else{
              this.showRsvpDetails = true;
              this.campaignService.getEventCampaignDetailAnalytics( this.campaign.campaignId, responseType, this.isChannelCampaign, this.rsvpDetailAnalyticsPagination )
            .subscribe(
            data => {
              console.log(data);
              this.loading = false;
              this.referenceService.detailViewIsLoading = false;
              this.rsvpDetailsList = data.data;
              this.rsvpDetailAnalyticsPagination.totalRecords = data.totalRecords;
              this.rsvpDetailAnalyticsPagination = this.pagerService.getPagedItems(this.rsvpDetailAnalyticsPagination, data.data);
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

          if(!campaignViews.firstName){
              campaignViews.firstName = "";
          }

          if(!campaignViews.lastName){
              campaignViews.lastName = "";
          }

          this.campaignReport.selectedPartnerFirstName = campaignViews.firstName + " " + campaignViews.lastName;
          //this.campaignReport.selectedPartnerLastName = campaignViews.lastName;
          this.campaignReport.selectedPartnerEmailId = campaignViews.emailId;
          this.campaignReport.selectedPartnerUserId = campaignViews.userId;


         // this.downloadTypeName = 'rsvp';
            this.campaignService.getRestributionEventCampaignAnalytics( this.campaign.campaignId, campaignViews.userId )
            .subscribe(
            data => {
              console.log(data);
              this.campaignReport.redistributionTotalYesCount = data.YES;
              this.campaignReport.redistributionTotalMayBeCount = data.MAYBE;
              this.campaignReport.redistributionTotalNoCount = data.NO;
              this.campaignReport.redistributionTotalNotYetRespondedCount = data.notYetResponded;
              this.campaignReport.redistributionTotalEmailOpenCount = data.emailOpenedCount;
              this.campaignReport.redistributionTotalInvitiesCount = campaignViews.rsvpMap.totalInvities;
              this.campaignReport.redistributionTotalAdditionalCount = data.additionalCount;
              this.rsvpDetailType = 'reDistribution';
              this.getRsvpDetails('YES');
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
    this.contactListInfoPagination = new Pagination();
    this.contactListInfoPagination.pageIndex = 1;
    this.contactListInfoPagination.maxResults = 12;
    this.downloadTypeName = this.paginationType = 'campaignViews';
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
        data.forEach((element, index) => { element.time = new Date(element.time);});
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
      //this.loading = true;
      this.downloadTypeName ='campaignViews';
      this.campaignTotalViewsPagination.maxResults = this.campaignReport.emailSentCount;
      this.campaignService.listCampaignViews(campaignId, this.campaignTotalViewsPagination,  this.isChannelCampaign)
      .subscribe(
      data => {
        this.campaignTotalViewsData = data.campaignviews;
       /* try {
          const self = this;
          this.selectedRow = this.campaignTotalViewsData.find(function (obj) { return obj.emailId === self.selectedRow.emailId; });
          this.loading = false;
        } catch (err) { console.log(err); }*/
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
        if(this.rsvpResposeType === 'email open'){
            this.logListName = 'People who opened email log.csv';
        }else{
        this.logListName = this.rsvpResposeType +' RSVPs.csv';
        if(this.rsvpResposeType === "NOTYET"){
            this.logListName = 'Have Not RSVPed Yet log.csv';
        }
        }
        this.downloadCsvList = this.rsvpDetailsList;
    }


    this.downloadDataList.length = 0;
    for (let i = 0; i < this.downloadCsvList.length; i++) {
      let date = new Date(this.downloadCsvList[i].time);
      let startTime = new Date(this.downloadCsvList[i].startTime);
      let endTime = new Date(this.downloadCsvList[i].endTime);
      let sentTime = new Date(this.campaign.launchTime);
      let latestView = new Date(this.downloadCsvList[i].latestView);
      let responseTime = new Date(this.downloadCsvList[i].responseTime);

      var object = {
        "First Name": this.downloadCsvList[i].firstName,
        "Last Name": this.downloadCsvList[i].lastName,
        "Email Id": this.downloadCsvList[i].emailId,
        "Company Name": this.downloadCsvList[i].companyName,
      }

      if (this.downloadTypeName === 'donut') {
        object["Campaign Name"] = this.downloadCsvList[i].campaignName;
        let hours = this.referenceService.formatAMPM(date);
        object["Date and Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
        object["Platform"] = this.downloadCsvList[i].os;
        object["Location"] = this.downloadCsvList[i].location;
      }

      if (this.downloadTypeName === 'campaignViews') {
        object["Campaign Name"] = this.downloadCsvList[i].campaignName;
        if(this.campaignType === 'EVENT'){
            if(this.isChannelCampaign){
            object["Invites"] = this.downloadCsvList[i].rsvpMap.totalInvities;
            object["Opened"] = this.downloadCsvList[i].rsvpMap.emailOpenedCount;
            object["Yes"] = this.downloadCsvList[i].rsvpMap.YES;
            object["No"] = this.downloadCsvList[i].rsvpMap.NO;
            object["Maybe"] = this.downloadCsvList[i].rsvpMap.MAYBE;
            object["Not Yet"] = this.downloadCsvList[i].rsvpMap.notYetResponded;
            object["Total Guests"] = this.downloadCsvList[i].rsvpMap.additionalCount;
            }else{
                object["Response Type"] = this.downloadCsvList[i].rsvpMap.responseType;
                object["Total Guests"] = this.downloadCsvList[i].rsvpMap.additionalCount;
            }
        }else{
         let hours = this.referenceService.formatAMPM(sentTime);
        object["Sent Time"] = sentTime.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
        let lastviewHours = this.referenceService.formatAMPM(latestView);
        object["Latest View"] = latestView.toDateString().split(' ').slice(1).join(' ') + ' ' + lastviewHours;
        }
        }

      if (this.downloadTypeName === 'usersWatchedList') {
        let srtHours = this.referenceService.formatAMPM(startTime);
        object["START DURATION"] = startTime.toDateString().split(' ').slice(1).join(' ') + ' ' + srtHours;
        let endHours = this.referenceService.formatAMPM(endTime);
        object["STOP DURATION"] = endTime.toDateString().split(' ').slice(1).join(' ') + ' ' + endHours;
        /*object["IP ADDRESS"] = this.downloadCsvList[i].ipAddress;*/
        object["PLATFORM"] = this.downloadCsvList[i].os[0].toUpperCase() + this.downloadCsvList[i].os.substr(1).toLowerCase();
        object["STATE"] = this.downloadCsvList[i].state;
        object["COUNTRY"] = this.downloadCsvList[i].country;
      }

      if ( this.downloadTypeName === 'emailAction' ) {
          if ( this.campaignReport.emailActionType === 'click' ) {
              if ( this.downloadCsvList[i].url ) {
                  object["Url"] = this.downloadCsvList[i].url;
              } else {
                  object["Url"] = "Clicked on the video thumbnail";
              }
          } else {
              object["Email subject"] = this.downloadCsvList[i].subject;
          }
          let hours = this.referenceService.formatAMPM(date);
          object["Date and Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
      }

      if (this.downloadTypeName === 'worldMap') {
        let hours = this.referenceService.formatAMPM(date);
        object["Date and Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
        object["Device"] = this.downloadCsvList[i].deviceType;
        object["Location"] = this.downloadCsvList[i].location;
      }

      if (this.downloadTypeName === 'rsvp') {
          if(this.rsvpResposeType === 'email open'){
              object["Campaign Name"] = this.downloadCsvList[i].campaignName;
              object["Subject"] = this.downloadCsvList[i].subject;
              let hours = this.referenceService.formatAMPM(date);
              object["Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
          }else{
              if ( this.paginationType != 'invities' && this.paginationType != 'NOTYET' && this.paginationType != 'email not open' ) {
                  object["Message"] = this.downloadCsvList[i].message;
                  let hours = this.referenceService.formatAMPM( responseTime );
                  object["Most recent"] = responseTime.toDateString().split( ' ' ).slice( 1 ).join( ' ' ) + ' ' + hours;
                  if ( this.paginationType === 'YES' ){
                      object["Guests"] = this.downloadCsvList[i].additionalCount;
                  }
              }
          }
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
        if ( this.campaingContactLists) {
            this.loading = true;
            this.getListOfContacts( this.campaingContactLists[0].id );
        }else{
            this.contactListDeleteError = true;
        }
    }
    getListOfContacts(id:number){
        try{
         this.contactListId = id;
         this.campaignService.loadUsersOfContactList(id,this.campaignId, this.contactListInfoPagination).subscribe(
           data => {
            this.campaingContactListValues = data.listOfUsers;
            this.loading = false;
            this.contactListInfoPagination.totalRecords = data.totalRecords;
            this.contactListInfoPagination = this.pagerService.getPagedItems(this.contactListInfoPagination, this.campaingContactListValues);
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


  sendEmailNotOpenReminder(details: any){
      this.isOpenNotificationModal = true;
      this.selectedEmailNotOpenUserId = details.userId;
    }

    emailNotOpenReminderDate(event: any){
        this.isOpenNotificationModal = false;
        if(event ===  "Success"){
            this.customResponse = new CustomResponse('SUCCESS',"Reminder has been sent successfully", true);
           }
    }

  ngOnInit() {
    try{
    this.mainLoader = true;
    this.downloadTypeName = this.paginationType = 'campaignViews';
    this.emailActionListPagination.pageIndex = 1;
    this.campaignId = this.route.snapshot.params['campaignId'];
    this.getCampaignById(this.campaignId);
    this.getEmailLogCountByCampaign(this.campaignId);
    this.pagination.pageIndex = 1;
    if (this.isTimeLineView === true) {
      this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination);
    }
    setTimeout(() => { this.mainLoader = false;}, 3000);
  }catch(error) {this.hasClientError = true;this.mainLoader = false; this.xtremandLogger.error('error'+error); }
  }
  ngOnDestroy(){
    this.paginationType = '';
    this.contactListDeleteError = false;
    $('#worldMapModal').modal('hide');
    $('#email_template_preivew').modal('hide');
    $('#show_contact-list-info').modal('hide');
    $('#usersWatchListModal').modal('hide');
    $('#emailActionListModal').modal('hide');
    $('#emailSentListModal').modal('hide');
    $('#donutModelPopup').modal('hide');
  }
}
