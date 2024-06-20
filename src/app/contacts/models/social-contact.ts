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
    isPartnerUserList: boolean;
    //MARKETO VARIABLES
    listName:string;
    email:string;
    country:string;
    city: string;
    state: string;
    region: string;
    postalCode: number;
    address: string;
    company: string;
    mobileNumber: string;
    mobilePhone: string;
    title:string;
    website:string;
    userId:number;
    type:string;
    externalListId:number;
    isShowDetails = false;
    publicList=false;
    contactCompany:string;
    contactListId : number;
    moduleName : string="";
    accountName : string="";
	accountSubType : string="";
	territory : string="";
	companyDomain : string="";
	accountOwner : string="";
    
}