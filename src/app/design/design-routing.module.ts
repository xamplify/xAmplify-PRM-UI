import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DesignComponent} from './design.component';

export const routes: Routes = [
    { path: '', redirectTo: 'add', pathMatch: 'full' },
    { path: 'add', component: DesignComponent },
];

@NgModule({
imports: [
    RouterModule.forChild(routes)
],
exports: [
    RouterModule
],
})

export class DesignRoutingModule { }
