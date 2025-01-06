import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
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
  showMeetingSchedulingInputField: boolean = false;
  ngxloading: boolean = false;
  isValidURL: boolean = false;
  HTTP_OK = 200;
	HTTP_UNAUTHORIZED = 401;
  customResponse: CustomResponse = new CustomResponse();

  constructor(private referenceService: ReferenceService, private renderer: Renderer2, private calendarIntegratonService: CalendarIntegrationService, 
    public properties: Properties, public calendarIntegrationService: CalendarIntegrationService) { }

  ngOnInit() {
    if (this.calendarType == 'CALENDLY') {
      if (!this.referenceService.checkIsValidString(this.schedulingUrl)) {
        this.showMeetingSchedulingInputField = true;
      } else {
        this.addCalendlyScript();
      }
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

  validateURL() {
		if (this.referenceService.checkIsValidString(this.schedulingUrl)) {
			this.isValidURL = true;
		} else {
			this.isValidURL = false;
		}
	}

	submit() {
		this.ngxloading = true;
		this.calendarIntegrationService.checkAssociationAndUpdateSchedulingURL(this.schedulingUrl).subscribe(
			response => {
				if (response.statusCode == this.HTTP_OK) {
					this.customResponse = new CustomResponse('SUCCESS', 'Meeting Scheduling Link updated successfully.', true);
          this.addCalendlyScript();
          this.showMeetingSchedulingInputField = false;
				} else if (response.statusCode == this.HTTP_UNAUTHORIZED) {
					this.customResponse = new CustomResponse('ERROR', response.message, true);
				} else {
					this.customResponse = new CustomResponse('ERROR', 'Failed to update Meeting Scheduling link.', true);
				}
				this.ngxloading = false;
			}, error => {
				this.ngxloading = false;
				this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
			}
		)
	}

}
