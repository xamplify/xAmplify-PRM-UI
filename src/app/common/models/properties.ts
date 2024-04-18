
export class Properties {

	/*App Info*/
	COMPANY_LOGO = 'assets/images/xamplify-logo.png';
	FULL_YEAR = new Date().getFullYear();
	COPY_RIGHT_PREFIX = '&copy; ' + this.FULL_YEAR;
	BOTTOM_MESSAGE = this.COPY_RIGHT_PREFIX + ' xAmplify. All rights reserved.'
	APP_WEBSITE = 'xAmplify';
	APP_WELCOME_MESSAGE = 'Welcome to xAmplify';
	APP_Xamplify_URL = "https://xamplify.io";
	xamplify_router = 'https://www.xamplify.com/';

	NO_RESULTS_FOUND = "No results found.";
	EMAIL_SENT_SUCCESS = "Email sent successfully.";
	NO_USERS_SELECT_ERROR = "You have not selected any user.";
	//FOR CONTACTS
	FILE_TYPE_ERROR = "File type not allowed please select the .csv file only.";
	CONTACT_LIST_CREATE_SUCCESS = "Your contact list has been created successfully and it is being processed.";
	LEAD_LIST_CREATE_SUCCESS = "Your lead list has been created successfully and it is being processed.";
	CONTACT_LIST_SAVE_SUCCESS = "Your contact list has been saved successfully";
	CONTACT_LIST_CREATE_ERROR = "An error occured while creating your contact list.";

	CONTACT_LIST_UPDATE_SUCCESS = "Your contact list has been updated successfully.";
	CONTACT_LIST_UPDATE_ERROR: "An error occured while updating your contact list.";

	CONTACT_LIST_DELETE_SUCCESS = "Your contact list has been deleted successfully.";
	CONTACT_LIST_DELETE_ERROR = "An Error occured while deleting your Contact List.";
	LEAD_LIST_DELETE_SUCCESS = "Your lead list has been deleted successfully.";

	CONTACT_LIST_SYNCHRONIZATION_SUCCESS = "Your contact list has been synchronized successfully.";
	CONTACT_LIST_SYNCHRONIZATION_ERROR = "An error occured while synchronizing your Contact List.";
	MARKETO_CONTACT_LIST_SYNCHRONIZATION_SUCCESS = "Synchronization initiated successfully. It might take few minutes.";

	LEAD_LIST_SYNCHRONIZATION_SUCCESS = "Your lead list has been synchronized successfully.";
	LEAD_LIST_SYNCHRONIZATION_ERROR = "An error occured while synchronizing your Lead List.";

	CONTACTS_CREATE_SUCCESS = "Your contacts list have been created successfully.";
	CONTACTS_CREATE_ERROR = "An error occured while creating your Contacts";

	LEADS_UPDATE_SUCCESS = "Your lead details has been updated successfully.";
	CONTACTS_UPDATE_SUCCESS = "Your contact has been updated successfully.";
	CONTACTS_UPDATE_ERROR = "An error occured while updating your contacts.";

	CONTACTS_DELETE_SUCCESS = "Your Contacts have been deleted successfully.";
	CONTACTS_DELETE_ERROR = "An error occured while deleting your contacts";
	LEADS_DELETE_SUCCESS = "Your lead(s) have been deleted successfully.";

	LEAD_LIST_UPDATE_SUCCESS = "Your lead list has been updated successfully.";
	CONTACT_SAVE_SUCCESS = "Your contact list has been updated successfully.";
	CONTACT_SAVE_SUCCESS_AND_MAIL_SENT_SUCCESS = "Your contact list has been updated successfully and any selected campaigns have been launched.";
	CONTACTS_SAVE_ERROR = "An error occured while saving your contacts.";

	CONTACT_LIST_NAME_UPDATE_SUCCESS = "Your contact list name has been updated successfully.";
	CONTACT_LIST_NAME_UPDATE_ERROR = "An error occured while saving your contacts.";

