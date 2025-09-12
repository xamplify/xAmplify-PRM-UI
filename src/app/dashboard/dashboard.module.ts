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
import { RegionalStatisticsAnalyticsComponent } from './dashboard-analytics-components/regional-statistics-analytics/regional-statistics-analytics.component';
import { VideoStatisticsAnalyticsComponent } from './dashboard-analytics-components/video-statistics-analytics/video-statistics-analytics.component';
import { EmailStatsAnalyticsComponent } from './dashboard-analytics-components/email-stats-analytics/email-stats-analytics.component';
import { DashboardButtonsCarouselComponent } from './dashboard-buttons-carousel/dashboard-buttons-carousel.component';
import { ModuleAccessComponent } from './module-access/module-access.component';
import { TagsComponent } from './tags/tags.component';
import { PartnersStatisticsComponent } from './dashboard-analytics-components/partners-statistics/partners-statistics.component';
import { PartnerContactsStatisticsComponent } from './dashboard-analytics-components/partner-contacts-statistics/partner-contacts-statistics.component';
import { MdfStatisticsComponent } from './dashboard-analytics-components/mdf-statistics/mdf-statistics.component';
import { AdvancedDashboardAnalyticsComponent } from './advanced-dashboard-analytics/advanced-dashboard-analytics.component';
import { LeadsStatisticsComponent } from './dashboard-analytics-components/leads-statistics/leads-statistics.component';
import { DealsStatisticsComponent } from './dashboard-analytics-components/deals-statistics/deals-statistics.component';
import { LeadsAndDealsBubbleChartComponent } from './dashboard-analytics-components/leads-and-deals-bubble-chart/leads-and-deals-bubble-chart.component';
import { DetailedDashboardComponent } from './detailed-dashboard/detailed-dashboard.component';
import { SpfComponent } from './spf/spf.component';
import { AdminPartnerCompaniesComponent } from './admin-partner-companies/admin-partner-companies.component';
import { RecentLoggedInUsersComponent } from './recent-logged-in-users/recent-logged-in-users.component';
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
import { ActiveQueriesComponent } from './active-queries/active-queries.component';
import { EnableSupportAccessToVendorComponent } from './enable-support-access-to-vendor/enable-support-access-to-vendor.component';
import { LeftsidenavbarCustomComponent } from './leftsidenavbar-custom/leftsidenavbar-custom.component';
import { EmailNotificationSettingsComponent } from './email-notification-settings/email-notification-settings.component';
import { ActiveThreadsInfoComponent } from './active-threads-info/active-threads-info.component';
import { CustomLoginScreenSettingsComponent } from './custom-login-screen-settings/custom-login-screen-settings.component';

import { AddOrManageDomainsComponent } from './add-or-manage-domains/add-or-manage-domains.component';
import { CustomLinksUtilComponent } from './custom-links-util/custom-links-util.component';
import { NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent } from './news-and-announcement-and-instant-navigation-dashboard-analytics/news-and-announcement-and-instant-navigation-dashboard-analytics.component';
import { DashboardBannerImagesComponent } from './dashboard-banner-images/dashboard-banner-images.component';

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
import { SuperAdminService } from './super-admin.service';
import { MyProfileService } from './my-profile.service';
import { CrmFormSettingsComponent } from './crm-form-settings/crm-form-settings.component';
import { MarketPlaceCategoriesComponent } from './market-place-categories/market-place-categories.component';
import { ChatGptSettingsService } from './chat-gpt-settings.service';
import { FlexiFieldComponent } from './user-profile/flexi-fields/manage-flexi-fields/flexi-field.component';
import { FlexiFieldService } from './user-profile/flexi-fields/services/flexi-field.service';
import { UniversalSearchComponent } from './universal-search/universal-search.component';
import { XamplifyCustomFieldsSettingsComponent } from './xamplify-custom-fields-settings/xamplify-custom-fields-settings.component';
import { LeadCustomFieldsSettingsComponent } from './lead-custom-fields-settings/lead-custom-fields-settings.component';
import { AddCustomFieldsComponent } from './add-custom-fields/add-custom-fields.component';
import { ApprovalControlManagementSettingsComponent } from './approval-control-management-settings/approval-control-management-settings.component';
import { SignatureService } from './services/signature.service';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { CustomDashboardSettingsComponent } from './custom-dashboard-settings/custom-dashboard-settings.component';
import { AddDefaultCompaniesOrMapLogoComponent } from 'app/util/add-default-companies-or-map-logo/add-default-companies-or-map-logo.component';
import { MergePartnerCompaniesComponent } from './merge-partner-companies/merge-partner-companies.component';
import { PendingChangesGuard } from "app/component-can-deactivate";
import { CustomHtmlBlockComponent } from './custom-html-block/custom-html-block.component';
import { PartnerContactUploadManagementSettingsComponent } from './partner-contact-upload-management-settings/partner-contact-upload-management-settings.component';
import { ContactStatusDropDownComponent } from './contact-status-drop-down/contact-status-drop-down.component';

