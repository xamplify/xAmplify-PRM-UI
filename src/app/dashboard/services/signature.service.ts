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
    const url = this.signatureUrl+'saveTypedSignature?access_token=' + this.authenticationService.access_token;
    return this.authenticationService.callPostMethod(url,signatureDto);
  }

}
