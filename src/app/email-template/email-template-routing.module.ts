import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailEditorComponent } from './email-editor/email-editor.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ManageTemplateComponent } from './manage-template/manage-template.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { UpdateTemplateComponent } from './update-template/update-template.component';
import { UploadEmailTemplateComponent } from './upload-email-template/upload-email-template.component';
import { HelpComponent } from './help/help.component';
import { UploadMarketoEmailTemplateComponent } from './upload-marketo-email-template/upload-marketo-email-template.component';
import { UpdateMarketoTemplateComponent } from './update-marketo-template/update-marketo-template.component';
import { SocialContactsCallbackComponent } from 'app/contacts/social-contacts-callback/social-contacts-callback.component';

export const emailRoutes: Routes = [
{ path: '', redirectTo: 'manage', pathMatch: 'full' },
{ path: 'manage', component: ManageTemplateComponent },
{ path: 'select', component: SelectTemplateComponent },
{ path: 'create', component: CreateTemplateComponent },
{ path: 'upload', component: UploadEmailTemplateComponent },
{ path: 'marketo/upload', component: UploadMarketoEmailTemplateComponent },
{ path: 'marketo/update', component: UpdateMarketoTemplateComponent },
{ path: 'update', component: UpdateTemplateComponent },
{ path: 'videoEmails/emaileditor', component: EmailEditorComponent },
{ path: 'regularEmails/emaileditor', component: EmailEditorComponent },
{ path: 'help', component: HelpComponent },
{ path: 'hubspot-callback',component:SocialContactsCallbackComponent}
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