	SOCIAL_ACCOUNT_REMOVED_SUCCESS = "Your social account has been removed successfully.";
	SOCIAL_ACCOUNT_REMOVED_ERROR = "An error occured while removing your social Account.";
	CONTACT_LIST_VALIDATION = 'Please click on verify data.';
	CONTACT_EMAIL_VALIDATE_SUCCESS = "Selected Contacts have been validated successfully.";
	CONTACT_REMOVED_FROM_EXCLUDED_LIST = "Selected user has been removed from the excluded list successfully";


	/* For Partners*/
	PARTNER_LIST_CREATE_SUCCESS = "Your partner list has been created successfully and we are processing your partner list";
	PARTNER_LIST_SAVE_SUCCESS = "Your partner list has been saved successfully";
	PARTNER_LIST_NAME_UPDATE_SUCCESS = "Your partner list name has been updated successfully.";
	LEAD_LIST_NAME_UPDATE_SUCCESS = "Your lead list name has been updated successfully.";

	PARTNER_LIST_SYNCHRONIZATION_SUCCESS = "Your Parntner List has been synchronized successfully.";
	PARTNER_LIST_SYNCHRONIZATION_ERROR = "An error occured while synchronizing your partner list.";

	PARTNER_SAVE_SUCCESS_AND_MAIL_SENT_SUCCESS = "Your partner list has been updated successfully and any selected campaigns have been launched.";

	PARTNERS_CREATE_SUCCESS = "Your Partner List has been created successfully.";
	PARTNERS_CREATE_ERROR = "An error occured while creating";

	PARTNERS_UPDATE_SUCCESS = "Your Partner has been updated successfully.";
	PARTNERS_UPDATE_ERROR = "An error occured while updating";

	PARTNERS_DELETE_SUCCESS = "Your Partner(s) have been deleted successfully.";
	PARTNERS_LIST_DELETE_SUCCESS = 'Your Partner list has been deleted successfully.'
	PARTNERS_DELETE_ERROR = "An error occured while deleting.";

	PARTNERS_SAVE_SUCCESS = "Your Partner(s) have been saved successfully.";
	PARTNERS_SAVE_ERROR = "An error occured while saving.";
	PARTNERS_EMAIL_VALIDATE_SUCCESS = "Selected Partner(s) have been validated successfully.";
	LEADS_EMAIL_VALIDATE_SUCCESS = "Selected Lead(s) have been validated successfully.";

	/* Authentication Module*/

	ACCOUNT_NOT_CREATED = "You don't have an account, Please sign up to create your account.";
	ACCOUNT_ACTIVATED_WITH_PASSWORD = 'Thanks for adding password. Please login to access the platform.';
	FORGOT_PASSWORD_MAIL_SEND_SUCCESS = "Check your inbox for a temporary password.";
	FORGOT_PASSWORD_MAIL_SEND_ERROR = "An error occured while sending mail.";

	SIGN_UP_SUCCESS = "Thanks for signing up! Please check your inbox for activation email.";
	TEAM_MEMBER_SIGN_UP_SUCCESS = "Thanks for signing up! Please login to access the platform.";
	ACCOUNT_ACTIVATED_SUCESS = 'Thanks for activating your account. Please log in to complete your company profile.';
	SIGN_UP_ERROR = "An error occurred while processing your request. Please try after some time.";
	ACCOUNT_DEACTIVATE_SUCCESS = "OrgAdmin deactivation successfully done.";
	WRONG_EMAIL_ADDRESS = "We couldn't find your account. Please check that you've entered the correct email address and try again.";
	ERROR_EMAIL_ADDRESS = "The email address that you've entered doesn't match any account. Sign up for an account.";
	OTHER_EMAIL_ISSUE = "UserDetailsService returned null, which is an interface contract violation";

