import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { MeetingActivityService } from '../services/meeting-activity.service';
import { Pagination } from 'app/core/models/pagination';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';

declare var $: any;

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.css']
})
export class EventCalendarComponent implements OnInit {

  @Input() contactId: any;
  @Input() calendarType:any;
  @Input() isReloadCalendar:boolean;
  @Output() notifyClose = new EventEmitter();

  showConfigureMessage:boolean = false;
  showPreviewModalPopup: boolean = false;
  events: any[] = [];
  ngxLoading: boolean = false;
  meetingActivities: any;
  eventUrl: any;
  showCalendarIntegrationsModalPopup:boolean = false;
  isFirstChange:boolean = true;

  constructor(private referenceService: ReferenceService, private meetingService: MeetingActivityService) { }

  ngOnInit() {
    if (this.referenceService.checkIsValidString(this.calendarType)) {
      this.renderCalendar();
    } else {
      this.showConfigureMessage = true;
    }
  }

  ngOnChanges() {
    if (this.isFirstChange) {
      this.isFirstChange = !this.isFirstChange;
    } else {
      this.getMeetingCalendarView();
    }
  }

  closePopup() {
    this.notifyClose.emit(!this.isReloadCalendar);
  }

  closePreviewMeetingModalPopup() {
    this.showPreviewModalPopup = false;
  }

  ngAfterViewInit(): void {
    if (this.referenceService.checkIsValidString(this.calendarType)) {
      $('#calendar-integration-modal-popup').on('shown.bs.modal', () => {
        if ($('#calendar').fullCalendar) {
          $('#calendar').fullCalendar('render'); // Re-render if already initialized
        } else {
          this.renderCalendar(); // Initialize for the first time
        }
      });
    } else {
      this.showConfigureMessage = true;
    }
  }
  

  renderCalendar() {
    const self = this;
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listWeek'
      },
      navLinks: true,
      editable: true,
      eventLimit: true,
      allDayDefault: false,
      events: this.events,
      timeFormat: 'h:mm a',
      timezone: 'local',
      eventClick: function (event) {
        self.openCustomPopup(event);
      },
      viewRender: function (view: any, element: any) {
        self.getMeetingCalendarView();
      },
      eventRender: function (event: any, element: any) {
        element.find('.fc-time').addClass('fc-time-title mr5');
        element.find('.fc-title').addClass('fc-time-title ml5');
        element.find('.fc-time-title').wrapAll('<div class="fc-right-block col-xs-11 flex pull-right p0 mr-10"></div>');
        element.css('background', '#3c9df2');
        let str = '<i class="fa fa-video-camera"></i>';
        element.find('.fc-right-block').after($(`<div id = ${event.data.id} class="fc-left-block col-xs-1 p0 z_index_10052"> ${str} </div>`));
        $(element).popover({
          container: 'body',
          html: true,
          placement: 'auto',
          trigger: 'hover',
          content: function () { return $('#ca-' + event.data.id).html(); }
        });
      },
    });
  }

  getMeetingCalendarView() {
    $('#calendar').fullCalendar('removeEvents');
    var view = $('#calendar').fullCalendar('getView');
    this.ngxLoading = true;
    let pagination = new Pagination();
    pagination.fromDateFilterString = view.start._d.toDateString();
    pagination.toDateFilterString = view.end._d.toDateString();
    pagination.contactId = this.contactId;
    this.meetingService.fetchAllMeetingActivities(pagination, 'calendly').subscribe(
      response => {
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          this.events = [];
          this.meetingActivities = [];
          this.meetingActivities = response.data.list;
          this.meetingActivities.forEach(element => {
            let displayTime = new Date(element.startTime);
            element.displayTime = new Date(element.startTime);
            let event: any = { id: element.uri, title: element.name, start: displayTime, data: element, editable: false, allDay: true };
            this.events.push(event);
          });
          $('#calendar').fullCalendar('addEventSource', this.events);
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
      }
    )
  }

  openCustomPopup(eventData: any): void {
    if (eventData.id != undefined) {
      this.eventUrl = eventData.id;
      this.showPreviewModalPopup = true;
    }
  }

  closeCalendarIntegrationsModalPopup() {
    this.showCalendarIntegrationsModalPopup = false;
  }

  ngOnDestroy() {
    this.meetingActivities = [];
  }

}
