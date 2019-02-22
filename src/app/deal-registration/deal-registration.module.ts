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
import { CampaignsModule } from '../campaigns/campaigns.module';
import { DealAnalyticsComponent } from './deal-analytics/deal-analytics.component';
import { CampaignService } from '../campaigns/services/campaign.service';
import { ManageCommentsComponent } from './manage-comments/manage-comments.component';



@NgModule({
  imports: [ CommonComponentModule,DealRegistrationRoutingModule , SharedModule,CommonModule,CampaignsModule],
  declarations: [ ManageDealsComponent, ManagePartnersComponent, ManageLeadsComponent, DealAnalyticsComponent, ManageCommentsComponent],
  providers:[DealRegistrationService,CampaignService],
  exports:[]
})
export class DealRegistrationModule { }
 