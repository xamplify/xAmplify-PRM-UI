import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, AfterViewInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { SignatureResponseDto } from 'app/dashboard/models/signature-response-dto';
import { SignatureService } from 'app/dashboard/services/signature.service';

// Declare global variables for jQuery, pdfjsLib, and PDFLib
declare var $: any;
declare var pdfjsLib: any;
declare var PDFLib: any;

@Component({
  selector: 'app-select-digital-signature',
  templateUrl: './select-digital-signature.component.html',
  styleUrls: ['./select-digital-signature.component.css']
})
export class SelectDigitalSignatureComponent implements OnInit, AfterViewInit {
  @Output() notifyCloseModalPopUp = new EventEmitter();
  @Output() notifySignatureSelection = new EventEmitter();
  @Input() sharedAssetPath: any;
  @Input() uploadedFile: File;
  @Input() isFromDam: boolean = false;

  signatureResponseDto: SignatureResponseDto = new SignatureResponseDto();
  selectedSignature: string = ''; // Set from the modal selection
  customResponse: CustomResponse = new CustomResponse();
  availableSignatures: string[] = [];
  // --- PDF related properties ---
  pdfUrl: string = 'https://s3.amazonaws.com/xamplify/dev/shared-asset/10808/0aaa8004-a8d6-4b0f-af6f-81e33c620d66.pdf';
  url: any;
  pdfDoc: any = null;
  placedSignatures: any[] = [];
  pdfLoader: boolean = false;

  // Control for showing the signature selection modal
  showSignatureModal: boolean = true;
  fileName: string;
  openAddsignatureModalPopup: boolean = false;

  constructor(
    private signatureService: SignatureService,
    private sanitizer: DomSanitizer,
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getExistingSignatures();
    this.uploadedFile;
  }

  ngAfterViewInit() {
    if (!this.isFromDam) {
      this.http.get(this.sharedAssetPath + '&access_token=' + encodeURIComponent(this.authenticationService.access_token), { responseType: 'blob' })
        .subscribe(response => {
          this.url = URL.createObjectURL(response);
          this.displayPDF(this.url);
        });
    } else if (this.uploadedFile) {
      // Handle the uploaded file
      const fileReader = new FileReader();
      fileReader.onload = (event: any) => {
        this.url = URL.createObjectURL(this.uploadedFile);
        this.displayPDF(this.url);
      };
      fileReader.readAsArrayBuffer(this.uploadedFile);
    }  
    this.initializeDragAndDrop();
}

// Function to initialize drag-and-drop with jQuery
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

initializeDragAndDrop() {
  let pdfContainer = $("#pdf-container");

  // Handle signature drag start
  $(document).on("dragstart", ".signature-image", function (event: any) {
    event.originalEvent.dataTransfer.setData("text/plain", $(this).attr("src"));
    event.originalEvent.dataTransfer.setData("width", $(this).width());  // Capture original width
    event.originalEvent.dataTransfer.setData("height", $(this).height()); // Capture original height
  });

  // Allow dropping in PDF container
  pdfContainer.on("dragover", function (event: any) {
    event.preventDefault();
  });

  pdfContainer.on("drop", (event: any) => {
    event.preventDefault();

    let pdfOffset = pdfContainer.offset();
    let x = event.originalEvent.clientX - pdfOffset.left + pdfContainer.scrollLeft();
    let y = event.originalEvent.clientY - pdfOffset.top + pdfContainer.scrollTop();

    let targetPage: any = null;
    $(".pdf-page").each(function () {
      let pageOffset = $(this).offset();
      let pageHeight = $(this).height();
      if (event.originalEvent.clientY >= pageOffset.top && event.originalEvent.clientY <= pageOffset.top + pageHeight) {
        targetPage = $(this).attr("data-page");
      }
    });

    if (!targetPage) return;

    // Get the original size of the dragged signature
    let originalWidth = parseInt(event.originalEvent.dataTransfer.getData("width"));
    let originalHeight = parseInt(event.originalEvent.dataTransfer.getData("height"));

    let newSig = $("<img>")
      .attr("src", event.originalEvent.dataTransfer.getData("text/plain")) // Get correct signature
      .addClass("signature-draggable")
      .css({
        left: `${x}px`,
        top: `${y}px`,
        position: "absolute",
        width: `${originalWidth}px`,  // Set width to match original
        height: `${originalHeight}px`, // Set height to match original
      })
      .attr("data-page", targetPage);

    pdfContainer.append(newSig);
    this.placedSignatures.push({ element: newSig, page: targetPage });

    // Make it draggable within the container
    newSig.draggable({
      containment: "#pdf-container",
      stop: (event: any, ui: any) => {
        let updatedX = ui.position.left;
        let updatedY = ui.position.top;

        let newTargetPage: any = null;
        $(".pdf-page").each(function () {
          let pageOffset = $(this).offset();
          let pageHeight = $(this).height();
          if (event.clientY >= pageOffset.top && event.clientY <= pageOffset.top + pageHeight) {
            newTargetPage = $(this).attr("data-page");
          }
        });

        if (newTargetPage) {
          $(event.target).attr("data-page", newTargetPage);
          let sigIndex = this.placedSignatures.findIndex(sig => sig.element.is($(event.target)));
          if (sigIndex !== -1) {
            this.placedSignatures[sigIndex].page = newTargetPage;
          }
        }
      }
    });
  });

  $("#download-pdf").on("click", () => {
    this.generatePDF();
  });
}


async generatePDF() {
  if (!this.pdfDoc) {
    this.customResponse = new CustomResponse('ERROR', 'Pdf Not Loaded Properly', true);
    return;
  }

  if (this.placedSignatures.length === 0) {
    this.customResponse = new CustomResponse('ERROR', 'Please place at least one signature', true);
    return;
  }

  try {
    // Load existing PDF
    const existingPdfBytes = await fetch(this.url).then(res => res.arrayBuffer());
    const pdfDocNew = await PDFLib.PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
    const pages = pdfDocNew.getPages();

    // Iterate over placed signatures and add them to the correct pages
    for (const sigObj of this.placedSignatures) {
      let pageNum = parseInt(sigObj.page);
      let page = pages[pageNum - 1]; // PDF pages are 0-indexed in PDFLib

      // Fetch signature image and embed it into the PDF
      const signatureBytes = await fetch(sigObj.element.attr("src")).then(res => res.arrayBuffer());
      const signatureEmbed = await pdfDocNew.embedPng(signatureBytes);

      // Get original size from the placed image
      let originalWidth = sigObj.element.width();
      let originalHeight = sigObj.element.height();

      // Get the page canvas and signature element positions
      let pageCanvas = $(".pdf-page[data-page='" + pageNum + "'] canvas")[0];
      let canvasRect = pageCanvas.getBoundingClientRect();
      let sigRect = sigObj.element[0].getBoundingClientRect();

      // Convert signature position to PDF coordinates
      let x = ((sigRect.left - canvasRect.left) / canvasRect.width) * page.getWidth();
      let y = page.getHeight() - ((sigRect.top - canvasRect.top) / canvasRect.height) * page.getHeight();

      // 🔹 Adjust Y position to move the signature up slightly
      y -= (originalHeight / canvasRect.height) * page.getHeight(); 

      // Draw signature on the page
      page.drawImage(signatureEmbed, {
        x: x,
        y: y,
        width: (originalWidth / canvasRect.width) * page.getWidth(),  // Scale proportionally
        height: (originalHeight / canvasRect.height) * page.getHeight()
      });
    }

    // Save the modified PDF
    const pdfBytes = await pdfDocNew.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const downloadUrl = URL.createObjectURL(blob);
    if(this.uploadedFile && this.uploadedFile['name']){
     this.fileName = this.uploadedFile['name'];
    } else {
      this.fileName = 'signed_document.pdf'
    }

    const file = new File([blob], this.fileName, { type: "application/pdf" });
    this.notifySignatureSelection.emit(file);

    // Create and trigger download link
    // const downloadLink = document.createElement("a");
    // downloadLink.href = downloadUrl;
    // downloadLink.download = "signed_document.pdf";
    // document.body.appendChild(downloadLink);
    // downloadLink.click();
    // document.body.removeChild(downloadLink);
    this.closeModal();
  } catch (error) {
    console.error("Error generating signed PDF:", error);
  }
}


