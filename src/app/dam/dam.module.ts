import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";
import { DamRoutingModule } from './dam-routing.module';
import { ManageDamComponent } from './manage-dam/manage-dam.component';
import {DamService} from './services/dam.service';
import { AddDamComponent } from './add-dam/add-dam.component';
@NgModule({
  imports: [
    CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, DamRoutingModule
  ],
  declarations: [ManageDamComponent, AddDamComponent],
providers: [DamService]
})
export class DamModule { }
