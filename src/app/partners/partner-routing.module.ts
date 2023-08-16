import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddPartnersComponent } from './add-partners/add-partners.component';
import { ManagePartnersComponent } from './manage-partners/manage-partners.component';
import { SocialContactsCallbackComponent } from '../contacts/social-contacts-callback/social-contacts-callback.component';
import { PartnerReportsComponent } from './partner-reports/partner-reports.component';
import { IndividualPartnerAnalyticsComponent } from './individual-partner-analytics/individual-partner-analytics.component';
import { PartnersJourneyAutomationComponent } from './partners-journey-automation/partners-journey-automation.component';


const routes: Routes = [
    { path: '', redirectTo: 'add', pathMatch: 'full' },
    { path: 'add', component: AddPartnersComponent },
    { path: 'manage', component: ManagePartnersComponent },
    { path: 'google-callback', component: SocialContactsCallbackComponent },
    { path: 'zoho-callback', component: SocialContactsCallbackComponent },
    { path: 'salesforce-callback', component: SocialContactsCallbackComponent },
    { path: 'analytics', component: PartnerReportsComponent },
    { path: 'hubspot-callback',component:SocialContactsCallbackComponent},
    /*** For XNFR-127 *********/
    { path: 'manage/:id', component: ManagePartnersComponent},
    {path: 'analytics/:id', component: PartnerReportsComponent},
    {path: 'individual-partner', component:IndividualPartnerAnalyticsComponent},
    {path: 'journey-automation', component:PartnersJourneyAutomationComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerRoutingModule { }


