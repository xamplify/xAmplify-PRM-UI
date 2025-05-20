import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageInsightsComponent } from './manage-insights/manage-insights.component';
import { CommonComponentModule } from 'app/common/common.module';
import { CompanyRoutingModule } from 'app/company/company-routing.module';
import { ErrorPagesModule } from 'app/error-pages/error-pages.module';
import { SharedContactsModule } from 'app/shared/shared-contacts.module';
import { SharedModule } from 'app/shared/shared.module';
import { InsightsRoutingModule } from './insights-routing.module';

@NgModule({
  imports: [
        CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, InsightsRoutingModule , SharedContactsModule
  ],
  declarations: [ManageInsightsComponent]
})
export class InsightsModule { }
