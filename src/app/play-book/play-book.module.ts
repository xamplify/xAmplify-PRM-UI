import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";
import { PlayBookRoutingModule } from './play-book-routing.module'
import { AddPlayBookComponent } from './add-play-book/add-play-book.component';
import { ManagePlayBookComponent } from './manage-play-book/manage-play-book.component';
import { PreviewPlayBookComponent } from './preview-play-book/preview-play-book.component';
import { TracksPlayBookUtilService } from 'app/tracks-play-book-util/services/tracks-play-book-util.service';
import { PlayBookAnalyticsComponent } from './play-book-analytics/play-book-analytics.component';
import { PlayBookPartnerAnalyticsComponent } from './play-book-partner-analytics/play-book-partner-analytics.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, PlayBookRoutingModule
  ],
  declarations: [AddPlayBookComponent, ManagePlayBookComponent, PreviewPlayBookComponent, PlayBookAnalyticsComponent, PlayBookPartnerAnalyticsComponent],
  providers: [TracksPlayBookUtilService]
})
export class PlayBookModule { }
