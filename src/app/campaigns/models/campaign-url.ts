import { Pagination } from '../../core/models/pagination';
import { EmailTemplate } from '../../email-template/models/email-template';
export class Url{
    id:number;
    replyInDays:number=0;
    replyTime:Date=new Date();
    subject:string;
    body:string;
    url:string;
    divId:string;
    scheduled:boolean=false;
    replyInDaysSum:number;
    emailTemplatesPagination:Pagination = new Pagination();
    selectedEmailTemplateId:number = 0;
    selectedEmailTemplateIdForEdit:number = 0;
    selectedEmailTemplateTypeIndex:number = 0;
    emailTemplateSearchInput:string = "";
    emailTemplate:EmailTemplate = new EmailTemplate();
    showSelectedEmailTemplate:boolean  = false;
    defaultTemplate:boolean = false;
    replyTimeInHoursAndMinutes:string = "";
    actionId:number = 0;
    statusInString = 'ACTIVE';
    loader = false;
     /***XNFR-330****/
     htmlBody="";
     jsonBody="";
     customEmailTemplateId = 0;
     /***XNFR-330****/

}