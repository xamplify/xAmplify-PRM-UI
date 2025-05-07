import { Component, OnInit } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from 'app/partners/services/parter.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { UtilService } from 'app/core/services/util.service';
import { Pagination } from 'app/core/models/pagination';
import { PartnerCompanyMetricsDto } from '../models/partner-company-metrics-dto';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';

@Component({
  selector: 'app-partner-contact-upload-management-settings',
  templateUrl: './partner-contact-upload-management-settings.component.html',
  styleUrls: ['./partner-contact-upload-management-settings.component.css'],
  providers: [HttpRequestLoader, Properties, ParterService]
})
export class PartnerContactUploadManagementSettingsComponent implements OnInit {

  pagination: Pagination = new Pagination();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string;
  partnerCompanyMetricsDTOs: Array<PartnerCompanyMetricsDto> = new Array<PartnerCompanyMetricsDto>();
  customResponse: CustomResponse = new CustomResponse();

  sortOptions = [
    { 'name': 'Sort By', 'value': '' },
    { 'name': 'Email A-Z)', 'value': 'emailId-ASC' },
    { 'name': 'Email (Z-A)', 'value': 'emailId-DESC' },
    { 'name': 'Company Name (ASC)', 'value': 'contactCompany-ASC' },
    { 'name': 'Company Name (DESC)', 'value': 'contactCompany-DESC' },
    { 'name': 'Assigned (ASC)', 'value': 'assigned-ASC' }, 
    { 'name': 'Assigned (DESC)', 'value': 'assigned-DESC' },
    { 'name': 'Exceeded (ASC)', 'value': 'exceeded-ASC' },
    { 'name': 'Exceeded (DESC)', 'value': 'exceeded-DESC' }
  ];

  sortOption: any = this.sortOptions[0];
  sortcolumn: string = "";
  sortingOrder: string = "";

  editedContactLimitsMap: { [companyId: number]: number } = {};
  editedPartnerCompanyMetricsDTOs: PartnerCompanyMetricsDto[] = [];
  showSelfContactsCount: boolean = false;

  contactsUploadedCountByAllPartners: number = 0;
  contactSubscriptionLimit: number = 0;
  selfContactCount: number = 0;


  totalPartnerContactUploadCountLoader: HttpRequestLoader = new HttpRequestLoader();
  selfContactsCountLoader: HttpRequestLoader = new HttpRequestLoader();
  contactSubscriptionLimitLoader: HttpRequestLoader = new HttpRequestLoader();
  contactSubscriptionLimitUsedLoader: HttpRequestLoader = new HttpRequestLoader();
  contactSubscriptionCountUsed: number = 0;
  isMarketing: boolean= false;


  constructor(
    public authenticationService: AuthenticationService,
    public referenceService: ReferenceService,
    public pagerService: PagerService,
    public properties: Properties,
    public parterService: ParterService,
    public utilService: UtilService
  ) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isMarketing = this.authenticationService.isMarketingRole() || this.authenticationService.module.isMarketingCompany;
  }

  ngOnInit() {
    if (!this.isMarketing) {
      this.listAllPartnersForContactUploadManagementSettings(this.pagination);
    }
    this.loadContactsUploadedCountByAllPartners();
    this.loadContactUploadSubscriptionLimitForCompany();
    this.getTotalContactSubscriptionLimitUsedByCompany();
    if (this.isMarketing || this.authenticationService.isOrgAdmin()) {
      this.showSelfContactsCount = true;
      this.loadSelfContactsCount();
    }
  }

  onContactLimitChange(companyId: number, newLimit: number): void {
    if (newLimit > 0) {
      this.editedContactLimitsMap[companyId] = newLimit;
      const existing = this.partnerCompanyMetricsDTOs.find(dto => dto.companyId === companyId);
      if (existing) {
        const updatedDto: PartnerCompanyMetricsDto = { ...existing, contactUploadLimit: newLimit };
        const index = this.editedPartnerCompanyMetricsDTOs.findIndex(dto => dto.companyId === companyId);
        if (index >= 0) {
          this.editedPartnerCompanyMetricsDTOs[index] = updatedDto;
        } else {
          this.editedPartnerCompanyMetricsDTOs.push(updatedDto);
        }
      }
    } else {
      this.editedContactLimitsMap[companyId] = undefined;
      this.editedPartnerCompanyMetricsDTOs = this.editedPartnerCompanyMetricsDTOs.filter(dto => dto.companyId !== companyId);
    }
  }

  listAllPartnersForContactUploadManagementSettings(pagination: Pagination): void {
    this.referenceService.loading(this.httpRequestLoader, true);

    this.parterService.listAllPartnersForContactUploadManagementSettings(pagination).subscribe(
      response => {
        if (response.statusCode === XAMPLIFY_CONSTANTS.HTTP_OK && response.data) {
          const data = response.data;

          this.partnerCompanyMetricsDTOs = data.list.map(item => {
            const editedDto = this.editedPartnerCompanyMetricsDTOs.find(dto => dto.companyId === item.companyId);
            return editedDto ? { ...item, contactUploadLimit: editedDto.contactUploadLimit } : item;
          });

          pagination.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, this.partnerCompanyMetricsDTOs);
          pagination = this.utilService.setPaginatedRows(response, pagination);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      error => {
        this.referenceService.loading(this.httpRequestLoader, false);
        this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
      }
    );
  }

  saveOrUpdate() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.parterService.saveOrUpdateContactUploadSettings(this.editedPartnerCompanyMetricsDTOs).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.customResponse = new CustomResponse('SUCCESS', "Settings Updated Successfully", true);
        } else {
          this.customResponse = new CustomResponse('ERROR', this.properties.UNABLE_TO_PROCESS_REQUEST, true);
        }
        this.pagination.pageIndex = 1;
        this.referenceService.scrollSmoothToTop();
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      error => {
        this.referenceService.loading(this.httpRequestLoader, false);
        this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true);
        this.referenceService.scrollSmoothToTop();
      },
      () => {
        this.editedPartnerCompanyMetricsDTOs = [];
        this.editedContactLimitsMap = {};
        this.listAllPartnersForContactUploadManagementSettings(this.pagination);
      }
    );
  }


  paginateList(event: any) {
    this.pagination.pageIndex = event.page;
    this.listAllPartnersForContactUploadManagementSettings(this.pagination);
  }

  sortByOption(event: any, selectedType: string) {
    this.resetResponse();
    this.sortOption = event;
    const sortedValue = this.sortOption.value;
    if (sortedValue !== '') {
      const options: string[] = sortedValue.split('-');
      this.sortcolumn = options[0];
      this.sortingOrder = options[1];
    } else {
      this.sortcolumn = null;
      this.sortingOrder = null;
    }
    this.pagination.pageIndex = 1;
    this.pagination.sortcolumn = this.sortcolumn;
    this.pagination.sortingOrder = this.sortingOrder;
    this.listAllPartnersForContactUploadManagementSettings(this.pagination);

  }

  searchData() {
    this.pagination.pageIndex = 1;
    this.pagination.maxResults = 12;
    this.pagination.searchKey = this.searchKey;
    this.listAllPartnersForContactUploadManagementSettings(this.pagination);
  }

  searchDataOnKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.searchData();
    }
  }

  resetResponse() {
    this.customResponse = new CustomResponse();
  }

  loadSelfContactsCount() {
    this.referenceService.loading(this.selfContactsCountLoader, true);
    this.parterService.fetchTotalNumberOfContactsAddedForCompany(this.loggedInUserId).subscribe(
      response => {
        if (response.statusCode === XAMPLIFY_CONSTANTS.HTTP_OK && response.data) {
          this.selfContactCount = response.data;
        }
        this.referenceService.loading(this.selfContactsCountLoader, false);
      },
      error => {
        this.referenceService.loading(this.selfContactsCountLoader, false);
        this.customResponse = new CustomResponse('ERROR', this.properties.LOAD_SELF_CONTACTS_COUNT_ERROR_MESSAGE, true);
      });
  }

  loadContactsUploadedCountByAllPartners() {
    this.referenceService.loading(this.totalPartnerContactUploadCountLoader, true);
    this.parterService.loadContactsUploadedCountByAllPartners(this.loggedInUserId).subscribe(
      response => {
        if (response.statusCode === XAMPLIFY_CONSTANTS.HTTP_OK && response.data) {
          this.contactsUploadedCountByAllPartners = response.data;
        }
        this.referenceService.loading(this.totalPartnerContactUploadCountLoader, false);
      },
      error => {
        this.referenceService.loading(this.totalPartnerContactUploadCountLoader, false);
        this.customResponse = new CustomResponse('ERROR', this.properties.LOAD_PARTNER_CONTACTS_COUNT_ERROR_MESSAGE, true);
      });
  }

  getTotalContactSubscriptionLimitUsedByCompany() {
    this.referenceService.loading(this.contactSubscriptionLimitUsedLoader, true);
    this.parterService.getTotalContactSubscriptionLimitUsedByCompany(this.loggedInUserId).subscribe(
      response => {
        if (response.statusCode === XAMPLIFY_CONSTANTS.HTTP_OK && response.data) {
          this.contactSubscriptionCountUsed = response.data;
        }
        this.referenceService.loading(this.contactSubscriptionLimitUsedLoader, false);
      },
      error => {
        this.referenceService.loading(this.contactSubscriptionLimitUsedLoader, false);
        this.customResponse = new CustomResponse('ERROR', this.properties.LOAD_SUBSCRIPTION_LIMIT_USED_ERROR_MESSAGE, true);
      });
  }

  loadContactUploadSubscriptionLimitForCompany() {
    this.referenceService.loading(this.contactSubscriptionLimitLoader, true);
    this.parterService.loadContactUploadSubscriptionLimitForCompany(this.loggedInUserId).subscribe(
      response => {
        if (response.statusCode === XAMPLIFY_CONSTANTS.HTTP_OK && response.data) {
          this.contactSubscriptionLimit = response.data;
        }
        this.referenceService.loading(this.contactSubscriptionLimitLoader, false);
      },
      error => {
        this.referenceService.loading(this.contactSubscriptionLimitLoader, false);
        this.customResponse = new CustomResponse('ERROR', this.properties.LOAD_SUBSCRIPTION_LIMIT_ERROR_MESSAGE, true);
      });
  }
  
}
