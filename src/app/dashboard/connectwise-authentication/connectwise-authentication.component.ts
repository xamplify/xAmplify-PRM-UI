import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

@Component({
  selector: 'app-connectwise-authentication',
  templateUrl: './connectwise-authentication.component.html',
  styleUrls: ['./connectwise-authentication.component.css']
})
export class ConnectwiseAuthenticationComponent implements OnInit {
  @Input() loggedInUserId: any;
  @Output() closeEvent = new EventEmitter<any>();  
  customResponse: CustomResponse = new CustomResponse();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loading: boolean = false;
  currentUser: string;
  companyId: any;
  instanceUrl: any;
  publicKey: any;
  privateKey: any;

  constructor(private authenticationService: AuthenticationService, private dashBoardService: DashboardService,
    public referenceService: ReferenceService, private vanityUrlService: VanityURLService, public regularExpressions: RegularExpressions,
    private integrationService: IntegrationService) { }

  ngOnInit() {
    this.checkAuthorization();
  }

  checkAuthorization() {
    this.loading = true;
    this.integrationService.checkConfigurationByType("connectwise").subscribe(data => {
      this.loading = false;
      let response = data;
      if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
        this.getAuthCredentials();
      }
    }, error => {
      this.loading = false;
    }, () => { }
    );
  }

  getAuthCredentials() {
    this.loading = true;
    this.dashBoardService.getAuthCredentialsForConnectWise(this.loggedInUserId)
      .subscribe(
        response => {
          this.loading = false;
          if (response.statusCode == 200) {
            let data = response.data;
            this.instanceUrl = data.instanceUrl;
            this.companyId = data.externalOrganizationId;
            this.publicKey = data.publicKey;
            this.privateKey = data.privateKey;            
          } else {
            this.customResponse = new CustomResponse('ERROR', response.message, true);
          }
        },
        error => {
          this.loading = false;
        },
        () => { }
      );
  }

  validateModelForm(actionType: any) {
    let valid = true;
    let errorMessage = "";
    if (this.companyId == undefined || this.companyId == null || this.companyId.trim().length <= 0) {
      valid = false;
      errorMessage = "Please provide ConnectWise Company ID";
    } else if (this.instanceUrl == undefined || this.instanceUrl == null || this.instanceUrl.trim().length <= 0) {
      valid = false;
      errorMessage = "Please provide ConnectWise Client ID";
    } else if (this.publicKey == undefined || this.publicKey == null || this.publicKey.trim().length <= 0) {
      valid = false;
      errorMessage = "Please provide Public Key";
    } else if (this.privateKey == undefined || this.privateKey == null || this.privateKey.trim().length <= 0) {
      valid = false;
      errorMessage = "Please provide Private Key";
    }
    if (valid) {
      this.customResponse.isVisible = false;
      if (actionType === 'save') {
        this.saveAuthCredentials();
      } else if (actionType === 'test') {
        this.testAuthCredentials();
      }
      
    } else {
      this.customResponse = new CustomResponse('ERROR', errorMessage, true);
    }

  }

  testAuthCredentials() {
    this.loading = true;
    let requestObj = {
      userId: this.loggedInUserId,
      instanceUrl: this.instanceUrl.trim(),
      publicKey: this.publicKey.trim(),
      privateKey: this.privateKey.trim(),
      externalOrganizationId: this.companyId.trim()
    }

    this.dashBoardService.testAuthCredentialsForConnectWise(requestObj)
      .subscribe(
        response => {
          this.loading = false;
          if (response.statusCode == 200) {
            this.customResponse = new CustomResponse('SUCCESS', response.message, true);
          } else if (response.statusCode == 403) {
            this.customResponse = new CustomResponse('INFO', response.message, true);
          } else {
            this.customResponse = new CustomResponse('ERROR', response.message, true);
          }
        },
        error => {
          this.loading = false;
          let errorMessage = this.referenceService.getApiErrorMessage(error);
          this.customResponse = new CustomResponse('ERROR', errorMessage, true);
        },
        () => { }
      );
  }

  saveAuthCredentials() {
    this.loading = true;
    let requestObj = {
      userId: this.loggedInUserId,
      instanceUrl: this.instanceUrl.trim(),
      publicKey: this.publicKey.trim(),
      privateKey: this.privateKey.trim(),
      externalOrganizationId: this.companyId.trim()
    }

    this.dashBoardService.saveAuthCredentialsForConnectWise(requestObj)
      .subscribe(
        response => {
          this.loading = false;
          if (response.statusCode == 200) {
            this.closeForm();
          } else if (response.statusCode == 403) {
            this.customResponse = new CustomResponse('INFO', response.message, true);
          } else {
            this.customResponse = new CustomResponse('ERROR', response.message, true);
          }
        },
        error => {
          this.loading = false;
          let errorMessage = this.referenceService.getApiErrorMessage(error);
          this.customResponse = new CustomResponse('ERROR', errorMessage, true);
        },
        () => { }
      );
  }

  closeForm() {
    console.log("Closed ConnectWise Auth")
    this.closeEvent.emit("0");
  }

}
