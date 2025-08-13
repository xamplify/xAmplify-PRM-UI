import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { OutlookEmailService } from 'app/outlook-email/outlook-email.service';

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
  activeGamil:boolean = false;
  activeOutlook:boolean = false;
  constructor(private outlookEmailService: OutlookEmailService, private authenticationService: AuthenticationService, public logger: XtremandLogger,public referenceService: ReferenceService) { }


  ngOnInit() {
    this.getAccessToken();
  }

  getAccessToken() {
    this.loading = true;
    this.outlookEmailService.getAccessToken().subscribe(
      result => {
        this.statusCode = result.statusCode;
        if (result.data && result.data.length > 0) {
          result.data.forEach(record => {
           this.activeGamil= record.active;
            if (record.type === 'OUTLOOK') {
              this.outlookRibbonText = 'configured';
              this.activeOutlook= record.active;
            } else if (record.type === 'GMAIL') {
              this.gmailRibbonText = 'configured';
              this.activeGamil= record.active;
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
    this.loading = true;
    this.outlookEmailService.authorizeGmail().subscribe(
      result => {
        if (result.data !== undefined && result.data !== '') {
          window.location.href = result.data;
        }
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  configureOutlook() {
    this.loading = true;
    this.outlookEmailService.authorizeOutlook().subscribe(
      result => {
        if (result.data !== undefined && result.data !== '') {
          window.location.href = result.data;
        }
        this.loading = false;
      },
      () => this.loading = false
    );
  }

    reConfigMail(type: string) {
    try {
      const self = this;
      swal({
        title: type === 'GMAIL'? 'Gmail':'Outlook'+ ' Re-configuration?',
        text: 'Are you sure? All data related to existing '+type === 'GMAIL'? 'Gmail':'Outlook' +' account will be deleted by clicking Yes.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#54a7e9',
        cancelButtonColor: '#999',
        confirmButtonText: 'Yes'

      }).then(function () {
        if(type === 'GMAIL') {
          self.configureGmail();
        } else if (type === 'OUTLOOK') {
          self.configureOutlook();
        }
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
      this.loading = false;
    }
  }

}
