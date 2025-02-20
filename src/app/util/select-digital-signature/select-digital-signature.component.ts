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

  signatureResponseDto: SignatureResponseDto = new SignatureResponseDto();
  selectedSignature: string = ''; // Set from the modal selection
  customResponse: CustomResponse = new CustomResponse();

  // --- PDF related properties ---
  pdfUrl: string = 'https://s3.amazonaws.com/xamplify/dev/shared-asset/10808/0aaa8004-a8d6-4b0f-af6f-81e33c620d66.pdf';
  url: any;
  pdfDoc: any = null;
  placedSignatures: any[] = [];

  // Control for showing the signature selection modal
  showSignatureModal: boolean = true;

  constructor(
    private signatureService: SignatureService,
    private sanitizer: DomSanitizer,
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getExistingSignatures();
  }

  ngAfterViewInit() {
    this.http.get(this.sharedAssetPath + '&access_token=' + encodeURIComponent(this.authenticationService.access_token), { responseType: 'blob' })
    .subscribe(response => {
       this.url = URL.createObjectURL(response);
      this.displayPDF(this.url);
    });

    this.initializeDragAndDrop();
}

// Function to initialize drag-and-drop with jQuery
initializeDragAndDrop() {
  // Handle drag start on the signature
  $(document).on("dragstart", "#signature", function (event: any) {
    console.log("dragstart triggered");

    // Ensure data transfer exists
    if (event.originalEvent.dataTransfer) {
      event.originalEvent.dataTransfer.setData("text/plain", "signature");
      event.originalEvent.dataTransfer.effectAllowed = "copy";
    }
  });

  // Prevent default behavior to allow dropping
  $(document).on("dragover", "#pdf-container", function (event: any) {
    event.preventDefault();
  });

  // Handle drop event on the PDF
  $(document).on("drop", "#pdf-container", (event: any) => {
    event.preventDefault();
    console.log("drop event fired", event);

    let pdfOffset = $("#pdf-container").offset();
    let x = event.originalEvent.clientX - pdfOffset.left;
    let y = event.originalEvent.clientY - pdfOffset.top;

    console.log("Dropped at:", x, y);

    // Create a new signature image
    let newSig = $("<img>")
      .attr("src", $("#signature").attr("src"))
      .addClass("signature-draggable")
      .css({
        left: x + "px",
        top: y + "px",
        position: "absolute",
        zIndex: 1000,
        width: "100px",
        height: "50px",
      });

    // Append the signature to the PDF container, allowing movement across pages
    $("#pdf-container").append(newSig);
    this.placedSignatures.push(newSig);

    // Make the signature draggable across the entire PDF container
    newSig.draggable({
      containment: "#pdf-container",
      stop: function (event, ui) {
        console.log("Signature moved to:", ui.position.left, ui.position.top);
      }
    });
  });


    $("#download-pdf").on("click", () => {
      this.generatePDF();
    });
  }

  // ------------------ PDF Functions ------------------

  async displayPDF(url: string) {
    try {
      const pdf = await pdfjsLib.getDocument(url).promise;
      this.pdfDoc = pdf;
      $("#pdf-container").empty();

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        let pageDiv = $("<div>")
          .addClass("pdf-page")
          .attr("data-page", pageNum);
        let canvas = $("<canvas>").addClass("pdfCanvas")[0];
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        pageDiv.append(canvas);
        $("#pdf-container").append(pageDiv);

        let ctx = canvas.getContext("2d");
        let renderContext = { canvasContext: ctx, viewport: viewport };
        await page.render(renderContext).promise;
      }
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  }

  async generatePDF() {
    if (!this.pdfDoc) {
      alert("PDF is not loaded yet.");
      return;
    }
    if (this.placedSignatures.length === 0) {
      alert("Please place at least one signature before downloading.");
      return;
    }

    try {
      const existingPdfBytes = await fetch(this.url).then(res => res.arrayBuffer());
      const pdfDocNew = await PDFLib.PDFDocument.load(existingPdfBytes);
      const pages = pdfDocNew.getPages();

      for (let sig of this.placedSignatures) {
        let pageNum = parseInt($(sig).attr("data-page"));
        let page = pages[pageNum - 1];

        let pageCanvas = $(".pdf-page[data-page='" + pageNum + "'] canvas")[0];
        let canvasRect = pageCanvas.getBoundingClientRect();
        let sigRect = sig[0].getBoundingClientRect();

        let x = ((sigRect.left - canvasRect.left) / canvasRect.width) * page.getWidth();
        let y = page.getHeight() - ((sigRect.top - canvasRect.top) / canvasRect.height) * page.getHeight();

        const sigSrc = $(sig).attr("src");
        if (!sigSrc) {
          alert("Signature source is missing!");
          return;
        }
        const signatureBytes = await fetch(sigSrc).then(res => res.arrayBuffer());
        const signatureEmbed = await pdfDocNew.embedPng(signatureBytes);
        const signatureDims = signatureEmbed.scale(0.5);

        page.drawImage(signatureEmbed, {
          x: x,
          y: y - signatureDims.height,
          width: signatureDims.width,
          height: signatureDims.height,
        });
      }

      const pdfBytes = await pdfDocNew.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");

      downloadLink.href = downloadUrl;
      downloadLink.download = "signed_document.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
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
        }
      },
      error => console.error("Error fetching signatures:", error)
    );
  }
}
