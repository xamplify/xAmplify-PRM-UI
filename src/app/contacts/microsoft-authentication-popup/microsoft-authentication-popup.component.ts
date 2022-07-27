import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
declare var $;

@Component({
  selector: 'app-microsoft-authentication-popup',
  templateUrl: './microsoft-authentication-popup.component.html',
  styleUrls: ['./microsoft-authentication-popup.component.css'],
  providers: [RegularExpressions],
})
export class MicrosoftAuthenticationPopupComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<any>();
  loggedInUserId: any;
  microsoftInstanceUrl: any;
  microsoftWebApiInstanceUrl: any;
  microsoftRedirectUrl: any;
  microsoftCurrentUser: string;
  microsoftLoading: boolean = false;
  customResponse: CustomResponse = new CustomResponse();
  disableAuthorizeButton: boolean = false;

  constructor(public authenticationService: AuthenticationService, private dashBoardService: DashboardService,
    public referenceService: ReferenceService, private vanityUrlService: VanityURLService, public regularExpressions: RegularExpressions) { }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    $("#microsoftPreSettingsForm").modal('show');
  }

  hideMicrosoftPresettingForm() {
    $("#microsoftPreSettingsForm").hide();
    console.log("Closed")
    this.closeEvent.emit("0");
  }

  validateMicrosoftModelForm() {
    let valid = true;
    let errorMessage = "";
    if (this.microsoftInstanceUrl == undefined || this.microsoftInstanceUrl == null || this.microsoftInstanceUrl.trim().length <= 0
      || !this.regularExpressions.URL_PATTERN.test(this.microsoftInstanceUrl.trim())) {
      valid = false;
      errorMessage = "Please provide valid Instance URL";
    } else if (this.microsoftWebApiInstanceUrl == undefined || this.microsoftWebApiInstanceUrl == null || this.microsoftWebApiInstanceUrl.trim().length <= 0
      || !this.regularExpressions.URL_PATTERN.test(this.microsoftWebApiInstanceUrl.trim())) {
      valid = false;
      errorMessage = "Please provide valid Web API Instance URL";
    }

    if (valid) {
      this.customResponse.isVisible = false;
      this.saveMicrosoftPreIntegrationSettings()
    } else {
      this.customResponse = new CustomResponse('ERROR', errorMessage, true);
    }

  }
  saveMicrosoftPreIntegrationSettings() {
    this.microsoftLoading = true;
    this.disableAuthorizeButton = true;
    let requestObj = {
      userId: this.loggedInUserId,
      instanceUrl: this.microsoftInstanceUrl.trim(),
      webApiInstanceUrl: this.microsoftWebApiInstanceUrl.trim()
    }
    this.dashBoardService.savePreIntegrationSettingsForMicrosoft(requestObj)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            let data = response.data;
            this.microsoftRedirectUrl = data.redirectUrl;            
            this.configureMicrosoft();
          }
        },
        error => {
          this.microsoftLoading = false;
        },
        () => { }
      );
  }

  configureMicrosoft() {
    if (this.vanityUrlService.isVanityURLEnabled()) {
      let providerName = 'microsoft';
      this.microsoftCurrentUser = localStorage.getItem('currentUser');
      const encodedData = window.btoa(this.microsoftCurrentUser);
      const encodedUrl = window.btoa(this.microsoftCurrentUser);
      let vanityUserId = JSON.parse(this.microsoftCurrentUser)['userId'];
      let url = null;
      if (this.microsoftRedirectUrl) {
        url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + null + "/" + null + "/" + null;

      } else {
        url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
      }

      var x = screen.width / 2 - 700 / 2;
      var y = screen.height / 2 - 450 / 2;
      window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
    }
    else if (this.microsoftRedirectUrl !== undefined && this.microsoftRedirectUrl !== '') {
      window.location.href = this.microsoftRedirectUrl;
    }
  }

}
