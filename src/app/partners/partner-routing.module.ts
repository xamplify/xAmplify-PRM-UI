import { NgModule }            from '@angular/core';
import { RouterModule ,Routes}   from '@angular/router';

import {AddContactsComponent} from '../contacts/add-contacts/add-contacts.component';
import { GoogleCallBackComponent } from '../contacts/google-call-back/google-call-back.component';
import { SalesforceCallBackComponent } from '../contacts/salesforce-call-back/salesforce-call-back.component';
import {EditContactsComponent} from '../contacts/edit-contacts/edit-contacts.component';
import {ManageContactsComponent} from  '../contacts/manage-contacts/manage-contacts.component';


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
export class PartnerRoutingModule { }


