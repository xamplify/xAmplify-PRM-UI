import { Component, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { DealsService } from '../services/deals.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { PagerService } from 'app/core/services/pager.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Deal } from '../models/deal';
import { EventEmitter } from '@angular/core';
declare var swal, $, videojs: any;

@Component({
  selector: 'app-manage-campaign-deals',
  templateUrl: './manage-campaign-deals.component.html',
  styleUrls: ['./manage-campaign-deals.component.css']
})
export class ManageCampaignDealsComponent implements OnInit {
  @Input() public campaignId : any;
  @Input() public partnerCompanyId : any;
  @Input() public isVendorVersion : any;
  @Input() public isPartnerVersion : any;
  @Input() public filterKey : any;

  @Output() viewCampaignDealForm = new EventEmitter<any>();
  @Output() editCampaignDealForm = new EventEmitter<any>();
  @Output() refreshCounts = new EventEmitter<any>();
  @Output() showCommentsPopUp = new EventEmitter<any>();

  loggedInUserId : number;
  vanityLoginDto : VanityLoginDto = new VanityLoginDto();
  dealsPagination: Pagination;
  dealsSortOption: SortOption = new SortOption();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  dealsResponse: CustomResponse = new CustomResponse();
  dealId= 0;

  constructor(public authenticationService: AuthenticationService,
    private dealsService: DealsService, public referenceService: ReferenceService, public pagerService: PagerService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;
    }
  }

  ngOnInit() {
    if (this.campaignId != undefined && this.campaignId > 0) {
      this.dealsPagination = new Pagination();
      this.listCampaignDeals(this.dealsPagination);
    }
  }

  listCampaignDeals(pagination: Pagination) { 
    pagination.userId = this.loggedInUserId;   
    pagination.campaignId = this.campaignId;
    pagination.partnerCompanyId = this.partnerCompanyId;
    if (this.filterKey != undefined && this.filterKey !== "") {
      pagination.filterKey = this.filterKey;
    }
    this.dealsService.listCampaignLeads(pagination)
    .subscribe(
        response => {            
            this.referenceService.loading(this.httpRequestLoader, false);
            pagination.totalRecords = response.data.totalRecords;
            this.dealsSortOption.totalRecords = response.data.totalRecords;
            pagination = this.pagerService.getPagedItems(pagination, response.data.data);
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
    this.listCampaignDeals(this.dealsPagination);
  }

  getAllFilteredResultsDeals(pagination: Pagination) {
    this.dealsPagination.pageIndex = 1;
    this.dealsPagination.searchKey = this.dealsSortOption.searchKey;
    this.listCampaignDeals(this.dealsPagination);
  }
  dealEventHandler(keyCode: any) { if (keyCode === 13) { this.searchDeals(); } }

  viewDeal(deal: Deal) {
    this.viewCampaignDealForm.emit(deal.id);
  }

  editDeal(deal: Deal) { 
    this.editCampaignDealForm.emit(deal.id);
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
            this.listCampaignDeals(this.dealsPagination);  
            this.refreshCounts.emit();                       
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

 showComments(deal: any) {
  this.showCommentsPopUp.emit(deal);
 }


}
