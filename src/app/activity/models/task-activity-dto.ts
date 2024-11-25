export class TaskActivity {
    name:string;
    description:string;
    taskType:string;
    priority:string;
    assignedTo:number = 0;
    dueDate:any;
    status:string;
    userId:number;
    loggedInUserId:number;
}