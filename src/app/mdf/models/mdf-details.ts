import {MdfAmountType} from './mdf-amount-type.enum';
export class MdfDetails {
    mdfAmount:any;
    allocationDate:Date;
    expirationDate:Date;
    allocationDateInString:string;
    expirationDateInString:string;
    calculatedAvailableBalance:any;
    partnershipId:number;
    description:string = "";
    mdfAmountTypeInString = "";
    createdBy:number=0;
}
