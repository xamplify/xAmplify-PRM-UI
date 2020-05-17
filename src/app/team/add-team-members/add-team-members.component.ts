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
declare var $, swal: any;

@Component({
	selector: 'app-table-editable',
	templateUrl: './add-team-members.component.html',
	styleUrls: ['./add-team-members.component.css'],
	providers: [Pagination, HttpRequestLoader, FileUtil, CallActionSwitch]
})
export class AddTeamMembersComponent implements OnInit {
	loading: boolean = false;
	successMessage: string = "";
	isAddTeamMember: boolean = false;
	isUploadCsv: boolean = false;
	errorMessage: string = "";
	deleteText: string = "This will remove team member";
	deleteMessage: string = "";
	orgAdminEmailIds: string[] = [];
	partnerEmailIds: string[] = [];
	existingEmailIds: string[] = [];
	disabledEmailIds: string[] = [];
	teamMemberUi: TeamMemberUi;
	team: TeamMember;
	teamMembers: Array<TeamMember> = new Array<TeamMember>();
	teamMembersList: Array<TeamMember> = new Array<TeamMember>();
	@ViewChild('fileImportInput')
	fileImportInput: any;
	csvRecords = [];
	/**********Pagination&Loading***********/
	userId: number;
	secondOrgAdminId: number = 0;
	public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	/*****Form Related**************/
	formGroupClass: string = "form-group";
	emaillIdDivClass: string = this.formGroupClass;
	errorClass: string = "form-group has-error has-feedback";
	successClass: string = "form-group has-success has-feedback";
	defaultClass: string = "form-group";
	uiError: string = "";
	addTeamMemeberTableId = "add-team-member-table";
	listTeamMemberTableId = "list-team-member-table";
	customResponse: CustomResponse = new CustomResponse();
	name = 'Angular 5';
	selectedItem: any = '';
	inputChanged: any = '';
	items2: any[] = [];
	emailIds: any[] = [];
	config2: any = { 'placeholder': 'type here', 'sourceField': ['emailId'] };
	teamMemberIdToDelete: number = 0;
	selectedTeamMemberEmailId: string = "";
	allEmailIds: string[] = [];
	selectedId: number = 0;
	contactAccess: boolean = false;
	isOnlyPartner: boolean = false;
	ngxLoading: boolean;
	isLoggedInAsTeamMember = false;
	hasAccessToUpdate = false;
	isOrgAdmin: boolean;
	deletePopupLoader = false;
	addModalPopUpLoader = false;
	loginAsTeamMemberAccess: false;
	isOnlyPartnerOrPartnerTeamMember = false;
	/**********Constructor**********/
	constructor(public logger: XtremandLogger, public referenceService: ReferenceService, private teamMemberService: TeamMemberService,
		public authenticationService: AuthenticationService, private pagerService: PagerService, public pagination: Pagination,
		private fileUtil: FileUtil, public callActionSwitch: CallActionSwitch, public userService: UserService, private router: Router, public utilService: UtilService) {
		this.team = new TeamMember();
		this.userId = this.authenticationService.getUserId();
		this.isOnlyPartner = this.authenticationService.isOnlyPartner();
		this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
		this.isOrgAdmin = this.authenticationService.isOrgAdmin();
		if (this.isLoggedInAsTeamMember) {
			if (this.isOrgAdmin || this.authenticationService.isVendorPartner() || this.authenticationService.isVendor()) {
				this.hasAccessToUpdate = true;
			} else {
				this.hasAccessToUpdate = false;
			}
		} else {
			this.hasAccessToUpdate = true;
		}
	}

