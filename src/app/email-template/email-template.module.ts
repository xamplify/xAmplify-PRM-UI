import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';

import { EmailEditorComponent } from './email-editor/email-editor.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ManageTemplateComponent } from './manage-template/manage-template.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { UpdateTemplateComponent } from './update-template/update-template.component';
import { UploadEmailTemplateComponent } from './upload-email-template/upload-email-template.component';

import {EmailTemplateRoutingModule} from './email-template-routing.module';

@NgModule({
  imports: [ CommonModule,SharedModule,EmailTemplateRoutingModule ],
  declarations: [EmailEditorComponent, CreateTemplateComponent,ManageTemplateComponent, SelectTemplateComponent,
                 UpdateTemplateComponent, UploadEmailTemplateComponent]
})
export class EmailTemplateModule { }
