import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { AddLmsComponent } from './add-lms/add-lms.component';
import { ManageLmsComponent } from './manage-lms/manage-lms.component';
import { PreviewLmsComponent } from './preview-lms/preview-lms.component';
import { LmsAnalyticsComponent } from './lms-analytics/lms-analytics.component';
import { LmsPartnerAnalyticsComponent } from './lms-partner-analytics/lms-partner-analytics.component'
import { AddLmsNewComponent } from './add-lms-new/add-lms-new.component';

export const routes: Routes = [
  { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: "add", component: AddLmsNewComponent },
  { path: "edit", component: AddLmsComponent },
  { path: "edit/:id", component: AddLmsNewComponent },
  { path: "manage", component: ManageLmsComponent },
  { path: "shared", component: ManageLmsComponent },
  { path: 'tb/:companyId/:slug', component: PreviewLmsComponent },
  { path: 'analytics/:id', component: LmsAnalyticsComponent },
  { path: 'partnerAnalytics/:ltId/:id', component: LmsPartnerAnalyticsComponent },
  { path: "add-new", component: AddLmsNewComponent },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsRoutingModule { }
