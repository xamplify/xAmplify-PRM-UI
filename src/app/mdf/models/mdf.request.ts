import { FormSubmit } from "app/forms/models/form-submit";

export class MdfRequest{
    id:number;
    userId:number;
    companyProfileName:string;
    formSubmitId:number;
    allocationAmount:any;
    allocationDate:Date;
    allocationExpirationDate:Date;
    reimburseAmount:any;    
    formSubmitDto:FormSubmit;
    statusInString:string;
    createdDate:string;
    mdfRequestTitle:string;
    mdfRequestAmount:any;
    partnerCompany: string;
    partnerContact:string;
    eventDate:string;
    requestedAmount:any;
    requestedAmountInDouble:any;
    allocationDateInString:string;
    allocationExpirationDateInString:string;
    assignedTo:string;
    statusCode:number = 0;
}