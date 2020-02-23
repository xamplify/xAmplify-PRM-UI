import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";;
import {CkEditorUploadComponent} from "./ck-editor-upload-component.component";
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  imports: [
      CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule,RouterModule,CKEditorModule
  ],
  declarations: [CkEditorUploadComponent],
})
export class CkEditorUploadComponentModule { }
