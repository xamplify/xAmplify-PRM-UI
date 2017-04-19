import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddContactsComponent } from './add-contacts/add-contacts.component';
import { ManageContactsComponent } from './manage-contacts/manage-contacts.component';
import { EditContactsComponent } from './edit-contacts/edit-contacts.component';
import {GoogleContactsCallbackComponent } from './add-contacts/google-contacts-callback.component';
import {SalesforceContactsCallbackComponent } from './add-contacts/salesforce-contacts-callback.component';
import {DashboardModule} from '../dashboard/dashboard.module';
import {SharedModule} from '../shared/shared.module';
import {ContactRoutingModule} from './contact-routing.module';

@NgModule({
  imports: [
    CommonModule,DashboardModule,SharedModule,ContactRoutingModule
  ],
  declarations: [AddContactsComponent, ManageContactsComponent, EditContactsComponent,GoogleContactsCallbackComponent,
                 SalesforceContactsCallbackComponent]
})
export class ContactsModule { }
