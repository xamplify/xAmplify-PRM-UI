import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageMdfDetailsComponent } from './manage-mdf-details/manage-mdf-details.component';
import { ManageMdfRequestsComponent } from './manage-mdf-requests/manage-mdf-requests.component';
import { CreateMdfRequestComponent } from './create-mdf-request/create-mdf-request.component';
import { ChangeMdfRequestComponent } from './change-mdf-request/change-mdf-request.component';
import { EditMdfRequestFormComponent } from './edit-mdf-request-form/edit-mdf-request-form.component';
import { MdfRequestTimelineComponent } from './mdf-request-timeline/mdf-request-timeline.component';
import { MdfDetailsTimelineComponent } from './mdf-details-timeline/mdf-details-timeline.component';

export const routes: Routes = [
  { path: "", redirectTo: "details", pathMatch: "full" },
  { path: "details", component: ManageMdfDetailsComponent },
  { path: "requests", component: ManageMdfRequestsComponent },
  { path: "requests/:role", component: ManageMdfRequestsComponent },
  { path: "requests/:role/:vendorCompanyId", component: ManageMdfRequestsComponent },
  { path: "create-request/:vendorCompanyId", component: CreateMdfRequestComponent },
  { path: "change-request/:requestId", component: ChangeMdfRequestComponent },
  { path: "form", component: EditMdfRequestFormComponent },
  { path: "timeline/:role/:requestId", component: MdfRequestTimelineComponent },
  { path: "timeline/:mdfDetailsId", component: MdfDetailsTimelineComponent },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MdfRoutingModule { }
