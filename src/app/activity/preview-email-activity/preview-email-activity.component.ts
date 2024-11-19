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
  @Output() notifyClose = new EventEmitter();

  ngxLoading:boolean = false;
  emailActivity:EmailActivity = new EmailActivity();

  constructor(public referenceService: ReferenceService, public emailActivityService:EmailActivityService) { }

  ngOnInit() {
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

  closeEmailModal() {
    this.referenceService.closeModalPopup('previewEmailModalPopup');
    this.notifyClose.emit();
  }

}
