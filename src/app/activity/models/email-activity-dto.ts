export class EmailActivity {
    loggedInUserId:number;
    userId:number;
    subject:string;
    body:string;
    toEmailId:string;
    senderEmailId:string;
    contactId:number;
    ccEmailIds = [];
    bccEmailIds = [];
    attachments:any;
    ccEmailIdsString:any;
    bccEmailIdsString:any;
    emailAttachmentDTOs = [];
    userIds = [];
    isCompanyJourney:boolean;
    fullName:any;
    addedForEmailId:any;
}