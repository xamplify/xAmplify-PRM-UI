import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DamService } from 'app/dam/services/dam.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ReferenceService } from '../../core/services/reference.service';
import { Properties } from '../../common/models/properties';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { DamPublishPostDto } from 'app/dam/models/dam-publish-post-dto';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ParterService } from "app/partners/services/parter.service";
import { UserService } from "app/core/services/user.service";
declare var $: any, swal: any;
@Component({
	selector: 'app-partner-company-and-groups-modal-popup',
	templateUrl: './partner-company-and-groups-modal-popup.component.html',
	styleUrls: ['./partner-company-and-groups-modal-popup.component.css'],
	providers: [HttpRequestLoader, SortOption, Properties, DamService]
})
export class PartnerCompanyAndGroupsModalPopupComponent implements OnInit {

	ngxLoading = false;
	loggedInUserId: number = 0;
	pagination: Pagination = new Pagination();
	customResponse: CustomResponse = new CustomResponse();
	@Input() companyId: any;
	@Input() inputId: any;
	@Input() moduleName: any;
	@Output() notifyOtherComponent = new EventEmitter();
	@Input() isPartnerGroupSelected: any;
	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	sendSuccess = false;
	responseMessage = "";
	responseImage = "";
	responseClass = "event-success";
	damPublishPostDto: DamPublishPostDto = new DamPublishPostDto();
	statusCode: number = 0;
	isEdit = false;
	/******Partner Companies Varaibles******/
	isHeaderCheckBoxChecked = false;
	selectedTeamMemberIds: any[] = [];
	teamMembersLoader: HttpRequestLoader = new HttpRequestLoader();
	sortOption: SortOption = new SortOption();
	teamMembersPagination: Pagination = new Pagination();
	adminsAndTeamMembersErrorMessage: CustomResponse = new CustomResponse();
	selectedPartnershipIds: any[] = [];
	/************Partner Group related variables**********/
	selectedPartnerGroupIds: any[] = [];
	partnerGroupsPagination: Pagination = new Pagination();
	partnerGroupsSortOption: SortOption = new SortOption();
	isParnterGroupHeaderCheckBoxChecked = false;
	constructor(public partnerService: ParterService, public xtremandLogger: XtremandLogger, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService,
		public referenceService: ReferenceService, public properties: Properties, public utilService: UtilService, public userService: UserService) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
		if (this.companyId != undefined && this.companyId > 0 && this.inputId != undefined && this.inputId > 0 &&
			this.moduleName != undefined && $.trim(this.moduleName).length > 0) {
			this.pagination.vendorCompanyId = this.companyId;
			this.openPopup();
		} else {
			this.referenceService.showSweetAlertErrorMessage("Invalid Request.Please try after sometime");
			this.closePopup();
		}
	}

	openPopup() {
		$('#partnerCompaniesPopup').modal('show');
		if(this.isPartnerGroupSelected){

		}else{
			this.findPublishedPartnershipIdsByInputId();
			this.findPublishedPartnerIds();
		}
		
	}
	findPublishedPartnerIds() {
		this.damService.findPublishedPartnerIds(this.inputId).subscribe(
			response => {
				this.selectedTeamMemberIds = response.data;
				if (response.data != undefined && response.data.length > 0) {
					this.isEdit = true;
				}
			}, error => {
				this.xtremandLogger.error(error);
			});
	}

	findPublishedPartnershipIdsByInputId() {
		this.referenceService.startLoader(this.httpRequestLoader);
		this.damService.findPublishedPartnershipIdsByDamId(this.inputId).subscribe(
			response => {
				this.selectedPartnershipIds = response.data;
			}, error => {
				this.xtremandLogger.error(error);
				this.findPartnerCompanies(this.pagination);
			}, () => {
				this.findPartnerCompanies(this.pagination);
			}
		);
	}

	findPartnerCompanies(pagination: Pagination) {
		this.referenceService.scrollToModalBodyTopByClass();
		this.referenceService.startLoader(this.httpRequestLoader);
		pagination.campaignId = this.inputId;
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

	navigateToNextPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.findPartnerCompanies(this.pagination);
	}

	partnersSearchOnKeyEvent(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }

	/*************************Sort********************** */
	sortBy(text: any) {
		this.sortOption.selectedDamPartnerDropDownOption = text;
		this.getAllFilteredResults("partnerCompanies", this.pagination, this.sortOption);
	}
	/*************************Search********************** */
	searchPartners() {
		this.getAllFilteredResults("partnerCompanies", this.pagination, this.sortOption);
	}
	getAllFilteredResults(type: string, pagination: Pagination, sortOption: SortOption) {
		this.customResponse = new CustomResponse();
		pagination.pageIndex = 1;
		pagination.searchKey = sortOption.searchKey;
		if (type == "partnerCompanies") {
			pagination = this.utilService.sortOptionValues(sortOption.selectedDamPartnerDropDownOption, pagination);
			this.findPartnerCompanies(pagination);
		} else if (type == "partnerGroups") {
			pagination = this.utilService.sortOptionValues(sortOption.selectedDamPartnerDropDownOption, pagination);
			this.findPartnerGroups(pagination);
		}
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
		this.teamMembersPagination = new Pagination();
		this.sortOption = new SortOption();
		this.isHeaderCheckBoxChecked = false;
		this.selectedTeamMemberIds = [];
		this.selectedPartnershipIds = [];
		this.ngxLoading = false;
	}

	viewTeamMembers(item: any) {
		this.teamMembersPagination = new Pagination();
		this.isHeaderCheckBoxChecked = false;
		this.adminsAndTeamMembersErrorMessage = new CustomResponse();
		this.pagination.pagedItems.forEach((element) => {
			let partnerCompanyId = element.partnerCompanyId;
			let clickedCompanyId = item.partnerCompanyId;
			if (clickedCompanyId != partnerCompanyId) {
				element.expand = false;
			}
		});
		item.expand = !item.expand;
		if (item.expand) {
			this.referenceService.loading(this.teamMembersLoader, true);
			this.teamMembersPagination.companyId = item.partnerCompanyId;
			this.teamMembersPagination.partnershipId = item.partnershipId;
			this.teamMembersPagination.campaignId = this.inputId;
			this.getTeamMembersAndAdmins(this.teamMembersPagination);

		}
	}

	

	getTeamMembersAndAdmins(teamMembersPagination: Pagination) {
		this.adminsAndTeamMembersErrorMessage = new CustomResponse();
		this.referenceService.loading(this.teamMembersLoader, true);
		this.userService.findAdminsAndTeamMembers(teamMembersPagination).subscribe(
			response => {
				let data = response.data;
				teamMembersPagination.totalRecords = data.totalRecords;
				teamMembersPagination.maxResults = teamMembersPagination.totalRecords;
				teamMembersPagination = this.pagerService.getPagedItems(teamMembersPagination, data.list);
				/*******Header checkbox will be chcked when navigating through page numbers*****/
				let teamMemberIds = teamMembersPagination.pagedItems.map(function (a) { return a.userId; });
				let items = $.grep(this.selectedTeamMemberIds, function (element: any) {
					return $.inArray(element, teamMemberIds) !== -1;
				});
				if (items.length == teamMemberIds.length && teamMemberIds.length > 0) {
					this.isHeaderCheckBoxChecked = true;
				} else {
					this.isHeaderCheckBoxChecked = false;
				}
				this.referenceService.loading(this.teamMembersLoader, false);
			}, error => {
				this.xtremandLogger.error(error);
				this.referenceService.loading(this.teamMembersLoader, false);
				this.adminsAndTeamMembersErrorMessage = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
			}
		);
	}

	/************Page************** */
	naviagtePages(event: any) {
		this.teamMembersPagination.pageIndex = event.page;
		this.getTeamMembersAndAdmins(this.teamMembersPagination);
	}

	adminAndTeamMembersKeySearch(keyCode: any) { if (keyCode === 13) { this.searchAdminsAndTeamMembers(); } }

	searchAdminsAndTeamMembers() {
		this.teamMembersPagination.pageIndex = 1;
		this.getTeamMembersAndAdmins(this.teamMembersPagination);
	}
	/************Partner Company Checkbox related code starts here****************/
	highlightAdminOrTeamMemberRowOnCheckBoxClick(teamMemberId: number, partnershipId: number, event: any) {
		let isChecked = $('#' + teamMemberId).is(':checked');
		if (isChecked) {
			$('#publishToPartners' + teamMemberId).addClass('row-selected');
			this.selectedTeamMemberIds.push(teamMemberId);
		} else {
			$('#publishToPartners' + teamMemberId).removeClass('row-selected');
			this.selectedTeamMemberIds.splice($.inArray(teamMemberId, this.selectedTeamMemberIds), 1);
		}
		this.checkHeaderCheckBox(partnershipId);
		event.stopPropagation();
	}

	checkHeaderCheckBox(partnershipId: number) {
		let trLength = $('#admin-and-team-members-' + partnershipId + ' tbody tr').length;
		let selectedRowsLength = $('[name="adminOrTeamMemberCheckBox[]"]:checked').length;
		if (selectedRowsLength == 0) {
			this.selectedPartnershipIds.splice($.inArray(partnershipId, this.selectedPartnershipIds), 1);
		} else {
			this.selectedPartnershipIds.push(partnershipId);
		}
		this.selectedPartnershipIds = this.referenceService.removeDuplicates(this.selectedPartnershipIds);
		this.isHeaderCheckBoxChecked = (trLength == selectedRowsLength);
	}

	highlightSelectedAdminOrTeamMemberRowOnRowClick(teamMemberId: number, partnershipId: number, event: any) {
		let isChecked = $('#' + teamMemberId).is(':checked');
		if (isChecked) {
			//Removing Highlighted Row
			$('#' + teamMemberId).prop("checked", false);
			$('#publishToPartners' + teamMemberId).removeClass('row-selected');
			this.selectedTeamMemberIds.splice($.inArray(teamMemberId, this.selectedTeamMemberIds), 1);
		} else {
			//Highlighting Row
			$('#' + teamMemberId).prop("checked", true);
			$('#publishToPartners' + teamMemberId).addClass('row-selected');
			this.selectedTeamMemberIds.push(teamMemberId);
		}
		this.checkHeaderCheckBox(partnershipId);
		event.stopPropagation();
	}

	selectAllTeamMembersOfTheCurrentPage(ev: any, partnershipId: number) {
		if (ev.target.checked) {
			$('[name="adminOrTeamMemberCheckBox[]"]').prop('checked', true);
			let self = this;
			$('[name="adminOrTeamMemberCheckBox[]"]:checked').each(function (_index: number) {
				var id = $(this).val();
				self.selectedTeamMemberIds.push(parseInt(id));
				$('#publishToPartners' + id).addClass('row-selected');
			});
			this.selectedTeamMemberIds = this.referenceService.removeDuplicates(this.selectedTeamMemberIds);
			this.selectedPartnershipIds.push(partnershipId);
		} else {
			$('[name="adminOrTeamMemberCheckBox[]"]').prop('checked', false);
			$('#parnter-companies tr').removeClass("row-selected");
			this.selectedTeamMemberIds = this.referenceService.removeDuplicates(this.selectedTeamMemberIds);
			let currentPageSelectedIds = this.teamMembersPagination.pagedItems.map(function (a) { return a.userId; });
			this.selectedTeamMemberIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedTeamMemberIds, currentPageSelectedIds);
			this.selectedPartnershipIds = this.referenceService.removeDuplicates(this.selectedPartnershipIds);
			this.selectedPartnershipIds.splice($.inArray(partnershipId, this.selectedPartnershipIds), 1);
		}
		ev.stopPropagation();
	}
	/************Partner Company Checkbox related code ends here****************/
	publish() {
		if (this.selectedTeamMemberIds.length > 0 || this.selectedPartnerGroupIds.length>0 || this.isEdit) {
			let selectedType = $('.tab-pane.active').attr("id");
			this.startLoaders();
			this.damPublishPostDto.damId = this.inputId;
			this.damPublishPostDto.partnerIds = this.selectedTeamMemberIds;
			this.damPublishPostDto.partnerGroupIds = this.selectedPartnerGroupIds;
			this.damPublishPostDto.publishedBy = this.loggedInUserId;
			this.damPublishPostDto.partnerGroupSelected = ('partnerGroups' == selectedType);
			this.publishToPartnersOrGroups();
		} else {
			this.referenceService.goToTop();
			this.customResponse = new CustomResponse('ERROR', 'No Row Is Selected', true);
		}
	}

	publishToPartnersOrGroups(){
		this.damService.publish(this.damPublishPostDto).subscribe((data: any) => {
			this.referenceService.scrollToModalBodyTopByClass();
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
			this.stopLoaders();
			this.sendSuccess = false;
			this.referenceService.goToTop();
			this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
		});
	}

	startLoaders() {
		this.ngxLoading = true;
		this.referenceService.startLoader(this.httpRequestLoader);
	}

	stopLoaders() {
		this.ngxLoading = false;
		this.referenceService.stopLoader(this.httpRequestLoader);
	}

	/******************Partner Group related code starts here*********************/
	findPartnerGroups(pagination: Pagination) {
		this.customResponse = new CustomResponse();
		this.referenceService.scrollToModalBodyTopByClass();
		this.referenceService.startLoader(this.httpRequestLoader);
		pagination.companyId = this.companyId;
		this.partnerService.findPartnerGroups(pagination).subscribe((result: any) => {
			let data = result.data;
			pagination.totalRecords = data.totalRecords;
			this.partnerGroupsSortOption.totalRecords = data.totalRecords;
			$.each(data.list, function (_index: number, list: any) {
				list.displayTime = new Date(list.createdTimeInString);
			});
			pagination = this.pagerService.getPagedItems(pagination, data.list);
			/*******Header checkbox will be chcked when navigating through page numbers*****/
			let partnerGroupIds = pagination.pagedItems.map(function (a) { return a.id; });
			
			let items = $.grep(this.selectedPartnerGroupIds, function (element: any) {
				return $.inArray(element, partnerGroupIds) !== -1;
			});
			this.isParnterGroupHeaderCheckBoxChecked = (items.length == partnerGroupIds.length && partnerGroupIds.length > 0);
			this.referenceService.stopLoader(this.httpRequestLoader);
		}, _error => {
			this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
		}, () => {

		});

	}

	partnerGroupsSearchOnKeyEvent(keyCode: any) { if (keyCode === 13) { this.searchPartnerGroups(); } }

	searchPartnerGroups() {
		this.getAllFilteredResults("partnerGroups", this.partnerGroupsPagination, this.partnerGroupsSortOption);
	}

	navigatePartnerGroups(event: any) {
		this.partnerGroupsPagination.pageIndex = event.page;
		this.findPartnerGroups(this.partnerGroupsPagination);
	}

	highlightSelectedPartnerGroupOnRowClick(partnerGroupId: any, event: any) {
		this.referenceService.highlightRowOnRowCick('partnerGroups-tr', 'parnter-groups-table', 'partnerGroupsCheckBox', this.selectedPartnerGroupIds, 'parnterGroupsHeaderCheckBox', partnerGroupId, event);
		console.log(this.selectedPartnerGroupIds);
	}

	highlightPartnerGroupRowOnCheckBoxClick(partnerGroupId: any, event: any) {
		this.referenceService.highlightRowByCheckBox('partnerGroups-tr', 'parnter-groups-table', 'partnerGroupsCheckBox', this.selectedPartnerGroupIds, 'parnterGroupsHeaderCheckBox', partnerGroupId, event);
	}

	selectOrUnselectAllPartnerGroupsOfTheCurrentPage(event:any){
		this.selectedPartnerGroupIds = this.referenceService.selectOrUnselectAllOfTheCurrentPage('partnerGroups-tr', 'parnter-groups-table', 'partnerGroupsCheckBox', this.selectedPartnerGroupIds,this.partnerGroupsPagination,event);
	}




}
