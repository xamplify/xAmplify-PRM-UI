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
import { CommonComponentModule } from '../common/common.module';

import { DashboardService } from './dashboard.service';
import { ProfileLockComponent } from './user-profile/profile-lock/profile-lock.component';
import { ProfileHelpComponent } from './user-profile/profile-help/profile-help.component';
import { MyProfileComponent } from './user-profile/my-profile/my-profile.component';
import { DefaultPageComponent } from './default-page/default-page.component';
import { FollowersComponent } from './followers/followers.component';
import { SharedComponent } from './shared/shared.component';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { EditCompanyProfileComponent } from './company-profile/edit-company-profile/edit-company-profile.component';
import { CompanyProfileService } from './company-profile/services/company-profile.service';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { CompanyPageComponent } from './company-profile/company-page/company-page.component';
import { PartnerNotificationComponent } from './partner-notification/partner-notification.component';

@NgModule({
    imports: [DasboardRoutingModule, SharedModule, CoreModule, CommonModule, DragulaModule, CommonComponentModule],
    declarations: [DashboardComponent, TableAdvanceComponent, ViewsReportComponent, ExtraFaqComponent,
        WelcomeComponent, MyProfileComponent, ProfileLockComponent, ProfileHelpComponent, DefaultPageComponent,
        FollowersComponent, SharedComponent,EditCompanyProfileComponent, ReportsComponent, CompanyPageComponent, PartnerNotificationComponent
    ],
    exports: [],
    providers: [DashboardService,CompanyProfileService]
})
export class DashboardModule { }
