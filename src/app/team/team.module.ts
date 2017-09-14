import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TeamRoutingModule } from './team-routing.module';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { AddTeamComponent } from './add-team/add-team.component';

@NgModule({
  imports: [
    CommonModule,TeamRoutingModule,SharedModule
  ],
  declarations: [ManageTeamComponent, AddTeamComponent]
})
export class TeamModule { }
