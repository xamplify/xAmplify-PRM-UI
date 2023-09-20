import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeGuideComponent } from './home-guide/home-guide.component';
import { GuideLeftMenuComponent } from './guide-left-menu/guide-left-menu.component';

const routes: Routes = [
  { path: '', redirectTo: '/guides', pathMatch: 'full' },
    { path: 'guides', component: HomeGuideComponent },
    { path: ':slug', component: GuideLeftMenuComponent },
    { path: 'search', component: GuideLeftMenuComponent},
    { path: 'search/:moduleName', component:GuideLeftMenuComponent},
    { path: 'guides/:moduleName', component: HomeGuideComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuidesRoutingModule { }
