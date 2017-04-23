import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PublishContentComponent} from './publish-content/publish-content.component';
import {ManagePublishComponent} from './manage-publish/manage-publish.component';

export const campaignRoutes: Routes = [

    { path: '', redirectTo: 'publishContent', pathMatch: 'full' },
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