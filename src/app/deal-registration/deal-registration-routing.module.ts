import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { DealRegistrationComponent } from "./deal-registration/deal-registration.component";

export const routes: Routes = [
  { path: "", redirectTo: "deal-registration", pathMatch: "full" },
  { path: "deal-registration", component: DealRegistrationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealRegistrationRoutingModule { }
