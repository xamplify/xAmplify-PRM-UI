import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { Criteria } from '../../contacts/models/criteria';

export class Pagination {
	pageIndex = 1;
	maxResults = 12;
	sortcolumn: string = null;
	sortingOrder: string = null;
	searchKey: string = null;
	filterBy: any = null;
	pager: any = {};
	pagedItems: any[] = [];
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

}
