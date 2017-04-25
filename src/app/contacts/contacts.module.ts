import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddContactsComponent } from './add-contacts/add-contacts.component';
import { ManageContactsComponent } from './manage-contacts/manage-contacts.component';
import { EditContactsComponent } from './edit-contacts/edit-contacts.component';
import {DashboardModule} from '../dashboard/dashboard.module';
import {SharedModule} from '../shared/shared.module';
import {ContactRoutingModule} from './contact-routing.module';
import { GoogleCallBackComponent } from './google-call-back/google-call-back.component';
import { SalesforceCallBackComponent } from './salesforce-call-back/salesforce-call-back.component';

@NgModule({
  imports: [
    CommonModule,DashboardModule,SharedModule,ContactRoutingModule
  ],
  declarations: [AddContactsComponent, ManageContactsComponent, EditContactsComponent,
                 GoogleCallBackComponent,
                 SalesforceCallBackComponent]
})
export class ContactsModule { }
