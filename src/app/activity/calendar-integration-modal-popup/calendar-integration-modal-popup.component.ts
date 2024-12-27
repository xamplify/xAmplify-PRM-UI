import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CalendarIntegrationService } from 'app/core/services/calendar-integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

@Component({
  selector: 'app-calendar-integration-modal-popup',
  templateUrl: './calendar-integration-modal-popup.component.html',
  styleUrls: ['./calendar-integration-modal-popup.component.css'],
  providers: [CalendarIntegrationService, HttpRequestLoader]
})
export class CalendarIntegrationModalPopupComponent implements OnInit {

  @Output() notifyClose = new EventEmitter();

  loggedInThroughVanityUrl = false;
  calendlyRedirectURL: any;

  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService, public vanityUrlService: VanityURLService,
    public httpRequestLoader: HttpRequestLoader, public logger: XtremandLogger, public calendarIntegrationService: CalendarIntegrationService, public router: Router) {
    this.loggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();
   }

  ngOnInit() {
    this.checkCalendarIntegrations();
    this.referenceService.openModalPopup("calendar-integration-modal-popup");
  }

  checkCalendarIntegrations(): any {
		this.checkCalendlyIntegration();
	}

  checkCalendlyIntegration() {
    this.referenceService.loading(this.httpRequestLoader, true);
		this.calendarIntegrationService.checkConfigurationByType("calendly").subscribe(data => {
			this.referenceService.loading(this.httpRequestLoader, false);
			let response = data;
			if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
				this.calendlyRedirectURL = response.data.redirectUrl;
			}
		}, error => {
			this.referenceService.loading(this.httpRequestLoader, false);
			this.logger.error(error, "Error in checkCalendarIntegrations()");
		}, () => this.logger.log("Integration Configuration Checking done"));
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
      this.referenceService.closeModalPopup("calendar-integration-modal-popup");
			window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
		}
		else if (this.calendlyRedirectURL !== undefined && this.calendlyRedirectURL !== '') {
			window.location.href = this.calendlyRedirectURL;
		}
	}

  closePopUp(){
    this.referenceService.closeModalPopup("calendar-integration-modal-popup");
    this.notifyClose.emit();
  }

}
