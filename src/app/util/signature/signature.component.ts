import { Component, OnInit } from '@angular/core';
import { MY_PROFILE_MENU_CONSTANTS } from 'app/constants/my-profile-menu-constants';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css','../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css']
})
export class SignatureComponent implements OnInit {
  uploadSignatureButtonClicked = false;
  signatureMenuHeader = MY_PROFILE_MENU_CONSTANTS.SIGNATURE_MENU_HEADER;
  
  constructor() { }

  ngOnInit() {
  }

  callUploadImageComponent(){
    this.uploadSignatureButtonClicked = true;
  }

  uploadImageCloseModalPopUpEventReceiver(event:any){
    this.uploadSignatureButtonClicked = false;
  }
}
