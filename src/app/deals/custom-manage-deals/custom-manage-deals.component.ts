import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { Deal } from '../models/deal';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { DEAL_CONSTANTS } from 'app/constants/deal.constants';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { PagerService } from 'app/core/services/pager.service';
import { DealsService } from '../services/deals.service';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import { LeadsService } from 'app/leads/services/leads.service';

declare var swal: any, $: any;

@Component({
  selector: 'app-custom-manage-deals',
  templateUrl: './custom-manage-deals.component.html',
  styleUrls: ['./custom-manage-deals.component.css'],
  providers: [Pagination, DealsService, LeadsService],
})
export class CustomManageDealsComponent implements OnInit {
  readonly DEAL_CONSTANTS = DEAL_CONSTANTS;

  @Input() selectedContact: any;


  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  //deal: Deal;
  updateCurrentStage: boolean = false;
  showDealForm: boolean = false;
  actionType: string = "add";
  dealId: number = 0;
  dealsResponse: CustomResponse = new CustomResponse();
  selectedDeal: Deal;
  isCommentSection: boolean = false;
  loggedInUserId: number = 0;
  dealsSortOption: SortOption = new SortOption();
  isVendorVersion = false;
  isPartnerVersion = true;
  dealsPagination: Pagination = new Pagination();

  showFilterOption: boolean = false;
  textAreaDisable: boolean;
  isOrgAdmin = false;
  showContactDeals: boolean = false;

  listView = true;
  selectedTabIndex = 1;
  //titleHeading:string = "";
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  // selectedPartnerCompanyId = 0;
  selectedFilterIndex: number = 1;

  //handle this
  isRegisterDealEnabled = true;
  isDealFromContact: boolean = false;

