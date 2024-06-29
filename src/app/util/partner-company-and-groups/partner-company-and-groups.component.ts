import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
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
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
import { CustomAnimation } from 'app/core/models/custom-animation';
declare var $: any, swal: any;

@Component({
  selector: 'app-partner-company-and-groups',
  templateUrl: './partner-company-and-groups.component.html',
  styleUrls: ['./partner-company-and-groups.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties, DamService,CallActionSwitch],
  animations: [CustomAnimation]

})
export class PartnerCompanyAndGroupsComponent implements OnInit, AfterViewInit {
 
	ngxLoading = false;
	loggedInUserId: number = 0;
	pagination: Pagination = new Pagination();
	customResponse: CustomResponse = new CustomResponse();
	@Input() inputId:any;
	@Input() moduleName: any;
	@Output() partnerCompanyAndGroupsEventEmitter = new EventEmitter();
	@Input() isPublishedToPartnerGroups:boolean;
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
	@Input()selectedTeamMemberIds: any[] = [];
	teamMembersLoader: HttpRequestLoader = new HttpRequestLoader();
	sortOption: SortOption = new SortOption();
	teamMembersPagination: Pagination = new Pagination();
	adminsAndTeamMembersErrorMessage: CustomResponse = new CustomResponse();
	@Input()selectedPartnershipIds: any[] = [];
	/************Partner Group related variables**********/
	@Input()selectedPartnerGroupIds: any[] = [];
	partnerGroupsPagination: Pagination = new Pagination();
	partnerGroupsSortOption: SortOption = new SortOption();
	isParnterGroupHeaderCheckBoxChecked = false;
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
	/***XNFR-326****/
	@Input() isAssetPublishedEmailNotification = false;
	@Input() vendorJourney:boolean = false;
	@Output() closePopup = new EventEmitter();
	companyAndPartnerMap = new Map<number, number[]>();
	@Input() selectedPartnerIdAndPartnerStatus:any[] = [];
	@Input() selectedPartnerGroupPartnerIdAndPartnerStatus:any[] = [];

	isPartnerCompaniesTabSelected = true;
	isPartnerGroupsTabSelected = false;

	/****XNFR-571****/
	@Input() isDashboardButtonPublishedEmailNotification =false;
	isDamModule = false;
	isDashboardButtonsModule = false;
	isEmailNotSentNotificationDisplayed = false;
	/****XNFR-571****/
	constructor(public partnerService: ParterService, public xtremandLogger: XtremandLogger, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService,
		public referenceService: ReferenceService, public properties: Properties, public landingPageService: LandingPageService,
		 public utilService: UtilService, public userService: UserService,public callActionSwitch:CallActionSwitch) {
		 this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
		this.isDamModule = this.moduleName=="dam";
		this.isDashboardButtonsModule = this.moduleName==this.properties.dashboardButtons;
		if(this.isDamModule){
			this.isEmailNotSentNotificationDisplayed = !this.isAssetPublishedEmailNotification;
		}else if(this.isDashboardButtonsModule){
			this.isEmailNotSentNotificationDisplayed = !this.isDashboardButtonPublishedEmailNotification;
		}
		this.initializeTabs();
	}

	private initializeTabs() {
		if (this.moduleName != undefined && $.trim(this.moduleName).length > 0) {
			this.pagination.partnerTeamMemberGroupFilter = true;
			this.showFilter = true;
			if (this.inputId != undefined && this.inputId > 0) {
				this.selectTabsByGroupIdOrCompanyId();
			} else {
				this.activatePartnerCompaniesTab();
			}
		} else {
			this.referenceService.showSweetAlertErrorMessage("Invalid Request.Please try after sometime");
			this.resetFields();
		}
	}

	private selectTabsByGroupIdOrCompanyId() {
		this.referenceService.startLoader(this.httpRequestLoader);
		let isPartnerCompaniesSelected = this.selectedTeamMemberIds != undefined && this.selectedTeamMemberIds.length > 0;
		if (this.isPublishedToPartnerGroups) {
			this.isPartnerCompaniesTabSelected = false;
			if(isPartnerCompaniesSelected){
				this.activatePartnerCompaniesTab();
			    this.disableOrEnablePartnerListsTab();
			}else{
				this.isEdit = this.selectedPartnerGroupIds != undefined && this.selectedPartnerGroupIds.length > 0;
				this.activatePartnerGroupsTab();
				this.disableOrEnablePartnerCompaniesTab();
			}
		} else {
			this.isEdit = isPartnerCompaniesSelected;
			this.activatePartnerCompaniesTab();
			this.disableOrEnablePartnerListsTab();
		}
	}

	private activatePartnerCompaniesTab() {
		$('#partner-companies-li').addClass('active');
		$('#partnerGroups-li').removeClass('active');
		this.selectedTab = 1;
		this.showFilter = true;
		this.isPartnerCompaniesTabSelected = true;
		this.isPartnerGroupsTabSelected = false;
		this.findPartnerCompanies(this.pagination);
	}

	private activatePartnerGroupsTab() {
		$('#partnerGroups-li').addClass('active');
		$('#partner-companies-li').removeClass('active');
		this.showFilter = false;
		this.selectedTab = 2;
		this.isPartnerGroupsTabSelected = true;
		this.isPartnerCompaniesTabSelected = false;
		this.findPartnerGroups(this.partnerGroupsPagination);
	}

	ngAfterViewInit(){
		//this.initializeTabs();
	}

	findPartnerCompanies(pagination: Pagination) { 
		this.selectedTab = 1;
		this.referenceService.startLoader(this.httpRequestLoader);
		pagination.campaignId = this.inputId;//This is asset id
		pagination.userId = this.loggedInUserId;
		pagination.type = this.moduleName;
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
			if (pagination.searchKey != undefined && pagination.searchKey != null && pagination.searchKey.trim() != "") {
				this.showExpandButton = true;
			} else {
				this.showExpandButton = false;
			}
			pagination = this.utilService.sortOptionValues(sortOption.selectedDamPartnerDropDownOption, pagination);
			this.findPartnerGroups(pagination);
		}
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
		if(!this.vendorJourney){
			this.sendEmitterValues();
		}

	}

	sendEmitterValues(){
		let emitterObject = {};
		emitterObject['partnerIds'] = this.selectedTeamMemberIds;
		emitterObject['partnerGroupIds'] = this.selectedPartnerGroupIds;
		let selectedType = this.selectedTabName();
		emitterObject['partnerGroupSelected'] = ('partnerGroups' == selectedType);
		this.partnerCompanyAndGroupsEventEmitter.emit(emitterObject);
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
	highlightAdminOrTeamMemberRowOnCheckBoxClick(teamMemberId: number, partnershipId: number,companyId: number, event: any) {
		let isChecked = $('#' + teamMemberId).is(':checked');
		if (isChecked) {
			$('#publishToPartners' + teamMemberId).addClass('row-selected');
			this.selectedTeamMemberIds.push(teamMemberId);
			if(this.companyAndPartnerMap.has(companyId)){
				this.companyAndPartnerMap.get(companyId).push(teamMemberId);
			}else{
				this.companyAndPartnerMap.set(companyId,[teamMemberId]);
			}
		} else {
			$('#publishToPartners' + teamMemberId).removeClass('row-selected');
			this.selectedTeamMemberIds.splice($.inArray(teamMemberId, this.selectedTeamMemberIds), 1);
			this.companyAndPartnerMap.get(companyId).splice($.inArray(teamMemberId, this.companyAndPartnerMap.get(companyId)), 1)
			if(this.companyAndPartnerMap.get(companyId).length ==0){
				this.companyAndPartnerMap.delete(companyId);
			}
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

	highlightSelectedAdminOrTeamMemberRowOnRowClick(teamMemberId: number, partnershipId: number,companyId:number, event: any) {
		let isChecked = $('#' + teamMemberId).is(':checked');
		if (isChecked) {
			//Removing Highlighted Row
			$('#' + teamMemberId).prop("checked", false);
			$('#publishToPartners' + teamMemberId).removeClass('row-selected');
			this.selectedTeamMemberIds.splice($.inArray(teamMemberId, this.selectedTeamMemberIds), 1);
			this.companyAndPartnerMap.get(companyId).splice($.inArray(teamMemberId, this.companyAndPartnerMap.get(companyId)), 1)
			if(this.companyAndPartnerMap.get(companyId).length ==0){
				this.companyAndPartnerMap.delete(companyId);
			}
		} else {
			//Highlighting Row
			$('#' + teamMemberId).prop("checked", true);
			$('#publishToPartners' + teamMemberId).addClass('row-selected');
			this.selectedTeamMemberIds.push(teamMemberId);
			if(this.companyAndPartnerMap.has(companyId)){
				this.companyAndPartnerMap.get(companyId).push(teamMemberId);
			}else{
				this.companyAndPartnerMap.set(companyId,[teamMemberId]);
			}
		}
		this.checkHeaderCheckBox(partnershipId);
		this.disableOrEnablePartnerListsTab();
		event.stopPropagation();
	}

	disableOrEnablePartnerListsTab() {
		let isEnableBothTabs = this.moduleName!=this.properties.dashboardButtons;
		if(isEnableBothTabs){
			if (this.selectedTeamMemberIds.length > 0) {
				$('#partnerGroups-li').removeClass('active');
				$('#partnerGroups-li').addClass('cursor-not-allowed');
				$('#partnerGroups-li').css({ 'cursor': 'not-allowed' });
				$('.partnerGroupsC').css({ 'pointer-events': 'none' });
				let tooltipMessage = "You can choose either company / group";
				$('#partnerGroups-li').attr('title', tooltipMessage);
			} else {
				$('#partnerGroups-li').removeClass('cursor-not-allowed');
				$('#partnerGroups-li').css({ 'cursor': 'auto' });
				$('.partnerGroupsC').css({ 'pointer-events': 'auto' });
				$('#partnerGroups-li').attr('title', 'Click to see groups');
			}
		}
		this.sendEmitterValues();
	}

	selectAllTeamMembersOfTheCurrentPage(ev: any, partnershipId: number, companyId:number) {
		if (ev.target.checked) {
			$('[name="adminOrTeamMemberCheckBox[]"]').prop('checked', true);
			let self = this;
			$('[name="adminOrTeamMemberCheckBox[]"]:checked').each(function (_index: number) {
				var id = $(this).val();
				self.selectedTeamMemberIds.push(parseInt(id));
				$('#publishToPartners' + id).addClass('row-selected');
				if(self.companyAndPartnerMap.has(companyId)){
					self.companyAndPartnerMap.get(companyId).push(parseInt(id))
				}else{
					self.companyAndPartnerMap.set(companyId,[parseInt(id)])
				}
			});
			this.selectedTeamMemberIds = this.referenceService.removeDuplicates(this.selectedTeamMemberIds);
			this.selectedPartnershipIds.push(partnershipId);
		} else {
			$('[name="adminOrTeamMemberCheckBox[]"]').prop('checked', false);
			this.selectedTeamMemberIds = this.referenceService.removeDuplicates(this.selectedTeamMemberIds);
			let currentPageSelectedIds = this.teamMembersPagination.pagedItems.map(function (a) { return a.userId; });
			this.selectedTeamMemberIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedTeamMemberIds, currentPageSelectedIds);
			this.selectedPartnershipIds = this.referenceService.removeDuplicates(this.selectedPartnershipIds);
			this.selectedPartnershipIds.splice($.inArray(partnershipId, this.selectedPartnershipIds), 1);
			if(this.companyAndPartnerMap.has(companyId)){
				this.companyAndPartnerMap.delete(companyId);
			}
		}
		this.disableOrEnablePartnerListsTab();
		ev.stopPropagation();
	}
	clearAll() {
		this.clearTabs();
	}

	clearTabs(){
		let selectedTabName = this.selectedTabName();
		if ("partners" == selectedTabName) {
			this.selectedTeamMemberIds = [];
			this.selectedPartnershipIds = [];
			this.isHeaderCheckBoxChecked = false;
			this.companyAndPartnerMap.clear();
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
		return this.selectedTab == 1? "partners": "partnerGroups";
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
		this.selectedTab = 2
		this.customResponse = new CustomResponse();
		this.referenceService.startLoader(this.httpRequestLoader);
		pagination.campaignId = this.inputId;
		pagination.userId = this.loggedInUserId;
		pagination.type = this.moduleName;
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
			if(this.selectedPartnerGroupIds==null){
				this.selectedPartnerGroupIds = [];
			}
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
		let isEnableBothTabs = this.moduleName!=this.properties.dashboardButtons;
		if(isEnableBothTabs){
			if (this.selectedPartnerGroupIds.length > 0) {
				$('#partner-companies-li').addClass('cursor-not-allowed');
				$('#partner-companies-li').css({ 'cursor': 'not-allowed' });
				$('.partnerCompaniesC').css({ 'pointer-events': 'none' });
				let tooltipMessage = "You can choose either company / group";
				$('#partner-companies-li').attr('title', tooltipMessage);
			} else {
				$('#partner-companies-li').removeClass('cursor-not-allowed');
				$('#partner-companies-li').css({ 'cursor': 'auto' });
				$('.partnerCompaniesC').css({ 'pointer-events': 'auto' });
				$('#partner-companies-li').attr('title', 'Click to see companies');
			}
		}
		this.sendEmitterValues();
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
		this.selectedTab = 1;
		this.referenceService.setTeamMemberFilterForPagination(pagination,this.selectedFilterIndex);
		this.findPartnerCompanies(pagination);
	}
	
	publish() {
		this.customResponse = new CustomResponse();
		if (this.selectedTeamMemberIds.length > 0 || this.selectedPartnerGroupIds ) {
			this.setValuesAndPublish();
		} else {
			this.referenceService.goToTop();
			this.customResponse = new CustomResponse('ERROR', 'Please select atleast one row', true);
		}
	}

	setValuesAndPublish(){
		this.startLoaders();
		  let shareLandingPageDTO = {
			  "loggedInUserId": this.loggedInUserId,
			  "partnerIds": this.selectedTeamMemberIds,
			  "userListIds": this.selectedPartnerGroupIds,
			  "vendorJourneyLandingPageId": this.inputId,
			  "companyPartnerIds": null,
			  "partnerGroupSelected": this.selectedPartnerGroupIds != null && this.selectedPartnerGroupIds.length>0
		  }
		  if(this.companyAndPartnerMap != undefined && this.companyAndPartnerMap!= null && this.companyAndPartnerMap.size > 0 ){
			let obj = Array.from(this.companyAndPartnerMap).reduce((obj, [key, value]) => {
				obj[key] = value;
				return obj;
			  }, {});
			shareLandingPageDTO['companyPartnerIds'] = obj;
		  }
	  	this.shareLandingPageToPartners(shareLandingPageDTO);
		}

		shareLandingPageToPartners(shareLandingPageDTO : any){
			this.landingPageService.shareVendorJourneyLandingPageToPartners(shareLandingPageDTO).subscribe((data: any) => {
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

		closePopupEmit() {
			this.closePopup.emit();
			this.resetFields();
		}

		getUserStatus(userId: number) {
			 let status = "N/A";
			if (this.selectedPartnerIdAndPartnerStatus.some(e => e.partnerId ===  userId)) {
				status = this.selectedPartnerIdAndPartnerStatus.filter(e => e.partnerId === userId)[0].status;
			} 
			return status;
		}
 
	
}
