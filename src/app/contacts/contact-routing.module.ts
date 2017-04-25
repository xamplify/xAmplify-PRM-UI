import { NgModule }            from '@angular/core';
import { RouterModule ,Routes}   from '@angular/router';

import {AddContactsComponent} from './add-contacts/add-contacts.component';
import { GoogleCallBackComponent } from './google-call-back/google-call-back.component';
import { SalesforceCallBackComponent } from './salesforce-call-back/salesforce-call-back.component';

import {EditContactsComponent} from './edit-contacts/edit-contacts.component';
import {ManageContactsComponent} from  './manage-contacts/manage-contacts.component';
//import {viewsReportComponent} from '../dashboard/views-report/views-report.component';
//import {TableAdvanceComponent } from '../dashboard/tableadvance/tableadvance.component';


const routes: Routes =  [ 
                          { path:'',redirectTo:'addContacts' ,pathMatch:'full'},                             
                          { path: 'addContacts', component: AddContactsComponent },
                          { path: 'manageContacts',component:ManageContactsComponent},
                          //{ path: 'manageContacts/table_advance', component: TableAdvanceComponent },
                          //{ path: 'manageContacts/views_report', component: viewsReportComponent },
                         // { path: 'manageContacts/all_contacts/views_report', component: viewsReportComponent },
                          { path: 'google-callback', component: GoogleCallBackComponent },
                          { path: 'salesforce-callback', component: SalesforceCallBackComponent }
                           ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactRoutingModule { }


