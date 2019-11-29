import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentModule } from '../common/common.module';
import {DesignRoutingModule} from "./design-routing.module";
import {DesignComponent} from './design.component';

@NgModule({
    imports: [CommonModule,DesignRoutingModule,CommonComponentModule],
    declarations: [DesignComponent],
  })

export class DesignModule { }
