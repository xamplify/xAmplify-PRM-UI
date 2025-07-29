import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { InboxComponent } from './inbox/inbox.component';
import { OutlookEmailRoutingModule } from './outlook-email-routing.module';
import { OutlookEmailService } from './outlook-email.service';

@NgModule({
  imports: [CommonModule, SharedModule, OutlookEmailRoutingModule],
  declarations: [InboxComponent],
  providers: [OutlookEmailService]
})
export class OutlookEmailModule {}
