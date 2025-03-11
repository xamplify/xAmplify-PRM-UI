import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DamService } from 'app/dam/services/dam.service';
import { EmailTemplatePreviewUtilComponent } from '../email-template-preview-util/email-template-preview-util.component';
declare var unlayer: any;  
@Component({
  selector: 'app-unlayer-bulider',
  templateUrl: './unlayer-bulider.component.html',
  styleUrls: ['./unlayer-bulider.component.css']
})
export class UnlayerBuliderComponent implements OnInit, AfterViewInit  {
  @Output() notifyParentComponent = new EventEmitter();
  @Input()beeContainerInput : any;
  showPreview : boolean = false;
  htmlContent : string;
  pdfSrc: any;
  selectedView = 'desktop'
  popupStyles: any = {}; 
    @ViewChild("emailTemplatePreviewPopupComponent") emailTemplatePreviewUtilComponent: EmailTemplatePreviewUtilComponent;
  private authenticationService: AuthenticationService;
  constructor(authenticationService: AuthenticationService,private damService: DamService, private sanitizer: DomSanitizer) {
    this.authenticationService = authenticationService;
  }

  ngOnInit() {
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
exportDesign() {
  if (!window['unlayer']) {
    console.error('Unlayer editor not initialized');
    return;
  }

  window['unlayer'].exportHtml((data: any) => {
    if (!data.html || !data.design) {
      console.error('Error exporting HTML or JSON');
      return;
    }
    this.showPreview = true;
    this.htmlContent = data.html;
    this.myPdfPreview(this.htmlContent);
  });
}

myPdfPreview(htmlContent: string): void {
  this.damService.downloadPdf(htmlContent).subscribe(
    (blob: Blob) => {
      if (!blob || blob.size === 0) {
        console.error("Received an empty or invalid PDF file.");
        return;
      }
      const pdfFile = new File([blob], 'design.pdf', { type: 'application/pdf' });
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
    },
    (error) => {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again later.");
    },
    () => {
      this.showPreview = true; // Show the preview popup
      this.updatePopupSize(); // Adjust the popup size based on selected view
    }
  );
}

// Method to close the preview popup
closePopup(): void {
  this.showPreview = false;
}

// Method to set the selected view (mobile, tablet, desktop)
setView(view: string): void {
  this.selectedView = view;
  this.updatePopupSize(); // Update the popup size based on the selected view
}

// Method to update the popup size based on the selected view option
updatePopupSize(): void {
  console.log('Updating popup size for view:', this.selectedView);
  switch (this.selectedView) {
    case 'mobile':
      this.popupStyles = { width: '320px', height: '568px' }; // Mobile size
      break;
    case 'tablet':
      this.popupStyles = { width: '768px', height: '1024px' }; // Tablet size
      break;
    case 'desktop':
      this.popupStyles = { width: '1024px', height: '768px' }; // Desktop size
      break;
    default:
      this.popupStyles = { width: '90%', height: '90%' }; // Default size
  }
}
}

