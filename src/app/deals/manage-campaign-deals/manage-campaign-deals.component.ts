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
import { LEAD_CONSTANTS } from './../../constants/lead.constants';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';

declare var swal, $, videojs: any;

@Component({
  selector: 'app-manage-campaign-deals',
  templateUrl: './manage-campaign-deals.component.html',
  styleUrls: ['./manage-campaign-deals.component.css']
})
export class ManageCampaignDealsComponent implements OnInit {
  @Input() public campaignId : any;
  @Input() public partnerCompanyId : any = 0;
  @Input() public isVendorVersion : any;
  @Input() public isPartnerVersion : any;
  @Input() public filterKey : any;
  @Input() public fromAnalytics : boolean = false;
  @Input() public showTeamMemberFilter : boolean = false;
  @Input() public isDataShare : boolean = false;

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
  showFilterOption: boolean = false;
  fromDateFilter: any = "";
  toDateFilter: any = "";
  filterResponse: CustomResponse = new CustomResponse(); 
  filterMode: boolean = false;
  selectedFilterIndex: number = 1;
  stageNamesForFilterDropDown :any;

  /** XNFR-426 **/
  //deal = new Deal();
  updateCurrentStage:boolean = false;
  currentDealToUpdateStage:Deal;
  textAreaDisable:boolean = false;
  readonly LEAD_CONSTANTS = LEAD_CONSTANTS;

  /***09/06/2024****/
  registeredByUsersLoader = true;;
  registeredByUsersSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  isRegisteredByUsersLoadedSuccessfully = true;
  selectedRegisteredByUserId = 0;

