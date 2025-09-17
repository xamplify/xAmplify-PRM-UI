import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageLeadsComponent } from './manage-leads/manage-leads.component';
import { CustomAddLeadComponent } from './custom-add-lead/custom-add-lead.component';

export const routes: Routes = [
  { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: "manage", component: ManageLeadsComponent },
  { path: "add", component: CustomAddLeadComponent },
  { path: "d/add", component: CustomAddLeadComponent },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
