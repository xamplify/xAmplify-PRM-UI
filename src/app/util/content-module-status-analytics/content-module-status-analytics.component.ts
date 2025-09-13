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
  @Input() isPartnerView : boolean = false;

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
  tabNameTile: string;
  isFolderViewTile: any;
  vendorCompanyProfileName: string = null;
  sharedcontentCountsLoader: boolean = false;
  constructor(private approveService: ApproveService, public authenticationService: AuthenticationService, private lmsService: LmsService, private referenceService: ReferenceService,
    private router: Router) {
 if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vendorCompanyProfileName = this.authenticationService.companyProfileName;
    }
  }
  ngOnInit() {
    let selected;

    const isFolderView =
      this.router.url.includes('/manage/fg') || this.router.url.includes('/manage/fl');
    const isSharedFolderView =
      this.router.url.includes('/shared/fg') || this.router.url.includes('/shared/fl');

    if (this.isPartnerView) {
            this.getSharedContentCounts();
      if (isSharedFolderView) {
        selected = this.referenceService.categoryType = 'folders';
      } else if (this.referenceService.categoryType) {
        selected = this.referenceService.categoryType;
      }
      else if (this.referenceService.categoryType == 'folders') {
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
        (this.referenceService.categoryType == 'interacted' ||
          this.referenceService.categoryType == 'notInteracted' ||
          this.referenceService.categoryType == 'not-viewd' ||
          this.referenceService.categoryType == 'completed' ||
          this.referenceService.categoryType == 'in-progress' ||
          this.referenceService.categoryType == 'alll' ||
          this.referenceService.categoryType == 'folders')) {
        selected = this.referenceService.categoryType;
        this.referenceService.categoryType = '';
      }
      else {
        selected = this.referenceService.categoryType = 'alll';
      }
      this.selectedFilter = selected;
      this.contentModuleStatusAnalyticsDTO.selectedCategory = 'alll';
    } else {
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
  }
  ngOnChanges() {
    if (this.moduleType == 'APPROVE') {
      this.getTileCountsForApproveModule();
      this.hideContentTiles = true;
    }  else if (this.isPartnerView){
      this.getSharedContentCounts();
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
    const isPartnerFolderView = this.router.url.includes('/shared/fg') || this.router.url.includes('/shared/fl');
    if (
      selectedCategory != 'folder' &&
      selectedCategory != 'folders' &&
      selectedCategory != 'published' &&
      selectedCategory != 'unpublished' &&
      selectedCategory != 'all' &&
      selectedCategory != 'DRAFT' &&
      selectedCategory != 'CREATED' &&
      selectedCategory != 'REJECTED' &&
      selectedCategory != 'ALL' &&
      selectedCategory != 'APPROVED' &&
      selectedCategory != 'interacted' &&
      selectedCategory != 'not-viewd' &&
      selectedCategory != 'completed' &&
      selectedCategory != 'notInteracted' &&
      selectedCategory != 'in-progress'
    ) {
      this.selectedFilter = '';
    }

    if ((isFolderView && selectedCategory == 'folder') || (isPartnerFolderView && selectedCategory == 'folders')) {
      this.filterAssets(selectedCategory, false);
    }

    else if (isFolderView || isPartnerFolderView) {
      this.referenceService.categoryTrackPlaybookType = true;
      this.filterAssets(selectedCategory, true);
    }

    else {
      if (!this.referenceService.categoryTrackPlaybookType) {
        this.referenceService.categoryType = '';
        this.referenceService.categoryTrackPlaybookType = false;
        this.selectedFilter = '';
      }

      if (
        this.router.url.includes('/manage/l') ||
        this.router.url.includes('/tracks/manage') ||
        this.router.url.includes('/playbook/manage') ||
        this.router.url.includes('/dam/manage') ||
        this.router.url.includes('/shared/l') ||
        this.router.url.includes('/tracks/shared') ||
        this.router.url.includes('/playbook/shared') ||
        this.router.url.includes('/dam/shared')
      ) {
        this.selectedFilter = selectedCategory;
      }
      this.referenceService.categoryType = selectedCategory;
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


    getSharedContentCounts() {
    this.sharedcontentCountsLoader = true;
      this.lmsService.getManageSharedContentCounts(this.moduleType, this.vendorCompanyProfileName).subscribe(
        (response: any) => {
          this.sharedcontentCountsLoader = false;
          if (response.statusCode == 200) {
            this.manageContentCounts = response.map;
          }
        },
        (_error: any) => {
          this.sharedcontentCountsLoader = false;
        }
      );
    }

 
  
  filterAssets(tabName: string, isFolderView: boolean): void {
  const isTracks = this.router.url.includes('/tracks/');
  const isPlaybook = this.router.url.includes('/playbook/');
  const isDAM = this.router.url.includes('/dam/');
  const isFolderTab = tabName === 'folder' || tabName === 'folders';

  const sharedGridUrl =
    (isTracks && '/home/tracks/shared/g') ||
    (isPlaybook && '/home/playbook/shared/g') ||
    (isDAM && '/home/dam/shared/g');

  const sharedListUrl =
    (isTracks && '/home/tracks/shared/l') ||
    (isPlaybook && '/home/playbook/shared/l') ||
    (isDAM && '/home/dam/shared/l');

  const manageGridUrl =
    (isTracks && '/home/tracks/manage/g') ||
    (isPlaybook && '/home/playbook/manage/g') ||
    (isDAM && '/home/dam/manage/g');

  const manageListUrl =
    (isTracks && '/home/tracks/manage/l') ||
    (isPlaybook && '/home/playbook/manage/l') ||
    (isDAM && '/home/dam/manage/l');

  const sharedFolderUrl =
    (isTracks && '/home/tracks/shared/fg') ||
    (isPlaybook && '/home/playbook/shared/fg') ||
    (isDAM && '/home/dam/shared/fg');

  const manageFolderGridUrl =
    (isTracks && '/home/tracks/manage/fg') ||
    (isPlaybook && '/home/playbook/manage/fg') ||
    (isDAM && '/home/dam/manage/fg');

  const viewType = localStorage.getItem('defaultDisplayType') || 'GRID';

  this.selectedFilter = tabName;
  this.contentModuleStatusAnalyticsDTO.selectedCategory = tabName.toUpperCase();
  this.referenceService.categoryType = tabName;

  if (isFolderTab) {
    if (this.isPartnerView) {
      this.referenceService.goToRouter(sharedFolderUrl);
    } else {
      this.referenceService.goToRouter(manageFolderGridUrl);
    }
    return;
  }

  if (isFolderView && !isFolderTab) {
    if (this.isPartnerView) {
      this.referenceService.goToRouter(viewType === 'GRID' ? sharedGridUrl : sharedListUrl);
    } else {
      this.referenceService.goToRouter(viewType === 'GRID' ? manageGridUrl : manageListUrl);
    }
    return;
  }

  this.loadContentByType(tabName);
}

}