  statusFilter: any;
  statusSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  statusLoader = true;
  isStatusLoadedSuccessfully = true;

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
      if (this.fromAnalytics && !this.showTeamMemberFilter) {
        this.dealsPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==0;
      } else {
        this.dealsPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
      }      
      this.listCampaignDeals(this.dealsPagination);
      /*****Registered By Users*****/   
      this.findAllRegisteredByUsers();
    }
  }

  listCampaignDeals(pagination: Pagination) { 
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.userId = this.loggedInUserId;   
    pagination.campaignId = this.campaignId;
    pagination.partnerCompanyId = this.partnerCompanyId;
    pagination.forCampaignAnalytics = this.fromAnalytics;
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
            this.getStageNamesForCampaign();
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
    this.editCampaignDealForm.emit(deal);
    this.textAreaDisable = true;
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


 downloadDeals1() {
  let type = this.dealsPagination.filterKey;
  let fileName = "";
  if (type == null || type == undefined || type == "") {
    type = "all";
    fileName = "deals"
  } else {
    fileName = type + "-deals"
  }

  let partnerTeamMemberGroupFilter = false;
  let userType = "v";
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
  const url = this.authenticationService.REST_URL + "deal/campaign/download/"
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

  //stageFilter 
  var mapInput = document.createElement("input");
  mapInput.type = "hidden";
  mapInput.name = "stageName";
  mapInput.setAttribute("value", this.dealsPagination.stageFilter);
  mapForm.appendChild(mapInput);

  // campaignId
  var mapInput = document.createElement("input");
  mapInput.type = "hidden";
  mapInput.name = "campaignId";
  mapInput.setAttribute("value", this.dealsPagination.campaignId + "");
  mapForm.appendChild(mapInput);

  // partnerCompanyId
  var mapInput = document.createElement("input");
  mapInput.type = "hidden";
  mapInput.name = "partnerCompanyId";
  mapInput.setAttribute("value", this.dealsPagination.partnerCompanyId + "");
  mapForm.appendChild(mapInput);

  //fromAnalytics
  var mapInput = document.createElement("input");
  mapInput.type = "hidden";
  mapInput.name = "forAnalytics";
  mapInput.setAttribute("value", this.fromAnalytics+"");
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
  // this.dealsPagination.fromDateFilterString = "";
  // this.dealsPagination.toDateFilterString = "";
  // this.dealsPagination.stageFilter = "";
  if (!this.showFilterOption) {
    this.dealsPagination.fromDateFilterString = "";
    this.dealsPagination.toDateFilterString = "";
    this.dealsPagination.stageFilter = "";
    this.filterResponse.isVisible = false;
    if (this.filterMode) {
      this.dealsPagination.pageIndex = 1;
      this.listCampaignDeals(this.dealsPagination);
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
  this.dealsPagination.fromDateFilterString = "";
  this.dealsPagination.toDateFilterString = "";
  this.dealsPagination.stageFilter = "";
  this.dealsPagination.registeredByUserId = 0;
  this.filterResponse.isVisible = false;
  if (this.filterMode) {
    this.dealsPagination.pageIndex = 1;
    this.listCampaignDeals(this.dealsPagination);
    this.filterMode = false;
  } 
}

validateDateFiltersOld() {
  if ((this.statusFilter == undefined || this.statusFilter == "") && 
    (this.fromDateFilter == undefined || this.fromDateFilter == "") &&
      (this.toDateFilter == undefined || this.toDateFilter == "")) {
        this.filterResponse = new CustomResponse('ERROR', "Please provide valid input to filter", true);
  } else { 
    let validDates = false;   
    if ((this.fromDateFilter == undefined || this.fromDateFilter == "") 
      && (this.toDateFilter == undefined || this.toDateFilter == "")) {
        validDates = true;
    } else if (this.fromDateFilter != undefined && this.fromDateFilter != "" && 
      (this.toDateFilter == undefined || this.toDateFilter == "")) {
        this.filterResponse = new CustomResponse('ERROR', "Please pick To Date", true);
    } else if (this.toDateFilter != undefined && this.toDateFilter != "" && 
      (this.fromDateFilter == undefined || this.fromDateFilter == "")) {
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
      if (this.statusFilter != undefined && this.statusFilter != "") {
        this.dealsPagination.stageFilter = this.statusFilter;
      }
      else {
        this.dealsPagination.stageFilter = "";
      }
      this.dealsPagination.pageIndex = 1;
      this.dealsPagination.maxResults = 12;
      this.filterMode = true;
        this.filterResponse.isVisible = false;
        this.listCampaignDeals(this.dealsPagination);
    }
    
  }
}


validateDateFilters() {
  let isInvalidStatusFilter = this.statusFilter == undefined || this.statusFilter == "";
  let isValidStatusFilter = this.statusFilter != undefined && this.statusFilter != "";
  let isEmptyFromDateFilter = this.fromDateFilter == undefined || this.fromDateFilter == "";
  let isValidFromDateFilter = this.fromDateFilter != undefined && this.fromDateFilter != "";
  let isEmptyToDateFilter = this.toDateFilter == undefined || this.toDateFilter == "";
  let isValidToDateFilter = this.toDateFilter != undefined && this.toDateFilter != "";
  let isInValidRegisteredByUserFilter = this.selectedRegisteredByUserId==undefined || this.selectedRegisteredByUserId==0;
  let isValidRegisteredByUserFilter = this.selectedRegisteredByUserId!=undefined && this.selectedRegisteredByUserId>0;
  if (isInvalidStatusFilter && isEmptyFromDateFilter && isEmptyToDateFilter  && isInValidRegisteredByUserFilter) {
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
      this.filterRegisteredByUserId(isValidRegisteredByUserFilter);
      this.dealsPagination.pageIndex = 1;
      this.dealsPagination.maxResults = 12;
      this.filterMode = true;
      this.filterResponse.isVisible = false;
      this.listCampaignDeals(this.dealsPagination);
    }
  }
}
  
private filterRegisteredByUserId(isValidRegisteredByUserFilter: boolean) {
this.dealsPagination.registeredByUserId = 0;
if (isValidRegisteredByUserFilter) {
  this.dealsPagination.registeredByUserId = this.selectedRegisteredByUserId;
}
}

private filterStatus(isValidStatusFilter) {
  if (isValidStatusFilter) {
    this.dealsPagination.stageFilter = this.statusFilter;
  } else {
    this.dealsPagination.stageFilter = "";
  }
}


clearSearch() {
  this.dealsSortOption.searchKey='';
  this.getAllFilteredResultsDeals(this.dealsPagination);
}

getSelectedIndex(index:number){
  this.selectedFilterIndex = index;
  this.referenceService.setTeamMemberFilterForPagination(this.dealsPagination,index);
  this.listCampaignDeals(this.dealsPagination);
  
}

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
            this.listCampaignDeals(this.dealsPagination);
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
    this.statusSearchableDropDownDto.placeHolder = "Select Status";
    this.statusLoader = false;
    this.referenceService.loading(this.httpRequestLoader, false);
  }



getStageNamesForCampaign(){
  this.dealsService.getStageNamesForCampaign(this.campaignId, this.loggedInUserId)
  .subscribe(
    response =>{
      this.addSearchableStatus(response);
    },
    error=>{
      this.httpRequestLoader.isServerError = true;
    },
    ()=> { }
  );  
}

/****xnfr-426******/
updatePipelineStage(deal:Deal,deletedPartner:boolean){
  if(!deletedPartner){
    this.currentDealToUpdateStage = deal;
    this.updateCurrentStage = true;
    this.textAreaDisable = true;
  }else{
    this.referenceService.showSweetAlert("This Option Is Not Available","","info");
  }
}

resetModalPopup(){
  this.updateCurrentStage = false;
  this.textAreaDisable = false;
  this.listCampaignDeals(this.dealsPagination);

}

stageUpdateResponse(event:any){
  this.dealsResponse = (event === 200) ? new CustomResponse('SUCCESS', "Status Updated Successfully", true) : new CustomResponse('ERROR', "Invalid Input", true);
}

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
  pagination.forCampaignAnalytics = this.fromAnalytics
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

 /*****Registered By Users*****/     
 findAllRegisteredByUsers(){
  this.registeredByUsersLoader = true;
  this.dealsService.findAllRegisteredByUsersByCampaignIdAndPartnerCompanyId(this.campaignId,this.partnerCompanyId)
  .subscribe(
    response=>{
      this.registeredByUsersSearchableDropDownDto.data = response.data;
      this.registeredByUsersSearchableDropDownDto.placeHolder = "Select "+LEAD_CONSTANTS.addedBy;
      this.isRegisteredByUsersLoadedSuccessfully = true;
      this.registeredByUsersLoader = false;
    },error=>{
      this.registeredByUsersLoader = false;
      this.isRegisteredByUsersLoadedSuccessfully = false;
    });
}

getSelectedStatus(event:any){
  if(event!=null){
    this.statusFilter = event['id'];
  }else{
    this.statusFilter = "";
  }
}

}