  // ------------------ Signature Modal Functions ------------------

  closeModal() {
    this.showSignatureModal = false;
    this.notifyCloseModalPopUp.emit("close");
  }

  submitSelection() {
    let selectedSignatureImagePath = this.selectedSignature || '';
    if (!selectedSignatureImagePath) {
      this.customResponse = new CustomResponse('ERROR', 'Please select your signature', true);
      return;
    }
    this.notifySignatureSelection.emit(selectedSignatureImagePath);
    this.closeModal();
  }

  private getExistingSignatures() {
    this.signatureService.getExistingSignatures().subscribe(
      response => {
        if (response && response.data) {
          this.signatureResponseDto = response.data;
          this.loadSignatures();
        }
      },
      error => console.error("Error fetching signatures:", error)
    );
  }

  loadSignatures() {
    if (!this.signatureResponseDto) return;

    this.availableSignatures = [];

    if (this.signatureResponseDto.drawSignatureExits && this.signatureResponseDto.drawSignatureImagePath) {
      // this.availableSignatures.push(this.signatureResponseDto.drawSignatureImagePath);
      this.availableSignatures.push('https://aravindu.com/vod/signatures/20268149/draw-signature.png?v=1740137273710');
    }
    if (this.signatureResponseDto.typedSignatureExists && this.signatureResponseDto.typedSignatureImagePath) {
      // this.availableSignatures.push(this.signatureResponseDto.typedSignatureImagePath);
      this.availableSignatures.push('https://aravindu.com/vod/signatures/20268149/typed-signature.png');
    }
    if (this.signatureResponseDto.uploadedSignatureExits && this.signatureResponseDto.uploadedSignatureImagePath) {
            // this.availableSignatures.push(this.signatureResponseDto.uploadedSignatureImagePath);
      this.availableSignatures.push('https://aravindu.com/vod/signatures/20268149/vishnu%20signature.png');
    }
  }

  addSignature(){
    this.openAddsignatureModalPopup = true;
  }

  notifyDigitalSignatureCloseModalPopUp(){
    this.openAddsignatureModalPopup = false;
    this.getExistingSignatures();
  }

}
