import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
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
import { CallActionSwitch } from '../../videos/models/call-action-switch';

declare var $: any, swal: any;
@Component({
	selector: 'app-partner-company-and-groups-modal-popup',
	templateUrl: './partner-company-and-groups-modal-popup.component.html',
	styleUrls: ['./partner-company-and-groups-modal-popup.component.css'],
	providers: [HttpRequestLoader, SortOption, Properties, DamService,CallActionSwitch]
})
export class PartnerCompanyAndGroupsModalPopupComponent implements OnInit, OnDestroy {


	ngxLoading = false;
	loggedInUserId: number = 0;
	pagination: Pagination = new Pagination();
	customResponse: CustomResponse = new CustomResponse();
	@Input() companyId: any;
	@Input() inputId: any;
	@Input() moduleName: any;
	@Output() notifyOtherComponent = new EventEmitter();
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
	isPublishedToPartnerGroup = false;
	modalPopupLoader: boolean;
	isModalPopupshow : boolean = false ;
	showUsersPreview = false;
	selectedPartnerGroupName = "";
	selectedPartnerGroupId:number=0;
	showExpandButton = false; 
	expandedUserList: any;
	/***XNFR-85*****/
	selectedFilterIndex: number = 1;
	showFilter = true;
	selectedTab = 1;

