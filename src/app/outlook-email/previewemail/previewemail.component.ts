import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OutlookEmailService } from '../outlook-email.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-previewemail',
  templateUrl: './previewemail.component.html',
  styleUrls: ['./previewemail.component.css']
})
export class PreviewemailComponent implements OnInit {
  selectedThread: any;
  constructor(private router: Router, private outlookEmailService: OutlookEmailService,private vanityURLService: VanityURLService,public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.selectedThread = this.outlookEmailService.getContent();
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
htmlString: string;
htmlContent: any;
  getBodyContent(bodyContent: string): string {
    //let htmlString = this.vanityURLService.sanitizeHtmlWithImportant(bodyContent)
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(bodyContent);
    return this.htmlContent;
  }

}
