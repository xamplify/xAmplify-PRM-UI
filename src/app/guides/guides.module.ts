import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuidesRoutingModule } from './guides-routing.module';
import { HomeGuideComponent } from './home-guide/home-guide.component';
import { GuideLeftMenuComponent } from './guide-left-menu/guide-left-menu.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { SharedModule } from 'app/shared/shared.module';
import { CommonComponentModule } from 'app/common/common.module';
import { SharedLibraryModule } from 'app/shared/shared-library.module';
import { DashboardModule } from 'app/dashboard/dashboard.module';
import { RouterModule } from '@angular/router';
import { GuideHelpIconComponent } from './guide-help-icon/guide-help-icon.component';


@NgModule({
  imports: [
    CommonModule,
    GuidesRoutingModule,
    DashboardModule, SharedModule,
    CKEditorModule,
    CommonComponentModule,
    SharedLibraryModule,
    RouterModule,
  ],
  providers:[],
  declarations: [HomeGuideComponent, GuideHelpIconComponent],
  exports:[GuideHelpIconComponent],

})
export class GuidesModule { }
