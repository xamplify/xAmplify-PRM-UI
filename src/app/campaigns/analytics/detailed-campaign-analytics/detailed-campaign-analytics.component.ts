import { Component, OnInit, OnDestroy, ViewChild,Input } from '@angular/core';
import { Router } from '@angular/router';

import { Campaign } from '../../models/campaign';
import { CampaignReport } from '../../models/campaign-report';
import { EmailLog } from '../../models/email-log';
import { Pagination } from '../../../core/models/pagination';
import { SocialCampaign } from '../../../social/models/social-campaign';
import { SocialStatus } from '../../../social/models/social-status';
import { CustomResponse } from '../../../common/models/custom-response';
import { HttpRequestLoader } from '../../../core/models/http-request-loader';

import { CampaignService } from '../../services/campaign.service';
import { UtilService } from '../../../core/services/util.service';
import { VideoUtilService } from '../../../videos/services/video-util.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { PagerService } from '../../../core/services/pager.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { SocialService } from '../../../social/services/social.service';
import { TwitterService } from '../../../social/services/twitter.service';
import { ContactService } from '../../../contacts/services/contact.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { Tweet } from '../../../social/models/tweet';
import { EmailTemplateService } from '../../../email-template/services/email-template.service';
import { DealRegistrationService } from '../../../deal-registration/services/deal-registration.service';
import { EventCampaign } from '../../models/event-campaign';
import { PreviewLandingPageComponent } from '../../../landing-pages/preview-landing-page/preview-landing-page.component';
import { LandingPageService } from '../../../landing-pages/services/landing-page.service';
import { SenderMergeTag } from '../../../core/models/sender-merge-tag';
import { ClickedUrlsVendorAnalyticsComponent} from '../../clicked-urls-vendor-analytics/clicked-urls-vendor-analytics.component';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { LeadsService } from '../../../leads/services/leads.service';
import { Subject } from 'rxjs';
import { DealsService } from 'app/deals/services/deals.service';
import { Lead } from 'app/leads/models/lead';
import { Deal } from 'app/deals/models/deal';
declare var $:any, Highcharts:any, swal: any;
@Component({
  selector: 'app-detailed-campaign-analytics',
  templateUrl: './detailed-campaign-analytics.component.html',
  styleUrls: ['./detailed-campaign-analytics.component.css','../timeline.css'],
  providers: [Pagination, HttpRequestLoader, LandingPageService, DealsService]
})
export class DetailedCampaignAnalyticsComponent implements OnInit,OnDestroy {
  isDealRegistration: boolean = false;
  enableLeads = false;
  createdBySelf = false;
  dealButtonText: string = "";
  dealId: any;
  eventCampaign: EventCampaign = new EventCampaign();
  isCancelledEvent: boolean = false;

  public searchKey: string;
  public leadsSearchKey: string;

  ngxloading: boolean;
  isTimeLineView: boolean;
  campaign: Campaign;
  isChannelCampaign: boolean;
  selectedRow: any = new Object();
  videoLength: number;
  campaignViews: any;
  campaignTotalViewsData: any;
  campaignBarViews: any;
  emailLogs = [];
  emailLogDetails: any;
  totalEmailLogs: any;
  campaignReport: CampaignReport = new CampaignReport;
  userCampaignReport: CampaignReport = new CampaignReport;
  customResponse: CustomResponse = new CustomResponse();

  campaignViewsPagination: Pagination = new Pagination();
  contactListInfoPagination: Pagination = new Pagination();
  emailActionListPagination: Pagination = new Pagination();
  emailActionDetailsPagination: Pagination = new Pagination();
  usersWatchListPagination: Pagination = new Pagination();
  emailLogPagination: Pagination = new Pagination();
  campaignTotalViewsPagination: Pagination = new Pagination();
  campaignsWorldMapPagination: Pagination = new Pagination();
  userWatchedReportPagination: Pagination = new Pagination();
  rsvpDetailAnalyticsPagination: Pagination = new Pagination();
  sentEmailOpenPagination: Pagination = new Pagination();
  autoResponseAnalyticsPagination: Pagination = new Pagination();


  socialCampaign: SocialCampaign = new SocialCampaign();
  redistributedAccounts = new Set<number>();
  redistributedAccountsBySelectedUserId: Array<SocialStatus> = [];
  campaignType: string;
  campaignTypeString: string;
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
  campaingContactLists: any;
  campaingContactListValues: any;
  contactListId: number;
  paginationType: string;
  videoFile: any;
  userWatchtotalRecords: number;
  isDataShare = false;
  isPartnerEnabledAnalyticsAccess = false;
  isNavigatedThroughAnalytics = false;
  campaignRouter: any;
  loggedInUserId = 0;
  loading = false;
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
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  autoResponeAnalyticsLoader: HttpRequestLoader = new HttpRequestLoader();
  hasClientError = false;
  contactListDeleteError = false;
  interactiveDataTimeLineViewEnable = false;
  totalCampaignViewsLoader = false;
  isOnlyPartner = false;
  isLoadingDownloadList = false;
  actionType = '';
  colspanValue: number = 7;

  sortcolumn: string = null;
  sortingOrder: string = null;

