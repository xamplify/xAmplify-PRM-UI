import { Component, OnInit, AfterViewInit, AfterViewChecked, Renderer, ViewChild } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { Criteria } from '../models/criteria';
import { ContactsByType } from '../models/contacts-by-type';
import { User } from '../../core/models/user';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { ActionsDescription } from '../../common/models/actions-description';
import { Router } from "@angular/router";
import { AuthenticationService } from '../../core/services/authentication.service';
import { SocialContact } from '../models/social-contact';
import { UserListIds } from '../models/user-listIds';
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { GdprSetting } from '../../dashboard/models/gdpr-setting';
import { LegalBasisOption } from '../../dashboard/models/legal-basis-option';
import { UserService } from '../../core/services/user.service';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { UserUserListWrapper } from '../models/user-userlist-wrapper';
import { UserListPaginationWrapper } from '../models/userlist-pagination-wrapper';
import { VanityLoginDto } from '../../util/models/vanity-login-dto';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { SortOption } from 'app/core/models/sort-option';
import { SendCampaignsComponent } from '../../common/send-campaigns/send-campaigns.component';

declare var Metronic, $, Layout, Demo, Portfolio, swal: any;

@Component({
	selector: 'app-manage-contacts',
	templateUrl: './manage-contacts.component.html',
	styleUrls: ['./manage-contacts.component.css', '../../../assets/css/phone-number-plugin.css'],
	providers: [SocialContact, Pagination, Properties, ActionsDescription, CallActionSwitch]
})

export class ManageContactsComponent implements OnInit, AfterViewInit, AfterViewChecked {
	
	@ViewChild('sendCampaignComponent') sendCampaignComponent: SendCampaignsComponent;
	userUserListWrapper: UserUserListWrapper = new UserUserListWrapper();
    userListPaginationWrapper : UserListPaginationWrapper = new UserListPaginationWrapper();

	assignLeads :boolean = false;
	public socialContact: SocialContact;
	public googleSynchronizeButton: boolean;
	public storeLogin: any;
	contactListObject: ContactList;
	criteria = new Criteria();
	criterias = new Array<Criteria>();
	filterValue: any;

	hasContactRole: boolean = false;
	hasPartnersRole : boolean = false;
	loggedInUserId = 0;
	hasAllAccess = false;
	contactListUsers = [];
	gettingAllUserspagination: Pagination = new Pagination();
	sharedDetailsPagination: Pagination = new Pagination();

	selectedContactListIds = [];
	selectedInvalidContactIds = [];
	paginationAllData = [];
	selectedAllContactUsers = new Array<User>();
	isHeaderCheckBoxChecked: boolean = false;
	public contactLists: Array<ContactList>;
	selectedContactListId: number;
	selectedContactListName: string;
	isDefaultPartnerList: boolean;
	isSynchronizationList: boolean;
	uploadedUserId: number;
	showAll: boolean;
	showEdit: boolean;
	public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

	contactCountLoad: boolean = false;
	isSegmentation: boolean = false;
	isSegmentationErrorMessage: boolean;
	filterConditionErrorMessage = "";

	listContactData: boolean = true;
	customResponse: CustomResponse = new CustomResponse();
	emailNotificationCustomResponse:CustomResponse = new CustomResponse();
	invalidRemovableContacts = [];
	allselectedUsers = [];
	isInvalidHeaderCheckBoxChecked: boolean = false;
	invalidDeleteSucessMessage: boolean;
	invalidDeleteErrorMessage: boolean = false;

	public invalidIds: Array<UserListIds>;
	defaultPartnerListId: number;

	contactsByType: ContactsByType = new ContactsByType();
	downloadDataList = [];

    /*
     * Display all the contactLists in manage contacts page by default.
       If 'showListOfContactList' is set to false,display category wise contacts.
    */
	showListOfContactList: boolean = true;

	showAllContactData: boolean = false;
	public contactListName: string;
	public model: any = {};
	public alias: any;
	public contactType: string;
	public userListIds: Array<UserListIds>;
	public searchKey: string;
	sortcolumn: string = null;
	sortingOrder: string = null;
	users: User[];
	access_token: string;
	pager: any = {};
	pagedItems: any[];
	names: string[] = [];
	isValidContactName: boolean;
	noSaveButtonDisable: boolean;
	public totalRecords: number;
	loading = false;

	searchContactType = "";
	contactListIdForSyncLocal: any;
	socialNetworkForSyncLocal: any;	

	sortOptions = [
		{ 'name': 'Sort by', 'value': '', 'for': '' },
		{ 'name': 'List name (A-Z)', 'value': 'name-ASC', 'for': 'contactList' },
		{ 'name': 'List name (Z-A)', 'value': 'name-DESC', 'for': 'contactList' },
		{ 'name': 'Creation date (ASC)', 'value': 'createdTime-ASC', 'for': 'contactList' },
		{ 'name': 'Creation date (DESC)', 'value': 'createdTime-DESC', 'for': 'contactList' },

		{ 'name': 'Email (A-Z)', 'value': 'emailId-ASC', 'for': 'contacts' },
		{ 'name': 'Email (Z-A)', 'value': 'emailId-DESC', 'for': 'contacts' },
		{ 'name': 'First name (ASC)', 'value': 'firstName-ASC', 'for': 'contacts' },
		{ 'name': 'First name (DESC)', 'value': 'firstName-DESC', 'for': 'contacts' },
		{ 'name': 'Last name (ASC)', 'value': 'lastName-ASC', 'for': 'contacts' },
		{ 'name': 'Last name (DESC)', 'value': 'lastName-DESC', 'for': 'contacts' },

	];

    /*    .......company name sorting......
        { 'name': 'Company name (ASC)', 'value': 'contactCompany-ASC', 'for': 'contacts' },
        { 'name': 'Company name (DESC)', 'value': 'contactCompany-DESC', 'for': 'contacts' },*/

	sortOptionsForPagination = [
		{ 'name': '10', 'value': '10' },
		{ 'name': '25', 'value': '25' },
		{ 'name': '50', 'value': '50' },
		{ 'name': 'ALL', 'value': 'ALL' },
	];
	sortOptionForPagination = this.sortOptionsForPagination[0];
	public sortOption: any = this.sortOptions[0];

	filterOptions = [
		{ 'name': 'Field Name*', 'value': '' },
		{ 'name': 'First Name', 'value': 'firstName' },
		{ 'name': 'Last Name', 'value': 'lastName' },
		{ 'name': 'Company', 'value': 'company' },
		{ 'name': 'Job Title', 'value': 'jobTitle' },
		{ 'name': 'Email Id', 'value': 'emailId' },
		{ 'name': 'Country', 'value': 'country' },
		{ 'name': 'City', 'value': 'city' },
		{ 'name': 'Mobile Number', 'value': 'mobile Number' },
		{ 'name': 'state', 'value': 'State' },
		/* { 'name': 'Notes', 'value': 'notes' },*/
	];
	filterOption = this.filterOptions[0];

	filterConditions = [
		{ 'name': 'Condition*', 'value': '' },
		{ 'name': '=', 'value': 'eq' },
		{ 'name': 'Contains', 'value': 'like' },
	];
	filterCondition = this.filterConditions[0];

	isPartner: boolean;
	module: string;
	checkingContactTypeName: string;
	isListView = false;
	responseMessage = [];
	logListName = "";
	saveAsListName: any;
	saveAsContactListId: any;
	saveAsIsPublic: boolean;
	saveAsError: any;
	saveAsTypeList = 'manage-contacts';

	gdprStatus = true;
	legalBasisOptions: Array<LegalBasisOption>;
	parentInput: any;
	companyId: number = 0;
	gdprSetting: GdprSetting = new GdprSetting();
	termsAndConditionStatus = true;
	public fields: any;

	public placeHolder: string = 'Select Legal Basis';
	isValidLegalOptions = true;
	selectedLegalBasisOptions = [];

	public checkSyncCode: any;
	public iszohoAccessTokenExpired: boolean = false;
	public zohoExpiredAccessTokenMessage: any;
	public contactListIdZoho: any;
	public socialNetworkZoho: any;
	public statusCodeFromAddContacts: any;
	public isCalledZohoSycronization = false;
	public zohoCurrentUrl: any;
	public zohoCurrentUser: any;
	tempIsZohoSynchronization: any;
	campaignLoader = false;
	sharedPartnerDetails: any;
	selectedListDetails : ContactList;
	sharedLeads : boolean = false;
	vanityLoginDto : VanityLoginDto = new VanityLoginDto();
	public salesForceCurrentUser: any;
	loggedInThroughVanityUrl = false;
	expandedUserList: any;
	showExpandButton = false;
	showShareListPopup : boolean = false;
	isFormList = false;
	
	constructor(public userService: UserService, public contactService: ContactService, public authenticationService: AuthenticationService, private router: Router, public properties: Properties,
		private pagerService: PagerService, public pagination: Pagination, public referenceService: ReferenceService, public xtremandLogger: XtremandLogger,
		public actionsDescription: ActionsDescription, private render: Renderer, public callActionSwitch: CallActionSwitch, private vanityUrlService: VanityURLService) {
		this.loggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();

		  this.loggedInUserId = this.authenticationService.getUserId();
	        if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
	            this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
	            this.vanityLoginDto.userId = this.loggedInUserId; 
	            this.vanityLoginDto.vanityUrlFilter = true;
	         }
	
		this.referenceService.renderer = render;
		let currentUrl = this.router.url;
		this.model.isPublic = true;
		

        if (currentUrl.includes('home/sharedleads')) {
        	this.module = 'sharedleads';
            this.isPartner = false;
            this.assignLeads = false;
            this.sharedLeads = true;
            this.checkingContactTypeName = "Shared Lead"
        } else if (currentUrl.includes('home/assignleads')) {
            this.isPartner = false;
            this.assignLeads = true;
            this.module = 'leads';
            this.checkingContactTypeName = "Lead"
            this.sortOptions.push({ 'name': 'Assigned date (ASC)', 'value': 'assignedTime-ASC', 'for': 'shareLeadsList' });
            this.sortOptions.push({ 'name': 'Assigned date (DESC)', 'value': 'assignedTime-DESC', 'for': 'shareLeadsList' });
        } else if (currentUrl.includes('home/contacts')) {
            this.isPartner = false;
            this.module = 'contacts';
            this.checkingContactTypeName = "Contact"
        } else {
            this.isPartner = true;
            this.module = 'partners';
            this.checkingContactTypeName = "Partner"
            this.sortOptions.push({ 'name': 'Company (ASC)', 'value': 'contactCompany-ASC', 'for': 'contacts' });
            this.sortOptions.push({ 'name': 'Company (DESC)', 'value': 'contactCompany-DESC', 'for': 'contacts' });
            this.sortOptions.push({ 'name': 'Vertical (ASC)', 'value': 'vertical-ASC', 'for': 'contacts' });
            this.sortOptions.push({ 'name': 'Vertical (DESC)', 'value': 'vertical-DESC', 'for': 'contacts' });
            this.sortOptions.push({ 'name': 'Region (ASC)', 'value': 'region-ASC', 'for': 'contacts' });
            this.sortOptions.push({ 'name': 'Region (DESC)', 'value': 'region-DESC', 'for': 'contacts' });
            this.sortOptions.push({ 'name': 'Partner type (ASC)', 'value': 'partnerType-ASC', 'for': 'contacts' });
            this.sortOptions.push({ 'name': 'Partner type (DESC)', 'value': 'partnerType-DESC', 'for': 'contacts' });
            this.sortOptions.push({ 'name': 'Category (ASC)', 'value': 'category-ASC', 'for': 'contacts' });
            this.sortOptions.push({ 'name': 'Category (DESC)', 'value': 'category-DESC', 'for': 'contacts' });
		}

