import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardModule } from '../dashboard/dashboard.module';
import { SharedModule } from '../shared/shared.module';
import { ContactRoutingModule } from './contact-routing.module';
import { SharedContactsModule } from '../shared/shared-contacts.module';

@NgModule({
  imports: [
    CommonModule, DashboardModule, SharedModule, ContactRoutingModule, SharedContactsModule
  ],
  providers: []
  ,
  declarations: []
})
export class ContactsModule { }
