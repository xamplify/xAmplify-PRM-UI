import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageLeadsComponent } from './manage-leads/manage-leads.component';

export const routes: Routes = [
  { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: "manage", component: ManageLeadsComponent },
  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
