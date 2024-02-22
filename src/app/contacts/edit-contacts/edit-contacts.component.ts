import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { Criteria } from '../models/criteria';
import { EditUser } from '../models/edit-user';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { ActionsDescription } from '../../common/models/actions-description';
import { AddContactsOption } from '../models/contact-option';
import { User } from '../../core/models/user';
import { Router } from '@angular/router';
import { ManageContactsComponent } from '../manage-contacts/manage-contacts.component';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';
import { UserListIds } from '../models/user-listIds';
import { ReferenceService } from '../../core/services/reference.service';
import { ContactsByType } from '../models/contacts-by-type';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CountryNames } from '../../common/models/country-names';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { TeamMemberService } from '../../team/services/team-member.service';
import { FileUtil } from '../../core/models/file-util';
import { SocialPagerService } from '../services/social-pager.service';
import { GdprSetting } from '../../dashboard/models/gdpr-setting';
import { UserService } from '../../core/services/user.service';
import { LegalBasisOption } from '../../dashboard/models/legal-basis-option';
import { SendCampaignsComponent } from '../../common/send-campaigns/send-campaigns.component';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { UserUserListWrapper } from '../models/user-userlist-wrapper';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
import { Subject } from 'rxjs';
import { SweetAlertParameterDto } from 'app/common/models/sweet-alert-parameter-dto';
import { ShareUnpublishedContentComponent } from 'app/common/share-unpublished-content/share-unpublished-content.component';

declare var Metronic, Promise, Layout, Demo, swal, Portfolio, $, Swal, await, Papa: any;

@Component({
	selector: 'app-edit-contacts',
	templateUrl: './edit-contacts.component.html',
	styleUrls: ['../../../assets/css/button.css',
		'../../../assets/css/numbered-textarea.css',
		'./edit-contacts.component.css', '../../../assets/css/phone-number-plugin.css'],
	providers: [FileUtil, Pagination, HttpRequestLoader, CountryNames, Properties, ActionsDescription, RegularExpressions, TeamMemberService, CallActionSwitch]
})
export class EditContactsComponent implements OnInit, OnDestroy {
	@Input() contacts: User[];
	@Input() totalRecords: number;
	@Input() contactListId: number;
	@Input() contactListName: string;
	@Input() selectedContactListId: number;
	@Input() uploadedUserId: number;
	@Input() isDefaultPartnerList: boolean;
	@Input() isDefaultContactList: boolean;
	@Input() isSynchronizationList: boolean;
	@Input() isPartnerUserList: boolean;
	@Input() masterContactListSync: boolean;
	@Input('value') value: number;
	@Input() isFormList: boolean;
	@Input() companyName: any;
	@Input() manageCompanies: boolean = false;
	@Input() isCompanyBreadCrumb: boolean = false;
	@Input() selectedCompanyId: number;
	/*****XNFR-98******/
	@Input() isTeamMemberPartnerList: boolean;
	editContacts: User;
	@Output() notifyParent: EventEmitter<User>;
	@ViewChild('sendCampaignComponent') sendCampaignComponent: SendCampaignsComponent;
	userUserListWrapper: UserUserListWrapper = new UserUserListWrapper();
	criteria = new Criteria();
	editUser: EditUser = new EditUser();
	criterias = new Array<Criteria>();
	isSegmentation: boolean = false;
	isSegmentationErrorMessage: boolean;
	filterConditionErrorMessage = "";
	assignLeads: boolean = false;
	totalListUsers = [];
	updatedUserDetails = [];
	existedEmailIds = [];
	csvContacts = [];

	contactListObject: ContactList;
	selectedUser: User = null;
	selectedContactListName: string;
	public validEmailPatternSuccess: boolean = true;
	emailNotValid: boolean;
	checkingForEmail: boolean;
	addContactuser: User = new User();
	updateContactUser: boolean = false;

	public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	AddContactsOption: typeof AddContactsOption = AddContactsOption;
	selectedAddContactsOption: number = 8;
	selectedCompanyContactId: number;
	invalidDeleteSuccessMessage: boolean = false;
	editListContacts: boolean = true;

	uploadCsvUsingFile: boolean = false;
	contactsByType: ContactsByType = new ContactsByType();
	gettingAllUserspagination: Pagination = new Pagination();
	showSelectedCategoryUsers: boolean = true;
	isShowUsers: boolean = true;
	public users: Array<User>;
	customResponse: CustomResponse = new CustomResponse();
	emailNotificationCustomResponse: CustomResponse = new CustomResponse();
	names: string[] = [];

	selectedContactForSave = [];
	addPartnerSave: boolean = false;
	isCompanyContact: boolean = false;
	dublicateEmailId: boolean = false;
	noOfContactsDropdown: boolean = true;
	validCsvContacts: boolean;
	inValidCsvContacts: boolean;
	isHeaderCheckBoxChecked: boolean = false;
	isInvalidHeaderCheckBoxChecked: boolean = false;
	public clipboardTextareaText: string;
	pagedItems: any[];
	checkedUserList = [];
	selectedInvalidContactIds = [];
	selectedContactListIds = [];
	selectedCampaignIds = [];
	fileTypeError: boolean;
	selectedDropDown: string;
	public uploader: FileUploader;
	public clickBoard: boolean = false;
	public filePrevew: boolean = false;
	noContactsFound: boolean;
	invalidPatternEmails: string[] = [];

	public allUsers: number;
	checkingLoadContactsCount: boolean;
	showAllContactData: boolean = false;
	showEditContactData: boolean = true;

	hasContactRole: boolean = false;
	loggedInUserId = 0;
	hasAllAccess = false;
	isDuplicateEmailId = false;
	isEditContactPopupShow = false;

	public currentContactType: string = "all_contacts";
	public userListIds: Array<UserListIds>;
	contactUsersId: number;
	contactIds = [];
	duplicateEmailIds: string[] = [];
	public searchKey: string;
	sortcolumn: string = null;
	sortingOrder: string = null;
	public invalidPattenMail = false;
	showInvalidMaills = false;
	downloadDataList = [];
	isEmailExist: boolean = false;
	contactsCompanyListSync : boolean = false;
	sortOptions = [
		{ 'name': 'Sort by', 'value': '' },
		{ 'name': 'Email (A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email (Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'First name (ASC)', 'value': 'firstName-ASC' },
		{ 'name': 'First name (DESC)', 'value': 'firstName-DESC' },
		{ 'name': 'Last name (ASC)', 'value': 'lastName-ASC' },
		{ 'name': 'Last name (DESC)', 'value': 'lastName-DESC' },
	];

	public sortOption: any = this.sortOptions[0];
	isUpdateUser: boolean;
	isPartner: boolean;
	isCompanyDetails = false;
	checkingContactTypeName: string;
	module: string;
	newUsersEmails = [];
	newUserDetails = [];
	teamMemberPagination: Pagination = new Pagination();
	contactAssociatedCampaignPagination: Pagination = new Pagination();

	teamMembersList = [];
	/*    orgAdminsList = [];*/
	editingEmailId = '';
	loading = false;
	contactAllDetails: any;
	openCampaignModal = false;
	logListName = "";
	searchContactType = "";
	saveAsListName: any;
	saveAsError: any;
	isCsvFileLsitLoading = false;

	pageSize: number = 12;
	pageNumber: any;
	pager: any = {};
	csvPagedItems: any[];
	isCheckTC = true;
	contactOption = "";
	showGDPR: boolean;


	filterOptions = [
		{ 'name': '', 'value': 'Field Name*' },
		{ 'name': 'firstName', 'value': 'First Name' },
		{ 'name': 'lastName', 'value': 'Last Name' },
		{ 'name': 'Company', 'value': 'Company' },
		{ 'name': 'JobTitle', 'value': 'Job Title' },
		{ 'name': 'Email Id', 'value': 'Email Id' },
		{ 'name': 'country', 'value': 'Country' },
		{ 'name': 'city', 'value': 'City' },
		{ 'name': 'mobileNumber', 'value': 'Mobile Number' },
		{ 'name': 'state', 'value': 'State' },
		/* { 'name': 'notes', 'value': 'Notes' },*/
	];
	filterOption = this.filterOptions[0];

	filterConditions = [
		{ 'name': '', 'value': 'Condition*' },
		{ 'name': 'eq', 'value': '=' },
		{ 'name': 'like', 'value': 'Contains' },
	];
	filterCondition = this.filterConditions[0];
	gdprSetting: GdprSetting = new GdprSetting();
	termsAndConditionStatus = true;
	gdprStatus = true;
	legalBasisOptions: Array<LegalBasisOption>;
	parentInput: any;
	companyId: number = 0;
	selectedLegalBasisOptions = [];
	public fields: any;
	public placeHolder: string = 'Select Legal Basis';
	isValidLegalOptions = true;
	isValidClipBoardData = false;
	sourceType = "";
	showAddOptions = false;
	campaignsTitle = "";
	mdfAccess: boolean = false;
	processingPartnersLoader = false;
	contactAndMdfPopupResponse: CustomResponse = new CustomResponse();
	sharedLeads: boolean = false;
	showNotifyPartnerOption = false;
	hasPartnersRole: boolean = false;
	hasShareLeadsRole: boolean = false;
	selectedFilterIndex: number = 1;
	showFilter = true;
	resetTMSelectedFilterIndex: Subject<boolean> = new Subject<boolean>();
	downloadAssociatedPagination: Pagination = new Pagination();
	previewLoader: boolean;
	/****XNFR-130*****/
	selectAllTeamMemberIds = [];
	selectAllTeamMemberGroupId = 0;
	applyForAllClicked = false;
	sweetAlertParameterDto: SweetAlertParameterDto = new SweetAlertParameterDto();
	showSweetAlert = false;
	selectedPartner: any;
	companyRouter = "/home/company/manage";

	/****XNFR-278****/
	mergeOptionClicked = false;
	selectedUserIdsForMerging: any[];
	/****XNFR-278****/
	@Input() showEdit: boolean;
	/*****XNFR-342*****/
	@ViewChild('shareUnPublishedComponent') shareUnPublishedComponent: ShareUnpublishedContentComponent;
	constructor(public socialPagerService: SocialPagerService, private fileUtil: FileUtil, public refService: ReferenceService, public contactService: ContactService, private manageContact: ManageContactsComponent,
		public authenticationService: AuthenticationService, private router: Router, public countryNames: CountryNames,
		public regularExpressions: RegularExpressions, public actionsDescription: ActionsDescription,
		private pagerService: PagerService, public pagination: Pagination, public xtremandLogger: XtremandLogger, public properties: Properties,
		public teamMemberService: TeamMemberService, public userService: UserService, public campaignService: CampaignService, public callActionSwitch: CallActionSwitch) {
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.pagination.vanityUrlFilter = true;
		}
		this.addContactuser.country = (this.countryNames.countries[0]);
		this.contactsByType.selectedCategory = "all";
		this.sourceType = this.authenticationService.getSource();
		let currentUrl = this.router.url;

		if (currentUrl.includes('home/sharedleads')) {
			this.isPartner = false;
			this.assignLeads = false;
			this.sharedLeads = true;
			this.checkingContactTypeName = "Shared Lead"
			this.module = 'sharedleads';
		} else if (currentUrl.includes('home/assignleads')) {
			this.isPartner = false;
			this.assignLeads = true;
			this.showAddOptions = true;
			this.checkingContactTypeName = "Lead"
			this.module = 'leads';
		} else if (currentUrl.includes('home/contacts')) {
			this.isPartner = false;
			this.checkingContactTypeName = "Contact";
			this.showAddOptions = true;
			this.module = 'contacts';
		} else {
			this.isPartner = true;
			if (this.sourceType != "ALLBOUND") {
				this.showAddOptions = true;
			} else {
				this.showAddOptions = false;
			}
			this.module = 'partners';
			this.checkingContactTypeName = "Partner";
			this.sortOptions.push({ 'name': 'Company (ASC)', 'value': 'contactCompany-ASC' });
			this.sortOptions.push({ 'name': 'Company (DESC)', 'value': 'contactCompany-DESC' });
			this.sortOptions.push({ 'name': 'Vertical (ASC)', 'value': 'vertical-ASC' });
			this.sortOptions.push({ 'name': 'Vertical (DESC)', 'value': 'vertical-DESC' });
			this.sortOptions.push({ 'name': 'Region (ASC)', 'value': 'region-ASC' });
			this.sortOptions.push({ 'name': 'Region (DESC)', 'value': 'region-DESC' });
			this.sortOptions.push({ 'name': 'Type (ASC)', 'value': 'partnerType-ASC' });
			this.sortOptions.push({ 'name': 'Type (DESC)', 'value': 'partnerType-DESC' });
			this.sortOptions.push({ 'name': 'Category (ASC)', 'value': 'category-ASC' });
			this.sortOptions.push({ 'name': 'Category (DESC)', 'value': 'category-DESC' });

		}
		if (this.checkingContactTypeName == "Contact") {
			this.campaignsTitle = this.actionsDescription.campaigns_emails;
		} else {
			this.campaignsTitle = this.actionsDescription.send_campaigns;
		}
		this.users = new Array<User>();
		this.notifyParent = new EventEmitter<User>();
		this.hasContactRole = this.refService.hasRole(this.refService.roles.contactsRole);
		this.hasPartnersRole = this.refService.hasRole(this.refService.roles.partnersRole);
		this.hasShareLeadsRole = this.refService.hasRole(this.refService.roles.shareLeadsRole);

		this.hasAllAccess = this.refService.hasAllAccess();
		this.loggedInUserId = this.authenticationService.getUserId();

		this.parentInput = {};
		const currentUser = localStorage.getItem('currentUser');
		let campaginAccessDto = JSON.parse(currentUser)['campaignAccessDto'];
		this.companyId = campaginAccessDto.companyId;
	}

