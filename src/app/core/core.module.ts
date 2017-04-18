import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TopnavbarComponent } from './topnavbar/topnavbar.component';
import { BottomnavbarComponent } from './bottomnavbar/bottomnavbar.component';
import { LeftsidebarComponent } from './leftsidebar/leftsidebar.component';
import { HomeComponent } from './home/home.component';

import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from '../auth.guard';

@NgModule( {
    imports: [CommonModule, RouterModule],
    declarations: [TopnavbarComponent, BottomnavbarComponent, HomeComponent, LeftsidebarComponent],
    exports: [
        TopnavbarComponent, BottomnavbarComponent, HomeComponent, LeftsidebarComponent],
    providers: [AuthenticationService, AuthGuard]
})
export class CoreModule { }
