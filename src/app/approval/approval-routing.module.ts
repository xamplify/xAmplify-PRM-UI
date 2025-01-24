import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageApprovalComponent } from './manage-approval/manage-approval.component';

const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: 'manage', component: ManageApprovalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRoutingModule { }
