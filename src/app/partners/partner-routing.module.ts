import { NgModule }            from '@angular/core';
import { RouterModule, Routes}   from '@angular/router';

import {ManagePartnersComponent} from './manage-partners/manage-partners.component';

const routes: Routes = [
    { path: '', component: ManagePartnersComponent }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerRoutingModule { }


