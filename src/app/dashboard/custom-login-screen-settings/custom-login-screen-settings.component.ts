import { Component, OnInit } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CompanyProfile } from '../company-profile/models/company-profile';
declare var $:any;
@Component({
  selector: 'app-custom-login-screen-settings',
  templateUrl: './custom-login-screen-settings.component.html',
  styleUrls: ['./custom-login-screen-settings.component.css'],
  providers:[Properties]
})
export class CustomLoginScreenSettingsComponent implements OnInit {

  companyProfile: CompanyProfile = new CompanyProfile();
  favIconfile: File;
  bgImageFile: File; 
  companyFavIconPath = "";
  companyBgImagePath = "";
  cropLogoImageText:string;
  squareDataForBgImage:any;
  croppedImageForBgImage: any = '';
  bgImageChangedEvent: any = '';
  cropRounded: boolean;

  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public properties:Properties) { }

  ngOnInit() {
  }

  setVendorLogoOption(event:any){
    this.companyProfile.showVendorCompanyLogo = event;
  }

  bgImageClick(){
    this.cropLogoImageText = "Choose the image to be used as your company background";
    this.cropRounded = false;
    $('#cropBgImage').modal('show');
   }

   errorHandler(event){ event.target.src ='assets/images/company-profile-logo.png'; }

}
