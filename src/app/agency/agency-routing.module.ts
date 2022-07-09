import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageAgencyComponent } from './manage-agency/manage-agency.component';

export const routes: Routes = [
	{ path: "", component: ManageAgencyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AgencyRoutingModule { }
