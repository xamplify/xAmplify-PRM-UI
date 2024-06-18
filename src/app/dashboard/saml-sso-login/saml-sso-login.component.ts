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
  

  constructor(private authenticationService: AuthenticationService, private samlSecurityService: SamlSecurityService, 
   public properties: Properties) { }

  ngOnInit() {
    this.tabName = "tab2";
    this.emailId = this.authenticationService.user.emailId;
    this.loggedInUserId = this.authenticationService.getUserId();
    this.samlSecurityService.getSamlDetailsByUserName(this.emailId).subscribe(result => {
      this.samlSecurityObj = result;
      this. saveSaml2Security();
    });
   

  }

  tabClicked(event: any, percent: number, selectedTab: string) {
    this.tabName = selectedTab;
    if (this.tabName === "tab2") {
      this. saveSaml2Security();
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
  }


  onFileChange(event: Event) {
    this.metaDataFile = event;
    const input = event.target as HTMLInputElement;
    const file: File = (input.files as FileList)[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.samlSecurityObj.metadata = reader.result as string; 
    };
    reader.readAsText(file);
  }

  submitMetaData() {
    var fileList: FileList = this.metaDataFile.target.files;
      if (fileList.length > 0) {
        var file: File = fileList[0];
      }
      this.samlSecurityObj.loggedInUserId = this.loggedInUserId;
    this.samlSecurityService.uploadSaml2MetadataFile(file, this.samlSecurityObj)
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
  selectIdentityProviderName(idpName: any){
    this.samlSecurityObj.identityProviderName = idpName;
  }
}
