export class CommentDto {
    id:number=0;
	comment:string = "";
	commentedBy:number = 0;
	invalidComment = true;
	moduleType = "";
	statusInString = "";
	loggedInUserId: number;
	damId: number;
	statusUpdated: boolean = false;
	createdBy: number;
	name: string = "";
	createdByName: string;
	entityId: number;
}