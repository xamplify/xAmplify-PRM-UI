import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ManageVideoComponent } from './manage-video/manage-video.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { UserVideoComponent } from './user-video/user-video.component';

 export const routes: Routes = [
      { path: '', redirectTo:'fileupload',pathMatch:'full'},
      { path: 'fileupload', component: UploadVideoComponent },                         
      { path: 'manage_videos', component: ManageVideoComponent },
      { path: 'page_portfolio', component: UserVideoComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class VideosRoutingModule { }
