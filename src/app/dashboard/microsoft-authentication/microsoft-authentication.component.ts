import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-microsoft-authentication',
  templateUrl: './microsoft-authentication.component.html',
  styleUrls: ['./microsoft-authentication.component.css'],
  providers: [RegularExpressions]
})
export class MicrosoftAuthenticationComponent implements OnInit {

  @Input() loggedInUserId: any;
  @Output() closeEvent = new EventEmitter<any>();
  instanceUrl: string;
  webApiInstanceUrl: string;
  instanceUrlClass: string;
  webApiInstanceUrlClass: string;
  instanceUrlError: boolean;
  webApiInstanceUrlError: boolean;
  customResponse: CustomResponse = new CustomResponse(); 
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();  
  loading: boolean = false;
  redirectUrl: string;
  currentUser: string;

  constructor(private authenticationService: AuthenticationService, private dashBoardService: DashboardService, 
    public referenceService: ReferenceService, private vanityUrlService: VanityURLService, public regularExpressions: RegularExpressions, 
    private integrationService: IntegrationService) { }

  ngOnInit() {
    this.checkAuthorization(); 
  }

  checkAuthorization() {
    this.loading = true;
    this.integrationService.checkConfigurationByType("microsoft").subscribe(data => {
      this.loading = false;
			let response = data;      
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.getPreIntegrationSettings();
			}
		}, error => {
      this.loading = false;
		}, () => {}
    );
  }

  getPreIntegrationSettings() {
    this.loading = true;
    this.dashBoardService.getPreIntegrationSettingsForMicrosoft(this.loggedInUserId)
      .subscribe(
        response => {
          this.loading = false;
          if (response.statusCode == 200) {
            let data = response.data;
            this.instanceUrl = data.instanceUrl;
            this.webApiInstanceUrl = data.webApiInstanceUrl;
          }
        },
        error => {
          this.loading = false;
        },
        () => { }
      );
  }

  validateModelForm() {
    let valid = true;
    let errorMessage = "";
    if (this.instanceUrl == undefined || this.instanceUrl == null || this.instanceUrl.trim().length <= 0
    || !this.regularExpressions.URL_PATTERN.test(this.instanceUrl.trim())) {
      valid = false;
      errorMessage = "Please provide valid Instance URL";
    } else if (this.webApiInstanceUrl == undefined || this.webApiInstanceUrl == null || this.webApiInstanceUrl.trim().length <= 0
    || !this.regularExpressions.URL_PATTERN.test(this.webApiInstanceUrl.trim())) {
      valid = false;
      errorMessage = "Please provide valid Web API Instance URL";
    }

    if (valid) {
      this.customResponse.isVisible = false;
      this.savePreIntegrationSettings()
    } else {
      this.customResponse = new CustomResponse('ERROR', errorMessage, true);
    }

  }
  savePreIntegrationSettings() {
    this.loading = true;
    let requestObj = {
      userId: this.loggedInUserId,
      instanceUrl: this.instanceUrl.trim(),
      webApiInstanceUrl: this.webApiInstanceUrl.trim()
    }
    this.dashBoardService.savePreIntegrationSettingsForMicrosoft(requestObj)
      .subscribe(
        response => {          
          if (response.statusCode == 200) {
            let data = response.data;
            this.redirectUrl = data.redirectUrl;
            this.configureMicrosoft();
          }
        },
        error => {
          this.loading = false;
        },
        () => { }
      );
  }

  configureMicrosoft() {
    if (this.vanityUrlService.isVanityURLEnabled()) {
			let providerName = 'microsoft';
			this.currentUser = localStorage.getItem('currentUser');
            const encodedData = window.btoa(this.currentUser);
            const encodedUrl = window.btoa(this.currentUser);
            let vanityUserId = JSON.parse(this.currentUser)['userId'];
            let url = null;
            if(this.redirectUrl){
                    url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + null + "/" + null + "/"+ null ;

            }else{
                    url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
            }
            
            var x = screen.width / 2 - 700 / 2;
            var y = screen.height / 2 - 450 / 2;
            window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
		}
		else if (this.redirectUrl !== undefined && this.redirectUrl !== '') {
			window.location.href = this.redirectUrl;
		}
  }

  closeForm() {
    console.log("Closed")
    this.closeEvent.emit("0");
  }

}
