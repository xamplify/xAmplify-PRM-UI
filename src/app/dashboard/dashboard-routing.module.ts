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
import { VanityEmailTemplatesComponent } from "app/email-template/vanity-email-templates/vanity-email-templates.component";
import { ModuleAccessComponent } from "./module-access/module-access.component";
import { DetailedDashboardComponent } from './detailed-dashboard/detailed-dashboard.component';
import { SpfComponent } from './spf/spf.component';
import { AdminReportCampaignWorkflowAnalyticsComponent } from './admin-report-campaign-workflow-analytics/admin-report-campaign-workflow-analytics.component';
import { EditModuleNameComponent } from './edit-module-name/edit-module-name.component';
import { CustomSkinComponent } from "./user-profile/custom-skin/custom-skin.component";
import { QuickLinksComponent } from "./quick-links/quick-links.component";
import { RouterUrlConstants } from "app/constants/router-url.contstants";


const routes: Routes = [
 { path: "", component: DashboardAnalyticsComponent },
  { path: "old", component: DashboardComponent },
  { path: "vanity/:vendorCompanyProfileName", component: DashboardAnalyticsComponent },
  { path: "table_advance", component: TableAdvanceComponent },
  { path: "myprofile", component: MyProfileComponent },
  { path: "myprofile/:selectedMenuOption", component: MyProfileComponent },
  { path: "customskin", component: CustomSkinComponent },
  { path: "views_report", component: ViewsReportComponent },
  { path: "extrafaq", component: ExtraFaqComponent },
  { path: "welcome", component: WelcomeComponent },
  { path: "detailed", component: DetailedDashboardComponent },
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
  {path:'sso-samlsecurity',component:SamlsecurityComponent},
  {path:'v-templates', component:VanityEmailTemplatesComponent},
  {path:'module-access/:alias/:userAlias/:companyProfileName', component:ModuleAccessComponent},
  {path:'dashboard-stats/:userId/:companyId/:userAlias', component:ModuleAccessComponent},
  {path:'dashboard-stats/:userId/:companyId', component:ModuleAccessComponent},
  {path:'spf', component:SpfComponent},
  {path:'workflow-analytics',component:AdminReportCampaignWorkflowAnalyticsComponent},
  {path:'edit-module-names/:companyId',component:EditModuleNameComponent},
  { path: 'microsoft-callback',component:SocialContactsCallbackComponent},
  {path:RouterUrlConstants.quickLinks,component:QuickLinksComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DasboardRoutingModule {}
