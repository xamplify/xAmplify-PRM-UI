import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HomeComponent } from '../../core/home/home.component';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
import { ListLoaderValue } from '../../common/models/list-loader-value';
import { CustomResponse } from '../../common/models/custom-response';
import { UserService } from 'app/core/services/user.service';
import { DealRegistrationService } from '../../deal-registration/services/deal-registration.service';
import { Roles } from '../../core/models/roles';
import { LeadsService } from '../services/leads.service';
import { Lead } from '../models/lead';
import { IntegrationService } from 'app/core/services/integration.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
declare var swal, $, videojs: any;

@Component({
  selector: 'app-manage-leads',
  templateUrl: './manage-leads.component.html',
  styleUrls: ['./manage-leads.component.css'],
  providers: [Pagination, HomeComponent, HttpRequestLoader, SortOption, ListLoaderValue],
})
export class ManageLeadsComponent implements OnInit {
  loggedInUserId: number = 0;
  superiorId: number = 0;
  isOnlyPartner: any;
  roleName: Roles = new Roles();
  isVendor: boolean;
  isCompanyPartner: boolean;
  isOrgAdmin = false;
  enableLeads = false;
  isVendorVersion = true;
  isPartnerVersion = false;
  selectedTabIndex = 1;
  leadsPagination: Pagination = new Pagination();
  leadsSortOption: SortOption = new SortOption();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  campaignRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  partnerRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  leadFormTitle = "Lead";
  actionType = "add";
  leadId = 0;
  leadsResponse: CustomResponse = new CustomResponse();
  counts: any;
  countsLoader = false;
  syncSalesForce = false;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  listView = true;
  campaignPagination: Pagination = new Pagination();
  campaignSortOption: SortOption = new SortOption();
  partnerPagination: Pagination = new Pagination();
  partnerSortOption: SortOption = new SortOption();
  selectedCampaignId = 0;
  selectedCampaignName = "";
  selectedPartnerCompanyId = 0;
  selectedPartnerCompanyName = "";
  showPartnerList = false;
  showCampaignLeads = false;
  showLeadForm = false;
  showDealForm = false;
  selectedLead: Lead;
  isCommentSection = false;
  selectedCampaign: any;
  showFilterOption: boolean = false;
  fromDateFilter: any = "";
  toDateFilter: any = "";
  filterResponse: CustomResponse = new CustomResponse(); 
  filterMode: boolean = false;

  constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService,
    public utilService: UtilService, public referenceService: ReferenceService,
    public homeComponent: HomeComponent, public xtremandLogger: XtremandLogger,
    public sortOption: SortOption, public pagerService: PagerService, private userService: UserService,
    private dealRegistrationService: DealRegistrationService, private leadsService: LeadsService,
    public integrationService: IntegrationService) {

    this.loggedInUserId = this.authenticationService.getUserId();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;
    } else {
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = false;
    }
    const url = "admin/getRolesByUserId/" + this.loggedInUserId + "?access_token=" + this.authenticationService.access_token;
    // userService.getHomeRoles(url)
    //     .subscribe(
    //         response => {
    //             if (response.statusCode == 200) {
    //                 this.authenticationService.loggedInUserRole = response.data.role;
    //                 this.authenticationService.isPartnerTeamMember = response.data.partnerTeamMember;
    //                 this.authenticationService.superiorRole = response.data.superiorRole;
    //                 if (this.authenticationService.loggedInUserRole == "Team Member") {
    //                     dealRegistrationService.getSuperorId(this.loggedInUserId).subscribe(response => {
    //                         this.superiorId = response;
    //                         this.init();
    //                     });
    //                 } else {
    //                     this.superiorId = this.authenticationService.getUserId();
    //                     this.init();
    //                 }
    //             }
    //         })
    //this.referenceService.loading(this.httpRequestLoader, true);
    this.init();

  }

  ngOnInit() {
    this.countsLoader = true;
    this.referenceService.loading(this.httpRequestLoader, true);
  }

  init() {

    const roles = this.authenticationService.getRoles();
    if (roles !== undefined) {
      if (this.authenticationService.loggedInUserRole != "Team Member") {
        this.isOnlyPartner = this.authenticationService.isOnlyPartner();
        if (
          roles.indexOf(this.roleName.orgAdminRole) > -1 ||
          roles.indexOf(this.roleName.allRole) > -1 ||
          roles.indexOf(this.roleName.vendorRole) > -1 || roles.indexOf(this.roleName.vendorTierRole) > -1) {
          this.isVendor = true;
        }
        if (roles.indexOf(this.roleName.orgAdminRole) > -1) {
          this.isOrgAdmin = true;
        }
        if (this.authenticationService.isCompanyPartner || this.authenticationService.isPartnerTeamMember) {
          this.isCompanyPartner = true;
        }
      } else {
        if (!this.authenticationService.superiorRole.includes("Vendor") && !this.authenticationService.superiorRole.includes("OrgAdmin")
          && this.authenticationService.superiorRole.includes("Partner")) {
          this.isOnlyPartner = true;
        }
        if (this.authenticationService.superiorRole.includes("OrgAdmin")) {
          this.isOrgAdmin = true;
        }
        if (this.authenticationService.superiorRole.includes("Vendor") || this.authenticationService.superiorRole.includes("OrgAdmin")) {
          this.isVendor = true;
        }
        if (this.authenticationService.superiorRole.includes("Partner")) {
          this.isCompanyPartner = true;
        }
      }
    }
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(response => {
      console.log(this.superiorId)
      this.referenceService.getOrgCampaignTypes(response).subscribe(data => {
        this.enableLeads = data.enableLeads;
        if (!this.isOnlyPartner) {
          if (this.authenticationService.vanityURLEnabled) {
            // if (this.authenticationService.isPartnerTeamMember) {
            //   this.showPartner();
            // } else {
            //   this.isCompanyPartner = false;
            //   this.showVendor();
            // }
            this.leadsService.getViewType(this.vanityLoginDto).subscribe(
              response => {
                if (response.statusCode == 200) {
                  if (response.data === "PartnerView") {
                    this.showPartner();
                  } else if (response.data === "VendorView") {
                    this.showVendor();
                  }
                }
              },
              error => {
                this.httpRequestLoader.isServerError = true;
              },
              () => { }
            );
          } else {
            this.showVendor();
          }
        } else {
          this.showPartner();
        }
      });
    });

    console.log(this.authenticationService.getRoles());
  }

  showVendor() {
    if (this.enableLeads) {
      this.isVendorVersion = true;
      this.isPartnerVersion = false;
      this.checkSalesforceIntegration();
      //this.getVendorCounts();
      this.showLeads();
    } else {
      this.showPartner();
    }
  }
  showPartner() {
    this.isVendorVersion = false;
    this.isPartnerVersion = true;
    //this.getPartnerCounts();
    this.showLeads();
  }

  setViewType() {
    this.leadsService.getViewType(this.vanityLoginDto).subscribe(
      response => {
        if (response.statusCode == 200) {
          if (response.data === "PartnerView") {
            this.showPartner();
          } else if (response.data === "VendorView") {
            this.showVendor();
          }
        }
      },
      error => {
        this.httpRequestLoader.isServerError = true;
      },
      () => { }
    );
  }

  getVendorCounts() {
    this.countsLoader = true;
    this.leadsService.getCounts(this.vanityLoginDto)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.counts = response.data.vendorCounts;
            this.countsLoader = false;
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  getPartnerCounts() {
    this.countsLoader = true;
    this.leadsService.getCounts(this.vanityLoginDto)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.countsLoader = false;
            this.counts = response.data.partnerCounts;
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  showLeads() {
    this.getCounts();
    this.selectedTabIndex = 1;
    this.leadsPagination = new Pagination;
    this.campaignPagination = new Pagination;
    if (this.vanityLoginDto.vanityUrlFilter) {
      this.leadsPagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
      this.leadsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
      this.campaignPagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
      this.campaignPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
    }
    this.showCampaignLeads = false;
    this.selectedPartnerCompanyId = 0;
    this.listLeads(this.leadsPagination);
    this.listCampaigns(this.campaignPagination);
  }

  showWonLeads() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.selectedTabIndex = 2;
    this.leadsPagination = new Pagination;
    this.leadsPagination.filterKey = "won";
    this.campaignPagination = new Pagination;
    this.campaignPagination.filterKey = "won";
    this.showCampaignLeads = false;
    this.selectedPartnerCompanyId = 0;
    this.listLeads(this.leadsPagination);
    this.listCampaigns(this.campaignPagination);
  }

  showLostLeads() {
    this.selectedTabIndex = 3;
    this.leadsPagination = new Pagination;
    this.leadsPagination.filterKey = "lost";
    this.campaignPagination = new Pagination;
    this.campaignPagination.filterKey = "lost";
    this.showCampaignLeads = false;
    this.selectedPartnerCompanyId = 0;
    this.listLeads(this.leadsPagination);
    this.listCampaigns(this.campaignPagination);
  }

  showConvertedLeads() {
    this.selectedTabIndex = 4;
    this.leadsPagination = new Pagination;
    this.leadsPagination.filterKey = "converted";
    this.campaignPagination = new Pagination;
    this.campaignPagination.filterKey = "converted";
    this.showCampaignLeads = false;
    this.selectedPartnerCompanyId = 0;
    this.listLeads(this.leadsPagination);
    this.listCampaigns(this.campaignPagination);
  }

  listLeads(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    if (this.isVendorVersion) {
      this.listLeadsForVendor(pagination);
    } else if (this.isPartnerVersion) {
      this.listLeadsForPartner(pagination);
    }
  }

  listCampaigns(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    if (this.isVendorVersion) {
      this.listCampaignsForVendor(pagination);
    } else if (this.isPartnerVersion) {
      this.listCampaignsForPartner(pagination);
    }
  }

  listCampaignsForVendor(pagination: Pagination) {
    this.referenceService.loading(this.campaignRequestLoader, true);
    this.leadsService.listCampaignsForVendor(pagination)
      .subscribe(
        response => {
          this.referenceService.loading(this.campaignRequestLoader, false);
          pagination.totalRecords = response.data.totalRecords;
          this.campaignSortOption.totalRecords = response.data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, response.data.campaigns);
        },
        error => {
          this.campaignRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  listCampaignsForPartner(pagination: Pagination) {
    this.referenceService.loading(this.campaignRequestLoader, true);
    this.leadsService.listCampaignsForPartner(pagination)
      .subscribe(
        response => {
          this.referenceService.loading(this.campaignRequestLoader, false);
          pagination.totalRecords = response.data.totalRecords;
          this.campaignSortOption.totalRecords = response.data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, response.data.campaigns);
        },
        error => {
          this.campaignRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  listLeadsForVendor(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.leadsService.listLeadsForVendor(pagination)
      .subscribe(
        response => {
          this.referenceService.loading(this.httpRequestLoader, false);
          pagination.totalRecords = response.totalRecords;
          this.leadsSortOption.totalRecords = response.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, response.data);
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  listLeadsForPartner(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.leadsService.listLeadsForPartner(pagination)
      .subscribe(
        response => {
          pagination.totalRecords = response.totalRecords;
          this.leadsSortOption.totalRecords = response.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, response.data);
          this.referenceService.loading(this.httpRequestLoader, false);
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  searchLeads() {
    this.getAllFilteredResultsLeads(this.leadsPagination);
  }

  clearSearch() {
    this.leadsSortOption.searchKey='';
    this.getAllFilteredResultsLeads(this.leadsPagination);
  }

  clearPartnerSearch() {
    this.partnerSortOption.searchKey='';
    this.getAllFilteredResultsPartners(this.partnerPagination);
  }

  leadsPaginationDropdown(items: any) {
    this.leadsSortOption.itemsSize = items;
    this.getAllFilteredResultsLeads(this.leadsPagination);
  }

  /************Page************** */
  setLeadsPage(event: any) {
    this.leadsPagination.pageIndex = event.page;
    this.listLeads(this.leadsPagination);
  }

  getAllFilteredResultsLeads(pagination: Pagination) {
    this.leadsPagination.pageIndex = 1;
    this.leadsPagination.searchKey = this.leadsSortOption.searchKey;
    this.listLeads(pagination);
    this.campaignPagination.pageIndex = 1;
    this.campaignPagination.searchKey = this.leadsSortOption.searchKey;
    this.listCampaigns(this.campaignPagination);

  }
  leadEventHandler(keyCode: any) { if (keyCode === 13) { this.searchLeads(); } }

  /************Page************** */
  setCampaignsPage(event: any) {
    // this.pipelineResponse = new CustomResponse();
    // this.customResponse = new CustomResponse();
    this.campaignPagination.pageIndex = event.page;
    this.listCampaigns(this.campaignPagination);
  }

  getAllFilteredResultsCampaigns(pagination: Pagination) {
    this.campaignPagination.pageIndex = 1;
    this.campaignPagination.searchKey = this.campaignSortOption.searchKey;
    this.listCampaigns(this.campaignPagination);
  }

  closeLeadModal() {
    this.showLeadForm = false;
    this.showLeads();
  }

  searchPartners() {
    this.getAllFilteredResultsPartners(this.partnerPagination);
  }

  partnersPaginationDropdown(items: any) {
    this.partnerSortOption.itemsSize = items;
    this.getAllFilteredResultsPartners(this.partnerPagination);
  }

  /************Page************** */
  setPartnersPage(event: any) {

    this.partnerPagination.pageIndex = event.page;
    this.listPartnersForCampaign(this.partnerPagination);
  }

  getAllFilteredResultsPartners(pagination: Pagination) {

    this.partnerPagination.pageIndex = 1;
    this.partnerPagination.searchKey = this.partnerSortOption.searchKey;
    this.listPartnersForCampaign(this.partnerPagination);
  }
  searchPartnersKeyPress(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }

  showSubmitLeadSuccess() {
    this.leadsResponse = new CustomResponse('SUCCESS', "Lead Submitted Successfully", true);
    this.showLeadForm = false;
    this.showLeads();
  }

  addLead() {
    // this.leadFormTitle = "Add a Lead"; 
    // $('#leadFormModel').modal('show');
    this.showLeadForm = true;
    this.actionType = "add";
    this.leadId = 0;
  }

  resetValues() {
    this.showLeadForm = false;
  }

  viewLead(lead: Lead) {
    //this.leadFormTitle = "View Lead";
    // $('#leadFormModel').modal('show');    
    this.showLeadForm = true;
    this.actionType = "view";
    this.leadId = lead.id;

  }

  editLead(lead: Lead) {
    //this.leadFormTitle = "Edit Lead";
    //$('#leadFormModel').modal('show'); 
    this.showLeadForm = true;
    this.actionType = "edit";
    this.leadId = lead.id;
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
            this.showLeads();
          } else if (response.statusCode == 500) {
            this.leadsResponse = new CustomResponse('ERROR', response.message, true);
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );

  }

  getCounts() {
    if (this.isVendorVersion) {
      this.getVendorCounts();
    } else if (this.isPartnerVersion) {
      this.getPartnerCounts();
    }
  }

  showDealRegistrationForm(lead: Lead) {
    this.showDealForm = true;
    this.actionType = "add";
    this.leadId = lead.id;
  }

  closeDealForm() {
    this.showDealForm = false;
    this.showLeads();
  }

  showSubmitDealSuccess() {
    this.leadsResponse = new CustomResponse('SUCCESS', "Deal Submitted Successfully", true);
    this.showDealForm = false;
    this.showLeads();
  }

  checkSalesforceIntegration(): any {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.integrationService.checkConfigurationByTypeAndUserId("isalesforce", this.loggedInUserId).subscribe(data => {
      let response = data;
      if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
        this.integrationService.checkSfCustomFields(this.loggedInUserId).subscribe(cfData => {
          let cfResponse = cfData;
          if (cfResponse.statusCode === 400) {
            this.syncSalesForce = false;
          } else {
            this.syncSalesForce = true;
          }
        }, error => {
          console.log("Error in salesforce checkSalesforceIntegration()");
        }, () => console.log("Error in salesforce checkSalesforceIntegration()"));
        console.log("Error in salesforce checkSalesforceIntegration()");
      } else {
        this.syncSalesForce = false;
      }
    }, error => {
      console.log("Error in salesforce checkSalesforceIntegration()");
    }, () => console.log("Error in checkSalesforceIntegration()"));
    this.referenceService.loading(this.httpRequestLoader, false);
  }

  syncLeadsWithSalesforce() {
    this.leadsResponse = new CustomResponse('SUCCESS', "Synchronization is in progress. This might take few minutes. Please wait...", true);
    this.referenceService.loading(this.httpRequestLoader, true);
    this.leadsService.syncLeadsWithSalesforce(this.loggedInUserId)
      .subscribe(
        data => {
          let statusCode = data.statusCode;
          if (statusCode == 200) {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.leadsResponse = new CustomResponse('SUCCESS', "Synchronization completed successfully", true);
            //this.getCounts();  
            this.showLeads();
          } else if (data.statusCode === 401 && data.message === "Expired Refresh Token") {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.leadsResponse = new CustomResponse('ERROR', "Your Salesforce Integration was expired. Please re-configure.", true);
          } else {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.leadsResponse = new CustomResponse('ERROR', "Synchronization Failed", true);
          }
        },
        error => {

        },
        () => {
          this.referenceService.loading(this.httpRequestLoader, false);
        }
      );
  }

  showPartners(campaign: any) {
    if (campaign.id > 0) {
      this.selectedCampaignId = campaign.id;
      this.selectedCampaignName = campaign.campaign;
      if (campaign.channelCampaign) {
        this.showPartnerList = true;
        campaign.expand = !campaign.expand;
        if (campaign.expand) {
          if (this.selectedCampaign != null && this.selectedCampaign != undefined && this.selectedCampaign.id != campaign.id) {
            this.selectedCampaign.expand = false;
          }
          this.selectedCampaign = campaign;
          this.partnerPagination = new Pagination;
          this.partnerPagination.filterKey = this.campaignPagination.filterKey;
          this.listPartnersForCampaign(this.partnerPagination);
        }
      } else {
        this.showOwnCampaignLeads();
      }
    }
  }

  listPartnersForCampaign(pagination: Pagination) {
    this.referenceService.loading(this.partnerRequestLoader, true);
    pagination.userId = this.loggedInUserId;
    pagination.campaignId = this.selectedCampaignId;
    this.leadsService.listPartnersForCampaign(pagination)
      .subscribe(
        response => {
          this.referenceService.loading(this.partnerRequestLoader, false);
          pagination.totalRecords = response.data.totalRecords;
          this.partnerSortOption.totalRecords = response.data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, response.data.partners);
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  showCampaignLeadsByPartner(partner: any) {
    if (partner.companyId > 0 && this.selectedCampaignId) {
      this.selectedPartnerCompanyId = partner.companyId;
      this.selectedPartnerCompanyName = partner.companyName;
      this.showCampaignLeads = true;
    }
  }

  closeCampaignLeads() {
    this.showCampaignLeads = false;
    this.selectedPartnerCompanyId = 0;
    this.listLeads(this.leadsPagination);
    this.listCampaigns(this.campaignPagination);
  }

  showOwnCampaignLeads() {
    if (this.selectedCampaignId > 0) {
      this.selectedPartnerCompanyId = 0;
      this.selectedPartnerCompanyName = "";
      this.showCampaignLeads = true;
    }
  }

  viewCampaignLeadForm(leadId: any) {
    this.showLeadForm = true;
    this.actionType = "view";
    this.leadId = leadId;

  }

  editCampaignLeadForm(leadId: any) {
    this.showLeadForm = true;
    this.actionType = "edit";
    this.leadId = leadId;
  }

  refreshCounts() {
    this.getCounts();
  }

  registerDealForm(leadId: any) {
    this.showDealForm = true;
    this.actionType = "add";
    this.leadId = leadId;
  }

  showComments(lead: any) {
    this.selectedLead = lead;
    this.isCommentSection = !this.isCommentSection;
  }

  addCommentModalClose(event: any) {
    this.selectedLead.unReadChatCount = 0;
    // console.log(this.selectedLead.unReadChatCount)
    this.isCommentSection = !this.isCommentSection;
  }

  downloadLeads() {
    let type = this.leadsPagination.filterKey;
    let fileName = "";
    if (type == null || type == undefined || type == "") {
      type = "all";
      fileName = "leads"
    } else {
      fileName = type + "-leads"
    }

    let searchKey = "";  
    if (this.leadsPagination.searchKey != null && this.leadsPagination.searchKey != undefined) {
      searchKey = this.leadsPagination.searchKey;
    }   

    let userType = "";
    if (this.isVendorVersion) {
      userType = "v";
    } else if (this.isPartnerVersion) {
      userType = "p";
    }
    let vendorCompanyProfileName = null;
    if (this.leadsPagination.vendorCompanyProfileName != undefined && this.leadsPagination.vendorCompanyProfileName != null) {
      vendorCompanyProfileName = this.leadsPagination.vendorCompanyProfileName;
    }

    // const url = this.authenticationService.REST_URL + "lead/"+userType+"/download/" + type 
    //   + "/" + this.loggedInUserId +"/"+fileName+".csv?access_token=" + this.authenticationService.access_token;

    const url = this.authenticationService.REST_URL + "lead/download/"
      + fileName + ".csv?access_token=" + this.authenticationService.access_token;

    var mapForm = document.createElement("form");
    //mapForm.target = "_blank";
    mapForm.method = "POST";
    mapForm.action = url;

    // userType
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "userType";
    mapInput.setAttribute("value", userType);
    mapForm.appendChild(mapInput);

    // type
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "type";
    mapInput.setAttribute("value", type);
    mapForm.appendChild(mapInput);

    // loggedInUserId
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "userId";
    mapInput.setAttribute("value", this.loggedInUserId + "");
    mapForm.appendChild(mapInput);

    // vanityUrlFilter
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "vanityUrlFilter";
    mapInput.setAttribute("value", this.leadsPagination.vanityUrlFilter + "");
    mapForm.appendChild(mapInput);

    // vendorCompanyProfileName
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "vendorCompanyProfileName";
    mapInput.setAttribute("value", vendorCompanyProfileName);
    mapForm.appendChild(mapInput);

    // searchKey
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "searchKey";
    mapInput.setAttribute("value", searchKey);
    mapForm.appendChild(mapInput);

    // fromDate
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "fromDate";
    mapInput.setAttribute("value", this.leadsPagination.fromDateFilterString);
    mapForm.appendChild(mapInput);

    // toDate
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "toDate";
    mapInput.setAttribute("value", this.leadsPagination.toDateFilterString);
    mapForm.appendChild(mapInput);

    document.body.appendChild(mapForm);
    mapForm.submit();
    //window.location.assign(url);

  }

  toggleFilterOption() {
    this.showFilterOption = !this.showFilterOption;    
    this.fromDateFilter = "";
    this.toDateFilter = "";
    if (!this.showFilterOption) {
      this.leadsPagination.fromDateFilterString = "";
      this.leadsPagination.toDateFilterString = "";
      this.filterResponse.isVisible = false;
      if (this.filterMode) {
        this.leadsPagination.pageIndex = 1;
        this.listLeads(this.leadsPagination);
        this.filterMode = false;
      }      
    } else {
      this.filterMode = false;
    }
  }

  closeFilterOption() {
    this.showFilterOption = false;
    this.fromDateFilter = "";
    this.toDateFilter = ""; 
    this.leadsPagination.fromDateFilterString = "";
    this.leadsPagination.toDateFilterString = "";
    this.filterResponse.isVisible = false;
    if (this.filterMode) {
      this.leadsPagination.pageIndex = 1;
      this.listLeads(this.leadsPagination);
      this.filterMode = false;
    }    
  }

  validateDateFilters() {
    if (this.fromDateFilter != undefined && this.fromDateFilter != "") {
      var fromDate = Date.parse(this.fromDateFilter);
      if (this.toDateFilter != undefined && this.toDateFilter != "") {
        var toDate = Date.parse(this.toDateFilter);
        if (fromDate <= toDate) {
          this.leadsPagination.pageIndex = 1;
          this.leadsPagination.fromDateFilterString = this.fromDateFilter;
          this.leadsPagination.toDateFilterString = this.toDateFilter;
          this.filterMode = true;
          this.filterResponse.isVisible = false;
          this.listLeads(this.leadsPagination);
        } else {
          this.filterResponse = new CustomResponse('ERROR', "From date should be less than To date", true);
        }
      } else {
        this.filterResponse = new CustomResponse('ERROR', "Please pick To Date", true);
      }
    } else {
      this.filterResponse = new CustomResponse('ERROR', "Please pick From Date", true);
    }    
  }

  setListView() {
    this.listView = true;
    this.closeFilterOption();
  }

  setCampaignView() {
    this.listView = false;
    this.closeFilterOption();
  }

}