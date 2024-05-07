import { Component, OnInit, ChangeDetectorRef, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { ContactList } from '../models/contact-list';
import { UserUserListWrapper } from '../models/user-userlist-wrapper';
import { User } from '../../core/models/user';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AuthenticationService } from '../../core/services/authentication.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialContact } from '../models/social-contact';
import { ZohoContact } from '../models/zoho-contact';
import { SalesforceContact } from '../models/salesforce-contact';
import { Pagination } from '../../core/models/pagination';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { AddContactsOption } from '../models/contact-option';
import { SocialPagerService } from '../services/social-pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { CountryNames } from '../../common/models/country-names';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { PaginationComponent } from '../../common/pagination/pagination.component';
import { FileUtil } from '../../core/models/file-util';
import { HubSpotService } from 'app/core/services/hubspot.service';
import { GdprSetting } from '../../dashboard/models/gdpr-setting';
import { LegalBasisOption } from '../../dashboard/models/legal-basis-option';
import { UserService } from '../../core/services/user.service';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { UserGuideHelpButtonComponent } from 'app/common/user-guide-help-button/user-guide-help-button.component';
declare var swal, $, Papa: any;

@Component({
    selector: 'app-add-contacts',
    templateUrl: './add-contacts.component.html',
    styleUrls: ['../../../assets/global/plugins/dropzone/css/dropzone.css',
        '../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload.css',
        '../../../assets/global/plugins/jquery-file-upload/css/jquery.fileupload-ui.css',
        '../../../assets/css/form.css',
        './add-contacts.component.css',
        '../../../assets/css/numbered-textarea.css', '../../../assets/css/phone-number-plugin.css'],
    providers: [FileUtil, SocialContact, ZohoContact, SalesforceContact, Pagination, CountryNames, Properties, RegularExpressions, PaginationComponent, CallActionSwitch]
})
export class AddContactsComponent implements OnInit, OnDestroy {
    partnerEmailIds: string[] = [];
    userUserListWrapper: UserUserListWrapper = new UserUserListWrapper();

    settingSocialNetwork: string;
    isUnLinkSocialNetwork: boolean = false;
    public contactLists: Array<ContactList>;
    contactListObject: ContactList;
    public clipBoard: boolean = false;
    public newUsers: Array<User>;
    public socialUsers: Array<User>;
    addContactuser: User = new User();
    public clipboardUsers: Array<User>;
    public clipboardTextareaText: string;
    selectedZohoDropDown: string = 'DEFAULT';
    zohoCredentialError = '';
    model: any = {};
    names: string[] = [];
    invalidPatternEmails: string[] = [];
    isValidContactName: boolean = false;
    validCsvContacts: boolean;
    googleImageBlur: boolean = false;
    googleImageNormal: boolean = false;
    sfImageBlur: boolean = false;
    sfImageNormal: boolean = false;
    zohoImageBlur: boolean = false;
    zohoImageNormal: boolean = false;
    noOptionsClickError: boolean = false;
    duplicateEmailIds: string[] = [];
    public contactListNameError = false;
    public invalidPattenMail: boolean;
    public valilClipboardUsers: boolean = false;
    public validEmailPatternSuccess: boolean = true;
    public uploadvalue = true;
    public contactListName: string;
    public userName: string;
    public password: string;
    public contactType: string;
    public salesforceListViewId: string;
    public salesforceListViewName: string;
    public socialNetwork: string;
    removeCsvName: boolean;
    public socialContact: SocialContact;
    public zohoContact: ZohoContact;
    public getGoogleConatacts: any;
    public getZohoConatacts: any;
    public salesforceContact: SalesforceContact;
    public getSalesforceConatactList: any;
    public storeLogin: any;
    public socialContactUsers: SocialContact[] = new Array();
    public salesforceListViewsData: Array<any> = [];
    public hubSpotContactListsData: Array<any> = [];
    public connectWiseContactListsData: Array<any> = [];
    pager: any = {};
    pagedItems: any[];
    checkingForEmail: boolean;
    isPartner: boolean;
    module: string;
    assignLeads: boolean = false;
    checkingContactTypeName: string;
    selectedContactListIds = [];
    allselectedUsers = [];
    isHeaderCheckBoxChecked: boolean = false;
    customResponse: CustomResponse = new CustomResponse();
    pageSize: number = 12;
    pageNumber: any;
    paginationType = "";
    loading = false;
    pageLoader = false;
    isListLoader = false;
    isDuplicateEmailId = false;

    uploadedCsvFileName = "";

    AddContactsOption: typeof AddContactsOption = AddContactsOption;
    selectedAddContactsOption: number = 8;
    disableOtherFuctionality = false;

    public uploader: FileUploader = new FileUploader({ allowedMimeType: ["application/csv", "application/vnd.ms-excel", "text/plain", "text/csv"] });
    contacts: User[];
    private socialContactType: string;
    emailNotValid: boolean;
    isCheckTC = true;
    contactOption: any;


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


    marketoImageBlur: boolean = false;
    marketoImageNormal: boolean = false;
    masterContactListSync: boolean = false;
    hubspotImageBlur: boolean = false;
    hubspotImageNormal: boolean = false;
    hubSpotSelectContactListOption: any;
    hubSpotContactListName: string;

    paginatedSelectedIds = [];
    gdprSetting: GdprSetting = new GdprSetting();
    termsAndConditionStatus = true;
    gdprStatus = true;
    legalBasisOptions: Array<LegalBasisOption>;
    parentInput: any;
    companyId: number = 0;
    isValidLegalOptions = true;
    selectedLegalBasisOptions = [];
    filePreview = false;
    public fields: any;
    public placeHolder: string = 'Select Legal Basis';
    loggedInThroughVanityUrl = false;
    zohoErrorResponse: CustomResponse = new CustomResponse();
    zohoPopupLoader: boolean = false;
    public checkZohoStatusCode: any;
    public zohoCurrentUser: any;
    public googleCurrentUser: any;
    public hubSpotCurrentUser: any;
    public salesForceCurrentUser: any;
    loggedInUserId = 0;
    sharedPartnerDetails: any;
    //leadsPartnerEmail = "";
    isLoggedInVanityUrl: any;
    public alias: any;
    invalidContactNameError = "";

    microsoftDynamicsImageBlur: boolean = false;
    microsoftDynamicsImageNormal: boolean = false;
    microsoftDynamicsSelectContactListOption: any;
    microsoftDynamicsContactListName: string;
    microsoftService: any;
    showMicrosoftAuthenticationForm: boolean = false;
    microsoftInstanceUrl: any;
    microsoftWebApiInstanceUrl: any;
    microsoftRedirectUrl: any;
    microsoftCurrentUser: string;
    microsoftLoading: boolean = false;

    //XNFR-230.
    //pipedrive

    pipedriveImageBlur: boolean = false;
    pipedriveImageNormal: boolean = false;
    pipedriveSelectContactListOption: any;
    pipedriveContactListName: string;
    pipedriveServie: any;
    showPipedriveAuthenticationForm: boolean = false;
    pipedriveApiKey: string;
    pipedriveApiKeyClass: string;
    pipedriveApiKeyError: boolean;
    pipedriveCurrentUser: string;
    pipedriveLoading: boolean = false;

    //XNFR-403 ConnectWise

    connectWiseImageBlur: boolean = false;
    connectWiseImageNormal: boolean = false;
    connectWiseSelectContactListOption: any;
    connectWiseContactListName: string;
    connectWiseServie: any;
    showConnectWiseAuthenticationForm: boolean = false;
    connectWiseApiKey: string;
    connectWiseApiKeyClass: string;
    connectWiseApiKeyError: boolean;
    connectWiseCurrentUser: string;
    connectWiseLoading: boolean = false;
    contactsCompanyListSync: boolean = false;

    //XNFR-502 HaloPSA

    haloPSAImageBlur: boolean = false;
    haloPSAImageNormal: boolean = false;
    haloPSASelectContactListOption: any;
    haloPSAContactListName: string;
    haloPSAServie: any;
    showHaloPSAAuthenticationForm: boolean = false;
    haloPSAClientID: string;
    haloPSAClientIDClass: string;
    haloPSAClientIDError: boolean;
    haloPSAClientSecret: string;
    haloPSAClientSecretClass: string;
    haloPSAClientSecretError: boolean;
    haloPSAInstanceURL: string;
    haloPSAInstanceURLClass: string;
    haloPSAInstanceURLError: boolean;
    haloPSACurrentUser: string;
    haloPSALoading: boolean = false;

