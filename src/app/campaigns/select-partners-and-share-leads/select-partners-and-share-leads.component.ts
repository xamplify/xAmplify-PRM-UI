import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
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
  @Input()selectedShareLeadsListIds =  [];
  @Input()selectedPartnershipId = 0;
  @Input()campaignId = 0;
  @Input() hideHeaderText = false;
  showLeadsPreview = false;
  selectedListName = "";
  selectedListId = 0;
  showExpandButton = false;
  expandedUserList: any;
  colspanValue = 2;
  isTableLoaded: boolean = true;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public xtremandLogger:XtremandLogger,
    public pagerService:PagerService,public partnerService:ParterService,public contactService:ContactService) { }

  ngOnInit() {
	setTimeout(() =>{
		this.isTableLoaded = true;
	},2000);
	if(this.hideHeaderText==undefined){
		this.hideHeaderText = false;
	}
	this.pagination.campaignId = this.campaignId;
	if(this.hideHeaderText){
		this.pagination.maxResults = 4;
	}
    this.findPartnerCompanies(this.pagination);
	this.disableThePartnerCompanyRadioButton();
	
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
	/***Select The Radio Button And Expand The List*/
	selectPartnerCompanyAndExpandShareLeadsList(partner:any){
		this.selectedPartnershipId = partner.partnershipId;
		this.selectedShareLeadsListIds = [];
		$("input:radio[name=one-launch-campaign-partner-company]").attr("disabled",false);
		this.disableThePartnerCompanyRadioButton();
		if(!partner.expand){
			this.viewShareLeads(partner);
		}
		this.sendSelectedValuesToOtherComponent();
	}

	disableThePartnerCompanyRadioButton(){
		if(this.selectedPartnershipId!=undefined && this.selectedPartnershipId>0){
			$('#one-launch-campaign-radio-'+this.selectedPartnershipId).attr("disabled",true);
		}
		
	}

	viewShareLeads(partner:any){
		this.shareLeadsPagination = new Pagination();
		if(this.hideHeaderText){
			this.shareLeadsPagination.maxResults = 4;
		}
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
			this.shareLeadsPagination.headerCheckBoxChecked = this.selectedPartnershipId==partner.partnershipId;
			this.findShareLeads(this.shareLeadsPagination);
		}
	}

	

	findShareLeads(pagination:Pagination){
		this.referenceService.loading(this.shareLeadsLoader, true);
		let searchKey = $.trim(pagination.searchKey);
		if(searchKey!=null && searchKey!=undefined && searchKey.length>0){
			this.colspanValue= 3;
		}else{
			this.colspanValue = 2;
		}
		pagination.channelCampaign = true;
		pagination.campaignId = this.campaignId;
		this.showExpandButton = $.trim(pagination.searchKey).length>0;
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
				if (items.length == shareLeadsListIds.length && shareLeadsListIds.length > 0 && this.shareLeadsPagination.headerCheckBoxChecked) {
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

	/*****CheckBox Code******/
	selectOrUnselectAllRowsOfTheCurrentPage(event:any,partnershipId:number){
		if (event.target.checked) {
			$('[name="oneClickShareLeadsCheckBox[]"]').prop('checked', true);
			let self = this;
			$('[name="oneClickShareLeadsCheckBox[]"]:checked').each(function (_index: number) {
				var id = $(this).val();
				self.selectedShareLeadsListIds.push(parseInt(id));
				$('#one-click-share-leads-tr-' + id).addClass('xamp-tr-selected');
			});
			this.selectedShareLeadsListIds = this.referenceService.removeDuplicates(this.selectedShareLeadsListIds);
			this.selectedPartnershipId = partnershipId;
		} else {
			$('[name="oneClickShareLeadsCheckBox[]"]').prop('checked', false);
			this.selectedShareLeadsListIds = this.referenceService.removeDuplicates(this.selectedShareLeadsListIds);
			let currentPageSelectedIds = this.shareLeadsPagination.pagedItems.map(function (a) { return a.id; });
			this.selectedShareLeadsListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedShareLeadsListIds, currentPageSelectedIds);
		}
		event.stopPropagation();
		this.sendSelectedValuesToOtherComponent();
	}

	highlightSelectedShareListOnRowClick(shareLeadsListId: any,partnershipId:number, event: any) {
		if(this.selectedPartnershipId==partnershipId){
			let shareLeadsListTableId = "one-click-share-leads-"+partnershipId;
			this.referenceService.highlightRowOnRowCick('one-click-share-leads-tr', shareLeadsListTableId, 'oneClickShareLeadsCheckBox', this.selectedShareLeadsListIds, 'one-click-share-leads-header-checkbox-id', shareLeadsListId, event);
			this.sendSelectedValuesToOtherComponent();
		}
	}
	
	highlightShareListRowOnCheckBoxClick(shareLeadsListId: any,partnershipId:number, event: any) {
		let shareLeadsListTableId = "one-click-share-leads-"+partnershipId;
		this.referenceService.highlightRowByCheckBox('one-click-share-leads-tr', shareLeadsListTableId, 'oneClickShareLeadsCheckBox', this.selectedShareLeadsListIds, 'one-click-share-leads-header-checkbox-id', shareLeadsListId, event);
		this.sendSelectedValuesToOtherComponent();
	}
	

	
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

	sendSelectedValuesToOtherComponent(){
		let emitterObject = {};
		emitterObject['selectedShareListIds'] = this.selectedShareLeadsListIds;
		emitterObject['selectedPartnershipId'] = this.selectedPartnershipId;
		this.selectPartnersAndShareLeadsEmitter.emit(emitterObject);
	}

	viewMatchedContacts(userList: any) {
		userList.expand = !userList.expand;		
		if (userList.expand) {
			if ((this.expandedUserList != undefined || this.expandedUserList != null)
			 && userList != this.expandedUserList) {				
				this.expandedUserList.expand = false;				
			}			
			this.expandedUserList = userList;		
		}
	} 
}
