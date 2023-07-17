import { Component, OnInit, OnDestroy, Input, AfterViewInit, ViewChild } from '@angular/core';
import { User } from '../../core/models/user';
import { EditUser } from '../../contacts/models/edit-user';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { ActionsDescription } from '../../common/models/actions-description';
import { CountryNames } from '../../common/models/country-names';
import { Pagination } from '../../core/models/pagination';
import { SocialPagerService } from '../../contacts/services/social-pager.service';
import { SocialContact } from '../../contacts/models/social-contact';
import { ContactService } from '../../contacts/services/contact.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from '../../core/services/pager.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { EditContactsComponent } from '../../contacts/edit-contacts/edit-contacts.component';
import { ManageContactsComponent } from '../../contacts/manage-contacts/manage-contacts.component';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { PaginationComponent } from '../../common/pagination/pagination.component';
import { TeamMemberService } from '../../team/services/team-member.service';
import { FileUtil } from '../../core/models/file-util';
import { HubSpotService } from 'app/core/services/hubspot.service';
import { GdprSetting } from '../../dashboard/models/gdpr-setting';
import { LegalBasisOption } from '../../dashboard/models/legal-basis-option';
import { UserService } from '../../core/services/user.service';
import { SendCampaignsComponent } from '../../common/send-campaigns/send-campaigns.component';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { SweetAlertParameterDto } from 'app/common/models/sweet-alert-parameter-dto';
import { UtilService } from 'app/core/services/util.service';
import { UserGuide } from 'app/guides/models/user-guide';
declare var $:any, Papa:any, swal:any;

@Component({
	selector: 'app-add-partners',
	templateUrl: './add-partners.component.html',
	styleUrls: ['./add-partners.component.css', '../../contacts/add-contacts/add-contacts.component.css', '../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload.css',
		'../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css', '../../../assets/css/numbered-textarea.css',
		'../../../assets/css/phone-number-plugin.css'],
	providers: [Pagination, SocialPagerService, EditContactsComponent, ManageContactsComponent, CountryNames,
		Properties, RegularExpressions, PaginationComponent, TeamMemberService, ActionsDescription, FileUtil, CallActionSwitch]
})
export class AddPartnersComponent implements OnInit, OnDestroy {
    isPartnerPopupShow : boolean  = false ;
	loggedInUserId: number;
	validEmailPatternSuccess: boolean = true;
	user: User;
	checkingForEmail: boolean;
	addPartnerUser: User = new User();
	newPartnerUser = [];
	existedEmailIds = [];
	invalidPatternEmails = [];
	validCsvContacts: boolean;
	partners: User[];
	// allPartners: User[];
	partnerId = [];
	partnerListId: number;
	totalRecords: number;
	updatePartnerUser: boolean = false;
	updatedUserDetails = [];
	editUser: EditUser = new EditUser();
	customResponse: CustomResponse = new CustomResponse();
	googleImageNormal: boolean = false;
	googleImageBlur: boolean = false;
	sfImageBlur: boolean = false;
	sfImageNormal: boolean = false;
	zohoImageBlur: boolean = false;
	zohoImageNormal: boolean = false;
	public storeLogin: any;
	public clipboardTextareaText: string;
	public clipBoard: boolean = false;
	duplicateEmailIds: string[] = [];
	dublicateEmailId: boolean = false;
	selectedAddPartnerOption: number = 5;
	fileTypeError: boolean;
	pager: any = {};

	pagedItems: any[];
	public getGoogleConatacts: any;
	public socialPartners: SocialContact;
	public socialPartnerUsers: SocialContact[] = new Array();
	socialPartnersAllChecked: boolean;
	isPartner: boolean = true;
	module: string;
	public socialContactsValue: boolean;
	zohoCredentialError = '';
	selectedZohoDropDown: string = 'DEFAULT';
	public userName: string;
	public password: string;
	public contactType: string;
	zohoAuthStorageError = '';
	public salesforceListViewName: string;
	public salesforceListViewId: string;
	public salesforceListViewsData: Array<any> = [];
	public hubSpotContactListsData: Array<any> = [];
	public socialNetwork: string;
	settingSocialNetwork: string;
	isUnLinkSocialNetwork: boolean = false;
	Campaign: string;
	deleteErrorMessage: boolean;
	isLoadingList: boolean = true;
	isEmailExist: boolean = false;
	isCompanyDetails = false;
	allPartnersPagination: Pagination = new Pagination();
	contactAssociatedCampaignPagination: Pagination = new Pagination();
	downloadAssociatedPagination: Pagination = new Pagination();
	pageSize: number = 12;
	contactListAssociatedCampaignsList: any;
	editingEmailId = '';
	loading = false;
	partnerAllDetails = [];
	openCampaignModal = false;

	disableOtherFuctionality = false;
	saveAsListName: any;
	saveAsError: any;
	isListLoader = false;
	paginationType = "";
	isSaveAsList = false;
	isDuplicateEmailId = false;
	isCheckTC = true;
	showGDPR: boolean;
	sortOptions = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Email(A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email(Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
		{ 'name': 'Company Name(ASC)', 'value': 'contactCompany-ASC' },
		{ 'name': 'Company Name(DESC)', 'value': 'contactCompany-DESC' },
	];
	public sortOption: any = this.sortOptions[0];
	public searchKey: string;
	sortcolumn: string = null;
	sortingOrder: string = null;
	selectedDropDown: string;
	selectedContactListIds = [];
	allselectedUsers = [];
	isHeaderCheckBoxChecked: boolean = false;
	pageNumber: any;
	newUserDetails = [];
	teamMembersList = [];
	/* orgAdminsList = [];*/



	//MARKETO

	showMarketoForm: boolean;
	marketoAuthError: boolean;
	marketoInstanceClass: string;
	marketoInstanceError: boolean;
	marketoInstance: any;
	marketoSecretIdClass: string;
	marketoSecretIdError: boolean;
	marketoSecretId: any;
	marketoClientId: any;
	marketoClientIdClass: string;
	marketoClentIdError: boolean;
	isMarketoModelFormValid: boolean;
	marketoContactError: boolean;
	marketoContactSuccessMsg: any;
	loadingMarketo: boolean;
	public getMarketoConatacts: any;

	public edited = false;

	marketoImageBlur: boolean = false;
	marketoImageNormal: boolean = false;

	hubspotImageBlur: boolean = false;
	hubspotImageNormal: boolean = false;
	hubSpotSelectContactListOption: any;

	public uploader: FileUploader = new FileUploader({ allowedMimeType: ["application/csv", "application/vnd.ms-excel", "text/plain", "text/csv"] });

	public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
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
	filePreview = false;
	@ViewChild('sendCampaignComponent') sendCampaignComponent: SendCampaignsComponent;
	cloudPartnersModalCheckBox = false;
	sourceType = "";
	loggedInThroughVanityUrl = false;
	processingPartnersLoader = false;
	contactAndMdfPopupResponse: CustomResponse = new CustomResponse();
	mdfAccess: boolean = false;
	zohoErrorResponse: CustomResponse = new CustomResponse();
	zohoPopupLoader: boolean = false;
	public zohoAuthUrl: String;
	public isZohoRedirectUrlButton: boolean = false;
	public zohoCurrentUser: any;
	public providerName: String = 'zoho';
	pageLoader = false;
	showNotifyPartnerOption = false;
	public googleCurrentUser: any;
	public hubSpotCurrentUser: any;
	public salesForceCurrentUser: any;
	/***XNFR-85**** */
	teamMemberGroups: Array<any> = new Array<any>();
	teamMembersPopUpLoader = false;
	teamMembersPagination = new Pagination();
	public teamMembersLoader: HttpRequestLoader = new HttpRequestLoader();
	public showModulesPopup = false;
	public teamMemberGroupId = 0;
	selectedFilterIndex: number = 1;
	showFilter = true;
	collapseAll = false;
	/****XNFR-130*****/
	selectAllTeamMemberIds = [];
	selectAllTeamMemberGroupId = 0;
	applyForAllClicked = false;
	sweetAlertParameterDto:SweetAlertParameterDto = new SweetAlertParameterDto();
	showSweetAlert = false;
	selectedPartner: any;
	microsoftDynamicsImageBlur: boolean = false;
    microsoftDynamicsImageNormal: boolean = false;
    microsoftDynamicsSelectContactListOption:any;
    microsoftDynamicsContactListName: string;
    showMicrosoftAuthenticationForm: boolean = false;
    /*** XNFR-224***/
	isLoggedInAsPartner = false;

//XNFR-230.
   //pipedrive

   pipedriveImageBlur: boolean = false;
   pipedriveImageNormal: boolean = false;
   pipedriveSelectContactListOption:any;
   pipedriveContactListName: string;
   pipedriveServie: any;
   showPipedriveAuthenticationForm: boolean = false;
   pipedriveApiKey: string;
   pipedriveApiKeyClass: string;
   pipedriveApiKeyError: boolean;
   pipedriveCurrentUser: string;
   pipedriveLoading: boolean = false;
   /****XNFR-278****/
   mergeOptionClicked = false;
   selectedUserIdsForMerging: any[];
	/****XNFR-278****/
   /****** User guide ******/
   searchWithModuleName:any;
	constructor(private fileUtil: FileUtil, private router: Router, public authenticationService: AuthenticationService, public editContactComponent: EditContactsComponent,
		public socialPagerService: SocialPagerService, public manageContactComponent: ManageContactsComponent,
		public referenceService: ReferenceService, public countryNames: CountryNames, public paginationComponent: PaginationComponent,
		public contactService: ContactService, public properties: Properties, public actionsDescription: ActionsDescription, public regularExpressions: RegularExpressions,
		public pagination: Pagination, public pagerService: PagerService, public xtremandLogger: XtremandLogger, public teamMemberService: TeamMemberService, private hubSpotService: HubSpotService, public userService: UserService,
		public callActionSwitch: CallActionSwitch, private vanityUrlService: VanityURLService, 
		public campaignService: CampaignService, public integrationService: IntegrationService, 
		private utilService: UtilService) {
		this.loggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();
		this.isLoggedInAsPartner = this.utilService.isLoggedAsPartner();
		//Added for Vanity URL
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.pagination.vanityUrlFilter = true;
		}
		this.sourceType = this.authenticationService.getSource();
		if (this.sourceType == "ALLBOUND") {
			this.router.navigate(['/access-denied']);
		}
		this.user = new User();
		this.referenceService.callBackURLCondition = 'partners';
		this.socialPartners = new SocialContact();
		this.addPartnerUser.country = (this.countryNames.countries[0]);
		this.pageNumber = this.paginationComponent.numberPerPage[0];

		let currentUrl = this.router.url;
		if (currentUrl.includes('home/partners')) {
			this.isPartner = true;
			this.module = "partners";
		}

		this.parentInput = {};
		/*********XNFR-224*********/
		const currentUser = localStorage.getItem('currentUser');
		let campaginAccessDto = JSON.parse(currentUser)['campaignAccessDto'];
		if (campaginAccessDto != undefined) {
			this.companyId = campaginAccessDto.companyId;
		}
		/*********XNFR-224*********/
		
	}



	onChangeAllPartnerUsers(event: Pagination) {
		this.pagination = event;
		this.loadPartnerList(this.pagination);

	}

	sortByOption(event: any, selectedType: string) {
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

		this.pagination.pageIndex = 1;
		this.pagination.sortcolumn = this.sortcolumn;
		this.pagination.sortingOrder = this.sortingOrder;
		this.loadPartnerList(this.pagination);

	}

	search() {
		this.resetResponse();
		this.pagination.searchKey = this.searchKey;
		this.pagination.pageIndex = 1;
		this.loadPartnerList(this.pagination);
	}

	listPartners(userId: number) {
		try {
			this.contactService.listContactsOfDefaultPartnerList(userId, this.pagination)
				.subscribe(
					(data: any) => {
						this.pagination.totalRecords = data.totalRecords;
					},
					error =>
						() => console.log('loadPartner() finished')
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "list Partners");
		}
	}

	defaultPartnerList(userId: number) {
		this.pageLoader = true;
		try {
			this.contactService.defaultPartnerList(userId)
				.subscribe(
					(data: any) => {
						this.partnerListId = data.id;
						this.contactService.partnerListName = data.name;
					},
					error => this.xtremandLogger.error(error),
					() => {
						this.loadPartnerList(this.pagination);
					}
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "default PartnerList");
		}
	}

	checkingEmailPattern(emailId: string) {
		this.validEmailPatternSuccess = false;
		if (this.validateEmailAddress(emailId)) {
			this.validEmailPatternSuccess = true;
		} else {
			this.validEmailPatternSuccess = false;
		}
	}

	validateEmailAddress(emailId: string) {
		var EMAIL_ID_PATTERN = this.regularExpressions.EMAIL_ID_PATTERN;
		return EMAIL_ID_PATTERN.test(emailId);
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
		if ((lowerCaseEmail != this.editingEmailId) && this.contactService.allPartners != undefined) {
			for (let i = 0; i < this.contactService.allPartners.length; i++) {
				if (lowerCaseEmail == this.contactService.allPartners[i].emailId) {
					this.isEmailExist = true;
					this.existedEmailIds.push(emailId);
					break;
				}
			}
		}

	}

	addPartnerModalOpen() {
		this.resetResponse();
		this.contactService.isContactModalPopup = true;
		this.updatePartnerUser = false;
		this.addPartnerUser.country = (this.countryNames.countries[0]);
		this.addPartnerUser.mobileNumber = "+1";
	}

	addPartnerModalClose() {
		$('#addPartnerModal').modal('toggle');
		$("#addPartnerModal .close").click();
		$('#addPartnerModal').modal('hide');
	}

