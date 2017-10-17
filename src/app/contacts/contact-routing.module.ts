import { NgModule }            from '@angular/core';
import { RouterModule ,Routes}   from '@angular/router';

import {AddContactsComponent} from './add-contacts/add-contacts.component';
import { GoogleCallBackComponent } from './google-call-back/google-call-back.component';
import { SalesforceCallBackComponent } from './salesforce-call-back/salesforce-call-back.component';

import {EditContactsComponent} from './edit-contacts/edit-contacts.component';
import {ManageContactsComponent} from  './manage-contacts/manage-contacts.component';


const routes: Routes =  [ 
                          { path: '',redirectTo:'add' ,pathMatch:'full'},                             
                          { path: 'add', component: AddContactsComponent },
                          { path: 'manage',component:ManageContactsComponent},
                          { path: 'google-callback', component: GoogleCallBackComponent },
                          { path: 'salesforce-callback', component: SalesforceCallBackComponent },
                           ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactRoutingModule { }


