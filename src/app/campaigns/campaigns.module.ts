import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CampaignsRoutingModule } from './campaigns-routing.module';


import { ManagePublishComponent } from './manage-publish/manage-publish.component';
import { PublishContentComponent } from './publish-content/publish-content.component';

import { ContactService }  from '../contacts/contact.service';
import { VideoFileService } from '../videos/services/video-file.service';
import { EmailTemplateService } from '../email-template/services/email-template.service';

@NgModule({
	
  imports: [ CommonModule,SharedModule,CampaignsRoutingModule ],
  declarations: [ManagePublishComponent, PublishContentComponent],
  providers :[ContactService,VideoFileService,EmailTemplateService]

})
export class CampaignsModule { }
