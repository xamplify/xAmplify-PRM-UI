import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PartnerRoutingModule } from './partner-routing.module';
import { ManagePartnersComponent } from './manage-partners/manage-partners.component';


@NgModule({
  imports: [
    CommonModule, PartnerRoutingModule, SharedModule
  ],
  providers: [],
  declarations: [ManagePartnersComponent]
})
export class PartnersModule { }
