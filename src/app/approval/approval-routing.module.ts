import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAprrovalComponent } from './manage-aprroval/manage-aprroval.component';

const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: 'manage', component: ManageAprrovalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRoutingModule { }
