import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { DealRegistrationComponent } from "./add-deals/deal-registration.component";
import { ManageDealsComponent } from './manage-deals/manage-deals.component';
import { DealAnalyticsComponent } from './deal-analytics/deal-analytics.component';



export const routes: Routes = [
  { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: "register", component: DealRegistrationComponent },
  { path: "manage", component: ManageDealsComponent },
  { path: "manage/partners", component: ManageDealsComponent },
  { path: ":id/details", component: DealAnalyticsComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealRegistrationRoutingModule { }
