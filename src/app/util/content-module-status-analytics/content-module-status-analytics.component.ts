import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentModuleStatusAnalyticsDTO } from 'app/contacts/models/ContentModuleStatusAnalyticsDTO';
import { DamService } from 'app/dam/services/dam.service';
import { ApproveService } from 'app/approval/service/approve.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { LmsService } from 'app/lms/services/lms.service';

@Component({
  selector: 'app-content-module-status-analytics',
  templateUrl: './content-module-status-analytics.component.html',
  styleUrls: ['./content-module-status-analytics.component.css'],
  providers: [DamService,ApproveService,LmsService]
})
export class ContentModuleStatusAnalyticsComponent implements OnInit {

  @Input() moduleType: string;
  @Input() filterType: string;
  @Input() toDateFilter : string;
  @Input() fromDateFilter : string;
  @Output() filterContentByType = new EventEmitter();
  @Input() showApprovalTiles : boolean = false;

  contentModuleStatusAnalyticsDTO: ContentModuleStatusAnalyticsDTO = new ContentModuleStatusAnalyticsDTO();
  countsLoader: boolean = false;
  timeZone: string;
  moduleLabel: string;
  manageContentCounts: any;
  contentCountsLoader: boolean = false;
  hideContentTiles: boolean = false;

  constructor(private approveService: ApproveService, private authenticationService: AuthenticationService, private lmsService:LmsService) {

  }

  ngOnInit() {
     this.contentModuleStatusAnalyticsDTO.selectedCategory = 'ALL';
      this.setModuleTypeLabel();
      if (this.moduleType == 'APPROVE') {
        this.getTileCountsForApproveModule();
        this.hideContentTiles = true;
      } else {
        this.getTileCounts();
        this.getContentCounts();
      }
  }

  ngOnChanges() {
    if (this.moduleType == 'APPROVE') {
      this.getTileCountsForApproveModule();
      this.hideContentTiles = true;
    } else if(!this.showApprovalTiles){
       this.getContentCounts();
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

     getContentCounts() {
    this.contentCountsLoader = true;
      this.lmsService.getManageContentCounts(this.moduleType).subscribe(
        (response: any) => {
          this.contentCountsLoader = false;
          if (response.statusCode == 200) {
            this.manageContentCounts = response.map;
          }
        },
        (_error: any) => {
          this.contentCountsLoader = false;
        }
      );
    }

}
