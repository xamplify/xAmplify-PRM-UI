import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { CreateMdfRequestComponent } from './create-mdf-request/create-mdf-request.component';
import { ManageMdfFundsComponent } from './manage-mdf-funds/manage-mdf-funds.component';
import { ManageMdfRequestsComponent } from './manage-mdf-requests/manage-mdf-requests.component';
import { HtmlSampleComponent } from './html-sample/html-sample.component';

export const routes: Routes = [
  { path: "", redirectTo: "funds", pathMatch: "full" },
  { path: "funds", component: ManageMdfFundsComponent },
  { path: "create-request", component: CreateMdfRequestComponent },
  {path: "requests", component:ManageMdfRequestsComponent},
  {path: "html", component:HtmlSampleComponent}


  ];
@NgModule( {
  imports: [RouterModule.forChild( routes )],
  exports: [RouterModule]
} )
export class MdfRoutingModule { }
