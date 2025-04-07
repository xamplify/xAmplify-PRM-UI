import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'app/core/services/authentication.service';

declare var $: any;
declare var pdfjsLib: any;

@Component({
  selector: 'app-preview-content',
  templateUrl: './preview-content.component.html',
  styleUrls: ['./preview-content.component.css']
})
export class PreviewContentComponent implements OnInit {

  @Input() previewPath: any;
  @Input() fileType: any;

  @Output() notifyClose = new EventEmitter();

  url: any;
  isPdf: boolean = false;
  documentFileTypes = ['doc', 'docx', 'ppt', 'pptx', 'xlsx'];
  pdfLoader: boolean = false;
  pdfDoc: any = null;

  constructor(private sanitizer: DomSanitizer, private authenticationService: AuthenticationService, private http: HttpClient) { }

  ngOnInit() {
    if (this.documentFileTypes.includes(this.fileType)) {
      this.isPdf = false;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://view.officeapps.live.com/op/view.aspx?src=${this.previewPath}`
      );
    }
  }

  closePreview() {
    this.notifyClose.emit();
  }

  reload() {
    if (this.documentFileTypes.includes(this.fileType)) {
      this.isPdf = false;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://view.officeapps.live.com/op/view.aspx?src=${this.previewPath}`
      );
    }
  }

  ngAfterViewInit() {
    if ('pdf' == this.fileType) {
      this.isPdf = true;
      this.pdfLoader = true;
      this.http.get(this.previewPath + '&access_token=' + encodeURIComponent(this.authenticationService.access_token), { responseType: 'blob' })
        .subscribe(response => {
          this.url = URL.createObjectURL(response);
          this.displayPDF(this.url);
          this.pdfLoader = false;
        });
    }
  }

  async displayPDF(url: string) {
    const pdf = await pdfjsLib.getDocument(url).promise;
    this.pdfDoc = pdf;
    $("#pdf-container").empty();

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      let pageDiv = $("<div>").addClass("pdf-page").attr("data-page", pageNum);
      let canvas = $("<canvas>").addClass("pdfCanvas")[0];

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      pageDiv.append(canvas);
      $("#pdf-container").append(pageDiv);

      let ctx = canvas.getContext("2d");
      let renderContext = { canvasContext: ctx, viewport: viewport };
      await page.render(renderContext).promise;
    }
  }

}
