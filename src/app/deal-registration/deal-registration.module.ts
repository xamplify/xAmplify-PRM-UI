import { NgModule } from '@angular/core';
import { DealRegistrationRoutingModule } from './deal-registration-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DealRegistrationService } from './services/deal-registration.service';
import { CommonComponentModule } from '../common/common.module';
import { CommonModule } from '@angular/common';
import { SharedRssModule } from 'app/shared/shared-rss.module';

@NgModule({
  imports: [ CommonComponentModule,DealRegistrationRoutingModule , SharedModule,CommonModule,SharedRssModule],
  declarations: [],
  providers:[DealRegistrationService],
  exports:[]
})
export class DealRegistrationModule { }
