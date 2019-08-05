import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ManageVideoComponent } from "./manage-video/manage-video.component";
import { UploadVideoComponent } from "./upload-video/upload-video.component";
import { ChartReportComponent } from "./manage-video/video-based-reports/chart-report/chart-report.component";
import { ContentManageComponent } from "./content-manage/content-manage.component";

export const routes: Routes = [
  { path: '', redirectTo: 'upload', pathMatch: 'full' },
  { path: 'upload', component: UploadVideoComponent },
  { path: "videos", component: ManageVideoComponent },
  { path: "manage", component: ContentManageComponent },
  { path: "videos/reports", component: ChartReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule {}
