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
declare var swal, $, videojs: any;

@Component({
  selector: 'app-manage-campaign-leads',
  templateUrl: './manage-campaign-leads.component.html',
  styleUrls: ['./manage-campaign-leads.component.css']
})
export class ManageCampaignLeadsComponent implements OnInit {
  @Input() public campaignId : any;
  @Input() public partnerCompanyId : any;
  @Input() public isVendorVersion : any;
  @Input() public isPartnerVersion : any;
  @Input() public filterKey : any;
  
  @Output() viewCampaignLeadForm = new EventEmitter<any>();
  @Output() editCampaignLeadForm = new EventEmitter<any>();
  @Output() registerDealForm = new EventEmitter<any>();  
  @Output() refreshCounts = new EventEmitter<any>();

  loggedInUserId : number;
  vanityLoginDto : VanityLoginDto = new VanityLoginDto();
  leadsPagination: Pagination;
  leadsSortOption: SortOption = new SortOption();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  leadsResponse: CustomResponse = new CustomResponse();


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
  }

  listCampaignLeads(pagination: Pagination) { 
    pagination.userId = this.loggedInUserId;   
    pagination.campaignId = this.campaignId;
    pagination.partnerCompanyId = this.partnerCompanyId;
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
    this.editCampaignLeadForm.emit(lead.id);    console.log("hello");
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

}
