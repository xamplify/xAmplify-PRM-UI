import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { EmailEditorComponent } from './email-editor/email-editor.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ManageTemplateComponent } from './manage-template/manage-template.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { UpdateTemplateComponent } from './update-template/update-template.component';
import { UploadEmailTemplateComponent } from './upload-email-template/upload-email-template.component';
import {HelpComponent} from './help/help.component';

export const emailRoutes: Routes = [
{ path: '', redirectTo: 'manageTemplates', pathMatch: 'full' },
{ path: 'manageTemplates', component: ManageTemplateComponent },
{ path: 'selectTemplate', component: SelectTemplateComponent },
{ path: 'createTemplate', component: CreateTemplateComponent },
{ path: 'uploadTemplate', component: UploadEmailTemplateComponent },
{ path: 'updateTemplate', component: UpdateTemplateComponent },
{ path: 'videoEmails/emaileditor', component: EmailEditorComponent },
{ path: 'regularEmails/emaileditor', component: EmailEditorComponent },
{ path: 'help', component: HelpComponent },
];

@NgModule({
imports: [
    RouterModule.forChild(emailRoutes)
],
exports: [
    RouterModule
],
})

export class EmailTemplateRoutingModule { }