	constructor(public partnerService: ParterService, public xtremandLogger: XtremandLogger, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService,
		public referenceService: ReferenceService, public properties: Properties,
		 public utilService: UtilService, public userService: UserService,public callActionSwitch:CallActionSwitch) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
		if (this.companyId != undefined && this.companyId > 0 && this.inputId != undefined && this.inputId > 0 &&
			this.moduleName != undefined && $.trim(this.moduleName).length > 0) {
			this.pagination.vendorCompanyId = this.companyId;
			this.pagination.partnerTeamMemberGroupFilter = true;
			this.openPopup();
		} else {
			this.referenceService.showSweetAlertErrorMessage("Invalid Request.Please try after sometime");
			this.closePopup();
		}
	}

	ngOnDestroy(): void {
		this.closePopup();
	}

	openPopup() {
		$('#partnerCompaniesPopup').modal('show');
		this.findPublishedType();
	 this.isModalPopupshow = true ;
	}

	findPublishedType() {
		this.modalPopupLoader = true;
		this.referenceService.startLoader(this.httpRequestLoader);
		this.damService.isPublishedToPartnerGroups(this.inputId, this.moduleName).subscribe(
			response => {
				this.isPublishedToPartnerGroup = response.data;
				if (this.isPublishedToPartnerGroup) {
					$('#partnerGroups-li').addClass('active');
					$('#partnerGroups').addClass('tab-pane fade in active');
					this.showFilter = false;
					this.selectedTab = 2;
				}else {
					$('#partners-li').addClass('active');
					$('#partners').addClass('tab-pane fade in active');
					this.showFilter = true;
					this.selectedTab = 1;
				}
			}, error => {
				this.referenceService.showSweetAlertErrorMessage("Invalid Request.Please try after sometime");
				this.closePopup();
			},() => {
				if (this.isPublishedToPartnerGroup) {
					this.findPublishedPartnerGroupIdsByInputId();
				} else {
					this.findPublishedPartnershipIdsByInputId();
					this.findPublishedPartnerIds();
				}
			}
		);
	}

	findPublishedPartnerGroupIdsByInputId() {
		this.referenceService.startLoader(this.httpRequestLoader);
		this.damService.findPublishedPartnerGroupIdsByDamId(this.inputId, this.moduleName).subscribe(
			response => {
				this.selectedPartnerGroupIds = response.data;
				if (response.data != undefined && response.data.length > 0) {
					this.isEdit = true;
				}
				this.disableOrEnablePartnerCompaniesTab();
			}, error => {
				this.xtremandLogger.error(error);
				this.findPartnerGroups(this.partnerGroupsPagination);
			}, () => {
				this.findPartnerGroups(this.partnerGroupsPagination);
			}
		);
	}

	findPublishedPartnerIds() {
		this.referenceService.startLoader(this.httpRequestLoader);
		this.damService.findPublishedPartnerIds(this.inputId, this.moduleName).subscribe(
			response => {
				this.selectedTeamMemberIds = response.data;
				if (response.data != undefined && response.data.length > 0) {
					this.isEdit = true;
				}
				this.disableOrEnablePartnerListsTab();
				this.referenceService.stopLoader(this.httpRequestLoader);
			}, error => {
				this.referenceService.stopLoader(this.httpRequestLoader);
				this.xtremandLogger.error(error);
			});
	}

	findPublishedPartnershipIdsByInputId() {
		this.referenceService.startLoader(this.httpRequestLoader);
		this.damService.findPublishedPartnershipIdsByDamId(this.inputId, this.moduleName).subscribe(
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
		pagination.userId = this.loggedInUserId;
		this.partnerService.findPartnerCompanies(pagination).subscribe((result: any) => {
			let data = result.data;
			pagination.totalRecords = data.totalRecords;
			this.sortOption.totalRecords = data.totalRecords;
			$.each(data.list, function (_index: number, list: any) {
				list.displayTime = new Date(list.createdTimeInString);
			});
			pagination = this.pagerService.getPagedItems(pagination, data.list);
			this.referenceService.stopLoader(this.httpRequestLoader);
			this.modalPopupLoader = false;
		}, _error => {
			this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
			this.modalPopupLoader = false;
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
			if (pagination.searchKey != undefined && pagination.searchKey != null && pagination.searchKey.trim() != "") {
				this.showExpandButton = true;
			} else {
				this.showExpandButton = false;
			}
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
		this.disableOrEnablePartnerListsTab();
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
		this.disableOrEnablePartnerListsTab();
		event.stopPropagation();
	}

	disableOrEnablePartnerListsTab() {
		if (this.selectedTeamMemberIds.length > 0) {
			$('#partnerGroups-li').css({ 'cursor': 'not-allowed' });
			$('.partnerGroupsC').css({ 'pointer-events': 'none' });
			let tooltipMessage = "You can choose either company / list";
			$('#partnerGroups-li').attr('title', tooltipMessage);
		} else {
			$('#partnerGroups-li').css({ 'cursor': 'auto' });
			$('.partnerGroupsC').css({ 'pointer-events': 'auto' });
			$('#partnerGroups-li').attr('title', 'Click to see lists');
		}
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
		this.disableOrEnablePartnerListsTab();
		ev.stopPropagation();
	}
	clearAll() {
		let selectedTabName = this.selectedTabName();
		if ("partners" == selectedTabName) {
			this.selectedTeamMemberIds = [];
			this.selectedPartnershipIds = [];
			this.isHeaderCheckBoxChecked = false;
			this.disableOrEnablePartnerListsTab();
		} else {
			this.selectedPartnerGroupIds = [];
			this.isParnterGroupHeaderCheckBoxChecked = false;
			$('#parnterGroupsHeaderCheckBox').prop('checked',false);
			this.disableOrEnablePartnerCompaniesTab();
		}
	}
	/************Partner Company Checkbox related code ends here****************/
	selectedTabName() {
		return $('.tab-pane.active').attr("id");
	}

	publish() {
		this.customResponse = new CustomResponse();
		if (this.selectedTeamMemberIds.length > 0 || this.selectedPartnerGroupIds.length > 0 || this.isEdit) {
			let selectedType = this.selectedTabName();
			this.damPublishPostDto.partnerGroupSelected = ('partnerGroups' == selectedType);
			if (this.isEdit) {
				this.publishOrUnPublishToGroupsOrCompanies();
			} else {
				this.setValuesAndPublish();
			}
		} else {
			this.referenceService.goToTop();
			this.customResponse = new CustomResponse('ERROR', 'Please select atleast one row', true);
		}
	}

	publishOrUnPublishToGroupsOrCompanies() {
		if (this.damPublishPostDto.partnerGroupSelected && !this.isPublishedToPartnerGroup) {
			this.unPublishToCompaniesAndPublishToGroups();
		} else if (!this.damPublishPostDto.partnerGroupSelected && this.isPublishedToPartnerGroup) {
			this.unPublishToGroupsAndPublishToCompanies();
		} else {
			this.setValuesAndPublish();
		}
	}


	unPublishToCompaniesAndPublishToGroups() {
		if (this.selectedPartnerGroupIds.length > 0) {
			this.showSweetAlertAndProceed();
		} else {
			this.referenceService.goToTop();
			this.customResponse = new CustomResponse('ERROR', 'Please select atleast one group', true);
		}
	}

	unPublishToGroupsAndPublishToCompanies() {
		if (this.selectedTeamMemberIds.length > 0) {
			this.showSweetAlertAndProceed();
		} else {
			this.referenceService.goToTop();
			this.customResponse = new CustomResponse('ERROR', 'Please select atleast one company', true);
		}
	}

	showSweetAlertAndProceed() {
		let self = this;
		swal({
			title: 'Are you sure?',
			text: "Existing data will be deleted",
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Yes, delete it!',
			allowOutsideClick: false,
      		allowEscapeKey: false
		}).then(function () {
			self.setValuesAndPublish();
		}, function (dismiss: any) {
		});
	}

	setValuesAndPublish() {
		this.startLoaders();
		this.damPublishPostDto.damId = this.inputId;
		if (this.selectedTabName() == "partners") {
			this.damPublishPostDto.partnerIds = this.selectedTeamMemberIds;
			this.damPublishPostDto.partnerGroupIds = [];
		} else {
			this.damPublishPostDto.partnerGroupIds = this.selectedPartnerGroupIds;
			this.damPublishPostDto.partnerIds = [];
		}
		this.damPublishPostDto.publishedBy = this.loggedInUserId;
		this.publishToPartnersOrGroups();
	}

	publishToPartnersOrGroups() {
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
		if (this.selectedTeamMemberIds.length == 0) {
			this.customResponse = new CustomResponse();
			this.referenceService.scrollToModalBodyTopByClass();
			this.referenceService.startLoader(this.httpRequestLoader);
			pagination.companyId = this.companyId;
			pagination.campaignId = this.inputId;
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
				this.modalPopupLoader = false;
			}, _error => {
				this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
			}, () => {

			});
		}
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
		this.disableOrEnablePartnerCompaniesTab();
	}

	highlightPartnerGroupRowOnCheckBoxClick(partnerGroupId: any, event: any) {
		this.referenceService.highlightRowByCheckBox('partnerGroups-tr', 'parnter-groups-table', 'partnerGroupsCheckBox', this.selectedPartnerGroupIds, 'parnterGroupsHeaderCheckBox', partnerGroupId, event);
		this.disableOrEnablePartnerCompaniesTab();
	}

	selectOrUnselectAllPartnerGroupsOfTheCurrentPage(event: any) {
		this.selectedPartnerGroupIds = this.referenceService.selectOrUnselectAllOfTheCurrentPage('partnerGroups-tr', 'parnter-groups-table', 'partnerGroupsCheckBox', this.selectedPartnerGroupIds, this.partnerGroupsPagination, event);
		this.disableOrEnablePartnerCompaniesTab();
	}

	disableOrEnablePartnerCompaniesTab() {
		if (this.selectedPartnerGroupIds.length > 0) {
			$('#partners-li').css({ 'cursor': 'not-allowed' });
			$('.partnersC').css({ 'pointer-events': 'none' });
			let tooltipMessage = "You can choose either company / list";
			$('#partners-li').attr('title', tooltipMessage);
		} else {
			$('#partners-li').css({ 'cursor': 'auto' });
			$('.partnersC').css({ 'pointer-events': 'auto' });
			$('#partners-li').attr('title', 'Click to see companies');
		}
	}

	previewUserListUsers(partnerGroup: any) {
		this.showUsersPreview = true;
		this.selectedPartnerGroupName = partnerGroup.groupName;
		this.selectedPartnerGroupId = partnerGroup.id;
	}

	resetValues() {
		this.showUsersPreview = false;
		this.selectedPartnerGroupName = "";
		this.selectedPartnerGroupId = 0;
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

	/******XNFR-85**************/
	getSelectedIndex(index:number){
		this.selectedFilterIndex = index;
		this.referenceService.setTeamMemberFilterForPagination(this.pagination,index);
		this.findPartnerCompanies(this.pagination);
	}

	findPartnerCompaniesByFilterIndex(pagination:Pagination){
		this.selectedFilterIndex = 1;
		this.referenceService.setTeamMemberFilterForPagination(pagination,this.selectedFilterIndex);
		this.findPartnerCompanies(pagination);
	}
	

}
