import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { SelectLandingPageComponent } from './select-landing-page/select-landing-page.component';
import { AddLandingPageComponent } from './add-landing-page/add-landing-page.component';
import { ManageLandingPageComponent } from './manage-landing-page/manage-landing-page.component';
import { PartnerLandingPageComponent } from './partner-landing-page/partner-landing-page.component';
import { LandingPageAnalyticsComponent } from './landing-page-analytics/landing-page-analytics.component';
import { PendingChangesGuard } from 'app/component-can-deactivate';

export const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
    { path: "select", component: SelectLandingPageComponent },
    { path: "add", component: AddLandingPageComponent,canDeactivate: [PendingChangesGuard]  },
    { path: "saveAsDefault", component: AddLandingPageComponent,canDeactivate: [PendingChangesGuard]  },
    { path: 'edit/:viewType', component: AddLandingPageComponent,canDeactivate: [PendingChangesGuard] },
    { path: 'edit/:viewType/:categoryId/:folderViewType', component: AddLandingPageComponent,canDeactivate: [PendingChangesGuard] },
    { path: "manage", component: ManageLandingPageComponent },
    { path: "manage/:viewType", component: ManageLandingPageComponent },
    { path: "manage/:viewType/:categoryId/:folderViewType", component: ManageLandingPageComponent },
    { path: "partner", component: PartnerLandingPageComponent },
    { path: "partner/:viewType", component: PartnerLandingPageComponent },
    { path: "partner/:viewType/:categoryId/:folderViewType", component: PartnerLandingPageComponent },
    { path: ":landingPageId/analytics", component: LandingPageAnalyticsComponent },
    { path: "partner/:alias/analytics", component: LandingPageAnalyticsComponent },
    { path: ":campaignId/campaign/analytics", component: LandingPageAnalyticsComponent },
    { path: ":campaignId/:campaignTitle/campaign/analytics", component: LandingPageAnalyticsComponent },
    { path: ":campaignId/:partnerId/campaign/analytics", component: LandingPageAnalyticsComponent },
    { path: ":campaignId/:partnerId/:campaignTitle/campaign/analytics", component: LandingPageAnalyticsComponent },
    { path: ":landingPageId/category/:categoryId/analytics", component: LandingPageAnalyticsComponent }


    ];
@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )
export class LandingPagesRoutingModule { }
