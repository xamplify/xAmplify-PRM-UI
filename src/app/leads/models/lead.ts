import { SfCustomFieldsDataDTO } from "app/deal-registration/models/sfcustomfieldsdata";

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
    leadApprovalStatusType: any;
    leadApprovalOrRejection:any;
    approvalStatusComment:any;
    leadComment:any;
    selfLead:boolean;
    /*** XNFR-505 ***/
    enableRegisterDealButton:boolean = false;
    associatedCampaignDeleted:boolean = false;
    /***XNFR-521***/
    createdByPipelineId: number;         
    createdByPipelineStageId: number;
    createdForPipelineId: number;         
    createdForPipelineStageId: number;
    halopsaTicketTypeId: any;
    title :string;
    industry : string = 'Select Industry';
    region : string = 'Select Region';
    /***XNFR-615***/
    sfCustomFieldsDataDto: Array<SfCustomFieldsDataDTO> = new Array<SfCustomFieldsDataDTO>();
    showRegisterDeal:boolean;
}
