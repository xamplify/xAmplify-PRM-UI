import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SignatureResponseDto } from './../../dashboard/models/signature-response-dto';
import { Component, Input, OnInit, ViewChild,ElementRef,HostListener, Output, EventEmitter } from '@angular/core';
import { MY_PROFILE_MENU_CONSTANTS } from 'app/constants/my-profile-menu-constants';
import { ReferenceService } from 'app/core/services/reference.service';
import { SignatureDto } from 'app/dashboard/models/signature-dto';
import { SignatureService } from './../../dashboard/services/signature.service';
import * as domtoimage from 'dom-to-image';
import { CustomResponse } from 'app/common/models/custom-response';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css', '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css']
})
export class SignatureComponent implements OnInit {
  @Input() isFromModalPopUp = false;
  @Input() isFromDam = false;
  @Output() notifyAddImageToPdf = new EventEmitter();
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
  drawSignatureHeaderText = "Draw a personalized signature for signing documents.";
  isDrawTabActive = true;
  previewingExistingDrawSignature = false;
  /****Type****/
  fontStyles: string[] = ['Cursive', 'Brush Script MT', 'Great Vibes', 'fantasy', 'math','monospace'];
  isValidSignatureText = true;
  signatureTextErrorMessage = "Maximum length is 25 characters";
  signaturesLoader = true;
  typeSignatureHeaderText = "Enter a name to create a digital signature in fonts for signing documents.";
  isTypeTabActive = false;
  previewingExistingTypeSignature = false;
  existingTypedSignature:SignatureResponseDto = new SignatureResponseDto();
  /***Upload Image****/
  uploadedImage: string | ArrayBuffer | null = null;
  fileName: string = 'No file chosen';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  maxFileSize: number = 100; // 100 KB
  uploadSignatureHeaderText = "Upload an existing signature image to use for signing documents.";
  isUploadTabActive = false;
  headerTextMessage = "";
  previewingExistingUploadedSignature = false;
  exisitingUploadedImagePath = "";
  isDelete = false;
  customResponse: CustomResponse = new CustomResponse();
  constructor(private referenceService:ReferenceService,private signatureService:SignatureService,private sanitizer: DomSanitizer) { }

  switchTab(tabName: string) {
    this.activeTab = tabName;
    this.isDrawTabActive = this.activeTab==='draw';
    this.isTypeTabActive = this.activeTab=='type';
    this.isUploadTabActive = this.activeTab=='upload';
    this.isDelete = false;
    this.addHeaderTitle();
    this.clearSucessOrErrorMessage();
  }

  private addHeaderTitle() {
    if (this.isDrawTabActive) {
      this.headerTextMessage = this.drawSignatureHeaderText;
    } else if (this.isTypeTabActive) {
      this.headerTextMessage = this.typeSignatureHeaderText;
    } else if (this.isUploadTabActive) {
      this.headerTextMessage = this.uploadSignatureHeaderText;
    }
  }

  ngOnInit() {
    this.addHeaderTitle();
    this.loadSignaturePad();
    this.getExistingSignatures();
  }

  private getExistingSignatures() {
    this.signaturesLoader = true;
    this.signatureService.getExistingSignatures().subscribe(
      response => {
        let data = response.data;
        if(data!=undefined){
          this.signatureResponseDto = data;
          this.setExistingData();
        }
        this.signaturesLoader = false;
      }, error => {
        this.signaturesLoader = false;
        this.referenceService.showSweetAlertServerErrorMessage();
      });
  }

