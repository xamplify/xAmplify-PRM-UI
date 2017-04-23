import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {UpgradeComponent} from './upgrade/upgrade.component';


const upgraderoutes: Routes = [
  { path: '', component: UpgradeComponent },
 
];

@NgModule({
  imports: [
    RouterModule.forChild(upgraderoutes)
  ],
  exports: [
    RouterModule
  ],
  
})
export class UpgradeRoutingModule {}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/