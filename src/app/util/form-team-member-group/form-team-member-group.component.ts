import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ReferenceService } from '../../core/services/reference.service';
import { Properties } from '../../common/models/properties';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { TeamMemberService } from '../../team/services/team-member.service';
import { Form } from '../../forms/models/form';

declare var $: any, swal: any;

@Component({
	selector: 'app-form-team-member-group',
	templateUrl: './form-team-member-group.component.html',
	styleUrls: ['./form-team-member-group.component.css'],
	providers: [TeamMemberService]
})
export class FormTeamMemberGroupComponent implements OnInit {

	ngxLoading = false;
	loggedInUserId: number = 0;
	pagination: Pagination = new Pagination();
	customResponse: CustomResponse = new CustomResponse();
	@Input() selectedTeamMemberIds: any[] = [];
	@Input() selectedGroupIds: any[] = [];
	@Input() formId:number;
	@Output() notifyParentComponent = new EventEmitter();
	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	/******Team Member Varaibles******/
	isHeaderCheckBoxChecked = false;
	teamMembersLoader: HttpRequestLoader = new HttpRequestLoader();
	sortOption: SortOption = new SortOption();
	teamMembersPagination: Pagination = new Pagination();
	teamMembersErrorMessage: CustomResponse = new CustomResponse();
	form: Form = new Form();

	constructor(public xtremandLogger: XtremandLogger, private pagerService: PagerService, public authenticationService: AuthenticationService,
		public referenceService: ReferenceService, public properties: Properties, public utilService: UtilService, public teamMemberService: TeamMemberService) {
		this.loggedInUserId = this.authenticationService.getUserId();
		this.pagination.type = "form";
		this.teamMembersPagination.type = "form";
		this.notifyParentComponent = new EventEmitter<any>();
	}

	ngOnInit() {
		this.findGroups(this.pagination);
	}

	findGroups(pagination: Pagination) {
		this.referenceService.goToTop();
		if (this.formId !== undefined && this.formId > 0) {
			pagination.formId = this.formId;
		}
		this.referenceService.loading(this.httpRequestLoader, true);
		this.teamMemberService.findTeamMemberGroups(pagination).subscribe(
			(response: any) => {
				const data = response.data;
				pagination.totalRecords = data.totalRecords;
				this.sortOption.totalRecords = data.totalRecords;
				$.each(data.list, function (_index: number, list: any) {
					list.displayTime = new Date(list.createdTime);
				});
				pagination = this.pagerService.getPagedItems(pagination, data.list);
				this.referenceService.loading(this.httpRequestLoader, false);
			},
			(error: any) => {
				this.xtremandLogger.error(error);
				this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
				this.referenceService.loading(this.httpRequestLoader, false);
			});
	}

	navigateBetweenPageNumbers(event: any) {
		this.pagination.pageIndex = event.page;
		this.findGroups(this.pagination);
	}

	searchGroups() {
		this.getAllFilteredResults(this.pagination);
	}

	searchGroupsOnKeyPress(keyCode: any) { if (keyCode === 13) { this.searchGroups(); } }

	sortBy(text: any) {
		this.sortOption.selectedTeamMemberGroupSortDropDown = text;
		this.getAllFilteredResults(this.pagination);
	}

	getAllFilteredResults(pagination: Pagination) {
		pagination.searchKey = this.sortOption.searchKey;
		pagination = this.utilService.sortOptionValues(this.sortOption.selectedTeamMemberGroupSortDropDown, pagination);
		this.findGroups(pagination);
	}

	resetFields() {
		this.pagination = new Pagination();
		this.teamMembersPagination = new Pagination();
		this.sortOption = new SortOption();
		this.isHeaderCheckBoxChecked = false;
		this.ngxLoading = false;
	}

	viewTeamMembers(item: any) {
		this.teamMembersPagination = new Pagination();
		this.isHeaderCheckBoxChecked = false;
		this.teamMembersErrorMessage = new CustomResponse();
		this.pagination.pagedItems.forEach((element) => {
			let groupId = element.id;
			let clickedGroupId = item.id;
			if (clickedGroupId != groupId) {
				element.expand = false;
			}
		});
		item.expand = !item.expand;
		if (item.expand) {
			this.referenceService.loading(this.teamMembersLoader, true);
			this.teamMembersPagination.type = "form";
			this.teamMembersPagination.categoryId = item.id;
			this.getTeamMembers(this.teamMembersPagination);
		}
	}



	getTeamMembers(teamMembersPagination: Pagination) {
		this.teamMembersErrorMessage = new CustomResponse();
		this.referenceService.loading(this.teamMembersLoader, true);
		if (this.formId !== undefined && this.formId > 0) {
			teamMembersPagination.formId = this.formId;
		}
		this.authenticationService.findAllTeamMembersByGroupId(teamMembersPagination).subscribe(
			response => {
				let data = response.data;
				teamMembersPagination.totalRecords = data.totalRecords;
				//teamMembersPagination.maxResults = teamMembersPagination.totalRecords;
				teamMembersPagination = this.pagerService.getPagedItems(teamMembersPagination, data.list);
				/*******Header checkbox will be chcked when navigating through page numbers*****/
				let teamMemberIds = teamMembersPagination.pagedItems.map(function (a) { return a.id; });
				let items = [];
				if (this.selectedTeamMemberIds !== undefined) {
					items = $.grep(this.selectedTeamMemberIds, function (element: any) {
						return $.inArray(element, teamMemberIds) !== -1;
					});
				}
				if (items.length == teamMemberIds.length && teamMemberIds.length > 0) {
					this.isHeaderCheckBoxChecked = true;
				} else {
					this.isHeaderCheckBoxChecked = false;
				}
				this.referenceService.loading(this.teamMembersLoader, false);
			}, error => {
				this.xtremandLogger.error(error);
				this.referenceService.loading(this.teamMembersLoader, false);
				this.teamMembersErrorMessage = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
			}
		);
	}

