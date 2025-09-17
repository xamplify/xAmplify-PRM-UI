import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";
import { DealsRoutingModule } from './deals-routing.module';
import { ManageDealsComponent } from './manage-deals/manage-deals.component';
import { DealsService } from './services/deals.service';
@NgModule({
  imports: [
     CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, DealsRoutingModule
  ],
  declarations: [ManageDealsComponent],
  providers: [DealsService]
})
export class DealsModule { }
