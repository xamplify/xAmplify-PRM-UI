import { SignatureResponseDto } from './../../dashboard/models/signature-response-dto';
import { Component, Input, OnInit, ViewChild,ElementRef,HostListener } from '@angular/core';
import { MY_PROFILE_MENU_CONSTANTS } from 'app/constants/my-profile-menu-constants';
import { ReferenceService } from 'app/core/services/reference.service';
import { SignatureDto } from 'app/dashboard/models/signature-dto';
import { SignatureService } from './../../dashboard/services/signature.service';
import * as domtoimage from 'dom-to-image';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css', '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css']
})
export class SignatureComponent implements OnInit {
  ngxLoading = false;
  uploadSignatureButtonClicked = false;
  signatureMenuHeader = MY_PROFILE_MENU_CONSTANTS.SIGNATURE_MENU_HEADER;
  activeTab = "draw";
  signatureDto:SignatureDto = new SignatureDto();
  signatureResponseDto:SignatureResponseDto = new SignatureResponseDto();
  /***Draw Signature***/
  @Input() name: string;
  @ViewChild('sigPad') sigPad:any;
  sigPadElement:any;
  context:any;
  isDrawing = false;
  img:any;
  signatureError = false;
  hasSignature = false;

  /****Type****/
  fontStyles: string[] = ['Cursive', 'Brush Script MT', 'Great Vibes', 'fantasy', 'math','monospace'];
  isValidSignatureText = true;
  signatureTextErrorMessage = "Maximum length is 25 characters";
  signaturesLoader = true;

  /***Upload Image****/
  uploadedImage: string | ArrayBuffer | null = null;
  fileName: string = 'No file chosen';
  imagePreview: string | ArrayBuffer | null = null;
  uploadSignatureLoader = false;
  selectedFile: File | null = null;
  maxFileSize: number = 100; // 100 KB
  constructor(private referenceService:ReferenceService,private signatureService:SignatureService) { }

  switchTab(tabName: string) {
    this.activeTab = tabName;
  }

  ngOnInit() {
    this.loadSignaturePad();
    this.getExistingSignatures();
  }

  private getExistingSignatures() {
    this.signatureService.getExistingSignatures().subscribe(
      response => {
        let data = response.data;
        if(data!=undefined){
          this.signatureResponseDto = data;
          this.setExistingDataForDrawSignature();
        }
        this.signaturesLoader = false;
      }, error => {
        this.signaturesLoader = false;
        this.referenceService.showSweetAlertServerErrorMessage();
      });
  }

  private setExistingDataForDrawSignature() {
    this.signatureDto.typedSignatureFont = this.signatureResponseDto.typedSignatureFont;
    this.signatureDto.typedSignatureText = this.signatureResponseDto.typedSignatureText;
    let isValidFont = this.signatureDto.typedSignatureFont != undefined && this.signatureDto.typedSignatureFont.length > 0;
    if (!isValidFont) {
      this.signatureDto.typedSignatureFont = this.fontStyles[0];
    }
  }

  

