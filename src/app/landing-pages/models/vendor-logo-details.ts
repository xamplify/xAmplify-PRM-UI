export class VendorLogoDetails {
 
	companyId:number;
	companyName:string;
	companyLogo:string;
	selected:boolean;
    vendorJourneyAlias:string;
	partnerId:number;
	landingPageId:number;
	firstName:string;
	lastName:string;
	emailId:string
	teamMembers:LogoTeamMembers[] = [];
	expand:boolean = false;
	vendorJourneyId:number;
}

export class LogoTeamMembers{
	partnerId:number;
	vendorJourneyAlias:string;
	selected:boolean = false;
	landingPageId:number;
	firstName:string;
	lastName:string;
	emailId:string
	vendorJourneyId:number;

}