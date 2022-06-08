import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddPartnersComponent } from './add-partners/add-partners.component';
import { ManagePartnersComponent } from './manage-partners/manage-partners.component';
import { SocialContactsCallbackComponent } from '../contacts/social-contacts-callback/social-contacts-callback.component';
import { PartnerReportsComponent } from './partner-reports/partner-reports.component';

const routes: Routes = [
    { path: '', redirectTo: 'add', pathMatch: 'full' },
    { path: 'add', component: AddPartnersComponent },
    { path: 'manage', component: ManagePartnersComponent },
    { path: 'google-callback', component: SocialContactsCallbackComponent },
    { path: 'zoho-callback', component: SocialContactsCallbackComponent },
    { path: 'salesforce-callback', component: SocialContactsCallbackComponent },
    { path: 'analytics', component: PartnerReportsComponent },
    {path: 'analytics/:id', component: PartnerReportsComponent},
    { path: 'hubspot-callback',component:SocialContactsCallbackComponent},

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerRoutingModule { }


