import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { FileUtil } from '../../core/models/file-util';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TeamMember } from '../models/team-member';
import { Status } from '../models/status.enum';
import { TeamMemberUi } from '../models/team-member-ui';
import { TeamMemberService } from '../services/team-member.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { CustomResponse } from '../../common/models/custom-response';
import { UserService } from "app/core/services/user.service";
import { UtilService } from '../../core/services/util.service';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';
import { Properties } from '../../common/models/properties';

declare var $, swal: any;
@Component({
	selector: 'app-manage-team-members',
	templateUrl: './manage-team-members.component.html',
	styleUrls: ['./manage-team-members.component.css'],
	providers: [Pagination, HttpRequestLoader, FileUtil, CallActionSwitch,Properties]
})
export class ManageTeamMembersComponent implements OnInit {

	public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	public teamMemberModulesLoader:HttpRequestLoader = new HttpRequestLoader();
	uiError: string;
	teamMemberModules: Array<any>;
	teamMembers: Array<any>;
	newlyAddedTeamMembers: Array<any> =  new Array<any>();
	teamMemberUi: TeamMemberUi;
	isLoggedInAsTeamMember: boolean;
	loggedInUserId:number = 0;
	loginAsTeamMemberAccess: any;
	superiorRole:string = "";
	isOrgAdmin = false;
	moduleNames:Array<string>;

	videoAccess = false;
	campaignAccess = false;
	designAccess = false;
	socialShareAccess = false;
	statsAccess = false;
	partnersAccess = false;
	contactsAccess = false;
	selectedId: number = 0;
	deletePopupLoader = false;
	isOnlyPartner = false;
	items2: any[] = [];
	emailIds: any[] = [];
	teamMemberIdToDelete: number = 0;
	selectedTeamMemberEmailId: string = "";
	allEmailIds: string[] = [];
	loading = false;
	selectedItem: any = '';
	inputChanged: any = '';
	isUploadCsv: boolean;
	isAddTeamMember: boolean;
	team: TeamMember;
	@ViewChild('fileImportInput')
	fileImportInput: any;
	csvRecords = [];
	/*****Form Related**************/
	formGroupClass: string = "form-group";
	emaillIdDivClass: string = this.formGroupClass;
	errorClass: string = "form-group has-error has-feedback";
	successClass: string = "form-group has-success has-feedback";
	defaultClass: string = "form-group";
	addTeamMemeberTableId = "add-team-member-table";
	listTeamMemberTableId = "list-team-member-table";
	customResponse: CustomResponse = new CustomResponse();
	name = 'Angular 5';
	successMessage: string;
	csvFilePath = "";
	csvErrors: string[] = [];
	addTeamMemberLoader: boolean;
	errorMessage: string;
	isLoggedInThroughVanityUrl = false;
	constructor(public logger: XtremandLogger, public referenceService: ReferenceService, private teamMemberService: TeamMemberService,
		public authenticationService: AuthenticationService, private pagerService: PagerService, public pagination: Pagination,
		private fileUtil: FileUtil, public callActionSwitch: CallActionSwitch, public userService: UserService, private router: Router,
		 public utilService: UtilService,private vanityUrlService:VanityURLService,public properties: Properties) {
		this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
		this.team = new TeamMember();
		this.loggedInUserId = this.authenticationService.getUserId();
		this.isLoggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();
		this.teamMemberUi = new TeamMemberUi();
	}

	ngOnInit() {
		this.listTeamMemberModules();
	}

	listTeamMemberModules() {
		try {
			this.referenceService.loading(this.httpRequestLoader, true);
			let input = {};
			input['userId'] = this.authenticationService.getUserId();
			this.teamMemberService.listTeamMemberModules(input)
				.subscribe(
					data => {
						let response = data.data;
						if (data.statusCode == 200) {
							this.teamMemberModules = response.modules;
							this.moduleNames = this.teamMemberModules.map(function (a) { return a.moduleName; });
							this.videoAccess = this.moduleNames.indexOf('Video')>-1;
							this.campaignAccess = this.moduleNames.indexOf('Campaign')>-1;
							this.designAccess = this.moduleNames.indexOf('Design')>-1;
							this.socialShareAccess = this.moduleNames.indexOf('Social Share')>-1;
							this.statsAccess = this.moduleNames.indexOf('Stats')>-1;
							this.partnersAccess = this.moduleNames.indexOf('Partners')>-1;
							this.contactsAccess = this.moduleNames.indexOf('Contacts')>-1;
							this.superiorRole = response.superiorRole;
							this.isOrgAdmin = this.superiorRole =="Org Admin" || this.superiorRole =="Org Admin & Partner";
							this.isOnlyPartner = this.superiorRole == "Partner";
							this.csvFilePath = response.csvFilePath;
						} else {
							this.showUIError("Please pass the userId as input");
						}
					},
					error => {
						this.logger.errorPage(error);
					},
					() =>{
						this.listAllTeamMembers(this.pagination);
					} 
				);
		} catch (error) {
			this.showUIError(error);
			this.referenceService.loading(this.httpRequestLoader, false);
		}
	}


	listAllTeamMembers(pagination: Pagination) {
		try {
			this.referenceService.loading(this.httpRequestLoader, true);
			this.teamMemberModulesLoader.isHorizontalCss = true;
			pagination.userId =this.loggedInUserId;
			this.teamMemberUi = new TeamMemberUi();
			this.teamMemberService.listTeamMembers(pagination)
				.subscribe(
					data => {
						let response = data.data;
						this.loginAsTeamMemberAccess = response.loginAsTeamMemberModuleAccess;
						this.teamMembers = response.teamMembers;
						pagination.totalRecords = response.totalRecords;
						pagination = this.pagerService.getPagedItems(pagination, this.teamMembers);
						this.referenceService.loading(this.httpRequestLoader, false);
					},
					error => {
						this.logger.errorPage(error);
					},
					() => this.logger.info("Finished listAllTeamMembers()")
				);
		} catch (error) {
			this.showUIError(error);
			this.referenceService.loading(this.httpRequestLoader, false);
		}
	}


	showUIError(error) {
		this.uiError = 'Oops! Something went wrong';
		this.logger.error(error);
	}


	refreshList(){
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = "";
		this.listAllTeamMembers(this.pagination);
	}

	addAllAuthorities(e, team: TeamMember, tableId: string, index: number) {
		try {
			var table = $(e.target).closest('tr');
			$('td input:checkbox', table).prop('checked', e.target.checked);
			if (e.target.checked) {
				this.setAllRoles(team);
			} else {
				this.removeAllRoles(team);
			}
		} catch (error) {
			this.showUIError(error);
		}

	}

	setAllRoles(team: TeamMember) {
		    team.video = this.videoAccess;
			team.emailTemplate = this.designAccess;
			team.form = this.designAccess;
			team.landingPage = this.designAccess;
			team.design = this.designAccess;			
			team.stats = this.statsAccess;
			team.socialShare = this.socialShareAccess;
			team.partners = this.partnersAccess;
			team.contact = this.contactsAccess;
			team.campaign = this.campaignAccess;
	}
	removeAllRoles(team: TeamMember) {
		team.video = false;
		team.campaign = false;
		team.emailTemplate = false;
		team.landingPage = false;
		team.form = false;
		team.design = false;
		team.stats = false;
		team.contact = false;
		team.socialShare = false;
		team.partners = false;
		team.secondOrgAdmin = false;
	}

