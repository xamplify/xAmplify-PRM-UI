import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DashboardReport } from "../../core/models/dashboard-report";

import { DashboardService } from "../dashboard.service";
import { AuthenticationService } from "../../core/services/authentication.service";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";

@Component({
  selector: "app-dashboard-stats",
  templateUrl: "./dashboard-stats.component.html",
  styleUrls: ["./dashboard-stats.component.css"]
})
export class DashboardStatsComponent implements OnInit {
  dashboardReport: DashboardReport = new DashboardReport();
  isAdmin: boolean;
  constructor(public router: Router,public xtremandLogger:XtremandLogger,public dashboardService: DashboardService,
    public authenticationService: AuthenticationService) {
  }

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
      error => this.xtremandLogger.log(error),
      () => this.xtremandLogger.log("dashboard reports counts completed")
    );
  }

  navigateToManageContacts() {
    if (this.authenticationService.isVendor() || this.authenticationService.isSuperAdmin()) {
      this.router.navigate(["/home/team/add-team"]);
    } else if (this.authenticationService.isAddedByVendor && !this.authenticationService.isSuperAdmin()) {
      // this.router.navigate(['/home/partners/manage']);
      this.router.navigate(["/home/team/add-team"]);
    } else if (!this.authenticationService.isVendor() && !this.authenticationService.isSuperAdmin() && this.dashboardReport.totalContacts != 0) {
      this.router.navigate(["/home/contacts/manage"]);
    }
  }

  navigateToVendor(){
    if (this.dashboardReport.vendorsCount != 0)
    { this.router.navigate(["/home/dashboard/vendors"]);   }
  }
  navigateToPartner() {
    if ( (this.authenticationService.isOnlyPartner() || this.authenticationService.isPartnerTeamMember) && this.dashboardReport.vendorsCount != 0) {
        this.router.navigate(["/home/dashboard/vendors"]);
    } else if ( this.dashboardReport.totalCompanyPartnersCount != 0)
    { this.xtremandLogger.log("go to Partner page");
    this.router.navigate(["/home/partners/analytics"]);
    } else {
      this.xtremandLogger.log("Do Nothing..");
    }
  }

  goToSocialAccounts(){
     if(this.dashboardReport.totalSocialAccounts != 0){
       this.router.navigate(["/home/social/manage/all"]);
    }
  }

  goManageTemplates(){
      if(this.dashboardReport.toalEmailTemplates != 0){
        this.router.navigate(["/home/emailtemplates"]);
     }
   }

  goTeamMembers(){
      if(this.dashboardReport.totalTeamMembers != 0){
        this.router.navigate(["/home/team/add-team"]);
     }
   }

  goToManageCampaigns(){
      if(this.dashboardReport.totalCreatedCampaigns != 0){
        this.router.navigate(["/home/campaigns/manage"]);
     }
   }

  goToManageVideos(){
      if(this.dashboardReport.totalUploadedvideos != 0){
        this.router.navigate(["/home/content/videos"]);
     }
   }

  ngOnInit() {
    this.dashboardReportsCount();
  }
}
