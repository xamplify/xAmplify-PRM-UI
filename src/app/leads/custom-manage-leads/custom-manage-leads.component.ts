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
  @Input() isPartnerVersion: boolean;
  @Input() isVendorVersion: boolean;
  @Input() isOrgAdmin: boolean = false;
  @Input() isVendor: boolean = false;
  @Input() selectedContact: any;
  @Input() public isConvertingContactToLead: boolean = false;
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
  leadsResponse: CustomResponse;
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
  }

  ngOnInit() {
    this.showLeads();
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
            this.leadsResponse = new CustomResponse('SUCCESS', "Lead Deleted Successfully", true);
            //this.getCounts();  
            // this.showLeads();
          } else if (response.statusCode == 500) {
            this.leadsResponse = new CustomResponse('ERROR', response.message, true);
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
      this.leadsResponse = new CustomResponse('SUCCESS', "Lead Updated Successfully", true);
    } else {
      this.leadsResponse = new CustomResponse('SUCCESS', "Lead Submitted Successfully", true);
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

}
