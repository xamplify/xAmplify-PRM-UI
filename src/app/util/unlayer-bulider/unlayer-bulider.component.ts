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
  private authenticationService: AuthenticationService;
  constructor(authenticationService: AuthenticationService,private damService: DamService) {
    this.authenticationService = authenticationService;
  }

  ngOnInit() {
    alert("called unlayer");
      unlayer.init({
        id: 'editor-container',
        displayMode: 'document',
      });
      if (this.beeContainerInput && this.beeContainerInput.jsonBody) {
        const parsedDesign = JSON.parse(this.beeContainerInput.jsonBody); // Parse if it's a string
        unlayer.addEventListener("editor:ready", () => unlayer.loadDesign(parsedDesign));
      }
  }    


  ngAfterViewInit() {
    // if (typeof unlayer !== 'undefined') {
    //   unlayer.init({
    //     id: 'editor-container',
    //     displayMode: 'document',
    //   });
  
    //   if (this.beeContainerInput && this.beeContainerInput.jsonBody) {
    //     const parsedDesign = JSON.parse(this.beeContainerInput.jsonBody);
    //     unlayer.addEventListener("editor:ready", () => {
    //       unlayer.loadDesign(parsedDesign);
    //     });
    //   }
    // } else {
    //   console.error("Unlayer is not loaded.");
    // }
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

    this.damService.generatePdfByHtml(data.html).subscribe(
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


mydownloadPdf() {
  if (!window['unlayer']) {
    console.error('Unlayer editor not initialized');
    return;
  }

  window['unlayer'].exportHtml((data: any) => {
    if (!data.html || !data.design) {
      console.error('Error exporting HTML or JSON');
      return;
    }

    this.damService.downloadPdf(data.html).subscribe(
      (blob: Blob) => {
        if (!blob || blob.size === 0) {
          console.error("Received an empty or invalid PDF file.");
          return;
        }
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'generated-pdf.pdf';
        link.click();
        URL.revokeObjectURL(link.href);

        const pdfFile = new File([blob], 'design.pdf', { type: 'application/pdf' });
        this.notifyParentComponent.emit({
          htmlContent: data.html,
          jsonContent: data.design,
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
}

