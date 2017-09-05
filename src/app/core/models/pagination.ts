import { EmailTemplateType } from '../../email-template/models/email-template-type';
export class Pagination {
	    pageIndex: number = 1 ;
		maxResults :number=10;
		sortcolumn :string=null;
		sortingOrder :string=null;
		searchKey:string=null;
		filterBy:any =null;
		pager: any = {};
		pagedItems: any[]=[];
		totalRecords:number;
		editCampaign:boolean=false;
        campaignId:number;
        campaignDefaultTemplate:boolean=false;
        emailTemplateType:EmailTemplateType=EmailTemplateType.NONE;
        isLoading:boolean = false;
        videoCategoryId:number = 0;

}
