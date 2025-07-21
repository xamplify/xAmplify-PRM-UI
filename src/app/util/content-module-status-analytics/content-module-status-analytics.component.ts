import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentModuleStatusAnalyticsDTO } from 'app/contacts/models/ContentModuleStatusAnalyticsDTO';
import { DamService } from 'app/dam/services/dam.service';
import { ApproveService } from 'app/approval/service/approve.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { LmsService } from 'app/lms/services/lms.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { TracksPlayBookType } from 'app/tracks-play-book-util/models/tracks-play-book-type.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-module-status-analytics',
  templateUrl: './content-module-status-analytics.component.html',
  styleUrls: ['./content-module-status-analytics.component.css'],
  providers: [DamService, ApproveService, LmsService]
})
export class ContentModuleStatusAnalyticsComponent implements OnInit {

  @Input() moduleType: string;
  @Input() filterType: string;
  @Input() toDateFilter: string;
  @Input() fromDateFilter: string;
  @Output() filterContentByType = new EventEmitter();
  @Input() showApprovalTiles: boolean = false;

  contentModuleStatusAnalyticsDTO: ContentModuleStatusAnalyticsDTO = new ContentModuleStatusAnalyticsDTO();
  countsLoader: boolean = false;
  timeZone: string;
  moduleLabel: string;
  manageContentCounts: any;
  contentCountsLoader: boolean = false;
  hideContentTiles: boolean = false;
  selectedFilter: string = '';
  tracksModule: boolean = false;
  @Input() type: string;
  titleHeader: string = "";

  constructor(private approveService: ApproveService, private authenticationService: AuthenticationService, private lmsService: LmsService, private referenceService: ReferenceService,
    private router: Router) {

  }

  ngOnInit() {

    let selected;
    let isFolderView = this.router.url.includes('/manage/fg') || this.router.url.includes('/manage/fl');
    if (isFolderView) {
      selected = this.referenceService.categoryType = 'folder';
    } else if (this.referenceService.categoryType) {
      selected = this.referenceService.categoryType;
    }

    else if (this.referenceService.categoryType == 'folder') {
      if (this.referenceService.categoryTrackPlaybookType) {
        selected = this.referenceService.categoryType;
        this.referenceService.categoryTrackPlaybookType = false;
      } else {
        this.referenceService.categoryTrackPlaybookType = false;
        selected = '';

      }
    }

    else if (
      this.referenceService.categoryType != 'undefined' &&
      (this.referenceService.categoryType == 'folder' ||
        this.referenceService.categoryType == 'published' ||
        this.referenceService.categoryType == 'DRAFT' ||
        this.referenceService.categoryType == 'ALL' ||
        this.referenceService.categoryType == 'CREATED' ||
        this.referenceService.categoryType == 'REJECTED' ||
        this.referenceService.categoryType == 'APPROVED' ||
        this.referenceService.categoryType == 'unpublished')) {
      selected = this.referenceService.categoryType;
      this.referenceService.categoryType = '';
    }
    else {
      selected = this.referenceService.categoryType = 'all';
    }

    this.selectedFilter = selected;
    this.contentModuleStatusAnalyticsDTO.selectedCategory = selected.toUpperCase();
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
    } else if (!this.showApprovalTiles) {
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
  loadContentByType(selectedCategory: string): void {

    const isFolderView = this.router.url.includes('/manage/fg') || this.router.url.includes('/manage/fl');
    if (selectedCategory != 'folder' && selectedCategory != 'published' && selectedCategory != 'unpublished' && selectedCategory != 'all' && selectedCategory != 'DRAFT' && selectedCategory != 'CREATED' && selectedCategory != 'REJECTED' && selectedCategory != 'ALL' && selectedCategory != 'APPROVED') {
      this.selectedFilter = '';
    }
    if (selectedCategory === 'folder') {
      this.filterAssets(selectedCategory, false);
    }
    else if (isFolderView) {
      this.referenceService.categoryTrackPlaybookType = true;
      this.filterAssets(selectedCategory, true);
    }

    else {
      if (!this.referenceService.categoryTrackPlaybookType) {
        this.referenceService.categoryType = '';
        this.referenceService.categoryTrackPlaybookType = false;
        this.selectedFilter = '';
      }
      if (this.router.url.includes('/manage/l') || this.router.url.includes('/tracks/manage') || this.router.url.includes('/playbook/manage') || this.router.url.includes('/dam/manage')) {
        this.selectedFilter = selectedCategory;
      }


      this.referenceService.categoryType = selectedCategory
      this.contentModuleStatusAnalyticsDTO.selectedCategory = selectedCategory;
      this.filterContentByType.emit(selectedCategory);
    }
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

  filterAssets(tabName: string, isFolderView: any): void {
    const isTracks = this.router.url.includes('/tracks/');
    const isPlaybook = this.router.url.includes('/playbook/');
    if (tabName != 'folder' && tabName != 'published' && tabName != 'unpublished' && tabName != 'all' && tabName != 'DRAFT' && tabName != 'CREATED' && tabName != 'REJECTED' && tabName != 'ALL' && tabName != 'APPROVED') {
      this.selectedFilter = '';
    }
    this.selectedFilter = tabName;
    this.contentModuleStatusAnalyticsDTO.selectedCategory = tabName.toUpperCase();
    this.referenceService.categoryType = tabName;
    if (isFolderView && tabName !== 'folder') {
      this.referenceService.categoryType = tabName;
      if (isTracks) {
        this.referenceService.goToRouter('/home/tracks/manage/l');
      } else if (isPlaybook) {
        this.referenceService.goToRouter('/home/playbook/manage/l');
      } else {
        this.referenceService.goToRouter('/home/dam/manage/l');
      }
    } else {

      if (tabName == 'folder') {
        let viewType = localStorage.getItem('defaultDisplayType') || 'FOLDER_GRID';

        if (this.router.url.includes('/tracks/')) {
          if (viewType === 'FOLDER_GRID') {
            this.referenceService.goToRouter('/home/tracks/manage/fg');
          } else if (viewType === 'FOLDER_LIST') {
            this.referenceService.goToRouter('/home/tracks/manage/fl');
          } else {
            this.referenceService.goToRouter('/home/tracks/manage/fg');
          }

        } else if (this.router.url.includes('/playbook/')) {
          if (viewType === 'FOLDER_GRID') {
            this.referenceService.goToRouter('/home/playbook/manage/fg');
          } else if (viewType === 'FOLDER_LIST') {
            this.referenceService.goToRouter('/home/playbook/manage/fl');
          } else {
            this.referenceService.goToRouter('/home/playbook/manage/fg');
          }

        } else {
          if (viewType === 'FOLDER_GRID') {
            this.referenceService.goToRouter('/home/dam/manage/fg');
          } else if (viewType === 'FOLDER_LIST') {
            this.referenceService.goToRouter('/home/dam/manage/fl');
          } else {
            this.referenceService.goToRouter('/home/dam/manage/fg');
          }
        }

      } else {
        this.loadContentByType(tabName);
      }
    }
  }
  return;
  
}
