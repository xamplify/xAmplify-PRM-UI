import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddAndManageTeamMembersComponent } from './add-and-manage-team-members/add-and-manage-team-members.component';
import { VendorRequestReportComponent } from "app/dashboard/vendor-request-report/vendor-request-report.component";

export const routes: Routes = [
  { path: "", redirectTo: "add-team", pathMatch: "full" },
  { path: "add-team", component:  AddAndManageTeamMembersComponent},
  { path: "superadmin-manage-team/:userId", component:  AddAndManageTeamMembersComponent},
  { path: "team-member-request", component:  VendorRequestReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMemberRoutingModule {}
