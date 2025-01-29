import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCompanyComponent } from './add-company/add-company.component';
import { ManageCompanyComponent } from './manage-company/manage-company.component';
import { ContactDetailsComponent } from 'app/contacts/contact-details/contact-details.component';

const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: 'manage', component: ManageCompanyComponent },
  { path: 'add', component: ManageCompanyComponent },
  { path: 'manage/details/:userListId/:id', component: ContactDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