		this.showAll = true;
		this.showEdit = false;
		this.userListIds = new Array<UserListIds>();
		this.googleSynchronizeButton = false;
		this.socialContact = new SocialContact();
		this.socialContact.socialNetwork = "";
		this.xtremandLogger.info("socialContact" + this.socialContact.socialNetwork);
		this.access_token = this.authenticationService.access_token;
		this.xtremandLogger.info("successmessageLoad" + this.contactService.successMessage)
		if (this.contactService.saveAsSuccessMessage === "add" || this.contactService.successMessage === true || this.contactService.saveAsSuccessMessage === "SUCCESS") {
			if (currentUrl.includes('home/partners')) {
		        this.customResponse = new CustomResponse('SUCCESS', this.properties.PARTNERS_CREATE_SUCCESS, true);
		      } else if (currentUrl.includes('home/contacts')){
		        this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_CREATE_SUCCESS, true);
		      }else {
		        this.customResponse = new CustomResponse('SUCCESS', this.properties.LEAD_LIST_CREATE_SUCCESS, true);
		      }
			this.xtremandLogger.info("Success Message in manage contact pape");
			this.contactService.saveAsSuccessMessage = "";
		}

		if (this.contactService.saveAsSuccessMessage === "saveAsPartnerError") {
			this.customResponse = new CustomResponse('ERROR', this.contactService.saveAsErrorMessage, true);

			this.contactService.saveAsSuccessMessage = "";
			this.contactService.saveAsErrorMessage = "";
		}

		if (this.contactService.deleteUserSucessMessage === true) {
			if (this.isPartner) {
				this.customResponse = new CustomResponse('SUCCESS', this.properties.PARTNERS_LIST_DELETE_SUCCESS, true);
			} else {
				this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true);
			}
			this.xtremandLogger.info(" delete Success Message in manage contact pape");
		}
		
		if (this.contactService.addUserSuccessMessage === true) {
		     if (this.isPartner) {
	                this.customResponse = new CustomResponse('SUCCESS', this.properties.PARTNERS_SAVE_SUCCESS, true);
	            } else {
	                this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_SAVE_SUCCESS, true);
	            }
	            this.xtremandLogger.info(" delete Success Message in manage contact pape");
		}
		
		this.noSaveButtonDisable = true;

		this.hasContactRole = this.referenceService.hasRole(this.referenceService.roles.contactsRole);
		console.log("ContactRole" + this.hasContactRole);
		
		this.hasPartnersRole = this.referenceService.hasRole(this.referenceService.roles.partnersRole);

		this.hasAllAccess = this.referenceService.hasAllAccess();
		//this.loggedInUserId = this.authenticationService.getUserId();

		this.parentInput = {};
		const currentUser = localStorage.getItem('currentUser');
		let campaginAccessDto = JSON.parse(currentUser)['campaignAccessDto'];
		if (campaginAccessDto != undefined) {
			this.companyId = campaginAccessDto.companyId;
		}

	}

	contactListNameLength(title: string) {
		if (title != null) {
			if (title.length > 25) { title = title.substring(0, 25) + '....'; }
			return title;
		}
	}

	contactListUploadedNameLength(title: string) {
		if (title != null) {
			if (title.length > 15) { title = title.substring(0, 15) + '....'; }
			return title;
		}
	}

    loadContactLists(pagination: Pagination) {
   
        if (this.assignLeads) {
        	this.loadAssignedLeadsLists(pagination);
        } else {
            try {
				this.campaignLoader = true;
                this.referenceService.loading(this.httpRequestLoader, true);
                this.pagination.filterKey = 'isPartnerUserList';
                this.pagination.filterValue = this.isPartner;
                if(this.sharedLeads){
                    pagination.sharedLeads = this.sharedLeads;
                    pagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
                    pagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
                } 
                this.contactService.loadContactLists(pagination)
                    .subscribe(
                    (data: any) => {
                        this.xtremandLogger.info(data);
                        data.listOfUserLists.forEach((element, index) => { element.createdDate = new Date(element.createdDate); });
                        this.contactLists = data.listOfUserLists;
                        this.totalRecords = data.totalRecords;
                        if (data.totalRecords.length == 0) {
                            this.resetResponse();
                            this.customResponse = new CustomResponse('INFO', this.properties.NO_RESULTS_FOUND, true);
                        } else {
                            pagination.totalRecords = this.totalRecords;
                            pagination = this.pagerService.getPagedItems(pagination, this.contactLists);

                        }
                        if (this.contactLists.length == 0) {
                            this.resetResponse();
                            // this.responseMessage = ['INFO', 'No results found.','show'];
                            this.customResponse = new CustomResponse('INFO', this.properties.NO_RESULTS_FOUND, true);
                            this.pagedItems = null;
                        }
						this.referenceService.loading(this.httpRequestLoader, false);
						this.campaignLoader = false;
                    },
                    (error: any) => {
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.info("MangeContactsComponent loadContactLists() finished")
                    )
            } catch (error) {
                this.xtremandLogger.error(error, "ManageContactsComponent", "loadAllContactList()");
            }
        }
	}

    loadAssignedLeadsLists(pagination: Pagination) {
        try {
			this.campaignLoader = false;
            this.referenceService.loading(this.httpRequestLoader, true);
            this.pagination.filterKey = 'isPartnerUserList';
            this.pagination.filterValue = this.isPartner;
            this.contactService.loadAssignedLeadsLists(pagination)
                .subscribe(
                (data: any) => {
                    this.xtremandLogger.info(data);
                    data.listOfUserLists.forEach((element, index) => { element.createdDate = new Date(element.createdDate); });
                    this.contactLists = data.listOfUserLists;
                    this.totalRecords = data.totalRecords;
                    if (data.totalRecords.length == 0) {
                        this.resetResponse();
                        this.customResponse = new CustomResponse('INFO', this.properties.NO_RESULTS_FOUND, true);
                    } else {
                        pagination.totalRecords = this.totalRecords;
                        pagination = this.pagerService.getPagedItems(pagination, this.contactLists);

                    }
                    if (this.contactLists.length == 0) {
                        this.resetResponse();
                        this.customResponse = new CustomResponse('INFO', this.properties.NO_RESULTS_FOUND, true);
                        this.pagedItems = null;
                    }
					this.referenceService.loading(this.httpRequestLoader, false);
					this.campaignLoader = false;
                },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    this.xtremandLogger.errorPage(error);
                },
                () => this.xtremandLogger.info("MangeContactsComponent loadAssignedLeadsLists() finished")
                )
        } catch (error) {
            this.xtremandLogger.error(error, "ManageContactsComponent", "loadAssignedLeadsLists()");
        }
    }

	loadContactListsNames() {
		try {
			this.contactService.loadContactListsNames()
				.subscribe(
					(data: any) => {
						this.xtremandLogger.info(data);
						this.contactLists = data.listOfUserLists;
						this.names.length = 0;
						for (let i = 0; i < data.names.length; i++) {
							this.names.push(data.names[i].replace(/\s/g, ''));
						}
						this.referenceService.namesArray = this.names;
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.info("MangeContactsComponent loadContactListsName() finished")
				)
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "loadAllContactListNames()");
		}
	}

	setPage(event: any) {
		if (event.type == 'contacts') {
			this.pagination.pageIndex = event.page;
			this.loadContactLists(this.pagination);
		}else if (event.type == 'sharedDetails') {
            this.sharedDetailsPagination.pageIndex = event.page;
            this.showListSharedDetails();
        }
		else {
			this.contactsByType.pagination.pageIndex = event.page;
			this.listContactsByType(event.type);
		}
	}

	deleteContactList(contactListId: number) {
		try {
			this.resetResponse();
			this.xtremandLogger.info("MangeContacts deleteContactList : " + contactListId);
			this.contactService.deleteContactList(contactListId)
				.subscribe(
					data => {
						if (data.access) {
							this.xtremandLogger.info("MangeContacts deleteContactList success : " + data);
							this.contactsCount();
							$('#contactListDiv_' + contactListId).remove();
							this.loadContactLists(this.pagination);
							//this.responseMessage = ['SUCCESS', 'your contact List has been deleted successfully.','show'];
							// this.customResponse = new CustomResponse( 'SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true );
                            if (this.assignLeads){
                            	 this.customResponse = new CustomResponse('SUCCESS', this.properties.LEAD_LIST_DELETE_SUCCESS, true);
                            } else if (this.isPartner) {
                                this.customResponse = new CustomResponse('SUCCESS', this.properties.PARTNERS_LIST_DELETE_SUCCESS, true);
                            } else {
                                this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true);
							}
							if (this.pagination.pagedItems.length === 1) {
								this.pagination.pageIndex = 1;
								this.loadContactLists(this.pagination);

							}
						} else {
							this.authenticationService.forceToLogout();
						}
					},
					(error: any) => {
						if (error._body.includes('Please launch or delete those campaigns first')) {
							// this.responseMessage = ['ERROR', error,'show'];
							this.customResponse = new CustomResponse('ERROR', error._body, true);
						} else {
							this.xtremandLogger.errorPage(error);
						}
						console.log(error);
					},
					() => this.xtremandLogger.info("deleted completed")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "DeleteContactList()");
		}
	}

	showAlert(contactListId: number) {
		try {
			this.xtremandLogger.info("contactListId in sweetAlert() " + contactListId);
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "You won't be able to undo this action!",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#54a7e9',
				cancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete it!'

			}).then(function(myData: any) {
				console.log("ManageContacts showAlert then()" + myData);
				self.deleteContactList(contactListId);
			}, function(dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "deleteContactListAlert()");
		}
	}

    hasDownLoadAccess(contactListId: number, contactListName: any) {
        if (this.assignLeads) {
            this.downloadContactList(contactListId, contactListName);
        } else {
            try {
                this.contactService.hasAccess(this.isPartner)
                    .subscribe(
                    data => {
                        const body = data['_body'];
                        const response = JSON.parse(body);
                        let access = response.access;
                        if (access) {
                            this.downloadContactList(contactListId, contactListName);
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

	downloadContactList(contactListId: number, contactListName: any) {
		try {
			this.contactService.downloadContactList(contactListId)
				.subscribe(
					data => this.downloadFile(data, contactListName),
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.info("download completed")
				);

		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "downloadList()");
		}
	}

	downloadFile(data: any, contactListName: any) {
		let parsedResponse = data.text();
		let blob = new Blob([parsedResponse], { type: 'text/csv' });
		let url = window.URL.createObjectURL(blob);

		if (navigator.msSaveOrOpenBlob) {
			navigator.msSaveBlob(blob, 'UserList.csv');
		} else {
			let a = document.createElement('a');
			a.href = url;
			a.download = contactListName + " " + this.checkingContactTypeName + ' List.csv';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
		window.URL.revokeObjectURL(url);
	}

	synchronizeContactList(contactList: ContactList) {
		this.socialContact.contactType = contactList.contactType;
		this.socialContact.contactListId = contactList.id;
		this.socialContact.socialNetwork = contactList.socialNetwork;
		this.socialContact.alias = contactList.alias;
		
		if (contactList.socialNetwork == 'GOOGLE') {
			this.contactListIdForSyncLocal = contactList.id;
            this.socialNetworkForSyncLocal = contactList.socialNetwork;
			this.googleContactsSynchronizationAuthentication(this.socialContact);
		}
		else if (contactList.socialNetwork == 'SALESFORCE') {
			this.contactListIdForSyncLocal = contactList.id;
            this.socialNetworkForSyncLocal = contactList.socialNetwork;
			this.salesforceContactsSynchronizationAuthentication(this.socialContact);
		}
		
		else if (contactList.socialNetwork == 'HUBSPOT') {
			this.contactListIdForSyncLocal = contactList.id;
            this.socialNetworkForSyncLocal = contactList.socialNetwork;
			this.syncronizeContactList(this.socialContact);
		}
		else if (contactList.socialNetwork == 'ZOHO') {
			this.zohoContactsSynchronizationAuthentication(this.socialContact);
		}
	}


		googleContactsSynchronizationAuthentication(socialContact : SocialContact) {
		try {
			swal({ title: 'Synchronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
			let providerName = 'google';
			this.contactService.googleLogin(this.module)
				.subscribe(
					data => {
						console.log(data);
						if (data.statusCode==200) {
							console.log("ManageContactComponent googleContacts() Authentication Success");
							this.syncronizeContactList(socialContact);
						} else {
							let currentUser = localStorage.getItem('currentUser');
							let vanityUserId = JSON.parse(currentUser)['userId'];
							if (this.loggedInThroughVanityUrl)
							{
								let url = this.authenticationService.APP_URL + "syn/" + providerName + "/" + vanityUserId + "/" + data.data.userAlias + "/" + this.module;
								var x = screen.width / 2 - 700 / 2;
								var y = screen.height / 2 - 450 / 2;
								window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
							} else 
							{
								this.setLValuesToLocalStorageAndReditectToLoginPage(socialContact, data);
							}
						}
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						if (error._body.includes("JSONObject") && error._body.includes("access_token") && error._body.includes("not found.")) {
							this.xtremandLogger.errorMessage = 'authentication was not successful, you might have changed the password of social account or other reasons, please unlink your account and reconnect it.';
						}
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.log("manageContacts googleContactsSynchronizationAuthentication() finished.")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "googleContactListSynchronization()");
		}
	}



	syncronizeContactList(socialContact : SocialContact) {
		try {
			swal({ title: 'Synchronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
			this.resetResponse();
			this.xtremandLogger.info("contactsSyncronize() socialNetWork" + this.socialContact.socialNetwork);
			this.contactService.contactListSynchronization(socialContact.contactListId, socialContact)
				.subscribe(
					(data: any) => {
						swal.close();
						if (data.statusCode == 402) {
							this.customResponse = new CustomResponse('INFO', data.message, true);
						} else {
							let successMessage = this.assignLeads?this.properties.LEAD_LIST_SYNCHRONIZATION_SUCCESS:this.properties.CONTACT_LIST_SYNCHRONIZATION_SUCCESS;
							this.customResponse = new CustomResponse('SUCCESS', successMessage, true);
							this.loadContactLists(this.pagination);
							this.contactsCount();
						}
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.info("googleContactsSyncronize() completed")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "sychronizationList()");
		}
	}
	
	zohoContactsSynchronizationAuthentication(socialContact : SocialContact) {
		try {
			this.resetResponse();
			swal({ title: 'Synchronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
			let providerName = 'zoho';
			this.contactService.checkingZohoAuthentication(this.module)
				.subscribe(
					(data: any) => {
						  if (data.statusCode==200) {
	                            this.syncronizeContactList(socialContact);
	                        }else {
	                            let currentUser = localStorage.getItem('currentUser');
	                            let vanityUserId = JSON.parse(currentUser)['userId'];
	                            if (this.loggedInThroughVanityUrl)
	                            {
	                                let url = this.authenticationService.APP_URL + "syn/" + providerName + "/" + vanityUserId + "/" + data.data.userAlias + "/" + this.module;
	                                var x = screen.width / 2 - 700 / 2;
	                                var y = screen.height / 2 - 450 / 2;
	                                window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
	                            } else 
	                            {
	                            	this.setLValuesToLocalStorageAndReditectToLoginPage(socialContact, data);
	                            }
	                        }
					},
					(error: any) => {
						this.xtremandLogger.error("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:" + error)
					},
					() => this.xtremandLogger.info("ManageContactsComponent zohoContactsSynchronizationAuthentication() finished")
				)
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "zohoContactsSynchronizationAuthentication()");
		}
	}

	salesforceContactsSynchronizationAuthentication(socialContact : SocialContact) {
		try {
			swal({ title: 'Synchronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
			this.xtremandLogger.info("socialContacts" + this.socialContact.socialNetwork);
			let providerName = 'salesforce';
			this.contactService.salesforceLogin(this.module)
				.subscribe(
					data => {
						if (data.statusCode==200) {
							this.syncronizeContactList(socialContact);
						} else {
							let currentUser = localStorage.getItem('currentUser');
							let vanityUserId = JSON.parse(currentUser)['userId'];
							if (this.loggedInThroughVanityUrl)
							{
								let url = this.authenticationService.APP_URL + "syn/" + providerName + "/" + vanityUserId + "/" + data.data.userAlias + "/" + this.module;
								var x = screen.width / 2 - 700 / 2;
								var y = screen.height / 2 - 450 / 2;
								window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
							} else {
								this.setLValuesToLocalStorageAndReditectToLoginPage(socialContact, data);
							}
						}
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.log("addContactComponent salesforceContacts() login finished.")

				);

		}
		catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "SynchronizationSalesforceList()");
		}
	}
	
	
	hubSpotContactsSynchronizationAuthentication(socialContact : SocialContact) {
		try {
			swal({ title: 'Synchronization processing...!', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
			this.xtremandLogger.info("socialContacts" + this.socialContact.socialNetwork);
			let providerName = 'hubSpot';
			this.contactService.hubSpotLogin(this.module)
				.subscribe(
					data => {
						this.storeLogin = data;
						if (this.storeLogin.message != undefined && this.storeLogin.message == "AUTHENTICATION SUCCESSFUL FOR SOCIAL CRM") {
							this.syncronizeContactList(socialContact);
						} else {
							let currentUser = localStorage.getItem('currentUser');
							let vanityUserId = JSON.parse(currentUser)['userId'];
							if (this.loggedInThroughVanityUrl) {
								let url = this.authenticationService.APP_URL + "syn/" + providerName + "/" + vanityUserId + "/" + data.userAlias + "/" + this.module;
								var x = screen.width / 2 - 700 / 2;
								var y = screen.height / 2 - 450 / 2;
								window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes, addressbar=no,top=" + y + ",left=" + x + ",width=700,height=485");
							} else {
								window.location.href = "" + data.redirectUrl;
							}
						}
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => this.xtremandLogger.log("addContactComponent salesforceContacts() login finished.")

				);

		}
		catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "SynchronizationSalesforceList()");
		}
	}

	editContactList(contactSelectedListId: number, contactListName: string, uploadUserId: number, 
		isDefaultPartnerList: boolean, isSynchronizationList: boolean, isFormList: boolean) {
		this.uploadedUserId = uploadUserId;
		this.selectedContactListId = contactSelectedListId;
		this.selectedContactListName = contactListName;
		this.isDefaultPartnerList = isDefaultPartnerList;
		this.isSynchronizationList = isSynchronizationList
		this.showAll = false;
		this.showEdit = true;
		this.isFormList = isFormList;
		$("#pagination").hide();
	}

	setListType(publicList: boolean, contactType:string, assignedToPartner: boolean ) {
		this.contactService.publicList = publicList;
		this.contactService.contactType = contactType;
		this.contactService.assignedToPartner = assignedToPartner
	}



	backToManageContactPage() { }

	backToEditContactPage() {
		this.showAll = false;
		this.showEdit = true;
	}

	update(user: User) {
		    this.contactCountLoad = true;
	        this.navigateToManageContacts();
	        this.contactsCount();
	        this.showAll = true;
	        this.showEdit = false;
	        $("#pagination").show();
            if (this.contactService.deleteUserSucessMessage === true) {
                if (this.assignLeads) {
	                   this.customResponse = new CustomResponse('SUCCESS', this.properties.LEAD_LIST_DELETE_SUCCESS, true);
	               } else if (this.isPartner) {
                    this.customResponse = new CustomResponse('SUCCESS', this.properties.PARTNERS_LIST_DELETE_SUCCESS, true);
                } else {
					if (this.contactService.isEmptyFormList === true) {
						this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_UPDATE_SUCCESS, true);
					} else {
						this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true);
					}                    
                }
                this.xtremandLogger.info(" delete Success Message in manage contact pape");
            }
		  
	}

	onChangeAllContactUsers(event: Pagination) {
		this.contactsByType.pagination = event;
		this.listContactsByType(this.contactsByType.selectedCategory);
	}


	validateContactName(contactName: string) {
		if (contactName.replace(/\s\s+/g, '').length == 0) {
			this.noSaveButtonDisable = true;
		} else {
			this.noSaveButtonDisable = false;
		}

		let lowerCaseContactName = contactName.toLowerCase().replace(/\s/g, '');
		var list = this.names;
		console.log(list);
		if ($.inArray(lowerCaseContactName, list) > -1) {
			this.isValidContactName = true;
			$(".ng-valid[required], .ng-valid.required").css("color", "red");
		} else {
			$(".ng-valid[required], .ng-valid.required").css("color", "Black");
			this.isValidContactName = false;
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

	checkAllInvalidContacts(ev: any) {
		try {
			if (ev.target.checked) {
				console.log("checked");
				$('[name="invalidContact[]"]').prop('checked', true);
				let self = this;
				$('[name="invalidContact[]"]:checked').each(function() {
					var id = $(this).val();
					self.selectedInvalidContactIds.push(parseInt(id));
					console.log(self.selectedInvalidContactIds);
					$('#campaignContactListTable_' + id).addClass('invalid-contacts-selected');
				});
				for (var i = 0; i < this.contactsByType.pagination.pagedItems.length; i++) {
					var object = {
						"id": this.contactsByType.pagination.pagedItems[i].id,
						"userName": null,
						"emailId": this.contactsByType.pagination.pagedItems[i].emailId,
						"firstName": this.contactsByType.pagination.pagedItems[i].firstName,
						"lastName": this.contactsByType.pagination.pagedItems[i].lastName,
						"mobileNumber": null,
						"interests": null,
						"occupation": null,
						"description": null,
						"websiteUrl": null,
						"profileImagePath": null,
						"userListIds": this.contactsByType.pagination.pagedItems[i].userListIds
					}
					this.invalidRemovableContacts.push(object);
					console.log(object);
				}
				this.invalidRemovableContacts = this.removeDuplicates(this.invalidRemovableContacts, 'id');
				this.selectedInvalidContactIds = this.referenceService.removeDuplicates(this.selectedInvalidContactIds);
			} else {
				$('[name="invalidContact[]"]').prop('checked', false);
				$('#user_list_tb tr').removeClass("invalid-contacts-selected");
				if (this.contactsByType.pagination.maxResults == this.contactsByType.pagination.totalRecords) {
					this.selectedInvalidContactIds = [];
					this.invalidRemovableContacts = [];
				} else {
					let paginationIdsArray = new Array;
					for (let j = 0; j < this.contactsByType.pagination.pagedItems.length; j++) {
						var paginationIds = this.contactsByType.pagination.pagedItems[j].id;
						this.invalidRemovableContacts.splice(this.invalidRemovableContacts.indexOf(paginationIds), 1);
					}
					console.log('removed objects form else part');
					console.log(this.invalidRemovableContacts);
					let currentPageContactIds = this.contactsByType.pagination.pagedItems.map(function(a) { return a.id; });
					this.selectedInvalidContactIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedInvalidContactIds, currentPageContactIds);
				}
				console.log(this.invalidRemovableContacts);
			}
			ev.stopPropagation();
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "checkingAllInvalidContacts()");
		}
	}

	invalidContactsSelectedUserIds(contactId: number, event: any) {
		try {
			let isChecked = $('#' + contactId).is(':checked');
			console.log(this.invalidRemovableContacts)
			if (isChecked) {
				$('#row_' + contactId).addClass('invalid-contacts-selected');
				this.selectedInvalidContactIds.push(contactId);
				for (var i = 0; i < this.userListIds.length; i++) {
					if (contactId == this.userListIds[i].id) {
						var object = {
							"id": this.userListIds[i].id,
							"userName": null,
							"emailId": this.userListIds[i].emailId,
							"firstName": this.userListIds[i].firstName,
							"lastName": this.userListIds[i].lastName,
							"mobileNumber": null,
							"interests": null,
							"occupation": null,
							"description": null,
							"websiteUrl": null,
							"profileImagePath": null,
							"userListIds": this.userListIds[i].userListIds
						}
						console.log(object);
						this.invalidRemovableContacts.push(object);

					}
				}
			} else {
				$('#row_' + contactId).removeClass('invalid-contacts-selected');
				this.selectedInvalidContactIds.splice($.inArray(contactId, this.selectedInvalidContactIds), 1);
				this.invalidRemovableContacts.splice($.inArray(contactId, this.invalidRemovableContacts), 1);
			}
			if (this.selectedInvalidContactIds.length == this.contactsByType.pagination.pagedItems.length) {
				this.isInvalidHeaderCheckBoxChecked = true;
			} else {
				this.isInvalidHeaderCheckBoxChecked = false;
			}
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "checkingSelectedInavlidContacts()");
		}
	}

	checkAll(ev: any) {
		try {
			if (ev.target.checked) {
				console.log("checked");
				$('[name="campaignContact[]"]').prop('checked', true);
				let self = this;
				$('[name="campaignContact[]"]:checked').each(function() {
					var id = $(this).val();
					self.selectedContactListIds.push(parseInt(id));
					console.log(self.selectedContactListIds);
					$('#ContactListTable_' + id).addClass('contact-list-selected');
					for (var i = 0; i < self.contactsByType.pagination.pagedItems.length; i++) {
						var object = {
							"emailId": self.contactsByType.pagination.pagedItems[i].emailId,
							"firstName": self.contactsByType.pagination.pagedItems[i].firstName,
							"lastName": self.contactsByType.pagination.pagedItems[i].lastName,
							"jobTitle": self.contactsByType.pagination.pagedItems[i].jobTitle,
							"company": self.contactsByType.pagination.pagedItems[i].contactCompany,
							"mobileNumber": self.contactsByType.pagination.pagedItems[i].mobileNumber,
							"address": self.contactsByType.pagination.pagedItems[i].address,
							"city": self.contactsByType.pagination.pagedItems[i].city,
							"state": self.contactsByType.pagination.pagedItems[i].state,
							"country": self.contactsByType.pagination.pagedItems[i].country,
							"zipCode": self.contactsByType.pagination.pagedItems[i].zipCode,
						}

						if (this.isPartner) {
							object["vertical"] = self.contactsByType.pagination.pagedItems[i].vertical;
							object["region"] = self.contactsByType.pagination.pagedItems[i].region;
							object["partnerType"] = self.contactsByType.pagination.pagedItems[i].partnerType;
							object["category"] = self.contactsByType.pagination.pagedItems[i].category;
						}

						console.log(object);
						self.allselectedUsers.push(object);
					}
				});
				this.allselectedUsers = this.removeDuplicates(this.allselectedUsers, 'emailId');
				this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
			} else {
				$('[name="campaignContact[]"]').prop('checked', false);
				$('#user_list_tb tr').removeClass("contact-list-selected");
				if (this.contactsByType.pagination.maxResults == this.contactsByType.pagination.totalRecords) {
					this.selectedContactListIds = [];
					this.allselectedUsers.length = 0;
				} else {
					let paginationIdsArray = new Array;
					for (let j = 0; j < this.contactsByType.pagination.pagedItems.length; j++) {
						var paginationEmail = this.contactsByType.pagination.pagedItems[j].emailId;
						this.allselectedUsers.splice(this.allselectedUsers.indexOf(paginationEmail), 1);
					}
					let currentPageContactIds = this.contactsByType.pagination.pagedItems.map(function(a) { return a.id; });
					this.selectedContactListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
				}
			}
			ev.stopPropagation();
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "checkAllContactsInAllContactsPage()");
		}
	}

	highlightRow(contactId: number, selectedRow: any, event: any) {
		try {
			// this.invalidContactsSelectedUserIds( contactId, event );
			let isChecked = $('#' + contactId).is(':checked');
			console.log(this.selectedContactListIds)
			if (isChecked) {
				$('#row_' + contactId).addClass('contact-list-selected');
				this.selectedContactListIds.push(contactId);
				var object = {
					"emailId": selectedRow.emailId,
					"firstName": selectedRow.firstName,
					"lastName": selectedRow.lastName,
					"jobTitle": selectedRow.jobTitle,
					"contactCompany": selectedRow.contactCompany,
					"mobileNumber": selectedRow.mobileNumber,
					"address": selectedRow.address,
					"city": selectedRow.city,
					"state": selectedRow.state,
					"country": selectedRow.country,
					"zipCode": selectedRow.zipCode,
				}

				if (this.isPartner) {
					object["vertical"] = selectedRow.vertical;
					object["region"] = selectedRow.region;
					object["partnerType"] = selectedRow.partnerType;
					object["category"] = selectedRow.category;
				}

				this.allselectedUsers.push(object);
				console.log(this.allselectedUsers);
			} else {
				$('#row_' + contactId).removeClass('contact-list-selected');
				this.selectedContactListIds.splice($.inArray(contactId, this.selectedContactListIds), 1);
				this.allselectedUsers.splice($.inArray(contactId, this.allselectedUsers), 1);
			}
			if (this.selectedContactListIds.length == this.contactsByType.pagination.pagedItems.length) {
				this.isHeaderCheckBoxChecked = true;
			} else {
				this.isHeaderCheckBoxChecked = false;
			}
			event.stopPropagation();
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "checkingSelectedUsers()");
		}
	}

    saveSelectedUsers(listName: string, selectedLegalBasisOptions: any, isPublic: boolean) {
        if (this.assignLeads) {
            this.saveSelectedLeads(listName, selectedLegalBasisOptions );
        } else {
            try {
                this.resetResponse();
                var selectedUserIds = new Array();
                let selectedUsers = new Array<User>();
                this.xtremandLogger.info("SelectedUserIDs:" + this.selectedContactListIds);
                this.contactListObject = new ContactList;
                this.contactListObject.isPartnerUserList = this.isPartner;
                if (listName != "") {
                    if (this.selectedContactListIds.length != 0) {
                        $.each(this.allselectedUsers, function(index, value: User) {
                            value.legalBasis = selectedLegalBasisOptions;
                        });
                this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, listName, this.isPartner, isPublic,
                                "CONTACT", "MANUAL", this.alias, false);
                        this.contactService.saveContactList(this.userUserListWrapper)
                            .subscribe(
                            data => {
                                data = data;
                                this.loading = false;
                                if (data.access) {
                                    if (data.statusCode == 401) {
                                        this.saveAsError = data.message;
                                    } else if (data.statusCode == 200) {
                                        data = data;
                                        this.contactCountLoad = true;
                                        this.navigateToManageContacts();
                                        this.allselectedUsers.length = 0;
                                        if (this.isPartner) {
                                            this.customResponse = new CustomResponse('SUCCESS', this.properties.PARTNER_LIST_CREATE_SUCCESS, true);
                                        } else {
                                            this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_CREATE_SUCCESS, true);
                                        }
                                    }
                                } else {
                                    this.authenticationService.forceToLogout();
                                }
                            },

                            (error: any) => {
                                let body: string = error['_body'];
                                body = body.substring(1, body.length - 1);
                                if (JSON.parse(error._body).message.includes("email addresses in your contact list that aren't formatted properly")) {
                                    this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                                } else {
                                    this.xtremandLogger.errorPage(error);
                                }
                                this.xtremandLogger.error(error);
                                console.log(error);
                            },
                            () => this.xtremandLogger.info("allcontactComponent saveSelectedUsers() finished")
                            )
                    } else {
                        this.customResponse = new CustomResponse('ERROR', this.properties.NO_USERS_SELECT_ERROR, true);
                    }
                }
                else {
                    this.xtremandLogger.error("AllContactComponent saveSelectedUsers() UserNotSelectedContacts");
                }
            } catch (error) {
                this.xtremandLogger.error(error, "ManageContactsComponent", "savingSelectedUsersAsNewList()");
            }
        }
	}

    saveSelectedLeads(listName: string, selectedLegalBasisOptions: any) {
        try {
            this.resetResponse();
            var selectedUserIds = new Array();
            let selectedUsers = new Array<User>();
            this.xtremandLogger.info("SelectedUserIDs:" + this.selectedContactListIds);
            this.contactListObject = new ContactList;
            this.contactListObject.isPartnerUserList = this.isPartner;
            if (listName != "") {
                if (this.selectedContactListIds.length != 0) {
                    $.each(this.allselectedUsers, function(index, value: User) {
                        value.legalBasis = selectedLegalBasisOptions;
                    });
                    this.contactListObject.name = listName;
                    this.contactListObject.contactType = "CONTACT";
                    this.contactListObject.socialNetwork = "MANUAL";
                    this.contactListObject.publicList = true;
                    this.userUserListWrapper.users = this.allselectedUsers;
                    this.userUserListWrapper.userList = this.contactListObject;
                    this.saveAssignedLeadsList(this.userUserListWrapper);
                } else {
                    this.customResponse = new CustomResponse('ERROR', this.properties.NO_USERS_SELECT_ERROR, true);
                }
            }
            else {
                this.xtremandLogger.error("AllContactComponent saveSelectedLeads() UserNotSelectedContacts");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "ManageContactsComponent", "saveSelectedLeads()");
        }
    }

    saveAssignedLeadsList(userUserListWrapper: UserUserListWrapper) {
        this.loading = true;
        this.contactService.saveAssignedLeadsList(this.userUserListWrapper)
            .subscribe(
            data => {
                if (data.access) {
                    data = data;
                    this.loading = false;
                    if (data.statusCode === 401) {
                    	this.saveAsError = data.message;
                        //this.customResponse = new CustomResponse('ERROR', data.message, true);
                    } else if (data.statusCode === 402) {
                        this.customResponse = new CustomResponse('ERROR', data.message + '<br>' + data.data, true);
                    } else {
                    	this.cleareDefaultConditions();
                        this.contactCountLoad = true;
                        this.navigateToManageContacts();
                        this.allselectedUsers.length = 0;
                        this.customResponse = new CustomResponse('SUCCESS', this.properties.LEAD_LIST_CREATE_SUCCESS, true);
                    }
                } else {
                    this.authenticationService.forceToLogout();
                    localStorage.removeItem('isZohoSynchronization');
                }
            },
            (error: any) => {
                this.loading = false;
                this.xtremandLogger.error(error);
            },
            () => this.xtremandLogger.info("ManageContactsComponent saveAssignedLeadsList() finished")
            )
    }

	cancelAllContactsCancel() {
		this.model.contactListName = "";
		this.selectedContactListIds = [];
		this.allselectedUsers.length = 0;
		this.isHeaderCheckBoxChecked = false;
	}

	removeInvalidContactListUsers() {
		try {
			this.resetResponse();
			var removeUserIds = new Array();
			let invalidUsers = new Array();
			$('input[name="selectedUserIds"]:checked').each(function() {
				this.invalidIds = $(this).val();
				removeUserIds.push(this.invalidIds);
				this.invalidIds = this.removeUserIds;
			});
			this.xtremandLogger.info(this.invalidRemovableContacts);

			this.contactService.removeInvalidContactListUsers(this.selectedInvalidContactIds, this.assignLeads)
				.subscribe(
					data => {
						data = data;
						this.xtremandLogger.log(data);
						console.log("update Contacts ListUsers:" + data);
						$.each(removeUserIds, function(index: number, value: any) {
							$('#row_' + value).remove();
							console.log(index + "value" + value);
						});
						//this.invalidDeleteSucessMessage = true;
						this.contactsCount();
						this.contactCountLoad = true;
						this.listContactsByType(this.contactsByType.selectedCategory);
						if(this.assignLeads){
							this.customResponse = new CustomResponse('SUCCESS', this.properties.LEADS_DELETE_SUCCESS, true);
						}else if (this.isPartner) {
							this.customResponse = new CustomResponse('SUCCESS', this.properties.PARTNERS_DELETE_SUCCESS, true);
						} else {
							this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACTS_DELETE_SUCCESS, true);
						}
					},
					(error: any) => {
						if (error._body.includes('Please launch or delete those campaigns first')) {
							//this.responseMessage = ['ERROR', error,'show'];
							this.customResponse = new CustomResponse('ERROR', error._body, true);
							this.invalidDeleteErrorMessage = true;
						} else {
							this.xtremandLogger.errorPage(error);
						}
						console.log(error);
					},
					() => this.xtremandLogger.info("MangeContactsComponent loadContactLists() finished")
				)
			this.invalidDeleteSucessMessage = false;
			this.invalidDeleteErrorMessage = false;
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "removingInvalidUsers()");
		}
	}

	invalidContactsShowAlert() {
		try {
			var removeUserIds = new Array();
			$('input[name="selectedUserIds"]:checked').each(function() {
				var id = $(this).val();
				removeUserIds.push(id);
			});
			if (this.invalidRemovableContacts.length != 0) {
				this.xtremandLogger.info("contactListId in sweetAlert() ");
				let self = this;
				swal({
					title: 'Are you sure?',
					text: "You won't be able to undo this action!",
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#54a7e9',
					cancelButtonColor: '#999',
					confirmButtonText: 'Yes, delete it!'

				}).then(function(myData: any) {
					console.log("ManageContacts showAlert then()" + myData);
					self.removeInvalidContactListUsers();
				}, function(dismiss: any) {
					console.log('you clicked on option' + dismiss);
				});
			}
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "removingInvalidUsersAlert()");
		}
	}


	validateUndeliverableContacts(contactId: any) {
		try {
			this.resetResponse();
			this.loading = true;
      this.xtremandLogger.info(contactId);
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
							this.contactsCount();
							this.contactCountLoad = true;
							this.listContactsByType(this.contactsByType.selectedCategory);
                            if (this.assignLeads) {
                                this.customResponse = new CustomResponse('SUCCESS', this.properties.LEADS_EMAIL_VALIDATE_SUCCESS, true);
                            } else if (this.isPartner) {
                                this.customResponse = new CustomResponse('SUCCESS', this.properties.PARTNERS_EMAIL_VALIDATE_SUCCESS, true);
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
			this.invalidDeleteSucessMessage = false;
			this.invalidDeleteErrorMessage = false;
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "removingInvalidUsers()");
		}
	}

	contactsCount() {
		try {

            this.contactListObject = new ContactList;
            this.contactListObject.isPartnerUserList = this.isPartner;
            if (this.assignLeads) {
                this.contactListObject.assignedLeadsList = true
			}else if(this.sharedLeads){
                this.contactListObject.sharedLeads = true; 
            }
            
            this.contactListObject.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
            this.contactListObject.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;

			this.contactService.loadContactsCount(this.contactListObject)
				.subscribe(
					data => {
						this.contactsByType.allContactsCount = data.allcontacts;
						this.contactsByType.invalidContactsCount = data.invalidUsers;
						this.contactsByType.unsubscribedContactsCount = data.unsubscribedUsers;
						this.contactsByType.activeContactsCount = data.activecontacts;
						this.contactsByType.inactiveContactsCount = data.nonactiveUsers;
						this.contactsByType.validContactsCount = data.validContactsCount;
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

	listContactsByType(contactType : string) {
	
		this.campaignLoader = true;
		try {
			this.contactsByType.isLoading = true;
			this.resetResponse();
			this.resetListContacts();
			if (this.listContactData == true) {
				this.searchKey = null;
				this.listContactData = false;
			}
			this.referenceService.loading(this.httpRequestLoader, true);
			this.httpRequestLoader.isHorizontalCss = true;
			this.contactsByType.pagination.filterKey = 'isPartnerUserList';
			this.contactsByType.pagination.filterValue = this.isPartner;
			this.contactsByType.pagination.criterias = this.criterias;
			
			this.userListPaginationWrapper.pagination = this.contactsByType.pagination;
			this.contactListObject = new ContactList;
			this.contactListObject.contactType = contactType;
			this.contactListObject.assignedLeadsList = this.assignLeads;
			this.contactListObject.sharedLeads = this.sharedLeads;
			this.contactListObject.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter; 
			this.contactListObject.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
			
			this.userListPaginationWrapper.userList = this.contactListObject;
			
			this.contactService.listContactsByType(this.userListPaginationWrapper)
				.subscribe(
					data => {
						this.contactsByType.selectedCategory = contactType;
						this.contactsByType.contacts = data.listOfUsers;
						//this.setLegalBasisOptionString(this.contactsByType.contacts);
						this.contactsByType.pagination.totalRecords = data.totalRecords;
						this.contactsByType.pagination = this.pagerService.getPagedItems(this.contactsByType.pagination, this.contactsByType.contacts);
					//	this.listAllContactsByType(contactType, this.contactsByType.pagination.totalRecords);
						if (this.contactsByType.selectedCategory == 'invalid' || this.contactsByType.selectedCategory == 'all') {
							this.userListIds = data.listOfUsers;
						}

						var contactIds = this.contactsByType.pagination.pagedItems.map(function(a) { return a.id; });
						var items = $.grep(this.selectedContactListIds, function(element) {
							return $.inArray(element, contactIds) !== -1;
						});
						this.xtremandLogger.log("Contact Ids" + contactIds);
						this.xtremandLogger.log("Selected Contact Ids" + this.selectedContactListIds);
						if (items.length == this.contactsByType.pagination.totalRecords || items.length == this.contactsByType.pagination.pagedItems.length) {
							this.isHeaderCheckBoxChecked = true;
						} else {
							this.isHeaderCheckBoxChecked = false;
						}

						var contactIds1 = this.pagination.pagedItems.map(function(a) { return a.id; });
						var items1 = $.grep(this.selectedInvalidContactIds, function(element) {
							return $.inArray(element, contactIds1) !== -1;
						});
						this.xtremandLogger.log("inavlid contacts page pagination Object Ids" + contactIds1);
						this.xtremandLogger.log("selected inavalid contacts Ids" + this.selectedInvalidContactIds);

						if (items1.length == this.contactsByType.pagination.totalRecords || items1.length == this.contactsByType.pagination.pagedItems.length) {
							this.isInvalidHeaderCheckBoxChecked = true;
						} else {
							this.isInvalidHeaderCheckBoxChecked = false;
						}
						this.referenceService.loading(this.httpRequestLoader, false);
						this.campaignLoader = false;
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => {
						this.contactsByType.isLoading = false;
					}
				);
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "AllContactsReportData()");
		}
	}

	resetListContacts() {
		this.sortOption = this.sortOptions[0];
		this.showListOfContactList = false;
		this.contactsByType.contacts = [];
	}

	sortByOption(event: any, selectedType: string) {
		try {
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

			if (selectedType == 'contactList') {
				this.pagination.pageIndex = 1;
				this.pagination.sortcolumn = this.sortcolumn;
				this.pagination.sortingOrder = this.sortingOrder;
				this.loadContactLists(this.pagination);
			} else {
				this.contactsByType.pagination.pageIndex = 1;
				this.contactsByType.pagination.sortcolumn = this.sortcolumn;
				this.contactsByType.pagination.sortingOrder = this.sortingOrder;
				this.listContactsByType(this.contactsByType.selectedCategory);
			}
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "sorting()");
		}
	}

	searchKeyValue(searchType: string) {
		this.searchContactType = searchType;
		if (searchType == 'contactList') {
			this.pagination.searchKey = this.searchKey;
		} else {
			this.contactsByType.pagination.searchKey = this.searchKey;
		}
	}

	search(searchType: string) {
		this.searchContactType = searchType;
		try {
			this.resetResponse();
			if (searchType == 'contactList') {		
				if (this.searchKey != "") {
					this.showExpandButton = true;
					this.isListView = true;
				} else {
					this.showExpandButton = false;
				}		
				this.pagination.searchKey = this.searchKey;				
				this.pagination.pageIndex = 1;
				this.loadContactLists(this.pagination);
			} else {
				this.contactsByType.pagination.searchKey = this.searchKey;
				this.contactsByType.pagination.pageIndex = 1;
				this.listContactsByType(this.contactsByType.selectedCategory);
			}
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "sorting()");
		}
	}

	resetPagination() {
		this.pagination.searchKey = this.searchKey;
		this.pagination.pageIndex = 1;
	}

	navigateToManageContacts() {
		this.model.contactListName = "";
		this.searchKey = null;
		this.customResponse.responseType = null;
		this.resetPagination();
		this.listContactData = true;

		this.isSegmentation = false;
		this.criterias.length = 0;

		this.pagination = new Pagination();
		this.loadContactLists(this.pagination);
		this.contactsByType.pagination = new Pagination();

		this.sortOptionForPagination = this.sortOptionsForPagination[0];
		this.showListOfContactList = true;
		this.contactsByType.selectedCategory = null;
		this.selectedContactListIds = [];
		this.allselectedUsers.length = 0;
		this.selectedInvalidContactIds = [];
		this.invalidRemovableContacts = [];
		this.invalidDeleteSucessMessage = false;
		if (this.contactCountLoad == true) {
			this.contactsCount();
		}
		this.contactCountLoad = false;
		this.showExpandButton = false;
	}

	resetResponse() {
		this.customResponse.responseType = null;
		this.customResponse.responseMessage = null;
		this.customResponse.isVisible = false;
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
						this.filterConditionErrorMessage = "Please fill the required data at position " + i;
					} else if (this.criterias[i].property == "Field Name*" && this.criterias[i].operation == "Condition*") {
						this.filterConditionErrorMessage = "Please select the Field Name and Condition at position " + i;
					} else if (this.criterias[i].property == "Field Name*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "")) {
						this.filterConditionErrorMessage = "Please select the Field Name and Value at position " + i;
					} else if (this.criterias[i].operation == "Condition*" && (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "")) {
						this.filterConditionErrorMessage = "Please select the Condition and Value at position " + i;
					} else if (this.criterias[i].operation == "Condition*") {
						this.filterConditionErrorMessage = "Please select the Condition at position " + i;
					} else if (this.criterias[i].property == "Field Name*") {
						this.filterConditionErrorMessage = "Please select the Field Name at position " + i;
					} else if (this.criterias[i].value1 == undefined || this.criterias[i].value1 == "") {
						this.filterConditionErrorMessage = "Please fill the value at position " + i;
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
					} else if (this.criterias[i].property == "City") {
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
			if (!this.isSegmentationErrorMessage) {
				this.contactsByType.pagination.pageIndex = 1;
				this.listContactsByType(this.contactsByType.selectedCategory);
				console.log(this.criterias);
				this.isSegmentation = true;
				$('#filterModal').modal('toggle');
				$("#filterModal .close").click();
				$('#filterModal').modal('hide');
			}
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "contactListFilter()");
		}
	}

	modelForSeg() {
		this.criteria.property = this.filterOptions[0].value;
		this.criteria.operation = this.filterConditions[0].value;
		this.addNewRow();
	}

	removeSegmentation() {
		this.isSegmentation = false;
		this.criterias.length = 0;
		this.listContactsByType(this.contactsByType.selectedCategory);
	}

	cancelSegmentation() {
		this.criterias.length = 0;
		this.isSegmentationErrorMessage = false;
		this.filterConditionErrorMessage = "";
	}

	addNewRow() {
		let criteria = new Criteria();
		this.criterias.push(criteria);
	}

	cancelRow(rowId: number) {
		if (rowId !== -1) {
			this.criterias.splice(rowId, 1);
		}
	}

    hasAccessForDownloadUndeliverableContacts() {
        if (this.assignLeads){
        	this.listAllContactsByType(this.contactsByType.selectedCategory, this.contactsByType.pagination.totalRecords);
        } else {
            try {
                this.contactService.hasAccess(this.isPartner)
                    .subscribe(
                    data => {
                        const body = data['_body'];
                        const response = JSON.parse(body);
                        let access = response.access;
                        if (access) {
                            this.listAllContactsByType(this.contactsByType.selectedCategory, this.contactsByType.pagination.totalRecords);
                            //	this.downloadContactTypeList();
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
		try {
			if (this.contactsByType.selectedCategory === 'all') {
				this.logListName = 'All_' + this.checkingContactTypeName + 's_list.csv';
			}
			else if (this.contactsByType.selectedCategory === 'active') {
				this.logListName = 'All_Active_' + this.checkingContactTypeName + 's_list.csv';
			} else if (this.contactsByType.selectedCategory === 'non-active') {
				this.logListName = 'All_Inactive_' + this.checkingContactTypeName + 's_list.csv';
			} else if (this.contactsByType.selectedCategory === 'invalid') {
				this.logListName = 'All_Invalid_' + this.checkingContactTypeName + 's_list.csv';
			} else if (this.contactsByType.selectedCategory === 'unsubscribe') {
				this.logListName = 'All_Unsubscribed_' + this.checkingContactTypeName + 's_list.csv';
			}else if (this.contactsByType.selectedCategory === 'valid') {
                this.logListName = 'All_Valid_' + this.checkingContactTypeName + 's_list.csv';
            }
			this.downloadDataList.length = 0;
			for (let i = 0; i < this.contactsByType.listOfAllContacts.length; i++) {
				if(!this.authenticationService.module.isPrm && !this.authenticationService.module.isPrmTeamMember && !this.authenticationService.module.isPrmAndPartner && !this.authenticationService.module.isPrmAndPartnerTeamMember){
					var object = {
						"First Name": this.contactsByType.listOfAllContacts[i].firstName,
						"Last Name": this.contactsByType.listOfAllContacts[i].lastName,
						"Company": this.contactsByType.listOfAllContacts[i].contactCompany,
						"Job Title": this.contactsByType.listOfAllContacts[i].jobTitle,
						"Email Id": this.contactsByType.listOfAllContacts[i].emailId,
						"Address": this.contactsByType.listOfAllContacts[i].address,
						"City": this.contactsByType.listOfAllContacts[i].city,
						"State": this.contactsByType.listOfAllContacts[i].state,
						"Country": this.contactsByType.listOfAllContacts[i].country,
						"Zip Code": this.contactsByType.listOfAllContacts[i].zipCode,
						  "Mobile Number": this.contactsByType.listOfAllContacts[i].mobileNumber,
						  "Total Campaigns": this.contactsByType.listOfAllContacts[i].totalCampaignsCount,
						  "Active Campaigns": this.contactsByType.listOfAllContacts[i].activeCampaignsCount,
						  "Email Opend": this.contactsByType.listOfAllContacts[i].emailOpenedCount,
						  "Clicked Urls": this.contactsByType.listOfAllContacts[i].clickedUrlsCount,
					}
					this.downloadDataList.push(object);
				}else{
					let object = {
						"First Name": this.contactsByType.listOfAllContacts[i].firstName,
						"Last Name": this.contactsByType.listOfAllContacts[i].lastName,
						"Company": this.contactsByType.listOfAllContacts[i].contactCompany,
						"Job Title": this.contactsByType.listOfAllContacts[i].jobTitle,
						"Email Id": this.contactsByType.listOfAllContacts[i].emailId,
						"Address": this.contactsByType.listOfAllContacts[i].address,
						"City": this.contactsByType.listOfAllContacts[i].city,
						"State": this.contactsByType.listOfAllContacts[i].state,
						"Country": this.contactsByType.listOfAllContacts[i].country,
						"Zip Code": this.contactsByType.listOfAllContacts[i].zipCode,
						"Mobile Number": this.contactsByType.listOfAllContacts[i].mobileNumber
					}
					this.downloadDataList.push(object);
				}
			}
			this.referenceService.isDownloadCsvFile = true;
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "downloadReportList()");
		}
	}

	listAllContactsByType(contactType: string, totalRecords: number) {
		this.campaignLoader = true;
		try {
			this.contactsByType.contactPagination.filterKey = 'isPartnerUserList';
			this.contactsByType.contactPagination.filterValue = this.isPartner;
			this.contactsByType.contactPagination.criterias = this.criterias;
			this.contactsByType.contactPagination.maxResults = totalRecords;
			
			
			this.userListPaginationWrapper.pagination = this.contactsByType.contactPagination;
            this.userListPaginationWrapper.userList.contactType = contactType;
            this.userListPaginationWrapper.userList.assignedLeadsList = this.assignLeads;
            this.userListPaginationWrapper.userList.sharedLeads = this.sharedLeads;
			
			this.contactService.listContactsByType(this.userListPaginationWrapper)
				.subscribe(
					data => {
            this.contactsByType.listOfAllContacts = data.listOfUsers;
            this.downloadContactTypeList();
					},
					(error: any) => {
						this.xtremandLogger.error(error);
						this.xtremandLogger.errorPage(error);
					},
					() => {
						this.contactsByType.isLoading = false;
						this.campaignLoader = false;
					}
				);
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "loadingAllReportData()");
		}
	}

	saveAs() {
		try {
			this.saveAsTypeList = 'manage-all-contacts';
			this.saveAsListName = '';
			this.selectedLegalBasisOptions = [];
			this.saveAsError = '';
			$('#saveAsModal').modal('show');
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "saveAsAlert()");
		}
	}

    saveAsNewList( contactList: ContactList){
        try {
            this.saveAsTypeList = 'manage-contacts';
            this.saveAsListName = contactList.name + '_copy';
            this.saveAsError = '';
            this.contactListObject = new ContactList;
            this.contactListObject.id = contactList.id;
            this.contactListObject.isPartnerUserList = contactList.isPartnerUserList;
            this.contactListObject.publicList = contactList.publicList;
            this.contactListObject.contactType = contactList.contactType;
            this.contactListObject.socialNetwork = contactList.socialNetwork;
            this.contactListObject.alias = contactList.alias;
            this.contactListObject.synchronisedList = contactList.synchronisedList;
            this.contactListObject.moduleName = this.getModuleName();
            if (this.module === 'contacts' || this.module === 'partners'){
            	this.loadContactListsNames();
            }
            $('#saveAsModal').modal('show');
        } catch (error) {
            this.xtremandLogger.error(error, "ManageContactsComponent", "saveAsNewList()");
        }
    }

	validateLegalBasisOptions() {
		if (this.gdprStatus && this.selectedLegalBasisOptions.length == 0 && this.saveAsTypeList === 'manage-all-contacts') {
			this.isValidLegalOptions = false;
		} else {
			this.isValidLegalOptions = true;
		}
	}

    hasSaveAsAccess() {
       if (this.assignLeads) {
            this.saveAsLeadsInputChecking();
        } else {
            try {
                this.contactService.hasAccess(this.isPartner)
                    .subscribe(
                    data => {
                        const body = data['_body'];
                        const response = JSON.parse(body);
                        let access = response.access;
                        if (access) {
                            this.saveAsInputChecking();
                        } else {
                            this.authenticationService.forceToLogout();
                        }
                    }
                   );
            } catch (error) {
                this.xtremandLogger.error(error, "ManageContactsComponent", "saveAsNewList()");
            }
        }
    }


    saveAsInputChecking() {
            try {
                const name = this.saveAsListName;
                const self = this;
                this.isValidLegalOptions = true;
                const inputName = name.toLowerCase().replace(/\s/g, '');
                if ($.inArray(inputName, self.names) > -1) {
                    this.saveAsError = 'This list name is already taken.';
                } else {
                    if (name !== "" && name.length < 250) {
                        this.saveAsError = '';
                        this.validateLegalBasisOptions();
                        if (this.saveAsTypeList === 'manage-contacts') {
                        	this.contactListObject.name = this.saveAsListName;
                            this.saveExistingContactList();
                            this.cleareDefaultConditions();
                        }
                        else if (this.saveAsTypeList === 'manage-all-contacts') {
                            if (this.isValidLegalOptions) {
                                this.saveSelectedUsers(name, this.selectedLegalBasisOptions, this.model.isPublic);
                                this.cleareDefaultConditions();
                            }
                        }
                    }
                    else if (name == "") { this.saveAsError = 'List Name is Required.'; }
                    else { this.saveAsError = 'You have exceeded 250 characters!'; }
                }
            } catch (error) {
                this.xtremandLogger.error(error, "ManageContactsComponent", "saveAs()");
            }
	}
	cleareDefaultConditions() {
		$('#saveAsModal').modal('hide');
		this.saveAsListName = undefined;
		this.saveAsTypeList = 'manage-contacts';
		this.model.isPublic = true;
		this.contactListObject = new ContactList;
	}

    saveAsLeadsInputChecking() {
        try {
            const name = this.saveAsListName;
            const self = this;
            this.isValidLegalOptions = true;
            const inputName = name.toLowerCase().replace(/\s/g, '');
            if ($.inArray(inputName, self.names) > -1) {
                this.saveAsError = 'This list name is already taken.';
            } else if (name !== "" && name.length < 250) {
                this.saveAsError = '';
                this.validateLegalBasisOptions();
                if (this.saveAsTypeList === 'manage-contacts') {
                	this.contactListObject.name = this.saveAsListName;
                    this.saveAsNewLeadsList();
                }
                else if (this.saveAsTypeList === 'manage-all-contacts') {
                    if (this.isValidLegalOptions) {
                        this.saveSelectedUsers(name, this.selectedLegalBasisOptions, this.model.isPublic);
                    }
                }
            }
            else if (name == "") { this.saveAsError = 'List Name is Required.'; }
            else { this.saveAsError = 'You have exceeded 250 characters!'; }
        } catch (error) {
            this.xtremandLogger.error(error, "ManageContactsComponent", "saveAs()");
        }
	}

    saveAsNewLeadsList() {
    	this.loading = true;

    	/*let contactListObject = new ContactList;
    	contactListObject.name = contactListName;
    	contactListObject.id = contactSelectedListId;
    	contactListObject.isPartnerUserList = false;
    	contactListObject.publicList = true;*/

        this.contactService.saveAsNewList(this.contactListObject)
            .subscribe(
            data => {
                data = data;
                this.loading = false;
                if (data.access) {
                    if (data.statusCode == 401) {
                    	this.saveAsError = data.message;
                    } else if (data.statusCode == 200) {
                    	$('#saveAsModal').modal('hide');
                    	this.cleareDefaultConditions();
                        this.customResponse = new CustomResponse('SUCCESS', data.message, true);
                        this.loadContactLists(this.pagination);
                    }
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            (error: any) => {
            	this.loading = false;

                this.xtremandLogger.error(error);
            },
            () => this.xtremandLogger.info("saveAsNewLeadsList() finished")
            )
    }

	saveExistingContactList() {
		try {
			$('#saveAsModal').modal('hide');
            this.saveAsListName = undefined;
            this.saveAsTypeList = 'manage-contacts';
            this.saveListAsNewList();
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "saveAsExistingList()");
		}
	}

	saveListAsNewList() {
		try {
			this.contactService.saveAsNewList(this.contactListObject)
				.subscribe(
					data => {
                        if (data.statusCode == 401) {
                            this.saveAsError = data.message;
                        } else if (data.statusCode == 200) {
                            data = data;
		                          if (this.isPartner) {
		                              this.customResponse = new CustomResponse('SUCCESS', this.properties.PARTNER_LIST_SAVE_SUCCESS, true);
		                          } else {
		                              this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_SAVE_SUCCESS, true);
		                          }
		                          this.loadContactLists(this.pagination);
		                    }
					},
					(error: any) => {
						if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
							this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
						} else {
							this.xtremandLogger.errorPage(error);
						}
						this.xtremandLogger.error(error);
					},
					() => this.xtremandLogger.info("allcontactComponent saveSelectedUsers() finished")
				)
		} catch (error) {
			this.xtremandLogger.error(error, "ManageContactsComponent", "saveAsNewList()");
		}
	}

	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(this.searchContactType); } }

	sendMail(partnerId: number) {
		this.emailNotificationCustomResponse = new CustomResponse();
		try {
			this.pagination.partnerId = partnerId;
            this.pagination.userListId = this.defaultPartnerListId;
            this.pagination.userId = this.authenticationService.getUserId();          
            this.pagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
            this.pagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
			this.contactService.mailSend(this.pagination)
				.subscribe(
					data => {
						this.emailNotificationCustomResponse = new CustomResponse('SUCCESS', this.properties.EMAIL_SENT_SUCCESS, true);
						this.contactService.successMessage = true;
						this.listContactsByType(this.contactsByType.selectedCategory);
					},
					(error: any) => {
						this.customResponse = new CustomResponse('ERROR', 'Some thing went wrong please try after some time.', true);
						this.xtremandLogger.error(error);
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
							this.listContactsByType(this.contactsByType.selectedCategory);
						}
					},
					(error: any) => {
						this.xtremandLogger.error(error);
					},
					() => this.xtremandLogger.log("Manage Partner component resubscribe method successfull")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "manageContactComponent", " resubscribe method");
		}

	}

	forceProcessList(contactListId: number) {
		try {
			this.contactService.forceProcessList(contactListId)
				.subscribe(
					data => {
						console.log(data);
						if (data.message == "success") {
							this.customResponse = new CustomResponse('SUCCESS', "We are processing your contact list, once done will send you an email.", true);
							this.loadContactLists(this.pagination);
						}
					},
					(error: any) => {
						this.xtremandLogger.error(error);
					},
					() => this.xtremandLogger.log("Manage component forcce Process method successfull")
				);
		} catch (error) {
			this.xtremandLogger.error(error, "manageContactComponent", "force Process Method");
		}

	}


	defaultPartnerList(userId: number) {
		try {
			this.contactService.defaultPartnerList(userId)
				.subscribe(
					(data: any) => {
						console.log(data);
						this.defaultPartnerListId = data.id;
						this.contactService.partnerListName = data.name;
					},
					error => this.xtremandLogger.error(error),
					() => {
						console.log('loadContacts() finished');
					}
				);
		} catch (error) {
			this.xtremandLogger.error(error, "addPartnerComponent", "default PartnerList");
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

	setLegalBasisOptionString(list: any) {
		if (this.gdprStatus) {
			let self = this;
			$.each(list, function(index, contact) {
				if (self.legalBasisOptions.length > 0) {
					let filteredLegalBasisOptions = $.grep(self.legalBasisOptions, function(e) { return contact.legalBasis.indexOf(e.id) > -1 });
					let selectedLegalBasisOptionsArray = filteredLegalBasisOptions.map(function(a) { return a.name; });
					contact.legalBasisString = selectedLegalBasisOptionsArray;
				}
			});
		}
	}


	ngAfterViewInit() {
	}

	ngAfterViewChecked() {

		let tempIsZohoSynchronization = localStorage.getItem('isZohoSynchronization');
		let tempCheckGoogleAuth = localStorage.getItem('isGoogleAuth');
		let tempCheckSalesForceAuth = localStorage.getItem('isSalesForceAuth');
		let tempCheckHubSpotAuth = localStorage.getItem('isHubSpotAuth');
		let tempValidationMessage : string = '';
        tempValidationMessage = localStorage.getItem('validationMessage');

		localStorage.removeItem('isGoogleAuth');
		localStorage.removeItem('isSalesForceAuth');
		localStorage.removeItem('isHubSpotAuth');
		localStorage.removeItem('isZohoAuth');
		localStorage.removeItem('validationMessage');

		this.socialContact.contactListId = this.contactListIdForSyncLocal;
        this.socialContact.socialNetwork = this.socialNetworkForSyncLocal;
		if (tempCheckGoogleAuth == 'yes' && !this.isPartner) {
			
			this.googleContactsSynchronizationAuthentication(this.socialContact);
			tempCheckGoogleAuth = 'no';
		}

		else if (tempCheckSalesForceAuth == 'yes' && !this.isPartner) {
			this.syncronizeContactList( this.socialContact);
			tempCheckSalesForceAuth = 'no';

		}
		else if (tempCheckHubSpotAuth == 'yes' && !this.isPartner) {
			this.router.navigate(['/home/contacts/add']);
			tempCheckHubSpotAuth = 'no';
		}
		
		else if (tempIsZohoSynchronization == 'yes' && !this.isPartner) {
			this.contactListIdZoho = localStorage.getItem("contactListIdZoho");
			this.socialNetworkZoho = localStorage.getItem("socialNetworkZoho");
			if (!this.isCalledZohoSycronization && this.contactListIdZoho != null) {
				this.isCalledZohoSycronization = true;
				this.iszohoAccessTokenExpired = false;
				this.zohoContactsSynchronizationAuthentication(this.socialContact);
				tempIsZohoSynchronization = 'no';
			}
		}
		  else if (tempValidationMessage!=null && tempValidationMessage.length>0 && !this.isPartner) {
			  swal.close();
			  this.customResponse = new CustomResponse('ERROR', tempValidationMessage, true);
	        }
	}

	ngOnInit() {
		this.callInitMethods();
	}
	
	callInitMethods(){
	      try {

	    	    /*if (this.loggedInThroughVanityUrl){
	                if (this.socialNetworkForSyncLocal == 'google'
	                    || this.socialNetworkForSyncLocal == 'salesforce'
	                    || this.socialNetworkForSyncLocal == 'zoho') {
	                    let message: string = '';
	                    message = localStorage.getItem('oauthCallbackValidationMessage');
	                    localStorage.removeItem('oauthCallbackValidationMessage');
	                    if (message != null && message.length > 0) {
	                        this.customResponse = new CustomResponse('ERROR', message, true);
	                    } else if (this.contactService.oauthCallbackMessage != null && this.contactService.oauthCallbackMessage.length > 0) {
	                        message = this.contactService.oauthCallbackMessage;
	                        this.contactService.oauthCallbackMessage = '';
	                        this.customResponse = new CustomResponse('ERROR', message, true);
	                    }else{
	                          //this.socialContact.socialNetwork = localStorage.getItem('socialNetwork');
	                          //this.socialContact.contactListId = JSON.parse(localStorage.getItem('selectedContactListId'));
	                          //this.socialContact.contactType = localStorage.getItem('contactType');
	                          //this.socialContact.alias = localStorage.getItem('alias');
	                          this.syncronizeContactList( this.socialContact);
	                          localStorage.removeItem("currentPage");
	                          localStorage.removeItem("currentModule");
	                          localStorage.removeItem("selectedContactListId");
	                          localStorage.removeItem("socialNetwork");
	                          localStorage.removeItem("contactType");
	                          localStorage.removeItem("alias");
	                    }
	                }
	            }else */
	            	
	            	if (this.contactService.socialProviderName == 'google'
            	  || this.contactService.socialProviderName == 'salesforce'
                  || this.contactService.socialProviderName == 'zoho') {
            	  this.contactService.socialProviderName = "nothing";
                  if (this.contactService.oauthCallbackMessage.length > 0) {
                	  let oauthCallbackValidatonMessage = this.contactService.oauthCallbackMessage;
                	  this.contactService.oauthCallbackMessage = "";
                	  this.customResponse = new CustomResponse('ERROR', oauthCallbackValidatonMessage, true);
                  } else {
                	  this.socialContact.socialNetwork = localStorage.getItem('socialNetwork');
                	  this.socialContact.contactListId = JSON.parse(localStorage.getItem('selectedContactListId'));
                	  this.socialContact.contactType = localStorage.getItem('contactType');
                	  this.socialContact.alias = localStorage.getItem('alias');
                      this.syncronizeContactList( this.socialContact);
                      localStorage.removeItem("currentPage");
                      localStorage.removeItem("currentModule");
                      localStorage.removeItem("selectedContactListId");
                      localStorage.removeItem("socialNetwork");
                      localStorage.removeItem("contactType");
                      localStorage.removeItem("alias");
                  }
	    		}
	            this.pagination.maxResults = 12;
	            this.sharedDetailsPagination.pageIndex = 1;
	            this.sharedDetailsPagination.maxResults = 12;
	            this.isListView = "LIST" == localStorage.getItem('defaultDisplayType');
	            if (this.isPartner) {
	                this.defaultPartnerList(this.authenticationService.getUserId());
	            }

	            this.loadContactLists(this.pagination);
	            this.contactsCount();
	            this.loadContactListsNames();

	            /********Check Gdpr Settings******************/
	            this.checkTermsAndConditionStatus();
	            this.getLegalBasisOptions();

	            window.addEventListener('message', function(e) {
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
	                else if (e.data == 'isZohoAuth') {
	                    localStorage.setItem('isZohoAuth', 'yes');
	                }else if(e.data !=null && e.data.includes("You have already configured")){
	                    localStorage.setItem('validationMessage', e.data);
	                }

	            }, false);


	        }
	        catch (error) {
	            this.xtremandLogger.error("ERROR : MangeContactsComponent ngOnInit() " + error);
	        }
	}

	ngOnDestroy() {
		try {
			this.sharedPartnerDetails = [];
			this.xtremandLogger.info('Deinit - Destroyed Component')
			this.contactService.successMessage = false;
			this.contactService.deleteUserSucessMessage = false;
			this.contactService.addUserSuccessMessage = false;

			swal.close();
			$('#filterModal').modal('hide');
		} catch (error) {
			this.xtremandLogger.error("ERROR : MangeContactsComponent onOnDestroy() " + error);
		}
	}

	changeStatus(event) {
		this.model.isPublic = event;

	}

	zohoAuthenticationThroughExpiredAccessTokenMessage(providerName: string) {
		this.zohoCurrentUser = localStorage.getItem('currentUser');
		let vanityUserId = JSON.parse(this.zohoCurrentUser)['userId'];
		let userAlias = localStorage.getItem('userAlias');
		let module = 'contacts';

		let url = this.authenticationService.APP_URL + "v/" + providerName + "/" + vanityUserId + "/" + userAlias + "/" + module +"/"+ null ;

		var x = screen.width / 2 - 700 / 2;
		var y = screen.height / 2 - 450 / 2;
		window.open(url, "Social Login", "toolbar=yes,scrollbars=yes,resizable=yes,top=" + y + ",left=" + x + ",width=700,height=485");

	}

	showCampaigns(userId: number) {
		this.campaignLoader = true;
		let self = this;
		setTimeout(function() {
			let prefixUrl = "/home/campaigns/user-campaigns/";
			if (self.isPartner) {
				self.referenceService.goToRouter(prefixUrl + "/pm/" + userId);
			} else {
				self.referenceService.goToRouter(prefixUrl + "/c/" + userId);
			}
		}, 250);

	}

    selectedSharePartner(event: any){
        this.sharedPartnerDetails = event;
        this.model.assignedTo=this.sharedPartnerDetails.emailId;
        this.assignLeadsListToPartner(this.model.assignedTo);
    }

    storeListDetails(selectedList: any){
    	this.selectedListDetails = selectedList;
    }

    assignLeadsListToPartner(assignedTo: any){
            this.loading = true;
            this.selectedListDetails.assignedTo = assignedTo;
            this.contactService.assignLeadsListToPartner(this.selectedListDetails)
                .subscribe(
                    data => {
                        this.loading = false;
                        this.customResponse = new CustomResponse('SUCCESS', data.message, true);
                        this.loadContactLists(this.pagination);
                    },
                    (error: any) => {
                        this.loading = false;
                    },
                    () => this.xtremandLogger.info('Finished AssignLeadsMethos()')
                );
        this.loading = false;
    }
	
	
	confirmDeleteContact(contact:any){
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
				self.deleteContact(contact);
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
	}

	deleteContact(contact:any){
		this.referenceService.goToTop();
		this.loading = true;
		this.customResponse = new CustomResponse();
		this.contactService.deleteContactById(contact.id).subscribe(
			response=>{
				this.loading = false;
				if(response.statusCode==200){
					let message = contact.emailId+" deleted successfully";
					this.listContactsByType(this.contactsByType.selectedCategory);
					this.contactsCount();
					this.customResponse = new CustomResponse('SUCCESS', message, true);
				}else{
					this.customResponse = new CustomResponse('ERROR', 'This contact cannot be deleted as it is shared by one of your vendors', true);
				}
				
			},
			error=>{
				this.loading = false;
				this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
			}
		);
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
	
    openPopUpForNewlyAddedPartnersOrContacts(contactList: ContactList) {
        this.sendCampaignComponent.openPopUpForNewlyAddedPartnersOrContacts(contactList.id, this.checkingContactTypeName);
    }

    notificationFromPublishToPartnersComponent() {

    }

    openShareListPopup(contactList: ContactList) {
        this.showShareListPopup = true;
        this.selectedContactListId = contactList.id;
    }

	closeShareListPopup() {
      this.showShareListPopup = false;
      this.callInitMethods();
	}

    showListSharedDetails() {
        this.referenceService.loading(this.httpRequestLoader, true);
        this.loading = true;
        this.contactService.showListSharedDetails(this.selectedContactListId, this.sharedDetailsPagination).subscribe(
            response => {
                let data = response.data;
                if (response.statusCode == 200) {
                    $.each(data.list, function(_index: number, list: any) {
                        list.createdDate = new Date(list.createdTime);
                        list.sharedDate = new Date(list.sharedTime);
                    });
                    this.sharedDetailsPagination.totalRecords = data.totalRecords;
                    $('#listSharedDetailsModal').modal();
                    this.sharedDetailsPagination = this.pagerService.getPagedItems(this.sharedDetailsPagination, data.list);
                    this.loading = false;
                    this.referenceService.loading(this.httpRequestLoader, false);
                }
            },
            error => {
                this.loading = false;
                this.referenceService.loading(this.httpRequestLoader, false);
                this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
            }
        );
    }
    
    closeSharedDetailsPopup(){
    	$("#listSharedDetailsModal").modal().hide();
    }
    
    setLValuesToLocalStorageAndReditectToLoginPage(socialContact : SocialContact, data : any) {
    	   if (this.assignLeads) {
            localStorage.setItem('currentPage', 'manage-leads');
        } else {
            localStorage.setItem('currentPage', 'manage-contacts');
        }
        localStorage.setItem('socialNetwork', socialContact.socialNetwork);
        localStorage.setItem('selectedContactListId', JSON.stringify(socialContact.contactListId));
        localStorage.setItem("userAlias", data.data.userAlias);
        localStorage.setItem("currentModule", data.data.module);
        localStorage.setItem('contactType', socialContact.contactType);
        localStorage.setItem('alias', socialContact.alias);
        window.location.href = "" + data.data.redirectUrl;
    }
    
    getModuleName() {
        let moduleName: string = '';
        if (this.module === 'leads') {
            moduleName = "SHARE LEADS";
        } else if (this.module === 'contacts') {
            moduleName = "CONTACTS";
        } else if (this.module === 'partners') {
            moduleName = "PARTNERS";
        }
        return moduleName;
    }
    
    getUserUserListWrapperObj(newUsers: Array<User>, contactListName: string, isPartner: boolean, isPublic: boolean,
            contactType: string, socialnetwork: string, alias: string, synchronisedList: boolean) {
            this.contactListObject = new ContactList();
            this.contactListObject.name = contactListName;
            this.contactListObject.isPartnerUserList = isPartner;
            this.contactListObject.publicList = isPublic;
            this.contactListObject.contactType = contactType;
            this.contactListObject.socialNetwork = socialnetwork;
            this.contactListObject.alias = alias;
            this.contactListObject.synchronisedList = synchronisedList;
            this.contactListObject.moduleName = this.getModuleName();
            this.userUserListWrapper.users = newUsers;
            this.userUserListWrapper.userList = this.contactListObject;
            return this.userUserListWrapper;
        }
	
	
}
