import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SignatureResponseDto } from 'app/dashboard/models/signature-response-dto';
import { SignatureService } from 'app/dashboard/services/signature.service';

@Component({
  selector: 'app-select-digital-signature',
  templateUrl: './select-digital-signature.component.html',
  styleUrls: ['./select-digital-signature.component.css']
})
export class SelectDigitalSignatureComponent implements OnInit {
 @Output() notifyCloseModalPopUp= new EventEmitter();
 @Output() notifySignatureSelection= new EventEmitter();
 signatureResponseDto:SignatureResponseDto = new SignatureResponseDto();
 selectedSignature: string = '';
  constructor(private signatureService:SignatureService,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getExistingSignatures();
  }
  showSignatureModal: boolean = true;

  closeModal() {
    this.showSignatureModal = false;
    this.notifyCloseModalPopUp.emit("close");
  }

  submitSelection() {
    let selectedSignatureImagePath = '';
    if (this.selectedSignature === this.signatureResponseDto.uploadedSignatureImagePath) {
      selectedSignatureImagePath = this.signatureResponseDto.uploadedSignatureImagePath;
    } else if (this.selectedSignature === this.signatureResponseDto.drawSignatureImagePath) {
      selectedSignatureImagePath = this.signatureResponseDto.drawSignatureImagePath;
    } else if (this.selectedSignature === this.signatureResponseDto.typedSignatureImagePath) {
      selectedSignatureImagePath = this.signatureResponseDto.typedSignatureImagePath;
    }

    this.notifySignatureSelection.emit(selectedSignatureImagePath);

    this.closeModal();
  }

  private getExistingSignatures() {
    this.signatureService.getExistingSignatures().subscribe(
      response => {
        let data = response.data;
        if(data!=undefined){
          this.signatureResponseDto = data;
        }
      }, error => {
      });
  }

  getSanitizedImageUrl(imagePath:any){
    const uniquePath = `${imagePath}?v=${new Date().getTime()}`;
    return this.sanitizer.bypassSecurityTrustUrl(uniquePath);
  }

}
