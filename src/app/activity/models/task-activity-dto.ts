export class TaskActivity {
    name:string;
    description:string;
    taskType:string;
    priority:string;
    assignedTo:number = 0;
    dueDate:any;
    status:number = 0;
    userId:number;
    loggedInUserId:number;
    statusName:string;
    assignedToName:string;
    remainder:any;
    createdTime:any;
    remainderType:any = '';
    taskAttachmentDTOs:any;
    assignedToEmailId:any;
}