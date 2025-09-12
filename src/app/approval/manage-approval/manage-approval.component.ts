import { Component, OnInit, ViewChild } from '@angular/core';
import { Pagination } from 'app/core/models/pagination';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ApproveService } from '../service/approve.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { UtilService } from 'app/core/services/util.service';
import { PagerService } from 'app/core/services/pager.service';
import { FontAwesomeClassName } from 'app/common/models/font-awesome-class-name';
import { ContentModuleStatusAnalyticsComponent } from 'app/util/content-module-status-analytics/content-module-status-analytics.component';
import { MultiSelectCommentDto } from '../models/multi-select-comment-dto';
import { CustomResponse } from '../../common/models/custom-response';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { DamService } from 'app/dam/services/dam.service';
import { ManageTracksPlayBookComponent } from 'app/tracks-play-book-util/manage-tracks-play-book/manage-tracks-play-book.component';
import { TracksPlayBook } from 'app/tracks-play-book-util/models/tracks-play-book';
import { TracksPlayBookUtilService } from 'app/tracks-play-book-util/services/tracks-play-book-util.service';
import { TracksPlayBookType } from 'app/tracks-play-book-util/models/tracks-play-book-type.enum';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { VideoFileService } from 'app/videos/services/video-file.service';
import { Router } from '@angular/router';
import { SortOption } from 'app/core/models/sort-option';
import { Criteria } from 'app/contacts/models/criteria';
import { Properties } from 'app/common/models/properties';
declare var swal: any, $: any;

@Component({
  selector: 'app-manage-approval',
  templateUrl: './manage-approval.component.html',
  styleUrls: ['./manage-approval.component.css'],
  providers: [HttpRequestLoader, ApproveService, DamService, TracksPlayBookUtilService, VideoFileService, SortOption, Properties]
})
export class ManageApprovalComponent implements OnInit {

