export class Lead {
    id: number;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    website: string;
    street: string;
    city: string;
    state: string;
    country = 'Select Country';
    postalCode: any;
    campaignId: number;
    campaignName: string;
    parentCampaignId: number;
    parentCampaignName: string;
    pipelineStageId: number;
    canUpdate:boolean;
    canDelete:boolean;  
    canRegisterDeal:boolean;  
    userId:number;
    preview = false;
    createdForCompanyId: number;
    pipelineId: number;  
    associatedUserId: number;
    associatedDealId: number;
    unReadChatCount: any;
    currentStagePrivate = false;
    /******XNFR-426******/
    leadApproveRejectType: any;
    leadApprovalOrRejection:any;
    leadNotes:any;
    leadComment:any;
}
