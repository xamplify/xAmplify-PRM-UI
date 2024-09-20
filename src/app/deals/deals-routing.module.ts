import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageDealsComponent } from './manage-deals/manage-deals.component';
import { AddDealComponent } from './add-deal/add-deal.component';

export const routes: Routes = [
  { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: "manage", component: ManageDealsComponent },
  { path: "add", component: AddDealComponent },
  { path: "d/add", component: AddDealComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealsRoutingModule { }
