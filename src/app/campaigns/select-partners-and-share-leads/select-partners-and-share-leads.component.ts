import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Properties } from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ParterService } from 'app/partners/services/parter.service';
import { SortOption } from 'app/core/models/sort-option';
import { ContactService } from 'app/contacts/services/contact.service';
declare var $:any;

@Component({
  selector: 'app-select-partners-and-share-leads',
  templateUrl: './select-partners-and-share-leads.component.html',
  styleUrls: ['./select-partners-and-share-leads.component.css'],
  providers:[Properties,HttpRequestLoader,SortOption]
})
export class SelectPartnersAndShareLeadsComponent implements OnInit {

  @Output() selectPartnersAndShareLeadsEmitter = new EventEmitter();
  customResponse:CustomResponse = new CustomResponse();
  properties:Properties = new Properties();
  pagination:Pagination = new Pagination();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  partnerCompaniesSortOption: SortOption = new SortOption();
  selectedContactListIds = [];
  emptyContactListMessage = "";
  shareLeadsPagination: Pagination = new Pagination();
  shareLeadsLoader:HttpRequestLoader = new HttpRequestLoader();
  isHeaderCheckBoxChecked = false;
  shareLeadsErrorMessage:CustomResponse = new CustomResponse();
  selectedShareLeadsListIds =  [];
  selectedPartnershipId = 0;
  showLeadsPreview = false;
  selectedListName = "";
  selectedListId = 0;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public xtremandLogger:XtremandLogger,
    public pagerService:PagerService,public partnerService:ParterService,public contactService:ContactService) { }

  ngOnInit() {
    this.findPartnerCompanies(this.pagination);
  }

  findPartnerCompanies(pagination: Pagination) {
		this.referenceService.startLoader(this.httpRequestLoader);
		this.partnerService.loadPartnerCompanies(pagination,this.authenticationService.getUserId()).
    subscribe((result: any) => {
			let data = result.data;
			pagination.totalRecords = data.totalRecords;
			pagination = this.pagerService.getPagedItems(pagination, data.list);
			this.referenceService.stopLoader(this.httpRequestLoader);
		}, error => {
      this.xtremandLogger.error(error);
      this.xtremandLogger.errorPage(error);
		}, () => {

		});
	}

  /*************************Search********************** */
	searchPartnerCompanies() {
		this.getAllFilteredResults();
	}

	/************Page************** */
	navigateToNextPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.findPartnerCompanies(this.pagination);
	}

	getAllFilteredResults() {
		this.pagination.pageIndex = 1;
		this.findPartnerCompanies(this.pagination);
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.searchPartnerCompanies(); } }

	expandShareLeadsDiv(partner:any){
		this.selectedPartnershipId = partner.partnershipId;
		$("input:radio[name=one-launch-campaign-partner-company]").attr("disabled",false);
		$('#one-launch-campaign-radio-'+partner.partnershipId).attr("disabled",true);
		if(!partner.expand){
			this.viewShareLeads(partner);
		}
	}

	viewShareLeads(partner:any){
		this.shareLeadsPagination = new Pagination();
		this.isHeaderCheckBoxChecked = false;
		this.shareLeadsErrorMessage = new CustomResponse();
		this.pagination.pagedItems.forEach((element) => {
			let partnerCompanyId = element.partnerCompanyId;
			let clickedCompanyId = partner.partnerCompanyId;
			if (clickedCompanyId != partnerCompanyId) {
				element.expand = false;
			}
		});
		partner.expand = !partner.expand;
		if (partner.expand) {
			this.referenceService.loading(this.shareLeadsLoader, true);
			this.shareLeadsPagination.partnerCompanyId = partner.partnerCompanyId;
			this.shareLeadsPagination.partnershipId = partner.partnershipId;
			this.findShareLeads(this.shareLeadsPagination);
		}
	}

	findShareLeads(pagination:Pagination){
		this.referenceService.loading(this.shareLeadsLoader, true);
		pagination.channelCampaign = true;
		this.contactService.loadAssignedLeadsLists(pagination).
		subscribe(
			(data:any)=>{
				pagination.totalRecords = data.totalRecords;
				pagination = this.pagerService.getPagedItems(pagination, data.listOfUserLists);
				/*******Header checkbox will be chcked when navigating through page numbers*****/
				let shareLeadsListIds = pagination.pagedItems.map(function (a) { return a.id; });
				let items = $.grep(this.selectedShareLeadsListIds, function (element: any) {
					return $.inArray(element, shareLeadsListIds) !== -1;
				});
				if (items.length == shareLeadsListIds.length && shareLeadsListIds.length > 0) {
					this.isHeaderCheckBoxChecked = true;
				} else {
					this.isHeaderCheckBoxChecked = false;
				}
				this.referenceService.loading(this.shareLeadsLoader, false);
			},error=>{
				this.xtremandLogger.error(error);
				this.referenceService.loading(this.shareLeadsLoader, false);
				this.shareLeadsErrorMessage = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
			}
		);
	}

	searchShareLeadsList() {
		this.getAllFilteredShareLeadsResults();
	}

	/************Page************** */
	navigateToShareLeadsListNextPage(event: any) {
		this.shareLeadsPagination.pageIndex = event.page;
		this.findShareLeads(this.shareLeadsPagination);
	}

	getAllFilteredShareLeadsResults() {
		this.shareLeadsPagination.pageIndex = 1;
		this.findShareLeads(this.shareLeadsPagination);
	}
	shareLeadsEventHandler(keyCode: any) { if (keyCode === 13) { this.searchShareLeadsList(); } }

	previewLeads(shareLead:any){
		this.selectedListId = shareLead.id;
		this.selectedListName = shareLead.name;
		this.showLeadsPreview = true;

	}
	resetValues(){
		this.selectedListId = 0;
		this.selectedListName = "";
		this.showLeadsPreview = false;
	}
}
