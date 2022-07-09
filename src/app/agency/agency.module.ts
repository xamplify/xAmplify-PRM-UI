import { AgencyService } from './services/agency.service';
import { NgModule } from '@angular/core';
import { AgencyRoutingModule } from './agency-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ManageAgencyComponent } from './manage-agency/manage-agency.component';
@NgModule({
  imports:[AgencyRoutingModule,SharedModule ],
  declarations: [ManageAgencyComponent],
  providers:[AgencyService]
})
export class AgencyModule { }
