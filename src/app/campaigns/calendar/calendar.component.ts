import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/authentication.service';
import { CampaignService } from '../services/campaign.service';
import { SocialService } from '../../social/services/social.service';
import { ReferenceService } from '../../core/services/reference.service';

import { SocialCampaign } from '../../social/models/social-campaign';
import { CampaignReport } from '../models/campaign-report';
import { Campaign } from '../models/campaign';
import { EventCampaign } from '../models/event-campaign';
import { CustomResponse } from '../../common/models/custom-response';
import { EmailTemplate } from 'app/email-template/models/email-template';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { VideoUtilService } from 'app/videos/services/video-util.service';
import { Pagination } from 'app/core/models/pagination';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { PagerService } from 'app/core/services/pager.service';
import { ContactService } from 'app/contacts/services/contact.service';
import { ContactList } from 'app/contacts/models/contact-list';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { EmailLog } from '../models/email-log';
import { UtilService } from 'app/core/services/util.service';
declare var $,videojs: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css', '../../../assets/css/content.css'],
  providers:[HttpRequestLoader]
})
export class CalendarComponent implements OnInit, OnDestroy {
  campaigns: any = [];
  campaign: any;
  socialCampaign: SocialCampaign = new SocialCampaign();
  events: any[] = [];
  campaignType: string;
  campaignReport: CampaignReport = new CampaignReport;
  customResponse: CustomResponse = new CustomResponse();