  private setExistingData() {
    this.signatureDto.typedSignatureFont = this.signatureResponseDto.typedSignatureFont;
    this.signatureDto.typedSignatureText = this.signatureResponseDto.typedSignatureText;
    this.existingTypedSignature.typedSignatureFont = this.signatureResponseDto.typedSignatureFont;
    this.existingTypedSignature.typedSignatureText = this.signatureResponseDto.typedSignatureText;
    let isValidFont = this.signatureDto.typedSignatureFont != undefined && this.signatureDto.typedSignatureFont.length > 0;
    if (!isValidFont) {
      this.signatureDto.typedSignatureFont = this.fontStyles[0];
    }
    this.previewingExistingDrawSignature = this.signatureResponseDto.drawSignatureExits;
    /***Type***/
    this.previewingExistingTypeSignature = this.signatureResponseDto.typedSignatureExists;
    /**Upload***/
    this.previewingExistingUploadedSignature = this.signatureResponseDto.uploadedSignatureExits;
    this.exisitingUploadedImagePath = this.signatureResponseDto.uploadedSignatureImagePath;
    this.isDelete = false;

       /**Add Image To PDF***/
    if (this.isFromDam) {
      if (this.signatureResponseDto.drawSignatureExits && this.signatureResponseDto.drawSignatureImagePath) {
        this.notifyAddImageToPdf.emit(this.signatureResponseDto.drawSignatureImagePath);
      }
      else if (this.signatureResponseDto.typedSignatureExists && this.signatureResponseDto.typedSignatureImagePath) {
        this.notifyAddImageToPdf.emit(this.signatureResponseDto.typedSignatureImagePath);
      }
      else if (this.signatureResponseDto.uploadedSignatureExits && this.signatureResponseDto.uploadedSignatureImagePath) {
        this.notifyAddImageToPdf.emit(this.signatureResponseDto.uploadedSignatureImagePath);
      }
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
    if(this.isDrawTabActive){
      this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
      this.context.beginPath();
      this.hasSignature = false; // Reset signature validation
    }else if(this.isTypeTabActive){
      this.signatureDto.typedSignatureText="";
      this.signatureDto.typedSignatureFont = this.fontStyles[0];
    }else if(this.isUploadTabActive){
      this.clearImage();
    }
  }

  previewExistingTypeSignature(){
    this.previewingExistingTypeSignature = true;
    this.signatureDto.typedSignatureFont = this.existingTypedSignature.typedSignatureFont;
    this.signatureDto.typedSignatureText = this.existingTypedSignature.typedSignatureText;
  }

  private validateAndUploadDrawSignature() {
    const canvas = this.sigPad.nativeElement as HTMLCanvasElement;
    const pixelData = this.context.getImageData(0, 0, canvas.width, canvas.height).data;
    let isCanvasEmpty = !pixelData.some((pixel:any) => pixel !== 0); // Check if any pixel is not transparent
    if (!isCanvasEmpty) {
      canvas.toDataURL("image/png");
      const base64Image = canvas.toDataURL(); // Convert canvas to base64
      this.uploadDrawSignature(base64Image);
      console.log(base64Image);
    } else {
      this.showErrorMessage('Please draw signature');
    }
  }

  /***Draw***/
  uploadDrawSignature(base64Image:string){
    this.signaturesLoader = true;
    this.signatureDto.drawSignatureEncodedImage = base64Image;
    this.signatureService.uploadDrawSignature(this.signatureDto).subscribe(
      response => {
        this.showSuccessMessage(response.message);
        this.clear();
        this.signaturesLoader = false;
      }, error => {
        this.referenceService.showSweetAlertServerErrorMessage();
        this.signaturesLoader = false;
      },()=>{
        this.getExistingSignatures();
      });
  }

  reDrawSignature(){
    this.previewingExistingDrawSignature = false;
  }

  getSanitizedImageUrl(imagePath:any){
    const uniquePath = `${imagePath}?v=${new Date().getTime()}`;
    return this.sanitizer.bypassSecurityTrustUrl(uniquePath);
  }


  /***Type Signature***/
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
    this.signaturesLoader = true;
    this.previewSignature();
    this.saveTypedSignatureTextAsImage();
    this.signatureService.saveTypedSignature(this.signatureDto).subscribe(
      response => {
        this.showSuccessMessage(response.message);
      }, error => {
        this.referenceService.showSweetAlertServerErrorMessage();
        this.signaturesLoader = false;
      },()=>{
        this.getExistingSignatures();
      });
    }

    // saveTypedSignatureTextAsImage() {
    //   const element = document.getElementById('typedSignaturePreview');
    //   domtoimage.toPng(element).then((dataUrl) => {
    //     console.log(dataUrl);
    //   });
    // }

