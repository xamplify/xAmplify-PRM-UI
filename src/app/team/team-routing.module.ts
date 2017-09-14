import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTeamComponent } from './add-team/add-team.component';
import {ManageTeamComponent} from './manage-team/manage-team.component';

 export const routes: Routes = [
      { path: '', redirectTo:'manageteam',pathMatch:'full'},
      { path: 'add-team', component: AddTeamComponent },                         
      { path: 'manageteam', component: ManageTeamComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule {}