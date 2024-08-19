export class SortOption {
	pager: any = {};
	pagedItems: any[];
	public totalRecords: number = 1;
	public searchKey: string = "";
	sortByDropDown = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Name(A-Z)', 'value': 'campaign-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'campaign-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' }
	];

	partnerCampaignDetailsSortDropDown = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Name(A-Z)', 'value': 'campaign-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'campaign-DESC' },
		{ 'name': 'Launched By(ASC)', 'value': 'launchedBy-ASC' },
		{ 'name': 'Launched By(DESC)', 'value': 'launchedBy-DESC' },
		{ 'name': 'Launched On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Launched On(DESC)', 'value': 'createdTime-DESC' }

	];

	campaignPartnersRemoveAccessSortDropDown = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
		{ 'name': 'Company Name (A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company Name (Z-A)', 'value': 'companyName-DESC' }
	];

	templateDownloadSortDropDown = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
		{ 'name': 'Company Name (A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company Name (Z-A)', 'value': 'companyName-DESC' },
		{ 'name': 'Download Count (DESC)', 'value': 'download-DESC' },
		{ 'name': 'Download Count (ASC)', 'value': 'downloads-ASC' },
	];

	leadPartnersSortDropDown = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
		{ 'name': 'Leads Count(ASC)', 'value': 'count-ASC' },
		{ 'name': 'Leads Count(DESC)', 'value': 'count-DESC' }
	];

	dealPartnersSortDropDown = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
		{ 'name': 'Deals Count(ASC)', 'value': 'count-ASC' },
		{ 'name': 'Deals Count(DESC)', 'value': 'count-DESC' }
	];



	leadsSortDropDown = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'Campaign Name(A-Z)', 'value': 'campaignName-ASC' },
		{ 'name': 'Campaign Name(Z-A)', 'value': 'campaignName-DESC' },
		{ 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
		{ 'name': 'Deal Title(ASC)', 'value': 'title-ASC' },
		{ 'name': 'Deal Title(DESC)', 'value': 'title-DESC' },
		{ 'name': 'Created Date(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created Date(DESC)', 'value': 'createdTime-DESC' }
	];

	leadCampaignsSortDropDown = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Campaign Name(A-Z)', 'value': 'campaign-ASC' },
		{ 'name': 'Campaign Name(Z-A)', 'value': 'campaign-DESC' },
		{ 'name': 'Launch Date(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Launch Date(DESC)', 'value': 'createdTime-DESC' },
		{ 'name': 'Lead Count(ASC)', 'value': 'count-ASC' },
		{ 'name': 'Lead Count(DESC)', 'value': 'count-DESC' }
	]
	dealCampaignsSortDropDown = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Campaign Name(A-Z)', 'value': 'campaign-ASC' },
		{ 'name': 'Campaign Name(Z-A)', 'value': 'campaign-DESC' },
		{ 'name': 'Launch Date(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Launch Date(DESC)', 'value': 'createdTime-DESC' },
		{ 'name': 'Deal Count(ASC)', 'value': 'count-ASC' },
		{ 'name': 'Deal Count(DESC)', 'value': 'count-DESC' }
	]

	dealCampaignsSortDropDownOld = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Name(A-Z)', 'value': 'campaign-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'campaign-DESC' },
		{ 'name': 'Email ID(A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email ID(Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
		{ 'name': 'Created Date(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created Date(DESC)', 'value': 'createdTime-DESC' },
		{ 'name': 'Deals Count(ASC)', 'value': 'count-ASC' },
		{ 'name': 'Deals Count(DESC)', 'value': 'count-DESC' }
	];

	manageFormsSortOptions = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Name (A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Name (Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' },
		{ 'name': 'Updated On (ASC)', 'value': 'updatedTime-ASC' },
		{ 'name': 'Updated On (DESC)', 'value': 'updatedTime-DESC' }
	];

	partnerLandingPageSortOptions = [
		{ 'name': 'Name (A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Name (Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Shared On (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Shared On (DESC)', 'value': 'createdTime-DESC' }
	];

	demoRequestSortOptions = [
		{ 'name': 'First Name (A-Z)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name (Z-A)', 'value': 'firstName-DESC' },
		{ 'name': 'Email Id (A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email Id (Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'TimeZone (A-Z)', 'value': 'timezone-ASC' },
		{ 'name': 'TimeZone(Z-A)', 'value': 'timezone-DESC' },
		{ 'name': 'Created Time (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created Time (DESC)', 'value': 'createdTime-DESC' }
	];

	categorySortDropDownOptions = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Name (A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Name (Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' },
		{ 'name': 'Updated On (ASC)', 'value': 'updatedTime-ASC' },
		{ 'name': 'Updated On (DESC)', 'value': 'updatedTime-DESC' },
		{ 'name': 'Count (ASC)', 'value': 'count-ASC' },
		{ 'name': 'Count (DESC)', 'value': 'count-DESC' }

	];

	shareCampaignSortDropDownOptions = [
		{ 'name': 'Campaign Name (A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Campaign Name  (Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Launched On (ASC)', 'value': 'launchedOn-ASC' },
		{ 'name': 'Launched On (DESC)', 'value': 'launchedOn-DESC' }
	];

	activeUsersSortDropDownOptions = [
		{ 'name': 'First Name (A-Z)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name (Z-A)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name (A-Z)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name (Z-A)', 'value': 'lastName-DESC' },
		{ 'name': 'Email Id (A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email Id (Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'Company Name (A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company Name (Z-A)', 'value': 'companyName-DESC' },
		{ 'name': 'Created Time (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created Time (DESC)', 'value': 'createdTime-DESC' }
	];

	mdfPartnersSortDropDownOptions = [
		{ 'name': 'First Name (A-Z)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name (Z-A)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name (A-Z)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name (Z-A)', 'value': 'lastName-DESC' },
		{ 'name': 'Email Id (A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email Id (Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'Company Name (A-Z)', 'value': 'contactCompany-ASC' },
		{ 'name': 'Company Name (Z-A)', 'value': 'contactCompany-DESC' },
		{ 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' }
	];

	publishedPartnerAnalyticsDropDown = [
		{ 'name': 'First Name (A-Z)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name (Z-A)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name (A-Z)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name (Z-A)', 'value': 'lastName-DESC' },
		{ 'name': 'Email Id (A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email Id (Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'Company Name (A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company Name (Z-A)', 'value': 'companyName-DESC' },
		{ 'name': 'View Count (DESC)', 'value': 'viewCount-DESC' },
		{ 'name': 'View Count (ASC)', 'value': 'viewCount-ASC' },
		{ 'name': 'Download Count (DESC)', 'value': 'downloadCount-DESC' },
		{ 'name': 'Download Count (ASC)', 'value': 'downloadCount-ASC' }
	];

	mdfVendorsSortDropDownOptions = [
		{ 'name': 'Company Name (A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company Name (Z-A)', 'value': 'companyName-DESC' },
		{ 'name': 'Number Of Requests(ASC)', 'value': 'count-ASC' },
		{ 'name': 'Number Of Requests(DESC)', 'value': 'count-DESC' },
		{ 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' }
	];

	userLevelCampaignAnalyticsSortDropDownOptions = [
		{ 'name': 'Campaign Name (A-Z)', 'value': 'campaignName-ASC' },
		{ 'name': 'Campaign Name (Z-A)', 'value': 'campaignName-DESC' },
		{ 'name': 'Latest View (ASC)', 'value': 'latestView-ASC' },
		{ 'name': 'Latest View (DESC)', 'value': 'latestView-DESC' },
		{ 'name': 'Email Opened (ASC)', 'value': 'emailOpenedCount-ASC' },
		{ 'name': 'Email Opened (DESC)', 'value': 'emailOpenedCount-DESC' },
		{ 'name': 'Clicked Urls (ASC)', 'value': 'clickedUrlsCount-ASC' },
		{ 'name': 'Clicked Urls (DESC)', 'value': 'clickedUrlsCount-DESC' },
		{ 'name': 'Auto Responses (ASC)', 'value': 'autoResponsesCount-ASC' },
		{ 'name': 'Auto Responses (DESC)', 'value': 'autoResponsesCount-DESC' },
		{ 'name': 'Launched On (ASC)', 'value': 'launchTime-ASC' },
		{ 'name': 'Launched On (DESC)', 'value': 'launchTime-DESC' }
	];

	damSortDropDownOptions = [
		{ 'name': 'Name(A-Z)', 'value': 'assetName-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'assetName-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' }
	];
	publishedDamSortDropDownOptions = [
		{ 'name': 'Name(A-Z)', 'value': 'assetName-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'assetName-DESC' },
		{ 'name': 'Published On(ASC)', 'value': 'publishedTime-ASC' },
		{ 'name': 'Published On(DESC)', 'value': 'publishedTime-DESC' }
	];

	damPartnersDropDownOptions = [
		{ 'name': 'Name(A-Z)', 'value': 'assetName-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'assetName-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' }
	];

	tagSortDropDownOptions = [
		{ 'name': 'Name(A-Z)', 'value': 'tagName-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'tagName-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' },
		{ 'name': 'Updated On(ASC)', 'value': 'updatedTime-ASC' },
		{ 'name': 'Updated On(DESC)', 'value': 'updatedTime-DESC' }
	];


	partnerCompaniesDropDownOptions = [
		{ 'name': 'Company Name(A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company Name(Z-A)', 'value': 'companyName-DESC' },
		{ 'name': 'Created Time(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created Time(DESC)', 'value': 'createdTime-DESC' }
	]

	groupsSortDropDownOptions = [
		{ 'name': 'List name (A-Z)', 'value': 'name-ASC' },
		{ 'name': 'List name (Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Creation date (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Creation date (DESC)', 'value': 'createdTime-DESC' },
	];

	partnerCompanySortDropDownOptions = [
		{ 'name': 'Company name (A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company name (Z-A)', 'value': 'companyName-DESC' },
	];

	campaignRecipientsDropDownOptions = [
		{ 'name': 'Name(A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' },
		{ 'name': 'Count(ASC)', 'value': 'count-ASC' },
		{ 'name': 'Count(DESC)', 'value': 'count-DESC' }
	];
	
	   eventCampaignRecipientsDropDownOptions = [
        { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
        { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
        { 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' }
    ];

	registeredUsersSortDropDownOptions = [
		{ 'name': 'First Name (A-Z)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name (Z-A)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name (A-Z)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name (Z-A)', 'value': 'lastName-DESC' },
		{ 'name': 'Email Id (A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email Id (Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'Company Name (A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company Name (Z-A)', 'value': 'companyName-DESC' },
		{ 'name': 'Registered On (ASC)', 'value': 'registeredOn-ASC' },
		{ 'name': 'Registered On (DESC)', 'value': 'registeredOn-DESC' }
	];

	loggedInUsersSortDropDownOptions = [
		{ 'name': 'First Name (A-Z)', 'value': 'firstName-ASC' },
		{ 'name': 'First Name (Z-A)', 'value': 'firstName-DESC' },
		{ 'name': 'Last Name (A-Z)', 'value': 'lastName-ASC' },
		{ 'name': 'Last Name (Z-A)', 'value': 'lastName-DESC' },
		{ 'name': 'Email Id (A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email Id (Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'Company Name (A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company Name (Z-A)', 'value': 'companyName-DESC' },
		{ 'name': 'Last Login (ASC)', 'value': 'lastLoginOn-ASC' },
		{ 'name': 'Last Login (DESC)', 'value': 'lastLoginOn-DESC' }
	];

	channelCampaignSortDropDownOptions = [
		{ 'name': 'Campaign Name (A-Z)', 'value': 'campaignName-ASC' },
		{ 'name': 'Campaign Name (Z-A)', 'value': 'campaignName-DESC' },
		{ 'name': 'Launched By (Email Id) (A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Launched By (Email Id) (Z-A)', 'value': 'emailId-DESC' },
		{ 'name': '#Redistributed (ASC)', 'value': 'redistributedCount-ASC' },
		{ 'name': '#Redistributed (DESC)', 'value': 'redistributedCount-DESC' }
	];

	workflowsSortDropDownOptions = [
		{ 'name': 'Campaign Name (A-Z)', 'value': 'campaignName-ASC' },
		{ 'name': 'Campaign Name (Z-A)', 'value': 'campaignName-DESC' },
		{ 'name': 'Emails Sent (ASC)', 'value': 'emailsSent-ASC' },
		{ 'name': 'Emails Sent (DESC)', 'value': 'emailsSent-DESC' },
		{ 'name': 'Reply In Days (ASC)', 'value': 'replyInDays-ASC' },
		{ 'name': 'Reply In Days (DESC)', 'value': 'replyInDays-DESC' },
		{ 'name': 'Reply Time (ASC)', 'value': 'replyTime-ASC' },
		{ 'name': 'Reply Time (DESC)', 'value': 'replyTime-DESC' }
	];

	unsubscribeReasonsDropDownOptions = [
		{ 'name': 'Reason(A-Z)', 'value': 'reason-ASC' },
		{ 'name': 'Reason(Z-A)', 'value': 'reason-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' }
	];

	teamMemberGroupDropDownOptions = [
		{ 'name': 'Name(A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' },
		{ 'name': 'Updated On(ASC)', 'value': 'updatedTime-ASC' },
		{ 'name': 'Updated On(DESC)', 'value': 'updatedTime-DESC' }
	];

	videosDropDownOptions = [
        { 'name': 'Name(A-Z)', 'value': 'title-ASC' },
        { 'name': 'Name(Z-A)', 'value': 'title-DESC' },
        { 'name': 'Uploaded Date(ASC)', 'value': 'uploadedDate-ASC' },
        { 'name': 'Uploaded Date(DESC)', 'value': 'uploadedDate-DESC' }
    ];

	partnerJourneyWorkflowsDropDownOptions = [
		{ 'name': 'Title(A-Z)', 'value': 'title-ASC' },
		{ 'name': 'Title(Z-A)', 'value': 'title-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' }
	];

	domainsDropDownOptions = [
		{ 'name': 'Domain(A-Z)', 'value': 'domain-ASC' },
		{ 'name': 'Domain(Z-A)', 'value': 'domain-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' }
	];


	numberOfItemsPerPage = [
		{ 'name': '12', 'value': '12' },
		{ 'name': '24', 'value': '24' },
		{ 'name': '48', 'value': '48' }
	];

	damSortDropDownOptionsForPartner = [
		{ 'name': 'Name(A-Z)', 'value': 'assetName-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'assetName-DESC' },
		{ 'name': 'Published On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Published On(DESC)', 'value': 'createdTime-DESC' }
	];

	processingUserListsDropDownOptions = [
		{ 'name': 'Name(A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Company Name(A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company Name(Z-A)', 'value': 'companyName-DESC' },
		{ 'name': 'Count(ASC)', 'value': 'count-ASC' },
		{ 'name': 'Count(DESC)', 'value': 'count-DESC' },
		{ 'name': 'Uploaded On(ASC)', 'value': 'updatedTime-ASC' },
		{ 'name': 'Uploaded On(DESC)', 'value': 'updatedTime-DESC' }
	];

	damPartnerCompaniesDropDown = [
		{ 'name': 'Company Name (A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company Name (Z-A)', 'value': 'companyName-DESC' },
		{ 'name': 'View Count (ASC)', 'value': 'viewCount-ASC' },
		{ 'name': 'View Count (DESC)', 'value': 'viewCount-DESC' },
		{ 'name': 'Download Count (ASC)', 'value': 'downloadCount-ASC' },
		{ 'name': 'Download Count (DESC)', 'value': 'downloadCount-DESC' }
	];


	customLinksCompaniesDropDown = [
		{ 'name': 'Title (A-Z)', 'value': 'buttonTitle-ASC' },
		{ 'name': 'Title (Z-A)', 'value': 'buttonTitle-DESC' },
		{ 'name': 'Link (ASC)', 'value': 'buttonLink-ASC' },
		{ 'name': 'Link (DESC)', 'value': 'buttonLink-DESC' },
		{ 'name': 'Created On (ASC)', 'value': 'timestamp-ASC' },
		{ 'name': 'Created On (DESC)', 'value': 'timestamp-DESC' }
	];

	integrationDetailsDropDown = [
		{ 'name': 'Company Name (A-Z)', 'value': 'companyName-ASC' },
		{ 'name': 'Company Name (Z-A)', 'value': 'companyName-DESC' },
		{ 'name': 'Integration Type (ASC)', 'value': 'type-ASC' },
		{ 'name': 'Integration Type (DESC)', 'value': 'type-DESC' },
		{ 'name': 'Created Time (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created Time (DESC)', 'value': 'createdTime-DESC' }
	]


	public selectedSortedOption: any = this.sortByDropDown[0];
	public defaultSortOption: any = this.partnerCampaignDetailsSortDropDown[0];
	public dealsPartnerSortOption: any = this.dealPartnersSortDropDown[0];
	public leadPartnerSortOption: any = this.leadPartnersSortDropDown[0];
	public leadsSortOption: any = this.leadsSortDropDown[0];
	public dealCampaignSortOption: any = this.dealCampaignsSortDropDown[0];
	public leadCampaignSortOption: any = this.leadCampaignsSortDropDown[0];
	public campaignPartnersRemoveAccessDefaultSortOption: any = this.campaignPartnersRemoveAccessSortDropDown[0];
	public formsSortOption: any = this.manageFormsSortOptions[0];
	public partnerLandingPageSortOption: any = this.partnerLandingPageSortOptions[3];
	public selectedDemoRequestSortOption:  any = this.demoRequestSortOptions[7];
	public selectedCategoryDropDownOption: any = this.categorySortDropDownOptions[0];
	public selectedShareCampaignDropDownOption: any = this.shareCampaignSortDropDownOptions[3];
	public selectedActiveUsersSortOption: any = this.activeUsersSortDropDownOptions[4];//This is used in multiple places.Be careful while changing it dude.
	public selectedDamPartnerDropDownOption: any = this.partnerCompaniesDropDownOptions[this.partnerCompaniesDropDownOptions.length - 1];
	public mdfPartnersSortOption: any = this.mdfPartnersSortDropDownOptions[9];
	public publishedPartnerAnalyticsSortOption: any = this.publishedPartnerAnalyticsDropDown[4];
	public mdfVendorsSortOption: any = this.mdfVendorsSortDropDownOptions[5];
	public userLevelCampaignAnalyticsSortOption: any = this.userLevelCampaignAnalyticsSortDropDownOptions[this.userLevelCampaignAnalyticsSortDropDownOptions.length - 1];
	public damSortOption: any = this.damSortDropDownOptions[this.damSortDropDownOptions.length-1];
	public publishedDamSortOption: any = this.publishedDamSortDropDownOptions[this.publishedDamSortDropDownOptions.length - 1];
	public templateDownloadPartnerSortOption: any = this.templateDownloadSortDropDown[0];
	public itemsSize: any = this.numberOfItemsPerPage[0];
	isListView: boolean = false;
	selectedCampaignTypeIndex:number = 0;
	public selectedTagDropDownOption: any = this.tagSortDropDownOptions[3];
	public selectedGroupsDropDownOption: any = this.groupsSortDropDownOptions[3];
	public selectedPartnerCompanyDropDownOption = this.partnerCompanySortDropDownOptions[0];
	public selectedCampaignRecipientsDropDownOption = this.campaignRecipientsDropDownOptions[3];
	public eventSelectedCampaignRecipientsDropDownOption = this.eventCampaignRecipientsDropDownOptions[3];
	public selectedRegisteredUsersSortDropDownOption = this.registeredUsersSortDropDownOptions[this.registeredUsersSortDropDownOptions.length  - 1];
	public selectedLoggedInUsersSortDropDownOption = this.loggedInUsersSortDropDownOptions[this.loggedInUsersSortDropDownOptions.length - 1];
	public selectedChannelCampaignSortDropDownOption = this.channelCampaignSortDropDownOptions[this.channelCampaignSortDropDownOptions.length -1];
	public selectedWorkflowSortDropDownOption = this.workflowsSortDropDownOptions[this.workflowsSortDropDownOptions.length-1];
	public selectedUnsubscribeReasonSortDropDownOption: any = this.unsubscribeReasonsDropDownOptions[this.unsubscribeReasonsDropDownOptions.length-1];
	public selectedTeamMemberGroupSortDropDown = this.teamMemberGroupDropDownOptions[this.teamMemberGroupDropDownOptions.length-3];
	public selectedAgencySortDropDownOption: any = this.activeUsersSortDropDownOptions[this.activeUsersSortDropDownOptions.length-1];
	/****XNFR-278*****/
	public selectedUserListGroupDropDownOption = this.campaignRecipientsDropDownOptions[0];
	/*****XNFR-318*****/
	public selectedCampaignEmailTemplateDropDownOption = this.eventCampaignRecipientsDropDownOptions[this.eventCampaignRecipientsDropDownOptions.length-1];

	public selectedVideoDropDownOption = this.videosDropDownOptions[this.videosDropDownOptions.length-1];

	public selectedPartnerJourneyWorkflowDropDownOption = this.partnerJourneyWorkflowsDropDownOptions[this.partnerJourneyWorkflowsDropDownOptions.length-1];


	public damSortOptionForPartner: any = this.damSortDropDownOptionsForPartner[this.damSortDropDownOptionsForPartner.length-1]; 

	/*****XNFR-454*****/
	selectedDomainDropDownOption = this.domainsDropDownOptions[this.domainsDropDownOptions.length-1];

	selectedProcessingUserListsDropDownOption = this.processingUserListsDropDownOptions[this.processingUserListsDropDownOptions.length-1];

	/*****XNFR-543*****/
	selectedDamPartnerCompaniesDropDownOption = this.damPartnerCompaniesDropDown[0];


	/***XNFR-571****/
	selectedCustomLinksDropDownOption = this.customLinksCompaniesDropDown[this.customLinksCompaniesDropDown.length-1];

	selectedIntegrationDetailsDropDownOption = this.integrationDetailsDropDown[0];


}
