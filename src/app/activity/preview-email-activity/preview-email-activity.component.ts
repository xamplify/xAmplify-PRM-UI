import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { EmailActivityService } from '../services/email-activity-service';
import { EmailActivity } from '../models/email-activity-dto';

declare var $: any;

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
  @Input() isWelcomeEmail: boolean = false; 

  welcomeAttachments: { name: string; path: string }[] = [];
  ngxLoading:boolean = false;
  emailActivity:EmailActivity = new EmailActivity();
  highlightLetter: any;
  showFilePathError:boolean = false;
  hasRestrictedLinks: boolean = false;

  constructor(public referenceService: ReferenceService, public emailActivityService:EmailActivityService) { }

  ngOnInit() {
     if (this.isWelcomeEmail) {
      this.getWelcomeEmailList();
    } else {
      this.fetchEmailActivityById();
    }
    this.referenceService.openModalPopup('previewEmailModalPopup');
  }
  ngOnChanges() {
    if (this.isWelcomeEmail) {
      this.getWelcomeEmailList();
    } else {
      this.fetchEmailActivityById();
    }
    this.referenceService.openModalPopup('previewEmailModalPopup');
  }
  ngOnDestroy(){
    this.referenceService.closeModalPopup('previewEmailModalPopup');
  }
  fetchEmailActivityById() {
    this.ngxLoading = true;
    this.emailActivityService.fetchEmailActivityById(this.emailActivityId).subscribe(
      data => {
        if (data.statusCode == 200) {
          this.emailActivity = data.data;
          this.contactName = this.emailActivity.fullName;
          this.contactEmailId = this.emailActivity.addedForEmailId;
        }
        this.ngxLoading = false;
        $('#sendTestEmailHtmlBody').html('');
        $('#sendTestEmailHtmlBody').append(this.emailActivity.body);
      }, error => {
        this.ngxLoading = false;
      }, () => {
        this.setHighlightLetter();
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
getWelcomeEmailList(): void {
  this.ngxLoading = true;
  this.emailActivityService
    .getWelcomeEmailDetailsById(this.emailActivityId)
    .subscribe(
      res => {
        if (res.statusCode === 200) {
          this.emailActivity = res.data;

          // Handle attachments
          if (this.emailActivity.attachmentPaths && this.emailActivity.fileNames) {
            const paths = this.emailActivity.attachmentPaths.split(' ,');
            const names = this.emailActivity.fileNames.split(' ,');
            this.welcomeAttachments = paths.map((p, idx) => ({
              path: p.trim(),
              name: names[idx] ? names[idx].trim() : `Attachment ${idx + 1}`,
              uploadedFile: false
            }));
          } else {
            this.welcomeAttachments = [];
          }

          const bodyEl = document.getElementById('sendTestEmailHtmlBody');
          if (bodyEl) {
            bodyEl.innerHTML = this.emailActivity.body || '';

            const links = bodyEl.querySelectorAll('a');
            Array.prototype.forEach.call(links, (link: HTMLAnchorElement) => {
              // Disable all <a> tags from being clickable
              link.style.pointerEvents = 'none';
              link.style.cursor = 'not-allowed';
              link.title = 'Links are disabled in preview';
              ['click', 'dblclick', 'contextmenu'].forEach(evt =>
                link.addEventListener(evt, e => {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                })
              );

              // Additional logic for login links (preserve existing)
              if (link.textContent && link.textContent.trim().toLowerCase() === 'login') {
                link.title = 'Login is restricted';
              }
            });

            const buttons = bodyEl.querySelectorAll('button');
            Array.prototype.forEach.call(buttons, (btn: HTMLButtonElement) => {
              if (btn.textContent && btn.textContent.trim().toLowerCase() === 'login') {
                btn.disabled = true;
                btn.style.cursor = 'not-allowed';
                btn.title = 'Login is restricted';
                ['click', 'dblclick', 'contextmenu'].forEach(evt =>
                  btn.addEventListener(evt, e => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  })
                );
              }
            });
          }
          this.setHighlightLetter();
        }
      },
      () => { },
      () => { this.ngxLoading = false; }
    );
}
}
