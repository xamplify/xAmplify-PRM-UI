import { Component, Input, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { ContactService } from '../services/contact.service';
import { User } from 'app/core/models/user';
import { EditUser } from '../models/edit-user';
import { Pagination } from 'app/core/models/pagination';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { LeadsService } from 'app/leads/services/leads.service';
import { PagerService } from 'app/core/services/pager.service';
import { DealsService } from 'app/deals/services/deals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/services/user.service';
import { LegalBasisOption } from 'app/dashboard/models/legal-basis-option';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { IntegrationService } from 'app/core/services/integration.service';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import parsePhoneNumberFromString, { isValidPhoneNumber } from 'libphonenumber-js';
import { ChatGptIntegrationSettingsDto } from 'app/dashboard/models/chat-gpt-integration-settings-dto';
import { DamService } from 'app/dam/services/dam.service';
declare var $: any, swal: any;

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css'],
  providers: [LeadsService, DealsService, Properties, UserService,
    DamService]
})
export class ContactDetailsComponent implements OnInit {
  @Input() public selectedContact:any;
  @Input() public manageCompanies:boolean = false;
  @Input() public selectedCompanyId:number;
  @Input() isTeamMemberPartnerList: boolean;
  @Input() contacts: User[];

  contactTitle: string = 'Contact Journey';
  companyTitle: string = 'Company Journey';
  highlightLetter:string = '';
  selectedCompanyContactId: any;
  isCompanyContact: boolean;
  contactAllDetails: any;
  isUpdateUser: boolean = false;
  updateContactUser: boolean = false;
  isLoading:boolean = false;
  editUser: EditUser = new EditUser();
  customResponse: CustomResponse = new CustomResponse();
  contactId:any;
  loggedInUserId:any;
  leadsPagination: Pagination = new Pagination();
  selectedTabIndex: number;
  selectedFilterIndex: number = 1;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  showFormsTab: boolean;
  listView:boolean = true;
  showLeadForm: boolean;
  actionType: string = 'add';
  leadId: number;
  isConvertingContactToLead: boolean = true;

  showNotesTab: boolean = false;
  companyId: any;
  gdprInput:any;
  gdprSetting: any;
  gdprStatus:boolean = true;
  termsAndConditionStatus:boolean = true;
  fields: { text: string; value: string; };
  legalBasisOptions: Array<LegalBasisOption>;
  isLoadingList: boolean = false;
  pagination: Pagination = new Pagination();
  contactName: string = '';
  isEmailCopied:boolean = false;
  isMobileNumberCopied:boolean = false;
  isFromCompanyModule:boolean = false;
  companyRouter = RouterUrlConstants.home+RouterUrlConstants.company+RouterUrlConstants.manage;
  showEmailModalPopup: boolean = false;
  showEmailTab: boolean = false;
  showMeetingsTab: boolean = false;
  showActivityTab: boolean = false;
  leadsCount:number = 0;
  leadsResponse: CustomResponse = new CustomResponse();
  contactLeads = [];
  viewLeads: boolean = false;
  leadsLoader:HttpRequestLoader = new HttpRequestLoader();
  dealsCount:number = 0;
  contactDeals = [];
  dealsResponse: CustomResponse = new CustomResponse();
  dealsLoader:HttpRequestLoader = new HttpRequestLoader();
  viewDeals: boolean = false;
  dealId: any;
  showDealForm: boolean = false;

