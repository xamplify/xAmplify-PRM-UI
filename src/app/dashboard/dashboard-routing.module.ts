import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DefaultPageComponent } from './default-page/default-page.component';
import { MyProfileComponent } from './user-profile/my-profile/my-profile.component';
import { ViewsReportComponent } from './views-report/views-report.component';
import { TableAdvanceComponent } from './table-advance/table-advance.component';
import { ExtraFaqComponent } from './extra-faq/extra-faq.component';
import { ProfileHelpComponent } from './user-profile/profile-help/profile-help.component';
import { FollowersComponent } from './followers/followers.component';
import { SharedComponent } from './shared/shared.component';

const routes: Routes = [
                        { path: '', component: DashboardComponent},
                        { path: 'table_advance', component: TableAdvanceComponent},
                        { path:'myprofile' ,component:MyProfileComponent},
                        { path: 'views_report', component: ViewsReportComponent },
                        { path: 'extrafaq', component: ExtraFaqComponent },
                        { path: 'welcome', component: WelcomeComponent },
                        { path: 'default', component: DefaultPageComponent },
                        { path: 'profilehelp', component: ProfileHelpComponent },
                        { path: 'followers', component: FollowersComponent },
                        { path: 'shared', component: SharedComponent }
                      ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DasboardRoutingModule { }


