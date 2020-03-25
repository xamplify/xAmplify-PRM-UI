import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CampaignService } from '../services/campaign.service';
import { SocialService } from '../../social/services/social.service';
import { ReferenceService } from '../../core/services/reference.service';

import { SocialCampaign } from '../../social/models/social-campaign';
import { CampaignReport } from '../models/campaign-report';
import { CustomResponse } from '../../common/models/custom-response';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { VideoUtilService } from 'app/videos/services/video-util.service';
import { Pagination } from 'app/core/models/pagination';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { PagerService } from 'app/core/services/pager.service';
import { ContactService } from 'app/contacts/services/contact.service';
import { ContactList } from 'app/contacts/models/contact-list';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from 'app/core/services/util.service';
declare var $: any;

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


  totalViewsPatination:Pagination = new Pagination();
  totalEmailActionListPagination:Pagination = new Pagination();
  totalUserWatchedListPagination:Pagination = new Pagination();


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
  totalCampaignViews: any;
  precampaignType:string;
  isChannelCampaign:boolean;
  sortByDropDown = [
    { 'name': 'Sort By', 'value': '' },
    { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
    { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
    { 'name': 'Time(ASC)', 'value': 'time-ASC' },
    { 'name': 'Time(DESC)', 'value': 'time-DESC' }
  ];
  modalTitle: string;
  downloadDataList = [];
  downloadCsvList: any;
  logListName = "";
  previewCampaign: any;
  selectedSortedOption:any = this.sortByDropDown[this.sortByDropDown.length-1];
  teamMemberId: number = 0;
  categoryId:number = 0;
  constructor(public authenticationService: AuthenticationService, private campaignService: CampaignService, private socialService: SocialService,
    public referenceService: ReferenceService, private router: Router, public videoUtilService:VideoUtilService, public xtremandLogger:XtremandLogger,
    public contactService:ContactService, public pagerService:PagerService, public utilService:UtilService,private route: ActivatedRoute) {
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
    let teamMemberAnalytics = false;
    if(this.teamMemberId>0){
      teamMemberAnalytics = true;
    }
    var request = { startTime: view.start._d, endTime: view.end._d, userId: this.loggedInUserId,'teamMemberAnalytics':teamMemberAnalytics,'teamMemberId':this.teamMemberId,'categoryId':this.categoryId };
    this.loading = true;
    this.campaignService.getCampaignCalendarView(request)
      .subscribe(
      data => {
        this.events = [];
        this.campaigns = data;
        this.campaigns.forEach(element => {
          let startTime;
          if(element.status === 'SAVE'){
            startTime = element.updatedTime;
          } else {
            startTime = element.launchTime;
          }
          let event: any = {id: element.id, title: element.campaign, start: startTime, data: element, editable: false, allDay: false};
          this.events.push(event);
        });
        $('#calendar').fullCalendar('addEventSource', this.events);
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
    this.teamMemberId = this.route.snapshot.params['teamMemberId'];
    this.categoryId = this.route.snapshot.params['categoryId'];
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listWeek'
      },
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      allDayDefault: false,
      events: this.events,
      timeFormat: 'h:mm a',
      timezone: 'local',
      height: 'parent',
      eventClick: function (event) {
        self.previewCampaign = event.id;
        self.precampaignType = event.data.type;
        self.referenceService.loadingPreview = true;
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
        }else if ('LANDINGPAGE' === campaignType) {  str += '<i class="fa fa-wpforms"></i>';
        }else if ('VIDEO' === campaignType) {  str += '<i class="fa fa-video-camera"></i>';
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
  showMessageOnTop(mesg:string) {
    $(window).scrollTop(0);
    this.customResponse =  new CustomResponse('SUCCESS', mesg, true);
}
  closePreviewCampaign(event){
    this.previewCampaign = undefined;
    if(event === 'copy campaign success'){ this.showMessageOnTop('Copy campaign saved successfully'); this.getCampaignCalendarView();}
    if(event.delete ==='deleted campaign success'){
      this.showMessageOnTop(event.campaignName + ' campaign deleted successfully');
      this.refreshCalendar(event.id);
    }
    if(event.delete ==='something went wrong in delete' ){
      this.referenceService.loading(this.httpRequestLoader, false);
      const deleteMessage =  'something went wrong  when '+event.campaignName + ' deleting. please try again';
      this.customResponse = new CustomResponse('ERROR', deleteMessage, true);
    }
    if(event ==='something went wrong') {
      this.customResponse =  new CustomResponse('ERROR', 'something went wrong, please try again', true);
    }
  }

  refreshCalendar(id: number){
    this.deleteCampaignAlert = false;
    $('#calendar').fullCalendar('removeEvents', id);
  }

  closeModal(event:any){
  this.videoFile = undefined;
  }
  ngOnInit() {
    this.renderCalendar();
  }
  ngOnDestroy() {
  }

  goToManageCampaigns(){
    if(this.teamMemberId>0){
      if(this.categoryId!=undefined && this.categoryId>0){
        this.router.navigate(['/home/campaigns/manage/'+this.categoryId+"/"+this.teamMemberId]);
      }else{
        this.router.navigate(['/home/campaigns/manage/tm/'+this.teamMemberId]);
      }
      
    }else{
      if(this.categoryId!=undefined && this.categoryId>0){
        this.router.navigate(['/home/campaigns/manage/'+this.categoryId]);
      }else{
        this.router.navigate(['/home/campaigns/manage/']);
      }
      
    }
    
  }

}
