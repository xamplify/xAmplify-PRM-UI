import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { AddFormComponent } from './add-form/add-form.component';
import { ManageFormComponent } from './manage-form/manage-form.component';
import { FormAnalyticsComponent } from './form-analytics/form-analytics.component';
import { LandingPageFormAnalyticsComponent } from './landing-page-form-analytics/landing-page-form-analytics.component';
import { LandingPageFormsComponent } from './landing-page-forms/landing-page-forms.component';
import { SelectFormComponent } from './select-form/select-form.component';
import { SurveyAnalyticsComponent } from './survey-analytics/survey-analytics.component';

export const routes: Routes = [
    { path: "", redirectTo: "manage", pathMatch: "full" },
    { path: "add", component: AddFormComponent },
    { path: "edit", component: AddFormComponent },
    { path: "edit/:categoryId", component: AddFormComponent },
    { path: "manage", component: ManageFormComponent },
    { path: "manage/:categoryId", component: ManageFormComponent },
    { path: ":alias/analytics", component: FormAnalyticsComponent},
    { path: ":alias/survey/analytics", component: SurveyAnalyticsComponent},
    { path: ":alias/:campaignId/:campaignTitle/survey/analytics", component: SurveyAnalyticsComponent},//New
    { path: ":alias/:campaignId/:partnerId/:campaignTitle/survey/analytics", component: SurveyAnalyticsComponent},//New
    { path: ":alias/:campaignAlias/analytics", component: FormAnalyticsComponent},
    { path: "lpf/:alias/:campaignAlias/:campaignTitle/analytics", component: FormAnalyticsComponent},
    { path: "category/:alias/:categoryId/analytics", component: FormAnalyticsComponent},
    { path: ":partner/f/:formId/:partnerLandingPageAlias/analytics", component: FormAnalyticsComponent},
    { path: "lf/:alias/:landingPageAlias/analytics", component: LandingPageFormAnalyticsComponent},
    { path: ":alias/:campaignAlias/:partnerId/analytics/cfa", component: FormAnalyticsComponent},
    { path: "cpfp/:alias/:campaignAlias/:partnerId/:campaignTitle/analytics/cfa", component: FormAnalyticsComponent},
    {path: "lf/:landingPageId",component:LandingPageFormsComponent},
    {path: "partner/lf/:partnerLandingPageAlias",component:LandingPageFormsComponent},
    {path: "category/:categoryId/lf/:landingPageId",component:LandingPageFormsComponent},
    { path: "category/:categoryId/lf/:alias/:landingPageAlias/analytics", component: LandingPageFormAnalyticsComponent},
    { path: "select", component: SelectFormComponent},   
    
];

@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )

export class FormsRoutingModule { }