@NgModule({
    imports: [DasboardRoutingModule, CKEditorModule, SharedModule, CoreModule, CommonModule, DragulaModule, CommonComponentModule, InternationalPhoneModule, SharedContactsModule, MultiSelectAllModule ],
    declarations: [DashboardComponent, TableAdvanceComponent, ViewsReportComponent, ExtraFaqComponent,
        WelcomeComponent, MyProfileComponent, ProfileLockComponent, ProfileHelpComponent, DefaultPageComponent,
        FollowersComponent, SharedComponent, EditCompanyProfileComponent, ReportsComponent, CompanyPageComponent, PartnerNotificationComponent, DashboardStatsComponent,
        VendorReportsComponent,
        MarketoAuthenticationComponent,
        VendorRequestReportComponent,
        DemoRequestComponent,
        DynamicEmailContentComponent,
        SamlsecurityComponent,
        ListAllUsersComponent,
        DashboardAnalyticsComponent,
        ModuleAnalyticsComponent,
        VendorActivityAnalyticsComponent,
        RegionalStatisticsAnalyticsComponent,
        VideoStatisticsAnalyticsComponent,
        EmailStatsAnalyticsComponent,
        DashboardButtonsCarouselComponent,
        ModuleAccessComponent,
        TagsComponent,
        PartnersStatisticsComponent,
        PartnerContactsStatisticsComponent,
        MdfStatisticsComponent,
        AdvancedDashboardAnalyticsComponent,
        LeadsStatisticsComponent,
        DealsStatisticsComponent,
        LeadsAndDealsBubbleChartComponent,
        DetailedDashboardComponent,
        SpfComponent,
        AdminPartnerCompaniesComponent,
        RecentLoggedInUsersComponent,
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
        ActiveQueriesComponent,
        EnableSupportAccessToVendorComponent,
        LeftsidenavbarCustomComponent,
        EmailNotificationSettingsComponent,
        ActiveThreadsInfoComponent,
        CustomLoginScreenSettingsComponent,
        AddOrManageDomainsComponent,
        CustomLinksUtilComponent,
        NewsAndAnnouncementAndInstantNavigationDashboardAnalyticsComponent,
        DashboardBannerImagesComponent,
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
        CrmFormSettingsComponent,
        MarketPlaceCategoriesComponent,
        FlexiFieldComponent,
        UniversalSearchComponent,
        XamplifyCustomFieldsSettingsComponent,
        LeadCustomFieldsSettingsComponent,
        AddCustomFieldsComponent,
        ApprovalControlManagementSettingsComponent,
        CustomDashboardSettingsComponent,
        AddDefaultCompaniesOrMapLogoComponent,
        MergePartnerCompaniesComponent,
        CustomHtmlBlockComponent,
        PartnerContactUploadManagementSettingsComponent,
        ContactStatusDropDownComponent,
    ],
    exports: [InternationalPhoneModule, MarketoAuthenticationComponent],
    providers: [DashboardService, CompanyProfileService, DealRegistrationService,
        SuperAdminService,MyProfileService,ChatGptSettingsService,FlexiFieldService,SignatureService,PendingChangesGuard]
})
export class DashboardModule { }