	countCheckedCheckBoxesLength(team: TeamMember, index: number, tableId: string) {
		try {
			let length = $('#' + tableId + ' .module-checkbox-' + index + ':checked').length;
			if(this.moduleNames.length>3){
				/**********Vendor/Org Admin Team Members******/
				let allSelected = (this.contactsAccess && length == 7) || (!this.contactsAccess && length == 6);
				if(allSelected){
					team.all = true;
					this.setAllRoles(team);
				}else {
					team.all =  false;
					team.secondOrgAdmin = false;
					if(length==0){
						this.removeAllRoles(team);
					}
				}

			}else{
			/**********Partner Team Members******/
			if(length==0){
				team.all = false;
				this.removeAllRoles(team);
			}else if(length==2){
				team.all = true;
				this.setAllRoles(team);
			}else{
				team.all = false;
			}
			
			}
		} catch (error) {
			this.showUIError(error);
		}
	}

	changeOrgAdminStatus(event: any, index: number, team: TeamMember) {
		$('#empty-roles-div').hide();
		if (event) {
			this.enableAsOrgAdmin(event, index, team);
		} else {
			this.disableAsAnOrgAdmin(event, index, team);
		}
	}

	disableAsAnOrgAdmin(event: any, index: number, team: TeamMember) {
		team.secondOrgAdmin = false;
	}

	enableAsOrgAdmin(event: any, index: number, team: TeamMember) {
		this.setAllRoles(team);
		team.all = true;
		team.secondOrgAdmin = event;
	}

	changeTeamMemberStatus(teamMember: TeamMember, event: any) {
		if (event) {
			teamMember.status = Status.APPROVE;
			teamMember.enabled = event;
		} else {
			teamMember.status = Status.DECLINE;
			teamMember.enabled = event;
			teamMember.secondOrgAdmin = false;
		}
	}



	setDropDownData(data: any) {
		let self = this;
		self.items2 = [];
		$.each(data, function (index, value) {
			let emailId = data[index].emailId;
			let id = data[index].id;
			let obj = { 'id': id, 'emailId': emailId };
			self.items2.push(obj);
		});
	}




	goToCampaignAnalytics(teamMemberId: number) {
		this.loading = true;
		this.router.navigate(['/home/campaigns/manage/tm/' + teamMemberId])
	}

