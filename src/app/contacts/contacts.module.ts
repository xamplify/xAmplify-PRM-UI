import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardModule } from '../dashboard/dashboard.module';
import { SharedModule } from '../shared/shared.module';
import { ContactRoutingModule } from './contact-routing.module';
import { SharedContactsModule } from '../shared/shared-contacts.module';
import { WorkflowFormComponent } from './workflow-form/workflow-form.component';
import { CKEditorComponent, CKEditorModule } from 'ng2-ckeditor';



@NgModule({
  imports: [
    CommonModule, DashboardModule, SharedModule, ContactRoutingModule, SharedContactsModule,CKEditorModule
  ],
  providers: []
  ,
  declarations: []
})
export class ContactsModule { }
