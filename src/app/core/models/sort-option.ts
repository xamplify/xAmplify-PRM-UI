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

	previewPopUpFormsSortOptions = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Name (A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Name (Z-A)', 'value': 'name-DESC' }
	];

	partnerLandingPageSortOptions = [
		{ 'name': 'Name (A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Name (Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Shared On (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Shared On (DESC)', 'value': 'createdTime-DESC' }
	];

	marketPlaceCategoriesSortOptions = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Name (A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Name (Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' }
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
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'List name (A-Z)', 'value': 'groupName-ASC' },
		{ 'name': 'List name (Z-A)', 'value': 'groupName-DESC' },
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
	];

	/**XNFR-553**/
	emailActivityDropDownOptions = [
		{ 'name': 'Subject(Z-A)', 'value': 'subject-DESC' },
		{ 'name': 'Subject(A-Z)', 'value': 'subject-ASC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' },
	];

	customFieldsDropDown = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Name(A-Z)', 'value': 'customFields-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'customFields-DESC' },
	];

	customFieldsDropDownOptions = [
		{ 'name': 'Name(A-Z)', 'value': 'fieldName-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'fieldName-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' },
	];

	emailTemplatesDropDown = [
        { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
        { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
    ]; 

	activityDropDownOptions = [
		{ 'name': 'All', 'value': 'All-Desc' },
		{ 'name': 'Campaign', 'value': 'Campaign-Desc' },
		{ 'name': 'Lead', 'value': 'Lead-Desc' },
		{ 'name': 'Deal', 'value': 'Deal-Desc' },
		{ 'name': 'Email', 'value': 'Email-Desc' },
		{ 'name': 'Note', 'value': 'Note-Desc' },
		{ 'name': 'Task', 'value': 'Task-Desc'}
	];
  
	/*** XNFR-745 ***/
	groupedAssetsForPlaybookDropDown = [
        { 'name': 'Sort by Folder(A-Z)', 'value': 'folderName-ASC' },
        { 'name': 'Sort by Folder(Z-A)', 'value': 'folderName-DESC' },
    ];

	/**XNFR-757**/
	taskActivityTypeDropDown = [
        { 'name': 'Note', 'value': 'NOTE' },
        { 'name': 'Email', 'value': 'EMAIL' },
		{ 'name': 'To Do', 'value': 'TODO'}
    ];

	taskActivityPriorityDropDown = [
        { 'name': 'High', 'value': 'HIGH'},
        { 'name': 'Medium', 'value': 'MEDIUM' },
		{ 'name': 'Low', 'value': 'LOW' }
    ];

	taskActivityDropDownOptions = [
		{ 'name': 'Name(Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Name(A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' },
	];

	noteActivityDropDownOptions = [
		{ 'name': 'Title(Z-A)', 'value': 'title-DESC' },
		{ 'name': 'Title(A-Z)', 'value': 'title-ASC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' },
	];

	sortByDropDownForPartnerJourney = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Company Name(A-Z)', 'value': 'campaign-ASC' },
		{ 'name': 'Company Name(Z-A)', 'value': 'campaign-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' }
	];

	sortByDropDownForDeactivatedPartnerJourney = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Company Name(A-Z)', 'value': 'campaign-ASC' },
		{ 'name': 'Company Name(Z-A)', 'value': 'campaign-DESC' }
	];

	/***XNFR-783***/
	calendlyDropDownOptions = [
		{ 'name': 'Created On(Desc)', 'value': 'desc' },
		{ 'name': 'Created On(Asc)', 'value': 'asc' }
	]

	approvalHubSortDropDownOptions = [
		{ 'name': 'Name(A-Z)', 'value': 'name-ASC' },
		{ 'name': 'Name(Z-A)', 'value': 'name-DESC' },
		{ 'name': 'Created On(ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Created On(DESC)', 'value': 'createdTime-DESC' }
	];

	/*** XNFR-850 ***/
	inviteTeamMemberAnalyticsDropDownOptions = [
		{ 'name': 'Email Id (A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email Id (Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'Invited On (ASC)', 'value': 'createdTime-ASC' },
		{ 'name': 'Invited On (DESC)', 'value': 'createdTime-DESC' }
	];

	dormantDropDownOptions = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Last Remainder Sent (A-Z)', 'value': 'time-ASC' },
		{ 'name': 'Last Remainder Sent (Z-A)', 'value': 'time-DESC' },
	];

	incompleteCompanyProfileSortOptions = [	
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Last Remainder Sent (A-Z)', 'value': 'sentOn-ASC' },
		{ 'name': 'Last Remainder Sent (Z-A)', 'value': 'sentOn-DESC' },
	]

	approvePartnerSortOptions =[
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Email Id Sent (A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email Id Sent (Z-A)', 'value': 'emailId-DESC' }
	]
	/**XNFR-867**/
	userListLevelCampaignAnalyticsSortDropDownOptions = [
		{ 'name': 'Campaign Name (A-Z)', 'value': 'campaignName-ASC' },
		{ 'name': 'Campaign Name (Z-A)', 'value': 'campaignName-DESC' },
		{ 'name': 'Launched On (ASC)', 'value': 'launchTime-ASC' },
		{ 'name': 'Launched On (DESC)', 'value': 'launchTime-DESC' }
	];

	campaignMdfEmailsHistoryDropDownOptions = [
		{ 'name': 'Email Address (A-Z)', 'value': 'emailId-ASC' },
		{ 'name': 'Email Address (Z-A)', 'value': 'emailId-DESC' },
		{ 'name': 'MDF Key (ASC)', 'value': 'mdfAlias-ASC' },
		{ 'name': 'MDF Key (DESC)', 'value': 'mdfAlias-DESC' },
		{ 'name': 'Total Request Sent (ASC)', 'value': 'requestsCount-ASC' },
		{ 'name': 'Total Request Sent (DESC)', 'value': 'requestsCount-DESC' },
		{ 'name': 'Latest Email Sent Time (ASC)', 'value': 'lastEmailSentAt-ASC' },
		{ 'name': 'Latest Email Sent Time (DESC)', 'value': 'lastEmailSentAt-DESC' }
	];

	teamMemberDropDowns = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Name(A-Z)', 'value': 'nameAsc' },
		{ 'name': 'Name(Z-A)', 'value': 'nameDesc' },
		{ 'name': 'Recent Login ASC', 'value': 'datelastloginAsc' },
		{ 'name': 'Recent Login DESC', 'value': 'datelastloginDesc' },
	];

	activePartnerJourneyDropDowns = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Name(A-Z)', 'value': 'name-Asc' },
		{ 'name': 'Name(Z-A)', 'value': 'name-Desc' },
		{ 'name': 'Recent Login ASC', 'value': 'logInTime-Asc' },
		{ 'name': 'Recent Login DESC', 'value': 'logInTime-Desc' },
	];

	/**XNFR-890**/
	commonFilterOptions = [
		{ 'name': 'firstName', 'value': 'First Name' },
		{ 'name': 'lastName', 'value': 'Last Name' },
		{ 'name': 'Company', 'value': 'Company' },
		{ 'name': 'JobTitle', 'value': 'Job Title' },
		{ 'name': 'Email Id', 'value': 'Email Id' },
		{ 'name': 'country', 'value': 'Country' },
		{ 'name': 'city', 'value': 'City' },
		{ 'name': 'mobileNumber', 'value': 'Mobile Number' },
		{ 'name': 'state', 'value': 'State' }
	];
	partnerFilterOptions = [
		{ 'name': 'vertical', 'value': 'Vertical'  },
		{ 'name': 'region', 'value': 'Region'  },
		{ 'name': 'type', 'value': 'Type'  },
		{ 'name': 'category', 'value': 'Category'  },
		{ 'name': 'accountName', 'value': 'Account Name'  },
		{ 'name': 'accountSubType', 'value': 'Account Sub Type'  },
		{ 'name': 'territory', 'value': 'Territory'  },
		{ 'name': 'companyDomain', 'value': 'Company Domain'  },
		{ 'name': 'accountOwner', 'value': 'Account Owner'  },
		{ 'name': 'website', 'value': 'Website' },
		{ 'name': 'zipCode', 'value': 'Zip Code' },
	];
	contactFilterOptions = [
		{ 'name': 'contactStatus', 'value': 'Contact Status'  }
	];
	/***XNFR-908***/
	callIntegrationDropDownOptions = [
		{ 'name': 'Call Time(Desc)', 'value': 'desc' },
		{ 'name': 'Call Time(Asc)', 'value': 'asc' }
	];
	
	wordOptionsForOliver = [
		{ 'name': 'Short (under 100 words)', 'value': 'short' },
		{ 'name': 'Medium-short (101–500 words)', 'value': 'medium-short' },
		{ 'name': 'Medium (501–1000 words)', 'value': 'medium' },
		{ 'name': 'Medium-long (1000–2000 words)', 'value': 'medium-long' },
		{ 'name': 'Long (2000–3000+ words)', 'value': 'long' }
	];

	assetInteractionDropDownOptions = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'View Count(ASC)', 'value': 'viewCount-Asc' },
		{ 'name': 'View Count(DESC)', 'value': 'viewCount-Desc' },
		{ 'name': 'Download Count(ASC)', 'value': 'downloadCount-Asc' },
		{ 'name': 'Download Count(DESC)', 'value': 'downloadCount-Desc' }
	];
	playbookInteractionDropDownOptions = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'View Count(ASC)', 'value': 'viewCount-Asc' },
		{ 'name': 'View Count(DESC)', 'value': 'viewCount-Desc' },
		{ 'name': 'Completed Count(ASC)', 'value': 'completedCount-Asc' },
		{ 'name': 'Completed Count(DESC)', 'value': 'completedCount-Desc' }
	];
	playbookDetailsInteractionDropDownOptions = [
		{ 'name': 'Sort By', 'value': '' },
		{ 'name': 'Progress(ASC)', 'value': 'progress-Asc' },
		{ 'name': 'Progress(DESC)', 'value': 'progress-Desc' }
	];

	trackDetailsDropDownOptions = [
		{ 'name': 'Company Name (A-Z)', 'value': 'companyName-Asc' },
		{ 'name': 'Company Name (Z-A)', 'value': 'companyName-Desc' },
		{ 'name': 'View Count (ASC)', 'value': 'count-Asc' },
		{ 'name': 'View Count (DESC)', 'value': 'count-Desc' }
	];
	partnerTrackDetailsDropDownOptions = [	
		{ 'name': 'Progress(DESC)', 'value': 'progress-Desc' },
		{ 'name': 'Progress(ASC)', 'value': 'progress-Asc' },
		{ 'name': 'Partner Name (A-Z)', 'value': 'partnerName-Asc' },
		{ 'name': 'Partner Name (Z-A)', 'value': 'partnerName-Desc' },
		{ 'name': 'Email ID(A-Z)', 'value': 'emailId-Asc' },
		{ 'name': 'Email ID(Z-A)', 'value': 'emailId-Desc' }
	];
	sendWelcomeMailOptions = [	
		{ 'name': 'Sent On (DESC)', 'value': 'sentOn-Desc' },
		{ 'name': 'Sent On (ASC)', 'value': 'sentOn-Asc' }
	];
	public selectedSortedOption: any = this.sortByDropDown[0];
	public defaultSortOption: any = this.partnerCampaignDetailsSortDropDown[0];
	public dealsPartnerSortOption: any = this.dealPartnersSortDropDown[0];
	public leadPartnerSortOption: any = this.leadPartnersSortDropDown[0];
	public leadsSortOption: any = this.leadsSortDropDown[0];
	public dealCampaignSortOption: any = this.dealCampaignsSortDropDown[0];
	public leadCampaignSortOption: any = this.leadCampaignsSortDropDown[0];
	public campaignPartnersRemoveAccessDefaultSortOption: any = this.campaignPartnersRemoveAccessSortDropDown[0];
	public formsSortOption: any = this.manageFormsSortOptions[0];
	public previewFormsSortOption: any = this.previewPopUpFormsSortOptions[0];
	public partnerLandingPageSortOption: any = this.partnerLandingPageSortOptions[0];
	public marketPlaceCategoriesSortOption: any = this.marketPlaceCategoriesSortOptions[0];
	public selectedDemoRequestSortOption:  any = this.demoRequestSortOptions[7];
	public selectedCategoryDropDownOption: any = this.categorySortDropDownOptions[0];
	public selectedShareCampaignDropDownOption: any = this.shareCampaignSortDropDownOptions[3];
	public selectedActiveUsersSortOption: any = this.activeUsersSortDropDownOptions[4];//This is used in multiple places.Be careful while changing it dude.
	public selectedDamPartnerDropDownOption: any = this.partnerCompaniesDropDownOptions[this.partnerCompaniesDropDownOptions.length - 1];
	public mdfPartnersSortOption: any = this.mdfPartnersSortDropDownOptions[9];
	public publishedPartnerAnalyticsSortOption: any = this.publishedPartnerAnalyticsDropDown[4];
	public mdfVendorsSortOption: any = this.mdfVendorsSortDropDownOptions[5];
	public vanityEmailTemplates = this.emailTemplatesDropDown[0]; 
	public userLevelCampaignAnalyticsSortOption: any = this.userLevelCampaignAnalyticsSortDropDownOptions[this.userLevelCampaignAnalyticsSortDropDownOptions.length - 1];
	public damSortOption: any = this.damSortDropDownOptions[this.damSortDropDownOptions.length-1];
	public publishedDamSortOption: any = this.publishedDamSortDropDownOptions[this.publishedDamSortDropDownOptions.length - 1];
	public templateDownloadPartnerSortOption: any = this.templateDownloadSortDropDown[0];
	public itemsSize: any = this.numberOfItemsPerPage[0];
	isListView: boolean = false;
	selectedCampaignTypeIndex:number = 0;
	public selectedTagDropDownOption: any = this.tagSortDropDownOptions[3];
	public selectedGroupsDropDownOption: any = this.groupsSortDropDownOptions[0];
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

	/**XNFR-553**/
	emailActivityDropDownOption = this.emailActivityDropDownOptions[this.emailActivityDropDownOptions.length-1];

	/***XNFR-679***/
	public selectedCustomFieldsSortDropDownOption: any = this.customFieldsDropDownOptions[this.customFieldsDropDownOptions.length-1];

	/**XNFR-735**/
	activityDropDownOption = this.activityDropDownOptions[0];
  
	/** XNFR-745 **/
	public groupedAssetsForPlaybook: any = this.groupedAssetsForPlaybookDropDown[0].value;

	/**XNFR-757**/
	public taskActivityTypeDropDownOption = this.taskActivityTypeDropDown[this.taskActivityTypeDropDown.length-1];

	public taskActivityPriorityDropDownOption = this.taskActivityPriorityDropDown[this.taskActivityPriorityDropDown.length-1];

	taskActivityDropDownOption = this.taskActivityDropDownOptions[this.taskActivityDropDownOptions.length-1];

	noteActivityDropDownOption = this.noteActivityDropDownOptions[this.noteActivityDropDownOptions.length-1];

	/***XNFR-662****/
    public selectedCustomFieldsDropDownOption = this.customFieldsDropDown[0];

	public selectedSortedOptionForPartnerJourney = this.sortByDropDownForPartnerJourney[0];

	public selectedSortedOptionForDeactivatedPartnerJourney = this.sortByDropDownForDeactivatedPartnerJourney[0];

	/**XNFR-783**/
	public calendlyDropDownOption = this.calendlyDropDownOptions[0].value;

	/**XNFR-834**/
	public approvalHubSortOption: any = this.approvalHubSortDropDownOptions[this.approvalHubSortDropDownOptions.length - 1];

	/*** XNFR-850 ***/
	public teamMemberAnalyticsSortOptions: any = this.inviteTeamMemberAnalyticsDropDownOptions[this.inviteTeamMemberAnalyticsDropDownOptions.length - 1];

	/*** XNFR-1108 ***/
	public partnerAnalyticsSortOption = this.dormantDropDownOptions[0];

	public incompleteCompanyProfileSortOption = this.incompleteCompanyProfileSortOptions[0];

	public approvePartnerSortOption = this.approvePartnerSortOptions[0];
	/**XNFR-867**/
	public userListLevelCampaignAnalyticsSortOption: any = this.userListLevelCampaignAnalyticsSortDropDownOptions[this.userListLevelCampaignAnalyticsSortDropDownOptions.length - 1];

	public campaignMdfEmailsHistorySortOption: any = this.campaignMdfEmailsHistoryDropDownOptions[this.campaignMdfEmailsHistoryDropDownOptions.length - 1];

	public teamMember = this.teamMemberDropDowns[0]; 

	public activepartnerJourney = this.activePartnerJourneyDropDowns[0];


	/**XNFR-908**/
	public callIntegrationDropDownOption = this.callIntegrationDropDownOptions[0].value;

	selectWordDropDownForOliver = this.wordOptionsForOliver[0];

	selectedOption = this.assetInteractionDropDownOptions[0];

	selectedOptionForPlaybookInteraction = this.playbookInteractionDropDownOptions[0];

	selectedOptionForPlaybookDetails = this.playbookDetailsInteractionDropDownOptions[0];

	selectedSortOptionForTracks = this.trackDetailsDropDownOptions[0];

	selectedSortOptionForPartnerTrackDetails = this.partnerTrackDetailsDropDownOptions[0];

	sendWelcomeMailSortOptions = this.sendWelcomeMailOptions[0];

}