	BAD_CREDENTIAL_ERROR = "Username or password is incorrect.";
	USER_ACCOUNT_DOESNOT_EXIST = "The email address that you've entered doesn't match any account. Sign for an account.";
	/*****XNFR-334 *****/
	RESEND_ACTIVATION_MAIL = 'Please check your inbox for the account activation email.';
	USER_ACCOUNT_ACTIVATION_ERROR = "Your account has not been activated." + this.RESEND_ACTIVATION_MAIL;
	ACCOUNT_SUSPENDED = "This account has been suspended.Please contact admin.";
	/*****XNFR-334 *****/
	EMPTY_CREDENTIAL_ERROR = "Username or password can't be empty.";
	SOMTHING_WENT_WRONG = 'Something went wrong. Please try again.';
	/* User */
	PROCESS_REQUEST_SUCCESS = "Your request has been successfully processed.";
	PROCESS_REQUEST_ERROR = "An error occurred while processing your request.";
	DEFAULT_PLAYER_SETTINGS = 'Default player settings updated successfully.';
	VIDEO_LOGO_UPDATED = 'Co-Branding video logo uploaded successfully.';
	PROFILE_PIC_UPDATED = 'Profile picture updated successfully.';
	COMPANY_PIC_UPDATED = 'Company logo updated successfully.'
	PROFILE_UPDATED = 'Profile updated successfully.';
	PASSWORD_UPDATED = 'Password updated successfully.';
	PAWORD_ERROR = 'New password should not be same as current password.'

	/*Videos*/
	VIDEO_PROCESS_MESSAGE = 'Your video has been uploaded and is now being processed. If you\'d like to take a break, we\'ll continue processing it in the background. We will send you an email when your video is ready.';
	VIDEO_PROCESSING_MESSAGE = 'Don\'t mind us. We\'re just processing your video.'
	CONTENT_UPLOAD_SIZE = 'Unable to upload files because your files size is more than 12 MB';
	CONTENT_UPLOAD_FILETYPE = 'Please upload supported file types like image files, gifs,doc,htm, pdf, xls.';
	CONTENT_PROCESS_MESSAGE = 'Your file(s) has been uploaded. Please wait while we process it.';
	SUPPORT_FILES = 'These plugins only work with the latest versions of Chrome, Firefox, Safari, Opera, Microsoft Edge & Internet Explorer 10.';
	CONTENT_DRAG_MESSAGE = 'Drag and drop files here or click to select files.';
	VIDEO_DRAG_MESSAGE = 'Drag and drop a video file here or click to select a Video file.';

	/* campaign */
	ADD_AUTO_RESPONSE_WEBSITE = 'Auto-Responses to a Website Visit'
	ADD_AUTO_RESPONSE_EMAIL = 'Auto-Responses to Your Email'
	EVENT_TO_PARTNER_MESSAGE = 'To Partners: Send a Campaign Intended ust for Selected Recipients';
	TO_PARTNER_MESSAGE = 'To Recipient(s): Send a Campaign intended just for your Partner(s)/ Contact(s)';
	THROUGH_PARTNER_MESSAGE = 'Through Partner: Send a Campaign that your Partners can Redistribute';
	ENALEORDISABLE_VENDOR_MESSAGE = 'Enable/disable the Vendor access to your Campaign Analytics';
	ACTIVE_PARTICIPANTS = 'Active Participants - Share only the recipients that have interacted with your Campaign';
	ALL_PARTICIPANTS = 'All Participants - Share all Campaign Recipient data';

	/****BEE ClientId/Client Secret********/
	clientId = '18ff022e-fa4e-47e7-b497-39a12ca4600a';
	clientSecret = 'FPzc1oxLx3zFjvwrma82TWiP0o3tk1yRVDwyAQqrIZ6jbfdssVo';

	xclientId: "6639d69f-523f-44ca-b809-a00daa26b367";
	xclientSecret: "XnD77klwAeUFvYS66CbHMd107DMS441Etg9cCOVc63LTYko8NHa";

