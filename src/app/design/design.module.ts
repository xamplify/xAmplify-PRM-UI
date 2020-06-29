import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentModule } from '../common/common.module';
import {DesignRoutingModule} from "./design-routing.module";
import {DesignComponent} from './design.component';
import { SharedModule } from '../shared/shared.module';
 
@NgModule({
    imports: [CommonModule,DesignRoutingModule,CommonComponentModule,SharedModule],
    declarations: [DesignComponent],
  })

export class DesignModule { }