  /** note **/
  showAddNoteModalPopup:boolean = false;
  isReloadEmailActivityTab:boolean;
  isReloadNoteTab:boolean;
  campaignsLoader:HttpRequestLoader = new HttpRequestLoader();
  campaignsResponse: CustomResponse = new CustomResponse();
  contactCampaigns = [];
  campaignsCount:number = 0;
  selectedContactListId:number;
  isReloadActivityTab:boolean;
  showTaskModalPopup: boolean = false;
  isReloadTaskActivityTab:boolean;
  showImageTag:boolean = false;
  imageSourcePath:any = '';
  isLocalhost:boolean = false;
  showMeetingModalPopup: boolean = false;
  activeCalendarDetails: any;
  ngxLoading: boolean = false;
  showCalendarIntegrationsModalPopup: boolean = false;
  flexiFields: any;
  isReloadMeetingTab:boolean;
  isFromEditContacts:boolean = false;
  imgPathLoading: boolean =  false;
  isSidebarOpen:boolean = true;
  isProfileSidebarOpen: boolean = true;
  isCompanyJourney: boolean = false;
  showEditCompanyModalPopup:boolean = false;
  companyIdForEdit: any;
  contactsLoader:HttpRequestLoader = new HttpRequestLoader();
  contactsCount:number = 0;
  companyContacts = [];
  contactsResponse: CustomResponse = new CustomResponse();
  isFromCompanyJourney:boolean = false;
  companyJourneyId:any;
  isFromCompanyJourneyEditContacts: boolean = false;
  isRegisterDealEnabled: boolean = true;
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  showCompanyCampaigns: boolean = false;
  formattedContactsCount: string = '0';
  formattedLeadsCount: string = '0';
  formattedDealsCount: string = '0';
  formattedCampaignsCount: string = '0';
  totalDealAmount: any = "$ 0.0";
  dealAmountLoader:HttpRequestLoader = new HttpRequestLoader();
  showAircallDialer:boolean = false;
  showCallsTab: boolean = false;
  activeCallDetails:any;
  isReloadCallTab:boolean;
  userListUsersLoader: HttpRequestLoader = new HttpRequestLoader();
  companyUsersSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  mobileNumber: any;
  enableDialButton: boolean = false;
  showAskOliverModalPopup: boolean;
  chatGptSettingDTO = new ChatGptIntegrationSettingsDto();
  contact: any;
  callActivity: any;
  chatGptIntegrationSettingsDto = new ChatGptIntegrationSettingsDto();
  isFromManageContact: boolean = false;
  showOliverContactAgent: boolean = false;

  constructor(public referenceService: ReferenceService, public contactService: ContactService, public properties: Properties,
    public authenticationService: AuthenticationService, public leadsService: LeadsService, public pagerService: PagerService, 
    public dealsService: DealsService, public route:ActivatedRoute, public userService: UserService, public router: Router, 
     public integrationService: IntegrationService,
    ) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;
    } else {
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = false;
    }
    const currentUser = localStorage.getItem('currentUser');
		let campaginAccessDto = JSON.parse(currentUser)['campaignAccessDto'];
		this.companyId = campaginAccessDto.companyId;
    this.gdprInput = {};
    this.isLocalhost = this.authenticationService.isLocalHost();
   }

  ngOnInit() {
    this.selectedContactListId = this.referenceService.decodePathVariable(this.route.snapshot.params['userListId']);
    this.contactId = this.referenceService.decodePathVariable(this.route.snapshot.params['id']);
    this.companyJourneyId = this.referenceService.decodePathVariable(this.route.snapshot.params['companyId']);
    this.isCompanyJourney = this.router.url.includes(RouterUrlConstants.home+RouterUrlConstants.company+RouterUrlConstants.manage+'/'+RouterUrlConstants.details);
    this.isFromEditContacts = this.route.snapshot.params['action'] == 'edit';
    this.isFromCompanyJourney = this.route.snapshot.params['action'] == 'company';
    this.isFromCompanyJourneyEditContacts = this.route.snapshot.params['action'] == 'ce';
    if (this.router.url.includes(RouterUrlConstants.home + RouterUrlConstants.contacts + RouterUrlConstants.company)) {
      this.isFromCompanyModule = true;
    }
    if (this.isCompanyJourney) {
      this.getCompany();
      this.fetchContactsAndCount();
      this.fetchTotalDealAmount();
      this.fetchUsersForCompanyJourney();
    } else {
      this.getContact();
      this.checkTermsAndConditionStatus();
      this.getLegalBasisOptions();
      this.fetchOliverActiveIntegration();
      this.getOliverAgentAccessSettings();
    }
    this.referenceService.goToTop();
    this.getActiveCalendarDetails();
    this.getActiveCallIntegrationDetails();
    this.fetchLogoFromExternalSource();
    this.fetchLeadsAndCount();
    this.fetchDealsAndCount();
    this.referenceService.aircallPhone.on('call_ended', callInfos => {
      this.reloadCallTab();
    });
  }
