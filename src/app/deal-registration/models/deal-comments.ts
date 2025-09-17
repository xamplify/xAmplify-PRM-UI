import { User } from "../../core/models/user";

export class DealComments {    
     id:number;
     dealId:number;
     leadId:number;
     propertyId:number;
     userName="";
     comment:string;
     isReply:boolean;
     parentId:number;
     user:User
     createdAt:Date;
     userId:number;
     commentedByEmail: string;
	commentedByFullName: string;
	commentedByImage = "assets/images/icon-user-default.png";     
     activityType:any;
}
