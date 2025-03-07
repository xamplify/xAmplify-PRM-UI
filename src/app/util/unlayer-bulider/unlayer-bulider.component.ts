import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DamService } from 'app/dam/services/dam.service';
declare var unlayer: any;  
@Component({
  selector: 'app-unlayer-bulider',
  templateUrl: './unlayer-bulider.component.html',
  styleUrls: ['./unlayer-bulider.component.css']
})
export class UnlayerBuliderComponent implements OnInit, AfterViewInit  {
  @Output() notifyParentComponent = new EventEmitter();
  @Input()beeContainerInput : any;
  damPostDto: any;
  httpClient: any;
  // @ViewChild('editorContainer') editorContainer: ElementRef;
  private authenticationService: AuthenticationService;
  constructor(authenticationService: AuthenticationService,private damService: DamService) {
    this.authenticationService = authenticationService;
  }

  ngOnInit() {
      unlayer.init({
        id: 'editor-container',
        displayMode: 'document',
        projectId: '266229', // Ensure this is correct
        apiKey: 'Zafqjb1qHaWhR4o2CljC5EFDJxFUBmaOYW8FOkbb7qNjsT9azHve2scLXydk973N', // ADD API KEY HERE
        tools: {
          pdfExport: {
            enabled: true,
          },
        },
      });
      if (this.beeContainerInput && this.beeContainerInput.jsonBody) {
        const parsedDesign = JSON.parse(this.beeContainerInput.jsonBody); // Parse if it's a string
        unlayer.addEventListener("editor:ready", () => unlayer.loadDesign(parsedDesign));
      }
  }    


ngAfterViewInit(): void {
this.initializeUnlayerEditor();
}
initializeUnlayerEditor(): void {
  console.log('Initializing Unlayer editor...');
  // if (window['unlayer']) {
  //   window['unlayer'].init({
  //       id: 'editor-container',
  //     displayMode: 'document',
  //     // projectId: '266229',
  //     // apiKey: 'Zafqjb1qHaWhR4o2CljC5EFDJxFUBmaOYW8FOkbb7qNjsT9azHve2scLXydk973N',
  //   });
  // } else {
  //   console.error('Unlayer editor script not loaded');
  // }
  
}
exportPdfWithJsPDF(): void {
  if (!window['unlayer']) {
    console.error('Unlayer editor not initialized');
    return;
  }

  window['unlayer'].exportHtml((data: any) => {
    if (!data.html || !data.design) {
      console.error('Error exporting HTML or JSON');
      return;
    }
    // this.downloadPdfWithHtml(data);
    // const doc = new jsPDF();
    // doc.fromHTML(data.html, 15, 15);
    // const pdfBlob = doc.output('blob');
    // const pdfFile = new File([pdfBlob], 'design.pdf', { type: 'application/pdf' });
    // this.notifyParentComponent.emit({
    //   html: data.html,
    //   json: data.design, 
    //   pdf: pdfFile 
    // });
  });
}

downloadPdf() {
  if (!window['unlayer']) {
    console.error('Unlayer editor not initialized');
    return;
  }

  window['unlayer'].exportHtml((data: any) => {
    if (!data.html || !data.design) {
      console.error('Error exporting HTML or JSON');
      return;
    }

    this.damService.generatePdf(data.html).subscribe(
      (pdfBlob: Blob) => {
        if (!pdfBlob || pdfBlob.size === 0) {
          console.error("Received an empty or invalid PDF file.");
          return;
        }

        const pdfFile = new File([pdfBlob], 'design.pdf', { type: 'application/pdf' });

        this.notifyParentComponent.emit({
          html: data.html,
          json: data.design,
          pdf: pdfFile
        });
      },
      (error) => {
        console.error("Failed to generate PDF:", error);
        alert("Failed to generate PDF. Please try again later.");
      }
    );
  });
}


generatePdf1() {
  const htmlContent = '<h1>Hello, PDF!</h1>'; // Replace with dynamic HTML input

  this.damService.convertHtmlToPdf(htmlContent).subscribe(
    (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
    },
    (error) => {
        console.error('Failed to generate PDF:', error);
    }
);
}
}

