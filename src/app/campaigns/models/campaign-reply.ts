import { Pagination } from '../../core/models/pagination';
import { EmailTemplate } from '../../email-template/models/email-template';
export class Reply{
    id:number;
    replyInDays:number;
    replyTime:Date;
    subject:string;
    actionId:number;
    divId:string;
    emailAction:any;
    scheduled:boolean;
    replyInDaysSum:number;
    emailTemplatesPagination:Pagination = new Pagination();
    selectedEmailTemplateId:number = 0;
    selectedEmailTemplateIdForEdit:number = 0;
    selectedEmailTemplateTypeIndex:number = 0;
    emailTemplateSearchInput:string = "";
    emailTemplate:EmailTemplate = new EmailTemplate();
    showSelectedEmailTemplate:boolean  = false;
    defaultTemplate:boolean = false;
}