import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { AddFormComponent } from './add-form/add-form.component';
import { ManageFormComponent } from './manage-form/manage-form.component';
import { FormAnalyticsComponent } from './form-analytics/form-analytics.component';

export const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
    { path: "add", component: AddFormComponent },
    { path: "edit", component: AddFormComponent },
    { path: "manage", component: ManageFormComponent },
    { path: ":alias/analytics", component: FormAnalyticsComponent}
];

@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )

export class FormsRoutingModule { }