  registeredByUsersLoader = true;
  fromDateFilter: any = "";
  toDateFilter: any = "";
  statusFilter: any;
  vendorCompanyIdFilter: any;
  selectedRegisteredByCompanyId = 0;
  selectedRegisteredByUserId = 0;
  stageNamesForFilterDropDown: any;
  filterResponse: CustomResponse = new CustomResponse();
  filterMode: any = false;
  statusLoader = false;
  statusSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  registeredForCompaniesLoader = true;
  registeredForCompaniesSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  vendorList = new Array();
  isStatusLoadedSuccessfully: boolean = true;

  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService,
    public pagerService: PagerService, public dealsService: DealsService, public leadsService: LeadsService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;
    } else {
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = false;
    }
    this.statusSearchableDropDownDto.placeHolder = "Select Status";
  }

  ngOnInit() {
    this.showDeals();
  }

  showDeals() {
    this.showContactDeals = true;
    this.selectedTabIndex = 1;
    this.resetDealsPagination();
    if (this.vanityLoginDto.vanityUrlFilter) {
      this.dealsPagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
      this.dealsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
    }
    this.listDealsForPartner(this.dealsPagination);
  }

  resetDealsPagination() {
    this.dealsPagination.maxResults = 12;
    this.dealsPagination = new Pagination;
    this.dealsPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex == 1;
    this.showFilterOption = false;
  }

  listDealsForPartner(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    pagination.contactId = this.selectedContact.id;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dealsService.listDealsForPartner(pagination)
      .subscribe(
        response => {
          this.referenceService.loading(this.httpRequestLoader, false);
          pagination.totalRecords = response.totalRecords;
          this.dealsSortOption.totalRecords = response.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, response.data);
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }


  viewDeal(deal: Deal) {
    this.showContactDeals = false;
    this.showDealForm = true;
    this.actionType = "view";
    this.dealId = deal.id;
    this.dealsResponse.isVisible = false;
  }

  editDeal(deal: Deal) {
    this.showContactDeals = false;
    this.showDealForm = true;
    this.actionType = "edit";
    this.dealId = deal.id;
    this.selectedDeal = deal;
    this.textAreaDisable = true;
    this.dealsResponse.isVisible = false;
  }

  closeDealForm() {
    this.showContactDeals = true;
    this.showDealForm = false;
    this.showDeals();
    this.textAreaDisable = false;
  }

  showComments(event: any) {
    this.selectedDeal = event;
    this.isCommentSection = true;
  }

  addCommentModalClose(event: any) {
    this.selectedDeal.unReadChatCount = 0;
    this.isCommentSection = false
  }

  addDeal() {
    this.showContactDeals = false;
    this.showDealForm = true;
    this.isDealFromContact = true;
    this.actionType = "add";
    this.dealId = 0;
    this.dealsResponse.isVisible = false;
  }

  showSubmitDealSuccess() {
    this.showContactDeals = true;
    if (this.actionType == 'edit') {
      this.dealsResponse = new CustomResponse('SUCCESS', "Deal Updated Successfully", true);
    } else {
      this.dealsResponse = new CustomResponse('SUCCESS', "Deal Submitted Successfully", true);
    }
    this.showDealForm = false;
    this.showFilterOption = false;
    this.showDeals();
  }

  clearSearch() {
    this.dealsSortOption.searchKey = '';
    this.getAllFilteredResultsDeals(this.dealsPagination);
  }

  searchDeals() {
    this.getAllFilteredResultsDeals(this.dealsPagination);
  }

  getAllFilteredResultsDeals(pagination: Pagination) {
    this.dealsPagination.pageIndex = 1;
    this.dealsPagination.searchKey = this.dealsSortOption.searchKey;
    this.listDealsForPartner(this.dealsPagination);
  }

  dealEventHandler(keyCode: any) { if (keyCode === 13) { this.searchDeals(); } }

  updatePipelineStage(deal: Deal, deletedPartner: boolean) {
    if (!deletedPartner) {
      this.selectedDeal = deal;
      this.updateCurrentStage = true;
      this.textAreaDisable = true;
    } else {
      this.referenceService.showSweetAlert("This Option Is Not Available", "", "info");
    }
  }

  resetModalPopup() {
    this.updateCurrentStage = false;
    this.isCommentSection = false;
    this.textAreaDisable = false;
    this.showDeals();
  }

  stageUpdateResponse(event: any) {
    this.dealsResponse = (event === 200) ? new CustomResponse('SUCCESS', "Status Updated Successfully", true) : new CustomResponse('ERROR', "Invalid Input", true);

  }

  confirmDeleteDeal(deal: Deal) {
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
        self.deleteDeal(deal);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.referenceService.showServerError(this.httpRequestLoader);
    }
  }

  deleteDeal(deal: Deal) {
    this.referenceService.loading(this.httpRequestLoader, true);
    deal.userId = this.loggedInUserId;
    this.dealsService.deleteDeal(deal)
      .subscribe(
        response => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (response.statusCode == 200) {
            this.dealsResponse = new CustomResponse('SUCCESS', "Deal Deleted Successfully", true);
            this.showDeals();
          } else if (response.statusCode == 500) {
            this.dealsResponse = new CustomResponse('ERROR', response.message, true);
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => {
          this.showFilterOption = false;
        }
      );

  }

  listDeals() {
    this.showDeals();
  }

  setDealsPage(event: any) {
    this.dealsPagination.pageIndex = event.page;
    this.listDealsForPartner(this.dealsPagination);
  }

  toggleFilterOption() {
    this.stageNamesForVendor();
    this.getVendorCompanies();
    this.showFilterOption = !this.showFilterOption;
    this.fromDateFilter = "";
    this.toDateFilter = "";
    this.statusFilter = "";
    this.vendorCompanyIdFilter = "";
    this.vendorCompanyIdFilter = 0;
    this.selectedRegisteredByCompanyId = 0;
    this.selectedRegisteredByUserId = 0;
    if (this.isPartnerVersion && !this.vanityLoginDto.vanityUrlFilter) {
      this.stageNamesForFilterDropDown = "";
    }
    if (!this.showFilterOption) {
      this.dealsPagination.fromDateFilterString = "";
      this.dealsPagination.toDateFilterString = "";
      this.dealsPagination.stageFilter = "";
      this.dealsPagination.vendorCompanyId = undefined;
      this.dealsPagination.vendorCompanyId = 0;
      this.dealsPagination.registeredByUserId = 0;
      this.dealsPagination.registeredByCompanyId = 0;
      this.filterResponse.isVisible = false;
      if (this.filterMode) {
        this.dealsPagination.pageIndex = 1;
        this.listDealsForPartner(this.dealsPagination);
        this.filterMode = false;
      }
    } else {
      this.filterMode = false;
      this.stageNamesForVendor();
      this.getVendorCompanies();
    }
  }

  closeFilterOption() {
    this.showFilterOption = false;
    this.fromDateFilter = "";
    this.toDateFilter = "";
    this.statusFilter = "";
    this.vendorCompanyIdFilter = "";
    this.selectedRegisteredByCompanyId = 0;
    this.vendorCompanyIdFilter = 0;
    this.selectedRegisteredByUserId = 0;
    if (this.isPartnerVersion && !this.vanityLoginDto.vanityUrlFilter) {
      this.stageNamesForFilterDropDown = "";
    }

    this.dealsPagination.fromDateFilterString = "";
    this.dealsPagination.toDateFilterString = "";
    this.dealsPagination.stageFilter = "";
    this.dealsPagination.vendorCompanyId = undefined;
    this.dealsPagination.vendorCompanyId = 0;
    this.dealsPagination.registeredByCompanyId = 0;
    this.dealsPagination.registeredByUserId = 0;
    this.filterResponse.isVisible = false;
    if (this.filterMode) {
      this.dealsPagination.pageIndex = 1;
      this.listDealsForPartner(this.dealsPagination);
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
    let isInValidRegisteredByCompanyFilter = this.selectedRegisteredByCompanyId == undefined || this.selectedRegisteredByCompanyId == 0;
    let isValidRegisteredByCompanyFilter = this.selectedRegisteredByCompanyId != undefined && this.selectedRegisteredByCompanyId > 0;
    let isInValidRegisteredByUserFilter = this.selectedRegisteredByUserId == undefined || this.selectedRegisteredByUserId == 0;
    let isValidRegisteredByUserFilter = this.selectedRegisteredByUserId != undefined && this.selectedRegisteredByUserId > 0;
    if (isInvalidStatusFilter && isEmptyFromDateFilter && isEmptyToDateFilter && isInvalidCompanyIdFilter
      && isInValidRegisteredByCompanyFilter && isInValidRegisteredByUserFilter) {
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
          this.dealsPagination.pageIndex = 1;
          this.dealsPagination.maxResults = 12;
          this.dealsPagination.fromDateFilterString = this.fromDateFilter;
          this.dealsPagination.toDateFilterString = this.toDateFilter;
        } else {
          this.filterResponse = new CustomResponse('ERROR', "From date should be less than To date", true);
        }
      }

      if (validDates) {
        this.filterStatus(isValidStatusFilter);
        this.filterVendorCompanyId(isValidCompanyIdFilter);
        this.filterRegisteredByCompanyId(isValidRegisteredByCompanyFilter);
        this.filterRegisteredByUserId(isValidRegisteredByUserFilter);
        this.dealsPagination.pageIndex = 1;
        this.dealsPagination.maxResults = 12;
        this.filterMode = true;
        this.filterResponse.isVisible = false;
        this.listDealsForPartner(this.dealsPagination);
      }

    }
  }

  stageNamesForVendor() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.statusLoader = true;
    this.dealsService.getStageNamesForVendor(this.loggedInUserId)
      .subscribe(
        response => {
          this.fromDateFilter;
          this.addSearchableStatus(response);
        },
        error => {
          this.httpRequestLoader.isServerError = true;
          this.statusLoader = false;
          this.isStatusLoadedSuccessfully = false;
        },
        () => { }
      );
  }

  getVendorCompanies() {
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

  private addSearchableStatus(response: any) {
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
    this.statusLoader = false;
    this.referenceService.loading(this.httpRequestLoader, false);
  }


  private filterRegisteredByUserId(isValidRegisteredByUserFilter: boolean) {
    this.dealsPagination.registeredByUserId = 0;
    if (isValidRegisteredByUserFilter) {
      this.dealsPagination.registeredByUserId = this.selectedRegisteredByUserId;
    }
  }

  private filterRegisteredByCompanyId(isValidRegisteredByCompanyFilter: boolean) {
    this.dealsPagination.registeredByCompanyId = 0;
    if (isValidRegisteredByCompanyFilter) {
      this.dealsPagination.registeredByCompanyId = this.selectedRegisteredByCompanyId;
    }
  }

  private filterStatus(isValidStatusFilter: boolean) {
    if (isValidStatusFilter) {
      this.dealsPagination.stageFilter = this.statusFilter;
    } else {
      this.dealsPagination.stageFilter = "";
    }
  }

  private filterVendorCompanyId(isValidCompanyIdFilter) {
    if (isValidCompanyIdFilter) {
      this.dealsPagination.vendorCompanyId = this.vendorCompanyIdFilter;
    } else {
      this.dealsPagination.vendorCompanyId = 0;
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

}