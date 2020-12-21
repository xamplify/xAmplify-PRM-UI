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
import { Deal } from '../models/deal';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
declare var swal, $, videojs: any;

@Component({
  selector: 'app-manage-deals',
  templateUrl: './manage-deals.component.html',
  styleUrls: ['./manage-deals.component.css'],
  providers: [Pagination, HomeComponent, HttpRequestLoader, SortOption, ListLoaderValue],
})
export class ManageDealsComponent implements OnInit {
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
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  dealsPagination: Pagination;
  dealsSortOption: SortOption = new SortOption();
  showDealForm = false;
  dealsResponse: CustomResponse = new CustomResponse();
  actionType = "add";
  dealId= 0;
  companyId = 0;
  counts : any;
  countsLoader = false;
  vanityLoginDto : VanityLoginDto = new VanityLoginDto();

  constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService,
    public utilService: UtilService, public referenceService: ReferenceService,
    public homeComponent: HomeComponent, public xtremandLogger: XtremandLogger,
    public sortOption: SortOption, public pagerService: PagerService, private userService: UserService,
    private dealRegistrationService: DealRegistrationService, private dealsService: DealsService) {
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
  	// this.loggedInUserId = this.authenticationService.getUserId();
    // const url = "admin/getRolesByUserId/" + this.loggedInUserId + "?access_token=" + this.authenticationService.access_token;
    // this.getUserRoles(url);
    // if (this.authenticationService.loggedInUserRole == "Team Member") {
    //   this.dealRegistrationService.getSuperorId(this.loggedInUserId).subscribe(response => {
    //     this.superiorId = response;        
    //   });
    // } else {
    //   this.superiorId = this.authenticationService.getUserId();
    // }
    // this.init();
    // this.initVendorOrPartner();
    // this.showDeals();
    // this.referenceService.loading(this.httpRequestLoader, false); 
    // this.httpRequestLoader.isServerError = false;

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
      this.companyId = response;
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
  }

    setEnableLeads() {
      this.referenceService.getOrgCampaignTypes(this.companyId).subscribe(data => {
        this.enableLeads = data.enableLeads;              
      });
      
      console.log(this.authenticationService.getRoles());
    }

  showVendor() {
    if (this.enableLeads) {
      this.isVendorVersion = true;
      this.isPartnerVersion = false;
      this.getVendorCounts();
      this.showDeals();
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
      this.showDeals();
      //this.switchVersions();
    }
  }

  getVendorCounts() {
    this.countsLoader = true;
    this.dealsService.getCounts(this.vanityLoginDto)
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
    this.dealsService.getCounts(this.vanityLoginDto)
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

  showDeals() {
    this.selectedTabIndex = 1;
    this.dealsPagination = new Pagination;
    if(this.vanityLoginDto.vanityUrlFilter){
      this.dealsPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
      this.dealsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
    }
    this.listDeals(this.dealsPagination);
  }

  showWonDeals() {
    this.selectedTabIndex = 2;
    this.dealsPagination = new Pagination;
    this.dealsPagination.filterKey = "won";
    this.listDeals(this.dealsPagination);
  }

  showLostDeals() {
    this.selectedTabIndex = 3;
    this.dealsPagination = new Pagination;
    this.dealsPagination.filterKey = "lost";
    this.listDeals(this.dealsPagination);
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
        },
        error => {
            this.httpRequestLoader.isServerError = true;
            },
        () => { }
    );
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
        },
        error => {
            this.httpRequestLoader.isServerError = true;
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
    //this.pipelineResponse = new CustomResponse();
    //this.customResponse = new CustomResponse();
    this.dealsPagination.pageIndex = 1;
    this.dealsPagination.searchKey = this.dealsSortOption.searchKey;
    this.listDeals(this.dealsPagination);
  }
  dealEventHandler(keyCode: any) { if (keyCode === 13) { this.searchDeals(); } }

  closeDealForm() {
    this.showDealForm = false;
    this.resetCounts();    
    this.showDeals();
  }

  showSubmitDealSuccess() {
    this.dealsResponse = new CustomResponse('SUCCESS', "Deal Submitted Successfully", true);
    this.showDealForm = false;
    this.resetCounts();    
    this.showDeals();
  }

  resetCounts() {
    if (this.isVendorVersion) {
      this.getVendorCounts();
    } else if (this.isPartnerVersion) {
      this.getPartnerCounts();
    }
  }

  addDeal() {   
    this.showDealForm = true;
    this.actionType = "add";
    this.dealId = 0;    
  }

  viewDeal(deal: Deal) {
    this.showDealForm = true;   
    this.actionType = "view";
    this.dealId = deal.id;
    
  }

  editDeal(deal: Deal) {
    this.showDealForm = true;  
    this.actionType = "edit";
    this.dealId = deal.id;
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
            this.getCounts();  
            this.showDeals();                         
        } else if (response.statusCode==500) {
            this.dealsResponse = new CustomResponse('ERROR', response.message, true);
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

  setDealStatus(deal: Deal) {
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
            this.resetCounts();
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
  }

}
