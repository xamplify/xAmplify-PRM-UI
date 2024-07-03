import { Form } from '../../forms/models/form';
import { Tag } from '../../dashboard/models/tag';
import { ActivityType } from '../models/activity-type.enum';
import { TracksPlayBookType } from '../models/tracks-play-book-type.enum'

export class TracksPlayBook {
    id:number;
    title:string;
    description:string;
    slug:string
    userId:number;
    featuredImage:string;
    published:boolean = false;
    quizId:number;
    contentIds:Array<number> = new Array<number>();
    contentAndQuizData = {};
    groupIds:Array<number> = new Array<number>();
    companyIds:Array<number> = new Array<number>();
    partnershipIds:Array<number> = new Array<number>();
    userIds:Array<number> = new Array<number>();
    tagIds:Array<number> = new Array<number>();
    categoryId:number;
    isValid:boolean = false;
    isSlugValid:boolean;
    removeFeaturedImage:boolean = false;
    followAssetSequence:boolean = false;
    contentId:number;
    status:ActivityType;
    createdByCompanyId:number;
    type:string = TracksPlayBookType[TracksPlayBookType.TRACK];
    partnershipId:number;
    
    quiz:Form;
    contents:Array<any> = new Array<any>();
    tags:Array<Tag> = new Array<Tag>();
    category:any;
    canUpdate:boolean = false;
    canDelete:boolean = false;

    typeQuizId: boolean = false;
    companyProfileName = "";
    learningTrackContentMappingId = 0;
    /***XNFR-523*****/
    trackUpdatedEmailNotification = false;
    addedToQuickLinks = false;
}