	/************Page************** */
	naviagtePages(event: any) {
		this.teamMembersPagination.pageIndex = event.page;
		this.getTeamMembers(this.teamMembersPagination);
	}

	teamMembersKeySearch(keyCode: any) { if (keyCode === 13) { this.searchTeamMembers(); } }

	searchTeamMembers() {
		this.teamMembersPagination.pageIndex = 1;
		this.getTeamMembers(this.teamMembersPagination);
	}
	/************Partner Company Checkbox related code starts here****************/
	highlightTeamMemberRowOnCheckBoxClick(teamMemberId: number, groupId: number, event: any) {
		let isChecked = $('#' + teamMemberId).is(':checked');
		if (isChecked) {
			$('#team-member-id' + teamMemberId).addClass('row-selected');
			this.selectedTeamMemberIds.push(teamMemberId);
		} else {
			$('#team-member-id' + teamMemberId).removeClass('row-selected');
			this.selectedTeamMemberIds.splice($.inArray(teamMemberId, this.selectedTeamMemberIds), 1);
		}
		this.checkHeaderCheckBox(groupId);
		event.stopPropagation();
		this.notifyParent();
	}

	checkHeaderCheckBox(groupId: number) {
		let trLength = $('#team-member-group-id-' + groupId + ' tbody tr').length;
		let selectedRowsLength = $('[name="teamMemberCheckBox[]"]:checked').length;
		if (selectedRowsLength == 0) {
			this.selectedGroupIds.splice($.inArray(groupId, this.selectedGroupIds), 1);
		} else {
			this.selectedGroupIds.push(groupId);
		}
		this.selectedGroupIds = this.referenceService.removeDuplicates(this.selectedGroupIds);
		this.isHeaderCheckBoxChecked = (trLength == selectedRowsLength);
		this.notifyParent();
	}

	highlightSelectedTeamMemberRowOnRowClick(teamMemberId: number, groupId: number, event: any) {
		let isChecked = $('#' + teamMemberId).is(':checked');
		if (isChecked) {
			$('#' + teamMemberId).prop("checked", false);
			$('#team-member-id-' + teamMemberId).removeClass('row-selected');
			this.selectedTeamMemberIds.splice($.inArray(teamMemberId, this.selectedTeamMemberIds), 1);
		} else {
			$('#' + teamMemberId).prop("checked", true);
			$('#team-member-id-' + teamMemberId).addClass('row-selected');
			this.selectedTeamMemberIds.push(teamMemberId);
		}
		this.checkHeaderCheckBox(groupId);
		event.stopPropagation();
		this.notifyParent();
	}

	selectAllTeamMembersOfTheCurrentPage(ev: any, groupId: number) {
		if (ev.target.checked) {
			$('[name="teamMemberCheckBox[]"]').prop('checked', true);
			let self = this;
			$('[name="teamMemberCheckBox[]"]:checked').each(function (_index: number) {
				var id = $(this).val();
				self.selectedTeamMemberIds.push(parseInt(id));
				$('#team-member-id-' + id).addClass('row-selected');
			});
			this.selectedTeamMemberIds = this.referenceService.removeDuplicates(this.selectedTeamMemberIds);
			this.selectedGroupIds.push(groupId);
			this.selectedGroupIds = this.referenceService.removeDuplicates(this.selectedGroupIds);
		} else {
			$('[name="teamMemberCheckBox[]"]').prop('checked', false);
			$('#team-member-group tr').removeClass("row-selected");
			this.selectedTeamMemberIds = this.referenceService.removeDuplicates(this.selectedTeamMemberIds);
			let currentPageSelectedIds = this.teamMembersPagination.pagedItems.map(function (a) { return a.id; });
			this.selectedTeamMemberIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedTeamMemberIds, currentPageSelectedIds);
			this.selectedGroupIds = this.referenceService.removeDuplicates(this.selectedGroupIds);
			this.selectedGroupIds.splice($.inArray(groupId, this.selectedGroupIds), 1);
		}
		ev.stopPropagation();
		this.notifyParent();
	}

	clearAll() {
		this.selectedTeamMemberIds = [];
		this.selectedGroupIds = [];
		this.isHeaderCheckBoxChecked = false;
		this.notifyParent();
	}

	startLoaders() {
		this.ngxLoading = true;
		this.referenceService.startLoader(this.httpRequestLoader);
	}

	stopLoaders() {
		this.ngxLoading = false;
		this.referenceService.stopLoader(this.httpRequestLoader);
	}

	notifyParent() {
		this.form.selectedGroupIds = this.selectedGroupIds;
		this.form.selectedTeamMemberIds = this.selectedTeamMemberIds;
		this.notifyParentComponent.emit(this.form);
	}

}

