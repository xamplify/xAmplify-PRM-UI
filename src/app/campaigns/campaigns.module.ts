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
import { PreviewCampaignComponent } from "./preview-campaign/preview-campaign.component";
import { EventCampaignComponent } from './event-campaign/event-campaign.component'; 
import { ReDistributedComponent } from './analytics/re-distributed/re-distributed.component';
import { PreviewPartnersComponent } from './preview-partners/preview-partners.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DealRegistrationComponent } from '../deal-registration/add-deals/deal-registration.component';
import { DealRegistrationService } from '../deal-registration/services/deal-registration.service';
import { SharedLibraryModule } from "../shared/shared-library.module";
import { DealRegistrationModule } from "../deal-registration/deal-registration.module";
import { ManageDealCommentsComponent } from "../deal-registration/manage-deal-comments/manage-deal-comments.component";
import { AddLeadsComponent } from "../deal-registration/add-leads/add-leads.component";
import { MarketoAuthenticationComponent } from "../deal-registration/marketo-authentication/marketo-authentication.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CampaignsRoutingModule,
    CKEditorModule,
    CommonComponentModule,
    ErrorPagesModule,
    SharedLibraryModule
  ],
  declarations: [
    ManagePublishComponent,
    SelectCampaignTypeComponent,
    CreateCampaignComponent,
    AnalyticsComponent,
    HeatMapComponent,
    SocialCampaignComponent,
    BubbleChartComponent,
    PartnerCampaignsComponent,
    EditPartnerCampaignsComponent,
    PreviewCampaignComponent,
    EventCampaignComponent,
    ReDistributedComponent,
    PreviewPartnersComponent,
    CalendarComponent,
    DealRegistrationComponent,
    ManageDealCommentsComponent,
    AddLeadsComponent
  ],
  exports: [DealRegistrationComponent,BubbleChartComponent,HeatMapComponent,ManageDealCommentsComponent,AddLeadsComponent
],
  providers: [ContactService, VideoFileService, EmailTemplateService,DealRegistrationService]
})
export class CampaignsModule {}
