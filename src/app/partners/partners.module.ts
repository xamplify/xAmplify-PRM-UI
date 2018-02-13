import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PartnerRoutingModule } from './partner-routing.module';
import { ManagePartnersComponent } from './manage-partners/manage-partners.component';
import { SharedContactsModule } from '../shared/shared-contacts.module';
import { CommonComponentModule } from '../common/common.module';
import { AddPartnersComponent } from './add-partners/add-partners.component';


@NgModule({
  imports: [
    CommonModule, PartnerRoutingModule, SharedModule, SharedContactsModule, CommonComponentModule
  ],
  providers: [],
  declarations: [ManagePartnersComponent, AddPartnersComponent]
})
export class PartnersModule { }