	/**************Search TeamMembers***************/
	searchTeamMembers() {
		this.pagination.pageIndex = 1;
		this.listAllTeamMembers(this.pagination);
	}
/**************Pagination TeamMembers***************/
	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.listAllTeamMembers(this.pagination);
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.searchTeamMembers(); } }




	/*************************Delete Team Member************** */
	showPopup(teamMember: TeamMember) {
		if(!this.isLoggedInAsTeamMember){
			this.selectedId = 0;
			this.deletePopupLoader = true;
			$('#delete-team-member-popup').modal('show');
			this.teamMemberService.listEmailIdsForTransferData(this.loggedInUserId, this.isOnlyPartner)
				.subscribe(
					data => {
						this.setDropDownData(data);
						this.emailIds = this.items2.filter((item) => item.id !== teamMember.teamMemberId);
						this.teamMemberIdToDelete = teamMember.teamMemberId;
						this.selectedTeamMemberEmailId = teamMember.emailId;
						this.deletePopupLoader = false;
					},
					error => {
						$('#delete-team-member-popup').modal('hide');
						this.referenceService.showSweetAlertErrorMessage('Something went wrong.Please try after sometime');
	
					},
					() => this.logger.log("showPopup() done")
				);
		}
		
	}

	delete() {
		this.deletePopupLoader = true;
		let teamMember: TeamMember = new TeamMember();
		teamMember.teamMemberId = this.teamMemberIdToDelete;
		teamMember.orgAdminId = this.selectedId;
		this.teamMemberService.delete(teamMember)
			.subscribe(
				data => {
					this.deletePopupLoader = false;
					$('#delete-team-member-popup').modal('hide');
					this.referenceService.goToTop();
					this.successMessage = this.selectedTeamMemberEmailId + " deleted successfully.";
					this.customResponse = new CustomResponse('SUCCESS', this.successMessage, true);
					this.pagination.pageIndex = this.pagination.pageIndex - 1;
					this.teamMemberIdToDelete = 0;
					this.selectedTeamMemberEmailId = "";
					this.listAllTeamMembers(this.pagination);
					this.clearRows();
				},
				error => { 
					this.deletePopupLoader = false;
					this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true); 
				},
				() => this.logger.log("Team member deleted successfully.")
			);
	}

	hidePopup() {
		this.selectedItem = "";
		this.inputChanged = "";
		$('input').val('');
		$('#delete-team-member-popup').modal('hide');
	}


	clearRows() {
		try {
			$('#add-team-member-table tbody').remove();
			this.newlyAddedTeamMembers = [];
			this.team = new TeamMember();
			this.emaillIdDivClass = this.defaultClass;
			$(".col-md-12 span").text('');
			this.teamMemberUi = new TeamMemberUi();
			this.isUploadCsv = false;
			this.isAddTeamMember = false;
			//this.customResponse = new CustomResponse();
		} catch (error) {
			this.showUIError(error);
		}

	}

	/******************Update Team Member********************** */
	updateTeamMember(teamMember:TeamMember,index:number){
		if(!this.isLoggedInAsTeamMember){
			$('.list-team-member-class').css("background-color", "#fff");
			this.customResponse = new CustomResponse();
			this.referenceService.goToTop();
			this.loading = true;
			this.teamMemberService.updateTeamMember(teamMember)
				.subscribe(
					data => {
						this.referenceService.goToTop();
						this.loading = false;
						if(data.statusCode==200){
							this.customResponse = new CustomResponse('SUCCESS',data.message,true);
							this.pagination = new Pagination();
							this.listAllTeamMembers(this.pagination);
						}else{
							this.customResponse = new CustomResponse('ERROR',data.message,true);
							$('#list-team-member-'+index).css("background-color", "#ec6262");
						}
					},
					error => { 	
						this.loading = false;
						this.referenceService.goToTop();				
						this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true); 
					},
					() => this.logger.log("Team member updated successfully.")
				);
		}
		
	}

	downloadEmptyCsv(){
		window.location.href = this.csvFilePath;
	}

	/*******************Add Team Member************ */
	showAddTeamMember() {
		$("#csv-error-div").hide();
		$('#addTeamMember').modal('show');

	}

	validateEmailId(emailId: string) {
		try {
			if ($.trim(emailId).length > 0) {
				this.teamMemberUi.validEmailId = this.referenceService.validateEmailId(emailId);
				if (!this.teamMemberUi.validEmailId) {
					this.showErrorMessage("Please enter a valid email address");
				}else{
					this.hideErrorMessage();
				}
			} else {
				this.teamMemberUi.errorMessage = '';
				$(".col-md-12 span").text('');
				this.removeErrorClass();
			}

		} catch (error) {
			this.showUIError(error);
		}
	}

	addErrorClass() {
		return this.emaillIdDivClass = this.errorClass;
	}
	removeErrorClass() {
		return this.emaillIdDivClass = this.successClass;
	}

	showErrorMessage(message: string) {
		this.teamMemberUi.isValidForm = false;
		this.teamMemberUi.errorMessage = message;
		this.addErrorClass();
	}
	hideErrorMessage() {
		this.teamMemberUi.isValidForm = true;
		this.teamMemberUi.errorMessage = '';
		$(".col-md-12 span").text('');
		this.removeErrorClass();
	}

	clearForm() {
		this.emaillIdDivClass = this.defaultClass;
		this.isAddTeamMember = false;
		this.teamMemberUi.isValidForm = false;
		this.teamMemberUi.errorMessage = "";
		this.closePopup();
	}
	closePopup() {
		$('#addTeamMember').modal('hide');
		$('#add-team-member-form')[0].reset();
	}

	addTeamMember() {
		try {
			let addedEmailIds = this.newlyAddedTeamMembers.map(function (a) { return a.emailId; });
			if(addedEmailIds.indexOf(this.team.emailId)>-1){
				this.showErrorMessage("Duplicate email address");
			}else{
			this.addTeamMemberLoader = true;
			this.teamMemberService.validateTeamMemberEmailIds(this.team)
			.subscribe(
				data => {
					this.addTeamMemberLoader = false;
					if(data.statusCode==200){
						this.hideErrorMessage();
						this.teamMemberUi.emptyTable = false;
						this.newlyAddedTeamMembers.push(this.team);
						this.team = new TeamMember();
						this.teamMemberUi.validEmailId = false;
						this.emaillIdDivClass = this.defaultClass;
						this.teamMemberUi.isValidForm = false;
						this.closePopup();
					}else{
						this.showErrorMessage(data.message);
					}
				},
				error => { 	
					this.addTeamMemberLoader = false;
					this.showErrorMessage(this.properties.serverErrorMessage);			
				},
				() => this.logger.log("Team member validated successfully.")
			);

				
			}
			
		} catch (error) {
			this.showUIError(error);
		}

	}

	deleteRow(index: number, emailId: string) {
		try {
			$('#team-member-' + index).remove();
			emailId = emailId.toLowerCase();
			this.newlyAddedTeamMembers = this.spliceArray(this.newlyAddedTeamMembers, emailId);
			let tableRows = $("#add-team-member-table > tbody > tr").length;
			if (tableRows == 0 || this.newlyAddedTeamMembers.length == 0) {
				this.clearRows();
			}
		} catch (error) {
			this.showUIError(error);
		}

	}

	spliceArray(arr: any, emailId: string) {
		arr = $.grep(arr, function (data, index) {
			return data.emailId != emailId
		});
		return arr;
	}

	save(){
		this.loading = true;
		$('.add-tm-tr').css("background-color", "#fff");
		this.customResponse = new CustomResponse();
		this.teamMemberService.saveTeamMembers(this.newlyAddedTeamMembers)
			.subscribe(
				data => {
					this.loading = false;
					if(data.statusCode==200){
						this.customResponse = new CustomResponse('SUCCESS', data.message, true);
						this.refreshList();
						this.isUploadCsv = false;
				        this.isAddTeamMember = false;
					}else if(data.statusCode==413){
						let duplicateEmailIds = "";
                        $.each(data.data, function (index:number, value:string) {
                            duplicateEmailIds += (index + 1) + "." + value + "<br><br>";
                        });
                        let message =  data.message+" <br><br>" + duplicateEmailIds;
                        this.customResponse = new CustomResponse('ERROR', message, true);
					}else if(data.statusCode==400){
						$.each(data.data,function(_index:number,value){
							$('#team-member-'+value).css("background-color", "#ec6262");
						});
						this.customResponse = new CustomResponse('ERROR', data.message, true);
					}else if(data.statusCode==3008){
						this.customResponse = new CustomResponse('ERROR', data.message, true);
					}
				},
				error => { 	
					this.loading = false;
					this.showErrorMessage(this.properties.serverErrorMessage);			
				},
				() => this.logger.log("Team member saved successfully.")
			);
	}


	/*********************Upload Csv Functionality*****************************/
	fileChangeListener($event): void {
		this.hideErrorMessageDiv();
		this.csvErrors = [];
		var text = [];
		var files = $event.srcElement.files;
		if (this.fileUtil.isCSVFile(files[0])) {
			$("#empty-roles-div").hide();
			$("#csv-error-div").hide();
			var input = $event.target;
			var reader = new FileReader();
			reader.readAsText(input.files[0]);
			reader.onload = (data) => {
				this.isUploadCsv = true;
				let csvData = reader.result;
				let csvRecordsArray = csvData.split(/\r\n|\n/);
				let headersRow = this.fileUtil
					.getHeaderArray(csvRecordsArray);
				let headers = headersRow[0].split(',');

				let partnerCsvHeadersMatched = this.superiorRole=='Partner' && headers.length==4;
				let vendorCsvHeadersMatched = this.superiorRole== "Vendor" && headers.length==8;
				let vendorAndPartnerOrOrgAdminCsvHeadersMatched = ((this.superiorRole=="Org Admin & Partner" || this.superiorRole=="Vendor & Partner" ||this.superiorRole=="Org Admin") &&  headers.length==9);
				if(partnerCsvHeadersMatched || vendorCsvHeadersMatched || vendorAndPartnerOrOrgAdminCsvHeadersMatched){
					if (this.validateHeaders(headers)) {
						this.readCsvData(csvRecordsArray, headersRow.length);
					} else {
						this.showCsvFileError('Invalid CSV');
					}
				}else{
					this.showCsvFileError('Invalid CSV');
				}
				
			}
			let self = this;
			reader.onerror = function () {
				self.showErrorMessageDiv('Unable to read the file');
				self.isUploadCsv = false;
				self.isAddTeamMember = false;
			};

		} else {
			this.showErrorMessageDiv('Please Import csv file only');
			this.fileReset();
		}
	};

	validateHeaders(headers:any){
        if(this.superiorRole=="Partner"){
	        return (headers[0] == "EMAIL_ID" && headers[1] == "ALL" &&  headers[2] == "CAMPAIGN" && headers[3] == "CONTACTS");
		 }else if(this.superiorRole=="Vendor"){
			return (headers[0] == "EMAIL_ID" && headers[1] == "ALL" && headers[2] == "VIDEO" && headers[3] == "CAMPAIGN" && headers[4] == "DESIGN" && headers[5] == "SOCIAL SHARE" && headers[6] == "STATS" && headers[7] == "PARTNERS");
         }else if((this.superiorRole=="Org Admin & Partner" || this.superiorRole=="Vendor & Partner" ||this.superiorRole=="Org Admin")){
			return (headers[0] == "EMAIL_ID" && headers[1] == "ALL" && headers[2] == "VIDEO" && headers[3] == "CAMPAIGN" && headers[4] == "DESIGN" && headers[5] == "SOCIAL SHARE" && headers[6] == "STATS" && headers[7] == "PARTNERS" && headers[8] == "CONTACTS");
		 }
	}

	readCsvData(csvRecordsArray, rowLength) {
		this.csvRecords = this.fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, rowLength);
		if (this.csvRecords.length > 1) {
			this.processCSVData();
		} else {
			this.showCsvFileError('You Cannot Upload Empty File');
		}
	}

	
	processCSVData() {
		this.validateCsvData();
		if (this.csvErrors.length > 0) {
			$("#csv-error-div").show();
			this.fileReset();
			this.isUploadCsv = false;
			this.isAddTeamMember = false;
		} else {
			this.appendCsvDataToTable();
			this.fileReset();
		}
	}

	validateCsvData() {
		let names = this.csvRecords.map(function (a) { return a[0].split(',')[0] });
		let duplicateEmailIds = this.referenceService.returnDuplicates(names);
		this.newlyAddedTeamMembers = [];
		if (duplicateEmailIds.length == 0) {
			for (var i = 1; i < this.csvRecords.length; i++) {
				let rows = this.csvRecords[i];
				let row = rows[0].split(',');
				let emailId = row[0];
				this.emaillIdDivClass = this.defaultClass;
				if (!this.referenceService.validateEmailId(emailId)) {
					this.csvErrors.push(emailId + " is invalid email address.");
				} 
			}
		} else {
			for (let d = 0; d < duplicateEmailIds.length; d++) {
				this.csvErrors.push(duplicateEmailIds[d] + " is duplicate email address.");
				this.isUploadCsv = false;
				this.isAddTeamMember = false;
			}

		}
	}
	

	appendCsvDataToTable() {
		for (var i = 1; i < this.csvRecords.length; i++) {
			let rows = this.csvRecords[i];
			let row = rows[0].split(',');
			this.teamMemberUi.emptyTable = false;
			let teamMember = new TeamMember();
			teamMember.emailId = row[0];
			teamMember.all = this.setDefaultValue(row[1]);
			if (teamMember.all) {
				this.setAllRoles(teamMember);
			} else {
				if (this.isOnlyPartner) {
					teamMember.campaign = this.setDefaultValue(row[2]);
					teamMember.contact = this.setDefaultValue(row[3]);
				} else {
					teamMember.video = this.setDefaultValue(row[2]);
					teamMember.campaign = this.setDefaultValue(row[3]);
					teamMember.design = this.setDefaultValue(row[4]);
					teamMember.socialShare = this.setDefaultValue(row[5]);
					teamMember.stats = this.setDefaultValue(row[6]);
					teamMember.partners = this.setDefaultValue(row[7]);
					if (this.contactsAccess) {
						teamMember.contact = this.setDefaultValue(row[8]);
					}
				}
			}
			this.newlyAddedTeamMembers.push(teamMember);
		}
	}

	setDefaultValue(value: any) {
		return value == 1;
	}
	
	showErrorMessageDiv(message: string) {
		this.errorMessage = message;
		this.customResponse = new CustomResponse('ERROR', this.errorMessage, true);
	}

	hideErrorMessageDiv() {
		this.errorMessage = "";
		this.customResponse = new CustomResponse('ERROR', this.errorMessage, false);
	}

	showCsvFileError(message: string) {
		this.showErrorMessageDiv(message);
		this.fileReset();
		this.isUploadCsv = false;
		this.isAddTeamMember = false;
	}
	fileReset() {
		this.fileImportInput.nativeElement.value = "";
		this.csvRecords = [];
	}

	loginAs(teamMember: TeamMember) {
		this.loginAsTeamMember(teamMember.emailId, false);

	}

	loginAsTeamMember(emailId: string, isLoggedInAsAdmin: boolean) {
		this.loading = true;
		if(this.authenticationService.vanityURLEnabled){
			this.referenceService.showSweetAlertErrorMessage('Work in progress');
		}else{
			this.getUserData(emailId,isLoggedInAsAdmin);
		}
	}

	getUserData(emailId:string,isLoggedInAsAdmin:boolean){
		this.authenticationService.getUserByUserName(emailId)
			.subscribe(
				response => {
					if (isLoggedInAsAdmin) {
						localStorage.removeItem('adminId');
						localStorage.removeItem('adminEmailId');
						this.isLoggedInAsTeamMember = false;
					} else {
						let adminId = JSON.parse(localStorage.getItem('adminId'));
						if (adminId == null) {
							localStorage.adminId = JSON.stringify(this.loggedInUserId);
							localStorage.adminEmailId = JSON.stringify(this.authenticationService.user.emailId);
						}
					}
					this.utilService.setUserInfoIntoLocalStorage(emailId, response);

					if(this.authenticationService.vanityURLEnabled){						
						  let currentUser = localStorage.getItem('currentUser');
						  if(currentUser && this.authenticationService.vanityURLUserRoles){
							const parsedObject = JSON.parse(currentUser);
							parsedObject.roles = this.authenticationService.vanityURLUserRoles;
							localStorage.setItem("currentUser", JSON.stringify(parsedObject));
						  }
					}

					let self = this;
					setTimeout(function () {
						self.router.navigate(['home/dashboard/'])
							.then(() => {
								window.location.reload();
							})
					}, 500);
				},
				(error: any) => {
					this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
					this.loading = false;
				},
				() => this.logger.info('Finished getRolesByTeamMemberId()')
			);
	}

	getVanityRolesByEmailId(emailId:string){

	}

	logoutAsTeamMember() {
		let adminEmailId = JSON.parse(localStorage.getItem('adminEmailId'));
		this.loginAsTeamMember(adminEmailId, true);
	}



}
