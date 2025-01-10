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

  /***Draw Signature***/
  @Input() name: string;
  @ViewChild('sigPad') sigPad:any;
  sigPadElement:any;
  context:any;
  isDrawing = false;
  img:any;

  /****Type****/
  fontStyles: string[] = ['Cursive', 'Brush Script MT', 'Great Vibes', 'fantasy', 'math','monospace'];
  isValidSignatureText = true;
  signatureTextErrorMessage = "Maximum length is 25 characters";
  typedSignatureLoader = true;

  /***Upload Image****/
  uploadedImage: string | ArrayBuffer | null = null;

  constructor(private referenceService:ReferenceService,private signatureService:SignatureService) { }

  switchTab(tabName: string) {
    this.activeTab = tabName;
  }

  ngOnInit() {
    /***Draw****/
    this.loadSignaturePad();
    /*Type*/
    this.getTypedSignature();
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
    const coords = this.relativeCoords(event);
    this.context.moveTo(coords.x, coords.y);
  }

  onMouseMove(event:any) {
    if (this.isDrawing) {
      const coords = this.relativeCoords(event);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
    }
  }

  private relativeCoords(event:any) {
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    return { x: x, y: y };
  }


  clearCanvas(){
    this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
    this.context.beginPath();
  }
 

  saveSignature() {
    this.ngxLoading = true;
    let signatureData: string | null = null;
    if (this.activeTab === "draw") {
      const canvas = this.sigPad.nativeElement as HTMLCanvasElement;
      signatureData = canvas.toDataURL("image/png");
      const base64Image = canvas.toDataURL(); // Convert canvas to base64
      this.uploadDrawSignature(base64Image);
    } else if (this.activeTab === "type") {
      this.saveTypedSignature();
    } else if (this.activeTab === "upload") {
    }
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


  /***Type Signature****/
  private getTypedSignature() {
    this.signatureService.getTypedSignature().subscribe(
      response => {
        this.signatureDto = response.data;
        let isValidFont = this.signatureDto.typedSignatureFont!=undefined && this.signatureDto.typedSignatureFont.length>0;
        if(!isValidFont){
          this.signatureDto.typedSignatureFont = this.fontStyles[0]; // Default font

        }
        this.typedSignatureLoader = false;
      }, error => {
        this.typedSignatureLoader = false;
        this.referenceService.showSweetAlertErrorMessage("Unable to load type");
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

  /*******End Of Type***********/  

}
