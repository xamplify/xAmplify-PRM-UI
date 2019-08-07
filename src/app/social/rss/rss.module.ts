import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedRssModule } from "../../shared/shared-rss.module";
import { RssRoutingModule } from './rss-routing.module';

@NgModule({
  imports: [CommonModule, RssRoutingModule, FormsModule, SharedRssModule],
  declarations: [],
  exports: []
})
export class RssModule { }
