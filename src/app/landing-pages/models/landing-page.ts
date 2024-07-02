import{LandingPageType} from './landing-page-type.enum';
import { VendorLogoDetails } from './vendor-logo-details';
export class LandingPage {
    id:number;
    name:string;
    seoName:string;
    thumbnailPath:string;
    description:string;
    jsonBody:string;
    htmlBody:string;
    userId:number;
    alias:string;
    imageName:string;
    analyticsCount:number;
    createdUser:string;
    createdDateInString:string;
    coBranded:boolean;
    partnerId:number;
    showPartnerCompanyLogo:boolean=false;
    showYourPartnersLogo:boolean = false;
    partnerLandingPage = false;
    type:LandingPageType;
    categoryId:number = 0;
    companyProfileName: string="";
    aliasUrl = "";
    openLinksInNewTab = false;
    /*XNFR-432*/
    vanityUrlFilter = false;
    copyPage = false;
    /*XNFR-432*/
    partnerLandingPageId = 0;
    sourceInString:string;
    /*XNFR-428*/
    vendorJourneyId = 0;
    hasVendorJourney:boolean = false;
    vendorLogoDetails :VendorLogoDetails[];
    /*XNFR-583*/
    previousLandingPageId = 0;
}
