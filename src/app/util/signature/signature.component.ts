import { Component, Input, OnInit, ViewChild,ElementRef,HostListener } from '@angular/core';
import { MY_PROFILE_MENU_CONSTANTS } from 'app/constants/my-profile-menu-constants';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css', '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css']
})
export class SignatureComponent implements OnInit {
  uploadSignatureButtonClicked = false;
  signatureMenuHeader = MY_PROFILE_MENU_CONSTANTS.SIGNATURE_MENU_HEADER;
  activeTab = "draw";

  /***Draw Signature***/
  @Input() name: string;
  @ViewChild('sigPad') sigPad;
  sigPadElement;
  context;
  isDrawing = false;
  img;


  constructor() { }

  

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
}
