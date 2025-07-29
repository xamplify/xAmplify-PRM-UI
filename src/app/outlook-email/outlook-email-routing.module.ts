import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';

export const outlookEmailRoutes: Routes = [
  { path: '', redirectTo: 'inbox', pathMatch: 'full' },
  { path: 'inbox', component: InboxComponent }
];

@NgModule({
  imports: [RouterModule.forChild(outlookEmailRoutes)],
  exports: [RouterModule]
})
export class OutlookEmailRoutingModule {}
