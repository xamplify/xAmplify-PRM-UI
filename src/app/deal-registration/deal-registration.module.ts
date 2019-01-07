import { NgModule } from '@angular/core';
import { DealRegistrationComponent } from './deal-registration/deal-registration.component';
import { DealRegistrationRoutingModule } from './deal-registration-routing.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [ DealRegistrationRoutingModule , SharedModule],
  declarations: [ DealRegistrationComponent ]
})
export class DealRegistrationModule { }
