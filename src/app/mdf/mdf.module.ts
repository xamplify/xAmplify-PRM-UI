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
import { CreateMdfRequestComponent } from './create-mdf-request/create-mdf-request.component';
import { ManageMdfRequestFormComponent } from './manage-mdf-request-form/manage-mdf-request-form.component';
import { ChangeMdfRequestComponent } from './change-mdf-request/change-mdf-request.component';
import { EditMdfRequestFormComponent } from './edit-mdf-request-form/edit-mdf-request-form.component';
import { MdfRequestTimelineComponent } from './mdf-request-timeline/mdf-request-timeline.component';
import { AddMdfFundsModalPopupComponent } from './add-mdf-funds-modal-popup/add-mdf-funds-modal-popup.component';
@NgModule({
  imports: [
    CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, MdfRoutingModule
  ],
  declarations: [MdfHtmlComponent, ManageMdfDetailsComponent, ManageMdfRequestsComponent, CreateMdfRequestComponent, ManageMdfRequestFormComponent, ChangeMdfRequestComponent, EditMdfRequestFormComponent, MdfRequestTimelineComponent, AddMdfFundsModalPopupComponent],
  providers: [MdfService]
})
export class MdfModule { }
