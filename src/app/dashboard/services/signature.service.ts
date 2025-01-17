import { Injectable } from '@angular/core';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SignatureDto } from '../models/signature-dto';


@Injectable()
export class SignatureService {
 

  signatureUrl =  this.authenticationService.REST_URL+RouterUrlConstants.signature;

  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService) { }

  saveTypedSignature(signatureDto:SignatureDto){
    signatureDto.loggedInUserId = this.authenticationService.getUserId();
    const url = this.signatureUrl+'saveTypedSignature?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPostMethod(url,signatureDto);
  }

  getExistingSignatures(){
    const url = this.signatureUrl+'getExistingSignatures/'+this.authenticationService.getUserId()+'?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

  uploadDrawSignature(signatureDto: SignatureDto) {
    signatureDto.loggedInUserId = this.authenticationService.getUserId();
    const url = this.signatureUrl+'saveDrawSignature?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPostMethod(url,signatureDto);
  }

  saveUploadedSignature(selectedFile:any){
    const formData = new FormData();
    formData.append('file', selectedFile); // Append the file
    formData.append('userId', this.authenticationService.getUserId().toString()); // Append the userId
    const url = this.signatureUrl+'saveUploadedSignature?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPostMethod(url,formData);
  }

  removeExistingSignature(signatureDto:SignatureDto){
    signatureDto.loggedInUserId = this.authenticationService.getUserId();
    const url = this.signatureUrl+'removeExistingSignature?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPutMethod(url,signatureDto);
  }

}
