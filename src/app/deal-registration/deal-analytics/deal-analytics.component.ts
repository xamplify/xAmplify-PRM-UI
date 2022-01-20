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
  campaignReport: CampaignReport = new CampaignReport();
  userCampaignReport: CampaignReport = new CampaignReport();
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

      this.loggedInUserId = this.authenticationService.getUserId();
      this.campaign = new Campaign();

    } catch (error) { this.xtremandLogger.error('error' + error); }
  }

  ngOnInit()
  {


    const object = {
      "campaignId": this.selectedcampaign.campaignId,
      "userId": this.lead.id,
      "emailId": this.lead.emailId
    }



    this.mainLoader = true;
    this.dealRegService.getDealById(this.dealId,this.loggedInUserId).subscribe(deal =>
    {
      this.deal = deal.data;
      this.campaignId = this.deal.campaignId;
      const obj = { 'campaignId': this.deal.campaignId };


      this.campaignService.getCampaignById(obj).subscribe(campaign =>
      {
        this.campaign = campaign;
        console.log(this.campaign)
        this.campaignType = this.campaign.campaignType.toLocaleString();
        this.campaignId = this.campaign.campaignId;
        this.userTimeline(object);
        this.dealRegService.getDealCreatedBy(this.deal.createdBy).subscribe(user =>
          {

            this.user = user;

              this.listEmailLogsByCampaignAndUser(this.campaign.campaignId,this.lead.id );

          })
      })

      this.dealRegService.getDealCreatedBy(this.deal.leadId).subscribe(lead =>
      {
        console.log(lead)
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
            console.log(data)
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
      console.log(this.emailLogs)
      this.userCampaignReport = new CampaignReport();

      this.userCampaignReport.totalUniqueWatchCount =0 ;
      if (this.emailLogs !== undefined)
      {
        this.emailLogs.forEach(emailLog => {
          if (emailLog.actionId === 13)
          {
            this.userCampaignReport.emailOpenCount += 1;
          } else if (emailLog.actionId === 14 || emailLog.actionId === 15)
          {
            this.userCampaignReport.emailClickedCount += 1;
          }
          else if (emailLog.actionId === 1) {
            console.log(this.userCampaignReport)
            this.userCampaignReport.totalUniqueWatchCount = this.userCampaignReport.totalUniqueWatchCount + 1;
           }
        });


      }
      this.loading = false;
    } catch (error) { this.xtremandLogger.error('Error in count' + error); }
  }

  userTimeline(campaignViews: any)
  {
    try
    {
      console.log(campaignViews)
      this.loading = true;
      this.redistributedAccountsBySelectedUserId = [];
      this.listEmailLogsByCampaignAndUser(campaignViews.campaignId, campaignViews.userId);
      let campaignId ;

      this.getTotalTimeSpentOfCampaigns(this.lead.id, this.campaign.campaignId);
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
        if (data == -1){
          this.dealButtonText = "Register Lead"
        }else{
          this.dealRegService.getDealById(data,campaignViews.userId).subscribe(response=>{

            if(response.data.deal){
              this.dealButtonText = "Preview Deal";
            } else {
              this.dealButtonText = "Update Lead"
            }

          })
        }

      })
    }
  }


  getTotalTimeSpentOfCampaigns(userId: number, campaignId: number)
  {
    try
    {
      console.log(userId + "====."+ campaignId)
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

            this.isPartnerCampaign = this.campaign.channelCampaign ? '('+this.authenticationService.partnerModule.customName+')' : '';
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
                this.campaignType = 'REGULAR';
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




  closeModal(event: any)
  {

    this.videoFile = undefined;
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
