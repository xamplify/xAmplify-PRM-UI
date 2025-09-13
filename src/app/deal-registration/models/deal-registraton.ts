import { DealDynamicProperties } from "./deal-dynamic-properties";
import { DealAnswer } from "./deal-answers";
import { SfCustomFieldsDataDTO } from "./sfcustomfieldsdata";

export class DealRegistration{
  id:number; 
  createdBy:number; 
  leadId:number;
  campaignId:number;
  company: string;
  website: string;
  firstName:string;
  lastName: string;
  title: string;
  role:string;
  email: string;
  phone: string;
  opportunityCapacity: number;
  dealType: any;
  leadStreet: string;
  leadCity: string;
  leadState: string; 
  postalCode:any;
  isDeal:boolean;
  leadCountry = 'Select Country';
  opportunityAmount:any;
  estimatedCloseDate: any;
  estimatedClosedDateString:string;
  properties:DealDynamicProperties[];
  answers:DealAnswer[];
  parentCampaignId:number;
  //pushToMarketo=true;


  // Sf Custom Form Fields
   description: string;
   stage:string;
   probability:string;
   nextStep:string;
   leadSource:string;
   deliveryInstallationStatus:string;
   trackingNumber:string;
   orderNumber:string;
   currentGenerator:string;
   mainCompetitor:string;
   sfCustomFieldsDataDto: Array<SfCustomFieldsDataDTO> = new Array<SfCustomFieldsDataDTO>();
}
