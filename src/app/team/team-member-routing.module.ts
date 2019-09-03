import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddTeamMembersComponent } from "./add-team-members/add-team-members.component";

export const routes: Routes = [
  { path: "", redirectTo: "add-team", pathMatch: "full" },
  { path: "add-team", component: AddTeamMembersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMemberRoutingModule {}
