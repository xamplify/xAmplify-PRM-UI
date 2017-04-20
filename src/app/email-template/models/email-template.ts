import { User } from '../../core/models/user';
export class EmailTemplate {
		id:number;
		name:string;
		subject:string; 
		body:string;
		desc:string;
		langId:string;
		userDefined:boolean;
		defaultTemplate:boolean;
		regularTemplate:boolean;
		videoTemplate:boolean;
		beeRegularTemplate:boolean;
		beeVideoTemplate:boolean;
		user:User;
		jsonBody:string;
}
