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
  selector: 'app-halopsaauthenticationpopup',
  templateUrl: './halopsaauthenticationpopup.component.html',
  styleUrls: ['./halopsaauthenticationpopup.component.css']
})
export class HalopsaauthenticationpopupComponent implements OnInit {

  @Input() loggedInUserId: any;
  @Output() closeEvent = new EventEmitter<any>();
  clientId: string;
  clientIdClass: string;
  clientIdError: boolean;
  clientSecret: string;
  clientSecretClass: string;
  clientSecretError: boolean;
  instanceURL: string;
  instanceURLClass: string;
  instanceURLError: boolean;
  isModelFormValid:boolean;
  halopsaButtonClass:string;
  loadingHalopsa:boolean;
  templateErrorHalopsa:boolean;
  customResponse: CustomResponse = new CustomResponse(); 
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();  
  loading: boolean = false;
  currentUser: string;

  constructor(private authenticationService: AuthenticationService, private dashBoardService: DashboardService, 
    public referenceService: ReferenceService, private vanityUrlService: VanityURLService, public regularExpressions: RegularExpressions, 
    private integrationService: IntegrationService) { }

  ngOnInit() {
    this.referenceService.goToTop();
    this.loggedInUserId = this.authenticationService.getUserId();
    $("#haloPSAPreSettingsForm").modal('show');
  }

  checkAuthorization() {
    this.loading = true;
    this.integrationService.checkConfigurationByType("halopsa").subscribe(data => {
      this.loading = false;
			let response = data;      
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.submitHalopsaCredentials();
			}
		}, error => {
      this.loading = false;
		}, () => {}
    );
  }


  submitHalopsaCredentials() {
    this.instanceURL = this.instanceURL.trim();
    this.clientId = this.clientId.trim();
    this.clientSecret = this.clientSecret.trim();
    this.loadingHalopsa = true;
        const obj = {
            userId: this.authenticationService.getUserId(),
            instanceUrl: this.instanceURL,
            clientId: this.clientId,
            clientSecret: this.clientSecret
        }

        this.dashBoardService.saveHalopsaCredentials(obj).subscribe(response =>
        {
          this.loadingHalopsa = false; 
            if (response.statusCode == 200)
            {
              $( "#haloPSAPreSettingsForm" ).modal( 'hide' );
              this.customResponse = new CustomResponse('SUCCESS', response.message, true); 
            } else if (response.statusCode == 403){
              this.customResponse = new CustomResponse('INFO', response.message, true);
            } else {
              this.customResponse = new CustomResponse('ERROR', response.message, true);
            }
        }, error =>
        {
        this.loadingHalopsa = false;
        this.templateErrorHalopsa = error;
        }, () => {}
        )
  }

  validateModelForm(fieldId: any)
    {
        var errorClass = "form-group has-error has-feedback";
        var successClass = "form-group has-success has-feedback";
      
        if (fieldId == 'clientId')
        {
            if (this.clientId.length > 0)
            {
                this.clientIdClass = successClass;
                this.clientIdError = false;
            } else
            {
                this.clientIdClass = errorClass;
                this.clientIdError = true;
            }
        } else if (fieldId == 'clientSecret')
        {
            if (this.clientSecret.length > 0)
            {
               
                this.clientSecretClass = successClass;
                this.clientSecretError = false;
            } else
            {
                this.clientSecretClass = errorClass;
                this.clientSecretError = true;
            }
        } else if (fieldId == 'instanceURL')
        {
            if (this.instanceURL.length > 0)
            {
              
                this.instanceURLClass = successClass;
                this.instanceURLError = false;
            } else
            {
                this.instanceURLClass = errorClass;
                this.instanceURLError = true;
            }
        }
        this.toggleSubmitButtonState();
    }

    toggleSubmitButtonState()
    {
       
        if (!this.clientIdError && !this.clientSecretError && !this.instanceURLError)
            {
            this.isModelFormValid = true;
            this.halopsaButtonClass = "btn btn-primary";
            }
        else
        {
            this.isModelFormValid = false;
            this.halopsaButtonClass = "btn btn-default";
        }
    }
  closeForm() {
    console.log("Closed")
    this.closeEvent.emit("0");
  }

  hideHaloPSAPreSettingsForm() {
    $("#haloPSAPreSettingsForm").modal('hide');
    console.log("Closed")
    this.closeEvent.emit("0");
  }
}
