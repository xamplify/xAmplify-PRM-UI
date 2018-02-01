import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AddContactsComponent } from '../contacts/add-contacts/add-contacts.component';
import { ManageContactsComponent } from '../contacts/manage-contacts/manage-contacts.component';
import { EditContactsComponent } from '../contacts/edit-contacts/edit-contacts.component';
import { SharedModule } from '../shared/shared.module';
import { GoogleCallBackComponent } from '../contacts/google-call-back/google-call-back.component';
import { SalesforceCallBackComponent } from '../contacts/salesforce-call-back/salesforce-call-back.component';
import { SocialPagerService } from '.././contacts/services/social-pager.service';
import { CommonComponentModule } from '../common/common.module';


@NgModule({
        imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, SharedModule, CommonComponentModule ],
        declarations: [AddContactsComponent, ManageContactsComponent,EditContactsComponent,GoogleCallBackComponent,SalesforceCallBackComponent],
        exports: [FormsModule, CommonModule, RouterModule, AddContactsComponent,ManageContactsComponent,EditContactsComponent,
                  GoogleCallBackComponent,SalesforceCallBackComponent],
        providers: [SocialPagerService],
})

export class SharedContactsModule { }
