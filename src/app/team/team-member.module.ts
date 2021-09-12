import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TeamMemberRoutingModule } from './team-member-routing.module';
import { TeamMemberService } from './services/team-member.service';
import { CommonComponentModule } from '../common/common.module';
import { AddAndManageTeamMembersComponent } from './add-and-manage-team-members/add-and-manage-team-members.component';

@NgModule({
  imports: [ CommonModule,TeamMemberRoutingModule,SharedModule,CommonComponentModule],/*AutocompleteModule.forRoot() */
  declarations: [AddAndManageTeamMembersComponent],
  providers:[TeamMemberService]
})
export class TeamMemberModule { }
