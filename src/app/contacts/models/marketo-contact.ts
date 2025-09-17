import { ListView } from "./list-view";
import { SocialContact } from "./social-contact";
export class MarketoContact{
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
    isPartnerUserList: boolean;
    country:string
    city: string
    state: string
    postalCode: number;
    address: string;
    company: string;
    mobilePhone: string;

}