import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ViewsReportComponent } from './views-report/views-report.component';
import { TableAdvanceComponent } from './table-advance/table-advance.component';
import { ExtraFaqComponent } from './extra-faq/extra-faq.component';

import { DasboardRoutingModule } from './dashboard-routing.module';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { CommonComponentModule } from '../common/common.module';

import { DashboardService } from './dashboard.service';
import { ProfileLockComponent } from './user-profile/profile-lock/profile-lock.component';
import { ProfileHelpComponent } from './user-profile/profile-help/profile-help.component';
import { MyProfileComponent } from './user-profile/my-profile/my-profile.component';
import { DefaultPageComponent } from './default-page/default-page.component';
import { FollowersComponent } from './followers/followers.component';
import { SharedComponent } from './shared/shared.component';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { EditCompanyProfileComponent } from './company-profile/edit-company-profile/edit-company-profile.component';
import { CompanyProfileService } from './company-profile/services/company-profile.service';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { CompanyPageComponent } from './company-profile/company-page/company-page.component';
import { PartnerNotificationComponent } from './partner-notification/partner-notification.component';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { DashboardStatsComponent } from './dashboard-stats/dashboard-stats.component';
import { VendorReportsComponent } from './vendor-reports/vendor-reports.component';
import { AdminReportComponent } from './admin-report/admin-report.component';
import { DealRegistrationService } from '../deal-registration/services/deal-registration.service';
import { MarketoAuthenticationComponent } from './marketo-authentication/marketo-authentication.component';
import { CKEditorModule } from "ng2-ckeditor";
import { VendorRequestReportComponent } from './vendor-request-report/vendor-request-report.component'
import { SharedContactsModule } from 'app/shared/shared-contacts.module';
import { DemoRequestComponent } from './demo-request/demo-request.component';
import { DynamicEmailContentComponent } from './dynamic-email-content/dynamic-email-content.component';
import { SamlsecurityComponent } from './samlsecurity/samlsecurity.component';
import { ListAllUsersComponent } from './list-all-users/list-all-users.component';
import { DashboardAnalyticsComponent } from './dashboard-analytics/dashboard-analytics.component';
import { ModuleAnalyticsComponent } from './dashboard-analytics-components/module-analytics/module-analytics.component';
import { VendorActivityAnalyticsComponent } from './dashboard-analytics-components/vendor-activity-analytics/vendor-activity-analytics.component';
import { CampaignStatisticsAnalyticsComponent } from './dashboard-analytics-components/campaign-statistics-analytics/campaign-statistics-analytics.component';
import { RegionalStatisticsAnalyticsComponent } from './dashboard-analytics-components/regional-statistics-analytics/regional-statistics-analytics.component';
import { VideoStatisticsAnalyticsComponent } from './dashboard-analytics-components/video-statistics-analytics/video-statistics-analytics.component';
import { EmailStatsAnalyticsComponent } from './dashboard-analytics-components/email-stats-analytics/email-stats-analytics.component';
import { SocialAccountsAnalyticsComponent } from './dashboard-analytics-components/social-accounts-analytics/social-accounts-analytics.component';
import { DashboardButtonsComponent } from './dashboard-buttons/dashboard-buttons.component';
import { DashboardButtonsCarouselComponent } from './dashboard-buttons-carousel/dashboard-buttons-carousel.component';
import { VanityEmailTemplatesComponent } from 'app/email-template/vanity-email-templates/vanity-email-templates.component';
import { ModuleAccessComponent } from './module-access/module-access.component';
import { TagsComponent } from './tags/tags.component';
import { PartnersStatisticsComponent } from './dashboard-analytics-components/partners-statistics/partners-statistics.component';
import { PartnerContactsStatisticsComponent } from './dashboard-analytics-components/partner-contacts-statistics/partner-contacts-statistics.component';
import { MdfStatisticsComponent } from './dashboard-analytics-components/mdf-statistics/mdf-statistics.component';
import { AdvancedDashboardAnalyticsComponent } from './advanced-dashboard-analytics/advanced-dashboard-analytics.component';
import { LeadsStatisticsComponent } from './dashboard-analytics-components/leads-statistics/leads-statistics.component';
import { DealsStatisticsComponent } from './dashboard-analytics-components/deals-statistics/deals-statistics.component';
import { RedistributedCampaignsWordcloudMapComponent } from './dashboard-analytics-components/redistributed-campaigns-wordcloud-map/redistributed-campaigns-wordcloud-map.component';
import { LeadsAndDealsBubbleChartComponent } from './dashboard-analytics-components/leads-and-deals-bubble-chart/leads-and-deals-bubble-chart.component';
import { DetailedDashboardComponent } from './detailed-dashboard/detailed-dashboard.component';
import { SpfComponent } from './spf/spf.component';

@NgModule({
    imports: [DasboardRoutingModule, CKEditorModule, SharedModule, CoreModule, CommonModule, DragulaModule, CommonComponentModule, InternationalPhoneModule, SharedContactsModule],
    declarations: [DashboardComponent, TableAdvanceComponent, ViewsReportComponent, ExtraFaqComponent,
        WelcomeComponent, MyProfileComponent, ProfileLockComponent, ProfileHelpComponent, DefaultPageComponent,
        FollowersComponent, SharedComponent,EditCompanyProfileComponent, ReportsComponent, CompanyPageComponent, PartnerNotificationComponent, DashboardStatsComponent, 
        VendorReportsComponent, AdminReportComponent,
        MarketoAuthenticationComponent,
        VendorRequestReportComponent,
        DemoRequestComponent,
        DynamicEmailContentComponent,
        SamlsecurityComponent,
        ListAllUsersComponent,
        DashboardAnalyticsComponent,
        ModuleAnalyticsComponent,
        VendorActivityAnalyticsComponent,
        CampaignStatisticsAnalyticsComponent,
        RegionalStatisticsAnalyticsComponent,
        VideoStatisticsAnalyticsComponent,
        EmailStatsAnalyticsComponent,
        SocialAccountsAnalyticsComponent,
        DashboardButtonsComponent,        
        DashboardButtonsCarouselComponent, 
        VanityEmailTemplatesComponent,
        ModuleAccessComponent,
        TagsComponent,
        PartnersStatisticsComponent,
        PartnerContactsStatisticsComponent,
        MdfStatisticsComponent,
        AdvancedDashboardAnalyticsComponent,
        LeadsStatisticsComponent,
        DealsStatisticsComponent,
        RedistributedCampaignsWordcloudMapComponent,
        LeadsAndDealsBubbleChartComponent,
        DetailedDashboardComponent,
        SpfComponent

    ],
    exports: [InternationalPhoneModule,MarketoAuthenticationComponent],
    providers: [DashboardService,CompanyProfileService,DealRegistrationService]
})
export class DashboardModule { }
