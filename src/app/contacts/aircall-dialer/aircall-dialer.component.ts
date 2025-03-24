import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-aircall-dialer',
  templateUrl: './aircall-dialer.component.html',
  styleUrls: ['./aircall-dialer.component.css']
})
export class AircallDialerComponent implements OnInit {

  @Input() isReloadTab: boolean;

  @Output() notifyClose = new EventEmitter();

  @ViewChild('aircallIframe') iframeRef: ElementRef;

  constructor(private referenceService: ReferenceService) { }

  ngOnInit() {
    this.referenceService.openModalPopup('addCallModalPopup');
    this.sendCSSMessage();
  }

  closeCallModal() {
    this.referenceService.closeModalPopup('addCallModalPopup');
    this.notifyClose.emit(!this.isReloadTab);
  }

  ngAfterViewInit() {
    // this.iframeRef.nativeElement.addEventListener('load', () => {
    //   const iframeDocument = this.iframeRef.nativeElement.contentDocument ||
    //     this.iframeRef.nativeElement.contentWindow.document;

    //   if (iframeDocument) {
    //     const style = iframeDocument.createElement('style');
    //     style.innerHTML = `
    //       .hKkIYA {
    //           flex: 1 1 auto;
    //           flex-direction: column;
    //           overflow: scroll;
    //           width: 100%;
    //       }
    //     `;
    //     iframeDocument.head.appendChild(style);
    //   }
    // });
  }

  sendCSSMessage() {
    const cssMessage = {
      type: 'inject-css',
      styles: `
        .hKkIYA {
            flex: 1 1 auto;
            flex-direction: column;
            overflow: scroll;
            width: 100%;
        }
      `
    };
    this.iframeRef.nativeElement.contentWindow.postMessage(cssMessage, '*');
  }

}
