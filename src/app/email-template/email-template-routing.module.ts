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
import {CkEditorUploadComponent} from '../ck-editor-upload-component/ck-editor-upload-component.component';
import { PendingChangesGuard } from 'app/component-can-deactivate';
import { ManageEmailTemplatesComponent } from './manage-email-templates/manage-email-templates.component';


export const emailRoutes: Routes = [
{ path: '', redirectTo: 'manage', pathMatch: 'full' },
{ path: 'manage-dep', component: ManageTemplateComponent },
{ path: 'manage-dep/:categoryId', component: ManageTemplateComponent },
{ path: "manage", component: ManageEmailTemplatesComponent },
{ path: "manage/:viewType", component: ManageEmailTemplatesComponent },
{ path: "manage/:viewType/:categoryId/:folderViewType", component: ManageEmailTemplatesComponent },
{ path: 'select', component: SelectTemplateComponent },
{ path: 'create', component: CreateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'saveAs', component: CreateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'edit', component: CreateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'edit/:categoryId', component: CreateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'upload/:type', component: CkEditorUploadComponent },
{ path: 'update', component: UpdateTemplateComponent },
{ path: 'update/:categoryId', component: UpdateTemplateComponent },
{ path: 'videoEmails/emaileditor', component: EmailEditorComponent },
{ path: 'regularEmails/emaileditor', component: EmailEditorComponent },
{ path: 'help', component: HelpComponent },
{ path: 'hubspot-callback',component:SocialContactsCallbackComponent},
{ path: 'hubspot/upload', component: UploadMarketoEmailTemplateComponent },
{ path: 'hubspot/update', component: UpdateMarketoTemplateComponent }
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
