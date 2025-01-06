import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
declare let SignaturePad: any;
declare let $: any;

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
})
export class PdfViewerComponent {
  @ViewChild('pdfContainer') pdfContainer: ElementRef;
  pdfDoc: any = null;
  pages: number[] = [];
  scale = 1.5;
  signaturePad: any;

  constructor(private renderer:Renderer2){}

  ngOnInit() {
    this.initializeJQueryFunctions();
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
    const pdfjsLib = (window as any).pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.js';
    this.pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;

    this.pages = Array.from({ length: this.pdfDoc.numPages }, (_, i) => i + 1);
    this.renderAllPages();
  }

  async renderAllPages(): Promise<void> {
    const pdfContainer = this.pdfContainer.nativeElement;

    for (let pageNumber of this.pages) {
      const canvas = this.renderer.createElement('canvas');
      this.renderer.setStyle(canvas, 'margin-bottom', '20px');
      this.renderer.setStyle(canvas, 'border', '1px solid #ccc');
      this.renderer.appendChild(pdfContainer, canvas);

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

  initializeJQueryFunctions(): void {
    $(document).on('click', '.signature-placeholder', function () {
      $('#signatureModal').show();
    });

    $('#addSignaturePlaceholder').on('click', () => {
      $('#pdf-container canvas').each((index, canvas) => {
        $(canvas).on('click', (event: any) => {
          const x = event.offsetX;
          const y = event.offsetY;

          const placeholder = $('<div>')
            .addClass('signature-placeholder')
            .css({
              position: 'absolute',
              top: `${y}px`,
              left: `${x}px`,
              width: '100px',
              height: '50px',
              border: '1px dashed red',
              cursor: 'move',
            })
            .draggable();

          $(canvas).parent().append(placeholder);
        });
      });
    });

    $('#saveSignature').on('click', () => {
      const signatureDataUrl = this.signaturePad.toDataURL();
      $('.signature-placeholder').each((index, placeholder) => {
        const canvas = $(placeholder).parent().find('canvas')[0];
        const context = canvas.getContext('2d');

        const image = new Image();
        image.src = signatureDataUrl;
        image.onload = () => {
          context.drawImage(image, $(placeholder).position().left, $(placeholder).position().top, 100, 50);
        };
      });
      $('#signatureModal').hide();
    });

    $('#clearSignature').on('click', () => {
      this.signaturePad.clear();
    });

    $('#closeSignatureModal').on('click', () => {
      $('#signatureModal').hide();
    });

    $('#saveSignedPdf').on('click', async () => {
      const pdfBytes = await this.mergeCanvasesToPdf();
      this.savePdfToBackend(pdfBytes);
    });

    this.initializeSignaturePad();
  }

  initializeSignaturePad(): void {
    const canvas: HTMLCanvasElement = document.getElementById('signaturePadCanvas') as HTMLCanvasElement;
    this.signaturePad = new SignaturePad(canvas);
  }

  async mergeCanvasesToPdf(): Promise<Uint8Array> {
    const { PDFDocument } = (window as any).PDFLib; // Access PDFLib from global scope
    const pdfDoc = await PDFDocument.create();
  
    const canvases = $('#pdf-container canvas');
  
    for (let i = 0; i < canvases.length; i++) {
      const canvas = canvases[i] as HTMLCanvasElement;
  
      const imgData = canvas.toDataURL('image/jpeg');
      const img = await pdfDoc.embedJpg(imgData);
  
      const page = pdfDoc.addPage([canvas.width, canvas.height]);
      page.drawImage(img, { x: 0, y: 0, width: canvas.width, height: canvas.height });
    }
  
    return await pdfDoc.save();
  }

  savePdfToBackend(pdfBytes: Uint8Array): void {
    fetch('/api/save-signed-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/pdf',
      },
      body: pdfBytes,
    })
      .then((response) => {
        if (response.ok) {
          alert('Signed PDF saved successfully!');
        } else {
          alert('Failed to save the signed PDF.');
        }
      })
      .catch((error) => {
        console.error('Error saving PDF:', error);
        alert('An error occurred while saving the signed PDF.');
      });
  }
}