  private loadSignaturePad() {
    this.sigPadElement = this.sigPad.nativeElement;
    this.context = this.sigPadElement.getContext('2d');
    this.context.strokeStyle = '#000';
  }

 

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event:any) {
    this.isDrawing = false;
  }

  onMouseDown(event:any) {
    this.isDrawing = true;
    this.signatureError = false; // Reset error if user starts drawing
    const coords = this.relativeCoords(event);
    this.context.moveTo(coords.x, coords.y);
  }

  onMouseMove(event:any) {
    if (this.isDrawing) {
      const coords = this.relativeCoords(event);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
      this.hasSignature = true; // Mark that something was drawn
    }
  }

  private relativeCoords(event:any) {
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    return { x: x, y: y };
  }


  clear(){
    if(this.activeTab=="draw"){
      this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
      this.context.beginPath();
      this.hasSignature = false; // Reset signature validation
    }else if(this.activeTab=="type"){
      this.signatureDto.typedSignatureText="";
      this.signatureDto.typedSignatureFont = this.fontStyles[0];
    }else if(this.activeTab=="upload"){
      this.clearImage();
    }
   
    
  }
 

  

  private validateAndUploadDrawSignature(signatureData: string) {
    const canvas = this.sigPad.nativeElement as HTMLCanvasElement;
    const pixelData = this.context.getImageData(0, 0, canvas.width, canvas.height).data;
    let isCanvasEmpty = !pixelData.some((pixel:any) => pixel !== 0); // Check if any pixel is not transparent
    if (!isCanvasEmpty) {
      signatureData = canvas.toDataURL("image/png");
      const base64Image = canvas.toDataURL(); // Convert canvas to base64
      this.uploadDrawSignature(base64Image);
    } else {
      this.referenceService.showSweetAlertErrorMessage("Please draw signature");
      this.ngxLoading = false;
    }
    return signatureData;
  }

  /***Draw***/
  uploadDrawSignature(base64Image:string){
    this.signatureDto.drawSignatureEncodedImage = base64Image;
    this.signatureService.uploadDrawSignature(this.signatureDto).subscribe(
      response => {
        this.referenceService.showSweetAlertSuccessMessage(response.message);
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
        this.referenceService.showSweetAlertServerErrorMessage();
      });
  }


  



  validateTypedSignature(){
    this.previewSignature();
    this.isValidSignatureText = this.signatureDto.typedSignatureText.length<=25;
    if(!this.isValidSignatureText){
      this.signatureTextErrorMessage = 'Maximum length is 25 characters';
    }else{
      this.signatureTextErrorMessage = "";
    }
  }

  previewSignature(){
    this.signatureDto.typedSignatureText = this.referenceService.getTrimmedData(this.signatureDto.typedSignatureText);
  }

  selectFont(font: string) {
    this.signatureDto.typedSignatureFont = font;
  }

  saveTypedSignature(){
    this.previewSignature();
    this.ngxLoading = true;
    this.saveTypedSignatureTextAsImage();
    this.signatureService.saveTypedSignature(this.signatureDto).subscribe(
      response => {
        this.referenceService.showSweetAlertSuccessMessage(response.message);
        this.ngxLoading = false;
      }, error => {
        this.ngxLoading = false;
        this.referenceService.showSweetAlertServerErrorMessage();
      });
    }

    saveTypedSignatureTextAsImage() {
      const element = document.getElementById('typedSignaturePreview');
      domtoimage.toPng(element).then((dataUrl) => {
        console.log(dataUrl);
      });
    }

  /*******End Of Type Signature***********/  



  /********Upload Signature*******/
  onFileSelected(event: Event): void {
    this.ngxLoading = true;
    const input = event.target as HTMLInputElement | null;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.referenceService.showSweetAlertErrorMessage('Please upload a valid image file.');
        this.imagePreview = null;
        return;
      }
      const fileSizeInKB = file.size / 1024; // Convert bytes to KB
      if (fileSizeInKB > this.maxFileSize) {
        this.referenceService.showSweetAlertErrorMessage(
          `File size exceeds the maximum limit of ${this.maxFileSize} KB. Please upload a smaller file.`
        );
        this.clearImage();
        return;
      }
      this.selectedFile = file;
      // Read the file and set the image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
      this.ngxLoading = false;
    } else {
      this.fileName = 'No file chosen';
      this.imagePreview = null;
      this.ngxLoading = false;
    }
  }

  clearImage(): void {
    this.selectedFile = null;
    this.fileName = 'No file chosen';
    this.imagePreview = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.ngxLoading = false;
  }



  saveSignature() {
    let signatureData: string | null = null;
    if (this.activeTab === "draw") {
      this.ngxLoading = true;
      signatureData = this.validateAndUploadDrawSignature(signatureData);
    } else if (this.activeTab === "type") {
      this.ngxLoading = true;
      this.saveTypedSignature();
    } else if (this.activeTab === "upload") {
      this.saveUploadedSignature();
    }
  }
  saveUploadedSignature() {
    if (!this.selectedFile) {
      this.referenceService.showSweetAlertErrorMessage('No file selected. Please choose a file first.')
      return;
    }else{
      this.ngxLoading = true;
      this.signatureService.saveUploadedSignature(this.selectedFile).subscribe(
        response => {
          this.referenceService.showSweetAlertSuccessMessage(response);
          this.ngxLoading = false;
        }, error => {
          this.ngxLoading = false;
          this.referenceService.showSweetAlertServerErrorMessage();
        });
    }
  }
  

}
