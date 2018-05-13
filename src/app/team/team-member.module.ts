import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TeamMemberRoutingModule } from './team-member-routing.module';
import { ManageTeamMembersComponent } from './manage-team-members/manage-team-members.component';
import { AddTeamMembersComponent } from './add-team-members/add-team-members.component';
import { TeamMemberService } from './services/team-member.service';
import { CommonComponentModule } from '../common/common.module';
//Import your library
/*import { AutocompleteModule } from 'ng2-input-autocomplete';*/

@NgModule({
  imports: [ CommonModule,TeamMemberRoutingModule,SharedModule,CommonComponentModule],/*AutocompleteModule.forRoot() */
  declarations: [ManageTeamMembersComponent, AddTeamMembersComponent],
  providers:[TeamMemberService]
})
export class TeamMemberModule { }
