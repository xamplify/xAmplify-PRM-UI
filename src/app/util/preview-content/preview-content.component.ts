import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-content',
  templateUrl: './preview-content.component.html',
  styleUrls: ['./preview-content.component.css']
})
export class PreviewContentComponent implements OnInit {

  @Input() previewPath:any;

  @Output() notifyClose = new EventEmitter();

  url:any;
  showPage: boolean = false;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://docs.google.com/gview?url=${this.previewPath}&embedded=true`
    );
  }

  closePreview() {
    this.notifyClose.emit();
  }

  reload() {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://docs.google.com/gview?url=${this.previewPath+'?cache=' + Math.random().toString(36).substring(7) + new Date().getTime()}&embedded=true`);
  }

}