// plus& minus icon
  toggleClass(id: string) {
    $("i#" + id).toggleClass("fa-minus fa-plus");
  }

  setHighlightLetter() {
    const firstName = this.selectedContact.firstName;
    const lastName = this.selectedContact.lastName;
    const emailId = this.selectedContact.emailId;
    if (this.referenceService.checkIsValidString(firstName)) {
      this.highlightLetter = this.referenceService.getFirstLetter(firstName);
    } else if (this.referenceService.checkIsValidString(lastName)) {
      this.highlightLetter = this.referenceService.getFirstLetter(lastName);
    } else if (this.referenceService.checkIsValidString(emailId)) {
      this.highlightLetter = this.referenceService.getFirstLetter(emailId);
    }
  }

  editContactDetails(contactDetails) {
    if (this.isCompanyJourney) {
      this.companyIdForEdit = contactDetails.id;
      this.showEditCompanyModalPopup = true;
    } else {
      this.updateContactUser = true;
      this.isUpdateUser = true;
      this.contactAllDetails = contactDetails;
      this.contactService.isContactModalPopup = true;
      this.isCompanyContact = this.manageCompanies;
      this.selectedCompanyContactId = this.selectedCompanyId;
    }
	}

  updateContactListUser(event) {
    try {
      this.isLoading = true;
      this.editUser.pagination = this.pagination;
      this.editUser.pagination.partnerCompanyId = this.selectedContact.contactCompanyId;
      if (event.mobileNumber) {
        if (event.mobileNumber.length < 6) {
          event.mobileNumber = "";
        }
      }
      if (event.country === "Select Country") {
        event.country = null;
      }
      this.editUser.user = event;
      this.contactService.updateContactListUser(this.selectedContactListId, this.editUser, false).subscribe(
        data => {
          if (data.access) {
            this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACTS_UPDATE_SUCCESS, true);
            this.selectedContact = event;
            this.selectedContact.id = this.contactId;
            this.selectedContact.userListId = this.selectedContactListId;
            this.mobileNumber = event.mobileNumber;
          }
          this.isLoading = false;
        }, error => {
          this.isLoading = false;
          this.referenceService.showSweetAlertServerErrorMessage();
        }, () => {
          this.setContactNameToDisplay();
          this.setHighlightLetter();
          this.referenceService.goToTop();
        }
      )
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  }

  setActiveTab(tabName:string) {
    if (tabName === 'email1') {
      this.showEmailTab = true;
    } else if (tabName === 'note1') {
      this.showNotesTab = true;
    } else if (tabName === 'meeting') {
      this.showMeetingsTab = true;
    } else if (tabName === 'activity1') {
      this.showActivityTab = true;
    } else if (tabName === 'form1') {
      this.showFormsTab = true;
    } else if (tabName === 'call') {
      this.showCallsTab = true;
    }
  }

  closeLeadForm() {
    this.showLeadForm = false;
  }

  viewOrEditCustomLeadForm() {
    this.showLeadForm = true;
  }

  showSubmitSuccess() {
    this.customResponse = new CustomResponse('SUCCESS', this.properties.LEADS_UPDATE_SUCCESS, true);
  }

  getContact() {
    this.isLoading = true
    this.contactService.findContactByUserIdAndUserListId(this.contactId, this.selectedContactListId).subscribe(
      data => {
        this.selectedContact = data.data;
        this.flexiFields = data.data.flexiFields;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      },
      () => {
        this.setHighlightLetter();
        this.showActivityTab = true;
        this.setContactNameToDisplay();
        this.mobileNumber = this.selectedContact.mobileNumber;
      }
    )
  }

  checkTermsAndConditionStatus() {
		if (this.companyId > 0) {
			this.isLoading = true;
			this.userService.getGdprSettingByCompanyId(this.companyId)
				.subscribe(
					response => {
						if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
							this.gdprSetting = response.data;
							this.gdprStatus = this.gdprSetting.gdprStatus;
							this.termsAndConditionStatus = this.gdprSetting.termsAndConditionStatus;
						}
						this.gdprInput['termsAndConditionStatus'] = this.termsAndConditionStatus;
						this.gdprInput['gdprStatus'] = this.gdprStatus;
            this.isLoading = false;
					},
					(error: any) => {
						this.isLoading = false;
					}
				);
		}

	}

  getLegalBasisOptions() {
		if (this.companyId > 0) {
			this.isLoading = true;
			this.fields = { text: 'name', value: 'id' };
			this.referenceService.getLegalBasisOptions(this.companyId)
				.subscribe(
					data => {
						this.legalBasisOptions = data.data;
						this.gdprInput['legalBasisOptions'] = this.legalBasisOptions;
						this.isLoading = false;
					},
					(error: any) => {
						this.isLoading = false;
					}
				);
		}

	}

  backToEditContacts() {
    let encodedURL = this.referenceService.encodePathVariable(this.selectedContactListId);
    if (this.isFromCompanyModule) {
      this.referenceService.goToRouter(RouterUrlConstants.home+RouterUrlConstants.contacts+RouterUrlConstants.company+RouterUrlConstants.editContacts+encodedURL);
    } else if (this.isFromCompanyJourneyEditContacts) {
      let encodedCompanyId = this.referenceService.encodePathVariable(this.companyJourneyId);
      this.referenceService.goToRouter(RouterUrlConstants.home + RouterUrlConstants.contacts + RouterUrlConstants.editContacts + encodedURL + '/' + encodedCompanyId);
    } else {
      this.referenceService.goToRouter(RouterUrlConstants.home+RouterUrlConstants.contacts+RouterUrlConstants.editContacts+encodedURL);
    }
  }

  backToManageContacts() {
    let url = RouterUrlConstants.home+RouterUrlConstants.contacts+RouterUrlConstants.manage;
    url += this.isFromEditContacts ? '' : '/all';
    this.referenceService.goToRouter(url);
  }

  setContactNameToDisplay() {
    let firstName = this.selectedContact.firstName;
    let lastName = this.selectedContact.lastName;
    let isValidFirstName = this.referenceService.checkIsValidString(firstName);
    let isValidLastName = this.referenceService.checkIsValidString(lastName);
    this.contactName = '';
    if (isValidFirstName) {
      this.contactName = firstName;
    }
    if (isValidLastName) {
      this.contactName += isValidFirstName ? ` ${lastName}` : lastName;
    }
  }

  copyEmail(inputValue: HTMLElement) {
    this.isEmailCopied = true;
    this.copyToClipBoard(inputValue);

    setTimeout(() => {
      this.isEmailCopied = false;
    }, 2000)
  }

  copyMobileNumber(inputValue: HTMLElement) {
    this.isMobileNumberCopied = true;
    this.copyToClipBoard(inputValue);

    setTimeout(() => {
      this.isMobileNumberCopied = false;
    }, 2000)
  }

  copyToClipBoard(inputValue: HTMLElement) {
    const title = inputValue.getAttribute('value') || '';
    const textarea = document.createElement('textarea');
    textarea.value = title;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  openEmailModalPopup() {
    this.actionType = 'add';
    this.showEmailModalPopup = true;
  }

  showEmailSubmitSuccessStatus(event) {
    this.isReloadEmailActivityTab = !this.isReloadEmailActivityTab;
    this.isReloadActivityTab = !this.isReloadActivityTab;
    this.customResponse = new CustomResponse('SUCCESS', this.properties.emailSendSuccessResponseMessage, true);
    this.closeEmailModalPopup();
  }

  showEmailFailedErrorStatus(event) {
    this.isReloadEmailActivityTab = !this.isReloadEmailActivityTab;
    this.isReloadActivityTab = !this.isReloadActivityTab;
    this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
    this.closeEmailModalPopup();
  }

  closeEmailModalPopup() {
    this.showEmailModalPopup = false;
  }

  fetchLeadsAndCount() {
    this.referenceService.loading(this.leadsLoader, true);
    this.leadsService.findLeadsAndCountByContactId(this.contactId,this.vanityLoginDto.vanityUrlFilter,
      this.vanityLoginDto.vendorCompanyProfileName, this.isCompanyJourney).subscribe(
      response => {
        const data = response.data;
        let isSuccess = response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK;
        if (isSuccess) {
          this.leadsCount = data.totalRecords;
          this.contactLeads = data.list;
          this.formattedLeadsCount = this.formatNumber(this.leadsCount);
        } else {
          this.leadsResponse = new CustomResponse('Error', this.properties.failedToFetchLeadsResponseMessage, true);
        }
        this.referenceService.loading(this.leadsLoader, false);
      }, error => {
        this.referenceService.loading(this.leadsLoader, false);
        let message = this.referenceService.getApiErrorMessage(error);
        this.leadsResponse = new CustomResponse('ERROR', message, true);
      }
    )
  }

  viewMoreLeads() {
    this.viewLeads = true;
  }

  closeViewMoreLeadsTab() {
    this.viewLeads = false;
    this.fetchLeadsAndCount();
    this.fetchDealsAndCount();
    this.fetchTotalDealAmount();
  }

  viewLead(leadId:any) {
    this.actionType = 'view';
    this.leadId = leadId;
    this.showLeadForm = true;
  }

  addLead() {
    this.actionType = 'add';
    this.showLeadForm = true;
  }

  showLeadSubmitSuccess(event) {
    this.showLeadForm = false;
    this.isReloadActivityTab = !this.isReloadActivityTab
    this.fetchLeadsAndCount();
    this.customResponse = new CustomResponse('SUCCESS', this.properties.leadSubmittedSuccessResponseMessage, true);
  }

  fetchDealsAndCount() {
    this.referenceService.loading(this.dealsLoader, true);
    this.dealsService.findDealsAndCountByContactId(this.contactId,this.vanityLoginDto.vanityUrlFilter,
      this.vanityLoginDto.vendorCompanyProfileName, this.isCompanyJourney).subscribe(
      response => {
        const data = response.data;
        let isSuccess = response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK;
        if (isSuccess) {
          this.dealsCount = data.totalRecords;
          this.contactDeals = data.list;
          this.formattedDealsCount = this.formatNumber(this.dealsCount);
        } else {
          this.dealsResponse = new CustomResponse('Error', this.properties.failedToFetchDealsResponseMessage, true);
        }
        this.referenceService.loading(this.dealsLoader, false);
      }, error => {
        this.referenceService.loading(this.dealsLoader, false);
        let message = this.referenceService.getApiErrorMessage(error);
        this.dealsResponse = new CustomResponse('ERROR', message, true);
      }
    )
  }

  viewMoreDeals() {
    this.viewDeals = true;
  }

  viewDeal(dealId:any) {
    this.actionType = 'view';
    this.dealId = dealId;
    this.showDealForm = true;
  }

  addDeal() {
    this.actionType = 'add';
    this.showDealForm = true;
  }

  closeViewMoreDealsTab() {
    this.viewDeals = false;
    this.fetchDealsAndCount();
    this.fetchTotalDealAmount();
  }

  showDealSubmitSuccess(event) {
    this.showDealForm = false;
    this.isReloadActivityTab = !this.isReloadActivityTab;
    this.fetchLeadsAndCount();
    this.fetchDealsAndCount();
    this.fetchTotalDealAmount();
    this.customResponse = new CustomResponse('SUCCESS', this.properties.dealSubmittedSuccessResponseMessage, true);
  }

  closeDealForm() {
    this.showDealForm = false;
  }

  openAddNoteModalPopup() {
    this.showAddNoteModalPopup = true;
  }

  showNoteCutomResponse(event: any) {
    this.isReloadNoteTab = event;
    this.isReloadActivityTab = !this.isReloadActivityTab;
    this.customResponse = new CustomResponse('SUCCESS', this.properties.noteSubmittedSuccessResponseMessage, true);
    this.closeAddNoteModalPopup();
  }

  showNoteUpdateCutomResponse(event: any) {
    this.isReloadNoteTab = event;
    this.isReloadActivityTab = !this.isReloadActivityTab;
    this.customResponse = new CustomResponse('SUCCESS', this.properties.noteUpdatedSuccessResponseMessage, true);
    this.closeAddNoteModalPopup();
  }
  
  closeAddNoteModalPopup() {
    this.showAddNoteModalPopup = false;
  }

  showNoteDeleteSuccessStatus(event) {
    this.isReloadActivityTab = !this.isReloadActivityTab;
    this.customResponse = new CustomResponse('SUCCESS', event, true);
  }

  openTaskModalPopup() {
    this.actionType = 'add';
    this.showTaskModalPopup = true;
  }

  closeTaskModalPopup() {
    this.showTaskModalPopup = false;
  }

  showTaskSubmitSuccessStatus(event) {
    this.isReloadTaskActivityTab = event;
    this.isReloadActivityTab = !this.isReloadActivityTab;
    this.customResponse = new CustomResponse('SUCCESS', 'Task Submitted Succesfully.', true);
    this.closeTaskModalPopup();
  }

  showTaskUpdateCutomResponse(event: any) {
    this.isReloadTaskActivityTab = event;
    this.isReloadActivityTab = !this.isReloadActivityTab;
    this.customResponse = new CustomResponse('SUCCESS', 'Task Updated Successfully.', true);
    this.closeTaskModalPopup();
  }

  showTaskDeleteSuccessStatus(event) {
    this.isReloadActivityTab = !this.isReloadActivityTab;
    this.customResponse = new CustomResponse('SUCCESS', event, true);
  }

  fetchLogoFromExternalSource() {
  
  }

  openMeetingModalPopup() {
    this.actionType = 'add';
    if (this.activeCalendarDetails != undefined) {
      this.showMeetingModalPopup = true;
    } else {
      this.showCalendarIntegrationsModalPopup = true;
    }
  }

  closeCalendarIntegrationsModalPopup() {
    this.showCalendarIntegrationsModalPopup = false;
  }

  closeMeetingModalPopup(event) {
    if (this.referenceService.checkIsValidString(this.activeCalendarDetails.userUri)) {
      this.isReloadMeetingTab = event;
    } else {
      this.getActiveCalendarDetails();
    }
    this.showMeetingModalPopup = false;
  }

  getActiveCalendarDetails() {
    
  }

  ngAfterViewChecked() {
		let tempCheckCalendlyAuth = localStorage.getItem('isCalendlyAuth');
		localStorage.removeItem('isCalendlyAuth');

		if (tempCheckCalendlyAuth == 'yes') {
			this.referenceService.integrationCallBackStatus = true;
			localStorage.removeItem("userAlias");
			localStorage.removeItem("currentModule");
			this.router.navigate(['/home/dashboard/myprofile']);
		}
	}

  reloadMeetingTab(event) {
    this.isReloadMeetingTab = event;
    if (!this.referenceService.checkIsValidString(this.activeCalendarDetails.userUri)) {
      this.getActiveCalendarDetails();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeLeftSideBarWhenCalendarViewActivated() {
    if (this.isSidebarOpen) {
      this.toggleSidebar();
    }
  }

  toggleProfileSidebar() {
    this.isProfileSidebarOpen = !this.isProfileSidebarOpen;
  }

  getCompany() {

  }

  closeCompanyModal() {
    this.showEditCompanyModalPopup = false;
  }

  showSubmitCompanySuccess() {
    this.customResponse = new CustomResponse('SUCCESS', "Company Updated Successfully", true);
    this.getCompany();
    this.showEditCompanyModalPopup = false;
  }

  fetchContactsAndCount() {
    this.referenceService.loading(this.contactsLoader, true);
    this.contactService.fetchContactsAndCountByUserListId(this.contactId).subscribe(
      response => {
        const data = response.data;
        let isSuccess = response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK;
        if (isSuccess) {
          this.contactsCount = data.totalRecords;
          this.companyContacts = data.list;
          this.formattedContactsCount = this.formatNumber(this.contactsCount);
        } else {
          this.contactsResponse = new CustomResponse('Error', this.properties.failedToFetchLeadsResponseMessage, true);
        }
        this.referenceService.loading(this.contactsLoader, false);
      }, error => {
        this.referenceService.loading(this.contactsLoader, false);
        let message = this.referenceService.getApiErrorMessage(error);
        this.contactsResponse = new CustomResponse('ERROR', message, true);
      }
    )
  }

  viewContactJourney(contactId:any) {
    let encodedId = this.referenceService.encodePathVariableInNewTab(contactId);
    let encodedUserListId = this.referenceService.encodePathVariableInNewTab(this.selectedContact.companyUserListId);
    this.referenceService.openWindowInNewTab(RouterUrlConstants.home+RouterUrlConstants.contacts+RouterUrlConstants.editContacts+RouterUrlConstants.details+encodedUserListId+"/"+encodedId);
  }

  viewMoreContacts() {
    let encodedUserListId = this.referenceService.encodePathVariable(this.selectedContact.companyUserListId);
    let encodedCompanyId = this.referenceService.encodePathVariable(this.contactId);
    this.referenceService.goToRouter(RouterUrlConstants.home + RouterUrlConstants.contacts + RouterUrlConstants.editContacts + encodedUserListId + '/' + encodedCompanyId);
  }

  backToCompanyJourney() {
    let encodedId = this.referenceService.encodePathVariable(this.companyJourneyId);
    let encodedUserListId = this.referenceService.encodePathVariable(this.selectedContactListId);
    let url = "home/company/manage/details/"+encodedId;
    this.referenceService.goToRouter(url);
  }

  viewCompanyJourney() {
    let contactCompanyId = this.referenceService.encodePathVariable(this.selectedContact.contactCompanyId);
    let url = "home/company/manage/details/"+contactCompanyId;
    this.referenceService.openWindowInNewTab(url);
  }



  closeCompanyCampaigns() {
    this.showCompanyCampaigns = false;
  }

  formatNumber(input: number) {
    if (input >= 1000000) {
      return Math.floor(input / 1000000) + 'M';
    } else if (input >= 1000) {
      const roundedValue = Math.floor(input / 100) / 10;
      if (input % 1000 !== 0) {
        return `${roundedValue}k+`;
      }
      return `${roundedValue}k`;
    } else {
      return input.toString();
    }
  }

  fetchTotalDealAmount() {
    this.referenceService.loading(this.dealAmountLoader, true);
    this.dealsService.fetchTotalDealAmount(this.contactId,this.vanityLoginDto.vanityUrlFilter,
      this.vanityLoginDto.vendorCompanyProfileName).subscribe(
      response => {
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          this.totalDealAmount = response.data;
        }
        this.referenceService.loading(this.dealAmountLoader, false);
      }, error => {
        this.referenceService.loading(this.dealAmountLoader, false);
      }
    )
  }

  openAircallDialer() {
    this.showAircallDialer = true;
  }

  getActiveCallIntegrationDetails() {
    
  }

  reloadCallTab() {
    this.isReloadCallTab = !this.isReloadCallTab;
  }

  openAircallPopup() {
    this.referenceService.openModalPopup("addCallModalPopup");
  }

  dialNumber() {
    if (this.isCompanyJourney) {
      this.closeSelectContactModalPopup();
    }
    this.openAircallPopup();
    const payload = {
      phone_number: this.mobileNumber
    };
    this.referenceService.aircallPhone.send(
      'dial_number',
      payload,
      (success, data) => {
      }
    );
  }

  fetchUsersForCompanyJourney() {
    this.referenceService.loading(this.userListUsersLoader, true);
    this.contactService.fetchUsersForCompanyJourney(this.contactId, true).subscribe(
      response => {
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          this.companyUsersSearchableDropDownDto.data = response.data;
          this.companyUsersSearchableDropDownDto.placeHolder = "Select a contact";
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
        this.referenceService.loading(this.userListUsersLoader, false);
      }, error => {
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        this.referenceService.loading(this.userListUsersLoader, false);
      }, () => {
        if (this.companyUsersSearchableDropDownDto.data != undefined && this.companyUsersSearchableDropDownDto.data.length > 0) {
          this.mobileNumber = this.companyUsersSearchableDropDownDto.data[0].mobileNumber;
        }
      }
    )
  }

  getSelectedAssignedToUserId(event) {
    this.mobileNumber = event != undefined ? event['mobileNumber'] : '';
    if (this.mobileNumber != undefined && this.mobileNumber.length > 0) {
      this.enableDialButton = true;
    } else {
      this.enableDialButton = false;
    }
  }

  openSelectContactModalPopup() {
    this.referenceService.openModalPopup('addSelectContactModalPopup');
  }

  closeSelectContactModalPopup() {
    this.referenceService.closeModalPopup('addSelectContactModalPopup');
  }

  openDialNumber() {
    if (this.isCompanyJourney) {
      this.openSelectContactModalPopup();
    } else {
      this.dialNumber();
    }
  }

  validateMobileNumber(mobileNumber: string): boolean {
    if (mobileNumber) {
      const phone = parsePhoneNumberFromString(mobileNumber);
      if (phone && isValidPhoneNumber(mobileNumber)) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  askOliver() {
    this.isFromManageContact = true;
    this.openAskOliverModalPopup();
  }

  closeAskAI(event) {
    if (this.callActivity == undefined && !this.isFromManageContact) {
      this.chatGptSettingDTO = event;
    } else {
      this.callActivity = undefined;
    }
    this.showAskOliverModalPopup = false;
  }

  openOliver() {
    this.isFromManageContact = false;
    this.openAskOliverModalPopup();
  }

  private openAskOliverModalPopup() {
    this.contact = this.selectedContact;
    this.contact.contactName = this.contactName;
    this.contact.imageSourcePath = this.imageSourcePath;
    this.showAskOliverModalPopup = true;
  }

  fetchThreadIdAndVectorStoreId() {
    
  }

  askOliverForCallRecording(callActivity:any) {
   
  }

  fetchOliverActiveIntegration() {
   
  }

  getOliverAgentAccessSettings() {
   
  }
  
}
