import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TeamMemberRoutingModule } from './team-member-routing.module';
import { AddTeamMembersComponent } from './add-team-members/add-team-members.component';
import { TeamMemberService } from './services/team-member.service';
import { CommonComponentModule } from '../common/common.module';
import { ManageTeamMembersComponent } from './manage-team-members/manage-team-members.component';

@NgModule({
  imports: [ CommonModule,TeamMemberRoutingModule,SharedModule,CommonComponentModule],/*AutocompleteModule.forRoot() */
  declarations: [AddTeamMembersComponent, ManageTeamMembersComponent],
  providers:[TeamMemberService]
})
export class TeamMemberModule { }
