import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { SamlSecurityService } from './samlsecurity.service';
import { SamlSecurity } from '../models/samlsecurity';
import { Properties } from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';

@Component({
  selector: 'app-samlsecurity',
  templateUrl: './samlsecurity.component.html',
  styleUrls: ['./samlsecurity.component.css'],
  providers: [SamlSecurityService, Properties]
})
export class SamlsecurityComponent implements OnInit {
  emailId: string;
  tabName: string;
  samlSecurityObj: SamlSecurity;
  customResponse: CustomResponse = new CustomResponse();

  constructor(private authenticationService: AuthenticationService, private samlSecurityService: SamlSecurityService, public properties: Properties) { }

  ngOnInit() {
    this.tabName = "tab1";
    this.emailId = this.authenticationService.user.emailId;
    this.samlSecurityService.getSamlDetailsByUserName(this.emailId).subscribe(result => {
      this.samlSecurityObj = result;
    });
  }

  tabClicked(event: any, percent: number, selectedTab: string) {
    this.tabName = selectedTab;
    if (this.tabName === "tab1") {
      console.log("tab1")
    } else if (this.tabName === "tab2") {
      if (this.samlSecurityObj.id === undefined || this.samlSecurityObj.id === null) {
        let samlObj = {
          emailId: this.emailId,
          companyId: this.authenticationService.user.campaignAccessDto.companyId
        }
        this.samlSecurityService.saveSamlSecurity(samlObj).subscribe(response => {
          this.samlSecurityObj = response;
        });
      } else if ((this.samlSecurityObj.id) && (this.samlSecurityObj.acsURL === undefined || this.samlSecurityObj.acsURL === null)) {
        this.samlSecurityObj.acsURL = this.authenticationService.REST_URL + "saml/sso/" + this.samlSecurityObj.id;
      }
    } else if (this.tabName === "tab3") {

    }
  }

  onChange(event: any) {
    this.samlSecurityService.uploadMetadataFile(event, this.samlSecurityObj.id).subscribe(response => {
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
