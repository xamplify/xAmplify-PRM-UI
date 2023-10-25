import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PartnerRoutingModule } from './partner-routing.module';
import { ManagePartnersComponent } from './manage-partners/manage-partners.component';
import { SharedContactsModule } from '../shared/shared-contacts.module';
import { CommonComponentModule } from '../common/common.module';
import { AddPartnersComponent } from './add-partners/add-partners.component';
import { PartnerReportsComponent } from './partner-reports/partner-reports.component';
import { SharedLibraryModule } from '../shared/shared-library.module';
import { CKEditorModule } from "ng2-ckeditor";
import { RedistributedCampaignsAndLeadsBarChartComponent } from './redistributed-campaigns-and-leads-bar-chart/redistributed-campaigns-and-leads-bar-chart.component';
import { KpiComponent } from './kpi/kpi.component';
import { RedistributedCampaignsComponent } from './redistributed-campaigns/redistributed-campaigns.component';
import { ViewPartnersComponent } from './view-partners/view-partners.component';
import { IndividualPartnerAnalyticsComponent } from './individual-partner-analytics/individual-partner-analytics.component';
import { ActivePartnersTableComponent } from './active-partners-table/active-partners-table.component';
import { PartnerDetailedAnalyticsComponent } from './partner-detailed-analytics/partner-detailed-analytics.component';
import { PartnerJourneyTeamMembersTableComponent } from './partner-journey-team-members-table/partner-journey-team-members-table.component';
import { PartnerJourneyCountTilesComponent } from './partner-journey-count-tiles/partner-journey-count-tiles.component';
import { InteractedNotInteractedTrackDetailsComponent } from './interacted-not-interacted-track-details/interacted-not-interacted-track-details.component';
import { TypewiseTrackContentDetailsComponent } from './typewise-track-content-details/typewise-track-content-details.component';
import { UserwiseTrackCountsComponent } from './userwise-track-counts/userwise-track-counts.component';
import { UserwiseTrackDetailsComponent } from './userwise-track-details/userwise-track-details.component';
import { TrackAssetDetailsComponent } from './track-asset-details/track-asset-details.component';
import { ShareLeadDetailsComponent } from './share-lead-details/share-lead-details.component';
import { RedistributedCampaignDetailsComponent } from './redistributed-campaign-details/redistributed-campaign-details.component';
import { PartnerJourneyLeadDetailsComponent } from './partner-journey-lead-details/partner-journey-lead-details.component';
import { PartnerJourneyDealDetailsComponent } from './partner-journey-deal-details/partner-journey-deal-details.component';
import { PartnerJourneyContactDetailsComponent } from './partner-journey-contact-details/partner-journey-contact-details.component';
import { PartnerJourneyCompanyInfoComponent } from './partner-journey-company-info/partner-journey-company-info.component';
import { CampaignCountTilesComponent } from './campaign-count-tiles/campaign-count-tiles.component';
import { PartnersJourneyAutomationComponent } from './partners-journey-automation/partners-journey-automation.component';
import { WorkflowFormComponent } from '../contacts/workflow-form/workflow-form.component';
import { PendingChangesGuard } from "app/component-can-deactivate";
import { MdfDetailAnalyticsComponent } from './mdf-detail-analytics/mdf-detail-analytics.component';


@NgModule({
  imports: [
    CKEditorModule, CommonModule, PartnerRoutingModule, SharedModule, SharedContactsModule, CommonComponentModule, SharedLibraryModule
  ],
  providers: [PendingChangesGuard],
  declarations: [ManagePartnersComponent, AddPartnersComponent, PartnerReportsComponent, RedistributedCampaignsAndLeadsBarChartComponent, KpiComponent, RedistributedCampaignsComponent, ViewPartnersComponent, IndividualPartnerAnalyticsComponent, ActivePartnersTableComponent, PartnerDetailedAnalyticsComponent, PartnerJourneyTeamMembersTableComponent, PartnerJourneyCountTilesComponent, InteractedNotInteractedTrackDetailsComponent, TypewiseTrackContentDetailsComponent, UserwiseTrackCountsComponent, UserwiseTrackDetailsComponent, TrackAssetDetailsComponent, ShareLeadDetailsComponent, RedistributedCampaignDetailsComponent, PartnerJourneyLeadDetailsComponent, PartnerJourneyDealDetailsComponent, PartnerJourneyContactDetailsComponent, PartnerJourneyCompanyInfoComponent, CampaignCountTilesComponent, PartnersJourneyAutomationComponent,WorkflowFormComponent, MdfDetailAnalyticsComponent]
})
export class PartnersModule { }