	serverErrorMessage = "Oops! Something went wrong.Please try after sometime";

	/****************** SAML Security *********************/
	EMAIL_TEXT1 = 'You are about to initiate the SSO configuration with Allbound.'
	EMAIL_TEXT2 = 'Begin by verifying that the email address listed below is associated with your Allbound instance.'
	ACS_URL_TEXT1 = 'Copy and paste the ACS URL into Login and Assertion URL text fields at the time of IDP configuration with Allbound and save the entire settings to download the Metadata.'
	UPLOAD_METADATA_TEXT1 = 'Upload the metadata which is downloaded from Allbound after the IDP configuration, we process the content and will save the same into the system.'
	UPLOAD_METADATA_TEXT2 = 'Success! Processed the metadata and saved into the system.';

	/*************My Profile Tab Names*******************************/
	personalInfo = "Personal Info";
	changePassword = "Change Password";
	viewType = "View Type";
	defaultPlayerSettings = "Default Player Settings";
	dealRegistration = "Deal Registration";
	integrations = "Integrations";
	gdprSettings = "GDPR Settings";
	folders = "Folders";
	dashboardButtons = "Dashboard Buttons";
	samlSettings = "Allbound SAML Settings";
	leadPipelines = "Lead Pipelines";
	dealPipelines = "Deal Pipelines";

	/************XNFR-426**********/
	leadDealApprove = "Lead Approval/Rejection";
	tags = "Tags";
	customskin = "Themes";
	customizeleftmenu = "Customize Left Menu";

	exclude = "Exclusion"
	exclude_add = "User(s) added successfully";
	exclude_delete = "User deleted successfully";
	exclude_domain_add = "Domain added successfully";
	exclude_domain_delete = "Domain deleted successfully";

	spf = "SPF Configuration";
	spfHeaderText = "Publish an SPF record with your DNS registrar";
	unsubscribeReasons = "Unsubscribe Reasons";
	unsubscribeReasonsHeaderText = "Manage Unsubscribe Reasons";
	notifyPartners = "Onboarding Configurations";
	notifyPartnersHeaderText = "Onboarding configurations of your partners";

	vendorJourney = "Vendor Journey";
	landingPages = "Landing Pages";

	/********Error Messages************* */
	roleUpdatedMessage = "Your role has been changed.Please login again.";

	/****************** Vanity Relates *********************/
	VANITY_URL_ERROR1 = "You are not associated to vendor company";
	VANITY_URL_DB_BUTTON_SUCCESS_TEXT = "Button added successfully";
	VANITY_URL_DB_BUTTON_UPDATE_TEXT = "Button updated successfully";
	VANITY_URL_DB_BUTTON_DELETE_TEXT = "Button deleted successfully";
	VANITY_URL_DB_BUTTON_TITLE_ERROR_TEXT = "Button title already exists";
	VANITY_URL_ET_SUCCESS_TEXT = "Email Template updated successfully";
	VANITY_URL_ET_DELETE_TEXT = "Email Template deleted successfully";
	VANITY_URL_EMAIL_TEMPLATE_ERROR_TEXT = "Error while Updating Email Template";

	reAuthenticateMessage = 'Please unlink  and reconnect your account.';

	unableToShowWelcomePageItems = "Error! We are unable to show welcome items now. Please give us some time.";


	zohoImage: string = 'assets/admin/pages/media/works/zoho-contacts.png';
	googleImage: string = 'assets/admin/pages/media/works/google-contacts.png';
	salesforceImage: string = 'assets/admin/pages/media/works/salesforce-contacts.png';
	manualImage: string = 'assets/admin/pages/media/works/contacts2.png';
	marketoImage: string = 'assets/admin/pages/media/works/marketo-conatct.png';
	hubspotImage: string = 'assets/admin/pages/media/works/hubspot-contact.png';
	microsoftImage: string = 'assets/admin/pages/media/works/microsoft-contact.png';
	pipedriveImage: string = 'assets/admin/pages/media/works/pipedrive-contacts.png';
	connectwiseImage: string = 'assets/admin/pages/media/works/connectwise-contacts.png';
	companyListImage: string = 'assets/admin/pages/media/works/company.png';

