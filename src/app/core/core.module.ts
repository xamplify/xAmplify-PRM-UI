import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TopnavbarComponent } from './topnavbar/topnavbar.component';
import { BottomnavbarComponent } from './bottomnavbar/bottomnavbar.component';
import { LeftsidebarComponent } from './leftsidebar/leftsidebar.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../auth.guard';
import { SlimLoadingBarModule, SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { CopyrightComponent } from './copyright/copyright.component';

@NgModule({
    imports: [CommonModule, RouterModule, SlimLoadingBarModule.forRoot()],
    declarations: [TopnavbarComponent, BottomnavbarComponent, HomeComponent, LeftsidebarComponent, CopyrightComponent],
    exports: [
        TopnavbarComponent, BottomnavbarComponent, HomeComponent, LeftsidebarComponent, CopyrightComponent],
    providers: [AuthGuard, SlimLoadingBarService]
})
export class CoreModule { }
