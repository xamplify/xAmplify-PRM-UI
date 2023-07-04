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

@NgModule({
  imports: [
    CKEditorModule, CommonModule, PartnerRoutingModule, SharedModule, SharedContactsModule, CommonComponentModule, SharedLibraryModule
  ],
  providers: [],
  declarations: [ManagePartnersComponent, AddPartnersComponent, PartnerReportsComponent, RedistributedCampaignsAndLeadsBarChartComponent, KpiComponent, RedistributedCampaignsComponent, ViewPartnersComponent, IndividualPartnerAnalyticsComponent]
})
export class PartnersModule { }
