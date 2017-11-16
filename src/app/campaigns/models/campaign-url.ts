import { Pagination } from '../../core/models/pagination';
export class Url{
    id:number;
    replyInDays:number;
    replyTime:Date;
    subject:string;
    body:string;
    url:string;
    divId:string;
    scheduled:boolean;
    replyInDaysSum:number;
    emailTemplatePageIndex:number = 0;
    emailTemplatesPagination:Pagination = new Pagination();
}