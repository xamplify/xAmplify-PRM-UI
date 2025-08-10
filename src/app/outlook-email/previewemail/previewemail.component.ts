import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OutlookEmailService } from '../outlook-email.service';

@Component({
  selector: 'app-previewemail',
  templateUrl: './previewemail.component.html',
  styleUrls: ['./previewemail.component.css']
})
export class PreviewemailComponent implements OnInit {
  selectedThread: any;
  constructor(private router: Router, private outlookEmailService: OutlookEmailService) { }

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

}
