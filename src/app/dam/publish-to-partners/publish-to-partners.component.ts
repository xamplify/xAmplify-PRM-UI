import { Component, OnInit, Input,Output,EventEmitter  } from '@angular/core';
import { DamService } from '../services/dam.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ReferenceService } from '../../core/services/reference.service';
import { Properties } from '../../common/models/properties';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { DamPublishPostDto } from '../models/dam-publish-post-dto';
declare var $: any;

@Component({
	selector: 'app-publish-to-partners',
	templateUrl: './publish-to-partners.component.html',
	styleUrls: ['./publish-to-partners.component.css'],
	providers: [HttpRequestLoader, SortOption, Properties]
})
export class PublishToPartnersComponent implements OnInit {

	ngxLoading = false;
	loggedInUserId: number = 0;
	pagination: Pagination = new Pagination();
	customResponse: CustomResponse = new CustomResponse();
	@Input() companyId: any;
	@Input() assetId: any;
	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	sortOption: SortOption = new SortOption();
	isHeaderCheckBoxChecked = false;
	selectedPartnerShipIds: any[] = [];
	isRowSelected: boolean;
	sendSuccess = false;
	responseMessage = "";
	responseImage = "";
	responseClass = "event-success";
	@Output() notifyOtherComponent = new EventEmitter();
	damPublishPostDto:DamPublishPostDto = new DamPublishPostDto();
	statusCode: number=0;
	publishedPartnershipIds:any[] = [];
	constructor(private damService: DamService,private pagerService: PagerService, public authenticationService: AuthenticationService,
		public referenceService: ReferenceService, public properties: Properties, public utilService: UtilService) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
		if (this.companyId != undefined && this.companyId > 0 && this.assetId!=undefined && this.assetId>0) {
			this.pagination.vendorCompanyId = this.companyId;
			this.pagination.formId = this.assetId;
			this.openPopup();
		}else{
			this.referenceService.showSweetAlertErrorMessage("Invalid Request.Please try after sometime");
			this.closePopup();
		}
	}

	openPopup() {
		$('#pulishDamPopup').modal('show');
		this.listPartners(this.pagination);
	}

	listPartners(pagination: Pagination) {
		this.referenceService.startLoader(this.httpRequestLoader);
		this.damService.listPartners(pagination).subscribe((result: any) => {
			let data = result.data;
			pagination.totalRecords = data.totalRecords;
			this.sortOption.totalRecords = data.totalRecords;
			pagination = this.pagerService.getPagedItems(pagination, data.list);
			/*******Header checkbox will be chcked when navigating through page numbers*****/
			let partnershipIds = this.pagination.pagedItems.map(function(a) { return a.partnershipId; });
			let items = $.grep(this.selectedPartnerShipIds, function(element: any) {
				return $.inArray(element, partnershipIds) !== -1;
			});
			if (items.length == partnershipIds.length) {
				this.isHeaderCheckBoxChecked = true;
			} else {
				this.isHeaderCheckBoxChecked = false;
			}
			this.referenceService.stopLoader(this.httpRequestLoader);
		}, _error => {
			this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
		},()=>{
			
		});
	}


	closePopup() {
		this.notifyOtherComponent.emit();
		$('#pulishDamPopup').modal('hide');
		this.sendSuccess = false;
		this.responseMessage = "";
		this.responseImage = "";
		this.responseClass = "";
		this.resetFields();
	}

	resetFields() {
		this.damPublishPostDto = new DamPublishPostDto();
		this.pagination = new Pagination();
		this.sortOption = new SortOption();
		this.isHeaderCheckBoxChecked = false;
		this.selectedPartnerShipIds = [];
		this.publishedPartnershipIds = [];
	}

	/********************Pagaination&Search Code*****************/

	/*************************Sort********************** */
	sortBy(text: any) {
		this.sortOption.selectedDamPartnerDropDownOption = text;
		this.getAllFilteredResults();
	}


	/*************************Search********************** */
	searchPartners() {
		this.getAllFilteredResults();
	}

	paginationDropdown() {
		this.getAllFilteredResults();
	}

	/************Page************** */
	setPage(event: any) {
		this.customResponse = new CustomResponse();
		this.pagination.pageIndex = event.page;
		this.listPartners(this.pagination);
	}


	getAllFilteredResults() {
		this.customResponse = new CustomResponse();
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.sortOption.searchKey;
		this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedDamPartnerDropDownOption, this.pagination);
		this.listPartners(this.pagination);
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }

	/***********CheckBox Selection************ */
	checkAll(ev: any) {
		if (ev.target.checked) {
			$('[name="damPartnershipCheckBoxName[]"]').prop('checked', true);
			this.isRowSelected = true;
			let self = this;
			$('[name="damPartnershipCheckBoxName[]"]:checked').each(function(_index: number) {
				var id = $(this).val();
				self.selectedPartnerShipIds.push(parseInt(id));
				$('#damPartnershipTr_' + id).addClass('row-selected');
			});
			this.selectedPartnerShipIds = this.referenceService.removeDuplicates(this.selectedPartnerShipIds);
			if (this.selectedPartnerShipIds.length == 0) { this.isRowSelected = false; }
		} else {
			$('[name="damPartnershipCheckBoxName[]"]').prop('checked', false);
			$('#dam-partnership-list-table tr').removeClass("row-selected");
			if (this.pagination.maxResults > 30 || (this.pagination.maxResults == this.pagination.totalRecords)) {
				this.isRowSelected = false;
				this.selectedPartnerShipIds = [];
			} else {
				this.selectedPartnerShipIds = this.referenceService.removeDuplicates(this.selectedPartnerShipIds);
				let currentPageSelectedIds = this.pagination.pagedItems.map(function(a) { return a.partnershipId; });
				this.selectedPartnerShipIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedPartnerShipIds, currentPageSelectedIds);
				if (this.selectedPartnerShipIds.length == 0) {
					this.isRowSelected = false;
				}
			}

		}
		ev.stopPropagation();
	}

	highlightRowByCheckBox(partnership: any, event: any) {
		let partnershipId = partnership.partnershipId;
		let isChecked = $('#' + partnershipId).is(':checked');
		if (isChecked) {
			$('#damPartnershipTr_' + partnershipId).addClass('row-selected');
			this.selectedPartnerShipIds.push(partnershipId);
		} else {
			$('#damPartnershipTr_' + partnershipId).removeClass('row-selected');
			this.selectedPartnerShipIds.splice($.inArray(partnershipId, this.selectedPartnerShipIds), 1);
		}
		this.utility();
		event.stopPropagation();
	}

	utility() {
		var trLength = $('#dam-partnership-list-table tbody tr').length;
		var selectedRowsLength = $('[name="damPartnershipCheckBoxName[]"]:checked').length;
		if (selectedRowsLength > 0) {
			this.isRowSelected = true;
		} else {
			this.isRowSelected = false;
		}
		if (trLength != selectedRowsLength) {
			$('#selectAllPartners').prop("checked", false)
		} else if (trLength == selectedRowsLength) {
			$('#selectAllPartners').prop("checked", true);
		}
	}

	highlightSelectedCampaignRow(partnership: any, event: any) {
		let partnershipId = partnership.partnershipId;
		let isChecked = $('#' + partnershipId).is(':checked');
		if (isChecked) {
			//Removing Highlighted Row
			$('#' + partnershipId).prop("checked", false);
			$('#damPartnershipTr_' + partnershipId).removeClass('row-selected');
			this.selectedPartnerShipIds.splice($.inArray(partnershipId, this.selectedPartnerShipIds), 1);
		} else {
			//Highlighting Row
			$('#' + partnershipId).prop("checked", true);
			$('#damPartnershipTr_' + partnershipId).addClass('row-selected');
			this.selectedPartnerShipIds.push(partnershipId);
		}
		this.utility();
		event.stopPropagation();
	}

	/****Publish To Partners */
	publishAsset() {
		if(this.selectedPartnerShipIds.length>0){
			this.startLoaders();
			this.damPublishPostDto.damId = this.assetId;
			this.damPublishPostDto.partnershipIds = this.selectedPartnerShipIds;
			this.damPublishPostDto.publishedBy = this.loggedInUserId;
			this.damService.publish(this.damPublishPostDto).subscribe((data: any) => {
				this.stopLoaders();
				if (data.access) {
					this.sendSuccess = true;
					this.statusCode = data.statusCode;
					if (data.statusCode == 200) {
					  this.responseMessage = "Published Successfully";
					} else {
						this.responseMessage = data.message;
					}
					this.resetFields();
				} else {
					this.authenticationService.forceToLogout();
				}
			}, _error => {
			  this.ngxLoading = false;
			  this.sendSuccess = false;
			  this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
			});
		}else{
			this.referenceService.goToTop();
			this.customResponse = new CustomResponse('ERROR','Please select atleast one partner',true);
		}
		
	}

	startLoaders(){
		this.ngxLoading = true;
		this.referenceService.startLoader(this.httpRequestLoader);
	}

	stopLoaders(){
		this.ngxLoading = false;
		this.referenceService.stopLoader(this.httpRequestLoader);
	}

	
}
