import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageDealsComponent } from './manage-deals/manage-deals.component';

export const routes: Routes = [
  { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: "manage", component: ManageDealsComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealsRoutingModule { }
