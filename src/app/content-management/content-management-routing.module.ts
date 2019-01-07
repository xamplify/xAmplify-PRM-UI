import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentManagementComponent } from './content-management.component';


export const contentManagementRoutes: Routes = [
    { path: '', redirectTo: 'manage', pathMatch: 'full' },
    { path: 'manage', component: ContentManagementComponent }
];


@NgModule( {
    imports: [RouterModule.forChild( contentManagementRoutes )],
    exports: [RouterModule],
})
export class ContentManagementRoutingModule { }
