import { DealQuestions } from "./deal-questions";

export class DealForms {
    
   
    id:number;
    isDefault: boolean;
    isFactory: boolean;
    name: string;

    campaignDealQuestionDTOs: DealQuestions[];
    createdAt: Date;
    createdBy: number;
    updatedAt: Date
    updatedBy: number;
      
}
