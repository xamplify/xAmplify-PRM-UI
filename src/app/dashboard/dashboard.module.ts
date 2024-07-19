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
import { AdminPartnerCompaniesComponent } from './admin-partner-companies/admin-partner-companies.component';
import { RecentLoggedInUsersComponent } from './recent-logged-in-users/recent-logged-in-users.component';
import { AdminReportCampaignWorkflowAnalyticsComponent } from './admin-report-campaign-workflow-analytics/admin-report-campaign-workflow-analytics.component';
import { UnsubscribeReasonsComponent } from './unsubscribe-reasons/unsubscribe-reasons.component';
import { CustomizeTop4Component } from './dashboard-analytics-components/customize-top-4/customize-top-4.component';
import { VendorInvitationReportComponent } from './vendor-invitation-report/vendor-invitation-report.component';
import { ManageTeamMemberGroupComponent } from './manage-team-member-group/manage-team-member-group.component';
import { NotifyPartnersComponent } from './notify-partners/notify-partners.component';
import { ShowPrmContentComponent } from './dashboard-analytics-components/show-prm-content/show-prm-content.component';
import { EditModuleNameComponent } from './edit-module-name/edit-module-name.component';
import { FunnelChartAnalyticsComponent } from './dashboard-analytics-components/funnel-chart-analytics/funnel-chart-analytics.component';
import { PieChartAnalyticsComponent } from './dashboard-analytics-components/pie-chart-analytics/pie-chart-analytics.component';
import { PieChartStatisticsBarGraphComponent } from './dashboard-analytics-components/pie-chart-statistics-bar-graph/pie-chart-statistics-bar-graph.component';
import { MarketingRoleRequestsComponent } from './marketing-role-requests/marketing-role-requests.component';
import { HorizontalBatChartComponent } from './dashboard-analytics-components/horizontal-bat-chart/horizontal-bat-chart.component';
import { HighlevelAnalyticsDetailReportsComponent } from './dashboard-analytics-components/highlevel-analytics-detail-reports/highlevel-analytics-detail-reports.component';
import { AgencyDashboardComponent } from './agency-dashboard/agency-dashboard.component';
import { CustomSkinComponent } from './user-profile/custom-skin/custom-skin.component';
import { IntegrationSettingsComponent } from './integration-settings/integration-settings.component';
import { ProcessingCampaignsComponent } from './processing-campaigns/processing-campaigns.component';
import { ActiveQueriesComponent } from './active-queries/active-queries.component';
import { PipedriveAuthenticationComponent } from './pipedrive-authentication/pipedrive-authentication/pipedrive-authentication.component';
import { EnableSupportAccessToVendorComponent } from './enable-support-access-to-vendor/enable-support-access-to-vendor.component';
import { LeftsidenavbarCustomComponent } from './leftsidenavbar-custom/leftsidenavbar-custom.component';
import { EmailNotificationSettingsComponent } from './email-notification-settings/email-notification-settings.component';
import { ActiveThreadsInfoComponent } from './active-threads-info/active-threads-info.component';
import { CustomLoginScreenSettingsComponent } from './custom-login-screen-settings/custom-login-screen-settings.component';
import { ConnectwiseAuthenticationComponent } from './connectwise-authentication/connectwise-authentication.component';

import { AddOrManageDomainsComponent } from './add-or-manage-domains/add-or-manage-domains.component';
import { CustomLinksUtilComponent } from './custom-links-util/custom-links-util.component';
import { NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent } from './news-and-announcement-and-instant-navigation-dashboard-analytics/news-and-announcement-and-instant-navigation-dashboard-analytics.component';
import { DashboardBannerImagesComponent } from './dashboard-banner-images/dashboard-banner-images.component';

