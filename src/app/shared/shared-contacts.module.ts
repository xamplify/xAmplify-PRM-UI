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


@NgModule({
        imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, SharedModule, CommonComponentModule ],
        declarations: [AddContactsComponent, ManageContactsComponent,EditContactsComponent,SocialContactsCallbackComponent],
        exports: [FormsModule, CommonModule, RouterModule, AddContactsComponent,ManageContactsComponent,EditContactsComponent,
                  SocialContactsCallbackComponent],
        providers: [SocialPagerService],
})

export class SharedContactsModule { }
