import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/authentication.service';
import { CampaignService } from '../services/campaign.service';
import { SocialService } from '../../social/services/social.service';
import { ReferenceService } from '../../core/services/reference.service';

import { SocialCampaign } from '../../social/models/social-campaign';
import { CampaignReport } from '../models/campaign-report';
import { Campaign } from '../models/campaign';
import { EventCampaign } from '../models/event-campaign';
declare var $, swal: any;
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  campaigns: any = [];
  campaign: any;
  socialCampaign: SocialCampaign = new SocialCampaign();
  events: any[] = [];
  campaignType: string;
  campaignReport: CampaignReport = new CampaignReport;

  deleteCampaignAlert: boolean = false;
  hasCampaignRole: boolean = false;
  hasStatsRole: boolean = false;
  hasAllAccess = false;
  isOnlyPartner: boolean = false;
  isScheduledCampaignLaunched: boolean = false;
  loggedInUserId: number = 0;

  saveAsCampaignId = 0;
  saveAsCampaignName = '';
  saveAsCampaignInfo: any;
  loading: boolean = false;
  constructor(public authenticationService: AuthenticationService, private campaignService: CampaignService, private socialService: SocialService,
    public referenceService: ReferenceService, private router: Router) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.hasCampaignRole = this.referenceService.hasSelectedRole(this.referenceService.roles.campaignRole);
    this.hasStatsRole = this.referenceService.hasSelectedRole(this.referenceService.roles.statsRole);
    this.hasAllAccess = this.referenceService.hasAllAccess();
    this.isOnlyPartner = this.authenticationService.isOnlyPartner();

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
    let backgroundColor: string = '#fff';
    if ('SAVE' === event.data.status) {
      backgroundColor = '#6c757d';
    } else if ('SCHEDULE' === event.data.status) {
      backgroundColor = '#007bff';
    } else {
      if (event.data.percentage <= 25)
        backgroundColor = '#dc3545';
      else if (event.data.percentage > 25 && event.data.percentage <= 50)
        backgroundColor = '#ffc107';
      else if (event.data.percentage > 50 && event.data.percentage <= 75)
        backgroundColor = '#17a2b8';
      else if (event.data.percentage > 75 && event.data.percentage <= 100)
        backgroundColor = '#28a745';
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
        $('#myModal').modal();
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

        if ('REGULAR' === campaignType) {
          str += '<i class="fa fa-envelope-o"></i>';
        } else if ('VIDEO' === campaignType) {
          str += '<i class="fa fa-video-camera"></i>';
        } else if ('SOCIAL' === campaignType) {
          str += '<i class="fa fa-share-alt"></i>';
        } else if ('EVENT' === campaignType) {
          str += '<i class="fa fa-calendar"></i>';
        }

        element.find('.fc-right-block')
          .after($(`<div id = ${event.id} class="fc-left-block col-xs-1 p0"> ${str} </div>`));
        $(element).popover({
          container: 'body',
          html: true,
          placement: 'auto',
          trigger: 'hover',
          content: function () {
            return $('#ca-' + event.id).html();
          }
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
      },
      error => { console.error(error) },
      () => {
        const campaignType = this.campaign.campaignType.toLocaleString();
        if (campaignType.includes('VIDEO')) {
          this.campaignType = 'VIDEO';
          // this.getCountryWiseCampaignViews(campaignId);
          // this.getCampaignViewsReportDurationWise(campaignId);
          // this.getCampaignWatchedUsersCount(campaignId);
          // this.campaignWatchedUsersListCount(campaignId);
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
          let isLaunched = this.campaignService.campaign.launched;
          let isNurtureCampaign = this.campaignService.campaign.nurtureCampaign;
          let campaignType = this.campaignService.campaign.campaignType;
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
  openSaveAsModal(campaign: any) {
    $('#saveAsModal').modal('show');
    this.saveAsCampaignId = campaign.campaignId;
    this.saveAsCampaignName = campaign.campaignName + "_copy";
    this.saveAsCampaignInfo = campaign;
  }

  saveAsCampaign() {
    if (this.saveAsCampaignInfo.campaignType == 'EVENT') {
      this.saveAsEventCampaign(this.saveAsCampaignInfo);
    }
    else {
      console.log(this.saveAsCampaignId + '-' + this.saveAsCampaignName);
      let campaign = new Campaign();
      campaign.campaignName = this.saveAsCampaignName;
      campaign.campaignId = this.saveAsCampaignId;
      campaign.scheduleCampaign = "SAVE";
      console.log(campaign);
      this.campaignService.saveAsCampaign(campaign)
        .subscribe(
        data => {},
        error => console.error(error),
        () => {
          $('#saveAsModal').modal('hide'); 
          this.getCampaignCalendarView();  
        }
        );
    }
  }

  saveAsEventCampaign(saveAsCampaign: any) {

    let saveAsCampaignData = new EventCampaign();
    saveAsCampaignData.id = saveAsCampaign.campaignId;
    saveAsCampaignData.campaign = this.saveAsCampaignName;
    this.campaignService.saveAsEventCampaign(saveAsCampaignData).subscribe(
      (data) => {},
        error => console.error(error),
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
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

  ngOnInit() {
    this.renderCalendar();
  }

  ngOnDestroy() {
    $('#myModal').modal('hide');
  }

}
