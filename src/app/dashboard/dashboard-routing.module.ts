import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { DefaultPageComponent } from "./default-page/default-page.component";
import { MyProfileComponent } from "./user-profile/my-profile/my-profile.component";
import { ViewsReportComponent } from "./views-report/views-report.component";
import { TableAdvanceComponent } from "./table-advance/table-advance.component";
import { ExtraFaqComponent } from "./extra-faq/extra-faq.component";
import { ProfileHelpComponent } from "./user-profile/profile-help/profile-help.component";
import { FollowersComponent } from "./followers/followers.component";
import { SharedComponent } from "./shared/shared.component";
import { EditCompanyProfileComponent } from "./company-profile/edit-company-profile/edit-company-profile.component";
import { ReportsComponent } from "./dashboard/reports/reports.component";
import { NotificationsComponent } from "../core/notifications/notifications.component";
import { VendorReportsComponent } from "./vendor-reports/vendor-reports.component";
import { AdminReportComponent } from './admin-report/admin-report.component';
import { VendorRequestReportComponent } from './vendor-request-report/vendor-request-report.component';
import { SocialContactsCallbackComponent } from "app/contacts/social-contacts-callback/social-contacts-callback.component";
import { SamlsecurityComponent } from "./samlsecurity/samlsecurity.component";
import { DashboardAnalyticsComponent } from './dashboard-analytics/dashboard-analytics.component';

const routes: Routes = [
 { path: "", component: DashboardAnalyticsComponent },
  { path: "old", component: DashboardComponent },
  { path: "vanity/:vendorCompanyProfileName", component: DashboardAnalyticsComponent },
  { path: "table_advance", component: TableAdvanceComponent },
  { path: "myprofile", component: MyProfileComponent },
  { path: "views_report", component: ViewsReportComponent },
  { path: "extrafaq", component: ExtraFaqComponent },
  { path: "welcome", component: WelcomeComponent },
  { path: "default", component: DefaultPageComponent },
  { path: "profilehelp", component: ProfileHelpComponent },
  { path: "followers", component: FollowersComponent },
  { path: "shared", component: SharedComponent },
  { path: "add-company-profile", component: EditCompanyProfileComponent },
  { path: "edit-company-profile", component: EditCompanyProfileComponent },
  { path: "admin-company-profile/:alias", component: EditCompanyProfileComponent },
  { path: "admin-company-profile", component: EditCompanyProfileComponent },
  { path: "reports", component: ReportsComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: 'vendors',component:VendorReportsComponent},
  { path: 'admin-report',component:AdminReportComponent},
  { path: 'vendor-request',component:VendorRequestReportComponent},
  { path: 'hubspot-callback',component:SocialContactsCallbackComponent},
  { path: 'isalesforce-callback',component:SocialContactsCallbackComponent},
  {path:'sso-samlsecurity',component:SamlsecurityComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DasboardRoutingModule {}
