import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageInsightsComponent } from './manage-insights/manage-insights.component';


const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
    { path: 'manage', component: ManageInsightsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class InsightsRoutingModule { }
