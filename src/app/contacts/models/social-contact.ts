import { ListView } from "../models/list-view";
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
    contacts: Set<SocialContact>;
    id:number;
    checked:boolean=true;
}