	onChangeAllContactUsers(event: Pagination) {
		try {
			this.pagination = event;
			if (this.currentContactType == "all_contacts") {
				this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
			} else {
				this.contactsByType.pagination = event;
				this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
			}
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "allPaginationDropdown");
		}
	}

	checked(event: boolean) {
		this.xtremandLogger.info("check value" + event)
		this.contacts.forEach((contacts) => {
			if (event == true)
				contacts.isChecked = true;
			else
				contacts.isChecked = false;
		})
	}

	setCsvPage(page: number) {
		try {
			if (page < 1 || page > this.pager.totalPages) {
				return;
			}
			this.pager = this.socialPagerService.getPager(this.users.length, page, this.pageSize);
			this.csvPagedItems = this.users.slice(this.pager.startIndex, this.pager.endIndex + 1);

		} catch (error) {
			this.xtremandLogger.error(error, "AddContactsComponent setPage().")
		}

	}

	setClipBoardPage(page: number) {
		try {
			if (page < 1 || page > this.pager.totalPages) {
				return;
			}
			this.pager = this.socialPagerService.getPager(this.users.length, page, this.pageSize);
			this.pagination.pagedItems = this.users.slice(this.pager.startIndex, this.pager.endIndex + 1);

		} catch (error) {
			this.xtremandLogger.error(error, "AddContactsComponent setPage().")
		}

	}



	fileChange(input: any) {
		this.uploadCsvUsingFile = true;
		this.customResponse.responseType = null;
		this.fileTypeError = false;
		this.noContactsFound = false;
		this.readFiles(input.files);
	}

	readFile(file: any, reader: any, callback: any) {
		reader.onload = () => {
			callback(reader.result);
		}
		reader.readAsText(file);
	}

	readFiles(files: any, index = 0) {
		try {
			if (this.fileUtil.isCSVFile(files[0])) {
				this.selectedAddContactsOption = 2;
				this.isCsvFileLsitLoading = true;
				this.isShowUsers = false;
				this.fileTypeError = false;
				this.xtremandLogger.info("coontacts preview");
				$("#sample_editable_1").hide();
				this.filePrevew = true;
				let reader = new FileReader();
				reader.readAsText(files[0]);
				this.xtremandLogger.info(files[0]);
				var self = this;
				reader.onload = function (e: any) {
					var contents = e.target.result;

					let csvData = reader.result;
					let csvRecordsArray = csvData.split(/\r|\n/);
					let headersRow = self.fileUtil
						.getHeaderArray(csvRecordsArray);
					let headers = headersRow[0].split(',');

					if ((!self.isPartner && headers.length == 11)) {
						if (self.validateContactsCsvHeaders(headers)) {
							var csvResult = Papa.parse(contents);
							var allTextLines = csvResult.data;
							for (var i = 1; i < allTextLines.length; i++) {

								if (allTextLines[i][4] && allTextLines[i][4].trim().length > 0) {
									let user = new User();
									user.emailId = allTextLines[i][4].trim();
									user.firstName = allTextLines[i][0].trim();
									user.lastName = allTextLines[i][1].trim();
									user.contactCompany = allTextLines[i][2].trim();
									user.jobTitle = allTextLines[i][3].trim();
									user.address = allTextLines[i][5].trim();
									user.city = allTextLines[i][6].trim();
									user.state = allTextLines[i][7].trim();
									user.zipCode = allTextLines[i][8].trim();
									user.country = allTextLines[i][9].trim();
									user.mobileNumber = allTextLines[i][10].trim();
									user.legalBasis = self.selectedLegalBasisOptions;
									/*user.description = allTextLines[i][9];*/
									self.users.push(user);
									self.csvContacts.push(user);
								}

							}
							self.setCsvPage(1);

							if (self.csvContacts.length == 0) {
								self.customResponse = new CustomResponse('ERROR', "No results found.", true);
							}

						} else {
							self.customResponse = new CustomResponse('ERROR', "Invalid Csv", true);
							self.removeCsv();
							self.uploader.queue.length = 0;
						}

					} else if ((self.isPartner && headers.length == 15)) {
						if (self.validatePartnerCsvHeaders(headers)) {
							var csvResult = Papa.parse(contents);
							var allTextLines = csvResult.data;
							for (var i = 1; i < allTextLines.length; i++) {
								if (allTextLines[i][4] && allTextLines[i][4].trim().length > 0) {
									let user = new User();
									user.emailId = allTextLines[i][4].trim();
									user.firstName = allTextLines[i][0].trim();
									user.lastName = allTextLines[i][1].trim();
									user.contactCompany = allTextLines[i][2].trim();
									user.jobTitle = allTextLines[i][3].trim();
									user.vertical = allTextLines[i][5].trim();
									user.region = allTextLines[i][6].trim();
									user.partnerType = allTextLines[i][7].trim();
									user.category = allTextLines[i][8].trim();
									user.address = allTextLines[i][9].trim();
									user.city = allTextLines[i][10].trim();
									user.state = allTextLines[i][11].trim();
									user.zipCode = allTextLines[i][12].trim();
									user.country = allTextLines[i][13].trim();
									user.mobileNumber = allTextLines[i][14].trim();
									user.legalBasis = self.selectedLegalBasisOptions;
									self.users.push(user);
									self.csvContacts.push(user);

								}

							}
							self.setCsvPage(1);

							if (self.csvContacts.length == 0) {
								self.customResponse = new CustomResponse('ERROR', "No results found.", true);
							}

						} else {
							self.customResponse = new CustomResponse('ERROR', "Invalid Csv", true);
							self.removeCsv();
							self.uploader.queue.length = 0;
						}
					} else {
						self.customResponse = new CustomResponse('ERROR', "Invalid Csv", true);
						self.removeCsv();
						self.uploader.queue.length = 0;
					}
					console.log("AddContacts : readFiles() contacts " + JSON.stringify(self.users));
				}
				this.isCsvFileLsitLoading = false;
			} else {
				this.fileTypeError = true;
				this.uploader.queue.length = 0;
			}
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "readingCsvFile()");
		}
	}

	validatePartnerCsvHeaders(headers) {
		return (headers[0].trim() == "FIRSTNAME" && headers[1].trim() == "LASTNAME" && headers[2].trim() == "COMPANY" && headers[3].trim() == "JOBTITLE" && headers[4].trim() == "EMAILID" && headers[5].trim() == "VERTICAL" && headers[6].trim() == "REGION" && headers[7].trim() == "TYPE" && headers[8].trim() == "CATEGORY" && headers[9].trim() == "ADDRESS" && headers[10].trim() == "CITY" && headers[11].trim() == "STATE" && headers[12].trim() == "ZIP" && headers[13].trim() == "COUNTRY" && headers[14].trim() == "MOBILE NUMBER");
	}

	validateContactsCsvHeaders(headers) {
		return (this.removeDoubleQuotes(headers[0]) == "FIRSTNAME" &&
			this.removeDoubleQuotes(headers[1]) == "LASTNAME" &&
			this.removeDoubleQuotes(headers[2]) == "COMPANY" &&
			this.removeDoubleQuotes(headers[3]) == "JOBTITLE" &&
			this.removeDoubleQuotes(headers[4]) == "EMAILID" &&
			this.removeDoubleQuotes(headers[5]) == "ADDRESS" &&
			this.removeDoubleQuotes(headers[6]) == "CITY" &&
			this.removeDoubleQuotes(headers[7]) == "STATE" &&
			this.removeDoubleQuotes(headers[8]) == "ZIP CODE" &&
			this.removeDoubleQuotes(headers[9]) == "COUNTRY" &&
			this.removeDoubleQuotes(headers[10]) == "MOBILE NUMBER");
	}

	removeDoubleQuotes(input: string) {
		if (input != undefined) {
			return input.trim().replace('"', '').replace('"', '');
		} else {
			return "";
		}
	}

	compressArray(original) {
		var compressed = [];
		var copy = original.slice(0);
		for (var i = 0; i < original.length; i++) {
			var myCount = 0;
			for (var w = 0; w < copy.length; w++) {
				if (original[i] == copy[w]) {
					myCount++;
					delete copy[w];
				}
			} if (myCount > 0) {
				var a: any = new Object();
				a.value = original[i];
				a.count = myCount;
				compressed.push(a);
			}
		}
		return compressed;
	};

	closeShowValidMessage() {
		this.showInvalidMaills = false;
	}

	updateContactList(contactListId: number) {
		this.showInvalidMaills = false;
		this.invalidPattenMail = false;
		this.duplicateEmailIds = [];
		this.dublicateEmailId = false;
		console.log(this.users);
		var testArray = [];
		for (var i = 0; i <= this.users[0].emailId.length - 1; i++) {
			testArray.push(this.users[0].emailId.toLowerCase());
		}
		for (var j = 0; j <= this.users.length - 1; j++) {
			if (this.validateEmailAddress(this.users[j].emailId)) {
				this.invalidPattenMail = false;
			} else {
				this.invalidPattenMail = true;
				testArray.length = 0;
				break;
			}
		}
		var newArray = this.compressArray(testArray);
		for (var w = 0; w < newArray.length; w++) {
			if (newArray[w].count >= 2) {
				this.duplicateEmailIds.push(newArray[w].value);
			}
			console.log(newArray[w].value);
			console.log(newArray[w].count);
		}
		this.xtremandLogger.log("DUPLICATE EMAILS" + this.duplicateEmailIds);
		var valueArr = this.users.map(function (item) { return item.emailId.toLowerCase() });
		var isDuplicate = valueArr.some(function (item, idx) {
			return valueArr.indexOf(item) != idx
		});
		console.log(isDuplicate);
		this.isDuplicateEmailId = isDuplicate;
		this.xtremandLogger.info(this.users[0].emailId);
		if (this.invalidPattenMail === true) {
			this.showInvalidMaills = true;
			testArray.length = 0;
		} else if (!isDuplicate) {
			this.saveValidEmails();
		} else {
			this.dublicateEmailId = true;
		}
	}

	checkTeamEmails(arr, val) {
		this.xtremandLogger.log(arr.indexOf(val) > -1);
		return arr.indexOf(val) > -1;
	}


	askForPermission(contactOption: any) {
		this.contactOption = contactOption;
		if (this.termsAndConditionStatus) {
			$('#tcModal').modal('show');
		} else {
			this.saveContactsWithPermission();
		}

	}


	saveContactsWithPermission() {
		$('#tcModal').modal('hide');
		if (this.contactOption == 'OneAtTime') {
			this.updateListFromOneAtTimeWithPermission();
		} else if (this.contactOption == 'ClipBoard') {
			this.updateListFromClipBoardWithPermission();
		} else if (this.contactOption == 'CsvContacts') {
			this.updateListFromCsvWithPermission()
		}
	}

	navigateToTermsAndConditions() {
		window.open("https://www.xamplify.com/terms-conditions", "_blank");
	}


	saveValidEmails() {
		try {
			this.isCompanyDetails = false;
			this.newUserDetails.length = 0;
			let existedEmails = [];

			for (let i = 0; i < this.users.length; i++) {

				let userDetails = {
					"emailId": this.users[i].emailId,
					"firstName": this.users[i].firstName,
					"lastName": this.users[i].lastName,
					"companyName": this.users[i]['contactCompany']
				}

				this.newUserDetails.push(userDetails);

				if (this.users[i].country === "Select Country") {
					this.users[i].country = null;
				}
				if (this.users[i].mobileNumber) {
					if (this.users[i].mobileNumber.length < 6) {
						this.users[i].mobileNumber = "";
					}
				}
			}

			if (this.isPartner) {
				for (let i = 0; i < this.users.length; i++) {
					if (this.users[i].contactCompany.trim() != '') {
						this.isCompanyDetails = true;
					} else {
						this.isCompanyDetails = false;
					}
					if (this.users[i].country === "Select Country") {
						this.users[i].country = null;
					}
				}

				/*for ( let i = 0; i < this.orgAdminsList.length; i++ ) {
					this.teamMembersList.push( this.orgAdminsList[i] );
				}*/
				this.teamMembersList.push(this.authenticationService.user.emailId);

				let emails = []
				for (let i = 0; i < this.users.length; i++) {
					emails.push(this.users[i].emailId);
				}

				if (emails.length > this.teamMembersList.length) {
					for (let i = 0; i < emails.length; i++) {
						let isEmail = this.checkTeamEmails(emails, this.teamMembersList[i]);
						if (isEmail) { existedEmails.push(this.teamMembersList[i]) }
					}

				} else {
					for (let i = 0; i < this.teamMembersList.length; i++) {
						let isEmail = this.checkTeamEmails(this.teamMembersList, emails[i]);
						if (isEmail) { existedEmails.push(emails[i]) }
					}
				}
				console.log(existedEmails);


			} else {
				this.isCompanyDetails = true;
			}
			if (existedEmails.length === 0) {
				if (this.isCompanyDetails) {
					this.askForPermission('OneAtTime');
				} else {
					this.customResponse = new CustomResponse('ERROR', "Company Details is required", true);
				}
			} else {
				this.customResponse = new CustomResponse('ERROR', "You are not allowed to add teamMember(s) or yourself as a partner", true);
				this.cancelContacts();
			}
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "savingOneAtTime user()");
		}
	}

	updateListFromOneAtTimeWithPermission() {
		this.loading = true;
		this.xtremandLogger.info("update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify(this.users));
		this.contactService.updateContactList(this.contactListId, this.users)
			.subscribe(
				(data: any) => {
					if (data.access) {
						this.loading = false;
						//this.allUsers = this.contactsByType.allContactsCount;
						this.xtremandLogger.info("update Contacts ListUsers:" + data);
						this.manageContact.editContactList(this.contactListId, this.contactListName, this.uploadedUserId, this.isDefaultPartnerList, this.isDefaultContactList,this.isPartnerUserList, this.isSynchronizationList, this.isFormList, this.isTeamMemberPartnerList, this.manageCompanies, this.companyName, this.selectedCompanyId);
						$("tr.new_row").each(function () {
							$(this).remove();
						});

						if (data.statusCode == 409) {
							let emailIds = data.emailAddresses;
							let allEmailIds = "";
							$.each(emailIds, function (index, emailId) {
								allEmailIds += (index + 1) + "." + emailId + "<br><br>";
							});
							let message = data.errorMessage + "<br><br>" + allEmailIds;
							this.customResponse = new CustomResponse('ERROR', message, true);
						}

						if (data.statusCode == 417) {
							this.customResponse = new CustomResponse('ERROR', data.detailedResponse[0].message, true);
						}
						this.checkingLoadContactsCount = true;
						this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
						this.contactsCount(this.selectedContactListId);
						this.cancelContacts();
						if (data.statusCode == 200) {
							if (this.assignLeads) {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.LEAD_LIST_UPDATE_SUCCESS, true);
							} else if (!this.isPartner) {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_SAVE_SUCCESS, true);
							} else {
								this.showSuccessMessage(data);
							}
							//this.getContactsAssocialteCampaigns();
							this.contactService.addUserSuccessMessage = true;
							this.goBackToManageList();
							if (this.isCompanyBreadCrumb) {
								this.goBackToCompaniesList();
							}
						} else if (data.statusCode == 418) {
							this.showUnFormattedEmailAddresses(data);
						}
					} else {
						this.authenticationService.forceToLogout();
					}

				},
				(error: any) => {
					this.loading = false;
					let body: string = error['_body'];
					body = body.substring(1, body.length - 1);
					if (error._body.includes('Please launch or delete those campaigns first')) {
						this.customResponse = new CustomResponse('ERROR', error._body, true);
					} else if (JSON.parse(error._body).includes("email addresses in your contact list that aren't formatted properly")) {
						this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body), true);
					} else {
						this.xtremandLogger.errorPage(error);
					}
					this.xtremandLogger.error(error);
					console.log(error);
				},
				() => this.xtremandLogger.info("MangeContactsComponent loadContactLists() finished")
			)
		this.dublicateEmailId = false;
	}

	showSuccessMessage(data: any) {
		let message = "Your " + this.authenticationService.partnerModule.customName + "(s) have been saved successfully." + "<br><br>";;
		let invalidEmailIds = data.invalidEmailIds;
		if (invalidEmailIds != undefined && invalidEmailIds.length > 0) {
			let allEmailIds = "";
			$.each(invalidEmailIds, function (index, emailId) {
				allEmailIds += (index + 1) + "." + emailId + "<br><br>";
			});
			if (invalidEmailIds.length == 1) {
				message += "Following email address is not saved because it is not formatted properly" + "<br><br>" + allEmailIds;
			} else {
				message += "Following email addresses are not saved because they not formatted properly" + "<br><br>" + allEmailIds;
			}
		}
		this.customResponse = new CustomResponse('SUCCESS', message, true);
	}

	showUnFormattedEmailAddresses(data: any) {
		let invalidEmailIds = data.invalidEmailIds;
		let allEmailIds = "";
		$.each(invalidEmailIds, function (index, emailId) {
			allEmailIds += (index + 1) + "." + emailId + "<br><br>";
		});
		let message = "";
		if (invalidEmailIds.length == 1) {
			message = "Following email address is not formatted properly " + "<br><br>" + allEmailIds;
		} else {
			message = "Following email addresses are not formatted properly " + "<br><br>" + allEmailIds;
		}
		this.customResponse = new CustomResponse('ERROR', message, true);
	}

	updateCsvContactList(contactListId: number) {
		try {
			this.newUserDetails.length = 0;
			let existedEmails = [];
			if (this.users.length > 0) {
				for (let i = 0; i < this.users.length; i++) {
					if (!this.validateEmailAddress(this.users[i].emailId)) {
						this.invalidPatternEmails.push(this.users[i].emailId)
					}
					if (this.validateEmailAddress(this.users[i].emailId)) {
						this.validCsvContacts = true;
					}
					else {
						this.validCsvContacts = false;
					}

					if (this.users[i].country === "Select Country") {
						this.users[i].country = null;
					}

					this.validateEmail(this.users[i].emailId);



					let userDetails = {
						"emailId": this.users[i].emailId,
						"firstName": this.users[i].firstName,
						"lastName": this.users[i].lastName,
						"companyName": this.users[i]['contactCompany']
					}

					this.newUserDetails.push(userDetails);
				}

				var testArray = [];
				for (var i = 0; i <= this.users.length - 1; i++) {
					testArray.push(this.users[i].emailId.toLowerCase());
				}
				var newArray = this.compressArray(testArray);
				for (var w = 0; w < newArray.length; w++) {
					if (newArray[w].count >= 2) {
						this.duplicateEmailIds.push(newArray[w].value);
					}
					console.log(newArray[w].value);
					console.log(newArray[w].count);
				}
				this.xtremandLogger.log("DUPLICATE EMAILS" + this.duplicateEmailIds);
				var valueArr = this.users.map(function (item) { return item.emailId.toLowerCase() });
				var isDuplicate = valueArr.some(function (item, idx) {
					return valueArr.indexOf(item) != idx
				});
				console.log("emailDuplicate" + isDuplicate);
				this.isDuplicateEmailId = isDuplicate;


				if (this.validCsvContacts == true && this.invalidPatternEmails.length == 0 && !this.isEmailExist && !isDuplicate) {
					$("#sample_editable_1").show();
					this.isCompanyDetails = false;
					if (this.isPartner) {
						for (let i = 0; i < this.users.length; i++) {
							if (this.users[i].contactCompany.trim() != '') {
								this.isCompanyDetails = true;
							} else {
								this.isCompanyDetails = false;
							}
							if (this.users[i].country === "Select Country") {
								this.users[i].country = null;
							}
						}

						/* for ( let i = 0; i < this.orgAdminsList.length; i++ ) {
							 this.teamMembersList.push( this.orgAdminsList[i] );
						 }*/
						this.teamMembersList.push(this.authenticationService.user.emailId);

						let emails = []
						for (let i = 0; i < this.users.length; i++) {
							emails.push(this.users[i].emailId);
						}

						if (emails.length > this.teamMembersList.length) {
							for (let i = 0; i < emails.length; i++) {
								let isEmail = this.checkTeamEmails(emails, this.teamMembersList[i]);
								if (isEmail) { existedEmails.push(this.teamMembersList[i]) }
							}

						} else {
							for (let i = 0; i < this.teamMembersList.length; i++) {
								let isEmail = this.checkTeamEmails(this.teamMembersList, emails[i]);
								if (isEmail) { existedEmails.push(emails[i]) }
							}
						}
						console.log(existedEmails);

					} else {
						this.isCompanyDetails = true;
					}

					if (existedEmails.length === 0) {
						if (this.isCompanyDetails) {
							this.askForPermission('CsvContacts');
						} else {
							this.customResponse = new CustomResponse('ERROR', "Company Details is required", true);
						}

					} else {
						this.customResponse = new CustomResponse('ERROR', "You are not allowed add teamMember(s) or yourself as a partner", true);
					}

				} else if (this.isEmailExist) {
					this.customResponse = new CustomResponse('ERROR', "These email(s) are already added " + this.existedEmailIds, true);
				}
				else if (isDuplicate) {
					this.customResponse = new CustomResponse('ERROR', "Please remove duplicate email ids " + this.duplicateEmailIds, true);
				} else {
					this.inValidCsvContacts = true;
				}
			}
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "UpdatingListFromCSV()");
		}
	}

	updateListFromCsvWithPermission() {
		this.loading = true;
		if (this.selectedLegalBasisOptions != undefined && this.selectedLegalBasisOptions.length > 0) {
			this.setLegalBasisOptions(this.users);
		}
		this.xtremandLogger.info("update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify(this.users));
		this.contactService.updateContactList(this.contactListId, this.users)
			.subscribe(
				data => {
					if (data.access) {
						this.loading = false;
						this.selectedAddContactsOption = 8;
						this.xtremandLogger.info("update Contacts ListUsers:" + data);
						this.manageContact.editContactList(this.contactListId, this.contactListName, this.uploadedUserId, this.isDefaultPartnerList,this.isPartnerUserList, this.isDefaultContactList, this.isSynchronizationList, this.isFormList, this.isTeamMemberPartnerList, this.manageCompanies, this.companyName, this.selectedCompanyId);
						$("tr.new_row").each(function () {
							$(this).remove();
						});



						this.users = [];
						this.selectedAddContactsOption = 8;
						this.uploadCsvUsingFile = false;
						this.uploader.queue.length = 0;
						this.filePrevew = false;
						this.isShowUsers = true;
						this.removeCsv();
						if (data.statusCode == 409) {
							let emailIds = data.emailAddresses;
							let allEmailIds = "";
							$.each(emailIds, function (index, emailId) {
								allEmailIds += (index + 1) + "." + emailId + "<br><br>";
							});
							let message = data.errorMessage + "<br><br>" + allEmailIds;
							this.customResponse = new CustomResponse('ERROR', message, true);
						}

						if (data.statusCode == 417) {
							this.customResponse = new CustomResponse('ERROR', data.detailedResponse[0].message, true);
						}

						this.checkingLoadContactsCount = true;
						this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
						this.contactsCount(this.selectedContactListId);


						if (data.statusCode == 200) {
							//this.getContactsAssocialteCampaigns();
							if (this.assignLeads) {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.LEAD_LIST_UPDATE_SUCCESS, true);
							} else if (!this.isPartner) {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_SAVE_SUCCESS, true);
							} else {
								this.showSuccessMessage(data);
							}
							this.contactService.addUserSuccessMessage = true;
							this.goBackToManageList();
							if (this.isCompanyBreadCrumb) {
								this.goBackToCompaniesList();
							}
						} else if (data.statusCode == 418) {
							this.showUnFormattedEmailAddresses(data);
						}
					} else {
						this.authenticationService.forceToLogout();
					}
				},
				(error: any) => {
					this.loading = false;
					let body: string = error['_body'];
					body = body.substring(1, body.length - 1);
					if (error._body.includes('Please launch or delete those campaigns first')) {
						this.customResponse = new CustomResponse('ERROR', error._body, true);

					} else if (JSON.parse(error._body).message.includes("email addresses in your contact list that aren't formatted properly")) {
						this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
					} else {
						this.xtremandLogger.errorPage(error);
					}
					this.xtremandLogger.error(error);
					console.log(error);
				},
				() => this.xtremandLogger.info("MangeContactsComponent loadContactLists() finished")
			)

	}

	removeContactListUsers(contactListId: number) {
		try {
			this.loading = true;
			this.xtremandLogger.info(this.selectedContactListIds);
			this.contactService.removeContactListUsers(contactListId, this.selectedContactListIds)
				.subscribe(
					(data: any) => {
						if (data.access) {
							data = data;
							if (data.statusCode == 200) {
								$('#contactListDiv_' + contactListId).remove();
								if (data.isEmptyFormList) {
									this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true);
									this.contactService.isEmptyFormList = true;
								} else {
									this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true);
								}

								this.contactService.deleteUserSucessMessage = true;
								this.goBackToManageList();
								if (this.isCompanyBreadCrumb) {
									this.goBackToCompaniesList();
								}
							} else if (data.statusCode == 201) {
								//this.allUsers = this.contactsByType.allContactsCount;
								console.log("update Contacts ListUsers:" + data);
								if (this.assignLeads) {
									this.customResponse = new CustomResponse('SUCCESS', this.properties.LEADS_DELETE_SUCCESS, true);
								} else if (!this.isPartner) {
									this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACTS_DELETE_SUCCESS, true);
								} else {
									let message = "Your " + this.authenticationService.partnerModule.customName + "(s) have been deleted successfully";
									this.customResponse = new CustomResponse('SUCCESS', message, true);
								}
								$.each(this.selectedContactListIds, function (index: number, value: any) {
									$('#row_' + value).remove();
									console.log(index + "value" + value);
								});
								this.checkingLoadContactsCount = true;
								this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
								this.contactsCount(this.selectedContactListId);
								this.selectedContactListIds.length = 0;
								this.loading = false;
							}
						} else {
							this.authenticationService.forceToLogout();
						}
					},
					(error: any) => {
						//let body: string = error['_body'];
						//body = body.substring(1, body.length-1);
						if (error._body.includes('Please launch or delete those campaigns first')) {
							this.customResponse = new CustomResponse('ERROR', error._body, true);
						} else {
							this.xtremandLogger.errorPage(error);
						}
						console.log(error);
						this.loading = false;
					},
					() => this.xtremandLogger.info("deleted completed")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "deleting user()");
			this.loading = false;
		}
	}

	goBackToManageList() {
		this.loading = true;
		let self = this;
		setTimeout(function () {
			self.refresh();
		}, 500);
	}

	goBackToCompaniesList() {
		this.loading = true;
		let self = this;
		setTimeout(function () {
			self.navigateToCompanyLists();
		}, 500);
	}

	navigateToCompanyLists() {
		this.router.navigate(['/home/company/manage'])
	}

	showAlert(contactListId: number) {
		this.xtremandLogger.info("userIdForChecked" + this.selectedContactListIds);
		this.resetResponse();
		if (this.selectedContactListIds.length != 0) {
			this.xtremandLogger.info("contactListId in sweetAlert() " + this.contactListId);
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "You won't be able to undo this action!",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete it!'

			}).then(function (myData: any) {
				console.log("ManageContacts showAlert then()" + myData);
				self.removeContactListUsers(contactListId);
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});

		}
	}

	addRow(event) {
		if (event !== 'close') {
			if (this.emailNotValid) {
				this.users.push(event);
			}
			this.selectedAddContactsOption = 0;
			this.users.push(event);
			this.saveContacts(this.contactListId);
			this.addContactuser = new User();
		}
		else {
			this.contactService.isContactModalPopup = false;
		}
	}

	cancelRow(rowId: number) {
		if (rowId !== -1) {
			this.users.splice(rowId, 1);
		}
	}

	removeCsv() {
		this.uploader.queue.length = 0;
		this.selectedLegalBasisOptions = [];
		this.fileTypeError = false;
		this.inValidCsvContacts = false;
		this.existedEmailIds, length = 0;
		this.invalidPatternEmails.length = 0;
		this.selectedAddContactsOption = 8;
		this.users = [];
		this.filePrevew = false;
		this.isShowUsers = true;
		$("#sample_editable_1").show();
	}

	copyFromClipboard() {
		this.fileTypeError = false;
		this.noContactsFound = false;
		this.clipboardTextareaText = "";
		this.clickBoard = true;
		/* if(this.isPartner){*/

		/*}else{
		this.clickBoard = true;
		}*/
		this.selectedAddContactsOption = 8;
	}

	clipboardShowPreview() {
		this.isValidClipBoardData = false;
		var selectedDropDown = $("select.options:visible option:selected ").val();
		var splitValue;
		if (this.clipboardTextareaText == undefined) {
			swal("value can't be null");
		}
		if (selectedDropDown == "DEFAULT") {
			swal("<span style='font-weight: 100;font-family: Open Sans;font-size: 16px;'>Please Select the Delimiter Type</span>");
			return false;
		}
		else {
			if (selectedDropDown == "CommaSeperated")
				splitValue = ",";
			else if (selectedDropDown == "TabSeperated")
				splitValue = "\t";
		}
		this.xtremandLogger.info("selectedDropDown:" + selectedDropDown);
		this.xtremandLogger.info(splitValue);
		var startTime = new Date();
		$("#clipBoardValidationMessage").html('');
		var self = this;
		var allTextLines = this.clipboardTextareaText.split("\n");
		this.xtremandLogger.info("allTextLines: " + allTextLines);
		this.xtremandLogger.info("allTextLines Length: " + allTextLines.length);
		var isValidData: boolean = true;
		if (this.clipboardTextareaText === "") {
			$("#clipBoardValidationMessage").append("<h4 style='color:#f68a55;'>" + "Please enter the valid data." + "</h4>");
			isValidData = false;
		}

		if (this.clipboardTextareaText != "") {
			for (var i = 0; i < allTextLines.length; i++) {
				var data = allTextLines[i].split(splitValue);
				if (!this.validateEmailAddress(data[4])) {
					$("#clipBoardValidationMessage").append("<h4 style='color:#f68a55;'>" + "Email Address is not valid for Row:" + (i + 1) + " -- Entered Email Address: " + data[4] + "</h4>");
					isValidData = false;
				}
				this.users.length = 0;
				this.pagination.pagedItems.length = 0;
			}
		}
		if (isValidData) {
			$("button#sample_editable_1_new").prop('disabled', false);
			for (var i = 0; i < allTextLines.length; i++) {
				var data = allTextLines[i].split(splitValue);
				let user = new User();
				if (!this.isPartner) {
					switch (data.length) {
						case 1:
							user.firstName = data[0];
							break;
						case 2:
							user.firstName = data[0];
							user.lastName = data[1];
							break;
						case 3:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							break;
						case 4:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							break;
						case 5:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							break;
						case 6:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.address = data[5];
							break;
						case 7:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.address = data[5];
							user.city = data[6];
							break;
						case 8:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.address = data[5];
							user.city = data[6];
							user.state = data[7];
							break;
						case 9:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.address = data[5];
							user.city = data[6];
							user.state = data[7];
							user.zipCode = data[8];
							break;
						case 10:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.address = data[5];
							user.city = data[6];
							user.state = data[7];
							user.zipCode = data[8];
							user.country = data[9];
							break;
						case 11:
							user.firstName = data[0].trim();
							user.lastName = data[1].trim();
							user.contactCompany = data[2].trim();
							user.jobTitle = data[3].trim();
							user.emailId = data[4].trim();
							user.address = data[5].trim();
							user.city = data[6].trim();
							user.state = data[7].trim();
							user.zipCode = data[8].trim();
							user.country = data[9].trim();
							user.mobileNumber = data[10].trim();
							break;
						/*case 10:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.address = data[5];
							user.city = data[6];
							user.country = data[7];
							user.mobileNumber = data[8];
							user.description = data[9];
							break;*/
					}
				} else {
					switch (data.length) {
						case 1:
							user.firstName = data[0];
							break;
						case 2:
							user.firstName = data[0];
							user.lastName = data[1];
							break;
						case 3:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							break;
						case 4:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							break;
						case 5:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							break;
						case 6:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.vertical = data[5];
							break;
						case 7:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.vertical = data[5];
							user.region = data[6]
							break;
						case 8:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.vertical = data[5];
							user.region = data[6]
							user.partnerType = data[7]
							break;
						case 9:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.vertical = data[5];
							user.region = data[6]
							user.partnerType = data[7]
							user.category = data[8]
							break;
						case 10:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.vertical = data[5];
							user.region = data[6]
							user.partnerType = data[7]
							user.category = data[8]
							user.address = data[9]
							break;
						case 11:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.vertical = data[5];
							user.region = data[6]
							user.partnerType = data[7]
							user.category = data[8]
							user.address = data[9]
							user.city = data[10]
							break;
						case 12:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.vertical = data[5];
							user.region = data[6]
							user.partnerType = data[7]
							user.category = data[8]
							user.address = data[9]
							user.city = data[10]
							user.state = data[11]
							break;
						case 13:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.vertical = data[5];
							user.region = data[6]
							user.partnerType = data[7]
							user.category = data[8]
							user.address = data[9]
							user.city = data[10]
							user.state = data[11]
							user.zipCode = data[12]
							break;
						case 14:
							user.firstName = data[0];
							user.lastName = data[1];
							user.contactCompany = data[2];
							user.jobTitle = data[3];
							user.emailId = data[4];
							user.vertical = data[5];
							user.region = data[6]
							user.partnerType = data[7]
							user.category = data[8]
							user.address = data[9]
							user.city = data[10]
							user.state = data[11]
							user.zipCode = data[12]
							user.country = data[13]
							break;
						case 15:
							user.firstName = data[0].trim();
							user.lastName = data[1].trim();
							user.contactCompany = data[2].trim();
							user.jobTitle = data[3].trim();
							user.emailId = data[4].trim();
							user.vertical = data[5].trim();
							user.region = data[6].trim()
							user.partnerType = data[7].trim()
							user.category = data[8].trim()
							user.address = data[9].trim()
							user.city = data[10].trim()
							user.state = data[11].trim()
							user.zipCode = data[12].trim()
							user.country = data[13].trim()
							user.mobileNumber = data[14].trim()
							break;
					}
				}
				this.xtremandLogger.info(user);
				this.users.push(user);
				self.pagination.pagedItems.push(user);
				//self.setClipBoardPage(1);
				$("button#sample_editable_1_new").prop('disabled', false);
			}
			this.selectedAddContactsOption = 1;
			self.setClipBoardPage(1);
			var endTime = new Date();
			$("#clipBoardValidationMessage").append("<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing started at: <b>" + startTime + "</b></h5>");
			$("#clipBoardValidationMessage").append("<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing Finished at: <b>" + endTime + "</b></h5>");
			$("#clipBoardValidationMessage").append("<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Total Number of records Found: <b>" + allTextLines.length + "</b></h5>");
			this.isValidClipBoardData = true;
		} else {
			$("button#sample_editable_1_new").prop('disabled', true);
			$("#clipBoardValidationMessage").show();
			this.filePrevew = false;
			this.isValidClipBoardData = false;
		}
		this.xtremandLogger.info(this.users);
	}

	validateEmailAddress(emailId: string) {
		var EMAIL_ID_PATTERN = this.regularExpressions.EMAIL_ID_PATTERN;
		return EMAIL_ID_PATTERN.test(emailId);
	}
	validateName(name: string) {
		return (name.trim().length > 0);
	}

	updateContactListFromClipBoard(contactListId: number) {
		try {
			this.duplicateEmailIds = [];
			this.dublicateEmailId = false;
			this.existedEmailIds = [];
			var testArray = [];
			for (var i = 0; i <= this.users.length - 1; i++) {
				testArray.push(this.users[i].emailId);
				this.validateEmail(this.users[i].emailId);
			}

			var newArray = this.compressArray(testArray);
			for (var w = 0; w < newArray.length; w++) {
				if (newArray[w].count >= 2) {
					this.duplicateEmailIds.push(newArray[w].value);
				}
				console.log(newArray[w].value);
				console.log(newArray[w].count);
			}
			this.xtremandLogger.log("DUPLICATE EMAILS" + this.duplicateEmailIds);
			var valueArr = this.users.map(function (item) { return item.emailId });
			var isDuplicate = valueArr.some(function (item, idx) {
				return valueArr.indexOf(item) != idx
			});
			console.log(isDuplicate);
			this.isDuplicateEmailId = isDuplicate;
			if (!isDuplicate && !this.isEmailExist) {
				this.saveClipboardValidEmails();
			} else if (this.isEmailExist) {
				this.customResponse = new CustomResponse('ERROR', "These email(s) are already added " + this.existedEmailIds, true);
			} else {
				this.dublicateEmailId = true;
				$("button#sample_editable_1_new").prop('disabled', false);
			}
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "updatingListFromClipboard()");
		}
	}

	saveClipboardValidEmails() {
		try {
			this.newUserDetails.length = 0;
			let existedEmails = [];
			for (let i = 0; i < this.users.length; i++) {
				let userDetails = {
					"emailId": this.users[i].emailId,
					"firstName": this.users[i].firstName,
					"lastName": this.users[i].lastName,
					"companyName": this.users[i]['contactCompany'],
					"legalBasis": this.selectedLegalBasisOptions
				}
				this.newUserDetails.push(userDetails);

				if (this.users[i].country === "Select Country") {
					this.users[i].country = null;
				}

				/*if ( this.users[i].mobileNumber.length < 6 ) {
					this.users[i].mobileNumber = "";
				}*/
			}
			this.xtremandLogger.info("update contacts #contactSelectedListId " + this.contactListId + " data => " + JSON.stringify(this.users));
			if (this.users.length != 0) {
				this.isCompanyDetails = false;
				if (this.isPartner) {
					for (let i = 0; i < this.users.length; i++) {
						if (this.users[i].contactCompany.trim() != '') {
							this.isCompanyDetails = true;
						} else {
							this.isCompanyDetails = false;
						}
						if (this.users[i].country === "Select Country") {
							this.users[i].country = null;
						}
						/*if ( this.users[i].mobileNumber.length < 6 ) {
							this.users[i].mobileNumber = "";
						}*/
					}

					/* for ( let i = 0; i < this.orgAdminsList.length; i++ ) {
						 this.teamMembersList.push( this.orgAdminsList[i] );
					 }*/
					this.teamMembersList.push(this.authenticationService.user.emailId);
					let emails = []
					for (let i = 0; i < this.users.length; i++) {
						emails.push(this.users[i].emailId);
					}

					if (emails.length > this.teamMembersList.length) {
						for (let i = 0; i < emails.length; i++) {
							let isEmail = this.checkTeamEmails(emails, this.teamMembersList[i]);
							if (isEmail) { existedEmails.push(this.teamMembersList[i]) }
						}

					} else {
						for (let i = 0; i < this.teamMembersList.length; i++) {
							let isEmail = this.checkTeamEmails(this.teamMembersList, emails[i]);
							if (isEmail) { existedEmails.push(emails[i]) }
						}
					}
					console.log(existedEmails);

				} else {
					this.isCompanyDetails = true;
				}
				if (existedEmails.length === 0) {
					if (this.isCompanyDetails) {
						this.askForPermission('ClipBoard');
					} else {
						this.customResponse = new CustomResponse('ERROR', "Company Details is required", true);
					}
				} else {
					this.customResponse = new CustomResponse('ERROR', "You are not allowed to add teamMember(s) or yourself as a partner", true);
				}
				this.dublicateEmailId = false;
			}
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "savingListFromClipboard()");
		}
	}

	updateListFromClipBoardWithPermission() {
		this.loading = true;
		this.setLegalBasisOptions(this.users);
		this.contactService.updateContactList(this.contactListId, this.users)
			.subscribe(
				data => {
					if (data.access) {
						this.loading = false;
						this.selectedAddContactsOption = 8;
						this.xtremandLogger.info("update Contacts ListUsers:" + data);
						this.manageContact.editContactList(this.contactListId, this.contactListName, this.uploadedUserId, this.isDefaultPartnerList, this.isDefaultContactList, this.isSynchronizationList,this.isPartnerUserList, this.isFormList, this.isTeamMemberPartnerList, this.manageCompanies, this.companyName, this.selectedCompanyId);
						$("tr.new_row").each(function () {
							$(this).remove();

						});
						this.clickBoard = false;


						$("button#add_contact").prop('disabled', false);
						$("button#upload_csv").prop('disabled', false);
						this.users.length = 0;
						this.cancelContacts();

						if (data.statusCode == 409) {
							let emailIds = data.emailAddresses;
							let allEmailIds = "";
							$.each(emailIds, function (index, emailId) {
								allEmailIds += (index + 1) + "." + emailId + "<br><br>";
							});
							let message = data.errorMessage + "<br><br>" + allEmailIds;
							this.customResponse = new CustomResponse('ERROR', message, true);
						}

						if (data.statusCode == 417) {
							this.customResponse = new CustomResponse('ERROR', data.detailedResponse[0].message, true);
						}

						this.checkingLoadContactsCount = true;
						this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
						this.contactsCount(this.selectedContactListId);
						if (data.statusCode == 200) {
							//this.getContactsAssocialteCampaigns();
							if (this.assignLeads) {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.LEAD_LIST_UPDATE_SUCCESS, true);
							} else if (!this.isPartner) {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_SAVE_SUCCESS, true);
							} else {
								this.showSuccessMessage(data);
							}
							this.contactService.addUserSuccessMessage = true;
							this.goBackToManageList();
							if (this.isCompanyBreadCrumb) {
								this.goBackToCompaniesList();
							}
						} else if (data.statusCode == 418) {
							this.showUnFormattedEmailAddresses(data);
						}
					} else {
						this.authenticationService.forceToLogout();
					}
				},
				(error: any) => {
					this.loading = false;
					let body: string = error['_body'];
					body = body.substring(1, body.length - 1);
					if (error._body.includes('Please launch or delete those campaigns first')) {
						this.customResponse = new CustomResponse('ERROR', error._body, true);
					} else if (JSON.parse(error._body).includes("email addresses in your contact list that aren't formatted properly")) {
						this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body), true);
						this.cancelContacts();
					} else {
						this.xtremandLogger.errorPage(error);
					}
					this.xtremandLogger.error(error);
					console.log(error);
				},
				() => this.xtremandLogger.info("MangeContactsComponent loadContactLists() finished")
			)

	}

	saveContacts(contactListId: number) {
		this.validateLegalBasisOptions();
		if (this.isValidLegalOptions) {
			if (this.isPartner) {
				this.loading = true;
				if (this.selectedAddContactsOption == 0) {
					this.getContactsLimit();
				} else {
					this.validatePartnersCompany();
				}
			} else {
				this.saveData();
			}
		}
	}

	closeAssignContactAndMdfAmountPopup() {
		$('#assignContactAndMdfPopup').modal('hide');
		this.isEditContactPopupShow = true;
		this.showNotifyPartnerOption = false;
		this.applyForAllClicked = false;
		this.contactAndMdfPopupResponse = new CustomResponse();
		this.cancelContacts();
	}

	getContactsLimit() {
		this.contactService.getContactsLimit(this.users, this.loggedInUserId).subscribe(
			(data: any) => {
				this.users = data.data;
				/********XNFR-85********/
				let teamMemberGroups = data.map['teamMemberGroups'];
				this.teamMemberGroups = teamMemberGroups;
				this.loading = false;
				this.showNotifyPartnerOption = true;
				$('#assignContactAndMdfPopup').modal('show');
			}, (error: any) => {
				this.loading = false;
				this.refService.showSweetAlertServerErrorMessage();
				this.cancelContacts();
			}, () => {

			});
	}

	setNotifyPartnerOption(partner: any, event: any) {
		partner.notifyPartners = event;
	}

	validatePartners() {
		this.processingPartnersLoader = true;
		$(".modal-body").animate({ scrollTop: 0 }, 'slow');
		this.contactAndMdfPopupResponse = new CustomResponse();
		let errorCount = 0;
		let self = this;
		$.each(this.users, function (index: number, partner: any) {
			let contactsLimit = partner.contactsLimit;
			if (self.applyForAllClicked) {
				partner.teamMemberGroupId = self.selectAllTeamMemberGroupId;
				partner.selectedTeamMemberIds = self.selectAllTeamMemberIds;
			}
			if (contactsLimit < 1) {
				partner.contactsLimit = 1;
			}
		});
		if (errorCount > 0) {
			this.processingPartnersLoader = false;
			this.resetApplyFilter();
		} else {
			this.validatePartnership();
		}
	}

	validatePartnership() {
		this.processingPartnersLoader = true;
		this.contactService.validatePartners(this.selectedContactListId, this.users).subscribe(
			(data: any) => {
				this.processingPartnersLoader = false;
				let statusCode = data.statusCode;
				if (statusCode == 200) {
					$('#assignContactAndMdfPopup').modal('hide');
					this.processingPartnersLoader = false;
					this.showNotifyPartnerOption = false;
					this.resetApplyFilter();
					this.saveData();
				} else {
					if (this.applyForAllClicked) {
						$.each(this.users, function (index: number, partner: any) {
							partner.teamMemberGroupId = 0;
							partner.selectedTeamMemberIds = [];
							partner.expand = false;
						});
					}
					let emailIds = "";
					$.each(data.data, function (index: number, emailId: string) {
						emailIds += index + 1 + "." + emailId + "\n";
					});
					let updatedMessage = data.message + "\n" + emailIds;
					this.contactAndMdfPopupResponse = new CustomResponse("ERROR", updatedMessage, true);
					this.resetApplyFilter();
				}
			}, (error: any) => {
				this.resetApplyFilter();
				this.processingPartnersLoader = false;
				let httpStatusCode = error['status'];
				if (httpStatusCode != 500) {
					this.contactAndMdfPopupResponse = new CustomResponse('ERROR', httpStatusCode, true);
				} else {
					this.contactAndMdfPopupResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
				}
			});
	}

	saveData() {
		if (this.selectedAddContactsOption == 0) {
			this.updateContactList(this.contactListId);
		}
		if (this.selectedAddContactsOption == 1) {
			this.updateContactListFromClipBoard(this.contactListId);
		}

		if (this.selectedAddContactsOption == 2) {
			this.updateCsvContactList(this.contactListId);
		}
	}

	cancelContacts() {
		this.uploader.queue.length = 0;
		this.resetResponse();
		if (this.selectedAddContactsOption == 1) {
			this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
		}
		this.selectedAddContactsOption = 8;
		this.users = [];
		this.selectedContactListIds = [];
		this.isHeaderCheckBoxChecked = false;
		this.dublicateEmailId = false;
		this.clickBoard = false;
		this.isValidClipBoardData = false;
		this.isValidLegalOptions = true;
		this.selectedLegalBasisOptions = [];
		this.filePrevew = false;
		this.uploadCsvUsingFile = false;
		this.isShowUsers = true;
	}

	checkAll(ev: any, contacts: User[]) {
		try {
			if (ev.target.checked) {
				console.log("checked");
				$('[name="campaignContact[]"]').prop('checked', true);
				let self = this;
				$('[name="campaignContact[]"]:checked').each(function () {
					var id = $(this).val();
					self.selectedContactListIds.push(parseInt(id));
					console.log(self.selectedContactListIds);
					$('#campaignContactListTable_' + id).addClass('contact-list-selected');
				});
				this.selectedContactListIds = this.refService.removeDuplicates(this.selectedContactListIds);
				for (let i = 0; i < contacts.length; i++) {
					this.selectedContactForSave.push(contacts[i]);
				}

			} else {
				$('[name="campaignContact[]"]').prop('checked', false);
				$('#user_list_tb tr').removeClass("contact-list-selected");
				if (this.pagination.maxResults == this.pagination.totalRecords) {
					this.selectedContactListIds = [];
				} else {
					let currentPageContactIds = this.pagination.pagedItems.map(function (a) { return a.id; });
					this.selectedContactListIds = this.refService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
				}
				for (let i = 0; i < contacts.length; i++) {
					const index = this.selectedContactForSave.indexOf(contacts[i]);
					this.selectedContactForSave.splice(index, 1);
				}
			}
			ev.stopPropagation();
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "checkingAllContacts()");
		}
	}

	highlightRow(contactId: number, event: any) {
		try {
			let isChecked = $('#' + contactId).is(':checked');
			if (isChecked) {
				$('#row_' + contactId).addClass('contact-list-selected');
				this.selectedContactListIds.push(contactId);
			} else {
				$('#row_' + contactId).removeClass('contact-list-selected');
				this.selectedContactListIds.splice($.inArray(contactId, this.selectedContactListIds), 1);
			}
			if (this.selectedContactListIds.length == this.pagination.pagedItems.length) {
				this.isHeaderCheckBoxChecked = true;
			} else {
				this.isHeaderCheckBoxChecked = false;
			}
			event.stopPropagation();
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "checkingSelectedUser()");
		}
	}

	editContactListLoadAllUsers(contactSelectedListId: number, pagination: Pagination) {
		try {
			this.refService.loading(this.httpRequestLoader, true);
			this.httpRequestLoader.isHorizontalCss = true;
			this.showSelectedCategoryUsers = false;
			this.xtremandLogger.info("manageContacts editContactList #contactSelectedListId " + contactSelectedListId);
			this.selectedContactListId = contactSelectedListId;
			this.currentContactType = "all_contacts";
			pagination.criterias = this.criterias;
			pagination.sharedLeads = this.sharedLeads;
			this.contactService.loadUsersOfContactList(contactSelectedListId, pagination).subscribe(
				(data: any) => {
					this.xtremandLogger.info("MangeContactsComponent loadUsersOfContactList() data => " + JSON.stringify(data));
					this.contacts = data.listOfUsers;
					this.setLegalBasisOptionString(this.contacts);
					//this.contactService.allPartners = data.listOfUsers;
					this.totalRecords = data.totalRecords;
					this.xtremandLogger.log(data);
					/*if (this.checkingLoadContactsCount == true) {
						this.contactsByType.allContactsCount = data.allcontacts;
						this.contactsByType.invalidContactsCount = data.invalidUsers;
						this.contactsByType.unsubscribedContactsCount = data.unsubscribedUsers;
						this.contactsByType.activeContactsCount = data.activecontacts;
						this.contactsByType.inactiveContactsCount = data.nonactiveUsers;
						this.allUsers = this.contactsByType.allContactsCount;
					}*/
					if (this.contacts.length !== 0) {
						this.noContactsFound = false;
						this.noOfContactsDropdown = true;
					}
					else {
						this.noContactsFound = true;
						this.noOfContactsDropdown = false;
						this.pagedItems = null;
					}
					// this.refService.loading( this.httpRequestLoader, false );
					this.refService.loading(this.httpRequestLoader, false);
					pagination.totalRecords = this.totalRecords;
					pagination = this.pagerService.getPagedItems(pagination, this.contacts);
					this.checkingLoadContactsCount = false;
					this.xtremandLogger.log(this.allUsers);


					//this.loadAllContactListUsers(this.selectedContactListId, this.totalRecords, pagination.searchKey);


					var contactIds = this.pagination.pagedItems.map(function (a) { return a.id; });
					var items = $.grep(this.selectedContactListIds, function (element) {
						return $.inArray(element, contactIds) !== -1;
					});
					this.xtremandLogger.log("paginationUserIDs" + contactIds);
					this.xtremandLogger.log("Selected UserIDs" + this.selectedContactListIds);
					if (items.length == pagination.totalRecords || items.length == this.pagination.pagedItems.length) {
						this.isHeaderCheckBoxChecked = true;
					} else {
						this.isHeaderCheckBoxChecked = false;
					}

				},
				error => this.xtremandLogger.error(error),
				() => this.xtremandLogger.info("MangeContactsComponent loadUsersOfContactList() finished")
			)
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "loadingAllUsersInList()");
		}
	}

	setLegalBasisOptionString(list: any) {
		if (this.gdprStatus) {
			let self = this;
			$.each(list, function (index, contact) {
				if (self.legalBasisOptions != undefined && self.legalBasisOptions.length > 0) {
					let filteredLegalBasisOptions = $.grep(self.legalBasisOptions, function (e) { return contact.legalBasis.indexOf(e.id) > -1 });
					let selectedLegalBasisOptionsArray = filteredLegalBasisOptions.map(function (a) { return a.name; });
					contact.legalBasisString = selectedLegalBasisOptionsArray;
				}
			});
		}
	}

	setPage(event: any) {
		if (event.type == 'contacts') {
			this.pagination.pageIndex = event.page;
			this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
		} else if (this.currentContactType == "all_contacts") {
			this.pagination.searchKey = this.searchKey;
			this.pagination.pageIndex = 1;
			this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
		}
		else {
			this.contactsByType.pagination.pageIndex = event.page;
			this.listOfSelectedContactListByType(event.type);
		}
	}

	refresh() {
		this.editContacts = null;
		this.notifyParent.emit(this.editContacts);
	}

	backToEditContacts() {
		this.searchKey = null;
		this.pagination.searchKey = this.searchKey;
		this.pagination.maxResults = 12;
		this.invalidDeleteSuccessMessage = false;
		this.editListContacts = true;
		this.showAllContactData = false;
		this.showEditContactData = true;
		this.selectedInvalidContactIds = [];
		this.selectedContactListIds = [];
		this.uploadCsvUsingFile = false;
		this.showSelectedCategoryUsers = true;
		this.checkingLoadContactsCount = true;
		//this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
		this.resetResponse();
		this.contactsByType.pagination = new Pagination();
		this.contactsByType.selectedCategory = null;
		this.currentContactType = "all_contacts";
		this.selectedFilterIndex = 1
		if (this.isPartner && this.authenticationService.loggedInUserRole === "Team Member" && !this.authenticationService.isPartnerTeamMember) {
			this.resetTMSelectedFilterIndex.next(true);
			this.pagination.partnerTeamMemberGroupFilter = true;
		}
		this.setPage(1);
	}

	checkAllInvalidContacts(ev: any) {
		try {
			if (ev.target.checked) {
				console.log("checked");
				$('[name="invalidContact[]"]').prop('checked', true);
				//this.isContactList = true;
				let self = this;
				$('[name="invalidContact[]"]:checked').each(function () {
					var id = $(this).val();
					self.selectedInvalidContactIds.push(parseInt(id));
					$('#row_' + id).addClass('invalid-contacts-selected');
				});
				this.selectedInvalidContactIds = this.refService.removeDuplicates(this.selectedInvalidContactIds);
			} else {
				console.log("unceck");
				$('[name="invalidContact[]"]').prop('checked', false);
				$('#user_list_tb tr').removeClass("invalid-contacts-selected");
				if (this.pagination.maxResults == this.contactsByType.pagination.totalRecords) {
					this.selectedInvalidContactIds = [];
				} else {
					let currentPageContactIds = this.contactsByType.pagination.pagedItems.map(function (a) { return a.id; });
					this.selectedInvalidContactIds = this.refService.removeDuplicatesFromTwoArrays(this.selectedInvalidContactIds, currentPageContactIds);
				}
			}
			ev.stopPropagation();
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "checkingAllInvalidUsers()");
		}
	}

	invalidContactsSelectedUserIds(contactId: number, event: any) {
		try {
			let isChecked = $('#' + contactId).is(':checked');
			if (isChecked) {
				$('#row_' + contactId).addClass('invalid-contacts-selected');
				this.selectedInvalidContactIds.push(contactId);
			} else {
				$('#row_' + contactId).removeClass('invalid-contacts-selected');
				this.selectedInvalidContactIds.splice($.inArray(contactId, this.selectedInvalidContactIds), 1);
			}
			if (this.selectedInvalidContactIds.length == this.contactsByType.pagination.pagedItems.length) {
				this.isInvalidHeaderCheckBoxChecked = true;
			} else {
				this.isInvalidHeaderCheckBoxChecked = false;
			}
			event.stopPropagation();
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "checkingSelectedInvalidUsers()");
		}
	}

	validateUndeliverableContacts(contactId: any) {
		try {
			this.resetResponse();
			this.loading = true;
			this.xtremandLogger.info(this.selectedInvalidContactIds);
			const ids = [];
			ids.push(contactId);
			this.contactService.validateUndelivarableEmailsAddress(ids, this.assignLeads)
				.subscribe(
					data => {
						if (data.access) {
							data = data;
							this.loading = false;
							this.xtremandLogger.log(data);
							console.log("update Contacts ListUsers:" + data);
							this.checkingLoadContactsCount = true;
							//this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
							this.contactsCount(this.selectedContactListId);
							this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
							this.selectedInvalidContactIds.length = 0;

							if (this.assignLeads) {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.LEADS_EMAIL_VALIDATE_SUCCESS, true);
							} else if (this.isPartner) {
								let message = "Selected " + this.authenticationService.partnerModule.customName + "(s) have been validated successfully.";
								this.customResponse = new CustomResponse('SUCCESS', message, true);
							} else {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_EMAIL_VALIDATE_SUCCESS, true);
							}
						} else {
							this.authenticationService.forceToLogout();
						}
					},
					(error: any) => {
						console.log(error);
						this.loading = false;
					},
					() => this.xtremandLogger.info("MangeContactsComponent ValidateInvalidContacts() finished")
				)
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "removingInvalidUsers()");
		}
	}

	removeInvalidContactListUsers() {
		try {
			this.xtremandLogger.info(this.selectedInvalidContactIds);
			this.contactService.removeInvalidContactListUsers(this.selectedInvalidContactIds, this.assignLeads)
				.subscribe(
					(data: any) => {
						if (data.access) {
							$.each(this.selectedInvalidContactIds, function (index: number, value: any) {
								$('#row_' + value).remove();
								console.log(index + "value" + value);
							});
							if (this.assignLeads) {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.LEADS_DELETE_SUCCESS, true);
							} else if (this.isPartner) {
								let message = "Your " + this.authenticationService.partnerModule.customName + "(s) have been deleted successfully.";
								this.customResponse = new CustomResponse('SUCCESS', message, true);
							} else {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACTS_DELETE_SUCCESS, true);
							}

							this.checkingLoadContactsCount = true;
							this.contactsCount(this.selectedContactListId);
							//this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
							this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);

							this.selectedInvalidContactIds.length = 0;
						} else {
							this.authenticationService.forceToLogout();
						}
					},
					(error: any) => {
						//let body: string = error['_body'];
						// body = body.substring(1, body.length-1);
						if (error._body.includes('Please launch or delete those campaigns first')) {
							this.customResponse = new CustomResponse('ERROR', error._body, true);
						}
					},
					() => this.xtremandLogger.info("deleted completed")
				);
			this.invalidDeleteSuccessMessage = false;
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "remmoveInvalidUsers()");
		}
	}
	invalidContactsShowAlert() {
		if (this.selectedInvalidContactIds.length != 0) {
			this.xtremandLogger.info("contactListId in sweetAlert() ");
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "You won't be able to undo this action!",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete it!'

			}).then(function (myData: any) {
				console.log("ManageContacts showAlert then()" + myData);
				self.removeInvalidContactListUsers();
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		}
	}

	removeContactListUsers1(contactId: number) {
		try {
			this.loading = true;
			this.contactUsersId = contactId;
			this.contactIds[0] = this.contactUsersId;
			this.contactService.removeContactListUsers(this.contactListId, this.contactIds)
				.subscribe(
					(data: any) => {
						if (data.access) {
							if (data.statusCode == 201) {
								if (this.assignLeads) {
									this.customResponse = new CustomResponse('SUCCESS', this.properties.LEADS_DELETE_SUCCESS, true);
								} else if (!this.isPartner) {
									this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACTS_DELETE_SUCCESS, true);
								} else {
									let message = "Your " + this.authenticationService.partnerModule.customName + "(s) have been deleted successfully.";
									this.customResponse = new CustomResponse('SUCCESS', message, true);
								}
								this.selectedContactListIds = [];
								this.isHeaderCheckBoxChecked = false;
								this.checkingLoadContactsCount = true
								this.editContactListLoadAllUsers(this.contactListId, this.pagination);
								this.contactsCount(this.selectedContactListId);
								this.loading = false;
							} else {
								this.loading = false;
								$('#contactListDiv_' + this.contactListId).remove();
								if (data.isEmptyFormList) {
									this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true);
									this.contactService.isEmptyFormList = true;
								} else {
									this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true);
								}
								//this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true);
								this.contactService.deleteUserSucessMessage = true;
								this.goBackToManageList();
								if (this.isCompanyBreadCrumb) {
									this.goBackToCompaniesList();
								}
							}
							this.contactIds = [];
						} else {
							this.authenticationService.forceToLogout();
						}
					},
					(error: any) => {
						this.loading = false;
						// let body: string = error['_body'];
						//body = body.substring(1, body.length-1);
						if (error._body.includes('Please launch or delete those campaigns first')) {
							this.customResponse = new CustomResponse('ERROR', error._body, true);
						} else {
							this.xtremandLogger.errorPage(error);
						}
						console.log(error);
					},
					() => this.xtremandLogger.info("deleted completed")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "removeUsers()");
		}
	}

	deleteContactList() {
		try {
			this.xtremandLogger.info("MangeContacts deleteContactList : " + this.selectedContactListId);
			this.contactService.deleteContactList(this.selectedContactListId)
				.subscribe(
					data => {
						console.log("MangeContacts deleteContactList success : " + data);
						$('#contactListDiv_' + this.selectedContactListId).remove();
						this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true);
						this.contactService.deleteUserSucessMessage = true;
						this.refresh();
					},
					(error: any) => {
						//let body: string = error['_body'];
						//body = body.substring(1, body.length-1);
						if (error._body.includes('Please launch or delete those campaigns first')) {
							this.customResponse = new CustomResponse('ERROR', error._body, true);
						} else {
							this.xtremandLogger.errorPage(error);
						}
						console.log(error);
					},
					() => this.xtremandLogger.info("deleted completed")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "deletingContactList()");
		}
	}

	deleteUserShowAlert(contactId: number) {
		this.contactIds.push(this.contactUsersId)
		this.xtremandLogger.info("contactListId in sweetAlert() " + this.contactIds);
		let message = '';
		let partnerModuleCustomName = this.authenticationService.partnerModule.customName;
		if (this.assignLeads) {
			message = "The lead(s) will be deleted and this action can't be undone.";
		} else if (this.isPartner && this.isDefaultPartnerList) {
			message = 'The ' + partnerModuleCustomName + '(s) will be deleted from this and all other ' + partnerModuleCustomName + ' lists.';
		} else if (this.isPartner && !this.isDefaultPartnerList) {
			message = 'This will only delete the ' + partnerModuleCustomName + '(s) from this list. To remove the ' + partnerModuleCustomName + '(s) completely from your account, please delete the record(s) from the Master List.';
		} else {
			message = "The contact(s) will be deleted and this action can't be undone.";
		}

		let self = this;

		swal({
			title: 'Are you sure?',
			text: message,
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Yes, delete it!'

		}).then(function (myData: any) {
			self.removeContactListUsers1(contactId);
		}, function (dismiss: any) {
			console.log('you clicked on option' + dismiss);
		});



		// if (this.totalRecords != 1) {
		// 	swal({
		// 		title: 'Are you sure?',
		// 		text: message,
		// 		type: 'warning',
		// 		showCancelButton: true,
		// 		swalConfirmButtonColor: '#54a7e9',
		// 		swalCancelButtonColor: '#999',
		// 		confirmButtonText: 'Yes, delete it!'

		// 	}).then(function(myData: any) {
		// 		console.log("ManageContacts showAlert then()" + myData);
		// 		//self.removeContactListUsers1(contactId);
		// 	}, function(dismiss: any) {
		// 		console.log('you clicked on option' + dismiss);
		// 	});
		// }

		// if (this.totalRecords === 1 && (!this.isDefaultPartnerList)) {
		// 	swal({
		// 		title: 'Are you sure?',
		// 		text: "Deleting all the " + this.checkingContactTypeName + "s" + " in this list will also cause the list to be deleted. You won't be able to undo this action. ",
		// 		type: 'warning',
		// 		showCancelButton: true,
		// 		swalConfirmButtonColor: '#54a7e9',
		// 		swalCancelButtonColor: '#999',
		// 		confirmButtonText: 'Yes, delete it!'

		// 	}).then(function(myData: any) {
		// 		console.log("ManageContacts showAlert then()" + myData);
		// 		self.removeContactListUsers1(contactId);
		// 	}, function(dismiss: any) {
		// 		console.log('you clicked on option' + dismiss);
		// 	});
		// }
		// if (this.totalRecords === 1 && this.isDefaultPartnerList) {
		// 	swal({
		// 		title: 'Are you sure?',
		// 		text: "You won't be able to undo this action!",
		// 		type: 'warning',
		// 		showCancelButton: true,
		// 		swalConfirmButtonColor: '#54a7e9',
		// 		swalCancelButtonColor: '#999',
		// 		confirmButtonText: 'Yes, delete it!'

		// 	}).then(function(myData: any) {
		// 		console.log("ManageContacts showAlert then()" + myData);
		// 		self.removeContactListUsers1(contactId);
		// 	}, function(dismiss: any) {
		// 		console.log('you clicked on option' + dismiss);
		// 	});
		// }

	}

	showingContactDetails(contactType: string) {
		this.resetResponse();
		this.contactsByType.pagination = new Pagination();
		this.contactsByType.selectedCategory = contactType;
		this.selectedFilterIndex = 1;
		if (this.isPartner && this.authenticationService.loggedInUserRole === "Team Member" && !this.authenticationService.isPartnerTeamMember) {
			this.resetTMSelectedFilterIndex.next(true);
			this.contactsByType.pagination.partnerTeamMemberGroupFilter = true;
		}
		this.listOfSelectedContactListByType(contactType);
	}

	listOfSelectedContactListByType(contactType: string) {
		try {
			if (contactType == undefined) {
				contactType = 'all';
				this.contactsByType.pagination.pageIndex = 1;
			}

			if (contactType === 'all') {
				this.currentContactType = "all_contacts";
			} else {
				this.currentContactType = '';
			}

			this.showAllContactData = true;
			this.showEditContactData = false;
			this.contactsByType.isLoading = true;
			this.resetListContacts();
			this.resetResponse();
			if (this.editListContacts == true) {
				this.searchKey = null;
				this.editListContacts = false;
			}
			this.refService.loading(this.httpRequestLoader, true);
			this.httpRequestLoader.isHorizontalCss = true;
			this.contactsByType.pagination.criterias = this.criterias;
			this.contactService.listOfSelectedContactListByType(this.selectedContactListId, contactType, this.contactsByType.pagination)
				.subscribe(
					data => {
						this.contactsByType.selectedCategory = contactType;
						this.contactsByType.contacts = data.listOfUsers;
						this.setLegalBasisOptionString(data.listOfUsers);
						this.contactsByType.pagination.totalRecords = data.totalRecords;
						this.contactsByType.pagination = this.pagerService.getPagedItems(this.contactsByType.pagination, this.contactsByType.contacts);

						if (this.contactsByType.selectedCategory == 'invalid') {
							this.userListIds = data.listOfUsers;
						}

						var contactIds = this.pagination.pagedItems.map(function (a) { return a.id; });
						var items1 = $.grep(this.selectedInvalidContactIds, function (element) {
							return $.inArray(element, contactIds) !== -1;
						});
						this.xtremandLogger.log("inavlid contacts page pagination Object Ids" + contactIds);
						this.xtremandLogger.log("selected inavalid contacts Ids" + this.selectedInvalidContactIds);

						if (items1.length == this.contactsByType.pagination.totalRecords || items1.length == this.contactsByType.pagination.pagedItems.length) {
							this.isInvalidHeaderCheckBoxChecked = true;
						} else {
							this.isInvalidHeaderCheckBoxChecked = false;
						}
						this.refService.loading(this.httpRequestLoader, false);
						this.contactsByType.isLoading = false;

					},
					error => console.log(error),
					() => {
						this.contactsByType.isLoading = false;
					}
				);
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "loadingDetailsOfContactList()");
		}
	}

	resetListContacts() {
		this.sortOption = this.sortOptions[0];
		this.showSelectedCategoryUsers = false;
		this.contactsByType.contacts = [];
	}

	sortByOption(event: any, selectedType: string) {
		try {
			this.resetResponse();
			this.sortOption = event;
			const sortedValue = this.sortOption.value;
			if (sortedValue !== '') {
				const options: string[] = sortedValue.split('-');
				this.sortcolumn = options[0];
				this.sortingOrder = options[1];
			} else {
				this.sortcolumn = null;
				this.sortingOrder = null;
			}

			if (this.currentContactType == "all_contacts") {
				this.pagination.pageIndex = 1;
				this.pagination.sortcolumn = this.sortcolumn;
				this.pagination.sortingOrder = this.sortingOrder;
				this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
			} else {
				this.contactsByType.pagination.pageIndex = 1;
				this.contactsByType.pagination.sortcolumn = this.sortcolumn;
				this.contactsByType.pagination.sortingOrder = this.sortingOrder;
				this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
			}
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "sorting()");
		}
	}

	search(searchType: string) {
		this.resetResponse();
		this.searchContactType = this.searchContactType;
		try {
			if (this.currentContactType == "all_contacts") {
				this.pagination.searchKey = this.searchKey;
				this.pagination.pageIndex = 1;
				this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
			} else {
				this.contactsByType.pagination.searchKey = this.searchKey;
				this.contactsByType.pagination.pageIndex = 1;
				this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
			}
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "searching()");
		}
	}

	addContactsOption(addContactsOption: number) {
		this.resetResponse();
		this.selectedAddContactsOption = addContactsOption;
		if (addContactsOption === 0) {
			// this.addRow();
			console.log(addContactsOption)
		} else if (addContactsOption === 1) {
			this.copyFromClipboard();
			this.isShowUsers = false;
		}
	}

	resetResponse() {
		this.customResponse.responseType = null;
		this.customResponse.responseMessage = null;
		this.customResponse.isVisible = false;
	}

	addContactModalOpen() {
		this.resetResponse();
		this.addContactuser = new User();
		this.isUpdateUser = false;
		this.updateContactUser = false;
		this.contactAllDetails = null;
		this.contactService.isContactModalPopup = true;
	}

	addContactModalClose() {
		$('#addContactModal').modal('toggle');
		$("#addContactModal .close").click()
	}


	validateEmail(emailId: string) {
		const lowerCaseEmail = emailId.toLowerCase();
		if (this.validateEmailAddress(emailId)) {
			this.checkingForEmail = true;
			this.validEmailPatternSuccess = true;
		}
		else {
			this.checkingForEmail = false;
		}
		if (lowerCaseEmail != this.editingEmailId) {
			for (let i = 0; i < this.contacts.length; i++) {
				if (lowerCaseEmail == this.contacts[i].emailId) {
					this.isEmailExist = true;
					this.existedEmailIds.push(emailId);
					break;
				} else {
					this.isEmailExist = false;
				}
			}
		}
	}

	checkingEmailPattern(emailId: string) {
		this.validEmailPatternSuccess = false;
		if (this.validateEmailAddress(emailId)) {
			this.validEmailPatternSuccess = true;
			this.emailNotValid = true;
		} else {
			this.validEmailPatternSuccess = false;
			this.emailNotValid = false;
		}
	}

	addCopyToField() {
		this.loadContactListsNames();
		if (this.contactListName == undefined) {
			this.contactListName = this.contactService.partnerListName;
		}
		if (this.isDefaultPartnerList == true && this.contactListName.includes('_copy')) {
			this.contactListName + '_copy'
		}
		this.saveAsListName = this.contactListName + '_copy';
		return this.saveAsListName;
	}
	saveAs(showGDPR: boolean) {
		if (this.selectedContactForSave.length === 0) {
			this.customResponse = new CustomResponse('ERROR', "Please select atleast one " + (this.checkingContactTypeName).toLowerCase() + " to create the list", true);
		} else {
			try {
				this.showGDPR = showGDPR;
				if (this.showGDPR) {
					this.saveAsListName = this.addCopyToField();
				} else {
					this.saveAsListName = this.contactListName;
				}
			} catch (error) {
				this.xtremandLogger.error(error, "editContactComponent", "SaveAsNewListSweetAlert()");
			}
		}
	}
	editListName() {
		this.saveAsListName = this.selectedContactListName;
   }
	closeSaveAsModal() {
		this.saveAsListName = undefined;
		this.refService.namesArray = undefined;
	}
	saveDuplicateContactList(name: string, selectedLegalBasisOptions: any, isPublic: boolean) {
		try {

			if (name != "") {
				this.contactService.isLoadingList = true;
				this.contactListObject = new ContactList;
				this.contactListObject.name = name;
				this.contactListObject.isPartnerUserList = this.isPartner;
				if (this.selectedContactListIds.length === 0) {
					let listUsers = [];
					if (this.isPartner == true && this.addPartnerSave == true) {
						listUsers = this.contactService.allPartners;
					} else {
						listUsers = this.totalListUsers;
					}
					$.each(listUsers, function (index, value: User) {
						value.legalBasis = selectedLegalBasisOptions;
					});
					console.log(listUsers);
					this.userUserListWrapper = this.manageContact.getUserUserListWrapperObj(listUsers, name, this.isPartner, isPublic,
						"CONTACT", "MANUAL", null, false);
					this.contactService.saveContactList(this.userUserListWrapper)
						.subscribe(
							data => {
								if (data.access) {
									$('#saveAsEditModal').modal('hide');
									this.saveAsError = '';
									this.saveAsListName = '';
									this.saveAsListName = undefined;
									this.goToContactOrPartnerUrl();
									this.contactService.saveAsSuccessMessage = "SUCCESS";
									this.contactService.isLoadingList = false;
								} else {
									this.authenticationService.forceToLogout();
								}
							},
							(error: any) => {
								this.xtremandLogger.error(error);
								if (JSON.parse(error._body).message.includes('email addresses in your contact list')) {
									this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
									if (this.addPartnerSave == true) {
										this.contactService.saveAsSuccessMessage = "saveAsPartnerError";
										this.contactService.saveAsErrorMessage = JSON.parse(error._body).message;
										this.goToContactOrPartnerUrl();
									}
								} else { this.xtremandLogger.errorPage(error); }
							},
							() => this.xtremandLogger.info("allcontactComponent saveSelectedUsers() finished")
						)
				} else {
					for (let i = 0; i < this.selectedContactForSave.length; i++) {
						this.selectedContactForSave[i].legalBasis = selectedLegalBasisOptions;
					}

					const map = {};
					const newArray = [];
					this.selectedContactForSave.forEach(el => {
						if (!map[JSON.stringify(el)]) {
							map[JSON.stringify(el)] = true;
							newArray.push(el);
						}
					});
					this.selectedContactForSave = newArray;
					this.userUserListWrapper = this.manageContact.getUserUserListWrapperObj(this.selectedContactForSave, name, this.isPartner, isPublic,
						"CONTACT", "MANUAL", null, false);
					this.contactService.saveContactList(this.userUserListWrapper)
						.subscribe(
							data => {
								this.goToContactOrPartnerUrl();
								this.contactService.saveAsSuccessMessage = "SUCCESS";
							},
							(error: any) => {
								try {
									this.xtremandLogger.error(error);
									if (JSON.parse(error._body).message.includes('email addresses in your contact list')) {
										this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
										if (this.addPartnerSave == true) {
											this.contactService.saveAsSuccessMessage = "saveAsPartnerError";
											this.contactService.saveAsErrorMessage = JSON.parse(error._body).message;
											this.goToContactOrPartnerUrl();
										}
									} else { this.xtremandLogger.errorPage(error); }
								} catch (err) { this.xtremandLogger.error(err); }
							},
							() => this.xtremandLogger.info("allcontactComponent saveSelectedUsers() finished")
						)
				}
				this.contactService.isLoadingList = false;
			}
			else {
				this.xtremandLogger.error("AllContactComponent saveSelectedUsers() UserNotSelectedContacts");
			}
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "SaveAsNewList()");
		}
	}
	goToContactOrPartnerUrl() {
		const url = !this.isPartner ? 'contacts' : 'partners';
		this.router.navigateByUrl('/home/' + url + '/manage')
		this.contactService.isLoadingList = false;
	}
	toggle(i: number) {
		const className = $('#more_' + i).attr('class');
		if (className === 'hidden') {
			$('#more_' + i).removeClass('hidden');
			$('#more_' + i).addClass('show-more');
			$("#more_less_button_" + i).attr('value', 'less');
		} else {
			$('#more_' + i).removeClass('show-more');
			$('#more_' + i).addClass('hidden');
			$("#more_less_button_" + i).attr('value', 'more');
		}
	}

	modelForSeg() {
		this.resetResponse();
		this.addNewRow();
		this.criteria.property = this.filterOptions[0].value;
		this.criteria.operation = this.filterConditions[0].value;
	}

	removeSegmentation() {
		this.isSegmentation = false;
		this.criterias.length = 0;
		this.checkingLoadContactsCount = true;
		this.selectedAddContactsOption = 8;
		if (this.currentContactType == "all_contacts") {
			this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
		} else {
			this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
		}
	}

	addNewRow() {
		let criteria = new Criteria();
		this.criterias.push(criteria);
	}

	cancelSegmentation() {
		this.criterias.length = 0;
		this.isSegmentationErrorMessage = false;
		this.filterConditionErrorMessage = "";
	}

	eventEnterKeyHandler(keyCode: any) {
		if (keyCode === 13) {
			this.contactFilter();
		}
	}

	contactFilter() {
		try {
			for (let i = 0; i < this.criterias.length; i++) {
				if (this.criterias[i].property == "Field Name*" || this.criterias[i].operation == "Condition*" || (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "")) {
					this.isSegmentationErrorMessage = true;
					if (this.criterias[i].property == "Field Name*" && this.criterias[i].operation == "Condition*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "")) {
						this.filterConditionErrorMessage = "Please fill the required data at position " + (i + 1);
					} else if (this.criterias[i].property == "Field Name*" && this.criterias[i].operation == "Condition*") {
						this.filterConditionErrorMessage = "Please select the Field Name and Condition at position " + (i + 1);
					} else if (this.criterias[i].property == "Field Name*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "")) {
						this.filterConditionErrorMessage = "Please select the Field Name and Value at position " + (i + 1);
					} else if (this.criterias[i].operation == "Condition*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "")) {
						this.filterConditionErrorMessage = "Please select the Condition and Value at position " + (i + 1);
					} else if (this.criterias[i].operation == "Condition*") {
						this.filterConditionErrorMessage = "Please select the Condition at position " + (i + 1);
					} else if (this.criterias[i].property == "Field Name*") {
						this.filterConditionErrorMessage = "Please select the Field Name at position " + (i + 1);
					} else if (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "") {
						this.filterConditionErrorMessage = "Please fill the value at position " + (i + 1);
					}
					break;
				} else {
					this.isSegmentationErrorMessage = false;
				}
			}


			if (!this.isSegmentationErrorMessage) {
				for (let i = 0; i < this.criterias.length; i++) {
					if (this.criterias[i].operation == "=") {
						this.criterias[i].operation = "eq";
					}

					if (this.criterias[i].operation == "Contains") {
						this.criterias[i].operation = "like";
					}

					if (this.criterias[i].property == "First Name") {
						this.criterias[i].property = "firstName";
					}
					else if (this.criterias[i].property == "Last Name") {
						this.criterias[i].property = "lastName";
					}
					else if (this.criterias[i].property == "Company") {
						this.criterias[i].property = "contactCompany";
					}
					else if (this.criterias[i].property == "Job Title") {
						this.criterias[i].property = "jobTitle";
					}
					else if (this.criterias[i].property == "Email Id") {
						this.criterias[i].property = "emailId";
					}
					else if (this.criterias[i].property == "Country") {
						this.criterias[i].property = "country";
					}
					else if (this.criterias[i].property == "City") {
						this.criterias[i].property = "city";
					}
					else if (this.criterias[i].property == "Mobile Number") {
						this.criterias[i].property = "mobileNumber";
					}
					else if (this.criterias[i].property == "Notes") {
						this.criterias[i].property = "description";
					}
					console.log(this.criterias[i].operation);
					console.log(this.criterias[i].property);
					console.log(this.criterias[i].value1);
				}
			}

			console.log(this.criterias);
			if (!this.isSegmentationErrorMessage) {
				if (this.currentContactType == "all_contacts") {
					this.checkingLoadContactsCount = true;
					this.pagination.pageIndex = 1;
					this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
				} else {
					this.contactsByType.pagination.pageIndex = 1;
					this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
				}
				this.isSegmentation = true;

				$('#filterModal').modal('toggle');
				$("#filterModal .close").click();
				$('#filterModal').modal('hide');

				this.isSegmentationErrorMessage = false;
				this.selectedAddContactsOption = 9;
			}
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "ContactFilter()");
		}
	}

	cancelSegmentationRow(rowId: number) {
		if (rowId !== -1) {
			this.criterias.splice(rowId, 1);
		}
	}

	downloadEmptyCsv() {
		this.resetResponse();
		if (this.isPartner) {
			window.location.href = this.authenticationService.REST_URL + "userlists/download-default-list/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;
		} else {
			window.location.href = this.authenticationService.MEDIA_URL + "UPLOAD_USER_LIST _EMPTY.csv";
		}
	}

	loadAllContactListUsers(contactSelectedListId: number, totalRecords: number, searchKey: any) {
		try {
			this.selectedContactListId = contactSelectedListId;
			this.gettingAllUserspagination.maxResults = totalRecords;
			this.gettingAllUserspagination.pageIndex = 1;
			this.gettingAllUserspagination.searchKey = searchKey;
			this.contactService.loadUsersOfContactList(contactSelectedListId, this.gettingAllUserspagination)
				.subscribe(
					(data: any) => {
						console.log(data.listOfUsers);
						this.totalListUsers = data.listOfUsers;
						//this.setLegalBasisOptionString(data.listOfUsers);
					},
					error => this.xtremandLogger.error(error),
					() => this.xtremandLogger.info("MangeContactsComponent loadUsersOfContactList() finished")
				)
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "loadingAllUsersOfContactList()");
		}
	}

	editUserDetails(contactDetails) {
		this.updateContactUser = true;
		this.isUpdateUser = true;
		this.contactAllDetails = contactDetails;
		this.contactService.isContactModalPopup = true;
		this.isCompanyContact = this.manageCompanies;
		this.selectedCompanyContactId = this.selectedCompanyId;
	}

	updateContactModalClose() {
		this.addContactModalClose();
		this.updateContactUser = false;
		this.updatedUserDetails.length = 0;
		this.isEmailExist = false;
	}

	updateContactListUser(event) {
		try {
			this.loading = true;
			this.editUser.pagination = this.pagination;
			this.editUser.pagination.partnerCompanyId = this.contactAllDetails.companyId;
			if (event.mobileNumber) {
				if (event.mobileNumber.length < 6) {
					event.mobileNumber = "";
				}
			}

			if (event.country === "Select Country") {
				event.country = null;
			}

			this.editUser.user = event;
			this.addContactModalClose();
			this.contactService.updateContactListUser(this.selectedContactListId, this.editUser)
				.subscribe(
					(data: any) => {
						this.loading = false;
						if (data.access) {
							if (this.assignLeads) {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.LEADS_UPDATE_SUCCESS, true);
							} else if (!this.isPartner) {
								this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACTS_UPDATE_SUCCESS, true);
							} else {
								let customMessage = this.authenticationService.partnerModule.customName;
								let message = "Your " + customMessage + " has been updated successfully.";
								this.customResponse = new CustomResponse('SUCCESS', message, true);
							}
							this.updateContactUser = false;
							this.isUpdateUser = false;
							this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
						} else {
							this.authenticationService.forceToLogout();
						}
					},
					error => {
						this.xtremandLogger.error(error);
						this.loading = false
					},
					() => this.xtremandLogger.info("EditContactsComponent updateContactListUser() finished")
				)
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "updatingUser()");
		}
	}

	updateContactListNameAlert() {
		try {
			let self = this;
			swal({
				//title: this.checkingContactTypeName + ' List Name',
				title: "<span style='font-weight: 100;font-family: Open Sans;font-size: 24px;'>Update List Name</span>",
				input: 'text',
				inputValue: this.selectedContactListName,
				showCancelButton: true,
				padding: 20,
				confirmButtonText: 'Update',
				//showLoaderOnConfirm: true,
				allowOutsideClick: false,
				customClass: "sweet-alert",
				preConfirm: function (name: any) {
					return new Promise(function () {
						var inputName = name.toLowerCase().replace(/\s/g, '');
						if ($.inArray(inputName, self.names) > -1) {
							swal.showValidationError('This list name is already taken.')
						} else {
							if (name != "" && name.length < 250) {
								swal.close();
								self.updateContactListName(name);
							} else {
								if (name == "") {
									swal.showValidationError('List Name is Required..')
								}
								else {
									swal.showValidationError("You have exceeded 250 characters!");
								}
							}
						}
					});
				}
			}).then(function (name: any) {
				self.updateContactListName(name);
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "listNameUpdateAlert()");
		}
	}

	updateContactListName(newContactListName: string) {
		try {
			var object = {
				"id": this.selectedContactListId,
				"name": newContactListName
			}
			this.addContactModalClose();
			this.contactService.updateContactListName(object)
				.subscribe(
					(data: any) => {
						this.selectedContactListName = newContactListName;
						if (this.isPartner) {
							let message = "Your " + this.authenticationService.partnerModule.customName + " list name has been updated successfully.";
							this.customResponse = new CustomResponse('SUCCESS', message, true);
						} else {
							this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_NAME_UPDATE_SUCCESS, true);
						}
					},
					error => this.xtremandLogger.error(error),
					() => this.xtremandLogger.info("EditContactsComponent updateContactListName() finished")
				)
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "listNameUpdating()");
		}
	}

	loadContactListsNames() {
		try {
			this.contactService.loadContactListsNames()
				.subscribe(
					(data: any) => {
						this.xtremandLogger.info(data);
						this.names.length = 0;
						for (let i = 0; i < data.names.length; i++) {
							this.names.push(data.names[i].replace(/\s/g, ''));
						}
						console.log(this.names);
						this.refService.namesArray = this.names;
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.info("editContactComponent loadContactListsName() finished")
				)
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "loadingAllContactListNames()");
		}
	}

	downloadFile(data: any) {
		this.resetResponse();
		let parsedResponse = data.text();
		let blob = new Blob([parsedResponse], { type: 'text/csv' });
		let url = window.URL.createObjectURL(blob);

		if (navigator.msSaveOrOpenBlob) {
			navigator.msSaveBlob(blob, 'Contact_List.csv');
		} else {
			let a = document.createElement('a');
			a.href = url;
			a.download = this.contactListName.substr(0, 26) + '_' + this.checkingContactTypeName + '_List.csv';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
		window.URL.revokeObjectURL(url);
	}

	hasAccess() {
		if (this.assignLeads) {
			this.downloadList();
		} else {
			try {
				this.contactService.hasAccess(this.isPartner)
					.subscribe(
						data => {
							const body = data['_body'];
							const response = JSON.parse(body);
							let access = response.access;
							if (access) {
								if (this.isPartner && this.authenticationService.loggedInUserRole === "Team Member" && !this.authenticationService.isPartnerTeamMember) {
									this.refService.setTeamMemberFilterForPagination(this.downloadAssociatedPagination, this.selectedFilterIndex);
								}
								this.downloadList();
							} else {
								this.authenticationService.forceToLogout();
							}
						}
					);
			} catch (error) {
				this.xtremandLogger.error(error, "ManageContactsComponent", "downloadList()");
			}
		}
	}

	downloadList() {
		try {
			this.downloadAssociatedPagination.userListId = this.contactListId;
			this.downloadAssociatedPagination.userId = this.authenticationService.getUserId();
			this.contactService.downloadContactList(this.downloadAssociatedPagination)
				.subscribe(
					data => {
						this.downloadFile(data);
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.info("download completed")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "downloading list()");
		}
	}

	hasAccessForDownloadUndeliverableContacts() {
		if (this.assignLeads) {
			this.listOfAllSelectedContactListByType();
		} else {
			try {
				if (this.isPartner && this.authenticationService.loggedInUserRole === "Team Member" && !this.authenticationService.isPartnerTeamMember) {
					this.refService.setTeamMemberFilterForPagination(this.contactsByType.contactPagination, this.selectedFilterIndex);
				}
				this.contactService.hasAccess(this.isPartner)
					.subscribe(
						data => {
							const body = data['_body'];
							const response = JSON.parse(body);
							let access = response.access;
							if (access) {
								this.listOfAllSelectedContactListByType()
								// this.downloadContactTypeList();
							} else {
								this.authenticationService.forceToLogout();
							}
						}
					);
			} catch (error) {
				this.xtremandLogger.error(error, "ManageContactsComponent", "downloadList()");
			}
		}
	}

	downloadContactTypeList() {
		if (this.contactsByType.selectedCategory === 'active') {
			this.logListName = this.selectedContactListName + '_list_Active_' + this.checkingContactTypeName + 's.csv';
		} else if (this.contactsByType.selectedCategory === 'non-active') {
			this.logListName = this.selectedContactListName + '_list_Inactive_' + this.checkingContactTypeName + 's.csv';
		} else if (this.contactsByType.selectedCategory === 'invalid') {
			this.logListName = this.selectedContactListName + '_list_Invalid_' + this.checkingContactTypeName + 's.csv';
		} else if (this.contactsByType.selectedCategory === 'unsubscribe') {
			this.logListName = this.selectedContactListName + '_list_Unsubscribe_' + this.checkingContactTypeName + 's.csv';
		} else if (this.contactsByType.selectedCategory === 'valid') {
			this.logListName = this.selectedContactListName + '_list_Valid_' + this.checkingContactTypeName + 's.csv';
		} else if (this.contactsByType.selectedCategory === 'excluded') {
			this.logListName = this.selectedContactListName + '_list_Excluded_' + this.checkingContactTypeName + 's.csv';
		}
		this.downloadDataList.length = 0;
		for (let i = 0; i < this.contactsByType.listOfAllContacts.length; i++) {

			var object = {
				"First Name": this.contactsByType.listOfAllContacts[i].firstName,
				"Last Name": this.contactsByType.listOfAllContacts[i].lastName,
				"Company": this.contactsByType.listOfAllContacts[i].contactCompany,
				"Job Title": this.contactsByType.listOfAllContacts[i].jobTitle,
				"Email Id": this.contactsByType.listOfAllContacts[i].emailId,
				"Address": this.contactsByType.listOfAllContacts[i].address,
				"City": this.contactsByType.listOfAllContacts[i].city,
				"Country": this.contactsByType.listOfAllContacts[i].country,
				"Mobile Number": this.contactsByType.listOfAllContacts[i].mobileNumber,
				//"Notes": this.contactsByType.listOfAllContacts[i].description
			}
			if(this.contactsByType.selectedCategory === 'excluded'){
				object["Excluded Catagory"] = this.contactsByType.listOfAllContacts[i].excludedCatagory
			}
			if (this.contactsByType.selectedCategory === 'unsubscribe') {
				object["Unsubscribed Reason"] = this.contactsByType.listOfAllContacts[i].unsubscribedReason;
			}
			this.downloadDataList.push(object);
		}
		if (this.contactsByType.listOfAllContacts.length === 0) {
			var object = {
				"First Name": null,
				"Last Name": null,
				"Company": null,
				"Job Title": null,
				"Email Id": null,
				"Address": null,
				"City": null,
				"Country": null,
				"Mobile Number": null
			}
			if(this.contactsByType.selectedCategory === 'excluded'){
				object["Excluded Catagory"] = null;
			}
			if (this.contactsByType.selectedCategory === 'unsubscribe') {
				object["Unsubscribed Reason"] = null;
			}
			this.downloadDataList.push(object);
		}

		this.refService.isDownloadCsvFile = true;
	}

	listOfAllSelectedContactListByType() {
		try {
			this.contactsByType.isLoading = true;
			this.currentContactType = '';
			// this.resetListContacts();
			// this.resetResponse();
			this.contactsByType.contactPagination.maxResults = this.contactsByType.allContactsCount;
			this.contactService.listOfSelectedContactListByType(this.selectedContactListId, this.contactsByType.selectedCategory, this.contactsByType.contactPagination)
				.subscribe(
					data => {
						//	this.contactsByType.selectedCategory = contactType;
						this.contactsByType.listOfAllContacts = data.listOfUsers;
						this.downloadContactTypeList();
						// this.contactsByType.contactPagination.totalRecords = data.totalRecords;
						//	this.contactsByType.contactPagination = this.pagerService.getPagedItems(this.contactsByType.contactPagination, this.contactsByType.contacts);
					},
					error => console.log(error),
					() => {
						this.contactsByType.isLoading = false;
					}
				);
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "loadingAllDetailsOfContactList()");
		}
	}

	contactCompanyChecking(contactCompany: string) {
		if (contactCompany.trim() != '') {
			this.isCompanyDetails = true;
		} else {
			this.isCompanyDetails = false;
		}
	}

	getContactsAssocialteCampaigns() {
		try {
			this.contactService.contactListAssociatedCampaigns(this.selectedContactListId, this.contactAssociatedCampaignPagination)
				.subscribe(
					data => {
						this.contactsByType.contactListAssociatedCampaigns = data.data;
						if (this.contactsByType.contactListAssociatedCampaigns) {
							this.openCampaignModal = true;
						}
					},
					error => console.log(error),
					() => {
						this.contactsByType.isLoading = false;
					}
				);
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "gettingAssociatedCampaignList()");
		}
	}


	closeModal(event) {
		if (event == "Emails Send Successfully") {
			if (this.isPartner) {
				let message = "Your " + this.authenticationService.partnerModule.customName + " list has been updated successfully and any selected campaigns have been launched.";
				this.customResponse = new CustomResponse('SUCCESS', message, true);
			} else {
				this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_SAVE_SUCCESS_AND_MAIL_SENT_SUCCESS, true);
			}
		}

		if (event === "users are unSubscribed for emails") {
			this.customResponse = new CustomResponse('ERROR', "The " + this.checkingContactTypeName + "s are unsubscribed for receiving the campaign emails.", true);
		}

		if (event === "user has unSubscribed for emails") {
			this.customResponse = new CustomResponse('ERROR', "The " + this.checkingContactTypeName + " has unsubscribed for receiving the campaign emails.", true);
		}

		if (event == "Emails Sending failed") {
			this.customResponse = new CustomResponse('ERROR', "Failed to send Emails", true);
		}

		this.openCampaignModal = false;
		this.contactsByType.contactListAssociatedCampaigns.length = 0;
	}

	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(this.searchContactType); } }

	sendMail(partnerId: number) {
		this.emailNotificationCustomResponse = new CustomResponse();
		this.loading = true;
		try {
			this.pagination.partnerId = partnerId;
			this.pagination.userListId = this.selectedContactListId;
			this.pagination.userId = this.authenticationService.getUserId();
			this.contactService.mailSend(this.pagination)
				.subscribe(
					data => {
						this.emailNotificationCustomResponse = new CustomResponse('SUCCESS', this.properties.EMAIL_SENT_SUCCESS, true);
						this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
						this.loading = false;
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.loading = false;
					},
					() => this.xtremandLogger.log("Manage Partner component Mail send method successfull")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "resending Partner email");
		}
	}

	activateUnsubscribedUser(selectContactId: any) {
		try {
			this.contactService.activateUnsubscribedUser(selectContactId)
				.subscribe(
					data => {
						console.log(data);
						if (data == "User is successfully resubscribed") {
							swal(this.checkingContactTypeName + ' re-subscribed successfully');
							this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
							this.contactsCount(this.selectedContactListId);
						}
					},
					(error: any) => {
						this.xtremandLogger.error(error);
					},
					() => this.xtremandLogger.log("EditPartnerComponent resubscribe method successfull")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "EditPartnerComponent", " resubscribe method");
		}

	}

	navigateToTermsOfUse() {
		window.open("https://www.xamplify.com/terms-conditions/", "_blank");
	}

	navigateToPrivacy() {
		window.open("https://www.xamplify.com/privacy-policy/", "_blank");
	}

	navigateToGDPR() {
		window.open("https://gdpr-info.eu/", "_blank");
	}

	navigateToCCPA() {
		window.open("https://www.caprivacy.org/", "_blank");
	}

	ngOnInit() {
		try {
			this.currentContactType = "all_contacts";
			if (this.isPartner && this.authenticationService.loggedInUserRole === "Team Member" && !this.authenticationService.isPartnerTeamMember) {
				this.pagination.partnerTeamMemberGroupFilter = true;
			}
			if(this.router.url.includes('home/contacts')){
				this.checkSyncStatus();
			}	
			this.getLegalBasisOptions();
			this.loadContactListsNames();
			this.selectedContactListName = this.contactListName;
			this.checkingLoadContactsCount = true;
			this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
			this.contactsCount(this.selectedContactListId);
			let self = this;
			this.uploader = new FileUploader({
				allowedMimeType: ["application/vnd.ms-excel", "text/plain", "text/csv", "application/csv"],
				url: URL + "userlist/" + this.selectedContactListId + "/update?&access_token=" + this.authenticationService.access_token
			});
			this.uploader.onBuildItemForm = function (fileItem: any, form: FormData) {
				form.append('userListId', this.selectedContactListId);
				return { fileItem, form }
			};
			/********Check Gdpr Settings******************/
			this.checkTermsAndConditionStatus();
			this.contactService.deleteUserSucessMessage = false;
		}
		catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "ngOnInit()");
		}
	}



	checkTermsAndConditionStatus() {
		if (this.companyId > 0) {
			this.loading = true;
			this.userService.getGdprSettingByCompanyId(this.companyId)
				.subscribe(
					response => {
						if (response.statusCode == 200) {
							this.gdprSetting = response.data;
							this.gdprStatus = this.gdprSetting.gdprStatus;
							this.termsAndConditionStatus = this.gdprSetting.termsAndConditionStatus;
						}
						this.parentInput['termsAndConditionStatus'] = this.termsAndConditionStatus;
						this.parentInput['gdprStatus'] = this.gdprStatus;
					},
					(error: any) => {
						this.loading = false;
					},
					() => this.xtremandLogger.info('Finished getGdprSettings()')
				);
		}

	}

	getLegalBasisOptions() {
		if (this.companyId > 0) {
			this.loading = true;
			this.fields = { text: 'name', value: 'id' };
			this.refService.getLegalBasisOptions(this.companyId)
				.subscribe(
					data => {
						this.legalBasisOptions = data.data;
						this.parentInput['legalBasisOptions'] = this.legalBasisOptions;
						this.loading = false;
					},
					(error: any) => {
						this.loading = false;
					},
					() => this.xtremandLogger.info('Finished getLegalBasisOptions()')
				);
		}

	}

	ngOnDestroy() {
		try {
			swal.close();
			$('#filterModal').modal('hide');
			$('#saveAsEditModal').modal('hide');
			this.showEdit = false;

			if (this.selectedAddContactsOption != 8 && this.router.url !== '/login' && !this.isDuplicateEmailId && !this.isSegmentation) {
				let self = this;
				swal({
					title: 'Are you sure?',
					text: "You have unsaved data",
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#54a7e9',
					cancelButtonColor: '#999',
					confirmButtonText: 'Yes, Save it!',
					cancelButtonText: "No"

				}).then(function () {
					self.saveContacts(self.contactListId);
				}, function (dismiss) {
					if (dismiss === 'No') {
						self.selectedAddContactsOption = 8;
					}
				})
			}
		} catch (error) {
			this.xtremandLogger.error(error, "editContactComponent", "ngOnDestroy()");
		}
	}

	validateLegalBasisOptions() {
		this.isValidLegalOptions = true;
		if (this.selectedAddContactsOption != 0 && this.gdprStatus && this.selectedLegalBasisOptions.length == 0) {
			this.isValidLegalOptions = false;
		}
	}

	setLegalBasisOptions(input: any) {
		if (this.gdprStatus) {
			let self = this;
			$.each(input, function (index: number, contact: User) {
				contact.legalBasis = self.selectedLegalBasisOptions;
			});
		}
	}

	addCampaigns(contact: any) {
		this.sendCampaignComponent.openPopUp(this.selectedContactListId, contact, this.checkingContactTypeName);
	}

	/*openCampaignsPopupForNewlyAddedPartners() {
		this.sendCampaignComponent.openPopUpForNewlyAddedPartnersOrContacts(this.contactListId, this.newUserDetails, this.checkingContactTypeName);
	}*/

	goToCampaigns(contact: any) {
		this.loading = true;
		let type = this.checkingContactTypeName;
		let self = this;
		setTimeout(function () {
			let prefixUrl = "/home/campaigns/user-campaigns/";
			if ("Partner" == type) {
				self.refService.goToRouter(prefixUrl + "/pm/" + contact.id);
			} else if ("Contact" == type) {
				self.refService.goToRouter(prefixUrl + "/c/" + contact.id);
			}
		}, 250);

	}

	saveAsSelectedContacts(e, contact: User) {
		if (e.target.checked) {
			this.selectedContactForSave.push(contact);
		} else {
			const index = this.selectedContactForSave.indexOf(contact);
			this.selectedContactForSave.splice(index, 1);
		}
		e.stopPropagation();
	}


	contactsCount(id: number) {
		try {
			this.contactListObject = new ContactList;
			this.contactListObject.id = id;
			this.contactListObject.assignedLeadsList = this.assignLeads;
			this.contactListObject.moduleName = this.module;

			this.contactService.loadContactsCount(this.contactListObject)
				.subscribe(
					data => {
						this.contactsByType.allContactsCount = data.allcontacts;
						this.contactsByType.invalidContactsCount = data.invalidUsers;
						this.contactsByType.unsubscribedContactsCount = data.unsubscribedUsers;
						this.contactsByType.activeContactsCount = data.activecontacts;
						this.contactsByType.inactiveContactsCount = data.nonactiveUsers;
						this.contactsByType.validContactsCount = data.validContactsCount;
						this.contactsByType.excludedContactsCount = data.excluded;
						this.allUsers = this.contactsByType.allContactsCount;
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => console.log("LoadContactsCount Finished")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "ContactReportCount()");
		}
	}

	/*********XNFR-85********* */
	showTeamMembers = false;
	showModulesPopup = false;
	currentPartner: any;
	teamMemberGroupId = 0;
	teamMemberGroups: Array<any> = new Array<any>();
	previewModules(teamMemberGroupId: number) {
		this.previewLoader = true;
		this.teamMemberGroupId = teamMemberGroupId;
		this.showModulesPopup = true;
	}

	getTeamMembersByGroupId(partner: any, index: number) {
		this.previewLoader = true;
		partner.expand = false;
		setTimeout(() => {
			this.getTeamMembers(partner, index);
			this.previewLoader = false;
		}, 500);

	}

	getTeamMembers(partner: any, index: number) {
		/****XNFR-131****/
		$.each(this.users, function (partnerUserIndex: number, partnerUser: any) {
			if (index != partnerUserIndex) {
				partnerUser.expand = false;
			}
		});
		partner.expand = !partner.expand;
		if (partner.teamMemberGroupId > 0) {
			if (partner.expand) {
				this.currentPartner = partner;
				this.currentPartner.index = index;
			}
		} else {
			partner.expand = false;
		}
	}


	hideModulesPreviewPopUp() {
		this.showModulesPopup = false;
		this.teamMemberGroupId = 0;
		this.previewLoader = false;
	}
	receiveTeamMemberIdsEntity(partner: any) {
		this.currentPartner = partner;
		this.toggleDropDownStatus(partner);
		this.previewLoader = false;
	}

	toggleDropDownStatus(partner: any) {
		if (partner.selectedTeamMemberIds.length > 0) {
			$("#edit-partner-tm-group-" + partner.index).prop("disabled", true);
		} else {
			$("#edit-partner-tm-group-" + partner.index).prop("disabled", false);
		}
	}

	getSelectedIndex(index: number) {
		this.selectedFilterIndex = index;
		if (this.currentContactType == "all_contacts") {
			this.refService.setTeamMemberFilterForPagination(this.pagination, index);
			this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
		} else if (this.contactsByType.selectedCategory) {
			this.refService.setTeamMemberFilterForPagination(this.contactsByType.pagination, index);
			this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
		}
	}
	/*******XNFR-130*****/
	applyForAll(selectedPartner: any) {
		this.selectedPartner = selectedPartner;
		this.sweetAlertParameterDto.text = this.properties.partnerTeamMemberGroupSelectionSweetAlertMessage;
		this.sweetAlertParameterDto.confirmButtonText = "Yes";
		this.showSweetAlert = true;
	}

	receiveEvent(event: any) {
		if (event) {
			this.processingPartnersLoader = true;
			this.applyForAllClicked = true;
			this.selectAllTeamMemberGroupId = this.selectedPartner.teamMemberGroupId;
			this.selectAllTeamMemberIds = this.selectedPartner.selectedTeamMemberIds;
			this.validatePartners();
			this.showSweetAlert = false;
		} else {
			this.showSweetAlert = false;
		}
	}

	resetApplyFilter() {
		this.selectAllTeamMemberGroupId = 0;
		this.selectAllTeamMemberIds = [];
		this.applyForAllClicked = false;
	}

	/****XNFR-278****/
	openMergePopup() {
		this.mergeOptionClicked = true;
		this.selectedUserIdsForMerging = this.selectedContactListIds;
	}

	copyGroupUsersModalPopupEventReceiver() {
		this.mergeOptionClicked = false;
		this.selectedUserIdsForMerging = [];
	}

	unsubscribeUser(selectedUserForUnsubscribed: any) {
		this.contactService.isUnsubscribeContactModalPopup = true;
		this.selectedUser = selectedUserForUnsubscribed;
	}
	unsubscribeUserResult(event: any) {
		this.contactService.isUnsubscribeContactModalPopup = false;
		this.selectedUser = null;
		this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
		this.contactsCount(this.selectedContactListId);
		this.customResponse = new CustomResponse('SUCCESS', event, true);
	}

	resubscribeUser(selectedUserForUnsubscribed: any) {
		this.selectedUser = selectedUserForUnsubscribed;
		this.contactService.isresubscribeContactModalPopup = true;
	}

	resubscribeUserResult(event: any) {
		this.contactService.isresubscribeContactModalPopup = false;
		this.selectedUser = null;
		if (this.contactsByType.selectedCategory === 'unsubscribe') {
			this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
		} else if (this.currentContactType == "all_contacts") {
			this.editContactListLoadAllUsers(this.selectedContactListId, this.pagination);
		}
		this.contactsCount(this.selectedContactListId);
		this.customResponse = new CustomResponse('SUCCESS', event, true);
	}


	validatePartnersCompany() {
		try {
			this.contactService.validatePartnersCompany(this.users, this.contactListId)
				.subscribe(
					(data: any) => {
						if (data.statusCode == 200) {

							this.getContactsLimit();

						} else {
							this.loading = false;
							let emailIds = "";
							$.each(data.data, function (index: number, emailId: string) {
								emailIds += (index + 1) + "." + emailId + "\n";
							});
							let updatedMessage = data.message + "<br/>" + emailIds;
							this.customResponse = new CustomResponse('ERROR', updatedMessage, true);
						}
					},
					error => this.xtremandLogger.error(error),
					() => console.log('validatePartnersCompany() finished')
				);
		} catch (error) {
			this.xtremandLogger.error(error, "AddPartnersComponent", "validating Partners");
		}
	}

	saveAssignContactAndMdfPopupData() {
		this.processingPartnersLoader = true;
		$(".modal-body").animate({ scrollTop: 0 }, 'slow');
		let errorCount = 0;
		$.each(this.users, function (index: number, partner: any) {
			let contactsLimit = partner.contactsLimit;
			if (this.applyForAllClicked) {
				partner.teamMemberGroupId = this.selectAllTeamMemberGroupId;
				partner.selectedTeamMemberIds = this.selectAllTeamMemberIds;
			}
			if (contactsLimit < 1) {
				partner.contactsLimit = 1;
			}
		});
		if (errorCount > 0) {
			this.processingPartnersLoader = false;
			this.resetApplyFilter();
		} else {
			$('#assignContactAndMdfPopup').modal('hide');
			this.processingPartnersLoader = false;
			this.showNotifyPartnerOption = false;
			this.resetApplyFilter();
			this.saveData();
		}
	}

	/***********XNFR-342*********/
	openUnPublishedContentModalPopUp(contact: any) {
		this.shareUnPublishedComponent.openPopUp(this.selectedContactListId, contact, this.checkingContactTypeName, this.selectedContactListName);
	}


	showMakeAsOptinAlert(contactId: any, emailId: any) {
		try {
			this.xtremandLogger.info("contactId in showMakeAsOptinAlert() " + contactId);
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "Selected user will be removed from the excluded list!",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#54a7e9',
				cancelButtonColor: '#999',
				confirmButtonText: 'Yes, Mark as valid!'

			}).then(function (myData: any) {
				self.validateExcludedDetails(contactId, emailId);
			}, function (dismiss: any) {
			});
		} catch (error) {
			this.xtremandLogger.error(error, "EditContactsComponent", "showMakeAsOptinAlert()");
		}
	}

	validateExcludedDetails(contactId: any, emailId: any) {
		try {
			this.resetResponse();
			this.loading = true;
			this.xtremandLogger.info(contactId);
			const excludedUser = {
				"id": contactId,
				"emailId": emailId
			};
			this.contactService.excludedUserMakeAsValid(excludedUser)
				.subscribe(
					data => {
						if (data.access) {
							if (data.statusCode == 400) {
								this.customResponse = new CustomResponse('ERROR', data.message, true);
								this.loading = false;
							} else {

								this.loading = false;
								this.xtremandLogger.log(data);
								this.contactsCount(this.selectedContactListId);
								this.checkingLoadContactsCount = true;
								this.listOfSelectedContactListByType(this.contactsByType.selectedCategory);
								this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_REMOVED_FROM_EXCLUDED_LIST, true);
							}
						} else {
							this.authenticationService.forceToLogout();

						}
					},
					(error: any) => {
						console.log(error);
						this.loading = false;
					},
					() => this.xtremandLogger.info("EditContactsComponent validateExcludedDetails() finished")
				)
		} catch (error) {
			this.xtremandLogger.error(error, "EditContactsComponent", "validateExcludedDetails()");
		}
	}


	confirmdelete(contactId: number) {
		let self = this;
		swal({
			title: 'Are you sure?',
			text: "This contact will be deleted from all your contact lists.",
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Yes, delete it!'

		}).then(function () {
			self.deleteContactFromAllLists(contactId);
		}, function (dismiss: any) {
			console.log('you clicked on option' + dismiss);
		});
	}


	deleteContactFromAllLists(contactId: any) {
		this.loading = true;
		this.xtremandLogger.info(this.selectedContactListIds);
		this.contactService.deleteContactById(contactId).subscribe(
			response => {
				if (response.statusCode == 200) {
					this.loading = false;
					this.customResponse = new CustomResponse('SUCCESS', "Your Contact(s) has been deleted successfully ", true);
					this.selectedContactListIds = [];
					this.isHeaderCheckBoxChecked = false;
					this.checkingLoadContactsCount = true
					this.editContactListLoadAllUsers(this.contactListId, this.pagination);
					this.contactsCount(this.selectedContactListId);
					this.loading = false;
				} else {
					this.customResponse = new CustomResponse('ERROR', 'This contact cannot be deleted as it is shared by one of your vendors', true);
				}

			},
			error => {
				this.loading = false;
				this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
			}
		);
	}

	
syncContactsInMasterContactList(){
	this.masterContactListSync= true;
	this.manageContact.syncContactsInMasterContactList();
	
}


confirmsync(){
	let self = this;
	swal({
		title: 'Are you sure?',
		text: 'Clicking "Sync" will update this list by adding all the existing contacts',
		type: 'success',
		showCancelButton: true,
		swalConfirmButtonColor: '#54a7e9',
		swalCancelButtonColor: '#999',
		confirmButtonText: 'Sync'

	}).then(function () {
		self.syncContactsInMasterContactList();
	}, function (dismiss: any) {
		console.log('you clicked on option' + dismiss);
	});

}

checkSyncStatus(){
	this.contactService.checkSyncStatus(this.loggedInUserId).subscribe(
		response => {
			if (response.statusCode == 200) {
				this.masterContactListSync= response.data.masterContactListSync;
               this.contactsCompanyListSync = response.data.contactsCompanyListSync;
			}
		},
		error => {
			this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
		}
	);
  }

}
