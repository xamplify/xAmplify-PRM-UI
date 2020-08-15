import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { CreateMdfRequestComponent } from './create-mdf-request/create-mdf-request.component';
import { ManageMdfFundsComponent } from './manage-mdf-funds/manage-mdf-funds.component';
import { ManageMdfRequestsComponent } from './manage-mdf-requests/manage-mdf-requests.component';
import { HtmlSampleComponent } from './html-sample/html-sample.component';
import { ListVendorsComponent } from './list-vendors/list-vendors.component';
import { EditMditRequestComponent } from './edit-mdit-request/edit-mdit-request.component';

export const routes: Routes = [
  { path: "", redirectTo: "funds", pathMatch: "full" },
  { path: "funds", component: ManageMdfFundsComponent },
  { path: "create-request/:vendorCompanyId", component: CreateMdfRequestComponent },
  { path: "change-request/:mdfId", component: EditMditRequestComponent },
  {path: "requests", component:ManageMdfRequestsComponent},
  {path: "html", component:HtmlSampleComponent},
  {path: "requests/:role", component:ManageMdfRequestsComponent},
  {path: "vendors", component:ListVendorsComponent}



  ];
@NgModule( {
  imports: [RouterModule.forChild( routes )],
  exports: [RouterModule]
} )
export class MdfRoutingModule { }
