import { DealDynamicProperties } from "./deal-dynamic-properties";
import { DealAnswer } from "./deal-answers";

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

}