	downloadEmptyCsv() {
		if (this.contactAccess && !this.isOnlyPartner) {
			window.location.href = this.authenticationService.MEDIA_URL + "team-member-list.csv";
		} else if (this.isOnlyPartner) {
			window.location.href = this.authenticationService.MEDIA_URL + "team-member-partner.csv";
		} else {
			window.location.href = this.authenticationService.MEDIA_URL + "team-member-vendor.csv";
		}

	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.searchTeamMembers(); } }

	/**********On Init()**********/
	ngOnInit() {
		try {
			this.logger.debug("Add Team Component ngOnInit() Loaded");
			this.listTeamMembers(this.pagination);
			this.listAllEmailIds();
			this.hasContactAccess();
		}
		catch (error) {
			this.showUIError(error);
		}
	}

	listDropDown() {
		this.items2 = [];
		if (!this.isOnlyPartner) {
			this.listAllOrgAdminsAndSupervisors();
		} else {
			this.listPartnerAndTeamMembers();
		}
	}

	hasContactAccess() {
		let isOrgAdmin = this.authenticationService.isOrgAdmin();
		let isVendorAndPartner = this.authenticationService.isVendorPartner();
		this.userService.getRoles(this.authenticationService.getUserId())
			.subscribe(
				response => {
					if (response.statusCode == 200) {
						this.authenticationService.loggedInUserRole = response.data.role;
						this.authenticationService.isPartnerTeamMember = response.data.partnerTeamMember;
						this.isOnlyPartner = this.authenticationService.loggedInUserRole == "Partner" && this.authenticationService.isPartnerTeamMember == false;
						this.authenticationService.hasOnlyPartnerRole = this.isOnlyPartner;
						this.contactAccess = isOrgAdmin || (isVendorAndPartner) || this.isOnlyPartner;
						this.isOnlyPartnerOrPartnerTeamMember = this.isOnlyPartner || this.authenticationService.isPartnerTeamMember;
					} else {
						this.authenticationService.loggedInUserRole = 'User';
					}
				},
				error => this.logger.errorPage(error),
				() => this.logger.log('Finished')
			);
	}


	/************List Members*****************/
	listTeamMembers(pagination: Pagination) {
		try {
			this.referenceService.loading(this.httpRequestLoader, true);
			this.httpRequestLoader.isHorizontalCss = true;
			this.teamMemberUi = new TeamMemberUi();
			this.clearRows();
			this.teamMemberService.list(pagination, this.userId)
				.subscribe(
					data => {
						this.teamMembersList = data.teamMembers;
						this.secondOrgAdminId = data.secondOrgAdminId;
						this.loginAsTeamMemberAccess = data.loginAsTeamMemberAccess;
						pagination.totalRecords = data.totalRecords;
						pagination = this.pagerService.getPagedItems(pagination, this.teamMembersList);
						this.referenceService.loading(this.httpRequestLoader, false);
					},
					error => {
						this.logger.errorPage(error);
					},
					() => this.logger.info("Finished listTeamMembers()")
				);
		} catch (error) {
			this.showUIError(error);
		}

	}

	/**************Search TeamMembers***************/
	searchTeamMembers() {
		this.pagination.pageIndex = 1;
		this.listTeamMembers(this.pagination);
	}

	/***********List TeamMember EmailIds****************/
	listEmailIds() {
		this.teamMemberService.listTeamMemberEmailIds()
			.subscribe(
				data => {
					this.existingEmailIds = data;
				},
				error => {
					this.logger.errorPage(error);
				},
				() => this.logger.info("Finished listEmailIds()")
			);
	}
	/***********Disabled TeamMember EmailIds****************/
	listDisabledEmailIds() {
		this.teamMemberService.listDisabledTeamMemberEmailIds()
			.subscribe(
				data => {
					this.listDisabledEmailIds = data;
				},
				error => {
					this.logger.errorPage(error);
				},
				() => this.logger.info("Finished listDisabledEmailIds()")
			);
	}

	listAllOrgAdminsEmailIds() {
		this.teamMemberService.listAllOrgAdminsEmailIds()
			.subscribe(
				data => {
					this.orgAdminEmailIds = data;
				},
				error => {
					this.logger.errorPage(error);
				},
				() => this.logger.info("Finished listAllOrgAdminsEmailIds()")
			);
	}

	listAllPartnerEmailIds() {
		this.teamMemberService.listAllPartnerEmailIds()
			.subscribe(
				data => {
					this.partnerEmailIds = data;
				},
				error => {
					this.logger.errorPage(error);
				},
				() => this.logger.info("Finished listAllPartnerEmailIds()")
			);
	}

	save() {
		let emailIds = this.teamMembers.map(function (a) { return a.emailId.toLowerCase(); });
		let recipientsArray = emailIds.sort();
		let duplicateEmailIds = [];
		for (var i = 0; i < recipientsArray.length - 1; i++) {
			if (recipientsArray[i + 1] == recipientsArray[i]) {
				duplicateEmailIds.push(recipientsArray[i]);
			}
		}
		if (duplicateEmailIds.length == 0) {
			$("#empty-roles-div").hide();
			this.referenceService.goToTop();
			this.teamMemberUi.emptyRolesLength = this.validateRoles('add-team-member-table', 'team-member-');
			if (this.teamMemberUi.emptyRolesLength == 0) {
				this.errorMessage = "";
				this.referenceService.startLoader(this.httpRequestLoader);
				this.teamMemberService.save(this.teamMembers, this.userId)
					.subscribe(
						data => {	
							if(data.access){
								this.referenceService.stopLoader(this.httpRequestLoader);
								if (data.statusCode == 3000) {
									this.successMessage = "Team Member(s) added successfully.";
									this.customResponse = new CustomResponse('SUCCESS', this.successMessage, true);
									this.pagination.pageIndex = 1;
									this.listTeamMembers(this.pagination);
									this.clearRows();
									this.listDropDown();
								} else {
									this.showErrorMessageDiv(data.message);
								}
							}else{
								this.authenticationService.forceToLogout();
							}
						},
						error => {
							this.referenceService.stopLoader(this.httpRequestLoader);
							let statusCode = JSON.parse(error['status']);
							if (statusCode == 409) {
								this.customResponse = new CustomResponse('ERROR', "Team Member already exists", true);
							} else {
								this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
							}
						},
						() => this.logger.log(" Completed save()")
					);
			} else {
				this.showErrorMessageDiv("Please assign at least one role to your team member");
			}
		} else {
		let message =  "Please remove duplicate rows "+ duplicateEmailIds.join();
		this.customResponse = new CustomResponse('ERROR',message, true);
		}

	}

	update() {
		$("#empty-roles-div").hide();
		this.referenceService.goToTop();
		this.teamMemberUi.emptyRolesLength = this.validateRoles('list-team-member-table', 'list-team-member-');
		if (this.teamMemberUi.emptyRolesLength == 0) {
			this.errorMessage = "";
			this.referenceService.startLoader(this.httpRequestLoader);
			this.logger.log(this.teamMembersList);
			this.teamMemberService.update(this.teamMembersList, this.userId)
				.subscribe(
					data => {
						if(data.access){
							this.referenceService.stopLoader(this.httpRequestLoader);
							if (data.statusCode == 3002) {
								this.successMessage = "Team Member(s) updated successfully.";
								this.customResponse = new CustomResponse('SUCCESS', this.successMessage, true);
								// $( "#team-member-success-div" ).show();
								// setTimeout( function() { $( "#team-member-success-div" ).slideUp( 500 ); }, 7000 );
								this.pagination.pageIndex = 1;
								this.listTeamMembers(this.pagination);
								this.listEmailIds();
								this.listAllOrgAdminsEmailIds();
								this.clearRows();
								this.listDropDown();
							} else {
								this.showErrorMessageDiv(data.message);
							}
						}else{
							this.authenticationService.forceToLogout();
						}
						

					},
					error => {
						this.logger.errorPage(error);
					},
					() => this.logger.log(" Completed save()")
				);
		} else {
			this.showErrorMessageDiv("Please assign at least one role to your team member");
		}
	}

	showErrorMessageDiv(message: string) {
		this.errorMessage = message;
		this.customResponse = new CustomResponse('ERROR', this.errorMessage, true);
	}

	hideErrorMessageDiv() {
		this.errorMessage = "";
		this.customResponse = new CustomResponse('ERROR', this.errorMessage, false);
	}
	/*********************Delete*********************/


	deleteAll() {
		this.deleteText = "This will remove all team members.";
		let teamMember = new TeamMember();
		teamMember.teamMemberId = 0;
	}


	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.listTeamMembers(this.pagination);
	}



	addTeamMember() {
		try {
			this.teamMemberUi.emptyTable = false;
			this.teamMembers.push(this.team);
			this.team = new TeamMember();
			this.teamMemberUi.validEmailId = false;
			this.emaillIdDivClass = this.defaultClass;
			this.teamMemberUi.isValidForm = false;
			this.closePopup();
		} catch (error) {
			this.showUIError(error);
		}

	}


	validateEmailId(emailId: string) {
		try {
			if ($.trim(emailId).length > 0) {
				this.teamMemberUi.validEmailId = this.referenceService.validateEmailId(emailId);
				if (!this.teamMemberUi.validEmailId) {
					this.showErrorMessage("Please enter a valid email address");
                    /*if(isTabChangeEvent){
                      this.showErrorMessage("Please enter a valid email address");
                    }else{
                        this.teamMemberUi.isValidForm = false;
                    }*/
				} else {
					/**********Method To Check Whether Org Admin Or Not***********/
					if (this.allEmailIds.indexOf(emailId.toLowerCase()) > -1) {
						this.showErrorMessage("This email address is already registered with xAmplify and cannot be added as a team member at this time.");
					} else {
						this.hideErrorMessage();
					}
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

	validateDisableEmailIds(emailId: string) {
		if (this.disabledEmailIds.indexOf(emailId.toLowerCase()) > -1) {
			this.showErrorMessage("Disabled team member cannot be added.");
		} else {
			this.hideErrorMessage();
		}
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


	addErrorClass() {
		return this.emaillIdDivClass = this.errorClass;
	}
	removeErrorClass() {
		return this.emaillIdDivClass = this.successClass;
	}

	deleteRow(index: number, emailId: string) {
		try {
			$('#team-member-' + index).remove();
			emailId = emailId.toLowerCase();
			this.teamMembers = this.spliceArray(this.teamMembers, emailId);
			let tableRows = $("#add-team-member-table > tbody > tr").length;
			if (tableRows == 0 || this.teamMembers.length == 0) {
				this.clearRows();
			}
			this.listDropDown();
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

	clearRows() {
		try {
			$('#add-team-member-table tbody').remove();
			this.teamMembers = [];
			this.team = new TeamMember();
			this.emaillIdDivClass = this.defaultClass;
			$(".col-md-12 span").text('');
			this.teamMemberUi = new TeamMemberUi();
			this.isUploadCsv = false;
			this.isAddTeamMember = false;
		} catch (error) {
			this.showUIError(error);
		}

	}


	setAllRoles(team: TeamMember) {
		if (!this.isOnlyPartner) {
			team.video = true;
			team.emailTemplate = true;
			team.design = true;
			team.form = true;
			team.landingPage = true;
			team.stats = true;
			team.socialShare = true;
			team.partners = true;
		}
		team.campaign = true;
		if (this.contactAccess) {
			team.contact = true;
		}
		// team.opportunity = true;

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
		// team.opportunity = false;
	}

	countCheckedCheckBoxesLength(team: TeamMember, index: number, tableId: string) {
		try {
			let length = $('#' + tableId + ' .module-checkbox-' + index + ':checked').length;
			if ((this.contactAccess && length == 7) || (!this.contactAccess && length == 6) || (this.isOnlyPartner && length == 2)) {
				team.all = true;
				$('#' + tableId + ' #role-checkbox-' + index).prop("disabled", true);
			} else {
				team.all = false;
				$('#' + tableId + ' #role-checkbox-' + index).prop("disabled", false);
			}
		} catch (error) {
			this.showUIError(error);
		}
	}
	addAllAuthorities(e, team: TeamMember, tableId: string, index: number) {
		try {
			var table = $(e.target).closest('tr');
			$('td input:checkbox', table).prop('checked', e.target.checked);
			if (e.target.checked) {
				this.setAllRoles(team);
				$('#' + tableId + ' #role-checkbox-' + index).prop("disabled", true);
			} else {
				this.removeAllRoles(team);
				$('#' + tableId + ' #role-checkbox-' + index).prop("disabled", false);
			}
		} catch (error) {
			this.showUIError(error);
		}

	}


	validateRoles(tableId: string, trId: string) {
		try {
			let tableRowsLength = $('#' + tableId + ' tbody tr').length;
			for (var i = 0; i < tableRowsLength; i++) {
				let assignedRowsLength = $('#' + tableId + ' .module-checkbox-' + i + ':checked').length;
				if (assignedRowsLength > 0) {
					$('#' + trId + i).css("background-color", "#C0C0C0");
				} else {
					$('#' + trId + i).css("background-color", "#E00000");
				}
			}
			return $("#" + tableId).find("tr[style='background-color: rgb(224, 0, 0);']").length;
		} catch (error) {
			this.showUIError(error);
		}

	}

	showUIError(error) {
		this.uiError = 'Oops! Something went wrong';
		this.logger.error(error);
	}


	refreshList() {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = "";
		this.listTeamMembers(this.pagination);
	}
	csvErrors: string[] = [];

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
				if ((this.contactAccess && headers.length == 9) || (!this.contactAccess && headers.length == 8) || (this.isOnlyPartner && headers.length == 4)) {
					if (this.validateHeaders(headers)) {
						this.readCsvData(csvRecordsArray, headersRow.length);
					} else {
						this.showCsvFileError('Invalid CSV');
					}
				} else {
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

	validateHeaders(headers) {
		if (this.contactAccess && !this.isOnlyPartner) {
			return (headers[0] == "EMAIL_ID" && headers[1] == "ALL" && headers[2] == "VIDEO" && headers[3] == "CONTACTS" && headers[4] == "CAMPAIGN" && headers[5] == "STATS" && headers[6] == "DESIGN" && headers[7] == "SOCIAL_SHARE" && headers[8] == "PARTNERS");
		} else if (this.isOnlyPartner) {
			return (headers[0] == "EMAIL_ID" && headers[1] == "ALL" && headers[2] == "CONTACTS" && headers[3] == "CAMPAIGN");
		}
		else {
			return (headers[0] == "EMAIL_ID" && headers[1] == "ALL" && headers[2] == "VIDEO" && headers[3] == "CAMPAIGN" && headers[4] == "STATS" && headers[5] == "DESIGN" && headers[6] == "SOCIAL_SHARE" && headers[7] == "PARTNERS");
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
			//setTimeout(function () { $("#csv-error-div").hide(500); }, 7000);
			this.fileReset();
			this.isUploadCsv = false;
			this.isAddTeamMember = false;
		} else {
			this.appendCsvDataToTable();
			this.fileReset();
		}
	}

	showCsvFileError(message: string) {
		this.showErrorMessageDiv(message);
		this.fileReset();
		this.isUploadCsv = false;
		this.isAddTeamMember = false;

	}

	validateCsvData() {
		let names = this.csvRecords.map(function (a) { return a[0].split(',')[0] });
		let duplicateEmailIds = this.referenceService.returnDuplicates(names);
		this.teamMembers = [];
		if (duplicateEmailIds.length == 0) {
			for (var i = 1; i < this.csvRecords.length; i++) {
				let rows = this.csvRecords[i];
				let row = rows[0].split(',');
				let emailId = row[0];
				this.emaillIdDivClass = this.defaultClass;
				if (!this.referenceService.validateEmailId(emailId)) {
					//  this.csvErrors.push(emailId+" at row "+(i+1)+" is invalid.");
					this.csvErrors.push(emailId + " is invalid email address.");
				} else {
					/**********Method To Check Whether Org Admin Or Not***********/
					if (this.allEmailIds.indexOf(emailId.toLowerCase()) > -1) {
						this.csvErrors.push(emailId + " is already registered with xAmplify and cannot be added as a team member at this time.");
					}
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

	fileReset() {
		this.fileImportInput.nativeElement.value = "";
		this.csvRecords = [];
	}

	setDefaultValue(value: any) {
		if (value == 1) {
			return true;
		} else {
			return false;
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
					teamMember.contact = this.setDefaultValue(row[2]);
					teamMember.campaign = this.setDefaultValue(row[3]);
				} else {
					teamMember.video = this.setDefaultValue(row[2]);
					if (this.contactAccess) {
						teamMember.contact = this.setDefaultValue(row[3]);
						teamMember.campaign = this.setDefaultValue(row[4]);
						teamMember.stats = this.setDefaultValue(row[5]);
						teamMember.design = this.setDefaultValue(row[6]);
						teamMember.socialShare = this.setDefaultValue(row[7]);
						teamMember.partners = this.setDefaultValue(row[8]);
					} else {
						teamMember.campaign = this.setDefaultValue(row[3]);
						teamMember.stats = this.setDefaultValue(row[4]);
						teamMember.design = this.setDefaultValue(row[5]);
						teamMember.socialShare = this.setDefaultValue(row[6]);
						teamMember.partners = this.setDefaultValue(row[7]);
					}
				}
			}
			this.teamMembers.push(teamMember);
		}
	}

	showAddTeamMember() {
		$("#csv-error-div").hide();
		$('#addTeamMember').modal('show');

	}

	listAllEmailIds() {
		this.referenceService.loading(this.httpRequestLoader, true);
		this.teamMemberService.getAllEmailIds()
			.subscribe(
				data => {
					this.allEmailIds = data;
				},
				error => {
					this.allEmailIds = [];
					this.referenceService.showSweetAlertErrorMessage('Something went wrong.Please try after sometime');
				},
				() => this.logger.log("showAddTeamMember() done")
			);
	}
	clearForm() {
		this.emaillIdDivClass = this.defaultClass;
		// $(".text-danger").html('');
		this.isAddTeamMember = false;
		this.teamMemberUi.isValidForm = false;
		this.teamMemberUi.errorMessage = "";
		// this.clearRows();
		this.closePopup();
	}
	closePopup() {
		$('#addTeamMember').modal('hide');
		$('#add-team-member-form')[0].reset();
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
		//this.removeAllRoles(team);
		//team.all = false;
		team.orgAdmin = false;
		$('.module-checkbox-' + index).prop('disabled', false);
		$('.check-all-' + index).prop('disabled', false);
	}

	enableAsOrgAdmin(event: any, index: number, team: TeamMember) {
		this.setAllRoles(team);
		team.all = true;
		team.orgAdmin = event;
		$('.module-checkbox-' + index).prop('disabled', true);
		$('.check-all-' + index).prop('disabled', true);
	}

	getEnabledOrgAdminsCount() {
		let enabledOrgAdmin = this.teamMembersList.map(function (a) { return a.orgAdmin; });
		this.logger.log(this.teamMembersList);
		var counts = {};
		$.each(enabledOrgAdmin, function (key, value) {
			if (!counts.hasOwnProperty(value)) {
				counts[value] = 1;
			} else {
				counts[value]++;
			}
		});
		return counts['true'];
	}

	changeTeamMemberStatus(teamMember: TeamMember, event: any) {
		if (event) {
			teamMember.status = Status.APPROVE;
			teamMember.enabled = event;
		} else {
			teamMember.status = Status.DECLINE;
			teamMember.enabled = event;
		}
	}

	onSelect(item: any) {
		this.selectedItem = item;
	}

	onInputChangedEvent(val: string) {
		this.inputChanged = val;
	}

	listPartnerAndTeamMembers() {
		this.teamMemberService.listPartnerAndTeamMembers(this.userId)
			.subscribe(
				data => {
					this.setDropDownData(data);
				},
				error => this.logger.log(error),
				() => this.logger.log("listPartnerAndTeamMembers() done")
			);
	}
	listAllOrgAdminsAndSupervisors() {
		this.teamMemberService.listAllOrgAdminsAndSupervisors(this.userId)
			.subscribe(
				data => {
					this.setDropDownData(data);
				},
				error => this.logger.log(error),
				() => this.logger.log("listAllOrgAdminsAndSupervisors() done")
			);
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

	loginAs(teamMember: TeamMember) {
		this.loginAsTeamMember(teamMember.emailId, false);

	}

	loginAsTeamMember(emailId: string, isLoggedInAsAdmin: boolean) {
		this.loading = true;
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
							localStorage.adminId = JSON.stringify(this.userId);
							localStorage.adminEmailId = JSON.stringify(this.authenticationService.user.emailId);
						}
					}
					this.utilService.setUserInfoIntoLocalStorage(emailId, response);
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

	logoutAsTeamMember() {
		let adminEmailId = JSON.parse(localStorage.getItem('adminEmailId'));
		this.loginAsTeamMember(adminEmailId, true);
	}



	showPopup(teamMember: TeamMember) {
		this.selectedId = 0;
		this.deletePopupLoader = true;
		$('#delete-team-member-popup').modal('show');
		this.teamMemberService.listEmailIdsForTransferData(this.userId, this.isOnlyPartner)
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
				() => this.logger.log("listAllOrgAdminsAndSupervisors() done")
			);

	}

	hidePopup() {
		this.selectedItem = "";
		this.inputChanged = "";
		$('input').val('');
		$('#delete-team-member-popup').modal('hide');
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
					if(data.access){
						this.deletePopupLoader = false;
						this.referenceService.goToTop();
						if (teamMember.teamMemberId == 0) {
							this.successMessage = "All Team Members deleted successfully.";
							this.pagination.pageIndex = 0;
						} else {
							this.successMessage = this.selectedTeamMemberEmailId + " deleted successfully.";
							this.pagination.pageIndex = this.pagination.pageIndex - 1;
						}
						this.teamMemberIdToDelete = 0;
						this.selectedTeamMemberEmailId = "";
						this.customResponse = new CustomResponse('SUCCESS', this.successMessage, true);
						this.listTeamMembers(this.pagination);
						this.listAllEmailIds();
						this.clearRows();
					}else{
						this.authenticationService.forceToLogout();
					}
				},
				error => { this.logger.errorPage(error) },
				() => this.logger.log("Team member deleted successfully.")
			);
	}
}
