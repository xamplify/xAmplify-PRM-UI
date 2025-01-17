import { Component, OnInit } from '@angular/core';
import { ApprovalControlSettingsDTO } from 'app/approval/models/approval-control-settings-dto';
import { ApproveService } from 'app/approval/service/approve.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

@Component({
  selector: 'app-approval-control-management-settings',
  templateUrl: './approval-control-management-settings.component.html',
  styleUrls: ['./approval-control-management-settings.component.css'],
  providers: [HttpRequestLoader, ApproveService]
})
export class ApprovalControlManagementSettingsComponent implements OnInit {

  teamMemberList: Array<any> = new Array<any>();
  pagination: Pagination = new Pagination();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  selectedTypeIndex = 1;
  loggedInUserId: number = 0;
  searchKey: string;
  approvalControlSettingsDTOs: Array<ApprovalControlSettingsDTO> = new Array<ApprovalControlSettingsDTO>();

  selectedList: Array<ApprovalControlSettingsDTO> = new Array<ApprovalControlSettingsDTO>();
  selectedCheckBoxState: { [key: string]: ApprovalControlSettingsDTO } = {};

  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService,
    public approveService: ApproveService, public utilService: UtilService, public xtremandLogger: XtremandLogger,
    public pagerService: PagerService,
  ) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.listTeamMembersForApprovalControlManagement(this.pagination);
  }

  listTeamMembersForApprovalControlManagement(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.approveService.listTeamMembersForApprovalControlManagement(pagination).subscribe(
      response => {
        let data = response.data;
        this.approvalControlSettingsDTOs = data.list.map(item => {
          const existingState = this.selectedCheckBoxState[item.id];
          return existingState ? { ...item, ...existingState } : item;
        });
        pagination.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, this.teamMemberList);
        pagination = this.utilService.setPaginatedRows(response, pagination);
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.xtremandLogger.errorPage(error);
      });
  }

  updateCheckBox(event: any, approvalSettings: ApprovalControlSettingsDTO, moduleType: string) {
    const isChecked = event.target.checked;
    let existingState;
    if (this.selectedCheckBoxState[approvalSettings.id]) {
      existingState = this.selectedCheckBoxState[approvalSettings.id];
    } else {
      existingState = { ...approvalSettings };
    }

    existingState[moduleType] = isChecked;

    this.setFieldUpdated(existingState, moduleType);
    this.selectedCheckBoxState[approvalSettings.id] = existingState;

    const index = this.selectedList.findIndex(item => item.id === approvalSettings.id);
    if (index === -1) {
      this.selectedList.push(existingState);
    } else {
      this.selectedList[index] = existingState;
    }
  }

  setFieldUpdated(setting: ApprovalControlSettingsDTO, moduleType: string) {
    switch (moduleType) {
      case 'assetApprover':
        setting.assetApproverFieldUpdated = true;
        break;
      case 'trackApprover':
        setting.trackApproverFieldUpdated = true;
        break;
      case 'playbookApprover':
        setting.playbookApproverFieldUpdated = true;
        break;
    }
  }

  saveOrUpdate() {
    console.log(this.selectedList);
    this.approveService.saveOrUpdateApprovalControlSettings(this.selectedList).subscribe(
      response => {
        let data = response.data;
        this.approvalControlSettingsDTOs = data.list;
      }, error => {
        this.xtremandLogger.errorPage(error);
      }, () => {
        this.selectedList = [];
        this.selectedCheckBoxState = {};
      });
  }




































  paginateList(event: any) {
    this.pagination.pageIndex = event.page;
    this.listTeamMembersForApprovalControlManagement(this.pagination);
  }

  searchData() {
    this.pagination.pageIndex = 1;
    this.pagination.maxResults = 12;
    this.pagination.searchKey = this.searchKey;
    this.listTeamMembersForApprovalControlManagement(this.pagination);
  }
}
