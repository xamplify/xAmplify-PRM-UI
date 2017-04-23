import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamRoutingModule } from './team-routing.module';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { TableEditableComponent } from './table-editable/table-editable.component';

@NgModule({
  imports: [
    CommonModule,TeamRoutingModule
  ],
  declarations: [ManageTeamComponent, TableEditableComponent]
})
export class TeamModule { }
