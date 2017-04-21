import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginComponent} from './login/login.component';
import { AuthGuard } from './auth.guard';
import {HomeComponent} from './core/home/home.component';
import {VideosModule} from './videos/videos.module';
import {ContactsModule} from './contacts/contacts.module';
import {EmailTemplateModule} from './email-template/email-template.module'

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'home/dashboard', pathMatch: 'full', canActivate: [AuthGuard] },
    {
        path: 'home', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' },
            {path :'emailtemplate', loadChildren :'app/email-template/email-template.module#EmailTemplateModule'},
            { path: 'videos', loadChildren: 'app/videos/videos.module#VideosModule' },
            { path: 'social', loadChildren: 'app/social/social.module#SocialModule' },
            { path: 'contacts', loadChildren: 'app/contacts/contacts.module#ContactsModule' },
        ]
    },
    { path: 'logout', component: LoginComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
