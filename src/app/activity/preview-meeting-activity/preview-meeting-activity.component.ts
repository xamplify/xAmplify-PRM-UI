import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { MeetingActivityService } from '../services/meeting-activity.service';
import { Properties } from 'app/common/models/properties';
import { ReferenceService } from 'app/core/services/reference.service';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';

declare var $:any;

@Component({
  selector: 'app-preview-meeting-activity',
  templateUrl: './preview-meeting-activity.component.html',
  styleUrls: ['./preview-meeting-activity.component.css'],
  providers: [MeetingActivityService]
})
export class PreviewMeetingActivityComponent implements OnInit {

  @Input() eventUrl: any;
  @Input() contactId: any;

  @Output() notifyClose = new EventEmitter();

  meetingActivity: any;
  ngxLoading: boolean = false;
  customResponse: CustomResponse = new CustomResponse();
  showAllGuests: boolean = false;
  isMeetingUrlCopied: boolean = false;

  constructor(private meetingService: MeetingActivityService, private properties: Properties, private referenceService: ReferenceService) { }

  ngOnInit() {
    this.fetchCalendlyEventByEventUrl();
    this.referenceService.openModalPopup('previewMeetingModalPopup');
  }
  ngOnDestroy(){
    this.referenceService.closeModalPopup('previewMeetingModalPopup');
  }
  fetchCalendlyEventByEventUrl() {
    this.ngxLoading = true;
    this.meetingService.fetchCalendlyEvent(this.eventUrl, this.contactId).subscribe(
      response => {
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          this.meetingActivity = response.data;
        } else {
          this.customResponse = new CustomResponse('ERROR', 'Failed to fetch meeting.', true);
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      }
    )
  }

  closeMeetingModal() {
    this.referenceService.closeModalPopup('previewMeetingModalPopup');
    this.notifyClose.emit();
  }

  toggleGuests(): void {
    this.showAllGuests = !this.showAllGuests;
  }

  copyToClipBoard(inputValue: HTMLElement) {
    const title = inputValue.getAttribute('value') || '';
    const textarea = document.createElement('textarea');
    textarea.value = title;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  copyMeetingUrl(inputValue: HTMLElement) {
    this.isMeetingUrlCopied = true;
    this.copyToClipBoard(inputValue);

    setTimeout(() => {
      this.isMeetingUrlCopied = false;
    }, 2000)
  }

}
