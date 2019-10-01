import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedRssModule } from "../../shared/shared-rss.module";
import { RssRoutingModule } from './rss-routing.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [CommonModule, RssRoutingModule, FormsModule, SharedRssModule, SharedModule],
  declarations: [],
  exports: []
})
export class RssModule { }
