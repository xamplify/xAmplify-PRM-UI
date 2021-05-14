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
declare var swal, $, videojs: any;

@Component({
  selector: 'app-manage-deals',
  templateUrl: './manage-deals.component.html',
  styleUrls: ['./manage-deals.component.css'],
  providers: [Pagination, HomeComponent, HttpRequestLoader, SortOption, ListLoaderValue, LeadsService],
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
  dealsPagination: Pagination;
  dealsSortOption: SortOption = new SortOption();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  showDealForm = false;
  dealsResponse: CustomResponse = new CustomResponse();
  actionType = "add";
  dealId= 0;
  companyId = 0;
  counts : any;
  countsLoader = false;
  vanityLoginDto : VanityLoginDto = new VanityLoginDto();
  listView = true;
  campaignPagination: Pagination;
  campaignSortOption: SortOption = new SortOption();
  partnerPagination: Pagination;
  partnerSortOption: SortOption = new SortOption();
  selectedCampaignId = 0;
  selectedCampaignName = "";
  selectedPartnerCompanyId = 0;
  selectedPartnerCompanyName = "";
  showPartnerList = false;
  showCampaignDeals = false;
  selectedDeal: Deal;
  isCommentSection = false;

  constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService,
    public utilService: UtilService, public referenceService: ReferenceService,
    public homeComponent: HomeComponent, public xtremandLogger: XtremandLogger,
    public sortOption: SortOption, public pagerService: PagerService, private userService: UserService,
    private dealRegistrationService: DealRegistrationService, private dealsService: DealsService, ) {
      this.loggedInUserId = this.authenticationService.getUserId();
      if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
        this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        this.vanityLoginDto.userId = this.loggedInUserId;
        this.vanityLoginDto.vanityUrlFilter = true;
      } else {
        this.vanityLoginDto.userId = this.loggedInUserId;
        this.vanityLoginDto.vanityUrlFilter = false;
      }

      // const url = "admin/getRolesByUserId/" + this.loggedInUserId + "?access_token=" + this.authenticationService.access_token;
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

      this.init();
  }

  ngOnInit() {
    this.countsLoader = true;
    this.referenceService.loading(this.httpRequestLoader, true);
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
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(response => {
      this.companyId = response;
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
      //this.getVendorCounts();
      this.showDeals();
    } else {
      this.showPartner();
    }
  }
  showPartner() {
    this.isVendorVersion = false;
    this.isPartnerVersion = true;
    //this.getPartnerCounts();
    this.showDeals();
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
    this.getCounts();
    this.selectedTabIndex = 1;
    this.dealsPagination = new Pagination;
    this.campaignPagination = new Pagination;
    if(this.vanityLoginDto.vanityUrlFilter){
      this.dealsPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
      this.dealsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
      this.campaignPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
      this.campaignPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
    }
    this.listDeals(this.dealsPagination);
    this.listCampaigns(this.campaignPagination);
  }

  showWonDeals() {
    this.selectedTabIndex = 2;
    this.dealsPagination = new Pagination;
    this.dealsPagination.filterKey = "won";
    this.listDeals(this.dealsPagination);
    this.campaignPagination = new Pagination;
    this.campaignPagination.filterKey = "won";
    this.listCampaigns(this.campaignPagination);
  }

  showLostDeals() {
    this.selectedTabIndex = 3;
    this.dealsPagination = new Pagination;
    this.dealsPagination.filterKey = "lost";
    this.listDeals(this.dealsPagination);
    this.campaignPagination = new Pagination;
    this.campaignPagination.filterKey = "lost";
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

  listCampaigns(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    if (this.isVendorVersion) {
      this.listCampaignsForVendor(pagination);
    } else if (this.isPartnerVersion) {
      this.listCampaignsForPartner(pagination);
    }
  }

  listCampaignsForVendor(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dealsService.listCampaignsForVendor(pagination)
    .subscribe(
        response => {            
            this.referenceService.loading(this.httpRequestLoader, false);
            pagination.totalRecords = response.data.totalRecords;
            this.campaignSortOption.totalRecords = response.data.totalRecords;
            pagination = this.pagerService.getPagedItems(pagination, response.data.campaigns);
        },
        error => {
            this.httpRequestLoader.isServerError = true;
            },
        () => { }
    );
  }

  listCampaignsForPartner(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dealsService.listCampaignsForPartner(pagination)
    .subscribe(
        response => {            
            this.referenceService.loading(this.httpRequestLoader, false);
            pagination.totalRecords = response.data.totalRecords;
            this.campaignSortOption.totalRecords = response.data.totalRecords;
            pagination = this.pagerService.getPagedItems(pagination, response.data.campaigns);
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
  }

  showSubmitDealSuccess() {
    this.dealsResponse = new CustomResponse('SUCCESS', "Deal Submitted Successfully", true);
    this.showDealForm = false;
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
            //this.getCounts();  
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

//  resetCounts() {
//   if (this.isVendorVersion) {
//     this.getVendorCounts();
//   } else if (this.isPartnerVersion) {
//     this.getPartnerCounts();
//   }
// }

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
  }

  showPartners(campaign: any) {
    if (campaign.id > 0) {
      this.selectedCampaignId = campaign.id ;
      this.selectedCampaignName = campaign.campaign;
      if (campaign.channelCampaign) {
        this.showPartnerList = true;
        campaign.expand = !campaign.expand;
        if (campaign.expand) {
          this.partnerPagination = new Pagination;
          this.partnerPagination.filterKey = this.campaignPagination.filterKey;
          this.listPartnersForCampaign(this.partnerPagination);
        }
      } else {
        this.showOwnCampaignDeals();
      }            
    }
  }
  
  listPartnersForCampaign (pagination: Pagination) {
      pagination.userId = this.loggedInUserId;
      pagination.campaignId = this.selectedCampaignId;
      this.dealsService.listPartnersForCampaign(pagination)
      .subscribe(
          response => {            
              this.referenceService.loading(this.httpRequestLoader, false);
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

  editCampaignDealForm(dealId: any) {
    this.showDealForm = true;   
    this.actionType = "edit";
    this.dealId = dealId;
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

  downloadDeals() {
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

    let userType = "";
    if (this.isVendorVersion) {
      userType = "v";
    } else if (this.isPartnerVersion) {
      userType = "p";
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

    document.body.appendChild(mapForm);
    mapForm.submit();
  
  }

}
