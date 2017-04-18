import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddContactsComponent } from './add-contacts/add-contacts.component';
import { ManageContactsComponent } from './manage-contacts/manage-contacts.component';
import { EditContactsComponent } from './edit-contacts/edit-contacts.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AddContactsComponent, ManageContactsComponent, EditContactsComponent]
})
export class ContactsModule { }
