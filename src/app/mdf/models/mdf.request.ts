import { FormSubmit } from "app/forms/models/form-submit";

export class MdfRequest{
    id:number;
    userId:number;
    companyProfileName:string;
    formSubmitId:number;
    allocationAmount:number;
    allocationDate:Date;
    allocationExpirationDate:Date;
    reimburseAmount:number;    
    formSubmitDto:FormSubmit;
    statusInString:string;
    createdDate:string;
    mdfRequestTitle:string;
    mdfRequestAmount:number;
    partnerCompany: string;
    partnerContact:string;
    eventDate:string;
}