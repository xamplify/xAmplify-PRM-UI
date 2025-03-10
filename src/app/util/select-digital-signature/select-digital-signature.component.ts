import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, AfterViewInit, Input } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { SignatureResponseDto } from 'app/dashboard/models/signature-response-dto';
import { SignatureService } from 'app/dashboard/services/signature.service';

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
  selectedSignature: string = '';
  customResponse: CustomResponse = new CustomResponse();
  availableSignatures: string[] = [];
  url: any;
  pdfDoc: any = null;
  placedSignatures: any[] = [];
  pdfLoader: boolean = false;
  isTextMode: boolean = false;
  placedTexts: any[] = [];
  showSignatureModal: boolean = true;
  fileName: string;
  openAddsignatureModalPopup: boolean = false;
  activeTextTool: boolean = false;
  activeSignatureTool: boolean = false;

  constructor(
    private signatureService: SignatureService,
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) { }

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
        $("body").css("cursor", "default");
      }
    });
  }

  enableTextMode() {
    this.isTextMode = true;
    this.activeTextTool = true;
    $("body").css("cursor", "text");
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
      height: "auto",
      "min-width": "50px",
      "white-space": "nowrap",
      overflow: "hidden",
    }).focus();

    let resizeControls = newText.find(".resize-controls").css({
      position: "absolute",
      top: "-38px",
      left: "0px",
      "background-color": "white",
      padding: "5px 10px",
      "border-radius": "4px",
      "box-shadow": "2px 2px 5px rgba(0, 0, 0, 0.2)",
      display: "flex",
      gap: "5px",
    });

    resizeControls.find("span").css({ cursor: "pointer" });

    function updateSize() {
      let fontSize = parseInt(inputField.css("font-size"));

      let tempSpan = $("<span>").text(inputField.val()).css({
        "font-size": `${fontSize}px`,
        "white-space": "nowrap",
        visibility: "hidden",
        position: "absolute"
      }).appendTo("body");

      let textWidth = Math.max(tempSpan.width() + 10, 50);
      let textHeight = fontSize + 10;
      tempSpan.remove();

      inputField.css({
        width: `${textWidth}px`,
        height: `${textHeight}px`,
      });

      newText.css({
        width: `${textWidth + 10}px`,
        height: `${textHeight + 10}px`,
      });
    }

    resizeControls.find(".increase-size").on("click", function () {
      let fontSize = parseInt(inputField.css("font-size"));
      if (fontSize < maxFontSize) {
        fontSize += 2;
        inputField.css("font-size", `${fontSize}px`);
        updateSize();
      }
    });

    resizeControls.find(".decrease-size").on("click", function () {
      let fontSize = parseInt(inputField.css("font-size"));
      if (fontSize > minFontSize) {
        fontSize -= 2;
        inputField.css("font-size", `${fontSize}px`);
        updateSize();
      }
    });

    resizeControls.find(".delete-text").on("click", function () {
      newText.remove();
    });

    inputField.on("input", function () {
      updateSize();
    });

    this.placedTexts.push({
      element: newText,
      page: targetPage,
    });

    this.isTextMode = false;
    this.activeTextTool = false;
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
      $(this).css("cursor", "grabbing");
    });

    $(document).on("dragend", ".signature-image", function () {
      $(this).css("cursor", "grab");
    });

    pdfContainer.on("dragover", function (event: any) {
      event.preventDefault();
    });

    pdfContainer.on("drop", (event: any) => {
      event.preventDefault();
      this.activeSignatureTool = false;

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
        width: `${defaultWidth}px`,
        height: `${defaultHeight}px`,
        "border": "1px solid blue",
        "display": "flex",
        "align-items": "center",
        "justify-content": "center"
      }).attr("data-page", targetPage);

      let signatureImage = newSig.find(".signature-draggable").css({
        width: "100%",
        height: "100%",
        cursor: "grab",
      });

      let resizeControls = newSig.find(".resize-controls").css({
        position: "absolute",
        top: "-38px",
        left: "0px",
        "background-color": "white",
        padding: "5px 10px",
        "border-radius": "4px",
        "box-shadow": "2px 2px 5px rgba(0, 0, 0, 0.2)",
        display: "flex",
        gap: "5px",
      });

      resizeControls.find("span").css({ cursor: "pointer" });

      pdfContainer.append(newSig);
      this.placedSignatures.push({ element: signatureImage, page: targetPage });

      newSig.draggable({
        containment: "#pdf-container",
        start: function () {
          $(this).css("cursor", "grabbing");
          $(this).css("border", "1px solid blue");
          resizeControls.show();
        },
        stop: (event: any, ui: any) => {
          $(this).css("cursor", "grab");
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
        let newWidth = newSig.width() + 10;
        let newHeight = newSig.height() + 5;
        if (newWidth <= maxWidth && newHeight <= maxHeight) {
          newSig.css({ width: newWidth, height: newHeight });
          signatureImage.css({ width: "100%", height: "100%" });
        }
      });

      resizeControls.find(".decrease-size").on("click", function () {
        let newWidth = newSig.width() - 10;
        let newHeight = newSig.height() - 5;
        if (newWidth >= minWidth && newHeight >= minHeight) {
          newSig.css({ width: newWidth, height: newHeight });
          signatureImage.css({ width: "100%", height: "100%" });
        }
      });

      resizeControls.find(".delete-signature").on("click", () => {
        newSig.remove();
        this.placedSignatures = this.placedSignatures.filter(sig => !sig.element.is(signatureImage));
      });

      newSig.resizable({
        aspectRatio: true,
        handles: "se",
        minWidth: minWidth,
        minHeight: minHeight,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        create: function () {
          $(this)
            .find(".ui-resizable-handle")
            .css({
              width: "16px",
              height: "16px",
              "border-radius": "50%",
              background: "radial-gradient(circle, blue 40%, white 60%)",
              border: "none",
              "box-shadow": "0 0 4px rgba(0, 0, 0, 0.4)",
              opacity: "1",
            });

          $(this).find(".ui-resizable-se").css({
            bottom: "-8px",
            right: "-8px",
            cursor: "se-resize",
          });
        },
        start: function () {
          newSig.css("border", "1px solid blue");
        },
        resize: function (event, ui) {
          newSig.css({
            width: ui.size.width + "px",
            height: ui.size.height + "px",
          });
          signatureImage.css({ width: "100%", height: "100%" });
        },
        stop: function () {
          newSig.css("border", "1px solid blue");
        }
      });
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
      const pdfContainer = $("#pdf-container")[0];
      const containerRect = pdfContainer.getBoundingClientRect();
      for (const sigObj of this.placedSignatures) {
        let pageNum = parseInt(sigObj.page);
        let page = pages[pageNum - 1];
        const signatureUrl = sigObj.element.attr("src");
        if (!signatureUrl) {
          console.error("Signature URL is undefined for:", sigObj);
          continue;
        }
        const signatureBytes = await fetch(signatureUrl).then(res => res.arrayBuffer());
        let signatureEmbed;
        const lowerCaseUrl = signatureUrl.toLowerCase();
        if (lowerCaseUrl.endsWith(".png")) {
          signatureEmbed = await pdfDocNew.embedPng(signatureBytes);
        } else if (lowerCaseUrl.endsWith(".jpg") || lowerCaseUrl.endsWith(".jpeg")) {
          signatureEmbed = await pdfDocNew.embedJpg(signatureBytes);
        } else {
          signatureEmbed = await pdfDocNew.embedPng(signatureBytes);
        }
        let sigRect = sigObj.element[0].getBoundingClientRect();
        let pageCanvas = $(".pdf-page[data-page='" + pageNum + "'] canvas")[0];
        if (!pageCanvas) {
          console.error(`Canvas not found for page ${pageNum}`);
          continue;
        }
        let canvasRect = pageCanvas.getBoundingClientRect();
        let scaleX = page.getWidth() / canvasRect.width;
        let scaleY = page.getHeight() / canvasRect.height;
        let x = (sigRect.left - canvasRect.left) * scaleX;
        let y = page.getHeight() - ((sigRect.top - canvasRect.top) * scaleY) - (sigObj.element.height() * scaleY);
        page.drawImage(signatureEmbed, {
          x: x,
          y: y,
          width: sigObj.element.width() * scaleX,
          height: sigObj.element.height() * scaleY
        });
      }
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

        let fontSize = parseInt(textInput.css("font-size")) * scaleY;

        page.drawText(textValue, {
          x: x,
          y: y,
          size: fontSize,
          color: PDFLib.rgb(0, 0, 0),
          font: await pdfDocNew.embedFont(PDFLib.StandardFonts.Helvetica),
        });
      }

      const pdfBytes = await pdfDocNew.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      if (this.uploadedFile && this.uploadedFile['name']) {
        this.fileName = this.uploadedFile['name'];
      } else {
        this.fileName = 'signed_document.pdf'
      }

      const file = new File([blob], this.fileName, { type: "application/pdf" });
      this.notifySignatureSelection.emit(file);

      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = "signed_document.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      this.closeModal();
    } catch (error) {
      console.error("Error generating signed PDF:", error);
    }
  }
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

  addSignature() {
    this.openAddsignatureModalPopup = true;
  }

  notifyDigitalSignatureCloseModalPopUp() {
    this.openAddsignatureModalPopup = false;
    this.getExistingSignatures();
  }


  toggleSignatures() {
    this.activeSignatureTool = !this.activeSignatureTool;
  }

}
