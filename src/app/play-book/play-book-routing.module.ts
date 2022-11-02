import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { AddPlayBookComponent } from './add-play-book/add-play-book.component';
import { ManagePlayBookComponent } from './manage-play-book/manage-play-book.component';
import { PlayBookAnalyticsComponent } from './play-book-analytics/play-book-analytics.component';
import { PlayBookPartnerAnalyticsComponent } from './play-book-partner-analytics/play-book-partner-analytics.component';
import { PreviewPlayBookComponent } from './preview-play-book/preview-play-book.component';


export const routes: Routes = [
  { path: "", redirectTo: "manage", pathMatch: "full" },
  { path: "add", component: AddPlayBookComponent },
  { path: "edit/:id", component: AddPlayBookComponent },
  { path: "edit/:id/:viewType/:categoryId/:folderViewType", component: AddPlayBookComponent },
  { path: "edit/:id/:viewType", component: AddPlayBookComponent },
  { path: "manage", component: ManagePlayBookComponent },
  { path: "manage/:viewType", component: ManagePlayBookComponent },
	{ path: "manage/:viewType/:categoryId/:folderViewType", component: ManagePlayBookComponent },
  { path: "shared", component: ManagePlayBookComponent },
  { path: "shared/:viewType", component: ManagePlayBookComponent },
	{ path: "shared/:viewType/:categoryId/:folderViewType", component: ManagePlayBookComponent },
  { path: 'pb/:companyId/:slug', component: PreviewPlayBookComponent },
  { path: 'pb/:companyId/:slug/:viewType', component: PreviewPlayBookComponent },
  { path: 'pb/:companyId/:slug/:viewType/:categoryId/:folderViewType', component: PreviewPlayBookComponent },
  { path: 'analytics/:id', component: PlayBookAnalyticsComponent },
  { path: 'analytics/:id/:viewType', component: PlayBookAnalyticsComponent },
  { path: 'analytics/:id/:viewType/:categoryId/:folderViewType', component: PlayBookAnalyticsComponent },
  { path: 'partnerAnalytics/:ltId/:id', component: PlayBookPartnerAnalyticsComponent },
  { path: 'partnerAnalytics/:ltId/:id/:viewType', component: PlayBookPartnerAnalyticsComponent },
  { path: 'partnerAnalytics/:ltId/:id/:viewType/:categoryId/:folderViewType', component: PlayBookPartnerAnalyticsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayBookRoutingModule { }
