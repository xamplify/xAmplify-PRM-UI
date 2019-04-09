import { Status } from '../../team/models/status.enum';
export class TeamMember{
  
    id:number;
    emailId:string;
    firstName:string;
    lastName:string;
    contact:boolean = false;
    emailTemplate:boolean = false;
    campaign:boolean = false;
    video:boolean = false;
    stats:boolean = false;
    socialShare:boolean = false;
    partners:boolean = false;
    opportunity:boolean=false;
    all:boolean = false;
    teamMemberId:number;
    allSelected:boolean =false;
    orgAdmin:boolean = false;
    status:Status;
    enabled:boolean = true;
    orgAdminId:number;
}