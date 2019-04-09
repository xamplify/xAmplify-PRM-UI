import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { UtilService } from '../../core/services/util.service';
import { Pagination } from '../../core/models/pagination';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { DealRegistrationService } from '../services/deal-registration.service';
import { Campaign } from '../../campaigns/models/campaign';
import { DealRegistration } from '../models/deal-registraton';
import { User } from '../../core/models/user';
import { CampaignReport } from '../../campaigns/models/campaign-report';
import { SocialCampaign } from '../../social/models/social-campaign';
import { SocialStatus } from '../../social/models/social-status';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Tweet } from '../../social/models/tweet';
import { PagerService } from '../../core/services/pager.service';
import { ContactService } from '../../contacts/services/contact.service';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { SocialService } from '../../social/services/social.service';
import { TwitterService } from '../../social/services/twitter.service';
import { CustomResponse } from '../../common/models/custom-response';
import { EmailLog } from '../../campaigns/models/email-log';
declare var $, Highcharts: any;
@Component({
  selector: 'app-deal-analytics',
  templateUrl: './deal-analytics.component.html',
  styleUrls: ['../../campaigns/analytics/analytics.component.css']
})
export class DealAnalyticsComponent implements OnInit
{

  isTimeLineView: boolean;


  campaignViewsPagination: Pagination = new Pagination();


  campaignType: string;
  campaignId: number;
  maxViewsValue: number;
  barChartCliked = false;


  paginationType: string;

  loading = false;
  mainLoader = false;

