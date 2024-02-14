import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContactsComponent } from './add-contacts/add-contacts.component';
import { SocialContactsCallbackComponent } from './social-contacts-callback/social-contacts-callback.component';
import { ManageContactsComponent } from './manage-contacts/manage-contacts.component';
import { AddCompanyContactsComponent } from './add-company-contacts/add-company-contacts.component';



const routes: Routes = [
    { path: '', redirectTo: 'add', pathMatch: 'full' },
    { path: 'add', component: AddContactsComponent },
    { path: 'manage', component: ManageContactsComponent },
    { path: 'google-callback', component: SocialContactsCallbackComponent },
    { path: 'zoho-callback', component: SocialContactsCallbackComponent },
    { path: 'salesforce-callback', component: SocialContactsCallbackComponent },
    { path: 'hubspot-callback',component:SocialContactsCallbackComponent},
    { path: 'leads-google-callback', component: SocialContactsCallbackComponent },
    { path: 'leads-zoho-callback', component: SocialContactsCallbackComponent },
    { path: 'leads-salesforce-callback', component: SocialContactsCallbackComponent },
    { path: 'manage/:id', component: ManageContactsComponent },
    { path: 'company/:id', component: AddCompanyContactsComponent },

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactRoutingModule { }


