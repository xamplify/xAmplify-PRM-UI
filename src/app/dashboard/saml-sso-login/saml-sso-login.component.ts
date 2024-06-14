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
      self.samlSecurityObj.acsURL = self.authenticationService.REST_URL + "saml/sso/" + self.samlSecurityObj.id;
    }
  }


  onChange(event: any) {
    this.samlSecurityService.uploadSaml2MetadataFile(event, this.samlSecurityObj.id, this.loggedInUserId).subscribe(response => {
      this.samlSecurityObj = response;
      this.customResponse = new CustomResponse('SUCCESS', this.properties.UPLOAD_METADATA_TEXT2, true);
    }, error => {
      this.customResponse = new CustomResponse('ERROR', "Error in uploading file", true);
    });
  }

  copyToClipboard(element) {
    element.select();
    document.execCommand('copy');
  }

}
