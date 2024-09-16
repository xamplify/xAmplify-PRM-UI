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

declare var swal:any;

@Component({
  selector: 'app-custom-manage-deals',
  templateUrl: './custom-manage-deals.component.html',
  styleUrls: ['./custom-manage-deals.component.css'],
  providers: [Pagination, DealsService],
})
export class CustomManageDealsComponent implements OnInit {
  readonly DEAL_CONSTANTS = DEAL_CONSTANTS;

  @Input() selectedContactId: number = 0;

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  currentDealToUpdateStage: Deal;
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

  showFilterOption: boolean;
  textAreaDisable: boolean;
  isOrgAdmin = false;
  showContactDeals: boolean = false;

  listView = true;
  selectedTabIndex = 1;  
  titleHeading:string = "";
  vanityLoginDto : VanityLoginDto = new VanityLoginDto();
  selectedPartnerCompanyId = 0;
  selectedFilterIndex: number = 1;

  //handle this
  isRegisterDealEnabled = true;
  isDealFromContact: boolean = false;

  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService,
    public pagerService: PagerService, public dealsService: DealsService) {
   
  }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.showDeals();
  }

  showDeals() {
    this.showContactDeals = true;
    this.selectedTabIndex = 1;
    this.titleHeading = "Total ";
    this.resetDealsPagination();
    if(this.vanityLoginDto.vanityUrlFilter){
      this.dealsPagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
      this.dealsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
    }
    this.selectedPartnerCompanyId = 0;
    this.listDealsForPartner(this.dealsPagination);
  }

  resetDealsPagination() {
    this.dealsPagination.maxResults = 12;
    this.dealsPagination = new Pagination;
    this.dealsPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
    this.showFilterOption = false;
  }

  listDealsForPartner(pagination: Pagination) {
    pagination.userId = this.loggedInUserId;
    pagination.contactId = this.selectedContactId;
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
    this.selectedDeal=deal;
    this.textAreaDisable=true;
    this.dealsResponse.isVisible = false;
  }

  closeDealForm() {
    this.showContactDeals = true;
    this.showDealForm = false;
    this.showDeals();
    this.textAreaDisable=false;
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
    this.dealsSortOption.searchKey='';
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

  listDeals(){
    this.showDeals();
  }

  setDealsPage(event: any) {
     this.dealsPagination.pageIndex = event.page;
     this.listDealsForPartner(this.dealsPagination);
   }

}