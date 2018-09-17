import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DashboardReport } from "../../core/models/dashboard-report";

import { DashboardService } from "../dashboard.service";
import { AuthenticationService } from "../../core/services/authentication.service";

@Component({
  selector: "app-dashboard-stats",
  templateUrl: "./dashboard-stats.component.html",
  styleUrls: ["./dashboard-stats.component.css"]
})
export class DashboardStatsComponent implements OnInit {
  dashboardReport: DashboardReport = new DashboardReport();
  isAdmin: boolean;
  constructor(
    public router: Router,
    public dashboardService: DashboardService,
    public authenticationService: AuthenticationService
  ) {}

  dashboardReportsCount() {
    let userId = this.authenticationService.user.id;
    userId = this.authenticationService.checkLoggedInUserId(userId);
    if (userId === 1) {
      this.isAdmin = true;
    }
    this.dashboardService.loadDashboardReportsCount(userId).subscribe(
      data => {
        this.dashboardReport.totalViews = data.totalVideoViewsCount;
        this.dashboardReport.totalContacts = data.totalcontactsCount;
        this.dashboardReport.totalTeamMembers = data.totalTeamMembersCount;
        this.dashboardReport.totalUploadedvideos = data.totalVideosCount;
        this.dashboardReport.toalEmailTemplates = data.totalEmailTemplatesCount;
        this.dashboardReport.totalCreatedCampaigns = data.totalCampaignsCount;
        this.dashboardReport.totalSocialAccounts = data.totalSocialConnectionsCount;
        this.dashboardReport.totalCompanyPartnersCount = data.totalCompanyPartnersCount;
        this.dashboardReport.vendorsCount = data.vendorsCount;
      },
      error => console.log(error),
      () => console.log("dashboard reports counts completed")
    );
  }

  navigateToManageContacts() {
    if (this.authenticationService.isVendor() || this.authenticationService.isSuperAdmin()) {
      this.router.navigate(["/home/team/add-team"]);
    } else if (this.authenticationService.isAddedByVendor && !this.authenticationService.isSuperAdmin()) {
      // this.router.navigate(['/home/partners/manage']);
      this.router.navigate(["/home/team/add-team"]);
    } else if (!this.authenticationService.isVendor() && !this.authenticationService.isSuperAdmin()) {
      this.router.navigate(["/home/contacts/manage"]);
    }
  }

  navigateToPartner() {
    if ( !this.authenticationService.isOnlyPartner() && this.dashboardReport.totalCompanyPartnersCount > 0) {
      this.router.navigate(["/home/partners/analytics"]);
    } else if (this.authenticationService.isOnlyPartner() && this.dashboardReport.vendorsCount > 0)
    { console.log("go to vendors page");
      this.router.navigate(["/home/dashboard/vendors"]); // un comment for vendor page
    } else {
      console.log("go to prtner page");
      // this.router.navigate(["/home/partners/analytics"]);
    }
  }

  ngOnInit() {
    this.dashboardReportsCount();
  }
}
