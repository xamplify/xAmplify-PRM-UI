import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-content',
  templateUrl: './preview-content.component.html',
  styleUrls: ['./preview-content.component.css']
})
export class PreviewContentComponent implements OnInit {

  @Input() previewPath:any;
  @Input() fileType:any;

  @Output() notifyClose = new EventEmitter();

  url:any;
  showPage: boolean = false;
  documentFileTypes = ['doc','docx','ppt','pptx','xlsx'];

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    if ('pdf' == this.fileType) {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://docs.google.com/gview?url=${this.previewPath}&embedded=true`
      );
    } else if (this.documentFileTypes.includes(this.fileType)) {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://view.officeapps.live.com/op/view.aspx?src=${this.previewPath}`
      );
    }
  }

  closePreview() {
    this.notifyClose.emit();
  }

  reload() {
    if ('pdf' == this.fileType) {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://docs.google.com/gview?url=${this.previewPath + '?cache=' + Math.random().toString(36).substring(7) + new Date().getTime()}&embedded=true`);
    } else if (this.documentFileTypes.includes(this.fileType)) {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://view.officeapps.live.com/op/view.aspx?src=${this.previewPath}`
      );
    }
  }

}
