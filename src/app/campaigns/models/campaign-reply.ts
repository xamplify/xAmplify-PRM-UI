import { Pagination } from '../../core/models/pagination';
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
    emailTemplatePageIndex:number = 0;
    emailTemplatesPagination:Pagination = new Pagination();

}