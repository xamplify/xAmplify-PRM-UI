import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { InboxComponent } from './inbox/inbox.component';
import { OutlookEmailRoutingModule } from './outlook-email-routing.module';
import { OutlookEmailService } from './outlook-email.service';
import { PreviewemailComponent } from './previewemail/previewemail.component';
import { ComposeEmailComponent } from './compose-email/compose-email.component';
import { CKEditorModule } from "ng2-ckeditor";

@NgModule({
  imports: [CommonModule, SharedModule, OutlookEmailRoutingModule,CKEditorModule],
  declarations: [InboxComponent, PreviewemailComponent,ComposeEmailComponent],
  providers: [OutlookEmailService]
})
export class OutlookEmailModule {}
