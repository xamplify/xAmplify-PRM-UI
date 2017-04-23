import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {TableEditableComponent} from './table-editable/table-editable.component';
import {ManageTeamComponent} from './manage-team/manage-team.component';

 export const routes: Routes = [
      { path: '', redirectTo:'manageteam',pathMatch:'full'},
      { path: 'manageteam', component: TableEditableComponent },                         
      { path: 'tableeditable', component: ManageTeamComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule {}