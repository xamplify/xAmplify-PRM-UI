import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { CalendarIntegrationService } from 'app/core/services/calendar-integration.service';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-add-meeting-modal-popup',
  templateUrl: './add-meeting-modal-popup.component.html',
  styleUrls: ['./add-meeting-modal-popup.component.css']
})
export class AddMeetingModalPopupComponent implements OnInit {
  @Input() calendarType:any;
  @Input() schedulingUrl: string;

  @Output() notifyClose = new EventEmitter();

  ngxLoading:boolean = false;
  activeCalendarDetails:any;

  constructor(private referenceService: ReferenceService, private renderer: Renderer2, private calendarIntegratonService: CalendarIntegrationService) { }

  ngOnInit() {
    if (this.calendarType == 'CALENDLY') {
      this.addCalendlyScript();
    }
    this.referenceService.openModalPopup('addMeetingModalPopup');
  }

  getActiveCalendarDetails() {
    this.ngxLoading = true;
    this.calendarIntegratonService.getActiveCalendarDetails().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.activeCalendarDetails = response.data;
        }
      }
    )
  }

  addCalendlyScript(): void {
    const scriptId = 'calendly-widget-script';
    if (document.getElementById(scriptId)) {
      return;
    }
    const script = this.renderer.createElement('script');
    script.id = scriptId;
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    this.renderer.appendChild(document.body, script);
  }

  closeMeetingModal() {
    this.referenceService.closeModalPopup('addMeetingModalPopup');
    this.notifyClose.emit();
  }

  ngOnDestroy(): void {
    this.removeCalendlyScript('calendly-widget-script');
  }

  removeCalendlyScript(scriptId:any): void {
    const script = document.getElementById(scriptId);
    if (script) {
      script.remove();
    }
  }

}
