import { Component, Input, OnInit, ViewChild,ElementRef,HostListener } from '@angular/core';
import { MY_PROFILE_MENU_CONSTANTS } from 'app/constants/my-profile-menu-constants';
import { ReferenceService } from 'app/core/services/reference.service';
import { SignatureDto } from 'app/dashboard/models/signature-dto';
import { SignatureService } from './../../dashboard/services/signature.service';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css', '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css']
})
export class SignatureComponent implements OnInit {
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
  typedSignature: string = "";
  fontStyles: string[] = ['Cursive', 'Brush Script MT', 'Great Vibes', 'fantasy', 'math','monospace'];
  selectedFont: string = this.fontStyles[0]; // Default font
  isMaximumLengthReached = false;

  /***Upload Image****/
  uploadedImage: string | ArrayBuffer | null = null;




  constructor(private referenceService:ReferenceService,private signatureService:SignatureService) { }

  

  ngOnInit() {
    this.sigPadElement = this.sigPad.nativeElement;
    this.context = this.sigPadElement.getContext('2d');
    this.context.strokeStyle = '#000';

    
  }

  switchTab(tabName: string) {
    this.activeTab = tabName;
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


  callUploadImageComponent() {
    this.uploadSignatureButtonClicked = true;
  }

  uploadImageCloseModalPopUpEventReceiver(event: any) {
    this.uploadSignatureButtonClicked = false;
  }

  saveSignature() {
    let signatureData: string | null = null;

    if (this.activeTab === "draw") {
      const canvas = this.sigPad.nativeElement as HTMLCanvasElement;
      signatureData = canvas.toDataURL("image/png");
      const base64Image = canvas.toDataURL(); // Convert canvas to base64
      console.log(base64Image);
    } else if (this.activeTab === "type") {
      this.saveTypedSignature();
    } else if (this.activeTab === "upload") {
    }

    
  }


  /***Type Signature****/
  updateSignaturePreview(){
    this.typedSignature = this.referenceService.getTrimmedData(this.typedSignature);
    this.isMaximumLengthReached = this.typedSignature.length>25;
    
  }

  selectFont(font: string) {
    this.selectedFont = font;
  }

  saveTypedSignature(){
    let typedSignature = this.typedSignature.slice(0,24);
    this.signatureDto = new SignatureDto();
    this.signatureDto.typedSignatureFont = this.selectedFont;
    this.signatureDto.typedSignatureText = typedSignature;
    this.signatureService.saveTypedSignature(this.signatureDto).subscribe(
      response=>{
       this.referenceService.showSweetAlertSuccessMessage(response.message);
      },error=>{
        this.referenceService.showSweetAlertServerErrorMessage();
      });

  }

}
