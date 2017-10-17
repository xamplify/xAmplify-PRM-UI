import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardModule} from '../dashboard/dashboard.module';
import {SharedModule} from '../shared/shared.module';
import {PartnerRoutingModule} from './partner-routing.module';
import { SharedContactsModule } from '../shared/shared-contacts.module';


@NgModule({
  imports: [
    CommonModule,DashboardModule,SharedModule,PartnerRoutingModule, SharedContactsModule
  ],
  providers:[]
      , 
  declarations: []
})
export class PartnersModule { }
