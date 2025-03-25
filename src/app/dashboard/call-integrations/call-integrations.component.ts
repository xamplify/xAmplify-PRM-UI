import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CallIntegrationService } from 'app/core/services/call-integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

declare var swal;

@Component({
  selector: 'app-call-integrations',
  templateUrl: './call-integrations.component.html',
  styleUrls: ['./call-integrations.component.css'],
  providers: [CallIntegrationService]
})
export class CallIntegrationsComponent implements OnInit {
  aircallRibbonText: string;
  aircallRedirectURL: any;
  integrationType: string;
  integrationTabIndex: number = 0;
  ngxloading: boolean = false;
  loggedInThroughVanityUrl = false;
  activeCallIntegrationDetails: any;

  constructor(public referenceService: ReferenceService, public httpRequestLoader: HttpRequestLoader, public logger: XtremandLogger, public router: Router,
    private vanityUrlService: VanityURLService, public authenticationService: AuthenticationService, private callIntegrationService: CallIntegrationService) {
    this.loggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();
  }

  ngOnInit() {
    this.integrationTabIndex = 0;
    this.getActiveCallIntegration();
    this.checkCallIntegrations();
  }

  checkAircallIntegration() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.callIntegrationService.checkConfigurationByType("aircall").subscribe(data => {
      this.referenceService.loading(this.httpRequestLoader, false);
      let response = data;
      if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
        this.aircallRibbonText = "configured";
      }
      else {
        this.aircallRibbonText = "configure";
      }
      if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
        this.aircallRedirectURL = response.data.redirectUrl;
      }
    }, error => {
      this.referenceService.loading(this.httpRequestLoader, false);
      this.aircallRibbonText = "configure";
      this.logger.error(error, "Error in checkCallIntegrations()");
    }, () => this.logger.log("Integration Configuration Checking done"));
  }

  aircallSettings() {
    this.integrationType = 'aircall';
    this.integrationTabIndex = 1;
  }

  configAircall() {
    if (this.loggedInThroughVanityUrl) {
      let providerName = 'aircall';
      let currentUser = localStorage.getItem('currentUser');
      const encodedData = window.btoa(currentUser);
      let vanityUserId = JSON.parse(currentUser)['userId'];
      let url = null;
      if (this.aircallRedirectURL) {
        url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + null + "/" + null + "/" + null;
      } else {
        url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
      }

      var x = screen.width / 2 - 700 / 2;
      var y = screen.height / 2 - 450 / 2;
      window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
    }
    else if (this.aircallRedirectURL !== undefined && this.aircallRedirectURL !== '') {
      window.location.href = this.aircallRedirectURL;
    }
  }

  reConfigAircall() {
    try {
      const self = this;
      swal({
        title: 'Aircall Re-configuration?',
        text: 'Are you sure? All data related to existing aircall account will be deleted by clicking Yes.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#54a7e9',
        cancelButtonColor: '#999',
        confirmButtonText: 'Yes'

      }).then(function () {
        self.configAircall();
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
      this.ngxloading = false;
    }
  }

  closeSettingsTab() {
    this.integrationTabIndex = 0;
  }

  checkCallIntegrations(): any {
    this.checkAircallIntegration();
  }

  refreshIntegrationSettings(event: any) {
    this.checkCallIntegrations();
    this.getActiveCallIntegration();
    this.integrationTabIndex = 0;
  }

  getActiveCallIntegration() {
    this.ngxloading = true;
    let self = this;
    self.callIntegrationService.getActiveCallIntegration().subscribe(
      data => {
        this.ngxloading = false;
        if (data.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          this.activeCallIntegrationDetails = data.data;
        }
      },
      error => {
        this.ngxloading = false;
      }
    );
  }

  ngAfterViewChecked() {
		let tempCheckAircallAuth = localStorage.getItem('isAircallAuth');
		localStorage.removeItem('isAircallAuth');

		if (tempCheckAircallAuth == 'yes') {
			this.referenceService.integrationCallBackStatus = true;
			localStorage.removeItem("userAlias");
			localStorage.removeItem("currentModule");
			this.router.navigate(['/home/dashboard/myprofile']);
		}
	}

}
