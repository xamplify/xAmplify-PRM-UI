import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";
/***********Landing Page Related Components*******/
import { LandingPageService } from './services/landing-page.service';
import {LandingPagesRoutingModule} from "./landing-pages-routing.module";
import { AddLandingPageComponent } from './add-landing-page/add-landing-page.component';
import { SelectLandingPageComponent } from './select-landing-page/select-landing-page.component';
import { ManageLandingPageComponent } from './manage-landing-page/manage-landing-page.component';
import { LandingPageAnalyticsComponent } from './landing-page-analytics/landing-page-analytics.component';
import { LandingPageAnalyticsUtilComponent } from './landing-page-analytics-util/landing-page-analytics-util.component';

@NgModule( {
    imports: [
        CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, LandingPagesRoutingModule
    ],
    declarations: [AddLandingPageComponent, SelectLandingPageComponent, ManageLandingPageComponent, LandingPageAnalyticsComponent, LandingPageAnalyticsUtilComponent],
    providers: [LandingPageService]
})
export class LandingPagesModule { }
