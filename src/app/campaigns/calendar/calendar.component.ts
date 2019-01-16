import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CampaignService } from '../services/campaign.service';

declare var $: any;
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  campaigns: any = [];
  campaign: any;
  events: any = [];
  constructor(private authenticationService: AuthenticationService, private campaignService: CampaignService) { }
  getCampaignCalendarView(userId: number) {
    this.campaignService.getCampaignCalendarView(userId)
      .subscribe(
      data => {
        this.campaigns = data;

        this.campaigns.forEach(element => {
          let event: any = {};
          event.id = element.id;
          event.title = element.campaign;
          event.start = element.createdTime;
          if (element.type === 'VIDEO')
            event.backgroundColor = '#ff6cae';
          else if (element.type === 'REGULAR')
            event.backgroundColor = '#00d0e4';
          else if (element.type === 'SOCIAL')
            event.backgroundColor = '#00d789';
          else if (element.type === 'EVENT')
            event.backgroundColor = '#ffbf00';
          this.events.push(event);
        });
      },
      error => console.log(error),
      () => this.renderCalendar()
      );
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
      eventClick: function (event) {
        console.log(event);
        self.getCampaignById(event.id)
        $('#myModal').modal();
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
      () => console.log()
      )
  }


  ngOnInit() {
    const userId = this.authenticationService.getUserId();
    this.getCampaignCalendarView(userId);


  }

}
