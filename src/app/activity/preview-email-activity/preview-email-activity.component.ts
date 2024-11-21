import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { EmailActivityService } from '../services/email-activity-service';
import { EmailActivity } from '../models/email-activity-dto';

@Component({
  selector: 'app-preview-email-activity',
  templateUrl: './preview-email-activity.component.html',
  styleUrls: ['./preview-email-activity.component.css']
})
export class PreviewEmailActivityComponent implements OnInit {

  @Input() emailActivityId:any;
  @Input() contactEmailId:any;
  @Input() contactName:any;
  @Output() notifyClose = new EventEmitter();

  ngxLoading:boolean = false;
  emailActivity:EmailActivity = new EmailActivity();
  highlightLetter: any;
  showFilePathError:boolean = false;

  constructor(public referenceService: ReferenceService, public emailActivityService:EmailActivityService) { }

  ngOnInit() {
    this.setHighlightLetter();
    this.fetchEmailActivityById();
    this.referenceService.openModalPopup('previewEmailModalPopup');
  }

  fetchEmailActivityById() {
    this.ngxLoading = true;
    this.emailActivityService.fetchEmailActivityById(this.emailActivityId).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.emailActivity = data.data;
        }
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
      }
    )
  }

  setHighlightLetter() {
    if (this.referenceService.checkIsValidString(this.contactName)) {
      this.highlightLetter = this.referenceService.getFirstLetter(this.contactName);
    } else if (this.referenceService.checkIsValidString(this.contactEmailId)) {
      this.highlightLetter = this.referenceService.getFirstLetter(this.contactEmailId);
    }
  }

  closeEmailModal() {
    this.referenceService.closeModalPopup('previewEmailModalPopup');
    this.notifyClose.emit();
  }

}
