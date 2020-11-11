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
  dealsCount = 0;
  showDealForm = false;
  dealsResponse: CustomResponse = new CustomResponse();
  actionType = "add";
  dealId= 0;

  constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService,
    public utilService: UtilService, public referenceService: ReferenceService,
    public homeComponent: HomeComponent, public xtremandLogger: XtremandLogger,
    public sortOption: SortOption, public pagerService: PagerService, private userService: UserService,
    private dealRegistrationService: DealRegistrationService, private dealsService: DealsService) {
        
  }

  ngOnInit() {
  	this.loggedInUserId = this.authenticationService.getUserId();
    const url = "admin/getRolesByUserId/" + this.loggedInUserId + "?access_token=" + this.authenticationService.access_token;
    this.getUserRoles(url);
    if (this.authenticationService.loggedInUserRole == "Team Member") {
      this.dealRegistrationService.getSuperorId(this.loggedInUserId).subscribe(response => {
        this.superiorId = response;        
      });
    } else {
      this.superiorId = this.authenticationService.getUserId();
    }
    this.init();
    this.initVendorOrPartner();
    this.showDeals();
    this.referenceService.loading(this.httpRequestLoader, false); 
    this.httpRequestLoader.isServerError = false;
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
      console.log(this.superiorId)
      this.referenceService.getOrgCampaignTypes(response).subscribe(data => {
        this.enableLeads = data.enableLeads;        
      });
    });
    
    console.log(this.authenticationService.getRoles());
  }

  showVendor() {
    if (this.enableLeads) {
      this.isVendorVersion = true;
      this.isPartnerVersion = false;
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
      this.showDeals();
      //this.switchVersions();
    }
  }

  showDeals() {
    this.selectedTabIndex = 1;
    this.dealsPagination = new Pagination;
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
            this.dealsCount = response.totalRecords;
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
            this.dealsCount = response.totalRecords;
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
    this.showDeals();
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

}
