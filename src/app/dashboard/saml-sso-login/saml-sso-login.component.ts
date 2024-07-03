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
  oauthSsoObj: SamlSecurity;
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
  

  constructor(private authenticationService: AuthenticationService, private samlSecurityService: SamlSecurityService, 
   public properties: Properties) { }

  ngOnInit() {

    this.emailId = this.authenticationService.user.emailId;
    this.loggedInUserId = this.authenticationService.getUserId();
    this.samlSecurityService.getOauthSsoConfigurationDetails(this.loggedInUserId).subscribe(result => {
        this.oauthSsoObj = result;
        this.saveOauthSsoConfiguration();
    });
  }

  // tabClicked(event: any, percent: number, selectedTab: string) {
  //   this.tabName = selectedTab;
  //   if (this.tabName === "tab2") {
  //     this. saveOauthSsoConfiguration();
  //   } 
  // }

  saveOauthSsoConfiguration(){
    let self = this;
    if (self.oauthSsoObj.id === undefined || self.oauthSsoObj.id === null) {
      //self.oauthSsoObj.createdBy = self.loggedInUserId;
      self.oauthSsoObj.companyId = self.authenticationService.user.campaignAccessDto.companyId;

      self.samlSecurityService.saveOauthSsoConfiguration(self.oauthSsoObj).subscribe(response => {
        self.oauthSsoObj = response;
      });
    } 
    
    
    else if ((self.oauthSsoObj.id) && (self.oauthSsoObj.acsURL === undefined || self.oauthSsoObj.acsURL === null)) {
      self.oauthSsoObj.acsURL = self.authenticationService.REST_URL + "saml2/sso/" + self.oauthSsoObj.acsId;
    }
    this.validateSubmitButton();
  }


  onFileChange(event: Event) {
    this.metaDataFile = event;
    const input = event.target as HTMLInputElement;
    const file: File = (input.files as FileList)[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.oauthSsoObj.metadata = reader.result as string;
      this.validateSubmitButton();
    };
    reader.readAsText(file);
  }

  submitMetaData() {
    var fileList: FileList = this.metaDataFile.target.files;
      if (fileList.length > 0) {
        var file: File = fileList[0];
      }
      this.oauthSsoObj.loggedInUserId = this.loggedInUserId;
    this.samlSecurityService.uploadSaml2MetadataFile(file, this.oauthSsoObj)
    .subscribe(response => {
        this.customResponse = new CustomResponse('SUCCESS', this.properties.UPLOAD_METADATA_TEXT2, true);
    }, error => {
      this.customResponse = new CustomResponse('ERROR', "Error in uploading file", true);
    });
  }

  copyToClipboard(element) {
    element.select();
    document.execCommand('copy');
  }

  selectIdentityProviderName(idpName: any) {
    this.oauthSsoObj.identityProviderName = idpName;
    if (this.oauthSsoObj.identityProviderName == 'null') {
      this.fromNameDivClass = this.errorClass;
    } else{
      this.fromNameDivClass = this.successClass;
    }
    this.oauthSsoObj.metadata = '';
    this.disableSubmitButton = true;
    this.validateSubmitButton();
  }

  validateSubmitButton() {
    if(this.oauthSsoObj.identityProviderName !== undefined && this.oauthSsoObj.identityProviderName.length > 0
      && this.oauthSsoObj.metadata !== undefined && this.oauthSsoObj.metadata.length > 0) {
      this.disableSubmitButton = false;
    }
  }
}
