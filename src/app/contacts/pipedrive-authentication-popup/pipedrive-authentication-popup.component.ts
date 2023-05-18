import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
declare var $;

@Component({
  selector: 'app-pipedrive-authentication-popup',
  templateUrl: './pipedrive-authentication-popup.component.html',
  styleUrls: ['./pipedrive-authentication-popup.component.css'],
  providers: [RegularExpressions],
})
export class PipedriveAuthenticationPopupComponent implements OnInit {

  @Input() loggedInUserId: any;
  @Output() closeEvent = new EventEmitter<any>();
  apiKey: string;
  apiKeyClass: string;
  apiKeyError: boolean;
  customResponse: CustomResponse = new CustomResponse(); 
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();  
  loading: boolean = false;
  currentUser: string;

  constructor(private authenticationService: AuthenticationService, private dashBoardService: DashboardService, 
    public referenceService: ReferenceService, private vanityUrlService: VanityURLService, public regularExpressions: RegularExpressions, 
    private integrationService: IntegrationService) { }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    $("#pipedrivePreSettingsForm").modal('show');
    // this.checkAuthorization(); 
  }

  checkAuthorization() {
    this.loading = true;
    this.integrationService.checkConfigurationByType("pipedrive").subscribe(data => {
      this.loading = false;
			let response = data;      
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.getApiToken();
			}
		}, error => {
      this.loading = false;
		}, () => {}
    );
  }

  getApiToken() {
    this.loading = true;
    this.dashBoardService.getApiTokenForPipedrive(this.loggedInUserId)
      .subscribe(
        response => {
          this.loading = false;
          if (response.statusCode == 200) {
            let data = response.data;
            this.apiKey = data.apiKey;
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

  validateModelForm() {
    let valid = true;
    let errorMessage = "";
    if (this.apiKey == undefined || this.apiKey == null || this.apiKey.trim().length <= 0) {
      valid = false;
      errorMessage = "Please provide valid API Token";
    }

    if (valid) {
      this.customResponse.isVisible = false;
      this.saveApiToken()
    } else {
      this.customResponse = new CustomResponse('ERROR', errorMessage, true);
    }
  }

  saveApiToken() {
    this.loading = true;
    let requestObj = {
      userId: this.loggedInUserId,
      apiKey: this.apiKey.trim()
    }
    this.dashBoardService.saveApiTokenForPipedrive(requestObj)
      .subscribe(
        response => { 
          this.loading = false;         
          if (response.statusCode == 200) {            
            $( "#pipedrivePreSettingsForm" ).modal( 'hide' );
          } else if (response.statusCode == 403){
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
    console.log("Closed")
    this.closeEvent.emit("0");
  }

  hidePipedrivePresettingForm() {
    $("#pipedrivePreSettingsForm").hide();
    console.log("Closed")
    this.closeEvent.emit("0");
  }


}

