import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailEditorComponent } from './email-editor/email-editor.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { UpdateTemplateComponent } from './update-template/update-template.component';
import { HelpComponent } from './help/help.component';
import { UploadMarketoEmailTemplateComponent } from './upload-marketo-email-template/upload-marketo-email-template.component';
import { UpdateMarketoTemplateComponent } from './update-marketo-template/update-marketo-template.component';
import { SocialContactsCallbackComponent } from 'app/contacts/social-contacts-callback/social-contacts-callback.component';
import {CkEditorUploadComponent} from '../ck-editor-upload-component/ck-editor-upload-component.component';
import { PendingChangesGuard } from 'app/component-can-deactivate';
import { ManageEmailTemplatesComponent } from './manage-email-templates/manage-email-templates.component';


export const emailRoutes: Routes = [
{ path: '', redirectTo: 'manage', pathMatch: 'full' },
{ path: "manage", component: ManageEmailTemplatesComponent },
{ path: "manage/:viewType", component: ManageEmailTemplatesComponent },
{ path: "manage/:viewType/:categoryId/:folderViewType", component: ManageEmailTemplatesComponent },
{ path: 'select', component: SelectTemplateComponent },
{ path: 'create', component: CreateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'saveAs', component: CreateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'edit', component: CreateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'edit/:viewType', component: CreateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'edit/:viewType/:categoryId/:folderViewType', component: CreateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'upload/:type', component: CkEditorUploadComponent ,canDeactivate: [PendingChangesGuard]},
{ path: 'update', component: UpdateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'update/:viewType', component: UpdateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'update/:viewType/:categoryId/:folderViewType', component: UpdateTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'videoEmails/emaileditor', component: EmailEditorComponent },
{ path: 'regularEmails/emaileditor', component: EmailEditorComponent },
{ path: 'help', component: HelpComponent },
{ path: 'hubspot-callback',component:SocialContactsCallbackComponent},
{ path: 'hubspot/upload', component: UploadMarketoEmailTemplateComponent,canDeactivate: [PendingChangesGuard] },
{ path: 'hubspot/update', component: UpdateMarketoTemplateComponent,canDeactivate: [PendingChangesGuard] }
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
