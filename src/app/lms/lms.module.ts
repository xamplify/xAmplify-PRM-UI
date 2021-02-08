import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";
import { LmsRoutingModule } from './lms-routing.module';
import { LmsService } from './services/lms.service';
import { AddLmsComponent } from './add-lms/add-lms.component';
import { ManageLmsComponent } from './manage-lms/manage-lms.component';
import { CKEditorModule } from 'ng2-ckeditor';


@NgModule({
  imports: [
    CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, LmsRoutingModule, CKEditorModule
  ],
  declarations: [AddLmsComponent, ManageLmsComponent],
  providers: [LmsService]
})
export class LmsModule { }
