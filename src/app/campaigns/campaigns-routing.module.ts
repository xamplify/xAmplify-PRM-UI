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
import { ReDistributedComponent } from './analytics/re-distributed/re-distributed.component';
import { PreviewPartnersComponent } from './preview-partners/preview-partners.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CreateSmsCampaignComponent } from "./create-sms-campaign/create-sms-campaign.component";
import { EventCheckInComponent } from './event-check-in/event-check-in.component';
import { UserLevelTimelineComponent } from './user-level-timeline/user-level-timeline.component';
import { UserCampaignsListUtilComponent } from '../util/user-campaigns-list-util/user-campaigns-list-util.component';
import { AddCampaignComponent } from "./add-campaign/add-campaign.component";
import { ManageCampaignsComponent } from "./manage-campaigns/manage-campaigns.component";
import { PendingChangesGuard } from "app/component-can-deactivate";



export const campaignRoutes: Routes = [
  { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: "select", component: SelectCampaignTypeComponent },
  { path: "create/:campaignType", component: AddCampaignComponent,canDeactivate: [PendingChangesGuard] },
  { path: "edit/:campaignType", component: AddCampaignComponent },
  { path: "social", component: SocialCampaignComponent },
  { path: "social/:alias", component: SocialCampaignComponent },
  { path: "edit", component: CreateCampaignComponent },
  { path: "manage", component: ManagePublishComponent },
  { path: "manage/:categoryId", component: ManagePublishComponent },
  { path: "manage/tm/:teamMemberId", component: ManagePublishComponent },
  { path: "manage/tm/:teamMemberId/", component: ManagePublishComponent },
  { path: "manage/:categoryId/:teamMemberId", component: ManagePublishComponent },
  { path: ":campaignId/details", component: AnalyticsComponent },
  { path: ":campaignId/checkin", component: EventCheckInComponent },
  { path: ":campaignId/re-distributed", component: ReDistributedComponent },
  { path: "partner", component: PartnerCampaignsComponent },
  { path: "partner/:type", component: PartnerCampaignsComponent },
  { path: "partner/:type/", component: PartnerCampaignsComponent },
  { path: "partner/f/:categoryId", component: PartnerCampaignsComponent },
  { path: "partner/f/:categoryId/:type", component: PartnerCampaignsComponent },
  { path: "vendor/:type", component: PartnerCampaignsComponent },
  { path: "re-distribute-campaign", component: EditPartnerCampaignsComponent },
  { path: "preview/:id", component: PreviewCampaignComponent },
  { path: "event", component: EventCampaignComponent },
  { path: "event-preview/:id", component: EventCampaignComponent },
  { path: "event-update/:id", component: EventCampaignComponent },
  { path: "event-edit/:id", component: EventCampaignComponent },
  { path: "re-distribute-event/:id", component: EventCampaignComponent },
  { path: "re-distribute-manage/:id", component: EventCampaignComponent },
  { path: ":campaignId/plc", component: PreviewPartnersComponent },
  { path: ":campaignId/tda", component: PreviewPartnersComponent },
  { path: ":campaignId/teoa", component: PreviewPartnersComponent },
  { path: "calendar", component: CalendarComponent },
  { path: "calendar/:teamMemberId", component: CalendarComponent },
  { path: "calendar/f/:categoryId", component: CalendarComponent },
  { path: "calendar/:teamMemberId/:categoryId", component: CalendarComponent },
  { path: "sms", component: CreateSmsCampaignComponent },
  { path: "timeline/:type/:campaignId/:userId", component: UserLevelTimelineComponent },
  { path: "timeline/:type/:campaignId/:userId/:navigatedFrom", component: UserLevelTimelineComponent },
  { path: "timeline/:type/:campaignId/:userId/:navigatedFrom/:analyticsCampaignId", component: UserLevelTimelineComponent },
  { path: 'user-campaigns/:type/:userId',component:UserCampaignsListUtilComponent},
  { path: 'user-campaigns/:type/:userId/:navigatedFrom',component:UserCampaignsListUtilComponent},
  { path: 'user-campaigns/:type/:userId/:navigatedFrom/:analyticsCampaignId',component:UserCampaignsListUtilComponent},


  //  { path: "manage", component: ManageCampaignsComponent },
  //  { path: "manage/:viewType", component: ManageCampaignsComponent },
	//  { path: "manage/:viewType/:categoryId/:folderViewType", component: ManageCampaignsComponent },




];

@NgModule({
  imports: [RouterModule.forChild(campaignRoutes)],
  exports: [RouterModule]
})
export class CampaignsRoutingModule {}
