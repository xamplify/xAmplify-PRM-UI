import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedRssModule } from "../../shared/shared-rss.module";
import { RssRoutingModule } from './rss-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { AddCustomFeedsComponent } from './add-custom-feeds/add-custom-feeds.component';
import { ManageCustomFeedsComponent } from './manage-custom-feeds/manage-custom-feeds.component';

@NgModule({
  imports: [CommonModule, RssRoutingModule, FormsModule, SharedRssModule, SharedModule],
  declarations: [AddCustomFeedsComponent, ManageCustomFeedsComponent],
  exports: []
})
export class RssModule { }