	downloadEmptyCsv() {
		window.location.href = this.authenticationService.REST_URL + "userlists/download-default-list/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;

	}

	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.loadPartnerList(this.pagination);
	}

	addRow(event) {
		//this.addPartnerModalClose();
		this.newPartnerUser.push(event);
		this.selectedAddPartnerOption = 1;
		this.saveContacts();
		this.addPartnerUser = new User();
	}

	cancelRow(rowId: number) {
		if (rowId !== -1) {
			this.newPartnerUser.splice(rowId, 1);
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

	savePartnerUsers() {
		this.duplicateEmailIds = [];
		this.dublicateEmailId = false;
		this.existedEmailIds = [];
		this.isEmailExist = false;
		var testArray = [];
		for (var i = 0; i <= this.newPartnerUser.length - 1; i++) {
			testArray.push(this.newPartnerUser[i].emailId.toLowerCase());
			this.validateEmail(this.newPartnerUser[i].emailId);
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
		var valueArr = this.newPartnerUser.map(function (item) { return item.emailId.toLowerCase() });
		var isDuplicate = valueArr.some(function (item, idx) {
			return valueArr.indexOf(item) != idx
		});
		console.log("emailDuplicate" + isDuplicate);
		this.isDuplicateEmailId = isDuplicate;
		if (this.newPartnerUser[0].emailId != undefined) {
			if (!isDuplicate && !this.isEmailExist) {
				this.saveValidEmails();
			} else if (this.isEmailExist) {
				let message = "These " + this.authenticationService.partnerModule.customName + "(s) are already added " + this.existedEmailIds;
				this.customResponse = new CustomResponse('ERROR', message, true);
			} else {
				this.dublicateEmailId = true;
			}
		}
	}

	validateSocialContacts(socialUsers: any) {
		let users = [];
		for (let i = 0; i < socialUsers.length; i++) {
			if (socialUsers[i].emailId) {
				if (socialUsers[i].emailId !== null && this.validateEmailAddress(socialUsers[i].emailId)) {
					let email = socialUsers[i].emailId.toLowerCase();
					socialUsers[i].emailId = email;
					this.setLegalBasisOptions(socialUsers[i]);
					users.push(socialUsers[i]);
				}
			} else {
				if (socialUsers[i].email !== null && this.validateEmailAddress(socialUsers[i].email)) {
					let email = socialUsers[i].email.toLowerCase();
					socialUsers[i].emailId = email;
					this.setLegalBasisOptions(socialUsers[i]);
					users.push(socialUsers[i]);
				}
			}
		}
		return users;
	}

	checkTeamEmails(arr, val) {
		this.xtremandLogger.log(arr.indexOf(val) > -1);
		return arr.indexOf(val) > -1;
	}

	saveValidEmails() {
		try {
			this.newUserDetails.length = 0;
			this.isCompanyDetails = false;
			/*for ( let i = 0; i < this.orgAdminsList.length; i++ ) {
				this.teamMembersList.push( this.orgAdminsList[i] );
			}*/
			this.teamMembersList.push(this.authenticationService.user.emailId);
			let emails = []
			for (let i = 0; i < this.newPartnerUser.length; i++) {
				if (this.newPartnerUser[i].emailId) {
					emails.push(this.newPartnerUser[i].emailId);
				} else {
					emails.push(this.newPartnerUser[i].email);
				}
			}
			let existedEmails = []
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
			for (let i = 0; i < this.newPartnerUser.length; i++) {

				let userDetails = {
					"firstName": this.newPartnerUser[i].firstName,
					"lastName": this.newPartnerUser[i].lastName,
					"companyName": this.newPartnerUser[i].contactCompany,
					"contactCompany": this.newPartnerUser[i].contactCompany
				}

				if (this.newPartnerUser[i].emailId) {
					userDetails["emailId"] = this.newPartnerUser[i].emailId;
				} else {
					userDetails["emailId"] = this.newPartnerUser[i].email;
				}

				this.newUserDetails.push(userDetails);

				if (this.newPartnerUser[i].mobileNumber) {
					if (this.newPartnerUser[i].mobileNumber.length < 6) {
						this.newPartnerUser[i].mobileNumber = "";
					}
				}
				if (this.selectedAddPartnerOption != 3 && this.selectedAddPartnerOption != 6 && this.selectedAddPartnerOption != 7
					&& this.selectedAddPartnerOption != 8 && this.selectedAddPartnerOption != 9 && this.selectedAddPartnerOption !=10 && this.selectedAddPartnerOption !=11) {
					if (this.newPartnerUser[i].contactCompany.trim() != '') {
						this.isCompanyDetails = true;
					} else {
						this.isCompanyDetails = false;
					}
				} else {
					this.isCompanyDetails = true;
				}
				if (this.newPartnerUser[i].country === "Select Country") {
					this.newPartnerUser[i].country = null;
				}
				if (!this.validateEmailAddress(this.newPartnerUser[i].emailId)) {
					this.invalidPatternEmails.push(this.newPartnerUser[i].emailId)
				}
				if (this.newPartnerUser[i].emailId) {
					if (this.validateEmailAddress(this.newPartnerUser[i].emailId)) {
						this.validCsvContacts = true;
					} else {
						this.validCsvContacts = false;
					}
				} else {
					if (this.validateEmailAddress(this.newPartnerUser[i].email)) {
						this.validCsvContacts = true;
					} else {
						this.validCsvContacts = false;
					}
				}
			}
			this.newPartnerUser = this.validateSocialContacts(this.newPartnerUser);
			console.log(this.newPartnerUser);
			if (existedEmails.length === 0) {
				if (this.isCompanyDetails) {
					if (this.validCsvContacts) {
						this.askForPermission();
					} else {
						this.customResponse = new CustomResponse('ERROR', "We Found Invalid emailId(s) Please remove " + this.invalidPatternEmails, true);
						this.invalidPatternEmails = [];
					}
				} else {
					this.customResponse = new CustomResponse('ERROR', "Company Details is required", true);
				}
			} else {
				let message = " You are not allowed to add teamMember(s) or yourself as a " + this.authenticationService.partnerModule.customName;
				this.customResponse = new CustomResponse('ERROR', message, true);
				if (this.selectedAddPartnerOption == 1) {
					this.cancelPartners();
				}
			}
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "save Partners");
		}
	}

	closeDuplicateEmailErrorMessage() {
		this.dublicateEmailId = false;
	}



	chectTermAndConditions() {
		console.log("check box checked properly");
	}


	askForPermission() {
		if (this.termsAndConditionStatus) {
			$('#tcModal').modal('show');
		} else {
			this.saveContactsWithPermission();
		}
	}

	saveContactsWithPermission() {
		$('#tcModal').modal('hide');
		/*******Adding one more method to avoid confusion for on boarding partners process on 03/07/2020 by Sravan */
		this.openAssignContactAndMdfAmountPopup();
		//this.allConditionsAcceptedListSave();
	}

	openAssignContactAndMdfAmountPopup() {
		this.processingPartnersLoader = true;
		$('#assignContactAndMdfPopup').modal('show');
		this.isPartnerPopupShow = true ;
		this.authenticationService.findNotifyPartnersOption(this.companyId).subscribe(
			response => {
				this.iteratePartnersAndAssignContactsCount(response.data);
				/********XNFR-85********/
				let teamMemberGroups = response.map['teamMemberGroups'];
				this.teamMemberGroups = teamMemberGroups;
			}, error => {
				this.iteratePartnersAndAssignContactsCount(false);
			});

	}
	iteratePartnersAndAssignContactsCount(notifyPartners: boolean) {
		if (this.allselectedUsers.length > 0) {
			this.newPartnerUser = this.allselectedUsers;
		}
		$.each(this.newPartnerUser, function (_index: number, partner: any) {
			partner.contactsLimit = 1;
			partner.teamMemberGroupId = 0;
			partner.isTeamMemberHeaderCheckBoxChecked = false;
			partner.selectedTeamMemberIds = [];
			partner.notifyPartners = notifyPartners;
		});
		this.processingPartnersLoader = false;
		this.showNotifyPartnerOption = true;
	}

	setNotifyPartnerOption(partner: any, event: any) {
		partner.notifyPartners = event;
	}

	closeAssignContactAndMdfAmountPopup() {
		$('#assignContactAndMdfPopup').modal('hide');
		this.showNotifyPartnerOption = false;
		this.newPartnerUser = [];
        this.resetApplyFilter();
		this.allselectedUsers = [];
		this.contactAndMdfPopupResponse = new CustomResponse();
		this.cancelPartners();
	}
	validatePartners() {
		this.processingPartnersLoader = true;
		$(".modal-body").animate({ scrollTop: 0 }, 'slow');
		this.contactAndMdfPopupResponse = new CustomResponse();
		let errorCount = 0;
        let self = this;
		$.each(this.newPartnerUser, function (index: number, partner: any) {
			let contactsLimit = partner.contactsLimit;
			if(self.applyForAllClicked){
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
		} else if (errorCount == 0) {
			this.validatePartnership();
		}
	}

	validatePartnership() {
		this.processingPartnersLoader = true;
		this.contactService.validatePartners(this.partnerListId, this.newPartnerUser).subscribe(
			(data: any) => {
				this.processingPartnersLoader = false;
				let statusCode = data.statusCode;
				if (statusCode == 200) {
					$('#assignContactAndMdfPopup').modal('hide');
					this.showNotifyPartnerOption = false;
					this.processingPartnersLoader = false;
                    this.resetApplyFilter();
					this.savePartners();
				} else {
					if(this.applyForAllClicked){
						$.each(this.newPartnerUser,function(index:number,partner:any){
							partner.teamMemberGroupId = 0;
							partner.selectedTeamMemberIds = [];
							partner.expand = false;
						});
					}
					let emailIds = "";
					$.each(data.data, function (index: number, emailId: string) {
						emailIds += (index + 1) + "." + emailId + "\n";
					});
					let updatedMessage = data.message + "\n" + emailIds;
					this.contactAndMdfPopupResponse = new CustomResponse('ERROR', updatedMessage, true);
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

	savePartners() {
		/*****************Sravan*********************/
		this.loading = true;
		this.contactService.updateContactList(this.partnerListId, this.newPartnerUser)
			.subscribe(
				(data: any) => {
					if (data.access) {
						this.loading = false;
						this.selectedAddPartnerOption = 5;
						$("tr.new_row").each(function () {
							$(this).remove();
						});
						this.newPartnerUser.length = 0;
						this.allselectedUsers.length = 0;
						if (this.authenticationService.loggedInUserRole === "Team Member" && !this.authenticationService.isPartnerTeamMember) {
							this.pagination.partnerTeamMemberGroupFilter = true;
						}
						this.loadPartnerList(this.pagination);
						this.clipBoard = false;
						this.cancelPartners();
						if (data.statusCode == 200) {
							let message = "Your " + this.authenticationService.partnerModule.customName + "(s) have been saved successfully" + "<br><br>";
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
							//this.getContactsAssocialteCampaigns();//Old method
							this.disableOtherFuctionality = false;
							//this.openCampaignsPopupForNewlyAddedPartners();
						} else if (data.statusCode == 409) {
							let emailIds = data.emailAddresses;
							let allEmailIds = "";
							$.each(emailIds, function (index, emailId) {
								allEmailIds += (index + 1) + "." + emailId + "<br><br>";
							});
							let message = data.errorMessage + "<br><br>" + allEmailIds;
							this.customResponse = new CustomResponse('ERROR', message, true);
						} else if (data.statusCode == 417) {
							this.customResponse = new CustomResponse('ERROR', data.detailedResponse[0].message, true);
						} else if (data.statusCode == 418) {
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
					} else {
						this.authenticationService.forceToLogout();
					}
				},
				(error: any) => {
					let body: string = error['_body'];
					body = body.substring(1, body.length - 1);
					if (error._body.includes('Please launch or delete those campaigns first')) {
						this.customResponse = new CustomResponse('ERROR', error._body, true);
					} else if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
						this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body), true);
					} else {
						this.xtremandLogger.errorPage(error);
					}
					this.xtremandLogger.error(error);
					this.loading = false;
					console.log(error);
					this.newPartnerUser.length = 0;
					this.allselectedUsers.length = 0;
					this.loadPartnerList(this.pagination);
					this.clipBoard = false;
					this.cancelPartners();
				},
				() => this.xtremandLogger.info("MangePartnerComponent loadPartners() finished")
			)
		this.dublicateEmailId = false;
	}


	navigateToTermsAndConditions() {
		window.open("https://www.xamplify.com/terms-conditions", "_blank");
	}


	cancelPartners() {
		this.socialPartnerUsers.length = 0;
		this.allselectedUsers.length = 0;
		this.selectedContactListIds.length = 0;
		this.getGoogleConatacts = null;
		this.pager = [];
		this.pagedItems = [];
		this.paginationType = "";
		this.disableOtherFuctionality = false;

		$('.salesForceImageClass').attr('style', 'opacity: 1;');
		$('.googleImageClass').attr('style', 'opacity: 1;');
		$('.zohoImageClass').attr('style', 'opacity: 1;');
		$('.marketoImageClass').attr('style', 'opacity: 1;');
		$('.hubspotImageClass').attr('style', 'opacity: 1;');
		$('.microsoftDynamicsImageClass').attr('style', 'opacity: 1;');
		$('.pipedriveImageClass').attr('style', 'opacity: 1;');
		$('.mdImageClass').attr('style', 'opacity: 1;cursor:not-allowed;');
		$('#SgearIcon').attr('style', 'opacity: 1;position: relative;font-size: 19px;top: -81px;left: 71px;');
		$('#GgearIcon').attr('style', 'opacity: 1;position: relative;font-size: 19px;top: -81px;left: 71px;');
		$('#ZgearIcon').attr('style', 'opacity: 1;position: relative;font-size: 19px;top: -81px;left: 71px;');
		$('#addContacts').attr('style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);');
		$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);');
		$('#uploadCSV').attr('style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);min-height:85px;border-radius: 3px');
		$("button#sample_editable_1_new").prop('disabled', true);
		$("button#cancel_button").prop('disabled', true);
		$('#copyFromclipTextArea').val('');
		$("#Gfile_preview").hide();
		this.newPartnerUser.length = 0;
		this.dublicateEmailId = false;
		this.clipBoard = false;
		this.selectedAddPartnerOption = 5;
		this.filePreview = false;
		this.selectedLegalBasisOptions = [];
		this.isValidLegalOptions = true;
	}

	loadPartnerList(pagination: Pagination) {
		try {
			this.isLoadingList = true;
			this.referenceService.loading(this.httpRequestLoader, true);
			this.httpRequestLoader.isHorizontalCss = true;
			this.contactService.loadUsersOfContactList(this.partnerListId, pagination).subscribe(
				(data: any) => {
					this.partners = data.listOfUsers;
					this.totalRecords = data.totalRecords;
					this.setLegalBasisOptionString(this.partners);
					this.isLoadingList = false;
					this.referenceService.loading(this.httpRequestLoader, false);
					pagination.totalRecords = this.totalRecords;
					pagination = this.pagerService.getPagedItems(pagination, this.partners);

					var contactIds = this.pagination.pagedItems.map(function (a) { return a.id; });
					var items = $.grep(this.editContactComponent.selectedContactListIds, function (element) {
						return $.inArray(element, contactIds) !== -1;
					});
					if (items.length == pagination.totalRecords || items.length == this.pagination.pagedItems.length) {
						this.editContactComponent.isHeaderCheckBoxChecked = true;
					} else {
						this.editContactComponent.isHeaderCheckBoxChecked = false;
					}
					/*if (!this.searchKey) {
						this.loadAllPartnerInList(pagination.totalRecords);
					} else {
						this.pageLoader = false;

					}*/
					this.pageLoader = false;

				},
				error => this.xtremandLogger.error(error),
				() => this.xtremandLogger.info("MangePartnerComponent loadPartnerList() finished")
			)
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "load Partners");
		}
	}

	loadAllPartnerInList(totalRecords: number) {
		try {
			this.allPartnersPagination.maxResults = totalRecords;
			this.contactService.loadUsersOfContactList(this.partnerListId, this.allPartnersPagination).subscribe(
				(data: any) => {
					this.contactService.allPartners = data.listOfUsers;
					this.pageLoader = false;
				},
				error => { this.pageLoader = false; this.xtremandLogger.error(error) },
				() => this.xtremandLogger.info("MangePartnerComponent loadAllPartnerList() finished")
			)
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "loading all Partners");
		}
	}


	fileChange(input: any) {
		this.readFiles(input.files);
	}

	readFile(file: any, reader: any, callback: any) {
		reader.onload = () => {
			callback(reader.result);
		}
		reader.readAsText(file);
	}

	readFiles(files: any, index = 0) {
		if (this.fileUtil.isCSVFile(files[0])) {
			this.isListLoader = true;
			this.customResponse = new CustomResponse();
			this.paginationType = "csvPartners";
			var outputstring = files[0].name.substring(0, files[0].name.lastIndexOf("."));
			this.selectedAddPartnerOption = 2;
			this.fileTypeError = false;
			$("button#sample_editable_1_new").prop('disabled', false);
			$("#file_preview").show();
			$("button#cancel_button").prop('disabled', true);
			$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('.microsoftDynamicsImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
			$('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -86px; left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
			$('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
			$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			let reader = new FileReader();
			reader.readAsText(files[0]);
			this.xtremandLogger.info(files[0]);
			var lines = new Array();
			var self = this;
			reader.onload = function (e: any) {
				var contents = e.target.result;
				let csvData:any = reader.result;
				let csvRecordsArray = csvData.split(/\r|\n/);
				let headersRow = self.fileUtil
					.getHeaderArray(csvRecordsArray);
				let headers = headersRow[0].split(',');

				if ((headers.length == 15)) {
					if (self.validateHeaders(headers)) {


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
								/* user.description = allTextLines[i][9];*/
								self.newPartnerUser.push(user);
							}
						}
						if (self.newPartnerUser.length == 0) {
							self.customResponse = new CustomResponse('ERROR', "No records found", true);
							self.cancelPartners();
						} else {
							self.setSocialPage(1);
						}
						self.isListLoader = false;


					} else {
						self.customResponse = new CustomResponse('ERROR', "Invalid Csv", true);
						self.cancelPartners();
					}
				} else {
					self.customResponse = new CustomResponse('ERROR', "Invalid Csv", true);
					self.cancelPartners();
				}

				console.log("ManagePartnerComponent : readFiles() Partners " + JSON.stringify(self.newPartnerUser));
			}
		} else {
			this.fileTypeError = true;
			this.uploader.queue.length = 0;
			this.selectedAddPartnerOption = 5;
		}
	}


	validateHeaders(headers) {
		return (headers[0].trim() == "FIRSTNAME" && headers[1].trim() == "LASTNAME" && headers[2].trim() == "COMPANY" && headers[3].trim() == "JOBTITLE" && headers[4].trim() == "EMAILID" && headers[5].trim() == "VERTICAL" && headers[6].trim() == "REGION" && headers[7].trim() == "TYPE" && headers[8].trim() == "CATEGORY" && headers[9].trim() == "ADDRESS" && headers[10].trim() == "CITY" && headers[11].trim() == "STATE" && headers[12].trim() == "ZIP" && headers[13].trim() == "COUNTRY" && headers[14].trim() == "MOBILE NUMBER");
	}

	copyFromClipboard() {
		this.resetResponse();
		this.fileTypeError = false;
		this.clipboardTextareaText = "";
		this.paginationType = "csvPartners";
		this.disableOtherFuctionality = true;
		$("button#cancel_button").prop('disabled', false);
		$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);');
		$('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
		$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
		this.clipBoard = true;
		$('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
		$('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
		$('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
		$('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
		$('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
		$('.microsoftDynamicsImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
		$('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
		$('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
		$('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
		$('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
		$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
	}

	clipboardShowPreview() {
		var selectedDropDown = $("select.opts:visible option:selected ").val();
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
				this.newPartnerUser.length = 0;
			}
		}
		if (isValidData) {
			$("button#sample_editable_1_new").prop('disabled', false);
			for (var i = 0; i < allTextLines.length; i++) {
				var data = allTextLines[i].split(splitValue);
				let user = new User();
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
				this.xtremandLogger.info(user);
				self.newPartnerUser.push(user);
			}
			this.selectedAddPartnerOption = 4;
			this.setSocialPage(1);
			var endTime = new Date();
			$("#clipBoardValidationMessage").append("<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing started at: <b>" + startTime + "</b></h5>");
			$("#clipBoardValidationMessage").append("<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing Finished at: <b>" + endTime + "</b></h5>");
			$("#clipBoardValidationMessage").append("<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Total Number of records Found: <b>" + allTextLines.length + "</b></h5>");
		} else {
			$("button#sample_editable_1_new").prop('disabled', true);
			$("#clipBoardValidationMessage").show();
		}
		this.xtremandLogger.info(this.newPartnerUser);
	}


	deleteUserShowAlert(contactId: number) {
		let self = this;
		swal({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Yes, delete it!'

		}).then(function (myData: any) {
			console.log("ManagePartner showAlert then()" + myData);
			self.removeContactListUsers1(contactId);
		}, function (dismiss: any) {
			console.log("you clicked showAlert cancel" + dismiss);
		});
	}

	removeContactListUsers1(contactId: number) {
		try {
		    this.pageLoader = true;
			this.partnerId[0] = contactId;
			this.contactService.removeContactListUsers(this.partnerListId, this.partnerId)
				.subscribe(
					(data: any) => {
						if (data.access) {
							let message = "Your " + this.authenticationService.partnerModule.customName + "(s) have been deleted successfully";
							this.customResponse = new CustomResponse('SUCCESS', message, true);
							this.loadPartnerList(this.pagination);
							this.pageLoader = false;
						} else {
							this.authenticationService.forceToLogout();
						}
					},
					(error: any) => {
						let body: string = error['_body'];
						body = body.substring(1, body.length - 1);
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
			this.xtremandLogger.error(error, "addPartnerComponent", "delete Partner");
		}
	}

	updatePartnerModalClose() {
		this.addPartnerModalClose();
		this.updatePartnerUser = false;
		this.updatedUserDetails.length = 0;
		this.addPartnerUser = new User();
		this.isEmailExist = false;
	}

	updatePartnerListUser(event) {
		try {
			this.editUser.pagination = this.pagination;
			if (event.mobileNumber) {
				if (event.mobileNumber.length < 6) {
					event.mobileNumber = "";
				}
			}

			if (event.country === "Select Country") {
				event.country = null;
			}
			this.editUser.user = event;
			this.addPartnerModalClose();
			this.contactService.updateContactListUser(this.partnerListId, this.editUser)
				.subscribe(
					(data: any) => {
						if (data.access) {
							let message = "Your " + this.authenticationService.partnerModule.customName + " has been updated successfully.";
							this.customResponse = new CustomResponse('SUCCESS', message, true);
							this.loadPartnerList(this.pagination);
						} else {
							this.authenticationService.forceToLogout();
						}
					},
					error => this.xtremandLogger.error(error),
					() => this.xtremandLogger.info("EditPartnerComponent updateContactListUser() finished")
				)
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "update Partner");
		}
	}

	editUserDetails(contactDetails: any) {
		this.updatePartnerUser = true;
		this.partnerAllDetails = contactDetails;
		this.contactService.isContactModalPopup = true;
	}

	socialContactImage() {
		try {
			this.contactService.socialContactImages()
				.subscribe(
					data => {
						this.storeLogin = data;
						if (this.storeLogin.GOOGLE == true) {
							this.googleImageNormal = true;
						} else {
							this.googleImageBlur = true;
						}
						if (this.storeLogin.SALESFORCE == true) {
							this.sfImageNormal = true;
						} else {
							this.sfImageBlur = true;
						}
						if (this.storeLogin.ZOHO == true) {
							this.zohoImageNormal = true;
						} else {
							this.zohoImageBlur = true;
						}
						if (this.storeLogin.MARKETO == true) {
							this.marketoImageNormal = true;
						} else {
							this.marketoImageBlur = true;
						}
						if (this.storeLogin.HUBSPOT == true) {
							this.hubspotImageNormal = true;
						} else {
							this.hubspotImageBlur = true;
						}
						if (this.storeLogin.MICROSOFT == true) {
							this.microsoftDynamicsImageNormal = true;
						} else {
							this.microsoftDynamicsImageBlur = true;
						}
						if (this.storeLogin.PIPEDRIVE == true) {
							this.pipedriveImageNormal = true;
						} else {
							this.pipedriveImageBlur = true;
						}
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.log("AddContactsComponent socialContactImage() finished.")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "social Partners images");
		}
	}

	setSocialPage(page: number) {
		try {
			if (page < 1 || page > this.pager.totalPages) {
				return;
			}

			if (this.paginationType == "csvPartners") {
				this.pager = this.socialPagerService.getPager(this.newPartnerUser.length, page, this.pageSize);
				this.pagedItems = this.newPartnerUser.slice(this.pager.startIndex, this.pager.endIndex + 1);
			} else {
				this.pager = this.socialPagerService.getPager(this.socialPartnerUsers.length, page, this.pageSize);
				this.pagedItems = this.socialPartnerUsers.slice(this.pager.startIndex, this.pager.endIndex + 1);

				var contactIds = this.pagedItems.map(function (a) { return a.id; });
				var items = $.grep(this.selectedContactListIds, function (element) {
					return $.inArray(element, contactIds) !== -1;
				});
				if (items.length == this.pager.pageSize || items.length == this.getGoogleConatacts.length || items.length == this.pagedItems.length) {
					this.isHeaderCheckBoxChecked = true;
				} else {
					this.isHeaderCheckBoxChecked = false;
				}
			}
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "setPage");
		}
	}

	googleContacts() {
		try {
			if (this.loggedInThroughVanityUrl) {
				this.googleVanityAuthentication();
				//this.referenceService.showSweetAlertInfoMessage();
			} else {
				if (this.selectedAddPartnerOption == 5 && !this.disableOtherFuctionality) {
					this.fileTypeError = false;
					this.socialPartners.firstName = '';
					this.socialPartners.lastName = '';
					this.socialPartners.emailId = '';
					this.socialPartners.contactName = '';
					this.socialPartners.showLogin = true;
					this.socialPartners.statusCode = 0;
					this.socialPartners.contactType = '';
					this.socialPartners.alias = '';
					this.socialPartners.socialNetwork = "GOOGLE";
					this.contactService.socialProviderName = 'google';
					this.xtremandLogger.info("socialContacts" + this.socialPartners.socialNetwork);
					this.contactService.googleLogin('partners')
						.subscribe(
							response => {
								let data = response.data;
								this.storeLogin = response.data;
								if (response.statusCode == 200) {
									this.getGoogleContactsUsers();
									this.xtremandLogger.info("called getGoogle contacts method:");
								} else {
									this.referenceService.callBackURLCondition = 'partners';
									localStorage.setItem("userAlias", data.userAlias)
									localStorage.setItem("currentModule", data.module)
									window.location.href = "" + data.redirectUrl;
								}
							},
							(error: any) => {
								this.xtremandLogger.error(error);
								if (error._body.includes("JSONObject") && error._body.includes("access_token") && error._body.includes("not found.")) {
									this.referenceService.showReAuthenticateMessage();
								} else {
									this.xtremandLogger.errorPage(error);
								}
							},
							() => this.xtremandLogger.log("AddContactsComponent googleContacts() finished.")
						);
				}
			}


		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "google partners");
		}
	}

	getGoogleContactsUsers() {
		try {
			let partnerModuleCustomName = localStorage.getItem('partnerModuleCustomName');
			let message = 'Retrieving ' + partnerModuleCustomName + ' from google...! Please Wait...It\'s processing';
			swal({
				text: message,
				allowOutsideClick: false,
				showConfirmButton: false,
				imageUrl: 'assets/images/loader.gif'
			});
			this.contactService.socialProviderName = 'google';
			this.socialPartners.socialNetwork = "GOOGLE";
			var self = this;
			this.contactService.getGoogleContacts(this.socialPartners)
				.subscribe(
					data => {
						this.getGoogleConatacts = data;
						swal.close();
						if (!this.getGoogleConatacts.contacts) {
							this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
							this.selectedAddPartnerOption = 5;
						} else {
							for (var i = 0; i < this.getGoogleConatacts.contacts.length; i++) {
								let socialContact = new SocialContact();
								let user = new User();
								socialContact.id = i;
								if (this.validateEmailAddress(this.getGoogleConatacts.contacts[i].emailId)) {
									socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
									socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
									socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
									this.socialPartnerUsers.push(socialContact);
								}
								this.contactService.socialProviderName = "";
								//  $( "#Gfile_preview" ).show();
								this.showFilePreview();
								$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
								$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
								$('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
								$('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.microsoftDynamicsImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
								$('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
								$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
							}
						}
						this.xtremandLogger.info(this.getGoogleConatacts);
						this.selectedAddPartnerOption = 3;
						this.setSocialPage(1);
						this.socialPartners.contacts = this.socialPartnerUsers;
						this.customResponse.isVisible = false;
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.log("googleContacts data :" + JSON.stringify(this.getGoogleConatacts.contacts))
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "getting google Partners");
		}
	}

	saveGoogleContacts() {
		this.socialPartners.socialNetwork = "GOOGLE";
		this.socialPartners.isPartnerUserList = this.isPartner;
		this.socialPartners.contactType = "CONTACT";
		this.socialPartners.contacts = this.socialPartnerUsers;
		this.selectedAddPartnerOption = 3;
		if (this.socialPartnerUsers.length > 0) {
			this.newPartnerUser = this.socialPartners.contacts;
			this.saveValidEmails();
		} else
			this.xtremandLogger.error("ManagePartnerComponent saveGoogleContacts() Contacts Null Error");
	}

	saveGoogleContactSelectedUsers() {
		this.selectedAddPartnerOption = 3;
		if (this.allselectedUsers.length != 0) {
			this.newPartnerUser = this.allselectedUsers;
			this.saveValidEmails();
		}
		else {
			this.xtremandLogger.error("ManagePartnerComponent saveGoogleContactSelectedUsers() ContactListName Error");
		}
	}

	zohoContacts() {
		try {
			this.fileTypeError = false;
			let self = this;
			self.selectedZohoDropDown = $("select.opts:visible option:selected ").val();
			if (self.selectedZohoDropDown == "DEFAULT") {
				alert("Please Select the which you like to import from:");
				return false;
			}
			else {
				if (self.selectedZohoDropDown == "contact") {
					self.contactType = self.selectedZohoDropDown;
					self.xtremandLogger.log(self.selectedZohoDropDown);
				}
				else if (this.selectedZohoDropDown == "lead") {
					self.contactType = self.selectedZohoDropDown;
					self.xtremandLogger.log(self.selectedZohoDropDown);
				}
				this.xtremandLogger.log(this.userName);
				this.xtremandLogger.log(this.password);
				this.getZohoContacts(self.contactType, this.userName, this.password);
			}
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "zoho Partners");
		}
	}

	hideZohoModal() {
		$('#zohoShowAuthorisedPopup').modal('hide');
		this.zohoErrorResponse = new CustomResponse();
	}



	getZohoContacts(contactType: any, username: string, password: string) {
		try {
			this.socialPartners.socialNetwork = "";
			var self = this;
			this.contactService.getZohoContacts(this.userName, this.password, this.contactType)
				.subscribe(
					data => {
						this.getGoogleConatacts = data;
						this.zohoImageBlur = false;
						this.zohoImageNormal = true;
						this.hideZohoModal();
						if (!this.getGoogleConatacts.contacts) {
							this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
							this.selectedAddPartnerOption = 5;
						} else {
							for (var i = 0; i < this.getGoogleConatacts.contacts.length; i++) {
								let socialContact = new SocialContact();
								let user = new User();
								socialContact.id = i;
								if (this.validateEmailAddress(this.getGoogleConatacts.contacts[i].emailId)) {
									socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
									socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
									socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
									this.socialPartnerUsers.push(socialContact);
								}
								// $( "#Gfile_preview" ).show();
								this.showFilePreview();
								$("#myModal .close").click()
								$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
								$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
								$('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
								$('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
								$('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
							}
						}
						this.xtremandLogger.info(this.getGoogleConatacts);
						this.selectedAddPartnerOption = 6;
						this.setSocialPage(1);
					},
					(error: any) => {
						var body = error['_body'];
						if (body != "") {
							var response = JSON.parse(body);
							if (response.message == "Username or password is incorrect") {
								this.zohoCredentialError = 'Username or password is incorrect';
								setTimeout(() => {
									this.zohoCredentialError = '';
								}, 5000)
							}
							if (response.message == "Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!") {
								this.zohoCredentialError = 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!';
								setTimeout(() => {
									this.zohoCredentialError = '';
								}, 5000)
							}
						} else {
							this.xtremandLogger.errorPage(error);
						}
						console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:" + error)

					},
					() => this.xtremandLogger.log("googleContacts data :" + JSON.stringify(this.getGoogleConatacts.contacts))
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "getting zoho Partners");
		}
	}

	hideZohoAuthorisedPopup() {
		$('#zohoShowAuthorisedPopup').modal('hide');
		this.zohoErrorResponse = new CustomResponse();
		this.cancelPartners()
	}
	authorisedZohoContacts() {
		try {
			let self = this;
			self.selectedZohoDropDown = $("select.opts:visible option:selected ").val();
			if (self.selectedZohoDropDown == "DEFAULT") {
				alert("Please Select the which you like to import from:");
				return false;
			}
			else {
				if (self.selectedZohoDropDown == "contact") {
					self.contactType = self.selectedZohoDropDown;
					self.xtremandLogger.log(self.selectedZohoDropDown);
				}
				else if (this.selectedZohoDropDown == "lead") {
					self.contactType = self.selectedZohoDropDown;
					self.xtremandLogger.log(self.selectedZohoDropDown);
				}

			}

			this.socialPartners.socialNetwork = "ZOHO";
			this.socialPartners.contactType = self.contactType;
			this.contactService.getZohoAutherizedContacts(this.socialPartners)
				.subscribe(
					data => {
						this.getGoogleConatacts = data;
						this.hideZohoAuthorisedPopup();
						this.selectedAddPartnerOption = 6;
						if (!this.getGoogleConatacts.contacts) {
							this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
							this.selectedAddPartnerOption = 5;
						} else {
							for (var i = 0; i < this.getGoogleConatacts.contacts.length; i++) {
								let socialContact = new SocialContact();
								socialContact.id = i;
								if (this.validateEmailAddress(this.getGoogleConatacts.contacts[i].emailId)) {
									socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
									socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
									socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
									this.socialPartnerUsers.push(socialContact);
								}
								//$( "#Gfile_preview" ).show();
								this.showFilePreview();
								$("#myModal .close").click()
								$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
								$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
								$('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
								$('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
								$('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
							}
						}
						this.xtremandLogger.info(this.getGoogleConatacts);
						this.setSocialPage(1);
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.log("googleContacts data :" + JSON.stringify(this.getGoogleConatacts.contacts))
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "zoho autherized Partners");
		}
	}

	saveZohoContacts() {
		this.socialPartners.socialNetwork = "ZOHO";
		this.socialPartners.contactType = this.contactType;
		this.socialPartners.contacts = this.socialPartnerUsers;
		if (this.socialPartnerUsers.length > 0) {
			this.newPartnerUser = this.socialPartners.contacts;
			this.saveValidEmails();
			localStorage.removeItem('isZohoSynchronization');
		} else
			this.xtremandLogger.error("AddContactComponent saveZohoContacts() Contacts Null Error");
		localStorage.removeItem('isZohoSynchronization');
	}

	saveZohoContactSelectedUsers() {
		this.newPartnerUser = this.allselectedUsers;
		if (this.allselectedUsers.length != 0) {
			this.newPartnerUser = this.allselectedUsers;
			this.saveValidEmails();
			localStorage.removeItem('isZohoSynchronization');
		}
		else {
			this.xtremandLogger.error("AddContactComponent saveZohoContactSelectedUsers() ContactList Name Error");
			localStorage.removeItem('isZohoSynchronization');
		}
	}

	onChange(item: any) {
		this.xtremandLogger.log(item);
		if (this.salesforceListViewName == "DEFAULT") {
			$("button#salesforce_save_button").prop('disabled', true);
		} else {
			$("button#salesforce_save_button").prop('disabled', false);
		}

		this.salesforceListViewId = item;
		for (var i = 0; i < this.salesforceListViewsData.length; i++) {
			this.xtremandLogger.log(this.salesforceListViewsData[i].listViewId);
			if (item == this.salesforceListViewsData[i].listViewId) {
				this.salesforceListViewName = this.salesforceListViewsData[i].listViewName;
			}
			this.xtremandLogger.log("listviewNameDROPDOWN" + this.salesforceListViewName);
		}
	}

	onChangeSalesforceDropdown(event: Event) {
		try {
			this.contactType = event.target["value"];
			this.socialNetwork = "salesforce";
			this.salesforceListViewsData = [];
			if (this.contactType == "DEFAULT") {
				$("button#salesforce_save_button").prop('disabled', true);
			} else {
				$("button#salesforce_save_button").prop('disabled', false);
			}

			if (this.contactType == "contact_listviews" || this.contactType == "lead_listviews") {
				$("button#salesforce_save_button").prop('disabled', true);
				this.contactService.getSalesforceContacts(this.socialNetwork, this.contactType)
					.subscribe(
						data => {
							if (data.listViews.length > 0) {
								for (var i = 0; i < data.listViews.length; i++) {
									this.salesforceListViewsData.push(data.listViews[i]);
									this.xtremandLogger.log(data.listViews[i]);
								}
							} else {
								this.customResponse = new CustomResponse('ERROR', "No " + this.contactType + " found", true);
								this.hideModal();
							}
						},
						(error: any) => {
							this.xtremandLogger.error(error);
							this.xtremandLogger.errorPage(error);
						},
						() => this.xtremandLogger.log("onChangeSalesforceDropdown")
					);
			}
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "salesforce Partners dropdown");
		}
	}

	showModal() {
		/*$( '#salesforceModal' ).appendTo( "body" ).modal( 'show' );
		$( '#salesforceModal' ).modal( 'show' );
		$('#salesforceModal').modal('toggle');
		$("#salesforceModal").modal();*/
		$('#TestSalesForceModal').modal('show');

	}

	hideModal() {
		$('#TestSalesForceModal').modal('hide');
		/*$( '#salesforceModal' ).modal( 'hide' );
		$( 'body' ).removeClass( 'modal-open' );
		$( '.modal-backdrop fade in' ).remove();
		$( '#overlay-modal' ).hide();
		$( '#salesforceModal' ).appendTo( "body" ).modal( 'hide' );*/

	}

	salesforceContacts() {
		try {
			if (this.loggedInThroughVanityUrl) {
				this.salesForceVanityAuthentication();
				//this.referenceService.showSweetAlertInfoMessage();
			} else {
				if (this.selectedAddPartnerOption == 5 && !this.disableOtherFuctionality) {
					this.contactType = "";
					this.fileTypeError = false;
					this.socialPartners.socialNetwork = "salesforce";
					this.xtremandLogger.info("socialContacts" + this.socialPartners.socialNetwork);
					this.contactService.salesforceLogin('partners')
						.subscribe(
							response => {
								this.storeLogin = response.data;
								let data = response.data;
								console.log(data);
								if (response.statusCode == 200) {
									this.showModal();
									console.log("AddContactComponent salesforce() Authentication Success");
									this.checkingPopupValues();
								} else {
									localStorage.setItem("userAlias", data.userAlias)
									localStorage.setItem("currentModule", data.module)
									console.log(data.redirectUrl);
									console.log(data.userAlias);
									window.location.href = "" + data.redirectUrl;
								}
							},
							(error: any) => {
								this.xtremandLogger.error(error);
							},
							() => this.xtremandLogger.log("addContactComponent salesforceContacts() login finished.")
						);
				}
			}

		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "salesforce Partners");
		}
	}

	checkingPopupValues() {
		if (this.contactType != "") {
			$("button#salesforce_save_button").prop('disabled', true);
			if (this.contactType == "contact_listviews" || this.contactType == "lead_listviews") {
				this.getSalesforceListViewContacts(this.contactType);
			} else {
				this.getSalesforceContacts(this.contactType);
			}
		}
	}

	getSalesforceContacts(contactType: any) {
		try {
			this.socialPartners.firstName = '';
			this.socialPartners.lastName = '';
			this.socialPartners.emailId = '';
			this.socialPartners.contactName = '';
			this.socialPartners.showLogin = true;
			this.socialPartners.jsonData = '';
			this.socialPartners.statusCode = 0;
			this.socialPartners.contactType = '';
			this.socialPartners.alias = '';
			this.socialNetwork = "salesforce";
			var self = this;
			var selectedDropDown = $("select.opts:visible option:selected ").val();
			if (selectedDropDown == "DEFAULT") {
				return false;
			}
			else {
				this.contactType = selectedDropDown;
				this.xtremandLogger.log("AddContactComponent getSalesforceContacts() selected Dropdown value:" + this.contactType)
			}

			this.contactService.getSalesforceContacts(this.socialNetwork, this.contactType)
				.subscribe(
					data => {
						this.getGoogleConatacts = data;
						this.selectedAddPartnerOption = 7;
						if (!this.getGoogleConatacts.contacts) {
							if (this.getGoogleConatacts.jsonData.includes("API_DISABLED_FOR_ORG")) {
								this.customResponse = new CustomResponse('ERROR', "Salesforce REST API is not enabled, Please change your Salesforce platform settings.", true);
							} else {
								this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
							}
							this.selectedAddPartnerOption = 5;
							this.hideModal();
							/* $( '#salesforceModal' ).modal( 'hide' );
							 $( 'body' ).removeClass( 'modal-open' );
							 $( '.modal-backdrop fade in' ).remove();
							 $( '#salesforceModal' ).appendTo( "body" ).modal( 'hide' );
							 $( '#overlay-modal' ).hide();*/
						} else {
							for (var i = 0; i < this.getGoogleConatacts.contacts.length; i++) {
								let socialContact = new SocialContact();
								let user = new User();
								socialContact.id = i;
								if (this.validateEmailAddress(this.getGoogleConatacts.contacts[i].emailId)) {
									socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
									socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
									socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
									this.socialPartnerUsers.push(socialContact);
								}
								//$( "#Gfile_preview" ).show();
								this.showFilePreview();
								this.hideModal();
								/*$( '#salesforceModal' ).modal( 'hide' );
								$( 'body' ).removeClass( 'modal-open' );
								$( '.modal-backdrop fade in' ).remove();
								//$( '#salesforceModal' ).appendTo( "body" ).modal( 'hide' );
								$( '#overlay-modal' ).hide();*/

								$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
								$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
								$('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
								$('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.microsoftDynamicsImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
								$('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
							}
						}
						this.xtremandLogger.info(this.getGoogleConatacts);
						this.customResponse.isVisible = false;
						this.setSocialPage(1);
					},
					(error: any) => {
						this.xtremandLogger.error(error);
					},
					() => this.xtremandLogger.log("addContactComponent getSalesforceContacts() Data:" + JSON.stringify(this.getGoogleConatacts.contacts))
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "getting salesforce Partners");
		}
	}

	getSalesforceListViewContacts(contactType: any) {
		try {
			this.socialPartners.firstName = '';
			this.socialPartners.lastName = '';
			this.socialPartners.emailId = '';
			this.socialPartners.contactName = '';
			this.socialPartners.showLogin = true;
			this.socialPartners.jsonData = '';
			this.socialPartners.statusCode = 0;
			this.socialPartners.contactType = '';
			this.socialPartners.alias = '';
			this.socialNetwork = "salesforce";
			var self = this;
			var selectedDropDown = $("select.opts:visible option:selected ").val();
			if (selectedDropDown == "DEFAULT") {
				return false;
			}
			else {
				this.contactType = selectedDropDown;
				this.xtremandLogger.log("AddContactComponent getSalesforceContacts() selected Dropdown value:" + this.contactType)
			}
			this.contactService.getSalesforceListViewContacts(this.socialNetwork, this.contactType, this.salesforceListViewId, this.salesforceListViewName)
				.subscribe(
					data => {
						this.getGoogleConatacts = data;
						this.selectedAddPartnerOption = 7;
						if (!this.getGoogleConatacts.contacts) {
							if (this.getGoogleConatacts.jsonData.includes("API_DISABLED_FOR_ORG")) {
								this.customResponse = new CustomResponse('ERROR', "Salesforce REST API is not enabled, Please change your Salesforce platform settings.", true);
							} else {
								this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
							}
							this.selectedAddPartnerOption = 5;
							this.hideModal();
						} else {
							for (var i = 0; i < this.getGoogleConatacts.contacts.length; i++) {
								let socialContact = new SocialContact();
								let user = new User();
								socialContact.id = i;
								if (this.validateEmailAddress(this.getGoogleConatacts.contacts[i].emailId)) {
									socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
									socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
									socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
									this.socialPartnerUsers.push(socialContact);
								}
								this.hideModal();
								//$( "#Gfile_preview" ).show();
								this.showFilePreview();
								$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
								$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
								$('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
								$('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.microsoftDynamicsImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
								$('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
								$('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
								$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
							}
						}
						this.xtremandLogger.info(this.getGoogleConatacts);
						this.customResponse.isVisible = false;
						this.setSocialPage(1);
					},
					(error: any) => {
						this.xtremandLogger.error(error);
					},
					() => this.xtremandLogger.log("addContactComponent getSalesforceContacts() Data:" + JSON.stringify(this.getGoogleConatacts.contacts))
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "salesforce listview Partners");
		}
	}

	saveSalesforceContactSelectedUsers() {
		this.newPartnerUser = this.allselectedUsers;
		if (this.allselectedUsers.length != 0) {
			this.xtremandLogger.info("update contacts #contactSelectedListId " + " data => " + JSON.stringify(this.allselectedUsers));
			this.newPartnerUser = this.allselectedUsers;
			this.saveValidEmails();
		}
		else {
			this.xtremandLogger.error("AddContactComponent saveSalesforceContactSelectedUsers() ContactList Name Error");
		}
	}

	saveSalesforceContacts() {
		this.socialPartners.socialNetwork = "salesforce";
		this.socialPartners.isPartnerUserList = this.isPartner;
		this.socialPartners.contactType = this.contactType;
		this.socialPartners.alias = this.salesforceListViewId;
		this.socialPartners.contacts = this.socialPartnerUsers;
		if (this.socialPartnerUsers.length > 0) {
			this.newPartnerUser = this.socialPartners.contacts;
			this.saveValidEmails();

		} else
			this.xtremandLogger.error("AddContactComponent saveSalesforceContacts() Contacts Null Error");
	}

	saveContacts() {
		this.validateLegalBasisOptions();
		if (this.isValidLegalOptions) {
			if (this.selectedAddPartnerOption == 2 || this.selectedAddPartnerOption == 1 || this.selectedAddPartnerOption == 4) {
				this.savePartnerUsers();
			}
			if (this.selectedAddPartnerOption == 3 || this.selectedAddPartnerOption == 6 || this.selectedAddPartnerOption == 7 || this.selectedAddPartnerOption == 8 || this.selectedAddPartnerOption == 9 || this.selectedAddPartnerOption == 10 || this.selectedAddPartnerOption == 11) {
				this.openCloudPartnerPopUp();
			}

		}

	}

	openCloudPartnerPopUp() {
		this.cloudPartnersModalCheckBox = false;
		$('#cloudPartnersModal').modal('show');
	}

	proceed() {
		this.cloudPartnersModalCheckBox = false;
		$('#cloudPartnersModal').modal('hide');
		if (this.selectedAddPartnerOption == 3) {
			if (this.allselectedUsers.length == 0) {
				this.saveGoogleContacts();
			} else
				this.saveGoogleContactSelectedUsers();
		}

		if (this.selectedAddPartnerOption == 6) {
			if (this.allselectedUsers.length == 0) {
				this.saveZohoContacts();
			} else
				this.saveZohoContactSelectedUsers();
		}

		if (this.selectedAddPartnerOption == 7) {
			if (this.allselectedUsers.length == 0) {
				this.saveSalesforceContacts();
			} else
				this.saveSalesforceContactSelectedUsers();
		}
		if (this.selectedAddPartnerOption == 8) {
			if (this.allselectedUsers.length == 0) {
				this.saveMarketoContacts();
			} else {
				this.saveMarketoContactSelectedUsers();
			}

		}

		if (this.selectedAddPartnerOption == 9) {
			if (this.allselectedUsers.length == 0) {
				this.saveHubSpotContacts();
			} else {
				this.saveHubSpotContactSelectedUsers();
			}
		}

		if (this.selectedAddPartnerOption == 10) {
			if (this.allselectedUsers.length == 0) {
				this.saveMicrosoftContacts();
			} else {
				this.saveMicrosoftContactSelectedUsers();
			}
		}

		if (this.selectedAddPartnerOption == 11) {
			if (this.allselectedUsers.length == 0) {
				this.savePipedriveContacts();
			} else {
				this.savePipedriveContactSelectedUsers();
			}
		}

	}


	validateLegalBasisOptions() {
		this.isValidLegalOptions = true;
		if (this.selectedAddPartnerOption != 1 && this.gdprStatus && this.selectedLegalBasisOptions.length == 0) {
			this.isValidLegalOptions = false;
		}
	}

	settingSocialNetworkOpenModal(socialNetwork: string) {
		this.settingSocialNetwork = socialNetwork;
		$('#settingSocialNetworkPartner').modal('show');
		// $('#settingSocialNetworkPartner').modal('toggle');
		// $('#settingSocialNetworkPartner').modal();
		// $( '#settingSocialNetwork' ).appendTo( "body" ).modal( 'show' );
		$("#settingSocialNetworkPartner").appendTo("body");
	}

	unlinkSocailAccount() {
		try {
			let socialNetwork = this.settingSocialNetwork.toUpperCase();
			console.log("CheckBoXValueUNlink" + this.isUnLinkSocialNetwork);
			this.contactService.unlinkSocailAccount(socialNetwork, this.isUnLinkSocialNetwork)
				.subscribe(
					(data: any) => {
						if (socialNetwork == 'SALESFORCE') {
							$("#salesforceContact_buttonNormal").hide();
							$("#salesforceGear").hide();
							this.sfImageBlur = true;
							this.socialContactImage();
						}
						else if (socialNetwork == 'GOOGLE') {
							$("#googleContact_buttonNormal").hide();
							$("#GoogleGear").hide();
							this.googleImageBlur = true;
						}
						else if (socialNetwork == 'ZOHO') {
							$("#zohoContact_buttonNormal").hide();
							$("#zohoGear").hide();
							this.zohoImageBlur = true;
						}
						$('#settingSocialNetworkPartner').modal('hide');
						this.customResponse = new CustomResponse('SUCCESS', this.properties.SOCIAL_ACCOUNT_REMOVED_SUCCESS, true);
					},
					(error: any) => {
						if (error._body.search('Please launch or delete those campaigns first') != -1) {
							this.Campaign = error;
							$('#settingSocialNetworkPartner').modal('hide');
							this.deleteErrorMessage = true;
							setTimeout(function () { $("#campaignError").slideUp(500); }, 3000);
						} else {
							this.xtremandLogger.errorPage(error);
						}
						console.log(error);
					},
					() => {
						$('#settingSocialNetworkPartner').modal('hide');
						this.cancelPartners();
						this.xtremandLogger.info("deleted completed");
					}
				);
			this.deleteErrorMessage = false;
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "unlink social accounts Partners");
		}
	}

	removeDuplicates(originalArray, prop) {
		var newArray = [];
		var lookupObject = {};
		for (var i in originalArray) {
			lookupObject[originalArray[i][prop]] = originalArray[i];
		}
		for (i in lookupObject) {
			newArray.push(lookupObject[i]);
		}
		return newArray;
	}

	checkAll(ev: any) {
		if (this.selectedAddPartnerOption != 8 && this.selectedAddPartnerOption != 9) {
			if (ev.target.checked) {
				console.log("checked");
				$('[name="campaignContact[]"]').prop('checked', true);
				let self = this;
				$('[name="campaignContact[]"]:checked').each(function () {
					var id = $(this).val();
					self.selectedContactListIds.push(parseInt(id));
					console.log(self.selectedContactListIds);
					$('#ContactListTable_' + id).addClass('contact-list-selected');
					for (var i = 0; i < self.pagedItems.length; i++) {
						var object = {
							"emailId": self.pagedItems[i].emailId,
							"firstName": self.pagedItems[i].firstName,
							"lastName": self.pagedItems[i].lastName,
						}
						if (self.pagedItems[i].contactCompany) {
							object['contactCompany'] = self.pagedItems[i].contactCompany;
						}
						self.allselectedUsers.push(object);
					}
				});
				this.allselectedUsers = this.removeDuplicates(this.allselectedUsers, 'emailId');
				this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
			} else {
				$('[name="campaignContact[]"]').prop('checked', false);
				$('#user_list_tb tr').removeClass("contact-list-selected");
				if (this.pager.maxResults == this.totalRecords) {
					this.selectedContactListIds = [];
					this.allselectedUsers.length = 0;
				} else {
					for (let j = 0; j < this.pagedItems.length; j++) {
						var paginationEmail = this.pagedItems[j].emailId;
						// this.allselectedUsers.splice( this.allselectedUsers.indexOf( paginationEmail ), 1 );
						this.allselectedUsers = this.referenceService.removeRowsFromPartnerOrContactListByEmailId(this.allselectedUsers, paginationEmail);
					}
					let currentPageContactIds = this.pagedItems.map(function (a) { return a.id; });
					this.selectedContactListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
				}
			}
			ev.stopPropagation();
		} else {
			this.checkAllForMarketo(ev);
		}
	}

	highlightRow(contactId: number, email: any, firstName: any, lastName: any, event: any, company: any) {
		let isChecked = $('#' + contactId).is(':checked');
		console.log(this.selectedContactListIds)
		if (isChecked) {
			$('#row_' + contactId).addClass('contact-list-selected');
			this.selectedContactListIds.push(contactId);
			var object = {
				"emailId": email,
				"firstName": firstName,
				"lastName": lastName,
				"contactCompany": company,
			}
			this.allselectedUsers.push(object);
			console.log(this.allselectedUsers);
		} else {
			$('#row_' + contactId).removeClass('contact-list-selected');
			this.selectedContactListIds.splice($.inArray(contactId, this.selectedContactListIds), 1);
			this.allselectedUsers = this.referenceService.removeRowsFromPartnerOrContactListByEmailId(this.allselectedUsers, email);
		}
		if (this.selectedContactListIds.length == this.pagedItems.length) {
			this.isHeaderCheckBoxChecked = true;
		} else {
			this.isHeaderCheckBoxChecked = false;
		}
		event.stopPropagation();
	}

	downloadFile(data: any) {
		try {
			this.resetResponse();
			let parsedResponse = data.text();
			let blob = new Blob([parsedResponse], { type: 'text/csv' });
			let url = window.URL.createObjectURL(blob);

			if (navigator.msSaveOrOpenBlob) {
				navigator.msSaveBlob(blob, 'Partner_List.csv');
			} else {
				let a = document.createElement('a');
				a.href = url;
				a.download = this.contactService.partnerListName + '.csv';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}
			window.URL.revokeObjectURL(url);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "download list of Partners");
		}
	}

	hasAccess() {
		try {
			return this.contactService.hasAccess(this.isPartner)
				.map(
					data => {
						const body = data['_body'];
						const response = JSON.parse(body);
						let access = response.access;
						if (access) {
							return true;
						} else {
							return false;
						}
					}
				);
		} catch (error) {
			this.xtremandLogger.error(error, "AddPartnersComponent", "hasAccess()");
		}
	}

	downloadPartnerList() {
		this.hasAccess().subscribe(
			data => {
				if (data) {
					try {
						this.downloadAssociatedPagination.userListId = this.partnerListId;
						this.downloadAssociatedPagination.userId = this.authenticationService.getUserId();
						if (this.isPartner && this.authenticationService.loggedInUserRole === "Team Member" && !this.authenticationService.isPartnerTeamMember) {
							this.referenceService.setTeamMemberFilterForPagination(this.downloadAssociatedPagination, this.selectedFilterIndex);
						}
						this.contactService.downloadContactList(this.downloadAssociatedPagination)
							.subscribe(
								data => this.downloadFile(data),
								(error: any) => {
									this.xtremandLogger.error(error);
									this.xtremandLogger.errorPage(error);
								},
								() => this.xtremandLogger.info("download partner List completed")
							);
					} catch (error) {
						this.xtremandLogger.error(error, "addPartnerComponent", "download Partner list");
					}
				} else {
					this.authenticationService.forceToLogout();
				}
			}
		);
	}

	sendMail(partnerId: number) {
		try {
			this.loading = true;
			this.pagination.partnerId = partnerId;
			this.pagination.userListId = this.partnerListId;
			this.pagination.userId = this.authenticationService.getUserId();

			this.contactService.mailSend(this.pagination)
				.subscribe(
					data => {
						if (data.access) {
							this.loading = false;
							this.customResponse = new CustomResponse('SUCCESS', this.properties.EMAIL_SENT_SUCCESS, true);
							this.referenceService.goToTop();
							this.loadPartnerList(this.pagination);
						} else {
							this.authenticationService.forceToLogout();
						}
					},
					(error: any) => {
						this.customResponse = new CustomResponse('ERROR', 'Some thing went wrong please try after some time.', true);
						this.xtremandLogger.error(error);
						this.loading = false;
					},
					() => this.xtremandLogger.log("Manage Partner component Mail send method successfull")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "resending Partner email");
		}
	}

	contactCompanyChecking(contactCompany: string) {
		if (contactCompany.trim() != '') {
			this.isCompanyDetails = true;
		} else {
			this.isCompanyDetails = false;
		}
	}

	selectedPageNumber(event) {
		this.pageNumber.value = event;
		if (event === 0) { event = this.socialPartnerUsers.length; }
		this.pageSize = event;
		this.setSocialPage(1);
	}

	getContactsAssocialteCampaigns() {
		try {
			this.contactService.contactListAssociatedCampaigns(this.partnerListId, this.contactAssociatedCampaignPagination)
				.subscribe(
					data => {
						this.contactListAssociatedCampaignsList = data.data;
						if (this.contactListAssociatedCampaignsList) {
							this.openCampaignModal = true;
						}
					},
					error => console.log(error),
					() => {
					}
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "getting associated campaigns");
		}
	}



	closeModal(event) {
		if (event === "Emails Send Successfully") {
			let message = "Your " + this.authenticationService.partnerModule.customName + " list has been updated successfully and any selected campaigns have been launched";
			this.customResponse = new CustomResponse('SUCCESS', message, true);
		}

		if (event === "users are unSubscribed for emails") {
			this.customResponse = new CustomResponse('ERROR', "The partners are unsubscribed for receiving the campaign emails.", true);
		}

		if (event === "user has unSubscribed for emails") {
			this.customResponse = new CustomResponse('ERROR', "The " + this.authenticationService.partnerModule.customName + " has unsubscribed for receiving the campaign emails.", true);
		}

		if (event === "Emails Sending failed") {
			this.customResponse = new CustomResponse('ERROR', "Failed to send Emails", true);
		}
		this.openCampaignModal = false;
		this.contactListAssociatedCampaignsList.length = 0;
	}

	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }

	saveAsChange(showGDPR: boolean) {

		if (this.editContactComponent.selectedContactForSave.length === 0) {
			this.customResponse = new CustomResponse('ERROR', "Please select atleast one " + this.authenticationService.partnerModule.customName + " to create the list", true);

		} else {
			this.hasAccess().subscribe(
				data => {
					if (data) {
						try {
							this.showGDPR = showGDPR;
							this.isSaveAsList = true;
							this.saveAsListName = this.editContactComponent.addCopyToField();

						} catch (error) {
							this.xtremandLogger.error(error, "Add Partner component", "saveAsChange()");
						}
					} else {
						this.authenticationService.forceToLogout();
					}
				}
			);
		}
	}
	saveAsInputChecking() {
		try {
			const names = this.referenceService.namesArray;
			const inputName = this.saveAsListName.toLowerCase().replace(/\s/g, '');
			if ($.inArray(inputName, names) > -1) {
				this.saveAsError = 'This list name is already taken.';
			} else {
				if (this.saveAsListName !== "" && this.saveAsListName.length < 250) {
					this.editContactComponent.saveDuplicateContactList(this.saveAsListName, [], true);
					$('#saveAsAddPartnerModal').modal('hide');
				}
				else if (this.saveAsListName === "") { this.saveAsError = 'List Name is Required.'; }
				else { this.saveAsError = 'You have exceeded 250 characters!'; }
			}
		} catch (error) {
			this.xtremandLogger.error(error, "Add partner Component", "saveAsInputChecking()");
		}
	}
	closeSaveAsModal() {
		this.saveAsListName = undefined;
		this.referenceService.namesArray = undefined;
		this.contactService.isLoadingList = false;
		this.isSaveAsList = false;
	}


	ngAfterViewInit() { }

	ngAfterViewChecked() {
		let tempCheckGoogleAuth = localStorage.getItem('isGoogleAuth');
		let tempCheckSalesForceAuth = localStorage.getItem('isSalesForceAuth');
		let tempCheckHubSpotAuth = localStorage.getItem('isHubSpotAuth');
		let tempCheckMicrosoftAuth = localStorage.getItem('isMicrosoftAuth');
		let tempZohoAuth = localStorage.getItem('isZohoAuth');
		let tempValidationMessage: string = '';
		tempValidationMessage = localStorage.getItem('validationMessage');
		localStorage.removeItem('isGoogleAuth');
		localStorage.removeItem('isSalesForceAuth');
		localStorage.removeItem('isHubSpotAuth');
		localStorage.removeItem('isMicrosoftAuth');
		localStorage.removeItem('isZohoAuth');
		localStorage.removeItem('validationMessage');
		if (tempCheckGoogleAuth == 'yes') {
			this.getGoogleContactsUsers();
			tempCheckGoogleAuth = 'no';
			this.contactService.vanitySocialProviderName = "nothing";
			//this.router.navigate(['/home/partners/add']);
		}
		else if (tempCheckSalesForceAuth == 'yes') {
			this.showModal();
			console.log("AddContactComponent salesforce() Authentication Success");
			this.checkingPopupValues();
			tempCheckSalesForceAuth = 'no';
			this.contactService.vanitySocialProviderName = "nothing";
		}
		else if (tempCheckHubSpotAuth == 'yes') {
			this.showHubSpotModal();
			tempCheckHubSpotAuth = 'no';
			this.contactService.vanitySocialProviderName = "nothing";
		}
		else if (tempCheckMicrosoftAuth == 'yes') {
			this.getMicrosoftContacts();
			tempCheckMicrosoftAuth = 'no';
			this.contactService.vanitySocialProviderName = "nothing";
		}
		else if (tempZohoAuth == 'yes') {
			this.zohoShowModal();
			this.checkingZohoPopupValues();
			tempZohoAuth = 'no';
			this.contactService.vanitySocialProviderName = "nothing";
		}
		else if (tempValidationMessage != null && tempValidationMessage.length > 0 && this.isPartner) {
			swal.close();
			this.customResponse = new CustomResponse('ERROR', tempValidationMessage, true);
		}
	}

 urlLink:any;
	ngOnInit() {
		try {
			this.socialContactImage();
			this.searchWithModuleName = "Partner";
			$("#Gfile_preview").hide();
			this.socialContactsValue = true;
			this.loggedInUserId = this.authenticationService.getUserId();
				if (this.authenticationService.loggedInUserRole === "Team Member" && !this.authenticationService.isPartnerTeamMember) {
					this.pagination.partnerTeamMemberGroupFilter = true;
				}
				this.defaultPartnerList(this.loggedInUserId);
			if (this.contactService.socialProviderName == 'google') {
				if (this.contactService.oauthCallbackMessage.length > 0) {
					let message = this.contactService.oauthCallbackMessage;
					this.contactService.oauthCallbackMessage = '';
					this.customResponse = new CustomResponse('ERROR', message, true);
				} else {
					this.getGoogleContactsUsers();
					this.contactService.socialProviderName = "nothing";
				}
			} else if (this.contactService.socialProviderName == 'salesforce') {
				if (this.contactService.oauthCallbackMessage.length > 0) {
					let message = this.contactService.oauthCallbackMessage;
					this.contactService.oauthCallbackMessage = '';
					this.customResponse = new CustomResponse('ERROR', message, true);
				} else {
					this.showModal();
					this.contactService.socialProviderName = "nothing";
				}
			} else if (this.contactService.socialProviderName == 'zoho') {
				if (this.contactService.oauthCallbackMessage.length > 0) {
					let message = this.contactService.oauthCallbackMessage;
					this.contactService.oauthCallbackMessage = '';
					this.customResponse = new CustomResponse('ERROR', message, true);
				} else {
					this.zohoShowModal();
					this.contactService.socialProviderName = "nothing";
				}
			}

			/********Check Gdpr Settings******************/
			this.checkTermsAndConditionStatus();
			this.getLegalBasisOptions();

			window.addEventListener('message', function (e) {
				window.removeEventListener('message', function (e) { }, true);
				console.log('received message:  ' + e.data, e);

				if (e.data == 'isGoogleAuth') {
					localStorage.setItem('isGoogleAuth', 'yes');
				}
				else if (e.data == 'isSalesForceAuth') {
					localStorage.setItem('isSalesForceAuth', 'yes');
				}
				else if (e.data == 'isHubSpotAuth') {
					localStorage.setItem('isHubSpotAuth', 'yes');
				}
				else if (e.data == 'isMicrosoftAuth') {
					localStorage.setItem('isMicrosoftAuth', 'yes');
				}
				else if (e.data == 'isZohoAuth') {
					localStorage.setItem('isZohoAuth', 'yes');
				} else if (e.data != null && e.data.includes("You have already configured")) {
					localStorage.setItem('validationMessage', e.data);
				}
			}, false);
		}
		catch (error) {
			this.xtremandLogger.error("addPartner.component oninit " + error);
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
		this.loading = false;
	}

	getLegalBasisOptions() {
		if (this.companyId > 0) {
			this.loading = true;
			this.fields = { text: 'name', value: 'id' };
			this.referenceService.getLegalBasisOptions(this.companyId)
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
		this.loading = false;
	}

	ngOnDestroy() {
		this.contactService.socialProviderName = "";
		this.referenceService.callBackURLCondition = '';
		this.hideModal();
		this.hideZohoModal();
		this.contactService.isContactModalPopup = false;
		this.updatePartnerUser = false;
		$('#settingSocialNetworkPartner').modal('hide');
		$("body>#settingSocialNetworkPartner").remove();
		$('body').removeClass('modal-backdrop in');

		// if ( this.selectedAddPartnerOption !=5 && this.router.url !=='/login' && !this.isDuplicateEmailId ) {
		//    let self = this;
		//     swal( {
		//         title: 'Are you sure?',
		//         text: "You have unsaved data",
		//         type: 'warning',
		//         showCancelButton: true,
		//         confirmButtonColor: '#54a7e9',
		//         cancelButtonColor: '#999',
		//         confirmButtonText: 'Yes, Save it!',
		//         cancelButtonText: "No"

		//     }).then( function() {
		//         self.saveContacts();
		//     }, function( dismiss ) {
		//         if ( dismiss === 'No' ) {
		//             self.selectedAddPartnerOption = 5;
		//         }
		//     })
		// }
		if (this.selectedAddPartnerOption == 5) {
			swal.close();
		}

	}


	/**
	 *
	 * MARKETO
	 */


	// Marketo Contacts
	marketoContacts() {
	}
	checkingMarketoContactsAuthentication() {
		if (this.loggedInThroughVanityUrl) {
			this.referenceService.showSweetAlertInfoMessage();
		} else {
			this.selectedAddPartnerOption = 8;
			try {
				if (this.selectedAddPartnerOption == 8 && !this.disableOtherFuctionality) {
					this.contactService.checkMarketoCredentials(this.authenticationService.getUserId())
						.subscribe(
							(data: any) => {

								if (data.statusCode == 8000) {
									this.showMarketoForm = false;

									this.marketoAuthError = false;
									this.loading = false;
									this.retriveMarketoContacts();
								}
								else {


									$("#marketoShowLoginPopup").modal('show');
									this.marketoAuthError = false;
									this.loading = false;

								}
								this.xtremandLogger.info(data);

							},
							(error: any) => {
								var body = error['_body'];
								if (body != "") {
									var response = JSON.parse(body);
									if (response.message == "Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!") {
										this.customResponse = new CustomResponse('ERROR', 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account', true);
									} else {
										this.xtremandLogger.errorPage(error);
									}
								} else {
									this.xtremandLogger.errorPage(error);
								}
								console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:" + error)

							},
							() => this.xtremandLogger.info("Add contact component loadContactListsName() finished")
						)
				}
			} catch (error) {
				this.xtremandLogger.error(error, "AddContactsComponent zohoContactsAuthenticationChecking().")
			}
		}


	}

	saveMarketoContacts() {

		this.socialPartners.socialNetwork = "MARKETO";
		this.socialPartners.contactType = this.contactType;
		this.socialPartners.contacts = this.socialPartnerUsers;
		if (this.socialPartnerUsers.length > 0) {
			this.newPartnerUser = this.socialPartners.contacts;
			this.saveValidEmails();
		} else
			this.xtremandLogger.error("AddContactComponent saveMarketoContacts() Contacts Null Error");

	}

	saveMarketoContactSelectedUsers() {

		this.newPartnerUser = this.allselectedUsers;
		if (this.allselectedUsers.length != 0) {
			this.newPartnerUser = this.allselectedUsers;
			this.saveValidEmails();
		}
		else {
			this.xtremandLogger.error("AddContactComponent saveMarketoContactSelectedUsers() ContactList Name Error");
		}

	}

	authorisedMarketoContacts() {
	}
	retriveMarketoContacts() {
		this.loading = true;
		$("#marketoShowLoginPopup").modal('hide');
		this.contactService.getMarketoContacts(this.authenticationService.getUserId()).subscribe(data => {
			if (data.statusCode === 200) {
				this.selectedAddPartnerOption = 8;
				this.marketoImageBlur = false;
				this.marketoImageNormal = true;
				this.getMarketoConatacts = data.data;
				this.getGoogleConatacts = data.data;

				//this.getMarketoConatacts = data.data;
				this.loadingMarketo = false;

				if (this.getMarketoConatacts.length == 0) {
					this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
				} else {
					for (var i = 0; i < this.getMarketoConatacts.length; i++) {
						let socialPartner = new SocialContact();
						let user = new User();
						socialPartner.id = i;
						if (this.validateEmailAddress(this.getMarketoConatacts[i].email)) {
							socialPartner.emailId = this.getMarketoConatacts[i].email;
							socialPartner.firstName = this.getMarketoConatacts[i].firstName;
							socialPartner.lastName = this.getMarketoConatacts[i].lastName;

							socialPartner.country = this.getMarketoConatacts[i].country;
							socialPartner.city = this.getMarketoConatacts[i].city;
							socialPartner.state = this.getMarketoConatacts[i].state;
							socialPartner.postalCode = this.getMarketoConatacts[i].postalCode;
							socialPartner.address = this.getMarketoConatacts[i].address;
							socialPartner.company = this.getMarketoConatacts[i].company;
							socialPartner.title = this.getMarketoConatacts[i].title;
							socialPartner.mobilePhone = this.getMarketoConatacts[i].mobilePhone;

							this.socialPartnerUsers.push(socialPartner);
						}
						//$( "#Gfile_preview" ).show();
						this.showFilePreview();
						$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
						$('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
						$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
						$('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
						$('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
						$('.microsoftDynamicsImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
						$('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
						$('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
						$('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
						$('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
						$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
					}

				}
				this.xtremandLogger.info(this.getMarketoConatacts);
				this.setSocialPage(1);
			} else if (data.statusCode === 400) {
				this.selectedAddPartnerOption = 5;
				this.customResponse = new CustomResponse('ERROR', data.message, true);
			}
			this.loading = false;
		},
			(error: any) => {
				this.loading = false;
				this.xtremandLogger.error(error);
				this.xtremandLogger.errorPage(error);
			},
			() => this.xtremandLogger.log("marketoContacts data :" + JSON.stringify(this.getMarketoConatacts)


			));
	}
	hideMarketoAuthorisedPopup() {
		$("#marketoShowAuthorisedPopup").hide();
	}

	getMarketoContacts() {
		this.loadingMarketo = true;
		const obj = {
			userId: this.authenticationService.getUserId(),
			instanceUrl: this.marketoInstance,
			clientId: this.marketoClientId,
			clientSecret: this.marketoSecretId
		}

		this.contactService.saveMarketoCredentials(obj).subscribe(response => {
			if (response.statusCode == 8003) {
				this.showMarketoForm = false;
				// this.checkMarketoCredentials();
				this.marketoContactError = false;
				this.marketoContactSuccessMsg = response.message;
				this.loadingMarketo = false;
				this.retriveMarketoContacts();
			} else {

				$("#marketoShowLoginPopup").modal('show');
				this.marketoContactError = response.message;
				this.marketoContactSuccessMsg = false;
				this.loadingMarketo = false;
			}
		}, (error: any) => {
			this.marketoContactError = error;
			this.loadingMarketo = false;
		}
		)
	}

	validateModelForm(fieldId: any) {
		var errorClass = "form-group has-error has-feedback";
		var successClass = "form-group has-success has-feedback";

		if (fieldId == 'email') {
			if (this.marketoClientId.length > 0) {
				this.marketoClientIdClass = successClass;
				this.marketoClentIdError = false;
			} else {
				this.marketoClientIdClass = errorClass;
				this.marketoClentIdError = true;
			}
		} else if (fieldId == 'pwd') {
			if (this.marketoSecretId.length > 0) {
				this.marketoSecretIdClass = successClass;
				this.marketoSecretIdError = false;
			} else {
				this.marketoSecretIdClass = errorClass;
				this.marketoSecretIdError = true;
			}
		} else if (fieldId == 'instance') {
			if (this.marketoInstance.length > 0) {
				this.marketoInstanceClass = successClass;
				this.marketoInstanceError = false;
			} else {
				this.marketoInstanceClass = errorClass;
				this.marketoInstanceError = false;
			}
		}
		this.toggleMarketoSubmitButtonState();
	}
	toggleMarketoSubmitButtonState() {
		if (!this.marketoClentIdError && !this.marketoSecretIdError && !this.marketoInstanceError)
			this.isMarketoModelFormValid = true;
		else
			this.isMarketoModelFormValid = false;
	}

	hideMarketoModal() {
		$("#marketoShowLoginPopup").hide();
		this.cancelPartners();
	}


	highlightMarketoRow(user: any, event, index) {
		let isChecked = $('#' + user.id).is(':checked');

		if (isChecked) {
			$('#row_' + user.id).addClass('contact-list-selected');
			this.selectedContactListIds.push(user.id);
			var object = {
				"id": user.id,
				"email": user.emailId,
				"firstName": user.firstName,
				"lastName": user.lastName,
				"country": user.country,
				"city": user.city,
				"state": user.state,
				"postalCode": user.postalCode,
				"zipCode": user.postalCode,
				"address": user.address,
				"company": user.company,
				"contactCompany": user.company,
				"title": user.title,
				"jobTitle": user.title,
				"mobilePhone": user.mobilePhone,
				"mobileNumber": user.mobilePhone
			}
			this.allselectedUsers.push(object);
			console.log(this.allselectedUsers);
		} else {
			$('#row_' + user.id).removeClass('contact-list-selected');
			this.selectedContactListIds.splice($.inArray(user.id, this.selectedContactListIds), 1);

			this.allselectedUsers.forEach((value) => {
				if (value.id == user.id) {
					console.log(value);
					console.log(this.allselectedUsers.indexOf(value))
					this.allselectedUsers.splice(this.allselectedUsers.indexOf(value), 1);
				}
			});

			//  this.allselectedUsers.splice($.inArray(user.id, this.allselectedUsers), 1);
		}
		if (this.selectedContactListIds.length == this.pagedItems.length) {
			this.isHeaderCheckBoxChecked = true;
		} else {
			this.isHeaderCheckBoxChecked = false;
		}
		event.stopPropagation();
		console.log(this.allselectedUsers);
	}

	checkAllForMarketo(ev: any) {
		if (ev.target.checked) {
			console.log("checked");
			$('[name="campaignContact[]"]').prop('checked', true);
			let self = this;
			$('[name="campaignContact[]"]:checked').each(function () {
				var id = $(this).val();
				self.selectedContactListIds.push(parseInt(id));
				console.log(self.selectedContactListIds);
				$('#ContactListTable_' + id).addClass('contact-list-selected');
				for (var i = 0; i < self.pagedItems.length; i++) {
					var object = {

						"id": self.pagedItems[i].id,
						"email": self.pagedItems[i].emailId,
						"firstName": self.pagedItems[i].firstName,
						"lastName": self.pagedItems[i].lastName,
						"country": self.pagedItems[i].country,
						"city": self.pagedItems[i].city,
						"state": self.pagedItems[i].state,
						"postalCode": self.pagedItems[i].postalCode,
						"zipCode": self.pagedItems[i].postalCode,
						"address": self.pagedItems[i].address,
						"company": self.pagedItems[i].company,
						"contactCompany": self.pagedItems[i].company,
						"title": self.pagedItems[i].title,
						"jobTitle": self.pagedItems[i].title,
						"mobilePhone": self.pagedItems[i].mobilePhone,
						"mobileNumber": self.pagedItems[i].mobilePhone
					}
					console.log(object);
					self.allselectedUsers.push(object);
				}
			});
			this.allselectedUsers = this.removeDuplicates(this.allselectedUsers, 'email');
			this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
		} else {
			$('[name="campaignContact[]"]').prop('checked', false);
			$('#user_list_tb tr').removeClass("contact-list-selected");
			if (this.pager.maxResults == this.pager.totalItems) {
				this.selectedContactListIds = [];
				this.allselectedUsers.length = 0;
			} else {
				for (let j = 0; j < this.pagedItems.length; j++) {
					var paginationEmail = this.pagedItems[j].emailId;
					// this.allselectedUsers.splice(this.allselectedUsers.indexOf(paginationEmail), 1);
					this.allselectedUsers = this.referenceService.removeRowsFromPartnerOrContactListByEmailId(this.allselectedUsers, paginationEmail);
				}
				let currentPageContactIds = this.pagedItems.map(function (a) { return a.id; });
				this.selectedContactListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
			}
		}
		console.log(this.allselectedUsers);
		ev.stopPropagation();
	}

	validateMarketoContacts(socialUsers: any) {
		let users = [];
		for (let i = 0; i < socialUsers.length; i++) {
			if (socialUsers[i].email !== null && this.validateEmailAddress(socialUsers[i].email)) {
				let email = socialUsers[i].email.toLowerCase();
				socialUsers[i].email = email;
				users.push(socialUsers[i]);
			}
		}
		return users;
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


	// HubSpot Implementation

	checkingHubSpotContactsAuthentication() {
		if (this.loggedInThroughVanityUrl) {
			this.hubSpotVanityAuthentication()
		} else {
			if (this.selectedAddPartnerOption == 5) {
				this.hubSpotService.configHubSpot().subscribe(data => {
					let response = data;
					if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
						this.xtremandLogger.info("isAuthorize true");
						this.showHubSpotModal();
					}
					else {
						if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
							window.location.href = response.data.redirectUrl;
						}
					}
				}, (error: any) => {
					this.xtremandLogger.error(error, "Error in HubSpot checkIntegrations()");
				}, () => this.xtremandLogger.log("HubSpot Configuration Checking done"));
			}
		}


	}

	hubSpotVanityAuthentication() {
		this.contactService.vanitySocialProviderName = 'hubspot';
		this.hubSpotService.configHubSpot().subscribe(data => {
			let response = data;
			let providerName = 'hubspot'
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.xtremandLogger.info("isAuthorize true");
				this.showHubSpotModal();
			}
			else {
				if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
					this.loggedInUserId = this.authenticationService.getUserId();
					this.hubSpotCurrentUser = localStorage.getItem('currentUser');
					let vanityUserId = JSON.parse(this.hubSpotCurrentUser)['userId'];
					let url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + data.userAlias + "/" + data.module + "/" + null;

					var x = screen.width / 2 - 700 / 2;
					var y = screen.height / 2 - 450 / 2;
					window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,addressbar=noresizable=yes,top=" + y + ",left=" + x + ",width=700,height=485");

				}
			}
		}, (error: any) => {
			this.xtremandLogger.error(error, "Error in HubSpot checkIntegrations()");
		}, () => this.xtremandLogger.log("HubSpot Configuration Checking done"));
	}

	showHubSpotModal() {
		$('#ContactHubSpotModal').modal('show');
		this.selectedAddPartnerOption = 9;
	}

	hideHubSpotModal() {
		$('#ContactHubSpotModal').modal('hide');
	}

	onChangeHubSpotDropdown(event: Event) {
		try {
			this.contactType = event.target["value"];
			this.socialNetwork = "hubspot";
			this.hubSpotContactListsData = [];
			if (this.contactType == "DEFAULT") {
				$("button#hubspot_save_button").prop('disabled', true);
			} else {
				$("button#hubspot_save_button").prop('disabled', false);
			}


			if (this.contactType === "lists") {
				$("button#hubspot_save_button").prop('disabled', true);
				this.hubSpotService.getHubSpotContactsLists()
					.subscribe(
						data => {
							let response = data.data;
							if (response.contacts.length > 0) {
								for (var i = 0; i < response.contacts.length; i++) {
									this.hubSpotContactListsData.push(response.contacts[i]);
									this.xtremandLogger.log(response.contacts[i]);
								}
							} else {
								this.customResponse = new CustomResponse('ERROR', "No " + this.contactType + " found", true);
								this.hideHubSpotModal();
							}
						},
						(error: any) => {
							this.xtremandLogger.error(error);
							this.xtremandLogger.errorPage(error);
						},
						() => this.xtremandLogger.log("onChangeHubSpotDropdown")
					);
			}
		} catch (error) {
			this.xtremandLogger.error(error, "AddContactsComponent onChangeHubSpotDropdown().")
		}
	}

	onChangeHubSpotListsDropdown(item: any) {
		this.xtremandLogger.log(item);
		//this.contactType = event.target["value"];
		if (this.contactType == "DEFAULT") {
			$("button#hubspot_save_button").prop('disabled', true);
		} else {
			$("button#hubspot_save_button").prop('disabled', false);
		}
		this.hubSpotSelectContactListOption = item;
	}

	getHubSpotData() {
		$("button#salesforce_save_button").prop('disabled', true);
		if (this.contactType === "contacts") {
			this.getHubSpotContacts();
		} else if (this.contactType === "lists") {
			this.getHubSpotContactsListsById();
		}
	}

	getHubSpotContacts() {
		this.hubSpotService.getHubSpotContacts().subscribe(data => {
			let response = data.data;
			this.selectedAddPartnerOption = 9;
			this.frameHubSpotFilePreview(response);
		});
	}

	getHubSpotContactsListsById() {
		this.xtremandLogger.info("hubSpotSelectContactListOption :" + this.hubSpotSelectContactListOption);
		if (this.hubSpotSelectContactListOption !== undefined && this.hubSpotSelectContactListOption !== '') {
			this.hubSpotService.getHubSpotContactsListsById(this.hubSpotSelectContactListOption).subscribe(data => {
				let response = data.data;
				this.selectedAddPartnerOption = 9;
				this.frameHubSpotFilePreview(response);
			});
		}
	}

	frameHubSpotFilePreview(response: any) {
		if (!response.contacts) {
			this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
		} else {
			/*this.socialPartnerUsers = [];
			this.getGoogleConatacts  = response.contacts.length;
			let socialContact = new SocialContact();safsa
		   // socialContact = response.contacts;
			for ( var i = 0; i < response.contacts.length; i++ ) {
				this.xtremandLogger.log("HubSpot Partner :" + response.contacts[i].firstName );
				socialContact.id = i;


				if (this.validateEmailAddress(response.contacts[i].email))
				{
					socialContact.emailId = response.contacts[i].email;
					socialContact.firstName = response.contacts[i].firstName;
					socialContact.lastName = response.contacts[i].lastName;

					socialContact.country = response.contacts[i].country;
					socialContact.city = response.contacts[i].city;
					socialContact.state = response.contacts[i].state;
					socialContact.postalCode = response.contacts[i].postalCode;
					socialContact.address = response.contacts[i].address;
					socialContact.company = response.contacts[i].company;
					socialContact.title = response.contacts[i].title;
					socialContact.mobilePhone = response.contacts[i].mobilePhone;
					socialContact.website = response.contacts[i].website;
				}
				this.socialPartnerUsers.push(socialContact);
					if ( this.validateEmailAddress(response.contacts[i].email ) ) {
						this.socialPartnerUsers.push( socialContact );
					}*/

			// this.getMarketoConatacts = data.data;
			this.getGoogleConatacts = response.contacts.length;
			if (response.contacts.length == 0) {
				this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
			} else {
				for (var i = 0; i < response.contacts.length; i++) {
					let socialPartner = new SocialContact();
					let user = new User();
					socialPartner.id = i;
					if (this.validateEmailAddress(response.contacts[i].email)) {
						socialPartner.emailId = response.contacts[i].email;
						socialPartner.firstName = response.contacts[i].firstName;
						socialPartner.lastName = response.contacts[i].lastName;

						socialPartner.country = response.contacts[i].country;
						socialPartner.city = response.contacts[i].city;
						socialPartner.state = response.contacts[i].state;
						socialPartner.postalCode = response.contacts[i].postalCode;
						socialPartner.address = response.contacts[i].address;
						socialPartner.company = response.contacts[i].company;
						socialPartner.title = response.contacts[i].title;
						socialPartner.mobilePhone = response.contacts[i].mobilePhone;

						this.socialPartnerUsers.push(socialPartner);
					}


					$("button#sample_editable_1_new").prop('disabled', false);
					// $( "#Gfile_preview" ).show();
					this.showFilePreview();
					$("button#cancel_button").prop('disabled', false);
					this.hideHubSpotModal();
					$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
					$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
					$('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
					$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
					$('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
					$('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
					$('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
					$('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
					$('.microsoftDynamicsImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
					$('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
					$('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
					$('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');					
					$('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
				}
			}
			this.setSocialPage(1);
			this.customResponse.isVisible = false;
			this.selectedAddPartnerOption = 9;
			console.log("Social Contact Users for HubSpot::" + this.socialPartnerUsers);
		}
	}

	saveHubSpotContacts() {
		this.socialPartners.socialNetwork = "HUBSPOT";
		this.socialPartners.contactType = this.contactType;
		this.socialPartners.contacts = this.socialPartnerUsers;
		if (this.socialPartnerUsers.length > 0) {
			this.newPartnerUser = this.socialPartners.contacts;
			this.saveValidEmails();
		} else
			this.xtremandLogger.error("AddContactComponent saveMarketoContacts() Contacts Null Error");

	}

	saveHubSpotContactSelectedUsers() {
		this.newPartnerUser = this.allselectedUsers;
		if (this.allselectedUsers.length != 0) {
			this.newPartnerUser = this.allselectedUsers;
			this.saveValidEmails();
		}
		else {
			this.xtremandLogger.error("AddContactComponent saveHubSpotContactSelectedUsers() ContactList Name Error");
		}
	}

	saveMicrosoftContacts() {
		this.socialPartners.socialNetwork = "MICROSOFT";
		this.socialPartners.contactType = this.contactType;
		this.socialPartners.contacts = this.socialPartnerUsers;
		if (this.socialPartnerUsers.length > 0) {
			this.newPartnerUser = this.socialPartners.contacts;
			this.saveValidEmails();
		} else
			this.xtremandLogger.error("AddContactComponent saveMicrosoftContacts() Contacts Null Error");

	}

	saveMicrosoftContactSelectedUsers() {
		this.newPartnerUser = this.allselectedUsers;
		if (this.allselectedUsers.length != 0) {
			this.newPartnerUser = this.allselectedUsers;
			this.saveValidEmails();
		}
		else {
			this.xtremandLogger.error("AddContactComponent saveMicrosoftContactSelectedUsers() ContactList Name Error");
		}
	}

	savePipedriveContacts() {
		this.socialPartners.socialNetwork = "PIPEDRIVE";
		this.socialPartners.contactType = this.contactType;
		this.socialPartners.contacts = this.socialPartnerUsers;
		if (this.socialPartnerUsers.length > 0) {
			this.newPartnerUser = this.socialPartners.contacts;
			this.saveValidEmails();
		} else
			this.xtremandLogger.error("AddContactComponent savePipedriveContacts() Contacts Null Error");

	}

	savePipedriveContactSelectedUsers() {
		this.newPartnerUser = this.allselectedUsers;
		if (this.allselectedUsers.length != 0) {
			this.newPartnerUser = this.allselectedUsers;
			this.saveValidEmails();
		}
		else {
			this.xtremandLogger.error("AddContactComponent savePipedriveContactSelectedUsers() ContactList Name Error");
		}
	}

	hideHuspotModal() {
		$("#ContactHubSpotModal").hide();
		this.cancelPartners();
	}

	setLegalBasisOptions(contact: User) {
		if (this.gdprStatus && this.selectedLegalBasisOptions.length > 0) {
			contact.legalBasis = this.selectedLegalBasisOptions;
		}
	}
	showFilePreview() {
		$("#Gfile_preview").show();
		this.filePreview = true;
	}

	removeContactListUsers() {
		try {
			this.xtremandLogger.info(this.editContactComponent.selectedContactListIds);
			this.contactService.removeContactListUsers(this.partnerListId, this.editContactComponent.selectedContactListIds)
				.subscribe(
					(data: any) => {
						if (data.access) {
							let message = "Your " + this.authenticationService.partnerModule.customName + "(s) have been deleted successfully";
							this.customResponse = new CustomResponse('SUCCESS', message, true);
							this.loadPartnerList(this.pagination);
							this.editContactComponent.selectedContactListIds.length = 0;
						} else {
							this.authenticationService.forceToLogout();
						}
					},
					(error: any) => {
						if (error._body.includes('Please launch or delete those campaigns first')) {
							this.customResponse = new CustomResponse('ERROR', error._body, true);
						} else {
							this.xtremandLogger.errorPage(error);
						}
						console.log(error);
					},
					() => this.xtremandLogger.info("delete completed")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "AddPartnerComponent", "deleting partner()");
		}
	}

	showAlert() {
		this.xtremandLogger.info("userIdForChecked" + this.editContactComponent.selectedContactListIds);
		if (this.editContactComponent.selectedContactListIds.length != 0) {
			this.xtremandLogger.info("contactListId in sweetAlert() " + this.partnerListId);
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
				self.removeContactListUsers();
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		}
	}

	setLegalBasisOptionString(list: any) {
		if (this.gdprStatus) {
			let self = this;
			$.each(list, function (index, contact) {
				if (self.legalBasisOptions.length > 0) {
					let filteredLegalBasisOptions = $.grep(self.legalBasisOptions, function (e) { return contact.legalBasis.indexOf(e.id) > -1 });
					let selectedLegalBasisOptionsArray = filteredLegalBasisOptions.map(function (a) { return a.name; });
					contact.legalBasisString = selectedLegalBasisOptionsArray;
				}
			});
		}
	}

	/************Add Campaigns Pop up****************************** */
	addCampaigns(contact: any) {
		this.sendCampaignComponent.openPopUp(this.partnerListId, contact, "Partner");
	}


	/*openCampaignsPopupForNewlyAddedPartners() {
		this.sendCampaignComponent.openPopUpForNewlyAddedPartnersOrContacts(this.partnerListId, this.newUserDetails, "Partner");
	}*/

	/**********************Sravan************************ */
	/*checkingZohoContactsAuthentication() {
		try {

			if(this.loggedInThroughVanityUrl){
				this.referenceService.showSweetAlertInfoMessage();
			}else{
				if ( this.selectedAddPartnerOption == 5 && !this.disableOtherFuctionality ) {
					this.contactService.checkingZohoAuthentication(this.isPartner)
						.subscribe(
						( data: any ) => {
							this.storeLogin = data;
							if ( this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM" ) {
								this.getZohoContactsUsingOAuth2();
							} else{
								localStorage.setItem( "userAlias", data.userAlias )
								localStorage.setItem( "isPartner", data.isPartner );
								window.location.href = "" + data.redirectUrl;
							}
						},
						( error: any ) => {
						   this.referenceService.showSweetAlertServerErrorMessage();

						},
						() => this.xtremandLogger.info( "Add contact component loadContactListsName() finished" )
						)
				}
			}


		} catch ( error ) {
			this.xtremandLogger.error( error, "addPartnerComponent", "zoho authentication cheking" );
		}
	}

	getZohoContactsUsingOAuth2(){
		this.socialPartners.socialNetwork = "ZOHO";
		this.socialPartners.contactType = this.contactType;
		this.socialPartners.contactType = "CONTACT";
		swal( {
			text: 'Retrieving partners from zoho...! Please Wait...It\'s processing',
			allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
		});
		this.contactService.getZohoAutherizedContacts(this.socialPartners)
				.subscribe(
				data => {
					this.getGoogleConatacts = data;
					this.zohoImageBlur = false;
					this.zohoImageNormal = true;
					if ( !this.getGoogleConatacts.contacts ) {
						this.customResponse = new CustomResponse( 'ERROR', this.properties.NO_RESULTS_FOUND, true );
						this.selectedAddPartnerOption = 5;
						$("button#cancel_button").prop('disabled', false);
					} else {
						for ( var i = 0; i < this.getGoogleConatacts.contacts.length; i++ ) {
							let socialContact = new SocialContact();
							socialContact.id = i;
							if ( this.validateEmailAddress( this.getGoogleConatacts.contacts[i].emailId ) ) {
								socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
								socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
								socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
								this.socialPartnerUsers.push( socialContact );
							}
							this.showFilePreview();
							$( "#myModal .close" ).click()
							$( '.mdImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
							$( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
							$( '#uploadCSV' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px' );
							$( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;' );
							$( '.salesForceImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
							$( '.googleImageClass' ).attr( 'style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed' );
							$( '#SgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
							$( '#GgearIcon' ).attr( 'style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);' );
						}
					}
					this.selectedAddPartnerOption = 6;
					this.setSocialPage( 1 );
					swal.close();
				},
				( error: any ) => {
					swal.close();
					this.xtremandLogger.error( error );
					this.xtremandLogger.errorPage( error );
				},
				() => this.xtremandLogger.log( "googleContacts data :" + JSON.stringify( this.getGoogleConatacts.contacts ) )
				);

	}*/


	checkingZohoContactsAuthentication() {
		try {
			this.selectedAddPartnerOption = 6;
			if (this.loggedInThroughVanityUrl) {
				this.zohoVanityUrlAuthentication();
			}
			else {
				if (this.selectedAddPartnerOption == 6 && !this.disableOtherFuctionality) {
					this.contactService.checkingZohoAuthentication(this.module)
						.subscribe(
							(response: any) => {
								let data = response.data;
								this.storeLogin = data;
								if (response.statusCode == 200) {
									this.zohoShowModal();
								} else {
									localStorage.setItem("userAlias", data.userAlias)
									localStorage.setItem("currentModule", data.module);
									window.location.href = "" + data.redirectUrl;

								}
							},
							(error: any) => {
								this.referenceService.showSweetAlertServerErrorMessage();
							},
							() => this.xtremandLogger.info("Add contact component checkingZohoContactsAuthentication() finished")
						)
				}
			}
		} catch (error) {
			this.xtremandLogger.error(error, "AddContactsComponent zohoContactsAuthenticationChecking().")
		}
	}


	zohoVanityUrlAuthentication() {
		this.authenticationService.vanityURLEnabled == true;
		this.contactService.vanitySocialProviderName = 'zoho';
		let providerName = 'zoho';
		if (this.selectedAddPartnerOption == 6 && !this.disableOtherFuctionality) {
			this.contactService.checkingZohoAuthentication(this.module)
				.subscribe(
					(response: any) => {
						let data = response.data;
						this.storeLogin = data;
						if (response.statusCode == 200) {
							this.zohoShowModal();
						} else {
							localStorage.setItem("userAlias", data.userAlias)
							localStorage.setItem("currentModule", data.module);
							localStorage.setItem("statusCode", data.statusCode);
							localStorage.setItem('vanityUrlFilter', 'true');
							this.loggedInUserId = this.authenticationService.getUserId();
							this.zohoCurrentUser = localStorage.getItem('currentUser');
							const encodedData = window.btoa(this.zohoCurrentUser);
							const encodedUrl = window.btoa(data.redirectUrl);
							let vanityUserId = JSON.parse(this.zohoCurrentUser)['userId'];

							let url = null;
							if (data.redirectUrl) {
								url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + data.userAlias + "/" + data.module + "/" + null;

							} else {
								url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
							}

							var x = screen.width / 2 - 700 / 2;
							var y = screen.height / 2 - 450 / 2;
							window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
						}
					},
					(error: any) => {
						this.referenceService.showSweetAlertServerErrorMessage();
					},
					() => this.xtremandLogger.info("Add contact component checkingZohoContactsAuthentication() finished")
				)
		}
	}

	getZohoContactsUsingOAuth2() {
		this.socialPartners.socialNetwork = 'zoho';
		this.socialPartners.contactType = this.contactType;
		this.socialPartners.contactType = "CONTACT";
		this.contactType = "CONTACT";
		swal({
			text: 'Retrieving contacts from zoho...! Please Wait...It\'s processing',
			allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
		});

		this.contactService.getZohoAutherizedContacts(this.socialPartners)
			.subscribe(
				data => {
					if (data.statusCode != null && data.statusCode != 200) {
						swal.close();
						this.hideZohoAuthorisedPopup();
						this.customResponse = new CustomResponse('INFO', data.message, true);
						// this.isZohoRedirectUrlButton = true;
						//  this.zohoAuthentication();
						this.selectedAddPartnerOption = 6;
						this.zohoImageBlur = true;
						this.zohoImageNormal = false;
					}
					else {
						this.processZohoContactsToDisplayInUI(data);

					}

				},
				(error: any) => {
					swal.close();
					this.xtremandLogger.error(error);
					this.xtremandLogger.errorPage(error);
				},
			);
	}

	zohoAuthentication() {
		this.contactService.checkingZohoAuthentication(this.module)
			.subscribe(
				(data: any) => {
					this.zohoAuthUrl = data.redirectUrl;
				},
				(error: any) => {
					swal.close();
					this.xtremandLogger.error(error);
					this.xtremandLogger.errorPage(error);
				},
			);


	}


	getZohoLeadsUsingOAuth2() {
		this.socialPartners.socialNetwork = 'zoho';
		this.socialPartners.contactType = this.contactType;
		this.socialPartners.contactType = "LEAD";
		this.contactType = "LEAD";
		swal({
			text: 'Retrieving leads from zoho...! Please Wait...It\'s processing',
			allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
		});

		this.contactService.getZohoAutherizedLeads(this.socialPartners)
			.subscribe(
				data => {
					this.selectedAddPartnerOption = 6;
					if (data.statusCode != null && data.statusCode != 200) {
						swal.close();
						this.hideZohoAuthorisedPopup();
						this.customResponse = new CustomResponse('INFO', data.message, true);
						this.selectedAddPartnerOption = 6;
						this.zohoImageBlur = true;
						this.zohoImageNormal = false;
					}
					else {
						this.processZohoContactsToDisplayInUI(data);

					}

				},
				(error: any) => {
					swal.close();
					this.xtremandLogger.error(error);
					this.xtremandLogger.errorPage(error);
				},
			);

	}


	processZohoContactsToDisplayInUI(data) {
		swal.close();
		this.hideZohoAuthorisedPopup();
		this.getGoogleConatacts = data;
		this.zohoImageNormal = false;
		this.zohoImageBlur = false;
		this.socialContactImage();
		let contacts = this.getGoogleConatacts['contacts'];
		if (contacts != null && contacts.length > 0) {
			for (var i = 0; i < this.getGoogleConatacts.contacts.length; i++) {
				let socialContact = new SocialContact();
				socialContact.id = i;
				if (this.validateEmailAddress(this.getGoogleConatacts.contacts[i].emailId)) {
					socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
					socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
					socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
					socialContact.company = this.getGoogleConatacts.contacts[i].contactCompany;
					socialContact.contactCompany = this.getGoogleConatacts.contacts[i].contactCompany;
					this.socialPartnerUsers.push(socialContact);
				}

			}

			this.showFilePreview();
			$("#myModal .close").click()
			$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
			$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
			$('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
			$('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
			$('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');

		} else {
			this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
			$("button#cancel_button").prop('disabled', false);

		}
		this.selectedAddPartnerOption = 6;
		this.setSocialPage(1);
		this.customResponse.isVisible = false;
		swal.close();
	}

	zohoShowModal() {
		$('#zohoShowAuthorisedPopup').modal('show');
	}

	goToCampaigns(contact: any) {
		this.loading = true;
		let self = this;
		setTimeout(function () {
			self.router.navigate(["/home/campaigns/user-campaigns/pa/" + contact.id]);
		}, 250);
	}

	googleVanityAuthentication() {
		//this.noOptionsClickError = false;
		this.xtremandLogger.info("addPartnerComponent googlecontacts() login:");
		this.socialPartners.firstName = '';
		this.socialPartners.lastName = '';
		this.socialPartners.emailId = '';
		this.socialPartners.contactName = '';
		this.socialPartners.showLogin = true;
		this.socialPartners.jsonData = '';
		this.socialPartners.statusCode = 0;
		this.socialPartners.contactType = '';
		this.socialPartners.alias = '';
		this.socialPartners.socialNetwork = "GOOGLE";
		this.contactService.socialProviderName = 'google';
		this.contactService.vanitySocialProviderName = 'google';
		this.xtremandLogger.info("socialContacts" + this.socialPartners.socialNetwork);
		let providerName = 'google';
		this.contactService.googleLogin('partners')
			.subscribe(
				response => {
					let data = response.data;
					this.storeLogin = data;
					if (response.statusCode == 200) {
						this.getGoogleContactsUsers();
						this.xtremandLogger.info("called getGoogle contacts method:");
					} else {
						localStorage.setItem("userAlias", data.userAlias);
						localStorage.setItem("currentModule", data.module);
						localStorage.setItem("statusCode", data.statusCode);
						localStorage.setItem('vanityUrlFilter', 'true');
						console.log(data.redirectUrl);
						console.log(data.userAlias);
						this.googleCurrentUser = localStorage.getItem('currentUser');
						const encodedData = window.btoa(this.googleCurrentUser);
						let vanityUserId = JSON.parse(this.googleCurrentUser)['userId'];
						let url = null;
						if (data.redirectUrl) {
							url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + data.userAlias + "/" + data.module + "/" + null;

						} else {
							url = this.authenticationService.APP_URL + "v/" + providerName + "/" + encodedData;
						}

						var x = screen.width / 2 - 700 / 2;
						var y = screen.height / 2 - 450 / 2;
						window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
					}
				},
				(error: any) => {
					this.xtremandLogger.error(error);
					if (error._body.includes("JSONObject") && error._body.includes("access_token") && error._body.includes("not found.")) {
						this.xtremandLogger.errorMessage = 'authentication was not successful, you might have changed the password of social account or other reasons, please unlink your account and reconnect it.';
					}
					this.xtremandLogger.errorPage(error);
				},
				() => this.xtremandLogger.log("AddContactsComponent() googleContacts() finished.")
			);

	}

	salesForceVanityAuthentication() {
		//if (this.selectedAddContactsOption == 8 && !this.disableOtherFuctionality) {
		this.contactType = "";
		//this.noOptionsClickError = false;
		this.socialPartners.socialNetwork = "salesforce";
		this.contactService.socialProviderName = 'salesforce';
		this.contactService.vanitySocialProviderName = 'salesforce'; //Added by ajay for setting up social provider name when authenticating from vanity
		this.xtremandLogger.info("socialContacts" + this.socialPartners.socialNetwork);
		let providerName = 'salesforce';
		this.contactService.salesforceLogin('partners')
			.subscribe(
				response => {
					let data = response.data;
					console.log(data);
					if (response.statusCode == 200) {
						this.showModal();
						console.log("AddContactComponent salesforce() Authentication Success");
						this.checkingPopupValues();
					} else {
						localStorage.setItem("userAlias", data.userAlias)
						localStorage.setItem("currentModule", data.module)
						localStorage.setItem('vanityUrlFilter', 'true');
						console.log(data.redirectUrl);
						console.log(data.userAlias);
						this.salesForceCurrentUser = localStorage.getItem('currentUser');
						let vanityUserId = JSON.parse(this.salesForceCurrentUser)['userId'];
						let url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + data.userAlias + "/" + data.module + "/" + null;
						var x = screen.width / 2 - 700 / 2;
						var y = screen.height / 2 - 450 / 2;
						window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,addressbar=noresizable=yes,top=" + y + ",left=" + x + ",width=700,height=485");

					}
				},
				(error: any) => {
					this.xtremandLogger.error(error);
				},
				() => this.xtremandLogger.log("addContactComponent salesforceContacts() login finished.")
			);
		//}
	}

	onChangeZohoDropdown(event: Event) {
		try {
			this.contactType = event.target["value"];
			this.socialPartners.contactType = event.target["value"];
		} catch (error) {
			this.xtremandLogger.error(error, "AddContactsComponent SalesforceContactsDropdown().")
		}
	}

	checkingZohoPopupValues() {
		let self = this;
		self.selectedZohoDropDown = $("select.opts:visible option:selected ").val();
		if (this.selectedZohoDropDown == "DEFAULT") {
			this.zohoErrorResponse = new CustomResponse('ERROR', 'Please select atleast one option', true);
			this.zohoPopupLoader = false;
		} else if (this.selectedZohoDropDown == "contact") {
			this.zohoPopupLoader = false;
			this.getZohoContactsUsingOAuth2();
		} else if (this.selectedZohoDropDown == "lead") {
			this.zohoPopupLoader = false;
			this.getZohoLeadsUsingOAuth2();
		}
	}

	/********XNFR-85********/
	currentPartner: any;
	previewLoader = false;
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
    $.each(this.newPartnerUser,function (partnerUserIndex: number, partnerUser: any) {
        if (index != partnerUserIndex) {
          partnerUser.expand = false;
        }
      }
    );
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
			$("#partner-tm-group-" + partner.index).prop("disabled", true);
		} else {
			$("#partner-tm-group-" + partner.index).prop("disabled", false);
		}
	}

	getSelectedIndex(index: number) {
		this.selectedFilterIndex = index;
		this.referenceService.setTeamMemberFilterForPagination(this.pagination, index);
		this.defaultPartnerList(this.loggedInUserId);
	}

	resetResponse() {
		this.customResponse = new CustomResponse();
	}
	saveTodos(): void {
		this.edited = true;
	}

	checkingMicrosoftDynamicsAuthentication() {
		if (this.selectedAddPartnerOption == 5) {
			this.integrationService.checkConfigurationByType('microsoft').subscribe(data => {
				let response = data;
				if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
					this.xtremandLogger.info("isAuthorize true");
					this.getMicrosoftContacts();
				}
				else {
					this.showMiscrosoftPreSettingsForm();
				}
			}, (error: any) => {
                this.loading = false;
                let errorMessage = this.referenceService.getApiErrorMessage(error);
                this.customResponse = new CustomResponse('ERROR',errorMessage,true);
            this.xtremandLogger.error(error, "Error in Microsoft checkIntegrations()");
        }, () =>                 
        this.xtremandLogger.log("Microsoft Configuration Checking done")
        );
    }
}

	getMicrosoftContacts() {
		this.loading = true;
		this.integrationService.getContacts('microsoft').subscribe(data => {
			this.loading = false;
			if (data.statusCode == 401) {
				this.customResponse = new CustomResponse('ERROR', data.message, true);
			} else {
				let response = data.data;
				this.selectedAddPartnerOption = 10;
				this.disableOtherFuctionality = true;
				this.microsoftDynamicsImageBlur = false;
				this.microsoftDynamicsImageNormal = true;
				this.frameMicrosoftPreview(response);
			}
		},(error: any) => {
            this.loading = false;
            let errorMessage = this.referenceService.getApiErrorMessage(error);
            this.customResponse = new CustomResponse('ERROR',errorMessage,true);
    }, () =>                 
    this.xtremandLogger.log("Microsoft Configuration Checking done")
    );
}

	frameMicrosoftPreview(response: any) {
		if (!response.contacts) {
			this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
		} else {			
			this.getGoogleConatacts = response.contacts.length;
			if (response.contacts.length == 0) {
				this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
			} else {
				for (var i = 0; i < response.contacts.length; i++) {
					let socialPartner = new SocialContact();
					let user = new User();
					socialPartner.id = i;
					if (this.validateEmailAddress(response.contacts[i].email)) {
						socialPartner.emailId = response.contacts[i].email;
						socialPartner.firstName = response.contacts[i].firstName;
						socialPartner.lastName = response.contacts[i].lastName;

						socialPartner.country = response.contacts[i].country;
						socialPartner.city = response.contacts[i].city;
						socialPartner.state = response.contacts[i].state;
						socialPartner.postalCode = response.contacts[i].postalCode;
						socialPartner.address = response.contacts[i].address;
						socialPartner.company = response.contacts[i].company;
						socialPartner.title = response.contacts[i].title;
						socialPartner.mobilePhone = response.contacts[i].mobilePhone;

						this.socialPartnerUsers.push(socialPartner);
					}
				}

				$("button#sample_editable_1_new").prop('disabled', false);
				// $( "#Gfile_preview" ).show();
				this.showFilePreview();
				$("button#cancel_button").prop('disabled', false);
				$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
				$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
				$('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
				$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
				$('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
				$('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
				$('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
				$('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
				$('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
				$('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
				$('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
				$('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
				$('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
			}
			this.setSocialPage(1);
			this.customResponse.isVisible = false;
			this.selectedAddPartnerOption = 10;
			console.log("Social Contact Users for Microsoft::" + this.socialPartnerUsers);
		}
	}

	showMiscrosoftPreSettingsForm() {        
        this.showMicrosoftAuthenticationForm = true;
    }

	closeMicrosoftForm (event: any) {
		if (event === "0") {
			this.showMicrosoftAuthenticationForm = false;
		}		
	}
  /*******XNFR-130*****/
  applyForAll(selectedPartner: any) {
    this.selectedPartner = selectedPartner;
    this.sweetAlertParameterDto.text=this.properties.partnerTeamMemberGroupSelectionSweetAlertMessage;
    this.sweetAlertParameterDto.confirmButtonText = "Yes";
    this.showSweetAlert = true;
  }

  receiveEvent(event:any){
    if(event){
      this.processingPartnersLoader = true;
      this.applyForAllClicked = true;
      this.selectAllTeamMemberGroupId = this.selectedPartner.teamMemberGroupId;
      this.selectAllTeamMemberIds = this.selectedPartner.selectedTeamMemberIds;
      this.validatePartners();
      this.showSweetAlert = false;
    }else{
      this.showSweetAlert = false;
    }
  }

  resetApplyFilter(){
    this.selectAllTeamMemberGroupId = 0;
    this.selectAllTeamMemberIds = [];
    this.applyForAllClicked = false;
  }

  //XNFR-230
  checkingPipedriveContactsAuthentication() {
	if (this.selectedAddPartnerOption == 5) {
		this.integrationService.checkConfigurationByType('pipedrive').subscribe(data => {
			let response = data;
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
				this.xtremandLogger.info("isAuthorize true");
				this.getPipedriveContacts();
			}
			else {
				this.showPipedrivePreSettingsForm();
			}
		}, (error: any) => {
			this.loading = false;
			let errorMessage = this.referenceService.getApiErrorMessage(error);
			this.customResponse = new CustomResponse('ERROR',errorMessage,true);
		this.xtremandLogger.error(error, "Error in Pipedrive checkIntegrations()");
	}, () =>                 
	this.xtremandLogger.log("Pipedrive Configuration Checking done")
	);
}
}
showPipedrivePreSettingsForm() {               
	this.showPipedriveAuthenticationForm = true;
 }
 closePipedriveForm (event: any) {
	if (event === "0") {
		this.showPipedriveAuthenticationForm = false;
	}		
}
getPipedriveContacts() {
	this.loading = true;
	this.integrationService.getContacts('pipedrive').subscribe(data => {
		this.loading = false;
		if (data.statusCode == 401) {
			this.customResponse = new CustomResponse( 'ERROR', data.message, true );
		} else {
			let response = data.data;
			this.selectedAddPartnerOption = 11;
			this.disableOtherFuctionality = true;
			this.pipedriveImageBlur = false;
			this.pipedriveImageNormal = true;
			this.framePipedrivePreview(response);
		}
	},(error: any) => {
			this.loading = false;
			let errorMessage = this.referenceService.getApiErrorMessage(error);
			this.customResponse = new CustomResponse('ERROR',errorMessage,true);
	}, () =>                 
	this.xtremandLogger.log("Pipedrive Configuration Checking done")
	);
}
framePipedrivePreview(response: any) {
	if (!response.contacts) {
		this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
	} else {			
		this.getGoogleConatacts = response.contacts.length;
		if (response.contacts.length == 0) {
			this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
		} else {
			for (var i = 0; i < response.contacts.length; i++) {
				let socialPartner = new SocialContact();
				let user = new User();
				socialPartner.id = i;
				if (this.validateEmailAddress(response.contacts[i].email)) {
					socialPartner.emailId = response.contacts[i].email;
					socialPartner.firstName = response.contacts[i].firstName;
					socialPartner.lastName = response.contacts[i].lastName;

					socialPartner.country = response.contacts[i].country;
					socialPartner.city = response.contacts[i].city;
					socialPartner.state = response.contacts[i].state;
					socialPartner.postalCode = response.contacts[i].postalCode;
					socialPartner.address = response.contacts[i].address;
					socialPartner.company = response.contacts[i].company;
					socialPartner.title = response.contacts[i].title;
					socialPartner.mobilePhone = response.contacts[i].mobilePhone;

					this.socialPartnerUsers.push(socialPartner);
				}
			}

			$("button#sample_editable_1_new").prop('disabled', false);
			// $( "#Gfile_preview" ).show();
			this.showFilePreview();
			$("button#cancel_button").prop('disabled', false);
			$('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
			$('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
			$('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
			$('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
			$('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('.microsoftDynamicsImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
			$('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
			$('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
			$('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
		}
		this.setSocialPage(1);
		this.customResponse.isVisible = false;
		this.selectedAddPartnerOption = 11;
		console.log("Social Contact Users for Pipedrive::" + this.socialPartnerUsers);
	}
}

/****XNFR-278****/
openMergePopup(){
	this.mergeOptionClicked = true;
	this.selectedUserIdsForMerging = this.editContactComponent.selectedContactListIds;
}

copyGroupUsersModalPopupEventReceiver(){
	this.mergeOptionClicked = false;
	this.selectedUserIdsForMerging = [];
}



}