import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";
import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsService } from './services/leads.service';
import { DealsService } from '../deals/services/deals.service';
import { ManageLeadsComponent } from './manage-leads/manage-leads.component';
import { CustomAddLeadComponent } from './custom-add-lead/custom-add-lead.component';

@NgModule({
  imports: [
     CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, LeadsRoutingModule
  ],
  declarations: [ManageLeadsComponent],
  providers: [LeadsService, DealsService]
})
export class LeadsModule { }
