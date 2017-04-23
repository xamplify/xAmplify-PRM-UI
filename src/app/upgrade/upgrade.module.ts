import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UpgradeRoutingModule} from './upgrade-routing.module';
import { UpgradeComponent } from './upgrade/upgrade.component';

@NgModule({
  imports: [
    CommonModule,UpgradeRoutingModule
  ],
  declarations: [UpgradeComponent]
})
export class UpgradeModule { }
