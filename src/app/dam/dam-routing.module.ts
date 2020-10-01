import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageDamComponent } from './manage-dam/manage-dam.component';
export const routes: Routes = [
	{ path: "", redirectTo: "manage", pathMatch: "full" },
	{ path: "manage", component: ManageDamComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DamRoutingModule { }
