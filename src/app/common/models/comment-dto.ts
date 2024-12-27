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
	assetName: string = "";
	assetCreatedByFullName: string;
}