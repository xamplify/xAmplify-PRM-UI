import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ViewsReportComponent } from './views-report/views-report.component';
import { TableAdvanceComponent } from './table-advance/table-advance.component';
import { ExtraFaqComponent } from './extra-faq/extra-faq.component';

import { DasboardRoutingModule } from './dashboard-routing.module';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardService } from './dashboard.service';
import { ProfileLockComponent } from './user-profile/profile-lock/profile-lock.component';
import { ProfileHelpComponent } from './user-profile/profile-help/profile-help.component';
import { MyProfileComponent } from './user-profile/my-profile/my-profile.component';
import { DefaultPageComponent } from './default-page/default-page.component';
import { FollowersComponent } from './followers/followers.component';
import { SharedComponent } from './shared/shared.component';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { AvarageChartComponent } from './views-report/average-chart/average-chart.component';
import { EditCompanyProfileComponent } from './company-profile/edit-company-profile/edit-company-profile.component';
import { CompanyProfileService } from './company-profile/services/company-profile.service';
import { ReportsComponent } from './dashboard/reports/reports.component';

@NgModule({
    imports: [DasboardRoutingModule, SharedModule, CoreModule, CommonModule, DragulaModule],
    declarations: [DashboardComponent, TableAdvanceComponent, ViewsReportComponent, ExtraFaqComponent,
        WelcomeComponent, MyProfileComponent, ProfileLockComponent, ProfileHelpComponent, DefaultPageComponent,
        FollowersComponent, SharedComponent,AvarageChartComponent,EditCompanyProfileComponent, ReportsComponent
    ],
    exports: [],
    providers: [DashboardService,CompanyProfileService]
})
export class DashboardModule { }
