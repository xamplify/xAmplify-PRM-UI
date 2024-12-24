import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CalendarIntegrationService } from 'app/core/services/calendar-integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

declare var swal;

@Component({
  selector: 'app-calendar-integrations',
  templateUrl: './calendar-integrations.component.html',
  styleUrls: ['./calendar-integrations.component.css'],
  providers: [CalendarIntegrationService]
})
export class CalendarIntegrationsComponent implements OnInit {
  calendlyRibbonText: string;
  calendlyRedirectURL: any;
  integrationType: string;
  integrationTabIndex: number = 0;
  ngxloading: boolean = false;
  loggedInThroughVanityUrl = false;

  constructor(public referenceService: ReferenceService, public httpRequestLoader: HttpRequestLoader, public logger: XtremandLogger, public router: Router,
    public calendarIntegrationService: CalendarIntegrationService, private vanityUrlService: VanityURLService, public authenticationService: AuthenticationService) { 
      this.loggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();
  }

  ngOnInit() {
    this.integrationTabIndex = 0;
    this.checkCalendarIntegrations();
  }

  checkCalendarIntegrations(): any {
		this.checkCalendlyIntegration();
	}

  checkCalendlyIntegration() {
    this.referenceService.loading(this.httpRequestLoader, true);
		this.calendarIntegrationService.checkConfigurationByType("calendly").subscribe(data => {
			this.referenceService.loading(this.httpRequestLoader, false);
			let response = data;
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.calendlyRibbonText = "configured";
			}
			else {
				this.calendlyRibbonText = "configure";
			}
			if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
				this.calendlyRedirectURL = response.data.redirectUrl;
			}
		}, error => {
			this.referenceService.loading(this.httpRequestLoader, false);
			this.calendlyRibbonText = "configure";
			this.logger.error(error, "Error in checkCalendarIntegrations()");
		}, () => this.logger.log("Integration Configuration Checking done"));
  }

  calendlySettings() {
		this.integrationType = 'calendly';
		this.integrationTabIndex = 1;
	}

  configCalendly() {
		if (this.loggedInThroughVanityUrl) {
			let providerName = 'calendly';
			let currentUser = localStorage.getItem('currentUser');
			const encodedData = window.btoa(currentUser);
			let vanityUserId = JSON.parse(currentUser)['userId'];
			let url = null;
			if (this.calendlyRedirectURL) {
				url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + null + "/" + null + "/" + null;
			} else {
				url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
			}

			var x = screen.width / 2 - 700 / 2;
			var y = screen.height / 2 - 450 / 2;
			window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
		}
		else if (this.calendlyRedirectURL !== undefined && this.calendlyRedirectURL !== '') {
			window.location.href = this.calendlyRedirectURL;
		}
	}

  reConfigCalendly() {
		try {
			const self = this;
			swal({
				title: 'Calendly Re-configuration?',
				text: 'Are you sure? All data related to existing calendly account will be deleted by clicking Yes.',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#54a7e9',
				cancelButtonColor: '#999',
				confirmButtonText: 'Yes'

			}).then(function () {
				self.configCalendly();
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
  
  ngAfterViewChecked() {
		let tempCheckCalendlyAuth = localStorage.getItem('isCalendlyAuth');
		localStorage.removeItem('isCalendlyAuth');

		if (tempCheckCalendlyAuth == 'yes') {
			this.referenceService.integrationCallBackStatus = true;
			localStorage.removeItem("userAlias");
			localStorage.removeItem("currentModule");
			this.router.navigate(['/home/dashboard/myprofile']);
		}
	}

  refreshIntegrationSettings(event: any) {
		this.checkCalendarIntegrations();
		this.integrationTabIndex = 0;
	}

}
