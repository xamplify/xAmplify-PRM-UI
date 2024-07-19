import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, AfterViewChecked, ChangeDetectorRef, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { ContactService } from '../.././contacts/services/contact.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { EmailTemplateService } from '../../email-template/services/email-template.service';

import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { EventCampaign } from '../models/event-campaign';
import { CampaignEventMedia } from '../models/campaign-event-media';
import { Pagination } from '../../core/models/pagination';
import { ContactList } from '../../contacts/models/contact-list';
import { EmailTemplate } from '../../email-template/models/email-template';
import { Country } from '../../core/models/country';
import { Timezone } from '../../core/models/timezone';
import { Properties } from '../../common/models/properties';
import { Reply } from '../models/campaign-reply';
import { CampaignEmailTemplate } from '../models/campaign-email-template';
import { EventError } from '../models/event-error';
import { CustomResponse } from '../../common/models/custom-response';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CountryNames } from '../../common/models/country-names';
import { Roles } from '../../core/models/roles';
import { EmailTemplateType } from '../../email-template/models/email-template-type';

import { SocialStatusProvider } from "../../social/models/social-status-provider";
import { SocialService } from "../../social/services/social.service";
import { SocialStatus } from "../../social/models/social-status";
import { FormService } from '../../forms/services/form.service';
import { PreviewPopupComponent } from '../../forms/preview-popup/preview-popup.component';

import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import { HubSpotService } from 'app/core/services/hubspot.service';
import { EnvService } from 'app/env.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { Category as folder } from 'app/dashboard/models/category';
import { AddFolderModalPopupComponent } from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';
import { Form } from 'app/forms/models/form';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { VanityLoginDto } from '../../util/models/vanity-login-dto';
import { Pipeline } from 'app/dashboard/models/pipeline';

import { SortOption } from '../../core/models/sort-option';
import { UtilService } from '../../core/services/util.service';
import { utc } from 'moment';
import { OpportunityTypes } from 'app/dashboard/models/opportunity-types';
import { UserListPaginationWrapper } from 'app/contacts/models/userlist-pagination-wrapper';

declare var $, swal, flatpickr, CKEDITOR, require;
var moment = require('moment-timezone');

