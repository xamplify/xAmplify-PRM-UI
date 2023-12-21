import { Status } from '../../team/models/status.enum';
export class TeamMember{
  
    id:number;
    emailId:string;
    firstName:string;
    lastName:string;
    contact:boolean = false;
    emailTemplate:boolean = false;
    form:boolean = false;
    landingPage:boolean = false;
    campaign:boolean = false;
    design:boolean = false;
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
    secondOrgAdmin = false;
    loggedInUserId:number;
    vanityUrlFilter = false;
    vanityUrlDomainName:string;
    emailIdErrorMessage = "";
    teamMemberGroupId = 0;
    enableOption = false;
    validEmailId = false;
    validTeamMemberGroupId = false;
    validForm = false;
    secondAdmin = false;
    userId  = 0;
    teamMemberGroupName = "";
    partnersCount = 0;
    teamMemberGroupPartnersCount = 0;



    validFirstName=false;
    lastNameErrorMessage="";





}