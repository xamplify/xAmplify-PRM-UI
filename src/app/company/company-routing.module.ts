import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCompanyComponent } from './add-company/add-company.component';
import { ManageCompanyComponent } from './manage-company/manage-company.component';

const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: 'manage', component: ManageCompanyComponent },
  { path: 'add', component: ManageCompanyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
