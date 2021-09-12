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
import { PieChartComponent } from '../partners/pie-chart/pie-chart.component';
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
import { EmailTemplatesListViewUtilComponent } from 'app/util/email-templates-list-view-util/email-templates-list-view-util.component';
import { LandingPagesListViewUtilComponent } from 'app/util/landing-pages-list-view-util/landing-pages-list-view-util.component';
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
//import { AddDealComponent } from '../deals/add-deal/add-deal.component';
//import { SfDealComponent } from '../deal-registration/sf-deal/sf-deal.component';

import { BeeTemplateUtilComponent } from 'app/util/bee-template-util/bee-template-util.component';
import { CampaignTemplateDownloadHistoryComponent } from 'app/campaigns/campaign-template-download-history/campaign-template-download-history.component';
import { ShareLeadsComponent } from './share-leads/share-leads.component';
import { ImageLoaderComponent } from './image-loader/image-loader.component';
import { AddTagsUtilComponent } from 'app/util/add-tags-util/add-tags-util.component';
import { CampaignsLaunchedByPartnersComponent } from 'app/util/campaigns-launched-by-partners/campaigns-launched-by-partners.component';
import { SpfDescriptionComponent } from 'app/util/spf-description/spf-description.component';
import { PartnerCompanyAndGroupsModalPopupComponent } from 'app/util/partner-company-and-groups-modal-popup/partner-company-and-groups-modal-popup.component';
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

@NgModule({
	imports: [InternationalPhoneModule, RecaptchaModule.forRoot(), CommonModule, FormsModule, LoadingModule, MultiSelectAllModule, CheckBoxModule, ButtonModule, BootstrapSwitchModule, TagInputModule, TranslateModule, DragulaModule, ColorPickerModule, CKEditorModule],
	declarations: [DonutChartComponent, PaginationComponent, WorldmapComponent, PieChartComponent,
		BarChartComponent, EmbedModalComponent, EmbedModalComponent, UserInfoComponent, LocationComponent,
		PlatformComponent, ResponseMessageComponent, PreviewVideoComponent, ContactsCampaignsMailsComponent, ListLoaderComponent,
		PlayVideoLoaderComponent, GridLoaderComponent, ExportCsvComponent, AnalyticsLoaderComponent, VideoThumbnailComponent,
		DetailViewComponent, TimestampComponent, ScrollTopComponent, SaveAsComponent, TimestampNewComponent, VideoPlayComponent, EventSendReminderComponent,
		ImageCropperComponent, EmailSpamCheckComponent, AutoResponseLoaderComponent, PreviewPopupComponent, PreviewLandingPageComponent, FormPreviewComponent,
		LandingPageLoaderComponent, DashboardLoaderComponent, ModalPopupLoaderComponent, FormAnalyticsUtilComponent, PublicPageResponseComponent, MergeTagsComponent, FlatpickrComponent, SaveGeoLocationAnalyticsComponent,
		SendCampaignsComponent, CategoryFolderViewUtilComponent, AddFolderModalPopupComponent, CreateBeeTemplateComponent, FormsListViewUtilComponent,
		CampaignsListViewUtilComponent, EmailTemplatesListViewUtilComponent, LandingPagesListViewUtilComponent, PreviewCampaignComponent, SocialStatusComponent,
		AddMoreReceiversComponent, PublicEventEmailPopupComponent, LoaderComponent, RedistributeCampaignsListViewUtilComponent, XamplifyDefaultTemplatesComponent, 
		EmailTemplatePreviewUtilComponent, AddFormUtilComponent, AddTracksPlayBookComponent, AddTagsUtilComponent, DatePickerComponent, AddLeadComponent, BeeTemplateUtilComponent, CampaignTemplateDownloadHistoryComponent,
		ShareLeadsComponent, ImageLoaderComponent, CampaignsLaunchedByPartnersComponent, SpfDescriptionComponent, ManageTracksPlayBookComponent, PreviewTracksPlayBookComponent,
		TracksPlayBookAnalyticsComponent, TracksPlayBookPartnerAnalyticsComponent, PartnerCompanyAndGroupsModalPopupComponent, PreviewUserListComponent, 
		TracksPlayBookPartnerCompanyAndListsComponent, AddDefaultTemplateDetailsComponent, UserlistUsersComponent, PartnerCompanyModalPopupComponent,
		FormPreviewWithSubmittedAnswersComponent,TeamMembersUtilComponent,ConfirmSweetAlertUtilComponent,ChartPieComponent, ChartVariablePieComponent,SelectDropdownComponent],





	exports: [InternationalPhoneModule, RecaptchaModule, DonutChartComponent, PaginationComponent, WorldmapComponent, ContactsCampaignsMailsComponent, TagInputModule,
		BarChartComponent, EmbedModalComponent, UserInfoComponent, LocationComponent, PlatformComponent, ImageCropperComponent,
		ResponseMessageComponent, PreviewVideoComponent, PieChartComponent, ListLoaderComponent, GridLoaderComponent, PlayVideoLoaderComponent,
		ExportCsvComponent, LoadingModule, AnalyticsLoaderComponent, VideoThumbnailComponent, DetailViewComponent, TimestampComponent,
		ScrollTopComponent, SaveAsComponent, TimestampNewComponent, VideoPlayComponent, EventSendReminderComponent, EmailSpamCheckComponent, AutoResponseLoaderComponent,
		PreviewPopupComponent, PreviewLandingPageComponent, FormPreviewComponent, LandingPageLoaderComponent, DashboardLoaderComponent, ModalPopupLoaderComponent,
		FormAnalyticsUtilComponent, MergeTagsComponent, FlatpickrComponent, SaveGeoLocationAnalyticsComponent, SendCampaignsComponent, CategoryFolderViewUtilComponent,
		AddFolderModalPopupComponent, CreateBeeTemplateComponent, FormsListViewUtilComponent, CampaignsListViewUtilComponent, EmailTemplatesListViewUtilComponent,
		LandingPagesListViewUtilComponent, PreviewCampaignComponent, SocialStatusComponent, AddMoreReceiversComponent, PublicEventEmailPopupComponent, LoaderComponent,
		RedistributeCampaignsListViewUtilComponent, XamplifyDefaultTemplatesComponent, EmailTemplatePreviewUtilComponent, AddFormUtilComponent, AddTagsUtilComponent, 
		AddTracksPlayBookComponent, DatePickerComponent, AddLeadComponent, BeeTemplateUtilComponent, CampaignTemplateDownloadHistoryComponent,
		ShareLeadsComponent, ImageLoaderComponent, CampaignsLaunchedByPartnersComponent, SpfDescriptionComponent, ManageTracksPlayBookComponent, PreviewTracksPlayBookComponent, 
		TracksPlayBookAnalyticsComponent, TracksPlayBookPartnerAnalyticsComponent, PartnerCompanyAndGroupsModalPopupComponent, PreviewUserListComponent, 
		TracksPlayBookPartnerCompanyAndListsComponent, AddDefaultTemplateDetailsComponent, UserlistUsersComponent, PartnerCompanyModalPopupComponent,
		FormPreviewWithSubmittedAnswersComponent,TeamMembersUtilComponent,ConfirmSweetAlertUtilComponent,ChartPieComponent, ChartVariablePieComponent]




})
export class CommonComponentModule { }
