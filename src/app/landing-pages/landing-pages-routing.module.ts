import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { SelectLandingPageComponent } from './select-landing-page/select-landing-page.component';
import { AddLandingPageComponent } from './add-landing-page/add-landing-page.component';
import { ManageLandingPageComponent } from './manage-landing-page/manage-landing-page.component';

export const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
    { path: "select", component: SelectLandingPageComponent },
    { path: "add", component: AddLandingPageComponent },
    { path: "manage", component: ManageLandingPageComponent },
    ];
@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )
export class LandingPagesRoutingModule { }
