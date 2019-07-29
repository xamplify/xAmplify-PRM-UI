import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";
/************Form Related*************/
import { FormService } from './services/form.service';
import {FormsRoutingModule} from "./forms-routing.module";
import { AddFormComponent } from './add-form/add-form.component';
import { ManageFormComponent } from './manage-form/manage-form.component';
import { FormAnalyticsComponent } from './form-analytics/form-analytics.component';
import { CampaignFormAnalyticsComponent } from './campaign-form-analytics/campaign-form-analytics.component';
import { LandingPageFormAnalyticsComponent } from './landing-page-form-analytics/landing-page-form-analytics.component';
import { LandingPageFormsComponent } from './landing-page-forms/landing-page-forms.component';



@NgModule( {
    imports: [
        CommonModule, SharedModule, ErrorPagesModule,CommonComponentModule,FormsRoutingModule
    ],
    declarations: [AddFormComponent, ManageFormComponent, FormAnalyticsComponent,FormAnalyticsComponent, CampaignFormAnalyticsComponent, LandingPageFormAnalyticsComponent, LandingPageFormsComponent],
    providers: [FormService]
} )
export class FormsModule { }
