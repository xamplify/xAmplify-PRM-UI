import { NgModule }            from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';


import {ManagePartnersComponent} from './manage-partners/manage-partners.component';
import { GoogleCallBackComponent } from '../contacts/google-call-back/google-call-back.component';
import { SalesforceCallBackComponent } from '../contacts/salesforce-call-back/salesforce-call-back.component';

const routes: Routes = [
    { path: '', component: ManagePartnersComponent },
    { path: 'google-callback', component: GoogleCallBackComponent },
    { path: 'salesforce-callback', component: SalesforceCallBackComponent }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerRoutingModule { }


