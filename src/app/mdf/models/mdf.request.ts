import { FormSubmit } from "app/forms/models/form-submit";

export class MdfRequest{
    id:number;
    userId:number;
    companyProfileName:String;
    formSubmitId:number;
    allocationAmount:number;
    allocationDate:Date;
    allocationExpirationDate:Date;
    reimburseAmount:number;    
    formSubmitDto:FormSubmit;
    statusInString:String;
    createdDate:String;
    mdfRequestTitle:String;
    mdfRequestAmount:number;
    partnerCompany: String;
    partnerContact:String;
    eventDate:String;
}