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
  leadsPagination: Pagination;
  leadsSortOption: SortOption = new SortOption();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  leadFormTitle = "Lead";
  actionType = "add";
  leadId = 0;
  showLeadForm = false;
  showDealForm = false;
  leadsResponse: CustomResponse = new CustomResponse();
  counts : any;
  countsLoader = false;

  constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService,
    public utilService: UtilService, public referenceService: ReferenceService,
    public homeComponent: HomeComponent, public xtremandLogger: XtremandLogger,
    public sortOption: SortOption, public pagerService: PagerService, private userService: UserService,
    private dealRegistrationService: DealRegistrationService, private leadsService: LeadsService) {

      this.loggedInUserId = this.authenticationService.getUserId();
        const url = "admin/getRolesByUserId/" + this.loggedInUserId + "?access_token=" + this.authenticationService.access_token;
        userService.getHomeRoles(url)
            .subscribe(
                response => {
                    if (response.statusCode == 200) {
                        this.authenticationService.loggedInUserRole = response.data.role;
                        this.authenticationService.isPartnerTeamMember = response.data.partnerTeamMember;
                        this.authenticationService.superiorRole = response.data.superiorRole;
                        if (this.authenticationService.loggedInUserRole == "Team Member") {
                            dealRegistrationService.getSuperorId(this.loggedInUserId).subscribe(response => {
                                this.superiorId = response;
                                this.init();
                            });
                        } else {
                            this.superiorId = this.authenticationService.getUserId();
                            this.init();
                        }
                    }
                })
        
  }

  ngOnInit() {   
    this.countsLoader = true;
    this.referenceService.loading(this.httpRequestLoader, true);
  }

  initVendorOrPartner() {
    if (!this.isOnlyPartner) {
      if (this.authenticationService.vanityURLEnabled) {
        if (this.authenticationService.isPartnerTeamMember) {
          this.showPartner();
        } else {
          this.isCompanyPartner = false;
          this.showVendor();
        }
      } else {
        this.showVendor();
      }
    } else {
      this.showPartner();
    }
  }

  getUserRoles(url: any) {
    this.userService.getHomeRoles(url)
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.authenticationService.loggedInUserRole = response.data.role;
            this.authenticationService.isPartnerTeamMember = response.data.partnerTeamMember;
            this.authenticationService.superiorRole = response.data.superiorRole; 
            if (this.authenticationService.loggedInUserRole == "Team Member") {
              this.dealRegistrationService.getSuperorId(this.loggedInUserId).subscribe(response => {
                this.superiorId = response; 
                this.init();       
              });
            } else {
              this.superiorId = this.authenticationService.getUserId();
              this.init();
            }           
          }
        },
        () => {
          
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
    this.referenceService.getCompanyIdByUserId(this.superiorId).subscribe(response => {
      console.log(this.superiorId)
      this.referenceService.getOrgCampaignTypes(response).subscribe(data => {
        this.enableLeads = data.enableLeads; 
        if (!this.isOnlyPartner) {
          if (this.authenticationService.vanityURLEnabled) {
            if (this.authenticationService.isPartnerTeamMember) {
              this.showPartner();
            } else {
              this.isCompanyPartner = false;
              this.showVendor();
            }
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
      this.getVendorCounts();
      this.showLeads();
      //this.switchVersions();
    } else {
      this.showPartner();
    }
  }
  showPartner() {
    if (this.isCompanyPartner) {
      this.isVendorVersion = false;
      this.isPartnerVersion = true;
      this.getPartnerCounts();
      this.showLeads();
      //this.switchVersions();
    }
  }

  getVendorCounts() {
    this.countsLoader = true;
    this.leadsService.getCounts(this.loggedInUserId)
    .subscribe(
        response => {
            if(response.statusCode==200){
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
    this.leadsService.getCounts(this.loggedInUserId)
    .subscribe(
        response => {
            if(response.statusCode==200){
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
    this.selectedTabIndex = 1;
    this.leadsPagination = new Pagination;
    this.listLeads(this.leadsPagination);
  }

  showWonLeads() {
    this.selectedTabIndex = 2;
    this.leadsPagination = new Pagination;
    this.leadsPagination.filterKey = "won";
    this.listLeads(this.leadsPagination);
  }

  showLostLeads() {
    this.selectedTabIndex = 3;
    this.leadsPagination = new Pagination;
    this.leadsPagination.filterKey = "lost";
    this.listLeads(this.leadsPagination);
  }

  showConvertedLeads() {
    this.selectedTabIndex = 4;
    this.leadsPagination = new Pagination;
    this.leadsPagination.filterKey = "converted";
    this.listLeads(this.leadsPagination);
  }

  listLeads(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    if (this.isVendorVersion) {
      this.listLeadsForVendor(pagination);
    } else if (this.isPartnerVersion) {
      this.listLeadsForPartner(pagination);
    }
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

  searchLeads() {
    this.getAllFilteredResultsLeads(this.leadsPagination);
  }

  leadsPaginationDropdown(items: any) {
    this.leadsSortOption.itemsSize = items;
    this.getAllFilteredResultsLeads(this.leadsPagination);
  }

  /************Page************** */
  setLeadsPage(event: any) {
   // this.pipelineResponse = new CustomResponse();
   // this.customResponse = new CustomResponse();
    this.leadsPagination.pageIndex = event.page;
    this.listLeads(this.leadsPagination);
  }

  getAllFilteredResultsLeads(pagination: Pagination) {
    //this.pipelineResponse = new CustomResponse();
    //this.customResponse = new CustomResponse();
    this.leadsPagination.pageIndex = 1;
    this.leadsPagination.searchKey = this.leadsSortOption.searchKey;
    this.listLeads(this.leadsPagination);
  }
  leadEventHandler(keyCode: any) { if (keyCode === 13) { this.searchLeads(); } }

  closeLeadModal() {  
    this.showLeadForm = false;
    if (this.isVendorVersion) {
      this.getVendorCounts();
    } else if (this.isPartnerVersion) {
      this.getPartnerCounts();
    }
    this.showLeads();
  }

  showSubmitLeadSuccess() {  
    this.leadsResponse = new CustomResponse('SUCCESS', "Lead Submitted Successfully", true);
    this.showLeadForm = false;
    if (this.isVendorVersion) {
      this.getVendorCounts();
    } else if (this.isPartnerVersion) {
      this.getPartnerCounts();
    }
    this.showLeads();
  }

  addLead() {
   // this.leadFormTitle = "Add a Lead"; 
   // $('#leadFormModel').modal('show');
    this.showLeadForm = true;
    this.actionType = "add";
    this.leadId = 0;    
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

  confirmDeleteLead (lead: Lead) {
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
          if(response.statusCode==200){
            this.leadsResponse = new CustomResponse('SUCCESS', "Lead Deleted Successfully", true);
            this.getCounts();  
            this.showLeads();                         
        } else if (response.statusCode==500) {
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
 
}
