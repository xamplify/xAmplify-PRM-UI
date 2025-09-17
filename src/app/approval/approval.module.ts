import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalRoutingModule } from './approval-routing.module';
import { CommonComponentModule } from 'app/common/common.module';
import { ErrorPagesModule } from 'app/error-pages/error-pages.module';
import { SharedModule } from 'app/shared/shared.module';
import { ManageApprovalComponent } from './manage-approval/manage-approval.component';

@NgModule({
  imports: [
    CommonModule,
    ApprovalRoutingModule, CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule
  ],
  declarations: [ManageApprovalComponent]
})
export class ApprovalModule { }
