import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { AddLmsComponent } from './add-lms/add-lms.component';
import { ManageLmsComponent } from './manage-lms/manage-lms.component';

export const routes: Routes = [
  { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: "add", component: AddLmsComponent },
  { path: "manage", component: ManageLmsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsRoutingModule { }
