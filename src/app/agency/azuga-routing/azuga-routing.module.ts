import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { DevicesInfoComponent } from 'app/azuga/devices-info/devices-info.component';
export const routes: Routes = [
  { path: "", redirectTo: "devices", pathMatch: "full" },
	{ path: "devices", component: DevicesInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AzugaRoutingModule { }
