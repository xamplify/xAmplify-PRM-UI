import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentModuleStatusAnalyticsDTO } from 'app/contacts/models/ContentModuleStatusAnalyticsDTO';
import { DamService } from 'app/dam/services/dam.service';
import { ApproveService } from 'app/approval/service/approve.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

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
  moduleLabel: string;

  constructor(private approveService: ApproveService, private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    this.contentModuleStatusAnalyticsDTO.selectedCategory = 'ALL';
    this.setModuleTypeLabel();
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
    this.contentModuleStatusAnalyticsDTO.draftCount = data.draftCount;
    this.contentModuleStatusAnalyticsDTO.pendingCount = data.pendingCount;
  }

  loadContentByType(selectedCategory: string) {
    this.contentModuleStatusAnalyticsDTO.selectedCategory = selectedCategory;
    this.filterContentByType.emit(selectedCategory);
  }

  getTileCountsForApproveModule() {
    this.countsLoader = true;
    this.approveService.getStatusTileCounts(this.filterType)
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

  setModuleTypeLabel() {
    if (this.moduleType.toLowerCase() == 'dam') {
      this.moduleLabel = 'assets';
    } else if (this.moduleType.toLowerCase() === 'approve') {
      this.moduleLabel = 'records';
    } else if (this.moduleType.toLowerCase() === 'track') {
      this.moduleLabel = 'tracks';
    } else if (this.moduleType.toLowerCase() === 'playbook') {
      this.moduleLabel = 'playbooks';
    } else {
      this.moduleLabel = '';
    }
  }

}