  sortByDropDown = [
    { 'name': 'Sort By', 'value': '' },
    { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
    { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
    { 'name': 'Time(ASC)', 'value': 'time-ASC' },
    { 'name': 'Time(DESC)', 'value': 'time-DESC' }
  ];
  selectedSortedOption: any = this.sortByDropDown[this.sortByDropDown.length - 1];
  campaignViewsSortByDropDown = [
    { 'name': 'Sort By', 'value': '' },
    { 'name': 'URL Clicked Count (ASC)', 'value': 'urls_clicked_count-ASC' },
    { 'name': 'URL Clicked Count (DESC)', 'value': 'urls_clicked_count-DESC' },
    { 'name': 'Email Opened Count(ASC)', 'value': 'email_opened_count-ASC' },
    { 'name': 'Email Opened Count (DESC)', 'value': 'email_opened_count-DESC' }
  ];
  selectedCampaignSortedOption: any = this.campaignViewsSortByDropDown[0];

  tweets: Array<Tweet> = new Array<Tweet>();
  smsLogs: any;
  smsService: boolean;
  isSmsServiceAnalytics = false;
  @ViewChild('previewLandingPageComponent') previewLandingPageComponent: PreviewLandingPageComponent;
  @ViewChild('clickedUrlsVendorAnalyticsComponent') clickedUrlsVendorAnalyticsComponent:ClickedUrlsVendorAnalyticsComponent;
  senderMergeTag: SenderMergeTag = new SenderMergeTag();
  leadData: any;
  isDealPreview = false;
  isDeal = false;
  exportingObject: any = {};
  inputObject: any = {};
  partnerLeadInfoRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  leadInfoTitle = "Leads Info";
  leadDetailType = 'YES';
  partnerLeadDetailType = 'YES'
  partnerLeadResponeStatus = 404;
  isShowPartnerLeads = false;
  leadsDetailPagination: Pagination = new Pagination();
  partnerLeadsDetailPagination: Pagination = new Pagination();
  totalLeadsDetailPagination: Pagination = new Pagination();
  leadsFormHeaders = [];
  leadsFormDetails = [];
  partnerLeadsFormHeaders = [];
  partnerLeadsFormDetails = [];
  totalLeadsFormHeaders = [];
  totalLeadsFormDetails = [];
  selectedLeadPartnerId: number;
  leadType: string;
  isLeadListDownloadProcessing = false;
  showTotalLeads = false;
  disabled: boolean;
  showRegisterLeadButton = false;
  registerLeadButtonError = false;
  leadActionType = "add";
  leadId = 0;
  showUserLevelCampaignAnalytics = false;
  showLeads: boolean = false;
  showDeals: boolean = false;
  showLeadForm: boolean = false;
  refreshCampaignLeadsSubject: Subject<boolean> = new Subject<boolean>();
  showDealForm: boolean = false;
  dealActionType = "add";
  selectedLead: Lead;
  selectedDeal: Deal;
  isCommentSection: boolean = false;
  loggedInUserCompanyId : number;
  /****XNFR-125****/
  @Input() campaignId = 0;
  @Input() hidePageContent = false;
  constructor(private campaignService: CampaignService, private utilService: UtilService, private socialService: SocialService,
    public authenticationService: AuthenticationService, public pagerService: PagerService, public pagination: Pagination,
    public referenceService: ReferenceService, public contactService: ContactService, public videoUtilService: VideoUtilService,
    public xtremandLogger: XtremandLogger, private twitterService: TwitterService, private emailTemplateService: EmailTemplateService, private dealRegService: DealRegistrationService, private leadsService: LeadsService, public router: Router) {
    try {
      this.campaignRouter = this.utilService.getRouterLocalStorage();
      this.isTimeLineView = false;
      this.loggedInUserId = this.authenticationService.getUserId();
      this.isOnlyPartner = this.authenticationService.isOnlyPartner();
      this.campaign = new Campaign();
      this.selectedRow.emailId = "";
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  showTimeline() {
    this.isTimeLineView = !this.isTimeLineView;
  }

  listCampaignViews(campaignId: number, pagination: Pagination) {
    try {
      this.loading = true;
     if(this.campaignType === 'REGULAR' || this.campaignType === 'VIDEO' || this.campaignType === 'SURVEY'){
        pagination.campaignType = this.campaignType;
     }
      this.referenceService.loading(this.httpRequestLoader, true);

      if (this.searchKey) {
        pagination.searchKey = this.searchKey;
        this.pagination.pageIndex = 1;
      } else {
        pagination.searchKey = null;
      }
      if (this.downloadTypeName != 'sentEmails') {
        this.downloadTypeName = 'campaignViews';
      } else {
        this.downloadTypeName = 'sentEmails';
      }
      if (this.isDataShare && this.isNavigatedThroughAnalytics && !this.isPartnerEnabledAnalyticsAccess) {
        pagination.campaignId = campaignId;
        pagination.campaignType = this.campaignType;
        this.campaignService.listCampaignInteractiveViews(pagination, this.isSmsServiceAnalytics)
          .subscribe(data => {
            this.listCampaignViewsDataInsert(data.data, data.totalRecords);
          },
            error => console.log(error),
            () => {
              this.findUserLevelCampaignAnalyticsOption(campaignId);
            });
      } else {
        this.campaignService.listCampaignViews(campaignId, pagination, this.isChannelCampaign, this.isSmsServiceAnalytics)
          .subscribe(data => {
            this.listCampaignViewsDataInsert(data.data, data.totalRecords);
          },
            error => {console.log(error)},
            () => {
              this.findUserLevelCampaignAnalyticsOption(campaignId);
            }
        )
      }
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  findUserLevelCampaignAnalyticsOption(campaignId:number){
    this.referenceService.loading(this.httpRequestLoader, true);
    this.campaignService.findUserLevelCampaignAnalyticsOption(campaignId).subscribe(
      response=>{
        this.showUserLevelCampaignAnalytics = response.data;
        this.referenceService.loading(this.httpRequestLoader, false);
      },error=>{
        this.showUserLevelCampaignAnalytics = false;
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    );
  }

  listCampaignViewsDataInsert(campaignviews: any, totalRecords:number) {
    this.campaignViews = campaignviews;
    this.campaignViews.forEach((element, index) => {
      if (element.latestView) { element.latestView = new Date(element.latestView); }
    });
    const views = [];
    for (let i = 0; i < this.campaignViews.length; i++) {
      views.push(this.campaignViews[i].viewsCount)
    }
    this.maxViewsValue = Math.max.apply(null, views);
    if (this.paginationType === 'campaignViews') {
      this.campaignViewsPagination.totalRecords = totalRecords;
      this.campaignViewsPagination = this.pagerService.getPagedItems(this.campaignViewsPagination, this.campaignViews);
    } else if (this.paginationType === 'sentEmailData') {
      this.sentEmailOpenPagination.totalRecords = this.campaignReport.emailSentCount;
      this.sentEmailOpenPagination = this.pagerService.getPagedItems(this.sentEmailOpenPagination, this.campaignViews);
    }
    this.loading = false;
    this.totalCampaignViewsLoader = false;
    this.referenceService.loading(this.httpRequestLoader, false);
  }

  getCampaignViewsReportDurationWise(campaignId: number) {
    try {
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
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  getEmailSentCount(campaignId: number) {
    try {
      this.loading = true;
      this.campaignService.getEmailSentCount(campaignId)
        .subscribe(
          data => {
            this.campaignReport.emailSentCount = data.emails_sent_count;
            this.campaignReport.activeRecipientsPercentage = ((this.campaignReport.emailOpenCount/this.campaignReport.emailSentCount)*100);
            if(this.campaignReport.activeRecipientsPercentage>=0){
              this.campaignReport.activeRecipientsPercentage = this.campaignReport.activeRecipientsPercentage.toFixed(1);
            }
            this.loading = false;
          },
          error => console.log(error),
          () => {
            this.listCampaignViews(campaignId, this.campaignViewsPagination);
          }
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  getCountryWiseCampaignViews(campaignId: number) {
    try {
      this.loading = true;
      this.campaignService.getCountryWiseCampaignViews(campaignId)
        .subscribe(
          (result: any) => {
            const countryData = result;
            const data = [];
            const self = this;
            if (countryData != null) {
              for (const i of Object.keys(countryData)) {

                const arr = countryData[i][2] ? [countryData[i][0].toLowerCase(), countryData[i][1] + countryData[i][2]] : [countryData[i][0].toLowerCase(), countryData[i][1]];

                data.push(arr);
              }
              this.renderMapData = data;
            }
            this.loading = false;
            // this.renderMap(data);
          },
          error => console.log(error),
          () => console.log());
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  clickWorldMapReports(event: any) {
    this.getCampaignUsersWatchedInfo(event);
  }

  campaignViewsCountBarchart(names, data) {
    /*   Not calling for event campaign because views count is not coming.
      if(this.campaignType != 'EVENT'){ */
    this.loading = true;
    const nameValue = this.campaignType === 'VIDEO' ? 'Views' : 'Email Opened';
    const self = this;
    let newChart = Highcharts.chart('campaign-views-barchart', {
      chart: {
        type: 'bar',
         backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
      
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
        tickLength: 0,
        labels:{
          style:{
            color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",
          }
        }
      },
      exporting: { enabled: false },
      credits: { enabled: false },
      yAxis: {
        min: 0,
        // max: maxValue,
        visible: false,
      },
      tooltip: {
        valueSuffix: '',
        backgroundColor: 'black', 
        style: {
          color: '#fff'
        }
      
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
          dataLabels:{
            style:{
            color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",
            }
          },
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
    newChart.xAxis[0].labelGroup.element.childNodes.forEach(function (label) {
      label.style.cursor = "pointer";
      label.onclick = function () {
        console.log(label);
        const text = this.textContent;
        for (let i = 0; i < self.campaignBarViews.length; i++) {
          let email = text;
          if (email.indexOf(self.campaignBarViews[i].emailId)) {
            email = email.replace(self.campaignBarViews[i].firstName, '');
            email = email.replace(self.campaignBarViews[i].lastName, '');
            email = email.replace(/\s+/, "");
            if (self.campaignBarViews[i].emailId === email) { self.userWatchedviewsInfo(email); break; }
          }
        }
      }
    });
    this.loading = false;
    //  }
  }

  getCampaignUserViewsCountBarCharts(campaignId: number, pagination: Pagination) {
    try {
      this.loading = true;
      this.paginationType = 'viewsBarChart';
      pagination.maxResults = 8;
      if (this.isDataShare && this.isNavigatedThroughAnalytics && !this.isPartnerEnabledAnalyticsAccess) {
        pagination.campaignId = campaignId;
        pagination.campaignType = this.campaignType;

        this.campaignService.listCampaignInteractiveViews(pagination, this.isSmsServiceAnalytics)
          .subscribe(data => {
            this.campaignBarViews = data.data;
            this.pagination.totalRecords = data.totalRecords;
            this.campaignBarViewsDataInsert();
          },
            error => console.log(error),
            () => console.log('listCampaignInteractiveViews(): called'))
      } else {
        this.campaignService.listCampaignViews(campaignId, pagination, this.isChannelCampaign, this.isSmsServiceAnalytics)
          .subscribe(
            data => {
              console.log(data);
              this.campaignBarViews = data.data;
              this.pagination.totalRecords = data.totalRecords;
              this.campaignBarViewsDataInsert();
            },
            error => console.log(error),
            () => console.log()
          )
      }
    } catch (error) { this.hasClientError = true; this.xtremandLogger.error('error' + error); }
  }

  campaignBarViewsDataInsert() {
    const names = [];
    const views = [];
    let isShowBarChart: boolean;
    if (this.campaignType == 'EVENT' && this.isChannelCampaign) {
      isShowBarChart = false;
    } else {
      isShowBarChart = true;
    }
    for (let i = 0; i < this.campaignBarViews.length; i++) {
      const firstName = this.campaignBarViews[i].firstName ? this.campaignBarViews[i].firstName : "";
      const lastName = this.campaignBarViews[i].lastName ? this.campaignBarViews[i].lastName : "";
      names.push("<b>" + firstName + " " + lastName + '</b><br/>' + this.campaignBarViews[i].emailId);
      views.push(this.campaignBarViews[i].viewsCount)
    }
    this.maxViewsValue = Math.max.apply(null, views);
    //this.pagination.totalRecords = parseInt(this.campaignReport.totalRecipients);
    this.pagination = this.pagerService.getPagedItems(this.pagination, this.campaignBarViews);
    console.log(this.pagination);
    if (isShowBarChart) {
      this.campaignViewsCountBarchart(names, views);
    }
    this.referenceService.goToTop();
    this.loading = false;
  }

  getCampaignUsersWatchedInfo(countryCode) {
    try {
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.paginationType = 'coutrywiseUsers';
      this.downloadTypeName = 'worldMap';
      this.countryCode = countryCode.toUpperCase();
      this.campaignService.getCampaignUsersWatchedInfo(this.campaignId, this.countryCode, this.pagination)
        .subscribe(
          (data: any) => {
            console.log(data);
            this.worldMapUserData = data.data;
            this.pagination.totalRecords = data.totalRecords;
            this.pagination = this.pagerService.getPagedItems(this.pagination, data.data);
            this.loading = false;
            this.referenceService.loading(this.httpRequestLoader, false);
            $('#worldMapModal').modal('show');
          },
          error => console.log(error),
          () => console.log('finished')
        );
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  getEmailLogCountByCampaign(campaignId: number) {
    try {
      this.loading = true;
      this.campaignService.getEmailLogCountByCampaign(campaignId)
        .subscribe(
          data => {
            this.campaignReport.emailOpenCount = data["email_opened_count"];
            this.campaignReport.emailClickedCount = data["email_url_clicked_count"];
            
            this.campaignReport.dataShareClickedUrlsCountForVendor = data['dataShareClickedUrlsCountForVendor'];
            this.loading = false;
          },
          error => console.log(error),
          () => console.log()
        )
    } catch (error) { this.hasClientError = true; this.xtremandLogger.error('error' + error); }
  }
  
  getCampaignHighLevelAnalytics(campaignId: number){
	    try {
	        this.loading = true;
	        
	        let userId = null;
	        if(this.isNavigatedThroughAnalytics){
	        	userId = this.campaign.userId;
	        }else{
	        	userId = this.loggedInUserId ;
	        }
	        
	        this.campaignService.getCampaignHighLevelAnalytics(campaignId, userId)
	          .subscribe(
	            response => {
	            	this.campaignReport.emailSentCount = response.data.totalEmailsSent;
	            	this.campaignReport.totalRecipients = response.data.totalRecipients;
	            	this.campaignReport.delivered = response.data.delivered;
	            	this.campaignReport.unsubscribed = response.data.unsubscribed;
	            	this.campaignReport.softBounce = response.data.softBounce;
	            	this.campaignReport.hardBounce = response.data.hardBounce;
	            	this.campaignReport.clickthroughRate = response.data.clickthroughRate;
	            	this.campaignReport.emailClickedCount = response.data.emailClicked;
	            	this.campaignReport.openRate = response.data.openRate;
	            	this.campaignReport.activeRecipients = response.data.activeRecipients;
	            	this.campaignReport.unsubscribed = response.data.unsubscribed;
	            	this.campaignReport.pagesClicked = response.data.pagesClicked;
	            	this.campaignReport.deliveredCount = parseInt(response.data.deliveredCount);
	            	this.campaignReport.usersWatchCount = parseInt(response.data.views);
                this.campaignReport.leadCount = response.data.leadCount;
	            	this.campaignReport.dealCount = response.data.dealCount;
                    this.listCampaignViews(campaignId, this.campaignViewsPagination);
	              /*this.campaignReport.emailOpenCount = data["email_opened_count"];
	              this.campaignReport.emailClickedCount = data["email_url_clicked_count"];
	              
	              this.campaignReport.dataShareClickedUrlsCountForVendor = data['dataShareClickedUrlsCountForVendor'];*/
	              this.loading = false;
	            },
	            error => console.log(error),
	            () => console.log()
	          )
	      } catch (error) { this.hasClientError = true; this.xtremandLogger.error('error' + error); }
  }
  
  getCampaignWatchedUsersCount(campaignId: number) {
    try {
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
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  campaignWatchedUsersListCount(campaignId: number) {
    try {
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
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  usersWatchList(campaignId: number, pagination: Pagination) {
    try {
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.paginationType = 'usersWatch';
      this.downloadTypeName = 'usersWatchedList';
      this.campaignService.emailActionDetails(campaignId, 'views', pagination)
        .subscribe(
        		response => {
        	this.actionType = 'views';
        	this.campaignReport.emailActionType =  'views';
            this.usersWatchListPagination.totalRecords = response.data.totalRecords;;
            this.campaignReport.usersWatchList = response.data.data;
            response.data.data.forEach((element, index) => {
              element.startTime = new Date(element.startTimeUtcString);
              element.endTime = new Date(element.endTimeUtcString);
            });
            $('#usersWatchListModal').modal();
            this.usersWatchListPagination = this.pagerService.getPagedItems(this.usersWatchListPagination, this.campaignReport.usersWatchList);
            this.loading = false;
            this.referenceService.loading(this.httpRequestLoader, false);
          },
          error => console.log(error),
          () => console.log()
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  sentEmailModal() {
    this.downloadTypeName = 'sentEmails';
    this.paginationType = 'sentEmailData';
    this.sentEmailOpenPagination = new Pagination();
    this.listCampaignViews(this.campaign.campaignId, this.sentEmailOpenPagination);
    $('#emailSentListModal').modal();
  }

  resetRsvpPagination() {
    this.searchKey = '';
    this.rsvpDetailAnalyticsPagination = new Pagination();
  }

  setPage(event: any) {
    try {
      this.paginationType = event.type;
      if (event.type === 'campaignViews') {
        this.campaignViewsPagination.pageIndex = event.page;
        this.totalCampaignViewsLoader = true;
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
      } else if (event.type === 'email not open') {
        this.rsvpDetailAnalyticsPagination.pageIndex = event.page;
        this.getRsvpEmailNotOpenDetails();
      } else if (event.type === 'invities') {
        this.rsvpDetailAnalyticsPagination.pageIndex = event.page;
        this.getRsvpInvitiesDetails();
      } else if (event.type === 'YES' || event.type === 'NO' || event.type === 'MAYBE' || event.type === 'NOTYET') {
        this.rsvpDetailAnalyticsPagination.pageIndex = event.page;
        this.getRsvpDetails(this.rsvpResposeType);
      } else if (event.type === 'contactListInfo') {
        this.contactListInfoPagination.pageIndex = event.page;
        this.getListOfContacts(this.contactListId);
      } else if (event.type === 'emailActionDetails') {
    	  this.emailActionDetailsPagination.pageIndex = event.page;
    	   this.emailActionDetails(this.campaign.campaignId, this.actionType, this.emailActionDetailsPagination);
      } else {
        this.pagination.pageIndex = event.page;
        this.callPaginationValues(event.type);
      }
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }


  paginationDropdown(event: Pagination) {
    try {
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
      } else if (this.paginationType === 'email open') {
        this.rsvpDetailAnalyticsPagination = event;
        this.getRsvpEmailOpenDetails();
      } else if (this.paginationType === 'email not open') {
        this.rsvpDetailAnalyticsPagination = event;
        this.getRsvpEmailNotOpenDetails();
      } else if (this.paginationType === 'invities') {
        this.rsvpDetailAnalyticsPagination = event;
        this.getRsvpInvitiesDetails();
      } else if (this.paginationType === 'YES' || this.paginationType === 'NO' || this.paginationType === 'MAYBE' || this.paginationType === 'NOTYET') {
        this.rsvpDetailAnalyticsPagination = event;
        this.getRsvpDetails(this.rsvpResposeType);
      } else if (this.paginationType === 'rsvpDetailPagination') {
        this.rsvpDetailAnalyticsPagination = event;
        this.getRsvpDetails(this.rsvpResposeType);
      } else if(this.paginationType === 'emailActionDetails'){
    	  this.emailActionDetailsPagination = event;
    	  this.emailActionDetails(this.campaign.campaignId, this.actionType, this.emailActionDetailsPagination);
      }
      
      else {
        this.pagination = event;
        this.callPaginationValues(this.paginationType);
      }
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  paginationContacts(pagination: Pagination) {
    this.contactListInfoPagination = pagination;
    this.getListOfContacts(this.contactListId);
  }
  callPaginationValues(type: string) {
    if (type === 'viewsBarChart') { this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination); }
    else if (type === 'donutCampaign') { this.campaignViewsDonut(this.donultModelpopupTitle); }
    else if (type === 'coutrywiseUsers') { this.getCampaignUsersWatchedInfo(this.countryCode); }
  }
  emailActionList(campaignId: number, actionType: string, pagination: Pagination) {
    try {
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.paginationType = 'emailAction';
      this.downloadTypeName = 'emailAction';
      this.actionType = actionType;
      this.campaignService.emailActionDetails(campaignId, actionType, pagination)
        .subscribe(response => {
          this.campaignReport.emailLogs = response.data.data;
          this.campaignReport.emailLogs.forEach((element, index) => { element.time = new Date(element.utcTimeString); });
          this.campaignReport.emailActionType = actionType;
          $('#emailActionListModal').modal();
          if (actionType === 'open') {
            if (this.sortByDropDown.length === 5) {
              this.sortByDropDown.push({ 'name': 'Subject(ASC)', 'value': 'subject-ASC' });
              this.sortByDropDown.push({ 'name': 'Subject(DESC)', 'value': 'subject-DESC' });
            }
            this.emailActionListPagination.totalRecords = this.campaignReport.emailOpenCount;
          } else if (actionType === 'click') {
            this.sortByDropDown = this.sortByDropDown.filter(function (el) { return el.name != "Subject(ASC)"; });
            this.sortByDropDown = this.sortByDropDown.filter(function (el) { return el.name != "Subject(DESC)"; });
            this.emailActionListPagination.totalRecords = response.data.totalRecords;;
          }
          this.emailActionListPagination = this.pagerService.getPagedItems(this.emailActionListPagination, this.campaignReport.emailLogs);
          this.loading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
        },
          error => console.log(error),
          () => console.log('emailActionList() completed'))
    } catch (error) { this.xtremandLogger.error('Error in analytics page emails sent' + error); }
  }
  
  emailActionDetails(campaignId: number, actionType: string, emailActionDetailsPagination : Pagination) {
      try {
        this.loading = true;
        this.referenceService.loading(this.httpRequestLoader, true);
        this.paginationType = 'emailActionDetails';
        this.downloadTypeName = 'emailActionDetails';
        this.actionType = actionType;
        this.campaignService.emailActionDetails(campaignId, actionType, this.emailActionDetailsPagination)
          .subscribe(response => {
           this.campaignViews  = response.data.data;
           this.campaignViews.forEach((element, index) => { element.time = new Date(element.utcTimeString); });
           this.emailActionDetailsPagination.totalRecords = response.data.totalRecords;
            this.campaignReport.emailActionType = actionType;
            $('#emailActionDetailsModal').modal();
            this.emailActionDetailsPagination = this.pagerService.getPagedItems(this.emailActionDetailsPagination, this.campaignViews);
            this.loading = false;
            this.referenceService.loading(this.httpRequestLoader, false);
          },
            error => console.log(error),
            () => console.log('emailActionDetails() completed'))
      } catch (error) { this.xtremandLogger.error('Error in analytics page '+actionType +'details' + error); }
    }


  listautoResponseAnalyticsByCampaignAndUser(campaignId: number, userId: number) {
    try {
      this.loading = true;
      let json = { "pageIndex": 1, "maxResults": 120, "userId": userId, "campaignId": campaignId };
      this.campaignService.listautoResponseAnalyticsByCampaignAndUser(json)
        .subscribe(result => {
          const response = result.data.data;
          response.forEach((element, index) => {
            element.time = new Date(element.sentTimeUtcString);
            console.log(element);
          });
          this.emailLogs.push(...response);
          this.loading = false;

        },
          error => console.log(error),
          () => {
            this.emailLogs.sort((b, a) => new Date(b.time).getTime() - new Date(a.time).getTime());
          })
    } catch (error) { this.xtremandLogger.error('Error in analytics page listautoResponseAnalyticsByCampaignAndUser' + error); }
  }

  listEmailLogsByCampaignAndUser(campaignId: number, userId: number) {
    try {
      this.loading = true;
      this.campaignService.listEmailLogsByCampaignAndUser(campaignId, userId)
        .subscribe(data => {
          data.forEach((element, index) => {
            if (element.time) { element.time = new Date(element.utcTimeString); }
          });
          this.emailLogs = data;
          this.loading = false;
          console.log(data);
        },
          error => console.log(error),
          () => {
            this.count();
            this.listautoResponseAnalyticsByCampaignAndUser(campaignId, userId);
          })
    } catch (error) { this.xtremandLogger.error('Error in analytics page listEmailLogsByCampaignAndUser' + error); }
  }

  count() {
    try {
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
    } catch (error) { this.xtremandLogger.error('Error in count' + error); }
  }

  userTimeline(campaignViews: any) {
    try {
      this.loading = true;
      if (this.campaignType != 'SMS') {
        this.redistributedAccountsBySelectedUserId = [];
        this.listEmailLogsByCampaignAndUser(campaignViews.campaignId, campaignViews.userId);
        if (this.smsService) {
          this.listSMSLogsByCampaignAndUserForSmsAnalylics(campaignViews.campaignId, campaignViews.userId);
        }
      } else {
        this.listSMSLogsByCampaignAndUser(campaignViews.campaignId, campaignViews.userId);
      }

      this.redistributedAccountsBySelectedUserId = [];
      //this.listEmailLogsByCampaignAndUser(campaignViews.campaignId, campaignViews.userId);
      this.getTotalTimeSpentOfCampaigns(campaignViews.userId, campaignViews.campaignId);
      if (this.campaignType === 'EVENT' && this.isChannelCampaign) {
        this.resetRsvpPagination();
        this.redistributionCampaignsDetails(campaignViews);
      }
      if (this.campaignType === 'SOCIAL') {
        this.socialCampaign.socialStatusList.forEach(
          data => data.socialStatusList.forEach(data => {
            if (data.userId === campaignViews.userId) { this.redistributedAccountsBySelectedUserId.push(data); }
          })
        )
      }
      this.selectedRow = campaignViews;
      this.isTimeLineView = !this.isTimeLineView;
      this.userCampaignReport.totalUniqueWatchCount = campaignViews.viewsCount;
      if (!this.barChartCliked) {
        this.pagination.pageIndex = 1;
        this.pagination.maxResults = 10;
        if (this.campaignId === null) {
          this.campaignId = 0;
        }
        console.log('campaign id : ' + this.campaignId);
        this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination);
        this.loading = false;
      }
      this.getDealState(campaignViews);
      this.loading = false;
    } catch (error) { this.xtremandLogger.error(error); }
  }
  /****************Deal Registration***************************/
  getDealState(campaignViews: any) {
    this.registerLeadButtonError = false;
    if (campaignViews.userId != null && campaignViews.campaignId != null) {
      this.campaignService.showRegisterLeadButton(campaignViews.campaignId).
        subscribe(data => {
          if(data.statusCode==200){
            let map = data.map;
            this.disabled = map.disabled;
            this.showRegisterLeadButton = map.showButton;
          }else{
            this.registerLeadButtonError = true;
          }
      },error=>{
          this.registerLeadButtonError = true;
      });
    }

    

    this.leadsService.getLeadByCampaign(campaignViews.campaignId, campaignViews.userId, this.loggedInUserId)
    .subscribe(response => {
      let data = response.data;
      if (data == undefined) {
        this.dealButtonText = "Register Lead";
        this.leadActionType = "add";
        this.leadId = 0;
        //this.isDeal = false;
      } else {
       // this.leadData = data;
        this.dealButtonText = "Update Lead";
        this.leadActionType = "edit";
        this.leadId = data.id;
      }      
    })

  }

  showDealRegistrationForm() {
    if (this.isDeal) {
      this.isDealRegistration = false;
      this.isDealPreview = true;
    } else {
      this.isDealRegistration = true;
      this.isDealPreview = false;
    }

    console.log(this.isTimeLineView && !this.isDealRegistration);
  }
  previeDeal() {
    this.isDealPreview = true;
  }

  showTimeLineView() {
    this.isDealRegistration = false;
    this.isTimeLineView = true;
    this.isDealPreview = false;
    console.log(this.isDealRegistration);

    this.getDealState(this.selectedRow);
  }

  /****************END of Deal Registration***************************/


  getTotalTimeSpentOfCampaigns(userId: number, campaignId: number) {
    try {
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
    } catch (err) { this.xtremandLogger.error(err); }
  }
  userWatchedviewsInfo(emailId: string) {
    try {

      /* if(this.userCampaignReport.totalUniqueWatchCount === 0){
           this.interactiveDataTimeLineViewEnable = true;
       }else{
           this.interactiveDataTimeLineViewEnable = false;
       }*/

      if (emailId.includes('<br/>')) {
        emailId = emailId.substring(emailId.indexOf('<br/>'), emailId.length);
        emailId = emailId.substring(5);
      }
      this.loading = true;
      if (emailId !== this.selectedRow.emailId) {
        this.userCampaignReport.emailOpenCount = 0;
        this.userCampaignReport.emailClickedCount = 0;
        this.userCampaignReport.totalUniqueWatchCount = 0;
        this.userCampaignReport.smsOpenCount = 0;
        this.userCampaignReport.smsClickedCount = 0;
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

  getEventCampaignById(campaignId: number) {
    try {
      this.campaignService.getEventCampaignById(campaignId)
        .subscribe(data => {
          console.log(data);
          this.eventCampaign = data.data;
          if (data.data.eventCancellation.cancelled) {
            this.isCancelledEvent = true;
          }
          if (this.eventCampaign.emailTemplateDTO) {
            this.campaign.emailTemplate = this.eventCampaign.emailTemplateDTO;
            this.campaign.selectedEmailTemplateId = this.eventCampaign.emailTemplateDTO.id;
          }
          /****** For leads count info ******/
          if (this.campaign.publicEventCampaign) {
            this.getLeadsCount();
          }
        },
          error => console.log(error),
          () => { }
        );
    } catch (err) { this.xtremandLogger.error(err); }
  }

  getCampaignById(campaignId: number) {
    try {
      this.loading = true;
      const obj = { 'campaignId': campaignId, 'userId': this.loggedInUserId }
      this.campaignService.getCampaignById(obj)
        .subscribe(
          data => {
            this.campaign = data;
            this.campaign.displayTime = new Date(this.campaign.utcTimeInString);
            this.isChannelCampaign = data.channelCampaign;
            if(this.campaign.nurtureCampaign && this.campaign.companyId == this.loggedInUserCompanyId){
            	this.isNavigatedThroughAnalytics = false;
                this.isPartnerEnabledAnalyticsAccess = true;
                this.isDataShare = true;
            }else if (this.campaign.nurtureCampaign &&  this.loggedInUserCompanyId != this.campaign.companyId) {
              this.isPartnerEnabledAnalyticsAccess = this.campaign.detailedAnalyticsShared;
              this.isDataShare = this.campaign.dataShare;
              this.isNavigatedThroughAnalytics = true;
              if (data.campaignType === 'EVENT') {
                this.colspanValue = 10;
              } else {
                this.colspanValue = 6;
              }
            } else {
              this.isNavigatedThroughAnalytics = false;
              this.isPartnerEnabledAnalyticsAccess = true;
              this.isDataShare = true;
            }
            /*********XNFR-125****/
            if (!this.campaign.campaignType.toLocaleString().includes('SMS')) {
              if (!this.isSmsServiceAnalytics)
                this.getEmailLogCountByCampaign(this.campaignId);
              else
                this.getSmsLogCountByCampaign(this.campaignId);

            } else {
              this.getSmsLogCountByCampaign(this.campaignId);
            }
            if (data.campaignType === 'VIDEO') {
              this.campaignViewsSortByDropDown.push( { 'name': 'Views Count (ASC)', 'value': 'views_count-ASC'});
              this.campaignViewsSortByDropDown.push( { 'name': 'Views Count (DESC)', 'value': 'views_count-DESC'});
            }

            this.campaingContactLists = data.userLists;
            this.isPartnerCampaign = this.campaign.channelCampaign ? '('+this.authenticationService.partnerModule.customName+')' : '';
            this.loading = false;
          },
          error => {
            error = error.json();
            this.customResponse = new CustomResponse('ERROR', error.message, true);
            this.loading = false;
          },
          () => {
            /********XNFR-125*****/
            if (this.customResponse.responseType !== 'ERROR') {
              const campaignType = this.campaign.campaignType.toLocaleString();
              if (campaignType.includes('VIDEO')) {
                this.campaignType = 'VIDEO';
                this.getCountryWiseCampaignViews(campaignId);
                this.getCampaignViewsReportDurationWise(campaignId);
              } else if (campaignType.includes('SOCIAL')) {
                this.campaignType = 'SOCIAL';
                this.getSocialCampaignByCampaignId(campaignId);
              } else if (campaignType.includes('EVENT')) {
                this.campaignType = 'EVENT';
                this.colspanValue = 10;
                if (this.campaign.emailTemplate) {
                  this.campaign.selectedEmailTemplateId = this.campaign.emailTemplate.id;
                }
                this.getEventCampaignById(campaignId);
                this.getEventCampaignByCampaignId(campaignId);
              } else if (campaignType.includes('SMS')) {
                this.campaignType = 'SMS';
              } else if (campaignType.includes('LANDINGPAGE')) {
                this.campaignType = 'LANDINGPAGE';
              } else if (campaignType.includes('SURVEY')) {
                this.campaignType = 'SURVEY';
              }
              else {
                this.campaignType = 'REGULAR';
              }
            }
            if (this.campaignType != 'SMS') {
               this.getCampaignHighLevelAnalytics(this.campaignId);
            } else {
              this.getSmsSentCount(this.campaignId);
              this.getSmsSentSuccessCount(this.campaignId);
              this.getSmsSentFailureCount(this.campaignId);
            }
            if (this.campaignType == 'EVENT') {
              this.exportingObject['eventCampaign'] = true;
              this.exportingObject['campaignAlias'] = this.campaignId;
              this.exportingObject['formAlias'] = this.campaign.formAlias;
              this.exportingObject['isPublicEventLeads'] = true;
              this.exportingObject['totalLeads'] = true;
              this.exportingObject['totalAttendees'] = false;
              this.exportingObject['totalPartnerLeads'] = false;
            }
            if (this.campaignType == 'EVENT' && this.isChannelCampaign) {
              this.getPartnerRedistributedCampaignsRSVP(this.campaignId);
            }
            this.loading = false;
          }
        )
    } catch (error) { this.hasClientError = true; this.xtremandLogger.error(error); }
  }

  getSocialCampaignByCampaignId(campaignId: number) {
    try {
      this.loading = true;
      this.socialService.getSocialCampaignByCampaignId(campaignId)
        .subscribe(
          data => {
            this.socialCampaign = data;
            this.socialCampaign.socialStatusList.forEach(data => {
              data.socialStatusList.forEach(data => this.redistributedAccounts.add(data.userId))
            });
            this.loading = false;
          },
          error => this.xtremandLogger.error(error),
          () => { }
        )
    } catch (error) {
      this.xtremandLogger.error('error' + error)
    }
  }
  
  getPartnerRedistributedCampaignsRSVP(campaignId: number) {
      try {
          this.loading = true;
          this.campaignService.getPartnerRedistributedCampaignsRSVP(campaignId)
              .subscribe(
              data => {
                  console.log(data);
                  this.campaignReport.allPartnersYesCount = data.YES;
                  this.campaignReport.allPartnersMayBeCount = data.MAYBE;
                  this.campaignReport.allPartnersNoCount = data.NO;
                  this.campaignReport.allPartnersAdditionalCount = data.additionalCount;
                  this.loading = false;
              },
              error => this.xtremandLogger.error(error),
              () => { }
              )
      } catch (error) {
          this.xtremandLogger.error('error' + error)
      }
    }


  getEventCampaignByCampaignId(campaignId: number) {
    try {
      this.loading = true;
      this.campaignService.getEventCampaignDetailsByCampaignId(campaignId, this.isChannelCampaign)
        .subscribe(
          data => {
            this.campaignReport.totalYesCount = data.YES;
            this.campaignReport.totalMayBeCount = data.MAYBE;
            this.campaignReport.totalNoCount = data.NO;
            this.campaignReport.totalNotYetRespondedCount = data.notYetResponded;
            this.campaignReport.totalEmailOpenCount = data.emailOpenedCount;
            this.campaignReport.totalAdditionalCount = data.additionalCount;
            this.campaignReport.totalInvitiesCount = data.totalInvities;
            this.campaignReport.totalLeadsCount = data.totalLeadsCount;
            this.campaignReport.totalAttendeesCount = data.totalAttendeesCount;
            this.campaignReport.totalPartnerLeadsCount = data.totalPartnerLeadsCount;
            this.getPartnersResponeCount(campaignId);
            this.loading = false;
          },
          error => this.xtremandLogger.error(error),
          () => { }
        )
    } catch (error) {
      this.xtremandLogger.error('error' + error)
    }
  }

  getPartnersResponeCount(campaignId: number) {
    try {
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
    } catch (error) {
      this.xtremandLogger.error('error' + error)
    }
  }



  getRsvpInvitiesDetails() {
    try {
      //this.loading = true;
      this.referenceService.detailViewIsLoading = true;
      this.downloadTypeName = 'rsvp';
      this.rsvpResposeType = "invities";
      this.paginationType = "invities";
      //this.rsvpDetailAnalyticsPagination = new Pagination();
      if (this.rsvpDetailType === 'reDistribution') {
        this.campaignService.getEventCampaignRedistributionInvitiesDetails(this.campaign.campaignId, this.campaignReport.selectedPartnerUserId, this.rsvpDetailAnalyticsPagination)
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
      } else if (this.rsvpDetailType === 'partnerRsvp') {
        this.campaignService.getEventCampaignPartnerInvitiesDetails(this.campaign.campaignId, this.rsvpDetailAnalyticsPagination)
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
      else {
        this.showRsvpDetails = true;
        this.campaignService.getEventCampaignTotalInvitiesDetails(this.campaign.campaignId, this.rsvpDetailAnalyticsPagination)
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
    } catch (error) {
      this.xtremandLogger.error('error' + error)
    }
  }



  getRsvpEmailOpenDetails() {
    try {
      // this.loading = true;
      this.referenceService.detailViewIsLoading = true;
      this.downloadTypeName = 'rsvp';
      //this.rsvpDetailAnalyticsPagination = new Pagination();
      this.rsvpResposeType = "email open";
      this.paginationType = "email open";
      // this.emailOpenSelected = 'email open';
      if (this.rsvpDetailType === 'reDistribution') {
        this.campaignService.getEventCampaignRedistributionEmailOpenDetails(this.campaign.campaignId, this.campaignReport.selectedPartnerUserId, this.rsvpDetailAnalyticsPagination)
          .subscribe(
            data => {
              console.log(data);
              this.emailOpenDataStore(data);
            },
            error => this.xtremandLogger.error(error),
            () => { });
      } else if (this.rsvpDetailType === 'partnerRsvp') {
        this.campaignService.getEventCampaignEmailOpenDetails(this.campaign.campaignId, false, this.rsvpDetailAnalyticsPagination)
          .subscribe(
            data => {
              console.log(data);
              this.emailOpenDataStore(data);
            },
            error => this.xtremandLogger.error(error),
            () => { });
      }
      else {
        this.showRsvpDetails = true;
        this.campaignService.getEventCampaignEmailOpenDetails(this.campaign.campaignId, this.isChannelCampaign, this.rsvpDetailAnalyticsPagination)
          .subscribe(
            data => {
              console.log(data);
              this.emailOpenDataStore(data);
            },
            error => this.xtremandLogger.error(error),
            () => { });
      }
    } catch (error) {
      this.xtremandLogger.error('error' + error)
    }
  }

  emailOpenDataStore(data: any) {
    this.loading = false;
    data.data.forEach((element, index) => { element.time = new Date(element.utcTimeString); });
    this.referenceService.detailViewIsLoading = false;
    this.rsvpDetailsList = data.data;
    this.rsvpDetailAnalyticsPagination.totalRecords = data.totalRecords;
    this.rsvpDetailAnalyticsPagination = this.pagerService.getPagedItems(this.rsvpDetailAnalyticsPagination, data.data);
  }

  getRsvpEmailNotOpenDetails() {
    try {
      //this.loading = true;
      this.referenceService.detailViewIsLoading = true;
      this.downloadTypeName = 'rsvp';
      //this.rsvpDetailAnalyticsPagination = new Pagination();
      this.rsvpResposeType = "email not open";
      this.paginationType = "email not open";
      if (this.rsvpDetailType === 'reDistribution') {
        this.campaignService.getEventCampaignRedistributionEmailNotOpenDetails(this.campaign.campaignId, this.campaignReport.selectedPartnerUserId, this.rsvpDetailAnalyticsPagination)
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
      } else if (this.rsvpDetailType === 'partnerRsvp') {
        this.campaignService.getEventCampaignEmailNotOpenDetails(this.campaign.campaignId, false, this.rsvpDetailAnalyticsPagination)
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
      else {
        this.showRsvpDetails = true;
        this.campaignService.getEventCampaignEmailNotOpenDetails(this.campaign.campaignId, this.isChannelCampaign, this.rsvpDetailAnalyticsPagination)
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
    } catch (error) {
      this.xtremandLogger.error('error' + error)
    }
  }



  getPartnerCampaingRsvpDetails() {
    this.setReDistributionDetails();
    this.getRsvpDetails("YES");
  }

  setReDistributionDetails() {
    this.campaignReport.redistributionTotalYesCount = this.campaignReport.partnersYesCount;
    this.campaignReport.redistributionTotalMayBeCount = this.campaignReport.partnersMayBeCount;
    this.campaignReport.redistributionTotalNoCount = this.campaignReport.partnersNoCount;
    this.campaignReport.redistributionTotalNotYetRespondedCount = this.campaignReport.partnersNotYetRespondedCount;
    this.campaignReport.redistributionTotalEmailOpenCount = this.campaignReport.partnersEmailOpenedCount;
    this.campaignReport.redistributionTotalInvitiesCount = this.campaignReport.partnersTotalInvitiesCount;
    this.campaignReport.redistributionTotalAdditionalCount = this.campaignReport.additionalCount;
    this.campaignReport.redistributionTotalLeadsCount = this.campaignReport.totalPartnerLeadsCount;
    this.isTimeLineView = true;
    this.rsvpDetailType = 'partnerRsvp';
  }

  goToPartnerRsvpDetails(type) {
    //this.setReDistributionDetails();
    this.getRsvpDetails(type);
  }
 
  setCondition() {
      if (this.rsvpDetailType === 'allPartnerRedistributionRsvp') {
          this.resetRsvpPagination();
          this.goToAllPartnerRsvpDetails('TOTAL_PARTNER_LEADS')
      } else {
          this.resetRsvpPagination();
          this.goToPartnerRsvpDetails('TOTAL_PARTNER_LEADS');
      }
  }
  
  goToAllPartnerRsvpDetails(type) {
      this.campaignReport.redistributionTotalYesCount = this.campaignReport.allPartnersYesCount;
      this.campaignReport.redistributionTotalMayBeCount = this.campaignReport.allPartnersMayBeCount;
      this.campaignReport.redistributionTotalNoCount = this.campaignReport.allPartnersNoCount;
      this.campaignReport.redistributionTotalAdditionalCount = this.campaignReport.allPartnersAdditionalCount;
      this.campaignReport.redistributionTotalLeadsCount = this.campaignReport.totalPartnerLeadsCount; 
      this.isTimeLineView = true;
      this.rsvpDetailType = 'allPartnerRedistributionRsvp';
      this.getRsvpDetails(type);
}
   

  getRsvpDetails(responseType: any) {
    try {
      //this.loading = true;
      this.referenceService.detailViewIsLoading = true;
      this.downloadTypeName = 'rsvp';
      this.paginationType = responseType;
      this.rsvpResposeType = responseType;
      if (this.rsvpDetailType === 'allPartnerRedistributionRsvp' && responseType != 'TOTAL_PARTNER_LEADS' ) {
          this.campaignService.getAllPartnerRestributionEventCampaignAnalytics(this.campaign.campaignId, responseType, this.isChannelCampaign, this.rsvpDetailAnalyticsPagination)
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
      else if (this.rsvpDetailType === 'reDistribution' && responseType != 'TOTAL_PARTNER_LEADS' ) {
        this.campaignService.getRedistributionEventCampaignDetailAnalytics(this.campaign.campaignId, responseType, this.selectedRsvpPartnerId, this.isChannelCampaign, this.rsvpDetailAnalyticsPagination)
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
      } else if (this.rsvpDetailType === 'reDistribution' && responseType === 'TOTAL_PARTNER_LEADS' ) {
    	  this.exportingObject['totalPartnerLeads'] = false;
          this.exportingObject['totalAttendees'] = false;
          this.exportingObject['selectedPartnerLeads'] = true;
          this.exportingObject['partnerId'] = this.selectedRsvpPartnerId;
      } else if (this.rsvpDetailType === 'partnerRsvp' && responseType != 'TOTAL_PARTNER_LEADS') {
        this.campaignService.getEventCampaignDetailAnalytics(this.campaign.campaignId, responseType, false, this.rsvpDetailAnalyticsPagination)
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
      } else {
        if (responseType === 'TOTAL_LEADS') {
          this.exportingObject['totalAttendees'] = false;
          this.exportingObject['totalPartnerLeads'] = false;
          this.exportingObject['selectedPartnerLeads'] = false;
          this.exportingObject['partnerId'] = null;
          this.getEventTotalLeadsDetails();
        } else if (responseType === 'TOTAL_ATTENDEES') {
          this.getEventTotalLeadsDetails();
          this.exportingObject['totalAttendees'] = true;
          this.exportingObject['totalPartnerLeads'] = false;
          this.exportingObject['selectedPartnerLeads'] = false;
          this.exportingObject['partnerId'] = null;
        } else if (responseType === 'TOTAL_PARTNER_LEADS') {
          this.exportingObject['totalPartnerLeads'] = true;
          this.exportingObject['totalAttendees'] = false;
          this.exportingObject['selectedPartnerLeads'] = false;
          this.exportingObject['partnerId'] = null;

        }   
         else {
          this.showRsvpDetails = true;
          this.campaignService.getEventCampaignDetailAnalytics(this.campaign.campaignId, responseType, this.isChannelCampaign, this.rsvpDetailAnalyticsPagination)
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

      }
    } catch (error) {
      this.xtremandLogger.error('error' + error)
    }
  }

  redistributionCampaignsDetails(campaignViews: any) {
    try {
      this.loading = true;
      this.selectedRsvpPartnerId = campaignViews.userId;

      if (!campaignViews.firstName) {
        campaignViews.firstName = "";
      }

      if (!campaignViews.lastName) {
        campaignViews.lastName = "";
      }

      this.campaignReport.selectedPartnerFirstName = campaignViews.firstName + " " + campaignViews.lastName;
      //this.campaignReport.selectedPartnerLastName = campaignViews.lastName;
      this.campaignReport.selectedPartnerEmailId = campaignViews.emailId;
      this.campaignReport.selectedPartnerUserId = campaignViews.userId;


      // this.downloadTypeName = 'rsvp';
     
      this.campaignReport.redistributionTotalYesCount = campaignViews.rsvpMap.YES;
      this.campaignReport.redistributionTotalMayBeCount = campaignViews.rsvpMap.MAYBE;
      this.campaignReport.redistributionTotalNoCount = campaignViews.rsvpMap.NO;
      this.campaignReport.redistributionTotalNotYetRespondedCount = campaignViews.rsvpMap.notYetResponded;
      this.campaignReport.redistributionTotalEmailOpenCount = campaignViews.rsvpMap.emailOpenedCount;
      this.campaignReport.redistributionTotalInvitiesCount = campaignViews.rsvpMap.totalInvities;
      this.campaignReport.redistributionTotalAdditionalCount = campaignViews.rsvpMap.additionalCount;
      this.campaignReport.redistributionTotalLeadsCount = campaignViews.totalLeadsCount;
      this.rsvpDetailType = 'reDistribution';
      this.getRsvpDetails('YES');
      this.loading = false;
      
     /* this.campaignService.getRestributionEventCampaignAnalytics(this.campaign.campaignId, campaignViews.userId)
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
            this.campaignReport.redistributionTotalLeadsCount = data.totalLeadsCount;
            this.rsvpDetailType = 'reDistribution';
            this.getRsvpDetails('YES');
            this.loading = false;
          },
          error => this.xtremandLogger.error(error),
          () => { this.loading = false; }
        )*/
    } catch (error) {
      this.xtremandLogger.error('error' + error)
    }
  }


  resetTopNavBarValue() {
    try {
      this.referenceService.isFromTopNavBar = false;
      this.isTimeLineView = !this.isTimeLineView;
      this.emailLogs = [];
      this.totalEmailLogs = [];
      this.userCampaignReport.emailOpenCount = 0;
      this.userCampaignReport.emailClickedCount = 0;
      this.userCampaignReport.totalUniqueWatchCount = 0;
      this.clearPaginationValues();
      if (this.campaignType != 'SMS') {
        this.getCampaignHighLevelAnalytics(this.campaignId);
      }
    } catch (error) {
      this.xtremandLogger.error('error' + error)
    }
  }

  clearPaginationValues() {
    try {
      this.searchKey = null;
      this.pagination.searchKey = null;
      this.pagination.pageIndex = 1;
      this.pagination = new Pagination();
      this.barChartCliked = false;
      this.donultModelpopupTitle = '';
      this.emailLogPagination = new Pagination();
      this.emailActionListPagination = new Pagination();
      this.emailActionDetailsPagination = new Pagination();
      this.usersWatchListPagination = new Pagination();
      this.emailLogPagination.maxResults = 12;
      this.campaignViewsPagination.maxResults = 12;
      this.campaignViewsPagination.pageIndex = 1;
      this.emailActionListPagination.pageIndex = 1;
      this.emailActionListPagination.maxResults = 12;
      this.emailActionDetailsPagination.pageIndex = 1;
      this.emailActionDetailsPagination.maxResults = 12;
      this.contactListInfoPagination = new Pagination();
      this.contactListInfoPagination.pageIndex = 1;
      this.contactListInfoPagination.maxResults = 12;
      this.downloadTypeName = this.paginationType = 'campaignViews';
    } catch (error) {
      this.xtremandLogger.error('error' + error)
    }
  }

  campaignViewsDonut(timePeriod: string) {
    try {
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.paginationType = 'donutCampaign';
      this.downloadTypeName = 'donut';
      this.donultModelpopupTitle = timePeriod;
      this.campaignService.donutCampaignInnerViews(this.campaignId, timePeriod, this.pagination).
        subscribe(
          (data: any) => {
            console.log(data);
            data.forEach((element, index) => { element.time = new Date(element.time); });
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
            this.loading = false;
            this.referenceService.loading(this.httpRequestLoader, false);
            $('#donutModelPopup').modal('show');
          },
          error => console.log(error),
          () => { });
    } catch (error) {
      this.xtremandLogger.error('error' + error)
    }
  }

  totalCampaignViewsDonut(timePeriod: string, totalRecords: number) {
    try {
      this.emailLogPagination.maxResults = totalRecords;
      this.campaignService.donutCampaignInnerViews(this.campaignId, timePeriod, this.emailLogPagination).
        subscribe(
          (data: any) => {
            this.totalListOfemailLog = data;
            this.downloadEmailLogs();
          },
          error => this.xtremandLogger.error(error),
          () => { this.xtremandLogger.log('total campaigns views donut method finished'); });
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  emailActionTotalList(campaignId: number, actionType: string, totalRecords: number) {
    try {
      this.emailLogPagination.maxResults = totalRecords;
      this.campaignService.emailActionList(campaignId, actionType, this.emailLogPagination)
        .subscribe(
          data => {
            this.campaignReport.totalEmailActionList = data;
            this.downloadEmailLogs();
          },
          error => console.log(error),
          () => console.log()
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  usersWatchTotalList(campaignId: number, totalRecords: number) {
    try {
      this.userWatchedReportPagination.maxResults = totalRecords;
      this.campaignService.usersWatchList(campaignId, this.userWatchedReportPagination)
        .subscribe(
          data => {
            this.campaignReport.totalWatchedList = data.data;
            this.downloadEmailLogs();
          },
          error => this.xtremandLogger.error(error),
          () => this.xtremandLogger.log('usersWatchTotalList method finished')
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  listTotalCampaignViews(campaignId: number) {
	    let detailedAnalyticsShared = this.campaign.detailedAnalyticsShared;
	  try {
	      if(!this.isNavigatedThroughAnalytics){
	    	  detailedAnalyticsShared = true;
	      }
	      this.campaignService.downRegularVideoCampaignViews(this.campaignId, this.campaignType, this.campaign.publicEventCampaign,
	    		  detailedAnalyticsShared)
	        .subscribe(
	          data => {
	          this.downloadFile(data, 'campaignviews', campaignId);
	          this.isLoadingDownloadList = false;
	          },
	          (error: any) => {
	            this.xtremandLogger.error(error);
	            this.xtremandLogger.errorPage(error);
	            this.isLoadingDownloadList = false;
	          },
	          () => this.xtremandLogger.info("download completed")
	        );
	    } catch (error) {
	      this.xtremandLogger.error(error, "ManageContactsComponent", "downRegularVideoCampaignViews()");
	      this.isLoadingDownloadList = false;
	    }
	  
	  
	 /* try {
    if(this.campaignType === 'REGULAR' || this.campaignType === 'VIDEO'){
    	this.campaignTotalViewsPagination.campaignType = this.campaignType;
    }
      this.campaignTotalViewsPagination.maxResults = this.campaignReport.emailSentCount;
      this.campaignService.listCampaignViews(campaignId, this.campaignTotalViewsPagination, this.isChannelCampaign, this.isSmsServiceAnalytics)
        .subscribe(
          data => {
            this.campaignTotalViewsData = data.campaignviews;
            this.downloadEmailLogs();
          },
          error => console.log(error),
          () => console.log()
        );
    } catch (error) { this.xtremandLogger.error('error' + error); } */
  }

  getCampaignUsersWatchedTotalInfo(countryCode, totalRecord: number) {
    try {
      this.campaignsWorldMapPagination.maxResults = totalRecord;
      this.campaignService.getCampaignUsersWatchedInfo(this.campaignId, this.countryCode, this.campaignsWorldMapPagination)
        .subscribe(
          (data: any) => {
            console.log(data);
            this.worldMapUserTotalData = data.data;
            this.downloadEmailLogs();
          },
          error => this.xtremandLogger.error('error' + error),
          () => console.log('finished')
        );
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  downloadFunctionality() {
    this.isLoadingDownloadList = true;
    if (this.downloadTypeName === 'donut') {
      this.totalCampaignViewsDonut(this.donultModelpopupTitle, this.pagination.totalRecords);
    } else if (this.downloadTypeName === 'emailAction') {
      this.emailActionTotalList(this.campaignId, this.actionType, this.emailActionListPagination.totalRecords);
    } else if (this.downloadTypeName === 'usersWatchedList') {
      this.usersWatchTotalList(this.campaignId, this.usersWatchListPagination.totalRecords);
    } else if (this.downloadTypeName === 'campaignViews' || this.downloadTypeName === 'sentEmails') {
    	this.checkDownLoadAccess(this.downloadTypeName);
    } else if (this.downloadTypeName === 'worldMap') {
      this.getCampaignUsersWatchedTotalInfo(this.countryCode, this.pagination.totalRecords);
    } else if (this.downloadTypeName === 'rsvp') {
    	this.checkDownLoadAccess(this.downloadTypeName);
    }
  }
  
  downloadCampaignDetailsByActionType(actionType: String) {
      this.hasCampaignListViewOrAnalyticsOrDeleteAccess().subscribe(
          data => {
              if (data) {
                  try {
                      this.campaignService.downloadCampaignDetailsByActionType(this.campaignId, this.actionType)
                          .subscribe(
                          data => {
                        	  let name = '';
                        	  if(this.actionType === 'recipients'){
                        		  name = 'Recipients_Details';
                        	  }else if(this.actionType === 'sent'){
                        		  name = 'Sent_Emails_Details';
                        	  }else if(this.actionType === 'deliverability'){
                        		  name = 'Delivered_Emails_Details';
                        	  }else if(this.actionType === 'hardbounce'){
                        		  name = 'HardBounce_Emails_Details';
                        	  }else if(this.actionType === 'softbounce'){
                        		  name = 'SoftBounce_Emails_Details';
                        	  }else if(this.actionType === 'unsubscribe'){
                        		  name = 'Unsubscribed_Users_Details';
                        	  }else if(this.actionType === 'views'){
                        		  name = 'Campaign_Video_Views_Details';
                        	  }else if(this.actionType === 'open'){
                        		  name = 'Email_Opened_Details';
                        	  }else if(this.actionType === 'click'){
                        		  name = 'Email_Clicked_Details';
                        	  }
                              this.downloadFile(data, name, this.campaignId);
                              this.isLoadingDownloadList = false;
                          },
                          (error: any) => {
                              this.xtremandLogger.error(error);
                              this.xtremandLogger.errorPage(error);
                              this.isLoadingDownloadList = false;
                          },
                          () => this.xtremandLogger.info("download completed")
                          );
                  } catch (error) {
                      this.xtremandLogger.error(error, "AnalyticsComponent", "downloadCampaignDetailsByActionType()");
                      this.isLoadingDownloadList = false;
                  }
              } else {
                  this.authenticationService.forceToLogout();
              }
          }
      );
  }
  
  checkDownLoadAccess(downloadTypeName: any) {
      this.hasCampaignListViewOrAnalyticsOrDeleteAccess().subscribe(
          data => {
              if (data) {
                  if (this.downloadTypeName === 'rsvp') {
                      this.downloadEmailLogs();
                  } else if (this.downloadTypeName === 'campaignViews' || this.downloadTypeName === 'sentEmails') {
                      this.listTotalCampaignViews(this.campaignId);
                  }
              } else {
                  this.authenticationService.forceToLogout();
              }
          }
      );
}

  downloadEmailLogs() {
    try {
      this.loading = true;
      if (this.downloadTypeName === 'donut') {
        /* this.logListName = 'Campaign_Views_Logs.csv';*/
        this.logListName = this.donultModelpopupTitle + '_Views_Logs.csv';
        this.downloadCsvList = this.totalListOfemailLog;
      } else if (this.downloadTypeName === 'emailAction') {
        this.logListName = 'Email_Action_Logs_'+ this.campaignId +'.csv';
        this.downloadCsvList = this.campaignReport.totalEmailActionList;
      } else if (this.downloadTypeName === 'usersWatchedList') {
        this.logListName = 'Users_watched_Logs.csv';
        this.downloadCsvList = this.campaignReport.totalWatchedList;
      } else if (this.downloadTypeName === 'campaignViews') {
        this.logListName = 'Campaign_report_logs.csv';
        this.downloadCsvList = this.campaignTotalViewsData;
      } else if (this.downloadTypeName === 'sentEmails') {
        this.logListName = 'Sent_Emails_logs.csv';
        this.downloadCsvList = this.campaignTotalViewsData;
      } else if (this.downloadTypeName === 'worldMap') {
        this.logListName = 'World_Map_logs.csv';
        this.downloadCsvList = this.worldMapUserTotalData;
      } else if (this.downloadTypeName === 'rsvp') {
        if (this.rsvpResposeType === 'email open') {
          this.logListName = 'People who opened email log.csv';
        } else {
          this.logListName = this.rsvpResposeType + ' RSVPs.csv';
          if (this.rsvpResposeType === "NOTYET") {
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
        let latestView;
        if (this.downloadCsvList[i].latestView) {
          latestView = new Date(this.downloadCsvList[i].latestView);
        } else {
          latestView = null;
        }

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
          object["Views"] = this.downloadCsvList[i].viewsCount;
          object["Platform"] = this.downloadCsvList[i].os;
          var text = this.downloadCsvList[i].location;
          var res = text.split(",", 3);
          object["City"] = res[0];
          object["State"] = res[1];
          object["Country"] = res[2];

        }

        if (this.downloadTypeName === 'campaignViews') {
          object["Campaign Name"] = this.downloadCsvList[i].campaignName;
          if (this.campaignType === 'REGULAR' || this.campaignType === 'VIDEO' ) {
        	  object["URLs Clicked Count"] = this.downloadCsvList[i].urlsClickedCount;
          }
          if (this.campaignType === 'VIDEO') {
              object["Email Opened Count"] = this.downloadCsvList[i].emailOpenedCount;
          }
          if (this.campaignType === 'EVENT') {
            if (this.isChannelCampaign) {
              object["Invites"] = this.downloadCsvList[i].rsvpMap.totalInvities;
              object["Opened"] = this.downloadCsvList[i].rsvpMap.emailOpenedCount;
              object["Yes"] = this.downloadCsvList[i].rsvpMap.YES;
              object["No"] = this.downloadCsvList[i].rsvpMap.NO;
              object["Maybe"] = this.downloadCsvList[i].rsvpMap.MAYBE;
              object["Not Yet"] = this.downloadCsvList[i].rsvpMap.notYetResponded;
              object["Total Guests"] = this.downloadCsvList[i].rsvpMap.additionalCount;
            } else {
              object["Response Type"] = this.downloadCsvList[i].rsvpMap.responseType;
              object["Total Guests"] = this.downloadCsvList[i].rsvpMap.additionalCount;
            }
          } else if (this.campaignType === 'SOCIAL') {

            if (latestView != null) {
              let lastviewHours = this.referenceService.formatAMPM(latestView);
              object["Latest View"] = latestView.toDateString().split(' ').slice(1).join(' ') + ' ' + lastviewHours;
            } else {
              object["Latest View"] = ' ';
            }

            object["Redistributed Count"] = this.downloadCsvList[i].viewsCount;
          } else {
            let hours = this.referenceService.formatAMPM(sentTime);
            object["Sent Time"] = sentTime.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;

            if (latestView != null) {
              let lastviewHours = this.referenceService.formatAMPM(latestView);
              object["Latest View"] = latestView.toDateString().split(' ').slice(1).join(' ') + ' ' + lastviewHours;
            } else {
              object["Latest View"] = ' ';
            }

            object["Total Views"] = this.downloadCsvList[i].viewsCount;
          }
        }

        if (this.downloadTypeName === 'sentEmails') {
          object["Campaign Name"] = this.downloadCsvList[i].campaignName;
          let hours = this.referenceService.formatAMPM(sentTime);
          object["Sent Time"] = sentTime.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
        }

        if (this.downloadTypeName === 'usersWatchedList') {
          let srtHours = this.referenceService.formatAMPM(startTime);
          object["START DURATION"] = startTime.toDateString().split(' ').slice(1).join(' ') + ' ' + srtHours;
          let endHours = this.referenceService.formatAMPM(endTime);
          object["STOP DURATION"] = endTime.toDateString().split(' ').slice(1).join(' ') + ' ' + endHours;
          /*object["IP ADDRESS"] = this.downloadCsvList[i].ipAddress;*/
          object["PLATFORM"] = this.downloadCsvList[i].os[0].toUpperCase() + this.downloadCsvList[i].os.substr(1).toLowerCase();
          object["CITY"] = this.downloadCsvList[i].city;
          object["STATE"] = this.downloadCsvList[i].state;
          object["COUNTRY"] = this.downloadCsvList[i].country;
        }

        if (this.downloadTypeName === 'emailAction') {
          if (this.campaignReport.emailActionType === 'click') {
            if (this.downloadCsvList[i].url) {
              object["Most Recent Url"] = this.downloadCsvList[i].url;
            } else {
              object["Most Recent Url"] = "Clicked on the video thumbnail";
            }
          } else {
            object["Email subject"] = this.downloadCsvList[i].subject;
          }
          let hours = this.referenceService.formatAMPM(date);
          object["Latest Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
        }

        if (this.downloadTypeName === 'worldMap') {
          let hours = this.referenceService.formatAMPM(date);
          object["Date and Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
          object["Device"] = this.downloadCsvList[i].deviceType;

          var text = this.downloadCsvList[i].location;
          var res = text.split(",", 3);
          object["City"] = res[0];
          object["State"] = res[1];
          object["Country"] = res[2];
        }

        if (this.downloadTypeName === 'rsvp') {
          if (this.rsvpResposeType === 'email open') {
            object["Campaign Name"] = this.downloadCsvList[i].campaignName;
            object["Subject"] = this.downloadCsvList[i].subject;
            let hours = this.referenceService.formatAMPM(date);
            object["Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
          } else {
            if (this.paginationType != 'invities' && this.paginationType != 'NOTYET' && this.paginationType != 'email not open') {
              object["Message"] = this.downloadCsvList[i].message;
              let hours = this.referenceService.formatAMPM(responseTime);
              object["Most recent"] = responseTime.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
              if (this.paginationType === 'YES') {
                object["Guests"] = this.downloadCsvList[i].additionalCount;
              }
            }
          }
        }

        this.downloadDataList.push(object);
      }

      this.referenceService.isDownloadCsvFile = true;
      this.loading = false;
      this.isLoadingDownloadList = false;
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  showEmailTemplatePreview(emailTemplate: any) {
    try {
      this.ngxloading = true;
      var tempalteObject;
      var campaign: any;
      if (this.campaignType === "EVENT") {
        tempalteObject = this.eventCampaign.emailTemplateDTO;
        campaign = this.eventCampaign;
      } else {
        tempalteObject = emailTemplate;
        campaign = this.campaign;
      }

      let userId = 0;
      if (this.campaign.nurtureCampaign) {
        userId = this.campaign.parentCampaignUserId;
      } else {
        userId = this.campaign.userId;
      }
      this.emailTemplateService.getAllCompanyProfileImages(userId).subscribe(
        (data: any) => {
          let body = tempalteObject.body;
          let self = this;
          /* $.each( data, function( index, value ) {
               body = body.replace( value, self.authenticationService.MEDIA_URL + campaign.companyLogo );
           } );
           body = body.replace( "https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + campaign.companyLogo );*/
          if (this.campaign.nurtureCampaign) {
            body = body.replace(this.senderMergeTag.aboutUsGlobal, this.campaign.myMergeTagsInfo.aboutUs);
            $.each(data, function (index, value) {
              body = body.replace(value, self.authenticationService.MEDIA_URL + self.campaign.companyLogo);
            });
            body = body.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.campaign.companyLogo);
          } else {
            $.each(data, function (index, value) {
              body = body.replace(value, self.authenticationService.MEDIA_URL + self.referenceService.companyProfileImage);
            });
            body = body.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage);
          }


          /* if(!this.campaign.channelCampaign && !this.campaign.nurtureCampaign){
               body = body.replace(this.senderMergeTag.aboutUsGlobal,"");
           }*/
          if (!this.campaign.channelCampaign && !this.campaign.nurtureCampaign) {
            body = body.replace(this.senderMergeTag.aboutUsGlobal, "");
          }
          tempalteObject.body = body;
          this.referenceService.previewEmailTemplate(tempalteObject, campaign);
          this.ngxloading = false;
        },
        error => { this.xtremandLogger.error("error in getAllCompanyProfileImages(" + userId + ")", error); },
        () => this.xtremandLogger.info("Finished getAllCompanyProfileImages()"));
    } catch (error) { this.xtremandLogger.error(error); }
  }

  previewVideo(videoFile: any) {
    try {
      this.loading = true;
      setTimeout(() => { this.loading = false; this.videoFile = videoFile; }, 600);
    } catch (error) { this.xtremandLogger.error(error); }
  }

  closeModal(event: any) {
    console.log('closed modal' + event);
    this.videoFile = undefined;
  }
  showContactListModal() {
    if (this.campaingContactLists) {
      this.loading = true;
      this.getListOfContacts(this.campaingContactLists[0].id);
    } else {
      this.contactListDeleteError = true;
    }
  }
  
  getSelectedListOfContacts(id: number) {
	  this.contactListInfoPagination = new Pagination();
	  this.contactListInfoPagination.pageIndex= 1;
	  this.contactListInfoPagination.maxResults = 12;
	  this.getListOfContacts(id);
  }
  getListOfContacts(id: number) {
    try {
      this.contactListId = id;
      this.campaignService.loadUsersOfContactList(id, this.campaignId, this.contactListInfoPagination).subscribe(
        data => {
          this.campaingContactListValues = data.listOfUsers;
          this.loading = false;
          this.contactListInfoPagination.totalRecords = data.totalRecords;
          this.contactListInfoPagination = this.pagerService.getPagedItems(this.contactListInfoPagination, this.campaingContactListValues);
          $("#show_contact-list-info").modal('show');
        },
        (error: any) => { this.xtremandLogger.error('error' + error); })
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  getSortedResult(campaignId: number, event: any) {
    this.emailActionListPagination = this.utilService.sortOptionValues(event, this.emailActionListPagination);
    this.emailActionList(campaignId, this.campaignReport.emailActionType, this.emailActionListPagination);
  }

  listEmailLogsByCampaignIdUserIdActionType(emailLog: EmailLog, actionType: string) {
    this.campaignReport.emailLogs.forEach((element) => {
      if (element.userId !== emailLog.userId) {
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


  sendEmailNotOpenReminder(details: any) {
    this.isOpenNotificationModal = true;
    this.selectedEmailNotOpenUserId = details.userId;
  }

  emailNotOpenReminderDate(event: any) {
    this.isOpenNotificationModal = false;
    if (event === "Success") {
      this.customResponse = new CustomResponse('SUCCESS', "Reminder has been sent successfully", true);
    }
  }

  eventHandler(keyCode: any) {
    if (keyCode === 13) {
      this.search();
    }
  }

  campaignViewSortBy(event: any){
    this.selectedCampaignSortedOption = event;
    const sortedValue = this.selectedCampaignSortedOption.value;
    if ( sortedValue !== '' ) {
        const options: string[] = sortedValue.split( '-' );
        this.sortcolumn = options[0];
        this.sortingOrder = options[1];
    } else {
        this.sortcolumn = null;
        this.sortingOrder = null;
    }

        this.campaignViewsPagination.pageIndex = 1;
        this.campaignViewsPagination.sortcolumn = this.sortcolumn;
        this.campaignViewsPagination.sortingOrder = this.sortingOrder;
        this.listCampaignViews(this.campaign.campaignId, this.campaignViewsPagination);

  }

  search() {

    if (this.paginationType == 'campaignViews' || this.paginationType == 'sentEmailData') {
      this.campaignViewsPagination.searchKey = this.searchKey;
      this.campaignViewsPagination.pageIndex = 1;
      this.listCampaignViews(this.campaignId, this.campaignViewsPagination);
    } else if (this.paginationType == 'coutrywiseUsers') {
      this.pagination.searchKey = this.searchKey;
      this.pagination.pageIndex = 1;
      this.getCampaignUsersWatchedInfo(this.countryCode);
    } else if (this.paginationType == 'emailAction') {
      this.emailActionListPagination.searchKey = this.searchKey;
      this.emailActionListPagination.pageIndex = 1;
      this.emailActionList(this.campaignId, this.campaignReport.emailActionType, this.emailActionListPagination);
    } else if (this.paginationType == 'usersWatch') {
      this.pagination.searchKey = this.searchKey;
      this.pagination.pageIndex = 1;
      this.usersWatchList(this.campaignId, this.pagination);
    } else if (this.paginationType == 'donutCampaign') {
      this.pagination.searchKey = this.searchKey;
      this.pagination.pageIndex = 1;
      this.campaignViewsDonut(this.donultModelpopupTitle);
    } else if (this.paginationType == 'invities') {
      this.rsvpDetailAnalyticsPagination.searchKey = this.searchKey;
      this.rsvpDetailAnalyticsPagination.pageIndex = 1;
      this.getRsvpInvitiesDetails();
    } else if (this.paginationType == 'email open') {
      this.rsvpDetailAnalyticsPagination.searchKey = this.searchKey;
      this.rsvpDetailAnalyticsPagination.pageIndex = 1;
      this.getRsvpEmailOpenDetails();
    } else if (this.paginationType === 'YES' || this.paginationType === 'NO' || this.paginationType === 'MAYBE' || this.paginationType === 'NOTYET') {
      this.rsvpDetailAnalyticsPagination.searchKey = this.searchKey;
      this.rsvpDetailAnalyticsPagination.pageIndex = 1;
      this.getRsvpDetails(this.rsvpResposeType);
    } else if (this.paginationType === 'email not open') {
      this.rsvpDetailAnalyticsPagination.searchKey = this.searchKey;
      this.rsvpDetailAnalyticsPagination.pageIndex = 1;
      this.getRsvpEmailNotOpenDetails();
    }else if (this.paginationType == 'emailActionDetails') {
        this.emailActionDetailsPagination.searchKey = this.searchKey;
        this.emailActionDetailsPagination.pageIndex = 1;
        this.emailActionDetails(this.campaignId, this.actionType, this.emailActionDetailsPagination);
      }

  }


  ngOnInit() {
    try {
     this.checkParentAndRedistributedCampaignAccess();
    } catch (error) { 
      this.hasClientError = true; 
      this.mainLoader = false; 
      this.xtremandLogger.error('error' + error); 
    }
  }

checkParentAndRedistributedCampaignAccess(){
  this.mainLoader = true;
  let campaignId= this.campaignId;
  this.campaignService.parentAndRedistributedCampaignAccess(campaignId).subscribe
  ( data =>{
      if(data.statusCode==200){
        this.downloadTypeName = this.paginationType = 'campaignViews';
        this.emailActionListPagination.pageIndex = 1;
        this.emailActionDetailsPagination.pageIndex = 1;
        this.usersWatchListPagination.pageIndex = 1;
        this.getCompanyId();
        this.getCampaignById(this.campaignId);
        this.pagination.pageIndex = 1;
        if (this.isTimeLineView === true) {
          this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination);
        }
        setTimeout(() => { this.mainLoader = false; }, 3000);
      }else{
        this.referenceService.goToPageNotFound();
      }
  },error=>{
    this.xtremandLogger.errorPage( error );
  });
}

  ngOnDestroy() {
    this.paginationType = '';
    this.contactListDeleteError = false;
    $('#worldMapModal').modal('hide');
    $('#email_template_preivew').modal('hide');
    $('#show_contact-list-info').modal('hide');
    $('#usersWatchListModal').modal('hide');
    $('#emailActionListModal').modal('hide');
    $('#emailSentListModal').modal('hide');
    $('#donutModelPopup').modal('hide');
    $('#email_template_preivew').modal('hide');
    $('#show_contact-list-info').modal('hide');
    $('#scrModal').modal('hide');
    $('#emailActionDetailsModal').modal('hide');
    $('#leadFormModel').modal('hide');
  }

  showLandingPagePreview(campaign: Campaign) {
    if (campaign.nurtureCampaign) {
      campaign.landingPage.showPartnerCompanyLogo = true;
      if (campaign.userId == this.loggedInUserId) {
        campaign.landingPage.partnerId = this.loggedInUserId;
      } else {
        campaign.landingPage.partnerId = campaign.userId;
      }
    } else {
      if (campaign.enableCoBrandingLogo) {
        campaign.landingPage.showYourPartnersLogo = true;
      } else {
        campaign.landingPage.showYourPartnersLogo = false;
      }
    }
    this.previewLandingPageComponent.showPreview(campaign.landingPage);
  }
  goToCampaignLandingPageAnalytics(campaignId: number) {
    this.router.navigate(['home/pages/' + campaignId + '/campaign/analytics']);
  }

  showAutoResponseAnalytics(campaign: any, selectedIndex: number) {
    this.autoResponseAnalyticsPagination = new Pagination();
    $.each(this.campaignViews, function (index, row) {
      if (selectedIndex != index) {
        row.expanded = false;
      }
    });
    campaign.expanded = !campaign.expanded;
    if (campaign.expanded) {
      this.listAutoResponseAnalytics(this.autoResponseAnalyticsPagination, campaign);
    }
  }


  listAutoResponseAnalytics(pagination: Pagination, campaign: any) {
    this.referenceService.loading(this.autoResponeAnalyticsLoader, true);
    this.autoResponseAnalyticsPagination.campaignId = campaign.campaignId;
    this.autoResponseAnalyticsPagination.userId = campaign.userId;
    this.campaignService.listAutoResponseAnalytics(pagination)
      .subscribe(
        response => {
          let data = response.data;
          pagination.totalRecords = data.totalRecords;
          let analyticsList = data.data;
          $.each(analyticsList, function (index, autoResponse) {
            autoResponse.displayTime = new Date(autoResponse.sentTimeUtcString);
            if (autoResponse.openedTimeUtcString != "-") {
              autoResponse.openedTime = new Date(autoResponse.openedTimeUtcString);
            }
          });
          pagination = this.pagerService.getPagedItems(pagination, analyticsList);
          this.referenceService.loading(this.autoResponeAnalyticsLoader, false);
        },
        error => {
          swal("Oops! Something went wrong", "Please try after sometime", "error");
          this.referenceService.loading(this.autoResponeAnalyticsLoader, false);
        },
        () => this.xtremandLogger.info("Finished showAutoResponseAnalytics()")
      );
  }

  setAutoResponsesPage(event: any, campaign: any) {
    this.autoResponseAnalyticsPagination.pageIndex = event.page;
    this.listAutoResponseAnalytics(this.autoResponseAnalyticsPagination, campaign);
  }

  getSmsSentCount(campaignId: number) {
    try {
      this.loading = true;
      this.campaignService.getSmsSentCount(campaignId)
        .subscribe(
          data => {
            this.campaignReport.smsSentCount = data.sms_sent_count;
            this.loading = false;
          },
          error => console.log(error),
          () => {
            this.listCampaignViews(campaignId, this.campaignViewsPagination);
          }
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  getSmsSentSuccessCount(campaignId: number) {
    try {
      this.loading = true;
      this.campaignService.getSmsSentSuccessCount(campaignId)
        .subscribe(
          data => {
            this.campaignReport.smsSentSuccessCount = data.sms_sent__success_count;
            this.loading = false;
          },
          error => console.log(error),
          () => {
            this.listCampaignViews(campaignId, this.campaignViewsPagination);
          }
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  getSmsSentFailureCount(campaignId: number) {
    try {
      this.loading = true;
      this.campaignService.getSmsSentFailureCount(campaignId)
        .subscribe(
          data => {
            console.log(data)
            this.campaignReport.smsSentFailureCount = data.sms_sent_failure_count;
            this.loading = false;
          },
          error => console.log(error),
          () => {
            this.listCampaignViews(campaignId, this.campaignViewsPagination);
          }
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  getSmsLogCountByCampaign(campaignId: number) {
    try {
      this.loading = true;
      this.campaignService.getSmsLogCountByCampaign(campaignId)
        .subscribe(
          data => {
            console.log(data);
            this.campaignReport.smsOpenCount = data["sms_opened_count"];
            this.campaignReport.smsClickedCount = data["sms_url_clicked_count"];
            this.loading = false;
          },
          error => console.log(error),
          () => console.log()
        )
    } catch (error) { this.hasClientError = true; this.xtremandLogger.error('error' + error); }
  }


  smslActionList(campaignId: number, actionType: string, pagination: Pagination) {
    try {
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.paginationType = 'emailAction';
      this.campaignService.smsActionList(campaignId, actionType, pagination)
        .subscribe(data => {
          data.forEach((element, index) => { element.time = new Date(element.utcTimeString); });
          this.campaignReport.emailLogs = data;
          this.campaignReport.emailActionType = actionType;
          $('#emailActionListModal').modal();
          if (actionType === 'open') {
            if (this.sortByDropDown.length === 5) {
              this.sortByDropDown.push({ 'name': 'Subject(ASC)', 'value': 'subject-ASC' });
              this.sortByDropDown.push({ 'name': 'Subject(DESC)', 'value': 'subject-DESC' });
            }
            this.emailActionListPagination.totalRecords = this.campaignReport.emailOpenCount;
          } else if (actionType === 'click') {
            this.sortByDropDown = this.sortByDropDown.filter(function (el) { return el.name != "Subject(ASC)"; });
            this.sortByDropDown = this.sortByDropDown.filter(function (el) { return el.name != "Subject(DESC)"; });
            this.emailActionListPagination.totalRecords = this.campaignReport.emailClickedCount;
          }
          this.emailActionListPagination = this.pagerService.getPagedItems(this.emailActionListPagination, this.campaignReport.emailLogs);
          this.emailActionTotalList(campaignId, actionType, this.emailActionListPagination.totalRecords);
          this.loading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
        },
          error => console.log(error),
          () => console.log('emailActionList() completed'))
    } catch (error) { this.xtremandLogger.error('Error in analytics page emails sent' + error); }
  }

  countSmsLogs() {
    try {
      this.loading = true;
      if (this.smsLogs !== undefined) {
        console.log(this.smsLogs)
        for (const i in this.smsLogs) {
          if (this.smsLogs[i].actionId === 13) {
            this.userCampaignReport.smsOpenCount += 1;
          } else if (this.smsLogs[i].actionId === 14 || this.smsLogs[i].actionId === 15) {
            this.userCampaignReport.smsClickedCount += 1;
          }
        }
      }
      this.loading = false;
    } catch (error) { this.xtremandLogger.error('Error in count' + error); }
  }

  listSMSLogsByCampaignAndUser(campaignId: any, userId: any) {
    try {
      this.loading = true;
      this.campaignService.listSMSLogsByCampaignAndUser(campaignId, userId)
        .subscribe(data => {
          data.forEach((element, index) => {
            if (element.time) { element.time = new Date(element.utcTimeString); }
          });
          if (this.campaignType == "SMS")
            this.emailLogs = data;
          else
            this.smsLogs = data;
          this.loading = false;
          console.log(data);
        },
          error => console.log(error),
          () => {
          })
    } catch (error) { this.xtremandLogger.error('Error in analytics page listEmailLogsByCampaignAndUser' + error); }
  }

  listSMSLogsByCampaignAndUserForSmsAnalylics(campaignId: any, userId: any) {
    try {
      this.loading = true;
      this.campaignService.listSMSLogsByCampaignAndUser(campaignId, userId)
        .subscribe(data => {
          data.forEach((element, index) => {
            if (element.time) { element.time = new Date(element.utcTimeString); }
          });
          this.smsLogs = data;
          this.loading = false;
          console.log(data);
        },
          error => console.log(error),
          () => { this.countSmsLogs(); })
    } catch (error) { this.xtremandLogger.error('Error in analytics page listEmailLogsByCampaignAndUser' + error); }
  }
  toggleSmsAnalyticsView(event: string) {
    if (event === 'EMAIL')
      this.isSmsServiceAnalytics = false;
    else
      this.isSmsServiceAnalytics = true;

    this.pagination.pageIndex = 1;

    this.getCampaignUserViewsCountBarCharts(this.campaignId, this.pagination);
  }

  /**************Parnter Public Event Campaign Lead Info**************/
  viewPartnerLeads(item: any) {
    this.inputObject = {};
    this.referenceService.startLoader(this.partnerLeadInfoRequestLoader);
    /* let htmlContent = "#partner-lead-info-content";
     $(htmlContent).empty();
     $('.modal .modal-body').css('overflow-y', 'auto');
     $("#partner-leads-info-modal").modal('show');
     $('.modal .modal-body').css('max-height', $(window).height() * 0.75);*/
    this.isShowPartnerLeads = true;
    let campaignId = item.campaignId;
    let partnerId = item.userId;
    this.campaignService.getRedistributedCampaignIds(partnerId, campaignId).subscribe(
      (response: any) => {
        this.partnerLeadResponeStatus = response.statusCode;
        if (response.statusCode == 200) {
          let redistributedCampaignIds = response.data;
          this.inputObject['formAlias'] = this.campaign.formAlias;
          this.inputObject['isPublicEventLeads'] = true;
          this.inputObject['campaignAlias'] = redistributedCampaignIds[0];
          this.inputObject['title'] = this.leadInfoTitle;
        }
        this.referenceService.stopLoader(this.partnerLeadInfoRequestLoader);
      },
      (error: any) => {
        swal("Please Contact Admin!", "Unable to load data", "error");
        this.referenceService.stopLoader(this.partnerLeadInfoRequestLoader);
        this.xtremandLogger.log(error);
        $("#partner-leads-info-modal").modal('hide');
      });

  }

  getLeadsCount() {
    try {
      this.httpRequestLoader.isLoading = true;
      this.campaignService.getLeadsCount(this.campaignId)
        .subscribe(
          data => {
            console.log(data);
            this.campaignReport.yesLeadCount = data.YES;
            this.campaignReport.noLeadCount = data.NO;
            this.campaignReport.maybeLeadCount = data.MAYBE;
            this.campaignReport.leadAdditionalCount = data.additionalCount;
            this.getEventLeadsDetails('YES');
          },
          (error: any) => {
            this.xtremandLogger.error('error' + error);
            this.httpRequestLoader.isLoading = false;
          })
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  getPartnerLeadsCount(selectedLeadPartnerId: number) {
    this.isShowPartnerLeads = true;
    this.httpRequestLoader.isLoading = true;
    this.referenceService.goToTop();
    this.selectedLeadPartnerId = selectedLeadPartnerId;
    try {
      this.campaignService.getPartnerLeadsCount(this.campaignId, selectedLeadPartnerId)
        .subscribe(
          data => {
            console.log(data);
            this.campaignReport.yesPartnerLeadCount = data.YES;
            this.campaignReport.noPartnerLeadCount = data.NO;
            this.campaignReport.maybePartnerLeadCount = data.MAYBE;
            this.campaignReport.partnerLeadAdditionalCount = data.additionalCount;
            this.getPartnerEventLeadsDetails('YES', this.selectedLeadPartnerId);
          },
          (error: any) => {
            this.xtremandLogger.error('error' + error);
            this.httpRequestLoader.isLoading = false;
          })
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  eventLeadsDetailsSetPage(event: any) {
    this.leadsDetailPagination.pageIndex = event.page;
    this.getEventLeadsDetails(this.leadDetailType);
  }

  eventTotalLeadsDetailsSetPage(event: any) {
    this.totalLeadsDetailPagination.pageIndex = event.page;
    this.getEventTotalLeadsDetails();
  }

  partnerEventLeadsDetailsSetPage(event: any) {
    this.partnerLeadsDetailPagination.pageIndex = event.page;
    this.getPartnerEventLeadsDetails(this.partnerLeadDetailType, this.selectedLeadPartnerId);
  }


  partnerEventLeadsDetailsSetPageDropdown(event: Pagination) {
    this.leadsDetailPagination = event;
    this.getEventLeadsDetails(this.partnerLeadDetailType);
  }

  eventTotalLeadsDetailsSetPageDropdown(event: Pagination) {
    this.totalLeadsDetailPagination = event;
    this.getEventTotalLeadsDetails();
  }

  eventLeadsDetailsSetPageDropdown(event: Pagination) {
    this.leadsDetailPagination = event;
    this.getEventLeadsDetails(this.leadDetailType);
  }


  getEventLeadsDetails(detailType: any) {
    this.leadDetailType = detailType;
    this.leadType = 'eventLeads';
    this.httpRequestLoader.isLoading = true;
    try {
      this.campaignService.getEventLeadsDetails(this.leadsDetailPagination, this.campaignId, this.leadDetailType)
        .subscribe(
          data => {
            console.log(data);
            this.leadsFormHeaders = data.headers;
            this.leadsFormDetails = data.data;
            this.leadsFormDetails.forEach((value) => {
              value['expanded'] = false;
              if (value['RSVP Time UTC String'] != undefined) {
                value['RSVP Time UTC String'] = new Date(value['RSVP Time UTC String']);
              }

            })
            this.leadsDetailPagination.totalRecords = data.totalRecords;
            this.leadsDetailPagination = this.pagerService.getPagedItems(this.leadsDetailPagination, data.data);
            this.httpRequestLoader.isLoading = false;
          },
          (error: any) => {
            this.xtremandLogger.error('error' + error);
            this.httpRequestLoader.isLoading = false;
          })
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  getEventTotalLeadsDetails() {
    this.showRsvpDetails = true;
    this.showTotalLeads = true;
    this.referenceService.detailViewIsLoading = false;
  }


  getPartnerEventLeadsDetails(detailType: any, selectedLeadPartnerId: number) {
    this.leadType = 'partnerLeads';
    this.partnerLeadDetailType = detailType;
    this.httpRequestLoader.isLoading = true;
    try {
      this.campaignService.getPartnerEventLeadsDetails(this.partnerLeadsDetailPagination, this.campaignId, selectedLeadPartnerId, this.partnerLeadDetailType)
        .subscribe(
          data => {
            console.log(data);
            this.partnerLeadsFormHeaders = data.headers;
            this.partnerLeadsFormDetails = data.data;
            this.partnerLeadsFormDetails.forEach((value) => {
              value['expanded'] = false;
              if (value['RSVP Time UTC String'] != undefined) {
                value['RSVP Time UTC String'] = new Date(value['RSVP Time UTC String']);
              }

            })
            this.partnerLeadsDetailPagination.totalRecords = data.totalRecords;
            this.partnerLeadsDetailPagination = this.pagerService.getPagedItems(this.partnerLeadsDetailPagination, data.data);
            this.httpRequestLoader.isLoading = false;
          },
          (error: any) => {
            this.xtremandLogger.error('error' + error);
            this.httpRequestLoader.isLoading = false;
          })
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  leadEventHandler(keyCode: any) {
    if (keyCode === 13) {
      this.leadDetailsSearch();
    }
  }

  leadDetailsSearch() {
    if (this.leadType == 'eventLeads') {
      this.leadsDetailPagination.searchKey = this.leadsSearchKey;
      this.leadsDetailPagination.pageIndex = 1;
      this.getEventLeadsDetails(this.leadDetailType);
    } else {
      this.partnerLeadsDetailPagination.searchKey = this.leadsSearchKey;
      this.partnerLeadsDetailPagination.pageIndex = 1;
      this.getPartnerEventLeadsDetails(this.partnerLeadDetailType, this.selectedLeadPartnerId);
    }
  }

  expandColumns(selectedFormDataRow: any, selectedIndex: number) {

    if (this.leadType = 'eventLeads') {

      $.each(this.leadsFormDetails, function (index, row) {
        if (selectedIndex != index) {
          row.expanded = false;
          $('#form-data-row-' + index).css("background-color", "#fff");
        }
      });

    } else {
      $.each(this.partnerLeadsFormDetails, function (index, row) {
        if (selectedIndex != index) {
          row.expanded = false;
          $('#form-data-row-' + index).css("background-color", "#fff");
        }
      });
    }


    selectedFormDataRow.expanded = !selectedFormDataRow.expanded;
    if (selectedFormDataRow.expanded) {
      $('#form-data-row-' + selectedIndex).css("background-color", "#d3d3d357");
    } else {
      $('#form-data-row-' + selectedIndex).css("background-color", "#fff");
    }

  }
  hasCampaignListViewOrAnalyticsOrDeleteAccess() {
      try {
          return  this.campaignService.hasCampaignListViewOrAnalyticsOrDeleteAccess()
              .map(
              data => {
                  if(data.access){
                      return true;
                  }else{
                       return false;
                  }
              }
              );
      } catch (error) {
          this.xtremandLogger.error(error, "AddPartnersComponent", "hasAccess()");
      }
  }
  
  downloadLeadList() {
      this.hasCampaignListViewOrAnalyticsOrDeleteAccess().subscribe(
          data => {
              if (data) {
                  try {
                      this.isLeadListDownloadProcessing = true;
                      this.campaignService.downloadLeadList(this.campaignId, this.leadDetailType)
                          .subscribe(
                          data => this.downloadFile(data, this.leadDetailType, 'lead'),
                          (error: any) => {
                              this.xtremandLogger.error(error);
                              this.xtremandLogger.errorPage(error);
                              this.isLeadListDownloadProcessing = false;
                          },
                          () => this.xtremandLogger.info("download completed")
                          );
                  } catch (error) {
                      this.xtremandLogger.error(error, "ManageContactsComponent", "downloadList()");
                      this.isLeadListDownloadProcessing = false;
                  }

              } else {
                  this.authenticationService.forceToLogout();
              }
          }
      );
  }

  downloadPartnerLeadList() {
    try {
      this.isLeadListDownloadProcessing = true;
      this.campaignService.downloadPartnerLeadList(this.campaignId, this.selectedLeadPartnerId, this.partnerLeadDetailType)
        .subscribe(
          data => {
            this.downloadFile(data, this.partnerLeadDetailType, 'partner_lead');
          },
          (error: any) => {
            this.xtremandLogger.error(error);
            this.xtremandLogger.errorPage(error);
            this.isLeadListDownloadProcessing = false;
          },
          () => this.xtremandLogger.info("download completed")
        );
    } catch (error) {
      this.xtremandLogger.error(error, "AnalyticsComponent", "downloadLeadList()");
      this.isLeadListDownloadProcessing = false;
    }
  }

  downloadFile(data: any, selectedleadType: any, name: any) {
    let parsedResponse = data.text();
    let blob = new Blob([parsedResponse], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, 'UserList.csv');
    } else {
      let a = document.createElement('a');
      a.href = url;
      a.download = selectedleadType + "_" + name + ' List.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
    this.isLeadListDownloadProcessing = false;
  }

  clearLeadValues() {
    this.leadsFormHeaders = [];
    this.leadsFormDetails = [];
  }

  clearPartnerleadValues() {
    this.partnerLeadsFormHeaders = [];
    this.partnerLeadsFormDetails = [];
  }

  closePartnerLeadPage() {
    this.isShowPartnerLeads = false;
    this.leadType = 'eventLeads';
    this.leadsSearchKey = '';
    this.clearPartnerleadValues();
  }

  /************Data Share Clicked Url Analtyics For Vendor(Sravan)*****************/
  showClickedUrlsForVendor(){
    this.clickedUrlsVendorAnalyticsComponent.showPopup(this.campaignId);
  }

  downloadReport(){

    let headers = [];

    if(this.campaignType=="REGULAR"){
      headers = ['Campaign Name', 'Campaign Type', 'No of List(s) Used', 'Recipients', 'Total Emails Sent',  'Deliverability',
                 'Active Recipients', 'Open Rate','Clicked URL' , 'Clickthrough Rate','HardBounce', 'SoftBounce','Unsubscribe','Leads', 'Deals'];
    }else{
      headers = ['Campaign Name', 'Campaign Type', 'No of List(s) Used', 'Recipients', 'Total Emails Sent',  'Deliverability',
                 'Active Recipients', 'Open Rate','Clicked URL' , 'Clickthrough Rate','Views','HardBounce', 'SoftBounce','Unsubscribe','Leads', 'Deals'];
    }

    var data = [
      {
        campaignName:  this.campaign.campaignName,
        campaignType: this.campaignType +" CAMPAIGN",
       // campaignLaunchTime: $.trim($('#campaign-launch-time').text()),
        contactListLength: this.campaign.userListIds.length,
        recipientsCount: this.campaignReport.totalRecipients,
        sentCount : this.campaignReport.emailSentCount,
        delivered : this.campaignReport.delivered,
        activeRecipients : this.campaignReport.activeRecipients, 
        openRate: this.campaignReport.openRate,
        clickedUrlsCount:this.campaignReport.emailClickedCount,
        clickthroughRate :this.campaignReport.clickthroughRate,
        hardBounce : this.campaignReport.hardBounce,
        softBounce : this.campaignReport.softBounce,
        unsubscribed : this.campaignReport.unsubscribed,
        leads:this.campaignReport.leadCount,
        deals:this.campaignReport.dealCount
      }
    ];

    var videoCampaignData = [{
        campaignName:  this.campaign.campaignName,
        campaignType: this.campaignType +" CAMPAIGN",
       // campaignLaunchTime: $.trim($('#campaign-launch-time').text()),
        contactListLength: this.campaign.userListIds.length,
        recipientsCount: this.campaignReport.totalRecipients,
        sentCount : this.campaignReport.emailSentCount,
        delivered : this.campaignReport.delivered,
        activeRecipients : this.campaignReport.activeRecipients, 
        openRate: this.campaignReport.openRate,
        clickedUrlsCount:this.campaignReport.emailClickedCount,
        clickthroughRate :this.campaignReport.clickthroughRate,
        viewsCount:this.campaignReport.usersWatchCount,
        hardBounce : this.campaignReport.hardBounce,
        softBounce : this.campaignReport.softBounce,
        unsubscribed : this.campaignReport.unsubscribed,
        leads:this.campaignReport.leadCount,
        deals:this.campaignReport.dealCount
    }
      

    ];

    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: headers
    };
    if(this.campaignType=="REGULAR"){
      new Angular2Csv(data, this.campaign.campaignName, options);
    }else{
      new Angular2Csv(videoCampaignData, this.campaign.campaignName, options);
    }
    
  }

goToCampaignAnaltyics(item:any){
  if(this.showUserLevelCampaignAnalytics){
    this.loading = true;
    let prefixUrl = "/home/campaigns/user-campaigns/";
    let suffixUrl =  item.userId+"/b"+"/"+item.campaignId;
    if(this.campaign.channelCampaign){
      this.referenceService.goToRouter(prefixUrl + "/p/" +suffixUrl);
    }else{
      this.referenceService.goToRouter(prefixUrl + "/c/" + suffixUrl);
    }
  }
}

showCampaignLeads() {
  this.showLeads = true;
}

closeCampaignLeads() {
  this.showLeads = false;
  this.customResponse.isVisible = false;
  if (this.campaignType != 'SMS') {
    this.getCampaignHighLevelAnalytics(this.campaignId);
  }
}

showCampaignDeals() {
  this.showDeals = true;
}

closeCampaignDeals() {
  this.showDeals = false;
  this.customResponse.isVisible = false;
  if (this.campaignType != 'SMS') {
    this.getCampaignHighLevelAnalytics(this.campaignId);
  }
}

viewCampaignLeadForm(leadId: any) {
    this.showLeadForm = true;
    this.leadId = leadId;
    this.leadActionType = "view";

  }

  editCampaignLeadForm(leadId: any) {
    this.showLeadForm = true;
    this.leadActionType = "edit";
    this.leadId = leadId;
  }
    
  closeLeadsForm() {
    this.showLeadForm = false;        
  }

  showSubmitLeadSuccess() {
    this.showLeadForm = false;
    this.customResponse = new CustomResponse('SUCCESS', "Lead Submitted Successfully", true);  
    if (this.leadActionType == "edit") {
      this.refreshCampaignLeadsSubject.next(true);
    }  
  }

  registerDealForm(leadId: any) {
    this.showDealForm = true;
    this.dealActionType = "add";
    this.leadId = leadId;
  }  

  viewCampaignDealForm(dealId: any) {
    this.showDealForm = true;   
    this.dealActionType = "view";
    this.dealId = dealId;
    
  }

  editCampaignDealForm(dealId: any) {
    this.showDealForm = true;   
    this.dealActionType = "edit";
    this.dealId = dealId;
  }

  closeDealForm() {
    this.showDealForm = false;    
  }
    
  showSubmitDealSuccess() {
    this.showDealForm = false;
    this.customResponse = new CustomResponse('SUCCESS', "Deal Submitted Successfully", true);    
  }

  showComments(lead: any) {
    this.selectedLead = lead;
    this.selectedDeal = null;
    this.isCommentSection = !this.isCommentSection;
  }

  showDealComments(deal: any) {
    this.selectedDeal = deal;
    this.selectedLead = null;
    this.isCommentSection = !this.isCommentSection;
  }

  addCommentModalClose(event: any) {
    if (this.selectedLead != null) {
      this.selectedLead.unReadChatCount = 0;
    }

    if (this.selectedDeal != null) {
      this.selectedDeal.unReadChatCount = 0;
    }
    
    this.isCommentSection = !this.isCommentSection;
  }

  refreshCounts() {
    this.customResponse.isVisible = false;
  }
  
  getCompanyId() {
      this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
          (result: any) => {
              this.loggedInUserCompanyId = result;
          }, (error: any) => {
              this.xtremandLogger.error(error);
              this.xtremandLogger.errorPage(error);
          }
      );
	  }

}

