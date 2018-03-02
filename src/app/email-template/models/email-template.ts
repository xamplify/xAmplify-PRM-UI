import { User } from '../../core/models/user';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
export class EmailTemplate {
		id:number;
		name:string;
		subject:string; 
		body:string;
		desc:string;
		langId:number;
		userDefined:boolean;
		defaultTemplate:boolean;
		regularTemplate:boolean;
		videoTemplate:boolean;
		beeRegularTemplate:boolean;
		beeVideoTemplate:boolean;
		user:User;
		jsonBody:string;
        type:EmailTemplateType;
        regularCoBrandingTemplate:boolean;
        videoCoBrandingTemplate:boolean;
}
