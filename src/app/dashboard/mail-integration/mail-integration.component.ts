import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { OutlookEmailService } from 'app/outlook-email/outlook-email.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

declare var swal;
@Component({
  selector: 'app-mail-integration',
  templateUrl: './mail-integration.component.html',
  styleUrls: ['./mail-integration.component.css'],
  providers: [OutlookEmailService]
})
export class MailIntegrationComponent implements OnInit {
  gmailRibbonText: string = 'configure';
  outlookRibbonText: string = 'configure';
  loading: boolean = false;
  type: string;
  statusCode: any;
  accessToken: string;
  activeGamil: boolean = false;
  activeOutlook: boolean = false;
  loggedInThroughVanityUrl: boolean = false;
  gmailRedirectURL: any;
  outlookRedirectURL: any;
  constructor(private outlookEmailService: OutlookEmailService, private authenticationService: AuthenticationService, public logger: XtremandLogger, public referenceService: ReferenceService, private vanityUrlService: VanityURLService, public router: Router) {
    this.loggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();

  }


  ngOnInit() {
    this.getAccessToken();
    this.checkGmailIntegration();
    this.checkOutlookIntegration();
  }

  getAccessToken() {
    this.loading = true;
    this.outlookEmailService.getAccessToken().subscribe(
      result => {
        this.statusCode = result.statusCode;
        if (result.data && result.data.length > 0) {
          result.data.forEach(record => {
            this.activeGamil = record.active;
            if (record.type === 'OUTLOOK') {
              // this.outlookRibbonText = 'configured';
              this.activeOutlook = record.active;
            } else if (record.type === 'GMAIL') {
              // this.gmailRibbonText = 'configured';
              this.activeGamil = record.active;
            }
          });
        } else {
          this.accessToken = null;
          console.warn('No active record found.');
        }
        this.loading = false;
      },
      error => {
        console.error('Failed to get access token:', error);
        this.loading = false;
      },
      () => { this.loading = false; }
    );
  }

  configureGmail() {
    if (this.loggedInThroughVanityUrl) {
      let providerName = 'gmail';
      let currentUser = localStorage.getItem('currentUser');
      const encodedData = window.btoa(currentUser);
      let vanityUserId = JSON.parse(currentUser)['userId'];
      let url = null;
      if (this.gmailRedirectURL) {
        url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + null + "/" + null + "/" + null;
      } else {
        url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
      }

      var x = screen.width / 2 - 700 / 2;
      var y = screen.height / 2 - 450 / 2;
      window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
    }
    else if (this.gmailRedirectURL !== undefined && this.gmailRedirectURL !== '') {
      window.location.href = this.gmailRedirectURL;
    }
  }

  configureOutlook() {
    if (this.loggedInThroughVanityUrl) {
      let providerName = 'outlook';
      let currentUser = localStorage.getItem('currentUser');
      const encodedData = window.btoa(currentUser);
      let vanityUserId = JSON.parse(currentUser)['userId'];
      let url = null;
      if (this.outlookRedirectURL) {
        url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + null + "/" + null + "/" + null;
      } else {
        url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
      }
      var x = screen.width / 2 - 700 / 2;
      var y = screen.height / 2 - 450 / 2;
      window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
    }
    else if (this.outlookRedirectURL !== undefined && this.outlookRedirectURL !== '') {
      window.location.href = this.outlookRedirectURL;
    }
  }

  reConfigMail(type: string) {
    try {
      const self = this;
      swal({
        title: `${type === 'GMAIL' ? 'Gmail' : 'Outlook'} Re-configuration?`,
        text: `Are you sure? All data related to existing ${type === 'GMAIL' ? 'Gmail' : 'Outlook'} account will be deleted by clicking Yes.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#54a7e9',
        cancelButtonColor: '#999',
        confirmButtonText: 'Yes'
      }).then(function () {
        if (type === 'GMAIL') {
          self.configureGmail();
        } else if (type === 'OUTLOOK') {
          self.configureOutlook();
        }
      }, function (dismiss: any) {
        console.log('You clicked on option: ' + dismiss);
      });
    } catch (error) {
      this.logger.error(this.referenceService.errorPrepender + ' confirmDelete():' + error);
      this.loading = false;
    }
  }


  checkGmailIntegration() {
    this.loading = true
    this.outlookEmailService.checkConfigurationByType("gmail").subscribe(data => {
      this.loading = false;
      let response = data;
      if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
        this.gmailRibbonText = "configured";
      }
      else {
        this.gmailRibbonText = "configure";
      }
      if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
        this.gmailRedirectURL = response.data.redirectUrl;
      }
    }, error => {
      this.loading = false;
      this.gmailRibbonText = "configure";
      this.logger.error(error, "Error in checkGmailIntegrations()");
    }, () => this.logger.log("Integration Configuration Checking done"));
  }

  checkOutlookIntegration() {
    this.loading = true
    this.outlookEmailService.checkConfigurationByType("outlook").subscribe(data => {
      this.loading = false;
      let response = data;
      if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
        this.outlookRibbonText = "configured";
      }
      else {
        this.outlookRibbonText = "configure";
      }
      if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
        this.outlookRedirectURL = response.data.redirectUrl;
      }
    }, error => {
      this.loading = false;
      this.outlookRibbonText = "configure";
      this.logger.error(error, "Error in checkOutlookIntegrations()");
    }, () => this.logger.log("Integration Configuration Checking done"));
  }

  ngAfterViewChecked() {
    let gmailCheck = localStorage.getItem('gmail');
    let outlookChek = localStorage.getItem('outlook');
    localStorage.removeItem('gmail');
    localStorage.removeItem('outlook');

    if (gmailCheck == 'yes' || outlookChek == 'yes') {
      this.referenceService.integrationCallBackStatus = true;
      localStorage.removeItem("userAlias");
      localStorage.removeItem("currentModule");
      this.router.navigate(['/home/dashboard/myprofile']);
    }
  }

}
