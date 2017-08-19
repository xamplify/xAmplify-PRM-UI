import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CampaignsRoutingModule } from './campaigns-routing.module';


import { ManagePublishComponent } from './manage-publish/manage-publish.component';
import { SelectCampaignTypeComponent } from './select-campaign-type/select-campaign-type.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';

import { ContactService }  from '../contacts/services/contact.service';
import { VideoFileService } from '../videos/services/video-file.service';
import { EmailTemplateService } from '../email-template/services/email-template.service';
import { AnalyticsComponent } from './analytics/analytics.component';
@NgModule({
	
  imports: [ CommonModule,SharedModule,CampaignsRoutingModule ],
  declarations: [ManagePublishComponent,SelectCampaignTypeComponent,CreateCampaignComponent, AnalyticsComponent],
  providers :[ContactService,VideoFileService,EmailTemplateService]

})
export class CampaignsModule { }
