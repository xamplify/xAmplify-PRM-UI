import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { ContentModuleStatusAnalyticsDTO } from 'app/contacts/models/ContentModuleStatusAnalyticsDTO';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DamService } from 'app/dam/services/dam.service';

@Component({
  selector: 'app-content-module-status-analytics',
  templateUrl: './content-module-status-analytics.component.html',
  styleUrls: ['./content-module-status-analytics.component.css'],
  providers: [DamService]
})
export class ContentModuleStatusAnalyticsComponent implements OnInit {

  @Input() moduleType: string;
  @Output() filterContentByType = new EventEmitter();

  contentModuleStatusAnalyticsDTO: ContentModuleStatusAnalyticsDTO = new ContentModuleStatusAnalyticsDTO();
  countsLoader: boolean = false;

  constructor(private damService: DamService) {

  }

  ngOnInit() {
    this.contentModuleStatusAnalyticsDTO.selectedCategory = 'ALL';
    this.getTileCounts();
  }

  getTileCounts() {
    this.countsLoader = true;
    this.damService.getStatusTileCountsByModuleType(this.moduleType)
      .subscribe(
        response => {
          this.countsLoader = false;
          if (response.data) {
            let data = response.data;
            this.contentModuleStatusAnalyticsDTO.totalCount = data.totalCount;
            this.contentModuleStatusAnalyticsDTO.approvedCount = data.approvedCount;
            this.contentModuleStatusAnalyticsDTO.rejectedCount = data.rejectedCount;
            this.contentModuleStatusAnalyticsDTO.pendingCount = data.pendingCount;
          }
        },
        (error: any) => {
          this.countsLoader = false;
        }
      );
  }

  loadContentByType(selectedCategory: string) {
    this.contentModuleStatusAnalyticsDTO.selectedCategory = selectedCategory;
    this.filterContentByType.emit(selectedCategory);
  }

}
