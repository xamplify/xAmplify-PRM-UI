import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ParterService } from "app/partners/services/parter.service";
import {UserService} from "app/core/services/user.service";
import {AdminAndTeamMemberDto} from "../models/admin-and-team-member-dto"
declare var $:any, swal: any;

@Component({
	selector: 'app-publish-to-partners-popup',
	templateUrl: './publish-to-partners-popup.component.html',
	styleUrls: ['./publish-to-partners-popup.component.css'],
	providers: [HttpRequestLoader, SortOption, Properties]

})
export class PublishToPartnersPopupComponent implements OnInit {

	ngxLoading = false;
	loggedInUserId: number = 0;
	pagination: Pagination = new Pagination();
	customResponse: CustomResponse = new CustomResponse();
	adminAndTeamMemberDto : AdminAndTeamMemberDto = new AdminAndTeamMemberDto();
	adminsAndTeamMembersErrorMessage: CustomResponse = new CustomResponse();
	@Input() companyId: any;
	@Input() assetId: any;
	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	teamMembersLoader: HttpRequestLoader = new HttpRequestLoader();
	sortOption: SortOption = new SortOption();
	isHeaderCheckBoxChecked = false;
	selectedPartnerShipIds: any[] = [];
	isRowSelected: boolean;
	sendSuccess = false;
	responseMessage = "";
	responseImage = "";
	responseClass = "event-success";
	@Output() notifyOtherComponent = new EventEmitter();
	damPublishPostDto: DamPublishPostDto = new DamPublishPostDto();
	statusCode: number = 0;
	publishedPartnershipIds: any[] = [];
	showPublishedPartnersList = false;
	constructor(public partnerService: ParterService, public xtremandLogger: XtremandLogger, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService,
		public referenceService: ReferenceService, public properties: Properties, public utilService: UtilService,public userService:UserService) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
		if (this.companyId != undefined && this.companyId > 0 && this.assetId != undefined && this.assetId > 0) {
			this.pagination.vendorCompanyId = this.companyId;
			this.openPopup();
		} else {
			this.referenceService.showSweetAlertErrorMessage("Invalid Request.Please try after sometime");
			this.closePopup();
		}
	}

	openPopup() {
		$('#partnerCompaniesPopup').modal('show');
		this.findPartnerCompanies(this.pagination);
	}

	findPartnerCompanies(pagination: Pagination) {
		this.referenceService.startLoader(this.httpRequestLoader);
		this.partnerService.findPartnerCompanies(pagination).subscribe((result: any) => {
			let data = result.data;
			pagination.totalRecords = data.totalRecords;
			this.sortOption.totalRecords = data.totalRecords;
			$.each(data.list, function (_index: number, list: any) {
				list.displayTime = new Date(list.createdTimeInString);
			});
			pagination = this.pagerService.getPagedItems(pagination, data.list);
			this.referenceService.stopLoader(this.httpRequestLoader);
		}, _error => {
			this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
		}, () => {

		});
	}


	closePopup() {
		this.notifyOtherComponent.emit();
		$('#partnerCompaniesPopup').modal('hide');
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
		this.ngxLoading = false;
	}

	/********************Pagaination&Search Code*****************/
	listItems(pagination: any) {
		this.pagination = pagination;
		this.listPublishedOrUnPublishedPartners();
	}
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
		this.listPublishedOrUnPublishedPartners();
	}


	getAllFilteredResults() {
		this.customResponse = new CustomResponse();
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.sortOption.searchKey;
		this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedDamPartnerDropDownOption, this.pagination);
		this.listPublishedOrUnPublishedPartners();
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }

	listPublishedOrUnPublishedPartners() {
		if (this.showPublishedPartnersList) {
			this.listPublishedPartners(this.pagination);
		} else {
			this.findPartnerCompanies(this.pagination);
		}
	}

	/***********CheckBox Selection************ */
	checkAll(ev: any) {
		if (ev.target.checked) {
			$('[name="damPartnershipCheckBoxName[]"]').prop('checked', true);
			this.isRowSelected = true;
			let self = this;
			$('[name="damPartnershipCheckBoxName[]"]:checked').each(function (_index: number) {
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
				let currentPageSelectedIds = this.pagination.pagedItems.map(function (a) { return a.partnershipId; });
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
		if (!this.showPublishedPartnersList) {
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
		}
		event.stopPropagation();
	}

	/****Publish To Partners */
	publishAsset() {
		if (this.selectedPartnerShipIds.length > 0) {
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
					this.ngxLoading = false;
					this.authenticationService.forceToLogout();
				}
			}, _error => {
				this.ngxLoading = false;
				this.sendSuccess = false;
				this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
			});
		} else {
			this.referenceService.goToTop();
			this.customResponse = new CustomResponse('ERROR', 'Please select atleast one partner', true);
		}

	}

	startLoaders() {
		this.ngxLoading = true;
		this.referenceService.startLoader(this.httpRequestLoader);
	}

	stopLoaders() {
		this.ngxLoading = false;
		this.referenceService.stopLoader(this.httpRequestLoader);
	}

	viewPublishedPartners() {
		this.showPublishedPartnersList = true;
		this.pagination = new Pagination();
		this.pagination.vendorCompanyId = this.companyId;
		this.pagination.formId = this.assetId;
		this.sortOption = new SortOption();
		this.listPublishedPartners(this.pagination);
	}
	listPublishedPartners(pagination: Pagination) {
		this.referenceService.startLoader(this.httpRequestLoader);
		this.damService.listPublishedPartners(pagination).subscribe((result: any) => {
			let data = result.data;
			pagination.totalRecords = data.totalRecords;
			this.sortOption.totalRecords = data.totalRecords;
			pagination = this.pagerService.getPagedItems(pagination, data.list);
			this.referenceService.stopLoader(this.httpRequestLoader);
		}, _error => {
			this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
		}, () => {

		});
	}

	viewUnPublishedPartners() {
		this.showPublishedPartnersList = false;
		this.pagination = new Pagination();
		this.pagination.vendorCompanyId = this.companyId;
		this.pagination.formId = this.assetId;
		this.sortOption = new SortOption();
		this.findPartnerCompanies(this.pagination);
	}

	openDeletePopup(partner: any) {
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
				self.deleteById(partner);
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.xtremandLogger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
		}
	}

	deleteById(partner: any) {
		this.customResponse = new CustomResponse();
		this.referenceService.startLoader(this.httpRequestLoader);
		this.referenceService.goToTop();
		this.damService.deletePartner(partner.id)
			.subscribe(
				(response: any) => {
					this.customResponse = new CustomResponse('SUCCESS', "Partner Deleted Successfully", true);
					this.pagination.pageIndex = 1;
					this.listPublishedPartners(this.pagination);
				},
				(_error: string) => {
					this.referenceService.showServerErrorMessage(this.httpRequestLoader);
					this.customResponse = new CustomResponse('ERROR', this.httpRequestLoader.message, true);
				}
			);
	}

	viewTeamMembers(item: any) {
		this.adminAndTeamMemberDto = new AdminAndTeamMemberDto();
		this.adminsAndTeamMembersErrorMessage = new CustomResponse();
		this.pagination.pagedItems.forEach((element) => {
			let partnerCompanyId = element.partnerCompanyId;
			let clickedCompanyId = item.partnerCompanyId;
			if (clickedCompanyId != partnerCompanyId) {
				element.expand = false;
			}
		});
		item.expand = !item.expand;
		if(item.expand){
			this.adminAndTeamMemberDto.pagination.companyId = item.partnerCompanyId;
			this.getTeamMembersAndAdmins(this.adminAndTeamMemberDto.pagination);
		}
	}

	getTeamMembersAndAdmins(adminsAndTeamMembersPagination:Pagination){
		this.adminsAndTeamMembersErrorMessage = new CustomResponse();
		this.referenceService.loading(this.teamMembersLoader, true);
		adminsAndTeamMembersPagination.maxResults = 3;
		this.userService.findAdminsAndTeamMembers(adminsAndTeamMembersPagination).subscribe(
			response=>{
				let data = response.data;
				adminsAndTeamMembersPagination.totalRecords = data.totalRecords;
				adminsAndTeamMembersPagination = this.pagerService.getPagedItems(adminsAndTeamMembersPagination, data.list);
				this.referenceService.loading(this.teamMembersLoader, false);
			},error=>{
				this.xtremandLogger.error(error);
				this.referenceService.loading(this.teamMembersLoader, false);
				this.adminsAndTeamMembersErrorMessage = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
			}
		);
	}
	/************Page************** */
	naviagtePages(event: any) {
		this.adminAndTeamMemberDto.pagination.pageIndex = event.page;
		this.getTeamMembersAndAdmins(this.adminAndTeamMemberDto.pagination);
	}

	adminAndTeamMembersKeySearch(keyCode: any) { if (keyCode === 13) { this.searchAdminsAndTeamMembers(); } }

	searchAdminsAndTeamMembers(){
		this.adminAndTeamMemberDto.pagination.pageIndex = 1;
		this.getTeamMembersAndAdmins(this.adminAndTeamMemberDto.pagination);
	}

	highlightAdminOrTeamMemberRow(adminAndTeamMemberDto:AdminAndTeamMemberDto){
		console.log(adminAndTeamMemberDto);
	}
	
}