    /**** user guide ****** */
    mergeTagForGuide: any;
    socialContactsNames: string[] = ['HUBSPOT', 'MARKETO', 'microsoft', 'pipedrive', 'connectWise', 'haloPSA'];
    constructor(private fileUtil: FileUtil, public socialPagerService: SocialPagerService, public referenceService: ReferenceService, public authenticationService: AuthenticationService,
        public contactService: ContactService, public regularExpressions: RegularExpressions, public paginationComponent: PaginationComponent,
        private fb: FormBuilder, private changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute, public properties: Properties,
        private router: Router, public pagination: Pagination, public xtremandLogger: XtremandLogger, public countryNames: CountryNames, private hubSpotService: HubSpotService, public userService: UserService,
        public callActionSwitch: CallActionSwitch, private vanityUrlService: VanityURLService, public integrationService: IntegrationService, private dashBoardService: DashboardService) {
        this.loggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();
        this.pageNumber = this.paginationComponent.numberPerPage[0];
        this.addContactuser.country = (this.countryNames.countries[0]);

        let currentUrl = this.router.url;
        if (currentUrl.includes('home/contacts')) {
            this.isPartner = false;
            this.module = "contacts";
            this.checkingContactTypeName = "Contact"
            this.mergeTagForGuide = "import_contact_lists_from_csv";
        } else if (currentUrl.includes('home/assignleads')) {
            this.isPartner = false;
            this.assignLeads = true;
            this.checkingContactTypeName = "Share Lead"
            this.module = "leads";
            this.mergeTagForGuide = "import_share_leads_lists_from_csv";
        }
        else {
            this.isPartner = true;
            this.checkingContactTypeName = "Partner";
            this.module = "partners";
        }


        this.contacts = new Array<User>();
        this.newUsers = new Array<User>();
        this.socialUsers = new Array<User>();
        this.clipboardUsers = new Array<User>();
        this.socialContact = new SocialContact();
        this.zohoContact = new ZohoContact();
        this.socialContact.socialNetwork = "";
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
        this.model.contactListName = '';
        this.model.isPublic = true;
        this.userName = '';
        this.password = '';
        this.contactType = '';
        let self = this;
        this.uploader.onBuildItemForm = function (fileItem: any, form: FormData) {
            this.xtremandLogger.info("addContacts.component onBuildItemForm" + self.model.contactListName);
            form.append('userListName', "" + self.model.contactListName);
            return { fileItem, form }
        };
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            var responsePath = response;
            this.xtremandLogger.info("addContacts.component onCompleteItem:" + responsePath);// the url will be in the response
            if (this.assignLeads) {
                this.router.navigateByUrl('/home/assignLeads/manage')
            } else if (this.isPartner == false && !this.assignLeads) {
                this.router.navigateByUrl('/home/contacts/manage')
            } else {
                this.router.navigateByUrl('home/partners/manage')
            }
        };
        this.parentInput = {};
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let campaginAccessDto = currentUser.campaignAccessDto;
        if (campaginAccessDto != undefined) {
            this.companyId = campaginAccessDto.companyId;
        }

    }

    validateContactName(contactName: string) {
        this.noOptionsClickError = false;
        this.contactListNameError = false;
        let lowerCaseContactName = $.trim(contactName.toLowerCase().replace(/\s/g, ''));
        const activeMasterPartnerList = $.trim(this.properties.activeMasterPartnerList.toLowerCase().replace(/\s/g, ''));
        const inActiveMasterPartnerList = $.trim(this.properties.inActiveMasterPartnerList.toLowerCase().replace(/\s/g, ''));
        var list = this.names;
        this.xtremandLogger.log(list);
        if (lowerCaseContactName == null || lowerCaseContactName == '') {
            this.isValidContactName = true;
            $("button#sample_editable_1_new").prop('disabled', true);
            $(".ng-valid[required], .ng-valid.required").css("color", "red");
            this.invalidContactNameError = "Please add valid name";
        } else if ($.inArray(lowerCaseContactName, list) > -1) {
            this.isValidContactName = true;
            $("button#sample_editable_1_new").prop('disabled', true);
            $(".ng-valid[required], .ng-valid.required").css("color", "red");
            this.invalidContactNameError = this.checkingContactTypeName + " List name already exists";
        } else if (lowerCaseContactName == activeMasterPartnerList || lowerCaseContactName == inActiveMasterPartnerList) {
            this.isValidContactName = true;
            $("button#sample_editable_1_new").prop('disabled', true);
            $(".ng-valid[required], .ng-valid.required").css("color", "red");
            this.invalidContactNameError = this.checkingContactTypeName + " List name cannot be added";
        } else {
            $(".ng-valid[required], .ng-valid.required").css("color", "Black");
            this.isValidContactName = false;
            this.invalidContactNameError = "";
            this.validateLegalBasisOptions();
        }
    }

    checked(event: boolean) {
        this.xtremandLogger.info("selected check value" + event)
        this.newUsers.forEach((contacts) => {
            if (event == true)
                contacts.isChecked = true;
            else
                contacts.isChecked = false;
        })
    }

    changEvent(event: any) {
        this.uploadvalue = false;
    }

    changEvents(event: any) {
        this.uploadvalue = false;
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
        //files[0].type == "application/vnd.ms-excel" || files[0].type == "text/csv" || files[0].type == "text/x-csv" ||
        if (this.fileUtil.isCSVFile(files[0])) {
            this.isListLoader = true;
            var outputstring = files[0].name.substring(0, files[0].name.lastIndexOf("."));
            this.selectedAddContactsOption = 2;
            this.paginationType = "csvContacts";
            this.noOptionsClickError = false;
            this.uploadedCsvFileName = files[0].name;
            if (!this.model.contactListName) {
                this.model.contactListName = outputstring;
            }
            this.validateContactName(this.model.contactListName);
            this.validateLegalBasisOptions();
            this.removeCsvName = true;
            // $( "button#sample_editable_1_new" ).prop( 'disabled', false );
            $("#file_preview").show();
            $("button#cancel_button").prop('disabled', false);
            $('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            $('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            $('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            $('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            $('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            $('.microsoftImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            $('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            $('.connectWiseImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            $('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            $('.haloPSAImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            $('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
            $('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px; left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
            $('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
            $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
            let reader = new FileReader();
            reader.readAsText(files[0]);
            this.xtremandLogger.info(files[0]);
            var lines = new Array();
            var self = this;
            reader.onload = function (e: any) {
                var contents = e.target.result;

                let csvData = reader.result;
                let csvRecordsArray = csvData.split(/\r|\n/);
                let headersRow = self.fileUtil
                    .getHeaderArray(csvRecordsArray);
                let headers = headersRow[0].split(',');
                if ((headers.length == 11)) {
                    if (self.validateHeaders(headers)) {
                        var csvResult = Papa.parse(contents);

                        var allTextLines = csvResult.data;
                        for (var i = 1; i < allTextLines.length; i++) {
                            // var data = allTextLines[i].split( ',' );
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
                                /*user.description = allTextLines[i][9];*/
                                self.contacts.push(user);
                            }
                        }
                        self.setPage(1);
                        self.isListLoader = false;

                        if (self.contacts.length === 0) {
                            self.isValidLegalOptions = true;
                            self.customResponse = new CustomResponse('ERROR', "No contacts found.", true);
                        }



                    } else {
                        self.customResponse = new CustomResponse('ERROR', "Invalid Csv", true);
                        self.isListLoader = false;
                        self.cancelContacts();
                    }
                } else {
                    self.customResponse = new CustomResponse('ERROR', "Invalid Csv", true);
                    self.isListLoader = false;
                    self.cancelContacts();
                }

            }
        } else {
            this.customResponse = new CustomResponse('ERROR', this.properties.FILE_TYPE_ERROR, true);
            $("#file_preview").hide();
            this.model.contactListName = null;
            this.removeCsvName = false;
            this.uploader.queue.length = 0;
            this.selectedAddContactsOption = 8;
        }
    }
    validateHeaders(headers) {
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
        this.paginationType = "csvContacts";
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
                this.clipboardUsers.length = 0;
                this.contacts.length = 0;
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
                this.selectedAddContactsOption = 1;
                this.xtremandLogger.info(user);
                this.clipboardUsers.push(user);
                self.contacts.push(user);
                this.setPage(1);
                $("button#sample_editable_1_new").prop('disabled', false);
                $("#file_preview").show();
                this.valilClipboardUsers = true;
            }
            var endTime = new Date();
            $("#clipBoardValidationMessage").append("<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing started at: <b>" + startTime + "</b></h5>");
            $("#clipBoardValidationMessage").append("<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Processing Finished at: <b>" + endTime + "</b></h5>");
            $("#clipBoardValidationMessage").append("<h5 style='color:#07dc8f;'><i class='fa fa-check' aria-hidden='true'></i>" + "Total Number of records Found: <b>" + allTextLines.length + "</b></h5>");
        } else {
            $("button#sample_editable_1_new").prop('disabled', true);
            $("#clipBoardValidationMessage").show();
            $("#file_preview").hide();
        }
        this.xtremandLogger.info(this.clipboardUsers);
    }

    validateEmailAddress(emailId: string) {
        var EMAIL_ID_PATTERN = this.regularExpressions.EMAIL_ID_PATTERN;
        return EMAIL_ID_PATTERN.test(emailId);
    }
    validateName(name: string) {
        return (name.trim().length > 0);
    }
    validateEmail(emailId: string) {
        if (this.validateEmailAddress(emailId)) {
            this.checkingForEmail = true;
            this.validEmailPatternSuccess = true;
        }
        else {
            this.checkingForEmail = false;
        }
    }

    checkingEmailPattern(emailId: string) {
        this.validEmailPatternSuccess = false;
        if (this.validateEmailAddress(emailId)) {
            this.validEmailPatternSuccess = true;
            this.emailNotValid = true;
            $("button#sample_editable_1_new").prop('disabled', false);
        } else {
            this.validEmailPatternSuccess = false;
            this.emailNotValid = false;
            $("button#sample_editable_1_new").prop('disabled', true);
        }
    }

    checkingRowEails(a: boolean, b: boolean, c: boolean) {
        this.emailNotValid = false;
        if (a == true) {
            this.validEmailPatternSuccess = true;
            $("button#sample_editable_1_new").prop('disabled', false);
        } else {
            this.validEmailPatternSuccess = false;
            $("button#sample_editable_1_new").prop('disabled', true);
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
        if (this.contactOption == 'oneAtTime') {
            this.oneAtTimeSaveAfterGotPermition();
        } else if (this.contactOption == 'clipBoard') {
            this.saveClipBoardContactsAfterGotPermition();
        } else if (this.contactOption == 'csvContacts') {
            this.saveCsvContactsWithPermission();
        } else if (this.contactOption == 'googleContacts') {
            this.contactType = "CONTACT";
            this.saveExternalContactsWithPermission('GOOGLE');
        } else if (this.contactOption == 'googleSelectedContacts') {
            this.saveExternalSelectedContactsWithPermission();
        } else if (this.contactOption == 'zohoContacts') {
            this.contactType = "CONTACT";
            this.saveExternalContactsWithPermission('ZOHO');
        } else if (this.contactOption == 'zohoSelectedContacts') {
            this.saveExternalSelectedContactsWithPermission();
        } else if (this.contactOption == 'salesForceContacts') {
            this.saveExternalContactsWithPermission('SALESFORCE');
        } else if (this.contactOption == 'salesforceSelectedContacts') {
            this.saveExternalSelectedContactsWithPermission();
        } else if (this.contactOption == 'marketoContacts') {
            this.contactType = "CONTACT";
            this.saveExternalContactsWithPermission('MARKETO');
        } else if (this.contactOption == 'marketoSelectedContacts') {
            this.saveExternalSelectedContactsWithPermission();
        } else if (this.contactOption == 'hubSpotContacts') {
            this.saveExternalContactsWithPermission('HUBSPOT');
        } else if (this.contactOption == 'hubSpotSelectedContacts') {
            this.saveExternalSelectedContactsWithPermission();
        } else if (this.contactOption == 'microsoftContacts') {
            this.contactType = "CONTACT";
            this.saveExternalContactsWithPermission('microsoft');
        } else if (this.contactOption == 'microsoftSelectedContacts') {
            this.saveExternalSelectedContactsWithPermission();
        } else if (this.contactOption == 'pipedriveContacts') {
            this.contactType = "CONTACT";
            this.saveExternalContactsWithPermission('pipedrive');
        } else if (this.contactOption == 'pipedriveSelectedContacts') {
            this.saveExternalSelectedContactsWithPermission();
        } else if (this.contactOption == 'connectWiseContacts') {
            this.contactType = "CONTACT";
            this.saveExternalContactsWithPermission('connectWise');
        } else if (this.contactOption == 'connectWiseSelectedContacts') {
            this.saveExternalSelectedContactsWithPermission();
        }else if (this.contactOption == 'haloPSAContacts') {
            this.contactType = "CONTACT";
            this.saveExternalContactsWithPermission('haloPSA');
        } else if (this.contactOption == 'haloPSASelectedContacts') {
            this.saveExternalSelectedContactsWithPermission();
        }
    }

    navigateToTermsOfUse() {
        window.open(this.properties.termsOfServiceUrl, "_blank");
    }

    navigateToPrivacy() {
        window.open(this.properties.privacyPolicyUrl, "_blank");
    }

    navigateToGDPR() {
        window.open(this.properties.gdprUrl, "_blank");
    }

    navigateToCCPA() {
        window.open(this.properties.ccpaUrl, "_blank");
    }

    saveContactList() {
        this.duplicateEmailIds = [];
        var testArray = [];
        for (var i = 0; i <= this.newUsers.length - 1; i++) {
            testArray.push(this.newUsers[i].emailId.toLowerCase());
        }

        var newArray = this.compressArray(testArray);
        for (var w = 0; w < newArray.length; w++) {
            if (newArray[w].count >= 2) {
                this.duplicateEmailIds.push(newArray[w].value);
            }
        }
        this.xtremandLogger.log("DUPLICATE EMAILS" + this.duplicateEmailIds);
        var valueArr = this.newUsers.map(function (item) { return item.emailId.toLowerCase() });
        var isDuplicate = valueArr.some(function (item, idx) {
            return valueArr.indexOf(item) != idx
        });
        this.isDuplicateEmailId = isDuplicate;
        this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');

        if (!this.assignLeads && this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ') {
            this.xtremandLogger.info(this.newUsers[0].emailId.toLowerCase());
            if (this.newUsers[0].emailId != undefined) {
                if (!isDuplicate) {
                    this.saveValidEmails();
                    $("button#sample_editable_1_new").prop('disabled', false);
                } else {
                    this.customResponse = new CustomResponse('ERROR', "please remove duplicate email id(s) " + "'" + this.duplicateEmailIds + "'", true);
                    $("button#sample_editable_1_new").prop('disabled', false);
                }
            } else {
                this.xtremandLogger.error("AddContactComponent saveContactList() ContactListName Error");
            }

        }
        else if (this.assignLeads && this.model.contactListName != '' && !this.isValidContactName) {
            if (this.newUsers[0].emailId != undefined) {
                if (!isDuplicate) {
                    this.saveValidEmails();
                    $("button#sample_editable_1_new").prop('disabled', false);
                } else {
                    this.customResponse = new CustomResponse('ERROR', "please remove duplicate email id(s) " + "'" + this.duplicateEmailIds + "'", true);
                    $("button#sample_editable_1_new").prop('disabled', false);
                }
            } else {
                this.xtremandLogger.error("AddContactComponent saveContactList() ContactListName Error");
            }

        }
        else if (this.validEmailPatternSuccess === false) {
            this.emailNotValid = true;
            this.contactListNameError = false;
            this.noOptionsClickError = false;
        }
        else {
            if (this.isValidContactName == false) {
                this.contactListNameError = true;
            }
            this.xtremandLogger.error("AddContactComponent saveContactList() ContactListName Error");
        }
    }


    saveValidEmails() {
        try {
            this.xtremandLogger.info("update contacts #contactSelectedListId " + " data => " + JSON.stringify(this.newUsers));
            for (var i = 0; i < this.newUsers.length; i++) {
                this.newUsers[i].emailId = this.convertToLowerCase(this.newUsers[i].emailId);

                if (this.newUsers[i].country === "Select Country") {
                    this.newUsers[i].country = null;
                }

                if (this.newUsers[i].mobileNumber) {
                    if (this.newUsers[i].mobileNumber.length < 6) {
                        this.newUsers[i].mobileNumber = "";
                    }
                }
            }
            this.contactListObject = new ContactList;
            this.contactListObject.name = this.model.contactListName;
            this.contactListObject.isPartnerUserList = this.isPartner;

            if (this.assignLeads) {
                this.contactListObject.publicList = true;
            }

            this.askForPermission('oneAtTime');

        } catch (error) {
            this.xtremandLogger.error(error, "addcontactComponent", "Save Contacts");
        }
    }


    oneAtTimeSaveAfterGotPermition() {

        if (this.assignLeads) {
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.newUsers, this.model.contactListName, this.isPartner, true,
                "CONTACT", "MANUAL", this.alias, false);
            this.saveAssignedLeadsList();
        } else {

            this.loading = true;
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.newUsers, this.model.contactListName, this.isPartner, this.model.isPublic,
                "CONTACT", "MANUAL", this.alias, false);
            this.contactService.saveContactList(this.userUserListWrapper)
                .subscribe(
                    data => {
                        if (data.access) {
                            data = data;
                            this.loading = false;
                            if (data.statusCode === 401) {
                                this.customResponse = new CustomResponse('ERROR', data.message, true);
                                this.socialUsers = [];
                            } else if (data.statusCode === 402) {
                                this.customResponse = new CustomResponse('ERROR', data.message + '<br>' + data.data, true);
                                this.socialUsers = [];
                            } else {
                                this.selectedAddContactsOption = 8;
                                this.xtremandLogger.info("update Contacts ListUsers:" + data);
                                this.contactService.successMessage = true;
                                this.contactService.saveAsSuccessMessage = "add";
                                if (this.isPartner == false) {
                                    this.router.navigateByUrl('/home/contacts/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                } else {
                                    this.router.navigateByUrl('home/partners/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                }
                            }
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },
                    (error: any) => {
                        this.loading = false;
                        if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
                            this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                        } else {
                            this.xtremandLogger.errorPage(error);
                        }
                        this.xtremandLogger.error(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveacontact() finished")
                )
        }
    }

    saveAssignedLeadsList() {
        this.loading = true;
        this.contactService.saveAssignedLeadsList(this.userUserListWrapper)
            .subscribe(
                data => {
                    if (data.access) {
                        data = data;
                        this.loading = false;
                        if (data.statusCode === 401) {
                            this.customResponse = new CustomResponse('ERROR', data.message, true);
                            this.socialUsers = [];
                        } else if (data.statusCode === 402) {
                            this.customResponse = new CustomResponse('ERROR', data.message + '<br>' + data.data, true);
                            this.socialUsers = [];
                        } else {
                            this.selectedAddContactsOption = 8;
                            this.xtremandLogger.info("update Contacts ListUsers:" + data);
                            this.contactService.successMessage = true;
                            this.contactService.saveAsSuccessMessage = "add";
                            if (this.isPartner == false) {
                                this.router.navigateByUrl('/home/assignleads/manage')
                                localStorage.setItem('isZohoSynchronization', 'no');
                                localStorage.removeItem('isZohoSynchronization');
                            }
                        }

                    } else {
                        this.authenticationService.forceToLogout();
                        localStorage.removeItem('isZohoSynchronization');
                    }
                },
                (error: any) => {
                    this.loading = false;
                    if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
                        this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                    } else {
                        this.xtremandLogger.errorPage(error);
                    }
                    this.xtremandLogger.error(error);
                },
                () => this.xtremandLogger.info("addcontactComponent saveAssignedLeadsList() finished")
            )
    }

    saveClipBoardContactList() {
        this.clipboardShowPreview();
        this.duplicateEmailIds = [];
        var testArray = [];
        for (var i = 0; i <= this.clipboardUsers.length - 1; i++) {
            testArray.push(this.clipboardUsers[i].emailId.toLowerCase());
        }
        for (var j = 0; j <= this.clipboardUsers.length - 1; j++) {
            if (this.validateEmailAddress(this.clipboardUsers[j].emailId)) {
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
        }
        this.xtremandLogger.log("DUPLICATE EMAILS" + this.duplicateEmailIds);
        $("button#sample_editable_1_new").prop('disabled', true);
        if (this.model.contactListName.trim().length == 0) {
            $("#clipBoardValidationMessage > h4").empty();
            $("#clipBoardValidationMessage").append("<h4 style='color:#f68a55;'>Please Enter the Contact List Name</h4>");
        } else {
            var valueArr = this.clipboardUsers.map(function (item) { return item.emailId.toLowerCase() });
            var isDuplicate = valueArr.some(function (item, idx) {
                return valueArr.indexOf(item) != idx
            });
            this.isDuplicateEmailId = isDuplicate;
            if (this.invalidPattenMail === true) {
                $("#clipBoardValidationMessage").append("<h4 style='color:#f68a55;'>" + "Email Address is not valid" + "</h4>");
                testArray.length = 0;
            }
            if (this.valilClipboardUsers == true) {
                if (!isDuplicate) {
                    this.saveClipboardValidEmails();
                } else {
                    this.customResponse = new CustomResponse('ERROR', "please remove duplicate email id(s) " + "'" + this.duplicateEmailIds + "'", true);
                    $("button#sample_editable_1_new").prop('disabled', false);
                }
            }
        }
    }

    saveClipboardValidEmails() {
        try {
            for (var i = 0; i < this.clipboardUsers.length; i++) {
                this.clipboardUsers[i].emailId = this.convertToLowerCase(this.clipboardUsers[i].emailId);

                if (this.clipboardUsers[i].country === "Select Country") {
                    this.clipboardUsers[i].country = null;
                }

                /* if ( this.clipboardUsers[i].mobileNumber.length < 6 ) {
                     this.clipboardUsers[i].mobileNumber = "";
                 }*/
            }
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
            this.contactListObject = new ContactList;
            this.contactListObject.name = this.model.contactListName;
            this.contactListObject.isPartnerUserList = this.isPartner;
            if (this.assignLeads) {
                this.contactListObject.publicList = true;
            }
            if (this.model.contactListName != ' ') {

                this.askForPermission('clipBoard');

            }
        } catch (error) {
            this.xtremandLogger.error(error, "addcontactComponent saveClipboardContact()")
        }
    }

    saveClipBoardContactsAfterGotPermition() {
        if (this.assignLeads) {
            this.setLegalBasisOptions(this.clipboardUsers);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.clipboardUsers, this.model.contactListName, this.isPartner, true,
                "CONTACT", "MANUAL", this.alias, false);
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.xtremandLogger.info("update contacts #contactSelectedListId " + " data => " + JSON.stringify(this.clipboardUsers));
            this.setLegalBasisOptions(this.clipboardUsers);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.clipboardUsers, this.model.contactListName, this.isPartner, this.model.isPublic,
                "CONTACT", "MANUAL", this.alias, false);
            this.contactService.saveContactList(this.userUserListWrapper)
                .subscribe(
                    data => {
                        if (data.access) {
                            data = data;
                            this.loading = false;
                            if (data.statusCode === 401) {
                                this.customResponse = new CustomResponse('ERROR', data.message, true);
                                this.socialUsers = [];
                            } else if (data.statusCode === 402) {
                                this.customResponse = new CustomResponse('ERROR', data.message + '<br>' + data.data, true);
                                this.socialUsers = [];
                            } else {
                                this.selectedAddContactsOption = 8;
                                this.contactService.saveAsSuccessMessage = "add";
                                this.xtremandLogger.info("update Contacts ListUsers:" + data);
                                this.disableOtherFuctionality = false;
                                if (this.isPartner == false) {
                                    this.router.navigateByUrl('/home/contacts/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                } else {
                                    this.router.navigateByUrl('home/partners/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                }
                            }
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },
                    (error: any) => {
                        this.loading = false;
                        if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
                            this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                        } else {
                            this.xtremandLogger.errorPage(error);
                        }
                        this.xtremandLogger.error(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveacontact() finished")
                )
        }
    }

    saveCsvContactList() {
        try {
            this.duplicateEmailIds = [];
            this.invalidPatternEmails.length = 0;
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ') {
                if (this.contacts.length > 0) {
                    for (let i = 0; i < this.contacts.length; i++) {
                        if (!this.validateEmailAddress(this.contacts[i].emailId)) {
                            this.invalidPatternEmails.push(this.contacts[i].emailId)
                        }
                        if (this.validateEmailAddress(this.contacts[i].emailId)) {
                            this.validCsvContacts = true;
                        }
                        else {
                            this.validCsvContacts = false;
                        }
                    }
                    if (this.validCsvContacts == true && this.invalidPatternEmails.length == 0) {
                        for (var i = 0; i < this.contacts.length; i++) {
                            this.contacts[i].emailId = this.convertToLowerCase(this.contacts[i].emailId);

                            if (this.contacts[i].country === "Select Country") {
                                this.contacts[i].country = null;
                            }

                            var testArray = [];
                            for (var i = 0; i <= this.contacts.length - 1; i++) {
                                testArray.push(this.contacts[i].emailId.toLowerCase());
                            }

                            var newArray = this.compressArray(testArray);
                            for (var w = 0; w < newArray.length; w++) {
                                if (newArray[w].count >= 2) {
                                    this.duplicateEmailIds.push(newArray[w].value);
                                }
                            }
                            this.xtremandLogger.log("DUPLICATE EMAILS" + this.duplicateEmailIds);
                            var valueArr = this.contacts.map(function (item) { return item.emailId.toLowerCase() });
                            var isDuplicate = valueArr.some(function (item, idx) {
                                return valueArr.indexOf(item) != idx
                            });
                            this.isDuplicateEmailId = isDuplicate;
                        }
                        if (!isDuplicate) {
                            this.xtremandLogger.info("update contacts #contactSelectedListId " + " data => " + JSON.stringify(this.contacts));
                            this.contactListObject = new ContactList;
                            this.contactListObject.name = this.model.contactListName;
                            this.contactListObject.isPartnerUserList = this.isPartner;

                            if (this.assignLeads) {
                                this.contactListObject.publicList = true;
                            }

                            this.askForPermission('csvContacts');

                        } else {
                            this.customResponse = new CustomResponse('ERROR', "please remove duplicate email id(s) " + "'" + this.duplicateEmailIds + "'", true);
                        }
                    } else {
                        this.loading = false;
                        this.customResponse = new CustomResponse('ERROR', "'" + this.invalidPatternEmails + "'" + " are not valid email id(s) please remove", true);
                    }
                } else
                    this.xtremandLogger.error("AddContactComponent saveCsvContactList() Contacts Null Error");
            }
            else {
                if (this.isValidContactName == false) {
                    this.contactListNameError = true;
                }
                this.loading = false;
                this.xtremandLogger.error("AddContactComponent saveCsvContactList() ContactListName Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "addcontactComponent saveCSVContact()")
        }
    }

    saveCsvContactsWithPermission() {
        if (this.assignLeads) {
            this.setLegalBasisOptions(this.contacts);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.contacts, this.model.contactListName, this.isPartner, true,
                "CONTACT", "MANUAL", this.alias, false);
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.setLegalBasisOptions(this.contacts);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.contacts, this.model.contactListName, this.isPartner, this.model.isPublic,
                "CONTACT", "MANUAL", this.alias, false);
            this.contactService.saveContactList(this.userUserListWrapper)
                .subscribe(
                    data => {
                        if (data.access) {
                            data = data;
                            this.loading = false;
                            if (data.statusCode === 401) {
                                this.customResponse = new CustomResponse('ERROR', data.message, true);
                                this.socialUsers = [];
                            } else if (data.statusCode === 402) {
                                this.customResponse = new CustomResponse('ERROR', data.message + '<br>' + data.data, true);
                                this.socialUsers = [];
                            } else {
                                this.selectedAddContactsOption = 8;
                                this.xtremandLogger.info("update Contacts ListUsers:" + data);
                                this.contactService.saveAsSuccessMessage = "add";
                                this.uploadedCsvFileName = "";
                                if (this.isPartner == false) {
                                    this.router.navigateByUrl('/home/contacts/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                } else {
                                    this.router.navigateByUrl('home/partners/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                }
                            }
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },
                    (error: any) => {
                        if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
                            this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                        } else {
                            this.xtremandLogger.errorPage(error);
                        }
                        this.xtremandLogger.error(error);
                        this.loading = false;
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveCsvContactList() finished")
                )
        }
    }

    validateLegalBasisOptions() {
        this.isValidLegalOptions = true;
        if (this.selectedAddContactsOption > 0) {
            if (this.gdprStatus && this.selectedLegalBasisOptions.length == 0) {
                this.isValidLegalOptions = false;
                if (this.isValidContactName) {
                    $('#sample_editable_1_new').prop("disabled", true);
                } else {
                    $('#sample_editable_1_new').prop("disabled", false);
                }

            } else {
                $('#sample_editable_1_new').prop("disabled", false);
            }
        } else {
            if (this.isValidContactName) {
                $('#sample_editable_1_new').prop("disabled", true);
            } else {
                $('#sample_editable_1_new').prop("disabled", false);
            }
        }
    }

    saveContacts() {
        this.validateLegalBasisOptions();
        if (this.isValidLegalOptions) {
            this.noOptionsClickError = false;
            if (this.selectedAddContactsOption == 0) {
                this.saveContactList();
            }

            if (this.selectedAddContactsOption == 1) {
                this.saveClipBoardContactList();
            }

            if (this.selectedAddContactsOption == 2) {
                this.saveCsvContactList();
            }
            if (this.selectedAddContactsOption == 3) {
                if (this.allselectedUsers.length == 0) {
                    this.saveSalesforceContacts();
                } else
                    this.saveSalesforceContactSelectedUsers();
            }

            if (this.selectedAddContactsOption == 4) {
                if (this.allselectedUsers.length == 0) {
                    this.saveGoogleContacts();
                } else
                    this.saveGoogleContactSelectedUsers();
            }

            if (this.selectedAddContactsOption == 5) {
                if (this.allselectedUsers.length == 0) {
                    this.saveZohoContacts();
                } else
                    this.saveZohoContactSelectedUsers();
            }
            if (this.selectedAddContactsOption == 6) {
                if (this.allselectedUsers.length == 0) {
                    this.saveMarketoContacts();
                } else
                    this.saveMarketoContactSelectedUsers();
            }


            if (this.selectedAddContactsOption == 9) {
                if (this.allselectedUsers.length == 0) {
                    this.saveHubSpotContacts();
                } else {
                    this.saveHubSpotContactSelectedUsers();
                }
            }

            if (this.selectedAddContactsOption == 10) {
                if (this.allselectedUsers.length == 0) {
                    this.saveExternalContacts('microsoft');
                } else {
                    this.saveExternalContactSelectedUsers('microsoft');
                }
            }

            if (this.selectedAddContactsOption == 11) {
                if (this.allselectedUsers.length == 0) {
                    this.saveExternalContacts('pipedrive');
                } else {
                    this.saveExternalContactSelectedUsers('pipedrive');
                }
            }

            if (this.selectedAddContactsOption == 12) {
                if (this.allselectedUsers.length == 0) {
                    this.saveExternalContacts('connectWise');
                } else {
                    this.saveExternalContactSelectedUsers('connectWise');
                }
            }

            if (this.selectedAddContactsOption == 13) {
                if (this.allselectedUsers.length == 0) {
                    this.saveExternalContacts('haloPSA');
                } else {
                    this.saveExternalContactSelectedUsers('haloPSA');
                }
            }

            if (this.selectedAddContactsOption == 8) {
                this.noOptionsClickError = true;
            }
        }

    }

    cancelContacts() {
        this.contactListNameError = false;
        this.noOptionsClickError = false;
        this.isValidContactName = false;
        this.emailNotValid = false;
        this.loading = false;
        this.socialContactUsers.length = 0;
        this.allselectedUsers.length = 0;
        this.selectedContactListIds.length = 0;
        this.disableOtherFuctionality = false;
        this.paginationType = "";
        if (this.selectedAddContactsOption != 2) {
            this.customResponse = new CustomResponse();
        }
        this.pager = [];
        this.pagedItems = [];

        this.uploadedCsvFileName = "";

        this.contactService.successMessage = false;
        $('.salesForceImageClass').attr('style', 'opacity: 1;');
        $('.googleImageClass').attr('style', 'opacity: 1;');
        $('.zohoImageClass').attr('style', 'opacity: 1;');
        $('.marketoImageClass').attr('style', 'opacity: 1;');
        $('.hubspotImageClass').attr('style', 'opacity: 1;');
        $('.microsoftImageClass').attr('style', 'opacity: 1;');
        $('.pipedriveImageClass').attr('style', 'opacity: 1;');
        $('.connectWiseImageClass').attr('style', 'opacity: 1;');
        $('.haloPSAImageClass').attr('style', 'opacity: 1;');
        $('.mdImageClass').attr('style', 'opacity: 1;cursor:not-allowed;');
        $('#SgearIcon').attr('style', 'opacity: 1;position: relative;font-size: 19px;top: -81px;left: 71px;');
        $('#GgearIcon').attr('style', 'opacity: 1;position: relative;font-size: 19px;top: -81px;left: 71px;');
        $('#ZgearIcon').attr('style', 'opacity: 1;position: relative;font-size: 19px;top: -81px;left: 71px;');
        $('#addContacts').attr('style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);');
        $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);');
        $('#uploadCSV').attr('style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);min-height:85px;border-radius: 3px');
        $("button#sample_editable_1_new").prop('disabled', true);
        $("button#cancel_button").prop('disabled', true);
        this.model.contactListName = "";
        $("#sample_editable_1").hide();
        $("#file_preview").hide();
        $('#copyFromclipTextArea').val('');
        $("#Gfile_preview").hide();
        this.newUsers.length = 0;
        this.contacts.length = 0;
        this.clipBoard = false;
        this.clipboardUsers.length = 0;
        this.selectedAddContactsOption = 8;
        this.filePreview = false;
        this.selectedLegalBasisOptions = [];
        this.isValidLegalOptions = true;
    }

    /*removeCsv() {
        this.selectedAddContactsOption = 8;
        this.contacts.length = 0;
        this.model.contactListName = "";
        this.isValidContactName = false;
        this.customResponse = new CustomResponse();
        $( '.mdImageClass' ).attr( 'style', 'opacity: 1;cursor:not-allowed;' );
        $( '#addContacts' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( '#copyFromClipBoard' ).attr( 'style', '-webkit-filter: grayscale(0%);filter: grayscale(0%);' );
        $( "button#sample_editable_1_new" ).prop( 'disabled', true );
        $( "#file_preview" ).hide();
        $( '.salesForceImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.googleImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '.zohoImageClass' ).attr( 'style', 'opacity: 1;' );
        $( '#SgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 100px;' );
        $( '#GgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 100px;' );
        $( '#ZgearIcon' ).attr( 'style', 'opacity: 1;position: relative;font-size: 19px;top: -83px;left: 100px;' );
    }*/

    addRow(event) {
        if (this.gdprStatus) {
            if (this.legalBasisOptions.length > 0) {
                let filteredLegalBasisOptions = $.grep(this.legalBasisOptions, function (e) { return event.legalBasis.indexOf(e.id) > -1 });
                let selectedLegalBasisOptionsArray = filteredLegalBasisOptions.map(function (a) { return a.name; });
                event.legalBasisString = selectedLegalBasisOptionsArray;
            }

        }
        this.newUsers.push(event);
        this.selectedAddContactsOption = 0;
        this.noOptionsClickError = false;
        $("#sample_editable_1").show();
        $("button#cancel_button").prop('disabled', false);
        $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
        $('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('.microsoftImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('.connectWiseImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('.haloPSAImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
        $('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
        $('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
        $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        this.addContactuser = new User();
        this.emailNotValid = false;
    }

    cancelRow(rowId: number) {
        if (rowId !== -1) {
            this.newUsers.splice(rowId, 1);
        }
    }

    copyFromClipboard() {
        this.resetResponse();
        this.noOptionsClickError = false;
        this.disableOtherFuctionality = true;
        this.clipboardTextareaText = "";
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
        $('.microsoftImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('.connectWiseImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('.haloPSAImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
        $('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
        $('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
        $('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
        $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');


    }

    googleContacts() {
        try {
            if (this.loggedInThroughVanityUrl) {
                this.googleVanityAuthentication();

            } else {
                if (this.selectedAddContactsOption == 8 && !this.disableOtherFuctionality) {
                    this.noOptionsClickError = false;
                    this.xtremandLogger.info("addContactComponent googlecontacts() login:");
                    this.socialContact.firstName = '';
                    this.socialContact.lastName = '';
                    this.socialContact.emailId = '';
                    this.socialContact.contactName = '';
                    this.socialContact.showLogin = true;
                    this.socialContact.jsonData = '';
                    this.socialContact.statusCode = 0;
                    this.socialContact.contactType = '';
                    this.socialContact.alias = '';
                    this.socialContact.socialNetwork = "GOOGLE";
                    this.contactService.socialProviderName = 'google';
                    this.xtremandLogger.info("socialContacts" + this.socialContact.socialNetwork);
                    let currentModule = "";
                    this.contactService.googleLogin(this.module)
                        .subscribe(
                            data => {
                                if (data.statusCode == 200) {
                                    console.log("AddContactComponent googleContacts() Authentication Success");
                                    this.getGoogleContactsUsers();
                                    this.xtremandLogger.info("called getGoogle contacts method:");
                                } else {
                                    this.setLValuesToLocalStorageAndReditectToLoginPage(this.socialContact, data);
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
                            () => this.xtremandLogger.log("AddContactsComponent() googleContacts() finished.")
                        );
                }
            }


        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent() googleContacts().")
        }
    }


    googleVanityAuthentication() {
        this.noOptionsClickError = false;
        this.xtremandLogger.info("addContactComponent googlecontacts() login:");
        this.socialContact.firstName = '';
        this.socialContact.lastName = '';
        this.socialContact.emailId = '';
        this.socialContact.contactName = '';
        this.socialContact.showLogin = true;
        this.socialContact.jsonData = '';
        this.socialContact.statusCode = 0;
        this.socialContact.contactType = '';
        this.socialContact.alias = '';
        this.socialContact.socialNetwork = "GOOGLE";
        this.contactService.socialProviderName = 'google';
        this.contactService.vanitySocialProviderName = 'google';
        this.xtremandLogger.info("socialContacts" + this.socialContact.socialNetwork);
        let currentModule = "";
        if (this.assignLeads) {
            currentModule = 'leads'
        } else {
            currentModule = 'contacts'
        }
        let providerName = 'google';
        this.contactService.googleLogin(currentModule)
            .subscribe(
                response => {
                    let data = response.data;
                    this.storeLogin = data;
                    if (response.statusCode == 200) {
                        console.log("AddContactComponent googleContacts() Authentication Success");
                        this.getGoogleContactsUsers();
                        this.xtremandLogger.info("called getGoogle contacts method:");
                    } else {
                        localStorage.setItem("userAlias", data.userAlias);
                        localStorage.setItem("currentModule", data.module);
                        localStorage.setItem("statusCode", data.statusCode);
                        localStorage.setItem('vanityUrlFilter', 'true');
                        this.googleCurrentUser = localStorage.getItem('currentUser');
                        const encodedData = window.btoa(this.googleCurrentUser);
                        const encodedUrl = window.btoa(data.redirectUrl);
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

    getGoogleContactsUsers() {
        try {
            swal({
                text: 'Retrieving contacts from google...! Please Wait...It\'s processing',
                allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
            });
            this.contactService.socialProviderName = 'google';
            this.socialContact.socialNetwork = "GOOGLE";
            this.socialContact.contacts = [];
            var self = this;
            this.contactService.getGoogleContacts(this.socialContact)
                .subscribe(
                    data => {
                        this.getGoogleConatacts = data;
                        swal.close();
                        if (!this.getGoogleConatacts.contacts) {
                            this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
                        } else {
                            for (var i = 0; i < this.getGoogleConatacts.contacts.length; i++) {
                                let socialContact = new SocialContact();
                                let user = new User();
                                socialContact.id = i;
                                if (this.validateEmailAddress(this.getGoogleConatacts.contacts[i].emailId)) {
                                    socialContact.emailId = this.getGoogleConatacts.contacts[i].emailId.trim();
                                    socialContact.firstName = this.getGoogleConatacts.contacts[i].firstName;
                                    socialContact.lastName = this.getGoogleConatacts.contacts[i].lastName;
                                    this.socialContactUsers.push(socialContact);
                                }
                                this.contactService.socialProviderName = "";
                                $("button#sample_editable_1_new").prop('disabled', false);
                                $("button#cancel_button").prop('disabled', false);
                                // $( "#Gfile_preview" ).show();
                                this.showFilePreview();
                                $('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
                                $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                                $('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.microsoftImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.connectWiseImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                                $('.haloPSAImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                                $('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                                $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                            }
                        }
                        this.xtremandLogger.info(this.getGoogleConatacts);
                        this.selectedAddContactsOption = 4;
                        this.setPage(1);
                        this.socialContact.contacts = this.socialContactUsers;
                    },
                    (error: any) => {
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.log("googleContacts data :" + JSON.stringify(this.getGoogleConatacts.contacts))
                );
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent googleContactsUsers().")
        }
    }

    setPage(page: number) {
        try {

            this.paginatedSelectedIds = [];

            if (page < 1 || page > this.pager.totalPages) {
                return;
            }

            if (this.paginationType == "csvContacts") {
                this.pager = this.socialPagerService.getPager(this.contacts.length, page, this.pageSize);
                this.pagedItems = this.contacts.slice(this.pager.startIndex, this.pager.endIndex + 1);
            } else {
                this.pager = this.socialPagerService.getPager(this.socialContactUsers.length, page, this.pageSize);
                this.pagedItems = this.socialContactUsers.slice(this.pager.startIndex, this.pager.endIndex + 1);

                var contactIds1 = this.pagedItems.map(function (a) { return a.id; });
                var items = $.grep(this.selectedContactListIds, function (element) {
                    return $.inArray(element, contactIds1) !== -1;
                });
                if (items.length == this.pager.pageSize || items.length == this.socialContactUsers.length || items.length == this.pagedItems.length) {
                    this.isHeaderCheckBoxChecked = true;
                } else {
                    this.isHeaderCheckBoxChecked = false;
                }

                for (let i = 0; i < items.length; i++) {
                    if (items) {
                        this.paginatedSelectedIds.push(items[i]);
                    }
                }
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent setPage().")
        }

    }

    validateSocialContacts(socialUsers: any) {
        let users = [];
        for (let i = 0; i < socialUsers.length; i++) {
            if (socialUsers[i].emailId) {
                if (socialUsers[i].emailId !== null && this.validateEmailAddress(socialUsers[i].emailId)) {
                    let email = socialUsers[i].emailId.toLowerCase();
                    socialUsers[i].emailId = email;
                    users.push(socialUsers[i]);
                }
            } else {
                if (socialUsers[i].email !== null && this.validateEmailAddress(socialUsers[i].email)) {
                    let email = socialUsers[i].email.toLowerCase();
                    socialUsers[i].emailId = email;
                    users.push(socialUsers[i]);
                }
            }
        }
        return users;
    }

    saveGoogleContacts() {
        try {
            this.socialContact.socialNetwork = "GOOGLE";
            this.socialContact.contactName = this.model.contactListName;
            this.socialContact.isPartnerUserList = this.isPartner;
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
            this.socialContact.contactType = "CONTACT";
            this.socialContact.contacts = this.validateSocialContacts(this.socialContactUsers);
            // this.socialContact.contacts = this.socialContactUsers;
            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ') {
                if (this.socialContactUsers.length > 0) {
                    this.askForPermission('googleContacts');
                } else
                    this.xtremandLogger.error("AddContactComponent saveGoogleContacts() Contacts Null Error");
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveGoogleContacts() ContactListName Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent SaveGoogleContacts().")
        }
    }

    saveGoogleContactsWithPermission() {
        if (this.assignLeads) {
            this.setSocialUsers(this.socialContact);
            this.setLegalBasisOptions(this.socialUsers);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.socialUsers, this.model.contactListName, this.isPartner, true,
                "CONTACT", "GOOGLE", this.alias, true);
            this.saveAssignedLeadsList();
        } else {

            this.loading = true;
            this.setLegalBasisOptions(this.socialContact.contacts);
            this.socialContact.publicList = this.model.isPublic;
            this.socialContact.moduleName = this.getModuleName();
            this.contactService.saveSocialContactList(this.socialContact)
                .subscribe(
                    data => {
                        if (data.access) {
                            data = data;
                            this.selectedAddContactsOption = 8;
                            this.loading = false;
                            this.contactService.saveAsSuccessMessage = "add";
                            this.xtremandLogger.info("update Contacts ListUsers:" + data);
                            if (this.isPartner == false) {
                                this.router.navigateByUrl('/home/contacts/manage');
                                localStorage.removeItem('isZohoSynchronization');
                            } else {
                                this.router.navigateByUrl('home/partners/manage');
                                localStorage.removeItem('isZohoSynchronization');
                            }
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },
                    (error: any) => {
                        this.loading = false;
                        if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
                            this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                        } else {
                            this.xtremandLogger.errorPage(error);
                        }
                        this.xtremandLogger.error(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveacontact() finished")
                )
        }
    }


    saveGoogleContactSelectedUsers() {
        try {
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
            this.xtremandLogger.info("SelectedUserIDs:" + this.allselectedUsers);
            this.allselectedUsers = this.validateSocialContacts(this.allselectedUsers);
            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0) {
                this.xtremandLogger.info("update contacts #contactSelectedListId " + " data => " + JSON.stringify(this.allselectedUsers));
                this.contactListObject = new ContactList;
                this.contactListObject.name = this.model.contactListName;
                this.contactListObject.isPartnerUserList = this.isPartner;

                this.askForPermission('googleSelectedContacts');

            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveGoogleContactSelectedUsers() ContactListName Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent savingGoogleSelectedUsers().")
        }
    }

    saveGoogleSelectedContactsWithPermission() {
        if (this.assignLeads) {
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, true,
                "CONTACT", "MANUAL", this.alias, false);
            this.setLegalBasisOptions(this.allselectedUsers);

            this.userUserListWrapper.users = this.allselectedUsers;
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.setLegalBasisOptions(this.allselectedUsers);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, this.model.isPublic,
                "CONTACT", "MANUAL", this.alias, false);
            this.contactService.saveContactList(this.userUserListWrapper)
                .subscribe(
                    data => {
                        if (data.access) {
                            this.loading = false;
                            if (data.statusCode === 401) {
                                this.customResponse = new CustomResponse('ERROR', data.message, true);
                                this.socialUsers = [];
                            } else if (data.statusCode === 402) {
                                this.customResponse = new CustomResponse('ERROR', data.message + '<br>' + data.data, true);
                                this.socialUsers = [];
                            } else {
                                this.selectedAddContactsOption = 8;
                                this.contactService.saveAsSuccessMessage = "add";
                                this.xtremandLogger.info("update Contacts ListUsers:" + data);
                                if (this.isPartner == false) {
                                    this.router.navigateByUrl('/home/contacts/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                } else {
                                    this.router.navigateByUrl('home/partners/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                }
                                this.contactService.successMessage = true;
                            }
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },
                    (error: any) => {
                        this.loading = false;
                        if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
                            this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                        } else {
                            this.xtremandLogger.errorPage(error);
                        }
                        this.xtremandLogger.error(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveacontact() finished")
                )
        }
    }

    checkAll(ev: any) {
        if (this.selectedAddContactsOption != 6 && this.selectedAddContactsOption != 9 && this.selectedAddContactsOption != 10 && this.selectedAddContactsOption != 11 && this.selectedAddContactsOption != 12) {
            if (ev.target.checked) {
                $('[name="campaignContact[]"]').prop('checked', true);
                let self = this;
                $('[name="campaignContact[]"]:checked').each(function () {
                    var id = $(this).val();
                    self.selectedContactListIds.push(parseInt(id));
                    self.paginatedSelectedIds.push(parseInt(id));
                    $('#ContactListTable_' + id).addClass('contact-list-selected');
                    for (var i = 0; i < self.pagedItems.length; i++) {
                        var object = {
                            "firstName": self.pagedItems[i].firstName,
                            "lastName": self.pagedItems[i].lastName,
                        }

                        if (self.pagedItems[i].email) {
                            object['emailId'] = self.pagedItems[i].email;
                        } else {
                            object['emailId'] = self.pagedItems[i].emailId;
                        }
                        if (self.pagedItems[i].contactCompany) {
                            object['contactCompany'] = self.pagedItems[i].contactCompany;
                        }
                        self.allselectedUsers.push(object);
                    }
                });
                this.allselectedUsers = this.removeDuplicates(this.allselectedUsers, 'emailId');
                this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
                this.paginatedSelectedIds = this.referenceService.removeDuplicates(this.paginatedSelectedIds);
            } else {
                $('[name="campaignContact[]"]').prop('checked', false);
                $('#user_list_tb tr').removeClass("contact-list-selected");
                if (this.pager.maxResults == this.pager.totalItems) {
                    this.selectedContactListIds = [];
                    this.paginatedSelectedIds = [];
                    this.allselectedUsers.length = 0;
                } else {
                    this.paginatedSelectedIds = [];
                    for (let j = 0; j < this.pagedItems.length; j++) {
                        var paginationEmail = this.pagedItems[j].emailId;
                        //this.allselectedUsers.splice( this.allselectedUsers.indexOf( paginationEmail ), 1 );
                        this.allselectedUsers = this.referenceService.removeRowsFromPartnerOrContactListByEmailId(this.allselectedUsers, paginationEmail);
                    }
                    let currentPageContactIds = this.pagedItems.map(function (a) { return a.id; });
                    this.selectedContactListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
                }
            }
            ev.stopPropagation();
        }
        else {
            this.checkAllForMarketo(ev);
        }
    }

    highlightRow(contactId: number, email: any, userEmail: any, firstName: any, lastName: any, event: any, company: any) {
        let isChecked = $('#' + contactId).is(':checked');
        if (isChecked) {
            $('#row_' + contactId).addClass('contact-list-selected');
            this.selectedContactListIds.push(contactId);
            this.paginatedSelectedIds.push(contactId);
            var object = {
                "firstName": firstName,
                "lastName": lastName,
                "contactCompany": company,
            }
            if (userEmail) {
                object['emailId'] = userEmail;
            } else {
                object['emailId'] = email;
            }
            this.allselectedUsers.push(object);
        } else {
            $('#row_' + contactId).removeClass('contact-list-selected');
            this.selectedContactListIds.splice($.inArray(contactId, this.selectedContactListIds), 1);
            this.paginatedSelectedIds.splice($.inArray(contactId, this.paginatedSelectedIds), 1);
            //this.allselectedUsers.splice( $.inArray( contactId, this.allselectedUsers ), 1 );
            this.allselectedUsers = this.referenceService.removeRowsFromPartnerOrContactListByEmailId(this.allselectedUsers, email);

        }
        if (this.paginatedSelectedIds.length == this.pagedItems.length) {
            this.isHeaderCheckBoxChecked = true;
        } else {
            this.isHeaderCheckBoxChecked = false;
        }
        event.stopPropagation();
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

    zohoContacts() {
        try {
            this.noOptionsClickError = false;
            let self = this;
            self.selectedZohoDropDown = $("select.opts:visible option:selected ").val();
            if (self.selectedZohoDropDown == "DEFAULT") {
                alert("Please Select the which you like to import from:");
                return false;
            }
            else {
                if (self.selectedZohoDropDown == "contact" || this.selectedZohoDropDown == "lead") {
                    self.contactType = self.selectedZohoDropDown;
                    self.xtremandLogger.log(self.selectedZohoDropDown);
                }
                this.xtremandLogger.log(this.userName);
                this.xtremandLogger.log(this.password);
                this.getZohoContacts(self.contactType, this.userName, this.password);
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent zohoContacts().")
        }
    }

    hideZohoModal() {
        $("#zohoShowLoginPopup").hide();
    }



    getZohoContacts(contactType: any, username: string, password: string) {
        try {
            this.socialContact.socialNetwork = "";
            var self = this;
            this.contactService.getZohoContacts(this.userName, this.password, this.contactType)
                .subscribe(
                    data => {
                        this.getZohoConatacts = data;
                        this.zohoImageBlur = false;
                        this.zohoImageNormal = true;
                        this.socialContactImage();
                        this.hideZohoModal();
                        if (this.getZohoConatacts.contacts) {
                            this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
                        } else {
                            for (var i = 0; i < this.getZohoConatacts.contacts.length; i++) {
                                let socialContact = new SocialContact();
                                let user = new User();
                                socialContact.id = i;
                                if (this.validateEmailAddress(this.getZohoConatacts.contacts[i].emailId)) {
                                    socialContact.emailId = this.getZohoConatacts.contacts[i].emailId.trim();
                                    socialContact.firstName = this.getZohoConatacts.contacts[i].firstName;
                                    socialContact.lastName = this.getZohoConatacts.contacts[i].lastName;
                                    this.socialContactUsers.push(socialContact);
                                }
                                $("button#sample_editable_1_new").prop('disabled', false);
                                $("button#cancel_button").prop('disabled', false);
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
                        this.xtremandLogger.info(this.getZohoConatacts);
                        this.selectedAddContactsOption = 5;
                        this.setPage(1);
                    },
                    (error: any) => {
                        var body = error['_body'];
                        if (body != "") {
                            var response = JSON.parse(body);
                            if (response.message == "Username or password is incorrect") {
                                this.zohoCredentialError = 'Username or password is incorrect';
                                /*setTimeout(() => {
                                    this.zohoCredentialError = '';
                                }, 5000 )*/
                            }
                            if (response.message == "Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!") {
                                this.zohoCredentialError = 'Maximum allowed AuthTokens are exceeded, Please remove Active AuthTokens from your ZOHO Account.!';
                                /*setTimeout(() => {
                                    this.zohoCredentialError = '';
                                }, 5000 )*/
                            } else {
                            }
                        } else {
                            this.xtremandLogger.errorPage(error);
                        }
                    },
                    () => this.xtremandLogger.log("googleContacts data :" + JSON.stringify(this.getZohoConatacts.contacts))
                );
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent GettingZohoContacts().")
        }
    }

    hideZohoAuthorisedPopup() {
        $('#zohoShowAuthorisedPopup').modal('hide');
        this.zohoErrorResponse = new CustomResponse();
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
                if (self.selectedZohoDropDown == "contact" || this.selectedZohoDropDown == "lead") {
                    self.contactType = self.selectedZohoDropDown;
                    self.xtremandLogger.log(self.selectedZohoDropDown);
                }
            }
            this.loading = true;
            this.socialContact.socialNetwork = "ZOHO";
            this.socialContact.contactType = self.contactType;
            this.hideZohoAuthorisedPopup();
            this.loading = true;
            this.contactService.getZohoAutherizedContacts(this.socialContact)
                .subscribe(
                    data => {
                        this.getZohoConatacts = data;
                        this.loading = false;
                        this.selectedAddContactsOption = 5;
                        if (!this.getZohoConatacts.contacts) {
                            this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
                        } else {
                            for (var i = 0; i < this.getZohoConatacts.contacts.length; i++) {
                                let socialContact = new SocialContact();
                                let user = new User();
                                socialContact.id = i;
                                if (this.validateEmailAddress(this.getZohoConatacts.contacts[i].emailId)) {
                                    socialContact.emailId = this.getZohoConatacts.contacts[i].emailId.trim();
                                    socialContact.firstName = this.getZohoConatacts.contacts[i].firstName;
                                    socialContact.lastName = this.getZohoConatacts.contacts[i].lastName;
                                    this.socialContactUsers.push(socialContact);
                                }
                                $("button#sample_editable_1_new").prop('disabled', false);
                                //$( "#Gfile_preview" ).show();
                                this.showFilePreview();
                                $("#myModal .close").click()
                                $("button#cancel_button").prop('disabled', false);
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
                        this.xtremandLogger.info(this.getZohoConatacts);
                        this.setPage(1);
                    },
                    (error: any) => {
                        this.loading = false;
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.log("googleContacts data :" + JSON.stringify(this.getZohoConatacts.contacts))
                );
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent GettingZohoContacts().")
        }
    }

    saveZohoContacts() {
        try {
            this.socialContact.socialNetwork = "ZOHO";
            this.socialContact.contactName = this.model.contactListName;
            this.socialContact.isPartnerUserList = this.isPartner;
            this.socialContact.contactType = this.contactType;
            this.socialContact.contacts = this.socialContactUsers;
            this.socialContact.contacts = this.validateSocialContacts(this.socialContactUsers);
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ') {

                if (this.socialContactUsers.length > 0) {

                    this.askForPermission('zohoContacts');

                } else
                    this.xtremandLogger.error("AddContactComponent saveZohoContacts() Contacts Null Error");
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveZohoContacts() ContactList Name Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent SaveZohoContacts().")
        }
    }

    saveZohoContactsWithPermission() {
        if (this.assignLeads) {
            this.setSocialUsers(this.socialContact);
            this.setLegalBasisOptions(this.socialUsers);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.socialUsers, this.model.contactListName, this.isPartner, true,
                this.contactType, "ZOHO", this.alias, true);
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.setLegalBasisOptions(this.socialContact.contacts);
            this.socialContact.publicList = this.model.isPublic;
            //  this.socialContact.contactType = 'CONTACT';//Added after oAuth2.0 implementation by Sravan
            this.socialContact.moduleName = this.getModuleName();
            this.contactService.saveSocialContactList(this.socialContact)
                .subscribe(
                    data => {
                        if (data.access) {
                            this.loading = false;
                            this.selectedAddContactsOption = 8;
                            this.contactService.saveAsSuccessMessage = "add";
                            this.xtremandLogger.info("update Contacts ListUsers:" + data);
                            if (!this.isPartner) {
                                localStorage.removeItem('isZohoSynchronization');
                                this.router.navigateByUrl('/home/contacts/manage')
                                localStorage.removeItem('isZohoSynchronization');
                            } else {
                                localStorage.removeItem('isZohoSynchronization');
                                this.router.navigateByUrl('home/partners/manage')
                                localStorage.removeItem('isZohoSynchronization');
                            }
                        } else {
                            localStorage.removeItem('isZohoSynchronization');
                            this.authenticationService.forceToLogout();

                        }
                    },

                    (error: any) => {
                        this.loading = false;
                        if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
                            this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                        } else {
                            this.xtremandLogger.errorPage(error);
                        }
                        this.xtremandLogger.error(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveZohoContact() finished")
                )
        }
    }

    saveZohoContactSelectedUsers() {
        try {
            this.xtremandLogger.info("SelectedUserIDs:" + this.allselectedUsers);
            this.allselectedUsers = this.validateSocialContacts(this.allselectedUsers);
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0) {
                this.xtremandLogger.info("update contacts #contactSelectedListId " + " data => " + JSON.stringify(this.allselectedUsers));

                this.contactListObject = new ContactList;
                this.contactListObject.name = this.model.contactListName;
                this.contactListObject.isPartnerUserList = this.isPartner;

                this.askForPermission('zohoSelectedContacts');

            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveZohoContactSelectedUsers() ContactList Name Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent SaveSelectedZohoContacts().")
        }
    }

    saveZohoSelectedContactsWithPermission() {
        if (this.assignLeads) {
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, true,
                "CONTACT", "MANUAL", this.alias, false);
            this.setLegalBasisOptions(this.allselectedUsers);
            this.userUserListWrapper.users = this.allselectedUsers;
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.setLegalBasisOptions(this.allselectedUsers);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, this.model.isPublic,
                "CONTACT", "MANUAL", this.alias, false);
            this.contactService.saveContactList(this.userUserListWrapper)
                .subscribe(
                    data => {
                        if (data.access) {
                            this.loading = false;
                            this.selectedAddContactsOption = 8;
                            this.contactService.saveAsSuccessMessage = "add";
                            this.xtremandLogger.info("update Contacts ListUsers:" + data);
                            if (this.isPartner == false) {
                                this.router.navigateByUrl('/home/contacts/manage')
                                localStorage.removeItem('isZohoSynchronization');
                            } else {
                                this.router.navigateByUrl('home/partners/manage')
                                localStorage.removeItem('isZohoSynchronization');
                            }
                            this.contactService.successMessage = true;
                            localStorage.removeItem('isZohoSynchronization');
                        } else {
                            localStorage.removeItem('isZohoSynchronization');
                            this.authenticationService.forceToLogout();

                        }
                    },

                    (error: any) => {
                        this.loading = false;
                        if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
                            this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                        } else {
                            this.xtremandLogger.errorPage(error);
                        }
                        this.xtremandLogger.error(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveZohoContactUsers() finished")
                )
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
            this.xtremandLogger.error(error, "AddContactsComponent SalesforceContactsDropdown().")
        }
    }

    onChangeZohoDropdown(event: Event) {
        try {
            this.contactType = event.target["value"];
            this.socialContact.contactType = event.target["value"];
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent SalesforceContactsDropdown().")
        }
    }

    showModal() {
        $('#ContactSalesForceModal').modal('show');
    }

    zohoShowModal() {
        $('#zohoShowAuthorisedPopup').modal('show');
    }

    hideModal() {
        $('#ContactSalesForceModal').modal('hide');
        /*$( '#salesforceModal' ).modal( 'hide' );
        $( 'body' ).removeClass( 'modal-open' );
        $( '.modal-backdrop fade in' ).remove();
        $( '#salesforceModal' ).appendTo( "body" ).modal( 'hide' );
        $( '#overlay-modal' ).hide();*/

    }

    salesforceContacts() {
        try {
            if (this.loggedInThroughVanityUrl) {
                this.salesForceVanityAuthentication();
            } else {
                if (this.selectedAddContactsOption == 8 && !this.disableOtherFuctionality) {
                    this.contactType = "";
                    this.noOptionsClickError = false;
                    this.socialContact.socialNetwork = "salesforce";
                    this.xtremandLogger.info("socialContacts" + this.socialContact.socialNetwork);
                    this.contactService.salesforceLogin(this.module)
                        .subscribe(
                            data => {
                                this.storeLogin = data;
                                if (data.statusCode == 200) {
                                    this.showModal();
                                    console.log("AddContactComponent salesforce() Authentication Success");
                                    this.checkingPopupValues();
                                } else {
                                    this.setLValuesToLocalStorageAndReditectToLoginPage(this.socialContact, data);
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
            this.xtremandLogger.error(error, "AddContactsComponent SalesforceContacts().")
        }
    }

    salesForceVanityAuthentication() {
        if (this.selectedAddContactsOption == 8 && !this.disableOtherFuctionality) {
            this.contactType = "";
            this.noOptionsClickError = false;
            this.socialContact.socialNetwork = "salesforce";
            this.contactService.socialProviderName = 'salesforce';
            this.contactService.vanitySocialProviderName = 'salesforce'; //Added by ajay for setting up social provider name when authenticating from vanity
            this.xtremandLogger.info("socialContacts" + this.socialContact.socialNetwork);
            let currentModule = "";
            if (this.assignLeads) {
                currentModule = 'leads'
            } else {
                currentModule = 'contacts'
            }
            let providerName = 'salesforce';
            this.contactService.salesforceLogin(currentModule)
                .subscribe(
                    response => {
                        let data = response.data;
                        if (response.statusCode == 200) {
                            this.showModal();
                            console.log("AddContactComponent salesforce() Authentication Success");
                            this.checkingPopupValues();
                        } else {
                            localStorage.setItem("userAlias", data.userAlias)
                            localStorage.setItem("currentModule", data.module)
                            localStorage.setItem('vanityUrlFilter', 'true');
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

    getSalesforceContacts(contactType: any) {
        try {
            this.socialContact.firstName = '';
            this.socialContact.lastName = '';
            this.socialContact.emailId = '';
            this.socialContact.contactName = '';
            this.socialContact.showLogin = true;
            this.socialContact.jsonData = '';
            this.socialContact.statusCode = 0;
            this.socialContact.contactType = '';
            this.socialContact.alias = '';
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
                        this.getSalesforceConatactList = data;
                        this.selectedAddContactsOption = 3;
                        if (!this.getSalesforceConatactList.contacts) {
                            if (this.getSalesforceConatactList.jsonData.includes("API_DISABLED_FOR_ORG")) {
                                this.customResponse = new CustomResponse('ERROR', "Salesforce REST API is not enabled, Please change your Salesforce platform settings.", true);
                            } else {
                                this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
                            }
                            this.selectedAddContactsOption = 8;
                            this.hideModal();
                        } else {
                            for (var i = 0; i < this.getSalesforceConatactList.contacts.length; i++) {
                                let socialContact = new SocialContact();
                                let user = new User();
                                socialContact.id = i;
                                if (this.validateEmailAddress(this.getSalesforceConatactList.contacts[i].emailId)) {
                                    socialContact.emailId = this.getSalesforceConatactList.contacts[i].emailId.trim();
                                    socialContact.firstName = this.getSalesforceConatactList.contacts[i].firstName;
                                    socialContact.lastName = this.getSalesforceConatactList.contacts[i].lastName;
                                    this.socialContactUsers.push(socialContact);
                                }
                                $("button#sample_editable_1_new").prop('disabled', false);
                                //  $( "#Gfile_preview" ).show();
                                this.showFilePreview();
                                this.setPage(1);

                                $("button#cancel_button").prop('disabled', false);
                                this.hideModal();
                                $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
                                $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                                $('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.microsoftImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.connectWiseImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                                $('.haloPSAImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                                $('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                            }
                        }
                        this.xtremandLogger.info(this.getSalesforceConatactList);
                    },
                    (error: any) => {
                        this.xtremandLogger.error(error);
                    },
                    () => this.xtremandLogger.log("addContactComponent getSalesforceContacts() Data:" + JSON.stringify(this.getSalesforceConatactList.contacts))
                );
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent GettingSalesforceContacts().")
        }
    }

    getSalesforceListViewContacts(contactType: any) {
        try {
            this.socialContact.firstName = '';
            this.socialContact.lastName = '';
            this.socialContact.emailId = '';
            this.socialContact.contactName = '';
            this.socialContact.showLogin = true;
            this.socialContact.jsonData = '';
            this.socialContact.statusCode = 0;
            this.socialContact.contactType = '';
            this.socialContact.alias = '';
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
                        this.getSalesforceConatactList = data;
                        this.selectedAddContactsOption = 3;
                        if (!this.getSalesforceConatactList.contacts) {
                            if (this.getSalesforceConatactList.jsonData.includes("API_DISABLED_FOR_ORG")) {
                                this.customResponse = new CustomResponse('ERROR', "Salesforce REST API is not enabled, Please change your Salesforce platform settings.", true);
                            } else {
                                this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
                            }
                            this.selectedAddContactsOption = 8;
                            this.hideModal();
                        } else {
                            for (var i = 0; i < this.getSalesforceConatactList.contacts.length; i++) {
                                let socialContact = new SocialContact();
                                let user = new User();
                                socialContact.id = i;
                                if (this.validateEmailAddress(this.getSalesforceConatactList.contacts[i].emailId)) {
                                    socialContact.emailId = this.getSalesforceConatactList.contacts[i].emailId.trim();
                                    socialContact.firstName = this.getSalesforceConatactList.contacts[i].firstName;
                                    socialContact.lastName = this.getSalesforceConatactList.contacts[i].lastName;
                                    this.socialContactUsers.push(socialContact);
                                }
                                $("button#sample_editable_1_new").prop('disabled', false);
                                // $( "#Gfile_preview" ).show();
                                this.showFilePreview();
                                $("button#cancel_button").prop('disabled', false);
                                $('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
                                $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                this.hideModal();
                                $('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                                $('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.microsoftImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.connectWiseImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                                $('.haloPSAImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                                $('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                                $('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                                $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                            }
                        }
                        this.xtremandLogger.info(this.getSalesforceConatactList);
                        this.setPage(1);
                    },
                    (error: any) => {
                        this.xtremandLogger.error(error);
                    },
                    () => this.xtremandLogger.log("addContactComponent getSalesforceContacts() Data:" + JSON.stringify(this.getSalesforceConatactList.contacts))
                );
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent gettingSalesforceListViewContacts().")
        }
    }

    saveSalesforceContactSelectedUsers() {
        try {
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
            this.xtremandLogger.info("SelectedUserIDs:" + this.allselectedUsers);
            this.allselectedUsers = this.validateSocialContacts(this.allselectedUsers);
            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0) {
                this.xtremandLogger.info("update contacts #contactSelectedListId " + " data => " + JSON.stringify(this.allselectedUsers));
                this.contactListObject = new ContactList;
                this.contactListObject.name = this.model.contactListName;
                this.contactListObject.isPartnerUserList = this.isPartner;

                this.askForPermission('salesforceSelectedContacts');

            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveSalesforceContactSelectedUsers() ContactList Name Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent SaveSalesforceSelectedContacts().")
        }
    }

    saveSalesForceSelectedContactsWithPermission() {
        if (this.assignLeads) {
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, true,
                "CONTACT", "MANUAL", this.alias, false);
            this.setLegalBasisOptions(this.allselectedUsers);

            this.userUserListWrapper.users = this.allselectedUsers;
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.setLegalBasisOptions(this.allselectedUsers);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, this.model.isPublic,
                "CONTACT", "MANUAL", this.alias, false);
            this.contactService.saveContactList(this.userUserListWrapper)
                .subscribe(
                    data => {
                        if (data.access) {
                            this.loading = false;
                            data = data;
                            if (data.statusCode === 401) {
                                this.customResponse = new CustomResponse('ERROR', data.message, true);
                                this.socialUsers = [];
                            } else if (data.statusCode === 402) {
                                this.customResponse = new CustomResponse('ERROR', data.message + '<br>' + data.data, true);
                                this.socialUsers = [];
                            } else {
                                this.selectedAddContactsOption = 8;
                                this.contactService.saveAsSuccessMessage = "add";
                                this.xtremandLogger.info("update Contacts ListUsers:" + data);
                                if (this.isPartner == false) {
                                    this.router.navigateByUrl('/home/contacts/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                } else {
                                    this.router.navigateByUrl('home/partners/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                }
                                this.contactService.successMessage = true;
                            }
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },
                    (error: any) => {
                        this.loading = false;
                        if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
                            this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                        } else {
                            this.xtremandLogger.errorPage(error);
                        }
                        this.xtremandLogger.error(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveZohoContactUsers() finished")
                )
        }
    }

    saveSalesforceContacts() {
        try {
            this.socialContact.socialNetwork = "salesforce";
            this.socialContact.contactName = this.model.contactListName;
            this.socialContact.isPartnerUserList = this.isPartner;
            this.socialContact.contactType = this.contactType;
            this.socialContact.alias = this.salesforceListViewId;
            this.socialContact.contacts = this.socialContactUsers;
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
            this.socialContact.contacts = this.validateSocialContacts(this.socialContactUsers);
            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ') {
                if (this.socialContactUsers.length > 0) {

                    this.askForPermission('salesForceContacts');

                } else
                    this.xtremandLogger.error("AddContactComponent saveSalesforceContacts() Contacts Null Error");
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveSalesforceContacts() ContactList Name Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent SalesforceContacts().")
        }
    }

    saveSalesForceContactsWithPermission() {
        if (this.assignLeads) {
            this.setSocialUsers(this.socialContact);
            this.setLegalBasisOptions(this.socialUsers);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.socialUsers, this.model.contactListName, this.isPartner, true,
                this.contactType, "SALESFORCE", this.salesforceListViewId, true);
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.setLegalBasisOptions(this.socialContact.contacts);
            this.socialContact.publicList = this.model.isPublic;
            this.socialContact.moduleName = this.getModuleName();
            this.contactService.saveSocialContactList(this.socialContact)
                .subscribe(
                    data => {
                        if (data.access) {
                            data = data;
                            this.loading = false;
                            this.selectedAddContactsOption = 8;
                            this.contactService.saveAsSuccessMessage = "add";
                            this.xtremandLogger.info("update Contacts ListUsers:" + data);
                            if (this.isPartner == false) {
                                this.router.navigateByUrl('/home/contacts/manage');
                                localStorage.removeItem('isZohoSynchronization');
                            } else {
                                this.router.navigateByUrl('home/partners/manage');
                                localStorage.removeItem('isZohoSynchronization');
                            }
                            this.contactService.successMessage = true;
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },
                    (error: any) => {
                        this.loading = false;
                        if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
                            this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                        } else {
                            this.xtremandLogger.errorPage(error);
                        }
                        this.xtremandLogger.error(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveSalesforceContacts() finished")
                )
        }
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
                        if (this.storeLogin.CONNECTWISE == true) {
                            this.connectWiseImageNormal = true;
                        } else {
                            this.connectWiseImageBlur = true;
                        }
                        if(this.storeLogin.HALOPSA == true){
                            this.haloPSAImageNormal = true;
                        } else{
                            this.haloPSAImageBlur = true;
                        }

                    },
                    (error: any) => {
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.log("AddContactsComponent socialContactImage() finished.")
                );
        } catch (error) {
            this.xtremandLogger.error(error, "addContactComponent", "social Partners images");
        }
    }

    partnerEmails() {
        try {
            this.contactService.getPartnerEmails()
                .subscribe(
                    response => {
                        for (let i = 0; i < response.data.length; i++) {
                            this.partnerEmailIds.push(response.data[i].replace(/\s/g, ''));
                        }
                    },
                    (error: any) => {
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.log("AddContactsComponent partnerEmails() finished.")
                );
        } catch (error) {
            this.xtremandLogger.error(error, "addContactComponent", "partnerEmails");
        }
    }

    loadContactListsNames() {
        this.loading = true;
        try {
            this.contactService.loadContactListsNames()
                .subscribe(
                    (data: any) => {
                        this.loading = false;
                        this.xtremandLogger.info(data);
                        this.contactLists = data.listOfUserLists;
                        for (let i = 0; i < data.names.length; i++) {
                            this.names.push(data.names[i].replace(/\s/g, ''));
                        }
                    },
                    (error: any) => {
                        this.loading = false;
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.info("Add contact component loadContactListsName() finished")
                )
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent gettinAllContactListNames().")
        }
    }

    unlinkSocailAccount() {
        try {
            let socialNetwork = this.settingSocialNetwork.toUpperCase();
            this.contactService.unlinkSocailAccount(socialNetwork, this.isUnLinkSocialNetwork)
                .subscribe(
                    (data: any) => {
                        if (socialNetwork === 'SALESFORCE') {
                            $("#salesforceContact_buttonNormal").hide();
                            $("#salesforceGear").hide();
                            this.sfImageBlur = true;
                            this.socialContactImage();
                        }
                        else if (socialNetwork === 'GOOGLE') {
                            $("#googleContact_buttonNormal").hide();
                            $("#GoogleGear").hide();
                            this.googleImageBlur = true;
                        }
                        else if (socialNetwork == 'ZOHO') {
                            $("#zohoContact_buttonNormal").hide();
                            $("#zohoGear").hide();
                            this.zohoImageBlur = true;
                        }
                        $('#settingSocialNetwork').modal('hide');
                        this.selectedAddContactsOption = 2;
                        this.customResponse = new CustomResponse('SUCCESS', this.properties.SOCIAL_ACCOUNT_REMOVED_SUCCESS, true);
                    },
                    (error: any) => {
                        if (error.search('Please Launch or Delete those campaigns first') != -1) {
                            this.customResponse = new CustomResponse('ERROR', error, true);
                            $('#settingSocialNetwork').modal('hide');

                            /*setTimeout( function() { $( "#campaignError" ).slideUp( 500 ); }, 3000 );*/
                        } else {
                            this.xtremandLogger.errorPage(error);
                        }
                    },
                    () => {
                        $('#settingSocialNetwork').modal('hide');
                        this.cancelContacts();
                        this.xtremandLogger.info("deleted completed");
                    }
                );
            this.xtremandLogger.info("social account removed completed");
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent unlinkSocialContacts().")
        }
    }

    convertToLowerCase(text: string) {
        return text.toLowerCase();
    }

    settingSocialNetworkOpenModal(socialNetwork: string) {
        this.settingSocialNetwork = socialNetwork;
        // $( '#settingSocialNetwork' ).appendTo( "body" ).modal( 'show' );
        $('#settingSocialNetwork').modal('show');
    }

    addContactModalOpen() {
        this.resetResponse();
        this.contactService.isContactModalPopup = true;
    }

    addContactModalClose() {
        this.contactService.isContactModalPopup = false;
    }

    selectedPageNumber(event) {
        this.pageNumber.value = event;
        if (event === 0) { event = this.socialContactUsers.length; }
        this.pageSize = event;
        this.setPage(1);
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
        if (tempCheckGoogleAuth == 'yes' && !this.isPartner) {
            this.getGoogleContactsUsers();
            this.contactService.vanitySocialProviderName = "nothing";
        }
        else if (tempCheckSalesForceAuth == 'yes' && !this.isPartner) {
            this.showModal();
            console.log("AddContactComponent salesforce() Authentication Success");
            this.checkingPopupValues();
            this.contactService.vanitySocialProviderName = "nothing";
        }
        else if (tempZohoAuth == 'yes' && !this.isPartner) {
            this.zohoShowModal();
            this.checkingZohoPopupValues();
            this.contactService.vanitySocialProviderName = "nothing";
        }
        else if (tempCheckHubSpotAuth == 'yes' && !this.isPartner) {
            this.showHubSpotModal();
            tempCheckHubSpotAuth = 'no';
            this.contactService.vanitySocialProviderName = "nothing";
        }
        else if (tempCheckMicrosoftAuth == 'yes' && !this.isPartner) {
            this.getMicrosoftContacts();
            tempCheckMicrosoftAuth = 'no';
            this.contactService.vanitySocialProviderName = "nothing";
        }
        else if (tempValidationMessage != null && tempValidationMessage.length > 0 && !this.isPartner) {
            swal.close();
            this.customResponse = new CustomResponse('ERROR', tempValidationMessage, true);
        }
    }

    ngOnInit() {
        try {
            //this.customResponse = new CustomResponse( 'SUCCESS', this.properties.SOCIAL_ACCOUNT_REMOVED_SUCCESS, true );
            this.loggedInUserId = this.authenticationService.getUserId();
            this.partnerEmails();
            this.socialContactImage();
            if(this.router.url.includes('home/contacts')){
				this.checkSyncStatus();
			}
            //this.hideModal();
            if (!this.assignLeads) {
                this.loadContactListsNames();
            }

            /*if (localStorage.getItem('vanityUrlFilter')) {
              localStorage.removeItem('vanityUrlFilter');
              if (this.contactService.vanitySocialProviderName == 'google'
                  || this.contactService.vanitySocialProviderName == 'salesforce'
                  || this.contactService.vanitySocialProviderName == 'zoho') {
                  let message: string = '';
                  message = localStorage.getItem('oauthCallbackValidationMessage');
                  localStorage.removeItem('oauthCallbackValidationMessage');
                  if (message != null && message.length > 0) {
                      this.customResponse = new CustomResponse('ERROR', message, true);
                  } else if (this.contactService.vanitySocialProviderName == 'google') {
                      this.getGoogleContactsUsers();
                      this.contactService.vanitySocialProviderName = "nothing";
                  } else if (this.contactService.vanitySocialProviderName == 'salesforce') {
                      this.showModal();
                      console.log("AddContactComponent salesforce() Authentication Success");
                      this.checkingPopupValues();
                      this.contactService.vanitySocialProviderName = "nothing";
                  } else if (this.contactService.vanitySocialProviderName == 'zoho' || this.socialContactType == "zoho") {
                      this.zohoShowModal();
                      this.contactService.vanitySocialProviderName = "nothing";
                  }
              }
          }else */

            if (this.contactService.socialProviderName == 'google') {
                if (this.contactService.oauthCallbackMessage.length > 0) {
                    let message = this.contactService.oauthCallbackMessage;
                    this.contactService.oauthCallbackMessage = '';
                    this.customResponse = new CustomResponse('ERROR', message, true);
                } else {
                    this.socialContact.socialNetwork = localStorage.getItem('socialNetwork');
                    this.socialContact.contactType = localStorage.getItem('contactType');
                    this.socialContact.alias = localStorage.getItem('alias');
                    this.getGoogleContactsUsers();
                    this.contactService.socialProviderName = "nothing";
                    localStorage.removeItem("currentPage");
                    localStorage.removeItem("currentModule");
                    localStorage.removeItem("socialNetwork");
                    localStorage.removeItem("contactType");
                    localStorage.removeItem("alias");
                }
            }
            else if (this.contactService.socialProviderName == 'salesforce') {
                if (this.contactService.oauthCallbackMessage.length > 0) {
                    let message = this.contactService.oauthCallbackMessage;
                    this.contactService.oauthCallbackMessage = '';
                    this.customResponse = new CustomResponse('ERROR', message, true);
                } else {
                    this.socialContact.socialNetwork = localStorage.getItem('socialNetwork');
                    this.socialContact.contactType = localStorage.getItem('contactType');
                    this.socialContact.alias = localStorage.getItem('alias');
                    this.showModal();
                    this.contactService.socialProviderName = "nothing";
                    localStorage.removeItem("currentPage");
                    localStorage.removeItem("currentModule");
                    localStorage.removeItem("socialNetwork");
                    localStorage.removeItem("contactType");
                    localStorage.removeItem("alias");
                }
            }
            else if (this.contactService.socialProviderName == 'zoho' || this.socialContactType == "zoho") {
                if (this.contactService.oauthCallbackMessage.length > 0) {
                    let message = this.contactService.oauthCallbackMessage;
                    this.contactService.oauthCallbackMessage = '';
                    this.customResponse = new CustomResponse('ERROR', message, true);
                } else {
                    this.socialContact.socialNetwork = localStorage.getItem('socialNetwork');
                    this.socialContact.contactType = localStorage.getItem('contactType');
                    this.socialContact.alias = localStorage.getItem('alias');
                    this.zohoShowModal();
                    this.contactService.socialProviderName = "nothing";
                    localStorage.removeItem("currentPage");
                    localStorage.removeItem("currentModule");
                    localStorage.removeItem("socialNetwork");
                    localStorage.removeItem("contactType");
                    localStorage.removeItem("alias");
                }
            }
            this.contactListName = '';
            $("#Gfile_preview").hide();
            $("#popupForListviews").hide();

            $("#sample_editable_1").hide();
            $("#file_preview").hide();
            $("#google contacts file_preview").hide();
            $("#clipBoardValidationMessage").hide();
            $("button#sample_editable_1_new").prop('disabled', true);
            $("button#cancel_button").prop('disabled', true);

            if (this.socialContactType == "google") {
                this.getGoogleContactsUsers();
            }
            /********Check Gdpr Settings******************/
            this.checkTermsAndConditionStatus();
            this.getLegalBasisOptions();

            this.checkZohoStatusCode = localStorage.getItem("statusCode");
            if (this.checkZohoStatusCode == 202) {
                localStorage.setItem("isZohoSynchronization", "yes");
                localStorage.removeItem("statusCode");
                this.checkZohoStatusCode = 0;


                if (localStorage.getItem('vanityUrlDomain')) {
                    var message = "isZohoSynchronization";
                    let trargetWindow = window.opener;
                    trargetWindow.postMessage(message, "*");
                    localStorage.removeItem('vanityUrlDomain');
                    self.close();
                }

            } else {
                localStorage.setItem("isZohoSynchronization", "no");
            }

            window.addEventListener('message', function (e) {
                window.removeEventListener('message', function (e) { }, true);
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
            this.xtremandLogger.error("addContacts.component error " + error);
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
            this.fields = { text: 'name', value: 'id' };
            this.loading = true;
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

    downloadEmptyCsv() {
        window.location.href = this.authenticationService.MEDIA_URL + "UPLOAD_USER_LIST _EMPTY.csv";
    }

    ngOnDestroy() {
        this.sharedPartnerDetails = [];
        this.contactService.successMessage = false;
        this.contactService.socialProviderName = "";
        this.hideModal();
        this.hideZohoModal();
        this.contactService.isContactModalPopup = false;
        swal.close();
        $('#settingSocialNetwork').modal('hide');

        if (this.selectedAddContactsOption != 8 && this.router.url !== '/login' && !this.isDuplicateEmailId) {
            this.model.contactListName = "";

            let self = this;

            swal({
                title: 'Are you sure?',
                text: "You have unsaved data",
                type: 'warning',
                input: 'text',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: "No",
                allowOutsideClick: false,
                preConfirm: function (name: any) {
                    return new Promise(function () {
                        var inputName = name.toLowerCase().replace(/\s/g, '');
                        if ($.inArray(inputName, self.names) > -1) {
                            swal.showValidationError('This list name is already taken.')
                        } else {
                            if (name != "" && name.length < 250) {
                                swal.close();
                                self.isValidContactName = false;
                                self.model.contactListName = name;
                                self.saveContacts();
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
            }, function (dismiss: any) {
                if (dismiss === 'No') {
                    self.selectedAddContactsOption = 8;
                }
            });
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
        try {
            if (this.loggedInThroughVanityUrl) {
                //this.referenceService.showSweetAlertInfoMessage();
                this.vanityCheckingMarketoContactsAuthentication();

            } else {
                if (this.selectedAddContactsOption == 8 && !this.disableOtherFuctionality) {
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
                            },
                            () => this.xtremandLogger.info("Add contact component loadContactListsName() finished")
                        )
                }
            }

        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent zohoContactsAuthenticationChecking().")
        }
    }


    vanityCheckingMarketoContactsAuthentication() {
        try {
            if (this.selectedAddContactsOption == 8 && !this.disableOtherFuctionality) {
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
                        },
                        () => this.xtremandLogger.info("Add contact component loadContactListsName() finished")
                    )
            }


        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent zohoContactsAuthenticationChecking().")
        }
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

    saveMarketoContacts() {

        try {
           /* this.socialContact.socialNetwork = "MARKETO";
            this.socialContact.contactName = this.model.contactListName;
            this.socialContact.isPartnerUserList = this.isPartner;
            this.socialContact.contactType = "CONTACT";
            // this.socialContact.contacts = this.socialContactUsers;
*/            this.socialContact.contacts = this.validateMarketoContacts(this.socialContactUsers);
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
            this.socialContact.listName = this.model.contactListName;
            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ') {
                if (this.socialContactUsers.length > 0) {
                    //this.contactService.saveSocialContactList( this.socialContact )

                    this.askForPermission('marketoContacts')

                } else
                    this.xtremandLogger.error("AddContactComponent saveMarketoContact() Contacts Null Error");
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveMarketoContact() ContactList Name Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent saveMarketoContact().")
        }
    }

    saveMarketoContactsWithPermission() {
        if (this.assignLeads) {
            this.contactListObject = new ContactList;
            this.contactListObject.name = this.model.contactListName;
            this.contactListObject.isPartnerUserList = this.isPartner;
            this.contactListObject.contactType = "CONTACT";
            this.contactListObject.socialNetwork = "MANUAL";
            this.contactListObject.publicList = true;
            this.contactListObject.synchronisedList = false;
            this.socialContact.moduleName = this.getModuleName();
            //this.setSocialUsers(this.socialContact);
            this.setSocialUserObjs();
            this.setLegalBasisOptions(this.socialUsers);

            this.userUserListWrapper.users = this.socialUsers;
            this.userUserListWrapper.userList = this.contactListObject;
            this.saveAssignedLeadsList();

        } else {
            this.loading = true;
            this.setLegalBasisOptions(this.socialContact.contacts);
            this.socialContact.publicList = this.model.isPublic;
            this.socialContact.moduleName = this.getModuleName();
            this.contactService.saveMarketoContactList(this.socialContact)
                .subscribe(
                    data => {
                        if (data.access) {
                            data = data;
                            this.loading = false;
                            this.selectedAddContactsOption = 8;
                            this.contactService.saveAsSuccessMessage = "add";
                            this.xtremandLogger.info("update Contacts ListUsers:" + data);
                            if (this.isPartner == false) {
                                this.router.navigateByUrl('/home/contacts/manage');
                                localStorage.removeItem('isZohoSynchronization');
                            } else {
                                this.router.navigateByUrl('home/partners/manage');
                                localStorage.removeItem('isZohoSynchronization');
                            }
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },

                    (error: any) => {
                        this.loading = false;
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveMarketoContact() finished")
                )
        }
    }

    saveMarketoContactSelectedUsers() {
        try {

            this.allselectedUsers = this.validateSocialContacts(this.allselectedUsers);
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');

            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0) {
                this.askForPermission('marketoSelectedContacts');
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveMarketoContactSelectedUsers() ContactList Name Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent saveMarketoContactSelectedUsers().")
        }
    }

    saveMarketoSelectedContactsWithPermission() {
        if (this.assignLeads) {
            //    this.contactListObject = new ContactList;
            //    this.contactListObject.name = this.model.contactListName;
            //    this.contactListObject.isPartnerUserList = this.isPartner;
            //    this.contactListObject.contactType = "CONTACT";
            //    this.contactListObject.socialNetwork = "MANUAL";
            //    this.contactListObject.publicList = true;
            //    this.setLegalBasisOptions(this.allselectedUsers);

            //    this.userUserListWrapper.users = this.allselectedUsers;
            //    this.saveAssignedLeadsList();

            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, true,
                "CONTACT", "MANUAL", this.alias, false);
            this.setLegalBasisOptions(this.allselectedUsers);
            this.userUserListWrapper.users = this.allselectedUsers;
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.setLegalBasisOptions(this.allselectedUsers);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, this.model.isPublic,
                "CONTACT", "MANUAL", this.alias, false);
            this.contactService.saveContactList(this.userUserListWrapper)
                .subscribe(
                    data => {
                        if (data.access) {
                            data = data;
                            this.loading = false;
                            if (data.statusCode === 401) {
                                this.customResponse = new CustomResponse('ERROR', data.message, true);
                                this.socialUsers = [];
                            } else if (data.statusCode === 402) {
                                this.customResponse = new CustomResponse('ERROR', data.message + '<br>' + data.data, true);
                                this.socialUsers = [];
                            } else {
                                this.selectedAddContactsOption = 8;
                                this.contactService.saveAsSuccessMessage = "add";
                                this.xtremandLogger.info("update Contacts ListUsers:" + data);
                                this.disableOtherFuctionality = false;
                                if (this.isPartner == false) {
                                    this.router.navigateByUrl('/home/contacts/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                } else {
                                    this.router.navigateByUrl('home/partners/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                }
                            }
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },

                    (error: any) => {
                        this.loading = false;
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveMarketoContactSelectedUsers() finished")
                )
        }
    }

    authorisedMarketoContacts() {
    }
    retriveMarketoContacts() {
        this.loading = true;

        $("#marketoShowLoginPopup").modal('hide');
        this.contactService.getMarketoContacts(this.authenticationService.getUserId()).subscribe(data => {
            if (data.statusCode === 200) {

                this.marketoImageBlur = false;
                this.marketoImageNormal = true;
                this.getMarketoConatacts = data.data;


                // this.getMarketoConatacts = data.data;
                this.loadingMarketo = false;
                this.selectedAddContactsOption = 6;
                if (this.getMarketoConatacts.length == 0) {
                    this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
                } else {
                    for (var i = 0; i < this.getMarketoConatacts.length; i++) {
                        let socialContact = new SocialContact();
                        let user = new User();
                        socialContact.id = i;
                        if (this.validateEmailAddress(this.getMarketoConatacts[i].email)) {
                            socialContact.email = this.getMarketoConatacts[i].email;
                            socialContact.firstName = this.getMarketoConatacts[i].firstName;
                            socialContact.lastName = this.getMarketoConatacts[i].lastName;

                            socialContact.country = this.getMarketoConatacts[i].country;
                            socialContact.city = this.getMarketoConatacts[i].city;
                            socialContact.state = this.getMarketoConatacts[i].state;
                            socialContact.postalCode = this.getMarketoConatacts[i].postalCode;
                            socialContact.address = this.getMarketoConatacts[i].address;
                            socialContact.company = this.getMarketoConatacts[i].company;
                            socialContact.title = this.getMarketoConatacts[i].title;
                            socialContact.mobilePhone = this.getMarketoConatacts[i].mobilePhone;
                            socialContact.mobileNumber = this.getMarketoConatacts[i].mobilePhone;


                            this.socialContactUsers.push(socialContact);
                        }
                        $("button#sample_editable_1_new").prop('disabled', false);
                        // $( "#Gfile_preview" ).show();
                        this.showFilePreview();
                        $("#myModal .close").click()
                        $("button#cancel_button").prop('disabled', false);
                        $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                        $('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                        $('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
                        $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                        $('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                        $('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                        $('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                        $('.microsoftImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                        $('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                        $('.connectWiseImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                        $('.haloPSAImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                        $('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                        $('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                    }
                }
                this.xtremandLogger.info(this.getMarketoConatacts);
                this.setPage(1);
            } else if (data.statusCode === 400) {
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

        if (fieldId == 'client') {
            if (this.marketoClientId.length > 0) {
                this.marketoClientIdClass = successClass;
                this.marketoClentIdError = false;
            } else {
                this.marketoClientIdClass = errorClass;
                this.marketoClentIdError = true;
            }
        } else if (fieldId == 'secret') {
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
    }


    highlightMarketoRow(user: any) {
        let isChecked = $('#' + user.id).is(':checked');

        if (isChecked) {
            $('#row_' + user.id).addClass('contact-list-selected');
            this.selectedContactListIds.push(user.id);
            this.paginatedSelectedIds.push(user.id);
            var object = {
                "id": user.id,
                "emailId": user.emailId,
                "email": user.email,
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
        } else {
            $('#row_' + user.id).removeClass('contact-list-selected');
            this.selectedContactListIds.splice($.inArray(user.id, this.selectedContactListIds), 1);
            this.paginatedSelectedIds.splice($.inArray(user.id, this.paginatedSelectedIds), 1);
            this.allselectedUsers.splice($.inArray(user.id, this.allselectedUsers), 1);
        }
        if (this.paginatedSelectedIds.length == this.pagedItems.length) {
            this.isHeaderCheckBoxChecked = true;
        } else {
            this.isHeaderCheckBoxChecked = false;
        }
        event.stopPropagation();
    }

    checkAllForMarketo(ev: any) {
        if (ev.target.checked) {
            $('[name="campaignContact[]"]').prop('checked', true);
            let self = this;
            $('[name="campaignContact[]"]:checked').each(function () {
                var id = $(this).val();
                self.selectedContactListIds.push(parseInt(id));
                self.paginatedSelectedIds.push(parseInt(id));
                $('#ContactListTable_' + id).addClass('contact-list-selected');
                for (var i = 0; i < self.pagedItems.length; i++) {
                    var object = {

                        "id": self.pagedItems[i].id,
                        "emailId": self.pagedItems[i].emailId,
                        "email": self.pagedItems[i].email,
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
                    self.allselectedUsers.push(object);
                }
            });
            this.allselectedUsers = this.removeDuplicates(this.allselectedUsers, 'email');
            this.selectedContactListIds = this.referenceService.removeDuplicates(this.selectedContactListIds);
            this.paginatedSelectedIds = this.referenceService.removeDuplicates(this.paginatedSelectedIds);
        } else {
            $('[name="campaignContact[]"]').prop('checked', false);
            $('#user_list_tb tr').removeClass("contact-list-selected");
            if (this.pager.maxResults == this.pager.totalItems) {
                this.selectedContactListIds = [];
                this.paginatedSelectedIds = [];
                this.allselectedUsers.length = 0;
            } else {
                this.paginatedSelectedIds = [];
                for (let j = 0; j < this.pagedItems.length; j++) {
                    var paginationEmail = this.pagedItems[j].emailId;
                    //  this.allselectedUsers.splice( this.allselectedUsers.indexOf( paginationEmail ), 1 );
                    this.allselectedUsers = this.referenceService.removeRowsFromPartnerOrContactListByEmailId(this.allselectedUsers, paginationEmail);
                }
                let currentPageContactIds = this.pagedItems.map(function (a) { return a.id; });
                this.selectedContactListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedContactListIds, currentPageContactIds);
            }
        }
        ev.stopPropagation();
    }

    // HubSpot Implementation

    checkingHubSpotContactsAuthentication() {
        if (this.loggedInThroughVanityUrl) {
            //this.referenceService.showSweetAlertInfoMessage();
            this.hubSpotVanityAuthentication();
        } else {
            if (this.selectedAddContactsOption == 8) {
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

    checkingMicrosoftContactsAuthentication() {
        if (this.selectedAddContactsOption == 8) {
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
                this.customResponse = new CustomResponse('ERROR', errorMessage, true);
                this.xtremandLogger.error(error, "Error in Microsoft checkIntegrations()");
            }, () =>
                this.xtremandLogger.log("Microsoft Configuration Checking done")
            );
        }
    }

    //XNFR-230
    checkingPipedriveContactsAuthentication() {
        if (this.selectedAddContactsOption == 8) {
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
                this.customResponse = new CustomResponse('ERROR', errorMessage, true);
                this.xtremandLogger.error(error, "Error in Pipedrive checkIntegrations()");
            }, () =>
                this.xtremandLogger.log("Pipedrive Configuration Checking done")
            );
        }
    }

    //XNFR-403
    checkingConnectWiseContactsAuthentication() {
        if (this.selectedAddContactsOption == 8) {
            this.integrationService.checkConfigurationByType('connectwise').subscribe(data => {
                let response = data;
                if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
                    this.xtremandLogger.info("isAuthorize true");
                    this.getConnectWiseContacts();
                    // this.showConnectWiseModal();
                }
                else {
                    this.showConnectWisePreSettingsForm();
                }
            }, (error: any) => {
                this.loading = false;
                let errorMessage = this.referenceService.getApiErrorMessage(error);
                this.customResponse = new CustomResponse('ERROR', errorMessage, true);
                this.xtremandLogger.error(error, "Error in ConnectWise checkIntegrations()");
            }, () =>
                this.xtremandLogger.log("ConnectWise Configuration Checking done")
            );
        }
    }

    hubSpotVanityAuthentication() {
        this.contactService.vanitySocialProviderName = 'hubspot';
        if (this.selectedAddContactsOption == 8) {
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
    }

    microsoftVanityAuthentication() {
        this.contactService.vanitySocialProviderName = 'microsoft';
        if (this.selectedAddContactsOption == 8) {
            this.microsoftService.config().subscribe(data => {
                let response = data;
                let providerName = 'microsoft'
                if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
                    this.xtremandLogger.info("isAuthorize true");
                    this.getMicrosoftContacts();
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
    }
    showHubSpotModal() {
        $('#ContactHubSpotModal').modal('show');
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
        if (event.target["value"] == "DEFAULT") {
            $("button#hubspot_save_button").prop('disabled', true);
        } else {
            $("button#hubspot_save_button").prop('disabled', false);
        }
        this.hubSpotSelectContactListOption = item;
        let selectedOptions = event.target['options'];
        let selectedIndex = selectedOptions.selectedIndex;
        this.hubSpotContactListName = selectedOptions[selectedIndex].text;
    }

    getHubSpotData() {
        $("button#salesforce_save_button").prop('disabled', true);
        if (this.contactType === "contacts") {
            this.getHubSpotContacts();
            this.hubSpotContactListName = '';
        } else if (this.contactType === "lists") {
            this.getHubSpotContactsListsById();
        }
    }

    getHubSpotContacts() {
        this.hubSpotService.getHubSpotContacts().subscribe(data => {
            let response = data.data;
            this.selectedAddContactsOption = 9
            this.frameHubSpotFilePreview(response);
        });
    }

    getHubSpotContactsListsById() {
        this.xtremandLogger.info("hubSpotSelectContactListOption :" + this.hubSpotSelectContactListOption);
        if (this.hubSpotSelectContactListOption !== undefined && this.hubSpotSelectContactListOption !== '') {
            this.hubSpotService.getHubSpotContactsListsById(this.hubSpotSelectContactListOption).subscribe(data => {
                let response = data.data;
                this.selectedAddContactsOption = 9
                this.frameHubSpotFilePreview(response);
            });
        }
    }

    frameHubSpotFilePreview(response: any) {
        if (!response.contacts) {
            this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
        } else {
            this.socialContactUsers = [];
            this.model.contactListName = this.hubSpotContactListName;
            this.validateContactName(this.model.contactListName);
            for (var i = 0; i < response.contacts.length; i++) {
                this.xtremandLogger.log("HubSpot Contact :" + response.contacts[i].firstName);
                let socialContact = new SocialContact();
                socialContact = response.contacts[i];
                socialContact.id = i;
                if (this.validateEmailAddress(response.contacts[i].email)) {
                    this.socialContactUsers.push(socialContact);
                }
                $("button#sample_editable_1_new").prop('disabled', false);
                //$( "#Gfile_preview" ).show();
                this.showFilePreview();
                $("button#cancel_button").prop('disabled', false);
                this.hideHubSpotModal();
                $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
                $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                $('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.microsoftImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.connectWiseImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                $('.haloPSAImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                $('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                $('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
            }
        }
        this.setPage(1);
        this.selectedAddContactsOption = 9;
        this.socialContact.contacts = this.socialContactUsers;
    }



    saveHubSpotContacts() {
        try {
            this.socialContact.contacts = this.validateMarketoContacts(this.socialContactUsers);
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
            this.socialContact.listName = this.model.contactListName;
            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ') {
                if (this.socialContactUsers.length > 0) {
                    this.askForPermission('hubSpotContacts')
                } else
                    this.xtremandLogger.error("AddContactComponent saveHubSpotContact() Contacts Null Error");
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveHubSpotContact() ContactList Name Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent saveHubSpotContact().")
        }
    }

    saveExternalContacts(type: string) {
        try {
            this.socialContact.contacts = this.validateMarketoContacts(this.socialContactUsers);
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');
            this.socialContact.listName = this.model.contactListName;
            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ') {
                if (this.socialContactUsers.length > 0) {
                    this.askForPermission(type + 'Contacts')
                } else
                    this.xtremandLogger.error("AddContactComponent saveExternalContacts() Contacts Null Error");
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveExternalContacts() ContactList Name Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent saveExternalContacts().")
        }
    }

    saveHubSpotContactSelectedUsers() {
        try {
            this.allselectedUsers = this.validateSocialContacts(this.allselectedUsers);
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');

            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0) {
                this.askForPermission('hubSpotSelectedContacts');
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveHubSpotContactSelectedUsers() ContactList Name Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent saveHubSpotContactSelectedUsers().")
        }
    }

    saveExternalContactSelectedUsers(type: string) {
        try {
            this.allselectedUsers = this.validateSocialContacts(this.allselectedUsers);
            this.model.contactListName = this.model.contactListName.replace(/\s\s+/g, ' ');

            if (this.model.contactListName != '' && !this.isValidContactName && this.model.contactListName != ' ' && this.allselectedUsers.length != 0) {
                this.askForPermission(type + 'SelectedContacts');
            }
            else {
                this.contactListNameError = true;
                this.xtremandLogger.error("AddContactComponent saveExternalContactSelectedUsers() ContactList Name Error");
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent saveExternalContactSelectedUsers().")
        }
    }

    saveHubSpotContactsWithPermission() {
        if (this.assignLeads) {
            this.contactListObject = new ContactList;
            this.contactListObject.name = this.model.contactListName;
            this.contactListObject.isPartnerUserList = this.isPartner;
            this.contactListObject.synchronisedList = true;
            this.contactListObject.socialNetwork = "HUBSPOT";
            this.contactListObject.contactType = "CONTACT";
            this.contactListObject.publicList = true;
            this.socialContact.moduleName = this.getModuleName();
            this.contactListObject.externalListId = this.hubSpotSelectContactListOption;
            this.setSocialUserObjs();
            this.setLegalBasisOptions(this.socialUsers);

            this.userUserListWrapper.users = this.socialUsers;
            this.userUserListWrapper.userList = this.contactListObject;
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.socialContact.type = "hubspot";
            this.socialContact.userId = this.authenticationService.getUserId();
            this.socialContact.externalListId = this.hubSpotSelectContactListOption;
            this.setLegalBasisOptions(this.socialContact.contacts);
            this.socialContact.publicList = this.model.isPublic;
            this.socialContact.moduleName = this.getModuleName();
            this.hubSpotService.saveHubSpotContacts(this.socialContact)
                .subscribe(
                    data => {
                        if (data.access) {
                            this.loading = false;
                            this.selectedAddContactsOption = 8;
                            this.contactService.saveAsSuccessMessage = "add";
                            this.xtremandLogger.info("Save Contacts ListUsers:" + data);
                            this.router.navigateByUrl('/home/contacts/manage');
                            localStorage.removeItem('isZohoSynchronization');
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },

                    (error: any) => {
                        this.loading = false;
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveHubSpotContactsWithPermission() finished")
                )
        }
    }

    saveExternalContactsWithPermission_old(type: string) {
        if (this.assignLeads) {
            this.contactListObject = new ContactList;
            this.contactListObject.name = this.model.contactListName;
            this.contactListObject.isPartnerUserList = this.isPartner;
            if (type === 'marketo') {
                this.contactListObject.synchronisedList = false;
            } else {
                this.contactListObject.synchronisedList = true;
            }

            this.contactListObject.socialNetwork = type.toLocaleUpperCase();
            this.contactListObject.contactType = "CONTACT";
            this.contactListObject.publicList = true;
            this.socialContact.moduleName = this.getModuleName();
            this.contactListObject.externalListId = this.hubSpotSelectContactListOption;
            this.setSocialUserObjs();
            this.setLegalBasisOptions(this.socialUsers);

            this.userUserListWrapper.users = this.socialUsers;
            this.userUserListWrapper.userList = this.contactListObject;
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.socialContact.type = type;
            this.socialContact.userId = this.authenticationService.getUserId();
            this.socialContact.externalListId = this.hubSpotSelectContactListOption;
            this.setLegalBasisOptions(this.socialContact.contacts);
            this.socialContact.publicList = this.model.isPublic;
            this.socialContact.moduleName = this.getModuleName();
            this.integrationService.saveContacts(this.socialContact)
                .subscribe(
                    data => {
                        if (data.access) {
                            this.loading = false;
                            this.selectedAddContactsOption = 8;
                            this.contactService.saveAsSuccessMessage = "add";
                            this.xtremandLogger.info("Save Contacts ListUsers:" + data);
                            this.router.navigateByUrl('/home/contacts/manage');
                            localStorage.removeItem('isZohoSynchronization');
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },

                    (error: any) => {
                        this.loading = false;
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveExternalContactsWithPermission() finished")
                )
        }
    }

    saveHubSpotSelectedContactsWithPermission() {
        if (this.assignLeads) {
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, true,
                "CONTACT", "MANUAL", this.alias, false);
            this.setLegalBasisOptions(this.allselectedUsers);
            this.userUserListWrapper.users = this.allselectedUsers;
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.setLegalBasisOptions(this.allselectedUsers);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, this.model.isPublic,
                "CONTACT", "MANUAL", this.alias, false);
            this.contactService.saveContactList(this.userUserListWrapper)
                .subscribe(
                    data => {
                        if (data.access) {
                            this.loading = false;
                            if (data.statusCode === 401) {
                                this.customResponse = new CustomResponse('ERROR', data.message, true);
                                this.socialUsers = [];
                            } else if (data.statusCode === 402) {
                                this.customResponse = new CustomResponse('ERROR', data.message + '<br>' + data.data, true);
                                this.socialUsers = [];
                            } else {
                                this.selectedAddContactsOption = 8;
                                this.contactService.saveAsSuccessMessage = "add";
                                this.xtremandLogger.info("update Contacts ListUsers:" + data);
                                this.disableOtherFuctionality = false;
                                if (this.isPartner == false) {
                                    this.router.navigateByUrl('/home/contacts/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                } else {
                                    this.router.navigateByUrl('home/partners/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                }
                            }
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },

                    (error: any) => {
                        this.loading = false;
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveHubSpotSelectedContactsWithPermission() finished")
                )
        }
    }

    saveExternalSelectedContactsWithPermission_old() {
        if (this.assignLeads) {
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, true,
                "CONTACT", "MANUAL", this.alias, false);
            this.setLegalBasisOptions(this.allselectedUsers);
            this.userUserListWrapper.users = this.allselectedUsers;
            this.saveAssignedLeadsList();
        } else {
            this.loading = true;
            this.setLegalBasisOptions(this.allselectedUsers);
            this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, this.model.isPublic,
                "CONTACT", "MANUAL", this.alias, false);
            this.contactService.saveContactList(this.userUserListWrapper)
                .subscribe(
                    data => {
                        if (data.access) {
                            this.loading = false;
                            if (data.statusCode === 401) {
                                this.customResponse = new CustomResponse('ERROR', data.message, true);
                                this.socialUsers = [];
                            } else if (data.statusCode === 402) {
                                this.customResponse = new CustomResponse('ERROR', data.message + '<br>' + data.data, true);
                                this.socialUsers = [];
                            } else {
                                this.selectedAddContactsOption = 8;
                                this.contactService.saveAsSuccessMessage = "add";
                                this.xtremandLogger.info("update Contacts ListUsers:" + data);
                                this.disableOtherFuctionality = false;
                                if (this.isPartner == false) {
                                    this.router.navigateByUrl('/home/contacts/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                } else {
                                    this.router.navigateByUrl('home/partners/manage');
                                    localStorage.removeItem('isZohoSynchronization');
                                }
                            }
                        } else {
                            this.authenticationService.forceToLogout();
                            localStorage.removeItem('isZohoSynchronization');
                        }
                    },

                    (error: any) => {
                        this.loading = false;
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.info("addcontactComponent saveExternalSelectedContactsWithPermission() finished")
                )
        }
    }

    showFilePreview() {
        $("#Gfile_preview").show();
        this.filePreview = true;
    }

    setLegalBasisOptions(input: any) {
        if (this.gdprStatus) {
            let self = this;
            $.each(input, function (index: number, contact: User) {
                contact.legalBasis = self.selectedLegalBasisOptions;
            });
        }
    }

    changeStatus(event) {
        this.model.isPublic = event;

    }

    /**************Sravan************************ */

    checkingZohoContactsAuthentication() {
        localStorage.removeItem('isZohoSynchronization');
        try {
            if (this.loggedInThroughVanityUrl) {
                this.zohoVanityUrlAuthentication();
            }
            else {
                // this.zohoPopupLoader = true;
                let selectedOption = $("select.opts:visible option:selected ").val();

                if (this.selectedAddContactsOption == 8 && !this.disableOtherFuctionality) {
                    this.contactService.checkingZohoAuthentication(this.module)
                        .subscribe(
                            (data: any) => {
                                this.storeLogin = data;
                                if (data.statusCode == 200) {
                                    this.zohoShowModal();
                                } else {
                                    this.setLValuesToLocalStorageAndReditectToLoginPage(this.socialContact, data);
                                }
                            },
                            (error: any) => {
                                //this.zohoPopupLoader = false;
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

    getZohoContactsUsingOAuth2() {
        this.contactService.socialProviderName = 'zoho';
        this.socialContact.socialNetwork = "ZOHO";
        this.socialContact.contactType = "CONTACT";
        this.socialContact.alias = null;
        this.socialContact.moduleName = this.getModuleName();
        this.contactType = "CONTACT";
        swal({
            text: 'Retrieving contacts from zoho...! Please Wait...It\'s processing',
            allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
        });

        this.contactService.getZohoAutherizedContacts(this.socialContact)
            .subscribe(
                data => {
                    if (data.statusCode != null && data.statusCode != 200) {
                        swal.close();
                        this.hideZohoAuthorisedPopup();
                        this.customResponse = new CustomResponse('INFO', data.message, true);
                        this.selectedAddContactsOption = 6;
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


    getZohoLeadsUsingOAuth2() {
        this.contactService.socialProviderName = 'zoho';
        this.socialContact.socialNetwork = "ZOHO";
        this.socialContact.contactType = "LEAD";
        this.contactType = "LEAD";
        this.socialContact.alias = null;
        this.socialContact.moduleName = this.getModuleName();
        swal({
            text: 'Retrieving leads from zoho...! Please Wait...It\'s processing',
            allowOutsideClick: false, showConfirmButton: false, imageUrl: 'assets/images/loader.gif'
        });

        this.contactService.getZohoAutherizedLeads(this.socialContact)
            .subscribe(
                data => {
                    this.getZohoConatacts = data;
                    this.selectedAddContactsOption = 6;
                    if (data.statusCode != null && data.statusCode != 200) {
                        swal.close();
                        this.hideZohoAuthorisedPopup();
                        this.customResponse = new CustomResponse('INFO', data.message, true);
                        this.selectedAddContactsOption = 6;
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
        this.getZohoConatacts = data;
        this.zohoImageNormal = false;
        this.zohoImageBlur = false;
        this.socialContactImage();
        let contacts = this.getZohoConatacts['contacts'];
        if (contacts != null && contacts.length > 0) {
            for (var i = 0; i < contacts.length; i++) {
                let socialContact = new SocialContact();
                socialContact.id = i;
                if (this.validateEmailAddress(contacts[i].emailId)) {
                    socialContact.emailId = contacts[i].emailId.trim();
                    socialContact.firstName = contacts[i].firstName;
                    socialContact.lastName = contacts[i].lastName;
                    socialContact.contactCompany = contacts[i].contactCompany;
                    socialContact.company = contacts[i].contactCompany;
                    this.socialContactUsers.push(socialContact);
                }

            }

            contacts.synchronisedList == true;

            $("button#sample_editable_1_new").prop('disabled', false);
            $("button#cancel_button").prop('disabled', false);
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
        this.selectedAddContactsOption = 5;
        this.setPage(1);
    }
    setSocialUsers(socialContact) {
        let contacts = this.socialContact.contacts;
        for (var i = 0; i < this.socialContact.contacts.length; i++) {
            let user = new User();
            if (this.validateEmailAddress(contacts[i].emailId)) {
                user.emailId = contacts[i].emailId.trim();
                user.firstName = contacts[i].firstName;
                user.lastName = contacts[i].lastName;
                user.contactCompany = contacts[i].contactCompany;
                this.socialUsers.push(user);
            }

        }
    }

    setSocialUserObjs() {
        let contacts = this.socialContact.contacts;
        for (var i = 0; i < this.socialContact.contacts.length; i++) {
            let user = new User();
            if (this.validateEmailAddress(contacts[i].email)) {
                user.emailId = contacts[i].email.trim();
                user.firstName = contacts[i].firstName;
                user.lastName = contacts[i].lastName;
                user.contactCompany = contacts[i].company;
                user.city = contacts[i].city;
                user.state = contacts[i].city;
                user.country = contacts[i].country;
                user.zipCode = String(contacts[i].postalCode);
                user.mobileNumber = contacts[i].mobilePhone;
                user.jobTitle = contacts[i].title;
                user.address = contacts[i].address;
                this.socialUsers.push(user);
            }
        }
    }

    selectedSharePartner(event: any) {
        this.sharedPartnerDetails = event;
        this.model.assignedTo = this.sharedPartnerDetails.emailId;
    }

    setLValuesToLocalStorageAndReditectToLoginPage(socialContact: SocialContact, data: any) {
        if (this.module === 'leads') {
            localStorage.setItem('currentPage', 'add-leads');
        } else if (this.module === 'contacts') {
            localStorage.setItem('currentPage', 'add-contacts');
        } else if (this.module === 'partners') {
            localStorage.setItem('currentPage', 'add-partners');
        }
        localStorage.setItem('socialNetwork', socialContact.socialNetwork);
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

    resetResponse() {
        this.customResponse = new CustomResponse();
    }

    showMiscrosoftPreSettingsForm() {
        this.showMicrosoftAuthenticationForm = true;
    }

    closeMicrosoftForm(event: any) {
        if (event === "0") {
            this.showMicrosoftAuthenticationForm = false;
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
                this.selectedAddContactsOption = 10;
                this.disableOtherFuctionality = true;
                this.microsoftDynamicsImageBlur = false;
                this.microsoftDynamicsImageNormal = true;
                this.frameMicrosoftPreview(response);
            }
        }, (error: any) => {
            this.loading = false;
            let errorMessage = this.referenceService.getApiErrorMessage(error);
            this.customResponse = new CustomResponse('ERROR', errorMessage, true);
        }, () =>
            this.xtremandLogger.log("Microsoft Configuration Checking done")
        );
    }

    frameMicrosoftPreview(response: any) {
        if (!response.contacts) {
            this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
        } else {
            this.socialContactUsers = [];
            for (var i = 0; i < response.contacts.length; i++) {
                this.xtremandLogger.log("Contact :" + response.contacts[i].firstName);
                let socialContact = new SocialContact();
                socialContact = response.contacts[i];
                socialContact.id = i;
                if (this.validateEmailAddress(response.contacts[i].email)) {
                    this.socialContactUsers.push(socialContact);
                }
                $("button#sample_editable_1_new").prop('disabled', false);
                //$( "#Gfile_preview" ).show();
                this.showFilePreview();
                $("button#cancel_button").prop('disabled', false);
                $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
                $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                $('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.connectWiseImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                $('.haloPSAImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                $('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                $('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
            }
        }
        this.setPage(1);
        this.selectedAddContactsOption = 10;
        this.disableOtherFuctionality = true;
        this.socialContact.contacts = this.socialContactUsers;
    }

    // XNFR-230
    showPipedrivePreSettingsForm() {
        this.showPipedriveAuthenticationForm = true;
    }
    closePipedriveForm(event: any) {
        if (event === "0") {
            this.showPipedriveAuthenticationForm = false;
        }
    }
    getPipedriveContacts() {
        this.loading = true;
        this.integrationService.getContacts('pipedrive').subscribe(data => {
            this.loading = false;
            if (data.statusCode == 401) {
                this.customResponse = new CustomResponse('ERROR', data.message, true);
            } else {
                let response = data.data;
                this.selectedAddContactsOption = 11;
                this.disableOtherFuctionality = true;
                this.pipedriveImageBlur = false;
                this.pipedriveImageNormal = true;
                this.framePipedrivePreview(response);
            }
        }, (error: any) => {
            this.loading = false;
            let errorMessage = this.referenceService.getApiErrorMessage(error);
            this.customResponse = new CustomResponse('ERROR', errorMessage, true);
        }, () =>
            this.xtremandLogger.log("Pipedrive Configuration Checking done")
        );
    }

    framePipedrivePreview(response: any) {
        if (!response.contacts) {
            this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
        } else {
            this.socialContactUsers = [];
            for (var i = 0; i < response.contacts.length; i++) {
                this.xtremandLogger.log("Contact :" + response.contacts[i].firstName);
                let socialContact = new SocialContact();
                socialContact = response.contacts[i];
                socialContact.id = i;
                if (this.validateEmailAddress(response.contacts[i].email)) {
                    this.socialContactUsers.push(socialContact);
                }
                $("button#sample_editable_1_new").prop('disabled', false);
                //$( "#Gfile_preview" ).show();
                this.showFilePreview();
                $("button#cancel_button").prop('disabled', false);
                $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
                $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                $('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.microsoftImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.connectWiseImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                $('.haloPSAImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                $('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                $('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
            }
        }
        this.setPage(1);
        this.selectedAddContactsOption = 11;
        this.disableOtherFuctionality = true;
        this.socialContact.contacts = this.socialContactUsers;
    }

    //XNFR-230

    // XNFR-403
    showConnectWisePreSettingsForm() {
        this.showConnectWiseAuthenticationForm = true;
    }
    closeConnectWiseForm(event: any) {
        if (event === "0") {
            this.showConnectWiseAuthenticationForm = false;
        }
    }

    showConnectWiseModal() {
        $('#ContactConnectWiseModal').modal('show');
    }

    hideConnectWiseModal() {
        $('#ContactConnectWiseModal').modal('hide');
    }

    onChangeConnectWiseDropdown(event: Event) {
        try {
            this.contactType = event.target["value"];
            this.socialNetwork = "connectwise";
            this.connectWiseContactListsData = [];
            if (this.contactType == "DEFAULT") {
                $("button#connectwise_save_button").prop('disabled', true);
            } else {
                $("button#connectwise_save_button").prop('disabled', false);
            }


            if (this.contactType === "lists") {
                $("button#connectwise_save_button").prop('disabled', true);
                this.integrationService.getContactLists('connectwise').subscribe(data => {
                    let response = data.data;
                    if (response.contacts.length > 0) {
                        for (var i = 0; i < response.contacts.length; i++) {
                            this.connectWiseContactListsData.push(response.contacts[i]);
                            this.xtremandLogger.log(response.contacts[i]);
                        }
                    } else {
                        this.customResponse = new CustomResponse('ERROR', "No " + this.contactType + " found", true);
                        this.hideConnectWiseModal();
                    }
                },
                    (error: any) => {
                        this.xtremandLogger.error(error);
                        this.xtremandLogger.errorPage(error);
                    },
                    () => this.xtremandLogger.log("onChangeConnectWiseDropdown")
                );
            }
        } catch (error) {
            this.xtremandLogger.error(error, "AddContactsComponent onChangeConnectWiseDropdown().")
        }
    }


    onChangeConnectWiseListsDropdown(item: any) {
        if (event.target["value"] == "DEFAULT") {
            $("button#connectwise_save_button").prop('disabled', true);
        } else {
            $("button#connectwise_save_button").prop('disabled', false);
        }
        this.connectWiseSelectContactListOption = item;
        let selectedOptions = event.target['options'];
        let selectedIndex = selectedOptions.selectedIndex;
        this.hubSpotContactListName = selectedOptions[selectedIndex].text;
    }

    getConnectWiseData() {
        $("button#salesforce_save_button").prop('disabled', true);
        if (this.contactType === "contacts") {
            this.getConnectWiseContacts();
            this.hubSpotContactListName = '';
        } else if (this.contactType === "lists") {
            this.getConnectWiseContactListsById();
        }
    }

    getConnectWiseContacts() {
        this.loading = true;
        this.integrationService.getContacts('connectwise').subscribe(data => {
            this.loading = false;
            if (data.statusCode == 401) {
                this.customResponse = new CustomResponse('ERROR', data.message, true);
            } else {
                let response = data.data;
                this.selectedAddContactsOption = 12;
                this.disableOtherFuctionality = true;
                this.connectWiseImageBlur = false;
                this.connectWiseImageNormal = true;
                this.frameConnectWisePreview(response);
            }
        }, (error: any) => {
            this.loading = false;
            let errorMessage = this.referenceService.getApiErrorMessage(error);
            this.customResponse = new CustomResponse('ERROR', errorMessage, true);
        }, () =>
            this.xtremandLogger.log("ConnectWise Configuration Checking done")
        );
    }
    getConnectWiseContactListsById() {
        this.loading = true;
        if (this.connectWiseSelectContactListOption !== undefined && this.connectWiseSelectContactListOption !== '') {
            this.integrationService.getContactListsById(this.connectWiseSelectContactListOption, 'connectwise').subscribe(data => {
                this.loading = false;
                if (data.statusCode == 401) {
                    this.customResponse = new CustomResponse('ERROR', data.message, true);
                } else {
                    let response = data.data;
                    this.selectedAddContactsOption = 12;
                    this.disableOtherFuctionality = true;
                    this.connectWiseImageBlur = false;
                    this.connectWiseImageNormal = true;
                    this.frameConnectWisePreview(response);
                }
            }, (error: any) => {
                this.loading = false;
                let errorMessage = this.referenceService.getApiErrorMessage(error);
                this.customResponse = new CustomResponse('ERROR', errorMessage, true);
            }, () =>
                this.xtremandLogger.log("ConnectWise Configuration Checking done")
            );
        }
    }
    frameConnectWisePreview(response: any) {
        if (!response.contacts) {
            this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
        } else {
            this.socialContactUsers = [];
            for (var i = 0; i < response.contacts.length; i++) {
                this.xtremandLogger.log("Contact :" + response.contacts[i].firstName);
                let socialContact = new SocialContact();
                socialContact = response.contacts[i];
                socialContact.id = i;
                if (this.validateEmailAddress(response.contacts[i].email)) {
                    this.socialContactUsers.push(socialContact);
                }
                $("button#sample_editable_1_new").prop('disabled', false);
                //$( "#Gfile_preview" ).show();
                this.showFilePreview();
                $("button#cancel_button").prop('disabled', false);
                $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
                $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                $('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.microsoftImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                $('.haloPSAImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                $('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                $('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
            }
        }
        this.setPage(1);
        this.selectedAddContactsOption = 12;
        this.disableOtherFuctionality = true;
        this.socialContact.contacts = this.socialContactUsers;
    }

    //XNFR-403

    checkSyncStatus() {
        this.pageLoader = true;
        this.contactService.checkSyncStatus(this.loggedInUserId).subscribe(
            response => {

                if (response.statusCode == 200) {
                    this.masterContactListSync = response.data.masterContactListSync;
                    this.contactsCompanyListSync = response.data.contactsCompanyListSync;
                }
                this.pageLoader = false;
            },
            error => {
                this.pageLoader = false;
                this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
            }
        );
    }

    saveExternalContactsWithPermission(type: string) {
        this.loading = true;
        if (this.socialContactsNames.includes(type)) {
            this.setSocialUserObjs();
        } else {
            this.setSocialUsers(this.socialContact);
        }
        this.setLegalBasisOptions(this.socialUsers);
        if (this.contactType === undefined || this.contactType === "" || this.contactType === 'contacts') {
            this.contactType = "CONTACT";
        }
        this.userUserListWrapper = this.getUserUserListWrapperObj(this.socialUsers, this.model.contactListName, this.isPartner, this.model.isPublic,
            this.contactType.toLocaleUpperCase(), type.toLocaleUpperCase(), this.salesforceListViewId, type === 'MARKETO' ? false : true);
        if (this.assignLeads) {
            this.userUserListWrapper.userList.assignedLeadsList = true;
        }
        this.userUserListWrapper.userList.externalListId = this.hubSpotSelectContactListOption;
        this.saveList(this.userUserListWrapper);
    }

    saveExternalSelectedContactsWithPermission() {
        this.loading = true;
        this.setLegalBasisOptions(this.allselectedUsers);
        this.userUserListWrapper = this.getUserUserListWrapperObj(this.allselectedUsers, this.model.contactListName, this.isPartner, this.model.isPublic,
            "CONTACT", "MANUAL", this.alias, false);
        if (this.assignLeads) {
            this.userUserListWrapper.userList.assignedLeadsList = true;
        }
        this.saveList(this.userUserListWrapper);
    }

    saveList(userUserListWrapper: UserUserListWrapper) {
        this.loading = true;
        this.contactService.saveContactList(userUserListWrapper)
            .subscribe(
                data => {
                    if (data.access) {
                        data = data;
                        this.loading = false;
                        if (data.statusCode === 401) {
                            this.customResponse = new CustomResponse('ERROR', data.message, true);
                            this.socialUsers = [];
                        } else if (data.statusCode === 402) {
                            this.customResponse = new CustomResponse('ERROR', data.message + '<br>' + data.data, true);
                            this.socialUsers = [];
                        } else {
                            this.selectedAddContactsOption = 8;
                            this.xtremandLogger.info("update Contacts ListUsers:" + data);
                            this.contactService.successMessage = true;
                            this.contactService.saveAsSuccessMessage = "add";
                            this.disableOtherFuctionality = false;
                            if (this.assignLeads) {
                                this.router.navigateByUrl('/home/assignleads/manage');
                                localStorage.setItem('isZohoSynchronization', 'no');
                                localStorage.removeItem('isZohoSynchronization');
                            } else if (this.isPartner == false) {
                                this.router.navigateByUrl('/home/contacts/manage');
                                localStorage.removeItem('isZohoSynchronization');
                            } else {
                                this.router.navigateByUrl('home/partners/manage');
                                localStorage.removeItem('isZohoSynchronization');
                            }
                        }

                    } else {
                        this.authenticationService.forceToLogout();
                        localStorage.removeItem('isZohoSynchronization');
                    }
                },
                (error: any) => {
                    this.loading = false;
                    if (error._body.includes("email addresses in your contact list that aren't formatted properly")) {
                        this.customResponse = new CustomResponse('ERROR', JSON.parse(error._body).message, true);
                    } else {
                        this.xtremandLogger.errorPage(error);
                    }
                    this.xtremandLogger.error(error);
                },
                () => this.xtremandLogger.info("addcontactComponent saveacontact() finished")
            )
    }

    checkingHaloPSAContactsAuthentication() {
        if (this.selectedAddContactsOption == 13) {
            this.integrationService.checkConfigurationByType('haloPSA').subscribe(data => {
                let response = data;
                if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {
                    this.xtremandLogger.info("isAuthorize true");
                    this.getHaloPSAContacts();
                }
                else {
                    this.showHaloPSAPreSettingsForm();
                }
            }, (error: any) => {
                this.loading = false;
                let errorMessage = this.referenceService.getApiErrorMessage(error);
                this.customResponse = new CustomResponse('ERROR', errorMessage, true);
                this.xtremandLogger.error(error, "Error in HaloPSA checkIntegrations()");
            }, () =>
                this.xtremandLogger.log("HaloPSA Configuration Checking done")
            );
        }
    }

    getHaloPSAContacts() {
        this.loading = true;
        this.integrationService.getContacts('HaloPSA').subscribe(data => {
            this.loading = false;
            if (data.statusCode == 401) {
                this.customResponse = new CustomResponse('ERROR', data.message, true);
            } else {
                let response = data.data;
                this.selectedAddContactsOption = 13;
                this.disableOtherFuctionality = true;
                this.haloPSAImageBlur = false;
                this.haloPSAImageNormal = true;
                this.frameHaloPSAPreview(response);
            }
        }, (error: any) => {
            this.loading = false;
            let errorMessage = this.referenceService.getApiErrorMessage(error);
            this.customResponse = new CustomResponse('ERROR', errorMessage, true);
        }, () =>
            this.xtremandLogger.log("HaloPSA Configuration Checking done")
        );
    }

    showHaloPSAPreSettingsForm() {
        this.showHaloPSAAuthenticationForm = true;
    }

    closeHaloPSAForm(event: any) {
        if (event === "0") {
            this.showHaloPSAAuthenticationForm = false;
        }
    }

    frameHaloPSAPreview(response: any) {
        if (!response.contacts) {
            this.customResponse = new CustomResponse('ERROR', this.properties.NO_RESULTS_FOUND, true);
        } else {
            this.socialContactUsers = [];
            for (var i = 0; i < response.contacts.length; i++) {
                this.xtremandLogger.log("Contact :" + response.contacts[i].firstName);
                let socialContact = new SocialContact();
                socialContact = response.contacts[i];
                socialContact.id = i;
                if (this.validateEmailAddress(response.contacts[i].email)) {
                    this.socialContactUsers.push(socialContact);
                }
                $("button#sample_editable_1_new").prop('disabled', false);
                //$( "#Gfile_preview" ).show();
                this.showFilePreview();
                $("button#cancel_button").prop('disabled', false);
                $('.mdImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#addContacts').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('#uploadCSV').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;min-height:85px;border-radius: 3px');
                $('#copyFromClipBoard').attr('style', '-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.googleImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                $('.marketoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.microsoftImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.pipedriveImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.salesForceImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.hubspotImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.connectWiseImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed;');
                $('.zohoImageClass').attr('style', 'opacity: 0.5;-webkit-filter: grayscale(100%);filter: grayscale(100%);cursor:not-allowed');
                $('#GgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                $('#ZgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
                $('#SgearIcon').attr('style', 'opacity: 0.5;position: relative;top: -81px;left: 71px;-webkit-filter: grayscale(100%);filter: grayscale(100%);');
            }
        }
        this.setPage(1);
        this.selectedAddContactsOption = 13;
        this.disableOtherFuctionality = true;
        this.socialContact.contacts = this.socialContactUsers;
    }


}
