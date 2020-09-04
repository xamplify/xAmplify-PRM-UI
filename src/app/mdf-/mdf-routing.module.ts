import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageMdfDetailsComponent } from './manage-mdf-details/manage-mdf-details.component';
import { ManageMdfRequestsComponent } from './manage-mdf-requests/manage-mdf-requests.component';
import { CreateMdfRequestComponent } from './create-mdf-request/create-mdf-request.component';
import { ChangeMdfRequestComponent } from './change-mdf-request/change-mdf-request.component';

export const routes: Routes = [
  { path: "", redirectTo: "details", pathMatch: "full" },
  { path: "details", component: ManageMdfDetailsComponent },
  { path: "requests", component: ManageMdfRequestsComponent },
  {path: "requests/:role", component:ManageMdfRequestsComponent},
  {path: "create-request/:vendorCompanyId", component:CreateMdfRequestComponent},
  {path: "change-request/:requestId", component:ChangeMdfRequestComponent},







];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MdfRoutingModule { }
