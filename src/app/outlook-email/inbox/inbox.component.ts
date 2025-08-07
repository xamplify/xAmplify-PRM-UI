import { Component, OnInit } from '@angular/core';
import { OutlookEmailService } from '../outlook-email.service';
import { EmailThread } from '../models/email-thread';

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
  type:any;
  constructor(private outlookEmailService: OutlookEmailService) { }

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
          if(this.type === 'OUTLOOK') {
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
        this.threads = result;
        this.loading = false;
      },
      () => this.loading = false
    );
  }
    getOutlookThreads(accessToken: string) {
    this.loading = true;
    this.outlookEmailService.getOutlookThreads(accessToken).subscribe(
      result => {
        this.threads = result;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  selectThread(thread: EmailThread) {
    this.selectedThread = thread;
  }


  getShortBody(body: string): string {
    if (!body) return '';
    const plainText = body.replace(/<[^>]+>/g, '');
    const short = plainText.length > 45 ? plainText.substr(0, 49) + '...' : plainText;
    return '-' + short;
  }

  getNameOnly(input: string): string {
  const cleanInput = input.replace(/"/g, '').trim();

  const index = cleanInput.indexOf('<');
  return index !== -1 ? cleanInput.substring(0, index).trim() : cleanInput;
}
}
