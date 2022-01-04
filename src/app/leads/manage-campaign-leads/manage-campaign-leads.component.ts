import { Component, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { LeadsService } from '../services/leads.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { PagerService } from 'app/core/services/pager.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Lead } from '../models/lead';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
declare var swal, $, videojs: any;

@Component({
  selector: 'app-manage-campaign-leads',
  templateUrl: './manage-campaign-leads.component.html',
  styleUrls: ['./manage-campaign-leads.component.css']
})
export class ManageCampaignLeadsComponent implements OnInit {
  @Input() public campaignId : any;
  @Input() public partnerCompanyId : any = 0;
  @Input() public isVendorVersion : any;
  @Input() public isPartnerVersion : any;
  @Input() public filterKey : any;
  @Input() public fromAnalytics : boolean = false;
  @Input() refreshCampaignLeadsSubject: Subject<boolean> = new Subject<boolean>();
  
  @Output() viewCampaignLeadForm = new EventEmitter<any>();
  @Output() editCampaignLeadForm = new EventEmitter<any>();
  @Output() registerDealForm = new EventEmitter<any>();  
  @Output() refreshCounts = new EventEmitter<any>();
  @Output() showCommentsPopUp = new EventEmitter<any>();

  loggedInUserId : number;
  vanityLoginDto : VanityLoginDto = new VanityLoginDto();
  leadsPagination: Pagination = new Pagination();
  leadsSortOption: SortOption = new SortOption();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  leadsResponse: CustomResponse = new CustomResponse();
  showFilterOption: boolean = false;
  fromDateFilter: any = "";
  toDateFilter: any = "";
  filterResponse: CustomResponse = new CustomResponse(); 
  filterMode: boolean = false;
  selectedFilterIndex: number = 1;

  constructor(public authenticationService: AuthenticationService,
    private leadsService: LeadsService, public referenceService: ReferenceService, public pagerService: PagerService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;
    }
  }

  ngOnInit() {
    if (this.campaignId != undefined && this.campaignId > 0) {
        this.leadsPagination = new Pagination();
        this.listCampaignLeads(this.leadsPagination);        
    }

    this.refreshCampaignLeadsSubject.subscribe(response => {
      if (response) {
        this.listCampaignLeads(this.leadsPagination);
      }
    });
    
  }

  listCampaignLeads(pagination: Pagination) { 
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.userId = this.loggedInUserId;   
    pagination.campaignId = this.campaignId;
    pagination.partnerCompanyId = this.partnerCompanyId;
    pagination.forCampaignAnalytics = this.fromAnalytics;
    if (this.filterKey != undefined && this.filterKey !== "") {
      pagination.filterKey = this.filterKey;
    }
    this.leadsService.listCampaignLeads(pagination)
    .subscribe(
        response => {            
            this.referenceService.loading(this.httpRequestLoader, false);
            pagination.totalRecords = response.data.totalRecords;
            this.leadsSortOption.totalRecords = response.data.totalRecords;
            pagination = this.pagerService.getPagedItems(pagination, response.data.data);
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
    this.listCampaignLeads(this.leadsPagination);
  }

  getAllFilteredResultsLeads(pagination: Pagination) {
    this.leadsPagination.pageIndex = 1;
    this.leadsPagination.searchKey = this.leadsSortOption.searchKey;
    this.listCampaignLeads(this.leadsPagination);
  }
  leadEventHandler(keyCode: any) { if (keyCode === 13) { this.searchLeads(); } }
  
  viewLead(lead: Lead) { 
    this.viewCampaignLeadForm.emit(lead.id);
  }  

  editLead(lead: Lead) {
    this.editCampaignLeadForm.emit(lead.id);
  }

  registerDeal (lead: Lead) {
    this.registerDealForm.emit(lead.id);
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
            //this.getCounts();  
            this.listCampaignLeads(this.leadsPagination);  
            this.refreshCounts.emit();                       
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

 showComments(deal: any) {
  this.showCommentsPopUp.emit(deal);
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

  let userType = "v";
  if (this.isVendorVersion) {
    userType = "v";
  } else if (this.isPartnerVersion) {
    userType = "p";
  }
  
  const url = this.authenticationService.REST_URL + "lead/campaign/download/"
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
  mapInput.setAttribute("value", this.leadsPagination.fromDateFilterString);
  mapForm.appendChild(mapInput);

  // toDate
  var mapInput = document.createElement("input");
  mapInput.type = "hidden";
  mapInput.name = "toDate";
  mapInput.setAttribute("value", this.leadsPagination.toDateFilterString);
  mapForm.appendChild(mapInput);

  // campaignId
  var mapInput = document.createElement("input");
  mapInput.type = "hidden";
  mapInput.name = "campaignId";
  mapInput.setAttribute("value", this.leadsPagination.campaignId + "");
  mapForm.appendChild(mapInput);

  // partnerCompanyId
  var mapInput = document.createElement("input");
  mapInput.type = "hidden";
  mapInput.name = "partnerCompanyId";
  mapInput.setAttribute("value", this.leadsPagination.partnerCompanyId + "");
  mapForm.appendChild(mapInput);

  //fromAnalytics
  var mapInput = document.createElement("input");
  mapInput.type = "hidden";
  mapInput.name = "forAnalytics";
  mapInput.setAttribute("value", this.fromAnalytics+"");
  mapForm.appendChild(mapInput);

  document.body.appendChild(mapForm);
  mapForm.submit();
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
      this.listCampaignLeads(this.leadsPagination);
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
    this.listCampaignLeads(this.leadsPagination);
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
        this.listCampaignLeads(this.leadsPagination);
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

clearSearch() {
  this.leadsSortOption.searchKey='';
  this.getAllFilteredResultsLeads(this.leadsPagination);
}

getSelectedIndex(index:number){
  this.selectedFilterIndex = index;
  this.referenceService.setTeamMemberFilterForPagination(this.leadsPagination,index);
  this.listCampaignLeads(this.leadsPagination);
  
}

}
