import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OutlookEmailService } from '../outlook-email.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailThread } from '../models/email-thread';

@Component({
  selector: 'app-previewemail',
  templateUrl: './previewemail.component.html',
  styleUrls: ['./previewemail.component.css']
})
export class PreviewemailComponent implements OnInit {
  selectedThread: any;
  expandedMessages = new Set<number>();
  htmlString: string;
  htmlContent: any;
  loading: boolean = false;
  threads: EmailThread;
  constructor(private router: Router, private outlookEmailService: OutlookEmailService, private vanityURLService: VanityURLService, public sanitizer: DomSanitizer) {
    this.selectedThread = this.outlookEmailService.getContent();
    this.fetchGmailsByThreadId();
  }

  ngOnInit() {

  }
  fetchGmailsByThreadId() {
    this.loading = true;
    this.outlookEmailService.fetchGmailsByThreadId(this.selectedThread.accessToken, this.selectedThread.threadId).subscribe(
      result => {
        this.threads = result.data;
        this.loading = false;
      },
      () => this.loading = false
    );
  }
  backToList() {
    this.router.navigateByUrl('/home/mails');
  }
  getNameOnly(input: string): string {
    const cleanInput = input.replace(/"/g, '').trim();

    const index = cleanInput.indexOf('<');
    return index !== -1 ? cleanInput.substring(0, index).trim() : cleanInput;
  }
  getEmailOnly(input: string): string {
    const cleanInput = input.replace(/"/g, '').trim();

    const emailMatch = cleanInput.match(/<([^>]+)>/);
    return emailMatch ? emailMatch[1].trim() : '';
  }

  getBodyContent(msg: any): string {
    const bodyContent = msg.bodyContent;
    if (!bodyContent) {
      return msg.body;
    }
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(bodyContent);
    return this.htmlContent;
  }

  downloadAttachment(att: any) {
    const byteCharacters = atob(att.contentBytes);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: att.contentType });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = att.name;
    link.click();
  }
  getAttachmentUrl(att: any): string {
    if (!att || !att.contentBytes) return '';
    return `data:${att.contentType};base64,${att.contentBytes}`;
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
  getTotalMessages(): number {
    return this.threads.messages.length || 0;
  }

  toggleMessage(index: number): void {
    if (this.expandedMessages.has(index)) {
      this.expandedMessages.delete(index);
    } else {
      this.expandedMessages.add(index);
    }
  }
  getPreviewText(msg:any): string {
    const bodyContent = msg.bodyContent;
    if (!bodyContent) {
      return msg.body;
    }
    const plainText = bodyContent
      .toString()
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

    return plainText.length > 100
      ? plainText.substring(0, 100) + '...'
      : plainText;
  }

  extractFirstNames(headerValue: string): string {
    if (!headerValue) {
      return "";
    }
    

    let result: string[] = [];

    // Split multiple recipients by commas (but ignore commas inside < >)
    const parts = headerValue.split(/,(?=(?:[^<]*<[^>]*>)*[^>]*$)/);

    parts.forEach(part => {
      part = part.trim();
      let namePart = "";

      if (part.includes("<")) {
        namePart = part.substring(0, part.indexOf("<")).trim().replace(/"/g, "");
      } else {
        namePart = part; // only email, no <>
      }

      if (namePart) {
        const firstWord = namePart.split(/\s+/)[0]; // take only first word
        result.push(firstWord);
      }
    });

    return result.join(", ");
  }

}
