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
declare var $:any;

@Component({
  selector: 'app-manage-aprroval',
  templateUrl: './manage-aprroval.component.html',
  styleUrls: ['./manage-aprroval.component.css'],
  providers: [HttpRequestLoader,ApproveService]
})
export class ManageAprrovalComponent implements OnInit {

  pagination: Pagination = new Pagination();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  selectedTypeIndex = 1;
  selectedFilterType: any = 'ALL';
  selectedFilterStatus: any;
  approveList: Array<any> = new Array<any>();
  fontAwesomeClassName:FontAwesomeClassName = new FontAwesomeClassName();
  callCommentsComponent: boolean;
  assetName: any;
  assetCreatedById: any;
  assetCreatedByFullName: any;
  selectedDamId: any;
  createdByAnyAdmin: any;
  @ViewChild(ContentModuleStatusAnalyticsComponent) contentModuleStatusAnalyticsComponent: ContentModuleStatusAnalyticsComponent;
  searchKey: any;
  categoryId: number;
  defaultDisplayType: string = 'l';
  folderViewType: any;
  folderListView: boolean = false;
  isHeaderCheckBoxChecked: boolean = false;
  displayApproveAndRejectButton: boolean = false;
  selectedDamIds = [];
  multiSelectComment = '';
  showCommentsPopUp: boolean = false;
  isApproveOrRejectStatus : any = '';
  commentDto:MultiSelectCommentDto = new MultiSelectCommentDto();
  customResponse: CustomResponse = new CustomResponse();

  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService,
    public approveService: ApproveService,public utilService: UtilService,public xtremandLogger: XtremandLogger,
    public pagerService: PagerService,
  ) { }

  ngOnInit() {
    this.getAllApprovalList(this.pagination);
  }

  getAllApprovalList(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.pagination.filterKey = this.selectedFilterStatus;
    this.pagination.filterBy = this.selectedFilterType;
    this.approveService.getAllApprovalList(pagination).subscribe(
      response => {
        let data = response.data;
        this.approveList = data.list;
        pagination.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, this.approveList);
        pagination = this.utilService.setPaginatedRows(response, pagination);
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.xtremandLogger.errorPage(error);
      });
  }

  paginateList(event: any) {
    this.pagination.pageIndex = event.page;
    this.getAllApprovalList(this.pagination);
  }

  getImageSrc(item): any {
    switch (item.type) {
      case 'Track':
        return 'assets/images/universal-search-images/universal-track.webp';
      case 'PlayBook':
        return 'assets/images/universal-search-images/universal-playbook.webp';
      case 'Asset':
        return 'assets/images/universal-search-images/universal-asset.webp';
      default:
        return 'assets/images/universal-search-images/universal-asset.webp';
    }
  }

  filterByType(type: string, index: number) {
    this.selectedTypeIndex = index;
    this.pagination.pageIndex = 1;
    this.pagination.maxResults = 12;
    this.selectedFilterType = type;
    this.getAllApprovalList(this.pagination);
  }

  filterByStatus(event: any) {
    this.pagination.pageIndex = 1;
    this.pagination.maxResults = 12;
    if (event == 'APPROVED') {
      this.selectedFilterStatus = 'APPROVED';
      this.getAllApprovalList(this.pagination);
    } else if (event == 'REJECTED') {
      this.selectedFilterStatus = 'REJECTED';
      this.getAllApprovalList(this.pagination);
    } else if (event == 'CREATED') {
      this.selectedFilterStatus = 'PENDING';
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
        return 'Play Book';
      default:
        return status;
    }
  }

  preview(item: any) {
    if (item.type === 'Asset') {
      this.handleAssetPreview(item);
    }else if(item.type == 'Track' || item.type == 'PlayBook'){
      this.handleTracksAndAssetsPreview(item);
    }
  }

  handleAssetPreview(item: any) {
    if (this.referenceService.isVideo(item.slug)) {
      const videoUrl = `/home/dam/previewVideo/${item.videoId}/${item.id}`;
      this.referenceService.navigateToRouterByViewTypes(videoUrl, 0, undefined, undefined, undefined);
    } else if (item.beeTemplate) {
      this.referenceService.previewAssetPdfInNewTab(item.id);
    } else {
      this.referenceService.preivewAssetOnNewHost(item.id);
    }
  }

  showCommentsAndHistoryModalPopup(item: any) {
    if (item.type === 'Asset') {
      this.callCommentsComponent = true;
      this.assetName = item.name;
      this.assetCreatedById = item.createdById;
      this.assetCreatedByFullName = item.createdBy;
      this.selectedDamId = item.id;
    }
  }

  closeCommentsAndHistoryModalPopup() {
    this.getAllApprovalList(this.pagination);
    this.callCommentsComponent = false;
    this.contentModuleStatusAnalyticsComponent.getTileCountsForApproveModule();
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
      if (item.beeTemplate && this.referenceService.isVideo(item.slug)) {
        let url = "/home/dam/editVideo/" + item.videoId + "/" + item.id;
        this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
      } else {
        let url = "/home/dam/editDetails/" + item.id;
        this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
      }
    }, 300);
  }

  handleTracksAndAssetsPreview(item :any) {
    const viewType = `/${this.defaultDisplayType}`;
    let router = '';
    let companyId = item.createdByCompanyId
    switch (item.type) {
      case 'Track':
        router = `home/tracks/tb/${companyId}/${item.slug}${viewType}`;
        break;
      case 'PlayBook':
        router = `home/playbook/pb/${companyId}/${item.slug}${viewType}`;
        break;
    }
    if (router) {
      this.referenceService.goToRouter(router);
    }
  }

  handleTrackAndPlayBookEdit(item: any) {
    if (item.type === 'Track') {
      let url = "/home/tracks/edit/" + item.id;
      this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
    } else if (item.type === 'PlayBook') {
      let url = "/home/playbook/edit/" + item.id;
      this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.defaultDisplayType, this.folderViewType, this.folderListView);
    }
  }

  checkAll(ev: any) {
    if (ev.target.checked) {
      $('[name="pendingList"]').prop('checked', true);
      this.displayApproveAndRejectButton = true;
    } else {
      $('[name="pendingList"]').prop('checked', false);
      this.displayApproveAndRejectButton = false;
    }
    ev.stopPropagation();
  }

  selectPendingItem(item: any) {
    let id = item.id;
    let isChecked = $('#' + id).is(':checked');
    if (isChecked) {
      this.pushIdsBasedOnType(item,id);
      this.showApproveAndRejectButton();
    } else {
      this.unSelectIdsBasedOnType(item,id);
      this.showApproveAndRejectButton();
    }
  }

  unSelectIdsBasedOnType(item: any, id: any) {
    if (item.type == 'Asset') {
      let indexInSelectedIds = this.selectedDamIds.indexOf(id);
      if (indexInSelectedIds !== -1) {
        this.selectedDamIds.splice(indexInSelectedIds, 1);
      }
    }
  }

  pushIdsBasedOnType(item: any, id: any) {
    if (item.type == 'Asset') {
      this.selectedDamIds.push(id);
    }
  }

  getComment(event: any) {
    this.multiSelectComment = event;
    this.showCommentsPopUp = false;
    this.updateStatusForSelectedIds();
  }

  getStausAndCallCommentsPopUp(statusType : any){
    this.isApproveOrRejectStatus = statusType;
    this.showCommentsPopUp = true;
  }

  updateStatusForSelectedIds() {
    this.commentDto.status = this.isApproveOrRejectStatus;
    this.commentDto.damIds = this.selectedDamIds;
    this.approveService.updateApprovalStatusAndComment(this.commentDto).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.getAllApprovalList(this.pagination);
          this.contentModuleStatusAnalyticsComponent.getTileCountsForApproveModule();
        }
      }, error => {
        this.xtremandLogger.errorPage(error);
      });
  }

  showApproveAndRejectButton() {
    if (this.selectedDamIds.length > 0) {
      this.displayApproveAndRejectButton = true;
    } else {
      this.displayApproveAndRejectButton = false;
    }
  }

}
