import { NgModule }            from '@angular/core';
import { RouterModule ,Routes}   from '@angular/router';

import {AddPartnersComponent} from './add-partners/add-partners.component';
import { GoogleCallBackComponent } from './google-call-back/google-call-back.component';
import { SalesforceCallBackComponent } from './salesforce-call-back/salesforce-call-back.component';

import {EditPartnersComponent} from './edit-partners/edit-partners.component';
import {ManagePartnersComponent} from  './manage-partners/manage-partners.component';


const routes: Routes =  [ 
                          { path: '',redirectTo:'add' ,pathMatch:'full'},                             
                          { path: 'add', component: AddPartnersComponent },
                          { path: 'manage',component:ManagePartnersComponent},
                          { path: 'google-callback', component: GoogleCallBackComponent },
                          { path: 'salesforce-callback', component: SalesforceCallBackComponent }
                           ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerRoutingModule { }


