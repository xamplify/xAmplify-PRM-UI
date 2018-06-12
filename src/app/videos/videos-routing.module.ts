import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ManageVideoComponent } from "./manage-video/manage-video.component";
import { UploadVideoComponent } from "./upload-video/upload-video.component";
import { UserVideoComponent } from "./user-video/user-video.component";
import { ChartReportComponent } from "./manage-video/video-based-reports/chart-report/chart-report.component";

export const routes: Routes = [
  { path: "", redirectTo: "upload", pathMatch: "full" },
  { path: "upload", component: UploadVideoComponent },
  { path: "manage", component: ManageVideoComponent },
  { path: "page_portfolio", component: UserVideoComponent },
  { path: "manage/reports", component: ChartReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule {}
