import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { AddLmsComponent } from './add-lms/add-lms.component';
import { ManageLmsComponent } from './manage-lms/manage-lms.component';
import { PreviewLmsComponent } from './preview-lms/preview-lms.component';
import { LmsAnalyticsComponent } from './lms-analytics/lms-analytics.component';
import { LmsPartnerAnalyticsComponent } from './lms-partner-analytics/lms-partner-analytics.component'

export const routes: Routes = [
  { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: "add", component: AddLmsComponent },
  { path: "edit/:id", component: AddLmsComponent },
  { path: "edit/:id/:viewType", component: AddLmsComponent },
	{ path: "edit/:id/:viewType/:categoryId/:folderViewType", component: AddLmsComponent },
  { path: "manage", component: ManageLmsComponent },
  { path: "manage/:viewType", component: ManageLmsComponent },
	{ path: "manage/:folderViewType/:viewType/:categoryId", component: ManageLmsComponent },
  { path: "shared", component: ManageLmsComponent },
  { path: "shared/:viewType", component: ManageLmsComponent },
	{ path: "shared/:folderViewType/:viewType/:categoryId", component: ManageLmsComponent },
  { path: 'tb/:companyId/:slug', component: PreviewLmsComponent },
  { path: "tb/:companyId/:slug/:viewType", component: PreviewLmsComponent },
	{ path: "tb/:companyId/:slug/:viewType/:categoryId/:folderViewType", component: PreviewLmsComponent },
  { path: 'analytics/:id', component: LmsAnalyticsComponent },
  { path: 'analytics/:id/:viewType', component: LmsAnalyticsComponent },
  { path: 'analytics/:id/:viewType/:categoryId/:folderViewType', component: LmsAnalyticsComponent },
  { path: 'partnerAnalytics/:ltId/:id', component: LmsPartnerAnalyticsComponent },
  { path: 'partnerAnalytics/:ltId/:id/:viewType', component: LmsPartnerAnalyticsComponent },
  { path: 'partnerAnalytics/:ltId/:id/:viewType/:categoryId/:folderViewType', component: LmsPartnerAnalyticsComponent },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsRoutingModule { }
