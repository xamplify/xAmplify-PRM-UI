import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Lead } from '../models/lead';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { LeadsService } from '../services/leads.service';
import { LEAD_CONSTANTS } from 'app/constants/lead.constants';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { PagerService } from 'app/core/services/pager.service';
import { Properties } from 'app/common/models/properties';
import { DealsService } from 'app/deals/services/deals.service';
import { Roles } from 'app/core/models/roles';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';

declare var swal: any, $: any, videojs: any;

@Component({
  selector: 'app-custom-manage-leads',
  templateUrl: './custom-manage-leads.component.html',
  styleUrls: ['./custom-manage-leads.component.css'],
  providers: [LeadsService, ReferenceService, PagerService, DealsService]
})
export class CustomManageLeadsComponent implements OnInit {
  readonly LEAD_CONSTANTS = LEAD_CONSTANTS;
  @Input() listView: boolean = false;
  @Input() public isConvertingContactToLead: boolean = false;
  @Input() selectedContact: any;
  @Output() notifySubmitSuccess = new EventEmitter();
  @Output() closeCustomLeadAndDealForm = new EventEmitter();
  @Output() viewOrEditCustomLeadForm = new EventEmitter();
  @Output() editCustomLeadForm = new EventEmitter();
  @Output() notifyListLeads = new EventEmitter();
  @Output() notifySetLeadsPage = new EventEmitter();
  showDealForm: boolean;
  leadId: number;
  leadApprovalStatusType: string;
  selectedLead: Lead;
  updateCurrentStage: boolean;
  showLeadForm: boolean;
  loggedInUserId: number;
  showFilterOption: boolean;
  isCommentSection: boolean;
  selectedTabIndex: number;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  selectedFilterIndex: number = 1;
  actionType: string;
  leadsPagination: Pagination = new Pagination();
  leadsSortOption: SortOption = new SortOption();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  customResponse: CustomResponse = new CustomResponse();
  isPartnerVersion: boolean = true;
  isVendorVersion: boolean;
  isOrgAdmin: boolean = false;
  isVendor: boolean = false;
  roleName: Roles = new Roles();
  prm: boolean;
  filterResponse: CustomResponse = new CustomResponse();
  fromDateFilter: any = "";
  toDateFilter: any = "";
  statusLoader = true;
  isStatusLoadedSuccessfully = true;
  statusSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  registeredForCompaniesLoader = true;
  registeredForCompaniesSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  statusFilter: any;
  filterMode: boolean = false;
  vendorCompanyIdFilter = 0;
  stageNamesForFilterDropDown: any;
  vendorList: any;

  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService, public leadsService: LeadsService,
    public pagerService: PagerService, public properties: Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;
    } else {
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = false;
    }
    this.init();
  }

  ngOnInit() {
    this.showLeads();
  }

  init() {
    const roles = this.authenticationService.getRoles();
    if (roles !== undefined) {
      if (this.authenticationService.loggedInUserRole != "Team Member") {
        if (roles.indexOf(this.roleName.orgAdminRole) > -1 ||
          roles.indexOf(this.roleName.allRole) > -1 ||
          roles.indexOf(this.roleName.vendorRole) > -1 ||
          roles.indexOf(this.roleName.vendorTierRole) > -1 ||
          roles.indexOf(this.roleName.marketingRole) > -1 ||
          roles.indexOf(this.roleName.prmRole) > -1) {
          this.isVendor = true;
        }
        if (roles.indexOf(this.roleName.prmRole) > -1) {
          this.prm = true;
        }
        /** User Guide */
        if (roles.indexOf(this.roleName.orgAdminRole) > -1) {
          this.isOrgAdmin = true;
        }
      } else {
        if (this.authenticationService.superiorRole.includes("OrgAdmin")) {
          this.isOrgAdmin = true;
        }
        if (this.authenticationService.superiorRole.includes("Prm")) {
          this.prm = true;
        }
        if (this.authenticationService.superiorRole.includes("Vendor") ||
          this.authenticationService.superiorRole.includes("OrgAdmin") || this.authenticationService.superiorRole.includes("Marketing") ||
          this.authenticationService.superiorRole.includes("Prm")) {
          this.isVendor = true;
        }
      }
    }
  }

  showRegisterDealButton(lead): boolean {
    let showRegisterDeal = false;
    if (lead.selfLead && lead.dealBySelfLead && (this.isOrgAdmin || this.authenticationService.module.isMarketingCompany) && lead.associatedDealId == undefined) {
      showRegisterDeal = true;
    } else if (((((lead.dealByVendor && this.isVendor || lead.canRegisterDeal && lead.dealByPartner) && !lead.selfLead)) && lead.associatedDealId == undefined)
      && ((lead.enableRegisterDealButton && !lead.leadApprovalOrRejection && !this.authenticationService.module.deletedPartner && lead.leadApprovalStatusType !== 'REJECTED'))) {
      showRegisterDeal = true;
    }
    return showRegisterDeal;
  }

  showDealRegistrationForm(lead: Lead) {
    this.showDealForm = true;
    this.actionType = "add";
    this.leadId = lead.id;
  }

  addApprovalStatusModelPopup(lead: Lead, leadApprovalStatusType: string) {
    this.leadApprovalStatusType = leadApprovalStatusType;
    this.selectedLead = lead;
    this.updateCurrentStage = true;
  }

  closeApprovalStatusModelPopup() {
    this.leadApprovalStatusType = null;
    this.updateCurrentStage = false;
    // this.showLeads();
  }

  viewLead(lead: Lead) {
    this.showLeadForm = true;
    this.actionType = "view";
    this.leadId = lead.id;
    // this.viewOrEditCustomLeadForm.emit();
  }


  editLead(lead: Lead) {
    this.showLeadForm = true;
    this.actionType = "edit";
    this.leadId = lead.id;
    // this.viewOrEditCustomLeadForm.emit();
  }

  confirmDeleteLead(lead: Lead) {
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
        self.deleteLead(lead);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.referenceService.showServerError(this.httpRequestLoader);
    }
  }

  deleteLead(lead: Lead) {
    this.referenceService.loading(this.httpRequestLoader, true);
    lead.userId = this.loggedInUserId;
    this.leadsService.deleteLead(lead)
      .subscribe(
        response => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (response.statusCode == 200) {
            this.customResponse = new CustomResponse('SUCCESS', "Lead Deleted Successfully", true);
            //this.getCounts();  
            this.showLeads();
          } else if (response.statusCode == 500) {
            this.customResponse = new CustomResponse('ERROR', response.message, true);
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { this.showFilterOption = false; }
      );

  }

  showComments(lead: any) {
    this.selectedLead = lead;
    this.isCommentSection = !this.isCommentSection;
  }

  closeDealForm() {
    this.showDealForm = false;
    // this.showLeads();
  }

  closeLeadForm() {
    this.showLeadForm = false;
    this.closeCustomLeadAndDealForm.emit();
    // this.showLeads();
  }

  commentModalPopUpClose(event: any) {
    this.selectedLead.unReadChatCount = 0;
    this.isCommentSection = !this.isCommentSection;
  }

  registerDealForm(leadId: any) {
    this.showDealForm = true;
    this.actionType = "add";
    this.leadId = leadId;
  }

  listLeads(pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.userId = this.loggedInUserId;
    pagination.contactId = this.selectedContact.id;
    this.leadsService.listLeadsForPartner(pagination).subscribe(
      response => {
        pagination.totalRecords = response.totalRecords;
        this.leadsSortOption.totalRecords = response.totalRecords;
        this.leadsPagination = this.pagerService.getPagedItems(pagination, response.data);
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      error => {
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }

  setLeadsPage(event) {
    this.leadsPagination.pageIndex = event.page;
    this.listLeads(this.leadsPagination);
  }

  showLeads() {
    this.selectedTabIndex = 1;
    this.resetLeadsPagination();
    if (this.vanityLoginDto.vanityUrlFilter) {
      this.leadsPagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
      this.leadsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
    }
    this.listLeads(this.leadsPagination);
  }

  resetLeadsPagination() {
    this.leadsPagination.maxResults = 12;
    this.leadsPagination = new Pagination;
    this.leadsPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex == 1;
  }

  showSubmitLeadSuccess() {
    if (this.actionType == 'edit') {
      this.customResponse = new CustomResponse('SUCCESS', "Lead Updated Successfully", true);
    } else {
      this.customResponse = new CustomResponse('SUCCESS', "Lead Submitted Successfully", true);
    }
    this.showLeadForm = false;
    this.showLeads();
  }

  addLead() {
    this.showLeadForm = true;
    this.actionType = "add";
    this.leadId = 0;
  }

  searchLeads() {
    this.getAllFilteredResultsLeads(this.leadsPagination);
  }

  getAllFilteredResultsLeads(pagination: Pagination) {
    this.leadsPagination.pageIndex = 1;
    this.leadsPagination.searchKey = this.leadsSortOption.searchKey;
    this.listLeads(pagination);
  }

  clearSearch() {
    this.leadsSortOption.searchKey = '';
    this.getAllFilteredResultsLeads(this.leadsPagination);
  }

  showSubmitDealSuccess() {
    this.customResponse = new CustomResponse('SUCCESS', "Deal Submitted Successfully", true);
    this.showDealForm = false;
    this.showLeads();
  }

  getSelectedIndex(index: number) {
    this.selectedFilterIndex = index;
    this.referenceService.setTeamMemberFilterForPagination(this.leadsPagination, index);
    this.listLeads(this.leadsPagination);
  }

  toggleFilterOption() {
    this.showFilterOption = !this.showFilterOption;
    this.fromDateFilter = "";
    this.toDateFilter = "";
    this.statusFilter = "";
    this.vendorCompanyIdFilter = 0;
    if (!this.showFilterOption) {
      this.leadsPagination.fromDateFilterString = "";
      this.leadsPagination.toDateFilterString = "";
      this.leadsPagination.stageFilter = "";
      this.leadsPagination.vendorCompanyId = 0;
      this.filterResponse.isVisible = false;
      if (this.filterMode) {
        this.leadsPagination.pageIndex = 1;
        this.listLeads(this.leadsPagination);
        this.filterMode = false;
      }
    } else {
      this.getStageNamesForFilter();
      this.companyNamesForFilter();
      this.filterMode = false;
    }
  }

  closeFilterOption() {
    this.showFilterOption = false;
    this.fromDateFilter = "";
    this.toDateFilter = "";
    this.statusFilter = "";
    this.vendorCompanyIdFilter = 0;
    this.leadsPagination.fromDateFilterString = "";
    this.leadsPagination.toDateFilterString = "";
    this.leadsPagination.stageFilter = "";
    this.leadsPagination.vendorCompanyId = 0;
    this.filterResponse.isVisible = false;
    if (this.filterMode) {
      this.leadsPagination.pageIndex = 1;
      this.listLeads(this.leadsPagination);
      this.filterMode = false;
    }
  }

  validateDateFilters() {
    let isInvalidStatusFilter = this.statusFilter == undefined || this.statusFilter == "";
    let isValidStatusFilter = this.statusFilter != undefined && this.statusFilter != "";
    let isEmptyFromDateFilter = this.fromDateFilter == undefined || this.fromDateFilter == "";
    let isValidFromDateFilter = this.fromDateFilter != undefined && this.fromDateFilter != "";
    let isEmptyToDateFilter = this.toDateFilter == undefined || this.toDateFilter == "";
    let isValidToDateFilter = this.toDateFilter != undefined && this.toDateFilter != "";
    let isInvalidCompanyIdFilter = this.vendorCompanyIdFilter == undefined || this.vendorCompanyIdFilter == 0;
    let isValidCompanyIdFilter = this.vendorCompanyIdFilter != undefined && this.vendorCompanyIdFilter > 0;
    if (isInvalidStatusFilter && isEmptyFromDateFilter && isEmptyToDateFilter && isInvalidCompanyIdFilter) {
      this.filterResponse = new CustomResponse('ERROR', "Please provide valid input to filter", true);
    } else {
      let validDates = false;
      if (isEmptyFromDateFilter && isEmptyToDateFilter) {
        validDates = true;
      } else if (isValidFromDateFilter && isEmptyToDateFilter) {
        this.filterResponse = new CustomResponse('ERROR', "Please pick To Date", true);
      } else if (isValidToDateFilter && isEmptyFromDateFilter) {
        this.filterResponse = new CustomResponse('ERROR', "Please pick From Date", true);
      } else {
        var toDate = Date.parse(this.toDateFilter);
        var fromDate = Date.parse(this.fromDateFilter);
        if (fromDate <= toDate) {
          validDates = true;
          this.leadsPagination.pageIndex = 1;
          this.leadsPagination.maxResults = 12;
          this.leadsPagination.fromDateFilterString = this.fromDateFilter;
          this.leadsPagination.toDateFilterString = this.toDateFilter;
        } else {
          this.filterResponse = new CustomResponse('ERROR', "From date should be less than To date", true);
        }
      }

      if (validDates) {
        this.filterStatus(isValidStatusFilter);
        this.filterVendorCompanyId(isValidCompanyIdFilter);
        this.leadsPagination.pageIndex = 1;
        this.leadsPagination.maxResults = 12;
        this.filterMode = true;
        this.filterResponse.isVisible = false;
        this.listLeads(this.leadsPagination);
      }

    }
  }

  private filterStatus(isValidStatusFilter: boolean) {
    if (isValidStatusFilter) {
      this.leadsPagination.stageFilter = this.statusFilter;
    } else {
      this.leadsPagination.stageFilter = "";
    }
  }

  private filterVendorCompanyId(isValidCompanyIdFilter) {
    if (isValidCompanyIdFilter) {
      this.leadsPagination.vendorCompanyId = this.vendorCompanyIdFilter;
    } else {
      this.leadsPagination.vendorCompanyId = 0;
    }
  }

  getSelectedStatus(event: any) {
    if (event != null) {
      this.statusFilter = event['id'];
    } else {
      this.statusFilter = "";
    }
  }

  getSelectedRegisteredForCompanyId(event: any) {
    if (event != null) {
      this.vendorCompanyIdFilter = event['id'];
    } else {
      this.vendorCompanyIdFilter = 0;
    }
  }

  addSearchableStatus(response: any) {
    this.stageNamesForFilterDropDown = response;
    let dtos = [];
    $.each(this.stageNamesForFilterDropDown, function (index: number, value: any) {
      let id = value;
      let name = value;
      let dto = {};
      dto['id'] = id;
      dto['name'] = name;
      dtos.push(dto);
    });
    this.statusSearchableDropDownDto.data = dtos;
    this.statusSearchableDropDownDto.placeHolder = "Select Status";
    this.statusLoader = false;
    this.referenceService.loading(this.httpRequestLoader, false);
  }

  getStageNamesForFilter() {
    this.leadsService.getStageNamesForVendor(this.loggedInUserId)
      .subscribe(
        response => {
          this.fromDateFilter;
          this.addSearchableStatus(response);
        },
        error => {
          this.httpRequestLoader.isServerError = true;
          this.isStatusLoadedSuccessfully = false;
        },
        () => { }
      );
  }

  companyNamesForFilter() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.leadsService.getVendorList(this.loggedInUserId)
      .subscribe(
        response => {
          this.vendorList = response.data;
          let dtos = [];
          $.each(this.vendorList, function (index: number, vendor: any) {
            let id = vendor.companyId;
            let name = vendor.companyName;
            let dto = {};
            dto['id'] = id;
            dto['name'] = name;
            dtos.push(dto);
          });
          this.registeredForCompaniesSearchableDropDownDto.data = dtos;
          this.registeredForCompaniesSearchableDropDownDto.placeHolder = "Select Added For";
          this.registeredForCompaniesLoader = false;
          this.referenceService.loading(this.httpRequestLoader, false);
        },
        error => {
          this.httpRequestLoader.isServerError = true;
          this.registeredForCompaniesLoader = false;
        },
        () => { }
      );
  }

}
