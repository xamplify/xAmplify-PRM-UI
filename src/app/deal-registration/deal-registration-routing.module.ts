import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";



export const routes: Routes = [
  { path: "", redirectTo: "manage", pathMatch: "full" },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealRegistrationRoutingModule { }
