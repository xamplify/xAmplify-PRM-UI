import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TopnavbarComponent } from './topnavbar/topnavbar.component';
import { BottomnavbarComponent } from './bottomnavbar/bottomnavbar.component';
import { LeftsidebarComponent } from './leftsidebar/leftsidebar.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../auth.guard';
import { SlimLoadingBarModule, SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { CopyrightComponent } from './copyright/copyright.component';
import { CKEditorModule } from "ng2-ckeditor";
@NgModule({
    imports: [CKEditorModule, CommonModule, RouterModule, SharedModule, SlimLoadingBarModule.forRoot()],
    declarations: [TopnavbarComponent, BottomnavbarComponent, HomeComponent, LeftsidebarComponent, CopyrightComponent,NotificationsComponent],
    exports: [TopnavbarComponent, BottomnavbarComponent, HomeComponent, LeftsidebarComponent, CopyrightComponent, NotificationsComponent],
    providers: [AuthGuard, SlimLoadingBarService]
})
export class CoreModule { }
