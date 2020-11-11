import { DealAnswer } from "app/deal-registration/models/deal-answers";
import { DealDynamicProperties } from "app/deal-registration/models/deal-dynamic-properties";

export class Deal {
    id: number;
    title: string;
    amount: any;
    closeDate: any;
    closeDateUTC: any;
    dealType: string;
    campaignId: number;
    campaignName: string;
    parentCampaignId: number;
    parentCampaignName: string;
    createdForCompanyId: number;  
    pipelineId: number;         
    pipelineStageId: number;
    canUpdate:boolean;
    canDelete:boolean;    
    userId:number;
    associatedUserId: number;
    associatedLeadId: number;
    closeDateString: string; 
    properties: DealDynamicProperties[];
    answers: DealAnswer[];
}