	connectwiseGridImage: string = 'assets/admin/pages/media/works/Grid_View_Icons/connectwise-contacts.png';
	pipedriveGridImage: string = 'assets/admin/pages/media/works/Grid_View_Icons/pipedrive.png'
	marketoGridImage: string = 'assets/admin/pages/media/works/Grid_View_Icons/Marketo_Logo.png'
	updated_Manual_Image: string = 'assets/admin/pages/media/works/Grid_View_Icons/Manual_Contacts.png';
	hubspotGridImage: string = 'assets/admin/pages/media/works/Grid_View_Icons/Hubspot.png';
	googleGridImage: string = 'assets/admin/pages/media/works/Grid_View_Icons/Google_Contacts.png';
	zohoGridImage: string = 'assets/admin/pages/media/works/Grid_View_Icons/ZOHO.png';
	salesforceGridImage: string = 'assets/admin/pages/media/works/Grid_View_Icons/Salesforce.png';
	microsoftGridImage: string = 'assets/admin/pages/media/works/Grid_View_Icons/Microsoft.png';


	teamMemberGroups = 'Team Member Groups';

	activeMasterPartnerList = 'Active Master Partner List';
	inActiveMasterPartnerList = 'Inactive Master Partner List';

	sandboxText = "The xAmplify Sandbox instance is ideal for safely designing, loading, updating, and testing all modules of the platform. The xAmplify Sandbox instance type can be used only for testing or user acceptance testing.";
	oneClickLaunch = "One-Click Launch";
	/*****Privacy Policy,Cookies,Terms and conidtions urls */
	privacyPolicyUrl = "https://xamplify.com/privacy-policy-2/";
	cookiesPolicyUrl = "https://xamplify.com/cookies-policy/";
	termsOfServiceUrl = "https://xamplify.com/terms-of-uses/";
	subProcessorsUrl = "https://www.xamplify.com/subprocessors/";
	gdprUrl = "https://gdpr-info.eu/";
	ccpaUrl = "https://www.caprivacy.org/";

	/***One-Click Launch Error Messages */
	emptyShareListErrorMessage = "Edit campaign is no longer available because the vendor deleted the shared list (or) no list associated with this campaign";
	oneClickLaunchRedistributeAccessRemovedErrorMessage = "Edit campaign is no longer available because the vendor deleted the shared list (or) no list associated with this campaign";
	oneClickLaunchAccessErrorMessage = "Edit Campaign is not available because your account no longer has One-Click Launch access";
	oneClickLaunchCampaignExpiredMessage = "Because the campaign has expired, it cannot be redistributed";
	oneClickLaunchCampaignRedistributedErrorMessage = "If the campaign has already been redistributed, please use the redistribute option to relaunch it";
	copyCampaignOneClickLaunchErrorMessage = "Copy Campaign is no longer available because your account's One-Click Launch access has been disabled";
	emptyOneClickLaunchCampaignErrorMessage = "You cannot redistribute the campaign because the vendor deleted the shared list associated with it";
	/****XNFR-131****/
	partnerTeamMemberGroupSelectionSweetAlertMessage = "The selected Team Member Group will be applied and saved to all rows.";
	/***XNFR-128***/
	downloadRequestNotificationMessage = "We are processing your download request.We will send an email once it is completed.";

	/****XNFR-83****/
	agencies = "Agencies";
	agency = "Agency";
	/****Form Classes*****/
	formGroupClass: string = "col-sm-8";
	errorClass: string = "col-sm-8 has-error has-feedback";
	successClass: string = "col-sm-8 has-success has-feedback";
	defaultClass: string = this.formGroupClass;
	formSubmissionFailed = "Form submission failed!";

