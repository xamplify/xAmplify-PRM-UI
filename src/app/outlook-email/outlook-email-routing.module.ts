import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { PreviewemailComponent } from './previewemail/previewemail.component';

export const outlookEmailRoutes: Routes = [
  { path: '', redirectTo: 'inbox', pathMatch: 'full' },
  { path: 'inbox', component: InboxComponent },
  { path: 'preview', component: PreviewemailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(outlookEmailRoutes)],
  exports: [RouterModule]
})
export class OutlookEmailRoutingModule {}
