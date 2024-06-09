import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { Criteria } from '../../contacts/models/criteria';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum';
export class Pagination {
    
	pageIndex = 1;
	maxResults = 12;    
	sortcolumn: string = null;
	sortingOrder: string = null;
	searchKey: string = "";
	filterBy: any = null;
	pager: any = {};
	pagedItems: any[] = [];
	campaignUserListIds:number[] = [];
	totalRecords: number=0;
	editCampaign = false;
	campaignId: number;
	campaignDefaultTemplate = false;
	emailTemplateType: EmailTemplateType = EmailTemplateType.NONE;
	campaignType:string = "NONE";
	isLoading = false;
	videoCategoryId = 0;
	isEmailTemplateSearchedFromCampaign = false;
	filterKey: string = null;
	filterValue: any = null;
	criterias: Criteria[] = null;
	coBrandedEmailTemplateSearch = false;
	companyId:number = 0;
	userId:number = 0;
	throughPartnerAnalytics:boolean = false;
	reDistributedPartnerAnalytics:boolean= false;
	throughPartner:boolean = false;
	isListView:boolean = false;
	dealStatus:string = null;
	showDraftContent=false;
	campaignForm = false;
	landingPageCampaignForm = false;
	landingPageId = 0;
	landingPageForm = false;
	landingPageAlias:string = "";
	partnerLandingPageForm = false;
	formId = 0;
	loader:HttpRequestLoader = new HttpRequestLoader();
	publicEventLeads = false;
	totalLeads = false;
	addingMoreLists = false;
	partnerId:number=0;
	eventCampaign = false;
	totalAttendees = false;
	totalPartnerLeads = false;
	checkInLeads = false;
	userListId:number = 0;
	partnerOrContactEmailId = "";
	teamMemberAnalytics = false;
	teamMemberId:number = 0;

    categoryType: string;
	categoryId: number=0;
	categoryIds:number[] = [];
	categoryFilter = false;
	partnerCompanyId:number = 0;
	selectedPartnerCompanyIds: any[] = [];
	previewAccess = false;
	partnerView = false;
	selectedPartnerLeads = false;
	loggedInAsTeamMember = false;
	vanityUrlFilter:boolean = false;
	vendorCompanyProfileName:string;
	vendorCompanyId:number = 0;
	collectionId:number = 0;
	feedId = 0;
	partnershipId = 0;
	pipelineType = "LEAD";

	redistributingCampaign : boolean = false;
	parentCampaignId:number = 0;
	sharedLeads : boolean = false;
	learningTrackId: number = 0;
	lmsType:string = TracksPlayBookType[TracksPlayBookType.TRACK];
	type:string = "";
	channelCampaign = false;
	page : number = 0;
	excludeBeePdf : boolean = false;

	surveyCampaignForm = false;
	partnerTeamMemberGroupFilter = false;
	callPaginationComponent = false;

	fromDateFilterString:string = "";
	toDateFilterString:string = "";
	forCampaignAnalytics = false;

	archived = false;
	timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  	stageFilter:string = "";
	companyNameFilter:string = "";
	oneClickLaunch = false;
	previewSelectedSharedLeads = false;
	headerCheckBoxChecked = false;
	loginAsUserId = 0;
	//XNFR-316
	trackTypeFilter: any = "";
	assetTypeFilter: any = "";
	campaignTypeFilter: any = "";
	/** user guides ***/
	moduleName:string = "";
	slug:string = "";
    searchWithModuleName: boolean = false;
	guideTitle:string = "";
	/** User Guide ***/
	selectedEmailTempalteId = 0;
	selectedVideoId = 0;
	partnerJourneyFilter = false;
	detailedAnalytics = false;
	/***XNFR-409 *****/
    filterOptionEnable:boolean = false;
	dateFilterOpionEnable:boolean = false;
	customFilterOption:boolean = false;
	/*** XNFR-409 *****/

	userType:string = "";
	/*** XNFR-427 *****/
	ignoreSelfLeadsOrDeals:boolean = true;
	source:string;
	defaultLandingPage:boolean;
	showLeadsForAttachingLead:boolean = false; /*** XNFR-476 ***/
	campaignViewType : string = "";
	/*** XNFR-504 ***/
	selectedVendorCompanyIds: any[] = [];
	selectedTeamMemberIds: any[] = [];
	id = 0;
	registeredByCompanyId = 0;
	registeredByUserId = 0;
}
