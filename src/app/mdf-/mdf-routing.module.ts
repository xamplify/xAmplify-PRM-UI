import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageMdfDetailsComponent } from './manage-mdf-details/manage-mdf-details.component';
import { ManageMdfRequestsComponent } from './manage-mdf-requests/manage-mdf-requests.component';

export const routes: Routes = [
  { path: "", redirectTo: "details", pathMatch: "full" },
  { path: "details", component: ManageMdfDetailsComponent },
  { path: "requests", component: ManageMdfRequestsComponent },
  {path: "requests/:role", component:ManageMdfRequestsComponent},





];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MdfRoutingModule { }
