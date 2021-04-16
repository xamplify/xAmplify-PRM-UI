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
  { path: "manage", component: ManagePlayBookComponent },
  { path: "shared", component: ManagePlayBookComponent },
  { path: 'pb/:companyId/:slug', component: PreviewPlayBookComponent },
  { path: 'analytics/:id', component: PlayBookAnalyticsComponent },
  { path: 'partnerAnalytics/:ltId/:id', component: PlayBookPartnerAnalyticsComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayBookRoutingModule { }
