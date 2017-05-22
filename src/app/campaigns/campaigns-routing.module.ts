import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PublishContentComponent} from './publish-content/publish-content.component';
import {ManagePublishComponent} from './manage-publish/manage-publish.component';
import {SelectCampaignTypeComponent} from './select-campaign-type/select-campaign-type.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';

export const campaignRoutes: Routes = [

    { path: '', redirectTo: 'select-campaign', pathMatch: 'full' },
    { path:'select-campaign',component:SelectCampaignTypeComponent},
    { path:'create-campaign',component:CreateCampaignComponent},
    { path: 'publishContent', component: PublishContentComponent },
    { path: 'managepublish', component: ManagePublishComponent },

];

@NgModule({
    imports: [
        RouterModule.forChild(campaignRoutes)
    ],
    exports: [
        RouterModule
    ],

})
export class CampaignsRoutingModule { }