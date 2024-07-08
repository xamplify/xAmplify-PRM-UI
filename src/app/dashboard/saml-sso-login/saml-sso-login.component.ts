import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { SamlSecurity } from '../models/samlsecurity';
import { Properties } from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import { SamlSecurityService } from '../samlsecurity/samlsecurity.service';

@Component({
  selector: 'app-saml-sso-login',
  templateUrl: './saml-sso-login.component.html',
  styleUrls: ['./saml-sso-login.component.css'],
  providers: [Properties, SamlSecurityService]
})
export class SamlSsoLoginComponent implements OnInit {

  emailId: string;
  tabName: string;
  samlSecurityObj: SamlSecurity;
  customResponse: CustomResponse = new CustomResponse();
  loggedInUserId: any;
  metaDataFile:any;
  identityServiceProviderNames = [
    { value: 'MICROSOFT_AZURE', label: 'Microsoft Azure' },
    { value: 'VERSA', label: 'Versa' }
  ];
  errorClass = "form-group has-error has-feedback";
  successClass = "form-group has-success has-feedback";
  formGroupClass = "form-group";
  fromNameDivClass:string =  this.formGroupClass;
  disableSubmitButton = true;
  attachedMeataData: File;
  ngxLoading: boolean = false;
  

  constructor(private authenticationService: AuthenticationService, private samlSecurityService: SamlSecurityService, 
   public properties: Properties) { }

  ngOnInit() {
    this.tabName = "tab2";
    this.emailId = this.authenticationService.user.emailId;
    this.loggedInUserId = this.authenticationService.getUserId();
    this.samlSecurityService.getSaml2DetailsByUserId(this.loggedInUserId).subscribe(result => {
      this.samlSecurityObj = result;
      this.saveSaml2Security();
    });
  }

  tabClicked(event: any, percent: number, selectedTab: string) {
    this.tabName = selectedTab;
    if (this.tabName === "tab2") {
      this.saveSaml2Security();
    } 
  }

  saveSaml2Security(){
    let self = this;
    if (self.samlSecurityObj.id === undefined || self.samlSecurityObj.id === null) {
      let samlObj = {
        emailId: self.emailId,
        companyId: self.authenticationService.user.campaignAccessDto.companyId,
        createdByUserId: self.loggedInUserId
      }
      self.samlSecurityService.saveSaml2Security(samlObj).subscribe(response => {
        self.samlSecurityObj = response;
      });
    } else if ((self.samlSecurityObj.id) && (self.samlSecurityObj.acsURL === undefined || self.samlSecurityObj.acsURL === null)) {
      self.samlSecurityObj.acsURL = self.authenticationService.REST_URL + "saml2/sso/" + self.samlSecurityObj.acsId;
    }
    this.validateSubmitButton();
  }


  onFileChange(event: Event) {
    this.metaDataFile = event;
    const input = event.target as HTMLInputElement;
    const file: File = (input.files as FileList)[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.samlSecurityObj.metadata = reader.result as string;
      this.validateSubmitButton();
    };
    reader.readAsText(file);

    var fileList: FileList = this.metaDataFile.target.files;
      if (fileList.length > 0) {
        this.attachedMeataData = fileList[0];
      }
  }

  submitMetaData() {
    if (this.attachedMeataData != undefined) {
      this.samlSecurityObj.loggedInUserId = this.loggedInUserId;
      this.ngxLoading = true;
      this.samlSecurityService.uploadSaml2MetadataFile(this.attachedMeataData, this.samlSecurityObj)
        .subscribe(response => {
          this.ngxLoading = false;
          this.customResponse = new CustomResponse('SUCCESS', this.properties.UPLOAD_METADATA_TEXT2, true);
        }, error => {
          this.ngxLoading = false;
          this.customResponse = new CustomResponse('ERROR', "Error in uploading file", true);
        });
    } else {
      this.customResponse = new CustomResponse('SUCCESS', this.properties.UPLOAD_METADATA_TEXT2, true);
    }
  }

  copyToClipboard(element) {
    element.select();
    document.execCommand('copy');
  }

  selectIdentityProviderName(idpName: any) {
    this.samlSecurityObj.identityProviderName = idpName;
    if (this.samlSecurityObj.identityProviderName == 'null') {
      this.fromNameDivClass = this.errorClass;
    } else{
      this.fromNameDivClass = this.successClass;
    }
    this.samlSecurityObj.metadata = '';
    this.disableSubmitButton = true;
    this.validateSubmitButton();
  }

  validateSubmitButton() {
    if(this.samlSecurityObj.identityProviderName !== undefined && this.samlSecurityObj.identityProviderName !== null && this.samlSecurityObj.identityProviderName !== ''
      && this.samlSecurityObj.metadata !== undefined && this.samlSecurityObj.metadata !== null && this.samlSecurityObj.metadata !== '') {
      this.disableSubmitButton = false;
    }
  }
}
