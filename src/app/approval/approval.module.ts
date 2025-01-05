import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalRoutingModule } from './approval-routing.module';
import { CommonComponentModule } from 'app/common/common.module';
import { ErrorPagesModule } from 'app/error-pages/error-pages.module';
import { SharedModule } from 'app/shared/shared.module';
import { ManageAprrovalComponent } from './manage-aprroval/manage-aprroval.component';

@NgModule({
  imports: [
    CommonModule,
    ApprovalRoutingModule, CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule
  ],
  declarations: [ManageAprrovalComponent]
})
export class ApprovalModule { }
