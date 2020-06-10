import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddTeamMembersComponent } from "./add-team-members/add-team-members.component";
import {ManageTeamMembersComponent} from "./manage-team-members/manage-team-members.component";

export const routes: Routes = [
  { path: "", redirectTo: "add-team", pathMatch: "full" },
  { path: "add-team-old", component: AddTeamMembersComponent },
  { path: "add-team", component: ManageTeamMembersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMemberRoutingModule {}
