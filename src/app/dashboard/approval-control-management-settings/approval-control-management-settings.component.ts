import { Component, OnInit } from '@angular/core';
import { ApprovalControlSettingsDTO } from 'app/approval/models/approval-control-settings-dto';
import { ApproveService } from 'app/approval/service/approve.service';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { CustomResponse } from '../../common/models/custom-response';

@Component({
  selector: 'app-approval-control-management-settings',
  templateUrl: './approval-control-management-settings.component.html',
  styleUrls: ['./approval-control-management-settings.component.css'],
  providers: [HttpRequestLoader, ApproveService, Properties]
})
export class ApprovalControlManagementSettingsComponent implements OnInit {

  pagination: Pagination = new Pagination();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string;
  approvalControlSettingsDTOs: Array<ApprovalControlSettingsDTO> = new Array<ApprovalControlSettingsDTO>();
  customResponse: CustomResponse = new CustomResponse();

  selectedList: Array<ApprovalControlSettingsDTO> = new Array<ApprovalControlSettingsDTO>();
  selectedCheckBoxState: { [key: string]: ApprovalControlSettingsDTO } = {};

  assetApprovalEnabledForCompany: boolean = false;
  tracksApprovalEnabledForCompany: boolean = false;
  playbooksApprovalEnabledForCompany: boolean = false;
  approvalStatusSettingsDto: any;
  isApprovalPrivilegeManager: boolean = false;

  constructor(
    public authenticationService: AuthenticationService, 
    public referenceService: ReferenceService,
    public approveService: ApproveService, 
    public utilService: UtilService,
    public pagerService: PagerService, 
    public properties: Properties
  ) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.getApprovalConfigurationSettings();
  }

  ngOnInit() {
    this.listTeamMembersForApprovalControlManagement(this.pagination);
  }

  listTeamMembersForApprovalControlManagement(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.approveService.listTeamMembersForApprovalControlManagement(pagination).subscribe(
      response => {
        if(response.statusCode === 200 && response.data) {
          let data = response.data;
          this.approvalControlSettingsDTOs = data.list.map(item => {
            const existingState = this.selectedCheckBoxState[item.id];
            return existingState ? { ...item, ...existingState } : item;
          });
          pagination.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, this.approvalControlSettingsDTOs);
          pagination = this.utilService.setPaginatedRows(response, pagination);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.referenceService.loading(this.httpRequestLoader, false);
        this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
      });
  }

  getApprovalConfigurationSettings() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.approveService.getApprovalConfigurationSettingsByUserId()
      .subscribe(
        result => {
          if (result.data && result.statusCode == 200) {
            this.approvalStatusSettingsDto = result.data;
            this.assetApprovalEnabledForCompany = this.approvalStatusSettingsDto.approvalRequiredForAssets;
            this.tracksApprovalEnabledForCompany = this.approvalStatusSettingsDto.approvalRequiredForTracks;
            this.playbooksApprovalEnabledForCompany = this.approvalStatusSettingsDto.approvalRequiredForPlaybooks;
          }
          this.referenceService.loading(this.httpRequestLoader, false);
        }, error => {
          this.referenceService.loading(this.httpRequestLoader, false);
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
    this.selectedCheckBoxState[approvalSettings.id] = existingState;
    const index = this.selectedList.findIndex(item => item.id === approvalSettings.id);
    if (index === -1) {
      this.selectedList.push(existingState);
    } else {
      this.selectedList[index] = existingState;
    }
  }

  saveOrUpdate() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.approveService.saveOrUpdateApprovalControlSettings(this.selectedList).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.customResponse = new CustomResponse('SUCCESS', response.message, true);
        } else {
          this.customResponse = new CustomResponse('ERROR', this.properties.UNABLE_TO_PROCESS_REQUEST, true);
        }
        this.pagination.pageIndex = 1;
        this.referenceService.loading(this.httpRequestLoader, false);
        this.referenceService.scrollSmoothToTop();
      }, error => {
        this.referenceService.loading(this.httpRequestLoader, false);
        this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
        this.referenceService.scrollSmoothToTop();
      }, () => {
        this.selectedList = [];
        this.selectedCheckBoxState = {};
        this.listTeamMembersForApprovalControlManagement(this.pagination);
        this.referenceService.loading(this.httpRequestLoader, false);
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

  searchDataOnKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.searchData();
    }
  }

  checkApprovalPrivilegeManager() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.approveService.checkApprovalPrivilegeManager()
      .subscribe(
        result => {
          this.isApprovalPrivilegeManager = result.data;
          this.referenceService.loading(this.httpRequestLoader, false);
        }, error => {
          this.referenceService.loading(this.httpRequestLoader, false);
        });
  }

}
