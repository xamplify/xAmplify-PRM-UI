import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";
import { MdfRoutingModule } from './mdf-routing.module';
import { MdfService } from './services/mdf.service';
import { MdfHtmlComponent } from './mdf-html/mdf-html.component';
import { ManageMdfDetailsComponent } from './manage-mdf-details/manage-mdf-details.component';
import { ManageMdfRequestsComponent } from './manage-mdf-requests/manage-mdf-requests.component';
@NgModule({
  imports: [
    CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, MdfRoutingModule
  ],
  declarations: [MdfHtmlComponent, ManageMdfDetailsComponent, ManageMdfRequestsComponent],
  providers: [MdfService]
})
export class MdfModule { }
