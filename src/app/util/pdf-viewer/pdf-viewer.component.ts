import { Component, ElementRef, Renderer2, ViewChild,OnInit } from '@angular/core';

declare var pdfjsLib: any;

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {

  @ViewChild('pdfContainer') pdfContainer: ElementRef;
  pdfDoc: any = null;
  pages: number[] = [];
  scale = 1.5; // Zoom level


  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const arrayBuffer = e.target.result;
        await this.loadPdf(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  async loadPdf(arrayBuffer: ArrayBuffer): Promise<void> {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.js';
    this.pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;

    this.pages = Array.from({ length: this.pdfDoc.numPages }, (_, i) => i + 1);
    this.renderAllPages();
  }

  async renderAllPages(): Promise<void> {
    const pdfContainer = this.pdfContainer.nativeElement;

    for (let pageNumber of this.pages) {
      // Create a canvas for each page
      const canvas = this.renderer.createElement('canvas');
      this.renderer.setStyle(canvas, 'margin-bottom', '20px');
      this.renderer.setStyle(canvas, 'border', '1px solid #ccc');
      this.renderer.appendChild(pdfContainer, canvas);

      // Render the page on the canvas
      await this.renderPage(pageNumber, canvas);
    }
  }

  async renderPage(pageNumber: number, canvas: HTMLCanvasElement): Promise<void> {
    const context = canvas.getContext('2d');
    const page = await this.pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport(this.scale);

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  }

}
