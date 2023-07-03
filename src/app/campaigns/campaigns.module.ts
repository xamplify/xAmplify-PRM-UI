import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { CampaignsRoutingModule } from "./campaigns-routing.module";
import { CommonComponentModule } from "../common/common.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";

import { ManagePublishComponent } from "./manage-publish/manage-publish.component";
import { SelectCampaignTypeComponent } from "./select-campaign-type/select-campaign-type.component";
import { CreateCampaignComponent } from "./create-campaign/create-campaign.component";

import { ContactService } from "../contacts/services/contact.service";
import { VideoFileService } from "../videos/services/video-file.service";
import { EmailTemplateService } from "../email-template/services/email-template.service";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { CKEditorModule } from "ng2-ckeditor";
import { HeatMapComponent } from "./heat-map/heat-map.component";
import { SocialCampaignComponent } from "./social-campaign/social-campaign.component";
import { BubbleChartComponent } from "./analytics/bubble-chart/bubble-chart.component";
import { PartnerCampaignsComponent } from "./partner-campaigns/partner-campaigns.component";
import { EditPartnerCampaignsComponent } from "./edit-partner-campaigns/edit-partner-campaigns.component";
import { EventCampaignComponent } from './event-campaign/event-campaign.component';
import { ReDistributedComponent } from './analytics/re-distributed/re-distributed.component';
import { PreviewPartnersComponent } from './preview-partners/preview-partners.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DealRegistrationComponent } from '../deal-registration/add-deals/deal-registration.component';
import { DealRegistrationService } from '../deal-registration/services/deal-registration.service';
import { SharedLibraryModule } from "../shared/shared-library.module";
import { ManageDealCommentsComponent } from "../deal-registration/manage-deal-comments/manage-deal-comments.component";
import { AddLeadsComponent } from "../deal-registration/add-leads/add-leads.component";
import { CreateSmsCampaignComponent } from "./create-sms-campaign/create-sms-campaign.component";
import { SharedRssModule } from "app/shared/shared-rss.module";
import { EventCheckInComponent } from './event-check-in/event-check-in.component';
import { CampaignWorkFlowsModalPopupComponent } from './campaign-work-flows-modal-popup/campaign-work-flows-modal-popup.component';
import { CampaignWorkFlowsUtilComponent } from './campaign-work-flows-util/campaign-work-flows-util.component';
import { ClickedUrlsVendorAnalyticsComponent } from './clicked-urls-vendor-analytics/clicked-urls-vendor-analytics.component';
import { UserLevelTimelineComponent } from './user-level-timeline/user-level-timeline.component';
import { UserCampaignsListUtilComponent } from '../util/user-campaigns-list-util/user-campaigns-list-util.component';

import { LeadsService } from '../leads/services/leads.service';
import { SpfModalPopupComponent } from './spf-modal-popup/spf-modal-popup.component';
import { SelectPartnersAndShareLeadsComponent } from './select-partners-and-share-leads/select-partners-and-share-leads.component';
import { OneClickLaunchRedistributedComponent } from './analytics/one-click-launch-redistributed/one-click-launch-redistributed.component';
import { DetailedCampaignAnalyticsComponent } from './analytics/detailed-campaign-analytics/detailed-campaign-analytics.component';
import { AddCampaignComponent } from './add-campaign/add-campaign.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CampaignsRoutingModule,
    CKEditorModule,
    CommonComponentModule,
    ErrorPagesModule,
    SharedLibraryModule,
    SharedRssModule
  ],
  declarations: [
    ManagePublishComponent,
    SelectCampaignTypeComponent,
    CreateCampaignComponent,
    CreateSmsCampaignComponent,
    AnalyticsComponent,
    HeatMapComponent,
    SocialCampaignComponent,
    BubbleChartComponent,
    PartnerCampaignsComponent,
    EditPartnerCampaignsComponent,
    EventCampaignComponent,
    ReDistributedComponent,
    PreviewPartnersComponent,
    CalendarComponent,
    DealRegistrationComponent,
    ManageDealCommentsComponent,
    AddLeadsComponent,
    EventCheckInComponent,
    CampaignWorkFlowsModalPopupComponent,
    CampaignWorkFlowsUtilComponent,
    ClickedUrlsVendorAnalyticsComponent,
    UserLevelTimelineComponent,
    UserCampaignsListUtilComponent,
    SpfModalPopupComponent,
    SelectPartnersAndShareLeadsComponent,
    OneClickLaunchRedistributedComponent,
    DetailedCampaignAnalyticsComponent,
    AddCampaignComponent,
    CampaignDetailsComponent  ],
  exports: [DealRegistrationComponent,BubbleChartComponent,HeatMapComponent,ManageDealCommentsComponent,AddLeadsComponent,UserCampaignsListUtilComponent
],
  providers: [ContactService, VideoFileService, EmailTemplateService,DealRegistrationService, LeadsService]
})
export class CampaignsModule {}
