import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageCompanyComponent } from './manage-company/manage-company.component';
import { SharedModule } from 'app/shared/shared.module';
import { ErrorPagesModule } from 'app/error-pages/error-pages.module';
import { CommonComponentModule } from 'app/common/common.module';
import { CompanyRoutingModule } from './company-routing.module';

@NgModule({
  imports: [
    CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, CompanyRoutingModule 
 ],
  declarations: [ManageCompanyComponent]
})
export class CompanyModule { }
