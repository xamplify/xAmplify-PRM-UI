import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { AddLandingPageComponent } from './add-landing-page/add-landing-page.component';

export const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
    { path: "add", component: AddLandingPageComponent },
    ];
@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )
export class LandingPagesRoutingModule { }
