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
import { UnsubscribeContactModalComponent } from '../contacts/unsubscribe-contact-modal/unsubscribe-contact-modal.component';
import { ResubscribeContactModalComponent } from '../contacts/resubscribe-contact-modal/resubscribe-contact-modal.component';
import { AddCompanyContactsComponent } from 'app/contacts/add-company-contacts/add-company-contacts.component';
import { HalopsaauthenticationpopupComponent } from 'app/contacts/halopsaauthenticationpopup/halopsaauthenticationpopup.component';
import { ContactDetailsComponent } from 'app/contacts/contact-details/contact-details.component';

@NgModule({
        imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, SharedModule, CommonComponentModule, SharedLibraryModule ],
        declarations: [AddContactsComponent, ManageContactsComponent,EditContactsComponent,SocialContactsCallbackComponent, AddContactModalComponent,
        UnsubscribeContactModalComponent, ResubscribeContactModalComponent,AddCompanyContactsComponent,HalopsaauthenticationpopupComponent, ContactDetailsComponent],
        exports: [FormsModule, CommonModule, RouterModule, AddContactsComponent,ManageContactsComponent,EditContactsComponent,
                  SocialContactsCallbackComponent, AddContactModalComponent, UnsubscribeContactModalComponent, ResubscribeContactModalComponent,AddCompanyContactsComponent, 
                  HalopsaauthenticationpopupComponent, ContactDetailsComponent],
        providers: [SocialPagerService],
})

export class SharedContactsModule { }
