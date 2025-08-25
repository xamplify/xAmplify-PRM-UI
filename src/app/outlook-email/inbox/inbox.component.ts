import { Component, OnInit } from '@angular/core';
import { OutlookEmailService } from '../outlook-email.service';
import { EmailThread } from '../models/email-thread';
import { Router } from '@angular/router';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-outlook-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  threads: EmailThread[] = [];
  selectedThread: EmailThread | null = null;
  loading = false;
  accessToken: string;
  statusCode: any;
  type: any;
  actionType: string = 'NewMail';
  showEmailModalPopup: boolean = false;
  authenticateEmailId: string;
  constructor(private outlookEmailService: OutlookEmailService, private router: Router,private referenceService:ReferenceService) { }

  ngOnInit() {
    this.getAccessToken();
  }
  getAccessToken() {
    this.loading = true;
    this.outlookEmailService.getAccessToken().subscribe(
      result => {
        this.statusCode = result.statusCode;
        const activeRecord = result.data.find((item: any) => item.active === true);
        if (activeRecord) {
          this.type = activeRecord.type;
          this.accessToken = activeRecord.accessToken;
          this.authenticateEmailId = activeRecord.externalEmailId;
        } else {
          this.accessToken = null;
          console.warn('No active record found.');
        }
        this.loading = false;
      },
      error => {
        console.error('Failed to get access token:', error);
        this.loading = false;
      }, () => {
        if (this.statusCode === 200 && this.accessToken) {
          console.log('Access Token:', this.accessToken);
          if (this.type === 'OUTLOOK') {
            this.getOutlookThreads(this.accessToken);
          } else if (this.type === 'GMAIL') {
            this.getGmailThreads(this.accessToken);
          }
        }
      }
    );
  }

  getGmailThreads(accessToken: string) {
    this.loading = true;
    this.outlookEmailService.getGmailThreads(accessToken).subscribe(
      result => {
        this.threads = result.data;
        this.statusCode = result.statusCode;
        this.loading = false;
      },
      () => this.loading = false
    );
  }
  getOutlookThreads(accessToken: string) {
    this.loading = true;
    this.outlookEmailService.getOutlookThreads(accessToken).subscribe(
      result => {
        this.threads = result.data;
        this.statusCode = result.statusCode;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  selectThread(thread: EmailThread) {
    let selectedThread: any = {};
    selectedThread.subject = thread.subject;
    selectedThread.threadId = thread.threadId;
    selectedThread.accessToken = this.accessToken;
    selectedThread.type = this.type;
    selectedThread.messages = thread.messages;
    selectedThread.authenticateEmailId = this.authenticateEmailId;
    this.outlookEmailService.setContent(selectedThread);
    this.router.navigateByUrl('/home/mails/preview');
  }


  getShortBody(body: string): string {
    if (!body) return '';
    const plainText = body.replace(/<[^>]+>/g, '');
    const short = plainText.length > 20 ? plainText.substr(0, 20) + '...' : plainText;
    return '-' + short;
  }

  getNameOnly(input: string): string {
    if (input === this.authenticateEmailId) {
      return 'me';
    }
    const cleanInput = input.replace(/"/g, '').trim();
    const index = cleanInput.indexOf('<');
    return index !== -1 ? cleanInput.substring(0, index).trim() : cleanInput;
  }

  openEmailModalPopup() {
    this.actionType = 'NewMail';
    this.showEmailModalPopup = true;
  }
 closeEmailModalPopup(event:any) {
     this.showEmailModalPopup = false;
    if (event === "Email sent sucessfully") {
      this.referenceService.showSweetAlertSuccessMessage(event);
    } else {
      this.referenceService.showSweetAlertErrorMessage(event);
    }
  }
}
