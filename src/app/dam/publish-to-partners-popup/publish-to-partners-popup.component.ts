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
import {AdminAndTeamMemberDto} from "../models/admin-and-team-member-dto";
import {PublishToPartnerCompanyDto} from "../models/publish-to-partner-company-dto";
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
	@Input() companyId: any;
	@Input() assetId: any;
	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	teamMembersLoader: HttpRequestLoader = new HttpRequestLoader();
	sortOption: SortOption = new SortOption();
	sendSuccess = false;
	responseMessage = "";
	responseImage = "";
	responseClass = "event-success";
	@Output() notifyOtherComponent = new EventEmitter();
	damPublishPostDto: DamPublishPostDto = new DamPublishPostDto();
	statusCode: number = 0;
	/*********Expanded List******* */
	isHeaderCheckBoxChecked = false;
	selectedTeamMemberIds:any[] = [];
	teamMembersPagination:Pagination = new Pagination();
	adminsAndTeamMembersErrorMessage: CustomResponse = new CustomResponse();

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
		this.referenceService.scrollToModalBodyTopByClass();
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

	navigateToNextPage(event:any){
		this.pagination.pageIndex = event.page;
		this.findPartnerCompanies(this.pagination);
	}

	partnersSearchOnKeyEvent(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }

	/*************************Sort********************** */
	sortBy(text: any) {
		this.sortOption.selectedDamPartnerDropDownOption = text;
		this.getAllFilteredResults();
	}
	/*************************Search********************** */
	searchPartners() {
		this.getAllFilteredResults();
	}
	getAllFilteredResults() {
		this.customResponse = new CustomResponse();
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.sortOption.searchKey;
		this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedDamPartnerDropDownOption, this.pagination);
		this.findPartnerCompanies(this.pagination);	
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
		this.selectedTeamMemberIds = [];
		this.ngxLoading = false;
	}

	viewTeamMembers(item: any) {
		this.teamMembersPagination = new Pagination();
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
			this.teamMembersPagination.companyId = item.partnerCompanyId;
			this.teamMembersPagination.partnershipId = item.partnershipId;
			this.getTeamMembersAndAdmins(this.teamMembersPagination);
		}
	}

	getTeamMembersAndAdmins(teamMembersPagination:Pagination){
		this.adminsAndTeamMembersErrorMessage = new CustomResponse();
		this.referenceService.loading(this.teamMembersLoader, true);
		this.userService.findAdminsAndTeamMembers(teamMembersPagination).subscribe(
			response=>{
				let data = response.data;
				teamMembersPagination.totalRecords = data.totalRecords;
				teamMembersPagination = this.pagerService.getPagedItems(teamMembersPagination, data.list);
				/*******Header checkbox will be chcked when navigating through page numbers*****/
				let teamMemberIds = teamMembersPagination.pagedItems.map(function(a) { return a.userId; });
				let items = $.grep(this.selectedTeamMemberIds, function(element: any) {
					return $.inArray(element, teamMemberIds) !== -1;
				});
				if (items.length == teamMemberIds.length && teamMemberIds.length>0) {
					this.isHeaderCheckBoxChecked = true;
				} else {
					this.isHeaderCheckBoxChecked = false;
				}
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
		this.teamMembersPagination.pageIndex = event.page;
		this.getTeamMembersAndAdmins(this.teamMembersPagination);
	}

	adminAndTeamMembersKeySearch(keyCode: any) { if (keyCode === 13) { this.searchAdminsAndTeamMembers(); } }

	searchAdminsAndTeamMembers(){
		this.teamMembersPagination.pageIndex = 1;
		this.getTeamMembersAndAdmins(this.teamMembersPagination);
	}

	highlightAdminOrTeamMemberRowOnCheckBoxClick(teamMemberId:number,partnershipId:number, event:any){
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

	checkHeaderCheckBox(partnershipId:number) {
		let trLength = $('#admin-and-team-members-'+partnershipId+' tbody tr').length;
		let selectedRowsLength = $('[name="adminOrTeamMemberCheckBox[]"]:checked').length;
		this.isHeaderCheckBoxChecked = (trLength == selectedRowsLength);
	}

	highlightSelectedAdminOrTeamMemberRowOnRowClick(teamMemberId:number,partnershipId:number, event:any) {
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

	selectAllTeamMembersOfTheCurrentPage(ev: any,partnershipId:number) {
		if (ev.target.checked) {
			$('[name="adminOrTeamMemberCheckBox[]"]').prop('checked', true);
			let self = this;
			$('[name="adminOrTeamMemberCheckBox[]"]:checked').each(function (_index: number) {
				var id = $(this).val();
				self.selectedTeamMemberIds.push(parseInt(id));
				$('#publishToPartners' + id).addClass('row-selected');
			});
			this.selectedTeamMemberIds = this.referenceService.removeDuplicates(this.selectedTeamMemberIds);
		} else {
			$('[name="adminOrTeamMemberCheckBox[]"]').prop('checked', false);
			$('#dam-partnership-list-table tr').removeClass("row-selected");
			this.selectedTeamMemberIds = this.referenceService.removeDuplicates(this.selectedTeamMemberIds);
			let currentPageSelectedIds = this.teamMembersPagination.pagedItems.map(function (a) { return a.userId; });
			this.selectedTeamMemberIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedTeamMemberIds, currentPageSelectedIds);
			
		}
		ev.stopPropagation();
	}

	publish(){
		if(this.selectedTeamMemberIds.length>0){
			this.startLoaders();
			this.damPublishPostDto.damId = this.assetId;
			this.damPublishPostDto.partnerIds = this.selectedTeamMemberIds;
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
