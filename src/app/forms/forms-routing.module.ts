import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { AddFormComponent } from './add-form/add-form.component';
import { ManageFormComponent } from './manage-form/manage-form.component';
import { FormAnalyticsComponent } from './form-analytics/form-analytics.component';
import { CampaignFormAnalyticsComponent } from './campaign-form-analytics/campaign-form-analytics.component';
import { LandingPageFormAnalyticsComponent } from './landing-page-form-analytics/landing-page-form-analytics.component';
import { LandingPageFormsComponent } from './landing-page-forms/landing-page-forms.component';
import { CampaignLandingPageFormsComponent } from './campaign-landing-page-forms/campaign-landing-page-forms.component';

export const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
    { path: "add", component: AddFormComponent },
    { path: "edit", component: AddFormComponent },
    { path: "manage", component: ManageFormComponent },
    { path: ":alias/analytics", component: FormAnalyticsComponent},
    { path: ":alias/:campaignAlias/analytics", component: FormAnalyticsComponent},
    { path: "lf/:alias/:landingPageAlias/analytics", component: LandingPageFormAnalyticsComponent},
    {path: "cf/:alias",component:CampaignFormAnalyticsComponent},
    {path: "lf/:landingPageId",component:LandingPageFormsComponent},
    {path: "clpf/:landingPageCampaignId",component:CampaignLandingPageFormsComponent}
];

@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )

export class FormsRoutingModule { }
