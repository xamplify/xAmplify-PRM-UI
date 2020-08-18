import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";
import { CreateMdfRequestComponent } from './create-mdf-request/create-mdf-request.component';
import { ManageMdfFundsComponent } from './manage-mdf-funds/manage-mdf-funds.component';
import { ManageMdfRequestsComponent } from './manage-mdf-requests/manage-mdf-requests.component';
import { MdfService } from './services/mdf.service';
import {MdfRoutingModule} from './mdf-routing.module';
import { HtmlSampleComponent } from './html-sample/html-sample.component';
import { ListVendorsComponent } from './list-vendors/list-vendors.component';
import { EditMditRequestComponent } from './edit-mdit-request/edit-mdit-request.component';
import { ViewTimeLineComponent } from './view-time-line/view-time-line.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, MdfRoutingModule
  ],
  declarations: [CreateMdfRequestComponent,ManageMdfFundsComponent,ManageMdfRequestsComponent, HtmlSampleComponent, ListVendorsComponent, EditMditRequestComponent, ViewTimeLineComponent],
  providers :[MdfService]
})
export class MdfModule { }
