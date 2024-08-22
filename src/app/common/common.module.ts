import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { PaginationComponent } from './pagination/pagination.component';
import { WorldmapComponent } from './worldmap/worldmap.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { EmbedModalComponent } from './embed-modal/embed-modal.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { LocationComponent } from './location/location.component';
import { PlatformComponent } from './platform/platform.component';
import { ResponseMessageComponent } from './response-message/response-message.component';
import { PreviewVideoComponent } from './preview-video/preview-video.component';
import { ContactsCampaignsMailsComponent } from './contacts-campaigns-mails/contacts-campaigns-mails.component';
import { PieChartComponent } from '../util/pie-chart/pie-chart.component';
import { ListLoaderComponent } from './loader/list-loader/list-loader.component';
import { PlayVideoLoaderComponent } from './loader/play-video-loader/play-video-loader.component';
import { GridLoaderComponent } from './loader/grid-loader/grid-loader.component';
import { ExportCsvComponent } from './export/export-csv/export-csv.component';
import { LoadingModule } from 'ngx-loading';
import { AnalyticsLoaderComponent } from './loader/analytics-loader/analytics-loader.component';
import { VideoThumbnailComponent } from './video-thumbnail/video-thumbnail.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { TimestampComponent } from './timestamp/timestamp.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { SaveAsComponent } from './save-as/save-as.component';
import { TimestampNewComponent } from './timestamp-new/timestamp.component';
import { EventSendReminderComponent } from './event-send-reminder/event-send-reminder.component';
import { VideoPlayComponent } from './video-play/video-play.component';
import { ImageCropperComponent } from './image-cropper/component/image-cropper.component';
import { EmailSpamCheckComponent } from '../email-template/email-spam-check/email-spam-check.component';
import { AutoResponseLoaderComponent } from './loader/auto-response-loader/auto-response-loader.component';
import { PreviewPopupComponent } from '../forms/preview-popup/preview-popup.component';
import { PreviewLandingPageComponent } from '../landing-pages/preview-landing-page/preview-landing-page.component';
import { FormPreviewComponent } from '../forms/preview/form-preview.component';
import { LandingPageLoaderComponent } from '../landing-page-loader/landing-page-loader.component';
import { DashboardLoaderComponent } from './loader/dashboard-loader/dashboard-loader.component';
import { ModalPopupLoaderComponent } from './loader/modal-popup-loader/modal-popup-loader.component';
import { FormAnalyticsUtilComponent } from '../util/form-analytics-util/form-analytics-util.component';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxModule, ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { PublicPageResponseComponent } from './public-page-response/public-page-response.component';
import { MergeTagsComponent } from '../util/merge-tags/merge-tags.component';
import { FlatpickrComponent } from './flatpickr/flatpickr.component';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { SaveGeoLocationAnalyticsComponent } from '../util/save-geo-location-analytics/save-geo-location-analytics.component';
import { SendCampaignsComponent } from './send-campaigns/send-campaigns.component';
import { CategoryFolderViewUtilComponent } from '../util/category-folder-view-util/category-folder-view-util.component';
import { AddFolderModalPopupComponent } from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';
import { CreateBeeTemplateComponent } from 'app/util/create-bee-template/create-bee-template.component';
import { FormsListViewUtilComponent } from 'app/util/forms-list-view-util/forms-list-view-util.component';
import { CampaignsListViewUtilComponent } from 'app/util/campaigns-list-view-util/campaigns-list-view-util.component';
import { PreviewCampaignComponent } from "app/campaigns/preview-campaign/preview-campaign.component";
import { SocialStatusComponent } from '../social/common/social-status/social-status.component';
import { AddMoreReceiversComponent } from 'app/campaigns/add-more-receivers/add-more-receivers.component';
import { PublicEventEmailPopupComponent } from 'app/campaigns/public-event-email-popup/public-event-email-popup.component';
import { TagInputModule } from 'ngx-chips'
import { LoaderComponent } from '../loader/loader.component';
import { RedistributeCampaignsListViewUtilComponent } from 'app/util/redistribute-campaigns-list-view-util/redistribute-campaigns-list-view-util.component';
import { XamplifyDefaultTemplatesComponent } from 'app/util/xamplify-default-templates/xamplify-default-templates.component';
import { EmailTemplatePreviewUtilComponent } from 'app/util/email-template-preview-util/email-template-preview-util.component';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';
import { DragulaModule } from 'ng2-dragula';
import { ColorPickerModule } from 'ngx-color-picker';
import { CKEditorModule } from 'ng2-ckeditor';
import { AddFormUtilComponent } from 'app/util/add-form-util/add-form-util.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { AddLeadComponent } from '../leads/add-lead/add-lead.component';
import { BeeTemplateUtilComponent } from 'app/util/bee-template-util/bee-template-util.component';
import { CampaignTemplateDownloadHistoryComponent } from 'app/campaigns/campaign-template-download-history/campaign-template-download-history.component';
import { ShareLeadsComponent } from './share-leads/share-leads.component';
import { ImageLoaderComponent } from './image-loader/image-loader.component';
import { AddTagsUtilComponent } from 'app/util/add-tags-util/add-tags-util.component';
import { CampaignsLaunchedByPartnersComponent } from 'app/util/campaigns-launched-by-partners/campaigns-launched-by-partners.component';
import { SpfDescriptionComponent } from 'app/util/spf-description/spf-description.component';
import { PreviewUserListComponent } from 'app/util/preview-user-list/preview-user-list.component';
import { AddTracksPlayBookComponent } from 'app/tracks-play-book-util/add-tracks-play-book/add-tracks-play-book.component'
import { ManageTracksPlayBookComponent } from 'app/tracks-play-book-util/manage-tracks-play-book/manage-tracks-play-book.component'
import { PreviewTracksPlayBookComponent } from 'app/tracks-play-book-util/preview-tracks-play-book/preview-tracks-play-book.component'
import { TracksPlayBookAnalyticsComponent } from 'app/tracks-play-book-util/tracks-play-book-analytics/tracks-play-book-analytics.component';
import { TracksPlayBookPartnerAnalyticsComponent } from 'app/tracks-play-book-util/tracks-play-book-partner-analytics/tracks-play-book-partner-analytics.component';
import { TracksPlayBookPartnerCompanyAndListsComponent } from 'app/tracks-play-book-util/tracks-play-book-partner-company-and-lists/tracks-play-book-partner-company-and-lists.component';
import { AddDefaultTemplateDetailsComponent } from 'app/util/add-default-template-details/add-default-template-details.component';
import { UserlistUsersComponent } from 'app/contacts/userlist-users/userlist-users.component';
import { PartnerCompanyModalPopupComponent } from './partner-company-modal-popup/partner-company-modal-popup.component';
import { FormPreviewWithSubmittedAnswersComponent } from 'app/tracks-play-book-util/form-preview-with-submitted-answers/form-preview-with-submitted-answers.component';
import { TeamMembersUtilComponent } from 'app/util/team-members-util/team-members-util.component';
import { ConfirmSweetAlertUtilComponent } from 'app/util/confirm-sweet-alert-util/confirm-sweet-alert-util.component';
import { ChartPieComponent } from 'app/util/charts/chart-pie/chart-pie.component';
import { ChartVariablePieComponent } from 'app/util/charts/chart-variable-pie/chart-variable-pie.component';
import { SelectDropdownComponent } from 'app/util/select-dropdown/select-dropdown.component';
import { PreviewAssetPopupComponent } from 'app/util/dam/preview-asset-popup/preview-asset-popup.component';
import { AssetGridViewActionsComponent } from 'app/util/dam/asset-grid-view-actions/asset-grid-view-actions.component';
import { DownloadAssetPopupComponent } from 'app/util/dam/download-asset-popup/download-asset-popup.component';
import { DeleteAssetsComponent } from 'app/util/dam/delete-assets/delete-assets.component';
import { TeamMemberGroupPreviewPopupComponent } from 'app/util/team-member-group-preview-popup/team-member-group-preview-popup.component';
import { PartnerTeamMemberGroupTeamMembersComponent } from 'app/util/partner-team-member-group-team-members/partner-team-member-group-team-members.component';
import { TeamMemberFilterOptionComponent } from 'app/util/team-member-filter-option/team-member-filter-option.component';
import { TeamMemberFilterOptionModalPopupComponent } from 'app/util/team-member-filter-option-modal-popup/team-member-filter-option-modal-popup.component';
import { ManageCampaignLeadsComponent } from 'app/leads/manage-campaign-leads/manage-campaign-leads.component';
import { ManageCampaignDealsComponent } from 'app/deals/manage-campaign-deals/manage-campaign-deals.component';
import { TeamMemberPartnersComponent } from 'app/util/team-member-partners/team-member-partners.component';
import { MicrosoftAuthenticationPopupComponent } from 'app/contacts/microsoft-authentication-popup/microsoft-authentication-popup.component';
import { MicrosoftAuthenticationComponent } from 'app/dashboard/microsoft-authentication/microsoft-authentication.component';
import { FormTeamMemberGroupComponent } from 'app/util/form-team-member-group/form-team-member-group.component';
import { DisplayDateAndTimeComponent } from './display-date-and-time/display-date-and-time.component';
import { EditCampaignDetailsModalPopupComponent } from 'app/util/edit-campaign-details-modal-popup/edit-campaign-details-modal-popup.component';
import { OneClickLaunchPartnerPreviewComponent } from 'app/util/one-click-launch-partner-preview/one-click-launch-partner-preview.component';
import { CommentsComponent } from 'app/util/comments/comments.component';
import { FolderTypeViewUtilComponent } from 'app/util/folder-type-view-util/folder-type-view-util.component';
import { DamListAndGridViewComponent } from 'app/util/dam/dam-list-and-grid-view/dam-list-and-grid-view.component';
import { CountStatisticsComponent } from 'app/util/count-statistics/count-statistics.component';
import { ImgCropprV2Component } from './image-cropper-v2/img-croppr-v2/img-croppr-v2.component';
import { LoginAsPartnerComponent } from 'app/util/login-as-partner/login-as-partner.component';
import { PipedriveAuthenticationPopupComponent } from 'app/contacts/pipedrive-authentication-popup/pipedrive-authentication-popup.component';
/*********XNFR-255******/
import { PartnerCompanyAndGroupsComponent } from 'app/util/partner-company-and-groups/partner-company-and-groups.component';
import { CopyGroupUsersModalPopupComponent } from 'app/util/copy-group-users-modal-popup/copy-group-users-modal-popup.component';
import { UserGuideHelpButtonComponent } from './user-guide-help-button/user-guide-help-button.component';
import { GuideLeftMenuComponent } from 'app/guides/guide-left-menu/guide-left-menu.component';
import { SearchGuidesComponent } from 'app/guides/search-guides/search-guides.component';
import { GuideHelpIconComponent } from 'app/guides/guide-help-icon/guide-help-icon.component';
import { XamplifyVideoPlayerComponent } from 'app/util/xamplify-video-player/xamplify-video-player.component';
import { DonutPieChartComponent } from 'app/dashboard/dashboard-analytics-components/donut-pie-chart/donut-pie-chart.component';
import { QueryBuilderModule } from "angular2-query-builder";
import { SelectEmailTemplateComponent } from 'app/util/select-email-template/select-email-template.component';
import { SendTestEmailComponent } from 'app/util/send-test-email/send-test-email.component';
import { AddMultipleEmailsInputComponent } from 'app/util/add-multiple-emails-input/add-multiple-emails-input.component';
import { CampaignListAndGridViewComponent } from 'app/util/campaign-list-and-grid-view/campaign-list-and-grid-view.component';
import { HomeGuideComponent } from 'app/guides/home-guide/home-guide.component';
import { EmailTemplatesListAndGridViewComponent } from 'app/util/email-templates/email-templates-list-and-grid-view/email-templates-list-and-grid-view.component';
import { CustomUiSwitchComponent } from 'app/util/custom-ui-switch/custom-ui-switch.component';
import { EditTemplateOrPageModalPopupComponent } from 'app/util/edit-template-or-page-modal-popup/edit-template-or-page-modal-popup.component';
import { ImageUploadCropperComponent } from './image-upload-cropper/image-upload-cropper.component';
import { ShareCampaignsComponent } from './share-campaigns/share-campaigns.component';
import { ShareAssetsComponent } from './share-assets/share-assets.component';
import { SharePlaybooksComponent } from './share-playbooks/share-playbooks.component';
import { ShareUnpublishedContentComponent } from './share-unpublished-content/share-unpublished-content.component';
import { ShareTracksOrPlaybooksComponent } from './share-tracks-or-playbooks/share-tracks-or-playbooks.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { SearchableDropdownComponent } from 'app/util/searchable-dropdown/searchable-dropdown.component';
import { ConnectwiseAuthenticationPopupComponent } from 'app/contacts/connectwise-authentication-popup/connectwise-authentication-popup.component';
import { ScrollToModule } from 'ng2-scroll-to-el';
import { ConfirmUnpublishTracksOrPlaybooksModelPopupComponent } from 'app/util/confirm-unpublish-tracks-or-playbooks-model-popup/confirm-unpublish-tracks-or-playbooks-model-popup.component';
import { CustomUiFilterComponent } from 'app/util/custom-ui-filter/custom-ui-filter.component';
import { TrimPipe } from 'app/core/custom-pipes/trim.pipe';
import { DealChatPopupComponent } from 'app/deals/deal-chat-popup/deal-chat-popup.component';
import { ChatComponent } from 'app/util/chat/chat.component';
import { OpportunitiesChatModalPopupComponent } from 'app/util/opportunities-chat-modal-popup/opportunities-chat-modal-popup.component';
import { CopyModalPopupComponent } from 'app/util/copy-modal-popup/copy-modal-popup.component';
import { AddCompanyComponent } from 'app/company/add-company/add-company.component';
import { LandingPagesListAndGridViewComponent } from 'app/util/landing-pages-list-and-grid-view/landing-pages-list-and-grid-view.component';
import { BrowseContentComponent } from 'app/util/browse-content/browse-content.component';
import { SelectLeadComponent } from 'app/deals/select-lead/select-lead.component';
import { UploadImageUtilComponent } from 'app/util/upload-image-util/upload-image-util.component';
import { PreviewEmailTemplateComponent } from 'app/util/preview-email-template/preview-email-template.component';
import { PreviewPageComponent } from 'app/util/preview-page/preview-page.component';
import { PartnerJourneyCountTilesComponent } from 'app/util/partner-journey-count-tiles/partner-journey-count-tiles.component';
import { BoxLoaderComponent } from '../box-loader/box-loader.component';
import { InteractedNotInteractedTrackDetailsComponent } from 'app/util/interacted-not-interacted-track-details/interacted-not-interacted-track-details.component';
import { TypewiseTrackContentDetailsComponent } from '../util/typewise-track-content-details/typewise-track-content-details.component';
import { UserwiseTrackCountsComponent } from '../util/userwise-track-counts/userwise-track-counts.component';
import { UserwiseTrackDetailsComponent } from '../util/userwise-track-details/userwise-track-details.component';
import { TrackAssetDetailsComponent } from '../util/track-asset-details/track-asset-details.component';
import { ShareLeadDetailsComponent } from '../util/share-lead-details/share-lead-details.component';
import { RedistributedCampaignDetailsComponent } from '../util/redistributed-campaign-details/redistributed-campaign-details.component';
import { PartnerJourneyLeadDetailsComponent } from '../util/partner-journey-lead-details/partner-journey-lead-details.component';
import { PartnerJourneyDealDetailsComponent } from '../util/partner-journey-deal-details/partner-journey-deal-details.component';
import { MdfDetailAnalyticsComponent } from 'app/util/mdf-detail-analytics/mdf-detail-analytics.component';
import { RedistributedCampaignsAndLeadsBarChartComponent } from '../util/redistributed-campaigns-and-leads-bar-chart/redistributed-campaigns-and-leads-bar-chart.component';
import { TeamMemberAnalyticsContactDetailsComponent } from 'app/util/team-member-analytics-contact-details/team-member-analytics-contact-details.component';
import { TeamMemberAnalyticsAllPartnersDetailsComponent } from 'app/util/team-member-analytics-all-partners-details/team-member-analytics-all-partners-details.component';
import { TeamMemberwiseAssetAnalyticsComponent } from 'app/util/team-member-asset-analytics/team-member-asset-analytics';
import { TeamMemberwiseAssetsDetailedReportComponent } from 'app/util/team-memberwise-assets-detailed-report/team-memberwise-assets-detailed-report.component';
import { TeamMemberAnalyticsCompanyDetailsComponent } from 'app/util/team-member-analytics-company-details/team-member-analytics-company-details.component';
import { PreviewAssetPdfComponent } from './preview-asset-pdf/preview-asset-pdf.component';
import { FilePreviewComponent } from 'app/util/file-preview/file-preview.component';
import { BackgroundImageUploadComponent } from 'app/util/background-image-upload/background-image-upload.component';
import { DomainWhitelistingComponent } from 'app/util/domain-whitelisting/domain-whitelisting.component';
import { SamlSsoLoginComponent } from 'app/dashboard/saml-sso-login/saml-sso-login.component';
import { LeadCustomFieldsSettingsComponent } from 'app/dashboard/lead-custom-fields-settings/lead-custom-fields-settings.component';
import { VendorJourneyFormAnalyticsComponent } from '../util/vendor-journey-form-analytics/vendor-journey-form-analytics.component';
import { OauthSsoConfigurationComponent } from 'app/dashboard/oauth-sso-configuration/oauth-sso-configuration.component';
import { CrmSettingsComponent } from 'app/dashboard/crm-settings/crm-settings.component'; 
import { ShareDashboardButtonsComponent } from './share-dashboard-buttons/share-dashboard-buttons.component';
import { DropdownLoaderComponent } from 'app/util/dropdown-loader/dropdown-loader.component';
import { DisplayErrorMessageComponent } from 'app/util/display-error-message/display-error-message.component';
import { ChatGptModalComponent } from './chat-gpt-modal/chat-gpt-modal.component';
import { MultiSelectDropdownComponent } from 'app/util/multi-select-dropdown/multi-select-dropdown.component';
import { AngularMultiSelectModule } from 'angular4-multiselect-dropdown/angular4-multiselect-dropdown';



