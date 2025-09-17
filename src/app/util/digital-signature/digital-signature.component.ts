import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.css'],
})
export class DigitalSignatureComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild("signatureCanvas") canvasRef: ElementRef;
   @Output() notifyCloseModalPopUp= new EventEmitter();
   @Output() notifyAddImageToPdf = new EventEmitter();
   @Input() isFromDam = false;
   
  showSignatureModal: boolean = true;
  activeTab: string = "draw";
  typedSignature: string = "";
  uploadedImage: string | ArrayBuffer | null = null;

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  clearCanvas() {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  isDrawing: boolean = false; // To track mouse press state
  
  getPosition(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    if (event instanceof MouseEvent) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    } else if (event instanceof TouchEvent) {
      const touch = event.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    this.isDrawing = true;
    ctx.beginPath();

    const position = this.getPosition(event);
    ctx.moveTo(position.x, position.y);
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;

    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const position = this.getPosition(event);
    ctx.lineTo(position.x, position.y);
    ctx.stroke();
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  submitSignature() {
    let signatureData: string | null = null;

    if (this.activeTab === "draw") {
      const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
      signatureData = canvas.toDataURL("image/png");
    } else if (this.activeTab === "type") {
      signatureData = this.typedSignature;
    } else if (this.activeTab === "upload") {
      signatureData = this.uploadedImage as string;
    }

    if (signatureData) {
      this.sendToApi(signatureData);
    }
  }

  onFileUpload(event: any) {
    const input = event.target || event.srcElement; // Handle Angular 4 compatibility
    const file = input.files && input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  sendToApi(signature: string) {
    // Replace with actual HTTP service
    console.log("Sending signature to API:", signature);
  }

  closeModal() {
    this.showSignatureModal = false;
    this.notifyCloseModalPopUp.emit("close");
  }

  notifyAddSignatureImageToPdf(event){
  this.notifyAddImageToPdf.emit(event);
  this.closeModal();
  }


}
