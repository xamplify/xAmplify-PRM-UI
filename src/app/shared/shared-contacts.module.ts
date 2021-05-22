import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AddContactsComponent } from '../contacts/add-contacts/add-contacts.component';
import { ManageContactsComponent } from '../contacts/manage-contacts/manage-contacts.component';
import { EditContactsComponent } from '../contacts/edit-contacts/edit-contacts.component';
import { SharedModule } from '../shared/shared.module';
import { SocialPagerService } from '.././contacts/services/social-pager.service';
import { CommonComponentModule } from '../common/common.module';
import { SocialContactsCallbackComponent } from '../contacts/social-contacts-callback/social-contacts-callback.component';
import { SharedLibraryModule } from '../shared/shared-library.module';
import { AddContactModalComponent } from '../contacts/add-contact-modal/add-contact-modal.component';
import { UserlistUsersComponent } from 'app/contacts/userlist-users/userlist-users.component';

@NgModule({
        imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, SharedModule, CommonComponentModule, SharedLibraryModule ],
        declarations: [AddContactsComponent, ManageContactsComponent,EditContactsComponent,SocialContactsCallbackComponent, AddContactModalComponent, UserlistUsersComponent],
        exports: [FormsModule, CommonModule, RouterModule, AddContactsComponent,ManageContactsComponent,EditContactsComponent,
                  SocialContactsCallbackComponent, AddContactModalComponent, UserlistUsersComponent],
        providers: [SocialPagerService],
})

export class SharedContactsModule { }
