import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddPartnersComponent} from './add-partners/add-partners.component';
import { ManagePartnersComponent } from './manage-partners/manage-partners.component';
import {EditPartnersComponent} from './edit-partners/edit-partners.component';
import {DashboardModule} from '../dashboard/dashboard.module';
import {SharedModule} from '../shared/shared.module';
import {PartnerRoutingModule} from './partner-routing.module';
import { GoogleCallBackComponent } from './google-call-back/google-call-back.component';
import { SalesforceCallBackComponent } from './salesforce-call-back/salesforce-call-back.component';
import { SocialPagerService } from '.././contacts/services/social-pager.service';

@NgModule({
  imports: [
    CommonModule,DashboardModule,SharedModule,PartnerRoutingModule
  ],
  providers:[SocialPagerService]
      , 
  declarations: [AddPartnersComponent, ManagePartnersComponent, EditPartnersComponent,
                 GoogleCallBackComponent,
                 SalesforceCallBackComponent]
})
export class PartnersModule { }
