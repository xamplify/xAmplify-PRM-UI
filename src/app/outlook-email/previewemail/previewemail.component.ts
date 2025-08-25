import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OutlookEmailService } from '../outlook-email.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailThread } from '../models/email-thread';
import { EmailMessage } from '../models/email-message';
import { ReferenceService } from 'app/core/services/reference.service';

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
  threads: any = {};
  constructor(private router: Router, private outlookEmailService: OutlookEmailService, private vanityURLService: VanityURLService, public sanitizer: DomSanitizer,private referenceService:ReferenceService) {
    this.selectedThread = this.outlookEmailService.getContent();
    if (this.selectedThread.type === "OUTLOOK") {
        this.threads = {
        subject: this.selectedThread.subject,
        from: this.selectedThread.from,
        //date: this.selectedThread.lastReceivedDate,
        messages: this.selectedThread.messages
      };
      // this.threads.subject = this.selectedThread.subject || '';
      // this.threads.messages = [this.selectedThread.messages];
    } else {
      this.fetchGmailsByThreadId();
    }
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
  getPreviewText(msg: any): string {
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
    const parts = headerValue.split(/,(?=(?:[^<]*<[^>]*>)*[^>]*$)/);
    parts.forEach(part => {
      part = part.trim();
      let namePart = "";
      if (part.includes("<")) {
        namePart = part.substring(0, part.indexOf("<")).trim().replace(/"/g, "");
      } else {
        namePart = part;
      }
      if (namePart) {
        const firstWord = namePart.split(/\s+/)[0];
        result.push(firstWord);
      }
    });

    return result.join(", ");
  }
  actionType: string;
  showEmailModalPopup;
  toEmailId: string;
  messages: any;
  openEmailModalPopup(msg: any, type: string) {
    this.actionType = type;
    msg.type = type;
    if (type === 'replytoall') {
      msg.isreplayAll = true;
      msg.isreplay = false;
      msg.forward = false;
    } else if (type == 'forward') {
      msg.isreplayAll = false;
      msg.isreplay = false;
      msg.forward = true;
    } else {
      msg.isreplayAll = false;
      msg.isreplay = true;
      msg.forward = false;
    }
    msg.subject = this.threads.subject,
    msg.threadId = this.selectedThread.threadId;
    msg.from = this.selectedThread.authenticateEmailId;
    this.messages = msg;
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
  extractEmail(value: string): string {
    if (!value) return '';
    const match = value.match(/<(.+?)>/);
    return match ? match[1] : value;
  }

  isDraftMessages(msg:any):boolean{
   return msg.labelIds && msg.labelIds.some(label => label.toLowerCase() === 'drafts')
  }
  showReplayAll(msg:any):boolean {
    return msg.toEmailIds.length >=1;
  }

}
