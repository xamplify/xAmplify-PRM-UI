export class EmailRequestDto {

    from:string;

	toEmailIds=[];

	subject:string;

    threadId:string

    bodyHtml:string;

	messageId:string;

	cc= [];

	bcc= [];

	type:string;
	
	accessToken:string;
}