import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
import { VendorJourneyComponent } from './vendor-journey/vendor-journey.component';
import { HalopsaAuthenticationComponent } from './halopsa-authentication/halopsa-authentication.component';
import { VendorReportComponent } from './vendor-report/vendor-report.component';
import { ProcessingUserListsComponent } from './processing-user-lists/processing-user-lists.component';
import { UpdatePasswordComponent } from './super-admin/update-password/update-password.component';
import { AddVendorLogosComponent } from 'app/util/add-vendor-logos/add-vendor-logos.component';
import { SupportAccountUsersComponent } from './support-account-users/support-account-users.component';
import { IntegrationSettingsPopupComponent } from './integration-settings-popup/integration-settings-popup.component';
import { QuickLinksComponent } from './quick-links/quick-links.component';
import { UpdateEmailAddressComponent } from './update-email-address/update-email-address.component';
import { IntegrationDetailsComponent } from './integration-details/integration-details.component';
import { CustomFieldsOrderPopupComponent } from './custom-fields-order-popup/custom-fields-order-popup.component';
import { SuperAdminServiceService } from './super-admin-service.service';
import { CampaignAnalyticsSettingsComponent } from './campaign-analytics-settings/campaign-analytics-settings.component';
import { MyProfileService } from './my-profile.service';
import { CrmFormSettingsComponent } from './crm-form-settings/crm-form-settings.component';

@NgModule({
    imports: [DasboardRoutingModule, CKEditorModule, SharedModule, CoreModule, CommonModule, DragulaModule, CommonComponentModule, InternationalPhoneModule, SharedContactsModule ],
    declarations: [DashboardComponent, TableAdvanceComponent, ViewsReportComponent, ExtraFaqComponent,
        WelcomeComponent, MyProfileComponent, ProfileLockComponent, ProfileHelpComponent, DefaultPageComponent,
        FollowersComponent, SharedComponent, EditCompanyProfileComponent, ReportsComponent, CompanyPageComponent, PartnerNotificationComponent, DashboardStatsComponent,
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
        SpfComponent,
        AdminPartnerCompaniesComponent,
        RecentLoggedInUsersComponent,
        AdminReportCampaignWorkflowAnalyticsComponent,
        UnsubscribeReasonsComponent,
        CustomizeTop4Component,
        VendorInvitationReportComponent,
        ManageTeamMemberGroupComponent,
        NotifyPartnersComponent,
        ShowPrmContentComponent,
        EditModuleNameComponent,
        FunnelChartAnalyticsComponent,
        PieChartAnalyticsComponent,
        PieChartStatisticsBarGraphComponent,
        MarketingRoleRequestsComponent,
        HorizontalBatChartComponent,
        HighlevelAnalyticsDetailReportsComponent,
        AgencyDashboardComponent,
        CustomSkinComponent,
        IntegrationSettingsComponent,
        ProcessingCampaignsComponent,
        ActiveQueriesComponent,
        PipedriveAuthenticationComponent,
        EnableSupportAccessToVendorComponent,
        LeftsidenavbarCustomComponent,
        EmailNotificationSettingsComponent,
        ActiveThreadsInfoComponent,
        CustomLoginScreenSettingsComponent,
        ConnectwiseAuthenticationComponent,
        AddOrManageDomainsComponent,
        CustomLinksUtilComponent,
        NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent,
        DashboardBannerImagesComponent,
        VendorJourneyComponent,
        HalopsaAuthenticationComponent,
        VendorReportComponent,
        ProcessingUserListsComponent,
        UpdatePasswordComponent,
        AddVendorLogosComponent,
        SupportAccountUsersComponent,
        QuickLinksComponent,
        IntegrationSettingsPopupComponent,
        UpdateEmailAddressComponent,
        IntegrationDetailsComponent,
        CustomFieldsOrderPopupComponent,
        CampaignAnalyticsSettingsComponent,
        CrmFormSettingsComponent,

            

    ],
    exports: [InternationalPhoneModule, MarketoAuthenticationComponent],
    providers: [DashboardService, CompanyProfileService, DealRegistrationService, LandingPageService,
        SuperAdminServiceService,MyProfileService]
})
export class DashboardModule { }
