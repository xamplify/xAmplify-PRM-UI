import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule} from '../shared/shared.module';
import { ErrorPagesModule } from '../error-pages/error-pages.module';
import { CommonComponentModule} from '../common/common.module';
import { EmailEditorComponent } from './email-editor/email-editor.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ManageTemplateComponent } from './manage-template/manage-template.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { UpdateTemplateComponent } from './update-template/update-template.component';
import { UploadEmailTemplateComponent } from './upload-email-template/upload-email-template.component';

import {EmailTemplateRoutingModule} from './email-template-routing.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { HelpComponent } from './help/help.component';
import { UploadMarketoEmailTemplateComponent } from './upload-marketo-email-template/upload-marketo-email-template.component';
import { UpdateMarketoTemplateComponent } from './update-marketo-template/update-marketo-template.component';
import { SharedContactsModule } from 'app/shared/shared-contacts.module';
import {CkEditorUploadComponentModule} from '../ck-editor-upload-component/ck-editor-upload-component.module';
import { SelectEmailTemplatesFilterPipe } from './select-email-templates-filter.pipe';





@NgModule({
  imports: [ CommonModule,SharedModule,EmailTemplateRoutingModule,CKEditorModule, ErrorPagesModule,CommonComponentModule,SharedContactsModule,CkEditorUploadComponentModule ],
  declarations: [EmailEditorComponent, CreateTemplateComponent,ManageTemplateComponent, SelectTemplateComponent,
                 UpdateTemplateComponent, UploadEmailTemplateComponent, HelpComponent, UploadMarketoEmailTemplateComponent, UpdateMarketoTemplateComponent, SelectEmailTemplatesFilterPipe],
})
export class EmailTemplateModule { }
