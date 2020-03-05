import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { SelectLandingPageComponent } from './select-landing-page/select-landing-page.component';
import { AddLandingPageComponent } from './add-landing-page/add-landing-page.component';
import { ManageLandingPageComponent } from './manage-landing-page/manage-landing-page.component';
import { PartnerLandingPageComponent } from './partner-landing-page/partner-landing-page.component';
import { LandingPageAnalyticsComponent } from './landing-page-analytics/landing-page-analytics.component';

export const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
    { path: "select", component: SelectLandingPageComponent },
    { path: "add", component: AddLandingPageComponent },
    { path: "manage", component: ManageLandingPageComponent },
    { path: "manage/:categoryId", component: ManageLandingPageComponent },
    { path: "partner", component: PartnerLandingPageComponent },
    { path: ":landingPageId/analytics", component: LandingPageAnalyticsComponent },
    { path: "partner/:alias/analytics", component: LandingPageAnalyticsComponent },
    { path: ":campaignId/campaign/analytics", component: LandingPageAnalyticsComponent },
    { path: ":campaignId/:partnerId/campaign/analytics", component: LandingPageAnalyticsComponent },

    ];
@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )
export class LandingPagesRoutingModule { }
