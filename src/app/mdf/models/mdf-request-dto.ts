export class MdfRequestDto {
	
	id:number;
	title:string = "";
	allocationAmount:any;
	allocationDateInString:string="";
	allocationExpirationDateInString:string = "";
	createdBy:number=0;
	description:string = "";
	eventDateInString = "";
	mdfWorkFlowStepTypeInString:string = "";
	reimbursementAmount:any;
	requestAmount:any;
	requestCreatedDateInString:string = "";
	statusInInteger:number = 0;
	loggedInUserId:number = 0;
}
