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
import { DealsService } from '../services/deals.service';
import { LeadsService } from '../../leads/services/leads.service';
import { Deal } from '../models/deal';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { IntegrationService } from 'app/core/services/integration.service';
import { DEAL_CONSTANTS } from 'app/constants/deal.constants';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
declare var swal, $, videojs: any;


@Component({
  selector: 'app-manage-deals',
  templateUrl: './manage-deals.component.html',
  styleUrls: ['./manage-deals.component.css'],
  providers: [Pagination, HomeComponent, HttpRequestLoader, SortOption, ListLoaderValue, LeadsService],
})
export class ManageDealsComponent implements OnInit {
  readonly DEAL_CONSTANTS = DEAL_CONSTANTS;
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
  dealsPagination: Pagination = new Pagination();
  dealsSortOption: SortOption = new SortOption();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  campaignRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  partnerRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  countsRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  showDealForm = false;
  dealsResponse: CustomResponse = new CustomResponse();
  actionType = "add";
  dealId= 0;
  companyId = 0;
  counts : any;
  countsLoader = false;
  vanityLoginDto : VanityLoginDto = new VanityLoginDto();
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
  showCampaignDeals = false;
  selectedDeal: Deal;
  isCommentSection = false;
  selectedCampaign: any;
  showFilterOption: boolean = false;
  fromDateFilter: any = "";
  toDateFilter: any = "";
  filterResponse: CustomResponse = new CustomResponse();
  filterMode: any = false;
  selectedFilterIndex: number = 1;
  stageNamesForFilterDropDown: any;
  prm: boolean;
  vendorList = new Array();
  vendorCompanyIdFilter: any;
  stageList = new Array();
  selectedVendorCompany: any;
  selectedVendorCompanyId: any;
  syncMicrosoft: boolean = false;
  activeCRMDetails: any;
  titleHeading:string = "";
 	/** User Guides */
  mergeTagForGuide:any;
  vendorRole:boolean;
  /** User Guides */

  /** XNFR-426 **/
  deal= new Deal();
  updateCurrentStage:boolean=false;
  currentDealToUpdateStage:Deal;
  textAreaDisable:boolean=false;

  registeredByCompanyLoader = true;
  isRegisteredByCompaniesLoadedSuccessfully = true;
  registeredByCompaniesSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  selectedRegisteredByCompanyId = 0;

  registeredByUsersLoader = true;
  isCloseDisable: boolean = false;

  registeredByUsersSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  isRegisteredByUsersLoadedSuccessfully = true;
  selectedRegisteredByUserId = 0;

  selectedRegisteredForCompanyId = 0;
  registeredForCompaniesLoader = true;
  registeredForCompaniesSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();

  statusFilter: any;
  statusSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  statusLoader = false;
  isStatusLoadedSuccessfully = true;
  isRegisterDealEnabled:boolean = true;

  constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService,
    public utilService: UtilService, public referenceService: ReferenceService,
    public homeComponent: HomeComponent, public xtremandLogger: XtremandLogger,
    public sortOption: SortOption, public pagerService: PagerService, private userService: UserService,
    private dealRegistrationService: DealRegistrationService, private dealsService: DealsService,public leadsService:LeadsService,
    public integrationService: IntegrationService ) {
      this.loggedInUserId = this.authenticationService.getUserId();
      this.statusSearchableDropDownDto.placeHolder = "Select Status";
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
    this.referenceService.scrollSmoothToTop();
    this.countsLoader = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.mergeTagForUserGuide();
  }
  /** User GUide **/
  mergeTagForUserGuide(){
      let roleName = "";
      this.authenticationService.getRoleByUserId().subscribe(
        (data) => {
          const role = data.data;
          roleName = role.role == 'Team Member' ? role.superiorRole : role.role;
          if(roleName.includes('Marketing')){
            this.mergeTagForGuide = "deal_registration_and_management_marketing";
          }else if((this.vendorRole  || this.prm || this.authenticationService.isVendorTeamMember || this.authenticationService.module.isPrmTeamMember) && this.isVendorVersion){
            this.mergeTagForGuide = "manage_deals";
          } else {
            this.mergeTagForGuide = "manage_deals_partner";
          }
        }, error => {
          this.xtremandLogger.errorPage(error);
        }
      );
   }
  /** User Guide **/
  getUserRoles(url: any) {
    this.userService.getHomeRoles(url)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.authenticationService.loggedInUserRole = response.data.role;
            this.authenticationService.isPartnerTeamMember = response.data.partnerTeamMember;
            this.authenticationService.superiorRole = response.data.superiorRole;            
          }
        });
  }

  init() {
    const roles = this.authenticationService.getRoles();
    if (roles !== undefined) {
      if (this.authenticationService.loggedInUserRole != "Team Member") {
        this.isOnlyPartner = this.authenticationService.isOnlyPartner();
        if (
          roles.indexOf(this.roleName.orgAdminRole) > -1 ||
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
        if (roles.indexOf(this.roleName.orgAdminRole) > -1) {
          this.isOrgAdmin = true;
        }
        if (roles.indexOf(this.roleName.companyPartnerRole) > -1 || this.authenticationService.isCompanyPartner || this.authenticationService.isPartnerTeamMember) {
          this.isCompanyPartner = true;
        }
        /** User Guide **/
        if(roles.indexOf(this.roleName.vendorRole) > -1){
          this.vendorRole = true;
        }
        /** User Guide */
      } else {
        if (!this.authenticationService.superiorRole.includes("Vendor") && !this.authenticationService.superiorRole.includes("OrgAdmin")
        && !this.authenticationService.superiorRole.includes("Marketing") && this.authenticationService.superiorRole.includes("Partner")) {
          this.isOnlyPartner = true;
        }
        if (this.authenticationService.superiorRole.includes("OrgAdmin")) {
          this.isOrgAdmin = true;
        }
        if (this.authenticationService.superiorRole.includes("Vendor") || this.authenticationService.superiorRole.includes("OrgAdmin") || this.authenticationService.superiorRole.includes("Marketing")|| this.authenticationService.superiorRole.includes("Prm")) {
          this.isVendor = true;
        }
        if (this.authenticationService.superiorRole.includes("Partner")) {
          this.isCompanyPartner = true;
        }
        if (this.authenticationService.superiorRole.includes("Prm")) {
          this.prm = true;
        }
      }
    }
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(response => {
      this.companyId = response;
      this.referenceService.getOrgCampaignTypes(response).subscribe(data => {
        this.enableLeads = data.enableLeads; 
        if (!this.isOnlyPartner) {
          if (this.authenticationService.vanityURLEnabled) {
            this.dealsService.getViewType(this.vanityLoginDto) .subscribe(
              response => {
                  if(response.statusCode==200){
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
        if(this.authenticationService.module.navigatedFromMyProfileSection){
          if(this.authenticationService.module.navigateToPartnerSection){
            this.showPartner();
          }
          this.addDeal();
          this.authenticationService.module.navigatedFromMyProfileSection = false;
          this.authenticationService.module.navigateToPartnerSection = false;
        }  
      });    
    });
    if (this.authenticationService.vanityURLEnabled) {
      this.integrationService.getVendorRegisterDealValue(this.loggedInUserId,this.vanityLoginDto.vendorCompanyProfileName).subscribe(
        data => {
          if (data.statusCode == 200) {
            this.isRegisterDealEnabled = data.data;
          }
        }
      )
    }
   
  }

    setEnableLeads() {
      this.referenceService.getOrgCampaignTypes(this.companyId).subscribe(data => {
        this.enableLeads = data.enableLeads;              
      });
    }

  showVendor() {
    if (this.enableLeads) {
      this.isVendorVersion = true;
      this.isPartnerVersion = false;
      this.getActiveCRMDetails();
      this.showDeals();
      if (this.prm) {
        this.listView = true;
      }
      this.findAllRegisteredByCompanies();
      this.findAllRegisteredByUsers();
    } else {
      this.showPartner();
    }
  }
  showPartner() {
    this.isVendorVersion = false;
    this.isPartnerVersion = true;
    this.statusSearchableDropDownDto = new SearchableDropdownDto();
    this.showDeals();
    this.getActiveCRMDetails();
    this.findAllRegisteredByUsersForPartnerView();
  }

  getVendorCounts() {
    this.countsLoader = true;
    this.referenceService.loading(this.countsRequestLoader, true);
    this.vanityLoginDto.applyFilter = this.selectedFilterIndex==1;
    this.dealsService.getCounts(this.vanityLoginDto)
    .subscribe(
        response => {
          this.referenceService.loading(this.countsRequestLoader, false);
            if(response.statusCode==200){
              this.counts = response.data.vendorCounts;
            }  
            this.countsLoader = false;          
        },
        error => {
            this.countsRequestLoader.isServerError = true;
            },
        () => { }
    );
  }

  getPartnerCounts() {
    this.countsLoader = true;
    this.dealsService.getCounts(this.vanityLoginDto)
    .subscribe(
        response => {
            if(response.statusCode==200){
              this.counts = response.data.partnerCounts;
            }     
            this.countsLoader = false;       
        },
        error => {
            this.httpRequestLoader.isServerError = true;
            },
        () => { }
    );
  }

  resetDealsPagination() {
    this.dealsPagination.maxResults = 12;
    this.dealsPagination = new Pagination;
    this.dealsPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
    this.showFilterOption = false;
  }

  showDeals() {
    this.getCounts();
    this.selectedTabIndex = 1;
    this.titleHeading = "Total ";
    this.resetDealsPagination();
    this.campaignPagination = new Pagination;
    this.campaignPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
    if(this.vanityLoginDto.vanityUrlFilter){
      this.dealsPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
      this.dealsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
      this.campaignPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
      this.campaignPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
    }
    this.showCampaignDeals = false;
    this.selectedPartnerCompanyId = 0;
    this.listDeals(this.dealsPagination);
    this.listCampaigns(this.campaignPagination);
  }

  showWonDeals() {
    this.selectedTabIndex = 2;
    this.titleHeading = "Won ";
    this.resetDealsPagination();
    this.dealsPagination.filterKey = "won";   
    this.campaignPagination = new Pagination;
    this.campaignPagination.filterKey = "won";
    this.campaignPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
    this.showCampaignDeals = false;
    this.selectedPartnerCompanyId = 0;
    if(this.vanityLoginDto.vanityUrlFilter){
      this.dealsPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
      this.dealsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
      this.campaignPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
      this.campaignPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
    }
    this.listDeals(this.dealsPagination);
    this.listCampaigns(this.campaignPagination);
  }

  showLostDeals() {
    this.selectedTabIndex = 3;
    this.titleHeading = "Lost ";
    this.resetDealsPagination();
    this.dealsPagination.filterKey = "lost";    
    this.campaignPagination = new Pagination;
    this.campaignPagination.filterKey = "lost";
    this.campaignPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
    this.showCampaignDeals = false;
    this.selectedPartnerCompanyId = 0;
    if(this.vanityLoginDto.vanityUrlFilter){
      this.dealsPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
      this.dealsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
      this.campaignPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
      this.campaignPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
    }
    this.listDeals(this.dealsPagination);
    this.listCampaigns(this.campaignPagination);
  }

  listDeals(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    if (this.isVendorVersion) {      
      this.listDealsForVendor(pagination);
    } else if (this.isPartnerVersion) {
      this.listDealsForPartner(pagination);
    }
    
  }  

  listDealsForVendor(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dealsService.listDealsForVendor(pagination)
    .subscribe(
        response => {
            this.referenceService.loading(this.httpRequestLoader, false);
            pagination.totalRecords = response.totalRecords;
            this.dealsSortOption.totalRecords = response.totalRecords;
            pagination = this.pagerService.getPagedItems(pagination, response.data);
            this.stageNamesForVendor();
        },
        error => {
            this.httpRequestLoader.isServerError = true;
            },
        () => { }
    );
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

  listDealsForPartner(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dealsService.listDealsForPartner(pagination)
    .subscribe(
        response => {
            this.referenceService.loading(this.httpRequestLoader, false);
            pagination.totalRecords = response.totalRecords;
            this.dealsSortOption.totalRecords = response.totalRecords;
            pagination = this.pagerService.getPagedItems(pagination, response.data);
            if (!this.vanityLoginDto.vanityUrlFilter) {
              this.getVendorCompanies();
            } else {
              this.getVendorCompanyAndGetStages();
            }
        },
        error => {
            this.httpRequestLoader.isServerError = true;
            },
        () => { }
    );
  }

  getVendorCompanies(){
    this.leadsService.getVendorList(this.loggedInUserId)
    .subscribe(
      response =>{
        this.vendorList = response.data;
        let dtos = [];
        $.each(this.vendorList,function(index:number,vendor:any){
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
      error=>{
        this.httpRequestLoader.isServerError = true;
        this.registeredForCompaniesLoader = false;
      },
      ()=> { }
    ); 
  }

  getVendorCompanyAndGetStages() {
    this.leadsService.getCompanyIdByCompanyProfileName(this.vanityLoginDto.vendorCompanyProfileName, this.loggedInUserId)
      .subscribe(
        data => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (data.statusCode == 200) {
            this.getStageNamesForPartnerByVendorCompanyId(data.data);
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  onChangeVendorCompany() {
    this.statusFilter = "";
    if (this.vendorCompanyIdFilter !== undefined && this.vendorCompanyIdFilter !== "") {
      this.statusLoader = true;
      this.statusSearchableDropDownDto.data = [];
      this.getStageNamesForPartnerByVendorCompanyId(this.vendorCompanyIdFilter);
    }
  }

  getStageNamesForPartnerByVendorCompanyId(vendorCompanyId: any) {
    this.dealsService.getStageNamesForPartnerByVendorCompanyId(this.loggedInUserId, vendorCompanyId)
      .subscribe(
        response => {
          this.addSearchableStatus(response);
        },
        error => {
          this.httpRequestLoader.isServerError = true;
          this.isStatusLoadedSuccessfully = false;
        },
        () => { }
      );
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
    this.dealsService.listCampaignsForVendor(pagination)
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
    this.dealsService.listCampaignsForPartner(pagination)
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

  searchDeals() {
    this.getAllFilteredResultsDeals(this.dealsPagination);
  }

  dealsPaginationDropdown(items: any) {
    this.dealsSortOption.itemsSize = items;
    this.getAllFilteredResultsDeals(this.dealsPagination);
  }

  /************Page************** */
  setDealsPage(event: any) {
   // this.pipelineResponse = new CustomResponse();
   // this.customResponse = new CustomResponse();
    this.dealsPagination.pageIndex = event.page;
    this.listDeals(this.dealsPagination);
  }

  getAllFilteredResultsDeals(pagination: Pagination) {
    this.dealsPagination.pageIndex = 1;
    this.dealsPagination.searchKey = this.dealsSortOption.searchKey;
    this.listDeals(this.dealsPagination);
    this.campaignPagination.pageIndex = 1;
    this.campaignPagination.searchKey = this.dealsSortOption.searchKey;
    this.listCampaigns(this.campaignPagination);
  }
  dealEventHandler(keyCode: any) { if (keyCode === 13) { this.searchDeals(); } }

  setCampaignsPage(event: any) {   
     this.campaignPagination.pageIndex = event.page;
     this.listCampaigns(this.campaignPagination);
   }

  closeDealForm() {
    this.showDealForm = false;
    this.showDeals();
    this.textAreaDisable=false;//xnfr-426
  }

  showSubmitDealSuccess() {
    if (this.actionType == 'edit') {
      this.dealsResponse = new CustomResponse('SUCCESS', "Deal Updated Successfully", true);
    } else {
      this.dealsResponse = new CustomResponse('SUCCESS', "Deal Submitted Successfully", true);
    }
    this.showDealForm = false;
    this.showFilterOption = false;
    //this.getCounts();    
    this.showDeals();
  }

  
  /************Partners Pagination************** */
  searchPartners() {
    this.getAllFilteredResultsPartners(this.partnerPagination);
  }

  partnersPaginationDropdown(items: any) {
    this.partnerSortOption.itemsSize = items;
    this.getAllFilteredResultsPartners(this.partnerPagination);
  }

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

  addDeal() {   
    this.showDealForm = true;
    this.actionType = "add";
    this.dealId = 0;
    this.dealsResponse.isVisible = false;    
  }

  viewDeal(deal: Deal) {
    this.showDealForm = true;   
    this.actionType = "view";
    this.dealId = deal.id;
    this.dealsResponse.isVisible = false;
  }

  editDeal(deal: Deal) {
    this.showDealForm = true;  
    this.actionType = "edit";
    this.dealId = deal.id;
    this.selectedDeal=deal;/****xnfr-426******/
    this.textAreaDisable=true;
    this.dealsResponse.isVisible = false;

  }

  confirmDeleteDeal (deal: Deal) {
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
          if(response.statusCode==200){
            this.dealsResponse = new CustomResponse('SUCCESS', "Deal Deleted Successfully", true); 
            //this.getCounts();  
            this.showDeals();                         
        } else if (response.statusCode==500) {
            this.dealsResponse = new CustomResponse('ERROR', response.message, true);
        }
      },
      error => {
          this.httpRequestLoader.isServerError = true;
          },
      () => { this.showFilterOption = false;}
  );

 }

 getCounts() {
  if (this.isVendorVersion) {
    this.getVendorCounts();
  } else if (this.isPartnerVersion) {
    this.getPartnerCounts();
  }
 }

//  resetCounts() {
//   if (this.isVendorVersion) {
//     this.getVendorCounts();
//   } else if (this.isPartnerVersion) {
//     this.getPartnerCounts();
//   }
// }

  setDealStatus(deal: Deal,deletedPartner:boolean) {
    if(!deletedPartner){
      this.referenceService.loading(this.httpRequestLoader, true);
      let request: Deal = new Deal();
      request.id = deal.id;
      request.pipelineStageId = deal.pipelineStageId;
      request.userId = this.loggedInUserId;
      this.dealsService.changeDealStatus(request)
        .subscribe(
          response => {
            this.referenceService.loading(this.httpRequestLoader, false);
            if (response.statusCode == 200) {
              this.dealsResponse = new CustomResponse('SUCCESS', "Status Updated Successfully", true);
             // this.getCounts();
              this.showDeals();
            } else if (response.statusCode == 500) {
              this.dealsResponse = new CustomResponse('ERROR', response.message, true);
            }
          },
          error => {
            this.httpRequestLoader.isServerError = true;
          },
          () => { }
        );
    }else{
      this.referenceService.showSweetAlert("This Option Is Not Available","","info");
    }
    
  }

  showPartners(campaign: any) {
    if (campaign.id > 0) {
      this.selectedCampaignId = campaign.id ;
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
          this.partnerPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
          this.partnerSortOption.searchKey = "";
          this.listPartnersForCampaign(this.partnerPagination);
        }
      } else {
        this.showOwnCampaignDeals();
      }            
    }
  }
  
  listPartnersForCampaign (pagination: Pagination) {
    this.referenceService.loading(this.partnerRequestLoader, true);
      pagination.userId = this.loggedInUserId;
      pagination.campaignId = this.selectedCampaignId;
      this.dealsService.listPartnersForCampaign(pagination)
      .subscribe(
          response => {            
              this.referenceService.loading(this.partnerRequestLoader, false);
              pagination.totalRecords = response.data.totalRecords;
              this.partnerSortOption.totalRecords = response.data.totalRecords;
              pagination = this.pagerService.getPagedItems(pagination, response.data.partners);
          },
          error => {
              this.partnerRequestLoader.isServerError = true;
              },
          () => { }
      );
  }
  
  showCampaignDealsByPartner(partner: any) {
    if (partner.companyId > 0  && this.selectedCampaignId) {
      this.selectedPartnerCompanyId = partner.companyId ;
      this.selectedPartnerCompanyName = partner.companyName;
      this.showCampaignDeals = true;          
    }
  }
  
  closeCampaignDeals() {
    this.showCampaignDeals = false; 
    this.selectedPartnerCompanyId = 0;
    this.listDeals(this.dealsPagination);
    this.listCampaigns(this.campaignPagination);
  }
  
  showOwnCampaignDeals() {
    if (this.selectedCampaignId > 0) {
      this.selectedPartnerCompanyId = 0 ;
      this.selectedPartnerCompanyName = "";
      this.showCampaignDeals = true;          
    }
  }

  viewCampaignDealForm(dealId: any) {
    this.showDealForm = true;   
    this.actionType = "view";
    this.dealId = dealId;
    
  }

  editCampaignDealForm(deal:Deal) {
    this.showDealForm = true;   
    this.actionType = "edit";
    this.selectedDeal = deal;
    this.textAreaDisable = true;
    this.dealId = deal.id;
  }

  refreshCounts() {
    this.getCounts();
  }

  showComments(deal: any) {
    this.selectedDeal = deal;
    this.isCommentSection = !this.isCommentSection;
  }

  addCommentModalClose(event: any) {
    this.selectedDeal.unReadChatCount = 0;
    this.isCommentSection = !this.isCommentSection;
  }

  downloadDeals1() {
    let type = this.dealsPagination.filterKey;
    let fileName = "";
    if (type == null || type == undefined || type == "") {
      type = "all";
      fileName = "deals"
    } else {
      fileName = type + "-deals"
    }
    let vendorCompanyProfileName = null;
    if (this.dealsPagination.vendorCompanyProfileName != undefined && this.dealsPagination.vendorCompanyProfileName != null) {
      vendorCompanyProfileName = this.dealsPagination.vendorCompanyProfileName;
    }

    let vendorCompanyId = null;
    if (this.dealsPagination.vendorCompanyId != undefined && this.dealsPagination.vendorCompanyId != null) {
      vendorCompanyId = this.dealsPagination.vendorCompanyId;
    } else {
      vendorCompanyId = 0;
    }

    let partnerTeamMemberGroupFilter = false; 
    let userType = "";
    if (this.isVendorVersion) {
      partnerTeamMemberGroupFilter = this.selectedFilterIndex == 1;
      userType = "v";
    } else if (this.isPartnerVersion) {
      userType = "p";
    }

    let searchKey = "";  
    if (this.dealsPagination.searchKey != null && this.dealsPagination.searchKey != undefined) {
      searchKey = this.dealsPagination.searchKey;
    }
    const url = this.authenticationService.REST_URL + "deal/download/"
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
    mapInput.setAttribute("value", this.dealsPagination.vanityUrlFilter + "");
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
    mapInput.setAttribute("value", this.dealsPagination.fromDateFilterString);
    mapForm.appendChild(mapInput);

    // toDate
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "toDate";
    mapInput.setAttribute("value", this.dealsPagination.toDateFilterString);
    mapForm.appendChild(mapInput);

    //stageName
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "stageName";
    mapInput.setAttribute("value", this.dealsPagination.stageFilter);
    mapForm.appendChild(mapInput);
    
    //vendorCompanyIdFilter
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "createdForCompanyId";
    mapInput.setAttribute("value", vendorCompanyId);
    mapForm.appendChild(mapInput);
    
    // partnerTeamMemberGroupFilter
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "partnerTeamMemberGroupFilter";
    mapInput.setAttribute("value", partnerTeamMemberGroupFilter+"");
    mapForm.appendChild(mapInput);
    
    // clientTimeZone
    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "timeZone";
    mapInput.setAttribute("value", Intl.DateTimeFormat().resolvedOptions().timeZone);
    mapForm.appendChild(mapInput);

    document.body.appendChild(mapForm);
    mapForm.submit();
  
  }

  toggleFilterOption() {
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
        this.listDeals(this.dealsPagination);
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
      this.listDeals(this.dealsPagination);
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
    let isValidCompanyIdFilter = this.vendorCompanyIdFilter != undefined && this.vendorCompanyIdFilter>0;
    let isInValidRegisteredByCompanyFilter = this.selectedRegisteredByCompanyId==undefined || this.selectedRegisteredByCompanyId==0;
    let isValidRegisteredByCompanyFilter = this.selectedRegisteredByCompanyId!=undefined && this.selectedRegisteredByCompanyId>0;
    let isInValidRegisteredByUserFilter = this.selectedRegisteredByUserId==undefined || this.selectedRegisteredByUserId==0;
    let isValidRegisteredByUserFilter = this.selectedRegisteredByUserId!=undefined && this.selectedRegisteredByUserId>0;
    if (isInvalidStatusFilter && isEmptyFromDateFilter && isEmptyToDateFilter && isInvalidCompanyIdFilter
       && isInValidRegisteredByCompanyFilter && isInValidRegisteredByUserFilter) {
        this.filterResponse = new CustomResponse('ERROR', "Please provide valid input to filter", true);
    } else { 
      let validDates = false;   
      if (isEmptyFromDateFilter && isEmptyToDateFilter ) {
          validDates = true;
      } else if (isValidFromDateFilter && isEmptyToDateFilter ) {
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
        this.listDeals(this.dealsPagination);
      }
      
    }
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

  private filterStatus(isValidStatusFilter:boolean) {
    if (isValidStatusFilter) {
      this.dealsPagination.stageFilter = this.statusFilter;
    }else {
      this.dealsPagination.stageFilter = "";
    }
  }

  private filterVendorCompanyId(isValidCompanyIdFilter) {
    if (isValidCompanyIdFilter) {
      this.dealsPagination.vendorCompanyId = this.vendorCompanyIdFilter;
    }else {
      this.dealsPagination.vendorCompanyId = 0;
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

  clearSearch() {
    this.dealsSortOption.searchKey='';
    this.getAllFilteredResultsDeals(this.dealsPagination);
  }

  clearPartnerSearch() {
    this.partnerSortOption.searchKey='';
    this.getAllFilteredResultsPartners(this.partnerPagination);
  }

  getSelectedIndex(index:number){
    this.selectedFilterIndex = index;
    this.getCounts();
    this.referenceService.setTeamMemberFilterForPagination(this.dealsPagination,index);
    this.referenceService.setTeamMemberFilterForPagination(this.campaignPagination,index);
    this.listDealsForVendor(this.dealsPagination);
    this.listCampaignsForVendor(this.campaignPagination);
    
  }
  stageNamesOfV(){
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dealsService.getStageNamesOfV(this.loggedInUserId)
    .subscribe(
      response =>{
        this.referenceService.loading(this.httpRequestLoader, false);
        this.stageNamesForFilterDropDown = response;

      },
      error=>{
        this.httpRequestLoader.isServerError = true;
      },
      ()=> { }
    ); 
  }
  stageNamesForPartner(){
    this.referenceService.loading(this.httpRequestLoader, true);
    this.leadsService.getVendorList(this.loggedInUserId)
    .subscribe(
      response =>{
        this.referenceService.loading(this.httpRequestLoader, false);
        this.vendorList = response.data;
      },
      error=>{
        this.httpRequestLoader.isServerError = true;
      },
      ()=> { }
    ); 
  }
  stageNamesForPartnerCompanyId(event : any){
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dealsService.getStagenamesForPartnerCompanyId(event)
    .subscribe(
      response =>{
        this.referenceService.loading(this.httpRequestLoader, false);
        this.stageList = response;
      },
      error=>{
        this.httpRequestLoader.isServerError = true;
      },
      ()=> { }
    ); 
  }

  checkMicrosoftIntegration(): any {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.integrationService.checkConfigurationByTypeAndUserId("microsoft", this.loggedInUserId).subscribe(data => {
      let response = data;
      if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
        this.syncMicrosoft = true;  
      } else {
        this.syncMicrosoft = false;
      }
    }, error => {
      console.log("Error in salesforce checkMicrosoftIntegration()");
    }, () => console.log("Error in checkMicrosoftIntegration()"));
    this.referenceService.loading(this.httpRequestLoader, false);
  }

  syncLeadsWithMicrosoft() {
    this.dealsResponse = new CustomResponse('SUCCESS', "Synchronization is in progress. This might take few minutes. Please wait...", true);
    this.referenceService.loading(this.httpRequestLoader, true);
    this.leadsService.syncLeadsWithMicrosoft(this.loggedInUserId)
      .subscribe(
        data => {
          let statusCode = data.statusCode;
          if (statusCode == 200) {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.dealsResponse = new CustomResponse('SUCCESS', "Synchronization completed successfully", true);
            //this.getCounts();  
            this.showDeals();
          } else {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.dealsResponse = new CustomResponse('ERROR', "Synchronization Failed", true);
          }
        },
        error => {
          this.referenceService.loading(this.httpRequestLoader, false);
        },
        () => {
          // this.referenceService.loading(this.httpRequestLoader, false);
        }
      );
  }

  syncLeadsWithSalesforce() {
    this.dealsResponse = new CustomResponse('SUCCESS', "Synchronization is in progress. This might take few minutes. Please wait...", true);
    this.referenceService.loading(this.httpRequestLoader, true);
    this.leadsService.syncLeadsWithSalesforce(this.loggedInUserId)
      .subscribe(
        data => {
          let statusCode = data.statusCode;
          if (statusCode == 200) {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.dealsResponse = new CustomResponse('SUCCESS', "Synchronization completed successfully", true);
            //this.getCounts();  
            this.showDeals();
          } else if (data.statusCode === 401 && data.message === "Expired Refresh Token") {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.dealsResponse = new CustomResponse('ERROR', "Your Salesforce Integration was expired. Please re-configure.", true);
          } else {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.dealsResponse = new CustomResponse('ERROR', "Synchronization Failed", true);
          }
        },
        error => {
          this.referenceService.loading(this.httpRequestLoader, false);
        },
        () => {
          // this.referenceService.loading(this.httpRequestLoader, false);
        }
      );
  }

  getActiveCRMDetails() {
    this.integrationService.getActiveCRMDetailsByUserId(this.loggedInUserId)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.activeCRMDetails = response.data;            
          }
        },
        error => {
          console.log(error);
        },
        () => {
          
        });
  }

  syncLeadsAndDeals() {
    if (this.activeCRMDetails.type === 'SALESFORCE') {
      this.syncLeadsWithSalesforce();
    } else {
      this.syncLeadsWithActiveCRM();
    }
  }

  syncLeadsWithActiveCRM() {
    this.dealsResponse = new CustomResponse('SUCCESS', "Synchronization is in progress. This might take few minutes. Please wait...", true);
    this.referenceService.loading(this.httpRequestLoader, true);
    this.referenceService.loading(this.campaignRequestLoader,true);
    this.leadsService.syncLeadsWithActiveCRM(this.loggedInUserId)
      .subscribe(
        data => {
          let statusCode = data.statusCode;
          if (statusCode == 200) {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.dealsResponse = new CustomResponse('SUCCESS', "Synchronization completed successfully", true);
            //this.getCounts();  
            this.showDeals();
          } else if (data.statusCode === 401 && data.message === "Expired Refresh Token") {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.dealsResponse = new CustomResponse('ERROR', "Your Salesforce Integration was expired. Please re-configure.", true);
          }
           else {
            this.referenceService.loading(this.httpRequestLoader, false);
            this.dealsResponse = new CustomResponse('ERROR', "Synchronization Failed", true);
          }
        },
        error => {
          this.referenceService.loading(this.httpRequestLoader, false);
          let integrationType = (this.activeCRMDetails.type).charAt(0)+(this.activeCRMDetails.type).substring(1).toLocaleLowerCase();
          if(integrationType == 'Salesforce' || integrationType == 'Halopsa'){
            this.dealsResponse = new CustomResponse('ERROR', "Your "+integrationType+" integration is not valid. Re-configure with valid credentials ",true);
          } else {
            this.dealsResponse = new CustomResponse('ERROR', "Your "+integrationType+" integration is not valid. Re-configure with valid API Token",true);
          }


        },
        () => {
          // this.referenceService.loading(this.httpRequestLoader, false);
        }
      );
  }


  /***** XNFR-470 *****/
  downloadDeals(pagination: Pagination){
    let type = this.dealsPagination.filterKey;
    if (type == null || type == undefined || type == "") {
      type = "all";
    }
    let partnerTeamMemberGroupFilter = false; 
    let userType = "";
    if (this.isVendorVersion) {
      partnerTeamMemberGroupFilter = this.selectedFilterIndex == 1;
      userType = "v";
    } else if (this.isPartnerVersion) {
      userType = "p";
    }
    pagination.type = type;
    pagination.userType = userType;
    pagination.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    pagination.partnerTeamMemberGroupFilter = partnerTeamMemberGroupFilter;
    this.dealsService.downloadDeals(pagination, this.loggedInUserId)
        .subscribe(
            data => {    
                if(data.statusCode == 200){
                  this.dealsResponse = new CustomResponse('SUCCESS', data.message, true);
                }else if(data.statusCode == 401){
                  this.dealsResponse = new CustomResponse('SUCCESS', data.message, true);
                }
            },error => {
              this.httpRequestLoader.isServerError = true;
            },
            () => { console.log("DownloadDeals() Completed...!") }
          );
  }
  /****xnfr-426******/
  updatePipelineStage(deal:Deal,deletedPartner:boolean){
    if(!deletedPartner){
      this.currentDealToUpdateStage = deal;
      this.updateCurrentStage = true;
      this.textAreaDisable=true;
    }else{
      this.referenceService.showSweetAlert("This Option Is Not Available","","info");
    }
  }

  resetModalPopup(){
    this.updateCurrentStage = false;
    this.isCommentSection = false;
    this.textAreaDisable=false;
    this.showDeals();
  }

  stageUpdateResponse(event:any){
    this.dealsResponse = (event === 200) ? new CustomResponse('SUCCESS', "Status Updated Successfully", true) : new CustomResponse('ERROR', "Invalid Input", true);

  }

  
  findAllRegisteredByCompanies(){
    this.registeredByCompanyLoader = true;
    this.dealsService.findAllRegisteredByCompanies().subscribe(
      response=>{
        this.registeredByCompaniesSearchableDropDownDto.data = response.data;
		    this.registeredByCompaniesSearchableDropDownDto.placeHolder = "Select "+DEAL_CONSTANTS.addedBy+" Company";
        this.isRegisteredByCompaniesLoadedSuccessfully = true;
        this.registeredByCompanyLoader = false;
      },error=>{
        this.registeredByCompanyLoader = false;
        this.isRegisteredByCompaniesLoadedSuccessfully = false;
      });
  }

  getSelectedRegisteredByCompanyId(event:any){
    if(event!=null){
			this.selectedRegisteredByCompanyId = event['id'];
		}else{
			this.selectedRegisteredByCompanyId = 0;
		}
  }

  findAllRegisteredByUsers(){
    this.registeredByUsersLoader = true;
    this.dealsService.findAllRegisteredByUsers().subscribe(
      response=>{
        this.registeredByUsersSearchableDropDownDto.data = response.data;
        this.registeredByUsersSearchableDropDownDto.placeHolder = "Select "+DEAL_CONSTANTS.addedBy;
        this.isRegisteredByUsersLoadedSuccessfully = true;
        this.registeredByUsersLoader = false;
      },error=>{
        this.registeredByUsersLoader = false;
        this.isRegisteredByUsersLoadedSuccessfully = false;
      });
  }

  findAllRegisteredByUsersForPartnerView() {
    this.registeredByUsersLoader = true;
    this.dealsService.findAllRegisteredByUsersForPartnerView().subscribe(
      response=>{
        this.registeredByUsersSearchableDropDownDto.data = response.data;
        this.registeredByUsersSearchableDropDownDto.placeHolder = "Select "+DEAL_CONSTANTS.addedBy;
        this.isRegisteredByUsersLoadedSuccessfully = true;
        this.registeredByUsersLoader = false;
      },error=>{
        this.registeredByUsersLoader = false;
        this.isRegisteredByUsersLoadedSuccessfully = false;
      });
  }

  getSelectedRegisteredByUserId(event:any){
    if(event!=null){
			this.selectedRegisteredByUserId = event['id'];
		}else{
			this.selectedRegisteredByUserId = 0;
		}
  }
  getSelectedRegisteredForCompanyId(event:any){
    if(event!=null){
			this.vendorCompanyIdFilter = event['id'];
		}else{
			this.vendorCompanyIdFilter = 0;
		}
    this.onChangeVendorCompany();
  }

  getSelectedStatus(event:any){
    if(event!=null){
			this.statusFilter = event['id'];
		}else{
			this.statusFilter = "";
		}
   
  }

}
