import { NgModule } from '@angular/core';
import { DealRegistrationComponent } from './add-deals/deal-registration.component';
import { DealRegistrationRoutingModule } from './deal-registration-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ManageDealsComponent } from './manage-deals/manage-deals.component';
import { DealRegistrationService } from './services/deal-registration.service';
import { CommonComponentModule } from '../common/common.module';
import { ManagePartnersComponent } from './manage-partners/manage-partners.component';
import { ManageLeadsComponent } from './manage-leads/manage-leads.component';
import { CommonModule } from '@angular/common';
import { Campaign } from '../campaigns/models/campaign';
import { CampaignsModule } from '../campaigns/campaigns.module';


@NgModule({
  imports: [ CommonComponentModule,DealRegistrationRoutingModule , SharedModule,CommonModule,CommonComponentModule,CampaignsModule],
  declarations: [ ManageDealsComponent, ManagePartnersComponent, ManageLeadsComponent],
  providers:[DealRegistrationService],
  exports:[]
})
export class DealRegistrationModule { }
