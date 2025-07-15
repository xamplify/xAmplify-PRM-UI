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
import { KpiComponent } from './kpi/kpi.component';
import { RedistributedCampaignsComponent } from './redistributed-campaigns/redistributed-campaigns.component';
import { ViewPartnersComponent } from './view-partners/view-partners.component';
import { IndividualPartnerAnalyticsComponent } from './individual-partner-analytics/individual-partner-analytics.component';
import { ActivePartnersTableComponent } from './active-partners-table/active-partners-table.component';
import { AllPartnerTableComponent } from './all-partner-table/all-partner-table.component';
import { DeactivatedPartnersTableComponent } from './deactivated-partners-table/deactivated-partners-table.component';
import { PartnerDetailedAnalyticsComponent } from './partner-detailed-analytics/partner-detailed-analytics.component';
import { PartnerJourneyTeamMembersTableComponent } from './partner-journey-team-members-table/partner-journey-team-members-table.component';
import { PartnerJourneyContactDetailsComponent } from './partner-journey-contact-details/partner-journey-contact-details.component';
import { PartnerJourneyCompanyInfoComponent } from './partner-journey-company-info/partner-journey-company-info.component';
import { CampaignCountTilesComponent } from './campaign-count-tiles/campaign-count-tiles.component';
import { PartnersJourneyAutomationComponent } from './partners-journey-automation/partners-journey-automation.component';
import { WorkflowFormComponent } from '../contacts/workflow-form/workflow-form.component';
import { PendingChangesGuard } from "app/component-can-deactivate";
import { PartnerJourneyTeamMemberHighLevelAnalyticsTableComponent } from './partner-journey-team-member-high-level-analytics-table/partner-journey-team-member-high-level-analytics-table.component';
import { PartnerJourneyAssetDetailsComponent } from './partner-journey-asset-details/partner-journey-asset-details.component';
import { PartnerModuleConfiguratorComponent } from './partner-module-configurator/partner-module-configurator.component';
import { AssetJourneyAssetDetailsComponent } from './asset-journey-asset-details/asset-journey-asset-details.component';
import { PlayBookJourneyInteractionComponent } from './play-book-journey-interaction/play-book-journey-interaction.component';
import { PlayBookJourneyInteractionDetailsComponent } from './play-book-journey-interaction-details/play-book-journey-interaction-details.component';

@NgModule({
  imports: [
    CKEditorModule, CommonModule, PartnerRoutingModule, SharedModule, SharedContactsModule, CommonComponentModule,
     SharedLibraryModule
  ],
  providers: [PendingChangesGuard],
  declarations: [ManagePartnersComponent, AddPartnersComponent, PartnerReportsComponent,KpiComponent, RedistributedCampaignsComponent, ViewPartnersComponent, IndividualPartnerAnalyticsComponent, ActivePartnersTableComponent, AllPartnerTableComponent, DeactivatedPartnersTableComponent, PartnerDetailedAnalyticsComponent, PartnerJourneyTeamMembersTableComponent, PartnerJourneyContactDetailsComponent, PartnerJourneyCompanyInfoComponent, CampaignCountTilesComponent, PartnersJourneyAutomationComponent,WorkflowFormComponent, PartnerJourneyTeamMemberHighLevelAnalyticsTableComponent, PartnerJourneyAssetDetailsComponent, PartnerModuleConfiguratorComponent, AssetJourneyAssetDetailsComponent, PlayBookJourneyInteractionComponent, PlayBookJourneyInteractionDetailsComponent]
})
export class PartnersModule { }
