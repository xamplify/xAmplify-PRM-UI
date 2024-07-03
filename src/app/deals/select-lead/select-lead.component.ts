import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { LeadsService } from 'app/leads/services/leads.service';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { PagerService } from 'app/core/services/pager.service';
import { UtilService } from 'app/core/services/util.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { LEAD_CONSTANTS } from 'app/constants/lead.constants';

declare var swal, $, videojs: any;

@Component({
  selector: 'app-select-lead',
  templateUrl: './select-lead.component.html',
  styleUrls: ['./select-lead.component.css'],
  providers:[SortOption]
})
export class SelectLeadComponent implements OnInit {  
  @Input() public dealToLead: any;
  @Output() notifyClose = new EventEmitter();
  @Output() notifyLeadSelected = new EventEmitter();

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  selectLeadModalResponse: CustomResponse = new CustomResponse();
  pagination: Pagination = new Pagination();
  loggedInUserId: number;
  showLeadForm: boolean = false;  
  leadId = 0;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  /*** XNFR-476 ***/
  disableCreatedForVendor: boolean = false;
  enableAddLeadButton: boolean = false;
  showSelectedLead: number = 0;
  isLeadSelected = false;
  readonly LEAD_CONSTANTS = LEAD_CONSTANTS;
  constructor(public properties: Properties, public authenticationService: AuthenticationService, public referenceService: ReferenceService,
    private leadsService: LeadsService, public sortOption: SortOption, public pagerService: PagerService, public utilService: UtilService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;

    }
  }
  ngOnInit() {
    $('#selectLeadModel').modal('show');    
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = "";
    this.sortOption.searchKey = "";
    this.leadId = this.dealToLead.leadId;
    this.showSelectedLead = this.dealToLead.leadId;
    this.isLeadSelected = this.showSelectedLead!=undefined && this.showSelectedLead>0;
    this.getLeads(this.pagination);
  }

  closeModal() {    
    this.notifyClose.emit();
    $('#selectLeadModel').modal('hide');
  }

  addLead() {
    if(this.dealToLead.createdForCompanyId > 0){
      this.disableCreatedForVendor = true;
    }
    this.showLeadForm = true;
    this.dealToLead.leadActionType = "add";    
  }
  
  closeLeadForm() {
    this.showLeadForm = false;
  }
  
  leadCreated(leadId : any) {
    this.showLeadForm = false;
    this.leadId = leadId;
    this.showSelectedLead = leadId;
    this.leadSelected();   
  }

 
  selectLeadOnCheckBoxClick(leadId : any,index:number) {
    let isChecked = $('#leadCheckBox-' + index).is(':checked');
    if(isChecked){
      this.leadId = leadId;
      this.showSelectedLead = leadId; 
      this.isLeadSelected = true; 
    }else{
      this.leadId = 0;
      this.showSelectedLead = 0;
      this.isLeadSelected = false; 
    }
  }

  leadSelected() {
    $('#selectLeadModel').modal('hide');
    this.notifyLeadSelected.emit(this.showSelectedLead);
  }

  getLeads(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.maxResults = 12;
    pagination.userId = this.loggedInUserId;    
    pagination.ignoreSelfLeadsOrDeals = false;
    pagination.filterKey = "not-converted";
    pagination.showLeadsForAttachingLead = true;
    pagination.vendorCompanyId = this.dealToLead.createdForCompanyId;
    if (this.vanityLoginDto.vanityUrlFilter) {
      pagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
      pagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName      
    }
    this.leadsService.getLeadsForLeadAttachment(pagination)
      .subscribe(
        response => {
          this.referenceService.loading(this.httpRequestLoader, false);          
          this.sortOption.totalRecords = response.totalRecords;
          this.pagination.totalRecords = response.totalRecords;
          this.enableAddLeadButton = response.isVendorEnabledLeadApprovalRejectionFeature;
          this.pagination = this.pagerService.getPagedItems(this.pagination, response.data);
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
      
  }

  search() {
    this.getAllFilteredResults(this.pagination);
  }

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.leadId = 0;
      this.search();
    }
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedSortedOption, pagination);
    this.getLeads(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getLeads(this.pagination);
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getLeads(this.pagination);
  }

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  viewLead(lead: any) {       
    this.showLeadForm = true;
    this.dealToLead.leadActionType = "view";
    this.leadId = lead.id;
  }



}
