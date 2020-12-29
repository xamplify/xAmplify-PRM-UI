import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {ManageTeamMembersComponent} from "./manage-team-members/manage-team-members.component";

export const routes: Routes = [
  { path: "", redirectTo: "add-team", pathMatch: "full" },
  { path: "add-team", component: ManageTeamMembersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMemberRoutingModule {}
