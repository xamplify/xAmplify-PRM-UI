import { Pagination } from '../../core/models/pagination';
import { EmailTemplate } from '../../email-template/models/email-template';
export class Reply{
    id:number;
    replyInDays:number=0;
    replyTime:Date=new Date();
    subject:string;
    body:string = "";
    actionId:number;
    divId:string;
    emailAction:any;
    scheduled:boolean;
    replyInDaysSum:number=0;
    emailTemplatesPagination:Pagination = new Pagination();
    selectedEmailTemplateId:number = 0;
    selectedEmailTemplateIdForEdit:number = 0;
    selectedEmailTemplateTypeIndex:number = 0;
    emailTemplateSearchInput:string;
    emailTemplate:EmailTemplate = new EmailTemplate();
    showSelectedEmailTemplate:boolean  = false;
    defaultTemplate:boolean = false;
    replyTimeInHoursAndMinutes:string = "";
    statusInString = 'ACTIVE';
    loader = false;
    /***XNFR-330****/
    htmlBody="";
    jsonBody="";
    customEmailTemplateId = 0;
    /***XNFR-330****/
}