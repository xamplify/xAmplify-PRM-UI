import { Form } from '../../forms/models/form';
import { Tag } from '../../dashboard/models/tag';

export class LearningTrack {
    id:number;
    title:string;
    description:string;
    slug:string
    userId:number;
    featuredImage:string;
    published:boolean;
    quizId:number;
    contentIds:Array<number> = new Array<number>();
    groupIds:Array<number> = new Array<number>();
    companyIds:Array<number> = new Array<number>();
    partnershipIds:Array<number> = new Array<number>();
    tagIds:Array<number> = new Array<number>();
    categoryId:number;
    isValid:boolean = false;
    isSlugValid:boolean;

    quiz:Form;
    contents:Array<any> = new Array<any>();
    companies:Array<any> = new Array<any>();
    groups:Array<any> = new Array<any>();
    tags:Array<Tag> = new Array<Tag>();
    category:any;

}