  pagination: Pagination = new Pagination();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  selectedTypeIndex = 1;
  selectedFilterType: any = 'ALL';
  selectedFilterStatus: any;
  approveList: Array<any> = new Array<any>();
  fontAwesomeClassName: FontAwesomeClassName = new FontAwesomeClassName();
  callCommentsComponent: boolean;
  assetName: any;
  assetCreatedById: any;
  assetCreatedByFullName: any;
  selectedDamId: any;
  createdByAnyApprovalManagerOrApprover: any = false;
  @ViewChild(ContentModuleStatusAnalyticsComponent) contentModuleStatusAnalyticsComponent: ContentModuleStatusAnalyticsComponent;
  @ViewChild(ManageTracksPlayBookComponent) manageTracksPlayBookComponent: ManageTracksPlayBookComponent;
  searchKey: any;
  categoryId: number;
  defaultDisplayType: string = 'l';
  folderViewType: any;
  folderListView: boolean = false;
  isHeaderCheckBoxChecked: boolean = false;
  displayApproveAndRejectButton: boolean = false;
  selectedDamIds = [];
  selectedTrackIds = [];
  selectedPlayBookIds = [];
  multiSelectComment = '';
  showCommentsPopUp: boolean = false;
  isApproveOrRejectStatus: any = '';
  commentDto: MultiSelectCommentDto = new MultiSelectCommentDto();
  customResponse: CustomResponse = new CustomResponse();
  filterResponse: CustomResponse = new CustomResponse();
  selectedIds = [];
  selectedTypeIds = [];
  moduleType: any;
  selectedPendingIds = [];
  showPdfModalPopup: boolean;
  asset: any;
  lmsType: any;
  deleteAsset: boolean;
  UnPublishedId: number;
  selectedOption: boolean;
  trackOrPlayBookText: string;
  itemType: any;
  filterActiveBg = "";
  filterApplied: any;
  showFilterOption: boolean = false;
  showFilterDropDown: boolean = false;
  toDateFilter: string;
  fromDateFilter: string;
  dateFilterText = "Select Date Filter";
  fromDateFilterString: string;
  toDateFilterString: string;
  hasVideoRole: boolean;
  hasCampaignRole: boolean;
  hasAllAccess: boolean;
  criteria: Criteria = new Criteria();
  isAssetTabSelected: boolean = false;
  loggedInUserId: number = 0;
  loggedInUserCompanyId: any;
  fileTypes: any;
  isAssetApprover: any;
  isTrackApprover: any;
  isPlayBookApprover: any;
  hasApprovalAccess : boolean = false;
  rejectedRecordNames = [];
  showApproveResponse : boolean = false;
  isSelectedAutoApprovalRecords: boolean = false;
  hasAllAuthorityAccess: boolean = false;
  approvalReferenceId: number;
  assetPreviewProxyPath: any;
  previewPath: any;
  previewFileType: any;
  previewContent: boolean = false;
  isImageFormat: any;
  isTextFormat: any;
  isBeeTemplate: any;

  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService,
    public approveService: ApproveService, public utilService: UtilService, public xtremandLogger: XtremandLogger,
    public pagerService: PagerService, public tracksPlayBookUtilService: TracksPlayBookUtilService, public videoFileService: VideoFileService,
    private router: Router, public sortOption: SortOption, public properties: Properties
  ) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.callInitMethos();
    let message = this.referenceService.assetResponseMessage;
    if (message != undefined && message.length > 0) {
      this.customResponse = new CustomResponse('SUCCESS', message, true);
    }
    if (this.referenceService.isUpdated || this.referenceService.isAssetDetailsUpldated) {
      let message = "Updated Successfully"
      this.customResponse = new CustomResponse('SUCCESS', message, true);
    }
  }

  callInitMethos() {
  
  }

  ngOnDestroy() {
    this.referenceService.isCreated = false;
    this.referenceService.isUpdated = false;
    this.referenceService.isUploaded = false;
    this.referenceService.isAssetDetailsUpldated = false;
    this.referenceService.assetResponseMessage = "";
  }

  getAllApprovalList(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.pagination.filterKey = this.selectedFilterStatus;
    this.pagination.filterBy = this.selectedFilterType;
    this.selectedPendingIds = [];
    this.approveService.getAllApprovalList(this.pagination).subscribe(
      response => {
        let map = response['map'];
        let data = map['paginatedDTO'];
        let approverData = map['loggedInUserPrivileges'];
        this.isAssetApprover = approverData.assetApprover;
        this.isTrackApprover = approverData.trackApprover;
        this.isPlayBookApprover = approverData.playbookApprover;
        this.approveList = data.list;
        pagination.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, this.approveList);
        this.isCheckHeader();
        this.hasApprovalAccess = (this.selectedFilterStatus === 'PENDING' || this.selectedFilterStatus === 'REJECTED' || this.selectedFilterStatus === 'APPROVED')
          && (this.isAssetApprover || this.isTrackApprover || this.isPlayBookApprover)
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.xtremandLogger.errorPage(error);
        this.referenceService.loading(this.httpRequestLoader, false);
      });
  }

  isCheckHeader() {
    let self = this;
    var itemIds = self.approveList.map(function (a) { return a.id; });
    var items = (self.selectedIds || []).filter(element => itemIds.includes(element));
    if (items.length == self.approveList.length && items.length > 0) {
      self.isHeaderCheckBoxChecked = true;
      self.selectedPendingIds = items;
    } else {
      self.isHeaderCheckBoxChecked = false;
    }
  }

  paginateList(event: any) {
    this.pagination.pageIndex = event.page;
    this.getAllApprovalList(this.pagination);
  }

  getImageSrc(item): any {
    switch (item.type) {
      case 'Track':
        return 'assets/images/universal-search-images/universal-track.svg';
      case 'PlayBook':
        return 'assets/images/universal-search-images/universal-playbook.svg';
      case 'Asset':
        return 'assets/images/universal-search-images/universal-asset.svg';
      default:
        return 'assets/images/universal-search-images/universal-asset.svg';
    }
  }

  filterByType(type: string, index: number) {
    this.selectedTypeIndex = index;
    this.customResponse.isVisible = false;
    this.searchKey = "";
    this.clearSelectedItems();
    this.showFilterOption = false;
    this.clearFilterOptions();
    this.isAssetTabSelected = false;
    if (type === 'ASSETS') {
      this.isAssetTabSelected = true;
    }
    this.selectedFilterType = type;
    this.getAllApprovalList(this.pagination);
  }

  filterByStatus(event: any) {
    this.pagination = new Pagination();
    this.pagination.pageIndex = 1;
    this.pagination.maxResults = 12;
    this.showFilterOption = false;
    this.customResponse.isVisible = false;
    this.searchKey = "";
    this.clearFilterOptions();
    this.clearSelectedItems();
    if (event == 'APPROVED') {
      this.selectedFilterStatus = 'APPROVED';
      this.getAllApprovalList(this.pagination);
    } else if (event == 'REJECTED') {
      this.selectedFilterStatus = 'REJECTED';
      this.getAllApprovalList(this.pagination);
    } else if (event == 'CREATED') {
      this.selectedFilterStatus = 'PENDING';
      this.getAllApprovalList(this.pagination);
    } else if (event == 'DRAFT') {
      this.selectedFilterStatus = 'DRAFT';
      this.getAllApprovalList(this.pagination);
    } else {
      this.selectedFilterStatus = '';
      this.getAllApprovalList(this.pagination);
    }
  }

  getApprovalStatusText(status: any): any {
    switch (status) {
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'CREATED':
        return 'Pending Approval';
      case 'DRAFT':
        return 'Draft';
      default:
        return status;
    }
  }

  getTypeText(status: any): any {
    switch (status) {
      case 'Asset':
        return 'Asset';
      case 'Track':
        return 'Track';
      case 'PlayBook':
        return 'Playbook';
      default:
        return status;
    }
  }

  preview(item: any) {
    if (item.type === 'Asset') {
      this.handleAssetPreview(item);
    } else if (item.type == 'Track' || item.type == 'PlayBook') {
      this.handleTracksAndAssetsPreview(item);
    }
  }

  handleAssetPreview(item: any) {
    if (this.referenceService.isVideo(item.slug)) {
      let prefixurl = RouterUrlConstants['home'] + RouterUrlConstants['dam'] + RouterUrlConstants['approval']
      const videoUrl = `${prefixurl}/previewVideo/${item.videoId}/${item.id}`;
      this.referenceService.navigateToRouterByViewTypes(videoUrl, 0, undefined, undefined, undefined);
    } else if (item.beeTemplate) {
      if ((item.contentPreviewType || item.imageFileType) && item.assetPath != undefined && item.assetPath != null && item.assetPath != '') {
        if (item.assetProxyPath) {
          this.assetPreviewProxyPath = item.assetProxyPath + item.assetPath;
        } else {
          this.assetPreviewProxyPath = item.assetPath;
        }
        this.previewPath = item.assetPath;
        this.previewFileType = item.slug;
        this.previewContent = true;
        this.isImageFormat = item.imageFileType;
        this.isTextFormat = item.textFileType;
        this.isBeeTemplate = item.beeTemplate;
      } else {
        this.referenceService.previewAssetPdfInNewTab(item.id);
      }
    } else {
      if ((item.contentPreviewType || item.imageFileType)) {
        if (item.assetProxyPath) {
          this.assetPreviewProxyPath = item.assetProxyPath + item.assetPath;
        } else {
          this.assetPreviewProxyPath = item.assetPath;
        }
        this.previewPath = item.assetPath;
        this.previewFileType = item.slug;
        this.previewContent = true;
        this.isImageFormat = item.imageFileType;
        this.isTextFormat = item.textFileType;
        this.isBeeTemplate = item.beeTemplate;
      } else {
        this.referenceService.preivewAssetOnNewHost(item.id);
      }
    }
  }

  showCommentsAndHistoryModalPopup(item: any) {
    if (item.type === 'Asset') {
      this.callCommentsComponent = true;
      this.assetName = item.name;
      this.assetCreatedById = item.createdById;
      this.assetCreatedByFullName = item.createdBy;
      this.createdByAnyApprovalManagerOrApprover = item.createdByAnyApprovalManagerOrApprover;
      this.selectedDamId = item.id;
      this.moduleType = 'DAM';
      this.approvalReferenceId = item.approvalReferenceId;
    }
    if (item.type === 'Track') {
      this.callCommentsComponent = true;
      this.assetName = item.name;
      this.assetCreatedById = item.createdById;
      this.assetCreatedByFullName = item.createdBy;
      this.createdByAnyApprovalManagerOrApprover = item.createdByAnyApprovalManagerOrApprover;
      this.selectedDamId = item.id;
      this.moduleType = 'TRACK';
    }
    if (item.type === 'PlayBook') {
      this.callCommentsComponent = true;
      this.assetName = item.name;
      this.assetCreatedById = item.createdById;
      this.assetCreatedByFullName = item.createdBy;
      this.createdByAnyApprovalManagerOrApprover = item.createdByAnyApprovalManagerOrApprover;
      this.selectedDamId = item.id;
      this.moduleType = 'PLAYBOOK';
    }
  }

  
	closeCommentsAndHistoryModalPopup() {
		this.callCommentsComponent = false;
	}

  closeCommentsAndHistoryModalPopupAndRefresh(event: boolean) {
    this.getAllApprovalList(this.pagination);
    this.callCommentsComponent = false;
    this.contentModuleStatusAnalyticsComponent.getTileCountsForApproveModule();
    if (event) {
			this.referenceService.showSweetAlertSuccessMessage(this.properties.RE_APPROVAL_ASSET_HAS_REPLACED_BY_PARENT);
		}

  }

  searchData() {
    this.pagination.pageIndex = 1;
    this.pagination.maxResults = 12;
    this.pagination.searchKey = this.searchKey;
    this.getAllApprovalList(this.pagination);
  }

  searchDataOnKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.searchData();
    }
  }

  edit(item: any) {
    if (item.type === 'Asset') {
      this.handleAssetEdit(item);
    } else if (item.type === 'Track' || item.type === 'PlayBook') {
      this.handleTrackAndPlayBookEdit(item);
    }
  }

  handleAssetEdit(item: any) {
    setTimeout(() => {
      let prefixurl = RouterUrlConstants['home'] + RouterUrlConstants['dam'] + RouterUrlConstants['approval']
      if (!item.beeTemplate && this.referenceService.isVideo(item.slug)) {
        let url = prefixurl + "editVideo/" + item.videoId + "/" + item.id;
        this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
      } else {
        let url = prefixurl + "editDetails/" + item.id;
        this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
      }
    }, 300);
  }

  handleTracksAndAssetsPreview(item: any) {
    const viewType = `/${this.defaultDisplayType}`;
    let router = '';
    let companyId = item.createdByCompanyId
    switch (item.type) {
      case 'Track':
        router = `home/tracks/approval/tb/${companyId}/${item.slug}${viewType}`;
        break;
      case 'PlayBook':
        router = `home/playbook/approval/pb/${companyId}/${item.slug}${viewType}`;
        break;
    }
    if (router) {
      this.referenceService.goToRouter(router);
    }
  }

  handleTrackAndPlayBookEdit(item: any) {
    if (item.type === 'Track') {
      let url = "/home/tracks/approval/edit/" + item.id;
      this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
    } else if (item.type === 'PlayBook') {
      let url = "/home/playbook/approval/edit/" + item.id;
      this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
    }
  }

  checkAll(ev: any) {
    this.showApproveResponse = false;
    let self = this;
    if (ev.target.checked) {
      $('[name="pendingList[]"]').prop('checked', true);
      $('[name="pendingList[]"]:checked').each(function () {
        var id = $(this).val();
        $.each(self.approveList, function (index: number, value: any) {
          if (value.id == id) {
            self.selectedIds.push(value.id);
            self.selectedPendingIds.push(value.id);
            if (self.selectedFilterStatus === 'APPROVED' && value.createdByAnyApprovalManagerOrApprover) {
              self.isSelectedAutoApprovalRecords = true;
            }
            self.pushIdsBasedOnType(value);
          }
        });
      });
      this.selectedIds = this.referenceService.removeDuplicates(this.selectedIds);
      this.selectedPendingIds = this.referenceService.removeDuplicates(this.selectedPendingIds);
      this.showApproveAndRejectButton();
      this.showApproveAndRejectButtonForApprovalTile();
    } else {
      $('[name="pendingList[]"]').prop('checked', false);
      $('[name="pendingList[]"]').each(function () {
        var id = $(this).val();
        $.each(self.approveList, function (index: number, value: any) {
          if (value.id == id) {
            let indexInSelectedIds = self.selectedIds.indexOf(value.id);
            let indexInSelectedPendingIds = self.selectedPendingIds.indexOf(value.id);
            if (indexInSelectedIds !== -1) {
              self.selectedIds.splice(indexInSelectedIds, 1);
            }
            if (indexInSelectedPendingIds !== -1) {
              self.selectedPendingIds.splice(indexInSelectedPendingIds, 1);
            }
            self.unSelectIdsBasedOnType(value);
          }
        });
      });
      this.showApproveAndRejectButton();
      this.isSelectedAutoApprovalRecords = false;
    }
    ev.stopPropagation();
  }

  selectPendingItem(item: any) {
    this.showApproveResponse = false;
    let id = item.id;
    let isChecked = $('#' + id).is(':checked');
    if (this.selectedFilterStatus === 'APPROVED' && item.createdByAnyApprovalManagerOrApprover) {
      this.isSelectedAutoApprovalRecords = true;
    }
    if (isChecked) {
      this.selectedPendingIds.push(id);
      this.selectedIds.push(id);
      this.pushIdsBasedOnType(item);
      this.showApproveAndRejectButton();
      this.showApproveAndRejectButtonForApprovalTile();
    } else {
      this.isSelectedAutoApprovalRecords = false;
      let indexInSelectedIds = this.selectedIds.indexOf(id);
      let indexInSelectedPendingIds = this.selectedPendingIds.indexOf(id);
      if (indexInSelectedIds !== -1) {
        this.selectedIds.splice(indexInSelectedIds, 1);
      }
      if (indexInSelectedPendingIds !== -1) {
        this.selectedPendingIds.splice(indexInSelectedPendingIds, 1);
      }
      this.unSelectIdsBasedOnType(item);
      this.showApproveAndRejectButton();
      this.showApproveAndRejectButtonForApprovalTile();
    }
    if (this.selectedPendingIds.length == this.approveList.length) {
      this.isHeaderCheckBoxChecked = true;
    } else {
      this.isHeaderCheckBoxChecked = false;
    }
  }

  unSelectIdsBasedOnType(item: any) {
    if (item.type == 'Asset') {
      let indexInSelectedIds = this.selectedDamIds.indexOf(item.id);
      if (indexInSelectedIds !== -1) {
        this.selectedDamIds.splice(indexInSelectedIds, 1);
      }
      if (!this.isAssetApprover) {
        this.unSelectRejectedRecords(item);
      }
    }
    if (item.type == 'Track') {
      let indexInSelectedIds = this.selectedTrackIds.indexOf(item.id);
      if (indexInSelectedIds !== -1) {
        this.selectedTrackIds.splice(indexInSelectedIds, 1);
      }
      if (!this.isTrackApprover) {
        this.unSelectRejectedRecords(item);
      }
    }
    if (item.type == 'PlayBook') {
      let indexInSelectedIds = this.selectedPlayBookIds.indexOf(item.id);
      if (indexInSelectedIds !== -1) {
        this.selectedPlayBookIds.splice(indexInSelectedIds, 1);
      }
      if (!this.isPlayBookApprover) {
        this.unSelectRejectedRecords(item);
      }
    }
    if (item.createdByAnyApprovalManagerOrApprover) {
      this.unSelectRejectedRecords(item);
    }
  }


  unSelectRejectedRecords(item: any) {
    let indexInSelectedIds = this.rejectedRecordNames.indexOf(item.name);
    if (indexInSelectedIds !== -1) {
      this.rejectedRecordNames.splice(indexInSelectedIds, 1);
    };
  }

  pushIdsBasedOnType(item: any) {
    if (item.type == 'Asset' && !item.createdByAnyApprovalManagerOrApprover) {
      this.selectedDamIds.push(item.id);
      this.selectedDamIds = this.referenceService.removeDuplicates(this.selectedDamIds);
      if (!this.isAssetApprover) {
        this.pushRejectedRecords(item);
      }
    }
    if (item.type == 'Track' && !item.createdByAnyApprovalManagerOrApprover) {
      this.selectedTrackIds.push(item.id);
      this.selectedTrackIds = this.referenceService.removeDuplicates(this.selectedTrackIds);
      if (!this.isTrackApprover) {
        this.pushRejectedRecords(item);
      }
    }
    if (item.type == 'PlayBook' && !item.createdByAnyApprovalManagerOrApprover) {
      this.selectedPlayBookIds.push(item.id);
      this.selectedPlayBookIds = this.referenceService.removeDuplicates(this.selectedPlayBookIds);
      if (!this.isPlayBookApprover) {
        this.pushRejectedRecords(item);
      }
    }

    if (item.createdByAnyApprovalManagerOrApprover) {
      this.pushRejectedRecords(item);
    }

  }

  private pushRejectedRecords(item: any) {
    this.rejectedRecordNames.push(item.name);
    this.rejectedRecordNames = this.referenceService.removeDuplicates(this.rejectedRecordNames);
  }

  getComment(event: any) {
    this.multiSelectComment = event;
    this.showCommentsPopUp = false;
    this.updateStatusForSelectedIds();
  }

  getStausAndCallCommentsPopUp(statusType: any) {
    this.isApproveOrRejectStatus = statusType;
    if(this.isAssetApprover && this.isTrackApprover && this.isPlayBookApprover){
      this.hasAllAuthorityAccess = true;
    }
    this.showCommentsPopUp = true;
  }

  updateStatusForSelectedIds() {
    if (this.multiSelectComment != undefined && this.multiSelectComment.length > 0) {
      this.commentDto.status = this.isApproveOrRejectStatus;
      this.commentDto.comment = this.multiSelectComment;
      this.commentDto.damIds = this.selectedDamIds;
      this.commentDto.trackIds = this.selectedTrackIds;
      this.commentDto.playBooksIds = this.selectedPlayBookIds;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.approveService.updateApprovalStatusAndComment(this.commentDto).subscribe(
        response => {
          this.clearSelectedItems();
          this.isHeaderCheckBoxChecked = false;
          if (response.statusCode == 200) {
            this.pagination.pageIndex = 1;
            let message = '';
            if (this.isApproveOrRejectStatus === 'APPROVED') {
              message = "Approved Successfully"
              this.displayApproveAndRejectButton = false;
              this.customResponse = new CustomResponse('SUCCESS', message, true);
            } else {
              message = "Rejected Successfully"
              this.displayApproveAndRejectButton = false;
              this.customResponse = new CustomResponse('SUCCESS', message, true);
            }
          } else if (response.statusCode === 401 && response.data != undefined) {
            let message = this.referenceService.iterateNamesAndGetErrorMessage(response);
            this.customResponse = new CustomResponse('ERROR', message, true);
          }
          this.getAllApprovalList(this.pagination);
          this.contentModuleStatusAnalyticsComponent.getTileCountsForApproveModule();
          this.referenceService.loading(this.httpRequestLoader, false);
        }, error => {
          this.xtremandLogger.errorPage(error);
          this.referenceService.loading(this.httpRequestLoader, false);
        });
    }
  }

  showApproveAndRejectButton() {
    if (this.selectedDamIds.length > 0 || this.selectedTrackIds.length > 0 || this.selectedPlayBookIds.length > 0) {
      this.displayApproveAndRejectButton = true;
    } else {
      this.displayApproveAndRejectButton = false;
    }
  }

  showApproveAndRejectButtonForApprovalTile() {
    if (this.selectedFilterStatus === 'APPROVED') {
      if (this.selectedDamIds.length > 0 || this.selectedTrackIds.length > 0 || this.selectedPlayBookIds.length > 0) {
        this.displayApproveAndRejectButton = true;
        this.showApproveResponse = false;
      } else {
        this.displayApproveAndRejectButton = false;
        this.showApproveResponse = true;
      }
      if (!(this.selectedIds.length > 0)) {
        this.showApproveResponse = false;
      }
    }
  }

  download(asset: any) {
    this.showPdfModalPopup = true;
    this.asset = asset;
  }

  downloadPopupEventEmitter() {
    this.showPdfModalPopup = false;
    this.asset = {};
  }

  confirmDelete(item: any) {
    if (item.type == 'Asset') {
      this.handleAssetDeletion(item);
    } else if (item.type == 'Track') {
      this.lmsType = TracksPlayBookType.TRACK;
      this.handleTrackAndPlayBookDeletion(item);
    } else if (item.type == 'PlayBook') {
      this.lmsType = TracksPlayBookType.PLAYBOOK;
      this.handleTrackAndPlayBookDeletion(item);
    }
  }

  handleAssetDeletion(item: any) {
    this.deleteAsset = true;
    this.asset = item;
  }

  deleteAssetSuccessEmitter(response: any) {
    this.referenceService.goToTop();
    this.customResponse = new CustomResponse();
    if (response.statusCode == 200) {
      this.customResponse = new CustomResponse('SUCCESS', this.asset.name + " Deleted Successfully", true);
      this.deleteAsset = false;
      this.referenceService.loading(this.httpRequestLoader, false);
      this.asset = {};
      this.pagination.pageIndex = 1;
      this.getAllApprovalList(this.pagination);
      this.clearSelectedItems();
      this.contentModuleStatusAnalyticsComponent.getTileCountsForApproveModule();
    } else if (response.statusCode == 401) {
      this.customResponse = new CustomResponse('ERROR', response.message, true);
    }
  }

  deleteAssetFailEmitter(message: any) {
    this.referenceService.goToTop();
    this.customResponse = new CustomResponse('ERROR', message, true);
    this.deleteAsset = false;
    this.referenceService.loading(this.httpRequestLoader, false);
    this.asset = {};
  }

  deleteAssetLoaderEmitter() {
    this.referenceService.loading(this.httpRequestLoader, true);
  }

  deleteAssetCancelEmitter() {
    this.deleteAsset = false;
    this.asset = {};
  }

  handleTrackAndPlayBookDeletion(item: any) {
    try {
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "You won't be able to undo this action!",
        type: 'warning',
        showCancelButton: true,
        swalConfirmButtonColor: '#54a7e9',
        swalCancelButtonColor: '#999',
        confirmButtonText: 'Yes, delete it!'

      }).then(function () {
        self.deleteTrackAndPlayBook(item);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.referenceService.showServerError(this.httpRequestLoader);
    }
  }

  deleteTrackAndPlayBook(item: any) {
    let tracksPlayBook: TracksPlayBook = new TracksPlayBook();
    tracksPlayBook.id = item.id;
    tracksPlayBook.userId = this.authenticationService.getUserId();
    tracksPlayBook.type = this.lmsType;
    this.customResponse = new CustomResponse();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.referenceService.goToTop();
    this.tracksPlayBookUtilService.deleteById(tracksPlayBook).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          this.customResponse = new CustomResponse('SUCCESS', item.name + " Deleted Successfully", true);
          this.pagination.pageIndex = 1;
          this.getAllApprovalList(this.pagination);
          this.contentModuleStatusAnalyticsComponent.getTileCountsForApproveModule();
          this.clearSelectedItems();
        } else {
          swal("Please Contact Admin!", response.message, "error");
          this.referenceService.stopLoader(this.httpRequestLoader);
        }
      },
      (error: string) => {
        this.referenceService.showServerError(this.httpRequestLoader);
        this.referenceService.stopLoader(this.httpRequestLoader);
      });
  }

  addOrEdit(id: any) {
    this.referenceService.navigateToRouterByViewTypes("/home/dam/approval/edit/" + id, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
  }

  isApprovalRequiredForType(type: any): boolean {
    if (type == 'Track') {
      return this.authenticationService && this.authenticationService.approvalRequiredForTracks
        ? this.authenticationService.approvalRequiredForTracks
        : false;
    } else if (type == 'PlayBook') {
      return this.authenticationService && this.authenticationService.approvalRequiredForPlaybooks
        ? this.authenticationService.approvalRequiredForPlaybooks
        : false;
    }
  }

  confirmChangePublish(id: number, isPublish: boolean, item: any) {
    let text = "";
    if (isPublish && item.type == 'PlayBook' && !item.hasDamContent) {
      swal({
        title: 'Add assets to publish.',
        type: 'warning',
        swalConfirmButtonColor: '#54a7e9',
        confirmButtonText: 'Ok'

      }).then(function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } else {
      if (isPublish) {
        text = "You want to publish.";
      }
      try {
        let self = this;
        swal({
          title: 'Are you sure?',
          text: text,
          type: 'warning',
          showCancelButton: true,
          swalConfirmButtonColor: '#54a7e9',
          swalCancelButtonColor: '#999',
          confirmButtonText: 'Yes'

        }).then(function () {
          self.changePublish(id, isPublish, item.type);
        }, function (dismiss: any) {
          console.log('you clicked on option' + dismiss);
        });
      } catch (error) {
        this.referenceService.showServerError(this.httpRequestLoader);
      }
    }
  }

  changePublish(learningTrackId: number, isPublish: boolean, type: any) {
    this.customResponse = new CustomResponse();
    this.referenceService.goToTop();
    this.referenceService.startLoader(this.httpRequestLoader);
    this.tracksPlayBookUtilService.changePublish(learningTrackId, isPublish).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          let message = isPublish ? type + " Published Successsfully" : type + " Unpublished Successfully";
          this.customResponse = new CustomResponse('SUCCESS', message, true);
          this.getAllApprovalList(this.pagination);
        } else if (response.statusCode == 401) {
          this.referenceService.showSweetAlertErrorMessage(response.message);
          this.referenceService.stopLoader(this.httpRequestLoader);
        }
      },
      (error: string) => {
        this.referenceService.showServerError(this.httpRequestLoader);
        this.referenceService.stopLoader(this.httpRequestLoader);
      })
  }

  UnpublishedModalPopUp(item: any) {
    this.UnPublishedId = item.id;
    this.itemType = item.type;
    if (item.type === 'Track') {
      this.trackOrPlayBookText = "Track";
    } else {
      this.trackOrPlayBookText = "Playbook";
    }
    $('#unpublished-modal').modal('show');
  }

  unPublishAction(id: number, isPublish: boolean) {
    if (this.UnPublishedId != 0) {
      this.changePublish(this.UnPublishedId, isPublish, this.itemType);
      this.selectedOption = false;
    }
    this.closePopUp()
  }

  closePopUp() {
    $('#unpublished-modal').modal('hide');
    $('input[name="rdaction"]').prop('checked', false);
    this.selectedOption = false;
  }

  viewAnalytics(item: any) {
    if (item.type === 'Asset') {
      this.handleAssetAnalytics(item);
    } else if (item.type === 'Track') {
      this.handleTracksAnalytics(item);
    } else if (item.type === 'PlayBook') {
      this.handlePlayBooksAnalytics(item);
    }
  }

  handleTracksAnalytics(item: any) {
    let route = "";
    route = "/home/tracks/approval/analytics/" + item.id;
    this.referenceService.navigateToRouterByViewTypes(route, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
  }

  handlePlayBooksAnalytics(item: any) {
    let route = "";
    route = "/home/playbook/approval/analytics/" + item.id;
    this.referenceService.navigateToRouterByViewTypes(route, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
  }

  handleAssetAnalytics(item: any) {
    this.navigateToPartnerAnalytics(item.id);
  }

  navigateToPartnerAnalytics(id: number) {
    let url = RouterUrlConstants['home'] + RouterUrlConstants['dam'] + RouterUrlConstants['approval'] + RouterUrlConstants['damPartnerCompanyAnalytics'] + this.referenceService.encodePathVariable(id);
    this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
  }


  clickFilter() {
    this.showFilterOption = true;
    this.filterResponse.isVisible = false;
  }

  viewDropDownFilter() {
    this.showFilterOption = true;
    this.showFilterDropDown = false;
  }

  clearFilter(event: any) {
    if (event === 'close') {
      this.showFilterOption = false;
    } else {
      this.showFilterOption = true
    }
    this.clearFilterOptions();
    this.getAllApprovalList(this.pagination);
  }

  clearFilterOptions() {
    this.filterActiveBg = 'defaultFilterACtiveBg';
    this.criteria = new Criteria();
    this.pagination.fromDateFilterString = "";
    this.pagination.toDateFilterString = "";
    this.pagination.customFilterOption = false;
    this.sortOption.searchKey = '';
    this.pagination.searchKey = this.sortOption.searchKey;
    this.pagination.criterias = null;
    this.pagination.pageIndex = 1;
  }


  closeFilterOption() {
    this.showFilterOption = false;
  }

  campaignRouter(alias: string, viewBy: string) {
  
  }

  sortList(text: any) {
    this.sortOption.approvalHubSortOption = text;
    this.getAllFilteredResults();
  }

  getAllFilteredResults() {
    this.pagination.pageIndex = 1;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.approvalHubSortOption, this.pagination);
    this.getAllApprovalList(this.pagination);
  }

  applyFilter(event: any) {
    let input = event;
    this.pagination.fromDateFilterString = input['fromDate'];
    this.pagination.toDateFilterString = input['toDate'];
    this.pagination.timeZone = input['zone'];
    this.pagination.criterias = input['criterias'];
    this.pagination.dateFilterOpionEnable = input['isDateFilter'];
    this.pagination.filterOptionEnable = input['isCriteriasFilter'];
    this.pagination.customFilterOption = true;
    this.pagination.pageIndex = 1;
    this.filterApplied = true;
    this.filterActiveBg = 'filterActiveBg';
    this.clearSelectedItems();
    this.displayApproveAndRejectButton = false;
    this.getAllApprovalList(this.pagination);
  }

  getCompanyId() {
    if (this.loggedInUserId != undefined && this.loggedInUserId > 0) {
      this.referenceService.loading(this.httpRequestLoader, true);
      this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
        (result: any) => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (result !== "") {
            this.loggedInUserCompanyId = result;
          } else {
            this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
            this.router.navigate(["/home/dashboard"]);
          }
        }, (error: any) => {
          this.referenceService.showServerError(this.httpRequestLoader);
          this.referenceService.stopLoader(this.httpRequestLoader);
        },
        () => {
          if (this.loggedInUserCompanyId != undefined && this.loggedInUserCompanyId > 0) {
            this.pagination.companyId = this.loggedInUserCompanyId;
            this.findFileTypes();
            this.getAllApprovalList(this.pagination);
          }
        }
      );
    } else {
      this.referenceService.showSweetAlertErrorMessage('UserId Not Found.Please try aftersometime');
      this.router.navigate(["/home/dashboard"]);
    }
  }

  findFileTypes() {
    this.approveService.getFileTypes(this.loggedInUserCompanyId, this.categoryId).subscribe(
      response => {
        this.fileTypes = response.data;
      }, error => {
        this.fileTypes = [];
      });
  }

  clearSelectedItems() {
    this.displayApproveAndRejectButton = false;
    this.selectedDamIds = [];
    this.selectedPlayBookIds = [];
    this.selectedTrackIds = [];
    this.selectedPendingIds = [];
    this.selectedIds = [];
    this.rejectedRecordNames = [];
    this.isSelectedAutoApprovalRecords = false;
    this.showApproveResponse = false;
  }

  isSelectable(item: any): boolean {
    if (item.type == 'Asset' && this.isAssetApprover) {
      return true;
    } else if (item.type == 'Track' && this.isTrackApprover) {
      return true;
    } else if (item.type == 'PlayBook' && this.isPlayBookApprover) {
      return true;
    } else {
      return false;
    }
  }

  getTooltipTitle(item: any): string {
    if (!this.isSelectable(item)) {
      return "You don't have the required access to perform action on this record.";
    } else {
      return '';
    }
  }

  isSelectableForCheckAll(): boolean {
    if (this.selectedFilterType == 'ASSETS' && this.isAssetApprover) {
      return true;
    } else if (this.selectedFilterType == 'TRACKS' && this.isTrackApprover) {
      return true;
    } else if (this.selectedFilterType == 'PLAYBOOKS' && this.isPlayBookApprover) {
      return true;
    } else if (this.selectedFilterType == 'ALL') {
      return true;
    } else {
      return false;
    }
  }
  /****** XNFR-897 *****/
  setTooltipMessage(item): string {
    if (!item.createdByAnyApprovalManagerOrApprover && item.approvalStatus !== 'APPROVED') {
      return 'Requires approval for publishing.';
    } else if (this.referenceService.isAccessToView(item.expireDate)) {
      return `${item.type === 'Track' ? "Track" : "Playbook"} cannot be published as the end date has expired.`;
    } else {
      return  'Publish';
    }
  }
  updateTooltip(event:any,item: any) {
    const tooltipMessage = this.setTooltipMessage(item);
    const element = $(event.target).closest('a');
    element.attr('data-original-title', tooltipMessage).tooltip('fixTitle').tooltip('show');
  }

  closePreview() {
    this.previewContent = false;
    this.previewPath = null;
    const objElement = document.getElementById('preview-object');
    if (objElement) {
      objElement.remove();
    }
  }

}
