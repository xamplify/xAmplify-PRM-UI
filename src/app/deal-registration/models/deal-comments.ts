import { User } from "../../core/models/user";

export class DealComments {
    
   
     id:number;
     propertyId:number;
     comment:string;
     isReply:boolean;
     parentId:number;
     user:User
     createdAt:Date;
     
}
