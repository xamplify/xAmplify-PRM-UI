import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuidesRoutingModule } from './guides-routing.module';
import { HomeGuideComponent } from './home-guide/home-guide.component';
import { GuideLeftMenuComponent } from './guide-left-menu/guide-left-menu.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { SharedModule } from 'app/shared/shared.module';
import { SharedContactsModule } from 'app/shared/shared-contacts.module';
import { CommonComponentModule } from 'app/common/common.module';
import { SharedLibraryModule } from 'app/shared/shared-library.module';
import { DashboardModule } from 'app/dashboard/dashboard.module';
import { SharedRssModule } from 'app/shared/shared-rss.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    GuidesRoutingModule,
    DashboardModule, SharedModule,
    CKEditorModule,
    CommonComponentModule,
    SharedLibraryModule,
    RouterModule
  ],
  providers:[],
  declarations: [HomeGuideComponent, GuideLeftMenuComponent]
})
export class GuidesModule { }
