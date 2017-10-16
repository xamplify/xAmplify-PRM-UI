import { ListView } from "../models/list-view";
import { Contacts } from "../models/contacts";
export class SocialContact{
    firstName: string;
    lastName: string;
    emailId: string;
    contactName: string;
    socialNetwork: string;
    showLogin: boolean;
    jsonData: string;
    statusCode: number;
    contactType: string;
    alias: string;
    Listview : ListView[];
    contacts: SocialContact[];
    id:number;
    checked:boolean=true;
}