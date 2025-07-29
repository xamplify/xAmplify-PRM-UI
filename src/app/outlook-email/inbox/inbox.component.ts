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

  constructor(private outlookEmailService: OutlookEmailService) {}

  ngOnInit() {
    this.fetchThreads();
  }

  fetchThreads() {
    this.loading = true;
    this.outlookEmailService.fetchThreads().subscribe(
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
}
