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
import { AuthGuardService } from '../auth-guard.service';

import { SlimLoadingBarModule, SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { CopyrightComponent } from './copyright/copyright.component';
import { CKEditorModule } from "ng2-ckeditor";
import { SelectContentModulesComponent } from './select-content-modules/select-content-modules.component';
import { Top4AssetsComponent } from '../dashboard/dashboard-analytics-components/top-4-assets/top-4-assets.component';
import { Top4TracksAndPlayBooksComponent } from '../dashboard/dashboard-analytics-components/top-4-tracks-and-play-books/top-4-tracks-and-play-books.component';
import { CustomCopyrightComponent } from './custom-copyright/custom-copyright.component';
import { TopNavigationBarUtilComponent } from 'app/common/top-navigation-bar-util/top-navigation-bar-util.component';
import { WelcomePageComponent } from 'app/common/welcome-page/welcome-page.component';


@NgModule({
	imports: [CKEditorModule, CommonModule, RouterModule, SharedModule, SlimLoadingBarModule.forRoot()],
	declarations: [TopnavbarComponent, BottomnavbarComponent, HomeComponent, LeftsidebarComponent, CopyrightComponent, NotificationsComponent, SelectContentModulesComponent,
					Top4AssetsComponent,Top4TracksAndPlayBooksComponent, CustomCopyrightComponent, TopNavigationBarUtilComponent,WelcomePageComponent ],
	exports: [TopnavbarComponent, BottomnavbarComponent, HomeComponent, LeftsidebarComponent, CopyrightComponent, NotificationsComponent,
				Top4AssetsComponent,Top4TracksAndPlayBooksComponent,TopNavigationBarUtilComponent,WelcomePageComponent],
	providers: [AuthGuard, SlimLoadingBarService,AuthGuardService]
})
export class CoreModule { }
