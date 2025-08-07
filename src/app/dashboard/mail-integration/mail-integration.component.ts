import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OutlookEmailService } from 'app/outlook-email/outlook-email.service';

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
  constructor(private outlookEmailService: OutlookEmailService, private authenticationService: AuthenticationService,private route: ActivatedRoute) { }


  ngOnInit() {
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

}