@Component({
    selector: 'app-event-campaign',
    templateUrl: './event-campaign-step.component.html',
    styleUrls: ['./event-campaign.component.css', '../../../assets/css/content.css'],
    providers: [PagerService, Pagination, CallActionSwitch, Properties, EventError, HttpRequestLoader, CountryNames, FormService, SortOption]
})
export class EventCampaignComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    emailTemplates: Array<EmailTemplate> = [];
    campaignEmailTemplate: CampaignEmailTemplate = new CampaignEmailTemplate();
    reply: Reply = new Reply();
    showSelectedTemplate: any;
    countries: Country[];
    timezonesCampaignEventTime: Timezone[];
    timezones: Timezone[];
    allItems = [];
    dataError = false;
    errorLength = 0;
    showErrorMessage = false;
    launchOptions = ['NOW', 'SCHEDULE', 'SAVE'];
    selectedLaunchOption: string;
    customResponse: CustomResponse = new CustomResponse();
    loggedInUserId: number;
    isPartnerUserList: boolean;  // changed for code ,, future it may change
    eventCampaign: EventCampaign = new EventCampaign();
    @ViewChild("myckeditor") ckeditor: any;
    ckeConfig: any;

    previewContactList = new ContactList();
    contactListsPagination: Pagination = new Pagination();
    contactsPagination: Pagination = new Pagination();
    paginationType: string;
    userListPaginationWrapper: UserListPaginationWrapper = new UserListPaginationWrapper();


    vanityLoginDto: VanityLoginDto = new VanityLoginDto();

    teamMemberEmailIds: any[] = [];
    isFormSubmitted = false;
    emailNotOpenedReplyDaysSum = 0;
    emailOpenedReplyDaysSum = 0;
    onClickScheduledDaysSum = 0;
    userListIds: any = [];
    isPreviewEvent = false;
    eventRouterPage = false;
    isSelectedSchedule = false;
    isLaunched = false;
    hasInternalError = false;
    isReloaded = false;
    isAdd = true;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    isValidCampaignName = false;
    names: string[] = [];
    editedCampaignName = '';
    datePassedError = '';
    endDateErrorMesg = '';
    endDatePassedError = '';
    endDatePassError = false;
    currentDate: any;
    scheduleCampaignError = '';
    parternUserListIds = [];
    reDistributeEvent = false;
    loader = false;
    isEditCampaign = false;
    checkLaunchOption: string;

    campaignEmailTemplates = [];
    emailTemplatesPagination: Pagination = new Pagination();
    formsPagination: Pagination = new Pagination();

    detailsTab = false;
    recipientsTab = false;
    emailTemplatesTab = false;
    launchTab = false;

    detailsTabClass: string;
    recipientsTabClass = "disableRecipientsTab";
    emailTemplatesTabClass = "disableRecipientsTab";
    launchTabClass = "disableRecipientsTab";
    currentTab: string;
    showContactType: boolean = false;
    roleName: Roles = new Roles();
    gridLoader = false;
    selectedListOfUserLists = [];
    isHeaderCheckBoxChecked: boolean = false;
    contactSearchInput: string = "";
    emailTemplateSearchInput: string = "";
    timeZoneSetValue: any;
    showSelectedEmailTemplate: boolean = false;
    filteredEmailTemplateIds: Array<number>;
    emailTemplateId: number = 0;
    selectedEmailTemplateRow: number;
    isHighLet = false;
    parentCampaignId = false;
    reDistributeEventManage = false;
    parentCampaignIdValue: number;
    isPartnerToo = false;
    userListDTOObj = [];
    isEventUpdate = false;
    isEnableUpdateButton = false;
    beforeDaysLength: number;
    tempStartTime: string;
    isVendor = false;

    characterleft = 250;




    enableLeads: boolean;

    //Push Leads To Marketo
    showMarketoForm: boolean;
    clientId: string;
    secretId: string;
    marketoInstance: string;
    clientIdClass: string;
    secretIdClass: string;
    marketoInstanceClass: string;

    templateError: boolean;
    clentIdError: boolean;
    secretIdError: boolean;
    marketoInstanceError: boolean;
    isModelFormValid: boolean;
    templateSuccessMsg: any;

    loadingMarketo: boolean;
    marketoButtonClass = "btn btn-default";
    loading = false;
    // pushToMarketo = false;
    //ENABLE or DISABLE LEADS
    smsService = false;
    enableSMS: boolean;
    smsText: any;
    enableSmsText: boolean;
    smsTextDivClass: string

    socialStatusProviders = new Array<SocialStatusProvider>();
    selectedAccounts: number = 0;
    socialStatusList = new Array<SocialStatus>();
    isAllSelected: boolean = false;
    selectedFormData: Array<Form> = [];
    statusMessage: string;
    selectedFormName: string;
    selectedFormId: number;
    formCreatedName: string = '';
    @ViewChild('previewPopUpComponent') previewPopUpComponent: PreviewPopupComponent;


    validUsersCount: number;
    allUsersCount: number;
    listOfSelectedUserListIds = [];
    isPushToCrm = false;
    pushToCRM = [];
    isValidCrmOption = true;
    formGroupClass = "form-group";

    senderMergeTag: SenderMergeTag = new SenderMergeTag();
    public selectedFolderIds = [];
    public emailTemplateFolders: Array<folder>;
    public folderFields: any;
    public folderFilterPlaceHolder: string = 'Select folder';
    folderErrorCustomResponse: CustomResponse = new CustomResponse();
    isFolderSelected = true;
    isEditPartnerTemplate = false;
    categoryNames: any;
    @ViewChild('addFolderModalPopupComponent') addFolderModalPopupComponent: AddFolderModalPopupComponent;
    folderCustomResponse: CustomResponse = new CustomResponse();
    completeLoader = false;
    isOrgAdminOrOrgAdminTeamMember: boolean;
    leadPipelines = new Array<Pipeline>();
    dealPipelines = new Array<Pipeline>();
    isConfigurePipelines = false;
    defaultLeadPipelineId = 0;
    defaultDealPipelineId = 0;
    defaultLeadTicketTypeId = 0;
    defaultDealTicketTypeId = 0;
    salesforceIntegrated = false;
    showConfigurePipelines = false;

    isValidPipeline = true;
    mergeTagsInput: any = {};
    editTemplateMergeTagsInput: any = {};
    showUsersPreview = false;
    selectedListName = "";
    selectedListId = 0;
    recipientsSortOption: SortOption = new SortOption();
    emptyContactListMessage = "";
    emptyContactsMessage: string = "";
    expandedUserList: any;
    showExpandButton = false;

    contactListTabName: string = "";

    beeContainerInput: any = {};
    editTemplateLoader = false;
    jsonBody: any;
    showEditTemplatePopup = false;
    templateMessageClass = "";
    templateUpdateMessage = "";
    showEditTemplateMessageDiv = false;
    TO_PARTNER_MESSAGE: string = "";
    THROUGH_PARTNER_MESSAGE: string= "";
    endDatePickr: any;
    showMicrosoftAuthenticationForm: boolean = false;
    activeCRMDetails: any;
    campaignRecipientsLoader = false;
    leadTicketTypeClass: string = this.formGroupClass;
    dealTicketTypeClass: string = this.formGroupClass;
    leadPipelineClass: string = this.formGroupClass;
    dealPipelineClass: string = this.formGroupClass;
    pipelineLoader:HttpRequestLoader = new HttpRequestLoader();
    dealTicketTypes: any;
    leadTicketTypes: any;
    constructor(private utilService: UtilService, public integrationService: IntegrationService, public envService: EnvService, public callActionSwitch: CallActionSwitch, public referenceService: ReferenceService,
        private contactService: ContactService, public socialService: SocialService,
        public campaignService: CampaignService,
        public authenticationService: AuthenticationService,
        public emailTemplateService: EmailTemplateService,
        private pagerService: PagerService,
        private logger: XtremandLogger,
        public hubSpotService: HubSpotService,
        private router: Router, public activatedRoute: ActivatedRoute,
        public properties: Properties, public eventError: EventError, public countryNames: CountryNames,
        public formService: FormService, private changeDetectorRef: ChangeDetectorRef, private render: Renderer, private vanityUrlService: VanityURLService) {

        this.checkLaunchOption = 'SAVE';
        this.referenceService.renderer = this.render;
        this.vanityUrlService.isVanityURLEnabled();
        this.countries = this.referenceService.getCountries();
        this.eventCampaign.campaignLocation.country = (this.countryNames.countries[0]);
        CKEDITOR.config.height = '100';
        this.isPreviewEvent = this.router.url.includes('/home/campaigns/event-preview') ? true : false;
        this.isEventUpdate = this.router.url.includes('/home/campaigns/event-update') ? true : false;
        this.isEditCampaign = this.router.url.includes('/home/campaigns/event-edit') ? true : false;
        CKEDITOR.config.readOnly = this.isPreviewEvent ? true : false;
        this.reDistributeEvent = this.router.url.includes('/home/campaigns/re-distribute-event') ? true : false;
        this.reDistributeEventManage = this.router.url.includes('/home/campaigns/re-distribute-manage') ? true : false;
        if (this.reDistributeEvent) { this.isPartnerUserList = false; } else { this.isPartnerUserList = true; }
        if (this.authenticationService.isOnlyPartner()) { this.isPartnerUserList = false; }
        this.isPartnerToo = this.authenticationService.checkIsPartnerToo();
        this.completeLoader = true;
        if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
            this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
            this.vanityLoginDto.userId = this.loggedInUserId;
            this.vanityLoginDto.vanityUrlFilter = true;
        }
        referenceService.getCompanyIdByUserId(this.authenticationService.getUserId()).subscribe(response => {
            referenceService.getOrgCampaignTypes(response).subscribe(data => {
                this.enableLeads = data.enableLeads;
                this.getActiveCRMDetails();
                this.completeLoader = false;
            }, error => {
                this.completeLoader = false;
            });
        }, error => {
            this.completeLoader = false;
        });
        const roles = this.authenticationService.getRoles();
        let isVendor = roles.indexOf(this.roleName.vendorRole) > -1 || roles.indexOf(this.roleName.vendorTierRole) > -1 || roles.indexOf(this.roleName.prmRole) > -1;
        this.isOrgAdminOrOrgAdminTeamMember = (this.authenticationService.isOrgAdmin() || (!this.authenticationService.isAddedByVendor && !isVendor)) && !this.reDistributeEvent;
        this.eventCampaign.eventUrl = this.envService.CLIENT_URL;

        if (this.isEditCampaign) {
            let selectedListSortOption = {
                'name': 'Selected Group', 'value': 'selectedList'
            }
            this.recipientsSortOption.eventCampaignRecipientsDropDownOptions.push(selectedListSortOption);
            this.recipientsSortOption.eventSelectedCampaignRecipientsDropDownOption = this.recipientsSortOption.eventCampaignRecipientsDropDownOptions[this.recipientsSortOption.eventCampaignRecipientsDropDownOptions.length - 1];
        }
    }

    isEven(n) { if (n % 2 === 0) { return true; } return false; }
    loadCampaignNames(userId: number) {
        this.campaignService.getCampaignNames(userId).subscribe(data => { this.names.push(data); },
            error => console.log(error), () => console.log("Campaign Names Loaded"));
    }
    validateCampaignName(campaignName: string) {
        this.eventTitleError();
        this.resetTabClass();
        const lowerCaseCampaignName = $.trim(campaignName.toLowerCase());//Remove all spaces
        const list = this.names[0];
        if (this.isAdd) {
            if ($.inArray(lowerCaseCampaignName, list) > -1) {
                this.isValidCampaignName = false;
            } else {
                this.isValidCampaignName = true;
            }
        } else {
            if ($.inArray(lowerCaseCampaignName, list) > -1 && this.editedCampaignName.toLowerCase() != lowerCaseCampaignName) {
                this.isValidCampaignName = false;
            } else {
                this.isValidCampaignName = true;
            }
        }
        this.resetTabClass();
    }
    imageClick() {
        $('#eventImage').click();
    }

    eventHandler(event: any) {
        if (event === 13) { this.searchEmailTemplate(); }
    }

    listCategories() {
        this.completeLoader = true;
        this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId).subscribe(
            (data: any) => {
                this.categoryNames = data.data;
                let categoryIds = this.categoryNames.map(function (a: any) { return a.id; });
                this.eventCampaign.categoryId = categoryIds[0];
                this.completeLoader = false;
            },
            error => { this.logger.error("error in getCategoryNamesByUserId(" + this.loggedInUserId + ")", error); },
            () => this.logger.info("Finished listCategories()"));
    }

    ngOnInit() {
        if (!this.reDistributeEvent && !this.isEventUpdate) {
            this.authenticationService.isShowForms = true;
        }

        this.detailsTab = true;
        this.resetTabClass()
        this.loggedInUserId = this.authenticationService.getUserId();
        this.loadCampaignNames(this.loggedInUserId);
        this.listAllTeamMemberEmailIds();
        // this.loadContactLists(this.contactListsPagination);

        if (this.referenceService.selectedCampaignType !== 'eventCampaign' && this.router.url.includes('/home/campaigns/event') && !this.activatedRoute.snapshot.params['id']) {
            this.router.navigate(['/home/campaigns/select']);
            this.isReloaded = true;
        }
        else if (this.activatedRoute.snapshot.params['id']) {
            this.isAdd = false;
            this.eventRouterPage = true;
            const alias = this.activatedRoute.snapshot.params['id'];
            if (this.reDistributeEvent) { this.campaignService.reDistributeEvent = true; this.eventCampaign.emailNotification = true }
            this.campaignService.getEventCampaignById(alias).subscribe(
                (result) => {
                    this.campaignService.eventCampaign = result.data;                    
                    this.eventCampaign = result.data;

                    let endDate = this.eventCampaign.endDateString;
                    if (endDate != undefined && endDate != null) {
                        let endDateString = utc(endDate).local().format("YYYY-MM-DD HH:mm");
                        this.eventCampaign.endDateString = endDateString;
                        this.campaignService.eventCampaign.endDateString = endDateString;
                        this.endDatePickr.setDate(new Date(endDateString));
                    }

                    this.isPushToCrm = this.eventCampaign.pushToMarketingAutomation;
                    this.eventCampaign.pushToCRM = [];
                    if (this.eventCampaign.pushToMarketo) {
                        this.eventCampaign.pushToCRM.push('marketo');
                    }
                    if (this.eventCampaign.pushToHubspot) {
                        this.eventCampaign.pushToCRM.push('hubspot');
                    }
                    if (this.eventCampaign.dataShare == undefined) {
                        this.eventCampaign.dataShare = false;
                    }
                    if (this.eventCampaign.detailedAnalyticsShared == undefined) {
                        this.eventCampaign.detailedAnalyticsShared = false;
                    }


                    this.filterContacts('ALL');  
                    if (result.data.enableCoBrandingLogo) { this.eventCampaign.enableCoBrandingLogo = result.data.enableCoBrandingLogo; }
                    else { this.eventCampaign.enableCoBrandingLogo = false; }
                    if (result.data.parentCampaignId) { this.parentCampaignIdValue = result.data.parentCampaignId; this.parentCampaignId = true; this.isPartnerUserList = false; }
                    this.editedCampaignName = this.eventCampaign.campaign;
                    this.validateCampaignName(this.eventCampaign.campaign);
                    if (this.reDistributeEvent) {
                        let existingTeamMemberEmailIds = this.teamMemberEmailIds.map(function (a) { return a.emailId; });
                        if (existingTeamMemberEmailIds.indexOf(this.eventCampaign.email) < 0) {
                            const userProfile = this.authenticationService.userProfile;
                            this.eventCampaign.email = userProfile.emailId;
                        }
                    }
                    this.eventCampaign.emailTemplate = result.data.emailTemplateDTO;
                    if (!this.eventCampaign.emailTemplate) { this.eventCampaign.emailTemplate = new EmailTemplate(); }
                    else { this.showSelectedTemplate = result.data.emailTemplateDTO.id; }
                    this.eventCampaign.user = result.data.userDTO;
                    if (result.data.campaignReplies === undefined) { this.eventCampaign.campaignReplies = []; }
                    else { this.getCampaignReplies(this.eventCampaign); }
                    this.eventCampaign.campaignEventTimes = result.data.campaignEventTimes;
                    if (!this.eventCampaign.campaignEventTimes[0]) {
                        this.eventCampaign.campaignEventTimes = [];
                        this.eventCampaign.campaignEventTimes[0].startTimeString = new Date().toDateString();
                        if (!this.eventCampaign.campaignEventTimes[0].allDay) {
                            this.eventCampaign.campaignEventTimes[0].endTimeString = new Date().toDateString();
                        }
                    }
                    if (this.eventCampaign.country === undefined || this.eventCampaign.country === "") { this.eventCampaign.countryId = 0; }
                    else { this.eventCampaign.countryId = this.countries.find(x => x.name == result.data.country).id; }
                    //  this.eventCampaign.campaignEventTimes[0].countryId = this.countries.find(x => x.name == result.data.campaignEventTimes[0].country).id;
                    if (this.eventCampaign.campaignEventTimes[0].countryId === undefined) { this.eventCampaign.campaignEventTimes[0].countryId = 0; }
                    for (let i = 0; i < this.countries.length; i++) {
                        if (this.countries[i].name === result.data.campaignEventTimes[0].country) {
                            this.eventCampaign.campaignEventTimes[0].countryId = this.countries[i].id;
                            break;
                        }
                    }
                    if (!this.eventCampaign.campaignLocation.country) {
                        this.eventCampaign.campaignLocation.country = (this.countryNames.countries[0]);
                    }
                    this.onChangeCountryCampaignEventTime(this.eventCampaign.campaignEventTimes[0].countryId)
                    if (this.reDistributeEvent) { this.isPartnerUserList = false; }
                    this.eventCampaign.userListIds = [];
                    this.userListDTOObj = result.data.userListDTOs;
                    for (let i = 0; i < result.data.userListDTOs.length; i++) {
                        this.parternUserListIds.push(result.data.userListDTOs[i].id);
                        this.eventCampaign.userListIds.push(result.data.userListDTOs[i].id);
                    }
                    if (this.reDistributeEvent) {
                        this.eventCampaign.userListIds = []; this.userListIds = []; this.parternUserListIds = [];
                        this.userListDTOObj = [];
                        // this.checkLaunchOption = this.eventCampaign.campaignScheduleType;
                    }
                    this.eventCampaign.userLists = [];
                    if (this.authenticationService.isOnlyPartner()) {
                        const emailTemplates: any = [];
                        this.emailTemplates.forEach((element, index) => {
                            if (element.id === this.eventCampaign.emailTemplate.id) { emailTemplates.push(element); }
                        });
                        this.emailTemplates = emailTemplates;
                    }

                    if (this.isEditCampaign) {
                        if (this.parternUserListIds.length > 0) {
                            this.contactsPagination.editCampaign = true;
                            this.parternUserListIds = this.eventCampaign.userListIds.sort();
                            this.emailTemplateId = this.eventCampaign.emailTemplate.id;
                        }
                        if (this.eventCampaign.campaignScheduleType === 'SAVE') {
                            this.launchOptions[2];
                            this.setLaunchOptions('SAVE');
                        } else if (this.eventCampaign.campaignScheduleType === 'SCHEDULE') {
                            this.launchOptions[1];
                            this.setLaunchOptions('SCHEDULE');
                        }
                    }

                    if (this.reDistributeEventManage) {
                        if (this.eventCampaign.campaignScheduleType === 'SAVE') {
                            this.launchOptions[2];
                            this.setLaunchOptions('SAVE');
                        } else if (this.eventCampaign.campaignScheduleType === 'SCHEDULE') {
                            this.launchOptions[1];
                            this.setLaunchOptions('SCHEDULE');
                        }
                    }

                    for (let i = 0; i < this.timezonesCampaignEventTime.length; i++) {
                        if (this.timezonesCampaignEventTime[i].timezoneId === this.eventCampaign.campaignEventTimes[0].timeZone) {
                            console.log(this.timezonesCampaignEventTime[i].timezoneId);
                        }
                    }

                    this.selectedFormData = result.data.formDTOs;
                    this.eventCampaign.forms = this.selectedFormData;
                    for (var i = 0; i < this.selectedFormData.length; i++) {
                        this.selectedFormName = this.selectedFormData[i].name;
                        this.selectedFormId = this.selectedFormData[i].id;
                    }
                    if (this.previewPopUpComponent && this.selectedFormId && this.selectedFormData) {
                        this.previewPopUpComponent['selectedFormId'] = this.selectedFormId;
                        this.previewPopUpComponent.selectedFormData = this.selectedFormData;
                    }
                    this.eventCampaign.eventUrl = 'https://www.event-campaign/54ec45';

                    if (this.eventCampaign.publicEventCampaign && this.eventCampaign.campaign && !this.statusMessage) {
                        this.statusMessage = this.eventCampaign.campaign;
                    } else {
                        this.statusMessage = '';
                    }


                    this.loadContactLists(this.contactListsPagination);
                    this.setTemplateId();
                    if (!this.eventCampaign.nurtureCampaign) {
                        this.loadEmailTemplates(this.emailTemplatesPagination);
                    }
                    this.recipientsTabClass = "enableRecipientsTab";
                    this.detailsTab = true;
                    this.resetTabClass();
                    this.eventStartTimeError()

                }
            );
        }
        else {
            /*this.eventCampaign.emailTemplate = this.emailTemplates[0];*/
            this.eventCampaign.countryId = this.countries[0].id;
            this.eventCampaign.campaignEventTimes[0].countryId = this.countries[0].id;
            this.loadContactLists(this.contactListsPagination);
            this.loadEmailTemplates(this.emailTemplatesPagination);
        }

        this.listActiveSocialAccounts(this.loggedInUserId);

        flatpickr('.eventflatpickr', {
            enableTime: true,
            dateFormat: 'm/d/Y h:i K',
            time_24hr: false,
            minDate: new Date(),
        });
        this.ckeConfig = {
            allowedContent: true,
        };

        this.listEmailTemplatesFolders();
        this.listCategories();
        this.listCampaignPipelines();
        this.eventCampaign.leadPipelineId = 0;
        this.eventCampaign.dealPipelineId = 0;
        //this.eventCampaign.configurePipelines = !this.eventCampaign.configurePipelines;

    }

    configurePipelines() {
        this.eventCampaign.configurePipelines = !this.eventCampaign.configurePipelines;
        if (!this.eventCampaign.configurePipelines) {
            this.eventCampaign.dealPipelineId = this.defaultDealPipelineId;
            this.eventCampaign.leadPipelineId = this.defaultLeadPipelineId;
            if (this.eventCampaign.dealPipelineId == undefined || this.eventCampaign.dealPipelineId === 0) {
                this.eventCampaign.dealPipelineId = this.defaultDealPipelineId;
            } 
        }
        this.validatePipeline();
    }

    //   listCampaignPipelines() {
    //     this.campaignService.listCampaignPipelines(this.loggedInUserId)
    //     .subscribe(
    //     response => {
    //       if(response.statusCode==200){
    //         let data = response.data;
    //         this.leadPipelines = data.leadPipelines;
    //         this.dealPipelines = data.dealPipelines;
    //        }
    //     },
    //     error => {
    //         this.httpRequestLoader.isServerError = true;
    //         },
    //     () => { }
    // );
    // }


    listCampaignPipelines() {
        if (this.enableLeads) {
            this.campaignService.listCampaignPipelines(this.loggedInUserId)
                .subscribe(
                    response => {
                        if (response.statusCode == 200) {
                            let data = response.data;
                            this.leadPipelines = data.leadPipelines;
                            this.dealPipelines = data.dealPipelines;
                            if ('HALOPSA' === this.activeCRMDetails.type) {
                                this.leadPipelines = data.dealPipelines;
                            }
                            if (!this.activeCRMDetails.activeCRM) {
                                this.leadPipelines.forEach(pipeline => {
                                    if (pipeline.default) {
                                        this.defaultLeadPipelineId = pipeline.id;
                                        this.eventCampaign.leadPipelineId = pipeline.id;
                                    }
                                });

                                this.dealPipelines.forEach(pipeline => {
                                    if (pipeline.default) {
                                        this.defaultDealPipelineId = pipeline.id;
                                        this.eventCampaign.dealPipelineId = pipeline.id;
                                    }
                                });
                            } else {
                                this.defaultLeadPipelineId = this.leadPipelines[0].id;
                                this.defaultDealPipelineId = this.dealPipelines[0].id;                                  
                                if (this.eventCampaign.dealPipelineId == undefined || this.eventCampaign.dealPipelineId == null || this.eventCampaign.dealPipelineId === 0) {
                                    this.eventCampaign.dealPipelineId = this.dealPipelines[0].id;
                                }
                                if (this.eventCampaign.leadPipelineId == undefined || this.eventCampaign.leadPipelineId == null || this.eventCampaign.leadPipelineId === 0) {
                                    this.eventCampaign.leadPipelineId = this.leadPipelines[0].id;
                                }
                            }

                        }
                    },
                    error => {
                        this.httpRequestLoader.isServerError = true;
                    },
                    () => { }
                );
        }

    }


    ngAfterViewInit() {
        // this.listAllTeamMemberEmailIds();
        this.detailsTab = true;
        this.resetTabClass();
        
        let now:Date = new Date();
        let defaultDate = now;
        if (this.eventCampaign.endDateString != undefined && this.eventCampaign.endDateString != null) {
            defaultDate = new Date(this.eventCampaign.endDateString);
        }

        this.endDatePickr = flatpickr('#endDate1', {
            enableTime: true,
            dateFormat: 'Y-m-d H:i',
            time_24hr: true,
            minDate: now,
            defaultDate: defaultDate
        });
    }


    ngAfterViewChecked() {
        /*    if( this.previewPopUpComponent && this.previewPopUpComponent.selectedFormData.length != 0 ){
              this.selectedFormData = this.previewPopUpComponent.selectedFormData;
              this.eventCampaign.forms = this.previewPopUpComponent.selectedFormData;
              //this.formCreatedName = this.eventCampaign.forms.createdName;
              for(var i=0; i< this.selectedFormData.length; i++){
                this.selectedFormName = this.selectedFormData[i].name;
                this.selectedFormId = this.selectedFormData[i].id;
               // this.createdBy = this.selectedFormData[i].createdBy;
              }
            }else{
                if(!this.selectedFormName) { this.selectedFormName = null; }
                if(!this.selectedFormId) { this.selectedFormId = null; }
            }
            console.log( this.selectedFormName);
            console.log( this.selectedFormId);
            this.changeDetectorRef.detectChanges();*/
    }

    setTemplateId() {
        this.emailTemplateId = this.eventCampaign.emailTemplate.id;
        this.eventCampaign.selectedEditEmailTemplate = this.eventCampaign.emailTemplate;
    }

    eventTitleError() {
        this.eventError.eventTitleError = this.eventCampaign.campaign.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") ? false : true;
    }

    eventSubjectLineError() {
        this.eventError.eventSubjectLineError = this.eventCampaign.subjectLine.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") ? false : true;
        this.resetTabClass();
    }

    eventHostByError() {
        this.eventError.eventHostByError = this.eventCampaign.fromName.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") ? false : true;
        this.resetTabClass();
    }
    eventStartTimeError() {
        const currentDate = new Date().getTime();
        this.tempStartTime = this.eventCampaign.campaignEventTimes[0].startTimeString;
        const startDate = Date.parse(this.eventCampaign.campaignEventTimes[0].startTimeString);
        if (startDate < currentDate) { this.setStartTimeErrorMessage(true, 'Start Date / Time is already over.'); }
        else if (startDate > currentDate) { this.setStartTimeErrorMessage(false, ''); }
        else if (!this.eventCampaign.campaignEventTimes[0].startTimeString) { this.setStartTimeErrorMessage(true, 'The start date is required.'); }
        else { this.setStartTimeErrorMessage(false, ''); }

        if (this.reDistributeEvent) {
            if (this.eventCampaign.eventStarted) {
                this.eventError.eventExpiredError = true;
            }
        }
        this.eventEndTimeError();
        this.eventSameDateError();
        this.resetTabClass();
    }
    setStartTimeErrorMessage(event: boolean, mesg: string) {
        this.eventError.eventStartTimeError = event;
        this.datePassedError = mesg;
    }
    eventEndTimeError() {
        if (!this.eventCampaign.campaignEventTimes[0].allDay) {
            this.eventError.eventEndDateError = !this.eventCampaign.campaignEventTimes[0].endTimeString ? true : false;
            this.endDateErrorMesg = 'The end date is required.'
        } else {
            this.eventError.eventEndDateError = false;
            this.endDateErrorMesg = '';
        }
        this.eventSameDateError();
        this.resetTabClass();
        this.validateReplayDate();
    }
    eventSameDateError() {
        const endDate = Date.parse(this.eventCampaign.campaignEventTimes[0].endTimeString);
        const startDate = Date.parse(this.eventCampaign.campaignEventTimes[0].startTimeString);
        if (this.eventCampaign.campaignEventTimes[0].endTimeString && !this.eventCampaign.campaignEventTimes[0].allDay && startDate === endDate) {
            this.eventError.eventSameDateError = true;
            this.endDatePassedError = 'The event must end after the start date and time';
        } else if (startDate > endDate && !this.eventCampaign.campaignEventTimes[0].allDay) {
            this.setSameDateErrorMesg(true, true, 'The event must end after the start date and time.');
        } else { this.setSameDateErrorMesg(false, false, ''); }
        this.resetTabClass();
    }
    setSameDateErrorMesg(endDate, sameDate, mesg) { this.endDatePassError = endDate; this.eventError.eventSameDateError = sameDate; this.endDatePassedError = mesg; }
    eventLocationError() {
        if (!this.eventCampaign.onlineMeeting) {
            this.eventError.eventLocationError = this.eventCampaign.campaignLocation.location.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") ? false : true;
        } else { this.eventError.eventLocationError = false; }
        this.resetTabClass()
    }
    eventCountryError() {
        this.eventError.eventCountryAndTimeZone = this.eventCampaign.campaignEventTimes[0].countryId ? false : true;
        this.resetTabClass();
    }
    eventDescriptionError() {
        this.eventError.eventDescription = this.eventCampaign.message ? false : true;
        this.resetTabClass();
    }
    eventContactListError() {
        this.eventError.eventContactError = this.eventCampaign.userListIds.length > 0 ? false : true;
        this.resetTabClass();
    }
    onBlurValidation() {
        this.eventTitleError();
        this.eventHostByError();
        this.eventStartTimeError();
        this.eventEndTimeError();
        this.eventCountryError();
        this.eventLocationError();
        this.eventDescriptionError();
        this.eventContactListError();
        this.eventSameDateError();
    }

    /*****************LOAD CONTACTLISTS WITH PAGINATION START *****************/

    searchContactList() {
        this.contactListsPagination.pageIndex = 1;
        this.contactListsPagination.searchKey = this.contactSearchInput;
        if (this.contactListsPagination.searchKey != undefined && this.contactListsPagination.searchKey != null 
                && this.contactListsPagination.searchKey.trim() != "") {
            this.showExpandButton = true;
        } else {
            this.showExpandButton = false;
        }
        this.loadContactLists(this.contactListsPagination);
    }

    clearContactListSearch() {
        this.contactListsPagination.pageIndex = 1;
        this.contactListsPagination.searchKey = "";
        this.loadContactLists(this.contactListsPagination);
    }
    eventHandlerContact(event: any) { if (event === 13) { this.searchContactList(); } }

    loadContactLists(contactListsPagination: Pagination) {
        this.contactListTabName = "Partners";
        this.paginationType = 'contactlists';
        const roles = this.authenticationService.getRoles();
        this.isVendor = roles.indexOf(this.roleName.vendorRole) > -1 || roles.indexOf(this.roleName.vendorTierRole) > -1 || roles.indexOf(this.roleName.prmRole) > -1;
        if (this.isEditCampaign) {
            contactListsPagination.editCampaign = true;
            contactListsPagination.campaignId = this.eventCampaign.id;
            contactListsPagination.channelCampaign = this.eventCampaign.channelCampaign;
        }
        if (this.authenticationService.isOrgAdmin() || this.authenticationService.isOrgAdminPartner() || (!this.authenticationService.isAddedByVendor && !this.isVendor)) {
        	this.contactListsPagination.filterValue = false;
            this.contactListsPagination.filterKey = null;
            this.showContactType = true;
            if (this.isEditCampaign) {
                this.contactListsPagination.filterValue = true;
                this.contactListsPagination.filterKey = 'isPartnerUserList';
            }
        } else {
        	this.TO_PARTNER_MESSAGE = "To "+this.authenticationService.partnerModule.customName+": Send a campaign intended just for your"+this.authenticationService.partnerModule.customName;
            this.THROUGH_PARTNER_MESSAGE = "Through "+this.authenticationService.partnerModule.customName+": Send a campaign that your "+this.authenticationService.partnerModule.customName+" can redistribute";
            if (this.reDistributeEvent || this.reDistributeEventManage) {
                this.contactListsPagination.filterValue = false;
            } else {
                this.contactListsPagination.filterValue = true;
            }
            this.showContactType = false;
            this.contactListsPagination.filterKey = 'isPartnerUserList';
        }

        if (this.authenticationService.isOrgAdmin() || this.authenticationService.isOrgAdminPartner() || (!this.authenticationService.isAddedByVendor && !this.isVendor) || this.authenticationService.superiorRole === 'OrgAdmin & Partner' || this.authenticationService.superiorRole === 'Vendor & Partner') {
            if (!this.eventCampaign.channelCampaign) {
                this.contactListsPagination.filterValue = false;
                this.contactListsPagination.filterKey = null;
                this.showContactType = true;
                if (this.reDistributeEvent || this.reDistributeEventManage) {
                    this.contactListsPagination.userId = this.eventCampaign.userDTO.id;
                    this.contactListsPagination.redistributingCampaign = true;
                    this.contactListsPagination.filterKey = 'isPartnerUserList';
                    this.contactListsPagination.filterValue = false;
                    this.contactListsPagination.editCampaign = true;
                    this.contactListsPagination.campaignId = this.eventCampaign.id;
                }
            } else {
                if (this.reDistributeEvent || this.reDistributeEventManage) {
                    this.contactListsPagination.filterValue = false;
                    this.contactListsPagination.userId = this.eventCampaign.userDTO.id;
                    this.contactListsPagination.redistributingCampaign = true;
                } else {
                    this.contactListsPagination.filterValue = true;
                }
                this.showContactType = false;
                this.contactListsPagination.filterKey = 'isPartnerUserList';
            }
        }

        if (this.authenticationService.isOrgAdmin() || this.authenticationService.isOrgAdminPartner() || (!this.authenticationService.isAddedByVendor && !this.isVendor) || this.authenticationService.superiorRole === 'OrgAdmin & Partner'
        	|| this.authenticationService.superiorRole === 'OrgAdmin') {
            if (!this.eventCampaign.channelCampaign) {
                this.contactListTabName = this.authenticationService.partnerModule.customName+" & Recipients";
            }
            this.TO_PARTNER_MESSAGE = "To Recipient: Send a campaign intended just for your "+this.authenticationService.partnerModule.customName+"/ Contacts";
            this.THROUGH_PARTNER_MESSAGE = "Through "+this.authenticationService.partnerModule.customName+": Send a campaign that your "+this.authenticationService.partnerModule.customName+" can redistribute";

        }


        // this.contactListMethod(this.contactListsPagination);
        this.filterContacts('ALL');
    }

    /*****************LOAD CONTACTLISTS WITH PAGINATION END *****************/

    /*****************LOAD CONTACTS BY CONTACT LIST ID WITH PAGINATION START *****************/
    loadContactsOnPreview(contactList: ContactList, pagination: Pagination) {
        pagination.pageIndex = 1;
        this.contactsPagination.maxResults = 12;
        this.loadContacts(contactList, pagination);
    }

    loadContacts(contactList: ContactList, pagination: Pagination) {
        this.paginationType = 'contacts';
        this.previewContactList = contactList;
        this.userListPaginationWrapper.pagination = pagination;
        this.userListPaginationWrapper.userList =  this.previewContactList;
        this.contactService.loadUsersOfContactList(this.userListPaginationWrapper).subscribe(
            (data: any) => {
                pagination.totalRecords = data.totalRecords;
                this.contactsPagination = this.pagerService.getPagedItems(pagination, data.listOfUsers);
                $('#contactsModal').modal('show');
            },
            error =>
                () => console.log('loadContacts() finished')
        );
    }
    loadContactsPreviewOn(userId: any) {
        let contactList = new ContactList(userId);
        contactList.name = "selected Contact Lists"
        this.loadContacts(contactList, this.contactsPagination)

    }
    clearSelectedContactList() {
        const roles = this.authenticationService.getRoles();
        let isVendor = roles.indexOf(this.roleName.vendorRole) > -1 || roles.indexOf(this.roleName.vendorTierRole) > -1 || roles.indexOf(this.roleName.prmRole) > -1;
        if (this.authenticationService.isOrgAdmin() || (!this.authenticationService.isAddedByVendor && !isVendor)) {
            this.parternUserListIds = [];
            this.userListIds = [];
            this.eventCampaign.userListIds = [];
        }

        if (this.authenticationService.isOrgAdmin() || this.authenticationService.isOrgAdminPartner() || (!this.authenticationService.isAddedByVendor && !this.isVendor) || this.authenticationService.superiorRole === 'OrgAdmin & Partner') {
            this.userListDTOObj = [];
        }
    }

    clearSelectedTemplate() {
        this.eventCampaign.emailTemplate = new EmailTemplate;
        this.eventCampaign.selectedEditEmailTemplate = new EmailTemplate;
        this.emailTemplateId = 0;
        this.resetTabClass();
    }

    switchStatusChange() {
        this.contactListTabName = "Partners";
        this.clearSelectedContactList();
        this.clearSelectedTemplate();
        this.eventCampaign.channelCampaign = !this.eventCampaign.channelCampaign;
        this.contactListsPagination.channelCampaign = this.eventCampaign.channelCampaign;
        this.contactListsPagination.pageIndex = 1;
        this.contactListsPagination.filterBy = 'ALL';
        this.showContactType = true;
        if (!this.eventCampaign.channelCampaign) {
            this.eventCampaign.enableCoBrandingLogo = false;
            this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
            this.loadEmailTemplates(this.emailTemplatesPagination);
            this.eventCampaign.configurePipelines = false;
            // this.isValidPipeline = true;
        } else {
            this.emailTemplatesPagination.throughPartner = true;
            this.eventCampaign.enableCoBrandingLogo = true;
            this.eventCampaign.configurePipelines = true;
            // this.isValidPipeline = false;
            this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.EVENT_CO_BRANDING;
            this.loadEmailTemplates(this.emailTemplatesPagination);
            // this.checkSalesforceIntegration();
        }
        if (this.authenticationService.isOrgAdmin() || this.authenticationService.isOrgAdminPartner() || (!this.authenticationService.isAddedByVendor && !this.isVendor)) {
            if (!this.eventCampaign.channelCampaign) {
                this.contactListTabName = "Partners & Recipients";
                this.contactListsPagination.filterValue = false;
                this.contactListsPagination.filterKey = null;
                this.contactListMethod(this.contactListsPagination);
            } else {
                this.contactListsPagination.filterValue = true;
                this.contactListsPagination.filterKey = 'isPartnerUserList';
                this.contactListMethod(this.contactListsPagination);
            }
            this.resetTabClass();
        }
    }

    setPartnerEmailNotification(event) {
        this.eventCampaign.emailNotification = event;
        if (!event) {
            this.eventCampaign.emailOpened = false;
            this.eventCampaign.linkOpened = false;
        }
    }
    //   contactListMethod(contactListsPagination:Pagination){

    //   if(this.reDistributeEvent || this.reDistributeEventManage){
    //     this.loadRedistributionContactList(contactListsPagination)
    //   }else{
    //     this.contactService.loadContactLists(contactListsPagination)
    //     .subscribe(
    //     (data: any) => {
    //       this.contactListsPagination.totalRecords = data.totalRecords;
    //       this.contactListsPagination = this.pagerService.getPagedItems(this.contactListsPagination, data.listOfUserLists);
    //       if(this.isPreviewEvent && this.authenticationService.isOnlyPartner()){
    //         const contactsAll:any = [];
    //           this.contactListsPagination.pagedItems.forEach((element, index) => {
    //             if( element.id ===this.parternUserListIds[index]) { contactsAll.push(this.contactListsPagination.pagedItems[index]);}
    //           });
    //           this.contactListsPagination.pagedItems = contactsAll;
    //          }
    //         const contactIds = this.contactListsPagination.pagedItems.map( function( a ) { return a.id; });
    //         const items = $.grep( this.parternUserListIds, function( element ) { return $.inArray( element, contactIds ) !== -1;});
    //         if ( items.length == contactListsPagination.totalRecords || items.length == this.contactListsPagination.pagedItems.length ) {
    //             this.isHeaderCheckBoxChecked = true;
    //         } else {
    //             this.isHeaderCheckBoxChecked = false;
    //         }
    //     },
    //     (error: any) => { this.logger.error(error); },
    //     () => { this.logger.info('event campaign page contactListMethod() finished'); } );
    //     }
    //   }

    contactListMethod(contactListsPagination: Pagination) {
        if (this.reDistributeEvent || this.reDistributeEventManage) {
            this.loadRedistributionContactList(contactListsPagination)
        } else {
            if (this.contactListsPagination.filterBy == null || this.contactListsPagination.filterBy == undefined || this.contactListsPagination.filterBy.trim().length == 0) {
                this.contactListsPagination.filterBy = 'ALL'
            }
            this.campaignRecipientsLoader = true;
            this.contactService.findContactsAndPartnersForCampaign(contactListsPagination)
                .subscribe(
                    (response: any) => {
                        let data = response.data;
                        this.contactListsPagination.totalRecords = data.totalRecords;
                        if (this.contactListsPagination.totalRecords == 0) {
                            this.emptyContactListMessage = "No records found";
                        }
                        $.each(data.list, function (_index: number, list: any) {
                            list.displayTime = new Date(list.createdTimeInString);
                        });

                        this.contactListsPagination = this.pagerService.getPagedItems(this.contactListsPagination, data.list);
                        if (this.isPreviewEvent && this.authenticationService.isOnlyPartner()) {
                            const contactsAll: any = [];
                            this.contactListsPagination.pagedItems.forEach((element, index) => {
                                if (element.id === this.parternUserListIds[index]) { contactsAll.push(this.contactListsPagination.pagedItems[index]); }
                            });
                            this.contactListsPagination.pagedItems = contactsAll;
                        }
                        const contactIds = this.contactListsPagination.pagedItems.map(function (a) { return a.id; });
                        const items = $.grep(this.parternUserListIds, function (element) { return $.inArray(element, contactIds) !== -1; });
                        if (items.length == contactListsPagination.totalRecords || items.length == this.contactListsPagination.pagedItems.length) {
                            this.isHeaderCheckBoxChecked = true;
                        } else {
                            this.isHeaderCheckBoxChecked = false;
                        }
                        this.campaignRecipientsLoader = false;
                    },
                    (error: any) => { this.logger.error(error); },
                    () => { this.logger.info('event campaign page contactListMethod() finished'); });
        }
    }

    loadRedistributionContactList(contactsPagination: Pagination) {
        this.loading = true;
        this.campaignRecipientsLoader = true;
        if (this.eventCampaign.nurtureCampaign) {
            contactsPagination.editCampaign = true;
            contactsPagination.campaignId = this.eventCampaign.id;
            if (this.reDistributeEventManage) {
                contactsPagination.parentCampaignId = this.eventCampaign.parentCampaignId;
            } else {
                contactsPagination.parentCampaignId = this.eventCampaign.id;
            }
        } else {
            contactsPagination.editCampaign = false;
            if (this.reDistributeEventManage) {
                contactsPagination.parentCampaignId = this.eventCampaign.parentCampaignId;
            } else {
                contactsPagination.parentCampaignId = this.eventCampaign.id;
            }
        }
        contactsPagination.userId = this.authenticationService.getUserId();
        contactsPagination.redistributingCampaign = true;
        if (this.vanityLoginDto.vanityUrlFilter) {
            contactsPagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
            contactsPagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
        }
        this.campaignService.listCampaignUsers(contactsPagination)
            .subscribe(
                (data: any) => {
                    this.loading = false;
                    this.campaignRecipientsLoader = false;
                    this.contactListsPagination.totalRecords = data.data.totalRecords;
                    if (this.contactListsPagination.totalRecords == 0) {
                        this.emptyContactListMessage = "No records found";
                    }
                    this.contactListsPagination = this.pagerService.getPagedItems(this.contactListsPagination, data.data.list);
                    if (this.isPreviewEvent && this.authenticationService.isOnlyPartner()) {
                        const contactsAll: any = [];
                        this.contactListsPagination.pagedItems.forEach((element, index) => {
                            if (element.id === this.parternUserListIds[index]) { contactsAll.push(this.contactListsPagination.pagedItems[index]); }
                        });
                        this.contactListsPagination.pagedItems = contactsAll;
                    }
                    const contactIds = this.contactListsPagination.pagedItems.map(function (a) { return a.id; });
                    const items = $.grep(this.parternUserListIds, function (element) { return $.inArray(element, contactIds) !== -1; });
                    if (items.length == this.contactListsPagination.totalRecords || items.length == this.contactListsPagination.pagedItems.length) {
                        this.isHeaderCheckBoxChecked = true;
                    } else {
                        this.isHeaderCheckBoxChecked = false;
                    }
                    // let response = data.data;
                    // this.contactListsPagination = this.pagerService.getPagedItems(this.contactListsPagination, response.list);
                    // this.contactListsPagination.totalRecords = response.totalRecords;
                    // if(this.contactListsPagination.filterBy!=null){
                    //     if(this.contactListsPagination.filterBy==0){
                    //         this.contactListsPagination.maxResults = response.totalRecords;
                    //     }else{
                    //         this.contactListsPagination.maxResults = contactsPagination.filterBy;
                    //     }
                    // }else{
                    //   this.contactListsPagination.maxResults = response.totalRecords;
                    // }
                    // var contactIds = this.contactListsPagination.pagedItems.map(function(a) {return a.id;});
                    // var items = $.grep(this.parternUserListIds, function(element) {
                    //     return $.inArray(element, contactIds ) !== -1;
                    // });
                    // if(items.length==contactIds.length){
                    //     this.isHeaderCheckBoxChecked = true;
                    // }else{
                    //     this.isHeaderCheckBoxChecked = false;
                    // }
                },
                (error: string) =>{ this.logger.error(error);
                    this.campaignRecipientsLoader = false;
                },
                () => console.info("Finished loadContactList()", this.contactListsPagination)
            );
    }


    shareAnalytics(event: any) {
        this.eventCampaign.dataShare = event;
    }

    checkInteractiveData(text: any) {
        if (text == "true") {
            this.eventCampaign.detailedAnalyticsShared = true;
        } else {
            this.eventCampaign.detailedAnalyticsShared = false;
        }
    }

    setCoBrandingLogo(event: any) {
        this.eventCampaign.enableCoBrandingLogo = event;
        this.clearSelectedTemplate();
        if (this.eventCampaign.enableCoBrandingLogo) {
            //this.eventCampaign.enableCoBrandingLogo = true;
            this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.EVENT_CO_BRANDING;
        } else {
            //this.eventCampaign.enableCoBrandingLogo = false;
            this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
        }
        this.loadEmailTemplates(this.emailTemplatesPagination);

        //let isRegularCoBranding = this.eventCampaign.emailTemplate!=undefined && this.eventCampaign.emailTemplate.regularCoBrandingTemplate;
        //let isVideoCoBranding =  this.eventCampaign.emailTemplate!=undefined &&  this.eventCampaign.emailTemplate.videoCoBrandingTemplate;
        //this.filterCoBrandedTemplates(event);
    }

    searchEmailTemplate() {
        this.emailTemplatesPagination.pageIndex = 1;
        this.emailTemplatesPagination.searchKey = this.emailTemplateSearchInput;
        this.emailTemplatesPagination.coBrandedEmailTemplateSearch = this.eventCampaign.enableCoBrandingLogo;
        this.loadEmailTemplates(this.emailTemplatesPagination);
    }
    clearEmailTemplateSearch() {
        this.emailTemplatesPagination.pageIndex = 1;
        this.emailTemplatesPagination.searchKey = "";
        this.loadEmailTemplates(this.emailTemplatesPagination);
    }
    removeSearchInput(reply: Reply) {
        reply.emailTemplateSearchInput = "";
        this.searchReplyEmailTemplate(reply);
    }

    loadEmailTemplates(emailTemplatesPagination: Pagination) {
        //Not calling this method for only partner
        if (!this.authenticationService.isOnlyPartner()) {
            this.gridLoader = true;
            emailTemplatesPagination.throughPartner = this.eventCampaign.channelCampaign;
            this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
            if (emailTemplatesPagination.searchKey == null || emailTemplatesPagination.searchKey == "") {
                emailTemplatesPagination.campaignDefaultTemplate = true;
            } else {
                emailTemplatesPagination.campaignDefaultTemplate = false;
                emailTemplatesPagination.isEmailTemplateSearchedFromCampaign = true;
            }

            if (this.isEditCampaign) {
                if (this.eventCampaign.enableCoBrandingLogo) {
                    this.emailTemplatesPagination.throughPartner = true;
                    this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.EVENT_CO_BRANDING;
                }
                else if (this.eventCampaign.channelCampaign) {
                    this.emailTemplatesPagination.throughPartner = true;
                }
            }

            /*if(this.eventCampaign.enableCoBrandingLogo){
                emailTemplatesPagination.filterBy = null;
            }else{
                emailTemplatesPagination.filterBy = 'campaignEventEmails';
            }*/

            emailTemplatesPagination.filterBy = 'campaignEventEmails';

            emailTemplatesPagination.userId = this.loggedInUserId;
            this.emailTemplateService.listTemplates(emailTemplatesPagination, this.loggedInUserId)
                .subscribe(
                    (data: any) => {
                        let allEventEmailTemplates = data.emailTemplates;
                        this.gridLoader = false;
                        this.campaignEmailTemplates = [];
                        this.campaignEmailTemplates = allEventEmailTemplates;
                        /* for(let i=0;i< allEventEmailTemplates.length;i++){
                             if(this.eventCampaign.channelCampaign){
                                 if(allEventEmailTemplates[i].beeEventCoBrandingTemplate){
                                  this.campaignEmailTemplates.push(allEventEmailTemplates[i]);
                                 }
                              }else{
                                  this.campaignEmailTemplates = allEventEmailTemplates;
                              }
                         }*/
                        this.emailTemplatesPagination.totalRecords = data.totalRecords;
                        this.emailTemplatesPagination = this.pagerService.getPagedItems(emailTemplatesPagination, data.emailTemplates);
                        this.filterEmailTemplateForEditCampaign();
                        this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
                    },
                    (error: string) => {
                        this.logger.errorPage(error);
                    },
                    () => this.logger.info("Finished loadEmailTemplates()", this.emailTemplatesPagination)
                )
        }

    }


    setPage(event: any) {
        if (event.type === 'contacts') {
            this.contactsPagination.pageIndex = event.page;
            this.loadContacts(this.previewContactList, this.contactsPagination);
        }
        else if (event.type === 'contactlists') {
            this.contactListsPagination.pageIndex = event.page;
            this.loadContactLists(this.contactListsPagination);
        } else if (event.type === "emailTemplates") {
            this.emailTemplatesPagination.pageIndex = event.page;
            this.loadEmailTemplates(this.emailTemplatesPagination);
        }
    }

    loadPaginationDropdownTemplates(paginarion: Pagination) {
        this.loadEmailTemplates(paginarion);
    }

    paginationDropDown(pagination: Pagination) {
        if (this.paginationType === 'contacts') { this.loadContacts(this.previewContactList, pagination); }
        else if (this.paginationType === 'contactlists') { this.loadContactLists(pagination); }
    }
    changeAllDay() {
        this.eventCampaign.campaignEventTimes[0].allDay = !this.eventCampaign.campaignEventTimes[0].allDay;
        if (this.eventCampaign.campaignEventTimes[0].allDay && this.eventCampaign.campaignEventTimes[0].endTimeString) {
            this.eventCampaign.campaignEventTimes[0].endTimeString = '';
            this.eventError.eventDateError = false;
            this.eventStartTimeError();
        } else if (this.eventCampaign.campaignEventTimes[0].allDay) {
            this.endDateErrorMesg = '';
            this.eventError.eventEndDateError = false;
            this.eventStartTimeError();
        }
        else {
            this.endDateErrorMesg = 'The end date is required.';
            this.eventError.eventEndDateError = true;
        }
        this.resetTabClass();
    }
    toggleContactLists() {
        this.eventError.eventContactError = true;
        this.isPartnerUserList = !this.isPartnerUserList;
        if (this.isPartnerUserList) {
            if (this.parternUserListIds.length > 0) {
                this.userListIds = [];
                this.eventError.eventContactError = false;
            }
        }
        else {
            if (this.userListIds.length > 0) {
                this.parternUserListIds = [];
                this.eventError.eventContactError = false;
            }
        }
        this.contactListsPagination.pageIndex = 1;
        this.loadContactLists(this.contactListsPagination);
    }

    checkAllForPartners(ev: any) {
        try {
            if (ev.target.checked) {
                $('[name="campaignContact[]"]').prop('checked', true);
                let self = this;
                $('[name="campaignContact[]"]:checked').each(function (index) {
                    var id = $(this).val();
                    self.parternUserListIds.push(parseInt(id));
                    self.userListDTOObj.push(self.contactListsPagination.pagedItems[index]);
                    $('#campaignContactListTable_' + id).addClass('contact-list-selected');
                    self.eventError.eventContactError = false;
                });
                this.parternUserListIds = this.referenceService.removeDuplicates(this.parternUserListIds);
                this.userListDTOObj = this.referenceService.removeDuplicates(this.userListDTOObj);
            } else {
                $('[name="campaignContact[]"]').prop('checked', false);
                $('#user_list_tb tr').removeClass("contact-list-selected");
                if (this.contactListsPagination.maxResults == this.contactListsPagination.totalRecords) {
                    this.parternUserListIds = [];
                    this.userListIds = [];
                    $('#user_list_tb tr').removeClass("contact-list-selected");
                } else {
                    let currentPageContactIds = this.contactListsPagination.pagedItems.map(function (a) { return a.id; });
                    this.parternUserListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.parternUserListIds, currentPageContactIds);
                    this.userListDTOObj = this.referenceService.removeDuplicatesFromTwoArrays(this.userListDTOObj, this.contactListsPagination.pagedItems);
                }
                if (this.parternUserListIds.length === 0) { this.eventError.eventContactError = true; }
            }
            this.getValidUsersCount();
            ev.stopPropagation();
            this.resetTabClass();
        } catch (error) {
            console.error(error, "editContactComponent", "checkingAllContacts()");
        }
    }

    partnerHighlightRow(contactList: any) {
        let contactListId = contactList.id;
        const isChecked = $('#' + contactListId).is(':checked');
        if (isChecked) {
            if (!this.parternUserListIds.includes(contactListId)) {
                this.parternUserListIds.push(contactListId);
                if (this.parternUserListIds.length > 0) {
                    this.eventError.eventContactError = false;
                } else { this.eventError.eventContactError = true; }
                this.userListIds = [];
                $('#campaignContactListTable_' + contactListId).addClass('contact-list-selected');
                this.userListDTOObj.push(contactList);
            }
            $('#' + contactListId).parent().closest('tr').addClass('contact-list-selected');
        } else {
            this.parternUserListIds.splice($.inArray(contactListId, this.parternUserListIds), 1);
            $('#' + contactListId).parent().closest('tr').removeClass('contact-list-selected');
            $('#campaignContactListTable_' + contactListId).removeClass('contact-list-selected');
            if (this.parternUserListIds.length > 0) {
                this.eventError.eventContactError = false;
            } else { this.eventError.eventContactError = true; }
            this.userListDTOObj = this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactListId);
        }

        if (this.parternUserListIds.length == this.contactListsPagination.pagedItems.length) {
            this.isHeaderCheckBoxChecked = true;
        } else {
            this.isHeaderCheckBoxChecked = false;
        }
        this.getValidUsersCount();
        event.stopPropagation();
    }

    highlightPartnerContactRow(contactList: any, event: any, count: number, isValid: boolean) {
        let contactId = contactList.id;
        if (isValid) {
            if (count > 0) {
                let isChecked = $('#' + contactId).is(':checked');
                if (isChecked) {
                    //Removing Highlighted Row
                    $('#' + contactId).prop("checked", false);
                    $('#campaignContactListTable_' + contactId).removeClass('contact-list-selected');
                    this.parternUserListIds.splice($.inArray(contactId, this.parternUserListIds), 1);
                    if (this.parternUserListIds.length > 0) {
                        this.eventError.eventContactError = false;
                    } else { this.eventError.eventContactError = true; }
                    this.userListDTOObj = this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
                } else {
                    //Highlighting Row
                    $('#' + contactId).prop("checked", true);
                    $('#campaignContactListTable_' + contactId).addClass('contact-list-selected');
                    this.parternUserListIds.push(contactId);
                    if (this.parternUserListIds.length === 0) {
                        this.eventError.eventContactError = true;
                    } else { this.eventError.eventContactError = false; }
                    this.userListDTOObj.push(contactList);
                }
                // this.contactsUtility();
                if (this.parternUserListIds.length == this.contactListsPagination.pagedItems.length) {
                    this.isHeaderCheckBoxChecked = true;
                } else {
                    this.isHeaderCheckBoxChecked = false;
                }
                event.stopPropagation();
            } else {
                // this.emptyContactsMessage = "Contacts are in progress";
            }
            this.resetTabClass();
            this.getValidUsersCount();
            event.stopPropagation();
        }

    }
    closeModal() {
        this.paginationType = 'contactlists';
        this.contactsPagination = new Pagination();
    }

    validForm(eventCampaign: any) {
        if (!this.eventError.eventStartTimeError && !this.eventError.eventSameDateError && !this.eventError.eventEndDateError && !this.eventError.eventTitleError && !this.eventError.eventDateError && !this.eventError.eventHostByError
            && !this.eventError.eventLocationError && eventCampaign.campaign && eventCampaign.campaignEventTimes[0].startTimeString &&
            eventCampaign.campaignEventTimes[0].country != "Select Country" && this.errorLength === 0 &&
            this.isFormSubmitted && eventCampaign.userListIds.length > 0) { return true; }
        else { return false; }
    }
    scheduleTimeError() {
        const startDate = Date.parse(this.eventCampaign.campaignEventTimes[0].startTimeString);
        const currentDate = new Date().getTime();
        const scheduleTime = Date.parse(this.eventCampaign.launchTimeInString);
        if (scheduleTime > currentDate && scheduleTime > startDate) {
            this.setScheduleErrorMesg(true, 'Your launch time must be before the event start date and time.');
        }
        else if (scheduleTime === startDate) { this.setScheduleErrorMesg(true, 'Your launch time must be before the event start date and time.'); }
        else if (scheduleTime < currentDate) { this.setScheduleErrorMesg(true, 'Please choose a different launch time.'); }
        else if (!this.eventCampaign.launchTimeInString) { this.setScheduleErrorMesg(true, 'Schedule time is required'); }
        else { this.setScheduleErrorMesg(false, ''); }
    }
    setScheduleErrorMesg(event: boolean, mesg: string) { this.eventError.scheduleTimeError = event; this.scheduleCampaignError = mesg; }
    setScheduleEvent() {
        this.isSelectedSchedule = !this.isSelectedSchedule;
        this.checkLaunchOption = 'SCHEDULE';
        this.scheduleTimeError();
        if (this.isSelectedSchedule) {
            this.selectedLaunchOption = 'SCHEDULE';
            this.timezones = this.referenceService.getTimeZonesByCountryId(this.eventCampaign.countryId);
        }
    }
    setLaunchOptions(options: any) {
        this.checkLaunchOption = options;
        if (this.checkLaunchOption == 'SCHEDULE') { this.setScheduleEvent(); }
    }
    scheduleCampaign() {
        this.scheduleTimeError();
        this.referenceService.campaignSuccessMessage = "SCHEDULE";
        if (!this.eventError.scheduleTimeError && this.eventCampaign.countryId) {
            this.createEventCampaign(this.eventCampaign, 'SCHEDULE');
        }

    }
    getCampaignData(eventCampaign: any) {
        if (this.authenticationService.isOnlyPartner()) { eventCampaign.channelCampaign = false; }
        eventCampaign.user.userId = this.loggedInUserId;
        if (this.router.url.includes('campaigns/re-distribute')) {
        } else {
            if (this.authenticationService.module.hasFormAccess) {
                this.selectedFormData = this.previewPopUpComponent.selectedFormData;
                this.eventCampaign.forms = this.previewPopUpComponent.selectedFormData;
            }
        }
        if (this.eventCampaign.campaignReplies && this.eventCampaign.campaignReplies.length > 0) {
            this.getRepliesData();
        }

        if (eventCampaign.userListIds != undefined) {
            for (let userListId of eventCampaign.userListIds) {
                let contactList = new ContactList(userListId);
                eventCampaign.userLists.push(contactList);
            }
        }
        let timeZoneId = "";
        if (eventCampaign.campaignScheduleType === "NOW" || eventCampaign.campaignScheduleType === "SAVE") {
            //  eventCampaign.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            let intlTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (intlTimeZone != undefined) {
                timeZoneId = intlTimeZone;
            } else if (moment.tz.guess() != undefined) {
                timeZoneId = moment.tz.guess();
            }
            eventCampaign.launchTimeInString = null;
            eventCampaign.timeZone = timeZoneId;
            //  eventCampaign.campaignEventTimes[0].timeZone = timeZoneId;
            if (!this.timeZoneSetValue) { this.timeZoneSetValue = this.setEventTimeZone(); }
            eventCampaign.campaignEventTimes[0].timeZone = this.timeZoneSetValue;
        } else {
            const eventTimeZoneId = $('#timezoneId option:selected').val();
            if (!this.timeZoneSetValue) { this.timeZoneSetValue = this.setEventTimeZone(); }
            //  eventCampaign.timeZone = this.timeZoneSetValue;
            //  if(!timeZoneId) { eventCampaign.timeZone = this.timeZoneSetValue; }
            this.eventCampaign.campaignEventTimes[0].timeZone = this.timeZoneSetValue;
            eventCampaign.timeZone = eventTimeZoneId;
        }
        eventCampaign.campaign = this.referenceService.replaceMultipleSpacesWithSingleSpace(eventCampaign.campaign);
        eventCampaign.fromName = this.referenceService.replaceMultipleSpacesWithSingleSpace(eventCampaign.fromName);


        eventCampaign.campaignEventTimes[0].country = this.countries.find(x => x.id == eventCampaign.campaignEventTimes[0].countryId).name;
        eventCampaign.country = this.countries.find(x => x.id == eventCampaign.countryId).name;
        eventCampaign.toPartner = !eventCampaign.channelCampaign;

        this.socialStatusList = [];
        this.socialStatusProviders.forEach(data => {
            if (data.selected) {
                let socialStatus = new SocialStatus();
                socialStatus.socialStatusProvider = data;
                if (socialStatus.socialStatusProvider.socialConnection.source.toLowerCase() === 'twitter') {
                    var statusMsg = this.statusMessage;
                    var length = 200;
                    var trimmedstatusMsg = statusMsg.length > length ? statusMsg.substring(0, length - 3) + "..." : statusMsg;
                    socialStatus.statusMessage = trimmedstatusMsg;
                } else {
                    socialStatus.statusMessage = this.statusMessage;
                }
                this.socialStatusList.push(socialStatus);
            }
        }
        )

        if (eventCampaign.id) {
            let vanityUrlDomainName = "";
            let vanityUrlCampaign = false;
            /********Vanity Url Related Code******************** */
            if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
                vanityUrlDomainName = this.authenticationService.companyProfileName;
                vanityUrlCampaign = true;
            }

            const customEventCampaign = {
                'id': eventCampaign.id,
                'campaign': this.referenceService.replaceMultipleSpacesWithSingleSpace(this.eventCampaign.campaign),
                'categoryId': eventCampaign.categoryId,
                'user': eventCampaign.user,
                'message': eventCampaign.message,
                'subjectLine': eventCampaign.subjectLine,
                'updateMessage': eventCampaign.updateMessage,
                'channelCampaign': eventCampaign.channelCampaign,
                'emailNotification': true,
                'linkOpened': eventCampaign.linkOpened,
                'enableCoBrandingLogo': eventCampaign.enableCoBrandingLogo,
                'countryId': eventCampaign.countryId,
                'email': eventCampaign.email,
                'emailOpened': eventCampaign.emailOpened,
                'socialSharingIcons': eventCampaign.socialSharingIcons,
                'fromName': this.referenceService.replaceMultipleSpacesWithSingleSpace(eventCampaign.fromName),
                'launchTimeInString': eventCampaign.launchTimeInString,
                'emailTemplate': eventCampaign.emailTemplate,
                'timeZone': eventCampaign.timeZone,
                'campaignScheduleType': eventCampaign.campaignScheduleType,
                'campaignLocation': eventCampaign.campaignLocation,
                'campaignEventMedias': [{ "filePath": eventCampaign.campaignEventMedias[0].filePath }],
                'campaignEventTimes': eventCampaign.campaignEventTimes,
                'country': eventCampaign.country,
                'publicEventCampaign': eventCampaign.publicEventCampaign,
                'toPartner': eventCampaign.toPartner,
                'inviteOthers': eventCampaign.inviteOthers,
                'rsvpReceived': eventCampaign.rsvpReceived,
                'onlineMeeting': eventCampaign.onlineMeeting,
                'dataShare': eventCampaign.dataShare,
                'detailedAnalyticsShared': eventCampaign.detailedAnalyticsShared,
                'userLists': eventCampaign.userLists,
                'userListIds': eventCampaign.userListIds,
                'campaignReplies': eventCampaign.campaignReplies,
                'smsService': this.smsService,
                'smsText': this.smsText,
                'socialStatusList': this.socialStatusList,
                'forms': this.selectedFormData,
                'pushToCRM': eventCampaign.pushToCRM,
                'vanityUrlDomainName': vanityUrlDomainName,
                'vanityUrlCampaign': vanityUrlCampaign,
                'endDateString': eventCampaign.endDateString,
                "clientTimeZone": eventCampaign.clientTimeZone,
                'configurePipelines': eventCampaign.configurePipelines
            }
            eventCampaign = customEventCampaign;
        }
        return eventCampaign;
    }

    createEventCampaign(eventCampaign: any, launchOption: string) {
        // this.eventCampaign.forms = this.previewPopUpComponent.selectedFormData;
        this.referenceService.loading(this.httpRequestLoader, true);
        this.loader = true;
        this.isFormSubmitted = true;
        this.socialStatusList = [];
        this.socialStatusProviders.forEach(data => {
            if (data.selected) {
                let socialStatus = new SocialStatus();
                socialStatus.socialStatusProvider = data;
                if (socialStatus.socialStatusProvider.socialConnection.source.toLowerCase() === 'twitter') {
                    var statusMsg = this.statusMessage;
                    var length = 200;
                    if (statusMsg) {
                        var trimmedstatusMsg = statusMsg.length > length ? statusMsg.substring(0, length - 3) + "..." : statusMsg;
                        socialStatus.statusMessage = trimmedstatusMsg;
                    }
                } else {
                    socialStatus.statusMessage = this.statusMessage;
                }
                this.socialStatusList.push(socialStatus);
            }
        }
        )

        eventCampaign.socialStatusList = this.socialStatusList;

        eventCampaign.userListIds = this.parternUserListIds;
        if (this.eventCampaign.campaignLocation.country === "Select Country") {
            this.eventCampaign.campaignLocation.country = "";
        }
        this.onBlurValidation();
        eventCampaign.campaignScheduleType = launchOption;
        eventCampaign.smsService = this.smsService;
        eventCampaign.smsText = this.smsText;
        eventCampaign = this.getCampaignData(eventCampaign)
        if ((this.isEditCampaign || this.reDistributeEventManage) && !eventCampaign.onlineMeeting && !eventCampaign.campaignLocation.id) { }
        else { eventCampaign.campaignLocation.id = null; }
        eventCampaign.campaignEventTimes[0].id = null;
        eventCampaign.campaignEventMedias[0].id = null;
        //eventCampaign.user.id = null;

        for (let i = 0; i < eventCampaign.campaignReplies.length; i++) {
            eventCampaign.campaignReplies[i].id = null;
        }

        if (this.reDistributeEvent || this.reDistributeEventManage) {
            if (this.reDistributeEvent) {
                eventCampaign.parentCampaignId = this.activatedRoute.snapshot.params['id'];
                eventCampaign.id = null;
            }
            if (this.reDistributeEventManage) {
                eventCampaign.parentCampaignId = this.parentCampaignIdValue;
            }

            eventCampaign.enableCoBrandingLogo = eventCampaign.enableCoBrandingLogo;
            eventCampaign.nurtureCampaign = true;
            eventCampaign.selectedEditEmailTemplate = eventCampaign.emailTemplate.id;
            eventCampaign.channelCampaign = false;
            eventCampaign.toPartner = false;

        }

        delete eventCampaign.emailTemplateDTO;
        delete eventCampaign.userDTO
        delete eventCampaign.userListDTOs
        eventCampaign.clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (eventCampaign.campaignScheduleType === "NOW" || eventCampaign.campaignScheduleType === "SAVE") { eventCampaign.launchTimeInString = this.campaignService.setLaunchTime(); }
        if (this.validForm(eventCampaign) && this.isFormSubmitted) {
            this.referenceService.startLoader(this.httpRequestLoader);
            this.campaignService.createEventCampaign(eventCampaign, this.isEventUpdate)
                .subscribe(
                    response => {
                        if (!response.access) {
                            this.authenticationService.forceToLogout();
                        }
                        if (response.statusCode === 2000) {
                            this.referenceService.goToTop();
                            this.isLaunched = true;
                            this.referenceService.stopLoader(this.httpRequestLoader);
                            this.router.navigate(["/home/campaigns/manage"]);
                            this.referenceService.campaignSuccessMessage = launchOption;
                            if (this.isEventUpdate) { this.referenceService.campaignSuccessMessage = "UPDATE"; }
                        } else {

                            if (response.statusCode === 1999) {
                                this.customResponse = new CustomResponse('ERROR', response.message, true);
                            }

                            this.loader = false;
                            this.referenceService.stopLoader(this.httpRequestLoader);
                            if (response.statusCode === 2016) {
                                this.customResponse = new CustomResponse('ERROR', response.errorResponses[0].message, true);
                            }
                            else if (response.statusCode === 7000) {
                                if (response.errorResponses[0].field == 'campaign' && response.errorResponses[0].message == 'Already Exists') {
                                    this.customResponse = new CustomResponse('ERROR', 'Campaign name is already exists.', true);
                                }
                                else if (response.errorResponses[0].field == "eventStartTimeString") {
                                    this.customResponse = new CustomResponse('ERROR', 'Please change the start time, its already over.', true);
                                }
                                else if (response.errorResponses[0].field == "scheduleTime") {
                                    this.customResponse = new CustomResponse('ERROR', 'Please change the schedule time, it should be before the event start time.', true);
                                }
                                else {
                                    this.customResponse = new CustomResponse('ERROR', response.errorResponses[0].message, true);
                                }
                                this.referenceService.goToTop();
                            }
                        }
                    },
                    (error: any) => { this.loader = false; console.log(error); },
                    () => console.log("Campaign Names Loaded"));
        } else {
            this.referenceService.goToTop();
            this.showErrorMessage = true;
            this.loader = false;
            if (eventCampaign.campaignEventTimes[0].country == "Select Country") {
                // this.customResponse = new CustomResponse( 'ERROR', 'Please select the valid country', true );
            } else {
                this.customResponse = new CustomResponse('ERROR', 'Please complete the * required fields', true);
            }
            this.referenceService.goToTop();
        }
    }

    listAllTeamMemberEmailIds() {
        this.campaignService.getAllTeamMemberEmailIds(this.loggedInUserId)
            .subscribe(
                data => {
                    const self = this;
                    $.each(data, function (index, value) {
                        self.teamMemberEmailIds.push(data[index]);
                    });
                    const teamMember = this.teamMemberEmailIds.filter((teamMember) => teamMember.id === this.loggedInUserId)[0];
                    this.eventCampaign.email = teamMember.emailId;
                    this.eventCampaign.fromName = $.trim(teamMember.firstName + " " + teamMember.lastName);
                    this.eventCampaign.hostedBy = this.eventCampaign.fromName + " [" + this.eventCampaign.email + "]";
                    this.setEmailIdAsFromName();
                },
                error => console.log(error),
                () => {
                    console.log("Campaign Names Loaded");
                    this.setFromName();
                }
            );
    }

    setEmailIdAsFromName() {
        if (this.eventCampaign.fromName.length === 0) {
            this.eventCampaign.fromName = this.eventCampaign.email;
        }
    }

    setFromName() {
        if (!this.reDistributeEvent) {
            const user = this.teamMemberEmailIds.filter((teamMember) => teamMember.emailId === this.eventCampaign.email)[0];
            this.eventCampaign.fromName = $.trim(user.firstName + " " + user.lastName);
            this.setEmailIdAsFromName();
            this.eventHostByError();
        }

    }

    fileChange(event: any) {
        let file: File;
        if (event.target.files) { file = event.target.files[0]; }
        else if (event.dataTransfer.files) { file = event.dataTransfer.files[0]; }
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        this.campaignService.uploadEventCampaignMedia(this.loggedInUserId, formData)
            .subscribe(
                data => {
                    this.eventCampaign.campaignEventMedias[0].filePath = data.data;
                },
                error => console.log(error),
                () => console.log('Finished')
            );
    }

    resetcampaignEventMedia() {
        this.eventCampaign.campaignEventMedias[0] = new CampaignEventMedia();
    }
    paginateEmailTemplateRows(pageIndex: number, reply: Reply) {
        reply.emailTemplatesPagination.pageIndex = pageIndex;
        this.loadEmailTemplatesForAddReply(reply);
    }
    filterReplyTemplates(type: string, index: number, reply: Reply) {
        if (type == "BASIC") {
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.BASIC;
        } else if (type == "RICH") {
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.RICH;
        } else if (type == "UPLOADED") {
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.UPLOADED;
        } else if (type == "NONE") {
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
        }
        else if (type == "PARTNER") {
            reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.PARTNER;
        }
        reply.selectedEmailTemplateTypeIndex = index;
        reply.emailTemplatesPagination.pageIndex = 1;
        this.loadEmailTemplatesForAddReply(reply);
    }
    eventReplyHandler(event: any, reply: Reply) 
    { 
        if (event.keyCode === 13) 
        { 
            this.searchReplyEmailTemplate(reply); 
        }
    }
    searchReplyEmailTemplate(reply: Reply) {
        reply.emailTemplatesPagination.pageIndex = 1;
        reply.emailTemplatesPagination.searchKey = reply.emailTemplateSearchInput;
        this.loadEmailTemplatesForAddReply(reply);
    }
    addReplyRows() {
        this.reply = new Reply();
        let length = this.allItems.length;
        length = length + 1;
        const id = 'reply-' + length;
        this.reply.divId = id;
        this.reply.actionId = 0;
        this.reply.subject = this.referenceService.replaceMultipleSpacesWithSingleSpace(this.eventCampaign.subjectLine);

        this.eventCampaign.campaignReplies.push(this.reply);
        this.allItems.push(id);
        this.loadEmailTemplatesForAddReply(this.reply);
    }

    loadEmailTemplatesForAddReply(reply: Reply) {
        if (!this.eventCampaign.nurtureCampaign) {
            this.campaignEmailTemplate.httpRequestLoader.isHorizontalCss = true;
            this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
            reply.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
            if (reply.emailTemplatesPagination.searchKey == null || reply.emailTemplatesPagination.searchKey == "") {
                reply.emailTemplatesPagination.campaignDefaultTemplate = true;
            } else {
                reply.emailTemplatesPagination.campaignDefaultTemplate = false;
                reply.emailTemplatesPagination.isEmailTemplateSearchedFromCampaign = true;
            }
            reply.emailTemplatesPagination.maxResults = 12;
            this.emailTemplateService.listTemplates(reply.emailTemplatesPagination, this.loggedInUserId)
                .subscribe(
                    (data: any) => {
                        reply.emailTemplatesPagination.totalRecords = data.totalRecords;
                        reply.emailTemplatesPagination = this.pagerService.getPagedItems(reply.emailTemplatesPagination, data.emailTemplates);
                        this.filterReplyrEmailTemplateForEditCampaign(reply);
                        this.filterEmailTemplateForEditCampaign();
                        this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
                    },
                    (error: string) => {
                        this.logger.errorPage(error);
                    },
                    () => this.logger.info("Finished loadEmailTemplatesForAddReply()", reply.emailTemplatesPagination)
                )
        }
    }

    filterEmailTemplateForEditCampaign() {
        this.filteredEmailTemplateIds = this.emailTemplatesPagination.pagedItems.map(function (a) { return a.id; });
        if (this.filteredEmailTemplateIds.indexOf(this.emailTemplateId) > -1) {
            this.showSelectedEmailTemplate = true;
        } else {
            this.showSelectedEmailTemplate = false;
        }
    }

    filterReplyrEmailTemplateForEditCampaign(reply: Reply) {
        if (reply.emailTemplatesPagination.emailTemplateType == 0 && reply.emailTemplatesPagination.searchKey == null) {
            if (reply.emailTemplatesPagination.pageIndex == 1) {
                reply.showSelectedEmailTemplate = true;
            } else {
                reply.showSelectedEmailTemplate = false;
            }
        } else {
            const emailTemplateIds = reply.emailTemplatesPagination.pagedItems.map(function (a) { return a.id; });
            if (emailTemplateIds.indexOf(reply.selectedEmailTemplateIdForEdit) > -1) {
                reply.showSelectedEmailTemplate = true;
            } else {
                reply.showSelectedEmailTemplate = false;
            }
        }
    }

    remove(divId: string, type: string) {
        if (type === "replies") {
            this.eventCampaign.campaignReplies = this.spliceArray(this.eventCampaign.campaignReplies, divId);
        }
        $('#' + divId).remove();
        const index = divId.split('-')[1];
        const editorName = 'editor' + index;
        this.errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
        if (this.errorLength === 0) { this.dataError = false; }
    }

    spliceArray(arr: any, id: string) {
        arr = $.grep(arr, function (data, index) {
            return data.divId !== id
        });
        return arr;
    }

    setReplyEmailTemplate(emailTemplateId: number, reply: Reply, index: number, isDraft: boolean) {
        if (!isDraft) {
            reply.selectedEmailTemplateId = emailTemplateId;
            $('#reply-' + index + emailTemplateId).prop("checked", true);
        }
    }
    selectReplyEmailBody(event: any, index: number, reply: Reply) {
        reply.defaultTemplate = event;
    }

    getTemplateById(emailTemplate: EmailTemplate) {
        this.emailTemplateService.getById(emailTemplate.id)
            .subscribe(
                (data: any) => {
                    emailTemplate.body = data.body;
                    this.getEmailTemplatePreview(emailTemplate);
                },
                error => console.error(error),
                () => {
                    console.log('loadContacts() finished');
                }
            );
    }

    getEmailTemplatePreview(emailTemplate: EmailTemplate) {
        let body = emailTemplate.body;
        let emailTemplateName = emailTemplate.name;
        if (emailTemplateName.length > 50) {
            emailTemplateName = emailTemplateName.substring(0, 50) + "...";
        }
        $("#htmlContent").empty();
        $("#email-template-title").empty();
        $("#email-template-title").append(emailTemplateName);
        $('#email-template-title').prop('title', emailTemplate.name);
        let updatedBody = emailTemplate.body.replace("<div id=\"video-tag\">", "<div id=\"video-tag\" style=\"display:none\">");
        let data = {};
        data['emailId'] = this.authenticationService.userProfile.emailId;
        this.referenceService.getMyMergeTagsInfoByEmailId(data).subscribe(
            response => {
                if (response.statusCode == 200) {
                    if (this.eventCampaign.nurtureCampaign || this.reDistributeEvent) {
                        updatedBody = updatedBody.replace(this.senderMergeTag.aboutUsGlobal, response.data.aboutUs);
                    }
                    if (!this.eventCampaign.channelCampaign && !this.eventCampaign.nurtureCampaign) {
                        updatedBody = updatedBody.replace(this.senderMergeTag.aboutUsGlobal, "");
                    }
                    this.showPreviewBody(updatedBody);
                }
            },
            error => {
                this.showPreviewBody(updatedBody);
            }
        );
    }

    showPreviewBody(updatedBody: string) {
        $("#htmlContent").append(updatedBody);
        $('.modal .modal-body').css('overflow-y', 'auto');
        $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
        $("#show_email_template_preivew").modal('show');
    }

    previewEventCampaignEmailTemplate(emailTemplateId: number) {
        //this.eventCampaign.campaignEventMedias[0].filePath = this.eventCampaign.campaignEventMedias[0].filePath===undefined?null:this.eventCampaign.campaignEventMedias[0].filePath;
        this.emailTemplateService.getById(emailTemplateId)
            .subscribe(
                (data: any) => {

                    let dateFormat = require('dateformat');
                    if (this.eventCampaign.campaign) {
                        data.body = data.body.replace("{{event_title}}", this.eventCampaign.campaign);
                    }
                    if (this.eventCampaign.campaignEventTimes[0].startTimeString) {
                        let date1 = new Date(this.eventCampaign.campaignEventTimes[0].startTimeString);
                        date1 = dateFormat(date1, "dddd, mmmm dS, yyyy, h:MM TT");
                        if (!this.eventCampaign.campaignEventTimes[0].allDay) {
                            data.body = data.body.replace("{{event_start_time}}", date1);
                            data.body = data.body.replace("&lt;To&gt;", 'To');
                            data.body = data.body.replace("{{To}}", 'To');
                        } else {
                            data.body = data.body.replace("{{event_start_time}}", date1 + " " + '(All Day)');
                            data.body = data.body.replace("{{event_end_time}}", " ");
                        }
                    }

                    if (this.eventCampaign.campaignEventTimes[0].endTimeString) {
                        let date2 = new Date(this.eventCampaign.campaignEventTimes[0].endTimeString);
                        date2 = dateFormat(date2, "dddd, mmmm dS, yyyy, h:MM TT");

                        data.body = data.body.replace("{{event_end_time}}", date2);
                    }
                    else if (this.eventCampaign.campaignEventTimes[0].allDay) {
                        data.body = data.body.replace("&lt;To&gt;", ' ');
                        data.body = data.body.replace("{{To}}", ' ');
                    }

                    if (this.eventCampaign.message) {
                        data.body = data.body.replace("{{event_description}}", this.eventCampaign.message);
                    }
                    if (!this.eventCampaign.onlineMeeting) {

                        if (this.eventCampaign.campaignLocation.street === undefined) {
                            this.eventCampaign.campaignLocation.street = "";
                        }

                        if (this.eventCampaign.campaignLocation.address2 === undefined) {
                            this.eventCampaign.campaignLocation.address2 = "";
                        }

                        if (this.eventCampaign.campaignLocation.city === undefined) {
                            this.eventCampaign.campaignLocation.city = "";
                        }

                        if (this.eventCampaign.campaignLocation.state === undefined) {
                            this.eventCampaign.campaignLocation.state = "";
                        }

                        if (this.eventCampaign.campaignLocation.zip === undefined) {
                            this.eventCampaign.campaignLocation.zip = "";
                        }

                        if (this.eventCampaign.campaignLocation.location) {
                            let address1 = this.eventCampaign.campaignLocation.location;
                            let address2 = "";
                            let address3 = "";
                            let address4 = "";
                            let fullAddress = "";
                            if (this.eventCampaign.campaignLocation.street && this.eventCampaign.campaignLocation.address2) {
                                address2 = this.eventCampaign.campaignLocation.street + "<br>" + this.eventCampaign.campaignLocation.address2;
                            } else if (this.eventCampaign.campaignLocation.street) {
                                address2 = this.eventCampaign.campaignLocation.street;
                            } else if (this.eventCampaign.campaignLocation.address2) {
                                address2 = this.eventCampaign.campaignLocation.address2;
                            } else {
                                address2 = ""
                            }

                            if (this.eventCampaign.campaignLocation.state && this.eventCampaign.campaignLocation.city) {
                                address3 = this.eventCampaign.campaignLocation.city + ", " + this.eventCampaign.campaignLocation.state;
                            } else if (this.eventCampaign.campaignLocation.state) {
                                address3 = this.eventCampaign.campaignLocation.state;
                            } else if (this.eventCampaign.campaignLocation.city) {
                                address3 = this.eventCampaign.campaignLocation.city;
                            } else {
                                address3 = ""
                            }

                            if (this.eventCampaign.campaignLocation.country && this.eventCampaign.campaignLocation.zip) {
                                address4 = this.eventCampaign.campaignLocation.zip + " " + this.eventCampaign.campaignLocation.country;
                            } else if (this.eventCampaign.campaignLocation.country) {
                                address4 = this.eventCampaign.campaignLocation.country;
                            } else if (this.eventCampaign.campaignLocation.zip) {
                                address4 = this.eventCampaign.campaignLocation.zip;
                            } else {
                                address4 = ""
                            }

                            if (address2 && address3 && address4) {
                                fullAddress = address1 + "<br>" + address2 + "<br>" + address3 + "<br>" + address4;
                            } else if (address2 && !address3 && !address4) {
                                fullAddress = address1 + "<br>" + address2;
                            } else if (address2 && address3 && !address4) {
                                fullAddress = address1 + "<br>" + address2 + "<br>" + address3;
                            } else if (!address2 && address3 && address4) {
                                fullAddress = address1 + "<br>" + address3 + "<br>" + address4;
                            } else if (!address2 && address3 && !address4) {
                                fullAddress = address1 + "<br>" + address3;
                            } else if (!address2 && !address3 && address4) {
                                fullAddress = address1 + "<br>" + address4;
                            } else if (address2 && !address3 && address4) {
                                fullAddress = address1 + "<br>" + address2 + "<br>" + address4;
                            } else {
                                fullAddress = address1;
                            }
                            data.body = data.body.replace(/{{event_address}}/g, fullAddress);
                        }
                    } else {
                        data.body = data.body.replace(/{{event_address}}/g, "Online Meeting")
                        data.body = data.body.replace(/{{event_address}}/g, " ")
                    }
                    if (this.eventCampaign.fromName) {
                        data.body = data.body.replace("{{event_fromName}}", this.eventCampaign.fromName);
                    }
                    if (this.eventCampaign.email) {
                        data.body = data.body.replace("{{event_emailId}}", this.eventCampaign.email);
                    }

                    if (!this.reDistributeEvent && !this.isPreviewEvent) {
                        if (this.eventCampaign.email) {
                            data.body = data.body.replace("{{vendor_name}}", this.authenticationService.user.firstName + " " + this.authenticationService.user.lastName);
                        }
                        if (this.eventCampaign.email) {
                            data.body = data.body.replace("VENDOR_TITLE", this.authenticationService.user.jobTitle);
                        }
                        if (this.eventCampaign.email) {
                            data.body = data.body.replace("{{vendor_emailId}}", this.authenticationService.user.emailId);
                        }
                    } else {
                        data.body = data.body.replace("{{vendor_name}}", this.eventCampaign.userDTO.firstName + " " + this.eventCampaign.userDTO.lastName);
                        data.body = data.body.replace("{{vendor_emailId}}", this.eventCampaign.userDTO.emailId);
                    }
                    if (!this.eventCampaign.enableCoBrandingLogo) {
                        data.body = data.body.replace("https://xamp.io/vod/images/co-branding.png", "https://aravindu.com/vod/images/emptyImg.png");
                    }

                    if (this.eventCampaign.campaignEventMedias[0].filePath) {
                        data.body = data.body.replace("https://xamplify.s3.amazonaws.com/images/bee-259/rocket-color.png", this.eventCampaign.campaignEventMedias[0].filePath);
                    } else {
                        data.body = data.body.replace("https://xamplify.s3.amazonaws.com/images/bee-259/rocket-color.png", "https://xamplify.s3.amazonaws.com/images/bee-259/rocket-color.png");
                    }

                    if (this.eventCampaign.campaignLocation.location) {
                        data.body = data.body.replace("LOCATION_MAP_URL", "https://maps.google.com/maps?q=" + this.eventCampaign.campaignLocation.location + "," + this.eventCampaign.campaignLocation.street + "," + this.eventCampaign.campaignLocation.city + "," + this.eventCampaign.campaignLocation.state + "," + this.eventCampaign.campaignLocation.zip + "&z=15&output=embed");
                    } else {
                        data.body = data.body.replace("LOCATION_MAP_URL", "https://maps.google.com/maps?q=42840 Christy Street, uite 100 Fremont, US CA 94538&z=15&output=embed");
                    }

                    if (this.eventCampaign.email) {
                        data.body = data.body.replace("https://aravindu.com/vod/images/us_location.png", " ");
                    }
                    data.body = data.body.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage);
                    this.getEmailTemplatePreview(data);
                },
                (error: string) => {
                    this.logger.errorPage(error);
                },
                () => this.logger.info("Finished previewEventCampaignEmailTemplate()", emailTemplateId)
            )

    }
    onChangeCountryCampaignEventTime(countryId: number) {
        this.timezonesCampaignEventTime = this.referenceService.getTimeZonesByCountryId(countryId);
        /* for ( let i = 0; i < this.countries.length; i++ ) {
           if ( countryId == this.countries[i].id ) {
               this.eventCampaign.campaignLocation.country = this.countries[i].name; break;
               }
         }*/
        setTimeout(() => { this.setEventTimeZone(); }, 100);
        this.resetTabClass();
    }
    onChangeCountry(countryId: number) {
        this.timezones = this.referenceService.getTimeZonesByCountryId(countryId);
    }
    getCampaignReplies(campaign: EventCampaign) {
        if (campaign.campaignReplies != undefined) {
            this.eventCampaign.campaignReplies = campaign.campaignReplies;
            for (var i = 0; i < this.eventCampaign.campaignReplies.length; i++) {
                let reply = this.eventCampaign.campaignReplies[i];
                if (reply.defaultTemplate) {
                    reply.selectedEmailTemplateIdForEdit = reply.selectedEmailTemplateId;
                }
                reply.emailTemplatesPagination = new Pagination();
                reply.replyTime = this.campaignService.setHoursAndMinutesToAutoReponseReplyTimes(reply.replyTimeInHoursAndMinutes);
                if ($.trim(reply.subject).length == 0) {
                    //   reply.subject = campaign.subjectLine;
                }
                let length = this.allItems.length;
                length = length + 1;
                var id = 'reply-' + length;
                reply.divId = id;
                this.allItems.push(id);
                this.loadEmailTemplatesForAddReply(reply);
            }
        }

    }

    getRepliesData() {
        for (let i = 0; i < this.eventCampaign.campaignReplies.length; i++) {
            const reply = this.eventCampaign.campaignReplies[i];
            $('#' + reply.divId).removeClass('portlet light dashboard-stat2 border-error');
            this.removeStyleAttrByDivId('reply-days-' + reply.divId);
            this.removeStyleAttrByDivId('message-' + reply.divId);
            this.removeStyleAttrByDivId('reply-subject-' + reply.divId);
            this.removeStyleAttrByDivId('email-template-' + reply.divId);
            this.removeStyleAttrByDivId('reply-message-' + reply.divId);
            $('#' + reply.divId).addClass('portlet light dashboard-stat2');
            this.validateReplySubject(reply);
            this.validateReplyInDays(reply);
            this.validateEmailTemplateForAddReply(reply);
            this.errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
            if (this.errorLength == 0) {
                this.addEmailNotOpenedReplyDaysSum(reply, i);
                this.addEmailOpenedReplyDaysSum(reply, i);
            }
        }
    }

    addEmailNotOpenedReplyDaysSum(reply: Reply, index: number) {
        if (reply.actionId == 0) {
            if (index == 0) {
                this.emailNotOpenedReplyDaysSum = reply.replyInDays;
            } else {
                this.emailNotOpenedReplyDaysSum = reply.replyInDays + this.emailNotOpenedReplyDaysSum;
            }
            reply.replyInDaysSum = this.emailNotOpenedReplyDaysSum;
        }
    }
    addEmailOpenedReplyDaysSum(reply: Reply, index: number) {
        if (reply.actionId == 13) {
            if (index == 0) {
                this.emailOpenedReplyDaysSum = reply.replyInDays;
            } else {
                this.emailOpenedReplyDaysSum = reply.replyInDays + this.emailOpenedReplyDaysSum;
            }
            reply.replyInDaysSum = this.emailOpenedReplyDaysSum;
        }
    }
    validateReplyInDays(reply: Reply) {
        if (reply.actionId == 0 || reply.actionId == 13 || reply.actionId == 24 || reply.actionId == 29 || reply.actionId == 30 || reply.actionId==33) {
            if (reply.replyInDays == null || reply.replyInDays == 0) {
                this.addReplyDaysErrorDiv(reply);
            } 
        }
    }

    addReplyDaysErrorDiv(reply: Reply) {
        this.addReplyDivError(reply.divId);
        $('#reply-days-' + reply.divId).addClass('required');
    }

    extractTimeFromDate(replyTime) {
        //let dt = new Date(replyTime);
        let dt = replyTime;
        let hours = dt.getHours() > 9 ? dt.getHours() : '0' + dt.getHours();
        let minutes = dt.getMinutes() > 9 ? dt.getMinutes() : '0' + dt.getMinutes();
        return hours + ":" + minutes;
    }
    validateReplySubject(reply: Reply) {
        if (reply.subject == null || reply.subject == undefined || $.trim(reply.subject).length == 0) {
            this.addReplyDivError(reply.divId);
            console.log("Added Reply Subject Eror");
            $('#reply-subject-' + reply.divId).addClass('required');
        }
    }

    validateEmailTemplateForAddReply(reply: Reply) {
        if (reply.defaultTemplate && reply.selectedEmailTemplateId == 0) {
            $('#' + reply.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#email-template-' + reply.divId).addClass('required');
        } else if (!reply.defaultTemplate && (reply.body == null || reply.body == undefined || $.trim(reply.body).length == 0)) {
            $('#' + reply.divId).addClass('portlet light dashboard-stat2 border-error');
            $('#reply-message-' + reply.divId).addClass('required');
        }
    }

    addReplyDivError(divId: string) {
        $('#' + divId).addClass('portlet light dashboard-stat2 border-error');
    }
    removeStyleAttrByDivId(divId: string) {
        $('#' + divId).removeAttr("style");
    }
    getTodayTime() {
        /*let newDate:any = new Date().toLocaleString();
        newDate = newDate.substring(0,newDate.length-6);
        newDate = newDate.replace(',','');
        return newDate;*/

        var dt = new Date();
        var d = dt.toLocaleDateString();
        var t = dt.toLocaleTimeString();
        t = t.replace(/\u200E/g, '');
        t = t.replace(/^([^\d]*\d{1,2}:\d{1,2}):\d{1,2}([^\d]*)$/, '$1$2');
        var result = d + ' ' + t;
        return result;
    }
    saveCampaignOnDestroy() {
        const eventCampaign = this.getCampaignData(this.eventCampaign);
        if ((this.isEditCampaign || this.reDistributeEventManage) && !eventCampaign.onlineMeeting && !eventCampaign.campaignLocation.id) { }
        else { eventCampaign.campaignLocation.id = null; }
        eventCampaign.campaignEventTimes[0].id = null;
        eventCampaign.campaignEventMedias[0].id = null;
        eventCampaign.userListIds = this.parternUserListIds;
        for (let userListId of eventCampaign.userListIds) {
            let contactList = new ContactList(userListId);
            eventCampaign.userLists.push(contactList);
        }
        eventCampaign.user.id = null;
        for (let i = 0; i < eventCampaign.campaignReplies.length; i++) {
            eventCampaign.campaignReplies[i].id = null;
        }

        if (this.reDistributeEvent || this.reDistributeEventManage) {
            if (this.reDistributeEvent) {
                eventCampaign.parentCampaignId = this.activatedRoute.snapshot.params['id'];
                eventCampaign.id = null;
            }
            if (this.reDistributeEventManage) {
                eventCampaign.parentCampaignId = this.parentCampaignIdValue;
            }
            //eventCampaign.enableCoBrandingLogo = this.eventCampaign.enableCoBrandingLogo;
            eventCampaign.nurtureCampaign = true;
            eventCampaign.selectedEditEmailTemplate = eventCampaign.emailTemplate.id;
            eventCampaign.channelCampaign = false;
            eventCampaign.toPartner = false;
        }
        if (!eventCampaign.campaignEventTimes[0].startTimeString) { eventCampaign.campaignEventTimes[0].startTimeString = this.getTodayTime(); }
        if (!eventCampaign.campaignEventTimes[0].endTimeString && !this.eventCampaign.campaignEventTimes[0].allDay) { eventCampaign.campaignEventTimes[0].endTimeString = this.getTodayTime(); }
        if (this.eventCampaign.campaignEventTimes[0].countryId === undefined) { this.eventCampaign.campaignEventTimes[0].countryId = 0; }
        const errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
        delete eventCampaign.emailTemplateDTO;
        delete eventCampaign.userDTO
        delete eventCampaign.userListDTOs
        if (errorLength === 0) {
            this.dataError = false;
            this.campaignService.createEventCampaign(eventCampaign, this.isEventUpdate)
                .subscribe(
                    response => {
                        if (response.statusCode === 2000) {
                            this.referenceService.goToTop();
                            this.isLaunched = true;
                            this.reInitialize();
                            if ("/home/campaigns/manage" === this.router.url) {
                                this.router.navigate(["/home/campaigns/manage"]);
                            }
                        }
                    },
                    error => {
                        this.hasInternalError = true;
                        this.logger.error("error in saveCampaignOnDestroy()", error);
                    },
                    () => this.logger.info("Finished saveCampaignOnDestroy()")
                );
        }
        return false;
    }

    emailTemplateSelection(emailTemplate) {
        this.eventCampaign.emailTemplate = emailTemplate;
        this.resetTabClass();
    }
    reInitialize() {
        this.referenceService.selectedCampaignType = "";
        this.eventCampaign.userListIds = [];
        this.campaignService.campaign = undefined;
    }


    resetTabs(currentTab: string) {
        this.currentTab = currentTab;
        if (currentTab == 'details') {
            this.detailsTab = true;
            this.recipientsTab = false;
            this.emailTemplatesTab = false;
            this.launchTab = false;
        } else if (currentTab == 'recipients') {
            this.detailsTab = false;
            this.recipientsTab = true;
            this.emailTemplatesTab = false;
            this.launchTab = false;
            this.setEventTimeZone();
        } else if (currentTab == 'templates') {
            this.detailsTab = false;
            this.recipientsTab = false;
            this.emailTemplatesTab = true;
            this.launchTab = false;
        } else if (currentTab == 'launch') {
            this.detailsTab = false;
            this.recipientsTab = false;
            this.emailTemplatesTab = false;
            this.launchTab = true;
            this.getValidUsersCount();
        }

    }
    setEventTimeZone() {
        try {
            this.timeZoneSetValue = '';
            let e: any = document.getElementById("timezoneIdChange");
            //let timeZoneId = $('#timezoneIdCampaignEventTime option:selected').val();
            var value = e.options[e.selectedIndex].value;
            var text = e.options[e.selectedIndex].text;
            this.timeZoneSetValue = text;
            for (let i = 0; i < this.timezonesCampaignEventTime.length; i++) {
                if (this.timezonesCampaignEventTime[i].cityName === text) {
                    this.timeZoneSetValue = this.timezonesCampaignEventTime[i].timezoneId;
                    break;
                }
            }
            this.eventCampaign.campaignEventTimes[0].timeZone = this.timeZoneSetValue;
            return this.timeZoneSetValue;
        } catch (error) { console.log(error); }
    }
    onlineMeetingSwitchStatusChange() {
        this.eventCampaign.onlineMeeting = !this.eventCampaign.onlineMeeting;
        this.resetTabClass();
    }

    publicVsPrivateSwitchStatusChange() {
        this.eventCampaign.publicEventCampaign = !this.eventCampaign.publicEventCampaign;

        if (this.eventCampaign.publicEventCampaign && this.eventCampaign.campaign && !this.statusMessage) {
            this.statusMessage = this.eventCampaign.campaign;
        } else {
            this.statusMessage = '';
        }
    }

    validatePipeline() {
        let leadPipelineId: any;
        let dealPilelineId: any;
        leadPipelineId = this.eventCampaign.leadPipelineId;
        dealPilelineId = this.eventCampaign.dealPipelineId;
        if (leadPipelineId && leadPipelineId !== '0' && dealPilelineId && dealPilelineId !== '0') {
            this.isValidPipeline = true;
        } else {
            this.isValidPipeline = false;
        }
        if ('HALOPSA' ===  this.activeCRMDetails.type && this.eventCampaign.leadTicketTypeId > 0 
            && this.eventCampaign.dealTicketTypeId > 0) {
            this.isValidPipeline = true;
        } else if ('HALOPSA' ===  this.activeCRMDetails.type && (this.eventCampaign.leadTicketTypeId == 0 
            || this.eventCampaign.dealTicketTypeId == 0)) {
            this.isValidPipeline = false;
        }
        this.resetTabClass();

    }

    resetTabClass() {
        if ((this.eventCampaign.campaign && !this.eventError.eventTitleError && this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError))) && (this.userListIds.length === 0 && this.parternUserListIds.length === 0) && this.isValidCrmOption && this.isValidPipeline) {
            this.recipientsTabClass = "enableRecipientsTab";
        } else if ((this.eventCampaign.campaign && !this.eventError.eventTitleError && this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError))) && (this.userListIds.length != 0 || this.parternUserListIds.length != 0 && this.isValidCrmOption && this.isValidPipeline)) {
            this.recipientsTabClass = "recipientsTabComplate";
        } else {
            this.recipientsTabClass = "disableRecipientsTab";
        }

        if ((this.eventCampaign.campaign && !this.eventError.eventTitleError && this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError))) && (this.userListIds.length != 0 || this.parternUserListIds.length != 0) && this.isValidCrmOption && !this.eventCampaign.emailTemplate.id && this.isValidPipeline) {
            this.emailTemplatesTabClass = "enableEmailTemplate";
        } else if ((this.eventCampaign.campaign && !this.eventError.eventTitleError && this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError))) && (this.userListIds.length != 0 || this.parternUserListIds.length != 0) && this.isValidCrmOption && this.eventCampaign.emailTemplate.id && this.isValidPipeline) {
            this.emailTemplatesTabClass = "emailTemplateTabComplete";
        } else {
            this.emailTemplatesTabClass = "disableTemplateTab";
        }

        if ((this.eventCampaign.campaign && !this.eventError.eventTitleError && this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError))) && (this.userListIds.length != 0 || this.parternUserListIds.length != 0) && this.isValidCrmOption && this.eventCampaign.emailTemplate.id && !this.checkLaunchOption && this.isValidPipeline) {
            this.launchTabClass = "enableLaunchTab";
        } else if ((this.eventCampaign.campaign && !this.eventError.eventTitleError && this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError))) && (this.userListIds.length != 0 || this.parternUserListIds.length != 0) && this.isValidCrmOption && this.eventCampaign.emailTemplate.id && this.checkLaunchOption && this.isValidPipeline) {
            this.launchTabClass = "emailLauchTabComplete";
        } else {
            this.launchTabClass = "disableLaunchTab";
        }

        //this.resetTabs(this.currentTab);

        if (this.isPreviewEvent || this.isEventUpdate) {
            this.detailsTab = true;
            this.recipientsTab = false;
            this.emailTemplatesTab = false;
            this.launchTab = true;
        }


        if (this.reDistributeEvent || this.reDistributeEventManage) {
            this.detailsTab = true;
            this.recipientsTab = true;
            this.emailTemplatesTab = false;
            this.launchTab = true;
        }

    }

    validateReplayDate() {
        try {
            var currentTime = new Date();
            var month = currentTime.getMonth() + 1;
            var day = currentTime.getDate();
            var year = currentTime.getFullYear();
            var currentFulldate = month + "/" + day + "/" + year;
            if (this.eventCampaign.campaignEventTimes[0].startTimeString) {
                var str = this.eventCampaign.campaignEventTimes[0].startTimeString;
            } else { str = this.tempStartTime; }
            if (str) { var res = str.split(" "); this.differenceBetweenTwoDates(currentFulldate, res[0]); }
        } catch (error) {
            this.logger.log(error);
        }
    }

    differenceBetweenTwoDates(date1t, date2t) {
        var date1 = new Date(date1t);
        var date2 = new Date(date2t);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        this.beforeDaysLength = diffDays;

    }

    validateUpdateButton() {
        if (this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError) && this.eventCampaign.updateMessage.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " "))) {
            this.isEnableUpdateButton = true;
        } else {
            this.isEnableUpdateButton = false;
        }
    }

    /*pushHubspot(event: any)
    {
        this.eventCampaign.pushToHubspot =  !this.eventCampaign.pushToHubspot;
        console.log(this.eventCampaign.pushToHubspot);

        if (this.eventCampaign.pushToHubspot)
        {
            this.checkingHubSpotContactsAuthentication();
        }
    }*/

    checkingHubSpotContactsAuthentication() {
        this.hubSpotService.configHubSpot().subscribe(data => {
            let response = data;
            if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
                console.log("isAuthorize true");
                //this.eventCampaign.pushToHubspot = true;
                this.eventCampaign.pushToCRM.push('hubspot');
                this.validatePushToCRM();
            }
            else {
                if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
                    window.location.href = response.data.redirectUrl;
                }
            }
        }, (error: any) => {
            console.error(error, "Error in HubSpot checkIntegrations()");
        }, () => console.log("HubSpot Configuration Checking done"));
    }

    /*    pushMarketo(event: any)
        {
            this.eventCampaign.pushToMarketo =  !this.eventCampaign.pushToMarketo;
            console.log(this.eventCampaign.pushToMarketo);
    
            if (this.eventCampaign.pushToMarketo)
            {
                this.checkMarketoCredentials();
            }
        }
     */
    checkMarketoCredentials() {
        this.loadingMarketo = true;
        this.emailTemplateService.checkMarketoCredentials(this.authenticationService.getUserId()).subscribe(response => {
            if (response.statusCode == 8000) {
                this.loading = true;
                this.emailTemplateService.checkCustomObjects(this.authenticationService.getUserId()).subscribe(customObjectResponse => {
                    if (customObjectResponse.statusCode == 8020) {
                        this.eventCampaign.pushToCRM.push('marketo');
                        this.validatePushToCRM()
                        //this.pushToCRM.push('marketo');

                        this.templateError = false;
                        this.loading = false;
                    } else {
                        this.templateError = false;
                        this.loading = false;
                    }

                }, error => {
                    this.templateError = error;

                    this.loadingMarketo = false;
                })

            }
            else {
                //  this.eventCampaign.pushToMarketo = false;

                $("#templateRetrieve").modal('show');
                $("#closeButton").show();
                this.templateError = false;
                this.loadingMarketo = false;

            }
        }, error => {
            //  this.eventCampaign.pushToMarketo = false;
            this.templateError = error;
            $("#templateRetrieve").modal('show');
            $("#closeButton").show();
            this.loadingMarketo = false;
        })
    }

    submitMarketoCredentials() {
        this.loadingMarketo = true;
        const obj = {
            userId: this.authenticationService.getUserId(),
            instanceUrl: this.marketoInstance,
            clientId: this.clientId,
            clientSecret: this.secretId
        }

        this.emailTemplateService.saveMarketoCredentials(obj).subscribe(response => {
            if (response.statusCode == 8003) {
                $("#closeButton").hide();
                this.showMarketoForm = false;
                // this.eventCampaign.pushToMarketo = true;

                this.eventCampaign.pushToCRM.push('hubspot');

                this.templateError = false;
                this.templateSuccessMsg = response.message;
                this.loadingMarketo = false;

                setTimeout(function () { $("#templateRetrieve").modal('hide') }, 3000);
            } else {
                $("#templateRetrieve").modal('show');
                $("#closeButton").show();
                this.templateError = response.message;
                this.templateSuccessMsg = false;
                this.loadingMarketo = false;
            }
        }, error => {
            this.templateError = error;
            $("#closeButton").show();
            this.loadingMarketo = false;
        }
        )

    }

    getTemplatesFromMarketo() {
        this.clearValues();

        this.checkMarketoCredentials();
    }

    clearValues() {
        this.clientId = '';
        this.secretId = '';
        this.marketoInstance = '';
        this.clientIdClass = "form-group";
        this.secretIdClass = "form-group";
        this.marketoInstanceClass = "form-group";

    }


    validateModelForm(fieldId: any) {
        var errorClass = "form-group has-error has-feedback";
        var successClass = "form-group has-success has-feedback";

        if (fieldId == 'email') {
            if (this.clientId.length > 0) {
                this.clientIdClass = successClass;
                this.clentIdError = false;
            } else {
                this.clientIdClass = errorClass;
                this.clentIdError = true;
            }
        } else if (fieldId == 'pwd') {
            if (this.secretId.length > 0) {
                this.secretIdClass = successClass;
                this.secretIdError = false;
            } else {
                this.secretIdClass = errorClass;
                this.secretIdError = true;
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
        this.toggleSubmitButtonState();
    }


    saveMarketoTemplatesButtonState() {


    }


    toggleSubmitButtonState() {
        if (!this.clentIdError && !this.secretIdError && !this.marketoInstanceError) {
            this.isModelFormValid = true;
            this.marketoButtonClass = "btn btn-primary";
        }
        else {
            this.isModelFormValid = false;
            this.marketoButtonClass = "btn btn-default";
        }

    }
    closeMarketoModal() {
        // this.eventCampaign.pushToMarketo = false;
        $("#templateRetrieve").modal('hide');
    }

    characterSize() {
        this.characterleft = 250 - this.eventCampaign.message.length;
    }

    toggleSelectAll() {
        this.isAllSelected = !this.isAllSelected;
        this.selectedAccounts = 0;
        if (this.isAllSelected) {
            this.socialStatusProviders.forEach(data => {
                data.selected = false;
                this.toggleSocialStatusProvider(data);
            })
        } else {
            this.socialStatusList.length = 1;
            this.socialStatusProviders.forEach(data => data.selected = false);
        }
    }

    toggleSocialStatusProvider(socialStatusProvider: SocialStatusProvider) {
        socialStatusProvider.selected = !socialStatusProvider.selected;
        this.selectedAccounts = socialStatusProvider.selected ? this.selectedAccounts + 1 : this.selectedAccounts - 1;
        if (this.selectedAccounts === 0)
            this.isAllSelected = false;
        if (this.selectedAccounts === this.socialStatusProviders.length) {
            this.isAllSelected = true;
        } else {
            this.isAllSelected = false;
        }

    }


    listActiveSocialAccounts(userId: number) {
        this.socialService.listAccounts(userId, 'ALL', 'ACTIVE')
            .subscribe(
                data => {
                    this.socialService.socialConnections = data;
                    this.listSocialStatusProviders();
                },
                error => console.log(error),
                () => {
                    console.log('getFacebookAccounts() Finished.');
                }
            );
    }

    listSocialStatusProviders() {
        if (this.socialStatusProviders.length < 1) {
            const socialConnections = this.socialService.socialConnections;
            socialConnections.forEach(data => {
                if (data.active) {
                    let socialStatusProvider = new SocialStatusProvider();
                    socialStatusProvider.socialConnection = data;
                    this.socialStatusProviders.push(socialStatusProvider);
                }
            })
        }
    }

    spamCheck() {
        $("#email_spam_check").modal('show');
    }

    ngOnDestroy() {
        this.authenticationService.removeLocalStorageItemByKey(this.properties.eventCampaignTemplateLocalStorageKey);
        this.campaignService.eventCampaign = undefined;
        this.authenticationService.isShowForms = false;
        CKEDITOR.config.readOnly = false;
        if (!this.hasInternalError && this.router.url !== "/login" && !this.isPreviewEvent && !this.reDistributeEvent && !this.reDistributeEventManage) {
            if (!this.isReloaded) {
                if (!this.isLaunched) {
                    /*if(this.isAdd){
                        this.saveCampaignOnDestroy();
                    }else{*/
                    let self = this;
                    swal({
                        title: 'Are you sure?',
                        text: "You have unchanged Campaign data",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#54a7e9',
                        cancelButtonColor: '#999',
                        confirmButtonText: 'Yes, Save it!',
                        cancelButtonText: 'No'

                    }).then(function () {
                        self.saveCampaignOnDestroy();
                    }, function (dismiss) {
                        if (dismiss === 'No') {
                            self.reInitialize();
                        }
                    })
                    //}
                }
            }
        }
        $('#contactsModal').modal('hide');
        $('#show_email_template_preivew').modal('hide');
    }

    smsServices() {
        this.smsService = !this.smsService;
        this.enableSmsText = this.smsService;
    }


    /*listForms() {
        this.referenceService.loading( this.httpRequestLoader, true );
        this.formsPagination.userId = this.loggedInUserId;
        this.formService.list( this.formsPagination ).subscribe(
            ( response: any ) => {
                const data = response.data;
                console.log(data);
                if(response.statusCode == 200){
                    this.formsPagination.totalRecords = data.totalRecords;
                    //this.sortOption.totalRecords = data.totalRecords;
                    this.formsPagination = this.pagerService.getPagedItems( this.formsPagination, data.forms );
                    $( '#listOfFormsModal' ).modal( 'show' );
                }
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            ( error: any ) => {
               this.logger.errorPage(error);
            } );
    }*/

    /*hideListFormModal(){
        $( '#listOfFormsModal' ).modal( 'hide' );
    }*/

    /* selectedForm(form: any){
         this.selectedFormData = form;
         this.eventCampaign.forms = form;
     }*/

    previewForm(id: any) {
        this.previewPopUpComponent.previewForm(id);
    }


    getValidUsersCount() {
        try {
            /*for (var i = 0; i < this.userListDTOObj.length; i++) {
                this.listOfSelectedUserListIds.push(this.userListDTOObj[i].id);
            }*/

            if (this.parternUserListIds.length > 0) {
                this.contactService.getValidUsersCount(this.parternUserListIds)
                    .subscribe(
                        data => {
                            this.validUsersCount = data['validContactsCount'];
                            this.allUsersCount = data['allContactsCount'];
                        },
                        (error: any) => {
                            console.log(error);
                        },
                        () => console.info("MangeContactsComponent ValidateInvalidContacts() finished")
                    )
            }
        } catch (error) {
            console.error(error, "ManageContactsComponent", "removingInvalidUsers()");
        }
    }


    validatePushToCRM() {
        if (this.isPushToCrm && (this.eventCampaign.channelCampaign || this.isOrgAdminOrOrgAdminTeamMember) && this.eventCampaign.pushToCRM.length === 0) {
            this.isValidCrmOption = false;
        } else {
            this.isValidCrmOption = true;
        }

        this.resetTabClass();
    }


    pushToCrm() {
        this.isPushToCrm = !this.isPushToCrm;
        if (!this.isPushToCrm) {
            this.eventCampaign.pushToCRM = [];
            //this.eventCampaign.pushToCRM.push('salesforce');
        }
        //this.checkSalesforceIntegration();
        this.validatePushToCRM();
    }

    pushToCrmRequest(crmName: any, event: any) {
        if (event.target.checked) {

            if (crmName == 'marketo') {
                this.checkMarketoCredentials();
            } else if (crmName == 'hubspot') {
                this.checkingHubSpotContactsAuthentication();
            } else if (crmName == 'microsoft') {
                this.checkingMicrosoftAuthentication();
            } else if (crmName == 'salesforce') {
                this.checkSalesforceIntegration();
            }

            //this.pushToCRM.push(crmName);
        } else {
            if (crmName == 'marketo' || crmName == 'hubspot' || crmName == 'salesforce' || crmName == 'microsoft' ) {
                this.eventCampaign.pushToCRM = this.eventCampaign.pushToCRM.filter(e => e !== crmName);
            }
        }

        this.validatePushToCRM();
    }
    
    checkingMicrosoftAuthentication() {
        this.integrationService.checkConfigurationByType('microsoft').subscribe(data => {
            let response = data;
            if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
                this.eventCampaign.pushToCRM.push('microsoft');
                this.validatePushToCRM();
            }
            else {
                this.showMicrosoftAuthenticationForm = true;
            }
        }, (error: any) => {
            console.error(error, "Error in Microsoft checkingMicrosoftAuthentication()");
        }, () => console.log("Microsoft Configuration Checking done"));
    }

    closeMicrosoftForm (event: any) {
		if (event === "0") {
			this.showMicrosoftAuthenticationForm = false;
		}		
	}

    checkSalesforceIntegration(): any {
        //  if(!this.isOrgAdminOrOrgAdminTeamMember){
        //      this.eventCampaign.pushToCRM = [];
        //  }
        if (this.enableLeads) {
            this.integrationService.checkConfigurationByType("isalesforce").subscribe(data => {
                let response = data;
                if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
                    this.eventCampaign.pushToCRM.push('salesforce');
                    this.validatePushToCRM();
                } else {
                    if (response.data.redirectUrl !== undefined && response.data.redirectUrl !== '') {
                        window.location.href = response.data.redirectUrl;
                    }
                }
            }, error => {
                this.logger.error(error, "Error in salesforce checkIntegrations()");
            }, () => this.logger.log("Integration Salesforce Configuration Checking done"));
        }
    }

    isSalesforceIntegrated(): any {
        this.salesforceIntegrated = false;
        if (this.enableLeads) {
            this.loading = true;
            this.integrationService.checkConfigurationByType("isalesforce").subscribe(data => {
                let response = data;
                if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
                    this.salesforceIntegrated = true;
                    this.listCampaignPipelines();
                    this.integrationService.checkSfCustomFields(this.authenticationService.getUserId()).subscribe(data => {
                        let cfResponse = data;
                        if (cfResponse.statusCode === 200) {
                            this.showConfigurePipelines = false;
                        } else if (cfResponse.statusCode === 400) {
                            swal("Oh! Custom fields are missing in your Salesforce account. Leads and Deals created by your partners will not be pushed into Salesforce.", "", "error");
                        } else if (cfResponse.statusCode === 401 && cfResponse.message === "Expired Refresh Token") {
                            swal("Your Salesforce Integration was expired. Please re-configure.", "", "error");
                        }
                    }, error => {
                        this.logger.error(error, "Error in salesforce checkIntegrations()");
                    }, () => this.logger.log("Integration Salesforce Configuration Checking done"));
                    console.log("isPushToSalesforce ::::" + this.pushToCRM);
                } else {
                    this.showConfigurePipelines = true;
                    this.listCampaignPipelines();
                }
            }, error => {
                this.logger.error(error, "Error in salesforce checkIntegrations()");
            }, () => this.logger.log("Integration Salesforce Configuration Checking done"));
        }
        this.loading = false;
    }


    showFolderFilterPopup() {
        $('#filterPopup').modal('show');
    }

    closeFilterPopup() {
        $('#filterPopup').modal('hide');
    }

    applyFilter() {
        if (this.selectedFolderIds.length > 0) {
            this.emailTemplatesPagination.categoryIds = this.selectedFolderIds;
            this.emailTemplatesPagination.categoryFilter = true;
        } else {
            this.emailTemplatesPagination.categoryIds = [];
            this.emailTemplatesPagination.categoryFilter = false;
        }
        this.loadEmailTemplates(this.emailTemplatesPagination);
        this.closeFilterPopup();
    }

    listEmailTemplatesFolders() {
        this.folderFields = { text: 'name', value: 'id' };
        this.campaignService.listEmailTemplateOrLandingPageFolders(this.loggedInUserId, 'email').
            subscribe(data => {
                this.emailTemplateFolders = data;
            }, error => {
                this.folderErrorCustomResponse = new CustomResponse();
                this.folderErrorCustomResponse = new CustomResponse('ERROR', this.referenceService.serverErrorMessage, true);
            }, () => this.logger.log("listEmailTemplatesFolders()"));
    }

    editPartnerTemplate() {
        this.isEditPartnerTemplate = false;
        if (this.eventCampaign.emailTemplate.vendorCompanyId != undefined && this.eventCampaign.emailTemplate.vendorCompanyId > 0) {
            if (this.eventCampaign.emailTemplate.jsonBody != undefined) {
                this.isEditPartnerTemplate = true;
            } else {
                this.referenceService.showSweetAlert("", "This template cannot be edited.", "error");
            }
        } else {
            this.referenceService.showSweetAlert("", "This template can't be edited because the vendor has deleted the campaign.", "error");

        }

    }

    openCreateFolderPopup() {
        this.folderCustomResponse = new CustomResponse('');
        this.addFolderModalPopupComponent.openPopup();
    }

    showSuccessMessage(message: any) {
        this.folderCustomResponse = new CustomResponse('SUCCESS', message, true);
        this.listCategories();
    }

    previewUsers(contactList: any) {
        this.showUsersPreview = true;
        this.selectedListName = contactList.name;
        this.selectedListId = contactList.id;
    }

    resetValues() {
        this.showUsersPreview = false;
        this.selectedListName = "";
        this.selectedListId = 0;
    }

    showContactsAlert(count: number) {
        this.emptyContactsMessage = "";
        if (count == 0) {
            this.emptyContactsMessage = "No Contacts Found For This Contact List";
        }
    }

    sortRecipientsList(text: any) {
        this.recipientsSortOption.eventSelectedCampaignRecipientsDropDownOption = text;
        this.getAllFilteredResults();
    }

    getAllFilteredResults() {
        try {
            this.contactListsPagination.pageIndex = 1;
            this.contactListsPagination.searchKey = this.contactSearchInput;
            this.contactListsPagination = this.utilService.sortOptionValues(this.recipientsSortOption.eventSelectedCampaignRecipientsDropDownOption, this.contactListsPagination);
            this.loadContactLists(this.contactListsPagination);
        } catch (error) {
            console.log(error, "getAllFilteredResults()", "Publish Content Component")
        }
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

    openMergeTagsPopup(type: string, autoResponseSubject: any) {
        this.mergeTagsInput['isEvent'] = false;
        this.mergeTagsInput['isCampaign'] = true;
        this.mergeTagsInput['hideButton'] = true;
        this.mergeTagsInput['type'] = type;
        this.mergeTagsInput['autoResponseSubject'] = autoResponseSubject;
    }

    clearHiddenClick() {
        this.mergeTagsInput['hideButton'] = false;
    }

    appendValueToSubjectLine(event: any) {
        if (event != undefined) {
            let type = event['type'];
            let copiedValue = event['copiedValue'];
            if (type == "campaignSubjectLine") {
                let updatedValue = this.eventCampaign.subjectLine + " " + copiedValue;
                this.eventCampaign.subjectLine = updatedValue;
                this.eventSubjectLineError();
            } else {
                let autoResponse = event['autoResponseSubject'];
                autoResponse.subject = autoResponse.subject + " " + copiedValue;
            }
        }
        this.mergeTagsInput['hideButton'] = false;
    }

    editTemplate(emailTemplate: any) {
        this.showEditTemplateMessageDiv = false;
        if (emailTemplate['type'] != 'UPLOADED' && emailTemplate.userDefined) {
            this.referenceService.goToTop();
            $('#event-tabs').hide(600);
            $('#edit-template').show(600);
            this.editTemplateLoader = true;
            this.beeContainerInput['emailTemplateName'] = emailTemplate.name;
            this.emailTemplateService.findJsonBody(emailTemplate.id).subscribe(
                response => {
                    this.beeContainerInput['module'] = "emailTemplates";
                    this.beeContainerInput['jsonBody'] = response;
                    this.beeContainerInput['id'] = emailTemplate.id;
                    this.beeContainerInput['isEvent'] = (emailTemplate.beeEventTemplate ||emailTemplate.beeEventCoBrandingTemplate);
                    this.editTemplateMergeTagsInput['isEvent'] = (emailTemplate.beeEventTemplate ||emailTemplate.beeEventCoBrandingTemplate);
                    this.showEditTemplatePopup = true;
                    this.editTemplateLoader = false;
                }, error => {
                    this.hideEditTemplateDiv();
                    this.referenceService.showSweetAlertServerErrorMessage();
                }
            );
        } else {
            this.referenceService.showSweetAlertErrorMessage('Uploaded Templates Cannot Be Edited');
        }
    }

    hideEditTemplateDiv() {
        $('#edit-template').hide(600);
        this.showEditTemplatePopup = false;
        this.editTemplateLoader = false;
        this.beeContainerInput = {};
        this.editTemplateMergeTagsInput = {};
        $('#event-tabs').show(600);
    }

    updateTemplate(event: any) {
        this.completeLoader = true;
        let emailTemplate = new EmailTemplate();
        emailTemplate.id = event.id;
        emailTemplate.jsonBody = event.jsonContent;
        emailTemplate.body = event.htmlContent;
        emailTemplate.userId = this.loggedInUserId;
        this.emailTemplateService.updateJsonAndHtmlBody(emailTemplate).subscribe(
            response => {
                this.completeLoader = false;
                this.showEditTemplateMessageDiv = true;
                this.templateMessageClass = "alert alert-success";
                this.templateUpdateMessage = "Template Updated Successfully";
                this.referenceService.goToTop();
            }, error => {
                this.completeLoader = false;
                this.templateMessageClass = "alert alert-danger";
                this.templateUpdateMessage = this.properties.serverErrorMessage;
                this.showEditTemplateMessageDiv = true;
            }
        )

    }

    clearEndDate() {
        this.endDatePickr.clear();
        this.eventCampaign.endDateString = undefined;
    }

    getActiveCRMDetails(): any {
        this.referenceService.loading(this.httpRequestLoader, true);
        this.salesforceIntegrated = false;
        if (this.enableLeads) {
            this.loading = true;
            this.integrationService.getActiveCRMDetailsByUserId(this.authenticationService.getUserId()).subscribe(data => {
                this.activeCRMDetails = data.data;
                if (this.activeCRMDetails.activeCRM) {
                    if("HALOPSA" === this.activeCRMDetails.type){
                        this.showConfigurePipelines = true;
                        this.listCampaignPipelines();
                        this.getConfigureHalopsaTicketTypes();
                    }
                    else if ("SALESFORCE" === this.activeCRMDetails.type) {
                        this.salesforceIntegrated = true;
                        this.listCampaignPipelines();
                        this.integrationService.checkSfCustomFields(this.authenticationService.getUserId()).subscribe(data => {
                            let cfResponse = data;                            
                            if (cfResponse.statusCode === 200) {
                                this.showConfigurePipelines = false;
                            } else if (cfResponse.statusCode === 400) {
                                swal("Oh! Custom fields are missing in your Salesforce account. Leads and Deals created by your partners will not be pushed into Salesforce.", "", "error");
                            } else if (cfResponse.statusCode === 401 && cfResponse.message === "Expired Refresh Token") {
                                swal("Your Salesforce Integration was expired. Please re-configure.", "", "error");
                            }
                        }, error => {
                            this.logger.error(error, "Error in salesforce checkIntegrations()");
                        }, () => this.logger.log("Integration Salesforce Configuration Checking done"));
                    } else {
                        this.showConfigurePipelines = true;
                        this.listCampaignPipelines();
                    }
                } else {
                    this.showConfigurePipelines = true;
                    this.listCampaignPipelines();
                }
                this.referenceService.loading(this.httpRequestLoader, false);
            }, error => {
                this.referenceService.loading(this.httpRequestLoader, false);
                this.logger.error(error, "Error in salesforce checkIntegrations()");
            }, () => this.logger.log("Integration Salesforce Configuration Checking done"));
        }
        this.loading = false;
    }



    checkNameForCompanyList(name: any): boolean {
        let position = name.search('Company List');
        return position != -1 ? true: false;
      }


    filterContacts(filterType:string){
        this.contactListsPagination.pageIndex = 1;
		this.contactListsPagination.filterBy = filterType;
		this.contactListMethod(this.contactListsPagination)
	}

    openTemplateInNewTab(id:number){
        this.setLocalStorageForEventTemplatePreview();
        let campaignId = this.activatedRoute.snapshot.params['id'];
        if(this.reDistributeEvent){
            this.referenceService.previewSharedVendorEventCampaignEmailTemplateInNewTab(campaignId);
        }else if(this.reDistributeEventManage){
            this.referenceService.previewEditRedistributedEventCampaignTemplatePreview(campaignId);
        }else{
            this.referenceService.previewEventCampaignEmailTemplateInNewTab(id);
        }
    }
    setLocalStorageForEventTemplatePreview(){
        let key = this.properties.eventCampaignTemplateLocalStorageKey;
        this.authenticationService.removeLocalStorageItemByKey(key);
        this.eventCampaign.isRedistributeEvent = this.reDistributeEvent;
        this.eventCampaign.isPreviewEvent = this.isPreviewEvent;
        this.authenticationService.setLocalStorageItemByKeyAndValue(key,this.eventCampaign);
    }

    openAutoResponseEmailTemplateInNewTab(reply:any){
        if(this.eventCampaign.nurtureCampaign){
            this.referenceService.previewSharedCampaignAutoReplyEmailTemplateInNewTab(reply.id);
         }else{
             this.referenceService.previewSharedVendorCampaignAutoReplyEmailTemplateInNewTab(reply.id);
         }
    }

    getConfigureHalopsaTicketTypes(){
        this.eventCampaign.dealTicketTypeId = this.defaultDealTicketTypeId;
        this.eventCampaign.leadTicketTypeId = this.defaultLeadTicketTypeId;
        this.eventCampaign.dealPipelineId = this.defaultDealPipelineId;
        this.eventCampaign.leadPipelineId = this.defaultLeadPipelineId;

        if(this.activeCRMDetails.type === 'HALOPSA'){
            let self = this;
            this.getHalopsaTicketTypes();
        }
            this.eventCampaign.dealPipelineId = this.defaultDealPipelineId;
            this.eventCampaign.leadPipelineId = this.defaultLeadPipelineId;
            this.eventCampaign.configurePipelines = !this.eventCampaign.configurePipelines;
                if (!this.eventCampaign.configurePipelines) {
                    if (this.eventCampaign.dealPipelineId == undefined || this.eventCampaign.dealPipelineId === 0) {
                    this.eventCampaign.dealPipelineId = this.defaultDealPipelineId;
                    } 
                }
    }

    getHalopsaTicketTypes() {
        let self = this;
        this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
            (result: any) => {
                self.getHalopsaTicketTypesByCompanyId(result);
            });
    }

      onChangeLeadTicketType() {
        let self = this;
        this.getHalopsaLeadPipelines();
      }

      onChangeDealTicketType() {
        let self = this;
        this.getHalopsaDealPipelines();
      }

      getHalopsaLeadPipelines() {
        let self = this;
        this.completeLoader = true;
        this.loggedInUserId = this.authenticationService.getUserId();
         this.campaignService.getHalopsaPipelinesByTicketType(this.eventCampaign.leadTicketTypeId, this.loggedInUserId)
                .subscribe(
                    response => {
                        this.completeLoader = false;
                        if (response.statusCode == 200) {
                            let data = response.data;                            
                            this.leadPipelines = data;
                            this.defaultLeadPipelineId = this.leadPipelines[0].id;
                            this.eventCampaign.leadPipelineId = this.leadPipelines[0].id;
                        }
                    },
                    error => {
                        this.completeLoader = false;
                        this.logger.error(error);
                    });
      }

      getHalopsaDealPipelines() {
        let self = this;
        this.completeLoader = true;
        this.loggedInUserId = this.authenticationService.getUserId();
         this.campaignService.getHalopsaPipelinesByTicketType(this.eventCampaign.dealTicketTypeId, this.loggedInUserId)
         .subscribe(
             response => {
                this.completeLoader = false;
                 if (response.statusCode == 200) {
                     let data = response.data;                            
                     this.dealPipelines = data;
                     this.defaultDealPipelineId = this.dealPipelines[0].id;
                     this.eventCampaign.dealPipelineId = this.dealPipelines[0].id;
                 }
             },
             error => {
                 this.completeLoader = false;
                 this.logger.error(error);
             });
      }

    getHalopsaTicketTypesByCompanyId(companyId: any) {
        let self = this;
        this.campaignService.getHalopsaTicketTypes(companyId)
            .subscribe(
                response => {
                    if (response.statusCode == 200) {
                        let data = response.data;
                        let ticketTypesMap = response.map;
                        this.eventCampaign.leadTicketTypeId = ticketTypesMap.leadTicketTypeId;
                        this.eventCampaign.dealTicketTypeId = ticketTypesMap.dealTicketTypeId;
                        this.dealTicketTypes = data;
                        this.defaultDealTicketTypeId = this.dealTicketTypes[0].id;
                        this.leadTicketTypes = data;
                        this.defaultLeadTicketTypeId = this.leadTicketTypes[0].id;
                        this.getHalopsaLeadPipelines();
                        this.getHalopsaDealPipelines();
                    }
                    this.referenceService.stopLoader(this.pipelineLoader);
                },
                error => {
                    this.referenceService.stopLoader(this.pipelineLoader);
                    this.logger.error(error);
                });
    }

}