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
  @Input() isImageFormat: boolean = false;
  @Input() isTextFormat: boolean = false;
  @Input() isPreviewPopup: boolean = false;
  

  @Output() notifyClose = new EventEmitter();

  url: any;
  isPdf: boolean = false;
  documentFileTypes = ['doc', 'docx', 'ppt', 'pptx', 'xlsx'];
  pdfLoader: boolean = false;
  pdfDoc: any = null;
  showTextViewer: boolean = false;
  showImageViewer: boolean = false;
  showAudioPlayer: boolean = false;

  constructor(private sanitizer: DomSanitizer, private authenticationService: AuthenticationService, private http: HttpClient) { }

  ngOnInit() {
    if (this.isPreviewPopup) {
      $('#preview_content_modal_popup').modal('show');
    }
    if (this.documentFileTypes.includes(this.fileType)) {
      this.isPdf = false;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://view.officeapps.live.com/op/view.aspx?src=${this.previewPath}`
      );
    } else {
      this.isPdf = true;
      this.pdfLoader = true;
      this.http.get(this.previewPath + '&access_token=' + encodeURIComponent(this.authenticationService.access_token), { responseType: 'blob' })
        .subscribe(response => {
          this.url = URL.createObjectURL(response);
          this.displayFile(this.url, this.fileType);
          this.pdfLoader = false;
        });
    }
  }

  ngOnDestroy(){
    $('#preview_content_modal_popup').modal('hide');
  }
  
  closePreview() {
    $('#preview_content_modal_popup').modal('hide');
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

  async displayPDF(url: string) {
    const pdf = await pdfjsLib.getDocument(url).promise;
    this.pdfDoc = pdf;
    $("#pdf-container").empty();
  
    const scale = 1.0;
  
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
  
      // const pageDiv = $("<div>").addClass("pdf-page").attr("data-page", pageNum);
        const pageDiv = $("<div>")
        .addClass("pdf-page")
        .attr("data-page", pageNum)
        .css("position", "relative");
      const canvas = $("<canvas>").addClass("pdfCanvas")[0];
  
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      pageDiv.append(canvas);
      $("#pdf-container").append(pageDiv);
  
      const ctx = canvas.getContext("2d");
      const renderContext = { canvasContext: ctx, viewport: viewport };
      await page.render(renderContext).promise;

         const annotations = await page.getAnnotations();
      annotations.forEach((annotation: any) => {
        if (annotation.subtype === 'Link' && annotation.url) {
          const rect = annotation.rect;
          const view = viewport.convertToViewportRectangle(rect);
          const left = Math.min(view[0], view[2]);
          const top = Math.min(view[1], view[3]);
          const width = Math.abs(view[0] - view[2]);
          const height = Math.abs(view[1] - view[3]);
          const link = $('<a>')
            .attr('href', annotation.url)
            .attr('target', '_blank')
            .addClass('pdf-link')
            .css({
              position: 'absolute',
              left: `${left}px`,
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`,
            });
          pageDiv.append(link);
        }
      });
    }
  }

  async displayFile(url: string, fileType: string) {
    this.showImageViewer = false;
    this.showTextViewer = false;
    this.showAudioPlayer = false;
    $("#pdf-container, #image-viewer, #text-viewer, #html-viewer").hide();
  
    if (fileType.includes("pdf")) {
      this.displayPDF(url);
      $("#pdf-container").show();
  
    } else if (this.isImageFormat) {
      $("#image-viewer").attr("src", url).show();
      this.showImageViewer = true;
    } else if (this.isTextFormat) {
      this.displayTextFile(url); 
    } else if (fileType.includes("csv")) {
      this.displayCSV(url);
      $("#csv-viewer").show();
    } else if (fileType.includes("mp3")) {
      $("#audio-viewer").attr("src", url).show();
      this.showAudioPlayer = true;
    } else {
      console.error("Unsupported file type:", fileType);
    }
  }

  displayTextFile(url: string) {
    fetch(url)
      .then(response => response.text())
      .then(text => {
        $("#text-viewer").text(text).show();
        this.showTextViewer = true;
      })
      .catch(err => console.error("Error loading text file:", err));
  }
  
  displayCSV(url: string) {
    fetch(url)
      .then(res => res.text())
      .then(csv => {
        const rows = this.parseCSV(csv.trim());
        if (!rows.length) return;
  
        let html = '<thead><tr>';
        for (const header of rows[0]) {
          html += `<th>${header}</th>`;
        }
        html += '</tr></thead><tbody>';
  
        for (let i = 1; i < rows.length; i++) {
          html += '<tr>';
          for (const cell of rows[i]) {
            html += `<td>${cell}</td>`;
          }
          html += '</tr>';
        }
  
        html += '</tbody>';
  
        const container = document.getElementById('csv-container-wrapper');
        const table = document.getElementById('csv-table');
        if (table && container) {
          table.innerHTML = html;
          container.style.display = 'block';
        }
      })
      .catch(err => console.error("Failed to load CSV:", err));
  }


  parseCSV(data: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;
  
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      const nextChar = data[i + 1];
  
      if (char === '"' && inQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentCell);
        currentCell = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (currentCell || currentRow.length) {
          currentRow.push(currentCell);
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
        if (char === '\r' && nextChar === '\n') i++;
      } else {
        currentCell += char;
      }
    }
  
    if (currentCell || currentRow.length) {
      currentRow.push(currentCell);
      rows.push(currentRow);
    }
  
    return rows;
  }
  
  
}
