import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CampaignsRoutingModule } from './campaigns-routing.module';
import { CommonComponentModule } from '../common/common.module';
import { ErrorPagesModule } from '../error-pages/error-pages.module';

import { ManagePublishComponent } from './manage-publish/manage-publish.component';
import { SelectCampaignTypeComponent } from './select-campaign-type/select-campaign-type.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';

import { ContactService } from '../contacts/services/contact.service';
import { VideoFileService } from '../videos/services/video-file.service';
import { EmailTemplateService } from '../email-template/services/email-template.service';
import { AnalyticsComponent } from './analytics/analytics.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { HeatMapComponent } from './heat-map/heat-map.component';
import { SocialCampaignComponent } from './social-campaign/social-campaign.component';
import { BubbleChartComponent } from './analytics/bubble-chart/bubble-chart.component';
import { NurtureCampaignComponent } from './nurture-campaign/nurture-campaign.component';
import { PartnerCampaignsComponent } from './partner-campaigns/partner-campaigns.component';
import { EditPartnerCampaignsComponent } from './edit-partner-campaigns/edit-partner-campaigns.component';
import { PreviewCampaignComponent } from './preview-campaign/preview-campaign.component';

@NgModule({

    imports: [CommonModule, SharedModule, CampaignsRoutingModule, CKEditorModule,
        CommonComponentModule, ErrorPagesModule],
    declarations: [ManagePublishComponent, SelectCampaignTypeComponent, CreateCampaignComponent, AnalyticsComponent,
        HeatMapComponent, SocialCampaignComponent, BubbleChartComponent, NurtureCampaignComponent,
        PartnerCampaignsComponent,
        EditPartnerCampaignsComponent,
        PreviewCampaignComponent
        
        /*,CkEditor*/],
    providers: [ContactService, VideoFileService, EmailTemplateService]

})
export class CampaignsModule { }
