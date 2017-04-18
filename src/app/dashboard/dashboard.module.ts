import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ViewsReportComponent } from './views-report/views-report.component';
import { TableAdvanceComponent } from './table-advance/table-advance.component';
import { ExtraFaqComponent } from './extra-faq/extra-faq.component';

import{DasboardRoutingModule} from './dashboard-routing.module';
import {CoreModule} from '../core/core.module';
import {SharedModule} from '../shared/shared.module';

import {DashboardService} from './dashboard.service';

@NgModule({
    imports: [DasboardRoutingModule,SharedModule,CoreModule,CommonModule],
    declarations: [DashboardComponent,TableAdvanceComponent,MyProfileComponent,ViewsReportComponent,ExtraFaqComponent,
                   WelcomeComponent
    ],
   exports :[],
    providers: [DashboardService]
})
export class DashboardModule { }
