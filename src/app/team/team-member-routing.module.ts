import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ManageTeamMembersComponent } from "./manage-team-members/manage-team-members.component";
import { AddTeamMembersComponent } from "./add-team-members/add-team-members.component";

export const routes: Routes = [
  { path: "", redirectTo: "manageteam", pathMatch: "full" },
  { path: "add-team", component: AddTeamMembersComponent },
  { path: "manageteam", component: ManageTeamMembersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMemberRoutingModule {}
