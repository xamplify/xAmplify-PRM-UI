import{LandingPageType} from './landing-page-type.enum';
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

}