  saveTypedSignatureTextAsImage() {
    const previewElement = document.getElementById('typedSignaturePreview');
    if (previewElement) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = previewElement.offsetWidth;
      canvas.height = previewElement.offsetHeight;
      ctx.font = `${'30px'} ${this.signatureDto.typedSignatureFont || 'Montserrat'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const text = this.signatureDto.typedSignatureText || 'Your Signature';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      const base64Image = canvas.toDataURL('image/png');
      this.signatureDto.typedSignatureEncodedImage = base64Image;
    } else {
      this.showErrorMessage('Please type your signature');
    }
  }
    
    /***End Of Type Signature***/

    removeExisitingSignature(event:any){
      if(event){
        this.signaturesLoader = true;
        let signatureDto = new SignatureDto();
        signatureDto.signatureType = this.activeTab;
        this.signatureService.removeExistingSignature(signatureDto).subscribe(
          response=>{
            this.signaturesLoader = false;
            if(this.isUploadTabActive){
              this.clearImage();
            }
            this.showSuccessMessage(response.message);
          },error=>{
            this.referenceService.showSweetAlertServerErrorMessage();
            this.signaturesLoader = false;
          },()=>{
            this.getExistingSignatures();
          });
      }else{
        this.isDelete = false;
      }
      
    }


  /********Upload Signature*******/
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      // Validate file type
      if (!file.type.startsWith('image/') || file.type === 'image/gif') {
        this.showErrorMessage('Please upload a valid image file.');
        this.imagePreview = null;
        return;
      }
      const fileSizeInKB = file.size / 1024; // Convert bytes to KB
      if (fileSizeInKB > this.maxFileSize) {
        this.showErrorMessage(`File size exceeds the maximum limit of ${this.maxFileSize} KB. Please upload a smaller file.`);
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
      
    } else {
      this.fileName = 'No file chosen';
      this.imagePreview = null;
      
    }
  }

  private clearSucessOrErrorMessage() {
    this.customResponse = new CustomResponse(); 
  }

  private showErrorMessage(message:any){
    this.clearSucessOrErrorMessage();
    setTimeout(() => {
      this.customResponse = new CustomResponse('ERROR',message,true);
      this.referenceService.scrollSmoothToTop();
    }, 100);
    
  }

  private showSuccessMessage(message:any){
    this.clearSucessOrErrorMessage();
    setTimeout(() => {
      this.customResponse = new CustomResponse('SUCCESS',message,true);
    }, 100);
    this.referenceService.goToTop();
  }

  clearImage(): void {
    this.selectedFile = null;
    this.fileName = 'No file chosen';
    this.imagePreview = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  saveSignature() {
    if (this.isDrawTabActive) {
      this.validateAndUploadDrawSignature();
    } else if (this.isTypeTabActive) {
      this.validateAndSaveTypedSignature();
    } else if (this.isUploadTabActive) {
      this.saveUploadedSignature();
    }
  }

  private validateAndSaveTypedSignature() {
    let typedSignature = this.referenceService.getTrimmedData(this.signatureDto.typedSignatureText);
    if (typedSignature != undefined && typedSignature.length > 0) {
      if(typedSignature.length>25){
        this.showErrorMessage("Maximum length is 25 characters");
      }else{
        this.saveTypedSignature();
      }
    } else {
      this.showErrorMessage("Please type your signature");
    }
  }

  saveUploadedSignature() {
    if (!this.selectedFile) {
      this.showErrorMessage('Please select a file');
      return;
    }else{
      this.signatureService.saveUploadedSignature(this.selectedFile).subscribe(
        response => {
          this.showSuccessMessage(response);
          this.imagePreview=null;
        }, error => {
          this.signaturesLoader = false;
          this.referenceService.showSweetAlertServerErrorMessage();
        },()=>{
          this.getExistingSignatures();
        });
    }
  }
  

  back(){
    if(this.isDrawTabActive){
      this.previewingExistingDrawSignature=true;
      this.clear();
    }else if(this.isTypeTabActive){
      this.previewExistingTypeSignature();
    }else if(this.isUploadTabActive){
      this.previewingExistingUploadedSignature = true;
    }
  }

}
