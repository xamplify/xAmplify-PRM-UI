import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UpdateStatusComponent } from '../util/update-status/update-status.component';


const routes: Routes = [
    { path: 'update-status', component: UpdateStatusComponent },

];


@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})
export class SocialRoutingModule { }