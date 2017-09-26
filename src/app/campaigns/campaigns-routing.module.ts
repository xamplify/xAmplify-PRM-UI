import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ManagePublishComponent} from './manage-publish/manage-publish.component';
import {SelectCampaignTypeComponent} from './select-campaign-type/select-campaign-type.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { AnalyticsComponent } from './analytics/analytics.component';

export const campaignRoutes: Routes = [

    { path: '', redirectTo: 'select-campaign', pathMatch: 'full' },
    { path:'select-campaign',component:SelectCampaignTypeComponent},
    { path:'create-campaign',component:CreateCampaignComponent},
    { path:'edit-campaign',component:CreateCampaignComponent},
    { path: 'manage-campaigns', component: ManagePublishComponent },
    { path: ':campaignId/details', component: AnalyticsComponent },
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