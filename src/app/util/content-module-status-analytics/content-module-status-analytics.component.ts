import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentModuleStatusAnalyticsDTO } from 'app/contacts/models/ContentModuleStatusAnalyticsDTO';
import { DamService } from 'app/dam/services/dam.service';
import { ApproveService } from 'app/approval/service/approve.service';

@Component({
  selector: 'app-content-module-status-analytics',
  templateUrl: './content-module-status-analytics.component.html',
  styleUrls: ['./content-module-status-analytics.component.css'],
  providers: [DamService,ApproveService]
})
export class ContentModuleStatusAnalyticsComponent implements OnInit {

  @Input() moduleType: string;
  @Input() filterType: string;
  @Input() toDateFilter : string;
  @Input() fromDateFilter : string;
  @Output() filterContentByType = new EventEmitter();

  contentModuleStatusAnalyticsDTO: ContentModuleStatusAnalyticsDTO = new ContentModuleStatusAnalyticsDTO();
  countsLoader: boolean = false;
  timeZone: string;

  constructor(private approveService: ApproveService) {

  }

  ngOnInit() {
    this.contentModuleStatusAnalyticsDTO.selectedCategory = 'ALL';
    if (this.moduleType == 'APPROVE') {
      this.getTileCountsForApproveModule();
    } else {
      this.getTileCounts();
    }
  }

  ngOnChanges() {
    if (this.moduleType == 'APPROVE') {
      this.getTileCountsForApproveModule();
    }
  }

  getTileCounts() {
    this.countsLoader = true;
    this.approveService.getStatusTileCountsByModuleType(this.moduleType)
      .subscribe(
        response => {
          this.countsLoader = false;
          if (response.data) {
            this.setTilesData(response);
          }
        },
        (error: any) => {
          this.countsLoader = false;
        }
      );
  }

  private setTilesData(response: any) {
    let data = response.data;
    this.contentModuleStatusAnalyticsDTO.totalCount = data.totalCount;
    this.contentModuleStatusAnalyticsDTO.approvedCount = data.approvedCount;
    this.contentModuleStatusAnalyticsDTO.rejectedCount = data.rejectedCount;
    this.contentModuleStatusAnalyticsDTO.pendingCount = data.pendingCount;
  }

  loadContentByType(selectedCategory: string) {
    this.contentModuleStatusAnalyticsDTO.selectedCategory = selectedCategory;
    this.filterContentByType.emit(selectedCategory);
  }

  getTileCountsForApproveModule() {
    this.countsLoader = true;
    this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.approveService.getStatusTileCounts(this.filterType, this.toDateFilter, this.fromDateFilter, this.timeZone)
      .subscribe(
        response => {
          this.countsLoader = false;
          if (response.data) {
            this.setTilesData(response);
          }
        },
        (error: any) => {
          this.countsLoader = false;
        }
      );
  }

}
