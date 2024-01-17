import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { ErrorPagesModule } from "../error-pages/error-pages.module";
import { CommonComponentModule } from "../common/common.module";
import { DamRoutingModule } from './dam-routing.module';
import { ManageDamComponent } from './manage-dam/manage-dam.component';
import {DamService} from './services/dam.service';
import { AddDamComponent } from './add-dam/add-dam.component';
import { PublishedDamListComponent } from './published-dam-list/published-dam-list.component';
import { UploadAssetComponent } from './upload-asset/upload-asset.component';
import { DamAnalyticsComponent } from './dam-analytics/dam-analytics.component';
import { DamPublishedPartnersAnalyticsComponent } from './dam-published-partners-analytics/dam-published-partners-analytics.component';
import { SelectUploadTypeComponent } from './select-upload-type/select-upload-type.component';
import { ShowHistoryComponent } from './show-history/show-history.component';
import { ViewDamComponent } from './view-dam/view-dam.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { VideoBasedReportsComponent } from '../videos/manage-video/video-based-reports/video-based-reports.component';
import { VideoBaseReportService } from '../videos/services/video-base-report.service';

@NgModule({
  imports: [
    CommonModule, SharedModule, ErrorPagesModule, CommonComponentModule, DamRoutingModule, CKEditorModule
  ],
  declarations: [ManageDamComponent, AddDamComponent, PublishedDamListComponent, UploadAssetComponent, DamAnalyticsComponent, DamPublishedPartnersAnalyticsComponent, SelectUploadTypeComponent, ShowHistoryComponent, ViewDamComponent,
                  VideoBasedReportsComponent],
  providers: [DamService, VideoBaseReportService]
})
export class DamModule { }
