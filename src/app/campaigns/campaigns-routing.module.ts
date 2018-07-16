import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ManagePublishComponent } from "./manage-publish/manage-publish.component";
import { SelectCampaignTypeComponent } from "./select-campaign-type/select-campaign-type.component";
import { CreateCampaignComponent } from "./create-campaign/create-campaign.component";
import { SocialCampaignComponent } from "./social-campaign/social-campaign.component";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { PartnerCampaignsComponent } from "./partner-campaigns/partner-campaigns.component";
import { EditPartnerCampaignsComponent } from "./edit-partner-campaigns/edit-partner-campaigns.component";
import { PreviewCampaignComponent } from "./preview-campaign/preview-campaign.component";
import { EventCampaignComponent } from './event-campaign/event-campaign.component';

export const campaignRoutes: Routes = [
  { path: "", redirectTo: "select", pathMatch: "full" },
  { path: "select", component: SelectCampaignTypeComponent },
  { path: "create", component: CreateCampaignComponent },
  { path: "social", component: SocialCampaignComponent },
  { path: "social/:alias", component: SocialCampaignComponent },
  { path: "edit", component: CreateCampaignComponent },
  { path: "manage", component: ManagePublishComponent },
  { path: ":campaignId/details", component: AnalyticsComponent },
  { path: "partner", component: PartnerCampaignsComponent },
  { path: "partner/:type", component: PartnerCampaignsComponent },
  { path: "vendor/:type", component: PartnerCampaignsComponent },
  { path: "re-distribute-campaign", component: EditPartnerCampaignsComponent },
  { path: "preview/:id", component: PreviewCampaignComponent },
  { path: "event", component: EventCampaignComponent }
];

@NgModule({
  imports: [RouterModule.forChild(campaignRoutes)],
  exports: [RouterModule]
})
export class CampaignsRoutingModule {}
