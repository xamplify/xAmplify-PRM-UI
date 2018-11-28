import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule} from '../shared/shared.module';
import { ErrorPagesModule } from '../error-pages/error-pages.module';
import { CommonComponentModule} from '../common/common.module';
import { ContentManagementRoutingModule } from './content-management-routing.module';
import { ContentManagementComponent } from './content-management.component';


@NgModule({
  imports: [CommonModule,SharedModule,ContentManagementRoutingModule,ErrorPagesModule,CommonComponentModule],
  declarations: [ContentManagementComponent]
})
export class ContentManagementModule { }