  sortByDropDown = [
    { 'name': 'Sort By', 'value': '' },
    { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
    { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
    { 'name': 'Time(ASC)', 'value': 'time-ASC' },
    { 'name': 'Time(DESC)', 'value': 'time-DESC' }
  ];
  public selectedSortedOption: any = this.sortByDropDown[this.sortByDropDown.length - 1];
  dealButtonText = "View Lead";
  isDealRegistration = false;
  @Input()
  dealId: any;
  deal: DealRegistration;
  @Input()
  lead: any;

  user: User;

  @Input()
  selectedcampaign: any;

  campaign: Campaign;

  @Output() isDealAnalytics = new EventEmitter<any>();
  dealStatus: any;
  @Output() dealObj = new EventEmitter<any>();



  isChannelCampaign = true;
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

  contactListInfoPagination: Pagination = new Pagination();
  emailActionListPagination: Pagination = new Pagination();
  usersWatchListPagination: Pagination = new Pagination();
  emailLogPagination: Pagination = new Pagination();
  campaignTotalViewsPagination: Pagination = new Pagination();
  campaignsWorldMapPagination: Pagination = new Pagination();
  userWatchedReportPagination: Pagination = new Pagination();
  //eventCampaingEmailOpenPagination: Pagination = new Pagination();
  //eventCampaingRedistributionEmailOpenPagination: Pagination = new Pagination();
  //eventCamapignRsvpDetailPagination: Pagination = new Pagination();
  //eventCampaingRsvpRedistributionDetailPagination: Pagination = new Pagination();
  rsvpDetailAnalyticsPagination: Pagination = new Pagination();

  socialCampaign: SocialCampaign = new SocialCampaign();
  redistributedAccounts = new Set<number>();
  redistributedAccountsBySelectedUserId: Array<SocialStatus> = [];
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
  campaingContactLists: any;
  campaingContactListValues: any;
  contactListId: number;
  videoFile: any;
  userWatchtotalRecords: number;
  isDataShare = false;
  isPartnerEnabledAnalyticsAccess = false;
  isNavigatedThroughAnalytics = false;
  campaignRouter: any;
  loggedInUserId = 0;

  logListName = "";
  selectedRsvpPartnerId: number = 0;
  showRsvpDetails = false;
  rsvpDetailsList: any;
  reDistributionRsvpDetails: any;
  rsvpResposeType = '';
  rsvpDetailType = '';
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  hasClientError = false;

  tweets: Array<Tweet> = new Array<Tweet>();

  constructor(private route: ActivatedRoute, private campaignService: CampaignService, private utilService: UtilService, private socialService: SocialService,
    public authenticationService: AuthenticationService, public pagerService: PagerService, public pagination: Pagination,
    public referenceService: ReferenceService, public contactService: ContactService, public videoUtilService: VideoUtilService, public xtremandLogger: XtremandLogger, private twitterService: TwitterService, private dealRegService: DealRegistrationService)
  {
    try
    {
      this.campaignRouter = this.utilService.getRouterLocalStorage();
      this.isTimeLineView = false;
      this.loggedInUserId = this.authenticationService.getUserId();
      this.campaign = new Campaign();
      this.selectedRow.emailId = "";





    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  showTimeline()
  {
    this.isTimeLineView = !this.isTimeLineView;
  }
  ngOnInit()
  {
   

    const object = {
      "campaignId": this.selectedcampaign.campaignId,
      "userId": this.lead.id,
      "emailId": this.lead.emailId
    }
    this.isTimeLineView = false;
   
    this.userTimeline(object);

    this.mainLoader = true;
    this.dealRegService.getDealById(this.dealId,this.loggedInUserId).subscribe(deal =>
    {
      this.deal = deal.data;
      this.campaignId = this.deal.campaignId;
      const obj = { 'campaignId': this.deal.campaignId };
      try
      {
        this.paginationType = 'campaignViews';
        this.emailActionListPagination.pageIndex = 1;
        this.getCampaignById(this.deal.campaignId);
       
        this.pagination.pageIndex = 1;

        // this.getCampaignUserViewsCountBarCharts(this.deal.campaignId, this.pagination);

        setTimeout(() => { this.mainLoader = false; }, 3000);
      }
      catch (error) { this.hasClientError = true; this.mainLoader = false; this.xtremandLogger.error('error' + error); }
      this.campaignService.getCampaignById(obj).subscribe(campaign =>
      {
        this.campaign = campaign;
        this.campaignType = this.campaign.campaignType.toLocaleString();
        this.campaignId = this.campaign.campaignId;
        
        this.dealRegService.getDealCreatedBy(this.deal.createdBy).subscribe(user =>
          {
    
            this.user = user;
          
              this.listEmailLogsByCampaignAndUser(this.campaign.campaignId,this.lead.id ); 
              
          })
      })
      
      this.dealRegService.getDealCreatedBy(this.deal.leadId).subscribe(lead =>
      {
        this.lead = lead;
        this.selectedRow = lead;
        this.getEmailLogCountByCampaign(this.deal.campaignId);

      })
      this.dealRegService.getDealStatus(this.deal.id).subscribe(dealStatus =>
      {
        this.dealStatus = dealStatus;

      })

    })



  }

  listCampaignViews(campaignId: number, pagination: Pagination)
  {
    try
    {
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.downloadTypeName = this.paginationType = 'campaignViews';
      this.listTotalCampaignViews(campaignId);

      if (!this.campaign.detailedAnalyticsShared && this.campaign.dataShare)
      {
        pagination.campaignId = campaignId;
        pagination.campaignType = "VIDEO";
        this.campaignService.listCampaignInteractiveViews(pagination)
          .subscribe(
            data =>
            {
              this.listCampaignViewsDataInsert(data);
            },
            error => console.log(error),
            () => console.log()
          )
      } else
      {
        this.campaignService.listCampaignViews(campaignId, pagination, this.isChannelCampaign)
          .subscribe(
            data =>
            {
              this.listCampaignViewsDataInsert(data.campaignviews);
            },
            error => console.log(error),
            () => console.log()
          )
      }
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  listCampaignViewsDataInsert(campaignviews: any)
  {
    this.campaignViews = campaignviews;
    const views = [];
    for (let i = 0; i < this.campaignViews.length; i++)
    {
      views.push(this.campaignViews[i].viewsCount)
    }
    this.maxViewsValue = Math.max.apply(null, views);
    this.campaignViewsPagination.totalRecords = this.campaignReport.emailSentCount;
    this.campaignViewsPagination = this.pagerService.getPagedItems(this.campaignViewsPagination, this.campaignViews);
    this.loading = false;
    this.referenceService.loading(this.httpRequestLoader, false);
  }

  getCampaignViewsReportDurationWise(campaignId: number)
  {
    try
    {
      this.loading = true;
      this.campaignService.getCampaignViewsReportDurationWise(campaignId)
        .subscribe(
          data =>
          {

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

  getEmailSentCount(campaignId: number)
  {
    try
    {
      this.loading = true;
      this.campaignService.getEmailSentCount(campaignId)
        .subscribe(
          data =>
          {
          
            this.campaignReport.emailSentCount = data.emails_sent_count;
            this.loading = false;
          },
          error => console.log(error),
          () =>
          {
            this.listCampaignViews(campaignId, this.campaignViewsPagination);
          }
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  getCountryWiseCampaignViews(campaignId: number)
  {
    try
    {
      this.loading = true;
      this.campaignService.getCountryWiseCampaignViews(campaignId)
        .subscribe(
          (result: any) =>
          {
            const countryData = result;
            const data = [];
            const self = this;
            if (countryData != null)
            {
              for (const i of Object.keys(countryData))
              {
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
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  clickWorldMapReports(event: any)
  {
    this.getCampaignUsersWatchedInfo(event);
  }


  getCampaignUsersWatchedInfo(countryCode)
  {
    try
    {
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.paginationType = 'coutrywiseUsers';
      this.countryCode = countryCode.toUpperCase();
      this.campaignService.getCampaignUsersWatchedInfo(this.campaignId, this.countryCode, this.pagination)
        .subscribe(
          (data: any) =>
          {
           
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
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  getEmailLogCountByCampaign(campaignId: number)
  {
    try
    {
      this.loading = true;
     
      this.dealRegService.getEmailLogCountByCampaignAndUser(campaignId,this.lead.id)
        .subscribe(
          data =>
          {
           
            this.campaignReport.emailOpenCount = data["email_opened_count"];
            this.campaignReport.emailClickedCount = data["email_clicked_count"];
            this.loading = false;
          },
          error => console.log(error),
          () => console.log()
        )
    } catch (error) { this.hasClientError = true; this.xtremandLogger.error('error' + error); }
  }

  getCampaignWatchedUsersCount(campaignId: number)
  {
    try
    {
      this.loading = true;
      this.campaignService.getCampaignTotalViewsCount(campaignId)
        .subscribe(
          data =>
          {
            this.campaignReport.usersWatchCount = data.total_views_count;
            this.loading = false;
          },
          error => console.log(error),
          () => console.log()
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  campaignWatchedUsersListCount(campaignId: number)
  {
    try
    {
      this.loading = true;
      this.campaignService.campaignWatchedUsersListCount(campaignId)
        .subscribe(
          data =>
          {
            this.userWatchtotalRecords = data;
            this.loading = false;
          },
          error => console.log(error),
          () => console.log()
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  usersWatchList(campaignId: number, pagination: Pagination)
  {
    try
    {
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.paginationType = 'usersWatch';
      this.downloadTypeName = 'usersWatchedList';
      this.campaignService.usersWatchList(campaignId, pagination)
        .subscribe(
          data =>
          {
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
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  setPage(event: any)
  {
    try
    {
      if (event.type === 'campaignViews')
      {
        this.campaignViewsPagination.pageIndex = event.page;
        this.listCampaignViews(this.campaign.campaignId, this.campaignViewsPagination);
      } else if (event.type === 'emailAction')
      {
        this.emailActionListPagination.pageIndex = event.page;
        if (this.campaignReport.emailActionType === 'open' || this.campaignReport.emailActionType === 'click')
        {
          this.emailActionList(this.campaign.campaignId, this.campaignReport.emailActionType, this.emailActionListPagination);
        }
      } else if (event.type === 'usersWatch')
      {
        this.usersWatchListPagination.pageIndex = event.page;
        this.usersWatchList(this.campaign.campaignId, this.usersWatchListPagination);
      } 
      else
      {
        this.pagination.pageIndex = event.page;
      }
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }
  
  emailActionList(campaignId: number, actionType: string, pagination: Pagination)
  {
    try
    {
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.paginationType = 'emailAction';
      this.campaignService.emailActionList(campaignId, actionType, pagination)
        .subscribe(
          data =>
          {
           
            this.campaignReport.emailLogs = data;
            this.campaignReport.emailActionType = actionType;
            $('#emailActionListModal').modal();

            if (actionType === 'open')
            {
              if (this.sortByDropDown.length === 5)
              {
                this.sortByDropDown.push({ 'name': 'Subject(ASC)', 'value': 'subject-ASC' });
                this.sortByDropDown.push({ 'name': 'Subject(DESC)', 'value': 'subject-DESC' });
              }
              this.emailActionListPagination.totalRecords = this.campaignReport.emailOpenCount;
            } else if (actionType === 'click')
            {
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
          () => console.log()
        )
    } catch (error) { this.xtremandLogger.error('Error in analytics page emails sent' + error); }
  }

  listEmailLogsByCampaignAndUser(campaignId: number, userId: number)
  {
    try
    {
      this.loading = true;
      this.campaignService.listEmailLogsByCampaignAndUser(campaignId, userId)
        .subscribe(
          data =>
          {

            this.emailLogs = data;
            this.loading = false;

          },
          error => console.log(error),
          () =>
          {
            this.count();
          }
        )
    } catch (error) { this.xtremandLogger.error('Error in analytics page listEmailLogsByCampaignAndUser' + error); }
  }

  count()
  {
    try
    {
      this.loading = true;
      if (this.emailLogs !== undefined)
      {
        for (const i in this.emailLogs)
        {
          if (this.emailLogs[i].actionId === 13)
          {
            this.userCampaignReport.emailOpenCount += 1;
          } else if (this.emailLogs[i].actionId === 14 || this.emailLogs[i].actionId === 15)
          {
            this.userCampaignReport.emailClickedCount += 1;
          }
          else if (this.emailLogs[i].actionId === 1) {
            this.userCampaignReport.totalUniqueWatchCount += 1;
           }
        }
      }
      this.loading = false;
    } catch (error) { this.xtremandLogger.error('Error in count' + error); }
  }

  userTimeline(campaignViews: any)
  {
    try
    {
      this.loading = true;
      this.redistributedAccountsBySelectedUserId = [];
      this.listEmailLogsByCampaignAndUser(campaignViews.campaignId, campaignViews.userId);
      this.getTotalTimeSpentOfCampaigns(campaignViews.userId, campaignViews.campaignId);
      if (this.campaignType === 'EVENT' && this.isChannelCampaign)
      {
        this.redistributionCampaignsDetails(campaignViews);
      }
      if (this.campaignType === 'SOCIAL')
      {
        this.socialCampaign.socialStatusList.forEach(
          data => data.socialStatusList.forEach(
            data =>
            {
              if (data.userId === campaignViews.userId)
                this.redistributedAccountsBySelectedUserId.push(data);
            }
          )
        )
      }
      this.selectedRow = campaignViews;
      
      this.isTimeLineView = !this.isTimeLineView;
      this.userCampaignReport.totalUniqueWatchCount = campaignViews.viewsCount;
     
    } catch (error) { this.xtremandLogger.error(error); }
  }


  getDealStateButton(campaignViews: any)
  {
    if (campaignViews.userId != null && campaignViews.campaignId != null)
    {
      this.dealRegService.getDeal(campaignViews.campaignId, campaignViews.userId).subscribe(data =>
      {
        this.dealId = data;
        if (data == -1)
          this.dealButtonText = "Register Lead"
        else
          this.dealButtonText = "Update Lead"
      })
    }
  }


  getTotalTimeSpentOfCampaigns(userId: number, campaignId: number)
  {
    try
    {
      this.loading = true;
      this.campaignService.getTotalTimeSpentofCamapaigns(userId, campaignId)
        .subscribe(data =>
        {
         
          this.totalTimeSpent = data;   // data is coming as empty object ,, need to handle it
          this.loading = false;
        },
          error => console.log(error),
          () => { }
        );
    } catch (err) { this.xtremandLogger.error(err); }
  }
  userWatchedviewsInfo(emailId: string)
  {
    try
    {
      if (emailId.includes('<br/>'))
      {
        emailId = emailId.substring(emailId.indexOf('<br/>'), emailId.length);
        emailId = emailId.substring(5);
      }
      this.loading = true;
      if (emailId !== this.selectedRow.emailId)
      {
        this.userCampaignReport.emailOpenCount = 0;
        this.userCampaignReport.emailClickedCount = 0;
        this.userCampaignReport.totalUniqueWatchCount = 0;
        this.barChartCliked = true;
        //this.selectedRow = this.campaignBarViews.find(function (obj) { return obj.emailId === emailId; });
        this.userTimeline(this.selectedRow);
        this.isTimeLineView = true;
      }
      this.loading = false;
    } catch (err)
    {
      this.xtremandLogger.error(err);
    }
  }

  getCampaignById(campaignId: number)
  {
    try
    {
      this.loading = true;
      const obj = { 'campaignId': campaignId }
      this.campaignService.getCampaignById(obj)
        .subscribe(
          data =>
          {
            this.campaign = data;
            this.isChannelCampaign = data.channelCampaign;
            if (this.campaign.nurtureCampaign && this.campaign.userId != this.loggedInUserId)
            {
              this.isPartnerEnabledAnalyticsAccess = this.campaign.detailedAnalyticsShared;
              this.isDataShare = this.campaign.dataShare;
              this.isNavigatedThroughAnalytics = true;
              if (data.campaignType === 'EVENT')
              {
                this.isDataShare = true;
                this.isPartnerEnabledAnalyticsAccess = true;
              }
            } else
            {
              this.isNavigatedThroughAnalytics = false;
              this.isPartnerEnabledAnalyticsAccess = true;
              this.isDataShare = true;
            }
            this.campaingContactLists = data.userLists;
          
            this.isPartnerCampaign = this.campaign.channelCampaign ? '(PARTNER)' : '';
            this.loading = false;
          },
          error =>
          {
            console.log(error);
            error = error.json();
            this.customResponse = new CustomResponse('ERROR', error.message, true);
            this.loading = false;
          },
          () =>
          {
            if (this.customResponse.responseType !== 'ERROR')
            {
              const campaignType = this.campaign.campaignType.toLocaleString();
              if (campaignType.includes('VIDEO'))
              {
                this.campaignType = 'VIDEO';
                this.getCountryWiseCampaignViews(campaignId);
                this.getCampaignViewsReportDurationWise(campaignId);
                this.getCampaignWatchedUsersCount(campaignId);
                this.campaignWatchedUsersListCount(campaignId);
              } else if (campaignType.includes('SOCIAL'))
              {
                this.campaignType = 'SOCIAL';
                this.getSocialCampaignByCampaignId(campaignId);
              } else if (campaignType.includes('EVENT'))
              {
                this.campaignType = 'EVENT';
                this.campaign.selectedEmailTemplateId = this.campaign.emailTemplate.id;
                this.getEventCampaignByCampaignId(campaignId);
              } else
              {
                this.campaignType = 'EMAIL';
              }
            }
            this.getEmailSentCount(this.campaignId);
            this.loading = false;
            this.getEmailSentCount(this.campaignId);
          }
        )
    } catch (error) { this.hasClientError = true; this.xtremandLogger.error(error); }
  }

  getSocialCampaignByCampaignId(campaignId: number)
  {
    try
    {
      this.loading = true;
      this.socialService.getSocialCampaignByCampaignId(campaignId)
        .subscribe(
          data =>
          {
            this.socialCampaign = data;
            this.loading = false;
            this.socialCampaign.socialStatusList.forEach(data =>
            {
              data.socialStatusList.forEach(data => this.redistributedAccounts.add(data.userId))
            })
          },
          error => this.xtremandLogger.error(error),
          () => { }
        )
    } catch (error)
    {
      this.xtremandLogger.error('error' + error)
    }
  }

  getEventCampaignByCampaignId(campaignId: number)
  {
    try
    {
      this.loading = true;
      this.campaignService.getEventCampaignDetailsByCampaignId(campaignId, this.isChannelCampaign)
        .subscribe(
          data =>
          {
          
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
    } catch (error)
    {
      this.xtremandLogger.error('error' + error)
    }
  }

  getPartnersResponeCount(campaignId: number)
  {
    try
    {
      this.campaignService.getEventCampaignDetailsByCampaignId(campaignId, false)
        .subscribe(
          data =>
          {
            
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
    } catch (error)
    {
      this.xtremandLogger.error('error' + error)
    }
  }



  redistributionCampaignsDetails(campaignViews: any)
  {
    try
    {
      this.loading = true;
      this.selectedRsvpPartnerId = campaignViews.userId;

      if (!campaignViews.firstName)
      {
        campaignViews.firstName = "";
      }

      if (!campaignViews.lastName)
      {
        campaignViews.lastName = "";
      }

      this.campaignReport.selectedPartnerFirstName = campaignViews.firstName + " " + campaignViews.lastName;
      //this.campaignReport.selectedPartnerLastName = campaignViews.lastName;
      this.campaignReport.selectedPartnerEmailId = campaignViews.emailId;
      this.campaignReport.selectedPartnerUserId = campaignViews.userId;


      // this.downloadTypeName = 'rsvp';
      this.campaignService.getRestributionEventCampaignAnalytics(this.campaign.campaignId, campaignViews.userId)
        .subscribe(
          data =>
          {
           
            this.campaignReport.redistributionTotalYesCount = data.YES;
            this.campaignReport.redistributionTotalMayBeCount = data.MAYBE;
            this.campaignReport.redistributionTotalNoCount = data.NO;
            this.campaignReport.redistributionTotalNotYetRespondedCount = data.notYetResponded;
            this.campaignReport.redistributionTotalEmailOpenCount = data.emailOpenedCount;
            this.campaignReport.redistributionTotalInvitiesCount = campaignViews.rsvpMap.totalInvities;
            this.campaignReport.redistributionTotalAdditionalCount = data.additionalCount;
            this.rsvpDetailType = 'reDistribution';
           
            this.loading = false;
          },
          error => this.xtremandLogger.error(error),
          () => { }
        )
    } catch (error)
    {
      this.xtremandLogger.error('error' + error)
    }
  }

  

  emailActionTotalList(campaignId: number, actionType: string, totalRecords: number)
  {
    try
    {
      this.loading = true;
      this.emailLogPagination.maxResults = totalRecords;
      this.downloadTypeName = 'emailAction';
      this.campaignService.emailActionList(campaignId, actionType, this.emailLogPagination)
        .subscribe(
          data =>
          {
            this.campaignReport.totalEmailActionList = data;
            this.campaignReport.emailActionType = actionType;
            this.loading = false;
          },
          error => console.log(error),
          () => console.log()
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  usersWatchTotalList(campaignId: number, totalRecords: number)
  {
    try
    {
      this.loading = true;
      this.userWatchedReportPagination.maxResults = totalRecords;
      this.downloadTypeName = 'usersWatchedList';
      this.campaignService.usersWatchList(campaignId, this.userWatchedReportPagination)
        .subscribe(
          data =>
          {
            this.campaignReport.totalWatchedList = data.data;
            this.loading = false;
          },
          error => this.xtremandLogger.error(error),
          () => this.xtremandLogger.log('usersWatchTotalList method finished')
        )
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  listTotalCampaignViews(campaignId: number)
  {
    try
    {
      //this.loading = true;
      this.downloadTypeName = 'campaignViews';
      this.campaignTotalViewsPagination.maxResults = this.campaignReport.emailSentCount;
      this.campaignService.listCampaignViews(campaignId, this.campaignTotalViewsPagination, this.isChannelCampaign)
        .subscribe(
          data =>
          {
            this.campaignTotalViewsData = data.campaignviews;
            
          },
          error => console.log(error),
          () => console.log()
        );
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  getCampaignUsersWatchedTotalInfo(countryCode, totalRecord: number)
  {
    try
    {
      this.loading = true;
      this.downloadTypeName = 'worldMap';
      this.countryCode = countryCode.toUpperCase();
      this.campaignsWorldMapPagination.maxResults = totalRecord;
      this.campaignService.getCampaignUsersWatchedInfo(this.campaignId, this.countryCode, this.campaignsWorldMapPagination)
        .subscribe(
          (data: any) =>
          {
          
            this.worldMapUserTotalData = data.data;
            this.loading = false;
          },
          error => this.xtremandLogger.error('error' + error),
          () => console.log('finished')
        );
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  downloadEmailLogs()
  {
    try
    {
      this.loading = true;
      if (this.downloadTypeName === 'donut')
      {
        this.logListName = 'Campaign_Views_Logs.csv';
        this.downloadCsvList = this.totalListOfemailLog;
      } else if (this.downloadTypeName === 'emailAction')
      {
        this.logListName = 'Email_Action_Logs.csv';
        this.downloadCsvList = this.campaignReport.totalEmailActionList;
      } else if (this.downloadTypeName === 'usersWatchedList')
      {
        this.logListName = 'Users_watched_Logs.csv';
        this.downloadCsvList = this.campaignReport.totalWatchedList;
      } else if (this.downloadTypeName === 'campaignViews')
      {
        this.logListName = 'Campaign_report_logs.csv';
        this.downloadCsvList = this.campaignTotalViewsData;
      } else if (this.downloadTypeName === 'worldMap')
      {
        this.logListName = 'World_Map_logs.csv';
        this.downloadCsvList = this.worldMapUserTotalData;
      } else if (this.downloadTypeName === 'rsvp')
      {
        if (this.rsvpResposeType === 'email open')
        {
          this.logListName = 'People who opened mail log.csv';
        } else
        {
          this.logListName = 'People who says ' + this.rsvpResposeType + ' RSVPs log.csv';
        }
        this.downloadCsvList = this.rsvpDetailsList;
      }


      this.downloadDataList.length = 0;
      for (let i = 0; i < this.downloadCsvList.length; i++)
      {
        let date = new Date(this.downloadCsvList[i].time);
        let startTime = new Date(this.downloadCsvList[i].startTime);
        let endTime = new Date(this.downloadCsvList[i].endTime);
        let sentTime = new Date(this.campaign.launchTime);
        let latestView = new Date(this.downloadCsvList[i].latestView);
        let responseTime = new Date(this.downloadCsvList[i].responseTime);

        var object = {
          "First Name": this.downloadCsvList[i].firstName,
          "Last Name": this.downloadCsvList[i].lastName,
        }

        if (this.downloadTypeName === 'donut')
        {
          object["Email Id"] = this.downloadCsvList[i].emailId;
          object["Campaign Name"] = this.downloadCsvList[i].campaignName;
          let hours = this.referenceService.formatAMPM(date);
          object["Date and Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
          object["Platform"] = this.downloadCsvList[i].os;
          object["Location"] = this.downloadCsvList[i].location;
        }

        if (this.downloadTypeName === 'campaignViews')
        {
          object["Email Id"] = this.downloadCsvList[i].emailId;
          object["Campaign Name"] = this.downloadCsvList[i].campaignName;
          if (this.campaignType === 'EVENT')
          {
            if (this.isChannelCampaign)
            {
              object["Invities"] = this.downloadCsvList[i].rsvpMap.totalInvities;
              object["Opened"] = this.downloadCsvList[i].rsvpMap.emailOpenedCount;
              object["Yes"] = this.downloadCsvList[i].rsvpMap.YES;
              object["No"] = this.downloadCsvList[i].rsvpMap.NO;
              object["May Be"] = this.downloadCsvList[i].rsvpMap.MAYBE;
              object["Not Yet"] = this.downloadCsvList[i].rsvpMap.notYetResponded;
              object["Total Guests"] = this.downloadCsvList[i].rsvpMap.additionalCount;
            } else
            {
              object["Response Type"] = this.downloadCsvList[i].rsvpMap.responseType;
              object["Total Guests"] = this.downloadCsvList[i].rsvpMap.additionalCount;
            }
          } else
          {
            let hours = this.referenceService.formatAMPM(sentTime);
            object["Sent Time"] = sentTime.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
            let lastviewHours = this.referenceService.formatAMPM(latestView);
            object["Latest View"] = latestView.toDateString().split(' ').slice(1).join(' ') + ' ' + lastviewHours;
          }
        }

        if (this.downloadTypeName === 'usersWatchedList')
        {
          object["Email Id"] = this.downloadCsvList[i].emailId;
          let srtHours = this.referenceService.formatAMPM(startTime);
          object["START DURATION"] = startTime.toDateString().split(' ').slice(1).join(' ') + ' ' + srtHours;
          let endHours = this.referenceService.formatAMPM(endTime);
          object["STOP DURATION"] = endTime.toDateString().split(' ').slice(1).join(' ') + ' ' + endHours;
          /*object["IP ADDRESS"] = this.downloadCsvList[i].ipAddress;*/
          object["PLATFORM"] = this.downloadCsvList[i].os[0].toUpperCase() + this.downloadCsvList[i].os.substr(1).toLowerCase();
          object["STATE"] = this.downloadCsvList[i].state;
          object["COUNTRY"] = this.downloadCsvList[i].country;
        }

        if (this.downloadTypeName === 'emailAction')
        {
          object["Email Id"] = this.downloadCsvList[i].emailId;
          if (this.campaignReport.emailActionType === 'click')
          {
            if (this.downloadCsvList[i].url)
            {
              object["Url"] = this.downloadCsvList[i].url;
            } else
            {
              object["Url"] = "Clicked on the video thumbnail";
            }
          } else
          {
            object["Email subject"] = this.downloadCsvList[i].subject;
          }
          let hours = this.referenceService.formatAMPM(date);
          object["Date and Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
        }

        if (this.downloadTypeName === 'worldMap')
        {
          object["Email Id"] = this.downloadCsvList[i].emailId;
          let hours = this.referenceService.formatAMPM(date);
          object["Date and Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
          object["Device"] = this.downloadCsvList[i].deviceType;
          object["Location"] = this.downloadCsvList[i].location;
        }

        if (this.downloadTypeName === 'rsvp')
        {
          object["Email Id"] = this.downloadCsvList[i].emailId;
          if (this.rsvpResposeType === 'email open')
          {
            object["Campaign Name"] = this.downloadCsvList[i].campaignName;
            object["Subject"] = this.downloadCsvList[i].subject;
            let hours = this.referenceService.formatAMPM(date);
            object["Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
          } else
          {
            object["Message"] = this.downloadCsvList[i].message;
            let hours = this.referenceService.formatAMPM(responseTime);
            object["Response Time"] = responseTime.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
            object["Total Attendees"] = this.downloadCsvList[i].additionalCount;
          }
        }

        this.downloadDataList.push(object);
      }

      this.referenceService.isDownloadCsvFile = true;
      this.loading = false;
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  showEmailTemplatePreview(emailTemplate: any)
  {
    try
    {
     
      this.referenceService.previewEmailTemplate(emailTemplate, this.campaign);
    } catch (error) { this.xtremandLogger.error(error); }
  }

  previewVideo(videoFile: any)
  {
    try
    {
      this.loading = true;
      setTimeout(() => { this.loading = false; this.videoFile = videoFile; }, 600);
    } catch (error) { this.xtremandLogger.error(error); }
  }

  closeModal(event: any)
  {
   
    this.videoFile = undefined;
  }
  showContactListModal()
  {
    this.loading = true;
    this.getListOfContacts(this.campaingContactLists[0].id);
  }
 

  getListOfContacts(id: number)
  {
    try
    {
      this.contactListId = id;
      this.campaignService.loadUsersOfContactList(id, this.campaignId, this.contactListInfoPagination).subscribe(
        data =>
        {
          this.campaingContactListValues = data.listOfUsers;
          this.loading = false;
          this.contactListInfoPagination.totalRecords = data.totalRecords;
          this.contactListInfoPagination = this.pagerService.getPagedItems(this.contactListInfoPagination, this.campaingContactListValues);
          $("#show_contact-list-info").modal('show');
        },
        (error: any) => { this.xtremandLogger.error('error' + error); })
    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  getSortedResult(campaignId: number, event: any)
  {
    this.emailActionListPagination = this.utilService.sortOptionValues(event, this.emailActionListPagination);
    this.emailActionList(campaignId, this.campaignReport.emailActionType, this.emailActionListPagination);
  }

  listEmailLogsByCampaignIdUserIdActionType(emailLog: EmailLog, actionType: string)
  {
    this.campaignReport.emailLogs.forEach((element) =>
    {
      if (element.userId !== emailLog.userId)
      {
        element.isExpand = false;
      }
    });
    emailLog.isExpand = !emailLog.isExpand;
    if (emailLog.emailLogHistory === undefined)
    {
      try
      {
        this.loading = true;
        this.campaignService.listEmailLogsByCampaignIdUserIdActionType(emailLog.campaignId, emailLog.userId, actionType)
          .subscribe(
            data =>
            {
              emailLog.emailLogHistory = data;
              this.loading = false;
            },
            error => console.error(error),
            () => { }
          )
      } catch (error)
      {
        this.xtremandLogger.error('Error in listEmailLogsByCampaignIdUserIdActionType: ' + error);
      }
    }
  }


  ngOnDestroy()
  {
    this.paginationType = '';
    $('#worldMapModal').modal('hide');
    $('#email_template_preivew').modal('hide');
    $('#show_contact-list-info').modal('hide');
    $('#usersWatchListModal').modal('hide');
    $('#emailActionListModal').modal('hide');
    $('#emailSentListModal').modal('hide');
    $('#donutModelPopup').modal('hide');
  }

  showDealRegistrationForm()
  {

    this.dealObj.emit(this.deal.id);
  }

  showTimeLineView()
  {
    this.isDealRegistration = false;
    this.isTimeLineView = true;
   
  }

  resetTopNavBarValue(isDealAnalytics)
  {
    this.isDealAnalytics.emit(isDealAnalytics);
  }
  getDealState(selectedRow: any): any
  {
    throw new Error("Method not implemented.");
  }

}