@NgModule({
	imports: [InternationalPhoneModule, RecaptchaModule.forRoot(), CommonModule, FormsModule, LoadingModule, MultiSelectAllModule, CheckBoxModule, ButtonModule, BootstrapSwitchModule, TagInputModule, TranslateModule,
		 DragulaModule, ColorPickerModule, CKEditorModule,QueryBuilderModule,DropDownListModule,
		 ScrollToModule.forRoot(),AngularMultiSelectModule],
	declarations: [DonutChartComponent, PaginationComponent, WorldmapComponent, PieChartComponent,
		BarChartComponent, EmbedModalComponent, EmbedModalComponent, UserInfoComponent, LocationComponent,
		PlatformComponent, ResponseMessageComponent, PreviewVideoComponent, ContactsCampaignsMailsComponent, ListLoaderComponent,
		PlayVideoLoaderComponent, GridLoaderComponent, ExportCsvComponent, AnalyticsLoaderComponent, VideoThumbnailComponent,
		DetailViewComponent, TimestampComponent, ScrollTopComponent, SaveAsComponent, TimestampNewComponent, VideoPlayComponent, EventSendReminderComponent,
		ImageCropperComponent, EmailSpamCheckComponent, AutoResponseLoaderComponent, PreviewPopupComponent, PreviewLandingPageComponent, FormPreviewComponent,
		LandingPageLoaderComponent, DashboardLoaderComponent, ModalPopupLoaderComponent, FormAnalyticsUtilComponent, PublicPageResponseComponent, MergeTagsComponent, FlatpickrComponent, SaveGeoLocationAnalyticsComponent,
		SendCampaignsComponent, CategoryFolderViewUtilComponent, AddFolderModalPopupComponent, CreateBeeTemplateComponent, FormsListViewUtilComponent,
		CampaignsListViewUtilComponent, PreviewCampaignComponent, SocialStatusComponent,
		AddMoreReceiversComponent, PublicEventEmailPopupComponent, LoaderComponent, RedistributeCampaignsListViewUtilComponent, XamplifyDefaultTemplatesComponent, 
		EmailTemplatePreviewUtilComponent, AddFormUtilComponent, AddTracksPlayBookComponent, AddTagsUtilComponent, DatePickerComponent, AddLeadComponent, BeeTemplateUtilComponent, CampaignTemplateDownloadHistoryComponent,
		ShareLeadsComponent, ImageLoaderComponent, CampaignsLaunchedByPartnersComponent, SpfDescriptionComponent, ManageTracksPlayBookComponent, PreviewTracksPlayBookComponent,
		TracksPlayBookAnalyticsComponent, TracksPlayBookPartnerAnalyticsComponent, PreviewUserListComponent, 
		TracksPlayBookPartnerCompanyAndListsComponent, AddDefaultTemplateDetailsComponent, UserlistUsersComponent, PartnerCompanyModalPopupComponent,
		FormPreviewWithSubmittedAnswersComponent,TeamMembersUtilComponent,ConfirmSweetAlertUtilComponent,ChartPieComponent, ChartVariablePieComponent,
		SelectDropdownComponent,PreviewAssetPopupComponent,AssetGridViewActionsComponent,DownloadAssetPopupComponent,DeleteAssetsComponent,
		TeamMemberGroupPreviewPopupComponent,PartnerTeamMemberGroupTeamMembersComponent,TeamMemberFilterOptionComponent,TeamMemberFilterOptionModalPopupComponent,
		ManageCampaignLeadsComponent,ManageCampaignDealsComponent,TeamMemberPartnersComponent, FormTeamMemberGroupComponent, DisplayDateAndTimeComponent,
		EditCampaignDetailsModalPopupComponent,OneClickLaunchPartnerPreviewComponent,MicrosoftAuthenticationPopupComponent,MicrosoftAuthenticationComponent,
		CommentsComponent,FolderTypeViewUtilComponent,DamListAndGridViewComponent,CountStatisticsComponent,ImgCropprV2Component,
		LoginAsPartnerComponent,PipedriveAuthenticationPopupComponent,ConnectwiseAuthenticationPopupComponent,CopyGroupUsersModalPopupComponent,
		PartnerCompanyAndGroupsComponent,XamplifyVideoPlayerComponent,SendTestEmailComponent,AddMultipleEmailsInputComponent,
		CampaignListAndGridViewComponent,UserGuideHelpButtonComponent,GuideLeftMenuComponent,SearchGuidesComponent,GuideHelpIconComponent,
		HomeGuideComponent,EmailTemplatesListAndGridViewComponent,DonutPieChartComponent,SelectEmailTemplateComponent,CustomUiSwitchComponent,
		EditTemplateOrPageModalPopupComponent, ShareCampaignsComponent, ShareAssetsComponent, SharePlaybooksComponent,
		ShareUnpublishedContentComponent, ShareTracksOrPlaybooksComponent,ImageUploadCropperComponent,SearchableDropdownComponent,
		ConfirmUnpublishTracksOrPlaybooksModelPopupComponent,CustomUiFilterComponent,TrimPipe,CopyModalPopupComponent,
		LandingPagesListAndGridViewComponent,BrowseContentComponent,AddCompanyComponent,DealChatPopupComponent,
		ChatComponent,OpportunitiesChatModalPopupComponent,UploadImageUtilComponent,PreviewEmailTemplateComponent,PreviewPageComponent,PreviewAssetPdfComponent,PartnerJourneyCountTilesComponent,BoxLoaderComponent,InteractedNotInteractedTrackDetailsComponent,
		TypewiseTrackContentDetailsComponent,UserwiseTrackCountsComponent,UserwiseTrackDetailsComponent,TrackAssetDetailsComponent,
		ShareLeadDetailsComponent,RedistributedCampaignDetailsComponent,PartnerJourneyLeadDetailsComponent,PartnerJourneyDealDetailsComponent,
		MdfDetailAnalyticsComponent,RedistributedCampaignsAndLeadsBarChartComponent,TeamMemberAnalyticsContactDetailsComponent,TeamMemberAnalyticsAllPartnersDetailsComponent,
		TeamMemberwiseAssetAnalyticsComponent,TeamMemberwiseAssetsDetailedReportComponent,TeamMemberAnalyticsCompanyDetailsComponent,FilePreviewComponent,DomainWhitelistingComponent,BackgroundImageUploadComponent,SamlSsoLoginComponent,LeadCustomFieldsSettingsComponent,
		VendorJourneyFormAnalyticsComponent, OauthSsoConfigurationComponent, ShareDashboardButtonsComponent,CrmSettingsComponent,
		DropdownLoaderComponent,DisplayErrorMessageComponent, ChatGptModalComponent,MultiSelectDropdownComponent
	],


	exports: [InternationalPhoneModule, RecaptchaModule, DonutChartComponent, PaginationComponent, WorldmapComponent, ContactsCampaignsMailsComponent, TagInputModule,
		BarChartComponent, EmbedModalComponent, UserInfoComponent, LocationComponent, PlatformComponent, ImageCropperComponent,
		ResponseMessageComponent, PreviewVideoComponent, PieChartComponent, ListLoaderComponent, GridLoaderComponent, PlayVideoLoaderComponent,
		ExportCsvComponent, LoadingModule, AnalyticsLoaderComponent, VideoThumbnailComponent, DetailViewComponent, TimestampComponent,
		ScrollTopComponent, SaveAsComponent, TimestampNewComponent, VideoPlayComponent, EventSendReminderComponent, EmailSpamCheckComponent, AutoResponseLoaderComponent,
		PreviewPopupComponent, PreviewLandingPageComponent, FormPreviewComponent, LandingPageLoaderComponent, DashboardLoaderComponent, ModalPopupLoaderComponent,
		FormAnalyticsUtilComponent, MergeTagsComponent, FlatpickrComponent, SaveGeoLocationAnalyticsComponent, SendCampaignsComponent, CategoryFolderViewUtilComponent,
		AddFolderModalPopupComponent, CreateBeeTemplateComponent, FormsListViewUtilComponent, CampaignsListViewUtilComponent,
		PreviewCampaignComponent, SocialStatusComponent, AddMoreReceiversComponent, PublicEventEmailPopupComponent, LoaderComponent,
		RedistributeCampaignsListViewUtilComponent, XamplifyDefaultTemplatesComponent, EmailTemplatePreviewUtilComponent, AddFormUtilComponent, AddTagsUtilComponent, 
		AddTracksPlayBookComponent, DatePickerComponent, AddLeadComponent, BeeTemplateUtilComponent, CampaignTemplateDownloadHistoryComponent,
		ShareLeadsComponent, ImageLoaderComponent, CampaignsLaunchedByPartnersComponent, SpfDescriptionComponent, ManageTracksPlayBookComponent, PreviewTracksPlayBookComponent, 
		TracksPlayBookAnalyticsComponent, TracksPlayBookPartnerAnalyticsComponent, PreviewUserListComponent, 
		TracksPlayBookPartnerCompanyAndListsComponent, AddDefaultTemplateDetailsComponent, UserlistUsersComponent, PartnerCompanyModalPopupComponent,
		FormPreviewWithSubmittedAnswersComponent,TeamMembersUtilComponent,ConfirmSweetAlertUtilComponent,ChartPieComponent, ChartVariablePieComponent,
		SelectDropdownComponent,PreviewAssetPopupComponent,AssetGridViewActionsComponent,DownloadAssetPopupComponent,DeleteAssetsComponent,
		TeamMemberGroupPreviewPopupComponent,PartnerTeamMemberGroupTeamMembersComponent,TeamMemberFilterOptionComponent,TeamMemberFilterOptionModalPopupComponent,
		ManageCampaignLeadsComponent,ManageCampaignDealsComponent,TeamMemberPartnersComponent, FormTeamMemberGroupComponent,DisplayDateAndTimeComponent,
		EditCampaignDetailsModalPopupComponent,OneClickLaunchPartnerPreviewComponent,MicrosoftAuthenticationPopupComponent,MicrosoftAuthenticationComponent,
		CommentsComponent,FolderTypeViewUtilComponent,DamListAndGridViewComponent,CountStatisticsComponent,
		ImgCropprV2Component,LoginAsPartnerComponent,PipedriveAuthenticationPopupComponent,ConnectwiseAuthenticationPopupComponent,CopyGroupUsersModalPopupComponent,
		PartnerCompanyAndGroupsComponent,XamplifyVideoPlayerComponent,SendTestEmailComponent,AddMultipleEmailsInputComponent,
		CampaignListAndGridViewComponent,UserGuideHelpButtonComponent,EmailTemplatesListAndGridViewComponent,
		DonutPieChartComponent,QueryBuilderModule,SelectEmailTemplateComponent,CustomUiSwitchComponent,EditTemplateOrPageModalPopupComponent,
		ShareCampaignsComponent, ShareAssetsComponent, SharePlaybooksComponent,
		ShareUnpublishedContentComponent,ShareTracksOrPlaybooksComponent,ImageUploadCropperComponent,SearchableDropdownComponent,
		ScrollToModule,ConfirmUnpublishTracksOrPlaybooksModelPopupComponent,CustomUiFilterComponent,TrimPipe,CopyModalPopupComponent,AddCompanyComponent,
		LandingPagesListAndGridViewComponent,BrowseContentComponent,DealChatPopupComponent,ChatComponent,
		OpportunitiesChatModalPopupComponent,UploadImageUtilComponent,PreviewEmailTemplateComponent,PreviewPageComponent,PreviewAssetPdfComponent,PartnerJourneyCountTilesComponent,BoxLoaderComponent,
		InteractedNotInteractedTrackDetailsComponent,TypewiseTrackContentDetailsComponent,UserwiseTrackCountsComponent,UserwiseTrackDetailsComponent,TrackAssetDetailsComponent,
		ShareLeadDetailsComponent,RedistributedCampaignDetailsComponent,PartnerJourneyLeadDetailsComponent,PartnerJourneyDealDetailsComponent,MdfDetailAnalyticsComponent,
		RedistributedCampaignsAndLeadsBarChartComponent,TeamMemberAnalyticsContactDetailsComponent,TeamMemberAnalyticsAllPartnersDetailsComponent,TeamMemberwiseAssetAnalyticsComponent,
		TeamMemberwiseAssetsDetailedReportComponent,TeamMemberAnalyticsCompanyDetailsComponent,FilePreviewComponent,DomainWhitelistingComponent,BackgroundImageUploadComponent,SamlSsoLoginComponent,LeadCustomFieldsSettingsComponent,
		VendorJourneyFormAnalyticsComponent, OauthSsoConfigurationComponent,CrmSettingsComponent,ShareDashboardButtonsComponent,
		DropdownLoaderComponent,DisplayErrorMessageComponent,ChatGptModalComponent,MultiSelectDropdownComponent

	]




})
export class CommonComponentModule { }