	/***module names ****/
	emailTemplates = "emailTemplates";
	campaigns = "campaigns";

	/**Campaign****/
	campaignLaunchedMessage = "The campaign was successfully deployed. Please wait until the campaign is processed and launched. We will send you email updates in timely manner."
	deployingCampaignMessage = "We are deploying the campaign";


	/***XNFR-222*****/
	postingOnSocialMedia = "We are posting on social media  and  deploying the campaign";
	schedulingCampaignMessage = "We are scheduling the campaign";

	/****XNFR-224****/
	supportText = "Enable support access to vendor";

	/****XNFR-314****/
	teamMemberPartnerFilter = "Default Partner Filter";

	/***XNFR-318***/
	campaignRegularEmailsFilter = "CampaignRegularEmails";
	campaignVideoEmailsFilter = "CampaignVideoEmails";
	campaignSurveyEmailsFilter = "CampaignSurveyEmails";
	sendTestEmail = "Send Test Email";

	/***24/07/2023******/
	playbackRates = [0.5, 1, 1.5, 2];


	customThemeDescription = "Custom Themes enable the creation of unique branded experiences such as Background Color, Text Color, Button Color, Icon Color and so on. You can select from existing Light and Dark Themes. Set your own theme by choosing colors for the Header, Left Menu, Footer and Page Content blocks.";

	whiteLabeledBanner = "White-Labeled";

	/***XNFR-326*****/
	emailNotificationSettings = "Email Notification Settings";


	/***XNFR-386****/
	customLoginScreen = "Custom Login Screen Settings";

	loginScreenDirectionOptions = ["Center", "Left", "Right"];

	vendorLogoTooltipText = "<b> On </b> - Your company logo will appear on the partner(s) account. <br/>"
		+ "<b> Off </b> -  Your partner(s) logo will remain unchanged. <br/>" + "<b>*This setting does not affect co-branding.</b>";

	/***XNFR-386****/
	/**** XNFR-233 **** */
	loginFormPosition = ["Left", "Right"]

	/***Refer A Vendor ****/
	inviteAVendor = "Invite A vendor";
	inviteVendorToJoinxAmplify = "Invite a vendor to join xAmplify";
	vendorInvites = "Vendor Invites";
	InvitedVendorAnalytics = "Invited Vendor Analytics";
	inviteAVendorToJoinxAmplify = "Invite a vendor to join xAmplify";

	/****XNFR-342****/
	campaignsHeaderText = "Campaigns";
	assetsHeaderText = "Assets";
	tracksHeaderText = "Tracks";
	playBooksHeaderText = "Play Books";
	/****XNFR-342****/

	/***XNFR-454*****/
	newsAndAnnouncements = "News & Announcements";
	dashboardBanners = "Dashboard Banners";
	addDomainsText = "Domain Whitelisting";
	domainWhitelistingDescription = "A whitelist is a list of domains approved for authorized {{moduleName}} to signup and access the platform.";
	domainWhitelistingUrlDescription = "Please share the below URL with users who need to sign up as your {{moduleName}}.";
	noDataFound = "No Data Found";
	maximumDashboardBannersLimitReached = "You have reached the limit of displaying up to 5 dashboard banners. You cannot add any more banners.";
	maximumDashboardBannersLimitMessage = "You can upload maximum 5 dashboard banners"
	instantNavigation = "Instant Navigation";
	pageNotFound = "Oops, the page you're looking for does not exist.";

	eventCampaignTemplateLocalStorageKey = "eventCampaignTemplatePreviewData";

	PARTNERSHIP_ESTABLISHED_SUCCESSFULLY = "The partnership has been established successfully.Please login to access the platform.";
	PARTNERSHIP_ALREADY_ESTABLISHED_WITH_COMPANY_NAME = "The company partnership is already established.";//Do you want to join as a team member?



}

