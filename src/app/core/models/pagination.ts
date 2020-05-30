import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { Criteria } from '../../contacts/models/criteria';
import { HttpRequestLoader } from '../../core/models/http-request-loader';

export class Pagination {
    
	pageIndex = 1;
	maxResults = 12;    
	sortcolumn: string = null;
	sortingOrder: string = null;
	searchKey: string = null;
	filterBy: any = null;
	pager: any = {};
	pagedItems: any[] = [];
	campaignUserListIds:number[] = [];
	totalRecords: number;
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
	previewAccess = false;
	partnerView = false;

	vanityUrlFilter:boolean = false;
	vendorCompanyProfileName:string;

}
