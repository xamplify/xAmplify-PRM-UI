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

  isTextMode: boolean = false;
  placedTexts: any[] = [];

  // Control for showing the signature selection modal
  showSignatureModal: boolean = true;
  fileName: string;
  openAddsignatureModalPopup: boolean = false;
  showSignatures: boolean = false;

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

    $("#pdf-container").on("click", (event: any) => {
      if (this.isTextMode) {
        this.placeText(event);
        $("body").css("cursor", "default"); // Reset cursor after placing text
      }
    });
}

enableTextMode() {
  this.isTextMode = true;
  $("body").css("cursor", "text");
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

placeText(event: any) {
  let pdfContainer = $("#pdf-container");
  let pdfOffset = pdfContainer.offset();
  let x = event.clientX - pdfOffset.left + pdfContainer.scrollLeft();
  let y = event.clientY - pdfOffset.top + pdfContainer.scrollTop();

  let defaultFontSize = 15;
  let minFontSize = 9;
  let maxFontSize = 35;

  let newText = $(`
    <div class="text-draggable">
      <input type="text" class="text-input" placeholder="Type text here" maxlength="100" />
      <div class="resize-controls">
        <span class="increase-size">➕</span>
        <span class="decrease-size">➖</span>
        <span class="delete-text"><i class="fa fa-trash"></i></span>
      </div>
    </div>
  `).css({
    left: `${x}px`,
    top: `${y}px`,
    position: "absolute",
    cursor: "move",
    border: "1px solid blue",
    "background-color": "transparent",
    padding: "5px",
    display: "inline-block",
    "white-space": "nowrap",
  });

  let targetPage = this.getPageNumber(event.clientY);
  if (!targetPage) return;

  newText.attr("data-page", targetPage);
  pdfContainer.append(newText);

  newText.draggable({
    containment: "#pdf-container",
    scroll: true,
    drag: (event, ui) => {
      let newTargetPage = this.getPageNumber(event.pageY);
      if (newTargetPage) {
        newText.attr("data-page", newTargetPage);
      }
    }
  });

  let inputField = newText.find(".text-input").css({
    border: "none",
    outline: "none",
    "background-color": "transparent",
    "font-size": `${defaultFontSize}px`,
    width: "auto",
    "min-width": "50px",
    "white-space": "nowrap",
    overflow: "hidden",
  }).focus(); // ✅ Auto-focus on input

  let resizeControls = newText.find(".resize-controls").css({
    position: "absolute",
    top: "-30px",
    left: "50%",
    transform: "translateX(-50%)",
    "background-color": "white",
    padding: "3px 5px",
    "border-radius": "3px",
    "box-shadow": "0px 0px 3px rgba(0, 0, 0, 0.3)",
    display: "flex",
    gap: "5px",
  });

  resizeControls.find("span").css({ cursor: "pointer" });

  // ✅ Function to update the text box size dynamically
  function updateSize() {
    let fontSize = parseInt(inputField.css("font-size"));
    let textWidth = Math.max(inputField.val().length * (fontSize / 2), 50);
    let textHeight = fontSize + 10; // Adjust height based on font size

    inputField.css({
      width: `${textWidth}px`,
      height: `${textHeight}px`,
    });

    newText.css({
      width: `${textWidth + 10}px`,
      height: `${textHeight + 10}px`,
    });
  }

  // ✅ Show border when input is focused
  // inputField.on("focus", function () {
  //   $(this).css("border", "1px solid blue");
  // });

  // // ✅ Hide border when clicking outside
  // inputField.on("blur", function () {
  //   if (!$(this).val().trim()) {
  //     $(this).css("border", "1px solid transparent"); // Hide border if empty
  //   }
  // });

  // ✅ Increase font size
  resizeControls.find(".increase-size").on("click", function () {
    let fontSize = parseInt(inputField.css("font-size"));
    if (fontSize < maxFontSize) {
      fontSize += 2;
      inputField.css("font-size", `${fontSize}px`);
      updateSize();
    }
  });

  // ✅ Decrease font size
  resizeControls.find(".decrease-size").on("click", function () {
    let fontSize = parseInt(inputField.css("font-size"));
    if (fontSize > minFontSize) {
      fontSize -= 2;
      inputField.css("font-size", `${fontSize}px`);
      updateSize();
    }
  });

  // ✅ Delete text box
  resizeControls.find(".delete-text").on("click", function () {
    newText.remove();
  });

  // ✅ Adjust size while typing
  inputField.on("input", function () {
    updateSize();
  });

  this.placedTexts.push({
    element: newText,
    page: targetPage,
  });

  this.isTextMode = false;
}








getPageNumber = (posY: number) => {
  let targetPage = null;
  $(".pdf-page").each(function () {
    let pageOffset = $(this).offset();
    let pageHeight = $(this).height();
    if (posY >= pageOffset.top && posY <= pageOffset.top + pageHeight) {
      targetPage = $(this).attr("data-page");
    }
  });
  return targetPage;
};


initializeDragAndDrop() {
  let pdfContainer = $("#pdf-container");

  $(document).on("dragstart", ".signature-image", function (event: any) {
    event.originalEvent.dataTransfer.setData("text/plain", $(this).attr("src"));
    $(this).css("cursor", "grabbing"); // ✅ Change cursor while dragging
  });

  $(document).on("dragend", ".signature-image", function () {
    $(this).css("cursor", "grab"); // ✅ Reset cursor after dragging
  });

  pdfContainer.on("dragover", function (event: any) {
    event.preventDefault();
  });

  pdfContainer.on("drop", (event: any) => {
    event.preventDefault();
    this.showSignatures = false;
    let pdfOffset = pdfContainer.offset();
    let x = event.originalEvent.clientX - pdfOffset.left + pdfContainer.scrollLeft();
    let y = event.originalEvent.clientY - pdfOffset.top + pdfContainer.scrollTop();
    let targetPage = this.getPageNumber(event.originalEvent.clientY);
    if (!targetPage) return;

    let defaultWidth = 150;
    let defaultHeight = 70;
    let minWidth = defaultWidth / 5;
    let minHeight = defaultHeight / 5;
    let maxWidth = defaultWidth * 2;
    let maxHeight = defaultHeight * 2;

    let newSig = $(`
      <div class="signature-container">
        <img src="${event.originalEvent.dataTransfer.getData("text/plain")}" class="signature-draggable"/>
        <div class="resize-controls">
          <span class="increase-size">➕</span>
          <span class="decrease-size">➖</span>
          <span class="delete-signature"><i class="fa fa-trash"></i></span>
        </div>
      </div>
    `).css({
      left: `${x}px`,
      top: `${y}px`,
      position: "absolute",
      "border": "1px solid blue",
    }).attr("data-page", targetPage);

    let signatureImage = newSig.find(".signature-draggable").css({
      width: `${defaultWidth}px`,
      height: `${defaultHeight}px`,
      cursor: "grab", 
    });

    let resizeControls = newSig.find(".resize-controls").css({
      position: "absolute",
      top: "-30px",
      left: "50%",
      transform: "translateX(-50%)",
      "background-color": "white",
      padding: "3px 5px",
      "border-radius": "3px",
      "box-shadow": "0px 0px 3px rgba(0, 0, 0, 0.3)",
      display: "flex", // ✅ Always visible (even while dragging)
      gap: "5px",
    });

    pdfContainer.append(newSig);
    this.placedSignatures.push({ element: signatureImage, page: targetPage });

    newSig.draggable({
      containment: "#pdf-container",
      start: function () {
        $(this).css("cursor", "grabbing"); // ✅ Cursor while dragging
        $(this).css("border", "1px solid blue"); // ✅ Show border while dragging
        resizeControls.show(); // ✅ Show resize controls while dragging
      },
      stop: (event: any, ui: any) => {
        $(this).css("cursor", "grab"); // ✅ Reset cursor after dragging
        let newTargetPage = this.getPageNumber(event.clientY);
        if (newTargetPage) {
          newSig.attr("data-page", newTargetPage);
          let sigIndex = this.placedSignatures.findIndex(sig => sig.element.is(signatureImage));
          if (sigIndex !== -1) {
            this.placedSignatures[sigIndex].page = newTargetPage;
          }
        }
      }
    });

    resizeControls.find(".increase-size").on("click", function () {
      let img = newSig.find(".signature-draggable");
      let newWidth = img.width() + 10;
      let newHeight = img.height() + 5;
      if (newWidth <= maxWidth && newHeight <= maxHeight) {
        img.css({ width: newWidth, height: newHeight });
      }
    });

    resizeControls.find(".decrease-size").on("click", function () {
      let img = newSig.find(".signature-draggable");
      let newWidth = img.width() - 10;
      let newHeight = img.height() - 5;
      if (newWidth >= minWidth && newHeight >= minHeight) {
        img.css({ width: newWidth, height: newHeight });
      }
    });

    resizeControls.find(".delete-signature").on("click", () => {
      newSig.remove();
      this.placedSignatures = this.placedSignatures.filter(sig => !sig.element.is(signatureImage));
    });

    // ✅ Hide border and icons when clicking outside PDF or pressing Enter
    $(document).on("click keydown", function (event) {
      if (event.type === "click" && !$(event.target).closest(".signature-container").length) {
        newSig.css("border", "none");
        resizeControls.hide();
      }
      if (event.type === "keydown" && event.key === "Enter") {
        newSig.css("border", "none");
        resizeControls.hide();
      }
    });

    // ✅ Show border and icons when clicking on the signature
    newSig.on("click", function () {
      $(".signature-container").css("border", "none"); // Hide other borders
      $(this).css("border", "1px solid blue");
      $(".resize-controls").hide(); // Hide other controls
      resizeControls.show();
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

  if (this.placedSignatures.length === 0 && this.placedTexts.length === 0) {
    this.customResponse = new CustomResponse('ERROR', 'Please add at least one signature or text', true);
    return;
  }

  try {
    const existingPdfBytes = await fetch(this.url).then(res => res.arrayBuffer());
    const pdfDocNew = await PDFLib.PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
    const pages = pdfDocNew.getPages();

    // ✅ **Fix Scaling Factor for Precise Placement**
    const pdfContainer = $("#pdf-container")[0];
    const containerRect = pdfContainer.getBoundingClientRect();

    // ✅ **Add Signatures**
    for (const sigObj of this.placedSignatures) {
      let pageNum = parseInt(sigObj.page);
      let page = pages[pageNum - 1]; // PDF pages are 0-indexed in PDFLib
    
      const signatureUrl = sigObj.element.attr("src");
    
      // ✅ **Ensure signature URL is valid**
      if (!signatureUrl) {
        console.error("Signature URL is undefined for:", sigObj);
        continue;
      }
    
      const signatureBytes = await fetch(signatureUrl).then(res => res.arrayBuffer());
    
      // ✅ **Check if the image is PNG or JPG**
      let signatureEmbed;
      const lowerCaseUrl = signatureUrl.toLowerCase();
      if (lowerCaseUrl.endsWith(".png")) {
        signatureEmbed = await pdfDocNew.embedPng(signatureBytes);
      } else if (lowerCaseUrl.endsWith(".jpg") || lowerCaseUrl.endsWith(".jpeg")) {
        signatureEmbed = await pdfDocNew.embedJpg(signatureBytes);
      } else {
        signatureEmbed = await pdfDocNew.embedPng(signatureBytes);
      }
    
      // ✅ **Get signature position and size**
      let sigRect = sigObj.element[0].getBoundingClientRect();
      let pageCanvas = $(".pdf-page[data-page='" + pageNum + "'] canvas")[0];
    
      if (!pageCanvas) {
        console.error(`Canvas not found for page ${pageNum}`);
        continue;
      }
    
      let canvasRect = pageCanvas.getBoundingClientRect();
    
      // ✅ **Calculate scaling factors**
      let scaleX = page.getWidth() / canvasRect.width;
      let scaleY = page.getHeight() / canvasRect.height;
    
      // ✅ **Calculate position on the PDF**
      let x = (sigRect.left - canvasRect.left) * scaleX;
      let y = page.getHeight() - ((sigRect.top - canvasRect.top) * scaleY) - (sigObj.element.height() * scaleY);
    
      console.log(`✅ Placing signature at Page ${pageNum}, X: ${x}, Y: ${y}`);
    
      // ✅ **Embed signature on the PDF**
      page.drawImage(signatureEmbed, {
        x: x,
        y: y,
        width: sigObj.element.width() * scaleX,
        height: sigObj.element.height() * scaleY
      });
    }    

    // ✅ **Add Texts**
    for (const textObj of this.placedTexts) {
      let textInput = textObj.element.find(".text-input");
      let textValue = textInput.val();
      if (!textValue) continue;

      let textRect = textObj.element[0].getBoundingClientRect();
      let targetPageNum = parseInt(textObj.element.attr("data-page"));

      let pageCanvas = $(".pdf-page[data-page='" + targetPageNum + "'] canvas")[0];
      if (!pageCanvas) continue;

      let page = pages[targetPageNum - 1];
      let canvasRect = pageCanvas.getBoundingClientRect();

      let scaleX = page.getWidth() / canvasRect.width;
      let scaleY = page.getHeight() / canvasRect.height;

      let x = (textRect.left - canvasRect.left) * scaleX;
      let y = page.getHeight() - (textRect.top - canvasRect.top) * scaleY - ((textObj.element.height() * scaleY) / 2) - (10 * scaleY);

      let fontSize = parseInt(textInput.css("font-size")) * scaleY; // Adjust font size for scaling

      page.drawText(textValue, {
        x: x,
        y: y,
        size: fontSize,
        color: PDFLib.rgb(0, 0, 0),
        font: await pdfDocNew.embedFont(PDFLib.StandardFonts.Helvetica),
      });
    }

    // ✅ **Generate and Download the Final PDF**
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
 
    // const downloadLink = document.createElement("a");
    // downloadLink.href = downloadUrl;
    // downloadLink.download = "signed_document.pdf";
    // document.body.appendChild(downloadLink);
    // downloadLink.click();
    // document.body.removeChild(downloadLink);
    // this.closeModal();
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
  
    // Initialize the available signatures array with empty slots
    this.availableSignatures = [null, null, null];
  
    if (this.signatureResponseDto.drawSignatureExits && this.signatureResponseDto.drawSignatureImagePath) {
      this.availableSignatures[0] = 'https://aravindu.com/vod/signatures/20268149/draw-signature.png?v=1740137273710';
    }
    if (this.signatureResponseDto.typedSignatureExists && this.signatureResponseDto.typedSignatureImagePath) {
      this.availableSignatures[1] = 'https://aravindu.com/vod/signatures/20268149/typed-signature.png';
    }
    if (this.signatureResponseDto.uploadedSignatureExits && this.signatureResponseDto.uploadedSignatureImagePath) {
      this.availableSignatures[2] = 'https://aravindu.com/vod/signatures/20268149/vishnu%20signature.png';
    }
  }

  addSignature(){
    this.openAddsignatureModalPopup = true;
  }

  notifyDigitalSignatureCloseModalPopUp(){
    this.openAddsignatureModalPopup = false;
    this.getExistingSignatures();
  }


toggleSignatures() {
  this.showSignatures = !this.showSignatures;
}
  

}
