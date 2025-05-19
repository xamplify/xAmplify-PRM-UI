import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
declare var AnalytifySDK: any;

@Component({
  selector: 'app-manage-insights',
  templateUrl: './manage-insights.component.html',
  styleUrls: ['./manage-insights.component.css']
})
export class ManageInsightsComponent implements OnInit {
  roleName: any;
  loggedInUserId: number;
  companyId: any;
  dashboardToken: string = '';

  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.loadCompanyAndInitDashboard();
  }

  loadCompanyAndInitDashboard() {
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        this.companyId = result;

        const module = this.authenticationService.module;
        if (module.isVendor) {
          this.dashboardToken = '2qa8IkP2f9AQ';
        } else if (module.isOrgAdminCompany) {
          this.dashboardToken = 'fOHPmL11HQi2';
        } else if (module.isPrmCompany) {
          this.dashboardToken = 'rdCEexrzuEo8';
        } else if (module.isMarketingCompany) {
          this.dashboardToken = 'OPRykC9shBT3';
        } else if (module.isPartnerCompany){
          this.dashboardToken = 'uko3omwl5hFy';
        }

        if (!this.dashboardToken || !this.companyId) {
          console.warn('Missing dashboardToken or companyId, skipping dashboard load');
          return;
        }

        this.loadDashboard();
      },
      (error) => {
        console.error('Error fetching company ID:', error);
      }
    );
  }

  loadDashboard() {
    const analytify = AnalytifySDK.init({
      appName: 'xamplify',
      clientId: 'taOv01l9sr9SPXRD70hwkJzOILnybdsIX94gLRQh',
      clientSecret: '1NEItZmB9VH7GhP39rLHo35jgmrEPgJg',
      apiBaseUrl: 'https://app.analytify.ai/',
      tokenEndpoint: 'https://api.insightapps.ai/v1'
    });

    analytify.loadDashboard({
      container: '#dashboard-container',
      dashboardToken: this.dashboardToken,
      width: '100%',
      height: '500px',
      filters: {
        "Company": [this.companyId],
      }
    });
  }
}
