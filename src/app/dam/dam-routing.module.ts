import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageDamComponent } from './manage-dam/manage-dam.component';
import { AddDamComponent } from './add-dam/add-dam.component';

export const routes: Routes = [
	{ path: "", redirectTo: "manage", pathMatch: "full" },
	{ path: "manage", component: ManageDamComponent },
	{ path: "manage/:viewType", component: ManageDamComponent },
	{ path: "add", component: AddDamComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DamRoutingModule { }