  contactListPagination: Pagination = new Pagination();
  emailLogPagination: Pagination = new Pagination();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  contactsPagination: Pagination = new Pagination();
  pagination:Pagination = new Pagination();
  previewContactList = new ContactList();
  deleteCampaignAlert = false;
  hasCampaignRole = false;
  hasStatsRole = false;
  hasAllAccess = false;
  isOnlyPartner = false;
  isScheduledCampaignLaunched = false;
  loggedInUserId = 0;
  saveAsCampaignId = 0;
  saveAsCampaignName = '';
  saveAsCampaignInfo: any;
  loading = false;
  launchVideoPreview:SaveVideoFile = new SaveVideoFile();
  videoFile:SaveVideoFile;
  videojsPlayer:any;
  paginationType:string;
  campaignViews: any;
  isChannelCampaign:boolean;
  sortByDropDown = [
    { 'name': 'Sort By', 'value': '' },
    { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
    { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
    { 'name': 'Time(ASC)', 'value': 'time-ASC' },
    { 'name': 'Time(DESC)', 'value': 'time-DESC' }
  ];
  selectedSortedOption:any = this.sortByDropDown[this.sortByDropDown.length-1];
  constructor(public authenticationService: AuthenticationService, private campaignService: CampaignService, private socialService: SocialService,
    public referenceService: ReferenceService, private router: Router, public videoUtilService:VideoUtilService, public xtremandLogger:XtremandLogger,
    public contactService:ContactService, public pagerService:PagerService, public utilService:UtilService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.hasCampaignRole = this.referenceService.hasSelectedRole(this.referenceService.roles.campaignRole);
    this.hasStatsRole = this.referenceService.hasSelectedRole(this.referenceService.roles.statsRole);
    this.hasAllAccess = this.referenceService.hasAllAccess();
    this.isOnlyPartner = this.authenticationService.isOnlyPartner();
    this.contactListPagination = new Pagination();
    this.contactListPagination.filterKey = 'isPartnerUserList';
    this.contactListPagination.filterValue = false;
  }
  getCampaignCalendarView() {
    $('#calendar').fullCalendar('removeEvents');
    var view = $('#calendar').fullCalendar('getView');
    var request = { startTime: view.start._d, endTime: view.end._d, userId: this.loggedInUserId };
    this.loading = true;
    this.campaignService.getCampaignCalendarView(request)
      .subscribe(
      data => {
        this.events = [];
        this.campaigns = data;
        this.campaigns.forEach(element => {
          let event: any = {id: element.id, title: element.campaign, start: element.createdTime, data: element, editable: false};
          $('#calendar').fullCalendar('renderEvent', event, true);
          this.events.push(event);
        });
      },
      error => console.log(error),
      () => {this.loading = false;}
      );
  }

  getEventBackgroundColor(event: any) {
    let backgroundColor = '#fff';
    if ('SAVE' === event.data.status) { backgroundColor = '#6c757d'; }
    else if ('SCHEDULE' === event.data.status) { backgroundColor = '#007bff'; }
    else {
      if (event.data.percentage <= 25) { backgroundColor = '#dc3545'; }
      else if (event.data.percentage > 25 && event.data.percentage <= 50){ backgroundColor = '#ffc107';}
      else if (event.data.percentage > 50 && event.data.percentage <= 75){ backgroundColor = '#17a2b8';}
      else if (event.data.percentage > 75 && event.data.percentage <= 100){ backgroundColor = '#28a745';}
    }
    return backgroundColor;
  }

  renderCalendar() {
    const self = this;
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listWeek'
      },
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: this.events,
      timeFormat: 'h:mm a',
      height: 'parent',
      eventClick: function (event) {
        self.getCampaignById(event.id)
      },
      viewRender: function(view: any, element: any){
        self.getCampaignCalendarView();
      },
      eventRender: function (event: any, element: any) {
        element.find('.fc-time').addClass('fc-time-title mr5');
        element.find('.fc-title').addClass('fc-time-title ml5');
        element.find('.fc-time-title').wrapAll('<div class="fc-right-block col-xs-11 flex pull-right p0 mr-10"></div>');
        element.css('background', self.getEventBackgroundColor(event));
        const campaignType = event.data.type;
        let str = '';
        if ('REGULAR' === campaignType) { str += '<i class="fa fa-envelope-o"></i>';
        } else if ('VIDEO' === campaignType) {  str += '<i class="fa fa-video-camera"></i>';
        } else if ('SOCIAL' === campaignType) { str += '<i class="fa fa-share-alt"></i>';
        } else if ('EVENT' === campaignType) {  str += '<i class="fa fa-calendar"></i>'; }
        element.find('.fc-right-block').after($(`<div id = ${event.id} class="fc-left-block col-xs-1 p0"> ${str} </div>`));
        $(element).popover({
          container: 'body',
          html: true,
          placement: 'auto',
          trigger: 'hover',
          content: function () { return $('#ca-' + event.id).html(); }
        });
      },
    });
  }
  getCampaignById(campaignId: number) {
    this.campaign = null;
    var obj = { 'campaignId': campaignId }
    this.campaignService.getCampaignById(obj)
      .subscribe(
      data => {
        this.campaign = data;
        var selectedVideoId  = this.campaign.selectedVideoId;
        this.isChannelCampaign = data.channelCampaign;
        if(selectedVideoId>0){ this.launchVideoPreview = this.campaign.campaignVideoFile;}
        if(this.campaign.userListIds.length>0) { this.loadContactList(this.contactListPagination);}
        $('#myModal').modal();
      },
      error => { console.error(error) },
      () => {
        const campaignType = this.campaign.campaignType.toLocaleString();
        if (campaignType.includes('VIDEO')) {
          this.campaignType = 'VIDEO';
        } else if (campaignType.includes('SOCIAL')) {
          this.campaignType = 'SOCIAL';
          this.getSocialCampaignByCampaignId(campaignId);
        } else if (campaignType.includes('EVENT')) {
          this.campaignType = 'EVENT';
          this.campaign.selectedEmailTemplateId = this.campaign.emailTemplate.id;
          // this.getEventCampaignByCampaignId(campaignId);
        } else {
          this.campaignType = 'EMAIL';
        }
        this.getEmailSentCount(campaignId);
        this.getEmailLogCountByCampaign(campaignId);
        this.getCampaignWatchedUsersCount(campaignId);
        setTimeout(() => { this.playVideo(); }, 200);
      }
      )
  }
  getSocialCampaignByCampaignId(campaignId: number) {
    try {
      this.socialService.getSocialCampaignByCampaignId(campaignId)
        .subscribe(
        data => {
          this.socialCampaign = data;
        },
        error => console.error(error),
        () => { }
        )
    } catch (error) {
      console.error('error' + error)
    }
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
  loadContactList(contactsListPagination: Pagination) {
    this.paginationType = 'contactslists';
    contactsListPagination.campaignUserListIds = this.campaign.userListIds;
    this.contactService.loadCampaignContactsList(contactsListPagination)
        .subscribe(
        (data: any) => {
          contactsListPagination.totalRecords = data.totalRecords;
            this.contactListPagination = this.pagerService.getPagedItems(contactsListPagination,data.listOfUserLists);
        },
        (error: string) => this.xtremandLogger.errorPage(error),
        () => this.xtremandLogger.info("Finished loadContactList()", this.contactListPagination)
        )
    }
    loadContactsOnPreview(contactList: any, pagination: Pagination) {
      pagination.pageIndex = 1;
      this.contactsPagination.maxResults = 12;
      this.loadContacts(contactList, pagination);
    }
    loadContacts(contactList: any, pagination: Pagination) {
      this.previewContactList = contactList;
      this.paginationType = 'contacts';
      this.contactService.loadUsersOfContactList(contactList.id, pagination).subscribe(
        (data: any) => {
          pagination.totalRecords = data.totalRecords;
          this.contactsPagination = this.pagerService.getPagedItems(pagination, data.listOfUsers);
          $('#contactsModal').modal('show');
        },
        error =>
          () => console.log('loadContacts() finished')
      );
    }
    paginationDropDown( pagination: Pagination){
      if(this.paginationType === 'contactslists'){
      this.loadContactList(pagination); }
      else if(this.paginationType === 'contacts') { this.loadContacts(this.previewContactList, pagination);}
      else if(this.paginationType === 'Total Recipients'){ this.listCampaignViews(this.campaign.campaignId, pagination); }
      else if(this.paginationType === 'Views'){ this.usersWatchList(this.campaign.campaignId, this.pagination); }
    }
    setPage(event:any){
      if (event.type === 'contacts') {
        this.contactsPagination.pageIndex = event.page;
        this.loadContacts(this.previewContactList, this.contactsPagination);
      } else if (event.type === 'contactslists') {
        this.contactListPagination.pageIndex = event.page;
        this.loadContactList(this.contactListPagination);
      } else if(event.type==='Total Recipients'){
        this.pagination.pageIndex = event.page;
        this.listCampaignViews(this.campaign.campaignId, this.pagination);
      } else if(event.type === 'Views'){
        this.pagination.pageIndex = event.page;
         this.usersWatchList(this.campaign.campaignId, this.pagination);
      }
    }
  getEmailSentCount(campaignId: number) {
    try {
      this.campaignService.getEmailSentCount(campaignId)
        .subscribe(
        data => {
          this.campaignReport.emailSentCount = data.emails_sent_count;
        },
        error => console.log(error),
        () => {
          // this.listCampaignViews(campaignId, this.campaignViewsPagination);
        }
        )
    } catch (error) { console.error('error' + error); }
  }
  emailActionList(campaignId: number, actionType: string, pagination: Pagination) {
    try{
    this.loading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.campaignService.emailActionList(campaignId, actionType, pagination)
     .subscribe(data => {
      this.campaignReport.emailLogs = data;
      this.campaignReport.emailActionType = actionType;
      if (actionType === 'open') {
          if ( this.sortByDropDown.length === 5 ) {
              this.sortByDropDown.push( { 'name': 'Subject(ASC)', 'value': 'subject-ASC' });
              this.sortByDropDown.push( { 'name': 'Subject(DESC)', 'value': 'subject-DESC' });
          }
            this.pagination.totalRecords = this.campaignReport.emailOpenCount;
      } else if (actionType === 'click') {
          this.sortByDropDown = this.sortByDropDown.filter(function(el) { return el.name != "Subject(ASC)"; });
          this.sortByDropDown = this.sortByDropDown.filter(function(el) { return el.name != "Subject(DESC)"; });
          this.pagination.totalRecords = this.campaignReport.emailClickedCount;
      }
      this.pagination = this.pagerService.getPagedItems(this.pagination, this.campaignReport.emailLogs);
      this.emailActionTotalList(campaignId, actionType, this.pagination.totalRecords);
      this.loading = false;
      this.referenceService.loading(this.httpRequestLoader, false);
    },
    error => console.log(error),
    () => console.log('emailActionList() completed')  )
  }catch(error) {this.xtremandLogger.error('Error in analytics page emails sent'+error); }
}
emailActionTotalList(campaignId: number, actionType: string, totalRecords: number) {
  try{
  this.loading = true;
   this.emailLogPagination.maxResults = totalRecords;
  // this.downloadTypeName = 'emailAction';
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
getSortedResult(campaignId: number,event:any){
  this.pagination = this.utilService.sortOptionValues(event,this.pagination);
  this.emailActionList(campaignId, this.campaignReport.emailActionType, this.pagination);
}

  listEmailLogsByCampaignIdUserIdActionType(emailLog: EmailLog, actionType: string) {
    this.campaignReport.emailLogs.forEach((element) => {
      if(element.userId !== emailLog.userId) {  element.isExpand = false; }
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

  navigateCampaignAnalytics(campaign: any) {
    this.referenceService.campaignType = campaign.campaignType;
    this.router.navigate(['/home/campaigns/' + campaign.campaignId + '/details']);
  }
  navigateRedistributedCampaigns(campaign: any) {
    this.router.navigate(['/home/campaigns/' + campaign.campaignId + "/re-distributed"]);
  }
  navigatePreviewPartners(campaign: any) {
    this.router.navigate(['/home/campaigns/' + campaign.campaignId + "/remove-access"]);
  }
  showCampaignPreview(campaign: any) {
    if (campaign.campaignType.indexOf('EVENT') > -1) {
      this.router.navigate(['/home/campaigns/event-preview/' + campaign.campaignId]);
    } else {
      this.router.navigate(['/home/campaigns/preview/' + campaign.campaignId]);
    }
  }
  editCampaign(campaign: any) {
    if (campaign.campaignType.indexOf('EVENT') > -1) {
      if (campaign.launched) {
        this.isScheduledCampaignLaunched = true;
        //  setTimeout(function() { $("#scheduleCompleted").slideUp(1000); }, 5000);
      } else {
        if (campaign.nurtureCampaign) {
          this.campaignService.reDistributeEvent = false;
          this.router.navigate(['/home/campaigns/re-distribute-manage/' + campaign.campaignId]);
        } else {
          this.router.navigate(['/home/campaigns/event-edit/' + campaign.campaignId]);
        }
      }
    }
    else {
      var obj = { 'campaignId': campaign.campaignId }
      this.campaignService.getCampaignById(obj)
        .subscribe(
        data => {
          this.campaignService.campaign = data;
          const isLaunched = this.campaignService.campaign.launched;
          const isNurtureCampaign = this.campaignService.campaign.nurtureCampaign;
          if (isLaunched) {
            this.isScheduledCampaignLaunched = true;
            //  setTimeout(function() { $("#scheduleCompleted").slideUp(1000); }, 5000);
          } else {
            if (isNurtureCampaign) {
              this.campaignService.reDistributeCampaign = data;
              this.campaignService.isExistingRedistributedCampaignName = true;
              this.router.navigate(['/home/campaigns/re-distribute-campaign']);
            }
            else {
              this.referenceService.isEditNurtureCampaign = false;
              this.router.navigate(["/home/campaigns/edit"]);
            }
          }
        },
        error => { console.error(error) },
        () => console.log()
        )
      this.isScheduledCampaignLaunched = false;
    }
  }
  getEmailTemplatePreview(emailTemplate:EmailTemplate){
    let body = emailTemplate.body;
    let emailTemplateName = emailTemplate.name;
    if(emailTemplateName.length>50){
        emailTemplateName = emailTemplateName.substring(0, 50)+"...";
    }
    $("#htmlContent").empty();
    $("#email-template-title").empty();
    $("#email-template-title").append(emailTemplateName);
    $('#email-template-title').prop('title',emailTemplate.name);
    let updatedBody = this.referenceService.showEmailTemplatePreview(this.campaign, this.campaignType,this.launchVideoPreview.gifImagePath, emailTemplate.body);
    $("#htmlContent").append(updatedBody);
    $('.modal .modal-body').css('overflow-y', 'auto');
    $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
    $("#show_email_template_preivew").modal('show');
}
  openSaveAsModal(campaign: any) {
    $('#saveAsModal').modal('show');
    this.saveAsCampaignId = campaign.campaignId;
    this.saveAsCampaignName = campaign.campaignName + "_copy";
    this.saveAsCampaignInfo = campaign;
  }

  setCampaignData(){
    let campaignData:any;
    if(this.saveAsCampaignInfo.campaignType === 'EVENT') {
      const saveAsCampaignData = new EventCampaign();
      saveAsCampaignData.id = this.saveAsCampaignInfo.campaignId;
      saveAsCampaignData.campaign = this.saveAsCampaignName;
      campaignData = saveAsCampaignData;
      campaignData.campaignType = this.saveAsCampaignInfo.campaignType;
    }
    else {
      const campaign = new Campaign();
      campaign.campaignName = this.saveAsCampaignName;
      campaign.campaignId = this.saveAsCampaignId;
      campaign.scheduleCampaign = "SAVE";
      campaign.campaignType = this.saveAsCampaignInfo.campaignType;
      campaignData = campaign;
    }
    return campaignData;
  }
  saveAsCampaign() {
    const campaignData = this.setCampaignData();
    this.campaignService.saveAsCampaign(campaignData)
      .subscribe(data => {
        $(window).scrollTop(0);
        this.customResponse =  new CustomResponse('SUCCESS', 'Copy campaign saved successfully', true);
        $('#myModal').modal('hide');
        },
        error => { $('#saveAsModal').modal('hide'); $('#myModal').modal('hide');
        this.customResponse =  new CustomResponse('ERROR', 'something went wrong in saving copy campaign', true); },
        () => {
        $('#saveAsModal').modal('hide');
        this.getCampaignCalendarView();
        }
      );
  }

  confirmDeleteCampaign(id: number) {
    this.deleteCampaignAlert = true;
  }
  deleteCampaign(id: number) {
    this.campaignService.delete(id)
      .subscribe(
      data => { },
      error => { console.error(error) },
      () => this.refreshCalendar(id)
      );
  }

  refreshCalendar(id: number){
        this.deleteCampaignAlert = false;
        $('#calendar').fullCalendar('removeEvents', id);
        $('#myModal').modal('hide');
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  closeModal(event:any){
  this.videoFile = undefined;
  }
  closeModalContact(){

  }
  ngOnInit() {
    this.renderCalendar();
  }
  ngOnDestroy() {
    $('#myModal').modal('hide');
  }
  listCampaignViews(campaignId: number, pagination: Pagination) {
    try{
    this.loading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    if(!this.campaign.detailedAnalyticsShared && this.campaign.dataShare){
        pagination.campaignId = campaignId;
        pagination.campaignType = "VIDEO";
        this.campaignService.listCampaignInteractiveViews(pagination)
         .subscribe(data => {  this.listCampaignViewsDataInsert(data); },
         error => console.log(error),
         () => console.log('listCampaignInteractiveViews(): called') )
    } else{
       this.campaignService.listCampaignViews(campaignId, pagination, this.isChannelCampaign)
         .subscribe(data => { this.listCampaignViewsDataInsert(data.campaignviews); },
          error => console.log(error),
          () => console.log('listCampaignViews(); called') )
       }
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }

  listCampaignViewsDataInsert(campaignviews: any){
      this.campaignViews= campaignviews;
      this.pagination.totalRecords = this.campaignReport.emailSentCount;
      this.pagination = this.pagerService.getPagedItems(this.pagination, this.campaignViews);
      this.loading = false;
      this.referenceService.loading(this.httpRequestLoader, false);
  }

   showAnalyticsModal(paginationType:any){
   // this.downloadTypeName = 'campaignViews';
    this.paginationType = paginationType;
    this.pagination = new Pagination();
    if(paginationType === 'Total Recipients'){
       this.listCampaignViews(this.campaign.campaignId, this.pagination);
    } else if(paginationType === 'Active Recipients'){
       this.emailActionList(this.campaign.campaignId, 'open', this.pagination);
    } else if(paginationType === 'Clicked URL'){
       this.emailActionList(this.campaign.campaignId, 'click', this.pagination);
    }
    if(paginationType === 'Views'){ this.usersWatchList(this.campaign.campaignId, this.pagination);
    } else { $('#calendarModal').modal();}
  }
  playVideo(){
    $('#main_video_src').empty();
    this.appendVideoData(this.launchVideoPreview, "main_video_src", "title");
  }

  usersWatchList(campaignId: number, pagination: Pagination) {
    try{
    this.loading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    // this.downloadTypeName = 'usersWatchedList';
    this.campaignService.usersWatchList(campaignId, pagination)
      .subscribe(
      data => {
        this.pagination.totalRecords = this.campaignReport.usersWatchCount;
        this.campaignReport.usersWatchList = data.data;
        $('#usersWatchListModal').modal();
        this.pagination = this.pagerService.getPagedItems(this.pagination, this.campaignReport.usersWatchList);
        this.usersWatchTotalList(campaignId, this.pagination.totalRecords);
        this.loading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      error => console.log(error),
      () => console.log()
      )
    }catch(error){ this.xtremandLogger.error('error'+error);}
  }
  usersWatchTotalList(campaignId: number, totalRecords: number) {
    try{
     this.loading = true;
     this.pagination.maxResults = totalRecords;
    //  this.downloadTypeName = 'usersWatchedList';
     this.campaignService.usersWatchList(campaignId, this.pagination)
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

  videoControllColors(videoFile: SaveVideoFile) {
    this.videoUtilService.videoColorControlls(videoFile);
    if($.trim(videoFile.controllerColor).length>0 && videoFile.transparency!=0) {
    const rgba =  this.videoUtilService.transparancyControllBarColor(videoFile.controllerColor, videoFile.transparency);
    $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    $('.video-js .vjs-big-play-button').css('cssText', 'top: 47px;!important');
    }
  }
  appendVideoData(videoFile:SaveVideoFile,divId:string,titleId:string){
   console.log(videoFile);
   let videoSelf = this;
   var fullImagePath = videoFile.imagePath;
   var title = videoFile.title;
   if(title.length>50){ title = title.substring(0, 50)+"...";}
   var videoPath = videoFile.videoPath;
   var is360 = videoFile.is360video;
   $("#"+divId).empty();
   $("#"+titleId).empty();
   $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="hls-video" rel="stylesheet">');
   if(is360){
       console.log("Loaded 360 Video");
       $('.h-video').remove();
       this.videoUtilService.player360VideoJsFiles();
       this.videoUtilService.video360withm3u8();
       var str = '<video id=videoId poster='+fullImagePath+'  class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
       $("#"+titleId).append(title);
       $('#'+titleId).prop(videoFile.title);
       $("#"+divId).append(str);
       videoPath = videoPath.substring(0, videoPath.lastIndexOf('.'));
       videoPath = videoPath+ '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
       $("#"+divId+" video").append('<source src=' + videoPath + ' type="application/x-mpegURL">');
       var player = videojs('videoId');
       player.panorama({
           autoMobileOrientation: true,
           clickAndDrag: true,
           clickToToggle: true,
           callback: function () {
             player.ready();
            videoSelf.videoControllColors(videoFile);
           }
         });
       $("#videoId").css("width", "100%");
       $("#videoId").css("height", "155px");
       $("#videoId").css("max-width", "100%");
   }else{
       console.log("Loaded Normal Video");
       $('.p-video').remove();
       this.videoUtilService.normalVideoJsFiles();
       var str = '<video id=videoId  poster='+fullImagePath+' preload="none"  class="video-js vjs-default-skin" controls></video>';
       $("#"+titleId).append(title);
       $('#'+titleId).prop(videoFile.title);
       $("#"+divId).append(str);
       videoPath = videoPath.substring(0,videoPath.lastIndexOf('.'));
       videoPath =  videoPath + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
       console.log("Normal Video Updated Path:::"+videoPath);
        $("#"+divId+" video").append('<source src='+videoPath+' type="application/x-mpegURL">');
        $("#videoId").css("width", "100%");
        $("#videoId").css("height", "155px");
        $("#videoId").css("max-width", "100%");
        var document:any = window.document;
       const overrideNativeValue = this.referenceService.getBrowserInfoForNativeSet();
       this.videojsPlayer = videojs("videoId", {
           html5: {
               hls: {
                   overrideNative: overrideNativeValue
               },
               nativeVideoTracks: !overrideNativeValue,
               nativeAudioTracks: !overrideNativeValue,
               nativeTextTracks: !overrideNativeValue
           } });
       if(videoFile) {
           this.videoControllColors(videoFile);
       }
       if(this.videojsPlayer){
        this.videojsPlayer.on('fullscreenchange', function () {
            var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
            var event = state ? 'FullscreenOn' : 'FullscreenOff';
            if(event=="FullscreenOn"){
                $(".vjs-tech").css("width", "100%");
                $(".vjs-tech").css("height", "100%");
            }else if(event=="FullscreenOff"){
              $("#videoId").css("width", "100%");
              $("#videoId").css("height", "155px");
              $("#videoId").css("max-width", "100%");
            }
        });
    }
   }
 }

 downloadEmailLogs(){

 }
 clearPaginationValues(){
  this.pagination =  new Pagination();
 }

}
